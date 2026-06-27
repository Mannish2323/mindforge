export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;

export type JLPTLevel = typeof JLPT_LEVELS[number];

export const JLPT_COLORS: Record<JLPTLevel, string> = {
  N5: '#22c55e', // Success Green
  N4: '#3b82f6', // Info Blue
  N3: '#8b5cf6', // Brand Purple
  N2: '#ec4899', // Accent Pink
  N1: '#f59e0b', // Warning Yellow
};

export const XP_VALUES = {
  LESSON_REWARD: 10,
  STORY_REWARD: 15,
  SPEAKING_REWARD: 20,
  QUIZ_REWARD: 15,
  PERFECT_BONUS: 5,
};

export const PLAN_LIMITS = {
  FREE: {
    hearts_max: 5,
    ai_limit_daily: 5,
    speaking_limit_daily: 2,
    custom_decks: false,
  },
  PREMIUM: {
    hearts_max: 999, // Infinite hearts
    ai_limit_daily: 100,
    speaking_limit_daily: 50,
    custom_decks: true,
  },
};

export const APP_ROUTES = {
  HOME: '/home',
  PATH: '/path',
  SCRIPT: '/script',
  SPEAK: '/speak',
  JLPT: '/jlpt',
  REVIEW: '/review',
  PROFILE: '/profile',
  BILLING: '/billing',
  ONBOARDING: '/onboarding',
  AUTH: '/auth',
};
