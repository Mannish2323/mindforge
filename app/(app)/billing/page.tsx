'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { PLANS, PLAN_ORDER, PlanId, getPlanById } from '@/lib/plans';
import {
  Check, X, Sparkles, Crown, Zap, Star, ArrowRight, Shield,
  Clock, Infinity as InfinityIcon, MessageSquare, Mic, Pencil,
  Brain, BookOpen, ChevronDown, ChevronUp, Headphones, Trophy,
  Gift, RefreshCw, AlertCircle, CheckCircle2, Flame
} from 'lucide-react';

// ─── Floating particle background ────────────────────────────────────────────
function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 6 + 2,
            height: Math.random() * 6 + 2,
            background: i % 3 === 0 ? '#a78bfa' : i % 3 === 1 ? '#e879f9' : '#60a5fa',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedPrice({ value, prefix = '₹' }: { value: number; prefix?: string }) {
  const motionVal = useMotionValue(0);
  const spring    = useSpring(motionVal, { stiffness: 80, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionVal.set(value);
  }, [value, motionVal]);

  useEffect(() => {
    return spring.on('change', (v) => setDisplay(Math.round(v)));
  }, [spring]);

  if (value === 0) return <span className="text-5xl font-black text-white">Free</span>;
  return (
    <span className="text-5xl font-black text-white">
      {prefix}{display}
    </span>
  );
}

