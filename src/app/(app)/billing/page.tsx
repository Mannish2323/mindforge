'use client';

import React, { useState, useRef } from 'react';
import { Variants } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { invalidateEntitlementCache } from '@/hooks/useEntitlements';
import { PLANS, PlanId } from '@/lib/plans';
import { createBrowserClient } from '@supabase/ssr';
import { Check, ShieldCheck, Crown, ArrowRight, Sparkles, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Lightweight stagger variants (ONE-TIME entrance only, no loops) ──────────
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const cardItem: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show:   { opacity: 1, y: 0,  scale: 1,
    transition: { type: 'spring' as const, stiffness: 110, damping: 18 } },
};
const heroItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0,
    transition: { duration: 0.4, ease: 'easeOut' } },
};
const featureItem: Variants = {
  hidden: { opacity: 0, x: -12 },
  show:   { opacity: 1, x: 0,
    transition: { duration: 0.28, ease: 'easeOut' } },
};

// ─── Tiny confetti (CSS keyframes, no Framer loop) ───────────────────────────
function Confetti() {
  const dots = ['#6D3CFF','#EC4899','#10B981','#F59E0B','#C15BFF'];
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti-burst"
          style={{
            background: dots[i % 5],
            left: `${20 + Math.random() * 60}%`,
            top: '45%',
            animationDelay: `${i * 0.04}s`,
            animationDuration: `${0.9 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function BillingPage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading]       = useState<string | null>(null);
  const [error,   setError]         = useState('');
  const [success, setSuccess]       = useState('');
  const [confetti, setConfetti]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Razorpay (unchanged) ─────────────────────────────────────────────────
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
        currency: orderData.currency || 'INR', name: 'Velmorth',
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
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
            body: JSON.stringify({ ...response, planId, endsAt: orderData.endsAt }),
          });
          if (verifyRes.ok) {
            setSuccess(`🎉 ${PLANS[planId].name} activated! Your plan is now live.`);
            setConfetti(true);
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => setConfetti(false), 2000);
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
      {confetti && <Confetti />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="text-center space-y-5 pt-2"
      >
        <motion.div variants={heroItem}>
          <Badge variant="neon" size="md" icon={<Crown className="w-3.5 h-3.5 text-amber-400" />} glow>
            VELMORTH PREMIUM
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

        <motion.p variants={heroItem} className="text-sm text-purple-300/45 max-w-lg mx-auto leading-relaxed">
          Unlock unlimited vocabulary, AI-powered conversations, and the complete N5→N1 learning path.
          All prices in INR — secured by Razorpay.
        </motion.p>

        <motion.div variants={heroItem} className="flex flex-wrap items-center justify-center gap-3">
          {['🌸 50,000+ learners', '⭐ 4.9 avg rating', '🔒 Cancel anytime'].map(t => (
            <span key={t} className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] text-purple-200/50 font-semibold">
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Alerts ───────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {success && (
          <motion.div key="s"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-semibold"
          >
            <Sparkles className="w-4 h-4 flex-shrink-0" />{success}
          </motion.div>
        )}
        {error && (
          <motion.div key="e"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-semibold"
          >
            <X className="w-4 h-4 flex-shrink-0" />{error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Plan Cards ───────────────────────────────────────────────────── */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 items-stretch"
      >
        {displayPlanIds.map((planId) => {
          const plan     = PLANS[planId];
          const isActive = currentPlan === planId;

          return (
            <motion.div key={planId} variants={cardItem} className="h-full">
              {/* Card wrapper — CSS hover only (no Framer loop) */}
              <div
                className={`group relative flex flex-col h-full rounded-2xl overflow-hidden
                  border transition-all duration-300 cursor-default
                  hover:-translate-y-2 hover:shadow-2xl
                  ${isActive
                    ? 'border-emerald-500/40 bg-emerald-950/30 shadow-[0_0_30px_rgba(16,185,129,0.08)]'
                    : plan.popular
                    ? 'border-neon-purple/30 bg-[#0f0b1e] shadow-[0_0_30px_rgba(109,60,255,0.08)] hover:shadow-[0_0_40px_rgba(109,60,255,0.18)]'
                    : 'border-white/[0.07] bg-[#0c0a18]/80 hover:border-white/[0.14] hover:shadow-[0_0_30px_rgba(109,60,255,0.07)]'}`}
              >
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{ background: `linear-gradient(135deg, ${plan.gradFrom}55, ${plan.gradTo}18)` }}
                />

                {/* Popular plan — static glow ring (CSS, not animated) */}
                {plan.popular && !isActive && (
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-pink/20 pointer-events-none" />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute top-0 right-0 px-3 py-1 text-[9px] font-extrabold text-white uppercase tracking-wider rounded-bl-xl rounded-tr-2xl z-10
                    ${plan.popular ? 'bg-gradient-to-r from-neon-purple to-neon-pink' : 'bg-gradient-to-r from-amber-500 to-orange-600'}`}>
                    {plan.popular
                      ? <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-white" />{plan.badge}</span>
                      : plan.badge}
                  </div>
                )}

                <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">

                  {/* Plan header */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{plan.emoji}</span>
                      <div>
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <p className="text-[10px] text-purple-300/40">{plan.subtitle}</p>
                      </div>
                      {plan.popular && (
                        <Crown className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" />
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      {plan.price === 0 ? (
                        <span className="text-3xl font-extrabold text-white font-orbitron">₹0</span>
                      ) : (
                        <>
                          <span className="text-3xl font-extrabold text-white font-orbitron">₹{plan.price}</span>
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

                  {/* Feature list — stagger only when card is visible */}
                  <motion.ul
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-2 flex-1 mb-6"
                  >
                    {plan.features.slice(0, 7).map((f, i) => (
                      <motion.li key={i} variants={featureItem} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400/80" />
                        <span className="text-purple-200/55">{f}</span>
                      </motion.li>
                    ))}
                    {plan.features.length > 7 && (
                      <li className="text-[10px] text-purple-300/30 pl-5">
                        +{plan.features.length - 7} more features
                      </li>
                    )}
                  </motion.ul>

                  {/* CTA */}
                  {isActive ? (
                    <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" /> Current Plan ✓
                    </div>
                  ) : planId === 'free' ? (
                    <div className="py-3.5 rounded-xl text-center text-xs font-semibold text-purple-300/30 border border-white/[0.04]">
                      Free Forever
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCheckout(planId)}
                      loading={loading === planId}
                      variant={plan.popular ? 'neon' : 'primary'}
                      className="w-full group/btn"
                      rightIcon={<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />}
                    >
                      Upgrade · ₹{plan.price}{plan.periodLabel}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="text-center space-y-3 pt-2">
        <p className="text-xs text-purple-300/25 max-w-md mx-auto">
          Payments secured by Razorpay. Cancel anytime from your profile settings.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-purple-300/20 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure Payment</span>
          <span>·</span><span>Cancel Anytime</span>
          <span>·</span><span>INR Pricing</span>
        </div>
      </div>

      {/* Confetti keyframes */}
      <style>{`
        @keyframes confetti-burst {
          0%   { transform: translate(0,0) scale(0); opacity: 1; }
          100% { transform: translate(var(--cx,0px), var(--cy,-180px)) scale(1); opacity: 0; }
        }
        .animate-confetti-burst {
          animation: confetti-burst 1s ease-out forwards;
          --cx: calc((var(--i, 0) - 9) * 30px);
          --cy: calc(-80px - var(--i, 0) * 12px);
        }
      `}</style>
    </div>
  );
}
