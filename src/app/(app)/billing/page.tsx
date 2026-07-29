'use client';

import React, { useState, useRef } from 'react';
import { Variants } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { invalidateEntitlementCache } from '@/hooks/useEntitlements';
import { PLANS, PlanId } from '@/lib/plans';
import { createBrowserClient } from '@supabase/ssr';
import { Check, ShieldCheck, Crown, ArrowRight, Sparkles, X, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Animation Variants — ONE-TIME entrance. No loops. Smooth spring physics.
// ─────────────────────────────────────────────────────────────────────────────

// Hero stagger parent
const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10, delayChildren: 0.04 } },
};

// Hero child
const heroItem: Variants = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 90, damping: 16 } },
};

// Card grid parent — stagger each card
const cardGrid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10, delayChildren: 0.15 } },
};

// Card child — spring from below + slight scale
const cardItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring' as const, stiffness: 100, damping: 18, mass: 0.9 } },
};

// Feature rows — stagger inside each card
const featureContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};
const featureItem: Variants = {
  hidden: { opacity: 0, x: -14 },
  show:   { opacity: 1, x: 0,
    transition: { type: 'spring' as const, stiffness: 140, damping: 18 } },
};

// ─────────────────────────────────────────────────────────────────────────────
// Confetti — CSS keyframe only, fires once on success
// ─────────────────────────────────────────────────────────────────────────────
const COLORS = ['#6D3CFF', '#EC4899', '#10B981', '#F59E0B', '#C15BFF', '#38BDF8'];

