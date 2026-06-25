'use client';

import React, { useState } from 'react';
import { Crown, Check, X, Star, Zap, MessageCircle } from 'lucide-react';
import { useAuth } from '../app/context/AuthContext';

// ── Plan definitions ──────────────────────────────────────────────────────────
interface PlanDef {
  id: string;
  name: string;
  price: string;
  sub: string;
  badge?: string;
  highlight?: boolean;
  color: string;
  emoji: string;
  features: { text: string; ok: boolean }[];
  razorpayId?: string; // undefined = not purchasable
}

const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    sub: 'forever',
    color: '#64748B',
    emoji: '🌱',
    features: [
      { text: '5 lessons/day', ok: true },
      { text: 'Basic SRS review', ok: true },
      { text: 'Hiragana & Katakana', ok: true },
      { text: '25 hearts max', ok: true },
      { text: 'Community access', ok: true },
      { text: 'Ads between sections', ok: true },
      { text: 'AI Tutor', ok: false },
      { text: 'Unlimited lessons', ok: false },
      { text: 'JLPT packs', ok: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '₹99',
    sub: '/month',
    color: '#0EA5E9',
    emoji: '⚡',
    razorpayId: 'starter',
    features: [
      { text: '15 lessons/day', ok: true },
      { text: 'Ads between sections', ok: true },
      { text: 'Advanced SRS review', ok: true },
      { text: '75 hearts max', ok: true },
      { text: '15 AI chats/day', ok: true },
      { text: 'Better progress tools', ok: true },
      { text: 'JLPT N5 pack access', ok: true },
      { text: 'Speak mode full access', ok: false },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '₹149',
    sub: '/month',
    color: '#A855F7',
    emoji: '🚀',
    razorpayId: 'plus',
    features: [
      { text: '30 lessons/day', ok: true },
      { text: 'Ads between sections', ok: true },
      { text: 'Full SRS + weak-spot detection', ok: true },
      { text: '90 hearts max', ok: true },
      { text: '30 AI chats/day', ok: true },
      { text: 'JLPT N5 + N4 packs', ok: true },
      { text: 'Speak mode basic access', ok: true },
      { text: 'Priority over Starter', ok: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹199',
    sub: '/month',
    badge: '⭐ Most Popular',
    highlight: true,
    color: '#16A34A',
    emoji: '👑',
    razorpayId: 'pro',
    features: [
      { text: 'Unlimited lessons', ok: true },
      { text: 'No ads', ok: true },
      { text: 'Advanced SRS + all tools', ok: true },
      { text: '100 hearts max', ok: true },
      { text: '99 AI chats/day', ok: true },
      { text: 'Speak mode — full access', ok: true },
      { text: 'JLPT N5→N1 all packs', ok: true },
      { text: 'Early feature access', ok: true },
      { text: 'Priority support', ok: true },
    ],
  },
];

const YEARLY_PLAN = {
  id: 'pro_yearly',
  razorpayId: 'pro_yearly',
  label: 'Pro Yearly — ₹999/year',
  badge: '🏆 Best Value — Save 58%',
  note: '≈ ₹83/month',
};

declare global { interface Window { Razorpay: any; } }

// ── Plan badge label ─────────────────────────────────────────────────────────
function planLabel(status: string) {
  if (status === 'starter') return { text: 'Your Plan', color: '#0EA5E9' };
  if (status === 'plus')    return { text: 'Your Plan', color: '#A855F7' };
  if (status === 'pro' || status === 'yearly') return { text: 'Your Plan', color: '#16A34A' };
  return null;
}

export function BillingView() {
  const { session, profile } = useAuth();
  const [selectedId, setSelectedId] = useState<string>('pro');
  const [useYearly, setUseYearly]   = useState(false);
  const [loading, setLoading]        = useState(false);
  const [success, setSuccess]        = useState(false);
  const [error, setError]            = useState<string | null>(null);

  const activePlanId = useYearly ? 'pro_yearly' : selectedId;

  const handlePurchase = async () => {
    if (selectedId === 'free') return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: activePlanId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      if (typeof window === 'undefined' || !window.Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }

      const planObj = PLANS.find(p => p.id === selectedId);

      const rzp = new window.Razorpay({
        key:         data.key,
        amount:      data.amount,
        currency:    data.currency,
        name:        'Velmorth Labs',
        description: data.label || `Learn with Velmorth — ${selectedId}`,
        order_id:    data.orderId,
        prefill:     { email: profile?.email || '' },
        theme:       { color: planObj?.color || '#16A34A' },
        notes:       { 'Prices in INR': 'Bank conversion may apply.' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/billing/verify', {
            method: 'POST',
            headers: {
              'Content-Type':  'application/json',
              'Authorization': `Bearer ${session?.access_token || ''}`,
            },
            body: JSON.stringify({ ...response, planId: activePlanId }),
          });
          if (verifyRes.ok) {
            setSuccess(true);
          } else {
            const ve = await verifyRes.json();
            setError(ve.error || 'Verification failed. Please contact us on Instagram @Mannish_2323.');
          }
          setLoading(false);
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="billing-page page-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 'var(--sp-5)', textAlign: 'center' }}>
        <div style={{ fontSize: 64, animation: 'bounceIn 500ms ease' }}>🎉</div>
        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, margin: 0 }}>
          Welcome to {PLANS.find(p => p.id === selectedId)?.name || 'Pro'}!
        </h2>
        <p style={{ color: 'var(--text-2)', maxWidth: 360 }}>
          Your plan is now active. Enjoy unlimited Japanese learning! 頑張ってください！
        </p>
        <div className="pro-badge" style={{ fontSize: 'var(--text-base)', padding: '10px 24px' }}>
          <Crown size={18} /> {PLANS.find(p => p.id === selectedId)?.name} Active
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Questions? DM us on Instagram{' '}
          <a href="https://instagram.com/Mannish_2323" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
            @Mannish_2323
          </a>
        </p>
      </div>
    );
  }

  // ── Main billing UI ──────────────────────────────────────────────────────
  return (
    <div className="billing-page page-enter">

      {/* Hero */}
      <div className="billing-hero">
        <div className="pro-badge" style={{ display: 'inline-flex', margin: '0 auto var(--sp-4)', fontSize: 'var(--text-sm)', padding: '8px 20px' }}>
          <Crown size={16} /> Velmorth Plans
        </div>
        <h1>Pick your level of Japanese mastery</h1>
        <p>Free forever. Upgrade anytime. Cancel anytime.</p>
      </div>

      {/* Yearly toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 'var(--sp-6)' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: useYearly ? 'var(--text-3)' : 'var(--text)' }}>Monthly</span>
        <button
          id="toggle-yearly"
          onClick={() => setUseYearly(v => !v)}
          style={{
            width: 48, height: 26,
            borderRadius: 13,
            background: useYearly ? 'var(--primary)' : 'var(--surface-3)',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background .2s ease',
          }}
        >
          <span style={{
            position: 'absolute',
            top: 3, left: useYearly ? 25 : 3,
            width: 20, height: 20,
            borderRadius: '50%',
            background: 'white',
            transition: 'left .2s ease',
          }} />
        </button>
        <span style={{ fontSize: 'var(--text-sm)', color: useYearly ? 'var(--primary)' : 'var(--text-3)', fontWeight: useYearly ? 700 : 400 }}>
          Yearly <span style={{ fontSize: 11, background: 'rgba(22,163,74,.15)', color: 'var(--primary)', borderRadius: 6, padding: '2px 6px', marginLeft: 4 }}>Save 58%</span>
        </span>
      </div>

      {/* Error banner */}
      {error && (
        <div className="error-banner" style={{ maxWidth: 600, margin: '0 auto var(--sp-5)' }}>
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div
        className="plan-cards-grid"
        style={{ marginBottom: 'var(--sp-6)' }}
      >
        {PLANS.map(plan => {
          const isSelected = selectedId === plan.id;
          const isCurrent  = profile?.planStatus === plan.id || (plan.id === 'pro' && profile?.planStatus === 'yearly');
          const currentBadge = planLabel(profile?.planStatus || 'free');
          const showCurrentBadge = isCurrent && currentBadge;

          return (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              className={`plan-card${plan.highlight || isSelected ? ' highlighted' : ''}`}
              onClick={() => plan.id !== 'free' && setSelectedId(plan.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && plan.id !== 'free' && setSelectedId(plan.id)}
              style={{
                cursor: plan.id === 'free' ? 'default' : 'pointer',
                borderColor: isSelected ? plan.color : undefined,
                position: 'relative',
              }}
            >
              {/* Badges */}
              {plan.badge && (
                <div className="plan-best-badge" style={{ background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}44` }}>
                  {plan.badge}
                </div>
              )}
              {showCurrentBadge && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  background: `${currentBadge!.color}22`,
                  border: `1px solid ${currentBadge!.color}55`,
                  color: currentBadge!.color,
                  borderRadius: 8,
                  padding: '2px 8px',
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: '.04em',
                }}>
                  ✓ CURRENT
                </div>
              )}

              {/* Plan header */}
              <div style={{ fontSize: 28, marginBottom: 4 }}>{plan.emoji}</div>
              <div className="plan-name" style={{ color: plan.color }}>{plan.name}</div>
              <div className="plan-price">
                {useYearly && plan.id === 'pro' ? '₹999' : plan.price}
                <span>{useYearly && plan.id === 'pro' ? '/year' : plan.sub}</span>
              </div>
              {useYearly && plan.id === 'pro' && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--xp-gold)', fontWeight: 700, marginBottom: 'var(--sp-2)' }}>
                  ≈ ₹83/month · Save ₹1,389
                </div>
              )}

              {/* Features */}
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    {f.ok
                      ? <Check size={13} style={{ color: plan.color, flexShrink: 0 }} />
                      : <X size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                    }
                    <span style={{ color: f.ok ? 'var(--text)' : 'var(--text-3)' }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Select button — always rendered so all cards have equal height */}
              {plan.razorpayId ? (
                <button
                  id={`btn-select-${plan.id}`}
                  className={isSelected ? 'btn-primary' : 'btn-secondary'}
                  style={{ marginTop: 'auto', background: isSelected ? plan.color : undefined, border: isSelected ? 'none' : undefined }}
                  onClick={e => { e.stopPropagation(); setSelectedId(plan.id); }}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </button>
              ) : (
                /* Free plan: show "Current Plan" label to maintain equal card height */
                <button
                  id="btn-select-free"
                  className="btn-secondary"
                  disabled
                  style={{ marginTop: 'auto', opacity: 0.6, cursor: 'default' }}
                >
                  ✓ Free Plan
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 1-on-1 Coming Soon card */}
      <div
        id="plan-card-1on1"
        style={{
          border: '1px dashed rgba(255,255,255,.12)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--sp-5)',
          textAlign: 'center',
          color: 'var(--text-3)',
          marginBottom: 'var(--sp-6)',
          background: 'rgba(255,255,255,.02)',
          cursor: 'not-allowed',
          position: 'relative',
        }}
      >
        <span style={{ fontSize: 28 }}>🎓</span>
        <div style={{ fontWeight: 800, fontSize: 'var(--text-base)', margin: '6px 0 2px', color: 'var(--text-2)' }}>
          1-on-1 Tutoring Plan
        </div>
        <div style={{ fontSize: 'var(--text-xs)' }}>
          Live sessions with a Japanese teacher — Coming soon 🔜
        </div>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(251,191,36,.12)',
          border: '1px solid rgba(251,191,36,.3)',
          color: '#FBBF24',
          borderRadius: 8,
          padding: '2px 10px',
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: '.06em',
        }}>
          SOON
        </div>
      </div>

      {/* CTA Button */}
      {selectedId !== 'free' && (
        <div style={{ maxWidth: 480, margin: '0 auto var(--sp-6)', textAlign: 'center' }}>
          <button
            id="btn-checkout"
            className="btn-primary"
            onClick={handlePurchase}
            disabled={loading}
            style={{ fontSize: 'var(--text-base)', padding: '15px var(--sp-8)', gap: 'var(--sp-2)', width: '100%' }}
          >
            {loading ? (
              <><span className="loader-sm loader-inline" /> Processing...</>
            ) : (
              <>
                <Crown size={18} />
                Get {PLANS.find(p => p.id === selectedId)?.name} —{' '}
                {useYearly && selectedId === 'pro' ? '₹999/year' : `${PLANS.find(p => p.id === selectedId)?.price}/month`}
              </>
            )}
          </button>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 'var(--sp-2)' }}>
            Prices in INR. Your bank may apply conversion fees.
          </p>
        </div>
      )}

      {/* Trust badges */}
      <div className="trust-badges">
        <span className="trust-badge">🔒 Secured by Razorpay</span>
        <span className="trust-badge">💳 UPI, Cards, Net Banking</span>
        <span className="trust-badge">↩️ Cancel according to plan rules</span>
        <span className="trust-badge">✨ Instant activation</span>
        <span className="trust-badge">🛡️ Cancel anytime</span>
      </div>

      {/* Support — Instagram only */}
      <div style={{
        maxWidth: 480,
        margin: 'var(--sp-8) auto 0',
        textAlign: 'center',
        padding: 'var(--sp-5)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
      }}>
        <MessageCircle size={20} style={{ color: 'var(--primary)', marginBottom: 8 }} />
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: '0 0 4px' }}>
          Need help or have a question?
        </p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)', margin: 0 }}>
          DM us on Instagram{' '}
          <a
            href="https://instagram.com/Mannish_2323"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--primary)', fontWeight: 700 }}
          >
            @Mannish_2323
          </a>
          {' '}— for feedback, support, and billing questions.
        </p>
      </div>

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}
