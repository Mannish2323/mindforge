/**
 * Velmorth Global Animation System
 * ══════════════════════════════════
 * Single source of truth for ALL motion in the app.
 * Import these instead of writing ad-hoc Framer Motion variants.
 *
 * Principles:
 *  • 60 FPS — GPU-accelerated transforms only (translate, scale, opacity, rotate)
 *  • No layout shift — avoid animating width/height/padding
 *  • Respects prefers-reduced-motion via Framer Motion's built-in support
 *  • Spring physics for organic feel; easeOut for entrances
 */

import { Variants, Transition } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Shared transitions
// ─────────────────────────────────────────────────────────────────────────────

export const spring = {
  gentle:   { type: 'spring', stiffness: 120, damping: 18, mass: 1 } as Transition,
  snappy:   { type: 'spring', stiffness: 260, damping: 20, mass: 0.8 } as Transition,
  bouncy:   { type: 'spring', stiffness: 380, damping: 14, mass: 0.9 } as Transition,
  slow:     { type: 'spring', stiffness: 60,  damping: 20, mass: 1.2 } as Transition,
};

export const ease = {
  entrance: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } as Transition, // expo out
  exit:     { duration: 0.22, ease: [0.4, 0, 1, 0.6]  } as Transition, // ease in
  smooth:   { duration: 0.35, ease: 'easeInOut'         } as Transition,
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌸 Page Transitions
// ─────────────────────────────────────────────────────────────────────────────

/** Default page enter/exit. Use on every page wrapper. */
export const pageEnter: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: ease.entrance },
  exit:    { opacity: 0, y: -8, transition: ease.exit },
};

/** Slide in from right (navigating forward). */
export const pageSlideRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: ease.entrance },
  exit:    { opacity: 0, x: -30, transition: ease.exit },
};

// ─────────────────────────────────────────────────────────────────────────────
// 📦 Container / Stagger
// ─────────────────────────────────────────────────────────────────────────────

/** Parent container that staggers its children. */
export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Tighter stagger for dense lists (feature rows, checkmarks). */
export const staggerTight: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0 } },
};

/** Wider stagger for hero sections. */
export const staggerWide: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// 📦 Card Reveal
// ─────────────────────────────────────────────────────────────────────────────

/** Card stagger child — spring reveal from below + slight scale. */
export const cardReveal: Variants = {
  initial: { opacity: 0, y: 40, scale: 0.95 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: spring.gentle,
  },
  exit: { opacity: 0, y: 20, scale: 0.96, transition: ease.exit },
};

/** Pricing card variant with slight extra delay per index (set via custom). */
export const pricingCard: Variants = {
  initial: { opacity: 0, y: 44, scale: 0.94 },
  animate: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { ...spring.gentle, delay: i * 0.1 },
  }),
};

// ─────────────────────────────────────────────────────────────────────────────
// 🖱️ Hover Interactions
// ─────────────────────────────────────────────────────────────────────────────

/** Standard card lift on hover. */
export const hoverLift = {
  whileHover: { y: -6, scale: 1.015, transition: spring.snappy },
  whileTap:   { scale: 0.97, transition: ease.smooth },
};

/** Premium card lift with 3D tilt — managed by mouse tracking in JS. */
export const premiumCardHover = {
  whileHover: { y: -12, scale: 1.02, transition: spring.gentle },
  whileTap:   { scale: 0.97, y: 0, transition: ease.smooth },
};

/** Button hover + tap. */
export const buttonInteraction = {
  whileHover: { scale: 1.03, transition: spring.snappy },
  whileTap:   { scale: 0.96, transition: ease.smooth },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔔 Notifications / Toasts
// ─────────────────────────────────────────────────────────────────────────────

export const toastSlide: Variants = {
  initial: { opacity: 0, y: -24, scale: 0.96 },
  animate: { opacity: 1, y: 0,   scale: 1, transition: spring.snappy },
  exit:    { opacity: 0, y: -16, scale: 0.96, transition: ease.exit },
};

// ─────────────────────────────────────────────────────────────────────────────
// 💬 AI Chat
// ─────────────────────────────────────────────────────────────────────────────

export const chatBubble: Variants = {
  initial: { opacity: 0, scale: 0.88, y: 10 },
  animate: { opacity: 1, scale: 1,    y: 0,
    transition: { ...spring.snappy, delay: 0 } },
};

export const typingDot: Variants = {
  animate: {
    y: [0, -5, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🏆 Achievements
// ─────────────────────────────────────────────────────────────────────────────

export const achievementPop: Variants = {
  initial: { opacity: 0, scale: 0.5, rotate: -12 },
  animate: {
    opacity: 1, scale: 1, rotate: 0,
    transition: { ...spring.bouncy, delay: 0.1 },
  },
};

export const xpCountUp: Variants = {
  initial: { opacity: 0, scale: 0.7 },
  animate: {
    opacity: 1, scale: 1,
    transition: spring.bouncy,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 💳 Pricing
// ─────────────────────────────────────────────────────────────────────────────

/** Animated gradient border on recommended/current plan card. */
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 0px rgba(109,60,255,0)',
      '0 0 30px rgba(109,60,255,0.35)',
      '0 0 60px rgba(200,80,255,0.25)',
      '0 0 30px rgba(109,60,255,0.35)',
      '0 0 0px rgba(109,60,255,0)',
    ],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Crown / badge float. */
export const floatBadge: Variants = {
  animate: {
    y: [-3, 3, -3],
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Sparkle spin. */
export const sparkleSpin: Variants = {
  animate: {
    rotate: [0, 20, -20, 0],
    scale:  [1, 1.2, 1],
    transition: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 📚 Lesson Complete
// ─────────────────────────────────────────────────────────────────────────────

export const lessonComplete: Variants = {
  initial: { opacity: 0, scale: 0.6 },
  animate: {
    opacity: 1, scale: 1,
    transition: { ...spring.bouncy, delay: 0.2 },
  },
};

/** Progress ring fill — animate strokeDashoffset in CSS or use SVG animation. */
export const ringFill: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1, opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// ✅ Feature List Checkmark Stagger
// ─────────────────────────────────────────────────────────────────────────────

export const featureRow: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: {
    opacity: 1, x: 0,
    transition: spring.gentle,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🔢 Count-Up Number animation (trigger with useSpring / useAnimate)
// ─────────────────────────────────────────────────────────────────────────────

export const numberReveal: Variants = {
  initial: { opacity: 0, y: 12, scale: 0.85 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: spring.snappy,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 🌸 Misc Helpers
// ─────────────────────────────────────────────────────────────────────────────

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: ease.entrance },
  exit:    { opacity: 0, transition: ease.exit },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: ease.entrance },
};

export const slideFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: ease.entrance },
};

export const slideFromRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: ease.entrance },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: spring.gentle },
  exit:    { opacity: 0, scale: 0.92, transition: ease.exit },
};

/** Breathing glow — for background elements. */
export const breathingGlow: Variants = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    scale:   [0.98, 1.04, 0.98],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

/** Streak fire wiggle. */
export const streakFire: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    rotate: [0, -5, 5, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
  },
};
