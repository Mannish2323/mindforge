# Learn with Velmorth v2 — Database Schema

The database for Learn with Velmorth is built on **Supabase PostgreSQL**. Relational integrity, data constraints, and fine-grained Row Level Security (RLS) policies are configured directly in the database.

---

## Table Groups

### Group 1 — Identity & Subscriptions

#### `profiles`
Holds the core user profile details linked to `auth.users`.
- `id` (UUID, PK) — References `auth.users(id)`
- `username` (TEXT, Unique) — The user's screen handle
- `display_name` (TEXT) — Public display name
- `avatar_url` (TEXT) — URL to profile photo
- `bio` (TEXT) — User bio details
- `created_at` / `updated_at` (TIMESTAMPTZ)

#### `user_settings`
User-specific preferences and configs.
- `user_id` (UUID, PK) — References `auth.users(id)`
- `theme` (TEXT) — 'dark' | 'light' | 'system'
- `ui_language` (TEXT) — Interface language (default: 'en')
- `tts_enabled` (BOOLEAN) — Text-to-speech enabled flag
- `goal_minutes` (INT) — Daily study goal duration target (default: 10 mins)
- `notifications` (BOOLEAN) — Toggle for push reminders
- `jlpt_target` (TEXT) — 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
- `heart_system_enabled` (BOOLEAN)
- `heart_recovery_mode` (TEXT) — 'time' | 'watch_ad' | 'gem'

#### `user_stats`
Aggregated progress metrics and virtual currencies.
- `user_id` (UUID, PK) — References `auth.users(id)`
- `xp_total` (INT) — Cumulative XP earned
- `xp_today` (INT) — Daily XP score
- `gems_balance` (INT) — Virtual gem balance
- `lessons_done` (INT) — Lessons completed
- `words_learned` (INT)
- `reviews_done` (INT)
- `kanji_learned` (INT)
- `speak_sessions` (INT)
- `hearts_total` / `hearts_max` (INT)

#### `user_streaks`
Streak accounting values.
- `user_id` (UUID, PK) — References `auth.users(id)`
- `streak` (INT) — Current continuous days
- `longest` (INT) — Max historical streak
- `freeze_count` (INT) — Saved streak freezes owned
- `last_study_at` (DATE) — Date of last study completion

#### `entitlements` (Subscriptions)
Tracks product tiers, subscription validity, and features limits.
- `user_id` (UUID, PK) — References `auth.users(id)`
- `plan_id` (TEXT) — 'free' | 'starter' | 'plus' | 'pro'
- `status` (TEXT) — 'free' | 'starter' | 'plus' | 'pro' | 'yearly' | 'cancelled'
- `hearts_limit` (INT)
- `ai_limit_daily` (INT)
- `lessons_limit_daily` (INT)
- `ads_enabled` (BOOLEAN)
- `starts_at` / `ends_at` (TIMESTAMPTZ)
- `razorpay_order_id` (TEXT)
- `razorpay_payment_id` (TEXT)

---

### Group 2 — Learning & Progress

#### `lesson_progress`
Status of users' progress per lesson.
- `id` (UUID, PK)
- `user_id` (UUID) — References `auth.users(id)`
- `lesson_id` (TEXT) — Lesson identifier
- `status` (TEXT) — 'locked' | 'available' | 'in_progress' | 'completed'
- `xp_earned` (INT)
- `score` (INT)
- `attempts` (INT)
- `completed_at` (TIMESTAMPTZ)

#### `review_queue`
Spaced Repetition System (SRS) review parameters mapped to the SM-2 algorithm.
- `id` (UUID, PK)
- `user_id` (UUID) — References `auth.users(id)`
- `word_id` (TEXT) — References vocabulary or kanji
- `ease_factor` (FLOAT) — SM-2 difficulty multiplier (default: 2.5)
- `interval_days` (INT) — Days until next review (default: 1)
- `repetitions` (INT) — Successful recalls count
- `next_review_at` (TIMESTAMPTZ)
- `last_reviewed_at` (TIMESTAMPTZ)

#### `jlpt_progress`
Tracks question-level logs for placement assessments.
- `id` (UUID, PK)
- `user_id` (UUID)
- `level` (TEXT) — JLPT level
- `category` (TEXT) — Vocabulary, grammar, kanji
- `question_id` (TEXT)
- `correct` (BOOLEAN)
- `attempted_at` (TIMESTAMPTZ)

---

### Group 3 — System & Access Control

#### `admin_roles`
Role-Based Access Control (RBAC) mapping table.
- `user_id` (UUID, PK) — References `auth.users(id)`
- `role` (TEXT) — 'admin' | 'super_admin' | 'moderator'
- `granted_by` (UUID)
- `granted_at` (TIMESTAMPTZ)

#### `moderation_reports`
User and content flags filed by students or moderators.
- `id` (UUID, PK)
- `reporter_id` (UUID)
- `target_user_id` (UUID)
- `target_type` (TEXT) — 'user' | 'content' | 'chat' | 'other'
- `reason` (TEXT)
- `status` (TEXT) — 'pending' | 'reviewed' | 'resolved' | 'dismissed'

#### `activity_logs`
High-frequency security and transactional audit log.
- `id` (UUID, PK)
- `user_id` (UUID)
- `action` (TEXT)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ)

---

## Security Policies (RLS)
Every table has **Row Level Security** enabled. Core policy templates verify that users can only select, update, or delete data belonging to their own `auth.uid()`, while allowing public read on specific entities like profiles (for leaderboards) or badges.
