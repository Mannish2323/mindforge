# Learn with Velmorth v2 — Complete Production Function Map

This document outlines the master architecture and functional specifications of the Velmorth learning ecosystem, covering all 15 production pillars.

> [!IMPORTANT]
> **Strict Operational Requirement:**
> Velmorth runs strictly as an **online-only application**. To prevent data inconsistency, progression desynchronization, and plan bypasses, the app requires an active internet connection at all times. Offline access is fully blocked.

---

## 1. Authentication & Onboarding
* **Splash Screen:**
  * Animated Sakura-gradient logo.
  * Active session validation, database health checks, client/server version alignment, and internet connectivity verification. If no connection is found, access is immediately blocked.
* **Authentication Gateway:**
  * Secure email/password login, Google/OAuth integrations, magic link flows, and session persistence configuration.
* **Onboarding Wizard:**
  * Username setup, avatar/mascot selection, native language definition, daily study targets (10, 15, 30, or 60 min), target JLPT levels (N5 to N1), and starting course placement redirects.

## 2. Dashboard
* **Dynamic Daily Widgets:**
  * Personal greeting, daily inspirational quote, and active notifications tray.
* **Gamification Indicators:**
  * Real-time XP balance, active streaks tracking, heart counter, and custom daily goal tracking.
* **Actions Panel:**
  * Continue learning shortcut cards, weak area revision pointers, community feed previews, unlockable daily bonuses, and achievements progress trackers.

## 3. Learning Engine
* **Curriculum Layers:**
  * Courses, modules (representing units), and interactive lessons gating.
* **Core Topics:**
  * Vocabulary lists, grammar structure builders, kanji stroke trackers, listening shadowing interfaces, and speaking/reading evaluations.
* **SRS Queue & Revision:**
  * Spaced Repetition (SRS) cards lookup, mistake reviews dashboard, and JLPT practice mocks.
* **Progression Rewards:**
  * XP level triggers, certificate unlocks, and custom badges.

## 4. Sakura AI
* **Conversational Tutor:**
  * Interacted Gemini chat window with Japanese explanation models, pronunciation analysis, translation lookups, and context memory.
* **Usage Enforcement:**
  * Daily limit checks comparing user plan credentials with database requests counters, saving chat records, and tracking current token usage.

## 5. Premium Subscriptions
* **Subscription Management:**
  * Tier check dialogs (Monthly, Yearly, Student), coupon validation, and referral logic.
* **Razorpay Gateway:**
  * Native Razorpay integrations, webhook processing, signature validations, and payment receipt logging.
* **Subscribers Perks:**
  * Unlimited hearts, extended AI limits, customized card decks, and complete billing/invoice histories.

## 6. Community & Social
* **Feeds & Actions:**
  * User posts, commenting, follows, friend invitations, and weekly rank leaderboards.
* **Moderation Panel:**
  * User blocklists, report queues, and community flags.

## 7. Profile & Settings
* **Metrics Summary:**
  * Personal stats, bookmarks list, badge achievements, and printable certificates.
* **Settings Panel:**
  * Theme configurations, notification time pickers, and delete account flows.

## 8. Notifications
* **Alert Types:**
  * Lesson reminders, revision alerts, leaderboard status changes, and billing notifications.
* **Delivery:**
  * Email alerts and system push notifications.

## 9. Admin Panel (Role-Gated)
* **Statistics & Charts:**
  * Live user metrics, subscription sales, and server health tracking.
* **CMS Workspace:**
  * Lesson builders, vocabulary dictionaries import, grammar points updates, and audio library loaders.

## 10. Backend (Supabase Engine)
* **Database & Auth:**
  * PostgreSQL databases, client JWT authentications, and Row Level Security (RLS) tables constraints.
* **Edge Routing:**
  * Server actions, daily reset cron jobs, rate limiters, and server-side log exports.

## 11. Security & Guards
* **Auth Verification:**
  * Strict JWT validations, role-based controls (RBAC), and sanitization pipelines.
* **Abuse Protection:**
  * Edge rate limiting and bot filters.

## 12. Analytics
* **User Engagement:**
  * Daily/weekly active tracking, user retention, and lesson completion funnels.
* **Server Health:**
  * Error logs tracking, crash report feeds, and performance audits.

## 13. Mobile & Web Specifics
* **Web Features:**
  * PWA install prompts, keyboard shortcuts, and responsive desktop configurations.
* **Online Synchronization:**
  * Real-time sync queues, online validation blocks, active Web Audio API rendering, and system haptic feedbacks.

