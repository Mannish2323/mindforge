'use client';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Check, X, ChevronDown } from 'lucide-react';

const PLANS = [
  {
    id: 'free', name: 'Free', price: '₹0', sub: 'forever', color: '#9ca3af',
    features: [
      { text: '5 lessons/day', ok: true },
      { text: 'Basic SRS review', ok: true },
      { text: 'Hiragana & Katakana', ok: true },
      { text: 'Community access', ok: true },
      { text: 'AI Tutor', ok: false },
      { text: 'Unlimited lessons', ok: false },
    ],
  },
  {
    id: 'starter', name: 'Starter', price: '₹99', sub: '/month', color: '#60a5fa',
    features: [
      { text: '15 lessons/day', ok: true },
      { text: 'Advanced SRS review', ok: true },
      { text: '75 hearts max', ok: true },
      { text: '15 AI chats/day', ok: true },
      { text: 'JLPT N5 pack', ok: true },
      { text: 'Unlimited lessons', ok: false },
    ],
  },
  {
    id: 'plus', name: 'Plus', price: '₹149', sub: '/month', color: '#a78bfa', popular: true,
    features: [
      { text: '30 lessons/day', ok: true },
      { text: 'Full SRS + weak-spot', ok: true },
      { text: '90 hearts max', ok: true },
      { text: '30 AI chats/day', ok: true },
      { text: 'JLPT N5 + N4 packs', ok: true },
      { text: 'Speak mode basic', ok: true },
    ],
  },
  {
    id: 'pro', name: 'Pro', price: '₹199', sub: '/month', color: '#f59e0b',
    features: [
      { text: 'Unlimited lessons', ok: true },
      { text: 'No ads', ok: true },
      { text: 'Advanced SRS + all tools', ok: true },
      { text: '100 hearts max', ok: true },
      { text: '99 AI chats/day', ok: true },
      { text: 'JLPT N5→N1 all packs', ok: true },
    ],
  },
];

export default function BillingPage() {
  const { profile } = useAuth();
  const [yearly, setYearly] = useState(false);

  async function selectPlan(planId: string) {
    if (planId === 'free' || profile?.planId === planId) return;
    try {
      const res = await fetch('/api/billing/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId, billing: yearly ? 'yearly' : 'monthly' }),
      });
      const data = await res.json();
      if (data.order_id && typeof window !== 'undefined' && (window as any).Razorpay) {
        const rz = new (window as any).Razorpay({
          key: data.key_id,
          amount: data.amount,
          currency: 'INR',
          order_id: data.order_id,
          name: 'Velmorth',
          handler: async (resp: any) => {
            await fetch('/api/billing/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...resp, plan_id: planId }),
            });
            window.location.reload();
          },
        });
        rz.open();
      }
    } catch {}
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Pick your level of mastery</h1>
        <p className="text-purple-300/50 mt-2 text-sm">Free forever. Upgrade anytime. Cancel anytime.</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <span className={`text-sm font-semibold ${!yearly ? 'text-white' : 'text-purple-400/50'}`}>Monthly</span>
          <button
            onClick={() => setYearly(!yearly)}
            className={`w-12 h-6 rounded-full transition-all relative ${yearly ? 'bg-purple-600' : 'bg-purple-800/50'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${yearly ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-semibold ${yearly ? 'text-white' : 'text-purple-400/50'}`}>Yearly</span>
          {yearly && <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">Save 58%</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {PLANS.map(plan => {
          const active = profile?.planId === plan.id;
          const price = yearly && plan.id === 'pro' ? '₹999' : plan.price;
          const sub = yearly && plan.id === 'pro' ? '/year' : plan.sub;

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col bg-purple-950/40 border rounded-2xl p-5 transition-all ${
                active ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                : plan.popular ? 'border-purple-700/60'
                : 'border-purple-800/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-black px-3 py-1 rounded-full whitespace-nowrap">
                  ★ Most Popular
                </div>
              )}

              <div className="text-xs font-black tracking-widest mb-1" style={{ color: plan.color }}>
                {plan.name.toUpperCase()}
              </div>
              <div className="text-3xl font-black text-white">
                {price}
                <span className="text-sm font-normal text-purple-300/50 ml-0.5">{sub}</span>
              </div>
              {yearly && plan.id === 'pro' && (
                <div className="text-xs text-green-400 font-bold mt-0.5">≈ ₹83/month · Save ₹1,389</div>
              )}

              <ul className="space-y-2 my-5 flex-1">
                {plan.features.map(f => (
                  <li key={f.text} className="flex items-start gap-2 text-xs">
                    {f.ok
                      ? <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      : <X className="w-3.5 h-3.5 text-purple-700 flex-shrink-0 mt-0.5" />}
                    <span className={f.ok ? 'text-purple-100' : 'text-purple-600'}>{f.text}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => selectPlan(plan.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all mt-auto ${
                  active
                    ? 'bg-green-500/15 text-green-400 border border-green-500/30 cursor-default'
                    : plan.id === 'free'
                    ? 'bg-purple-950/60 text-purple-500/60 cursor-default'
                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20'
                }`}
              >
                {active ? '✓ Current Plan' : plan.id === 'free' ? '✓ Free Plan' : 'Select'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
