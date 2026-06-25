'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { Flame, Zap, BookOpen, Star, Award, RotateCcw } from 'lucide-react';

export default function ProfilePage() {
  const { profile } = useAuth();
  const { state } = useStore();
  const completedLessons = Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;

  const stats = [
    { icon: Zap,       label: 'Total XP',     value: (profile?.xp || 0).toLocaleString(), color: 'from-yellow-500 to-orange-500' },
    { icon: Flame,     label: 'Day Streak',   value: `${profile?.streak || 0}🔥`,          color: 'from-orange-500 to-red-500' },
    { icon: BookOpen,  label: 'Lessons Done', value: completedLessons,                      color: 'from-blue-500 to-cyan-500' },
    { icon: Star,      label: 'Level',        value: profile?.level || 1,                   color: 'from-purple-500 to-pink-500' },
    { icon: Award,     label: 'Words',        value: profile?.words_learned || 0,           color: 'from-green-500 to-emerald-500' },
    { icon: RotateCcw, label: 'Reviews Done', value: profile?.reviews_done || 0,            color: 'from-indigo-500 to-purple-500' },
  ];

  const badges = state?.badges?.filter((b: any) => b.unlockedAt) || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl flex-shrink-0 shadow-lg shadow-purple-500/25">
            {profile?.avatarUrl || '🦊'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white">{profile?.name || 'Learner'}</h1>
            <div className="text-purple-300/50 text-sm mt-0.5">@{profile?.username || 'user'}</div>
            <div className="text-purple-300/40 text-xs mt-0.5">{profile?.email}</div>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {profile?.isPremium && (
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {(profile.planId || 'PRO').toUpperCase()}
                </span>
              )}
              <span className="bg-purple-800/40 text-purple-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                JLPT {profile?.jlpt_target || 'N5'}
              </span>
              {profile?.isAdmin && (
                <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/30">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-purple-950/40 border border-purple-800/30 rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-xl font-black text-white">{s.value}</div>
            <div className="text-xs text-purple-300/50 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.slice(0, 12).map((b: any) => (
              <div key={b.badge_id} title={b.title} className="w-12 h-12 bg-purple-800/30 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform cursor-default">
                {b.icon}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
