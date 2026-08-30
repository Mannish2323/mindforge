'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface MFStreakCardProps {
  streak: number;
  longestStreak?: number;
  weekActivity?: boolean[]; // 7 booleans, Mon–Sun
  compact?: boolean;
  className?: string;
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function MFStreakCard({
  streak,
  longestStreak,
  weekActivity = [true, true, true, false, false, false, false],
  compact = false,
  className,
}: MFStreakCardProps) {
  if (compact) {
    return (
      <div className={cn(
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl',
        'bg-orange-light border-2 border-orange/30',
        'shadow-[0_3px_0px_rgba(255,149,0,0.15)]',
        className
      )}>
        <FlameIcon animated={streak > 0} />
        <div>
          <div className="text-lg font-extrabold text-orange leading-none">{streak}</div>
          <div className="text-[10px] font-bold text-orange uppercase tracking-wide">Day streak</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'mf-card p-5 space-y-4',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-light">
            <FlameIcon animated={streak > 0} />
          </div>
          <div>
            <div className="text-xs font-bold text-ink-muted uppercase tracking-wider">Current Streak</div>
            <div className="text-2xl font-extrabold text-orange leading-none">
              {streak} <span className="text-sm font-bold text-orange">days</span>
            </div>
          </div>
        </div>
        {longestStreak !== undefined && (
          <div className="text-right">
            <div className="text-[10px] font-bold text-ink-light uppercase tracking-wider">Best</div>
            <div className="text-sm font-extrabold text-ink-secondary">{longestStreak} days</div>
          </div>
        )}
      </div>

      {/* Weekly dots */}
      <div className="flex items-end justify-between gap-1">
        {DAY_LABELS.map((day, i) => {
          const active = weekActivity[i] ?? false;
          const isToday = i === (new Date().getDay() + 6) % 7; // Mon=0

          return (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400 }}
                className={cn(
                  'w-full aspect-square max-w-[36px] rounded-xl flex items-center justify-center',
                  active
                    ? 'bg-gradient-to-br from-orange to-coral shadow-[0_2px_6px_rgba(255,107,107,0.35)]'
                    : 'bg-cream',
                  isToday && !active && 'ring-2 ring-brand ring-offset-1'
                )}
              >
                {active && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1C7 1 10.5 5 10.5 8C10.5 9.93 8.93 11.5 7 11.5C5.07 11.5 3.5 9.93 3.5 8C3.5 5 7 1 7 1Z" fill="#FFD60A" />
                  </svg>
                )}
              </motion.div>
              <span className={cn(
                'text-[10px] font-bold',
                isToday ? 'text-brand' : 'text-ink-light'
              )}>
                {day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Motivational message */}
      {streak === 0 ? (
        <p className="text-xs text-ink-muted font-medium text-center">
          Start your streak today!
        </p>
      ) : streak >= 7 ? (
        <p className="text-xs text-orange font-bold text-center">
          You&apos;re on fire! {streak} days strong!
        </p>
      ) : (
        <p className="text-xs text-ink-muted font-medium text-center">
          {7 - streak} more days to a week streak! Keep going!
        </p>
      )}
    </div>
  );
}

// ─── Flame SVG Icon ───────────────────────────────────────────────────────────

function FlameIcon({ animated = true, size = 24 }: { animated?: boolean; size?: number }) {
  return (
    <motion.svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      animate={animated ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="drop-shadow-sm"
    >
      <path
        d="M12 2C12 2 18 9 18 14C18 17.31 15.31 20 12 20C8.69 20 6 17.31 6 14C6 9 12 2 12 2Z"
        fill="#FF922B"
        stroke="#FF6B00"
        strokeWidth="0.5"
      />
      <path
        d="M12 8C12 8 15 12 15 15C15 16.66 13.66 18 12 18C10.34 18 9 16.66 9 15C9 12 12 8 12 8Z"
        fill="#FFD60A"
      />
    </motion.svg>
  );
}

export { FlameIcon };
