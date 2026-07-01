# 📄 Learning Velmorth v3
## Document 2 — Complete Application Architecture & System Blueprint

---

# Master Architecture

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
Web
PWA
Android APK
Future iOS
Admin Panel
```

---

## Layer 2 — Presentation

```text
Splash
Authentication
Dashboard
Lessons
Vocabulary
Grammar
Kanji
Speaking
Writing
Listening
Reading
Sakura AI
Community
Premium
Notifications
Profile
Settings
Admin
```

---

## Layer 3 — Feature Modules

```text
Authentication
Onboarding
Dashboard
Learning Engine
Vocabulary Engine
Grammar Engine
Kanji Engine
Writing Engine
Speaking Engine
Reading Engine
Listening Engine
Quiz Engine
Revision Engine
Achievement Engine
Community
Premium
Profile
Notifications
Admin
```

---

## Layer 4 — Business Logic

```text
XP Engine
Level Engine
Coin Engine
Achievement Engine
Daily Goal Engine
Lesson Unlock Engine
Roadmap Engine
Reminder Engine
Notification Engine
Recommendation Engine
Premium Engine
Leaderboard Engine
Review Queue Engine
```

---

## Layer 5 — Backend

```text
Authentication
Database
Storage
Realtime
Edge Functions
AI Gateway
Payment Gateway
Analytics
Logging
Security
```

---

# Folder Structure

```text
src

├── app
│
├── components
│     ├── ui
│     ├── layout
│     ├── shared
│     ├── charts
│     ├── forms
│     ├── dialogs
│     └── animations
│
├── features
│     ├── auth
│     ├── onboarding
│     ├── dashboard
│     ├── lessons
│     ├── grammar
│     ├── vocabulary
│     ├── kanji
│     ├── speaking
│     ├── writing
│     ├── listening
│     ├── reading
│     ├── ai
│     ├── community
│     ├── premium
│     ├── profile
│     ├── settings
│     └── admin
│
├── services
│
├── hooks
│
├── stores
│
├── lib
│
├── api
│
├── types
│
├── utils
│
├── constants
│
├── assets
│
├── public
│
└── styles
```

---

# Navigation Structure

```text
Splash
↓
Google Login
↓
Onboarding
↓
Dashboard
↓
Home
↓
Lessons
↓
Vocabulary
↓
Grammar
↓
Kanji
↓
Writing
↓
Speaking
↓
Listening
↓
Reading
↓
Quiz
↓
Results
↓
Achievements
↓
Community
↓
Premium
↓
Profile
↓
Settings
```

---

# Dashboard Structure

```text
Greeting
↓
Continue Learning
↓
Today's Goal
↓
XP
↓
Level
↓
Current Lesson
↓
Quick Practice
↓
Vocabulary
↓
Grammar
↓
Kanji
↓
Speaking
↓
Writing
↓
Listening
↓
Reading
↓
Sakura AI
↓
Leaderboard
↓
Achievements
↓
Premium
↓
Notifications
```

---

# Learning Flow

```text
Roadmap
↓
Course
↓
Module
↓
Lesson
↓
Vocabulary
↓
Grammar
↓
Writing
↓
Speaking
↓
Listening
↓
Reading
↓
Quiz
↓
Score
↓
XP
↓
Achievement
↓
Save Progress
↓
Unlock Next Lesson
```

---

# Sakura AI Architecture

```text
User
↓
Prompt
↓
Prompt Validation
↓
Context Builder
↓
Learning History
↓
Gemini AI
↓
Safety Filter
↓
Response Formatter
↓
Recommendation Engine
↓
Conversation Save
↓
Notification Engine
↓
Display Response
```

---

# Notification Architecture

```text
Server Event
↓
Notification Created
↓
Database Saved
↓
Push Sent
↓
App Receives
↓
Animation
↓
User Click
↓
Navigate
↓
Mark As Read
↓
Badge Count Updated
↓
History Saved
```

---

# Premium Flow

```text
Plans
↓
Select Plan
↓
Create Razorpay Order
↓
Payment
↓
Verify Signature
↓
Activate Subscription
↓
Unlock Features
↓
Refresh Dashboard
```

---

# Profile Architecture

```text
Avatar
↓
Personal Information
↓
XP
↓
Level
↓
Learning Statistics
↓
Achievements
↓
Bookmarks
↓
Certificates
↓
Subscription
↓
Settings
```

---

# Settings Structure

```text
Profile
Language
Theme
Notifications
Voice
Reminder
Accessibility
Downloads
Privacy
Security
Delete Account
Logout
About
Help
Feedback
```

---

# Responsive Architecture

```text
Desktop
Sidebar
Top Navbar
Multi-column Layout

────────────────────

Tablet
Collapsible Sidebar
Two-column Layout

────────────────────

Mobile
Top Bar
Bottom Navigation
Single-column Layout
Safe Area Support
```

---

# Design Rules

Every screen must include:
✔ Loading State
✔ Empty State
✔ Error State
✔ Success State
✔ Skeleton Loading
✔ Smooth Animation
✔ Responsive Layout
✔ Accessibility
✔ Dark Theme
✔ Light Theme (Future)

---

# Performance Rules

Use:
Lazy Loading
Code Splitting
Image Optimization
Caching
Virtual Lists
Prefetching
Memoization
Optimistic Updates
Offline Cache
Background Sync

---

# Architecture Principles

One Frontend
↓
One Backend
↓
One Authentication System
↓
One Database
↓
One AI Engine
↓
One Premium System
↓
One Notification System
↓
One Design System
↓
One Shared Component Library
↓
One Responsive Experience

---

# Final Development Rule

Every feature must satisfy all of the following before release:
* Connected to backend
* Responsive on Android, Tablet, Desktop
* Uses reusable components
* Secure authentication
* Supports loading, error and empty states
* Integrated with notifications
* Updates user progress correctly
* Works with Sakura AI where applicable
* Tested for accessibility and performance
* Ready for production deployment
