# Learn with Velmorth v2 — Feature Map

This document lists the routes and client views available in the Next.js Web App.

---

## Marketing & Pre-Login Routes
- `/` — Landing page highlighting platform benefits, Mascot introduction, and CTA buttons.
- `/pricing` — Detailed features and comparison grid for Starter, Plus, and Pro tiers.
- `/terms` / `/privacy` — Standard terms of service and dynamic privacy policy documents.

---

## Authentication Routes (`(auth)`)
- `/auth/login` — Tabbed unified login/signup component with OAuth options.
- `/auth/forgot-password` — Password reset trigger screen.

---

## Protected App Routes (`(app)`)

### 1. Core Dashboards
- `/home` — Dynamic dashboard view containing study statistics (XP, level, streak, goals progress ring), quick actions panel, and direct links to active sections.
- `/jlpt` — Progression roadmap from N5 to N1 levels.
- `/profile` — Student progress breakdown, badges inventory, join details, and public profile sharing.
- `/settings` — Custom settings management (themes toggle, daily reminders time picker, accounts deletion, password updates).

### 2. Learning Modules
- `/path` — Standard interactive curriculum timeline mapping course modules.
- `/vocabulary` — Word lists by topic/level, interactive flashcard carousel with text-to-speech.
- `/grammar` — Key grammatical patterns with sample sentences and conjugation guidelines.
- `/kanji` — List of characters by JLPT difficulty, stroke order guide, writing canvas with real-time feedback.

### 3. Practice & Review Systems
- `/review` — Spaced Repetition (SRS) dashboard displaying cards due today and review history logs.
- `/quiz` — Integrated test environment displaying multiple choice, select-matching, and text fill-in-the-blank questions.
- `/writing` — Kana and kanji tracing boards tracking line accuracy.
- `/speaking` / `/speak` — Speech-to-text pronunciation practice evaluation.
- `/listening` — Conversation dialogues with shadowing timelines.
- `/reading` — Passage lists with comprehension exercises.

### 4. Smart Tutor
- `/ai-tutor` — Dynamic conversational chat screen with AI Tutor Velmorth (Sakura personality).

### 5. Gamification & Community
- `/leaderboard` — League charts highlighting weekly/monthly rankings.
- `/community` — Discussion boards, activity streams, and friend connections.
- `/achievements` — Badge collections page showing unlock status.

---

## Role-Gated Admin Panel (`(admin)`)
- `/admin` — High-level admin overview metrics.
- `/admin/content` — CMS interface for curating course paths, lesson definitions, and audio/image assets uploads.
- `/admin/users` — Account query tables for roles management.
- `/admin/payments` — Detailed transaction tables auditing Razorpay invoices.
