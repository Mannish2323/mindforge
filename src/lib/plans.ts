// ─────────────────────────────────────────────────────────────────────────────
// lib/plans.ts — Single source of truth for all subscription plan config
// ─────────────────────────────────────────────────────────────────────────────

export type PlanId = 'free' | 'starter' | 'plus' | 'pro' | 'ai_max';

export type SubscriptionStatus =
  | 'free'
  | 'trial_pending'
  | 'trial_active'
  | 'active'
  | 'payment_pending'
  | 'payment_failed'
  | 'cancelled'
  | 'expired'
  | 'starter'
  | 'plus'
  | 'pro'
  | 'ai_max'
  | 'yearly';

export type PlanStatus = SubscriptionStatus;

export interface PlanConfig {
  id: PlanId;
  name: string;
  subtitle: string;
  price: number;              // INR
  pricePaise: number;         // for Razorpay (price * 100)
  periodLabel: string;        // display label e.g. "/ week"
  periodDays: number | null;  // null = forever (free)
  color: string;              // accent hex
  gradFrom: string;
  gradTo: string;
  emoji: string;
  popular: boolean;
  badge?: string;
  trialDays: number;          // 1 for paid plans, 0 for free
  trialLabel: string;         // '1-Day Free Trial'
  recurringDescription: string;
  aiChatsPerDay: number;
  lessonsPerDay: number | null; // null = unlimited
  heartsMax: number;
  adsEnabled: boolean;
  features: string[];
  notIncluded: string[];
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    subtitle: 'Start your journey',
    price: 0,
    pricePaise: 0,
    periodLabel: 'forever',
    periodDays: null,
    color: '#9ca3af',
    gradFrom: '#1f2937',
    gradTo: '#111827',
    emoji: '🌱',
    popular: false,
    trialDays: 0,
    trialLabel: 'Free Forever',
    recurringDescription: 'No charges ever',
    aiChatsPerDay: 5,
    lessonsPerDay: 5,
    heartsMax: 25,
    adsEnabled: true,
    features: [
      'JLPT N5 core lessons',
      '5 lessons per day',
      'Basic vocabulary & grammar',
      'Daily streak & XP system',
      'Progress tracking',
      'Community access',
      '5 AI chats/day',
    ],
    notIncluded: [
      'Writing practice',
      'Speaking practice',
      'Mock tests',
      'Offline downloads',
      'Advanced JLPT content',
    ],
  },

  starter: {
    id: 'starter',
    name: 'Starter',
    subtitle: 'For serious beginners',
    price: 99,
    pricePaise: 9900,
    periodLabel: '/ week',
    periodDays: 7,
    color: '#60a5fa',
    gradFrom: '#1e3a5f',
    gradTo: '#172d4d',
    emoji: '⚡',
    popular: false,
    trialDays: 1,
    trialLabel: '1-Day Free Trial',
    recurringDescription: '₹99 billed every 7 days after 1-day trial',
    aiChatsPerDay: 15,
    lessonsPerDay: 15,
    heartsMax: 75,
    adsEnabled: false,
    features: [
      '1-Day Free Trial included',
      'No ads',
      'JLPT N5 full + N4 preview',
      '15 lessons per day',
      '15 AI chats per day',
      'Writing practice (basic)',
      'Speaking practice (basic)',
      'Smart daily review',
      'Weak word detection',
      'Progress sync',
    ],
    notIncluded: [
      'Full N4 content',
      'AI pronunciation scoring',
      'Mock tests',
      'Offline downloads',
    ],
  },

  plus: {
    id: 'plus',
    name: 'Plus',
    subtitle: 'Accelerate your learning',
    price: 149,
    pricePaise: 14900,
    periodLabel: '/ 10 days',
    periodDays: 10,
    color: '#a78bfa',
    gradFrom: '#3b1f6b',
    gradTo: '#2d1654',
    emoji: '⭐',
    popular: false,
    trialDays: 1,
    trialLabel: '1-Day Free Trial',
    recurringDescription: '₹149 billed every 10 days after 1-day trial',
    aiChatsPerDay: 40,
    lessonsPerDay: 30,
    heartsMax: 90,
    adsEnabled: false,
    features: [
      '1-Day Free Trial included',
      'Everything in Starter',
      'JLPT N5 + N4 full content',
      '30 lessons per day',
      '40 AI chats per day',
      'Full writing practice + AI correction',
      'Full speaking practice + pronunciation AI',
      'Mock tests',
      'Smart review engine',
      'AI study planner',
      'Downloads & offline mode',
      'Faster support',
    ],
    notIncluded: [
      'N3–N1 content',
      'AI conversation partner',
      'Business / interview Japanese',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Full Japanese mastery',
    price: 249,
    pricePaise: 24900,
    periodLabel: '/ 15 days',
    periodDays: 15,
    color: '#f59e0b',
    gradFrom: '#5c3a0a',
    gradTo: '#3d2507',
    emoji: '👑',
    popular: false,
    badge: 'Best Value',
    trialDays: 1,
    trialLabel: '1-Day Free Trial',
    recurringDescription: '₹249 billed every 15 days after 1-day trial',
    aiChatsPerDay: 100,
    lessonsPerDay: null,
    heartsMax: 100,
    adsEnabled: false,
    features: [
      '1-Day Free Trial included',
      'JLPT N5→N1 all content',
      'Unlimited lessons',
      'No ads ever',
      '100 AI chats per day',
      'AI tutor + conversation partner',
      'AI grammar, vocabulary & sentence explainer',
      'AI translation & writing correction',
      'AI pronunciation analysis',
      'Writing stroke order + validation',
      'Speaking, interview & business Japanese',
      'Reading & listening practice',
      'Idioms, proverbs, counters',
      'Flashcards, bookmarks & downloads',
      'Smart revision & adaptive learning',
      'Unlimited mock tests',
      'Full analytics & achievement badges',
      'Priority sync & cloud backup',
      'Premium theme',
    ],
    notIncluded: [],
  },

  ai_max: {
    id: 'ai_max',
    name: 'AI Max',
    subtitle: 'For heavy AI users',
    price: 399,
    pricePaise: 39900,
    periodLabel: '/ month',
    periodDays: 30,
    color: '#e879f9',
    gradFrom: '#5b0f72',
    gradTo: '#3d0a4f',
    emoji: '🤖',
    popular: true,
    badge: 'Most Complete',
    trialDays: 1,
    trialLabel: '1-Day Free Trial',
    recurringDescription: '₹399 billed monthly after 1-day trial',
    aiChatsPerDay: 500,
    lessonsPerDay: null,
    heartsMax: 100,
    adsEnabled: false,
    features: [
      '1-Day Free Trial included',
      'Everything in Pro',
      '500 AI chats per day',
      'Priority AI responses',
      'Long AI conversations',
      'Advanced AI study planner',
      'Personalized learning roadmap',
      'AI-generated quizzes & practice exams',
      'AI interview simulator',
      'AI writing reviewer & speaking coach',
      'AI pronunciation coach',
      'AI homework helper',
      'AI flashcard generator',
      'AI learning analytics dashboard',
      'Beta features early access',
      'Priority support',
    ],
    notIncluded: [],
  },
};

