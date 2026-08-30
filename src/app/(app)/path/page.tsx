'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Map, Star, CheckCircle2, Lock, Play, ChevronRight, 
  Sparkles, Award, BookOpen, Flame, Compass
} from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon, MFIconType } from '@/components/ui/MFIcon';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthModal } from '@/components/shared/AuthModal';

interface UnitNode {
  id: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  iconName: MFIconType;
  level: string;
  totalLessons: number;
  completedLessons: number;
  starsEarned: number;
  status: 'completed' | 'current' | 'locked';
  href: string;
}

const LEARNING_UNITS: UnitNode[] = [
  {
    id: 'u1',
    unitNumber: 1,
    title: 'Foundations & Greetings',
    subtitle: 'Hiragana basics, introductions, and everyday greetings',
    iconName: 'hiragana',
    level: 'JLPT N5',
    totalLessons: 5,
    completedLessons: 5,
    starsEarned: 3,
    status: 'completed',
    href: '/script',
  },
  {
    id: 'u2',
    unitNumber: 2,
    title: 'Essential Daily Vocabulary',
    subtitle: 'Food, objects, numbers, and basic time expressions',
    iconName: 'vocabulary',
    level: 'JLPT N5',
    totalLessons: 6,
    completedLessons: 4,
    starsEarned: 2,
    status: 'current',
    href: '/vocabulary',
  },
  {
    id: 'u3',
    unitNumber: 3,
    title: 'Core Grammar & Particles',
    subtitle: 'Master は (wa), が (ga), を (wo), and polite です/ます forms',
    iconName: 'grammar',
    level: 'JLPT N5',
    totalLessons: 8,
    completedLessons: 2,
    starsEarned: 1,
    status: 'current',
    href: '/grammar',
  },
  {
    id: 'u4',
    unitNumber: 4,
    title: 'First 50 Essential Kanji',
    subtitle: 'Numbers, dates, directions, and basic nature kanji',
    iconName: 'kanji',
    level: 'JLPT N5',
    totalLessons: 10,
    completedLessons: 0,
    starsEarned: 0,
    status: 'locked',
    href: '/kanji',
  },
  {
    id: 'u5',
    unitNumber: 5,
    title: 'Listening & Conversation',
    subtitle: 'Everyday dialogues, asking questions, and restaurant ordering',
    iconName: 'listening',
    level: 'JLPT N5',
    totalLessons: 6,
    completedLessons: 0,
    starsEarned: 0,
    status: 'locked',
    href: '/listening',
  },
  {
    id: 'u6',
    unitNumber: 6,
    title: 'N5 Mock Exam & Milestone',
    subtitle: 'Timed multi-skill examination with score certificate',
    iconName: 'trophy',
    level: 'JLPT N5',
    totalLessons: 1,
    completedLessons: 0,
    starsEarned: 0,
    status: 'locked',
    href: '/quiz',
  },
];

export default function PathPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const { requireAuth } = useAuthModal();

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-7 md:space-y-9 max-w-4xl mx-auto pb-14"
    >
      {/* Top Banner */}
      <motion.div variants={item}>
        <MFCard variant="sakura" washiTape="pink" padding="lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
                <Compass className="w-4 h-4 text-brand" />
                <span>Structured Journey</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
                Japanese Learning Path
              </h1>
              <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
                Step-by-step curriculum guiding you from total beginner to JLPT mastery. Complete units to unlock advanced modules!
              </p>
            </div>

            <div className="px-4 py-2 bg-card border border-edge rounded-2xl text-xs font-black text-ink shadow-sm shrink-0">
              Unit 2 / 6 In Progress
            </div>
          </div>
        </MFCard>
      </motion.div>

      {/* Path Roadmap Timeline */}
      <motion.div variants={container} className="space-y-4 relative">
        {/* Central Connecting Guide Line */}
        <div className="absolute left-6 top-8 bottom-8 w-1 bg-edge/60 hidden sm:block pointer-events-none rounded-full" />

        {LEARNING_UNITS.map((unit, idx) => {
          const isCompleted = unit.status === 'completed';
          const isCurrent = unit.status === 'current';
          const isLocked = unit.status === 'locked';

          const cardVariant = isCompleted ? 'mint' : isCurrent ? 'yellow' : 'paper';

          return (
            <motion.div key={unit.id} variants={item} className="relative sm:pl-16">
              {/* Unit Step Indicator on timeline */}
              <div className={`hidden sm:flex absolute left-2.5 top-6 -translate-x-1/2 w-8 h-8 rounded-full items-center justify-center font-heading font-black text-xs border-2 z-10 ${
                isCompleted ? 'bg-mint text-white border-mint shadow-sm' :
                isCurrent ? 'bg-brand text-white border-brand shadow-md scale-110' :
                'bg-cream text-ink-muted border-edge'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4 stroke-[3]" /> : unit.unitNumber}
              </div>

              <MFCard
                variant={cardVariant}
                lifted={!isLocked}
                padding="md"
                className={`border-[2px] ${isLocked ? 'opacity-60' : 'cursor-pointer hover:border-brand/40'}`}
                onClick={() => {
                  if (isLocked) return;
                  requireAuth(() => router.push(unit.href), unit.title);
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-card/80 border border-edge text-brand shadow-sm shrink-0">
                      <MFIcon name={unit.iconName} size={26} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-card/80 border border-edge text-ink-muted uppercase tracking-wider">
                          Unit {unit.unitNumber} • {unit.level}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-mint text-white">
                            COMPLETED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-brand text-white animate-pulse">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-extrabold text-ink font-heading">
                        {unit.title}
                      </h3>
                      <p className="text-xs text-ink-secondary font-medium">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Progress */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 border-dashed border-edge pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-ink block">
                        {unit.completedLessons} / {unit.totalLessons} Lessons
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 3 }).map((_, sIdx) => (
                          <Star
                            key={sIdx}
                            className={`w-3.5 h-3.5 ${sIdx < unit.starsEarned ? 'text-orange fill-orange' : 'text-edge fill-edge'}`}
                          />
                        ))}
                      </div>
                    </div>

                    {isLocked ? (
                      <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-cream border border-edge text-ink-muted text-xs font-bold">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </div>
                    ) : (
                      <MFButton
                        variant={isCurrent ? 'primary' : 'secondary'}
                        size="sm"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        {isCompleted ? 'Review' : 'Continue'}
                      </MFButton>
                    )}
                  </div>
                </div>
              </MFCard>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
