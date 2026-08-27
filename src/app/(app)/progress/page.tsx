'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Zap, BookOpen, Brain, TrendingUp, Calendar, PenTool } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { HeatmapCalendar } from '@/components/charts/HeatmapCalendar';
import { useAuth } from '@/app/context/AuthContext';

export default function ProgressPage() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = ['Overview', 'Skills', 'History'];

  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const wordsLearned = profile?.words_learned ?? 0;
  const kanjiLearned = profile?.kanji_learned ?? 0;
  const lessonsDone = profile?.lessons_done ?? 0;

  // Generate heatmap data (last 12 weeks)
  const heatmapData = Array.from({ length: 84 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (83 - i));
    return { date: date.toISOString().split('T')[0], value: Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 5 : 0 };
  });

  const weeklyData = [
    { day: 'Mon', value: 25 }, { day: 'Tue', value: 35 }, { day: 'Wed', value: 15 },
    { day: 'Thu', value: 40 }, { day: 'Fri', value: 20 }, { day: 'Sat', value: 30 },
    { day: 'Sun', value: profile?.xp_today ?? 10 },
  ];

  const skills = [
    { name: 'Vocabulary', progress: 45, color: 'purple' as const, icon: BookOpen },
    { name: 'Grammar', progress: 30, color: 'pink' as const, icon: BookOpen },
    { name: 'Kanji', progress: 25, color: 'amber' as const, icon: PenTool },
    { name: 'Listening', progress: 20, color: 'emerald' as const, icon: BookOpen },
    { name: 'Speaking', progress: 15, color: 'purple' as const, icon: BookOpen },
    { name: 'Reading', progress: 35, color: 'pink' as const, icon: BookOpen },
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-brand-light" /> Progress
        </h1>
        <p className="text-sm text-ink-muted">Track your Japanese learning journey</p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total XP', value: xp.toLocaleString(), icon: Zap, color: 'text-brand-light' },
          { label: 'Level', value: `Lv.${level}`, icon: TrendingUp, color: 'text-accent' },
          { label: 'Streak', value: `${streak} days`, icon: Flame, color: 'text-amber-400' },
          { label: 'Lessons', value: lessonsDone.toString(), icon: BookOpen, color: 'text-emerald-400' },
        ].map(stat => (
          <Card key={stat.label} variant="glass" padding="md" className="flex flex-col items-center gap-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-xl font-bold text-ink font-heading">{stat.value}</span>
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">{stat.label}</span>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md">
            <WeeklyChart data={weeklyData} label="This Week" unit="XP" />
          </Card>
        </motion.div>

        {/* JLPT Readiness */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="flex flex-col items-center gap-4">
            <h3 className="text-[10px] font-extrabold text-ink-light uppercase tracking-[0.2em] self-start">
              JLPT Readiness
            </h3>
            <ProgressRing value={35} size={130} strokeWidth={10} label={profile?.jlpt_target || 'N5'} />
            <p className="text-xs text-ink-muted">Estimated readiness for {profile?.jlpt_target || 'N5'}</p>
          </Card>
        </motion.div>
      </div>

      {/* Skill Breakdown */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-4">
          <h3 className="text-[10px] font-extrabold text-ink-light uppercase tracking-[0.2em]">Skill Breakdown</h3>
          <div className="space-y-3">
            {skills.map(skill => (
              <ProgressBar key={skill.name} value={skill.progress} label={skill.name} showLabel color={skill.color} />
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-ink-light uppercase tracking-[0.2em]">Study Calendar</h3>
            <Badge variant="purple" size="sm" icon={<Calendar className="w-3 h-3" />}>Last 12 weeks</Badge>
          </div>
          <HeatmapCalendar data={heatmapData} weeks={12} />
        </Card>
      </motion.div>

      {/* Knowledge Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Card variant="glass" padding="md" className="text-center">
          <span className="text-2xl font-bold text-ink font-heading block">{wordsLearned}</span>
          <span className="text-[10px] text-ink-muted font-bold uppercase">Words Learned</span>
        </Card>
        <Card variant="glass" padding="md" className="text-center">
          <span className="text-2xl font-bold text-ink font-heading block">{kanjiLearned}</span>
          <span className="text-[10px] text-ink-muted font-bold uppercase">Kanji Learned</span>
        </Card>
        <Card variant="glass" padding="md" className="text-center col-span-2 md:col-span-1">
          <span className="text-2xl font-bold text-ink font-heading block">{profile?.reviews_done ?? 0}</span>
          <span className="text-[10px] text-ink-muted font-bold uppercase">Reviews Done</span>
        </Card>
      </motion.div>
    </motion.div>
  );
}
