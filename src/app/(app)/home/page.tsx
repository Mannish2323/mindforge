'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame, Zap, BookOpen, Brain, Sparkles, Mic, PenTool, Volume2,
  ChevronRight, Award, Play, Clock, Map, FileText, Trophy,
  Target, TrendingUp, Calendar, ArrowRight, CheckCircle2, Star
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthModal } from '@/components/shared/AuthModal';
import { motion } from 'framer-motion';
import { useDashboard } from '@/hooks/useDashboard';
import { useRouter } from 'next/navigation';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon, MFIconType } from '@/components/ui/MFIcon';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { WeeklyChart } from '@/components/charts/WeeklyChart';
import { BadgeIcon } from '@/components/ui/BadgeIcons';
import { Mascot } from '@/components/mascot/Mascot';
import { MFXPDisplay, MFLevelBadge } from '@/components/ui/MFXPDisplay';
import { MFStreakCard } from '@/components/ui/MFStreakCard';
import { MFProgress } from '@/components/ui/MFProgress';

// Quick Access — Japanese Alphabet Icons
const quickAccess = [
  { iconName: 'hiragana' as MFIconType, sub: 'Hiragana', href: '/script', bg: 'bg-brand-light border-brand/30', text: 'text-brand' },
  { iconName: 'katakana' as MFIconType, sub: 'Katakana', href: '/script', bg: 'bg-mint-light border-mint/30', text: 'text-ink' },
  { iconName: 'kanji' as MFIconType, sub: 'Kanji', href: '/kanji', bg: 'bg-yellow-light border-yellow/30', text: 'text-ink' },
  { iconName: 'vocabulary' as MFIconType, sub: 'Vocab', href: '/vocabulary', bg: 'bg-lavender-light border-lavender/30', text: 'text-lavender' },
  { iconName: 'listening' as MFIconType, sub: 'Listen', href: '/listening', bg: 'bg-sky-light border-sky/30', text: 'text-ink' },
  { iconName: 'speaking' as MFIconType, sub: 'Speak', href: '/speaking', bg: 'bg-orange-light border-orange/30', text: 'text-ink' },
  { iconName: 'ai-tutor' as MFIconType, sub: 'AI Tutor', href: '/ai-tutor', bg: 'bg-brand-light border-brand/20', text: 'text-brand' },
  { iconName: 'quiz' as MFIconType, sub: 'Quiz', href: '/quiz', bg: 'bg-yellow-light border-yellow/30', text: 'text-ink' },
];

