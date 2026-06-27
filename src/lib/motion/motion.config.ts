import { Variants } from 'framer-motion';

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const hoverScale = {
  whileHover: { scale: 1.015, transition: { duration: 0.2, ease: 'easeInOut' } },
  whileTap: { scale: 0.985 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export const chatBubbleVariant: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

export const streakFireAnimation: Variants = {
  animate: {
    scale: [1, 1.15, 1],
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 1.2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};
