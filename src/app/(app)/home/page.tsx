'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame, Zap, BookOpen, Brain, Sparkles, Mic, PenTool, Volume2,
  ChevronRight, Award, Play, Clock, Map, FileText, Trophy,
  Target, TrendingUp, Calendar
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { WeeklyChart } from '@/components/charts/WeeklyChart';

export default function HomePage() {
  const { profile } = useAuth();
  const { data: dbData, isLoading } = useDashboard();
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const userName = profile?.name || 'Learner';
  const xpToday = profile?.xp_today ?? 0;
  const dailyGoalXp = profile?.daily_goal_xp ?? 25;
  const dailyProgress = Math.min(100, Math.round((xpToday / dailyGoalXp) * 100));
  const streak = profile?.streak ?? 0;
  const level = profile?.level ?? 1;
  const xpTotal = profile?.xp ?? 0;
  const jlptTarget = profile?.jlpt_target || 'N5';
  const lessonsDone = profile?.lessons_done ?? 0;
  const wordsLearned = profile?.words_learned ?? 0;
  const kanjiLearned = profile?.kanji_learned ?? 0;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } },
  };

  const quickActions = [
    { name: 'Vocabulary', href: '/vocabulary', icon: BookOpen, color: 'bg-neon-purple/10 text-brand-light' },
    { name: 'Grammar', href: '/grammar', icon: FileText, color: 'bg-pink-500/10 text-pink-400' },
    { name: 'Kanji', href: '/kanji', icon: PenTool, color: 'bg-amber-500/10 text-amber-400' },
    { name: 'Listening', href: '/listening', icon: Volume2, color: 'bg-sky-500/10 text-sky-400' },
    { name: 'Speaking', href: '/speaking', icon: Mic, color: 'bg-emerald-500/10 text-emerald-400' },
    { name: 'Review', href: '/review', icon: Brain, color: 'bg-rose-500/10 text-rose-400' },
  ];

  const weeklyData = [
    { day: 'Mon', value: dbData?.heatmap?.[0]?.xp ?? 15 },
    { day: 'Tue', value: dbData?.heatmap?.[1]?.xp ?? 25 },
    { day: 'Wed', value: dbData?.heatmap?.[2]?.xp ?? 10 },
    { day: 'Thu', value: dbData?.heatmap?.[3]?.xp ?? 35 },
    { day: 'Fri', value: dbData?.heatmap?.[4]?.xp ?? 20 },
    { day: 'Sat', value: dbData?.heatmap?.[5]?.xp ?? 0 },
    { day: 'Sun', value: xpToday },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8">
      {/* Greeting */}
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
          {greeting}, <span className="bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent">{userName}</span> 👋
        </h1>
        <p className="text-purple-300/45 text-sm font-medium">
          Keep pushing forward — consistency is the key to mastery.
        </p>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Daily Goal Ring */}
        <Card variant="glass" padding="md" className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
          <ProgressRing value={dailyProgress} size={90} strokeWidth={7}>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-white font-orbitron">{xpToday}</span>
              <span className="text-[8px] text-purple-300/40 font-bold">/ {dailyGoalXp} XP</span>
            </div>
          </ProgressRing>
          <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-wider">Daily Goal</span>
        </Card>

        {/* Streak */}
        <Card variant="glass" padding="md" className="flex flex-col items-center justify-center gap-1">
          <Flame className="w-6 h-6 text-amber-400 fill-amber-500" />
          <span className="text-2xl font-bold text-white font-orbitron">{streak}</span>
          <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-wider">Day Streak</span>
        </Card>

        {/* Level */}
        <Card variant="glass" padding="md" className="flex flex-col items-center justify-center gap-1">
          <TrendingUp className="w-6 h-6 text-brand-light" />
          <span className="text-2xl font-bold text-white font-orbitron">Lv.{level}</span>
          <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-wider">{xpTotal} Total XP</span>
        </Card>

        {/* JLPT Target */}
        <Card variant="glass" padding="md" className="flex flex-col items-center justify-center gap-1">
          <Target className="w-6 h-6 text-neon-pink" />
          <span className="text-2xl font-bold text-white font-orbitron">{jlptTarget}</span>
          <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-wider">JLPT Goal</span>
        </Card>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Continue Learning */}
          <motion.div variants={item}>
            <Card variant="gradient" padding="lg" className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <Badge variant="pink" size="sm" icon={<Play className="w-3 h-3" />}>Continue Learning</Badge>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {jlptTarget} — Lesson {lessonsDone + 1}
                  </h3>
                  <p className="text-sm text-purple-200/50 mt-1">Pick up where you left off</p>
                </div>
                <ProgressBar value={Math.min(100, lessonsDone * 10)} label="Course Progress" showLabel />
                <Link href="/jlpt">
                  <button className="btn btn-primary btn-sm mt-2 cursor-pointer">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em]">Quick Actions</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <Card variant="glass" padding="sm" className="flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-[1.03] transition-transform">
                    <div className={`p-2.5 rounded-xl ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white">{action.name}</span>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md">
              <WeeklyChart data={weeklyData} label="Weekly Activity" unit="XP" />
            </Card>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Learning Stats */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md" className="space-y-4">
              <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em]">Statistics</h3>
              <div className="space-y-3">
                {[
                  { label: 'Lessons Done', value: lessonsDone, icon: BookOpen, color: 'text-brand-light' },
                  { label: 'Words Learned', value: wordsLearned, icon: BookOpen, color: 'text-pink-400' },
                  { label: 'Kanji Learned', value: kanjiLearned, icon: PenTool, color: 'text-amber-400' },
                  { label: 'Reviews Done', value: profile?.reviews_done ?? 0, icon: Brain, color: 'text-emerald-400' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                    <div className="flex items-center gap-2.5">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs text-purple-200/60 font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-white font-orbitron">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* AI Tutor Card */}
          <motion.div variants={item}>
            <Link href="/ai-tutor">
              <Card variant="neon" padding="md" className="space-y-3 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-neon-pink/15 group-hover:bg-neon-pink/25 transition-colors">
                    <Sparkles className="w-5 h-5 text-neon-pink" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sakura AI Tutor</h4>
                    <p className="text-[10px] text-purple-300/40">Ask anything about Japanese</p>
                  </div>
                </div>
                <p className="text-xs text-purple-200/40 leading-relaxed">
                  Get instant help with grammar, vocabulary, pronunciation, and conversation practice.
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-neon-pink">
                  <span>Start chatting</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Achievements Preview */}
          <motion.div variants={item}>
            <Link href="/achievements">
              <Card variant="glass" padding="md" className="space-y-3 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em]">Achievements</h3>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-300/30" />
                </div>
                <div className="flex gap-2">
                  {['🏆', '⭐', '🔥', '📚', '🎯'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.04] flex items-center justify-center text-lg">
                      {emoji}
                    </div>
                  ))}
                </div>
              </Card>
            </Link>
          </motion.div>

          {/* Premium Banner */}
          {!profile?.isPremium && (
            <motion.div variants={item}>
              <Link href="/billing">
                <Card variant="glass" padding="md" className="cursor-pointer bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 border-neon-purple/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span className="text-sm font-bold text-white">Upgrade to Pro</span>
                  </div>
                  <p className="text-xs text-purple-300/40">Unlock unlimited lessons, AI chats, and more</p>
                </Card>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
