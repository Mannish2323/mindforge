# LEARN WITH VELMORTH — DATABASE ARCHITECTURE
## Section 9: Complete Database Architecture

---

## 9.1 DATABASE LAYOUT OVERVIEW

Learn With Velmorth leverages a hybrid database configuration:
1. **Supabase (PostgreSQL)**: Serves as the primary transactional database (OLTP). It maintains all relational models (profiles, streaks, stats, course progress, spaced repetition schedules, subscriptions, and security rules).
2. **Firebase Firestore**: Captures high-frequency telemetry logs, specifically tracking daily active logging data (such as XP history charts).

---

## 9.2 PRIMARY TRANSACTIONAL STORE — SUPABASE POSTGRESQL

All core application schemas are deployed under the `public` schema in the Supabase PostgreSQL database. Row-Level Security (RLS) is configured on all user-owned data tables to validate authenticated actions.

### 1. `profiles` Table
Stores user public profiles data.
- **Fields**:
  - `id`: `UUID` (Primary Key, references `auth.users(id)`)
  - `username`: `TEXT` (Unique, index defined)
  - `display_name`: `TEXT`
  - `avatar_url`: `TEXT`
  - `bio`: `TEXT`
  - `created_at`: `TIMESTAMPTZ`
  - `updated_at`: `TIMESTAMPTZ`
- **Security Policies**: Public read; select/insert/update allowed matching `auth.uid()`.

### 2. `user_settings` Table
Holds UI preferences and study parameters.
- **Fields**:
  - `user_id`: `UUID` (Primary Key, references `auth.users(id)`)
  - `theme`: `TEXT` (`dark`, `light`, or `system`)
  - `ui_language`: `TEXT`
  - `tts_enabled`: `BOOLEAN`
  - `goal_minutes`: `INT`
  - `notifications`: `BOOLEAN`
  - `jlpt_target`: `TEXT` (`N5` through `N1`)
  - `heart_system_enabled`: `BOOLEAN`
  - `heart_recovery_mode`: `TEXT` (`time`, `watch_ad`, or `gem`)
  - `heart_recovery_hours`: `INT`
  - `updated_at`: `TIMESTAMPTZ`

### 3. `user_stats` Table
Tracks user balances, limits, and aggregate study statistics.
- **Fields**:
  - `user_id`: `UUID` (Primary Key, references `auth.users(id)`)
  - `xp_total`: `INT`
  - `xp_today`: `INT`
  - `gems_balance`: `INT`
  - `lessons_done`: `INT`
  - `words_learned`: `INT`
  - `reviews_done`: `INT`
  - `kanji_learned`: `INT`
  - `speak_sessions`: `INT`
  - `hearts_total`: `INT`
  - `hearts_used_today`: `INT`
  - `hearts_max`: `INT`
  - `hearts_recover_at`: `TIMESTAMPTZ`
  - `hearts_last_debit_at`: `TIMESTAMPTZ`
  - `last_active`: `DATE`

### 4. `user_streaks` Table
Streak calculation registry.
- **Fields**:
  - `user_id`: `UUID` (Primary Key, references `auth.users(id)`)
  - `streak`: `INT`
  - `longest`: `INT`
  - `freeze_count`: `INT`
  - `last_study_at`: `DATE`

### 5. `entitlements` Table
Manages active plans, subscription tiers, and payment verifications.
- **Fields**:
  - `user_id`: `UUID` (Primary Key, references `auth.users(id)`)
  - `plan_id`: `TEXT` (`free`, `starter`, `plus`, or `pro`)
  - `status`: `TEXT` (`free`, `starter`, `plus`, `pro`, `yearly`, or `cancelled`)
  - `hearts_limit`: `INT`
  - `ai_limit_daily`: `INT`
  - `lessons_limit_daily`: `INT`
  - `ads_enabled`: `BOOLEAN`
  - `starts_at`: `TIMESTAMPTZ`
  - `ends_at`: `TIMESTAMPTZ`
  - `razorpay_order_id`: `TEXT`
  - `razorpay_payment_id`: `TEXT`

