-- ============================================================
-- LEARN WITH VELMORTH — Supabase Schema v4
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE,
  display_name  TEXT,
  avatar_url    TEXT,
  bio           TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id         UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme           TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  ui_language     TEXT DEFAULT 'en',
  tts_enabled     BOOLEAN DEFAULT TRUE,
  goal_minutes    INT DEFAULT 10,
  notifications   BOOLEAN DEFAULT TRUE,
  jlpt_target     TEXT DEFAULT 'N5' CHECK (jlpt_target IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  heart_system_enabled BOOLEAN DEFAULT TRUE,
  heart_recovery_mode  TEXT DEFAULT 'time',
  heart_recovery_hours INT DEFAULT 24
);

-- ============================================================
-- USER STATS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id         UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_total        INT DEFAULT 0,
  xp_today        INT DEFAULT 0,
  gems_balance    INT DEFAULT 5,
  lessons_done    INT DEFAULT 0,
  words_learned   INT DEFAULT 0,
  kanji_learned   INT DEFAULT 0,
  reviews_done    INT DEFAULT 0,
  speak_sessions  INT DEFAULT 0,
  last_active     DATE DEFAULT CURRENT_DATE,
  hearts_total    INT DEFAULT 50,
  hearts_used_today INT DEFAULT 0,
  hearts_max      INT DEFAULT 50,
  hearts_recover_at TIMESTAMPTZ,
  hearts_last_debit_at TIMESTAMPTZ
);

-- ============================================================
-- USER STREAKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_streaks (
  user_id        UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  streak         INT DEFAULT 0,
  longest        INT DEFAULT 0,
  last_completed DATE,
  freeze_count   INT DEFAULT 0
);

-- ============================================================
-- ENTITLEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.entitlements (
  user_id              UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id              TEXT DEFAULT 'free',
  status               TEXT DEFAULT 'free' CHECK (status IN ('free', 'starter', 'plus', 'pro', 'yearly', 'cancelled')),
  starts_at            TIMESTAMPTZ,
  ends_at              TIMESTAMPTZ,
  provider             TEXT,
  payment_id           TEXT,
  -- Per-plan feature limits (synced from plans table on purchase)
  hearts_limit         INT DEFAULT 50,
  ai_limit_daily       INT DEFAULT 5,
  lessons_limit_daily  INT DEFAULT 5,
  ads_enabled          BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- PLANS (canonical plan config — read-only for users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.plans (
  plan_id              TEXT PRIMARY KEY,
  name                 TEXT NOT NULL,
  price_monthly        INT  DEFAULT 0,      -- in paise (₹99 = 9900)
  price_yearly         INT  DEFAULT 0,
  ads_enabled          BOOLEAN DEFAULT TRUE,
  hearts_limit         INT  DEFAULT 50,
  ai_limit_daily       INT  DEFAULT 5,
  lessons_limit_daily  INT  DEFAULT 5,
  jlpt_access_level    TEXT DEFAULT 'N5',
  support_priority     TEXT DEFAULT 'community'
);

-- Seed plan rows (safe to re-run)
INSERT INTO public.plans
  (plan_id, name, price_monthly, price_yearly, ads_enabled, hearts_limit, ai_limit_daily, lessons_limit_daily, jlpt_access_level, support_priority)
VALUES
  ('free',    'Free',    0,     0,      true,  5,   5,  5,  'N5', 'community'),
  ('starter', 'Starter', 9900,  0,      true,  25,  15, 15, 'N5', 'standard'),
  ('plus',    'Plus',    14900, 0,      true,  50,  30, 30, 'N4', 'standard'),
  ('pro',     'Pro',     19900, 99900,  false, 100, 99, 99, 'N1', 'priority')
ON CONFLICT (plan_id) DO UPDATE SET
  price_monthly       = EXCLUDED.price_monthly,
  price_yearly        = EXCLUDED.price_yearly,
  hearts_limit        = EXCLUDED.hearts_limit,
  ai_limit_daily      = EXCLUDED.ai_limit_daily,
  lessons_limit_daily = EXCLUDED.lessons_limit_daily;

-- ============================================================
-- USAGE COUNTERS (daily usage per user — resets each day)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_counters (
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date            DATE DEFAULT CURRENT_DATE,
  hearts_used     INT DEFAULT 0,
  ai_requests     INT DEFAULT 0,
  lessons_started INT DEFAULT 0,
  reviews_done    INT DEFAULT 0,
  hearts_spent    INT DEFAULT 0,
  lessons_attempted INT DEFAULT 0,
  reviews_attempted INT DEFAULT 0,
  PRIMARY KEY (user_id, date)
);

-- ============================================================
-- ADMIN ROLES (internal only — not a public plan)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_roles (
  user_id     UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'content_editor')),
  permissions JSONB DEFAULT '{}',
  granted_at  TIMESTAMPTZ DEFAULT NOW(),
  granted_by  UUID REFERENCES public.profiles(id)
);

