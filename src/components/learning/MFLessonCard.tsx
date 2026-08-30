'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { MFIcon, MFIconName } from '@/components/ui/WhiteboardIcons';
import { MFProgress } from '@/components/ui/MFProgress';
import { Lock, ChevronRight } from 'lucide-react';

export type LessonStatus = 'locked' | 'available' | 'in-progress' | 'completed';

interface MFLessonCardProps {
  title: string;
  subtitle?: string;
  icon: MFIconName;
  status?: LessonStatus;
  progress?: number;   // 0–100
  xpReward?: number;
  lessonCount?: number;
  onClick?: () => void;
  accent?: string;     // hex color for accent strip
  className?: string;
}

const statusConfig: Record<LessonStatus, {
  badge: string; badgeText: string; opacity: string;
}> = {
  locked:      { badge: 'bg-cream text-ink-muted',   badgeText: 'Locked',      opacity: 'opacity-60' },
  available:   { badge: 'bg-sky-light text-sky',   badgeText: 'Start',       opacity: '' },
  'in-progress':{ badge: 'bg-orange-light text-orange',  badgeText: 'Continue',    opacity: '' },
  completed:   { badge: 'bg-mint-light text-mint',   badgeText: 'Completed ✓', opacity: '' },
};

export function MFLessonCard({
  title,
  subtitle,
  icon,
  status = 'available',
  progress,
  xpReward,
  lessonCount,
  onClick,
  accent = '#FFAEC0',
  className,
}: MFLessonCardProps) {
  const cfg = statusConfig[status];
  const isLocked = status === 'locked';

  return (
    <motion.div
      whileHover={!isLocked ? { y: -3, boxShadow: '0 8px 0px rgba(45,36,38,0.1), 0 12px 24px rgba(0,0,0,0.08)' } : {}}
      whileTap={!isLocked ? { y: 1, scale: 0.99 } : {}}
      onClick={!isLocked ? onClick : undefined}
      className={cn(
        'relative rounded-2xl bg-card border-2 border-edge overflow-hidden transition-all duration-200',
        'shadow-[0_4px_0px_rgba(45,36,38,0.08)]',
        !isLocked && 'cursor-pointer',
        cfg.opacity,
        className
      )}
    >
      {/* Accent strip at top */}
      <div className="h-1.5 w-full" style={{ background: accent }} />

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 relative">
            <MFIcon name={icon} size={52} variant="card" />
            {isLocked && (
              <div className="absolute inset-0 bg-card/70 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-ink-muted" />
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-extrabold text-ink text-sm leading-tight truncate">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-xs text-ink-muted font-medium mt-0.5 truncate">{subtitle}</p>
                )}
              </div>
              <ChevronRight className={cn('w-4 h-4 flex-shrink-0 mt-0.5 transition-colors', isLocked ? 'text-ink-light' : 'text-ink-muted')} />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={cn('text-[10px] font-extrabold px-2 py-0.5 rounded-full', cfg.badge)}>
                {cfg.badgeText}
              </span>
              {xpReward && !isLocked && (
                <span className="text-[10px] font-bold text-orange bg-orange-light px-2 py-0.5 rounded-full">
                  ⚡ {xpReward} XP
                </span>
              )}
              {lessonCount && (
                <span className="text-[10px] font-medium text-ink-light">
                  {lessonCount} lessons
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {progress !== undefined && !isLocked && (
          <div className="mt-3">
            <MFProgress
              value={progress}
              color={
                status === 'completed' ? 'mint' :
                status === 'in-progress' ? 'sakura' : 'sky'
              }
              size="sm"
              animated
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Category Grid (multiple lesson cards) ───────────────────────────────────

interface LessonCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: MFIconName;
  status: LessonStatus;
  progress?: number;
  xpReward?: number;
  lessonCount?: number;
  accent?: string;
}

interface MFLessonGridProps {
  categories: LessonCategory[];
  onSelect: (id: string) => void;
  columns?: 1 | 2;
  className?: string;
}

export function MFLessonGrid({ categories, onSelect, columns = 2, className }: MFLessonGridProps) {
  return (
    <div className={cn(
      'grid gap-3',
      columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1',
      className
    )}>
      {categories.map((cat, i) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
        >
          <MFLessonCard
            title={cat.title}
            subtitle={cat.subtitle}
            icon={cat.icon}
            status={cat.status}
            progress={cat.progress}
            xpReward={cat.xpReward}
            lessonCount={cat.lessonCount}
            accent={cat.accent}
            onClick={() => onSelect(cat.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}
