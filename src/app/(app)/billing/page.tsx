'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { PLANS, PlanId } from '@/lib/plans';
import { createBrowserClient } from '@supabase/ssr';
import {
  Check, ShieldCheck, Crown, ArrowRight, Sparkles, X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

export default function BillingPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError]   = useState('');
  const [success, setSuccess] = useState('');

  // ─── Razorpay Checkout ────────────────────────────────────────────────────
  const handleCheckout = async (planId: PlanId) => {
    if (planId === 'free') return;

    setError('');
    setSuccess('');
    setLoading(planId);

    try {
      // 1. Create Razorpay order via the correct billing API route
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed.');

      // 2. Load Razorpay checkout script
      const loadScript = () =>
        new Promise<void>((resolve, reject) => {
          if ((window as any).Razorpay) { resolve(); return; }
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload  = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });

      await loadScript();

      // 3. Open checkout — use key + orderId returned by the API
      const options = {
        key:         orderData.key,                   // API returns the Razorpay key
        amount:      orderData.amount,                // in paise, as returned by Razorpay
        currency:    orderData.currency || 'INR',
        name:        'Velmorth',
        description: `${orderData.planName} — ${orderData.periodLabel}`,
        order_id:    orderData.orderId,               // API returns orderId (not id)
        image:       '/velmorth_logo.png',
        prefill:     { email: profile?.email || '' },
        theme:       { color: '#6D3CFF' },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setLoading(planId);

          // Get current session token to authenticate the verify call
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
            setSuccess('🎉 Subscription activated! Refreshing your account...');
            setTimeout(() => window.location.reload(), 1800);
          } else {
            const errData = await verifyRes.json();
            setError(errData.error || 'Payment verification failed. Contact support.');
          }
          setLoading(null);
        },

        modal: {
          ondismiss: () => setLoading(null),
        },
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

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } } };

  // Show only the four purchasable tiers on this page
  const displayPlanIds: PlanId[] = ['free', 'starter', 'plus', 'pro', 'ai_max'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-6xl mx-auto">

      {/* Header */}
      <motion.div variants={item} className="text-center space-y-4">
        <Badge variant="neon" size="md" icon={<Crown className="w-3.5 h-3.5 text-amber-400" />} glow>
          VELMORTH PREMIUM
        </Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Upgrade Your{' '}
          <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta bg-clip-text text-transparent">
            Fluency Level
          </span>
        </h1>
        <p className="text-sm text-purple-300/45 max-w-lg mx-auto leading-relaxed">
          Unlock unlimited vocabulary, AI-powered conversations, and the complete N5→N1 learning path.
          All prices in INR — powered by Razorpay.
        </p>
      </motion.div>

      {/* Alerts */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-semibold"
        >
          <Sparkles className="w-4 h-4 flex-shrink-0" />{success}
        </motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-semibold"
        >
          <X className="w-4 h-4 flex-shrink-0" />{error}
        </motion.div>
      )}

      {/* Plan Cards */}
      <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {displayPlanIds.map((planId) => {
          const plan    = PLANS[planId];
          const isActive = currentPlan === planId;

          return (
            <motion.div key={planId} variants={item}>
              <Card
                variant={plan.popular ? 'neon' : 'glass'}
                padding="none"
                className={`flex flex-col h-full relative overflow-hidden ${plan.popular ? 'ring-1 ring-neon-purple/30 shadow-[0_0_30px_rgba(109,60,255,0.12)]' : ''}`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-neon-purple to-neon-pink text-[9px] font-extrabold text-white uppercase tracking-wider rounded-bl-xl z-10">
                    {plan.badge}
                  </div>
                )}

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${plan.gradFrom}55, ${plan.gradTo}22)` }}
                />

                <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">

                  {/* Plan header */}
                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{plan.emoji}</span>
                      <div>
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <p className="text-[10px] text-purple-300/40">{plan.subtitle}</p>
                      </div>
                    </div>

                    {/* Price — INR from plans config */}
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

                    {/* AI chats & limits chips */}
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-[10px] text-purple-300/50 font-semibold">
                        {plan.aiChatsPerDay === 500 ? '500 AI chats/day' : `${plan.aiChatsPerDay} AI chats/day`}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-[10px] text-purple-300/50 font-semibold">
                        {plan.lessonsPerDay === null ? 'Unlimited lessons' : `${plan.lessonsPerDay} lessons/day`}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.slice(0, 7).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400/70" />
                        <span className="text-purple-200/55">{f}</span>
                      </li>
                    ))}
                    {plan.features.length > 7 && (
                      <li className="text-[10px] text-purple-300/30 pl-5.5">
                        +{plan.features.length - 7} more features
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  {isActive ? (
                    <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" /> Current Plan
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
                      className={`w-full ${plan.popular ? 'btn btn-neon' : 'btn btn-primary'}`}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Upgrade · ₹{plan.price}{plan.periodLabel}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer note */}
      <motion.div variants={item} className="text-center space-y-3 pt-2">
        <p className="text-xs text-purple-300/25 max-w-md mx-auto">
          Payments secured by Razorpay. Cancel anytime from your profile settings.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-purple-300/20 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure Payment</span>
          <span>•</span>
          <span>Cancel Anytime</span>
          <span>•</span>
          <span>INR Pricing</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
