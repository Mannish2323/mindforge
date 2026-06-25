'use client';

import { useRouter } from 'next/navigation';
import { Lock, Sparkles, Star, Crown, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface PremiumGateProps {
  /** Feature name shown in the lock overlay */
  featureName: string;
  /** Minimum plan required: 'starter' | 'plus' | 'pro' */
  requiredPlan?: 'starter' | 'plus' | 'pro';
  /** The full preview content to render (visible but locked) */
  children: React.ReactNode;
  /** Optional extra benefits to highlight */
  benefits?: string[];
  /** Testimonials */
  testimonials?: { text: string; author: string; avatar: string }[];
}

const PLAN_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  starter: { label: 'Starter', color: '#60a5fa', icon: <Zap className="w-4 h-4" /> },
  plus:    { label: 'Plus',    color: '#a78bfa', icon: <Star className="w-4 h-4" /> },
  pro:     { label: 'Pro',     color: '#f59e0b', icon: <Crown className="w-4 h-4" /> },
};

export function PremiumGate({
  featureName,
  requiredPlan = 'plus',
  children,
  benefits = [],
  testimonials = [],
}: PremiumGateProps) {
  const { profile } = useAuth();
  const router = useRouter();

  // User already has access
  if (profile?.isPremium) {
    return <>{children}</>;
  }

  const plan = PLAN_LABELS[requiredPlan];

  return (
    <div className="relative w-full">
      {/* Blurred / faded preview of actual content */}
      <div
        className="pointer-events-none select-none overflow-hidden rounded-2xl"
        style={{
          filter: 'blur(3px) brightness(0.5)',
          maxHeight: '480px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
        }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Lock overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 py-10"
        style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(124,58,237,0.18) 0%, rgba(10,8,22,0.96) 70%)' }}
      >
        {/* Lock badge */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(219,39,119,0.25))',
            border: '1px solid rgba(139,92,246,0.4)',
            boxShadow: '0 0 40px rgba(124,58,237,0.25)',
          }}
        >
          <Lock className="w-8 h-8 text-purple-300" />
        </div>

        {/* Plan pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-3"
          style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}40`, color: plan.color }}
        >
          {plan.icon}
          Requires {plan.label} Plan
        </div>

        <h2 className="text-2xl font-black text-white text-center mb-2">
          Unlock {featureName}
        </h2>
        <p className="text-sm text-center mb-6 max-w-xs" style={{ color: 'rgba(200,196,255,0.65)' }}>
          You&apos;re one step away from accessing this feature. Upgrade to continue your Japanese journey.
        </p>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div className="w-full max-w-xs space-y-2 mb-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(200,196,255,0.8)' }}>
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                {b}
              </div>
            ))}
          </div>
        )}

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="w-full max-w-xs grid grid-cols-1 gap-2 mb-6">
            {testimonials.slice(0, 2).map((t, i) => (
              <div
                key={i}
                className="p-3 rounded-xl text-xs"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                <p className="italic mb-1.5" style={{ color: 'rgba(200,196,255,0.75)' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-base leading-none">{t.avatar}</span>
                  <span className="font-bold text-white text-[11px]">{t.author}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push('/billing')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #db2777)',
              boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
            }}
          >
            <Sparkles className="w-4 h-4" />
            Upgrade Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/billing')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(139,92,246,0.1)',
              border: '1px solid rgba(139,92,246,0.25)',
              color: 'rgba(200,196,255,0.8)',
            }}
          >
            See All Plans
          </button>
        </div>

        <p className="text-[10px] mt-4" style={{ color: 'rgba(160,150,220,0.35)' }}>
          Cancel anytime · 7-day money-back guarantee
        </p>
      </div>
    </div>
  );
}
