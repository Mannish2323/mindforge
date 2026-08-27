'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import {
  Zap, Flame, BookOpen, Brain, CreditCard,
  Settings, Calendar, Award, TrendingUp, PenTool,
  ChevronRight, Clock, Bookmark, BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { HeatmapCalendar } from '@/components/charts/HeatmapCalendar';
import { BadgeIcon } from '@/components/ui/BadgeIcons';

export default function ProfilePage() {
  const { user, profile } = useAuth();

  const userName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner';
  const userEmail = user?.email || '';
  const xpTotal = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const jlptTarget = profile?.jlpt_target || 'N5';
  const wordsLearned = profile?.words_learned ?? 0;
  const kanjiLearned = profile?.kanji_learned ?? 0;
  const lessonsDone = profile?.lessons_done ?? 0;
  const reviewsDone = profile?.reviews_done ?? 0;
  const bio = profile?.bio || 'Learning Japanese one step at a time.';
  const joinedDate = profile?.createdAt || user?.created_at;

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

  // Heatmap data (simulated)
  const heatmapData = Array.from({ length: 84 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (83 - i));
    return { date: date.toISOString().split('T')[0], value: Math.random() > 0.35 ? Math.floor(Math.random() * 40) + 5 : 0 };
  });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8">
      {/* Profile Header */}
      <motion.div variants={item}>
        <Card variant="gradient" padding="lg" className="relative overflow-hidden bg-gradient-to-br from-brand/5 to-accent/5">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar */}
            <div className="relative group">
              <div className="group-hover:shadow-lg rounded-full transition-all duration-300">
                <Avatar
                  name={userName}
                  emoji={profile?.avatarUrl}
                  size="xl"
                  level={level}
                  showLevel
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-2xl font-extrabold text-ink font-heading">{userName}</h1>
              <p className="text-sm text-ink-muted">{bio}</p>
              <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <Badge variant="purple" size="sm">JLPT {jlptTarget}</Badge>
                <Badge variant="amber" size="sm" icon={<Flame className="w-3 h-3 fill-cat-orange text-cat-orange" />}>{streak} day streak</Badge>
                <Badge variant="emerald" size="sm" icon={<Zap className="w-3 h-3" />}>{xpTotal} XP</Badge>
              </div>
            </div>

            {/* Level Ring */}
            <div className="flex-shrink-0">
              <ProgressRing value={calcLevelProgress()} size={80} strokeWidth={6}>
                <div className="flex flex-col items-center">
                  <span className="text-base font-bold text-ink font-heading">Lv.{level}</span>
                  <span className="text-[8px] text-ink-muted font-bold">{calcLevelProgress()}%</span>
                </div>
              </ProgressRing>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Lessons Done', value: lessonsDone, icon: BookOpen, color: 'text-cat-purple', bg: 'bg-cat-purple-light' },
          { label: 'Words Learned', value: wordsLearned, icon: BookOpen, color: 'text-cat-blue', bg: 'bg-cat-blue-light' },
          { label: 'Kanji Learned', value: kanjiLearned, icon: PenTool, color: 'text-cat-orange', bg: 'bg-cat-orange-light' },
          { label: 'Reviews Done', value: reviewsDone, icon: Brain, color: 'text-cat-green', bg: 'bg-cat-green-light' },
        ].map((stat) => (
          <Card key={stat.label} variant="glass" padding="md" className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <span className="text-xl font-bold text-ink font-heading">{stat.value}</span>
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider text-center">{stat.label}</span>
          </Card>
        ))}
      </motion.div>

      {/* Achievements */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Achievements</h3>
            <Link href="/achievements" className="text-xs font-bold text-brand hover:text-accent transition-colors">
              View All <ChevronRight className="w-3 h-3 inline" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {earnedBadges.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-1.5 p-3">
                <BadgeIcon type={badge.id} unlocked size="md" />
                <span className="text-[10px] font-bold text-ink text-center">{badge.name}</span>
                <span className="text-[9px] text-ink-muted text-center">{badge.desc}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-3">
          <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Activity</h3>
          <HeatmapCalendar data={heatmapData} />
        </Card>
      </motion.div>

      {/* Settings & Links */}
      <motion.div variants={item}>
        <Card variant="glass" padding="none">
          {[
            { label: 'My Goals', icon: TrendingUp, href: '/progress', color: 'text-cat-purple' },
            { label: 'Bookmarks', icon: Bookmark, href: '/bookmarks', color: 'text-cat-blue' },
            { label: 'Notifications', icon: Calendar, href: '/settings', color: 'text-cat-orange' },
            { label: 'Account Settings', icon: Settings, href: '/settings', color: 'text-ink-muted' },
            { label: 'Subscription', icon: CreditCard, href: '/billing', color: 'text-cat-green' },
          ].map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-6 py-4 hover:bg-warm-cream transition-colors ${i < 4 ? 'border-b border-edge' : ''}`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-sm font-medium text-ink">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink-light" />
            </Link>
          ))}
        </Card>
      </motion.div>
    </motion.div>
  );
}
