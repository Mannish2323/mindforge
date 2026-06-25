'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Check, X, Sparkles, Crown, Zap, Star, ArrowRight, Shield,
  Clock, Infinity, MessageSquare, Mic, Pencil, Brain, BookOpen,
  ChevronDown, ChevronUp, Headphones, Trophy
} from 'lucide-react';

// ─── Plan data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    subtitle: 'Get started for free',
    price: 0,
    yearlyPrice: 0,
    color: '#9ca3af',
    gradientFrom: '#374151',
    gradientTo: '#1f2937',
    icon: <Star className="w-5 h-5" />,
    emoji: '🌱',
    popular: false,
    features: [
      { text: '5 lessons per day', ok: true },
      { text: 'Basic SRS review', ok: true },
      { text: 'Hiragana & Katakana', ok: true },
      { text: 'Community access', ok: true },
      { text: '3 free writing kanji', ok: true },
      { text: 'Basic speaking practice', ok: true },
      { text: 'AI Tutor', ok: false },
      { text: 'Unlimited lessons', ok: false },
      { text: 'Advanced kanji (N4-N1)', ok: false },
      { text: 'All speaking scenarios', ok: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'For serious beginners',
    price: 99,
    yearlyPrice: 499,
    color: '#60a5fa',
    gradientFrom: '#1e3a5f',
    gradientTo: '#1e2d5f',
    icon: <Zap className="w-5 h-5" />,
    emoji: '⚡',
    popular: false,
    features: [
      { text: '15 lessons per day', ok: true },
      { text: 'Advanced SRS review', ok: true },
      { text: '75 hearts max', ok: true },
      { text: '15 AI chats per day', ok: true },
      { text: 'JLPT N5 kanji pack', ok: true },
      { text: 'Basic speaking scenarios', ok: true },
      { text: 'Unlimited lessons', ok: false },
      { text: 'Full writing AI correction', ok: false },
      { text: 'N4-N1 content', ok: false },
      { text: 'Priority support', ok: false },
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    subtitle: 'Most popular choice',
    price: 149,
    yearlyPrice: 799,
    color: '#a78bfa',
    gradientFrom: '#3b1f6b',
    gradientTo: '#4a1f5c',
    icon: <Star className="w-5 h-5" />,
    emoji: '⭐',
    popular: true,
    features: [
      { text: '30 lessons per day', ok: true },
      { text: 'Full SRS + weak-spot mode', ok: true },
      { text: '90 hearts max', ok: true },
      { text: '30 AI chats per day', ok: true },
      { text: 'JLPT N5 + N4 packs', ok: true },
      { text: 'Speaking mode + AI scoring', ok: true },
      { text: 'Writing practice (N5-N4)', ok: true },
      { text: 'Study plan generator', ok: true },
      { text: 'Unlimited lessons', ok: false },
      { text: 'N3-N1 content', ok: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Unlimited everything',
    price: 199,
    yearlyPrice: 999,
    color: '#f59e0b',
    gradientFrom: '#5c3a0a',
    gradientTo: '#4a2c0a',
    icon: <Crown className="w-5 h-5" />,
    emoji: '👑',
    popular: false,
    badge: 'Best Value',
    features: [
      { text: 'Unlimited lessons', ok: true },
      { text: 'No ads ever', ok: true },
      { text: 'All SRS + tools', ok: true },
      { text: '100 hearts max', ok: true },
      { text: '99 AI chats per day', ok: true },
      { text: 'JLPT N5→N1 all packs', ok: true },
      { text: 'Full writing AI correction', ok: true },
      { text: 'All 50+ speaking scenarios', ok: true },
      { text: 'Priority support', ok: true },
      { text: 'Early access to features', ok: true },
    ],
  },
];

// ─── Feature comparison table ─────────────────────────────────────────────────
const COMPARISON = [
  { category: 'Lessons', features: [
    { name: 'Lessons per day', values: ['5', '15', '30', '∞'] },
    { name: 'JLPT N5 content', values: [true, true, true, true] },
    { name: 'JLPT N4 content', values: [false, true, true, true] },
    { name: 'JLPT N3-N1 content', values: [false, false, false, true] },
    { name: 'Ads-free experience', values: [false, false, false, true] },
  ]},
  { category: 'Writing Practice', features: [
    { name: 'Basic kanji (3 free)', values: [true, false, false, false] },
    { name: 'N5 kanji practice', values: [false, true, true, true] },
    { name: 'N4 kanji practice', values: [false, false, true, true] },
    { name: 'AI stroke correction', values: [false, false, true, true] },
    { name: 'Full N5→N1 kanji', values: [false, false, false, true] },
  ]},
  { category: 'Speaking', features: [
    { name: 'Basic speaking practice', values: [true, true, true, true] },
    { name: 'AI pronunciation scoring', values: [false, false, true, true] },
    { name: 'All 50+ scenarios', values: [false, false, false, true] },
    { name: 'AI conversation partner', values: [false, false, true, true] },
  ]},
  { category: 'AI Tutor', features: [
    { name: 'AI chats per day', values: ['—', '15', '30', '99'] },
    { name: 'Grammar explainer', values: [false, true, true, true] },
    { name: 'Quiz generator', values: [false, false, true, true] },
    { name: 'Personalized study plans', values: [false, false, true, true] },
  ]},
];

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes! Cancel anytime from your profile settings. No questions asked. If you cancel, your plan remains active until the end of the billing period.' },
  { q: 'Is there a free trial?', a: 'We offer a permanent free tier so you can experience the app before upgrading. Paid plans also come with a 7-day money-back guarantee.' },
  { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade anytime. Upgrades take effect immediately, and you\'ll be charged a prorated amount.' },
  { q: 'How does yearly billing work?', a: 'Yearly plans are billed once a year and offer significant savings compared to monthly billing — up to 58% off!' },
  { q: 'Is my payment secure?', a: 'Payments are processed securely via Razorpay. We never store your card details.' },
];

export default function BillingPage() {
  const { profile } = useAuth();
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [animPrices, setAnimPrices] = useState(false);

  useEffect(() => { setAnimPrices(false); const t = setTimeout(() => setAnimPrices(true), 50); return () => clearTimeout(t); }, [yearly]);

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
          description: `${planId.charAt(0).toUpperCase() + planId.slice(1)} Plan`,
          theme: { color: '#7c3aed' },
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
    } catch { }
  }

  const getDisplayPrice = (plan: typeof PLANS[0]) => {
    if (plan.price === 0) return { amount: '₹0', sub: 'forever' };
    if (yearly) return { amount: `₹${plan.yearlyPrice}`, sub: '/year', monthly: `₹${Math.round(plan.yearlyPrice / 12)}/mo` };
    return { amount: `₹${plan.price}`, sub: '/month' };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 animate-fade-up">

      {/* Page header */}
      <div className="text-center space-y-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-2"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.35)', color: '#a78bfa' }}
        >
          <Sparkles className="w-3.5 h-3.5" /> Choose Your Path to Fluency
        </div>
        <h1 className="text-4xl font-black text-white leading-tight">
          Invest in Your<br />
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Japanese Journey
          </span>
        </h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(200,196,255,0.65)' }}>
          Free forever. Upgrade anytime. Cancel anytime. Join 12,000+ learners mastering Japanese with Velmorth.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <span className={`text-sm font-bold transition-colors ${!yearly ? 'text-white' : 'text-purple-400/50'}`}>Monthly</span>
          <button
            onClick={() => setYearly(y => !y)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${yearly ? 'bg-purple-600' : 'bg-purple-900/60'}`}
            style={{ border: '1px solid rgba(139,92,246,0.4)' }}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 ${yearly ? 'translate-x-7' : ''}`} />
          </button>
          <span className={`text-sm font-bold transition-colors ${yearly ? 'text-white' : 'text-purple-400/50'}`}>Yearly</span>
          {yearly && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-black animate-fade-up"
              style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.35)', color: '#4ade80' }}
            >
              Save up to 58%
            </span>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        {PLANS.map(plan => {
          const active = profile?.planId === plan.id;
          const priceInfo = getDisplayPrice(plan);
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02] ${plan.popular ? 'shadow-2xl' : ''}`}
              style={{
                background: plan.popular
                  ? `linear-gradient(145deg, ${plan.gradientFrom}cc, ${plan.gradientTo}cc)`
                  : `linear-gradient(145deg, rgba(18,14,36,0.8), rgba(14,10,30,0.8))`,
                border: active
                  ? `2px solid ${plan.color}`
                  : plan.popular
                  ? `1px solid ${plan.color}60`
                  : '1px solid rgba(139,92,246,0.2)',
                boxShadow: plan.popular ? `0 0 40px ${plan.color}20` : 'none',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black text-white whitespace-nowrap"
                  style={{ background: `linear-gradient(135deg, #7c3aed, #db2777)` }}
                >
                  ★ Most Popular
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black whitespace-nowrap"
                  style={{ background: `${plan.color}25`, border: `1px solid ${plan.color}50`, color: plan.color }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-4">
                <div
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                  style={{ background: `${plan.color}20`, color: plan.color }}
                >
                  {plan.icon}
                </div>
                <div className="text-xs font-black tracking-widest mb-0.5" style={{ color: plan.color }}>
                  {plan.name.toUpperCase()}
                </div>
                <div className="text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>{plan.subtitle}</div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div
                  className="text-4xl font-black text-white transition-all duration-300"
                  style={{ opacity: animPrices ? 1 : 0, transform: animPrices ? 'translateY(0)' : 'translateY(4px)' }}
                >
                  {priceInfo.amount}
                  <span className="text-sm font-normal ml-1" style={{ color: 'rgba(160,150,220,0.5)' }}>{priceInfo.sub}</span>
                </div>
                {'monthly' in priceInfo && (
                  <div className="text-xs mt-0.5" style={{ color: '#4ade80' }}>≈ {priceInfo.monthly}</div>
                )}
                {yearly && plan.price > 0 && (
                  <div className="text-[10px] mt-0.5" style={{ color: 'rgba(160,150,220,0.4)' }}>
                    Was ₹{plan.price * 12}/yr
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-5">
                {plan.features.map(f => (
                  <li key={f.text} className="flex items-start gap-2 text-xs">
                    {f.ok
                      ? <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      : <X className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(109,95,160,0.4)' }} />}
                    <span style={{ color: f.ok ? 'rgba(220,216,255,0.9)' : 'rgba(109,95,160,0.5)' }}>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => selectPlan(plan.id)}
                className={`w-full py-3 rounded-xl text-sm font-black transition-all duration-200 hover:scale-105 active:scale-95 ${plan.id === 'free' || active ? 'cursor-default' : ''}`}
                style={
                  active
                    ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' }
                    : plan.id === 'free'
                    ? { background: 'rgba(139,92,246,0.08)', color: 'rgba(139,92,246,0.5)', border: '1px solid rgba(139,92,246,0.15)' }
                    : plan.popular
                    ? { background: `linear-gradient(135deg, #7c3aed, #db2777)`, color: '#fff', boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }
                    : { background: `${plan.color}22`, color: plan.color, border: `1px solid ${plan.color}40` }
                }
              >
                {active ? '✓ Current Plan' : plan.id === 'free' ? '✓ Free Plan' : `Get ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-2">
        {[
          { icon: <Shield className="w-4 h-4" />, text: '7-day money-back' },
          { icon: <Clock className="w-4 h-4" />, text: 'Cancel anytime' },
          { icon: <Infinity className="w-4 h-4" />, text: 'Free forever tier' },
          { icon: <Trophy className="w-4 h-4" />, text: '12,000+ learners' },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>
            <span style={{ color: 'rgba(139,92,246,0.7)' }}>{b.icon}</span>
            {b.text}
          </div>
        ))}
      </div>

      {/* Feature comparison table */}
      <div>
        <button
          onClick={() => setShowComparison(c => !c)}
          className="w-full flex items-center justify-between p-4 rounded-2xl transition-all hover:scale-[1.01]"
          style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}
        >
          <span className="text-sm font-black text-white">Full Feature Comparison</span>
          {showComparison ? <ChevronUp className="w-4 h-4 text-purple-400" /> : <ChevronDown className="w-4 h-4 text-purple-400" />}
        </button>

        {showComparison && (
          <div className="mt-4 overflow-x-auto animate-fade-up">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left pb-4 pr-4" style={{ color: 'rgba(160,150,220,0.5)', minWidth: 160 }}>Feature</th>
                  {PLANS.map(p => (
                    <th key={p.id} className="text-center pb-4 px-3" style={{ color: p.color, minWidth: 80 }}>
                      <div>{p.emoji}</div>
                      <div className="font-black mt-1">{p.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((cat, ci) => (
                  <>
                    <tr key={`cat-${ci}`}>
                      <td colSpan={5} className="pt-4 pb-2">
                        <div className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(139,92,246,0.6)' }}>
                          {cat.category}
                        </div>
                      </td>
                    </tr>
                    {cat.features.map((f, fi) => (
                      <tr key={`${ci}-${fi}`} className="border-t" style={{ borderColor: 'rgba(139,92,246,0.08)' }}>
                        <td className="py-2.5 pr-4" style={{ color: 'rgba(200,196,255,0.7)' }}>{f.name}</td>
                        {f.values.map((v, vi) => (
                          <td key={vi} className="py-2.5 px-3 text-center">
                            {typeof v === 'boolean'
                              ? v
                                ? <Check className="w-3.5 h-3.5 mx-auto" style={{ color: PLANS[vi].color }} />
                                : <X className="w-3.5 h-3.5 mx-auto" style={{ color: 'rgba(109,95,160,0.3)' }} />
                              : <span className="font-black" style={{ color: v === '∞' || v === '99' ? PLANS[vi].color : 'rgba(200,196,255,0.7)' }}>{v}</span>
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* What's included visuals */}
      <div>
        <h2 className="text-xl font-black text-white mb-6 text-center">Everything Included</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { icon: <BookOpen className="w-5 h-5" />, title: 'Structured Lessons', desc: 'N5→N1 curriculum', color: '#a78bfa' },
            { icon: <Pencil className="w-5 h-5" />, title: 'Kanji Writing', desc: 'AI stroke correction', color: '#60a5fa' },
            { icon: <Mic className="w-5 h-5" />, title: 'Speaking AI', desc: 'Pronunciation scoring', color: '#f472b6' },
            { icon: <MessageSquare className="w-5 h-5" />, title: 'AI Tutor Chat', desc: 'Gemini-powered 24/7', color: '#34d399' },
            { icon: <Brain className="w-5 h-5" />, title: 'SRS Reviews', desc: 'Smart spaced repetition', color: '#fb923c' },
            { icon: <Headphones className="w-5 h-5" />, title: 'Listening Practice', desc: 'Native audio tracks', color: '#e879f9' },
            { icon: <Trophy className="w-5 h-5" />, title: 'JLPT Roadmap', desc: 'Guided exam prep', color: '#fbbf24' },
            { icon: <Sparkles className="w-5 h-5" />, title: 'Daily Quizzes', desc: 'Vocabulary & grammar', color: '#c084fc' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}15`, color: item.color }}>
                {item.icon}
              </div>
              <div className="text-xs font-black text-white mb-0.5">{item.title}</div>
              <div className="text-[11px]" style={{ color: 'rgba(160,150,220,0.6)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div>
        <h2 className="text-xl font-black text-white mb-6 text-center">Loved by Learners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { text: 'I passed JLPT N4 after 6 months with Velmorth Plus. The AI tutor explains things better than my university professor.', author: 'Aditya S.', level: 'N4 Certified', avatar: '🇮🇳' },
            { text: 'The writing AI is insanely good. It corrected my 日 stroke order in 3 tries. I\'ve been struggling with this for months.', author: 'Emma W.', level: 'N5 Student', avatar: '🇬🇧' },
            { text: 'Upgraded from Free to Pro. The difference is night and day. Every feature just works perfectly together.', author: 'Vikram P.', level: 'N3 Student', avatar: '🇮🇳' },
          ].map((t, i) => (
            <div key={i} className="p-5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="flex mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-xs italic mb-4 leading-relaxed" style={{ color: 'rgba(200,196,255,0.8)' }}>&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <span className="text-xl">{t.avatar}</span>
                <div>
                  <div className="text-xs font-black text-white">{t.author}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(139,92,246,0.6)' }}>{t.level}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-black text-white mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3 max-w-2xl mx-auto">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                {openFaq === i
                  ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-purple-400" />
                  : <ChevronDown className="w-4 h-4 flex-shrink-0 text-purple-400" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 animate-fade-up">
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(200,196,255,0.7)' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div
        className="rounded-3xl p-10 text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))',
          border: '1px solid rgba(139,92,246,0.25)',
        }}
      >
        <div className="text-4xl mb-4">🎌</div>
        <h3 className="text-2xl font-black text-white mb-3">Start Your Japanese Journey Today</h3>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(200,196,255,0.65)' }}>
          Join 12,000+ learners. The free tier is yours forever — upgrade when you&apos;re ready to go deeper.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => selectPlan('plus')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black text-white transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 32px rgba(124,58,237,0.4)' }}
          >
            <Sparkles className="w-4 h-4" /> Get Plus — ₹{yearly ? '799/yr' : '149/mo'}
          </button>
          <button
            onClick={() => selectPlan('pro')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-black transition-all hover:scale-105"
            style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.35)', color: '#f59e0b' }}
          >
            <Crown className="w-4 h-4" /> Get Pro — ₹{yearly ? '999/yr' : '199/mo'}
          </button>
        </div>
        <p className="text-[11px] mt-4" style={{ color: 'rgba(160,150,220,0.35)' }}>
          Cancel anytime · 7-day money-back guarantee · Secure payment via Razorpay
        </p>
      </div>
    </div>
  );
}
