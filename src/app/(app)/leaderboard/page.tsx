'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Flame, Zap } from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFIcon } from '@/components/ui/MFIcon';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/app/context/AuthContext';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Tanaka Yuki', xp: 12450, level: 28, streak: 145, avatar: 'TY' },
  { rank: 2, name: 'Alex Chen', xp: 11200, level: 25, streak: 98, avatar: 'AC' },
  { rank: 3, name: 'Priya Sharma', xp: 10800, level: 24, streak: 67, avatar: 'PS' },
  { rank: 4, name: 'Kim Soo-jin', xp: 9500, level: 22, streak: 52, avatar: 'KS' },
  { rank: 5, name: 'Marco Rossi', xp: 8700, level: 20, streak: 44, avatar: 'MR' },
  { rank: 6, name: 'Emily Wilson', xp: 7200, level: 18, streak: 31, avatar: 'EW' },
  { rank: 7, name: 'Raj Patel', xp: 6800, level: 17, streak: 28, avatar: 'RP' },
  { rank: 8, name: 'Sakura Mori', xp: 5500, level: 15, streak: 21, avatar: 'SM' },
  { rank: 9, name: 'Lars Jensen', xp: 4200, level: 12, streak: 14, avatar: 'LJ' },
  { rank: 10, name: 'Ana García', xp: 3800, level: 11, streak: 9, avatar: 'AG' },
];

export default function LeaderboardPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('weekly');
  const tabs = [
    { key: 'weekly', label: 'This Week' },
    { key: 'monthly', label: 'This Month' },
    { key: 'alltime', label: 'All Time' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <MFIcon name="crown" size={20} />;
    if (rank === 2) return <div className="w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-xs font-bold shadow-sm">2</div>;
    if (rank === 3) return <div className="w-5 h-5 rounded-full bg-orange/80 text-white flex items-center justify-center text-xs font-bold shadow-sm">3</div>;
    return <span className="text-sm font-black text-ink-muted w-5 text-center font-heading">{rank}</span>;
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7 md:space-y-9 max-w-2xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="yellow" washiTape="yellow" padding="lg">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
            <MFIcon name="crown" size={16} />
            <span>Global League</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink font-heading tracking-tight">
            MindForge Study Hall
          </h1>
          <p className="text-xs text-ink-secondary font-medium">Rankings refresh weekly based on total study XP earned.</p>
        </div>
      </MFCard>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 p-1 bg-cream border border-edge rounded-2xl">
        {tabs.map(tab => (
          <button 
            key={tab.key} 
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.key 
                ? 'bg-card text-brand border border-edge shadow-sm' 
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {LEADERBOARD_DATA.slice(0, 3).map((user, i) => {
          const order = [1, 0, 2];
          const u = LEADERBOARD_DATA[order[i]];
          const isFirst = order[i] === 0;
          return (
            <MFCard
              key={u.rank}
              variant={isFirst ? 'yellow' : 'paper'}
              lifted
              padding="sm"
              className={`flex flex-col items-center gap-2 text-center ${isFirst ? 'scale-105 border-brand' : ''}`}
            >
              <div className="relative">
                <Avatar name={u.name} size={isFirst ? 'lg' : 'md'} />
                <div className="absolute -top-2 -right-2">{getRankIcon(u.rank)}</div>
              </div>
              <span className="text-xs font-bold text-ink truncate w-full">{u.name.split(' ')[0]}</span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-card border border-edge text-ink">
                {u.xp.toLocaleString()} XP
              </span>
            </MFCard>
          );
        })}
      </motion.div>

      {/* Full List */}
      <motion.div variants={container} className="space-y-2">
        {LEADERBOARD_DATA.map((user) => {
          const isCurrentUser = user.name === profile?.name;
          return (
            <motion.div key={user.rank} variants={item}>
              <MFCard 
                variant={isCurrentUser ? 'sakura' : 'paper'} 
                padding="sm"
                className={`flex items-center gap-3 px-4 py-3 ${isCurrentUser ? 'border-brand' : ''}`}
              >
                <div className="w-6 flex justify-center">{getRankIcon(user.rank)}</div>
                <Avatar name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink truncate">{user.name}</span>
                    {isCurrentUser && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-brand text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ink-muted">Level {user.level}</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-ink">
                  <MFIcon name="xp" size={14} />
                  <span>{user.xp.toLocaleString()}</span>
                </div>
              </MFCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
