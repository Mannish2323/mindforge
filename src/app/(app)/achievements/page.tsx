'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Lock, Check } from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';
import { BadgeIcon } from '@/components/ui/BadgeIcons';
import { useAuth } from '@/app/context/AuthContext';

const ACHIEVEMENTS = [
  { id: 1, badgeType: 'first-lesson', name: 'First Step', desc: 'Complete your first lesson', category: 'Learning', unlocked: true, progress: 100 },
  { id: 2, badgeType: 'bookworm', name: 'Bookworm', desc: 'Learn 50 vocabulary words', category: 'Learning', unlocked: true, progress: 100 },
  { id: 3, badgeType: 'explorer', name: 'Explorer', desc: 'Complete N5 unit 1', category: 'Learning', unlocked: false, progress: 65 },
  { id: 4, badgeType: 'rising-star', name: 'Rising Star', desc: 'Reach Level 5', category: 'Learning', unlocked: false, progress: 40 },
  { id: 5, badgeType: 'fire-starter', name: 'On Fire', desc: '7 day streak', category: 'Streak', unlocked: true, progress: 100 },
  { id: 6, badgeType: 'diamond-streak', name: 'Diamond Streak', desc: '30 day streak', category: 'Streak', unlocked: false, progress: 23 },
  { id: 7, badgeType: 'champion', name: 'Champion', desc: '100 day streak', category: 'Streak', unlocked: false, progress: 7 },
  { id: 8, badgeType: 'sharpshooter', name: 'Sharpshooter', desc: '100% quiz accuracy', category: 'Learning', unlocked: false, progress: 80 },
  { id: 9, badgeType: 'vocab-master', name: 'Social Butterfly', desc: 'Add 5 friends', category: 'Social', unlocked: false, progress: 20 },
  { id: 10, badgeType: 'grammar-expert', name: 'Duelist', desc: 'Win 3 duels', category: 'Social', unlocked: false, progress: 33 },
  { id: 11, badgeType: 'jlpt-n5', name: 'Memory Master', desc: 'Review 200 cards', category: 'Learning', unlocked: false, progress: 15 },
  { id: 12, badgeType: 'speaking-champion', name: 'Voice Actor', desc: 'Complete 10 speaking exercises', category: 'Learning', unlocked: false, progress: 50 },
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
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="yellow" washiTape="yellow" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="trophy" size={16} />
              <span>Study Stamps & Milestones</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
              Notebook Stamps & Badges
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Earn hand-crafted achievement stamps for daily study streaks, kanji mastery, and lesson completion.
            </p>
          </div>

          <div className="px-4 py-2 bg-card border border-edge rounded-2xl text-xs font-black text-ink shadow-sm shrink-0">
            {unlockedCount} / {ACHIEVEMENTS.length} Collected
          </div>
        </div>
      </MFCard>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === tab 
                ? 'bg-brand text-white border-brand shadow-[var(--paper-press-shadow)]' 
                : 'bg-card text-ink-muted border-edge hover:text-ink hover:bg-cream'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Badge Grid — Sticker Book Style */}
      <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement, idx) => {
          const colors = ['sakura', 'mint', 'yellow', 'lavender', 'sky', 'coral'] as const;
          const variant = achievement.unlocked ? colors[idx % colors.length] : 'paper';
          return (
            <motion.div key={achievement.id} variants={item}>
              <MFCard 
                variant={variant}
                lifted={achievement.unlocked}
                padding="md"
                className={`space-y-3 achievement-sticker ${!achievement.unlocked ? 'opacity-60 grayscale' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-2xl bg-card/70 border border-edge ${achievement.unlocked ? 'shadow-sm' : ''}`}>
                      <BadgeIcon
                        type={achievement.badgeType}
                        unlocked={achievement.unlocked}
                        size="md"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-ink font-heading">{achievement.name}</h3>
                      <p className="text-[11px] text-ink-muted leading-snug">{achievement.desc}</p>
                    </div>
                  </div>
                  {achievement.unlocked ? (
                    <div className="px-2 py-0.5 rounded-full bg-mint text-white text-[9px] font-black shrink-0 flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>GOT IT</span>
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-full bg-cream border border-edge text-ink-muted shrink-0">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-ink-muted">
                      <span>Progress</span>
                      <span className="text-brand">{achievement.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-card/60 rounded-full overflow-hidden border border-edge">
                      <div 
                        className="h-full bg-gradient-to-r from-brand to-coral rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </MFCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
