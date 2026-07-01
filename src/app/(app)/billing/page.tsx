'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Sparkles, Check, CreditCard, Award, Flame, Brain, ShieldCheck, 
  HelpCircle, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface Plan {
  id: 'free' | 'starter' | 'plus' | 'pro';
  name: string;
  price: string;
  period: string;
  description: string;
  benefits: string[];
  popular?: boolean;
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
      benefits: [
        '5 AI Tutor messages / day',
        'Standard spaced repetition queue',
        'N5 vocabulary and grammar basic units',
        'Ad-supported layout'
      ]
    },
    {
      id: 'starter',
      name: 'Starter Plus',
      price: '$4.99',
      period: 'month',
      description: 'Accelerate speaking flow and clear learning blocks.',
      benefits: [
        '25 AI Tutor messages / day',
        'Priority spaced repetition algorithms',
        'Unlock all units up to N4 modules',
        'Completely ad-free learning layout',
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
      benefits: [
        '99+ AI Tutor custom requests / day',
        'Advanced accent speaking evaluations',
        'Unlock N5 to N1 complete JLPT curriculum',
        'Completely ad-free layout',
        'Unlimited review cards queue',
        'Exclusive mock tests access'
      ]
    }
  ];

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return;
    
    setError('');
    setSuccess('');
    setLoading(planId);

    try {
      // 1. Trigger Razorpay Order creation API
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId })
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed.');

      // Load Razorpay Checkout dynamically
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
            // Verify payment
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
              setSuccess('Subscription upgraded successfully! Restarting session...');
              setTimeout(() => window.location.reload(), 1500);
            } else {
              setError('Payment verification failed.');
            }
            setLoading(null);
          },
          prefill: {
            email: profile?.email || ''
          },
          theme: {
            color: '#7c3aed'
          }
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-extrabold tracking-widest text-sakura-dark uppercase px-3 py-1 bg-sakura-dark/15 rounded-full border border-sakura-dark/25 inline-block font-orbitron">
          VELMORTH SENSEI PREMIUM
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-orbitron">
          Upgrade Your Fluency Level
        </h1>
        <p className="text-xs md:text-sm text-purple-300/50 font-semibold max-w-md mx-auto leading-relaxed">
          Unlock unlimited vocabulary review decks, speaking pronunciation metrics, and N5 to N1 modules.
        </p>
      </div>

      {/* Notifications feedback */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2 max-w-xl mx-auto">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 items-stretch">
        {plans.map((plan) => {
          const isCurrentPlan = profile?.planId === plan.id;
          
          return (
            <div 
              key={plan.id}
              className={`glass-card p-6 md:p-8 rounded-[28px] flex flex-col justify-between space-y-6 relative border ${
                plan.popular 
                  ? 'border-brand-purple bg-brand-purple/[0.03] shadow-[0_0_20px_rgba(124,58,237,0.25)]' 
                  : 'border-white/5 hover:border-white/10'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-4 right-4 text-[9px] font-extrabold text-white bg-gradient-to-r from-brand-purple to-sakura-dark px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Popular
                </span>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-orbitron">{plan.name}</h3>
                  <p className="text-[10px] text-purple-300/40 font-semibold">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-extrabold text-white font-orbitron">{plan.price}</span>
                  <span className="text-xs font-bold text-purple-300/40">/ {plan.period}</span>
                </div>

                {/* Benefits checklist */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  {plan.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-purple-200/90 leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action trigger button */}
              <button
                disabled={isCurrentPlan || loading !== null}
                onClick={() => handleCheckout(plan.id)}
                className={`w-full btn btn-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  isCurrentPlan 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-not-allowed' 
                    : plan.popular
                    ? 'btn-primary shadow-md'
                    : 'btn-ghost'
                }`}
              >
                {loading === plan.id ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : isCurrentPlan ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Plan</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>{plan.id === 'free' ? 'Default Plan' : 'Subscribe Now'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
