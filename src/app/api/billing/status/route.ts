import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLANS, PlanId, formatSubscriptionStatus, isSubscriptionActive } from '@/lib/plans';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Invalid user token' }, { status: 401 });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // ── 1. Fetch live entitlements ───────────────────────────────────────────
    const { data: ent } = await adminClient
      .from('entitlements')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const planId: PlanId = (ent?.plan_id || 'free') as PlanId;
    const planConfig = PLANS[planId] || PLANS.free;
    const status = ent?.status || 'free';
    const endsAt = ent?.ends_at || null;
    const trialEndsAt = ent?.trial_ends_at || null;
    const nextBillingAt = ent?.next_billing_at || null;
    const isTrial = status === 'trial_active';
    const isPremium = isSubscriptionActive(status, endsAt, trialEndsAt);

    // ── 2. Fetch payment history ─────────────────────────────────────────────
    const { data: history } = await adminClient
      .from('payment_history')
      .select('id, plan_id, amount, currency, billing_period, razorpay_payment_id, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const formattedStatus = formatSubscriptionStatus(status);

    return NextResponse.json({
      planId,
      planName: planConfig.name,
      planEmoji: planConfig.emoji,
      price: planConfig.price,
      periodLabel: planConfig.periodLabel,
      status,
      statusLabel: formattedStatus.label,
      badgeVariant: formattedStatus.badgeVariant,
      isPremium,
      isTrial,
      trialDays: planConfig.trialDays,
      trialEndsAt,
      nextBillingAt,
      endsAt,
      cancelAtPeriodEnd: ent?.cancel_at_period_end || false,
      razorpaySubscriptionId: ent?.razorpay_subscription_id || null,
      heartsLimit: ent?.hearts_limit ?? planConfig.heartsMax,
      aiLimitDaily: ent?.ai_limit_daily ?? planConfig.aiChatsPerDay,
      lessonsLimitDaily: ent?.lessons_limit_daily ?? planConfig.lessonsPerDay,
      adsEnabled: ent?.ads_enabled ?? planConfig.adsEnabled,
      history: history || [],
    });
  } catch (err: any) {
    console.error('[Billing] status API error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
