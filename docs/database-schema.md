# 📄 Learning Velmorth v3

# Document 3 — Complete Database Architecture & Security Blueprint

---

# 1. Database Overview

**Database Provider:** Supabase PostgreSQL

Learning Velmorth uses a single centralized PostgreSQL database managed by Supabase. All application data—including authentication, learning progress, AI conversations, premium subscriptions, notifications, and analytics—is stored in a structured relational schema protected by Row Level Security (RLS).

## Core Principles

* Single source of truth
* UUID primary keys
* Soft deletes where appropriate
* Automatic timestamps (`created_at`, `updated_at`)
* Strict foreign key constraints
* Row Level Security enabled by default
* Audit logging for important operations

---

# 2. High-Level Architecture

```text
Client (Web / Android / PWA)
        │
        ▼
Authentication (Google OAuth via Supabase)
        │
        ▼
API Routes / Server Actions
        │
        ▼
Business Logic Layer
        │
        ▼
Supabase PostgreSQL
        │
        ├── Storage Buckets
        ├── Realtime
        ├── Edge Functions
        └── Analytics
```

---

# 3. Database Domains

## Identity

* profiles
* user_settings
* user_preferences
* user_roles
* subscriptions
* devices
* sessions

---

## Learning

* courses
* modules
* lessons
* lesson_sections
* vocabulary
* grammar_topics
* kanji
* dialogues
* reading_lessons
* listening_lessons
* speaking_lessons
* writing_lessons

---

## Practice

* quizzes
* quiz_questions
* quiz_attempts
* review_queue
* writing_sessions
* speaking_sessions

---

## Progress

* course_progress
* module_progress
* lesson_progress
* vocabulary_progress
* grammar_progress
* kanji_progress
* writing_progress
* speaking_progress
* reading_progress
* listening_progress
* achievements
* bookmarks

---

## Sakura AI

* ai_conversations
* ai_messages
* ai_recommendations
* ai_usage_logs

---

## Community

* posts
* comments
* reactions
* friendships
* leaderboard_snapshots

---

## Premium

* subscription_plans
* orders
* payments
* invoices
* feature_entitlements

---

## Notifications

* notifications
* notification_preferences
* notification_history

---

## Analytics

* analytics_events
* lesson_logs
* ai_logs
* payment_logs
* crash_reports

---

## Administration

* admin_users
* admin_logs
* content_reviews
* moderation_reports

---

# 4. Authentication

Supported Login

* Google Sign-In (Primary)

Future Support

* Apple Sign-In
* Email Sign-In

Authentication Flow

```text
Google Login
      ↓
Supabase OAuth
      ↓
JWT Created
      ↓
Profile Created
      ↓
Settings Created
      ↓
Subscription Initialized
      ↓
Dashboard
```

---

# 5. Row Level Security (RLS)

Every table follows the principle of least privilege.

## Public Read

* courses
* modules
* lessons
* vocabulary
* grammar_topics
* kanji

## Owner Only

* profiles
* progress tables
* bookmarks
* conversations
* notifications
* settings
* subscriptions

## Admin Only

* admin_logs
* analytics
* moderation
* payment administration

No client may bypass RLS.

---

# 6. Data Processing Flow

```text
User Action
      ↓
Input Validation
      ↓
Authentication Check
      ↓
Authorization (RLS)
      ↓
Business Logic
      ↓
Database Write
      ↓
Realtime Event
      ↓
Frontend Update
```

---

# 7. Lesson Progress Flow

```text
Open Lesson
      ↓
Load Lesson
      ↓
Vocabulary
      ↓
Grammar
      ↓
Practice
      ↓
Quiz
      ↓
Score Calculation
      ↓
XP Update
      ↓
Achievement Check
      ↓
Progress Save
      ↓
Unlock Next Lesson
```

---

# 8. Sakura AI Flow

```text
User Prompt
      ↓
Validation
      ↓
Conversation Context
      ↓
Gemini API
      ↓
Safety Check
      ↓
AI Response
      ↓
Store Conversation
      ↓
Generate Recommendation
      ↓
Update Dashboard
```

API keys remain server-side and are never exposed to the client.

---

# 9. Notification Lifecycle

```text
Event Created
      ↓
Notification Stored
      ↓
Push Notification Sent
      ↓
Notification Animation
      ↓
User Taps
      ↓
Navigate to Target Screen
      ↓
Mark as Read
      ↓
Unread Counter Updates
      ↓
Move to History
```

Notifications remain unread until explicitly opened.

---

# 10. Storage Buckets

* avatars
* certificates
* lesson-images
* lesson-audio
* kanji-assets
* downloads
* community-media
* ai-assets
* application-assets

All buckets use signed URLs where required.

---

# 11. Security Model

Authentication

* Google OAuth
* JWT sessions
* Refresh tokens
* Secure logout

API

* HTTPS only
* Server-side secrets
* Input validation
* Rate limiting

Database

* RLS enabled
* Foreign keys
* UUID IDs
* Audit logs

Payments

* Razorpay signature verification
* Server-side verification
* Subscription synchronization

AI

* Server-side Gemini requests
* Prompt validation
* Usage limits
* Conversation ownership

---

# 12. Backup & Recovery

* Automatic daily backups
* Weekly snapshots
* Monthly archives
* Disaster recovery testing
* Point-in-time recovery (where available)

---

# 13. Offline Synchronization

```text
Offline
      ↓
Local Queue
      ↓
Reconnect
      ↓
Sync Changes
      ↓
Conflict Resolution
      ↓
Database Updated
```

Offline changes are synchronized automatically when connectivity returns.

---

# 14. Performance Strategy

* Indexed foreign keys
* Query pagination
* Lazy loading
* Optimized images
* Background synchronization
* Cached lesson metadata
* Realtime only for required features

---

# 15. Compliance & Privacy

* User data isolated through RLS
* Secure account deletion workflow
* Export user data on request
* Notification preferences respected
* Conversation ownership enforced
* Payment information never stored beyond required references

---

# 16. Production Checklist

Database

* UUID Primary Keys
* Foreign Keys
* Indexes
* Constraints
* RLS Enabled

Authentication

* Google OAuth
* Session Refresh
* Secure Logout

Learning

* Progress Tracking
* Review Queue
* Achievements
* XP Engine

AI

* Secure API Gateway
* Conversation History
* Usage Tracking

Payments

* Razorpay Verification
* Subscription Sync

Notifications

* Push Delivery
* Read Status
* Badge Counter
* History

Infrastructure

* Storage
* Edge Functions
* Realtime
* Monitoring
* Backups

---

# Final Architecture Principles

* One Google Authentication System
* One Supabase Project
* One PostgreSQL Database
* One Shared API Layer
* One Notification Engine
* One Sakura AI Engine
* One Progress Engine
* One Responsive Frontend
* Secure by Default
* Production Ready
* Scalable for Future Features