function Confetti() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden" aria-hidden>
      {Array.from({ length: 22 }, (_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            width:  `${5 + (i % 4) * 3}px`,
            height: `${5 + (i % 4) * 3}px`,
            background: COLORS[i % COLORS.length],
            left: `${10 + (i / 22) * 80}%`,
            top: '48%',
            animation: `velmorth-confetti ${0.8 + (i % 3) * 0.25}s cubic-bezier(0,.9,.57,1) ${i * 0.035}s forwards`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading]   = useState<string | null>(null);
  const [error,   setError]     = useState('');
  const [success, setSuccess]   = useState('');
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Razorpay (logic unchanged) ──────────────────────────────────────────
  const handleCheckout = async (planId: PlanId) => {
    if (planId === 'free') return;
    setError(''); setSuccess(''); setLoading(planId);
    try {
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed.');

      const loadScript = () => new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) { resolve(); return; }
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.body.appendChild(s);
      });
      await loadScript();

      const options = {
        key: orderData.key, amount: orderData.amount,
        currency: orderData.currency || 'INR', name: 'MindForge',
        description: `${orderData.planName} — ${orderData.periodLabel}`,
        order_id: orderData.orderId, image: '/velmorth_logo.png',
        prefill: { email: profile?.email || '' },
        theme: { color: '#6D3CFF' },
        handler: async (response: any) => {
          setLoading(planId);
          const sb = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          const { data: { session } } = await sb.auth.getSession();
          const token = session?.access_token || '';
          const verifyRes = await fetch('/api/billing/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ ...response, planId, endsAt: orderData.endsAt }),
          });
          if (verifyRes.ok) {
            setSuccess(`🎉 ${PLANS[planId].name} activated! Your plan is now live.`);
            setConfetti(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setConfetti(false), 2200);
            invalidateEntitlementCache();
            await refreshProfile();
          } else {
            const e = await verifyRes.json();
            setError(e.error || 'Payment verification failed. Contact support.');
          }
          setLoading(null);
        },
        modal: { ondismiss: () => setLoading(null) },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (r: any) => {
        setError(r.error?.description || 'Payment failed. Please try again.');
        setLoading(null);
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.message || 'Checkout failed. Please try again.');
      setLoading(null);
    }
  };

  const currentPlan     = (profile?.planId || 'free') as PlanId;
  const displayPlanIds: PlanId[] = ['free', 'starter', 'plus', 'pro', 'ai_max'];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">

      {/* Confetti */}
      <AnimatePresence>{confetti && <Confetti />}</AnimatePresence>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="show"
        className="text-center space-y-5 pt-2"
      >
        <motion.div variants={heroItem}>
          <Badge
            variant="neon" size="md"
            icon={<Crown className="w-3.5 h-3.5 text-amber-400" />}
            glow
          >
            MINDFORGE PREMIUM
          </Badge>
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
        >
          Upgrade Your{' '}
          <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta bg-clip-text text-transparent">
            Fluency Level
          </span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="text-sm text-purple-300/45 max-w-lg mx-auto leading-relaxed"
        >
          Unlock unlimited vocabulary, AI-powered conversations, and the complete N5→N1
          learning path. All prices in INR — secured by Razorpay.
        </motion.p>

        <motion.div variants={heroItem} className="flex flex-wrap items-center justify-center gap-3">
          {['🌸 50,000+ learners', '⭐ 4.9 avg rating', '🔒 Cancel anytime'].map(t => (
            <span
              key={t}
              className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] text-purple-200/50 font-semibold"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Alerts ───────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1,
              transition: { type: 'spring' as const, stiffness: 180, damping: 18 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-semibold"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />{success}
          </motion.div>
        )}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1,
              transition: { type: 'spring' as const, stiffness: 180, damping: 18 } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-semibold"
          >
            <X className="w-4 h-4 flex-shrink-0" />{error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Plan Cards ───────────────────────────────────────────────────── */}
      <motion.div
        variants={cardGrid}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 items-stretch"
      >
        {displayPlanIds.map((planId) => {
          const plan     = PLANS[planId];
          const isActive = currentPlan === planId;

          return (
            <motion.div
              key={planId}
              variants={cardItem}
              /* ── Smooth hover lift + glow — event-driven, zero continuous JS ── */
              whileHover={{
                y: -10,
                scale: 1.018,
                transition: { type: 'spring', stiffness: 260, damping: 22 },
              }}
              whileTap={{ scale: 0.97, transition: { duration: 0.12 } }}
              className="h-full cursor-default"
              style={{ willChange: 'transform' }}
            >
              {/* ── Card shell ─────────────────────────────────────────────── */}
              <div
                className={`
                  relative flex flex-col h-full rounded-2xl overflow-hidden
                  border transition-shadow duration-300
                  ${isActive
                    ? 'border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_28px_rgba(16,185,129,0.10)]'
                    : plan.popular
                    ? 'border-neon-purple/30 bg-[#0f0b1e] shadow-[0_0_24px_rgba(109,60,255,0.10)]'
                    : 'border-white/[0.08] bg-[#0c0a18]/80 hover:border-white/[0.14] hover:shadow-[0_2px_32px_rgba(109,60,255,0.09)]'
                  }
                `}
              >
                {/* Gradient tint */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${plan.gradFrom}55 0%, ${plan.gradTo}18 100%)` }}
                />

                {/* Popular card — subtle purple edge highlight */}
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple/60 to-transparent pointer-events-none" />
                )}

                {/* Badge ribbon */}
                {plan.badge && (
                  <div className={`
                    absolute top-0 right-0 px-3 py-1 text-[9px] font-extrabold text-white
                    uppercase tracking-wider rounded-bl-xl rounded-tr-2xl z-10
                    ${plan.popular
                      ? 'bg-gradient-to-r from-neon-purple to-neon-pink'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600'}
                  `}>
                    {plan.popular
                      ? <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-white inline" />{plan.badge}</span>
                      : plan.badge}
                  </div>
                )}

                {/* ── Content ──────────────────────────────────────────────── */}
                <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">

                  {/* Plan header */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl select-none">{plan.emoji}</span>
                      <div>
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <p className="text-[10px] text-purple-300/40">{plan.subtitle}</p>
                      </div>
                      {plan.popular && (
                        <Crown className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" />
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      {plan.price === 0 ? (
                        <span className="text-3xl font-extrabold text-white font-orbitron">₹0</span>
                      ) : (
                        <>
                          <span className="text-sm font-bold text-purple-300/50 font-orbitron self-start mt-1">₹</span>
                          <span className="text-3xl font-extrabold text-white font-orbitron leading-none">
                            {plan.price}
                          </span>
                          <span className="text-xs text-purple-300/40 font-semibold">{plan.periodLabel}</span>
                        </>
                      )}
                    </div>

                    {/* Limit chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-[10px] text-purple-300/50 font-semibold">
                        {plan.aiChatsPerDay === 500 ? '500 AI chats/day' : `${plan.aiChatsPerDay} AI chats/day`}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-[10px] text-purple-300/50 font-semibold">
                        {plan.lessonsPerDay === null ? 'Unlimited lessons' : `${plan.lessonsPerDay} lessons/day`}
                      </span>
                    </div>
                  </div>

                  {/* Feature list */}
                  <motion.ul
                    variants={featureContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-2 flex-1 mb-6"
                  >
                    {plan.features.slice(0, 7).map((f, i) => (
                      <motion.li key={i} variants={featureItem} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400/80" />
                        <span className="text-purple-200/60">{f}</span>
                      </motion.li>
                    ))}
                    {plan.features.length > 7 && (
                      <li className="text-[10px] text-purple-300/30 pl-5.5">
                        +{plan.features.length - 7} more features
                      </li>
                    )}
                  </motion.ul>

                  {/* CTA */}
                  {isActive ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1,
                        transition: { type: 'spring' as const, stiffness: 150, damping: 16 } }}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold text-emerald-400"
                    >
                      <ShieldCheck className="w-4 h-4" /> Current Plan ✓
                    </motion.div>
                  ) : planId === 'free' ? (
                    <div className="py-3.5 rounded-xl text-center text-xs font-semibold text-purple-300/30 border border-white/[0.04]">
                      Free Forever
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Button
                        onClick={() => handleCheckout(planId)}
                        loading={loading === planId}
                        variant={plan.popular ? 'neon' : 'primary'}
                        className="w-full group/btn"
                        rightIcon={
                          loading === planId
                            ? <Zap className="w-4 h-4 animate-pulse" />
                            : <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                        }
                      >
                        Upgrade · ₹{plan.price}{plan.periodLabel}
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Trust footer ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.5 } }}
        className="text-center space-y-3 pt-2"
      >
        <p className="text-xs text-purple-300/25 max-w-md mx-auto">
          Payments secured by Razorpay. Cancel anytime from your profile settings.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-purple-300/20 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure Payment</span>
          <span>·</span><span>Cancel Anytime</span>
          <span>·</span><span>INR Pricing</span>
        </div>
      </motion.div>

      {/* ── Confetti keyframe ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes velmorth-confetti {
          0%   { transform: translate(0, 0) scale(0) rotate(0deg);   opacity: 1; }
          60%  { opacity: 1; }
          100% { transform: translate(var(--tx, 0px), -220px) scale(1.2) rotate(var(--rot, 180deg)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
