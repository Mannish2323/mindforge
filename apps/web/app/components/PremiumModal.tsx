'use client';

import React, { useState } from 'react';
import { Crown, Zap, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface PremiumModalProps {
  onClose: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    amount: 19900,          // ₹199 in paise
    priceDisplay: '₹199',
    period: '/month',
    badge: null,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    amount: 99900,          // ₹999 in paise
    priceDisplay: '₹999',
    period: '/year',
    badge: '🔥 Save 58%',
  },
];

const PERKS = [
  'Unlimited AI conversation sessions',
  'Full Gemini-powered tutor access',
  'JLPT N5 → N1 all lesson packs',
  'Offline mode & downloadable content',
  'Priority support & early features',
  'Custom streak goals & reminders',
];

export function PremiumModal({ onClose }: PremiumModalProps) {
  const { user } = useAuth();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /** Dynamically load Razorpay checkout.js script */
  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setError(null);
    setLoading(true);

    try {
      // 1️⃣ Load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay checkout. Please check your connection.');
      }

      // 2️⃣ Create order on the backend (KEY_SECRET stays server-side)
      const selectedPlan = PLANS.find(p => p.id === plan)!;
      const orderRes = await fetch('/api/create-order/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedPlan.amount,
          currency: 'INR',
          receipt: `velmorth_${plan}_${user?.id?.slice(0, 8) || 'guest'}_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || `Order creation failed (${orderRes.status})`);
      }

      const { order_id, amount, currency } = await orderRes.json();

      // 3️⃣ Open Razorpay Standard Checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id,
        name: 'Velmorth',
        description: `Premium ${selectedPlan.label} Plan — Learn Japanese`,
        image: '/icon-192.png',
        prefill: {
          email: user?.email || '',
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner',
        },
        theme: { color: '#16a34a' },

        // 4️⃣ Success handler — verify signature server-side
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment signature on the backend
            const verifyRes = await fetch('/api/verify-payment/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            // ✅ Verified — update Firestore premium status
            if (user?.id) {
              await updateDoc(doc(db, 'users', user.id), {
                isPremium: true,
                premiumPlan: plan,
                premiumSince: new Date().toISOString(),
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                updatedAt: serverTimestamp(),
              });
            }

            setSuccess(true);
          } catch (err: any) {
            setError(err.message || 'Payment verification failed. Contact support.');
          } finally {
            setLoading(false);
          }
        },

        modal: {
          // User cancelled / dismissed the modal
          ondismiss: () => {
            setLoading(false);
            setError(null); // no error — user simply closed
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment failure event
      rzp.on('payment.failed', (response: any) => {
        console.error('[Razorpay] Payment failed:', response.error);
        setError(
          response.error?.description ||
          response.error?.reason ||
          'Payment failed. Please try a different payment method.'
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error('[Razorpay] handlePayment error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-card"
          onClick={e => e.stopPropagation()}
          style={{ maxWidth: 380, textAlign: 'center', padding: 'var(--space-8)' }}
        >
          <div style={{ fontSize: 64, marginBottom: 'var(--space-4)' }}>🎉</div>
          <h2 style={{ fontWeight: 900, marginBottom: 'var(--space-2)' }}>You're Premium!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
            Welcome to Velmorth Premium. All features are now unlocked.
          </p>
          <button
            id="btn-premium-success-close"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            Start Learning 🚀
          </button>
        </div>
      </div>
    );
  }

  const selectedPlan = PLANS.find(p => p.id === plan)!;

  // ── Payment modal ───────────────────────────────────────────────────────
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 420, padding: 'var(--space-6)', position: 'relative' }}
      >
        {/* Close */}
        <button
          id="btn-premium-modal-close"
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{
            display: 'inline-flex',
            background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
            borderRadius: '50%',
            padding: 12,
            marginBottom: 'var(--space-3)',
          }}>
            <Crown size={28} color="#fff" />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 'var(--text-xl)', marginBottom: 4 }}>
            Upgrade to Premium
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Unlock the full Velmorth experience
          </p>
        </div>

        {/* Plan selector */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          {PLANS.map(p => (
            <button
              key={p.id}
              id={`btn-plan-${p.id}`}
              onClick={() => setPlan(p.id as 'monthly' | 'yearly')}
              style={{
                flex: 1,
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-lg)',
                border: `2px solid ${plan === p.id ? '#16a34a' : 'var(--border)'}`,
                background: plan === p.id ? 'rgba(22,163,74,0.08)' : 'var(--bg-surface)',
                cursor: 'pointer',
                position: 'relative',
                textAlign: 'center',
                transition: 'border-color 0.2s, background 0.2s',
              }}
            >
              {p.badge && (
                <div style={{
                  position: 'absolute', top: -11, left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--amber)', color: '#000',
                  fontWeight: 700, fontSize: 10,
                  padding: '2px 10px',
                  borderRadius: 'var(--radius-pill)',
                  whiteSpace: 'nowrap',
                }}>
                  {p.badge}
                </div>
              )}
              <div style={{ fontWeight: 900, fontSize: 'var(--text-lg)' }}>{p.priceDisplay}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{p.period}</div>
            </button>
          ))}
        </div>

        {/* Perks list */}
        <ul style={{
          listStyle: 'none', padding: 0,
          margin: '0 0 var(--space-5)',
          display: 'flex', flexDirection: 'column',
          gap: 'var(--space-2)',
        }}>
          {PERKS.map(perk => (
            <li key={perk} style={{
              display: 'flex', alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)',
            }}>
              <Check size={14} color="#16a34a" style={{ flexShrink: 0 }} />
              {perk}
            </li>
          ))}
        </ul>

        {/* Error banner */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid var(--red)',
            color: '#f87171',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            marginBottom: 'var(--space-4)',
          }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* CTA — Pay button */}
        <button
          id="btn-razorpay-checkout"
          onClick={handlePayment}
          disabled={loading}
          style={{
            width: '100%',
            padding: 'var(--space-4)',
            background: loading
              ? 'rgba(22,163,74,0.5)'
              : 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontWeight: 800,
            fontSize: 'var(--text-base)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            transition: 'background 0.2s',
          }}
        >
          <Zap size={16} />
          {loading
            ? 'Opening Razorpay...'
            : `Pay ${selectedPlan.priceDisplay} — Upgrade Now`}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 'var(--space-3)',
        }}>
          Secured by Razorpay · Test mode active · Cancel anytime
        </p>
      </div>
    </div>
  );
}
