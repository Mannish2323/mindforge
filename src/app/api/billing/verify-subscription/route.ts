import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { PLANS, PlanId } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
      planId,
    } = (await req.json()) as {
      razorpay_payment_id: string;
      razorpay_subscription_id: string;
      razorpay_signature: string;
      planId: PlanId;
    };

    // ── 1. Validate inputs ───────────────────────────────────────────────────
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature || !planId) {
      return NextResponse.json(
        { error: 'Missing required subscription verification fields' },
        { status: 400 }
      );
    }

    const plan = PLANS[planId];
    if (!plan || plan.price === 0) {
      return NextResponse.json({ error: `Invalid or free plan: ${planId}` }, { status: 400 });
    }

    // ── 2. Verify Razorpay Subscription Signature ────────────────────────────
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 503 });
    }

    // Subscription signature string format: payment_id + '|' + subscription_id
    const bodyStr = `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(bodyStr).digest('hex');

    let sigValid = false;
    try {
      sigValid = crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(razorpay_signature, 'hex')
      );
    } catch {
      sigValid = false;
    }

    if (!sigValid) {
      console.error('[Billing] Invalid subscription verification signature');
      return NextResponse.json({ error: 'Subscription signature verification failed' }, { status: 400 });
    }

    // ── 3. Authenticate User from Bearer Token ───────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized — missing token' }, { status: 401 });
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

    // ── 4. Activate 1-Day Trial in Entitlements ──────────────────────────────
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // exactly 24 hours

    const { error: upsertErr } = await adminClient
      .from('entitlements')
      .upsert(
        {
          user_id: user.id,
          plan_id: planId,
          status: 'trial_active', // 1-Day trial active
          starts_at: now.toISOString(),
          trial_ends_at: trialEndsAt.toISOString(),
          ends_at: trialEndsAt.toISOString(), // premium access for trial duration
          next_billing_at: trialEndsAt.toISOString(),
          razorpay_payment_id,
          razorpay_subscription_id,
          hearts_limit: plan.heartsMax,
          ai_limit_daily: plan.aiChatsPerDay,
          lessons_limit_daily: plan.lessonsPerDay ?? 9999,
          ads_enabled: plan.adsEnabled,
          billing_period: plan.periodDays ? `${plan.periodDays}d` : null,
          ai_chats_used_today: 0,
          ai_chats_reset_at: now.toISOString().split('T')[0],
          cancel_at_period_end: false,
        },
        { onConflict: 'user_id' }
      );

    if (upsertErr) {
      console.error('[Billing] Failed to update trial entitlements:', upsertErr);
      return NextResponse.json({ error: 'Failed to activate trial access' }, { status: 500 });
    }

    // ── 5. Record in Subscriptions Table ─────────────────────────────────────
    await adminClient
      .from('subscriptions')
      .upsert(
        {
          user_id: user.id,
          razorpay_subscription_id,
          plan_id: planId,
          status: 'trial_active',
          trial_ends_at: trialEndsAt.toISOString(),
          current_period_start: now.toISOString(),
          current_period_end: trialEndsAt.toISOString(),
          cancel_at_period_end: false,
          updated_at: now.toISOString(),
        },
        { onConflict: 'razorpay_subscription_id' }
      );

    // ── 6. Log Mandate Authentication in Payment History ────────────────────
    await adminClient.from('payment_history').insert({
      user_id: user.id,
      plan_id: planId,
      amount: 0, // Mandate authorization transaction
      currency: 'INR',
      billing_period: plan.periodDays ? `${plan.periodDays}d` : null,
      razorpay_order_id: null,
      razorpay_payment_id,
      status: 'authenticated', // mandate authenticated
    });

    // ── 7. Activity Log ──────────────────────────────────────────────────────
    await adminClient.from('activity_logs').insert({
      user_id: user.id,
      action: 'trial_activated',
      metadata: {
        plan_id: planId,
        plan_name: plan.name,
        subscription_id: razorpay_subscription_id,
        payment_id: razorpay_payment_id,
        trial_ends_at: trialEndsAt.toISOString(),
        next_billing_at: trialEndsAt.toISOString(),
      },
    });

    return NextResponse.json({
      success: true,
      status: 'trial_active',
      planId,
      planName: plan.name,
      trialDuration: '24 Hours',
      trialEndsAt: trialEndsAt.toISOString(),
      nextBillingDate: trialEndsAt.toISOString(),
      recurringPrice: plan.price,
    });
  } catch (err: any) {
    console.error('[Billing] verify-subscription error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error verifying subscription' },
      { status: 500 }
    );
  }
}
