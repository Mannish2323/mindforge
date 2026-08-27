'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame, Zap, BookOpen, Brain, Sparkles, Mic, PenTool, Volume2,
  ChevronRight, Award, Play, Clock, Map, FileText, Trophy,
  Target, TrendingUp, Calendar
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthModal } from '@/components/shared/AuthModal';
import { motion } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { BadgeIcon } from '@/components/ui/BadgeIcons';

export default function HomePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { requireAuth } = useAuthModal();
  const { data: dbData, isLoading } = useDashboard();
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const userName = user ? (profile?.name || 'Learner') : 'Guest Learner';
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
    { name: 'Vocabulary', href: '/vocabulary', icon: BookOpen, color: 'bg-cat-purple-light text-cat-purple', emoji: '📚' },
    { name: 'Grammar', href: '/grammar', icon: FileText, color: 'bg-cat-teal-light text-cat-teal', emoji: '📝' },
    { name: 'Kanji', href: '/kanji', icon: PenTool, color: 'bg-cat-orange-light text-cat-orange', emoji: '✍️' },
    { name: 'Listening', href: '/listening', icon: Volume2, color: 'bg-cat-blue-light text-cat-blue', emoji: '🎧' },
    { name: 'Speaking', href: '/speaking', icon: Mic, color: 'bg-cat-green-light text-cat-green', emoji: '🗣️' },
    { name: 'Review', href: '/review', icon: Brain, color: 'bg-cat-pink-light text-cat-pink', emoji: '🧠' },
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

  // Learning categories
  const learningCategories = [
    { name: 'Hiragana', jp: 'あ い う え お', lessons: '5 lessons', color: 'border-cat-green bg-cat-green-light', textColor: 'text-cat-green', href: '/script' },
    { name: 'Katakana', jp: 'カ キ ク ケ コ', lessons: '5 lessons', color: 'border-cat-blue bg-cat-blue-light', textColor: 'text-cat-blue', href: '/script' },
    { name: 'Kanji', jp: '日 本 語 学', lessons: 'Coming soon', color: 'border-cat-purple bg-cat-purple-light', textColor: 'text-cat-purple', href: '/kanji' },
    { name: 'Vocabulary', jp: 'こんにちは', lessons: 'Everyday words', color: 'border-cat-orange bg-cat-orange-light', textColor: 'text-cat-orange', href: '/vocabulary' },
  ];

  // Words in context
  const contextCards = [
    { title: 'Greetings', emoji: '👋', jp: 'こんにちは', progress: '1 / 5 lessons', color: 'bg-cat-green-light border-cat-green/20' },
    { title: 'Everyday Expressions', emoji: '✨', jp: 'ありがとう', progress: '2 / 5 lessons', color: 'bg-cat-blue-light border-cat-blue/20' },
    { title: 'Personal Pronouns', emoji: '👤', jp: 'わたし', progress: '3 / 5 lessons', color: 'bg-cat-purple-light border-cat-purple/20' },
    { title: 'Question Words', emoji: '❓', jp: 'なに？', progress: '1 / 5 lessons', color: 'bg-cat-orange-light border-cat-orange/20' },
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
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink font-heading">
          {greeting}, <span className="text-brand">{userName}</span> 👋
        </h1>
        <p className="text-ink-muted text-sm font-medium">
          Ready for today&apos;s Japanese? Keep pushing forward!
        </p>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Daily Goal Ring */}
        <Card variant="glass" padding="md" className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
          <ProgressRing value={dailyProgress} size={90} strokeWidth={7}>
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold text-ink font-heading">{xpToday}</span>
              <span className="text-[8px] text-ink-muted font-bold">/ {dailyGoalXp} XP</span>
            </div>
          </ProgressRing>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Daily Goal</span>
        </Card>

        {/* Streak */}
        <Card variant="glass" padding="md" className="flex flex-col items-center justify-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-cat-orange-light flex items-center justify-center">
            <Flame className="w-5 h-5 text-cat-orange fill-cat-orange" />
          </div>
          <span className="text-2xl font-bold text-ink font-heading">{streak}</span>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">Day Streak</span>
        </Card>

        {/* Level */}
        <Card variant="glass" padding="md" className="flex flex-col items-center justify-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-cat-purple-light flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-cat-purple" />
          </div>
          <span className="text-2xl font-bold text-ink font-heading">Lv.{level}</span>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">{xpTotal} Total XP</span>
        </Card>

        {/* JLPT Target */}
        <Card variant="glass" padding="md" className="flex flex-col items-center justify-center gap-1">
          <div className="w-10 h-10 rounded-xl bg-cat-pink-light flex items-center justify-center">
            <Target className="w-5 h-5 text-cat-pink" />
          </div>
          <span className="text-2xl font-bold text-ink font-heading">{jlptTarget}</span>
          <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">JLPT Goal</span>
        </Card>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Daily Progress Card */}
          <motion.div variants={item}>
            <Card variant="gradient" padding="lg" className="relative overflow-hidden group bg-gradient-to-br from-brand/5 to-accent/5">
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <Badge variant="purple" size="sm" icon={<Target className="w-3 h-3" />}>Today&apos;s Goal 🎯</Badge>
                  <span className="text-sm font-bold text-brand">{xpToday} / {dailyGoalXp} XP</span>
                </div>
                <ProgressBar value={dailyProgress} size="lg" color="gradient" />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-ink-muted">{dailyGoalXp - xpToday > 0 ? `${dailyGoalXp - xpToday} XP to go` : '🎉 Goal reached!'}</p>
                  <button
                    onClick={() => requireAuth(() => router.push('/jlpt'), 'Continue Learning')}
                    className="btn btn-primary btn-sm cursor-pointer"
                  >
                    Continue Learning <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Learning Categories — Colourful Cards */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Learn Japanese</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {learningCategories.map((cat) => (
                <Link key={cat.name} href={cat.href}>
                  <Card variant="category" padding="md" color={cat.color} className={`cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 ${cat.color}`}>
                    <p className={`text-xs font-bold ${cat.textColor} mb-1`}>{cat.name}</p>
                    <p className="text-xl font-bold text-ink font-jp leading-tight">{cat.jp}</p>
                    <p className="text-[11px] text-ink-muted mt-2">{cat.lessons}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Words in Context */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Learn words in context</h3>
            <div className="grid grid-cols-2 gap-3">
              {contextCards.map((card) => (
                <Card key={card.title} variant="glass" padding="md" className={`cursor-pointer hover:shadow-lg transition-all ${card.color} border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{card.emoji}</span>
                    <span className="text-xs font-bold text-ink">{card.title}</span>
                  </div>
                  <p className="text-lg font-bold text-ink font-jp">{card.jp}</p>
                  <p className="text-[11px] text-ink-muted mt-1">{card.progress}</p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="space-y-3">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {quickActions.map((action) => {
                const isBrowsingAllowed = action.href === '/vocabulary' || action.href === '/grammar';
                return (
                  <div
                    key={action.name}
                    onClick={() => {
                      if (isBrowsingAllowed) {
                        router.push(action.href);
                      } else {
                        requireAuth(() => router.push(action.href), action.name);
                      }
                    }}
                  >
                    <Card variant="glass" padding="sm" className="flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-[1.03] transition-transform">
                      <div className={`p-2.5 rounded-xl ${action.color}`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-bold text-ink">{action.name}</span>
                    </Card>
                  </div>
                );
              })}
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
          {/* Streak Card */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md" className="bg-gradient-to-br from-cat-orange-light to-cat-yellow-light border-cat-orange/20">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🔥</div>
                <div>
                  <p className="text-2xl font-bold text-ink font-heading">{streak} Day Streak</p>
                  <p className="text-xs text-ink-muted font-medium">Keep it going!</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Learning Stats */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md" className="space-y-4">
              <h3 className="text-xs font-extrabold text-ink-muted uppercase tracking-wider">Statistics</h3>
              <div className="space-y-3">
                {[
                  { label: 'Lessons Done', value: lessonsDone, icon: BookOpen, color: 'text-cat-purple', bg: 'bg-cat-purple-light' },
                  { label: 'Words Learned', value: wordsLearned, icon: BookOpen, color: 'text-cat-pink', bg: 'bg-cat-pink-light' },
                  { label: 'Kanji Learned', value: kanjiLearned, icon: PenTool, color: 'text-cat-orange', bg: 'bg-cat-orange-light' },
                  { label: 'Reviews Done', value: profile?.reviews_done ?? 0, icon: Brain, color: 'text-cat-green', bg: 'bg-cat-green-light' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-2 border-b border-edge last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${stat.bg}`}>
                        <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                      </div>
                      <span className="text-xs text-ink-secondary font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm font-bold text-ink font-heading">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* AI Tutor Card */}
          <motion.div variants={item}>
            <div onClick={() => requireAuth(() => router.push('/ai-tutor'), 'Sakura AI Tutor')}>
              <Card variant="neon" padding="md" className="space-y-3 cursor-pointer group bg-gradient-to-br from-brand/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-sakura-light group-hover:bg-sakura/30 transition-colors">
                    <Sparkles className="w-5 h-5 text-sakura-dark" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-ink">Sakura AI Tutor</h4>
                    <p className="text-[10px] text-ink-muted">Ask anything about Japanese</p>
                  </div>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Get instant help with grammar, vocabulary, pronunciation, and conversation practice.
                </p>
                <div className="flex items-center gap-1 text-xs font-semibold text-brand">
                  <span>Start chatting</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Achievements Preview */}
          <motion.div variants={item}>
            <div onClick={() => requireAuth(() => router.push('/achievements'), 'Achievements')}>
              <Card variant="glass" padding="md" className="space-y-3 cursor-pointer">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-ink-muted uppercase tracking-wider">Achievements</h3>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-light" />
                </div>
                <div className="flex gap-2">
                  {['fire-starter', 'rising-star', 'streak-7', 'bookworm', 'sharpshooter'].map((badgeType) => (
                    <BadgeIcon key={badgeType} type={badgeType} unlocked size="sm" />
                  ))}
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Premium Banner */}
          {!profile?.isPremium && (
            <motion.div variants={item}>
              <Link href="/billing">
                <Card variant="glass" padding="md" className="cursor-pointer bg-gradient-to-br from-brand/5 to-accent/5 border-brand/15 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-cat-orange" />
                    <span className="text-sm font-bold text-ink">Upgrade to Pro</span>
                  </div>
                  <p className="text-xs text-ink-muted">Unlock unlimited lessons, AI chats, and more</p>
                </Card>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
