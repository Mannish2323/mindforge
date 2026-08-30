'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlanConfig } from '@/lib/plans';
import { Check, X, Sparkles, Star, Zap, ShieldCheck } from 'lucide-react';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

export interface MFPlanCardProps {
  plan: PlanConfig;
  isActive: boolean;
  isLoading: boolean;
  onSelect: (planId: PlanConfig['id']) => void;
  isRecommended?: boolean;
}

export const MFPlanCard: React.FC<MFPlanCardProps> = ({
  plan,
  isActive,
  isLoading,
  onSelect,
  isRecommended = plan.popular,
}) => {
  const isFree = plan.price === 0;

  // Pastel paper tabs & theme styling based on plan id
  const themeConfig: Record<
    string,
    {
      tape: string;
      cardBg: string;
      borderColor: string;
      pillBg: string;
      btnVariant: 'primary' | 'yellow' | 'mint' | 'lavender' | 'secondary';
    }
  > = {
    free: {
      tape: 'washi-tape-mint',
      cardBg: 'bg-card',
      borderColor: 'border-edge',
      pillBg: 'bg-mint-light text-ink border-mint/40',
      btnVariant: 'secondary',
    },
    starter: {
      tape: 'washi-tape-yellow',
      cardBg: 'bg-yellow-light/40 dark:bg-card',
      borderColor: 'border-yellow/40 dark:border-edge',
      pillBg: 'bg-yellow-light text-ink border-yellow/40',
      btnVariant: 'yellow',
    },
    plus: {
      tape: 'washi-tape-pink',
      cardBg: 'bg-brand-light/40 dark:bg-card',
      borderColor: 'border-brand/40 dark:border-edge',
      pillBg: 'bg-brand-light text-ink border-brand/40',
      btnVariant: 'primary',
    },
    pro: {
      tape: 'washi-tape-pink',
      cardBg: 'bg-brand-light/60 dark:bg-card',
      borderColor: 'border-brand dark:border-brand/60',
      pillBg: 'bg-brand text-white border-brand',
      btnVariant: 'primary',
    },
    ai_max: {
      tape: 'washi-tape-lavender',
      cardBg: 'bg-lavender-light/40 dark:bg-card',
      borderColor: 'border-lavender/40 dark:border-edge',
      pillBg: 'bg-lavender-light text-ink border-lavender/40',
      btnVariant: 'lavender',
    },
  };

  const theme = themeConfig[plan.id] || themeConfig.free;

  return (
    <motion.div
      whileHover={{
        y: -4,
        transition: { type: 'spring', stiffness: 350, damping: 25 },
      }}
      whileTap={{ y: 0, transition: { duration: 0.1 } }}
      className={`
        relative flex flex-col justify-between h-full rounded-[24px] p-6 sm:p-7 border-[2px] transition-all duration-200
        ${theme.cardBg} ${theme.borderColor}
        ${
          isActive
            ? 'ring-4 ring-mint/30 border-mint shadow-[var(--paper-shadow)]'
            : isRecommended
            ? 'shadow-[var(--paper-shadow)] border-brand'
            : 'shadow-[var(--paper-shadow)]'
        }
      `}
    >
      {/* Hand-drawn Washi Tape at Top */}
      <div className={theme.tape} />

      {/* Hand-Drawn "Recommended" or Custom Sticker Badge */}
      {isRecommended && (
        <div className="absolute -top-3.5 right-4 z-20">
          <motion.div
            initial={{ scale: 0.8, rotate: -6 }}
            animate={{ scale: 1, rotate: -3 }}
            className="sticker-badge"
          >
            <Star className="w-3.5 h-3.5 fill-yellow text-[#FAB005]" />
            <span>Recommended ✦</span>
          </motion.div>
        </div>
      )}

      {/* Active Plan Stamp */}
      {isActive && (
        <div className="absolute -top-3 right-4 z-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-light border-[1.5px] border-mint text-ink font-extrabold text-[11px] uppercase tracking-wider shadow-sm rotate-[2deg]">
            <Check className="w-3.5 h-3.5 stroke-[3] text-mint" />
            <span>Current Plan</span>
          </div>
        </div>
      )}

      <div>
        {/* Header: Plan Icon & Name */}
        <div className="flex items-start justify-between gap-3 mb-4 pt-1">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MFIcon
                name={
                  plan.id === 'free'
                    ? 'seedling'
                    : plan.id === 'starter'
                    ? 'zap'
                    : plan.id === 'plus'
                    ? 'star'
                    : plan.id === 'pro'
                    ? 'crown'
                    : 'robot'
                }
                size={26}
              />
              <h3 className="font-heading font-extrabold text-xl text-ink tracking-tight">
                {plan.name}
              </h3>
            </div>
            <p className="text-xs text-ink-muted font-medium leading-relaxed">
              {plan.subtitle}
            </p>
          </div>

          {/* Daily limit badge */}
          <div className={`px-2.5 py-1 rounded-xl text-[11px] font-extrabold border ${theme.pillBg}`}>
            {plan.lessonsPerDay === null ? '∞ Lessons' : `${plan.lessonsPerDay} Lessons/day`}
          </div>
        </div>

        {/* Pricing Section & 1-Day Trial Highlight */}
        <div className="my-4 p-4 rounded-2xl bg-card border border-edge shadow-sm space-y-1.5">
          {!isFree && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-light border border-brand/40 text-[11px] font-extrabold text-brand mb-1">
              <Sparkles className="w-3 h-3 text-brand" />
              <span>1-Day Free Trial Included</span>
            </div>
          )}

          <div className="flex items-baseline gap-1.5">
            {isFree ? (
              <span className="font-heading font-black text-3xl sm:text-4xl text-ink">
                ₹0
              </span>
            ) : (
              <>
                <span className="font-heading font-bold text-lg text-ink-muted">₹</span>
                <span className="font-heading font-black text-3xl sm:text-4xl text-ink">
                  {plan.price}
                </span>
              </>
            )}
            <span className="text-xs text-ink-muted font-bold">
              {plan.periodLabel}
            </span>
          </div>

          {!isFree && (
            <p className="text-[11px] text-ink-muted font-medium leading-snug">
              {plan.recurringDescription}
            </p>
          )}
        </div>

        {/* Key Inclusions / Features List */}
        <div className="space-y-2 py-2">
          <p className="text-[11px] font-extrabold text-ink-muted uppercase tracking-wider">
            What&apos;s Included:
          </p>
          <ul className="space-y-2 text-xs">
            {plan.features.slice(0, 6).map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-ink">
                <div className="mt-0.5 p-0.5 rounded-full bg-mint-light border border-mint/40 text-mint shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="leading-snug font-medium">{feature}</span>
              </li>
            ))}
            {plan.notIncluded && plan.notIncluded.length > 0 && (
              <li className="flex items-start gap-2.5 text-ink-muted opacity-70">
                <div className="mt-0.5 p-0.5 rounded-full bg-cream border border-edge text-ink-muted shrink-0">
                  <X className="w-3 h-3 stroke-[2.5]" />
                </div>
                <span className="leading-snug font-medium line-through">
                  {plan.notIncluded[0]}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Action Button & Autopay Guarantee */}
      <div className="mt-6 pt-3 border-t border-dashed border-edge space-y-2">
        {isActive ? (
          <MFButton
            variant="secondary"
            size="md"
            className="w-full"
            disabled
            leftIcon={<Check className="w-4 h-4 text-mint" />}
          >
            Current Active Plan
          </MFButton>
        ) : isFree ? (
          <MFButton
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => onSelect(plan.id)}
            isLoading={isLoading}
          >
            Continue Free
          </MFButton>
        ) : (
          <MFButton
            variant={theme.btnVariant}
            size="md"
            className="w-full"
            onClick={() => onSelect(plan.id)}
            isLoading={isLoading}
            rightIcon={<Zap className="w-4 h-4 fill-current" />}
          >
            Start 1-Day Free Trial
          </MFButton>
        )}

        {!isFree && (
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-ink-muted text-center font-medium">
            <ShieldCheck className="w-3 h-3 text-mint shrink-0" />
            <span>24-Hour Free Trial • Cancel anytime</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
