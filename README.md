# Learn with Velmorth - Updated Architecture (2026)

## System Vision

Learn with Velmorth is an AI-powered language learning ecosystem focused on language mastery, vocabulary intelligence, pronunciation, translation, gamification, and personalized learning.

The platform is designed to combine the engaging learning experience of Duolingo, the clean organization of Notion, personalized AI tutor assistance, and adaptive learning paths.

---

## 📚 Documentation Index

| Section | Document | Coverage |
|---|---|---|
| 01 | [Product Vision](docs/01_PRODUCT_VISION.md) | Ecosystem philosophy, user journey, Duolingo+Notion goal, 100k+ learner target |
| 02 | [System Architecture](docs/02_SYSTEM_ARCHITECTURE.md) | Web Client (Vite), Express API, Supabase Database, Gemini/OpenAI/Perplexity |
| 03 | [Frontend Architecture](docs/03_FRONTEND_ARCHITECTURE.md) | Web App (React + Vite + React Router + Tailwind CSS) & Future Flutter Client |
| 04 | [UI/UX Design System](docs/04_UI_UX_DESIGN_SYSTEM.md) | Brand identity, Color palette, Typography, Custom CSS design |
| 05 | [User Flow](docs/05_USER_FLOW.md) | Navigation maps: Home dashboard, learn path, JLPT prep, auth, profile |
| 06 | [Learning Engine](docs/06_LEARNING_ENGINE.md) | Spaced Repetition System (SRS) algorithm, vocabulary builder, quiz engines |
| 07 | [Gamification](docs/07_GAMIFICATION.md) | XP systems, daily streaks, badges, achievements, leaderboard rankings |
| 08 | [AI System](docs/08_AI_SYSTEM.md) | Translation, Meaning, Sentence Breakdown, and Assistant pipelines |
| 09 | [Database Architecture](docs/09_DATABASE_ARCHITECTURE.md) | Supabase PostgreSQL Relational Schema & Firestore Telemetry schemas |
| 10 | [API Architecture](docs/10_API_ARCHITECTURE.md) | Node.js + Express API endpoints and Vercel routing configs |

---

## Technology Stack & Architecture

### Frontend Layer
- **Web Application**: React, Vite, React Router, Framer Motion, Tailwind CSS
- **Future Mobile App**: Flutter, Firebase Integration, Offline Learning Support

### Authentication Layer
- **User Authentication**: Google Login, Email & Password, Anonymous Guest Mode
- **Services**: Firebase Authentication & Supabase Auth (SSR verification)

### API Layer (Future Backend Gateway)
- **Framework**: Node.js + Express (REST APIs)
- **Gateway Responsibilities**: Authentication Validation, API Security, Rate Limiting, AI Requests, Analytics Collection

### Database Layer
- **Primary Database**: **Supabase (PostgreSQL)**
  - Stores all persistent structural records including profiles, user stats, settings, streaks, subscription entitlements, lesson progress, spaced-repetition queues, badges, and usage logs.
- **Telemetry Database**: **Firebase Firestore**
  - Logs daily activity streams (such as XP history charts per user).

### AI Learning Engine
- **AI Services**: Translation Engine (JA ⇄ EN), Word Meaning Engine, Sentence Breakdown Engine, Learning Assistant
- **Future Integrations**: Gemini API, OpenAI API, Perplexity API

---

## Learning System Core Modules

- **Vocabulary Builder**: Flashcards, Word Meaning, Audio Support, Practice Mode
- **Grammar Training**: Grammar Lessons, Interactive Exercises
- **Quiz Engine**: MCQ, Fill in the Blanks, Listening Tests, Writing Tests
- **Revision System**: Smart Revision, Weak Topic Detection, Daily Recommendations

---

## Gamification & Rewards

- **XP System**: Earn Lesson XP, Quiz XP, and Daily XP
- **Achievements**: Streak Badges, Course Completion, Vocabulary Master
- **Leaderboards**: Weekly Rankings, Global Rankings

---

## Analytics & Monitoring

- **Track Metrics**: Daily Active Users (DAU), Course Completion, Quiz Accuracy, Retention Rate, Learning Time
- **Dashboards**: Student Dashboard, Admin Dashboard
- **Admin Panel**: Course, Lesson, and User management, Analytics, Content publishing

---

## Monetization Model

- **Free Plan**: Basic Lessons
- **Premium Plan**: Unlimited Learning, AI Tutor, Advanced Analytics
- **Future Plans**: Subscription Model, Lifetime Access, Team Plans

---

## Deployment & Hosting

- **Frontend**: Vercel
- **Backend API**: Render
- **Database & Storage**: Supabase (PostgreSQL) & Firebase (Firestore / Storage)
- **Monitoring & Analytics**: Google Analytics, Firebase Analytics

---

## Long-Term Goal

Become a premier AI-powered learning platform targeting **100,000+ learners** worldwide, combining a Duolingo learning experience, Notion-level organization, AI tutor assistance, and personalized learning paths.

---

## 📁 Repository Structure

```
learn-with-velmorth/
├── app/                     # Native Android App (Kotlin, Jetpack Compose, Firebase)
├── apps/
│   └── web/                 # Web Application (React, Vite, Tailwind CSS)
│       └── supabase/        # SQL schema configurations and database migrations
├── packages/                # Shared monorepo packages
│   ├── analytics/           # Shared telemetry utilities
│   ├── core-logic/          # Shared client-side business rules
│   ├── design-tokens/       # Custom style values, colors, spacing
│   ├── types/               # Shared TypeScript typings
│   ├── ui/                  # Component styles and tokens
│   └── utils/               # Common helper utilities
├── services/                # Legacy backend microservices
├── docs/                    # Developer index portal and architecture blueprints
└── README.md                # This file
```

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/manish63018-sketch/learn-with-velmorth.git
cd learn-with-velmorth

# Install workspace dependencies
pnpm install

# Run the local development environment
pnpm dev

# Build all applications and packages
pnpm build
```
