# Learn with Velmorth v2 — Master Architecture & Build Blueprint

> **Product Vision:** An AI-powered Japanese language learning SaaS platform that helps users progress from absolute beginner to JLPT N1, preparing them for real-world communication and careers in Japan.
> Runs as a responsive web app, PWA, Android APK (Capacitor), and desktop browser — from **one codebase, one backend, one database, one payment system.**

---

## System Architecture Overview

```
Clients
├── Next.js Web App (Browser)
├── PWA (Installable)
├── Android APK (Capacitor)
└── Admin Panel (/admin route group)

         │
         ▼

Shared Application Layer
├── Presentation Layer      ← UI, Design System, Motion, Accessibility
├── Feature Layer           ← All product features (Auth, Learn, AI, Premium...)
├── Domain Layer            ← Business Logic Engines
├── Data Layer              ← Supabase, Repositories, Cache, Edge Functions
└── Infrastructure Layer    ← Logging, Analytics, Flags, Monitoring

         │
         ▼

Supabase Backend
├── Auth
├── PostgreSQL
├── Storage
├── Realtime
└── Edge Functions

         │
         ▼

External Services
├── Google Gemini API     ← Sakura AI Engine
├── Razorpay              ← Payments
└── Vercel                ← Deployment
```

> **Golden Rule:** All AI requests go through a server-side Edge Function or server action — never called directly from the client. API keys, prompt engineering, rate limiting, and usage tracking all live server-side.

---

## Technology Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Micro-animations | Lottie, Rive |
| Server State | TanStack Query (React Query) |
| Client State | Zustand |
| Forms | React Hook Form + Zod |
| Validation | Zod |

### Backend

| Layer | Technology |
|---|---|
| Auth | Supabase Auth (JWT) |
| Database | PostgreSQL (via Supabase) |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Server Logic | Edge Functions + Server Actions |

### AI

| Layer | Technology |
|---|---|
| AI Engine | Google Gemini API |
| Gateway | Server-side Edge Function (never client-direct) |
| Persona | Sakura AI Assistant |

### Infrastructure

| Layer | Technology |
|---|---|
| Payments | Razorpay |
| Deployment | Vercel |
| Android | Capacitor |
| Monitoring | Sentry (Phase 14+) |
| Feature Flags | Custom feature_flags table or Posthog |
| Analytics | Custom analytics_events table |

---

## Five-Layer Architecture

### Layer 1 — Presentation Layer

Responsible for everything the user sees and interacts with.

| Sub-system | Responsibility |
|---|---|
| Design System | Tokens, components, typography, spacing, color palette |
| Motion System | Page transitions, micro-interactions, scroll animations, Framer Motion config |
| Responsive Layout | Mobile-first grid, breakpoint strategy, adaptive components |
| Accessibility | ARIA, keyboard navigation, focus management, contrast compliance |
| Theme Engine | Dark/light mode, data-theme tokens, persisted preference |

> **Design rule:** All spacing, color, font-size, and radius values must reference design tokens — never hardcoded pixel values. UI components never contain business logic.

---

### Layer 2 — Feature Layer

Each feature is a self-contained unit with its own `components/`, `hooks/`, and `services/` sub-folders.

| Feature | Scope |
|---|---|
| Authentication | Login, signup, OAuth, magic link, session management |
| Dashboard | Greeting, daily goal, XP, level, streak, quick actions, recommendations |
| Learn | JLPT path, course → module → lesson → quiz flow |
| Vocabulary | Flashcards, word detail, usage examples, favorites |
| Grammar | Topic explanations, examples, practice drills |
| Kanji | Writing canvas, stroke order, readings, mnemonic |
| Reading | Passage practice, furigana toggle, comprehension questions |
| Listening | Audio lessons, shadowing, comprehension quizzes |
| Writing | Kana/kanji canvas, stroke feedback, corrections |
| Speaking | Pronunciation recording, phonetic feedback |
| AI Sakura | Chat interface, contextual help, personalized recommendations |
| Progress | Stats, skill breakdown, history, weakness heatmap |
| Community | Feed, posts, comments, friend activity |
| Leaderboard | Weekly/monthly XP rankings, friend leaderboard |
| Premium | Plan comparison, Razorpay checkout, entitlement gating |
| Admin | CMS for content, user management, analytics, payment reports |

---

### Layer 3 — Domain Layer

Pure business logic. No Supabase calls, no UI code — framework-agnostic and fully testable.

