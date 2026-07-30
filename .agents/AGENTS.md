# 🌸 Mindforge — Yample Labs Project Rules

---

## 🏢 Brand Identity
- **Company:** Yample Labs
- **Product:** Mindforge
- **AI Assistant:** Sakura AI (powered by Google Gemini 2.0, prompt: `SAKURA_SENSEI_PROMPT`)
- **Repository:** `learn-with-velmorth` (GitHub slug — do not change code imports)

---

## 🎨 Master Branding & Theme Design
- **Color Palette:** Curated Sakura-Pink + Purple gradient design. Slick, clean dark mode configurations with modern glassmorphism UI structures.
- **AI Assist:** Sakura AI virtual mascot widget is dynamically accessible on learning pages and conversation panels.
- **Experience:** Fast loading times, low-latency API wrappers, and polished visual components.

---

## 📱 Mobile-First Responsive Design System

Always prioritize responsive mobile layouts and expand cleanly to tablet and desktop layouts without creating overlapping elements.

### 1. Viewport Standards
- **Mobile (Master Reference):** `390 × 844 px` (iPhone 14 / modern Android viewport)
- **Tablet:** `768 × 1024 px`
- **Desktop:** `1440 × 900 px`
  * Never make desktop pages just a zoomed version of the mobile view.
  * Use sidebar components, expanded panels, and multi-column grid spaces on wider displays.

### 2. Layout Grid Rules
- **Mobile:** Single column layout (`grid-cols-1`)
- **Tablet:** Dual column layout (`grid-cols-2`)
- **Desktop:** Multi-column layout (`grid-cols-3` to `grid-cols-4`)

---

## 📐 Layout & Spacing Rules

- **Padding:**
  * Mobile: `16px` (`p-4`)
  * Tablet: `24px` (`p-6`)
  * Desktop: `32px` (`p-8`)
- **Component Height:**
  * Buttons & Inputs: Consistent `56px` (`h-14`) for optimized thumb triggers.
- **Radius & Gap:**
  * Card Border Radius: `16px` to `24px` (`rounded-2xl` to `rounded-3xl`)
  * Content Gaps: `16px` (`gap-4`)

---

## 🅰️ Typography Hierarchy

- **H1:** `40px` (`text-4xl`)
- **H2:** `32px` (`text-3xl`)
- **H3:** `24px` (`text-2xl`)
- **Body:** `16px` (`text-base`)
- **Caption:** `14px` (`text-sm`)

---

## 🎬 Animation Rules
Ensure consistent 60 FPS transitions across all viewports:
- Interactive glow components on logos.
- Falling Sakura petals animations.
- Web pointer hovers (`hover:scale-105`) and mobile-touch haptic ripple indicators.
- Smooth page slides and fade transitions using Framer Motion spring physics.
- Skeleton and shimmer loaders for all async components.
- Floating animations on the Sakura AI avatar widget.

---

## 🔋 Capacitor & Android Safe Area
Ensure that no elements overlap with phone safe boundaries (notches, status bars, gesture tabs):
- Implement native safe padding classes (`padding-top: env(safe-area-inset-top)` / `padding-bottom: env(safe-area-inset-bottom)`).
- Ensure bottom navigation bars align perfectly above gesture bars.

---

## 🌐 One Codebase Strategy
Maintain a unified, pixel-perfect layout using Next.js, Capacitor wrappers, and Row Level Security API structures. Ensure zero responsive page bugs or missing elements.
