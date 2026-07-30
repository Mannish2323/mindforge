# 📐 Mindforge Architecture — Powered by Yample Labs
## Complete Application Architecture & System Blueprint

---

# Organization Structure

```text
Yample Labs
    │
    └── Mindforge
          │
          ├── Authentication
          ├── Dashboard
          ├── AI Learning (Sakura AI)
          ├── Lessons
          ├── Grammar
          ├── Vocabulary
          ├── Kanji
          ├── Writing Practice
          ├── Listening
          ├── Speaking
          ├── JLPT Practice
          ├── Progress Tracking
          ├── Achievements
          ├── Notifications
          ├── Subscription
          ├── Payment
          ├── Admin Panel
          └── Analytics
```

---

# Master System Architecture

```text
                        USERS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
     Web App            Android App          PWA
      Next.js           Capacitor        Installable
        │                  │                  │
        └──────────── Shared Frontend ────────┘
                       React + TypeScript
                             │
                  Design System + Components
                             │
                     Feature Module Layer
                             │
                  Business Logic / Services
                             │
                  Authentication Middleware
                             │
                        API Route Layer
                             │
            ┌────────────────┼────────────────┐
            │                │                │
         Supabase        Gemini AI       Razorpay
         (Postgres)     (Sakura AI)      (Payments)
            │                │                │
            └────────────────┼────────────────┘
                             │
                      PostgreSQL Database
                             │
                     Storage + Edge Functions
                             │
                      Analytics + Monitoring
```

---

# Application Layers

## Layer 1 — Client

```text
Web (Next.js 14)
PWA (manifest.json)
Android APK (Capacitor)
Future iOS (Capacitor)
Admin Panel (role-gated)
```

---

## Layer 2 — Presentation

```text
Splash Screen
Authentication (Login / Register)
Dashboard (Home)
Lessons
Grammar
Vocabulary
Kanji
Speaking
Writing Practice
Listening
Reading
JLPT Practice
Sakura AI (AI Tutor)
Progress Tracking
Achievements
Leaderboard
Notifications
Subscription / Billing
Profile
Settings
Admin Panel
Analytics
```

---

## Layer 3 — Feature Modules

```text
Authentication Module
Onboarding Module
Dashboard Module
Learning Engine
Vocabulary Engine
Grammar Engine
Kanji Engine
Writing Engine
Speaking Engine
Reading Engine
Listening Engine
JLPT Practice Engine
Quiz Engine
Revision / SRS Engine
Achievement Engine
Notification Engine
Community Module
Subscription / Premium Module
Profile Module
Settings Module
Admin CMS Module
Analytics Module
```

---

## Layer 4 — Business Logic

```text
XP Engine              ← Awards experience points per lesson
Level Engine           ← Calculates user level thresholds
Coin / Gem Engine      ← Manages in-app currency
Achievement Engine     ← Evaluates and unlocks badge milestones
Daily Goal Engine      ← Generates and tracks daily tasks
Streak Engine          ← Tracks and protects learning streaks
Lesson Unlock Engine   ← Gates lesson access by plan + progress
Roadmap Engine         ← Manages JLPT curriculum paths
SRS Engine (SM-2)      ← Spaced Repetition scheduling
Reminder Engine        ← Daily push reminder scheduling
Notification Engine    ← Cross-channel alert dispatching
Recommendation Engine  ← Weak-area learning suggestions
Premium Engine         ← Entitlement check and enforcement
Leaderboard Engine     ← Dynamic bracket calculation
```

---

## Layer 5 — Backend Services

```text
Supabase Authentication   ← JWT + OAuth + Magic Link
Supabase PostgreSQL       ← Primary relational database
Supabase RLS              ← Row Level Security policies
Supabase Storage          ← Audio, image, and avatar files
Supabase Edge Functions   ← Server-side logic
Supabase Realtime         ← Live subscriptions
Gemini AI Gateway         ← Sakura AI powered by Gemini 2.0
Razorpay Gateway          ← INR payments + webhook validation
Vercel Deployment         ← Web hosting and CDN
Capacitor Bridge          ← Android native wrapper
```

---

# Sakura AI Architecture