// ─── Success modal ────────────────────────────────────────────────────────────
function SuccessModal({ planName, onClose }: { planName: string; onClose: () => void }) {
  useEffect(() => {
    // Confetti burst
    import('canvas-confetti').then(({ default: confetti }) => {
      const burst = () => confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#a78bfa', '#e879f9', '#60a5fa', '#f59e0b', '#34d399'],
        scalar: 1.2,
      });
      burst();
      setTimeout(burst, 400);
      setTimeout(burst, 800);
    });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(5,3,14,0.92)', backdropFilter: 'blur(16px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative max-w-md w-full rounded-3xl p-8 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(20,14,48,0.98), rgba(14,10,30,0.98))',
          border: '1px solid rgba(167,139,250,0.3)',
          boxShadow: '0 0 80px rgba(124,58,237,0.3)',
        }}
        initial={{ scale: 0.6, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Glow rings */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.15), transparent 70%)' }}
        />

        {/* Check mark */}
        <motion.div
          className="relative w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(124,58,237,0.2))' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 300 }}
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </motion.div>
        </motion.div>

        <motion.h2
          className="text-3xl font-black text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to {planName}! 🎉
        </motion.h2>
        <motion.p
          className="text-sm mb-6 leading-relaxed"
          style={{ color: 'rgba(200,196,255,0.7)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your subscription is now active. All premium features have been unlocked instantly.
          Time to level up your Japanese! 🗾
        </motion.p>

        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {['✅ AI Tutor', '✅ Writing AI', '✅ Speaking AI'].map((f, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl text-xs font-bold text-white"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
            >
              {f}
            </div>
          ))}
        </motion.div>

        <motion.button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl font-black text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Start Learning Now <ArrowRight className="w-4 h-4 inline ml-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

// ─── Plan card ────────────────────────────────────────────────────────────────
function PlanCard({
  planId,
  isCurrentPlan,
  index,
  onSelect,
}: {
  planId: PlanId;
  isCurrentPlan: boolean;
  index: number;
  onSelect: () => void;
}) {
  const plan = PLANS[planId];
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set(((e.clientX - cx) / (rect.width / 2)) * 6);
    mouseY.set(-((e.clientY - cy) / (rect.height / 2)) * 6);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1000, rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      {/* Glow ring behind popular card */}
      {plan.popular && (
        <motion.div
          className="absolute -inset-px rounded-3xl pointer-events-none z-0"
          style={{
            background: `linear-gradient(135deg, ${plan.color}60, transparent 60%, ${plan.color}40)`,
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div
        className={`relative flex flex-col rounded-3xl p-6 h-full z-10 transition-shadow duration-300 ${plan.popular ? 'shadow-2xl' : ''}`}
        style={{
          background: plan.popular
            ? `linear-gradient(145deg, ${plan.gradFrom}dd, ${plan.gradTo}dd)`
            : 'linear-gradient(145deg, rgba(18,14,40,0.9), rgba(12,9,28,0.9))',
          border: isCurrentPlan
            ? `2px solid #34d399`
            : plan.popular
            ? `1px solid ${plan.color}70`
            : '1px solid rgba(139,92,246,0.18)',
          boxShadow: plan.popular ? `0 0 60px ${plan.color}18` : 'none',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Badge */}
        {(plan.popular || plan.badge) && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
            <motion.div
              className="px-5 py-1.5 rounded-full text-xs font-black text-white whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}aa)` }}
              animate={plan.popular ? { scale: [1, 1.04, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {plan.popular ? '★ Most Popular' : plan.badge}
            </motion.div>
          </div>
        )}
        {isCurrentPlan && (
          <div className="absolute -top-4 right-4 z-20 px-3 py-1 rounded-full text-[10px] font-black"
            style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', color: '#34d399' }}>
            ✓ Active
          </div>
        )}

        {/* Header */}
        <div className="mb-5">
          <div className="text-3xl mb-3">{plan.emoji}</div>
          <div className="text-xs font-black tracking-widest mb-0.5" style={{ color: plan.color }}>
            {plan.name.toUpperCase()}
          </div>
          <div className="text-xs" style={{ color: 'rgba(160,150,220,0.55)' }}>{plan.subtitle}</div>
        </div>

        {/* Price */}
        <div className="mb-6">
          <AnimatedPrice value={plan.price} />
          <span className="text-sm font-normal ml-1" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {plan.periodLabel}
          </span>
          {plan.periodDays && (
            <div className="text-[11px] mt-0.5" style={{ color: 'rgba(120,110,180,0.5)' }}>
              ~₹{Math.round(plan.price / plan.periodDays * 30)}/mo equivalent
            </div>
          )}
        </div>

        {/* Feature list */}
        <ul className="space-y-2 flex-1 mb-6">
          {plan.features.slice(0, 9).map((f, i) => (
            <motion.li
              key={f}
              className="flex items-start gap-2 text-xs"
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.08 + i * 0.03 + 0.2 }}
            >
              <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
              <span style={{ color: 'rgba(210,205,255,0.85)' }}>{f}</span>
            </motion.li>
          ))}
          {plan.features.length > 9 && (
            <li className="text-xs font-bold" style={{ color: plan.color }}>
              +{plan.features.length - 9} more features
            </li>
          )}
          {plan.notIncluded.slice(0, 2).map(f => (
            <li key={f} className="flex items-start gap-2 text-xs">
              <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(109,95,160,0.35)' }} />
              <span style={{ color: 'rgba(109,95,160,0.4)' }}>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <motion.button
          onClick={isCurrentPlan ? undefined : onSelect}
          whileHover={isCurrentPlan ? {} : { scale: 1.03 }}
          whileTap={isCurrentPlan ? {} : { scale: 0.97 }}
          className={`w-full py-3.5 rounded-xl text-sm font-black transition-all ${isCurrentPlan ? 'cursor-default' : 'cursor-pointer'}`}
          style={
            isCurrentPlan
              ? { background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
              : plan.id === 'free'
              ? { background: 'rgba(139,92,246,0.08)', color: 'rgba(139,92,246,0.5)', border: '1px solid rgba(139,92,246,0.15)' }
              : plan.popular
              ? { background: `linear-gradient(135deg, ${plan.color}cc, ${plan.color}88)`, color: '#fff', boxShadow: `0 4px 24px ${plan.color}40` }
              : { background: `${plan.color}1a`, color: plan.color, border: `1px solid ${plan.color}40` }
          }
        >
          {isCurrentPlan
            ? '✓ Current Plan'
            : plan.id === 'free'
            ? 'Free Plan'
            : `Get ${plan.name} →`}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Comparison table ─────────────────────────────────────────────────────────
const COMPARISON_CATEGORIES = [
  { label: 'Lessons & Content', rows: [
    { name: 'Lessons per day',      vals: ['5', '15', '30', '∞', '∞'] },
    { name: 'JLPT N5 content',      vals: [true, true, true, true, true] },
    { name: 'JLPT N4 content',      vals: [false, true, true, true, true] },
    { name: 'JLPT N3–N1 content',   vals: [false, false, false, true, true] },
    { name: 'Ad-free experience',    vals: [false, true, true, true, true] },
  ]},
  { label: 'AI Features', rows: [
    { name: 'AI chats/day',          vals: ['5', '15', '40', '100', '500'] },
    { name: 'AI grammar explainer',  vals: [false, true, true, true, true] },
    { name: 'AI quiz generator',     vals: [false, false, true, true, true] },
    { name: 'AI conversation',       vals: [false, false, false, true, true] },
    { name: 'AI study planner',      vals: [false, false, true, true, true] },
    { name: 'Priority AI responses', vals: [false, false, false, false, true] },
    { name: 'AI interview simulator',vals: [false, false, false, false, true] },
  ]},
  { label: 'Writing Practice', rows: [
    { name: 'Basic kanji',           vals: [true, true, true, true, true] },
    { name: 'N4 kanji pack',         vals: [false, false, true, true, true] },
    { name: 'AI stroke correction',  vals: [false, false, true, true, true] },
    { name: 'Stroke order analysis', vals: [false, false, false, true, true] },
    { name: 'All N5→N1 kanji',       vals: [false, false, false, true, true] },
  ]},
  { label: 'Speaking Practice', rows: [
    { name: 'Basic speaking',        vals: [true, true, true, true, true] },
    { name: 'AI pronunciation AI',   vals: [false, false, true, true, true] },
    { name: 'Business Japanese',     vals: [false, false, false, true, true] },
    { name: 'Interview practice',    vals: [false, false, false, true, true] },
    { name: 'AI speaking coach',     vals: [false, false, false, false, true] },
  ]},
  { label: 'Downloads & Sync', rows: [
    { name: 'Offline downloads',     vals: [false, false, true, true, true] },
    { name: 'Cloud backup',          vals: [false, false, false, true, true] },
    { name: 'Priority sync',         vals: [false, false, false, true, true] },
    { name: 'Priority support',      vals: [false, false, false, false, true] },
    { name: 'Beta features',         vals: [false, false, false, false, true] },
  ]},
];

function ComparisonTable() {
  const [expanded, setExpanded] = useState<number[]>([0]);

  const toggle = (i: number) =>
    setExpanded(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);

  return (
    <div className="space-y-3">
      {COMPARISON_CATEGORIES.map((cat, ci) => (
        <motion.div
          key={ci}
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(18,14,40,0.6)', border: '1px solid rgba(139,92,246,0.15)', backdropFilter: 'blur(12px)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: ci * 0.05 }}
        >
          <button
            onClick={() => toggle(ci)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(139,92,246,0.05)] transition-colors"
          >
            <span className="text-sm font-black text-white">{cat.label}</span>
            {expanded.includes(ci)
              ? <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" />
              : <ChevronDown className="w-4 h-4 text-purple-400 flex-shrink-0" />}
          </button>

          <AnimatePresence>
            {expanded.includes(ci) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-t" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                        <th className="text-left py-2 px-4" style={{ color: 'rgba(160,150,220,0.4)', minWidth: 140 }}>Feature</th>
                        {PLAN_ORDER.map(pid => (
                          <th key={pid} className="text-center py-2 px-3" style={{ color: PLANS[pid].color, minWidth: 70 }}>
                            {PLANS[pid].emoji}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cat.rows.map((row, ri) => (
                        <tr key={ri} className="border-t" style={{ borderColor: 'rgba(139,92,246,0.07)' }}>
                          <td className="py-2 px-4" style={{ color: 'rgba(200,196,255,0.7)' }}>{row.name}</td>
                          {row.vals.map((v, vi) => (
                            <td key={vi} className="py-2 px-3 text-center">
                              {typeof v === 'boolean'
                                ? v
                                  ? <Check className="w-3.5 h-3.5 mx-auto" style={{ color: PLANS[PLAN_ORDER[vi]].color }} />
                                  : <X className="w-3.5 h-3.5 mx-auto" style={{ color: 'rgba(109,95,160,0.3)' }} />
                                : <span className="font-black" style={{ color: PLANS[PLAN_ORDER[vi]].color }}>{v}</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function BillingPage() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successPlan, setSuccessPlan] = useState('');
  const [error, setError] = useState('');
  const [showFaq, setShowFaq] = useState<number | null>(null);
  const currentPlanId = (profile?.planId || 'free') as PlanId;

  const handleSelectPlan = useCallback(async (planId: PlanId) => {
    if (planId === 'free' || planId === currentPlanId) return;
    const plan = PLANS[planId];
    setLoading(planId);
    setError('');

    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const orderData = await orderRes.json();

      if (!orderData.orderId) {
        setError(orderData.error || 'Failed to create order');
        setLoading(null);
        return;
      }

      // Open Razorpay checkout
      const rz = new (window as any).Razorpay({
        key:         orderData.key,
        amount:      orderData.amount,
        currency:    orderData.currency,
        order_id:    orderData.orderId,
        name:        'Velmorth',
        description: `${plan.name} Plan (${plan.periodLabel})`,
        image:       '/logo.png',
        prefill:     { email: profile?.email || user?.email },
        theme:       { color: plan.color },
        modal:       { ondismiss: () => setLoading(null) },
        handler: async (resp: any) => {
          try {
            const session = await import('@/lib/supabase').then(m => m.createClient().auth.getSession());
            const token   = session.data.session?.access_token;

            const verifyRes = await fetch('/api/billing/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body:    JSON.stringify({ ...resp, planId }),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setSuccessPlan(plan.name);
              setShowSuccess(true);
            } else {
              setError(verifyData.error || 'Payment verification failed');
            }
          } catch {
            setError('Payment verification error. Please contact support.');
          } finally {
            setLoading(null);
          }
        },
      });
      rz.open();
    } catch {
      setError('Failed to initiate payment. Please try again.');
      setLoading(null);
    }
  }, [currentPlanId, profile, user]);

  const FAQS = [
    { q: 'How do the billing periods work?', a: 'Each plan is valid for its stated duration from the time of purchase: Starter=7 days, Plus=10 days, Pro=15 days, AI Max=30 days. After expiry, you can renew at the same price.' },
    { q: 'Can I upgrade mid-plan?', a: 'Yes! Upgrading starts a new billing period immediately. Your old plan is replaced and any remaining days on the current plan are forfeited.' },
    { q: 'Can I cancel anytime?', a: 'Yes. You can cancel at any time from your Profile → Subscription. Your plan stays active until the end of the current period.' },
    { q: 'Are AI chats reset daily?', a: 'Yes. Your AI chat limit resets every day at midnight (IST). Unused chats do not roll over.' },
    { q: 'Is my payment secure?', a: 'All payments are processed by Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.' },
  ];

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <AnimatePresence>
        {showSuccess && (
          <SuccessModal
            planName={successPlan}
            onClose={() => { setShowSuccess(false); router.push('/home'); }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-16 pb-20">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <div className="relative text-center pt-6 overflow-hidden">
          <Particles />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-6"
              style={{ background: 'rgba(232,121,249,0.12)', border: '1px solid rgba(232,121,249,0.3)', color: '#e879f9' }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-3.5 h-3.5" /> 12,000+ learners · Trusted subscription platform
            </motion.div>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] mb-4">
              Pick Your<br />
              <span
                className="inline-block"
                style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #e879f9 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                Japanese Path
              </span>
            </h1>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(200,196,255,0.6)' }}>
              Flexible plans for every learner. Cancel anytime.
            </p>
          </motion.div>
        </div>

        {/* ── Error bar ────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl max-w-2xl mx-auto"
              style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)' }}
            >
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-300">{error}</span>
              <button onClick={() => setError('')} className="ml-auto text-red-400/60 hover:text-red-400">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Plan Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch pt-4">
          {PLAN_ORDER.map((planId, i) => (
            <PlanCard
              key={planId}
              planId={planId}
              isCurrentPlan={planId === currentPlanId}
              index={i}
              onSelect={() => {
                if (loading) return;
                handleSelectPlan(planId);
              }}
            />
          ))}
        </div>

        {/* Loading overlay for selected plan */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(5,3,14,0.7)', backdropFilter: 'blur(8px)' }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: `${PLANS[loading].color}22`, border: `1px solid ${PLANS[loading].color}40` }}
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <span className="text-3xl">{PLANS[loading].emoji}</span>
                </motion.div>
                <div className="text-white font-black mb-1">Opening {PLANS[loading].name} checkout…</div>
                <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Powered by Razorpay · Secure Payment</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trust badges ─────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            { icon: <Shield className="w-4 h-4" />, text: '7-day money-back' },
            { icon: <Clock className="w-4 h-4" />, text: 'Cancel anytime' },
            { icon: <InfinityIcon className="w-4 h-4" />, text: 'Free forever tier' },
            { icon: <Trophy className="w-4 h-4" />, text: '12,000+ learners' },
            { icon: <RefreshCw className="w-4 h-4" />, text: 'Daily AI reset' },
          ].map((b, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-xs"
              style={{ color: 'rgba(160,150,220,0.6)' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <span style={{ color: 'rgba(139,92,246,0.7)' }}>{b.icon}</span>
              {b.text}
            </motion.div>
          ))}
        </motion.div>

        {/* ── What's included cards ─────────────────────────────────────────── */}
        <div>
          <motion.h2
            className="text-2xl font-black text-white mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Everything Velmorth Has to Offer
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: <BookOpen className="w-5 h-5" />, title: 'Structured Lessons', desc: 'N5→N1 curriculum', color: '#a78bfa' },
              { icon: <Pencil className="w-5 h-5" />, title: 'Kanji Writing AI', desc: 'Stroke correction', color: '#60a5fa' },
              { icon: <Mic className="w-5 h-5" />, title: 'Speaking AI', desc: 'Pronunciation scoring', color: '#f472b6' },
              { icon: <MessageSquare className="w-5 h-5" />, title: 'AI Tutor 24/7', desc: 'Gemini-powered', color: '#34d399' },
              { icon: <Brain className="w-5 h-5" />, title: 'Smart SRS', desc: 'Spaced repetition', color: '#fb923c' },
              { icon: <Headphones className="w-5 h-5" />, title: 'Listening Practice', desc: 'Native audio', color: '#e879f9' },
              { icon: <Trophy className="w-5 h-5" />, title: 'JLPT Roadmap', desc: 'Guided exam prep', color: '#fbbf24' },
              { icon: <Flame className="w-5 h-5" />, title: 'Daily Streaks', desc: 'Stay consistent', color: '#f97316' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(18,14,40,0.6)', border: '1px solid rgba(139,92,246,0.12)', backdropFilter: 'blur(12px)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.03, borderColor: `${item.color}40` }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}15`, color: item.color }}>
                  {item.icon}
                </div>
                <div className="text-xs font-black text-white mb-0.5">{item.title}</div>
                <div className="text-[11px]" style={{ color: 'rgba(160,150,220,0.55)' }}>{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Feature comparison table ──────────────────────────────────────── */}
        <div>
          <motion.h2
            className="text-2xl font-black text-white mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Full Feature Comparison
          </motion.h2>
          <ComparisonTable />
        </div>

        {/* ── Testimonials ─────────────────────────────────────────────────── */}
        <div>
          <motion.h2
            className="text-2xl font-black text-white mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Loved by Learners Across India
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { text: 'Upgraded to Plus and passed JLPT N4 in 5 months. The AI writing correction is scary good — it caught mistakes I didn\'t know I was making.', author: 'Aditya S.', level: 'N4 Certified 🎌', avatar: '🇮🇳', plan: 'Plus' },
              { text: 'AI Max is worth every rupee. Having 500 AI chats a day means I can practice conversation at 11pm. My spoken Japanese improved dramatically.', author: 'Priya M.', level: 'N3 Student 🎌', avatar: '🇮🇳', plan: 'AI Max' },
              { text: 'The Pro plan\'s speaking practice with AI scoring changed everything. I finally know what I sound like to a native speaker. 10/10 recommend.', author: 'Rahul K.', level: 'N4 Student 🎌', avatar: '🇮🇳', plan: 'Pro' },
            ].map((t, i) => (
              <motion.div
                key={i}
                className="p-5 rounded-2xl"
                style={{ background: 'rgba(18,14,40,0.7)', border: '1px solid rgba(139,92,246,0.15)', backdropFilter: 'blur(12px)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-black"
                    style={{ background: `${getPlanById(t.plan.toLowerCase() as PlanId).color}20`, color: getPlanById(t.plan.toLowerCase() as PlanId).color }}>
                    {t.plan}
                  </span>
                </div>
                <p className="text-xs italic mb-4 leading-relaxed" style={{ color: 'rgba(200,196,255,0.8)' }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{t.avatar}</span>
                  <div>
                    <div className="text-xs font-black text-white">{t.author}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(139,92,246,0.6)' }}>{t.level}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <div>
          <motion.h2
            className="text-2xl font-black text-white mb-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(18,14,40,0.6)', border: '1px solid rgba(139,92,246,0.15)', backdropFilter: 'blur(12px)' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setShowFaq(showFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(139,92,246,0.05)] transition-colors"
                >
                  <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: showFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 flex-shrink-0 text-purple-400" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {showFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden px-4 pb-4"
                    >
                      <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,196,255,0.65)' }}>{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <motion.div
          className="relative rounded-3xl p-10 text-center overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(232,121,249,0.12))',
            border: '1px solid rgba(139,92,246,0.25)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Particles />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🗾</div>
            <h3 className="text-3xl font-black text-white mb-3">
              Your Japanese Journey Starts Today
            </h3>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(200,196,255,0.6)' }}>
              Join 12,000+ learners. Free forever — upgrade when you&apos;re ready to go deeper.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {(['ai_max', 'pro', 'plus'] as PlanId[]).map(pid => (
                <motion.button
                  key={pid}
                  onClick={() => handleSelectPlan(pid)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-white transition-all"
                  style={
                    pid === 'ai_max'
                      ? { background: `linear-gradient(135deg, ${PLANS[pid].color}, #7c3aed)`, boxShadow: `0 4px 24px ${PLANS[pid].color}40` }
                      : { background: `${PLANS[pid].color}20`, border: `1px solid ${PLANS[pid].color}40`, color: PLANS[pid].color }
                  }
                >
                  {PLANS[pid].emoji} {PLANS[pid].name} — ₹{PLANS[pid].price}{PLANS[pid].periodLabel}
                </motion.button>
              ))}
            </div>
            <p className="text-[11px] mt-6" style={{ color: 'rgba(160,150,220,0.35)' }}>
              Cancel anytime · Secure payment via Razorpay
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
