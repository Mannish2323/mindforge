'use client';
import { Flame, Zap, Heart, Diamond } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { CircularProgress } from '@/components/ui/ProgressBar';

export function XPBar() {
  const { profile } = useAuth();
  const level = profile?.level || 1;
  const xp = profile?.xp || 0;
  const xpForLevel = level * 1000;
  const xpInLevel = xp % xpForLevel;

  return (
    <div className="flex items-center gap-2">
      <CircularProgress value={xpInLevel} max={xpForLevel} size={36} strokeWidth={3} color="#7c3aed">
        <span className="text-[9px] font-black text-white">{level}</span>
      </CircularProgress>
      <div className="min-w-0">
        <div className="text-xs font-black text-white">Level {level}</div>
        <div className="text-[10px] text-[rgba(160,150,220,0.5)]">{xp.toLocaleString()} XP</div>
      </div>
    </div>
  );
}

export function StatPills() {
  const { profile } = useAuth();
  const { state } = useStore();

  const pills = [
    { icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, value: profile?.streak || 0, tip: 'Day streak' },
    { icon: <Zap className="w-3.5 h-3.5 text-yellow-400" />, value: profile?.xp ? (profile.xp >= 1000 ? `${(profile.xp/1000).toFixed(1)}K` : profile.xp) : 0, tip: 'Total XP' },
    { icon: <Heart className="w-3.5 h-3.5 text-red-400" />, value: `${state?.hearts ?? 5}/${state?.maxHearts ?? 5}`, tip: 'Hearts' },
    { icon: <Diamond className="w-3.5 h-3.5 text-cyan-400" />, value: state?.gems ?? 0, tip: 'Gems' },
  ];

  return (
    <div className="flex items-center gap-2">
      {pills.map((p, i) => (
        <div key={i} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl cursor-default"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.18)' }}
          title={p.tip}>
          {p.icon}
          <span className="text-xs font-black text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}