export const PLAN_ORDER: PlanId[] = ['free', 'starter', 'plus', 'pro', 'ai_max'];

export function getPlanById(id: string | undefined | null): PlanConfig {
  return PLANS[(id as PlanId) || 'free'] || PLANS.free;
}

export function isPremiumPlan(planId: string | undefined | null): boolean {
  return ['starter', 'plus', 'pro', 'ai_max'].includes(planId || '');
}

/** Check if user has active trial access */
export function isTrialActive(
  status: string | undefined | null,
  trialEndsAt: string | null | undefined
): boolean {
  if (status === 'trial_active') {
    if (!trialEndsAt) return true;
    return new Date(trialEndsAt) > new Date();
  }
  return false;
}

/** Server-authoritative check for premium status */
export function isSubscriptionActive(
  status: string | undefined | null,
  endsAt: string | null | undefined,
  trialEndsAt?: string | null | undefined
): boolean {
  if (!status || status === 'free' || status === 'expired') return false;

  // Active trial
  if (status === 'trial_active') {
    const end = trialEndsAt || endsAt;
    return end ? new Date(end) > new Date() : true;
  }

  // Active paid plan
  if (['active', 'starter', 'plus', 'pro', 'ai_max', 'yearly'].includes(status)) {
    return endsAt ? new Date(endsAt) > new Date() : true;
  }

  // Cancelled but period not finished yet
  if (status === 'cancelled') {
    return endsAt ? new Date(endsAt) > new Date() : false;
  }

  // Payment pending with grace period check
  if (status === 'payment_pending') {
    return endsAt ? new Date(endsAt) > new Date() : false;
  }

  return false;
}

/** Formats subscription status into user-friendly label */
export function formatSubscriptionStatus(status: string | undefined | null): {
  label: string;
  badgeVariant: 'green' | 'amber' | 'purple' | 'red' | 'gray';
} {
  switch (status) {
    case 'trial_active':
      return { label: '1-Day Trial Active', badgeVariant: 'purple' };
    case 'trial_pending':
      return { label: 'Trial Pending Autopay', badgeVariant: 'amber' };
    case 'active':
    case 'starter':
    case 'plus':
    case 'pro':
    case 'ai_max':
    case 'yearly':
      return { label: 'Active', badgeVariant: 'green' };
    case 'payment_pending':
      return { label: 'Payment Processing', badgeVariant: 'amber' };
    case 'payment_failed':
      return { label: 'Payment Failed', badgeVariant: 'red' };
    case 'cancelled':
      return { label: 'Cancelled (Active until period end)', badgeVariant: 'amber' };
    case 'expired':
      return { label: 'Expired', badgeVariant: 'gray' };
    case 'free':
    default:
      return { label: 'Free Plan', badgeVariant: 'gray' };
  }
}

/** Duration label for display */
export function getPeriodDays(planId: PlanId): number {
  return PLANS[planId].periodDays || 0;
}

/** Returns 1-day trial end Date (24 hours from now) */
export function calcTrialEndsAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d;
}

/** Returns ends_at Date for a given plan starting now or after trial */
export function calcEndsAt(planId: PlanId, fromDate: Date = new Date()): Date {
  const days = PLANS[planId].periodDays;
  const d = new Date(fromDate);
  if (days) d.setDate(d.getDate() + days);
  return d;
}
