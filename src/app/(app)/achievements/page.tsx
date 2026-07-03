'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BadgeIcon, resolveBadgeType, getBadgeLabel } from '@/components/ui/BadgeIcons';
import { useAuth } from '@/app/context/AuthContext';

const ACHIEVEMENTS = [
  { id: 1, emoji: '🔥', name: 'Fire Starter', desc: 'Complete your first lesson', category: 'Learning', unlocked: true, progress: 100 },
  { id: 2, emoji: '📚', name: 'Bookworm', desc: 'Learn 50 vocabulary words', category: 'Learning', unlocked: true, progress: 100 },
  { id: 3, emoji: '🗾', name: 'Explorer', desc: 'Complete N5 unit 1', category: 'Learning', unlocked: false, progress: 65 },
  { id: 4, emoji: '⭐', name: 'Rising Star', desc: 'Reach Level 5', category: 'Learning', unlocked: false, progress: 40 },
  { id: 5, emoji: '🔥', name: 'On Fire', desc: '7 day streak', category: 'Streak', unlocked: true, progress: 100 },
  { id: 6, emoji: '💎', name: 'Diamond Streak', desc: '30 day streak', category: 'Streak', unlocked: false, progress: 23 },
  { id: 7, emoji: '🏆', name: 'Champion', desc: '100 day streak', category: 'Streak', unlocked: false, progress: 7 },
  { id: 8, emoji: '🎯', name: 'Sharpshooter', desc: '100% quiz accuracy', category: 'Learning', unlocked: false, progress: 80 },
  { id: 9, emoji: '🤝', name: 'Social Butterfly', desc: 'Add 5 friends', category: 'Social', unlocked: false, progress: 20 },
  { id: 10, emoji: '⚔️', name: 'Duelist', desc: 'Win 3 duels', category: 'Social', unlocked: false, progress: 33 },
  { id: 11, emoji: '🧠', name: 'Memory Master', desc: 'Review 200 cards', category: 'Learning', unlocked: false, progress: 15 },
  { id: 12, emoji: '🎙️', name: 'Voice Actor', desc: 'Complete 10 speaking exercises', category: 'Learning', unlocked: false, progress: 50 },
];

export default function AchievementsPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Learning', 'Streak', 'Social'];

  const filtered = activeTab === 'All'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeTab);

  const unlockedCount = ACHIEVEMENTS.filter(a => a.unlocked).length;

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Award className="w-7 h-7 text-amber-400" /> Achievements
        </h1>
        <p className="text-sm text-purple-300/45">{unlockedCount}/{ACHIEVEMENTS.length} unlocked</p>
      </motion.div>

      {/* Summary */}
      <motion.div variants={item}>
        <ProgressBar value={(unlockedCount / ACHIEVEMENTS.length) * 100} label="Overall Progress" showLabel />
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab ? 'bg-neon-purple/20 text-white border border-neon-purple/30' : 'bg-white/[0.03] text-purple-300/50 border border-white/[0.06] hover:border-white/10'}`}
          >{tab}</button>
        ))}
      </motion.div>

      {/* Badge Grid */}
      <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((achievement) => (
          <motion.div key={achievement.id} variants={item}>
            <Card variant="glass" padding="md"
              className={`space-y-3 ${!achievement.unlocked ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Premium SVG Badge Icon */}
                  <BadgeIcon
                    type={achievement.emoji}
                    unlocked={achievement.unlocked}
                    size="md"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{achievement.name}</h3>
                    <p className="text-[11px] text-purple-300/40">{achievement.desc}</p>
                  </div>
                </div>
                {achievement.unlocked && (
                  <Badge variant="emerald" size="sm">✓</Badge>
                )}
              </div>
              {!achievement.unlocked && (
                <ProgressBar value={achievement.progress} size="sm" color="purple" />
              )}
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