| Engine | Responsibility |
|---|---|
| XP Engine | Calculate XP earned per lesson, quiz, practice, and streak bonus |
| Streak Engine | Daily streak check, grace period rules, freeze logic, reset rules |
| SRS Review Engine | Spaced repetition scheduling: interval, ease factor, due date calculation |
| Achievement Engine | Monitor trigger events, evaluate conditions, award badges |
| Lesson Unlock Rules | Prerequisites, completion gates, JLPT level gates |
| Daily Goal Engine | Goal setting, progress tracking, completion rewards, push trigger |
| Notification Rules | When and what to notify: lesson reminders, streak alerts, achievement unlocks |
| AI Usage Rules | Free-tier limits, premium allowances, abuse detection thresholds |

> **Domain rule:** These engines are called by services and server actions. They return computed results. They never write to the database directly.

---

### Layer 4 — Data Layer

Handles all data access, mutations, and synchronisation.

| Sub-system | Responsibility |
|---|---|
| Supabase Client | Typed query client, shared across server and browser |
| Repositories | Domain-specific query/mutation abstractions (e.g., lessonRepository, progressRepository) |
| Server Actions | Secure Next.js mutations — called from client, executed server-side |
| Edge Functions | Sensitive async logic — AI gateway, payment verification, webhook handling |
| Cache Layer | TanStack Query cache for read-heavy data; revalidation strategy per entity type |
| Queries | Named query functions used by repositories, never duplicated across features |

---

### Layer 5 — Infrastructure Layer

Runs silently in the background for every request and action.

| Sub-system | Responsibility |
|---|---|
| Analytics | Event tracking to analytics_events table; product funnel insights |
| Logging | Structured logs to app_logs; errors forwarded to Sentry |
| Monitoring | Uptime, Core Web Vitals, API response times |
| Error Handling | Centralised error boundaries, typed error classes, user-facing error messages |
| Feature Flags | feature_flags table with per-user/per-role overrides for gradual rollout |
| Environment Config | env.ts typed wrapper for all process.env values; no direct access in features |

---

## Folder Structure

```
src/
├── app/
│   ├── (marketing)/          ← Landing, pricing, about (pre-login)
│   ├── (auth)/               ← Login, signup, forgot-password
│   ├── (app)/                ← Protected app routes (post-login)
│   │   ├── dashboard/
│   │   ├── learn/
│   │   ├── vocabulary/
│   │   ├── grammar/
│   │   ├── kanji/
│   │   ├── reading/
│   │   ├── listening/
│   │   ├── writing/
│   │   ├── speaking/
│   │   ├── ai/
│   │   ├── progress/
│   │   ├── community/
│   │   ├── leaderboard/
│   │   ├── premium/
│   │   └── profile/
│   ├── (admin)/              ← Admin CMS routes (role-gated)
│   ├── api/                  ← Thin API routes (webhooks, Razorpay, edge proxies)
│   └── layout.tsx
│
├── components/
│   ├── ui/                   ← Atoms: Button, Input, Badge, Card, Modal, Toast
│   ├── layout/               ← Header, Sidebar, BottomNav, PageShell
│   ├── shared/               ← Cross-feature composed components
│   └── motion/               ← Animation wrappers, transitions, Lottie/Rive players
│
├── features/
│   ├── auth/
│   ├── onboarding/
│   ├── dashboard/
│   ├── learn/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── vocabulary/
│   ├── grammar/
│   ├── kanji/
│   ├── reading/
│   ├── listening/
│   ├── writing/
│   ├── speaking/
│   ├── ai-sakura/
│   ├── progress/
│   ├── community/
│   ├── leaderboard/
│   ├── premium/
│   └── admin/
│
├── domain/
│   ├── xp-engine.ts
│   ├── streak-engine.ts
│   ├── srs-engine.ts
│   ├── achievement-engine.ts
│   ├── lesson-unlock.ts
│   ├── daily-goal-engine.ts
│   ├── notification-rules.ts
│   └── ai-usage-rules.ts
│
├── lib/
│   ├── supabase/             ← Client, server, middleware setup
│   ├── auth/                 ← Session helpers, role utilities
│   ├── ai/                   ← Gemini gateway, prompt templates, response formatters
│   ├── payments/             ← Razorpay helpers, order creation, signature verification
│   ├── analytics/            ← Event tracking helpers
│   └── validations/          ← Shared Zod schemas
│
├── services/
│   ├── repositories/         ← Per-domain data access (lessonRepo, progressRepo...)
│   ├── queries/              ← Named query functions (never duplicated across features)
│   ├── commands/             ← Mutation commands (completeLesson, saveProgress...)
│   └── sync/                 ← Offline queue, optimistic update reconciliation
│
├── stores/                   ← Zustand stores (client-only state)
├── hooks/                    ← Shared custom hooks
├── types/                    ← Global TypeScript types + Supabase-generated types
├── constants/                ← JLPT levels, XP rules, plan limits, route names
├── utils/                    ← Pure utility functions
│
├── public/
│   ├── icons/
│   ├── images/
│   └── seed/                 ← JSON seed files (import-once, not runtime data)
│
├── supabase/
│   ├── migrations/           ← Versioned SQL migration files
│   ├── seed/                 ← Initial content seed scripts
│   ├── functions/            ← Edge Functions (AI gateway, payment webhook)
│   └── policies/             ← RLS policies as standalone SQL files
│
└── docs/
    ├── architecture.md
    ├── database-schema.md
    ├── api-contracts.md
    ├── feature-map.md
    └── build-order.md
```

