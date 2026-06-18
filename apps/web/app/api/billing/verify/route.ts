import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ── Per-plan limits applied after a successful purchase ───────────────────────
const PLAN_LIMITS: Record<string, {
  status: string;
  hearts_limit: number;
  ai_limit_daily: number;
  lessons_limit_daily: number;
  ads_enabled: boolean;
}> = {
  starter:    { status: 'starter', hearts_limit: 75,  ai_limit_daily: 15,  lessons_limit_daily: 15,  ads_enabled: true  },
  plus:       { status: 'plus',    hearts_limit: 90,  ai_limit_daily: 30,  lessons_limit_daily: 30,  ads_enabled: true  },
  pro:        { status: 'pro',     hearts_limit: 100, ai_limit_daily: 99,  lessons_limit_daily: 99,  ads_enabled: false },
  pro_yearly: { status: 'yearly',  hearts_limit: 100, ai_limit_daily: 99,  lessons_limit_daily: 99,  ads_enabled: false },
};

export async function POST(req: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = await req.json();

    // ── Step 1: Validate inputs ──────────────────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!PLAN_LIMITS[planId]) {
      return NextResponse.json({ error: `Unknown plan: ${planId}` }, { status: 400 });
    }

    // ── Step 2: Verify Razorpay HMAC signature ──────────────────────────────
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay secret not configured' }, { status: 503 });
    }

    const bodyStr  = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(bodyStr).digest('hex');

    const sigValid = crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(razorpay_signature, 'hex')
    );

    if (!sigValid) {
      console.warn('[Razorpay] Signature mismatch:', { razorpay_order_id, razorpay_payment_id });
      return NextResponse.json({ error: 'Payment signature invalid' }, { status: 400 });
    }

    // ── Step 3: Authenticate user from bearer token ──────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized — missing token' }, { status: 401 });
    }

    const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await userClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 });
    }

    // ── Step 4: Update entitlement with plan limits (service role) ───────────
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const limits = PLAN_LIMITS[planId];

    const isYearly = planId === 'pro_yearly';
    const startsAt = new Date();
    const endsAt   = new Date(startsAt);
    isYearly
      ? endsAt.setFullYear(endsAt.getFullYear() + 1)
      : endsAt.setMonth(endsAt.getMonth() + 1);

    const { error: upsertErr } = await adminClient
      .from('entitlements')
      .upsert({
        user_id:             user.id,
        plan_id:             isYearly ? 'pro' : planId,
        status:              limits.status,
        starts_at:           startsAt.toISOString(),
        ends_at:             endsAt.toISOString(),
        provider:            'razorpay',
        payment_id:          razorpay_payment_id,
        hearts_limit:        limits.hearts_limit,
        ai_limit_daily:      limits.ai_limit_daily,
        lessons_limit_daily: limits.lessons_limit_daily,
        ads_enabled:         limits.ads_enabled,
      });

    if (upsertErr) {
      console.error('[Billing] Failed to update entitlement:', upsertErr);
      return NextResponse.json({ error: 'Failed to activate plan' }, { status: 500 });
    }

    // ── Step 5: Log payment event ────────────────────────────────────────────
    await adminClient.from('event_logs').insert({
      user_id: user.id,
      event:   'payment_success',
      payload: {
        plan_id:    planId,
        status:     limits.status,
        payment_id: razorpay_payment_id,
        order_id:   razorpay_order_id,
      },
    });

    return NextResponse.json({
      success: true,
      plan:    planId,
      status:  limits.status,
    });
  } catch (err: any) {
    console.error('[Billing] verify error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
