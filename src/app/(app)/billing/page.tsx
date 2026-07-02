'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Sparkles, Check, CreditCard, Award, Flame, Brain, ShieldCheck,
  Crown, Zap, ArrowRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface Plan {
  id: 'free' | 'starter' | 'plus' | 'pro';
  name: string;
  price: string;
  period: string;
  description: string;
  benefits: string[];
  popular?: boolean;
  icon: React.ComponentType<any>;
  gradient: string;
}

export default function BillingPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free Basic',
      price: '$0',
      period: 'forever',
      description: 'Kickstart your Japanese journey with essential tools.',
      icon: Star,
      gradient: 'from-gray-500/20 to-gray-400/5',
      benefits: [
        '5 AI Tutor messages / day',
        'Standard spaced repetition queue',
        'N5 vocabulary and grammar basics',
        'Ad-supported layout'
      ]
    },
    {
      id: 'starter',
      name: 'Starter Plus',
      price: '$4.99',
      period: 'month',
      description: 'Accelerate speaking flow and clear learning blocks.',
      icon: Zap,
      gradient: 'from-neon-purple/20 to-neon-pink/10',
      benefits: [
        '25 AI Tutor messages / day',
        'Priority spaced repetition',
        'Unlock all units up to N4',
        'Completely ad-free layout',
        '25 hearts pool limit'
      ],
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro Sensei',
      price: '$12.99',
      period: 'month',
      description: 'Master complete fluency with unlimited tools and AI.',
      icon: Crown,
      gradient: 'from-amber-500/15 to-amber-400/5',
      benefits: [
        '99+ AI Tutor custom requests / day',
        'Advanced accent evaluations',
        'Unlock N5 to N1 complete curriculum',
        'Completely ad-free layout',
        'Unlimited review cards queue',
        'Exclusive mock tests access'
      ]
    }
  ];

  // ─── Razorpay Checkout (preserved from existing) ───
  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return;

    setError('');
    setSuccess('');
    setLoading(planId);

    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed.');

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockkey',
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Learning Velmorth',
          description: `Subscription: ${planId.toUpperCase()}`,
          order_id: orderData.id,
          handler: async (response: any) => {
            setLoading(planId);
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId
              })
            });

            if (verifyRes.ok) {
              setSuccess('Subscription upgraded successfully! Refreshing...');
              setTimeout(() => window.location.reload(), 1500);
            } else {
              setError('Payment verification failed.');
            }
            setLoading(null);
          },
          prefill: { email: profile?.email || '' },
          theme: { color: '#6D3CFF' }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    } catch (err: any) {
      setError(err?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const currentPlan = profile?.planId || 'free';

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-5xl mx-auto">
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
        <p className="text-sm text-purple-300/45 max-w-md mx-auto leading-relaxed">
          Unlock unlimited vocabulary, AI-powered conversations, and the complete N5 to N1 learning path.
        </p>
      </motion.div>

      {/* Messages */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 font-semibold text-center"
        >{success}</motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-400 font-semibold text-center"
        >{error}</motion.div>
      )}

      {/* Plan Cards */}
      <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-stretch">
        {plans.map((plan) => {
          const isActive = currentPlan === plan.id;
          const Icon = plan.icon;
          return (
            <motion.div key={plan.id} variants={item}>
              <Card
                variant={plan.popular ? 'neon' : 'glass'}
                padding="none"
                className={`flex flex-col h-full relative overflow-hidden ${plan.popular ? 'ring-1 ring-neon-purple/30' : ''}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-neon-purple to-neon-pink text-[9px] font-extrabold text-white uppercase tracking-wider rounded-bl-xl">
                    Most Popular
                  </div>
                )}

                {/* Gradient bg */}
                <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} pointer-events-none`} />

                <div className="relative z-10 p-6 md:p-7 flex flex-col h-full">
                  {/* Plan icon & name */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${plan.popular ? 'bg-neon-purple/15' : 'bg-white/[0.04]'}`}>
                        <Icon className={`w-5 h-5 ${plan.popular ? 'text-neon-pink' : 'text-purple-300/50'}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <p className="text-[10px] text-purple-300/35">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-white font-orbitron">{plan.price}</span>
                      {plan.period !== 'forever' && (
                        <span className="text-xs text-purple-300/35 font-semibold">/ {plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Benefits */}
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-neon-pink' : 'text-emerald-400/60'}`} />
                        <span className="text-purple-200/60">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {isActive ? (
                    <div className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      Current Plan
                    </div>
                  ) : plan.id === 'free' ? (
                    <div className="py-3.5 rounded-xl text-center text-xs font-semibold text-purple-300/30 border border-white/[0.04]">
                      Free Forever
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCheckout(plan.id)}
                      loading={loading === plan.id}
                      variant={plan.popular ? 'neon' : 'primary'}
                      className={`w-full ${plan.popular ? 'btn btn-neon' : 'btn btn-primary'}`}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Upgrade Now
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FAQ */}
      <motion.div variants={item} className="text-center space-y-4 pt-4">
        <p className="text-xs text-purple-300/25 max-w-md mx-auto">
          All plans include a 7-day free trial. Cancel anytime. Payments secured by Razorpay.
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-purple-300/20 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Secure Payment</span>
          <span>•</span>
          <span>Cancel Anytime</span>
          <span>•</span>
          <span>7-Day Trial</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
