import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { PLANS, PlanId, calcEndsAt } from '@/lib/plans';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      console.warn('[Billing Webhook] Missing x-razorpay-signature header');
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
    if (!webhookSecret) {
      console.error('[Billing Webhook] Webhook secret not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 503 });
    }

    // ── 1. Verify HMAC SHA256 Webhook Signature ──────────────────────────────
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');

    let sigValid = false;
    try {
      sigValid = crypto.timingSafeEqual(
        Buffer.from(expected, 'hex'),
        Buffer.from(signature, 'hex')
      );
    } catch {
      sigValid = false;
    }

    if (!sigValid) {
      console.error('[Billing Webhook] Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || `${event.event}_${Date.now()}`;
    const eventType = event.event;

    console.log(`[Billing Webhook] Processing event: ${eventType} (ID: ${eventId})`);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // ── 2. Idempotency Check: Prevent duplicate webhook processing ────────────
    const { data: existingEvent } = await adminClient
      .from('webhook_events')
      .select('id')
      .eq('id', eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log(`[Billing Webhook] Duplicate event ${eventId} already processed. Skipping.`);
      return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
    }

    // Record event in idempotency table
    await adminClient.from('webhook_events').insert({
      id: eventId,
      event_type: eventType,
      payload: { event: eventType, entity: event.payload?.subscription?.entity?.id || event.payload?.payment?.entity?.id },
      processed_at: new Date().toISOString(),
    });

    // ── 3. Extract Payload Entities ───────────────────────────────────────────
    const subEntity = event.payload?.subscription?.entity;
    const paymentEntity = event.payload?.payment?.entity;
    const rzpSubscriptionId = subEntity?.id || paymentEntity?.notes?.subscription_id;

    if (!rzpSubscriptionId && !subEntity && !paymentEntity) {
      console.log('[Billing Webhook] No relevant subscription entity in payload. Acknowledged.');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Find user by subscription ID or notes
    let userId = subEntity?.notes?.userId || paymentEntity?.notes?.userId;
    let planId: PlanId = (subEntity?.notes?.planId || paymentEntity?.notes?.planId) as PlanId;

    if (!userId && rzpSubscriptionId) {
      const { data: subRecord } = await adminClient
        .from('subscriptions')
        .select('user_id, plan_id')
        .eq('razorpay_subscription_id', rzpSubscriptionId)
        .maybeSingle();

      if (subRecord) {
        userId = subRecord.user_id;
        planId = subRecord.plan_id as PlanId;
      }
    }

    if (!userId) {
      console.warn(`[Billing Webhook] Could not resolve user for subscription ${rzpSubscriptionId}`);
      return NextResponse.json({ received: true, warning: 'User not resolved' }, { status: 200 });
    }

    const plan = PLANS[planId] || PLANS.starter;
    const now = new Date();

    // ── 4. Handle Subscription Lifecycle Events ───────────────────────────────
    switch (eventType) {
      // ── Mandate Authenticated / Trial Activated ────────────────────────────
      case 'subscription.authenticated': {
        const trialEndsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        await adminClient
          .from('entitlements')
          .update({
            status: 'trial_active',
            trial_ends_at: trialEndsAt.toISOString(),
            ends_at: trialEndsAt.toISOString(),
            next_billing_at: trialEndsAt.toISOString(),
            hearts_limit: plan.heartsMax,
            ai_limit_daily: plan.aiChatsPerDay,
            lessons_limit_daily: plan.lessonsPerDay ?? 9999,
            ads_enabled: plan.adsEnabled,
            cancel_at_period_end: false,
          })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({
            status: 'trial_active',
            trial_ends_at: trialEndsAt.toISOString(),
            current_period_start: now.toISOString(),
            current_period_end: trialEndsAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        break;
      }

      // ── Subscription Activated ─────────────────────────────────────────────
      case 'subscription.activated': {
        // If current time is within 1-day trial, keep trial_active, otherwise set to active
        const { data: currentEnt } = await adminClient
          .from('entitlements')
          .select('status, trial_ends_at')
          .eq('user_id', userId)
          .maybeSingle();

        const isStillInTrial =
          currentEnt?.trial_ends_at && new Date(currentEnt.trial_ends_at) > now;

        const newStatus = isStillInTrial ? 'trial_active' : 'active';
        const periodEndsAt = calcEndsAt(planId, now);

        await adminClient
          .from('entitlements')
          .update({
            status: newStatus,
            ends_at: isStillInTrial ? currentEnt.trial_ends_at : periodEndsAt.toISOString(),
            next_billing_at: periodEndsAt.toISOString(),
            hearts_limit: plan.heartsMax,
            ai_limit_daily: plan.aiChatsPerDay,
            lessons_limit_daily: plan.lessonsPerDay ?? 9999,
            ads_enabled: plan.adsEnabled,
            cancel_at_period_end: false,
          })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({
            status: newStatus,
            current_period_start: now.toISOString(),
            current_period_end: periodEndsAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        break;
      }

      // ── Recurring Payment Charged ──────────────────────────────────────────
      case 'subscription.charged': {
        const periodEndsAt = calcEndsAt(planId, now);
        const paymentId = paymentEntity?.id || event.payload?.payment?.entity?.id || 'sub_charge';

        await adminClient
          .from('entitlements')
          .update({
            status: 'active', // Transitioned from trial to full active recurring subscription
            starts_at: now.toISOString(),
            ends_at: periodEndsAt.toISOString(),
            next_billing_at: periodEndsAt.toISOString(),
            hearts_limit: plan.heartsMax,
            ai_limit_daily: plan.aiChatsPerDay,
            lessons_limit_daily: plan.lessonsPerDay ?? 9999,
            ads_enabled: plan.adsEnabled,
            razorpay_payment_id: paymentId,
            cancel_at_period_end: false,
          })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: now.toISOString(),
            current_period_end: periodEndsAt.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        // Record recurring invoice
        await adminClient.from('payment_history').insert({
          user_id: userId,
          plan_id: planId,
          amount: plan.pricePaise,
          currency: 'INR',
          billing_period: plan.periodDays ? `${plan.periodDays}d` : null,
          razorpay_payment_id: paymentId,
          razorpay_order_id: paymentEntity?.order_id || null,
          status: 'success',
        });

        await adminClient.from('activity_logs').insert({
          user_id: userId,
          action: 'subscription_charged',
          metadata: {
            plan_id: planId,
            amount: plan.price,
            period_ends_at: periodEndsAt.toISOString(),
          },
        });

        break;
      }

      // ── Recurring Payment Failed ───────────────────────────────────────────
      case 'payment.failed': {
        console.warn(`[Billing Webhook] Recurring payment failed for user ${userId}`);

        await adminClient
          .from('entitlements')
          .update({
            status: 'payment_failed',
          })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({
            status: 'payment_failed',
            updated_at: now.toISOString(),
          })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        await adminClient.from('activity_logs').insert({
          user_id: userId,
          action: 'payment_failed',
          metadata: {
            plan_id: planId,
            subscription_id: rzpSubscriptionId,
            error_description: paymentEntity?.error_description || 'Mandate charge failed',
          },
        });

        break;
      }

      // ── Subscription Paused / Pending ──────────────────────────────────────
      case 'subscription.paused': {
        await adminClient
          .from('entitlements')
          .update({ status: 'payment_pending' })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({ status: 'payment_pending', updated_at: now.toISOString() })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        break;
      }

      // ── Subscription Resumed ───────────────────────────────────────────────
      case 'subscription.resumed': {
        await adminClient
          .from('entitlements')
          .update({ status: 'active' })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({ status: 'active', updated_at: now.toISOString() })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        break;
      }

      // ── Subscription Cancelled ─────────────────────────────────────────────
      case 'subscription.cancelled': {
        await adminClient
          .from('entitlements')
          .update({
            status: 'cancelled',
            cancel_at_period_end: true,
          })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({
            status: 'cancelled',
            cancel_at_period_end: true,
            cancelled_at: now.toISOString(),
            updated_at: now.toISOString(),
          })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        await adminClient.from('activity_logs').insert({
          user_id: userId,
          action: 'subscription_cancelled',
          metadata: { subscription_id: rzpSubscriptionId, cancelled_at: now.toISOString() },
        });

        break;
      }

      // ── Subscription Completed / Expired ───────────────────────────────────
      case 'subscription.completed': {
        await adminClient
          .from('entitlements')
          .update({
            status: 'expired',
            plan_id: 'free',
            hearts_limit: 25,
            ai_limit_daily: 5,
            lessons_limit_daily: 5,
            ads_enabled: true,
          })
          .eq('user_id', userId);

        await adminClient
          .from('subscriptions')
          .update({ status: 'expired', updated_at: now.toISOString() })
          .eq('razorpay_subscription_id', rzpSubscriptionId);

        break;
      }

      default:
        console.log(`[Billing Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ received: true, processed: true }, { status: 200 });
  } catch (err: any) {
    console.error('[Billing Webhook] Error processing webhook:', err.message);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
