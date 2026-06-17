-- ============================================================
-- LEARN WITH VELMORTH — Supabase Schema v3
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
  notifications   BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- USER STATS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id       UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_total      INT DEFAULT 0,
  xp_today      INT DEFAULT 0,
  gems_balance  INT DEFAULT 5,
  lessons_done  INT DEFAULT 0,
  words_learned INT DEFAULT 0,
  reviews_done  INT DEFAULT 0,
  last_active   DATE DEFAULT CURRENT_DATE
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
  user_id    UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id    TEXT DEFAULT 'free',
  status     TEXT DEFAULT 'free' CHECK (status IN ('free', 'pro', 'yearly', 'cancelled')),
  starts_at  TIMESTAMPTZ,
  ends_at    TIMESTAMPTZ,
  provider   TEXT,
  payment_id TEXT
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

  -- Create user_stats (all zeros)
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create user_streaks (all zeros)
  INSERT INTO public.user_streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create entitlement (free by default)
  INSERT INTO public.entitlements (user_id, plan_id, status)
  VALUES (NEW.id, 'free', 'free')
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

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