---

## Database Schema

> **Content-first principle:** All lessons, vocabulary, grammar, and kanji live in Supabase. JSON files in `public/seed/` are used once for initial import only. All future content creation and editing happens through the Admin CMS — making it trivial to add N2/N1 content, new modules, or future language support without a single code change.

---

### Group 1 — Identity

```sql
profiles            -- Core user profile linked to auth.users
user_settings       -- Preferences: theme, notifications, daily goal target
user_stats          -- Aggregate stats: total XP, lessons completed, current level
user_streaks        -- Current streak, longest streak, last activity date, freeze count
subscriptions       -- Plan, status, period start/end, Razorpay subscription_id
user_roles          -- Role assignment: learner | admin | moderator | content_editor
```

---

### Group 2 — Learning Content

```sql
courses             -- Top-level courses (e.g., N5 Beginner Path)
modules             -- Sections within a course
lessons             -- Individual lessons within a module
lesson_sections     -- Content blocks within a lesson (vocab card, grammar note, audio...)
vocabulary          -- Word entries: word, reading, meaning, JLPT level
grammar_topics      -- Grammar rules, pattern, usage notes, examples
kanji               -- Character, readings, meanings, stroke count, JLPT level
sentences           -- Example sentences linked to vocab/grammar/kanji
dialogues           -- Conversation scripts for listening/speaking lessons
```

---

### Group 3 — Content Management

```sql
content_versions    -- Version history for all content (lesson_id, version, diff, author_id)
lesson_assets       -- Asset registry linking lessons to their media files
audio_assets        -- Audio file metadata (path, duration, language, speaker_type)
image_assets        -- Image file metadata (path, alt_text, dimensions, content_type)
translations        -- Multi-language UI strings (supports future language expansion)
```

> **Why content versioning matters:** If a grammar explanation contains an error, it can be rolled back from the Admin panel without any code deployment. This is a production requirement, not an optional feature.

---

### Group 4 — Practice

```sql
quizzes             -- Quiz definitions linked to a lesson or module
quiz_questions      -- Individual questions, options, correct answer, question type
quiz_attempts       -- Per-user attempt: score, time taken, answers submitted
writing_sessions    -- Kanji/kana writing practice attempt records
speaking_sessions   -- Pronunciation session records with audio reference
review_queue        -- SRS central engine: item_id, type, next_due, ease_factor, interval
```

---

### Group 5 — Progress

```sql
user_progress       -- Overall progress per course per user
lesson_progress     -- Per-lesson status: not_started | in_progress | completed
vocab_progress      -- Per-word SRS status and confidence score
grammar_progress    -- Per-topic mastery level
kanji_progress      -- Per-kanji recognition, writing, and reading scores
achievements        -- Earned achievement records with timestamp
bookmarks           -- Saved lessons, vocab, grammar topics per user
```

---

### Group 6 — AI

```sql
ai_conversations    -- Conversation threads with Sakura per user
ai_usage            -- Token usage per user per day (enforces plan-based limits)
ai_feedback         -- User ratings and flags on individual AI responses
ai_recommendations  -- AI-generated study recommendations per user with expiry date
```

---

### Group 7 — Community

```sql
posts               -- Community posts: text, optional media, optional linked lesson
comments            -- Threaded comments on posts
friendships         -- Friend connections with status: pending | accepted | blocked
leaderboard_snapshots -- Weekly/monthly XP snapshots for leaderboard generation
```

---

### Group 8 — System

```sql
notifications       -- In-app notification records per user
analytics_events    -- Product event stream (lesson_started, quiz_completed, premium_upgraded...)
app_logs            -- Server-side structured error and info logs
payment_events      -- Razorpay webhook event log for audit trail and debugging
feature_flags       -- Per-feature on/off with optional user/role scope overrides
```

---

## Key Workflows

### Learning Flow

```
Dashboard
  → Course → Module → Lesson
  → Vocab Block → Grammar Block → Kanji Block → Audio/Reading Block
  → Speaking Practice → Writing Practice
  → Quiz
  → XP Engine → Streak Engine → Achievement Engine
  → lesson_progress update → review_queue update
  → Cloud Sync → Next Lesson Unlock Check
  → Dashboard (updated state)
```

### Sakura AI Flow

