'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Variants, motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { invalidateEntitlementCache } from '@/hooks/useEntitlements';
import { PLANS, PlanId, formatSubscriptionStatus } from '@/lib/plans';
import {
  Crown, Sparkles, X, ShieldCheck, Heart, BookOpen, AlertTriangle,
  Clock, CheckCircle2, RotateCcw, AlertCircle, Calendar, Zap, CreditCard, ChevronRight
} from 'lucide-react';
import { Mascot, MascotExpression } from '@/components/mascot/Mascot';
import { MFPlanCard } from '@/components/ui/MFPlanCard';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

// ─── Animation Variants ──────────────────────────────────────────────────────
const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 18 },
  },
};

const cardGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 120, damping: 18 },
  },
};

// ─── Confetti Celebration ───────────────────────────────────────────────────
const CONFETTI_COLORS = ['#FF4D6D', '#FFB7C5', '#FFE066', '#63E6BE', '#B197FC', '#74C0FC'];

function NotebookCelebration() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${6 + (i % 4) * 3}px`,
            height: `${6 + (i % 4) * 3}px`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            left: `${8 + (i / 28) * 84}%`,
            top: '40%',
            animation: `mindforge-confetti ${0.9 + (i % 3) * 0.25}s cubic-bezier(0, .9, .57, 1) ${i * 0.03}s forwards`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Billing Page ───────────────────────────────────────────────────────
export default function BillingPage() {
  const { profile, session, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [liveStatus, setLiveStatus] = useState<any>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Fetch live authoritative status from backend ─────────────────────────
  const fetchStatus = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/billing/status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLiveStatus(data);
      }
    } catch (e) {
      console.warn('[Billing] Could not fetch live status:', e);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [session?.access_token]);

  // ─── Razorpay Subscription with 1-Day Trial Checkout ──────────────────────
  const handleStartTrial = async (planId: PlanId) => {
    if (planId === 'free') return;
    setError('');
    setSuccess('');
    setLoading(planId);

    try {
      const token = session?.access_token;
      if (!token) {
        throw new Error('Please sign in to start your 1-day free trial.');
      }

      // 1. Create Razorpay subscription on backend with start_at (+24 hours)
      const res = await fetch('/api/billing/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const subData = await res.json();
      if (!res.ok) throw new Error(subData.error || 'Failed to initialize subscription');

      // 2. Load Razorpay Checkout SDK dynamically
      const loadScript = () =>
        new Promise<void>((resolve, reject) => {
          if ((window as any).Razorpay) {
            resolve();
            return;
          }
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Razorpay Checkout SDK'));
          document.body.appendChild(s);
        });
      await loadScript();

      // 3. Open Razorpay Checkout for mandate/autopay authentication
      const options = {
        key: subData.key,
        subscription_id: subData.subscriptionId,
        name: 'MindForge Japanese',
        description: `${subData.planName} — 1-Day Free Trial (Autopay mandate)`,
        image: '/mindforge_logo.png',
        prefill: { email: profile?.email || '' },
        theme: { color: '#FF4D6D' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(planId);
          try {
            // 4. Server-authoritative signature verification & trial activation
            const verifyRes = await fetch('/api/billing/verify-subscription', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...response,
                planId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setSuccess(`🎉 1-Day Free Trial activated for ${subData.planName}! Enjoy full premium access.`);
              setConfetti(true);
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => setConfetti(false), 2600);
              invalidateEntitlementCache();
              await refreshProfile();
              await fetchStatus();
            } else {
              setError(verifyData.error || 'Subscription verification failed. Please contact support.');
            }
          } catch (verErr: any) {
            setError(verErr.message || 'Error communicating with verification service');
          } finally {
            setLoading(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        setError(r.error?.description || 'Autopay authorization failed. Please try again.');
        setLoading(null);
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.message || 'Checkout failed. Please try again.');
      setLoading(null);
    }
  };

  // ─── Cancellation Handler ─────────────────────────────────────────────────
  const handleCancelSubscription = async () => {
    setCancelling(true);
    setError('');
    setSuccess('');
    try {
      const token = session?.access_token;
      if (!token) throw new Error('Not authenticated');

      const res = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel subscription');

      setSuccess(data.message || 'Subscription cancelled. Access remains active until period ends.');
      setShowCancelModal(false);
      invalidateEntitlementCache();
      await refreshProfile();
      await fetchStatus();
    } catch (err: any) {
      setError(err.message || 'Error cancelling subscription');
    } finally {
      setCancelling(false);
    }
  };

  const currentPlan = (liveStatus?.planId || profile?.planId || 'free') as PlanId;
  const currentStatus = liveStatus?.status || profile?.planStatus || 'free';
  const isTrial = liveStatus?.isTrial || profile?.isTrial || currentStatus === 'trial_active';

  const statusFormat = formatSubscriptionStatus(currentStatus);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Mascot dynamic expression
  const mascotExpression: MascotExpression = success
    ? 'celebrating'
    : loading || cancelling
    ? 'thinking'
    : error
    ? 'encouraging'
    : isTrial
    ? 'excited'
    : 'proud';

  return (
    <div className="space-y-8 md:space-y-10 max-w-6xl mx-auto pb-14">
      <AnimatePresence>{confetti && <NotebookCelebration />}</AnimatePresence>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-ink tracking-tight">
            Subscription
          </h1>
          <div className="p-1.5 rounded-full bg-cream border border-edge text-ink-muted cursor-help">
            <MFIcon name="question" size={20} />
          </div>
        </div>

        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center p-1 bg-card border-[2px] border-edge rounded-full shadow-inner relative">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`relative z-10 px-5 py-2 text-sm font-bold rounded-full transition-colors ${
              billingCycle === 'monthly' ? 'text-white' : 'text-ink hover:text-ink/70'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`relative z-10 px-5 py-2 text-sm font-bold rounded-full transition-colors flex items-center gap-2 ${
              billingCycle === 'yearly' ? 'text-white' : 'text-ink hover:text-ink/70'
            }`}
          >
            Yearly
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black uppercase ${
              billingCycle === 'yearly' ? 'bg-white text-ink' : 'bg-brand text-white'
            }`}>
              Save 30%
            </span>
          </button>
          {/* Animated Background Pill */}
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-ink rounded-full z-0"
            animate={{ left: billingCycle === 'monthly' ? '4px' : 'calc(50% + 4px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      {/* ── Status Alerts ──────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-mint-light border-[1.5px] border-mint text-sm text-[#087F5B] font-bold shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-mint shrink-0" />
            <span>{success.replace('🎉 ', '')}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 rounded-2xl bg-coral-light border-[1.5px] border-coral text-sm text-[#C92A2A] font-bold shadow-sm"
          >
            <AlertTriangle className="w-5 h-5 text-[#FA5252] shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Active Subscription Status ─────────────────────────────────────── */}
      {currentStatus !== 'free' && (
        <MFCard
          variant={currentStatus === 'payment_failed' ? 'yellow' : isTrial ? 'sakura' : 'cream'}
          washiTape={isTrial ? 'pink' : 'yellow'}
          padding="lg"
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-edge pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-card border border-edge shadow-sm">
                <CreditCard className="w-6 h-6 text-brand" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-extrabold text-lg text-ink">
                    {PLANS[currentPlan]?.name || 'Current'} Subscription
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                      currentStatus === 'trial_active'
                        ? 'bg-brand-light text-[#D6336C] border-brand'
                        : currentStatus === 'active'
                        ? 'bg-mint-light text-mint border-mint'
                        : currentStatus === 'payment_failed'
                        ? 'bg-coral-light text-[#C92A2A] border-coral'
                        : 'bg-yellow-light text-orange border-yellow'
                    }`}
                  >
                    {statusFormat.label}
                  </span>
                </div>
                <p className="text-xs text-ink-muted font-medium mt-0.5">
                  {PLANS[currentPlan]?.recurringDescription}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {currentStatus === 'payment_failed' && (
                <MFButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleStartTrial(currentPlan)}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                >
                  Retry Payment
                </MFButton>
              )}

              {currentStatus !== 'cancelled' && currentStatus !== 'expired' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs font-bold text-ink-muted hover:text-[#C92A2A] hover:underline p-2 transition-colors cursor-pointer"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs">
            {isTrial && (
              <div className="p-3 rounded-xl bg-card/80 border border-edge">
                <div className="flex items-center gap-1.5 text-[#D6336C] font-bold mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>1-Day Trial Ends</span>
                </div>
                <p className="text-ink font-extrabold font-heading text-sm">
                  {liveStatus?.trialEndsAt
                    ? new Date(liveStatus.trialEndsAt).toLocaleString()
                    : '24 Hours after activation'}
                </p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-card/80 border border-edge">
              <div className="flex items-center gap-1.5 text-ink-muted font-bold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next Billing Date</span>
              </div>
              <p className="text-ink font-extrabold font-heading text-sm">
                {liveStatus?.nextBillingAt
                  ? new Date(liveStatus.nextBillingAt).toLocaleDateString()
                  : liveStatus?.endsAt
                  ? new Date(liveStatus.endsAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-card/80 border border-edge">
              <div className="flex items-center gap-1.5 text-mint font-bold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Recurring Charge</span>
              </div>
              <p className="text-ink font-extrabold font-heading text-sm">
                ¥{PLANS[currentPlan]?.price} {PLANS[currentPlan]?.periodLabel}
              </p>
            </div>
          </div>
        </MFCard>
      )}

      {/* ── Plan Cards Grid ────────────────────────────────────────────────── */}
      <motion.div
        variants={cardGrid}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
      >
        {/* FREE CARD */}
        <motion.div variants={cardItem} className="h-full">
          <MFCard variant="paper" padding="xl" className="h-full flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-ink tracking-tight mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading font-black text-4xl text-ink">¥0</span>
                <span className="text-sm text-ink-muted font-bold">/ month</span>
              </div>
              
              <ul className="space-y-4 text-sm font-medium text-ink">
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Basic lessons</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Limited practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Daily goal 10 min</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <MFButton
                variant="secondary"
                size="lg"
                className="w-full opacity-60"
                disabled={currentPlan === 'free'}
                onClick={() => {}}
              >
                Current Plan
              </MFButton>
            </div>
          </MFCard>
        </motion.div>

        {/* STARTER CARD */}
        <motion.div variants={cardItem} className="h-full">
          <MFCard variant="cream" padding="xl" className="h-full flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-ink tracking-tight mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading font-black text-4xl text-ink">¥{billingCycle === 'yearly' ? '209' : '299'}</span>
                <span className="text-sm text-ink-muted font-bold">/ month</span>
              </div>
              
              <ul className="space-y-4 text-sm font-medium text-ink">
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>All Free features</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Unlimited practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Daily goal 30 min</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>No ads</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <MFButton
                variant="secondary"
                size="lg"
                className="w-full bg-white hover:bg-card-subtle text-ink border-[2px] border-edge"
                onClick={() => handleStartTrial('starter')}
                isLoading={loading === 'starter'}
              >
                Upgrade
              </MFButton>
            </div>
          </MFCard>
        </motion.div>

        {/* PRO CARD (Highlighted) */}
        <motion.div variants={cardItem} className="h-full relative">
          <div className="absolute -top-3.5 right-4 z-20">
            <div className="washi-tape-pink transform rotate-3 scale-90 px-3 py-1 flex items-center justify-center font-black text-[11px] text-white tracking-widest uppercase shadow-sm">
              Most Popular
            </div>
          </div>
          <MFCard variant="sakura" padding="xl" className="h-full flex flex-col justify-between border-brand/60 ring-4 ring-brand/10">
            <div>
              <h3 className="font-heading font-extrabold text-2xl text-brand tracking-tight mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-heading font-black text-4xl text-ink">¥{billingCycle === 'yearly' ? '419' : '599'}</span>
                <span className="text-sm text-ink-muted font-bold">/ month</span>
              </div>
              
              <ul className="space-y-4 text-sm font-medium text-ink">
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>All Starter features</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span className="font-bold text-brand">AI Tutor</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Speaking practice</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Detailed progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <MFIcon name="check" className="text-mint shrink-0" size={20} />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <MFButton
                variant="primary"
                size="lg"
                className="w-full bg-brand hover:bg-brand/90 text-white shadow-md shadow-brand/30"
                onClick={() => handleStartTrial('pro')}
                isLoading={loading === 'pro'}
              >
                Upgrade
              </MFButton>
            </div>
          </MFCard>
        </motion.div>
      </motion.div>
      
      {/* 1-day free trial messaging at bottom */}
      <div className="text-center pt-2">
        <p className="text-sm font-bold text-ink-muted flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-brand" />
          All paid plans include a 1-day free trial. Cancel anytime.
        </p>
      </div>

      {/* ── Payment / Invoice History ───────────────────────────────────────── */}
      {liveStatus?.history && liveStatus.history.length > 0 && (
        <MFCard variant="paper" padding="md" className="space-y-3 mt-12">
          <div className="flex items-center justify-between border-b border-edge pb-2.5">
            <h3 className="font-heading font-extrabold text-sm text-ink">
              Invoices & Transaction History
            </h3>
            <span className="text-xs font-bold text-ink-muted">Secured by Razorpay</span>
          </div>
          <div className="divide-y divide-[#EAE3D5] text-xs">
            {liveStatus.history.map((tx: any) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-ink">{PLANS[tx.plan_id as PlanId]?.name || tx.plan_id} Subscription</p>
                  <p className="text-[11px] text-ink-muted">{new Date(tx.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-ink">¥{(tx.amount / 100).toFixed(0)}</p>
                  <span className={`text-[10px] font-extrabold uppercase ${tx.status === 'success' ? 'text-mint' : 'text-lavender'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MFCard>
      )}

      {/* ── Cancellation Confirmation Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowCancelModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-md bg-card rounded-3xl p-6 sm:p-7 border-[2px] border-edge shadow-2xl z-10 space-y-4"
            >
              <div className="washi-tape-pink" />

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-coral-light border border-[#FFC9C9] text-[#C92A2A]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg text-ink">
                    Cancel Subscription?
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Are you sure you want to cancel your Autopay subscription?
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream border border-edge text-xs text-[#6B6B80] space-y-1.5">
                <p>
                  • You will retain full access until your current trial or billing period ends.
                </p>
                <p>
                  • No further recurring charges will be made to your account.
                </p>
                <p>
                  • You can re-activate or upgrade anytime from this dashboard.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <MFButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                >
                  Keep Plan
                </MFButton>
                <MFButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={handleCancelSubscription}
                  isLoading={cancelling}
                >
                  Confirm Cancel
                </MFButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
