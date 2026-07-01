'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Award, ShieldCheck, Zap, Flame, BookOpen, Brain, CreditCard, 
  Settings, User, MapPin, Calendar, Clock, Smile
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  
  const earnedBadges: Badge[] = [
    { id: '1', name: 'First Step', desc: 'Complete your first lesson', icon: '🌱', rarity: 'common' },
    { id: '2', name: 'On a Roll', desc: 'Maintain a 3-day streak', icon: '🔥', rarity: 'common' },
    { id: '3', name: 'Week Warrior', desc: 'Maintain a 7-day streak', icon: '⚡', rarity: 'rare' },
    { id: '4', name: 'Vocabulary Builder', desc: 'Learn 50 words', icon: '🈶', rarity: 'rare' }
  ];

  // Dummy activity array for the heatmap calendar (12 months representation)
  const heatmapData = Array.from({ length: 28 }).map((_, i) => ({
    day: i + 1,
    active: i % 4 !== 0,
    intensity: (i % 3) + 1
  }));

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner';
  const userEmail = user?.email || 'email@example.com';
  
  const currentLevelXp = user?.user_metadata?.xp || 120;
  const targetXp = 300;
  const xpPercentage = Math.round((currentLevelXp / targetXp) * 100);

  return (
    <div className="space-y-8">
      {/* Profile Header banner */}
      <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Ambient glow */}
        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 bg-brand-purple/10 rounded-full blur-[40px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 relative z-10 text-center md:text-left">
          {/* Avatar avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-purple to-sakura-dark p-[2px] shadow-lg flex-shrink-0 relative overflow-hidden animate-float-avatar">
            <div className="w-full h-full bg-[#120f26] rounded-[14px] flex items-center justify-center font-bold text-white text-3xl">
              {userName[0].toUpperCase()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-white font-orbitron">{userName}</h2>
              <span className="flex items-center gap-1 text-[9px] font-extrabold text-brand-purple-light bg-brand-purple/20 border border-brand-purple/30 px-2 py-0.5 rounded-md uppercase">
                <ShieldCheck className="w-3 h-3" />
                <span>Premium Starter</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-purple-300/40">{userEmail}</p>
            <p className="text-xs text-purple-300/60 font-semibold flex items-center justify-center md:justify-start gap-1">
              <Smile className="w-3.5 h-3.5 text-sakura-dark" />
              <span>&ldquo;Practice makes permanent, keep grinding.&rdquo;</span>
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="text-center md:text-right">
            <span className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">LEVEL PROGRESS</span>
            <div className="flex items-center gap-2 mt-1.5 justify-center md:justify-end">
              <span className="text-xs font-bold text-white">N5</span>
              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-purple to-sakura-dark rounded-full" style={{ width: `${xpPercentage}%` }} />
              </div>
              <span className="text-xs font-extrabold text-sakura-dark">{xpPercentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats counter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'XP TOTAL', value: '1,240', desc: 'All time points', icon: Zap, color: 'text-yellow-400 bg-yellow-400/10' },
          { label: 'DAY STREAK', value: '5 Days', desc: 'Daily consistency', icon: Flame, color: 'text-orange-400 bg-orange-400/10' },
          { label: 'WORDS LEARNED', value: '12 Words', desc: 'Active vocabulary', icon: BookOpen, color: 'text-pink-400 bg-pink-400/10' },
          { label: 'SPEAK SESSIONS', value: '4 Rounds', desc: 'Pronunciation checks', icon: Brain, color: 'text-purple-400 bg-purple-400/10' }
        ].map((s, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-purple-300/40 tracking-wider uppercase">{s.label}</span>
              <div className={`p-1.5 rounded-lg ${s.color.split(' ').slice(1).join(' ')}`}>
                <s.icon className={`w-4 h-4 ${s.color.split(' ')[0]}`} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white font-orbitron">{s.value}</h3>
              <p className="text-[10px] font-medium text-purple-300/45 mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Heatmap & Achievements panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Activity Heatmap */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-base font-bold text-white font-orbitron">Activity heatmap</h3>
              <span className="text-xs font-semibold text-purple-300/40">Past 4 weeks study consistency</span>
            </div>

            {/* Heatmap grid */}
            <div className="flex flex-wrap gap-2.5 items-center justify-center">
              {heatmapData.map((d) => {
                let colorStyle = 'bg-white/5 border border-white/5';
                if (d.active) {
                  if (d.intensity === 1) colorStyle = 'bg-brand-purple/20 border-brand-purple/20 text-white';
                  else if (d.intensity === 2) colorStyle = 'bg-brand-purple/40 border-brand-purple/35 text-white';
                  else colorStyle = 'bg-brand-purple/70 border-brand-purple/60 text-white shadow-[0_0_8px_rgba(124,58,237,0.3)]';
                }

                return (
                  <div 
                    key={d.day}
                    title={`Day ${d.day}: Study session active`}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold font-orbitron ${colorStyle}`}
                  >
                    {d.day}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center gap-6 text-[10px] font-bold text-purple-300/40 uppercase">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-white/5 rounded" />
                <span>INACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-brand-purple/20 rounded" />
                <span>LOW INTENSITY</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 bg-brand-purple/70 rounded" />
                <span>HIGH INTENSITY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Badges / Achievements list */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-5">
            <h3 className="text-base font-bold text-white font-orbitron">Achievements</h3>
            <div className="space-y-3">
              {earnedBadges.map((badge) => {
                let rarityColor = 'text-purple-300 bg-purple-500/10 border-purple-500/20';
                if (badge.rarity === 'rare') rarityColor = 'text-sky-300 bg-sky-500/10 border-sky-500/20';
                else if (badge.rarity === 'epic') rarityColor = 'text-pink-300 bg-pink-500/10 border-pink-500/20';

                return (
                  <div 
                    key={badge.id}
                    className="p-3.5 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center gap-3.5 hover:border-white/10 transition-all"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                      {badge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white truncate">{badge.name}</h4>
                        <span className={`text-[8px] font-extrabold tracking-wider border px-1.5 py-0.5 rounded uppercase ${rarityColor}`}>
                          {badge.rarity}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-purple-300/40 mt-0.5 truncate">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
