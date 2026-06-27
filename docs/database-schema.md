# Learn with Velmorth Complete Database Schema & ER Diagram (Production)

# Database Overview

```text
Supabase PostgreSQL

├── Identity
├── Learning Content
├── User Progress
├── Sakura AI
├── Community
├── Premium
├── Notifications
├── Analytics
├── Administration
└── System
```

---

# 1️⃣ Identity Module

```text
profiles
│
├── id (UUID)
├── auth_id
├── username
├── full_name
├── email
├── avatar_url
├── bio
├── country
├── timezone
├── preferred_language
├── current_jlpt
├── target_jlpt
├── role
├── created_at
└── updated_at

↓

user_settings

↓

user_roles

↓

subscriptions
```

Relations

```
profiles
│
├── 1 → 1 user_settings
├── 1 → 1 user_stats
├── 1 → many notifications
├── 1 → many achievements
├── 1 → many progress
├── 1 → many ai_conversations
└── 1 → many payments
```

---

# 2️⃣ Learning Content

```text
courses

↓

modules

↓

lessons

↓

lesson_sections

↓

lesson_blocks
```

Vocabulary

```text
vocabulary

↓

vocabulary_examples

↓

vocabulary_audio
```

Grammar

```text
grammar_topics

↓

grammar_examples

↓

grammar_quizzes
```

Kanji

```text
kanji

↓

kanji_strokes

↓

kanji_examples
```

Reading

```text
reading_passages

↓

reading_questions
```

Listening

```text
listening_lessons

↓

audio_files

↓

questions
```

Speaking

```text
speaking_lessons

↓

pronunciation_checks
```

Writing

```text
writing_lessons

↓

stroke_order

↓

writing_feedback
```

---

# 3️⃣ User Progress

```text
user_progress

↓

lesson_progress

↓

module_progress

↓

course_progress

↓

vocabulary_progress

↓

grammar_progress

↓

kanji_progress

↓

reading_progress

↓

writing_progress

↓

speaking_progress

↓

listening_progress
```

Achievements

```text
achievements

↓

user_achievements
```

Bookmarks

```text
bookmarks
```

Downloads

```text
downloads
```

Review Queue

```text
review_queue

↓

flashcards

↓

review_history
```

---

# 4️⃣ Sakura AI Module

```text
ai_conversations

↓

ai_messages

↓

ai_memory

↓

ai_usage

↓

ai_feedback

↓

ai_recommendations
```

Flow

```
User

↓

Conversation

↓

Messages

↓

Gemini Response

↓

Conversation Summary

↓

Recommendation

↓

Notification
```

---

# 5️⃣ Community Module

```text
posts

↓

comments

↓

likes

↓

saved_posts

↓

friends

↓

friend_requests

↓

study_groups

↓

leaderboards
```

---

# 6️⃣ Premium Module

```text
plans

↓

subscriptions

↓

payments

↓

payment_history

↓

billing_history

↓

premium_features
```

---

# 7️⃣ Notification Module

```text
notifications

↓

notification_preferences

↓

push_tokens

↓

scheduled_notifications
```

---

# 8️⃣ Analytics Module

```text
analytics_events

↓

screen_views

↓

button_clicks

↓

lesson_logs

↓

ai_logs

↓

payment_logs
```

---

# 9️⃣ Admin Module

```text
admin_users

↓

admin_logs

↓

content_versions

↓

feature_flags

↓

audit_logs
```

---

# 🔟 System Module

```text
app_versions

↓

maintenance

↓

error_logs

↓

crash_reports

↓

api_keys

↓

system_settings
```

---

# Complete ER Diagram

```text
profiles
│
├────────────┐
│            │
▼            ▼
user_settings    subscriptions
│
▼
user_stats
│
├──────────────┐
│              │
▼              ▼
user_progress  notifications
│
├──────────────┐
│              │
▼              ▼
course_progress
module_progress
lesson_progress
│
▼
review_queue
│
▼
flashcards

courses
│
▼
modules
│
▼
lessons
│
├──────────────┬───────────────┬──────────────┬──────────────┐
▼              ▼               ▼              ▼
grammar     vocabulary      kanji       quizzes
│              │               │
▼              ▼               ▼
examples    examples      stroke_order

profiles
│
▼
ai_conversations
│
▼
ai_messages
│
▼
ai_feedback

profiles
│
▼
posts
│
▼
comments
│
▼
likes

profiles
│
▼
payments
│
▼
subscriptions
│
▼
premium_features
```

---

# Storage Buckets

```text
avatars
course-images
lesson-audio
kanji-images
certificates
downloads
ai-assets
app-assets
community-media
```

---

# Row Level Security (RLS)

```text
profiles
✔ Owner Only

user_progress
✔ Owner Only

subscriptions
✔ Owner Only

payments
✔ Owner Only

notifications
✔ Owner Only

community_posts
✔ Public Read

courses
✔ Public Read

lessons
✔ Public Read

admin_tables
✔ Admin Only
```

---

# Database Statistics

```text
Total Tables : 50+

Identity : 6

Learning : 15

Progress : 12

AI : 6

Community : 6

Premium : 5

Analytics : 6

Administration : 5

System : 6
```

---

# Production Rules

* UUID Primary Keys
* Foreign Keys on all relations
* Composite unique keys for progress tables
* Soft delete where required
* Row Level Security enabled
* Automatic timestamps (`created_at`, `updated_at`)
* Database triggers for XP, streaks, and achievements
* Edge Functions for AI, payments, notifications, and scheduled jobs
* Indexed columns for search, lessons, vocabulary, and user progress
* Daily backups and audit logging enabled
