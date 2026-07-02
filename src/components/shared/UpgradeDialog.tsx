'use client';

/**
 * UpgradeDialog — Modal shown when a daily usage limit is hit
 *
 * Usage:
 *   const { openUpgradeDialog } = useUpgradeDialog();
 *   openUpgradeDialog({ feature: 'AI Tutor', used: 5, limit: 5 });
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Sparkles, Zap, Crown, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { PLANS, PLAN_ORDER, type PlanId } from '@/lib/plans';

// ─── Dialog state ─────────────────────────────────────────────────────────────
interface UpgradeDialogState {
  open: boolean;
  feature: string;
  description?: string;
  used?: number;
  limit?: number;
  suggestedPlan?: PlanId;
}

interface UpgradeDialogContextType {
  openUpgradeDialog: (opts: Omit<UpgradeDialogState, 'open'>) => void;
  closeUpgradeDialog: () => void;
}

const UpgradeDialogContext = createContext<UpgradeDialogContextType>({
  openUpgradeDialog: () => {},
  closeUpgradeDialog: () => {},
});

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useUpgradeDialog() {
  return useContext(UpgradeDialogContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UpgradeDialogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UpgradeDialogState>({
    open: false,
    feature: '',
  });

  const openUpgradeDialog = useCallback((opts: Omit<UpgradeDialogState, 'open'>) => {
    setState({ open: true, ...opts });
  }, []);

  const closeUpgradeDialog = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
  }, []);

  return (
    <UpgradeDialogContext.Provider value={{ openUpgradeDialog, closeUpgradeDialog }}>
      {children}
      <UpgradeDialogModal state={state} onClose={closeUpgradeDialog} />
    </UpgradeDialogContext.Provider>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function UpgradeDialogModal({
  state,
  onClose,
}: {
  state: UpgradeDialogState;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const currentPlanId = (profile?.planId ?? 'free') as PlanId;
  const currentPlanIdx = PLAN_ORDER.indexOf(currentPlanId);

  // Suggest next plan up from current, or ai_max if already at top
  const suggestedPlanId: PlanId = state.suggestedPlan ?? (
    PLAN_ORDER[Math.min(currentPlanIdx + 1, PLAN_ORDER.length - 1)] as PlanId
  );
  const suggestedPlan = PLANS[suggestedPlanId];

  // Usage bar
  const pct = state.used !== undefined && state.limit
    ? Math.min(100, Math.round((state.used / state.limit) * 100))
    : 100;

  return (
    <AnimatePresence>
      {state.open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed inset-0 flex items-center justify-center z-[201] p-4"
          >
            <div className="w-full max-w-sm bg-[#120B24] border border-neon-purple/20 rounded-3xl shadow-[0_0_60px_rgba(109,60,255,0.15)] overflow-hidden">

              {/* Header */}
              <div className="relative px-6 pt-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-purple-300/50 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center gap-3 text-center">
                  {/* Lock aura */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-neon-purple/25 rounded-full blur-[16px]" />
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-neon-purple to-neon-pink flex items-center justify-center shadow-[0_0_24px_rgba(109,60,255,0.35)]">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-white leading-tight">
                      Daily Limit Reached
                    </h2>
                    <p className="text-xs text-purple-300/50 mt-1">
                      {state.feature}
                    </p>
                  </div>
                </div>
              </div>

              {/* Usage bar */}
              {state.used !== undefined && state.limit !== undefined && (
                <div className="px-6 pb-4 space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-purple-300/50">
                    <span>Used today</span>
                    <span className="text-rose-400">{state.used} / {state.limit}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                    />
                  </div>
                </div>
              )}

              {/* Description */}
              {state.description && (
                <p className="px-6 pb-4 text-xs text-purple-300/45 text-center leading-relaxed">
                  {state.description}
                </p>
              )}

              {/* Suggested plan */}
              <div className="px-6 pb-4">
                <div className="rounded-2xl bg-white/[0.03] border border-neon-purple/15 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{suggestedPlan.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-white">{suggestedPlan.name} Plan</p>
                      <p className="text-[10px] text-purple-300/40">{suggestedPlan.subtitle}</p>
                    </div>
                    <span className="ml-auto text-sm font-extrabold text-white font-orbitron">
                      ₹{suggestedPlan.price}
                      <span className="text-[10px] font-normal text-purple-300/40">{suggestedPlan.periodLabel}</span>
                    </span>
                  </div>

                  {/* Key benefits */}
                  <ul className="space-y-1">
                    {suggestedPlan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[11px] text-purple-200/55">
                        <Sparkles className="w-3 h-3 text-neon-pink flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CTAs */}
              <div className="px-6 pb-6 space-y-2">
                <Link
                  href="/billing"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white text-sm font-bold shadow-[0_0_20px_rgba(109,60,255,0.3)] hover:shadow-[0_0_30px_rgba(109,60,255,0.45)] hover:scale-[1.02] transition-all duration-200"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade Now · ₹{suggestedPlan.price}{suggestedPlan.periodLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-purple-300/40 hover:text-purple-300/60 transition-colors"
                >
                  Continue with Free Plan
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
