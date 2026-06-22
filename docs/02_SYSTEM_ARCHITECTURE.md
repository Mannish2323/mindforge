# LEARN WITH VELMORTH — SYSTEM ARCHITECTURE
## Section 2: Complete System Architecture

---

## 2.1 ARCHITECTURAL OVERVIEW

Learn With Velmorth is built on a modern Next.js client, Express REST API gateway, and hybrid database architecture designed to support a fast, engaging, and AI-powered language learning experience.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                        │
│    Vite + React Web App        │    Flutter Mobile App      │
└──────────────────────┬───────────────────┬──────────────────┘
                       │ HTTPS             │ Firebase SDK /
                       │ REST / API        │ SQL Sync
┌──────────────────────▼───────────────────▼──────────────────┐
│                    AUTHENTICATION LAYER                     │
│               Firebase Auth & Supabase Auth                 │
│         (Google, Email/Password, Anonymous Guest)           │
└──────────────────────┬───────────────────┬──────────────────┘
                       │                   │
┌──────────────────────▼───────────────────▼──────────────────┐
│                          API LAYER                          │
│          Node.js + Express REST Backend Gateway             │
│   (Auth Validation, Security, Rate Limiting, AI, Analytics) │
└──────────────────────┬───────────────────┬──────────────────┘
                       │                   │
┌──────────────────────▼───────────────────▼──────────────────┐
│                     INTELLIGENCE LAYER                      │
│            Gemini, OpenAI, & Perplexity APIs                │
│    (Translation, Meaning, Breakdown, Assistant Services)    │
└──────────────────────┬───────────────────┬──────────────────┘
                       │                   │
┌──────────────────────▼───────────────────▼──────────────────┐
│                         DATA LAYER                          │
│     Supabase PostgreSQL        │    Firebase Firestore      │
│     (Primary Data Store)       │    (Daily Telemetry Logs)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2.2 CLIENT LAYER

### Web Application
- **Stack**: React, Vite, React Router, Framer Motion, Tailwind CSS
- **Features**: Highly responsive student dashboards, interactive study flows, modular script lists, and seamless animations.

### Future Mobile App
- **Stack**: Flutter (Dart)
- **Features**: Firebase integration, cross-platform Android & iOS builds, and local caching for offline learning support.

---

## 2.3 AUTHENTICATION LAYER

Authentication leverages both Firebase Auth and Supabase Auth to provide secure sign-in flows:
- **Google Login**: Federated social identity authorization.
- **Email & Password**: Conventional secure credentials sign-in.
- **Anonymous Guest Mode**: Trial access without registration.
- **Verification**: Session tokens verified client-side and server-side via Supabase cookie configurations.

---

## 2.4 API LAYER (BACKEND GATEWAY)

A lightweight gateway managed via **Node.js and Express** handles REST endpoints.
- **Auth Validation**: Verifies identity tokens in headers before invoking downstream services.
- **API Security**: Encrypts requests and validates input parameters.
- **Rate Limiting**: Throttles anonymous and standard tier routes to prevent automated crawler abuse.
- **AI Request Proxying**: Proxies client requests securely to AI endpoints (Gemini, OpenAI, Perplexity).
- **Analytics Collection**: Captures telemetry details for progress audits.

---

## 2.5 DATABASE LAYER

### Supabase (PostgreSQL) — Primary Transactional Store
Supabase is the core datastore of the platform, hosting all relational tables under the `public` schema.
- Profiles data (`profiles`)
- Preferences & Settings (`user_settings`)
- Streaks & Stats (`user_streaks`, `user_stats`)
- Subscriptions (`entitlements`)
- Progress (`lesson_progress`, `jlpt_progress`)
- SRS Memory states (`review_queue`, `user_learned_words`)
- Gamification definitions (`badges`, `user_badges`)
- Usage trackers (`usage_counters`, `usage_log`)
- Messages (`ai_chat_messages`)
- Security & moderation (`admin_roles`, `moderation_reports`, `activity_logs`, `admin_audit_logs`)

### Firebase Firestore — Telemetry Logs Store
Firestore collects high-throughput timeline logging.
- `/users/{userId}/dailyLogs`: Stores chronologically logged days, daily XP earned, and lessons completed.

---

## 2.6 AI LEARNING ENGINE (AI SERVICES)

AI operations are handled by an ensemble of model interfaces (Gemini, OpenAI, and Perplexity APIs):
- **Translation Engine**: Translates phrases in real-time (Japanese ⇄ English).
- **Word Meaning Engine**: Extracts vocabulary meaning, usage notes, synonyms, and context sentences.
- **Sentence Breakdown Engine**: Deconstructs complicated syntax and identifies core grammar constructs.
- **Learning Assistant**: Analyzes incorrect answers to suggest custom explanations and revision tracks.

---

## 2.7 DEPLOYMENT & OBSERVABILITY

- **Hosting & Infrastructure**:
  - **Web Client**: Hosted on **Vercel** for optimal global delivery.
  - **API gateway**: Deployed on **Render** server environments.
  - **Database & Storage**: Supabase (PostgreSQL) & Firebase (Firestore / Storage).
- **Telemetry**: Google Analytics, Firebase Analytics, and activity logging inside Supabase usage ledgers.
