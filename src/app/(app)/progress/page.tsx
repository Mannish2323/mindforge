'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { MFCard } from '@/components/ui/MFCard';
import { MFProgress } from '@/components/ui/MFProgress';
import { MFIcon } from '@/components/ui/MFIcon';
import { WeeklyChart } from '@/components/charts/WeeklyChart';

export default function ProgressPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const tabs = ['Overview', 'Weekly', 'Monthly', 'All Time'];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  const weeklyData = [
    { day: 'Mon', value: 25 }, { day: 'Tue', value: 35 }, { day: 'Wed', value: 15 },
    { day: 'Thu', value: 40 }, { day: 'Fri', value: 20 }, { day: 'Sat', value: 30 },
    { day: 'Sun', value: profile?.xp_today ?? 10 },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-6xl mx-auto pb-14">
      {/* Header Tabs */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink flex items-center gap-2">
          <MFIcon name="progress" size={28} />
          Progress Analytics
        </h1>
        <div className="flex bg-card border border-edge rounded-full p-1 shadow-sm overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-ink text-white'
                  : 'text-ink-muted hover:text-ink hover:bg-card-subtle'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MFCard variant="paper" padding="md" className="flex flex-col items-center gap-2 text-center">
          <MFIcon name="star" size={24} />
          <span className="text-2xl font-black text-ink font-heading">68%</span>
          <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Overall Progress</span>
        </MFCard>
        <MFCard variant="paper" padding="md" className="flex flex-col items-center gap-2 text-center">
          <MFIcon name="study" size={24} />
          <span className="text-2xl font-black text-ink font-heading">48</span>
          <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Lessons Completed</span>
        </MFCard>
        <MFCard variant="paper" padding="md" className="flex flex-col items-center gap-2 text-center">
          <MFIcon name="vocabulary" size={24} />
          <span className="text-2xl font-black text-ink font-heading">239</span>
          <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Words Learned</span>
        </MFCard>
        <MFCard variant="paper" padding="md" className="flex flex-col items-center gap-2 text-center">
          <MFIcon name="kanji" size={24} />
          <span className="text-2xl font-black text-ink font-heading">38</span>
          <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Kanji Learned</span>
        </MFCard>
        <MFCard variant="paper" padding="md" className="flex flex-col items-center gap-2 text-center">
          <Clock className="w-6 h-6 text-brand" />
          <span className="text-2xl font-black text-ink font-heading">12.5</span>
          <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">Hours Studied</span>
        </MFCard>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Progress */}
        <motion.div variants={item}>
          <MFCard variant="paper" padding="lg" className="h-full space-y-6">
            <h3 className="font-heading font-extrabold text-lg text-ink">Skill Mastery</h3>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MFIcon name="hiragana" size={18} />
                  <span className="text-sm font-bold text-ink">Hiragana</span>
                </div>
                <MFProgress value={90} color="coral" showPercent />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MFIcon name="katakana" size={18} />
                  <span className="text-sm font-bold text-ink">Katakana</span>
                </div>
                <MFProgress value={78} color="mint" showPercent />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MFIcon name="vocabulary" size={18} />
                  <span className="text-sm font-bold text-ink">Vocabulary</span>
                </div>
                <MFProgress value={65} color="lavender" showPercent />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MFIcon name="grammar" size={18} />
                  <span className="text-sm font-bold text-ink">Grammar</span>
                </div>
                <MFProgress value={55} color="sky" showPercent />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MFIcon name="listening" size={18} />
                  <span className="text-sm font-bold text-ink">Listening</span>
                </div>
                <MFProgress value={45} color="gold" showPercent />
              </div>
            </div>
          </MFCard>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div variants={item}>
          <MFCard variant="paper" padding="lg" className="h-full">
            <h3 className="font-heading font-extrabold text-lg text-ink mb-6">Weekly Activity</h3>
            <WeeklyChart data={weeklyData} label="This Week" unit="XP" />
          </MFCard>
        </motion.div>
      </div>
    </motion.div>
  );
}
