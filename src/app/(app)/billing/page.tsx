'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { invalidateEntitlementCache } from '@/hooks/useEntitlements';
import { PLANS, PlanId } from '@/lib/plans';
import { createBrowserClient } from '@supabase/ssr';
import {
  Check, ShieldCheck, Crown, ArrowRight, Sparkles, X, Star, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  motion, AnimatePresence, useMotionValue, useSpring as useMotionSpring,
  useInView, animate
} from 'framer-motion';
import {
  staggerContainer, staggerTight, cardReveal, featureRow,
  fadeInUp, fadeIn, glowPulse, floatBadge, sparkleSpin,
  buttonInteraction, breathingGlow, spring, ease,
} from '@/lib/motion/animations';

// ─── Sakura particles (light version for pricing page) ───────────────────────
function PricingParticles({ count = 14 }: { count?: number }) {
  const [petals, setPetals] = useState<
    { id: number; left: string; delay: number; dur: number; size: number }[]
  >([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const isLowEnd = (navigator.hardwareConcurrency ?? 8) <= 4;
    const n = isLowEnd ? 6 : count;
    setPetals(
      Array.from({ length: n }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 12,
        dur:   14 + Math.random() * 10,
        size:  5 + Math.random() * 9,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {petals.map(p => (
        <span
          key={p.id}
          className="absolute animate-petal-fall rounded-[100%_0%_60%_40%_/_60%_0%_100%_40%]"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%)',
            opacity: 0.22 + Math.random() * 0.2,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated count-up price ──────────────────────────────────────────────────
function AnimatedPrice({ price, inView }: { price: number; inView: boolean }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!inView || hasRun.current || price === 0) return;
    hasRun.current = true;
    const ctrl = animate(0, price, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(v) {
        if (nodeRef.current) nodeRef.current.textContent = Math.round(v).toString();
      },
    });
    return () => ctrl.stop();
  }, [inView, price]);

  if (price === 0) return <span ref={nodeRef}>0</span>;
  return <span ref={nodeRef}>0</span>;
}

// ─── 3D tilt card wrapper (desktop only) ─────────────────────────────────────
function TiltCard({
  children,
  isPopular,
  isActive,
  className = '',
}: {
  children: React.ReactNode;
  isPopular: boolean;
  isActive: boolean;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const shadowX = useMotionValue(0);
  const shadowY = useMotionValue(0);

  const springX = useMotionSpring(rotateX, { stiffness: 120, damping: 22 });
  const springY = useMotionSpring(rotateY, { stiffness: 120, damping: 22 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.innerWidth < 1024) return; // no 3D on mobile
    const { left, top, width, height } = card.getBoundingClientRect();
    const cx = (e.clientX - left) / width  - 0.5;  // -0.5 to 0.5
    const cy = (e.clientY - top)  / height - 0.5;
    rotateY.set(cx * 10);  // max ±5°
    rotateX.set(-cy * 8);
    shadowX.set(cx * 20);
    shadowY.set(cy * 20);
  }, [rotateX, rotateY, shadowX, shadowY]);

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    shadowX.set(0);
    shadowY.set(0);
  }, [rotateX, rotateY, shadowX, shadowY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
        perspective: 800,
      }}
      whileTap={{ scale: 0.97 }}
      transition={spring.gentle}
      className={`relative h-full ${className}`}
    >
      {/* Animated glow border for popular & active */}
      {(isPopular || isActive) && (
        <motion.div
          className="absolute -inset-[1px] rounded-2xl z-0"
          style={{
            background: isActive
              ? 'linear-gradient(135deg, #10b981, #059669, #10b981)'
              : 'linear-gradient(135deg, #6D3CFF, #EC4899, #C15BFF, #6D3CFF)',
            backgroundSize: '300% 300%',
          }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// ─── Shimmer text hook ────────────────────────────────────────────────────────
function ShimmerHeading({ children }: { children: React.ReactNode }) {
  const [shimmer, setShimmer] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 1200);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <h1
      className={`text-3xl md:text-5xl font-extrabold tracking-tight text-white transition-all duration-300 ${shimmer ? 'shimmer-text' : ''}`}
    >
      {children}
    </h1>
  );
}

// ─── Success confetti ─────────────────────────────────────────────────────────
function SuccessOverlay({ planName }: { planName: string }) {
  const dots = Array.from({ length: 24 }, (_, i) => i);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {dots.map(i => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: ['#6D3CFF','#EC4899','#10B981','#F59E0B','#C15BFF'][i % 5],
            top: '50%', left: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 600,
            opacity: 0,
            scale: [0, 1.4, 0],
          }}
          transition={{ duration: 1.2 + Math.random() * 0.8, ease: 'easeOut', delay: i * 0.03 }}
        />
      ))}
      <motion.div
        className="bg-emerald-500/20 border border-emerald-500/40 backdrop-blur-xl rounded-2xl px-8 py-6 text-center space-y-2"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...spring.bouncy, delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl"
        >
          🎉
        </motion.div>
        <p className="text-emerald-400 font-extrabold text-lg">{planName} Activated!</p>
        <p className="text-emerald-300/60 text-sm">Your premium journey begins now 🌸</p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const { profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [successPlan, setSuccessPlan] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const cardsRef = useRef<HTMLDivElement>(null);
  const cardsInView = useInView(cardsRef, { once: true, margin: '-80px' });

  // ─── Razorpay (unchanged logic) ──────────────────────────────────────────
  const handleCheckout = async (planId: PlanId) => {
    if (planId === 'free') return;
    setError('');
    setSuccess('');
    setLoading(planId);

    try {
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed.');

      const loadScript = () =>
        new Promise<void>((resolve, reject) => {
          if ((window as any).Razorpay) { resolve(); return; }
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(s);
        });

      await loadScript();

      const options = {
        key:         orderData.key,
        amount:      orderData.amount,
        currency:    orderData.currency || 'INR',
        name:        'Velmorth',
        description: `${orderData.planName} — ${orderData.periodLabel}`,
        order_id:    orderData.orderId,
        image:       '/velmorth_logo.png',
        prefill:     { email: profile?.email || '' },
        theme:       { color: '#6D3CFF' },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(planId);
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          );
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token || '';

          const verifyRes = await fetch('/api/billing/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              planId,
              endsAt: orderData.endsAt,
            }),
          });

          if (verifyRes.ok) {
            const plan = PLANS[planId];
            setSuccess(`🎉 ${plan.name} activated! Your plan is now live.`);
            setSuccessPlan(plan.name);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            invalidateEntitlementCache();
            await refreshProfile();
          } else {
            const errData = await verifyRes.json();
            setError(errData.error || 'Payment verification failed. Contact support.');
          }
          setLoading(null);
        },
        modal: { ondismiss: () => setLoading(null) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setError(resp.error?.description || 'Payment failed. Please try again.');
        setLoading(null);
      });
      rzp.open();

    } catch (err: any) {
      setError(err?.message || 'Checkout failed. Please try again.');
      setLoading(null);
    }
  };

  const currentPlan = (profile?.planId || 'free') as PlanId;
  const displayPlanIds: PlanId[] = ['free', 'starter', 'plus', 'pro', 'ai_max'];

  return (
    <>
      {/* ── Confetti overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showConfetti && <SuccessOverlay planName={successPlan} />}
      </AnimatePresence>

      <div className="relative min-h-screen space-y-12 max-w-6xl mx-auto overflow-hidden">

        {/* ── Background: breathing glow + mesh + petals ─────────────────── */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <motion.div
            className="absolute top-[-15%] left-[10%] w-[600px] h-[600px] rounded-full blur-[130px]"
            style={{ background: 'radial-gradient(circle, rgba(109,60,255,0.15) 0%, transparent 70%)' }}
            variants={breathingGlow}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full blur-[110px]"
            style={{ background: 'radial-gradient(circle, rgba(200,80,255,0.12) 0%, transparent 70%)' }}
            variants={breathingGlow}
            animate="animate"
            transition={{ delay: 1.5 }}
          />
        </div>

        <PricingParticles count={16} />

        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center space-y-6 pt-4"
        >
          {/* Floating premium badge */}
          <motion.div variants={floatBadge} animate="animate" className="inline-block">
            <Badge variant="neon" size="md" icon={<Crown className="w-3.5 h-3.5 text-amber-400" />} glow>
              VELMORTH PREMIUM
            </Badge>
          </motion.div>

          {/* Headline with shimmer */}
          <motion.div variants={fadeInUp}>
            <ShimmerHeading>
              Upgrade Your{' '}
              <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta bg-clip-text text-transparent">
                Fluency Level
              </span>
            </ShimmerHeading>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-sm text-purple-300/45 max-w-lg mx-auto leading-relaxed"
          >
            Unlock unlimited vocabulary, AI-powered conversations, and the complete N5→N1 learning path.
            All prices in INR — secured by Razorpay.
          </motion.p>

          {/* Social proof chips */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: '🌸', label: '50,000+ learners' },
              { icon: '⭐', label: '4.9 avg rating' },
              { icon: '🔒', label: 'Cancel anytime' },
            ].map(chip => (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-[11px] text-purple-200/50 font-semibold"
              >
                <span>{chip.icon}</span>{chip.label}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Alerts ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: spring.snappy }}
              exit={{ opacity: 0, y: -8, scale: 0.96, transition: ease.exit }}
              className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-semibold"
            >
              <Sparkles className="w-4 h-4 flex-shrink-0 animate-spin" />{success}
            </motion.div>
          )}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: spring.snappy }}
              exit={{ opacity: 0, y: -8, scale: 0.96, transition: ease.exit }}
              className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-semibold"
            >
              <X className="w-4 h-4 flex-shrink-0" />{error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Plan Cards ─────────────────────────────────────────────────── */}
        <div ref={cardsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
            {displayPlanIds.map((planId, cardIndex) => {
              const plan     = PLANS[planId];
              const isActive = currentPlan === planId;

              return (
                <motion.div
                  key={planId}
                  variants={cardReveal}
                  initial="initial"
                  animate={cardsInView ? 'animate' : 'initial'}
                  custom={cardIndex}
                  transition={{ ...spring.gentle, delay: cardIndex * 0.1 }}
                  className="h-full"
                >
                  <TiltCard isPopular={plan.popular} isActive={isActive} className="h-full">
                    {/* Active plan pulse glow */}
                    {isActive && (
                      <motion.div
                        className="absolute -inset-3 rounded-3xl -z-10 blur-xl"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.2), transparent 70%)' }}
                        variants={glowPulse}
                        animate="animate"
                      />
                    )}

                    {/* Popular plan soft pulse glow */}
                    {plan.popular && !isActive && (
                      <motion.div
                        className="absolute -inset-3 rounded-3xl -z-10 blur-xl"
                        style={{ background: 'radial-gradient(circle, rgba(109,60,255,0.18), transparent 70%)' }}
                        variants={glowPulse}
                        animate="animate"
                      />
                    )}

                    {/* Card body */}
                    <div
                      className={`flex flex-col h-full rounded-2xl overflow-hidden relative
                        ${isActive
                          ? 'bg-emerald-950/40 border border-emerald-500/30'
                          : plan.popular
                          ? 'bg-[#0f0b1e] border border-neon-purple/25'
                          : 'bg-[#0c0a18]/80 border border-white/[0.07]'}
                        backdrop-blur-xl`}
                    >
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none opacity-40"
                        style={{ background: `linear-gradient(135deg, ${plan.gradFrom}44, ${plan.gradTo}18)` }}
                      />

                      {/* Top badge */}
                      {plan.badge && (
                        <div className="relative z-10">
                          {plan.popular ? (
                            <div className="absolute -top-px -right-px">
                              <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-neon-purple to-neon-pink text-[9px] font-extrabold text-white uppercase tracking-wider rounded-bl-xl rounded-tr-2xl">
                                <motion.span variants={sparkleSpin} animate="animate">
                                  <Star className="w-2.5 h-2.5 fill-white" />
                                </motion.span>
                                {plan.badge}
                              </div>
                            </div>
                          ) : (
                            <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-600 text-[9px] font-extrabold text-white uppercase tracking-wider rounded-bl-xl rounded-tr-2xl z-10">
                              {plan.badge}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">

                        {/* Plan header */}
                        <div className="space-y-3 mb-5">
                          <div className="flex items-center gap-2">
                            <motion.span
                              className="text-2xl"
                              animate={{ rotate: [0, 8, -8, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: cardIndex * 0.4 }}
                            >
                              {plan.emoji}
                            </motion.span>
                            <div>
                              <h3 className="text-base font-bold text-white">{plan.name}</h3>
                              <p className="text-[10px] text-purple-300/40">{plan.subtitle}</p>
                            </div>

                            {/* Animated crown for popular plan */}
                            {plan.popular && (
                              <motion.div
                                className="ml-auto"
                                variants={floatBadge}
                                animate="animate"
                              >
                                <Crown className="w-4 h-4 text-amber-400" />
                              </motion.div>
                            )}
                          </div>

                          {/* Animated price */}
                          <div className="flex items-baseline gap-1">
                            {plan.price === 0 ? (
                              <span className="text-3xl font-extrabold text-white font-orbitron">₹0</span>
                            ) : (
                              <>
                                <span className="text-lg font-bold text-purple-300/50 font-orbitron">₹</span>
                                <span className="text-3xl font-extrabold text-white font-orbitron">
                                  <AnimatedPrice price={plan.price} inView={cardsInView} />
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

                        {/* Feature list with stagger */}
                        <motion.ul
                          variants={staggerTight}
                          initial="initial"
                          animate={cardsInView ? 'animate' : 'initial'}
                          className="space-y-2 flex-1 mb-6"
                        >
                          {plan.features.slice(0, 7).map((f, i) => (
                            <motion.li
                              key={i}
                              variants={featureRow}
                              transition={{ ...spring.gentle, delay: cardIndex * 0.1 + i * 0.06 }}
                              className="flex items-start gap-2 text-xs"
                            >
                              <motion.span
                                className="flex-shrink-0 mt-0.5"
                                initial={{ scale: 0 }}
                                animate={cardsInView ? { scale: 1 } : { scale: 0 }}
                                transition={{ delay: cardIndex * 0.1 + i * 0.06 + 0.2, ...spring.bouncy }}
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
                              </motion.span>
                              <span className="text-purple-200/55">{f}</span>
                            </motion.li>
                          ))}
                          {plan.features.length > 7 && (
                            <motion.li
                              variants={featureRow}
                              className="text-[10px] text-purple-300/30 pl-5"
                            >
                              +{plan.features.length - 7} more features
                            </motion.li>
                          )}
                        </motion.ul>

                        {/* CTA Button */}
                        {isActive ? (
                          <motion.div
                            variants={glowPulse}
                            animate="animate"
                            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400"
                          >
                            <ShieldCheck className="w-4 h-4" /> Current Plan ✓
                          </motion.div>
                        ) : planId === 'free' ? (
                          <div className="py-3.5 rounded-xl text-center text-xs font-semibold text-purple-300/30 border border-white/[0.04]">
                            Free Forever
                          </div>
                        ) : (
                          <motion.div {...buttonInteraction}>
                            <Button
                              onClick={() => handleCheckout(planId)}
                              loading={loading === planId}
                              variant={plan.popular ? 'neon' : 'primary'}
                              className="w-full relative overflow-hidden group"
                              rightIcon={
                                loading === planId
                                  ? <Zap className="w-4 h-4 animate-pulse" />
                                  : <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                              }
                            >
                              Upgrade · ₹{plan.price}{plan.periodLabel}
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Trust footer ───────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center space-y-4 pb-8"
        >
          <p className="text-xs text-purple-300/25 max-w-md mx-auto">
            Payments secured by Razorpay. Cancel anytime from your profile settings.
          </p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-purple-300/20 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure Payment</span>
            <span>·</span>
            <span>Cancel Anytime</span>
            <span>·</span>
            <span>INR Pricing</span>
          </div>

          {/* Comparison hint */}
          <motion.p
            className="text-[10px] text-purple-300/20 italic"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Premium feel · Zero compromise · Built for Japanese learners 🌸
          </motion.p>
        </motion.div>
      </div>

      {/* ── Shimmer text CSS ─────────────────────────────────────────────── */}
      <style>{`
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #6D3CFF 25%,
            #EC4899 50%,
            #C15BFF 75%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-sweep 1.2s linear;
        }
        @keyframes shimmer-sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </>
  );
}
