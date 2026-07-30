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
        <Card variant="gradient" padding="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-neon-pink/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
            {/* Avatar with edit indicator */}
            <div className="relative group">
              <div className="group-hover:shadow-[0_0_24px_rgba(109,60,255,0.25)] rounded-full transition-all duration-300">
                <Avatar
                  name={userName}
                  emoji={profile?.avatarUrl}
                  size="xl"
                  level={level}
                  showLevel
                />
              </div>
              <Link href="/settings" className="absolute -bottom-0.5 -right-0.5 p-1.5 rounded-full bg-[#12101D] border border-white/[0.1] hover:border-neon-purple/30 hover:bg-neon-purple/15 transition-all cursor-pointer z-10 opacity-0 group-hover:opacity-100">
                <PenTool className="w-3 h-3 text-purple-300/60" />
              </Link>
            </div>

            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h1 className="text-2xl font-extrabold text-white font-orbitron">{userName}</h1>
                <p className="text-sm text-purple-300/40 mt-0.5">{userEmail}</p>
              </div>
              <p className="text-sm text-purple-200/50 italic">{bio}</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <Badge variant="neon" size="sm" icon={<Zap className="w-3 h-3" />}>
                  {xpTotal.toLocaleString()} XP
                </Badge>
                <Badge variant="amber" size="sm" icon={<Flame className="w-3 h-3 fill-amber-500" />}>
                  {streak} day streak
                </Badge>
                <Badge variant="purple" size="sm">
                  {jlptTarget}
                </Badge>
                {joinedDate && (
                  <Badge variant="default" size="sm" icon={<Calendar className="w-3 h-3" />}>
                    Joined {new Date(joinedDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </Badge>
                )}
              </div>
              {/* Level Progress */}
              <ProgressBar value={calcLevelProgress()} label={`Level ${level}`} showLabel size="md" />
            </div>

            {/* Settings link */}
            <Link href="/settings" className="hidden md:flex p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all">
              <Settings className="w-5 h-5 text-purple-300/50" />
            </Link>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Lessons', value: lessonsDone, icon: BookOpen, color: 'text-brand-light' },
          { label: 'Words', value: wordsLearned, icon: BookOpen, color: 'text-neon-pink' },
          { label: 'Kanji', value: kanjiLearned, icon: PenTool, color: 'text-amber-400' },
          { label: 'Reviews', value: reviewsDone, icon: Brain, color: 'text-emerald-400' },
        ].map(stat => (
          <Card key={stat.label} variant="glass" padding="md" className="flex flex-col items-center gap-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-xl font-bold text-white font-orbitron">{stat.value}</span>
            <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-wider">{stat.label}</span>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Activity Calendar */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md" className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em]">Study Calendar</h3>
                <Badge variant="default" size="sm" icon={<Calendar className="w-3 h-3" />}>12 weeks</Badge>
              </div>
              <HeatmapCalendar data={heatmapData} weeks={12} />
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em]">Badges Earned</h3>
                <Link href="/achievements" className="text-xs text-brand-light hover:text-neon-pink flex items-center gap-1">
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-purple/20 transition-all">
                    <BadgeIcon type={badge.id} unlocked size="md" />
                    <span className="text-[11px] font-bold text-white text-center">{badge.name}</span>
                    <span className="text-[9px] text-purple-300/30 text-center">{badge.desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Links */}
          <motion.div variants={item}>
            <Card variant="glass" padding="none" className="divide-y divide-white/[0.03]">
              {[
                { name: 'Settings', href: '/settings', icon: Settings },
                { name: 'Subscription', href: '/billing', icon: CreditCard },
                { name: 'Progress', href: '/progress', icon: BarChart3 },
                { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
              ].map(link => (
                <Link key={link.name} href={link.href}
                  className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-purple-300/40" />
                    <span className="text-sm font-medium text-white">{link.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-300/20" />
                </Link>
              ))}
            </Card>
          </motion.div>

          {/* JLPT Goal Card */}
          <motion.div variants={item}>
            <Card variant="glass" padding="md" className="flex flex-col items-center gap-3">
              <ProgressRing value={35} size={100} strokeWidth={8} label={jlptTarget} />
              <div className="text-center">
                <p className="text-xs font-semibold text-white">JLPT Readiness</p>
                <p className="text-[10px] text-purple-300/40">Keep studying to improve!</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