export default function HomePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const { requireAuth } = useAuthModal();
  const { data: dbData, isLoading } = useDashboard();
  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 5) setGreeting('Good Night');
    else if (hours < 12) setGreeting('Good Morning');
    else if (hours < 17) setGreeting('Good Afternoon');
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
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 140, damping: 18 } },
  };

  // Study note cards with MFIcon & Centralized Theme Tokens
  const studyNotes = [
    {
      name: 'Hiragana',
      subtitle: 'Basic Syllabary',
      jp: 'あ い う え お',
      count: '46 characters',
      variant: 'sakura' as const,
      tagBg: 'bg-brand-light text-brand border border-brand/30',
      href: '/script',
      iconName: 'hiragana' as MFIconType,
      washi: 'pink' as const,
    },
    {
      name: 'Katakana',
      subtitle: 'Foreign Words',
      jp: 'カ キ ク ケ コ',
      count: '46 characters',
      variant: 'mint' as const,
      tagBg: 'bg-mint-light text-ink border border-mint/30',
      href: '/script',
      iconName: 'katakana' as MFIconType,
      washi: 'mint' as const,
    },
    {
      name: 'Kanji',
      subtitle: 'Core Characters',
      jp: '日 本 語 学',
      count: 'N5 Essential',
      variant: 'yellow' as const,
      tagBg: 'bg-yellow-light text-ink border border-yellow/30',
      href: '/kanji',
      iconName: 'kanji' as MFIconType,
      washi: 'yellow' as const,
    },
    {
      name: 'Vocabulary',
      subtitle: 'Daily Expressions',
      jp: 'こんにちは',
      count: '120+ words',
      variant: 'lavender' as const,
      tagBg: 'bg-lavender-light text-ink border border-lavender/30',
      href: '/vocabulary',
      iconName: 'vocabulary' as MFIconType,
      washi: 'lavender' as const,
    },
  ];

  // Practice topics
  const practiceItems = [
    { name: 'Vocabulary', href: '/vocabulary', iconName: 'vocabulary' as MFIconType, tag: 'Spaced Repetition', color: 'bg-brand-light border-brand/30 text-brand' },
    { name: 'Grammar', href: '/grammar', iconName: 'grammar' as MFIconType, tag: 'N5 Patterns', color: 'bg-mint-light border-mint/30 text-ink' },
    { name: 'Kanji Flashcards', href: '/kanji', iconName: 'kanji' as MFIconType, tag: 'Stroke Order', color: 'bg-yellow-light border-yellow/30 text-ink' },
    { name: 'Listening', href: '/listening', iconName: 'listening' as MFIconType, tag: 'Native Audio', color: 'bg-sky-light border-sky/30 text-ink' },
    { name: 'Speaking', href: '/speaking', iconName: 'speaking' as MFIconType, tag: 'Voice Practice', color: 'bg-lavender-light border-lavender/30 text-ink' },
    { name: 'Smart Review', href: '/review', iconName: 'review' as MFIconType, tag: 'Mistake Vault', color: 'bg-coral-light border-coral/30 text-ink' },
  ];

  // Context study sticky notes
  const contextCards = [
    { title: 'Greetings & Salutations', iconName: 'wave' as MFIconType, jp: 'こんにちは', romaji: 'Konnichiwa', progress: '1 / 5 Lessons', variant: 'yellow' as const },
    { title: 'Everyday Expressions', iconName: 'sparkles' as MFIconType, jp: 'ありがとう', romaji: 'Arigatou', progress: '2 / 5 Lessons', variant: 'mint' as const },
    { title: 'Personal Pronouns', iconName: 'user' as MFIconType, jp: 'わたし', romaji: 'Watashi', progress: '3 / 5 Lessons', variant: 'lavender' as const },
    { title: 'Essential Questions', iconName: 'question' as MFIconType, jp: 'なに？', romaji: 'Nani?', progress: '1 / 5 Lessons', variant: 'sakura' as const },
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
      <div className="space-y-6 max-w-6xl mx-auto">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-7 md:space-y-9 max-w-6xl mx-auto pb-14"
    >
      {/* ── 1. Hero: Mascot Greeting + Daily Goal ─────────────────── */}
      <motion.div variants={item}>
        <MFCard
          variant="sakura"
          washiTape="pink"
          padding="lg"
          className="overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Mascot (floating) */}
            <div className="shrink-0 flex flex-col items-center gap-2">
              <div className="p-3 rounded-2xl bg-card/80 border border-brand/30 shadow-sm mascot-float">
                <Mascot
                  expression={dailyProgress >= 100 ? 'celebrating' : dailyProgress >= 50 ? 'happy' : 'encouraging'}
                  size={96}
                  animate
                />
              </div>
              {/* JP greeting tag */}
              <div className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20">
                <span className="text-xs font-extrabold text-brand font-jp">
                  {new Date().getHours() < 12 ? 'おはようございます' : new Date().getHours() < 17 ? 'こんにちは' : 'こんばんは'}
                </span>
              </div>
            </div>

            {/* Greeting & Learning Status */}
            <div className="flex-1 text-center md:text-left space-y-2.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-ink tracking-tight">
                  {greeting}, <span className="text-brand">{userName.split(' ')[0]}</span>!
                </h1>
                <MFLevelBadge level={level} size="sm" />
              </div>

              <p className="text-sm text-ink-secondary font-medium leading-relaxed max-w-md">
                {dailyProgress >= 100
                  ? 'Daily goal complete! You\'re on a roll — keep it up!'
                  : 'Ready for today\'s bite-sized Japanese practice? Let\'s begin!'}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
                <MFXPDisplay xp={xpTotal} size="sm" />
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-light border border-orange/30 shadow-sm">
                  <MFIcon name="flame" size={15} />
                  <span className="text-xs font-extrabold text-orange">{streak} Day Streak</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-light border border-lavender/30 text-xs font-bold text-lavender shadow-sm">
                  <MFIcon name="shield" size={14} />
                  <span>Target: {jlptTarget}</span>
                </div>
              </div>
            </div>

            {/* Daily Goal Card */}
            <div className="w-full md:w-60 bg-card/90 p-4 rounded-2xl border border-brand/20 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-ink-muted uppercase tracking-wider">Today&apos;s Goal</span>
                <span className="font-extrabold text-brand">{xpToday} / {dailyGoalXp} XP</span>
              </div>
              {/* Ring-style progress bar */}
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border-subtle)" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="var(--color-primary)" strokeWidth="3"
                    strokeDasharray={`${dailyProgress} 100`}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black font-heading text-ink">{dailyProgress}%</span>
                  <span className="text-[10px] font-bold text-ink-muted">done</span>
                </div>
              </div>
              <MFButton
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => requireAuth(() => router.push('/jlpt'), 'Continue Learning')}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Continue Lesson
              </MFButton>
            </div>
          </div>
        </MFCard>
      </motion.div>

      {/* ── 2. Quick Access — Japanese Alphabet Icons ─────────────── */}
      <motion.div variants={item}>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {quickAccess.map((item) => (
            <Link key={item.iconName} href={item.href}>
              <motion.div
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-[1.5px] cursor-pointer ${item.bg} shadow-[var(--paper-press-shadow)]`}
              >
                <MFIcon name={item.iconName} size={28} />
                <span className="text-[10px] font-extrabold text-ink-secondary">{item.sub}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── 3. Study Notebooks Grid: Hiragana, Katakana, Kanji, Vocabulary ──── */}
      <motion.div variants={item} className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MFIcon name="learn" size={22} />
            <h2 className="font-heading font-extrabold text-lg text-ink tracking-tight">
              Japanese Study Notebooks
            </h2>
          </div>
          <span className="text-xs font-bold text-ink-muted">Click note to study</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studyNotes.map((note) => (
            <Link key={note.name} href={note.href} className="block h-full">
              <MFCard
                variant={note.variant}
                washiTape={note.washi}
                lifted
                padding="md"
                className="h-full flex flex-col justify-between cursor-pointer border-[2px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <MFIcon name={note.iconName} size={28} />
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${note.tagBg}`}>
                      {note.count}
                    </span>
                  </div>
                  <h3 className="font-heading font-extrabold text-base text-ink">
                    {note.name}
                  </h3>
                  <p className="text-xs text-ink-muted font-medium mb-3">
                    {note.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-edge">
                  <p className="text-xl font-bold font-jp tracking-wider text-ink">
                    {note.jp}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-brand mt-2">
                    <span>Open Note</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </MFCard>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── 3. Main Split Section: Practice Desk & Right Column ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (8 cols): Study Cards & Quick Practice */}
        <div className="lg:col-span-8 space-y-7">
          {/* Words in Context Study Notes */}
          <motion.div variants={item} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MFIcon name="vocabulary" size={20} />
                <h3 className="font-heading font-extrabold text-base text-ink">
                  Words in Context
                </h3>
              </div>
              <span className="text-xs font-bold text-ink-muted">Everyday Japanese</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {contextCards.map((card) => (
                <div
                  key={card.title}
                  onClick={() => requireAuth(() => router.push('/vocabulary'), card.title)}
                  className="cursor-pointer"
                >
                  <MFCard variant={card.variant} lifted padding="md" className="h-full border">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <MFIcon name={card.iconName} size={22} />
                        <span className="font-heading font-bold text-xs text-ink">{card.title}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-card/80 border border-edge text-ink-muted">
                        {card.progress}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-3">
                      <div>
                        <p className="text-xl font-bold font-jp text-ink">{card.jp}</p>
                        <p className="text-[11px] font-medium text-ink-muted italic">{card.romaji}</p>
                      </div>
                      <span className="text-xs font-bold text-brand">Practice →</span>
                    </div>
                  </MFCard>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Practice Quick Actions */}
          <motion.div variants={item} className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MFIcon name="zap" size={20} />
                <h3 className="font-heading font-extrabold text-base text-ink dark:text-ink">
                  Recommended Practice
                </h3>
              </div>
              <span className="text-xs font-bold text-ink-muted dark:text-[#6E6888]">Bite-sized workouts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {practiceItems.map((action) => {
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
                    className="cursor-pointer"
                  >
                    <MFCard variant="paper" lifted padding="sm" className="h-full flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className={`p-1.5 rounded-xl border ${action.color}`}>
                            <MFIcon name={action.iconName} size={20} />
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cream dark:bg-card text-ink-muted dark:text-ink-muted border border-edge dark:border-edge">
                            {action.tag}
                          </span>
                        </div>
                        <h4 className="font-heading font-bold text-xs text-ink dark:text-ink pt-1">
                          {action.name}
                        </h4>
                      </div>
                      <div className="flex items-center justify-end text-[10px] font-bold text-brand pt-2">
                        <span>Start</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </MFCard>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Weekly Study Log Activity */}
          <motion.div variants={item}>
            <MFCard variant="paper" padding="md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand" />
                  <h3 className="font-heading font-extrabold text-sm text-ink dark:text-ink">
                    Weekly Study Log
                  </h3>
                </div>
                <span className="text-xs font-bold text-ink-muted dark:text-ink-muted">XP Earned / Day</span>
              </div>
              <WeeklyChart data={weeklyData} label="Weekly XP" unit="XP" />
            </MFCard>
          </motion.div>
        </div>

        {/* Right Column (4 cols): Streak, Stats, AI Tutor, Pass */}
        <div className="lg:col-span-4 space-y-6">
          {/* Study Streak Card */}
          <motion.div variants={item}>
            <MFStreakCard streak={streak} />
          </motion.div>

          {/* Study Statistics Notebook Sheet */}
          <motion.div variants={item}>
            <MFCard variant="cream" padding="md" className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-edge pb-2.5">
                <h3 className="font-heading font-extrabold text-xs text-ink-muted uppercase tracking-wider">
                  Notebook Statistics
                </h3>
                <span className="text-[11px] font-bold text-brand">Lifetime</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Lessons Completed', value: lessonsDone, iconName: 'learn' as MFIconType, bg: 'bg-lavender-light border border-lavender/30' },
                  { label: 'Words Mastered', value: wordsLearned, iconName: 'vocabulary' as MFIconType, bg: 'bg-brand-light border border-brand/30' },
                  { label: 'Kanji Learned', value: kanjiLearned, iconName: 'kanji' as MFIconType, bg: 'bg-yellow-light border border-yellow/30' },
                  { label: 'Smart Reviews', value: profile?.reviews_done ?? 0, iconName: 'review' as MFIconType, bg: 'bg-mint-light border border-mint/30' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between py-1.5 border-b border-dashed border-edge last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-lg ${stat.bg}`}>
                        <MFIcon name={stat.iconName} size={18} />
                      </div>
                      <span className="text-xs text-ink-secondary font-medium">{stat.label}</span>
                    </div>
                    <span className="text-sm font-extrabold font-heading text-ink">{stat.value}</span>
                  </div>
                ))}
              </div>
            </MFCard>
          </motion.div>

          {/* Sakura AI Tutor Desk Widget */}
          <motion.div variants={item}>
            <div onClick={() => requireAuth(() => router.push('/ai-tutor'), 'Sakura AI Tutor')}>
              <MFCard
                variant="sakura"
                lifted
                padding="md"
                className="cursor-pointer space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-card border border-brand/30 shadow-sm relative overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <Image
                      src="/sakura_ai_avatar.png"
                      alt="Sakura Sensei AI"
                      width={38}
                      height={38}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-ink flex items-center gap-1.5">
                      <span>Sakura-sensei AI</span>
                      <Sparkles className="w-3.5 h-3.5 text-brand" />
                    </h4>
                    <p className="text-[11px] text-ink-muted font-medium">Ask any Japanese question</p>
                  </div>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed font-medium">
                  Practice natural conversations, translate difficult phrases, and get instant grammar explanations.
                </p>
                <div className="flex items-center gap-1 text-xs font-extrabold text-brand pt-1">
                  <span>Chat with Sensei</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </MFCard>
            </div>
          </motion.div>

          {/* Achievements Preview */}
          <motion.div variants={item}>
            <div onClick={() => requireAuth(() => router.push('/achievements'), 'Achievements')}>
              <MFCard variant="paper" lifted padding="md" className="space-y-3 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MFIcon name="trophy" size={20} />
                    <h3 className="font-heading font-extrabold text-xs text-ink-muted uppercase tracking-wider">
                      Stamps & Badges
                    </h3>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-ink-light" />
                </div>
                <div className="flex gap-2 justify-between">
                  {['fire-starter', 'rising-star', 'streak-7', 'bookworm', 'sharpshooter'].map((badgeType) => (
                    <BadgeIcon key={badgeType} type={badgeType} unlocked size="sm" />
                  ))}
                </div>
              </MFCard>
            </div>
          </motion.div>

          {/* Upgrade Pass Banner */}
          {!profile?.isPremium && (
            <motion.div variants={item}>
              <Link href="/billing" className="block">
                <MFCard
                  variant="yellow"
                  lifted
                  padding="md"
                  className="cursor-pointer space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-card flex items-center justify-center p-0.5 shadow-sm">
                      <MFIcon name="star" size={28} />
                    </div>
                    <span className="font-heading font-extrabold text-sm text-ink">
                      MindForge Pro Pass
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted font-medium leading-relaxed">
                    Unlock unlimited daily lessons, unlimited AI chat, and full JLPT N5–N1 mock tests.
                  </p>
                  <div className="text-xs font-extrabold text-orange pt-1">
                    Start 1-Day Free Trial →
                  </div>
                </MFCard>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
