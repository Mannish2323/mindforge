'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { getPlanById, PLANS, PlanId } from '@/lib/plans';
import {
  Crown, Sparkles, Clock, TrendingUp, CreditCard, ChevronDown,
  ChevronUp, X, AlertTriangle, CheckCircle2, Zap, ArrowRight
} from 'lucide-react';

// ─── Countdown badge ────────────────────────────────────────────────────────
function ExpiryCountdown({ endsAt }: { endsAt: string | null }) {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    if (!endsAt) return;
    const calc = () => {
      const diff = new Date(endsAt).getTime() - Date.now();
      setDays(Math.max(0, Math.ceil(diff / 86400000)));
    };
    calc();
    const t = setInterval(calc, 60000);
    return () => clearInterval(t);
  }, [endsAt]);

  if (days === null) return null;

  const urgent = days <= 3;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={{
        background: urgent ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.1)',
        border: `1px solid ${urgent ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.25)'}`,
        color: urgent ? '#f87171' : 'rgba(167,139,250,0.8)',
      }}
    >
      <Clock className="w-3 h-3" />
      {days === 0 ? 'Expires today' : `${days}d remaining`}
    </div>
  );
}

// ─── AI usage ring ──────────────────────────────────────────────────────────
function UsageRing({ used, limit }: { used: number; limit: number }) {
  const pct = Math.min(100, (used / Math.max(1, limit)) * 100);
  const r = 20, circumference = 2 * Math.PI * r;
  const urgent = pct >= 80;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth="4" />
          <circle
            cx="24" cy="24" r={r}
            fill="none"
            stroke={urgent ? '#ef4444' : '#a78bfa'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (pct / 100) * circumference}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[9px] font-black text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <div>
        <div className="text-xs font-black text-white">{used} / {limit}</div>
        <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.55)' }}>AI chats today</div>
        {urgent && <div className="text-[10px] text-red-400 font-bold mt-0.5">Limit nearly reached</div>}
      </div>
    </div>
  );
}

// ─── Payment history row ────────────────────────────────────────────────────
interface PaymentRecord {
  id: string;
  plan_id: string;
  amount: number;
  currency: string;
  billing_period: string;
  razorpay_payment_id: string;
  status: string;
  created_at: string;
}

