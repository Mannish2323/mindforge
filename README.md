# 🌸 Mindforge — Powered by Yample Labs

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.1-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-v2.108.2-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-pink?style=flat-square)](#license)

**Mindforge** is a premium, high-fidelity AI-powered Japanese learning application developed by **Yample Labs** (Founded by **Manish**). Featuring a curated Sakura-Pink + Purple gradient design system with modern glassmorphism UI structures, this codebase delivers a unified responsive experience designed for both desktop web browsers and mobile wrapper viewports.

---

## 🏗️ System Architecture

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

## 🎨 Design System & Theme

Our visual guidelines are built for a modern, responsive, and gorgeous user experience:
- **Branding Palette:** Curated Sakura-pink + Purple gradient themes. Slick, clean dark mode configurations.
- **Micro-Animations:** Fluid 60 FPS transitions using **Framer Motion** spring physics, featuring floating animations for the Sakura AI avatar widget and haptic touch ripples.
- **Typography:** Modern typographic scale with an emphasis on readable hierarchy tailored to both Japanese scripts (Kanji, Hiragana, Katakana) and standard translation texts.
- **Capacitor & Android Safe Area:** Custom padding variables (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`) ensure elements lay out perfectly on modern notch and status-bar viewports.

---

## 🚀 Key Features & Modules

### 1. 🤖 Sakura AI Tutor
An interactive virtual AI tutor companion powered by Google Gemini 2.0 Flash. Sakura AI is accessible on learning pages, grammar explanations, kanji writing, and word explainer panels. Guided by the `SAKURA_SENSEI_PROMPT` system instruction and a 4-key Gemini rotation for high availability.

### 2. 📅 Spaced Repetition (SRS) Engine
An implementation of the classic **SM-2 Algorithm** in `src/domain/srs-engine.ts`. Adaptively schedules vocabulary reviews:
* Correct answers scale learning intervals.
* Weak vocabulary cards are automatically clustered.
* Dynamic difficulty shifts matching the student's mastery rate.

### 3. 🔥 Streak & Protection Engine
Maintains learning consistency via `src/domain/streak-engine.ts`.
* Automatic daily streak tracking.
* Streak Shield usage rules when learners miss a day.
* Shop integration to buy streak freezes using earned rewards.

### 4. ⭐ XP & Mastery Tracker
Calculates custom XP awards and mastery delta for each completed session via `src/domain/xp-engine.ts`, adjusting XP based on completion score, streak multipliers, and lesson difficulty.

### 5. 🏅 Achievements & Leagues
* **Achievements (`src/domain/achievement-engine.ts`):** Evaluates progress data against target badge definitions to unlock milestones.
* **Daily Goals (`src/domain/daily-goal-engine.ts`):** Programmatically generates and scores custom daily tasks.
* **Leagues (`src/domain/league-engine.ts`):** Dynamic user leagues with promotion/relegation thresholds and automated cycle resets.

### 6. 💳 Subscription & Payments
* Five-tier subscription model: **Free → Starter → Plus → Pro → AI Max**.
* INR payments via **Razorpay** with HMAC SHA256 server-side signature verification.
* Entitlement cache invalidation on successful payment.

---

## 📁 Repository Structure

```
├── .agents/                    # Workspace customization and rules
├── docs/                       # Project documentation & architecture
│   ├── architecture.md         # Full system architecture blueprint
│   ├── api-contracts.md        # API endpoint specifications
│   ├── database-schema.md      # Database schema & RLS design
│   └── ...                     # Additional blueprint documents
├── scripts/                    # Database seeding and configuration scripts
├── supabase/                   # Supabase configuration files
├── public/                     # Static assets (PWA icons, logo, manifest)
├── src/
│   ├── app/                    # Next.js App Router folders & pages
│   │   ├── (app)/              # Authenticated application pages
│   │   │   ├── ai-tutor/       # Sakura AI chat panel
│   │   │   ├── home/           # Main student dashboard
│   │   │   ├── path/           # JLPT curriculum lessons
│   │   │   ├── kanji/          # Kanji stroke/writing boards
│   │   │   ├── billing/        # Subscription & Razorpay checkout
│   │   │   └── ...             # Achievements, Leaderboard, Shop, Quiz, Review, Profile
│   │   ├── api/                # Next.js Route Handlers (REST)
│   │   │   ├── ai/             # Sakura AI endpoints (explain, word-explainer, writing-coach)
│   │   │   └── billing/        # create-order + verify routes
│   │   ├── auth/               # Login & Registration workflows
│   │   ├── onboarding/         # New user setup wizard
│   │   └── admin/              # Admin CMS (role-gated)
│   ├── components/             # Reusable UI & Layout components
│   │   ├── layout/             # Core layouts (AppShell, Navbar, Sidebar)
│   │   ├── ui/                 # Atomic design (Button, Badge, Input, etc.)
│   │   └── shared/             # UpgradeDialog, SakuraWidget, etc.
│   ├── domain/                 # Pure business logic engines
│   │   ├── srs-engine.ts       # SM-2 Spaced Repetition
│   │   ├── xp-engine.ts        # XP calculation
│   │   ├── streak-engine.ts    # Streak tracking & protection
│   │   ├── achievement-engine.ts
│   │   ├── daily-goal-engine.ts
│   │   └── league-engine.ts
│   ├── lib/
│   │   ├── gemini.ts           # Sakura AI / Gemini 4-key rotation utility
│   │   └── plans.ts            # Subscription plan definitions
│   ├── services/               # API orchestration layer
│   ├── hooks/                  # Custom React hooks
│   ├── stores/                 # Global state (Zustand / context)
│   └── types/                  # Shared TypeScript models
└── package.json                # Project scripts & dependencies
```

---

## 🛠️ Setup & Running Locally

Follow these steps to get a local copy up and running quickly.

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **[Node.js](https://nodejs.org/)** (v22.0.0 or higher)
- **[pnpm](https://pnpm.io/)** v8+ (Preferred package manager)
- **Git**

### 💻 Installation

**1. Clone the repository:**
```bash
git clone https://github.com/manish63018-sketch/learn-with-velmorth.git
cd learn-with-velmorth
```

**2. Install project dependencies:**
```bash
pnpm install
```

**3. Configure environment variables:**
```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# GEMINI_API_KEY_1..4, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
```

### 🚀 Running the Development Server

Start the development server with Hot-Module Replacement:
```bash
pnpm dev
```
Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### 🏗️ Build for Production

```bash
pnpm build
pnpm start
```

### 📱 Android Build (Capacitor)

```bash
pnpm build:mobile     # Next.js build + Capacitor sync
pnpm cap:open         # Open in Android Studio
```

---

## 📐 Architecture Documentation

See the full system blueprint in [`docs/architecture.md`](docs/architecture.md), which covers:

- Master system architecture diagram
- All 5 application layers (Client → Backend)
- Sakura AI architecture & API endpoints
- Learning flow & SRS integration
- Subscription & payment flow
- Responsive layout breakpoints
- Design system rules & performance guidelines
- Production release checklist

---

## 🔒 Copyright & License
© 2026 Yample Labs. All Rights Reserved.

This codebase is proprietary software developed by Yample Labs (Founded by Manish). All rights reserved.
