//# 🌸 Learn with Velmorth

[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.1-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-v2.108.2-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-pink?style=flat-square)](#license)

**Learn with Velmorth** is a premium, high-fidelity AI-powered Japanese learning application. Featuring a curated Sakura-Pink + Purple gradient design system with modern glassmorphism UI structures, this codebase delivers a unified responsive experience designed for both desktop web browsers and mobile wrapper viewports.

---

## 🎨 Design System & Theme

Our visual guidelines are built for a modern, responsive, and gorgeous user experience:
- **Branding Palette:** Curated Sakura-pink + Purple gradient themes. Slick, clean dark mode configurations.
- **Micro-Animations:** Fluid 60 FPS transitions using **Framer Motion** spring physics, featuring floating animations for the Sakura AI avatar widget and haptic touch ripples.
- **Typography:** Modern typographic scale with an emphasis on readable hierarchy tailored to both Japanese scripts (Kanji, Hiragana, Katakana) and standard translation texts.
- **Capacitor & Android Safe Area:** Custom padding variables (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`) ensure elements lay out perfectly on modern notch and status-bar viewports.

---

## 🚀 Key Features & Modules

### 1. 🤖 Sakura AI Tutor Mascot
An interactive virtual AI tutor mascot widget powered by Google Generative AI (Gemini). Accessible dynamically on learning pages and conversation panels to guide the student's journey.

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

---

## 📁 Repository Structure

```
├── .agents/                    # Workspace customization and rules
├── docs/                       # Project documentation
├── scripts/                    # Database seeding and configuration scripts
├── supabase/                   # Supabase configuration files
├── src/
│   ├── app/                    # Next.js App Router folders & pages
│   │   ├── (app)/              # Application Shell pages
│   │   │   ├── ai-tutor/       # AI Tutor chat panel
│   │   │   ├── home/           # Main student dashboard
│   │   │   ├── path/           # Core learning path lessons
│   │   │   ├── kanji/          # Kanji stroke/writing boards
│   │   │   └── ...             # Achievements, Leaderboard, Shop, Quiz, Profile
│   │   ├── auth/               # Login & Registration workflows
│   │   └── globals.css         # Tailwind v4 main stylesheet
│   ├── components/             # Reusable UI & Layout components
│   │   ├── layout/             # Core layouts (AppShell)
│   │   └── ui/                 # Atomic design inputs (Button, Logo, Input, etc.)
│   ├── domain/                 # Core domain logic (SRS, XP, Streak engines)
│   ├── services/               # State layer and API orchestration
│   └── types/                  # Shared TypeScript models
└── package.json                # Project script configuration & dependencies
```

---

## 🛠️ Setup & Running Locally

### Prerequisites
* **Node.js** >= 22.0.0
* **pnpm** (preferred package manager)

### Installation
Clone the repository and install the project dependencies:
```bash
pnpm install
```

### Run the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build and Production Run
```bash
pnpm build
pnpm start
```

---

# Architecture Overview

![Architecture Diagram](file:///c:/Users/ADMIN/.gemini/antigravity-ide/brain/544f1605-5973-4706-aa19-734569654849/architecture_diagram_1782627244712.png)

Learn more about the platform's architecture in the **docs/architecture.md** file.

---

## 🔒 License
This codebase is private and licensed under the terms defined within [CONTRIBUTING.md](file:///c:/Users/ADMIN/Documents/learn-with-velmorth/CONTRIBUTING.md) and associated workspace guides.
