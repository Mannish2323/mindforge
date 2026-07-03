'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Flame, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/app/context/AuthContext';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Tanaka Yuki', xp: 12450, level: 28, streak: 145, avatar: '🇯🇵' },
  { rank: 2, name: 'Alex Chen', xp: 11200, level: 25, streak: 98, avatar: '🐉' },
  { rank: 3, name: 'Priya Sharma', xp: 10800, level: 24, streak: 67, avatar: '🌸' },
  { rank: 4, name: 'Kim Soo-jin', xp: 9500, level: 22, streak: 52, avatar: '⭐' },
  { rank: 5, name: 'Marco Rossi', xp: 8700, level: 20, streak: 44, avatar: '🏆' },
  { rank: 6, name: 'Emily Wilson', xp: 7200, level: 18, streak: 31, avatar: '🌙' },
  { rank: 7, name: 'Raj Patel', xp: 6800, level: 17, streak: 28, avatar: '🔥' },
  { rank: 8, name: 'Sakura Mori', xp: 5500, level: 15, streak: 21, avatar: '🎌' },
  { rank: 9, name: 'Lars Jensen', xp: 4200, level: 12, streak: 14, avatar: '❄️' },
  { rank: 10, name: 'Ana García', xp: 3800, level: 11, streak: 9, avatar: '🌺' },
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
    if (rank === 1) return <Crown className="w-5 h-5 text-amber-400 fill-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-purple-300/40 w-5 text-center font-orbitron">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-amber-500/10 to-yellow-500/5 border-amber-500/20';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/10 to-gray-300/5 border-gray-400/20';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700/10 to-amber-600/5 border-amber-700/20';
    return 'border-white/[0.08]';
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-2xl mx-auto">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-amber-400" /> Leaderboard
        </h1>
        <p className="text-sm text-purple-300/45">Compete with learners worldwide</p>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === tab.key ? 'bg-neon-purple/20 text-white border border-neon-purple/30' : 'bg-white/[0.03] text-purple-300/50 border border-white/[0.08]'}`}
          >{tab.label}</button>
        ))}
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {LEADERBOARD_DATA.slice(0, 3).map((user, i) => {
          const order = [1, 0, 2];
          const u = LEADERBOARD_DATA[order[i]];
          const isFirst = order[i] === 0;
          return (
            <div key={u.rank} className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.08] transition-all ${getRankBg(u.rank)} ${isFirst ? 'scale-105' : ''}`}>
              <div className="relative">
                <Avatar emoji={u.avatar} name={u.name} size={isFirst ? 'lg' : 'md'} />
                <div className="absolute -top-2 -right-2">{getRankIcon(u.rank)}</div>
              </div>
              <span className="text-xs font-bold text-white truncate w-full text-center">{u.name.split(' ')[0]}</span>
              <Badge variant={u.rank === 1 ? 'amber' : 'purple'} size="sm" icon={<Zap className="w-3 h-3" />}>
                {u.xp.toLocaleString()}
              </Badge>
            </div>
          );
        })}
      </motion.div>

      {/* Full List */}
      <motion.div variants={container} className="space-y-2">
        {LEADERBOARD_DATA.map((user) => {
          const isCurrentUser = user.name === profile?.name;
          return (
            <motion.div key={user.rank} variants={item}>
              <Card variant="glass" padding="sm"
                className={`flex items-center gap-3 px-4 py-3 ${isCurrentUser ? 'border-neon-purple/30 bg-neon-purple/10' : ''} ${getRankBg(user.rank)}`}
              >
                <div className="w-8 flex justify-center">{getRankIcon(user.rank)}</div>
                <Avatar emoji={user.avatar} name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white truncate block">{user.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-purple-300/40">Lv.{user.level}</span>
                    <span className="text-[10px] text-amber-500/60 flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />{user.streak}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-white font-orbitron">{user.xp.toLocaleString()}</span>
                  <span className="text-[10px] text-purple-300/30 block">XP</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Your Position */}
      <motion.div variants={item}>
        <Card variant="gradient" padding="md" className="text-center space-y-2">
          <p className="text-xs text-purple-300/40">Your Rank</p>
          <p className="text-2xl font-bold text-white font-orbitron">#42</p>
          <p className="text-xs text-purple-300/50">Keep learning to climb higher!</p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
