import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
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

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // ── 1. Fetch user's active subscription details ─────────────────────────
    const { data: ent } = await adminClient
      .from('entitlements')
      .select('status, plan_id, razorpay_subscription_id, ends_at, trial_ends_at')
      .eq('user_id', user.id)
      .single();

    if (!ent || ent.status === 'free' || ent.status === 'expired') {
      return NextResponse.json(
        { error: 'No active subscription or trial found to cancel' },
        { status: 400 }
      );
    }

    if (ent.status === 'cancelled') {
      return NextResponse.json(
        { message: 'Subscription is already cancelled. Access remains active until period ends.' },
        { status: 200 }
      );
    }

    // ── 2. Cancel on Razorpay API if subscription ID is present ─────────────
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (ent.razorpay_subscription_id && keyId && keySecret) {
      const basicAuth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

      try {
        const rzpCancelRes = await fetch(
          `https://api.razorpay.com/v1/subscriptions/${ent.razorpay_subscription_id}/cancel`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${basicAuth}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cancel_at_cycle_end: 1, // cancel at end of current paid cycle / trial
            }),
          }
        );

        if (!rzpCancelRes.ok) {
          const errData = await rzpCancelRes.json();
          console.warn('[Billing] Razorpay cancel API returned error (continuing local update):', errData);
        }
      } catch (rzpErr: any) {
        console.warn('[Billing] Razorpay network error during cancellation:', rzpErr.message);
      }
    }

    // ── 3. Update local database records ─────────────────────────────────────
    const now = new Date();

    const { error: updateErr } = await adminClient
      .from('entitlements')
      .update({
        status: 'cancelled',
        cancel_at_period_end: true,
      })
      .eq('user_id', user.id);

    if (updateErr) {
      console.error('[Billing] Failed to update entitlement status to cancelled:', updateErr);
      return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
    }

    if (ent.razorpay_subscription_id) {
      await adminClient
        .from('subscriptions')
        .update({
          status: 'cancelled',
          cancel_at_period_end: true,
          cancelled_at: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq('razorpay_subscription_id', ent.razorpay_subscription_id);
    }

    // ── 4. Audit Log ─────────────────────────────────────────────────────────
    await adminClient.from('activity_logs').insert({
      user_id: user.id,
      action: 'subscription_cancelled',
      metadata: {
        plan_id: ent.plan_id,
        subscription_id: ent.razorpay_subscription_id,
        ends_at: ent.ends_at,
        cancelled_at: now.toISOString(),
      },
    });

    const accessEndDate = ent.trial_ends_at || ent.ends_at;

    return NextResponse.json({
      success: true,
      status: 'cancelled',
      message: accessEndDate
        ? `Subscription cancelled. Your access remains active until ${new Date(accessEndDate).toLocaleDateString()}.`
        : 'Subscription successfully cancelled.',
      accessUntil: accessEndDate,
    });
  } catch (err: any) {
    console.error('[Billing] cancel-subscription API error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error while cancelling subscription' },
      { status: 500 }
    );
  }
}
