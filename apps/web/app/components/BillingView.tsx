'use client';

import React, { useState } from 'react';
import { Crown, Check, X, Shield, CreditCard, Clock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: { text: string; included: boolean }[];
  highlighted: boolean;
  badge?: string;
  color?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    highlighted: false,
    features: [
      { text: '5 lessons per day', included: true },
      { text: 'Basic SRS review', included: true },
      { text: 'Hiragana & Katakana', included: true },
      { text: '3 hearts per session', included: true },
      { text: 'Community access', included: true },
      { text: 'AI Tutor', included: false },
      { text: 'Unlimited lessons', included: false },
      { text: 'Offline mode', included: false },
      { text: 'JLPT mock tests', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro_monthly',
    name: 'Pro',
    price: '₹199',
    period: '/month',
    highlighted: true,
    features: [
      { text: 'Unlimited lessons', included: true },
      { text: 'Advanced SRS + weak spots', included: true },
      { text: 'Full script library (Kanji)', included: true },
      { text: 'Unlimited hearts', included: true },
      { text: 'AI Tutor — unlimited chats', included: true },
      { text: 'Speak Mode + pronunciation scores', included: true },
      { text: 'JLPT N5→N1 mock tests', included: true },
      { text: 'Offline mode', included: true },
      { text: 'Duels + social features', included: true },
      { text: 'Priority support', included: true },
    ],
  },
  {
    id: 'pro_yearly',
    name: 'Yearly',
    price: '₹999',
    period: '/year',
    highlighted: false,
    badge: '🏆 Best Value — Save 58%',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Save ₹1,389 vs monthly', included: true },
      { text: 'Early access to new features', included: true },
      { text: 'Velmorth Pro badge', included: true },
      { text: 'Annual progress report', included: true },
      { text: '1-on-1 study plan call', included: true },
      { text: 'Custom streak goals', included: true },
      { text: 'API access (advanced)', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Lifetime discount lock-in', included: true },
    ],
  },
];

const PAYMENT_HISTORY: { date: string; plan: string; amount: string; status: string }[] = [];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function BillingView() {
  const { session } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro_monthly');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setLoading(true);
    setError(null);
    try {
      // Create Razorpay order
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      // Open Razorpay checkout
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay({
          key: data.key,
          amount: data.amount,
          currency: data.currency,
          name: 'Velmorth Labs',
          description: `Learn with Velmorth — ${selectedPlan === 'pro_monthly' ? 'Pro Monthly' : 'Pro Yearly'}`,
          order_id: data.orderId,
          theme: { color: '#16A34A' },
          handler: async (response: any) => {
            // Verify payment
            const verifyRes = await fetch('/api/billing/verify', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token || ''}`
              },
              body: JSON.stringify({ ...response, planId: selectedPlan }),
            });
            if (verifyRes.ok) {
              setSuccess(true);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
            setLoading(false);
          },
          modal: {
            ondismiss: () => setLoading(false),
          },
        });
        rzp.open();
      } else {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="billing-page page-enter">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: 'var(--sp-4)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80,
            borderRadius: 'var(--radius-pill)',
            background: 'var(--primary-light)',
            border: '2px solid rgba(22,163,74,.4)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 40,
            animation: 'bounceIn 500ms ease',
          }}>
            🎉
          </div>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900 }}>You&apos;re now Pro!</h2>
          <p style={{ color: 'var(--text-2)', maxWidth: 360 }}>
            Welcome to Velmorth Pro. Enjoy unlimited lessons, AI Tutor, JLPT mock tests and more.
          </p>
          <div className="pro-badge" style={{ fontSize: 'var(--text-base)', padding: '10px 24px' }}>
            <Crown size={18} /> PRO Active
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-page page-enter">
      {/* Hero */}
      <div className="billing-hero">
        <div className="pro-badge" style={{ display: 'inline-flex', margin: '0 auto var(--sp-4)', fontSize: 'var(--text-sm)', padding: '8px 20px' }}>
          <Crown size={16} /> Velmorth Pro
        </div>
        <h1>Supercharge your Japanese</h1>
        <p>Unlock every feature and reach fluency 3× faster</p>
      </div>

      {error && (
        <div className="error-banner" style={{ marginBottom: 'var(--sp-6)', maxWidth: 600, margin: '0 auto var(--sp-6)' }}>
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="plan-cards-grid" style={{ marginBottom: 'var(--sp-8)' }}>
        {PLANS.map(plan => (
          <div
            key={plan.id}
            className={`plan-card${plan.highlighted ? ' highlighted' : ''}${selectedPlan === plan.id ? ' highlighted' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
            role="radio"
            aria-checked={selectedPlan === plan.id}
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setSelectedPlan(plan.id)}
          >
            {plan.badge && <div className="plan-best-badge">{plan.badge}</div>}
            <div className="plan-name">{plan.name}</div>
            <div className="plan-price">
              {plan.price}
              <span>{plan.period}</span>
            </div>
            {plan.id === 'pro_yearly' && (
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--xp-gold)', marginBottom: 'var(--sp-2)', fontWeight: 700 }}>
                ≈ ₹83/month
              </div>
            )}
            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i}>
                  {f.included
                    ? <Check size={14} className="feature-check" style={{ color: 'var(--primary)' }} />
                    : <X size={14} className="feature-x" style={{ color: 'var(--text-3)' }} />
                  }
                  <span style={{ color: f.included ? 'var(--text)' : 'var(--text-3)' }}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
            {plan.id !== 'free' && (
              <button
                className={selectedPlan === plan.id ? 'btn-primary' : 'btn-secondary'}
                style={{ marginTop: 'var(--sp-3)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPlan(plan.id);
                }}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      {selectedPlan !== 'free' && (
        <div style={{ maxWidth: 480, margin: '0 auto var(--sp-8)', textAlign: 'center' }}>
          <button
            className="btn-primary"
            onClick={handleUpgrade}
            disabled={loading}
            style={{ fontSize: 'var(--text-lg)', padding: '16px var(--sp-8)', gap: 'var(--sp-2)' }}
            id="btn-checkout"
          >
            {loading ? (
              <><span className="loader-sm loader-inline" /> Processing...</>
            ) : (
              <><Crown size={20} /> Upgrade to {selectedPlan === 'pro_monthly' ? 'Pro — ₹199/mo' : 'Yearly — ₹999/yr'}</>
            )}
          </button>
        </div>
      )}

      {/* Trust badges */}
      <div className="trust-badges">
        <span className="trust-badge">🔒 Secured by Razorpay</span>
        <span className="trust-badge">💳 UPI, Cards, Net Banking</span>
        <span className="trust-badge">↩️ 7-day refund policy</span>
        <span className="trust-badge">✨ Instant activation</span>
        <span className="trust-badge">🛡️ Cancel anytime</span>
      </div>

      {/* Payment history */}
      <div style={{ marginTop: 'var(--sp-10)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, marginBottom: 'var(--sp-4)' }}>Payment History</h2>
        {PAYMENT_HISTORY.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--sp-8)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', minHeight: 'auto' }}>
            <div className="empty-icon">📋</div>
            <h3>No payments yet</h3>
            <p>Your payment history will appear here after your first purchase.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            <table className="payment-history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {PAYMENT_HISTORY.map((row, i) => (
                  <tr key={i}>
                    <td>{row.date}</td>
                    <td>{row.plan}</td>
                    <td>{row.amount}</td>
                    <td style={{ color: row.status === 'paid' ? 'var(--success)' : 'var(--error)' }}>
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}
