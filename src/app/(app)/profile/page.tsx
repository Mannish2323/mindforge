'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import {
  Zap, Flame, BookOpen, Brain, CreditCard,
  Settings, Calendar, Award, TrendingUp, PenTool,
  ChevronRight, Clock, Bookmark, BarChart3, HelpCircle, Mail, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MFCard } from '@/components/ui/MFCard';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { HeatmapCalendar } from '@/components/charts/HeatmapCalendar';
import { BadgeIcon } from '@/components/ui/BadgeIcons';
import { MFIcon } from '@/components/ui/MFIcon';
import { SITE_CONFIG } from '@/config/site';

export default function ProfilePage() {
  const { user, profile } = useAuth();

  const userName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner';
  const xpTotal = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const jlptTarget = profile?.jlpt_target || 'N5';
  const wordsLearned = profile?.words_learned ?? 0;
  const kanjiLearned = profile?.kanji_learned ?? 0;
  const lessonsDone = profile?.lessons_done ?? 0;
  const reviewsDone = profile?.reviews_done ?? 0;
  const bio = profile?.bio || 'Learning Japanese one step at a time.';

  const earnedBadges = [
    { id: 'first-lesson', name: 'First Step', desc: 'Complete first lesson' },
    { id: 'fire-starter', name: 'On a Roll', desc: '3-day streak' },
    { id: 'streak-7', name: 'Week Warrior', desc: '7-day streak' },
    { id: 'vocab-master', name: 'Vocab Builder', desc: 'Learn 50 words' },
  ];

  // Level progress calc
  const calcLevelProgress = () => {
    let threshold = 100;
    let accumulated = 0;
    for (let l = 1; l < level; l++) {
      accumulated += threshold;
      threshold += 100;
    }
    const xpInLevel = xpTotal - accumulated;
    return Math.min(100, Math.round((xpInLevel / threshold) * 100));
  };

  // Heatmap data
  const heatmapData = Array.from({ length: 84 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (83 - i));
    return { date: date.toISOString().split('T')[0], value: Math.random() > 0.35 ? Math.floor(Math.random() * 40) + 5 : 0 };
  });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-16">
      {/* Profile Header Card with Sakura Banner */}
      <motion.div variants={item}>
        <MFCard variant="sakura" washiTape="pink" padding="none" className="relative overflow-hidden">
          {/* Header Banner */}
          <div className="relative h-28 sm:h-36 w-full overflow-hidden">
            <Image
              src="/sakura_banner.png"
              alt="Sakura Profile Banner"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>

          <div className="p-6 pt-0 relative z-10 -mt-12 sm:-mt-14">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative group shrink-0 p-1.5 rounded-2xl bg-card border-2 border-brand/30 shadow-md">
                <Avatar
                  src={profile?.avatarUrl || '/sakura_ai_avatar.png'}
                  name={userName}
                  size="xl"
                  level={level}
                  showLevel
                />
              </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-ink dark:text-ink font-heading">
                  {userName}
                </h1>
                {profile?.isPremium && (
                  <span className="px-2.5 py-0.5 rounded-full bg-yellow text-orange text-[10px] font-black tracking-wider uppercase border border-yellow">
                    PRO LEARNER
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-ink-muted dark:text-ink-muted font-medium">{bio}</p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sakura-light dark:bg-sakura-light border border-sakura/40 dark:border-sakura/30 text-xs font-bold text-sakura dark:text-sakura">
                  <MFIcon name="jlpt" size={14} />
                  <span>JLPT {jlptTarget}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-light dark:bg-orange-light border border-yellow dark:border-yellow/30 text-xs font-bold text-orange dark:text-orange">
                  <MFIcon name="flame" size={14} />
                  <span>{streak} Day Streak</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mint-light dark:bg-mint-light border border-mint dark:border-mint/30 text-xs font-bold text-mint dark:text-mint">
                  <MFIcon name="xp" size={14} />
                  <span>{xpTotal} XP</span>
                </div>
              </div>
            </div>

            {/* Level Ring */}
            <div className="shrink-0 flex flex-col items-center p-3 rounded-2xl bg-card/80 dark:bg-card border border-brand/30 dark:border-brand/30 shadow-sm">
              <ProgressRing value={calcLevelProgress()} size={76} strokeWidth={6}>
                <div className="flex flex-col items-center">
                  <span className="text-sm font-black text-ink dark:text-ink font-heading">Lv.{level}</span>
                  <span className="text-[8px] text-ink-muted dark:text-ink-muted font-bold">{calcLevelProgress()}%</span>
                </div>
              </ProgressRing>
            </div>
          </div>
        </div>
      </MFCard>
    </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { label: 'Lessons Completed', value: lessonsDone, iconName: 'reading' as const, color: 'text-sakura dark:text-sakura', bg: 'bg-sakura-light dark:bg-sakura-light border-sakura/40 dark:border-sakura/30' },
          { label: 'Words Mastered', value: wordsLearned, iconName: 'vocabulary' as const, color: 'text-brand dark:text-brand', bg: 'bg-brand-light dark:bg-brand-light border-brand/30 dark:border-brand/30' },
          { label: 'Kanji Learned', value: kanjiLearned, iconName: 'kanji' as const, color: 'text-orange dark:text-[#FFD43B]', bg: 'bg-yellow-light dark:bg-[#3D3314] border-yellow dark:border-yellow/30' },
          { label: 'Reviews Mastered', value: reviewsDone, iconName: 'review' as const, color: 'text-mint dark:text-mint', bg: 'bg-mint-light dark:bg-mint-light border-mint dark:border-mint/30' },
        ].map((stat) => (
          <MFCard key={stat.label} variant="paper" padding="sm" className="flex flex-col items-center gap-1.5 text-center">
            <div className={`p-2 rounded-xl border ${stat.bg}`}>
              <MFIcon name={stat.iconName} size={22} />
            </div>
            <span className="text-xl font-extrabold text-ink dark:text-ink font-heading">{stat.value}</span>
            <span className="text-[10px] font-bold text-ink-muted dark:text-ink-muted uppercase tracking-wider">{stat.label}</span>
          </MFCard>
        ))}
      </motion.div>

      {/* Achievements Card */}
      <motion.div variants={item}>
        <MFCard variant="paper" padding="md" className="space-y-4">
          <div className="flex items-center justify-between border-b border-edge dark:border-edge pb-3">
            <div className="flex items-center gap-2">
              <MFIcon name="trophy" size={20} />
              <h3 className="font-heading font-extrabold text-sm text-ink dark:text-ink uppercase tracking-wider">
                Earned Badges & Stamps
              </h3>
            </div>
            <Link href="/achievements" className="text-xs font-extrabold text-brand hover:underline flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-cream dark:bg-card border border-edge dark:border-edge">
                <BadgeIcon type={badge.id} unlocked size="md" />
                <span className="text-xs font-bold text-ink dark:text-ink text-center">{badge.name}</span>
                <span className="text-[10px] text-ink-muted dark:text-ink-muted text-center font-medium">{badge.desc}</span>
              </div>
            ))}
          </div>
        </MFCard>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div variants={item}>
        <MFCard variant="paper" padding="md" className="space-y-3">
          <div className="flex items-center gap-2 border-b border-edge dark:border-edge pb-3">
            <Calendar className="w-4 h-4 text-brand" />
            <h3 className="font-heading font-extrabold text-sm text-ink dark:text-ink uppercase tracking-wider">
              Study Calendar & Activity
            </h3>
          </div>
          <HeatmapCalendar data={heatmapData} />
        </MFCard>
      </motion.div>

      {/* Navigation & Quick Links */}
      <motion.div variants={item}>
        <MFCard variant="cream" padding="none" className="overflow-hidden">
          {[
            { label: 'My Progress & Goals', icon: TrendingUp, href: '/progress', color: 'text-lavender' },
            { label: 'Saved Bookmarks', icon: Bookmark, href: '/bookmarks', color: 'text-[#1C7ED6]' },
            { label: 'Subscription & 1-Day Trial', icon: CreditCard, href: '/billing', color: 'text-mint' },
            { label: 'Account & Theme Preferences', icon: Settings, href: '/settings', color: 'text-ink-secondary' },
            { label: 'Help & Contact Support', icon: HelpCircle, href: '/settings', color: 'text-brand' },
          ].map((navItem, i) => (
            <Link
              key={navItem.label}
              href={navItem.href}
              className={`flex items-center justify-between px-6 py-4 hover:bg-card/80 dark:hover:bg-[#282435] transition-colors ${
                i < 4 ? 'border-b border-edge dark:border-edge' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <navItem.icon className={`w-4 h-4 ${navItem.color}`} />
                <span className="text-xs sm:text-sm font-bold text-ink dark:text-ink">{navItem.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-light" />
            </Link>
          ))}
        </MFCard>
      </motion.div>
    </motion.div>
  );
}