```text
Yample Labs
    └── Mindforge
          └── Sakura AI (AI Learning Companion)
                │
                ├── Powered by: Google Gemini 2.0 Flash
                ├── System Prompt: SAKURA_SENSEI_PROMPT
                ├── Key Rotation: 4-key pool (GEMINI_API_KEY_1..4)
                └── Rate Limit: per plan tier (free → ai_max)

User Input
    ↓
Prompt Validation (content safety)
    ↓
Context Builder (JLPT level, lesson history)
    ↓
SAKURA_SENSEI_PROMPT injected as system instruction
    ↓
Gemini 2.0 Flash API call (with key rotation)
    ↓
Safety Filter (harmful content check)
    ↓
Response Formatter (Japanese + Romaji + English + tip)
    ↓
Daily Usage Counter updated
    ↓
Conversation saved to database
    ↓
Display Response to User
```

### Sakura AI API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/ai` | Main Sakura AI chat gateway |
| `POST /api/ai/explain` | Grammar point explainer |
| `POST /api/ai/word-explainer` | Detailed word analysis (35-key JSON) |
| `POST /api/ai/writing-coach` | Kanji stroke feedback via image input |

---

# Folder Structure

```text
src/
├── app/
│   ├── (app)/           ← Authenticated app pages
│   │   ├── home/        ← Dashboard
│   │   ├── path/        ← Lesson curriculum
│   │   ├── kanji/       ← Kanji writing board
│   │   ├── ai-tutor/    ← Sakura AI chat panel
│   │   ├── billing/     ← Subscription & payment
│   │   ├── profile/     ← User profile
│   │   ├── settings/    ← App settings
│   │   ├── achievements/
│   │   ├── leaderboard/
│   │   ├── shop/
│   │   ├── quiz/
│   │   └── review/      ← SRS review queue
│   ├── auth/            ← Login / Register
│   ├── onboarding/      ← New user setup
│   ├── admin/           ← Admin CMS (role-gated)
│   ├── api/             ← Next.js Route Handlers
│   │   ├── ai/          ← Sakura AI endpoints
│   │   ├── billing/     ← Razorpay order + verify
│   │   └── ...
│   ├── about/
│   ├── privacy/
│   ├── terms/
│   └── layout.tsx       ← Root layout + SEO metadata
│
├── components/
│   ├── ui/              ← Atomic: Button, Input, Badge, etc.
│   ├── layout/          ← AppShell, Navbar, Sidebar
│   ├── shared/          ← UpgradeDialog, SakuraWidget
│   ├── charts/
│   ├── forms/
│   ├── dialogs/
│   └── animations/      ← Framer Motion wrappers
│
├── features/            ← Domain feature slices
├── services/            ← API orchestration layer
├── hooks/               ← Custom React hooks
├── stores/              ← Zustand / context state
├── lib/
│   ├── gemini.ts        ← Sakura AI / Gemini utility
│   ├── plans.ts         ← Subscription plan definitions
│   └── supabase.ts      ← Supabase client setup
├── domain/              ← Pure business logic engines
│   ├── srs-engine.ts    ← SM-2 algorithm
│   ├── xp-engine.ts     ← XP calculation
│   ├── streak-engine.ts ← Streak tracking
│   ├── achievement-engine.ts
│   ├── daily-goal-engine.ts
│   └── league-engine.ts
├── types/               ← Shared TypeScript models
├── utils/               ← Pure helper functions
├── constants/           ← App-wide constants
├── assets/              ← Static assets
└── styles/              ← Global CSS (Tailwind v4)
```

---

# Navigation Structure

```text
Splash
  ↓
Login / Register (Supabase Auth)
  ↓
Onboarding (name, goal, JLPT target)
  ↓
Dashboard (Home)
  ↓
┌──────────────────────────────────────────┐
│              Bottom Nav / Sidebar        │
├──────────────┬───────────────────────────┤
│ Home         │ Dashboard + Daily widgets │
│ Path         │ JLPT curriculum lessons   │
│ Sakura AI    │ AI tutor chat             │
│ Review       │ SRS flashcard queue       │
│ Profile      │ Stats, achievements, plan │
└──────────────┴───────────────────────────┘
  ↓
Billing → Razorpay → Plan activated
  ↓
Admin (role: admin only) → CMS
```

---

# Learning Flow

```text
Roadmap (JLPT N5 → N1)
  ↓
Course Selection
  ↓
Module
  ↓
Lesson
  ├── Vocabulary cards
  ├── Grammar explanation
  ├── Writing canvas (Kanji)
  ├── Speaking exercise
  ├── Listening exercise
  └── Reading passage
  ↓
Quiz (multiple-choice, matching, text input)
  ↓
Score Calculation
  ↓
XP + Gem rewards
  ↓
Streak update
  ↓
Achievement check
  ↓
Progress saved to Supabase
  ↓
Unlock Next Lesson
  ↓
SRS Queue updated (next review date via SM-2)
```

---

