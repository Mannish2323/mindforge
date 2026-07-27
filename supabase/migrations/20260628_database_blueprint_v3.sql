-- ================================================================
-- Learn with Velmorth — Database Blueprint V3 Migration
-- Migration: 20260628_database_blueprint_v3.sql
-- Velmorth Labs | Run in Supabase SQL Editor
-- ================================================================

BEGIN;

-- ── 1. IDENTITY DOMAIN ──────────────────────────────────────────

-- user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_categories  TEXT[] DEFAULT '{}',
  daily_goal_xp         INT DEFAULT 50,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_roles (alias/supplement to admin_roles)
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role                  TEXT NOT NULL DEFAULT 'learner' CHECK (role IN ('learner', 'creator', 'moderator', 'admin')),
  assigned_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view user roles" ON public.user_roles;
CREATE POLICY "Anyone can view user roles" ON public.user_roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- subscriptions (link to entitlements)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  razorpay_subscription_id TEXT,
  status                TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'unpaid', 'cancelled', 'incomplete')),
  plan_id               TEXT NOT NULL,
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- devices
CREATE TABLE IF NOT EXISTS public.devices (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token          TEXT NOT NULL,
  device_type           TEXT,
  last_active_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own devices" ON public.devices;
CREATE POLICY "Users can manage own devices" ON public.devices
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- sessions (user active sessions)
CREATE TABLE IF NOT EXISTS public.sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token         TEXT UNIQUE NOT NULL,
  expires_at            TIMESTAMPTZ NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.sessions;
CREATE POLICY "Users can manage own sessions" ON public.sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 2. LEARNING DOMAIN ──────────────────────────────────────────

-- lesson_sections
CREATE TABLE IF NOT EXISTS public.lesson_sections (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id             TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  content_type          TEXT CHECK (content_type IN ('vocab', 'grammar', 'practice', 'quiz')),
  sort_order            INT DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lesson_sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read lesson sections" ON public.lesson_sections;
CREATE POLICY "Anyone can read lesson sections" ON public.lesson_sections FOR SELECT USING (true);

-- grammar_topics (equivalent to grammar)
CREATE TABLE IF NOT EXISTS public.grammar_topics (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grammar_id            TEXT UNIQUE NOT NULL,
  title                 TEXT NOT NULL,
  structure             TEXT NOT NULL,
  explanation_en        TEXT NOT NULL,
  explanation_hi        TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.grammar_topics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read grammar topics" ON public.grammar_topics;
CREATE POLICY "Anyone can read grammar topics" ON public.grammar_topics FOR SELECT USING (true);

-- dialogues
CREATE TABLE IF NOT EXISTS public.dialogues (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id             TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  japanese              TEXT NOT NULL,
  romaji                TEXT,
  english               TEXT NOT NULL,
  hindi                 TEXT,
  speaker               TEXT,
  audio_url             TEXT,
  sort_order            INT DEFAULT 0
);

ALTER TABLE public.dialogues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read dialogues" ON public.dialogues;
CREATE POLICY "Anyone can read dialogues" ON public.dialogues FOR SELECT USING (true);

-- reading_lessons
CREATE TABLE IF NOT EXISTS public.reading_lessons (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id             TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  passage_ja            TEXT NOT NULL,
  passage_en            TEXT NOT NULL,
  questions             JSONB DEFAULT '[]',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reading_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read reading lessons" ON public.reading_lessons;
CREATE POLICY "Anyone can read reading lessons" ON public.reading_lessons FOR SELECT USING (true);

-- listening_lessons
CREATE TABLE IF NOT EXISTS public.listening_lessons (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id             TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  audio_url             TEXT NOT NULL,
  transcript_ja         TEXT,
  questions             JSONB DEFAULT '[]',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.listening_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read listening lessons" ON public.listening_lessons;
CREATE POLICY "Anyone can read listening lessons" ON public.listening_lessons FOR SELECT USING (true);

-- speaking_lessons
CREATE TABLE IF NOT EXISTS public.speaking_lessons (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id             TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  prompt_ja             TEXT NOT NULL,
  prompt_en             TEXT NOT NULL,
  sample_audio_url      TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.speaking_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read speaking lessons" ON public.speaking_lessons;
CREATE POLICY "Anyone can read speaking lessons" ON public.speaking_lessons FOR SELECT USING (true);

-- writing_lessons
CREATE TABLE IF NOT EXISTS public.writing_lessons (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id             TEXT REFERENCES public.lessons(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  char_to_practice      TEXT NOT NULL,
  stroke_order_json     JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.writing_lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read writing lessons" ON public.writing_lessons;
CREATE POLICY "Anyone can read writing lessons" ON public.writing_lessons FOR SELECT USING (true);

-- ── 3. PRACTICE DOMAIN ──────────────────────────────────────────

-- quizzes
CREATE TABLE IF NOT EXISTS public.quizzes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id             TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  xp_reward             INT DEFAULT 20,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read quizzes" ON public.quizzes;
CREATE POLICY "Anyone can read quizzes" ON public.quizzes FOR SELECT USING (true);

-- quiz_questions
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id               TEXT REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text         TEXT NOT NULL,
  options               TEXT[] NOT NULL,
  correct_option_idx    INT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read quiz questions" ON public.quiz_questions;
CREATE POLICY "Anyone can read quiz questions" ON public.quiz_questions FOR SELECT USING (true);

-- quiz_attempts
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id               TEXT NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score                 INT NOT NULL,
  passed                BOOLEAN NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own quiz attempts" ON public.quiz_attempts;
CREATE POLICY "Users can manage own quiz attempts" ON public.quiz_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- writing_sessions
CREATE TABLE IF NOT EXISTS public.writing_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score                 INT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.writing_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own writing sessions" ON public.writing_sessions;
CREATE POLICY "Users can manage own writing sessions" ON public.writing_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- speaking_sessions
CREATE TABLE IF NOT EXISTS public.speaking_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score                 INT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.speaking_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own speaking sessions" ON public.speaking_sessions;
CREATE POLICY "Users can manage own speaking sessions" ON public.speaking_sessions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 4. PROGRESS DOMAIN ──────────────────────────────────────────

-- course_progress
CREATE TABLE IF NOT EXISTS public.course_progress (
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id             TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage   INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own course progress" ON public.course_progress;
CREATE POLICY "Users can manage own course progress" ON public.course_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- module_progress
CREATE TABLE IF NOT EXISTS public.module_progress (
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id             TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  progress_percentage   INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, module_id)
);

ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own module progress" ON public.module_progress;
CREATE POLICY "Users can manage own module progress" ON public.module_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- writing_progress
CREATE TABLE IF NOT EXISTS public.writing_progress (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_mastery       INT DEFAULT 0 CHECK (overall_mastery BETWEEN 0 AND 100),
  characters_practiced  INT DEFAULT 0,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.writing_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own writing progress" ON public.writing_progress;
CREATE POLICY "Users can manage own writing progress" ON public.writing_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- speaking_progress
CREATE TABLE IF NOT EXISTS public.speaking_progress (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_fluency       INT DEFAULT 0 CHECK (overall_fluency BETWEEN 0 AND 100),
  sessions_completed    INT DEFAULT 0,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.speaking_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own speaking progress" ON public.speaking_progress;
CREATE POLICY "Users can manage own speaking progress" ON public.speaking_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- reading_progress
CREATE TABLE IF NOT EXISTS public.reading_progress (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lessons_completed     INT DEFAULT 0,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own reading progress" ON public.reading_progress;
CREATE POLICY "Users can manage own reading progress" ON public.reading_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- listening_progress
CREATE TABLE IF NOT EXISTS public.listening_progress (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  lessons_completed     INT DEFAULT 0,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.listening_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own listening progress" ON public.listening_progress;
CREATE POLICY "Users can manage own listening progress" ON public.listening_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- bookmarks
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type             TEXT NOT NULL CHECK (item_type IN ('vocab', 'grammar', 'kanji')),
  item_id               TEXT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── 5. SAKURA AI DOMAIN ──────────────────────────────────────────

-- ai_conversations
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own conversations" ON public.ai_conversations;
CREATE POLICY "Users can manage own conversations" ON public.ai_conversations
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ai_recommendations
CREATE TABLE IF NOT EXISTS public.ai_recommendations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_text   TEXT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own recommendations" ON public.ai_recommendations;
CREATE POLICY "Users can view own recommendations" ON public.ai_recommendations
  FOR SELECT USING (auth.uid() = user_id);

-- ai_usage_logs
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_tokens         INT,
  completion_tokens     INT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own ai usage logs" ON public.ai_usage_logs;
CREATE POLICY "Users can view own ai usage logs" ON public.ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ── 6. COMMUNITY DOMAIN ──────────────────────────────────────────

-- posts
CREATE TABLE IF NOT EXISTS public.posts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content               TEXT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Anyone can view posts" ON public.posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own posts" ON public.posts;
CREATE POLICY "Users can manage own posts" ON public.posts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- comments
CREATE TABLE IF NOT EXISTS public.comments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id               UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content               TEXT NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own comments" ON public.comments;
CREATE POLICY "Users can manage own comments" ON public.comments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- reactions
CREATE TABLE IF NOT EXISTS public.reactions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id               UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji                 TEXT NOT NULL,
  UNIQUE (post_id, user_id, emoji)
);

ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view reactions" ON public.reactions;
CREATE POLICY "Anyone can view reactions" ON public.reactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own reactions" ON public.reactions;
CREATE POLICY "Users can manage own reactions" ON public.reactions
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- friendships
CREATE TABLE IF NOT EXISTS public.friendships (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status                TEXT CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, friend_id)
);

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own friendships" ON public.friendships;
CREATE POLICY "Users can view own friendships" ON public.friendships
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
DROP POLICY IF EXISTS "Users can manage own friendships" ON public.friendships;
CREATE POLICY "Users can manage own friendships" ON public.friendships
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id) WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- leaderboard_snapshots
CREATE TABLE IF NOT EXISTS public.leaderboard_snapshots (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier                  TEXT NOT NULL,
  snapshot_data         JSONB NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view leaderboard snapshots" ON public.leaderboard_snapshots;
CREATE POLICY "Anyone can view leaderboard snapshots" ON public.leaderboard_snapshots FOR SELECT USING (true);

-- ── 7. PREMIUM DOMAIN ────────────────────────────────────────────

-- subscription_plans
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id                    TEXT PRIMARY KEY,
  name                  TEXT NOT NULL,
  price_paise           INT NOT NULL,
  currency              TEXT DEFAULT 'INR',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (true);

-- orders
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id               TEXT,
  amount_paise          INT NOT NULL,
  status                TEXT CHECK (status IN ('pending', 'completed', 'failed')),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id              UUID REFERENCES public.orders(id),
  invoice_pdf_url       TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

-- feature_entitlements
CREATE TABLE IF NOT EXISTS public.feature_entitlements (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id               TEXT,
  feature_name          TEXT NOT NULL,
  is_enabled            BOOLEAN DEFAULT TRUE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.feature_entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view feature entitlements" ON public.feature_entitlements;
CREATE POLICY "Anyone can view feature entitlements" ON public.feature_entitlements FOR SELECT USING (true);

-- ── 8. NOTIFICATIONS DOMAIN ──────────────────────────────────────

-- notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  body                  TEXT NOT NULL,
  is_read               BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notification_preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_enabled          BOOLEAN DEFAULT TRUE,
  email_enabled         BOOLEAN DEFAULT TRUE,
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own notification preferences" ON public.notification_preferences;
CREATE POLICY "Users can manage own notification preferences" ON public.notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- notification_history
CREATE TABLE IF NOT EXISTS public.notification_history (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title                 TEXT NOT NULL,
  body                  TEXT NOT NULL,
  sent_at               TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notification history" ON public.notification_history;
CREATE POLICY "Users can view own notification history" ON public.notification_history
  FOR SELECT USING (auth.uid() = user_id);

-- ── 9. ANALYTICS DOMAIN ──────────────────────────────────────────

-- analytics_events
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name            TEXT NOT NULL,
  event_properties      JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view analytics events" ON public.analytics_events;
CREATE POLICY "Admins can view analytics events" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- lesson_logs
CREATE TABLE IF NOT EXISTS public.lesson_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lesson_id             TEXT,
  duration_seconds      INT,
  score                 INT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lesson_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view lesson logs" ON public.lesson_logs;
CREATE POLICY "Admins can view lesson logs" ON public.lesson_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- ai_logs
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  prompt_length         INT,
  response_length       INT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view ai logs" ON public.ai_logs;
CREATE POLICY "Admins can view ai logs" ON public.ai_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- payment_logs
CREATE TABLE IF NOT EXISTS public.payment_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id              TEXT,
  event_type            TEXT,
  payload               JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view payment logs" ON public.payment_logs;
CREATE POLICY "Admins can view payment logs" ON public.payment_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- crash_reports
CREATE TABLE IF NOT EXISTS public.crash_reports (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  error_message         TEXT NOT NULL,
  stack_trace           TEXT,
  device_info           JSONB,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crash_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view crash reports" ON public.crash_reports;
CREATE POLICY "Admins can view crash reports" ON public.crash_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- ── 10. ADMINISTRATION DOMAIN ───────────────────────────────────

-- admin_users
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role                  TEXT NOT NULL CHECK (role IN ('admin', 'super_admin', 'moderator')),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view admin users" ON public.admin_users;
CREATE POLICY "Admins can view admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

-- content_reviews
CREATE TABLE IF NOT EXISTS public.content_reviews (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type          TEXT NOT NULL CHECK (content_type IN ('vocab', 'grammar', 'kanji', 'lesson')),
  content_id            TEXT NOT NULL,
  reviewer_id           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status                TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments              TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage content reviews" ON public.content_reviews;
CREATE POLICY "Admins can manage content reviews" ON public.content_reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = auth.uid())
  );

COMMIT;
