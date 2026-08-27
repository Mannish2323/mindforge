'use client';

/**
 * PremiumGate — Standard gated content wrapper
 *
 * Shows children if user has the required plan.
 * Shows a premium lock overlay otherwise.
 *
 * Usage:
 *   <PremiumGate planRequired="pro" feature="AI Pronunciation Scoring">
 *     <SpeakingAIPanel />
 *   </PremiumGate>
 */

import React from 'react';
import Link from 'next/link';
import { Lock, Crown, Sparkles, ArrowRight, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { PLANS, PLAN_ORDER, type PlanId } from '@/lib/plans';

interface PremiumGateProps {
  /** Minimum plan required to see this content */
  planRequired: PlanId;
  /** Feature name shown in the lock overlay */
  feature: string;
  /** Short description of what this feature does */
  description?: string;
  /** Show a blurred preview of children behind the lock */
  preview?: boolean;
  /** Children to render when access is granted */
  children: React.ReactNode;
  /** Additional class on the wrapper */
  className?: string;
}

const PLAN_DISPLAY: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  starter: { label: 'Starter', color: 'text-cat-blue',   icon: Zap },
  plus:    { label: 'Plus',    color: 'text-cat-purple',  icon: Sparkles },
  pro:     { label: 'Pro',     color: 'text-cat-orange',  icon: Crown },
  ai_max:  { label: 'AI Max',  color: 'text-cat-pink',    icon: Cpu },
};

export function PremiumGate({
  planRequired,
  feature,
  description,
  preview = true,
  children,
  className = '',
}: PremiumGateProps) {
  const { profile } = useAuth();

  const userPlanIdx     = PLAN_ORDER.indexOf((profile?.planId as PlanId) || 'free');
  const requiredPlanIdx = PLAN_ORDER.indexOf(planRequired);
  const hasAccess       = userPlanIdx >= requiredPlanIdx;

  const isExpired = !!(profile?.endsAt && new Date(profile.endsAt) < new Date());
  const canAccess = hasAccess && !isExpired;

  if (canAccess) return <>{children}</>;

  const planInfo = PLAN_DISPLAY[planRequired] ?? PLAN_DISPLAY.starter;

  return (
    <div className={`relative ${className}`}>
      {/* Blurred preview */}
      {preview && (
        <div className="blur-[6px] opacity-40 pointer-events-none select-none" aria-hidden>
          {children}
        </div>
      )}

      {/* Lock Overlay */}
      <div
        className={`${preview ? 'absolute inset-0' : 'relative min-h-[200px]'} flex flex-col items-center justify-center gap-4 rounded-2xl z-10 bg-white/90 backdrop-blur-sm border border-edge shadow-md`}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex flex-col items-center gap-3 text-center px-6 py-4 max-w-xs"
        >
          {/* Lock icon */}
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand to-accent flex items-center justify-center shadow-[0_4px_16px_rgba(109,60,255,0.2)]">
            <Lock className="w-5 h-5 text-white" />
          </div>

          {/* Plan badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/8 border border-brand/15 text-xs font-bold text-brand">
            <planInfo.icon className="w-3.5 h-3.5" />
            {planInfo.label} Feature
          </span>

          {/* Feature name */}
          <h3 className="text-base font-bold text-ink font-heading leading-tight">{feature}</h3>

          {/* Description */}
          {description && (
            <p className="text-xs text-ink-muted leading-relaxed">{description}</p>
          )}

          {/* CTA */}
          <Link
            href="/billing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand to-accent text-white text-xs font-bold shadow-[0_4px_12px_rgba(109,60,255,0.2)] hover:shadow-[0_6px_18px_rgba(109,60,255,0.3)] hover:scale-105 transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Upgrade to {planInfo.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Current plan hint */}
          {profile && (
            <p className="text-[10px] text-ink-light">
              Your plan: <span className="font-bold capitalize">{profile.planId}</span>
              {isExpired && ' (expired)'}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/** Inline premium badge (non-blocking) */
export function PremiumBadge({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/8 border border-brand/15 text-[10px] font-bold text-brand">
      <Crown className="w-2.5 h-2.5" />
      {label ?? 'Premium'}
    </span>
  );
}
