import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLANS, PlanId, calcTrialEndsAt } from '@/lib/plans';

// In-memory cache for Razorpay plan IDs created dynamically
const razorpayPlanCache: Record<string, string> = {};

export async function POST(req: NextRequest) {
  try {
    // ── 1. Authenticate user from bearer token ───────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized — missing auth token' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey);
    const {
      data: { user },
      error: authError,
    } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid or expired user session' }, { status: 401 });
    }

    // ── 2. Validate requested plan ──────────────────────────────────────────
    const { planId } = (await req.json()) as { planId: PlanId };
    const plan = PLANS[planId];

    if (!plan || plan.price === 0) {
      return NextResponse.json(
        { error: `Invalid plan "${planId}". Only paid plans have 1-day free trials.` },
        { status: 400 }
      );
    }

    // ── 3. Check Razorpay credentials ───────────────────────────────────────
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Razorpay keys not configured on server. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
        { status: 503 }
      );
    }

    const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // ── 4. Verify user does not already have an active paid subscription ────
    const { data: existingEnt } = await adminClient
      .from('entitlements')
      .select('status, trial_ends_at, ends_at, plan_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (
      existingEnt &&
      (existingEnt.status === 'active' || existingEnt.status === 'trial_active') &&
      existingEnt.ends_at &&
      new Date(existingEnt.ends_at) > new Date()
    ) {
      return NextResponse.json(
        {
          error: `You already have an active ${existingEnt.status === 'trial_active' ? 'trial' : 'subscription'} for the ${existingEnt.plan_id.toUpperCase()} plan.`,
        },
        { status: 409 }
      );
    }

    // ── 5. Get or create Razorpay Plan ID ───────────────────────────────────
    let rzpPlanId = razorpayPlanCache[planId];

    if (!rzpPlanId) {
      // Map period days to Razorpay period & interval
      let period: 'daily' | 'weekly' | 'monthly' = 'weekly';
      let interval = 1;

      if (plan.periodDays === 7) {
        period = 'weekly';
        interval = 1;
      } else if (plan.periodDays === 10) {
        period = 'daily';
        interval = 10;
      } else if (plan.periodDays === 15) {
        period = 'daily';
        interval = 15;
      } else if (plan.periodDays === 30) {
        period = 'monthly';
        interval = 1;
      } else {
        period = 'daily';
        interval = plan.periodDays || 7;
      }

      const planCreateRes = await fetch('https://api.razorpay.com/v1/plans', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          period,
          interval,
          item: {
            name: `MindForge ${plan.name} Plan`,
            amount: plan.pricePaise,
            currency: 'INR',
            description: `${plan.name} — ${plan.recurringDescription}`,
          },
          notes: {
            planId,
            trialDays: '1',
          },
        }),
      });

      if (!planCreateRes.ok) {
        const planErr = await planCreateRes.json();
        console.error('[Billing] Failed to create Razorpay Plan:', planErr);
        throw new Error(planErr.error?.description || 'Failed to create plan on payment gateway');
      }

      const createdPlan = await planCreateRes.json();
      rzpPlanId = createdPlan.id;
      razorpayPlanCache[planId] = rzpPlanId;
    }

    // ── 6. Create Razorpay Subscription with 1-Day Trial (start_at +24h) ────
    // 1-day trial = first recurring charge is scheduled exactly 24h from now.
    // Razorpay collects Autopay mandate token during checkout.
    const startAtTimestamp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // +24 hours
    const trialEndsDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const subscriptionCreateRes = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: rzpPlanId,
        total_count: 52, // up to 1 year of recurring cycles
        quantity: 1,
        start_at: startAtTimestamp,
        customer_notify: 1,
        notes: {
          userId: user.id,
          userEmail: user.email || '',
          planId: planId,
          isTrial: 'true',
          trialDuration: '1-day',
        },
      }),
    });

    if (!subscriptionCreateRes.ok) {
      const subErr = await subscriptionCreateRes.json();
      console.error('[Billing] Razorpay Subscription create error:', subErr);
      throw new Error(subErr.error?.description || 'Failed to initialize subscription with trial');
    }

    const subscription = await subscriptionCreateRes.json();

    // ── 7. Save pending subscription record in DB ────────────────────────────
    await adminClient.from('subscriptions').insert({
      user_id: user.id,
      razorpay_subscription_id: subscription.id,
      plan_id: planId,
      status: 'trial_pending',
      trial_ends_at: trialEndsDate.toISOString(),
      current_period_start: new Date().toISOString(),
      current_period_end: trialEndsDate.toISOString(),
    });

    // Update entitlements state to trial_pending (not active yet)
    await adminClient
      .from('entitlements')
      .update({
        razorpay_subscription_id: subscription.id,
        status: 'trial_pending',
        trial_ends_at: trialEndsDate.toISOString(),
      })
      .eq('user_id', user.id);

    return NextResponse.json({
      subscriptionId: subscription.id,
      key: keyId,
      amount: plan.pricePaise,
      currency: 'INR',
      planId: plan.id,
      planName: plan.name,
      periodLabel: plan.periodLabel,
      trialDays: 1,
      trialEndsAt: trialEndsDate.toISOString(),
      nextBillingDate: trialEndsDate.toISOString(),
      recurringPrice: plan.price,
      recurringDescription: plan.recurringDescription,
    });
  } catch (err: any) {
    console.error('[Billing] create-subscription error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error while creating subscription' },
      { status: 500 }
    );
  }
}
