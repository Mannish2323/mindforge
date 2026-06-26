# Learn with Velmorth v2 — Build Order

This document details the phased implementation roadmap to successfully develop and deploy Learn with Velmorth v2.

---

## Roadmap Phases

### Phase 1 — Brand & Design System
- Define Tailwind design tokens (colors, font-size, layout grids).
- Create core Atoms (buttons, inputs, cards, progress bars, loaders).
- Establish animation physics styles (Framer Motion spring curves).

### Phase 2 — Route Map & Navigation Shell
- Configure Next.js Route groups (`(marketing)`, `(auth)`, `(app)`, `(admin)`).
- Create persistent layout elements (Header navigation, desktop sidebars, mobile bottom navigation tab bars).
- Implement global middleware for session checking.

### Phase 3 — Database Schema & RLS Setup
- Create base tables matching transactional fields (Identity, Content, Practice, Progress, AI, System).
- Write Row Level Security (RLS) constraints for every database table.
- Seed database with primary N5 vocabulary, kanji, and grammar data logs.

### Phase 4 — Authentication & User Bootstrap
- Integrate Supabase Auth.
- Create login/signup views.
- Automate profile row insertion in SQL triggers after Auth signups.

### Phase 5 — Onboarding Experience
- Prompt new users for name, daily study goal target (minutes), and JLPT targets.
- Create placement check challenges.

### Phase 6 — Student Dashboard
- Connect home dashboard view to profiles, streaks, stats, and settings tables.
- Construct the circular study duration target progress visualizer.

### Phase 7 — Interactive Learning Engine
- Develop the core lessons visual framework.
- Integrate step slides: vocabulary display, grammar analysis notes, reading logs, and writing canvases.
- Implement post-slide quizzes containing multiple-choice, matching, and text inputs.

### Phase 8 — Spaced Repetition (SRS) Engine
- Implement SM-2 mathematical calculations.
- Build reviews dashboards feeding off database review queries where `next_due_date <= now`.
- Set up automatic triggers updating user streaks and awarding lesson XP.

### Phase 9 — Sakura AI Tutor
- Create secure Edge Functions communicating with Google Gemini API.
- Enforce users' daily message limits.
- Render interactive messaging feeds containing suggestions.

### Phase 10 — Premium billing & Payments
- Develop subscription pricing tables.
- Implement Razorpay checkout widgets.
- Write verified webhooks verifying payment hashes.

### Phase 11 — Community Feed & Rankings
- Create post comments boards.
- Develop friend matching tables.
- Programmatically calculate leaderboard brackets.

### Phase 12 — Admin CMS
- Develop role-gated admin views.
- Implement UI tables creating/editing courses curriculum.
- Build files uploads triggers linked to Storage.

### Phase 13 — Platform Packaging (PWA & Capacitor)
- Write `manifest.json` configurations.
- Package app through Capacitor to generate Android APK wrappers.

### Phase 14 — Performance Optimization & Testing
- Establish testing logs for engines calculations.
- Optimize core web vitals (Next.js image caching).

### Phase 15 — Deploy & Monitor
- Configure Vercel environments variables.
- Connect crash logs tracking tools.