# Subscription & Payment Architecture

```text
Mindforge Plans
  ├── Free         — 5 lessons/day, 3 AI chats/day
  ├── Starter      — 10 lessons/day, 20 AI chats/day
  ├── Plus         — 20 lessons/day, 50 AI chats/day
  ├── Pro          — Unlimited lessons, 150 AI chats/day
  └── AI Max       — Unlimited lessons, 500 AI chats/day

Payment Flow:
User selects plan
  ↓
POST /api/billing/create-order  → Razorpay order created
  ↓
Razorpay checkout modal (INR)
  ↓
POST /api/billing/verify        → HMAC SHA256 signature check
  ↓
Supabase profile updated (plan_id, ends_at)
  ↓
Entitlement cache invalidated
  ↓
Premium features unlocked
```

---

# Notification Architecture

```text
Server Event (streak break, lesson due, etc.)
  ↓
Notification created in DB
  ↓
Push dispatched (email / system)
  ↓
App receives notification
  ↓
Toast / Badge animation
  ↓
User click → Navigate to action
  ↓
Mark as read
  ↓
Badge count updated
```

---

# Profile Architecture

```text
Avatar + Display Name
  ↓
Personal Information (email, join date, language)
  ↓
XP + Level progress bar
  ↓
Learning Statistics (total lessons, vocab mastered, hours)
  ↓
Achievements + Badges
  ↓
Bookmarks (saved vocabulary)
  ↓
Certificates (JLPT level completions)
  ↓
Subscription status + billing history
  ↓
Settings shortcut
```

---

# Responsive Architecture

```text
Desktop (1440 × 900px)
  ├── Fixed sidebar navigation
  ├── Top navbar with search
  ├── Multi-column grid (3–4 cols)
  └── Expanded panels and charts

────────────────────

Tablet (768 × 1024px)
  ├── Collapsible sidebar
  ├── Two-column grid layout
  └── Touch-optimized controls

────────────────────

Mobile (390 × 844px) ← Master Reference
  ├── Top app bar
  ├── Bottom navigation (5 tabs)
  ├── Single-column layout
  ├── Safe area: env(safe-area-inset-top/bottom)
  └── Capacitor Android integration
```

---

# Design System Rules

Every screen must include:
- ✔ Loading State (skeleton shimmer)
- ✔ Empty State (illustrated placeholder)
- ✔ Error State (retry action)
- ✔ Success State (celebration animation)
- ✔ Smooth 60 FPS animations (Framer Motion spring physics)
- ✔ Responsive layout (mobile-first)
- ✔ WCAG AA accessibility
- ✔ Dark Theme (primary; Sakura-pink + purple palette)

---

# Performance Rules

```text
Lazy Loading          ← Route-level code splitting
Image Optimization    ← Next.js <Image> + WebP
Caching               ← SWR / React Query stale-while-revalidate
Virtual Lists         ← Long vocabulary / leaderboard lists
Prefetching           ← Next.js link prefetch
Memoization           ← useMemo / useCallback on heavy renders
Optimistic Updates    ← Immediate UI feedback on mutations
Background Sync       ← Queue lesson progress on reconnect
```

---

# Architecture Principles

```text
One Frontend (Next.js + Capacitor)
  ↓
One Backend (Supabase)
  ↓
One Authentication System (Supabase Auth)
  ↓
One Database (PostgreSQL + RLS)
  ↓
One AI Engine (Sakura AI — Gemini 2.0)
  ↓
One Payment System (Razorpay)
  ↓
One Notification System (Supabase Realtime + Edge)
  ↓
One Design System (Sakura-pink + purple, glassmorphism)
  ↓
One Shared Component Library (src/components/)
  ↓
One Responsive Experience (Web + PWA + Android)
```

---

# Production Release Checklist

Every feature must satisfy all of the following before release:

- [ ] Connected to Supabase backend
- [ ] Responsive on Android (390px), Tablet (768px), Desktop (1440px)
- [ ] Uses reusable components from `src/components/`
- [ ] Protected by Supabase Auth middleware
- [ ] Handles loading, error, and empty states
- [ ] Integrated with Notification Engine where applicable
- [ ] Updates user XP / streak / progress correctly
- [ ] Works with Sakura AI where applicable
- [ ] Tested for accessibility (keyboard nav, ARIA labels)
- [ ] Passes TypeScript strict mode — zero `any` escapes
- [ ] Optimized for Core Web Vitals (LCP < 2.5s)
- [ ] Ready for Vercel production deployment

---

*© 2026 Yample Labs. Mindforge Architecture v2.0*
