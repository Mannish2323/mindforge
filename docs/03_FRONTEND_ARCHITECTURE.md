# LEARN WITH VELMORTH — FRONTEND ARCHITECTURE
## Section 3: Complete Frontend Architecture

---

## 3.1 CLIENT LAYOUT OVERVIEW

The frontend ecosystem of Learn With Velmorth consists of a highly responsive, modern Web Application alongside plans for a cross-platform mobile app.

```
learn-with-velmorth/
├── app/                              # Future Flutter Mobile Application
│   ├── lib/
│   │   ├── core/                     # Connectivity, local storage, security
│   │   ├── features/                 # Flashcards, grammar lessons, quizzes
│   │   └── main.dart                 # Flutter entrypoint
│   └── pubspec.yaml
├── apps/
│   └── web/                          # Vite + React Web Application
│       ├── src/
│       │   ├── app/                  # Main Router and Page Components
│       │   ├── components/           # Vocabulary builder, Quiz Engine, Leaderboards
│       │   ├── context/              # Auth & Theme states
│       │   ├── styles/               # Tailwind directives and CSS animations
│       │   └── main.tsx              # React client mount root
│       ├── package.json
│       ├── vite.config.ts
│       └── tailwind.config.js
└── packages/                         # Monorepo workspaces
    ├── design-tokens/                # Brand accent constants & spacing
    └── types/                        # Shared TypeScript typings
```

---

## 3.2 WEB APPLICATION ARCHITECTURE

The web client is built with React, Vite, React Router, Framer Motion, and Tailwind CSS to guarantee high-performance rendering and fluent layout transitions:
- **React & Vite**: Extremely fast HMR (Hot Module Replacement) and bundling.
- **React Router**: Manages client-side routing between dashboards, active lessons, script laboratories, and admin panels.
- **Framer Motion**: Drives premium micro-interactions, spring-physics animations, list rearrangements, and lesson complete celebrations.
- **Tailwind CSS**: Simplifies responsive UI layout definitions with harmonious tailwind color palettes.

### Core Web Modules
1. **Vocabulary Builder**: Word flashcards with audio support, meaning panels, and test routines.
2. **Grammar Training**: Structured interactive lessons.
3. **Quiz Engine**: High-fidelity MCQs, fill-in-the-blank input fields, and listening/writing testing templates.
4. **Student Dashboard**: Quick overview of streaks, XP thresholds, level progress, and AI recommendations.
5. **Admin Panel**: Course management, user lists auditing, analytics monitoring, and dynamic lesson content publishing.

---

## 3.3 FUTURE MOBILE CLIENT ARCHITECTURE

The mobile application is designed to be cross-platform, ensuring low latency and native feels:
- **Flutter Framework**: Single codebase compilation for iOS and Android.
- **Firebase Integration**: Native syncing with Firebase Authentication and Cloud Messaging.
- **Offline Learning Support**: Local database integration to allow users to practice offline with sync queues that upload progress metrics when internet connection restores.

---

## 3.4 STYLING & CORE BRAND THEME

The brand identity uses a dark cosmic design:
- **Electric Indigo**: The primary color representing neural mapping and learning intensity.
- **Teal Mint**: The success color used for correct answers, progress bars, and level completion flags.
- **Coral Fire**: The alert color representing lost hearts, errors, and urgent warnings.
- **Typography**: Display titles are rendered in **Nunito**; functional UI descriptions use **Inter**.