```
User message
  → Client sends to /api/ai (server action)
  → AI Usage Rules check (plan limit enforcement)
  → Gemini API call (server-side only — never client-direct)
  → Response formatter + safety filter
  → ai_conversations insert
  → ai_usage increment
  → Progress recommendation evaluation
  → Response returned to client
```

### Premium Flow

```
User clicks Upgrade
  → Plan comparison screen
  → Razorpay order created (server action)
  → Razorpay payment sheet (client)
  → Payment success → webhook received (Edge Function)
  → Signature verified server-side
  → subscriptions table updated
  → payment_events logged
  → Entitlement cache refreshed
  → Premium features unlocked
```

### SRS Review Flow

```
review_queue: fetch items where next_due <= now()
  → Present flashcard or recall challenge
  → User rates confidence (1–4)
  → SRS Engine: calculate new interval + ease factor
  → review_queue updated
  → vocab_progress / kanji_progress updated
  → XP awarded
```

### Admin CMS Flow

```
Admin login → RBAC check (user_roles)
  → Content editor: create/edit/publish lessons, vocab, grammar, kanji
  → Asset manager: upload audio/images to Supabase Storage
  → Publish: creates new content_versions entry
  → User manager: view profiles, suspend users, manage roles
  → Analytics: funnel stats, retention, lesson drop-off points
  → Payments: subscription overview, failed payments, refund notes
  → Feature flags: toggle features per user or role
```

---

## Responsive & Platform Strategy

| Platform | Strategy |
|---|---|
| Mobile (375px+) | Bottom tab nav, single-column layout, 44px minimum touch targets, sticky CTAs |
| Tablet (768px+) | Two-column layout, sidebar collapses to icon-only |
| Desktop (1024px+) | Expanded sidebar with labels, wide content area, keyboard shortcuts |
| PWA | manifest.json, service worker, offline lesson cache, install prompt |
| Android APK | Capacitor wrapper, native splash screen, back-button handling, push notifications |

---

## Security Rules (Non-Negotiable)

- **Row Level Security (RLS)** on every Supabase table — written on Day 1, not retrofitted later.
- **API keys** (Gemini, Razorpay) never exposed to the client. All calls through server actions or Edge Functions.
- **JWT validation** on every protected route via Supabase middleware.
- **Razorpay payment verification** done server-side using HMAC signature — never trust client-reported payment status.
- **Environment config** accessed only through a typed `env.ts` wrapper — no raw `process.env` calls in feature code.
- **Role-based access** enforced at both middleware level and RLS policy level — not just hidden in the UI.

---

## Build Order

| Phase | Focus | What Gets Built |
|---|---|---|
| **1** | Brand & Design System | Tokens, components, theme engine, typography, motion config |
| **2** | Route Map | All app routes, layouts, route groups, middleware, navigation shell |
| **3** | Database Schema | Full schema, RLS policies, migrations, seed scripts |
| **4** | Authentication | Login, signup, session, protected layout, profile bootstrap |
| **5** | Onboarding | Goal selection, JLPT target, name, placement check |
| **6** | Dashboard Shell | Greeting, stats, daily goal, navigation, quick actions |
| **7** | Learning Engine | Course → Module → Lesson flow, lesson renderer, all section types |
| **8** | Progress Engine | XP, streaks, achievements, SRS review queue, lesson unlock rules |
| **9** | Sakura AI | AI gateway Edge Function, chat UI, recommendations, usage limits |
| **10** | Premium & Payments | Plan page, Razorpay checkout, webhook, entitlement middleware |
| **11** | Community | Posts, comments, friends, leaderboard |
| **12** | Admin CMS | Content editor, asset manager, user management, analytics, feature flags |
| **13** | PWA + Capacitor | Service worker, offline cache, manifest, Android APK build |
| **14** | Testing | Unit tests (domain engines), integration tests, E2E critical paths |
| **15** | Production | Vercel config, Sentry, monitoring, performance audit, security review |

---

## Core Principles

| Principle | Rule |
|---|---|
| One Codebase | Web, PWA, and Android all share the same Next.js app |
| One Backend | Single Supabase project — a separate project for local dev only |
| No Duplicate Logic | Domain engines own business rules; features call engines, never re-implement them |
| Database-First Content | All curriculum lives in Supabase; JSON used only for initial seeding |
| Server-Side AI | Gemini API called exclusively from Edge Functions or server actions |
| RLS on Day 1 | Row Level Security written before any feature UI is built |
| Verified Payments | Razorpay signatures verified server-side — client payment status is never trusted |
| Designed States | Every feature has loading, empty, error, and success states |
| Clean Layer Boundaries | UI in presentation, logic in domain, data in repositories — never mixed |
| Scalable by Design | Adding N2/N1 levels or a new language = new content rows, zero code changes |