-- ============================================================
-- BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key         TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  xp_reward   INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id   UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- COURSES / UNITS / LESSONS / EXERCISES (content hierarchy)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  language    TEXT DEFAULT 'ja',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.units (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  position    INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id     UUID REFERENCES public.units(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  xp_reward   INT DEFAULT 10,
  position    INT DEFAULT 0,
  is_premium  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.exercises (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id   UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,  -- 'mcq' | 'typing' | 'matching' | 'listening' | 'speaking' | 'arrange'
  prompt      JSONB NOT NULL,
  position    INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USER PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id    UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  status       TEXT DEFAULT 'available' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  accuracy     NUMERIC(5,2) DEFAULT 0,
  xp_earned    INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, lesson_id)
);

-- ============================================================
-- REVIEW QUEUE (SRS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.review_queue (
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id   UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  due_at        TIMESTAMPTZ DEFAULT NOW(),
  interval_days INT DEFAULT 1,
  ease_factor   NUMERIC(4,2) DEFAULT 2.5,
  fail_count    INT DEFAULT 0,
  PRIMARY KEY (user_id, exercise_id)
);

-- ============================================================
-- LEADERBOARD ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.leaderboard_entries (
  id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id TEXT NOT NULL,   -- 'xp_weekly' | 'xp_alltime' | 'streak_weekly' | 'streak_alltime'
  user_id  UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp       INT DEFAULT 0,
  rank     INT,
  period   TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(board_id, user_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENT LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.event_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event      TEXT NOT NULL,
  payload    JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SIGNUP TRIGGER — auto-create all user rows on auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NULL
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create user_settings (all defaults = zero/default)
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_stats (all zeros + default hearts)
  INSERT INTO public.user_stats (user_id, hearts_total, hearts_max)
  VALUES (NEW.id, 50, 50)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_streaks (all zeros)
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create entitlement (Free plan defaults)
  INSERT INTO public.entitlements (
    user_id, plan_id, status,
    hearts_limit, ai_limit_daily, lessons_limit_daily, ads_enabled
  )
  VALUES (NEW.id, 'free', 'free', 50, 5, 5, true)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles       ENABLE ROW LEVEL SECURITY;

-- profiles: own write, public read
CREATE POLICY "profiles_read_all"  ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_own_write" ON public.profiles FOR ALL USING (auth.uid() = id);

-- user_settings: own row only
CREATE POLICY "user_settings_own" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- user_stats: own row only
CREATE POLICY "user_stats_own" ON public.user_stats FOR ALL USING (auth.uid() = user_id);

-- user_streaks: own row only
CREATE POLICY "user_streaks_own" ON public.user_streaks FOR ALL USING (auth.uid() = user_id);

-- entitlements: own read, service role write
CREATE POLICY "entitlements_own_read" ON public.entitlements FOR SELECT USING (auth.uid() = user_id);

-- badges: public read
CREATE POLICY "badges_read_all" ON public.badges FOR SELECT USING (TRUE);
CREATE POLICY "user_badges_read_all" ON public.user_badges FOR SELECT USING (TRUE);
CREATE POLICY "user_badges_own_write" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- courses, units, lessons, exercises: public read
CREATE POLICY "courses_read"   ON public.courses   FOR SELECT USING (TRUE);
CREATE POLICY "units_read"     ON public.units     FOR SELECT USING (TRUE);
CREATE POLICY "lessons_read"   ON public.lessons   FOR SELECT USING (TRUE);
CREATE POLICY "exercises_read" ON public.exercises FOR SELECT USING (TRUE);

-- user_progress: own row only
CREATE POLICY "user_progress_own" ON public.user_progress FOR ALL USING (auth.uid() = user_id);

-- review_queue: own row only
CREATE POLICY "review_queue_own" ON public.review_queue FOR ALL USING (auth.uid() = user_id);

-- leaderboard: public read
CREATE POLICY "leaderboard_read_all" ON public.leaderboard_entries FOR SELECT USING (TRUE);
CREATE POLICY "leaderboard_own_write" ON public.leaderboard_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "leaderboard_own_update" ON public.leaderboard_entries FOR UPDATE USING (auth.uid() = user_id);

-- notifications: own row only
CREATE POLICY "notifications_own" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- event_logs: insert own row only
CREATE POLICY "event_logs_insert_own" ON public.event_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- plans: public read only (prices are not secret)
CREATE POLICY "plans_read_all" ON public.plans FOR SELECT USING (TRUE);

-- usage_counters: own row only
CREATE POLICY "usage_counters_own" ON public.usage_counters FOR ALL USING (auth.uid() = user_id);

-- admin_roles: service role only (users cannot see or write this table)
-- No SELECT policy — anon/authenticated roles cannot access admin_roles directly

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.entitlements;

-- ============================================================
-- MIGRATION HELPERS (safe to run on existing DB)
-- ============================================================
-- Add new columns to entitlements if upgrading from v3
ALTER TABLE public.entitlements ADD COLUMN IF NOT EXISTS hearts_limit        INT DEFAULT 50;
ALTER TABLE public.entitlements ADD COLUMN IF NOT EXISTS ai_limit_daily      INT DEFAULT 5;
ALTER TABLE public.entitlements ADD COLUMN IF NOT EXISTS lessons_limit_daily INT DEFAULT 5;
ALTER TABLE public.entitlements ADD COLUMN IF NOT EXISTS ads_enabled         BOOLEAN DEFAULT TRUE;
-- Fix status check constraint to include new plan tiers
ALTER TABLE public.entitlements DROP CONSTRAINT IF EXISTS entitlements_status_check;
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_status_check
  CHECK (status IN ('free', 'starter', 'plus', 'pro', 'yearly', 'cancelled'));

-- V5 Migrations for Hearts debit and recovery system
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS hearts_total INT DEFAULT 50;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS hearts_used_today INT DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS hearts_max INT DEFAULT 50;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS hearts_recover_at TIMESTAMPTZ;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS hearts_last_debit_at TIMESTAMPTZ;

ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS heart_system_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS heart_recovery_mode TEXT DEFAULT 'time';
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS heart_recovery_hours INT DEFAULT 24;

ALTER TABLE public.usage_counters ADD COLUMN IF NOT EXISTS hearts_spent INT DEFAULT 0;
ALTER TABLE public.usage_counters ADD COLUMN IF NOT EXISTS lessons_attempted INT DEFAULT 0;
ALTER TABLE public.usage_counters ADD COLUMN IF NOT EXISTS reviews_attempted INT DEFAULT 0;

-- ============================================================
-- SECURE LIMITS INCREMENT RPC (called securely from application)
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_daily_usage(
  p_user_id UUID,
  p_counter TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
BEGIN
  INSERT INTO public.usage_counters (user_id, date, hearts_used, ai_requests, lessons_started, reviews_done)
  VALUES (
    p_user_id,
    v_today,
    CASE WHEN p_counter = 'hearts_used' THEN 1 ELSE 0 END,
    CASE WHEN p_counter = 'ai_requests' THEN 1 ELSE 0 END,
    CASE WHEN p_counter = 'lessons_started' THEN 1 ELSE 0 END,
    CASE WHEN p_counter = 'reviews_done' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, date) DO UPDATE SET
    hearts_used = public.usage_counters.hearts_used + CASE WHEN p_counter = 'hearts_used' THEN 1 ELSE 0 END,
    ai_requests = public.usage_counters.ai_requests + CASE WHEN p_counter = 'ai_requests' THEN 1 ELSE 0 END,
    lessons_started = public.usage_counters.lessons_started + CASE WHEN p_counter = 'lessons_started' THEN 1 ELSE 0 END,
    reviews_done = public.usage_counters.reviews_done + CASE WHEN p_counter = 'reviews_done' THEN 1 ELSE 0 END;
END;
$$;
