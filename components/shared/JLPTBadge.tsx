import { cn } from '@/utils';

const JLPT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  N5: { bg: 'rgba(34,197,94,0.15)',  text: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  N4: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  N3: { bg: 'rgba(139,92,246,0.15)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  N2: { bg: 'rgba(236,72,153,0.15)', text: '#f472b6', border: 'rgba(236,72,153,0.3)' },
  N1: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
};

export function JLPTBadge({ level, size = 'sm', className }: { level: string; size?: 'xs' | 'sm' | 'md'; className?: string }) {
  const s = JLPT_STYLES[level] || JLPT_STYLES.N5;
  const sizes = { xs: 'text-[9px] px-1.5 py-0.5', sm: 'text-[10px] px-2 py-0.5', md: 'text-xs px-2.5 py-1' };
  return (
    <span className={cn('inline-flex items-center font-black rounded-full', sizes[size], className)}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {level}
    </span>
  );
}

export function PlanBadge({ plan, className }: { plan: string; className?: string }) {
  const styles: Record<string, { bg: string; text: string }> = {
    free:    { bg: 'rgba(139,92,246,0.1)', text: 'rgba(160,150,220,0.7)' },
    basic:   { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
    plus:    { bg: 'rgba(139,92,246,0.2)', text: '#a78bfa' },
    pro:     { bg: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))', text: '#f0efff' },
    yearly:  { bg: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(234,88,12,0.3))', text: '#fbbf24' },
  };
  const s = styles[plan?.toLowerCase()] || styles.free;
  return (
    <span className={cn('inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-full border border-[rgba(139,92,246,0.2)]', className)}
      style={{ background: s.bg, color: s.text }}>
      {plan?.toUpperCase() || 'FREE'}
    </span>
  );
}