// ─── Main component ─────────────────────────────────────────────────────────
export function SubscriptionCard() {
  const { profile, user } = useAuth();
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [history, setHistory] = useState<PaymentRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);

  const plan = getPlanById(profile?.planId);
  const isPremium = ['starter', 'plus', 'pro', 'ai_max'].includes(profile?.planId || '');

  // Load usage
  useEffect(() => {
    const loadUsage = async () => {
      try {
        const sess = await import('@/lib/supabase').then(m => m.createClient().auth.getSession());
        const token = sess.data.session?.access_token;
        if (!token) return;
        const res = await fetch('/api/billing/usage', { headers: { 'Authorization': `Bearer ${token}` } });
        const d = await res.json();
        if (!d.error) setUsage({ used: d.used, limit: d.limit });
      } catch {}
    };
    loadUsage();
  }, []);

  // Load payment history
  const loadHistory = async () => {
    if (history.length > 0) { setShowHistory(h => !h); return; }
    setLoadingHistory(true);
    try {
      const sess = await import('@/lib/supabase').then(m => m.createClient().auth.getSession());
      const token = sess.data.session?.access_token;
      const res = await fetch('/api/billing/history', { headers: { 'Authorization': `Bearer ${token}` } });
      const d = await res.json();
      setHistory(d.history || []);
    } catch {}
    setLoadingHistory(false);
    setShowHistory(true);
  };

  const cancelSubscription = async () => {
    setCancelling(true);
    try {
      const sess = await import('@/lib/supabase').then(m => m.createClient().auth.getSession());
      const token = sess.data.session?.access_token;
      await fetch('/api/billing/cancel', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } });
      setShowCancel(false);
      window.location.reload();
    } catch {}
    setCancelling(false);
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        background: isPremium
          ? `linear-gradient(145deg, ${plan.gradFrom}99, ${plan.gradTo}99)`
          : 'rgba(18,14,40,0.6)',
        border: isPremium ? `1px solid ${plan.color}40` : '1px solid rgba(139,92,246,0.18)',
        backdropFilter: 'blur(16px)',
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-lg font-black" style={{ color: plan.color }}>
                {plan.emoji} {plan.name}
              </div>
              {isPremium && (
                <div
                  className="px-2 py-0.5 rounded-full text-[10px] font-black"
                  style={{ background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}30` }}
                >
                  Active
                </div>
              )}
            </div>
            <div className="text-xs" style={{ color: 'rgba(160,150,220,0.55)' }}>
              {plan.subtitle}
            </div>
          </div>
          {isPremium && (
            <ExpiryCountdown endsAt={(profile as any)?.endsAt || null} />
          )}
        </div>

        {/* AI Usage ring */}
        {usage && (
          <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.12)' }}>
            <UsageRing used={usage.used} limit={usage.limit} />
          </div>
        )}

        {/* Key features for this plan */}
        <div className="grid grid-cols-2 gap-1.5 mb-4">
          {plan.features.slice(0, 4).map((f, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgba(200,196,255,0.7)' }}>
              <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: plan.color }} />
              <span className="truncate">{f}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <motion.button
            onClick={() => router.push('/billing')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all"
            style={
              isPremium
                ? { background: `${plan.color}18`, color: plan.color, border: `1px solid ${plan.color}30` }
                : { background: 'linear-gradient(135deg, #7c3aed, #db2777)', color: '#fff' }
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isPremium ? 'Upgrade Plan' : 'Upgrade Now'}
          </motion.button>

          <button
            onClick={loadHistory}
            className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'rgba(139,92,246,0.08)', color: 'rgba(167,139,250,0.7)', border: '1px solid rgba(139,92,246,0.15)' }}
          >
            <CreditCard className="w-3.5 h-3.5" />
            {loadingHistory ? '…' : 'History'}
          </button>

          {isPremium && (
            <button
              onClick={() => setShowCancel(true)}
              className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{ background: 'rgba(239,68,68,0.06)', color: 'rgba(248,113,113,0.7)', border: '1px solid rgba(239,68,68,0.15)' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Payment history panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t"
            style={{ borderColor: 'rgba(139,92,246,0.1)' }}
          >
            <div className="p-4">
              <div className="text-xs font-black text-white mb-3">Payment History</div>
              {history.length === 0 ? (
                <div className="text-xs text-center py-4" style={{ color: 'rgba(160,150,220,0.4)' }}>
                  No payments yet
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map(h => (
                    <div key={h.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white capitalize">{h.plan_id}</span>
                        <span className="ml-1.5" style={{ color: 'rgba(160,150,220,0.5)' }}>
                          {new Date(h.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white">₹{h.amount / 100}</span>
                        <span
                          className="px-1.5 py-0.5 rounded-full text-[10px]"
                          style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399' }}
                        >
                          {h.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel confirmation modal */}
      <AnimatePresence>
        {showCancel && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(5,3,14,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-sm w-full rounded-2xl p-6"
              style={{ background: 'rgba(20,14,48,0.98)', border: '1px solid rgba(239,68,68,0.25)' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
              <div className="text-lg font-black text-white mb-2">Cancel Subscription?</div>
              <p className="text-xs mb-6 leading-relaxed" style={{ color: 'rgba(200,196,255,0.65)' }}>
                Your plan will remain active until the end of the current period. After that, you will revert to the Free tier and lose access to premium features.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelSubscription}
                  disabled={cancelling}
                  className="flex-1 py-3 rounded-xl text-sm font-black text-white transition-all"
                  style={{ background: 'rgba(239,68,68,0.8)' }}
                >
                  {cancelling ? 'Cancelling…' : 'Yes, Cancel'}
                </button>
                <button
                  onClick={() => setShowCancel(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-black transition-all"
                  style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  Keep Plan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
