# 🚀 MINDFORGE — MASTER IMPLEMENTATION BLUEPRINT (v1.0)

## Mission

Build **Mindforge** as a world-class AI-powered Japanese learning platform using a single production-ready architecture.

This is **NOT** a prototype.

This is **NOT** a demo.

This project must be built as if it will be released on the Google Play Store and production web tomorrow.

---

## Read First

Before writing or modifying any code:

1. Read every document inside `/docs`.
2. Understand the architecture completely.
3. Understand dependencies.
4. Preserve existing backend logic.
5. Preserve Supabase integration.
6. Preserve Gemini integration.
7. Preserve Razorpay integration.
8. Preserve Environment Variables.
9. Preserve middleware.
10. Preserve business logic.

Never ignore the documentation.

Documentation is the single source of truth.

---

## Technology Stack

**Frontend**

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- TanStack Query
- React Hook Form
- Zod

**Backend**

- Supabase
- PostgreSQL
- Edge Functions
- Storage
- Realtime

**Authentication**

- Google Login (Primary)

**AI**

- Gemini API
- Sakura AI

**Payments**

- Razorpay

**Deployment**

- Vercel

**Android**

- Capacitor

---

## Project Goals

Create one responsive application that works on:

- Web
- Android
- PWA

Future: iOS

One codebase.

One backend.

One database.

---

## Build Rules

Never generate:

- Demo users
- Placeholder content
- Fake statistics
- Fake lessons
- Dummy notifications
- Broken components
- Duplicate logic

Everything must be connected to real backend data.

---

## Architecture Rules

Use Feature-first architecture.

Separate:

Presentation
↓
Features
↓
Business Logic
↓
Repositories
↓
Database
↓
Infrastructure

Never place business logic inside UI components.

---

## Folder Rules

Maintain a scalable folder structure.

Every feature must have:

- Components
- Hooks
- Services
- Types
- Validation
- Repositories
- State
- API
- Tests

---

## Authentication

Use Google Login.

Automatically create:

- Profile
- Settings
- Progress
- Subscription
- Notification Preferences
- AI Profile
- Dashboard

Protect all authenticated routes.

---

## Database

Use Supabase.

Enable:

- RLS
- Indexes
- Foreign Keys
- UUID
- Constraints
- Realtime
- Storage
- Edge Functions

Never bypass RLS.

---

## API

Every API must include:

- Validation
- Authentication
- Authorization
- Error Handling
- Logging
- Rate Limiting
- Typed Responses

Never expose secrets.

---

## Learning Engine

Implement:

- JLPT Roadmap
- Lessons
- Vocabulary
- Grammar
- Kanji
- Writing
- Speaking
- Listening
- Reading
- Quiz
- Mock Tests
- XP
- Achievements
- Streak
- Review Queue
- Adaptive Learning
- Progress Tracking
- Offline Sync

---

## Sakura AI

Sakura AI is the center of the application.

Implement:

- AI Chat
- Voice Chat
- Translation
- Grammar
- Vocabulary
- Kanji
- Writing Review
- Speaking Review
- Lesson Recommendation
- Study Planner
- Reminder
- Motivation
- Conversation Memory
- Safety Layer
- Usage Tracking

---

## Notification System

Notification Lifecycle:

Event → Database → Push → Animation → User Click → Open Correct Screen → Mark Read → Remove Badge → History

Unread notifications remain visible.

Support:

- Lesson
- Reminder
- Achievement
- Premium
- Community
- System

---

## Premium

Plans:

- Free
- Basic
- Pro

Implement:

- Razorpay
- Verification
- Subscription
- Feature Unlock
- Usage Limits
- Billing History
- Invoices

---

## Community

- Leaderboard
- Friends
- Posts
- Comments
- Challenges
- Achievements
- Notifications

---

## Profile

- Avatar
- Statistics
- Progress
- Certificates
- Bookmarks
- Achievements
- Subscription
- Settings
- History

---

## Settings

- Theme
- Language
- Reminder
- Notification
- Voice
- Accessibility
- Privacy
- Security
- Delete Account
- Logout

Every change syncs automatically.

---

## UI Rules

Premium UI.

Modern.

Japanese Inspired.

Dark Theme.

Purple Branding.

Glassmorphism.

Responsive.

No overlap.

No clipping.

No fixed layouts.

Use reusable components.

---

## Animation Rules

Framer Motion.

Implement:

- Splash
- Page Transition
- Button Ripple
- Card Hover
- Floating Sakura
- Notification Slide
- XP Animation
- Level Up
- Skeleton Loading
- Shimmer
- Success Animation

Animations must feel smooth and native.

---

## Responsive Rules

Support viewports:

- 320, 360, 375, 390, 412, 480, 768, 820, 1024, 1280, 1366, 1440, 1600, 1920

No overlapping.

No hidden UI.

Safe Area support.

Android navigation support.

---

## Android Requirements

Support:

- Notifications
- Microphone
- Storage
- Camera (Future)
- Offline
- Background Sync
- Deep Links
- Push Notifications
- Capacitor

---

## Security

- Google Authentication
- JWT
- Refresh Tokens
- HTTPS
- RLS
- Rate Limiting
- Audit Logs
- Encrypted Storage
- Secure API Keys

Never expose secrets.

---

## Performance

- Lazy Loading
- Image Optimization
- Caching
- Memoization
- Virtual Lists
- Route Splitting
- Background Sync
- Offline Cache
- Fast Initial Load

---

## Testing

Every feature must pass:

- UI Tests
- Responsive Tests
- Authentication Tests
- Database Tests
- API Tests
- AI Tests
- Notification Tests
- Performance Tests
- Accessibility Tests
- Security Tests
- Build Tests

No TypeScript errors.

No ESLint errors.

No build failures.

---

## Development Process

Never implement everything at once.

For every feature:

1. Analyze documentation.
2. Create architecture.
3. Implement.
4. Test.
5. Review.
6. Refactor.
7. Verify.
8. Commit.

Only then move to the next feature.

---

## Reporting

After every implementation generate:

- Files Created
- Files Modified
- Database Changes
- API Changes
- Dependencies Added
- Build Status
- TypeScript Status
- ESLint Status
- Test Results
- Security Review
- Performance Summary
- Project Health

---

## Final Goal

Mindforge must be:

- Production Ready
- Scalable
- Secure
- AI-first
- Responsive
- Offline-capable
- Accessible
- Maintainable
- Beautiful
- Fast
- Stable

Every feature must integrate seamlessly with every other feature, creating one unified ecosystem rather than isolated pages or modules.