### 6. `lesson_progress` Table
Tracks completion stats of individual course lesson nodes.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID`
  - `lesson_id`: `TEXT` (matches JSON definitions files)
  - `status`: `TEXT` (`locked`, `available`, `in_progress`, or `completed`)
  - `xp_earned`: `INT`
  - `score`: `INT`
  - `attempts`: `INT`
  - `completed_at`: `TIMESTAMPTZ`

### 7. `review_queue` Table
Maintains the Spaced Repetition (SRS) queue.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID`
  - `word_id`: `TEXT`
  - `ease_factor`: `FLOAT` (default `2.5`)
  - `interval_days`: `INT`
  - `repetitions`: `INT`
  - `next_review_at`: `TIMESTAMPTZ`
  - `last_reviewed_at`: `TIMESTAMPTZ`

### 8. `badges` & `user_badges` Tables
Reward badges definitions and user unlock maps.
- **`badges` Fields**: `id` (`TEXT` Primary Key), `name`, `description`, `icon`, `rarity` (`common`, `rare`, `epic`, or `legendary`), `condition` (`JSONB`).
- **`user_badges` Fields**: `id` (`UUID`), `user_id`, `badge_id` (foreign key), `earned_at`.

### 9. `jlpt_progress` Table
Tracks question outcomes for JLPT readiness analysis.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID`
  - `level`: `TEXT` (`N5` through `N1`)
  - `category`: `TEXT`
  - `question_id`: `TEXT`
  - `correct`: `BOOLEAN`
  - `attempted_at`: `TIMESTAMPTZ`

### 10. `user_learned_words` Table
Tracks which vocabulary items have been fully taught.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID`
  - `word_id`: `TEXT`
  - `quiz_eligible`: `BOOLEAN` (disabled during teaching, enabled once completed)
  - `first_seen_at`: `TIMESTAMPTZ`
  - `learn_count`: `INTEGER`
  - `last_seen_at`: `TIMESTAMPTZ`

### 11. `usage_counters` & `usage_log` Tables
Throttles user daily thresholds (hearts, AI requests, lessons).
- **`usage_counters` Fields**: `user_id`, `date` (`DATE`), `ai_requests` (`INT`), `lessons_started` (`INT`), `hearts_used` (`INT`).
- **`usage_log` Fields**: `id`, `user_id`, `event_type` (`heart_lost`, `gem_spent`, etc.), `amount`, `balance_after`, `metadata` (`JSONB`), `created_at`.

### 12. `ai_chat_messages` Table
Maintains AI chat history.
- **Fields**:
  - `id`: `UUID` (Primary Key)
  - `user_id`: `UUID`
  - `role`: `TEXT` (`user` or `assistant`)
  - `content`: `TEXT`
  - `session_id`: `TEXT`
  - `created_at`: `TIMESTAMPTZ`

### 13. Administrative & Auditing Tables
- **`admin_roles`**: Identifies user roles (`admin`, `super_admin`, `moderator`).
- **`moderation_reports`**: Logs safety/content moderation reports.
- **`activity_logs`**: Tracks general user UI clicks and milestones.
- **`admin_audit_logs`**: Secure log audits of admin actions.

---

## 9.3 TELEMETRY & LOGGING — FIREBASE FIRESTORE

Firestore is structured as a NoSQL document database used specifically to log chronologically detailed study records.

### Collection: `users` Subcollection `dailyLogs`
Logs daily stats for user dashboard charts.
- **Document Path**: `/users/{userId}/dailyLogs/{logDate}` (e.g. `/users/123-abc/dailyLogs/2026-06-22`)
- **Document Fields**:
  ```json
  {
    "date": "string (YYYY-MM-DD)",
    "xpEarned": "number",
    "lessonsCompleted": "number"
  }
  ```
