'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Crown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { PlanToggle } from '../../components/billing/PlanToggle';
import { PlanCard } from '../../components/billing/PlanCard';

interface PlanDef {
  id: string;
  name: string;
  price: string;
  yearlyPrice: string;
  sub: string;
  badge?: string;
  highlight?: boolean;
  color: string;
  emoji: string;
  features: { text: string; ok: boolean }[];
  razorpayId?: string;
}

const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'FREE',
    price: '₹0',
    yearlyPrice: '₹0',
    sub: 'forever',
    color: '#64748B',
    emoji: '🌱',
    features: [
      { text: '5 lessons/day', ok: true },
      { text: 'Basic SRS review', ok: true },
      { text: 'Hiragana & Katakana', ok: true },
      { text: '50 hearts max', ok: true },
      { text: 'Ads between sections', ok: true },
      { text: 'AI Tutor', ok: false },
    ],
  },
  {
    id: 'starter',
    name: 'STARTER',
    price: '₹99',
    yearlyPrice: '₹499',
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
      { text: 'JLPT N5 pack access', ok: true },
    ],
  },
  {
    id: 'plus',
    name: 'PLUS',
    price: '₹149',
    yearlyPrice: '₹799',
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
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '₹199',
    yearlyPrice: '₹999',
    sub: '/month',
    badge: '👑 Recommended',
    highlight: true,
    color: '#eab308',
    emoji: '👑',
    razorpayId: 'pro',
    features: [
      { text: 'Unlimited lessons', ok: true },
      { text: 'No ads', ok: true },
      { text: 'Advanced SRS + all tools', ok: true },
      { text: '100 hearts max', ok: true },
      { text: '99 AI chats/day', ok: true },
      { text: 'Speak mode — full access', ok: true },
    ],
  },
];

export default function BillingPage() {
  const { session, profile } = useAuth();
  const [selectedId, setSelectedId] = useState<string>('pro');
  const [useYearly, setUseYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePlanId = useYearly ? `${selectedId}_yearly` : selectedId;

  // Dynamically load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

      if (typeof window === 'undefined' || !(window as any).Razorpay) {
        throw new Error('Payment gateway not loaded. Please refresh and try again.');
      }

      const planObj = PLANS.find(p => p.id === selectedId);

      const rzp = new (window as any).Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: 'Velmorth Labs',
        description: data.label || `Learn with Velmorth — ${selectedId}`,
        order_id: data.orderId,
        prefill: { email: profile?.email || '' },
        theme: { color: planObj?.color || '#eab308' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/billing/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
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

  if (success) {
    return (
      <AppShell>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '70vh', gap: '20px', textAlign: 'center', padding: '16px'
        }}>
          <span style={{ fontSize: '64px' }}>🎉</span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>
            Welcome to {PLANS.find(p => p.id === selectedId)?.name || 'PRO'}!
          </h2>
          <p style={{ color: 'var(--text-secondary, #b3b3b9)', maxWidth: 360 }}>
            Your plan is now active. Enjoy unlimited Japanese learning! 頑張ってください！
          </p>
          <div style={{
            background: 'linear-gradient(135deg, #ffc107, #ff9800)',
            color: '#000', padding: '10px 24px', borderRadius: '20px', fontWeight: 800, fontSize: '15px'
          }}>
            PRO Active
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)' }}>
            Questions? DM us on Instagram{' '}
            <a href="https://instagram.com/Mannish_2323" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary, #ff9800)', fontWeight: 700 }}>
              @Mannish_2323
            </a>
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
        
        {/* Yellow pill at top */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{
            background: '#eab308',
            color: '#000',
            fontWeight: 800,
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'inline-block',
          }}>
            Velmorth Plans
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginTop: '12px', color: 'var(--text-primary, #fff)', lineHeight: 1.2 }}>
            Pick your level of Japanese mastery
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px' }}>
            Free forever. Upgrade anytime. Cancel anytime.
          </p>
        </div>

        {/* Monthly/Yearly toggle */}
        <PlanToggle useYearly={useYearly} onToggle={setUseYearly} />

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', padding: '12px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Stacked Plan Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {PLANS.map((plan, idx) => {
            const isSelected = selectedId === plan.id;
            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                index={idx}
                isSelected={isSelected}
                useYearly={useYearly}
                onSelect={() => plan.id !== 'free' && setSelectedId(plan.id)}
              />
            );
          })}
        </div>

        {/* Checkout CTA */}
        {selectedId !== 'free' && (
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handlePurchase}
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ffc107, #ff9800)',
                color: '#000',
                border: 'none',
                padding: '16px',
                borderRadius: '16px',
                fontWeight: 900,
                fontSize: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Crown size={16} />
              {loading ? 'Processing...' : `Get ${PLANS.find(p => p.id === selectedId)?.name} now`}
            </motion.button>
          </div>
        )}

        {/* Secure payments trust row */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center',
          borderTop: '1px solid var(--border-strong, #2d2d34)', paddingTop: '16px',
          textAlign: 'center', fontSize: '11px', color: 'var(--text-secondary, #b3b3b9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--success, #4caf50)' }}>
            <ShieldCheck size={14} />
            <span>Secure payment · Instant activation</span>
          </div>
          <span>💳 Razorpay gateway supports UPI, Net Banking and Cards.</span>
        </div>
      </div>
    </AppShell>
  );
}
