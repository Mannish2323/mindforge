-- ================================================================
-- MindForge — Razorpay Subscription & 1-Day Trial Migration
-- Supports: 1-Day Trial, Autopay Mandates, Webhook Idempotency,
-- Lifecycle states: trial_pending, trial_active, active, payment_pending, payment_failed, cancelled, expired
-- ================================================================

-- 1. Extend entitlements table columns
ALTER TABLE public.entitlements
  ADD COLUMN IF NOT EXISTS trial_ends_at            TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_billing_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS razorpay_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end     BOOLEAN DEFAULT FALSE;

-- 2. Extend status check constraint to include all subscription lifecycle states
ALTER TABLE public.entitlements
  DROP CONSTRAINT IF EXISTS entitlements_status_check;

ALTER TABLE public.entitlements
  ADD CONSTRAINT entitlements_status_check
  CHECK (status IN (
    'free', 'starter', 'plus', 'pro', 'ai_max', 'yearly',
    'trial_pending', 'trial_active', 'active',
    'payment_pending', 'payment_failed', 'cancelled', 'expired'
  ));

-- 3. Create webhook_events table for webhook idempotency
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id              TEXT PRIMARY KEY,
  event_type      TEXT NOT NULL,
  payload         JSONB,
  processed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON public.webhook_events(processed_at DESC);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage webhook events" ON public.webhook_events;
CREATE POLICY "Service role can manage webhook events"
  ON public.webhook_events FOR ALL
  WITH CHECK (true);

-- 4. Create subscriptions table for full lifecycle audit & multi-cycle history
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_subscription_id  TEXT NOT NULL,
  plan_id                   TEXT NOT NULL,
  status                    TEXT NOT NULL DEFAULT 'trial_pending',
  trial_ends_at             TIMESTAMPTZ,
  current_period_start      TIMESTAMPTZ,
  current_period_end        TIMESTAMPTZ,
  cancel_at_period_end      BOOLEAN NOT NULL DEFAULT FALSE,
  cancelled_at              TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_rzp ON public.subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Service role can manage subscriptions"
  ON public.subscriptions FOR ALL
  WITH CHECK (true);
