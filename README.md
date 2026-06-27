<div align="center">

# 🌸 Learn with Velmorth

### AI-powered Japanese Language Learning Platform

**Master Japanese from N5 to N1 — with Sakura AI, gamification, and a community that grows with you.**

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000?style=for-the-badge&logo=vercel)](https://vercel.com/)

<br/>

[![Version](https://img.shields.io/badge/Version-2.0.0-blueviolet?style=flat-square)](package.json)
[![Node](https://img.shields.io/badge/Node-%3E%3D22.0.0-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

</div>

---

## 🌟 What is Learn with Velmorth?

**Learn with Velmorth** is a full-stack, AI-powered Japanese language learning SaaS platform that guides students from absolute beginner to **JLPT N1** — through intelligent lessons, adaptive reviews, and an AI tutor named **Sakura**.

Built as a **single responsive codebase** that runs as:
- 🌐 **Web Application** — Desktop, Tablet, Mobile Browser
- 📲 **Progressive Web App (PWA)** — Installable, offline-capable
- 📱 **Android APK** — Native via Capacitor
- 🔧 **Admin Panel** — Full content & user management

> One codebase. One backend. One database. One AI. One payment system.

---

## ✨ Features

### 📚 Learning Engine

| Feature | Description |
|---|---|
| **Structured Curriculum** | Courses → Modules → Lessons with unlock progression |
| **Vocabulary** | 5000+ words with audio, examples, and bookmarks |
| **Grammar** | Topic-based grammar with examples, quizzes, and explanations |
| **Kanji** | Stroke order, readings, meanings, and writing practice |
| **Listening** | Audio-based comprehension with shadowing exercises |
| **Speaking** | Microphone-based pronunciation scoring via AI |
| **Reading** | JLPT-style reading passages with comprehension questions |
| **Writing** | Canvas-based character drawing with stroke analysis |

### 🤖 Sakura AI

| Feature | Description |
|---|---|
| **AI Tutor** | Powered by Google Gemini — conversational Japanese tutor |
| **Context Memory** | Remembers your past conversations for personalised help |
| **Study Recommendations** | Suggests what to study next based on your weak areas |
| **Pronunciation Feedback** | Evaluates speaking practice attempts |
| **Daily Limits** | Usage limits per plan to keep the service fair |

### 🎮 Gamification

| System | Description |
|---|---|
| **XP & Levels** | Earn XP on every lesson, quiz, and review session |
| **Streaks** | Daily study streaks with freeze protection |
| **Hearts** | Lives system — replenish with time, gems, or premium |
| **Gems** | Virtual currency earned through study and milestones |
| **Achievements** | 50+ badges for vocabulary, kanji, streaks, and community |
| **Leaderboards** | Weekly competitive leagues across all users |
| **Daily Goals** | Customisable daily study targets (10–60 min) |
| **Review Queue** | SM-2 Spaced Repetition System (SRS) for smart reviews |

### 💳 Premium Subscriptions

| Plan | Features |
|---|---|
| **Free** | 5 hearts/day, 10 AI messages/day, core lessons |
| **Starter** | Unlimited hearts, 30 AI messages/day |
| **Plus** | Unlimited AI, offline downloads, advanced analytics |
| **Pro** | All features, priority support, certificate export |

Powered by **Razorpay** — Monthly and Yearly billing with webhook verification.

### 🌐 Community

- User posts, comments, and likes
- Friends and study groups
- Weekly leaderboard leagues
- Achievement showcases

---

## 🏗️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14.2 | Framework — App Router, SSR, API Routes |
| [React](https://react.dev/) | 18.3 | UI Library |
| [TypeScript](https://www.typescriptlang.org/) | 5.5 | Type Safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.3 | Styling |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations |
| [Radix UI](https://www.radix-ui.com/) | Latest | Accessible UI Primitives |
| [Lucide React](https://lucide.dev/) | Latest | Icons |
| [Recharts](https://recharts.org/) | 2 | Analytics Charts |
| [Sonner](https://sonner.emilkowal.ski/) | 2 | Toast Notifications |
| [canvas-confetti](https://github.com/catdad/canvas-confetti) | 1.9 | Celebration Animations |

### Backend

| Technology | Purpose |
|---|---|
| [Supabase](https://supabase.com/) | Auth, PostgreSQL, Storage, Realtime, Edge Functions |
| [Supabase SSR](https://supabase.com/docs/guides/auth/server-side) | Server-side session management |
| [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) | Fine-grained database access control |

### AI & Payments

| Technology | Purpose |
|---|---|
| [Google Gemini API](https://deepmind.google/technologies/gemini/) | Sakura AI conversational tutor |
| [Razorpay](https://razorpay.com/) | Subscription payments and webhook verification |

### Deployment

| Technology | Purpose |
|---|---|
| [Vercel](https://vercel.com/) | Frontend hosting and CI/CD |
| [Supabase Cloud](https://supabase.com/) | Managed backend, database, and storage |
| [GitHub Actions](https://github.com/features/actions) | CI/CD pipeline |

---

## 🗄️ Database Architecture

Built on **Supabase PostgreSQL** with **50+ production tables** across 10 modules:

```
Supabase PostgreSQL

├── Identity          → profiles, user_settings, user_stats, user_streaks
├── Learning Content  → courses, modules, lessons, vocabulary, grammar, kanji
├── User Progress     → lesson_progress, review_queue, achievements, bookmarks
├── Sakura AI         → ai_conversations, ai_messages, ai_memory, ai_usage
├── Community         → posts, comments, likes, friends, leaderboards
├── Premium           → plans, subscriptions, payments, billing_history
├── Notifications     → notifications, push_tokens, scheduled_notifications
├── Analytics         → analytics_events, screen_views, lesson_logs
├── Administration    → admin_users, admin_logs, feature_flags, audit_logs
└── System            → app_versions, error_logs, crash_reports, api_keys
```

**All tables have:**
- UUID Primary Keys
- Foreign Key constraints
- Row Level Security (RLS) enabled
- Automatic `created_at` / `updated_at` timestamps
- Database triggers for XP, streaks, and achievements

---

## 📁 Project Structure

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
│   │   ├── speaking/
│   │   ├── writing/
│   │   ├── listening/
│   │   ├── reading/
│   │   ├── sakura/
│   │   ├── progress/
│   │   ├── achievements/
│   │   ├── community/
│   │   ├── premium/
│   │   ├── notifications/
│   │   ├── settings/
│   │   └── profile/
│   └── (admin)/              ← Admin panel (role-gated)
├── components/               ← Reusable UI components
├── domain/                   ← Business logic engines
│   ├── xp-engine.ts
│   ├── streak-engine.ts
│   ├── srs-engine.ts
│   ├── achievement-engine.ts
│   ├── daily-goal-engine.ts
│   └── league-engine.ts
├── hooks/                    ← Custom React hooks
├── lib/                      ← Supabase clients, utilities
└── types/                    ← TypeScript type definitions

docs/
├── architecture.md           ← Master architecture & build blueprint
├── database-schema.md        ← Complete DB schema & ER diagram
├── developer-flow.md         ← All developer function flows
├── compliance.md             ← Android permissions, security & legal
├── feature-map.md            ← Production feature specification
├── build-order.md            ← Phased implementation roadmap
└── api-contracts.md          ← API endpoint contracts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 22.0.0
- **npm** >= 10.0.0
- A [Supabase](https://supabase.com/) project
- A [Google AI Studio](https://aistudio.google.com/) Gemini API key
- A [Razorpay](https://razorpay.com/) account (for payments)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/learn-with-velmorth.git
cd learn-with-velmorth

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase, Gemini, and Razorpay keys

# 4. Seed the database (optional)
npm run db:seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed curriculum data to Supabase
```

---

## 🏛️ Architecture Overview

```
                          USERS
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
  🌐 Web Application                     📱 Android APK
    (Next.js PWA)                         (Capacitor)
         │                                       │
         └────────────── Shared Frontend ────────┘
                       React + TypeScript
                               │
                Business Logic / Domain Engines
                               │
                    Authentication Middleware
                               │
         ┌─────────────────────┼──────────────────────┐
         │                     │                      │
     Sakura AI            Learning Engine       Premium Engine
         │                     │                      │
         └─────────────────────┼──────────────────────┘
                               │
                        API Gateway Layer
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
   Gemini API            Razorpay API         Notification API
                               │
                        Supabase Backend
                               │
   Auth · PostgreSQL · Storage · Realtime · Edge Functions
                               │
                         Admin Dashboard
                               │
                     Analytics + Monitoring
```

---

## 🗺️ Development Roadmap

| Phase | Description | Status |
|---|---|---|
| 1 | Brand & Design System | ✅ Complete |
| 2 | Route Map & Navigation Shell | ✅ Complete |
| 3 | Database Schema & RLS Setup | ✅ Complete |
| 4 | Authentication & User Bootstrap | ✅ Complete |
| 5 | Onboarding Experience | ✅ Complete |
| 6 | Student Dashboard | ✅ Complete |
| 7 | Interactive Learning Engine | ✅ Complete |
| 8 | Spaced Repetition (SRS) Engine | ✅ Complete |
| 9 | Sakura AI Tutor | ✅ Complete |
| 10 | Premium Billing & Payments | ✅ Complete |
| 11 | Community Feed & Rankings | ✅ Complete |
| 12 | Admin CMS | ✅ Complete |
| 13 | PWA & Android (Capacitor) | ✅ Complete |
| 14 | Performance Optimization & Testing | ✅ Complete |
| 15 | Deploy & Monitor | ✅ Complete |

---

## 🔐 Security

- **Row Level Security (RLS)** on every Supabase table
- **JWT Authentication** via Supabase Auth
- **HTTPS-only** API communication
- **Server-side secrets** — API keys never exposed to the client
- **Input validation** and **rate limiting** on all API routes
- **Razorpay signature verification** for payment integrity
- **Audit logs** for all administrative actions

---

## 📖 Documentation

| Document | Description |
|---|---|
| [Architecture](docs/architecture.md) | Master architecture & build blueprint |
| [Database Schema](docs/database-schema.md) | Complete DB schema & ER diagram |
| [Developer Flow](docs/developer-flow.md) | All developer function flows |
| [Compliance](docs/compliance.md) | Android permissions, security & legal |
| [Feature Map](docs/feature-map.md) | Production feature specification |
| [Build Order](docs/build-order.md) | Phased implementation roadmap |
| [API Contracts](docs/api-contracts.md) | API endpoint contracts |

---

## 🧪 Production Checklist

```
Frontend    ✔ Responsive UI  ✔ Mobile  ✔ Tablet  ✔ Desktop  ✔ Animations
Backend     ✔ Supabase Auth  ✔ Database  ✔ Storage  ✔ Edge Functions  ✔ RLS
AI          ✔ Gemini Connected  ✔ Sakura Assistant  ✔ Usage Limits
Payments    ✔ Razorpay  ✔ Verification  ✔ Subscription  ✔ Premium Unlock
Quality     ✔ No Console Errors  ✔ No TypeScript Errors  ✔ Lighthouse 95+
```

---

## 🌸 Production Principles

> *One Responsive Codebase. One Backend. One AI. Infinite Learning.*

- **One Codebase** — Web + PWA + Android APK from a single Next.js project
- **Feature-first Architecture** — Each feature is self-contained and modular
- **Secure by Default** — RLS, API validation, and server-side secrets everywhere
- **Scalable** — Supabase managed backend scales automatically
- **Offline-first** — Local caching with cloud sync on reconnection
- **Accessible** — Screen readers, dynamic fonts, high contrast, keyboard navigation

---

## 📄 License

This project is **private and proprietary**. All rights reserved.

© 2024–2025 Learn with Velmorth. Unauthorized copying, modification, or distribution is strictly prohibited.

---

<div align="center">

Made with 🌸 and a lot of Japanese study sessions.

**[learnwithvelmorth.com](https://learnwithvelmorth.com)**

</div>
