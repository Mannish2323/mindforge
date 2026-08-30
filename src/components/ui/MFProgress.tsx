'use client';

import React from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

interface MFProgressProps {
  value: number;       // 0–100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'sakura' | 'mint' | 'lavender' | 'coral' | 'gold' | 'sky';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const colorMap = {
  sakura:   { bar: 'from-brand to-brand/70', track: 'bg-brand-light', glow: 'rgba(255,143,163,0.3)' },
  mint:     { bar: 'from-mint to-mint/70', track: 'bg-mint-light', glow: 'rgba(99,230,190,0.3)' },
  lavender: { bar: 'from-lavender to-lavender/70', track: 'bg-lavender-light', glow: 'rgba(177,151,252,0.3)' },
  coral:    { bar: 'from-coral to-coral/70', track: 'bg-coral-light', glow: 'rgba(255,107,107,0.3)' },
  gold:     { bar: 'from-orange to-yellow', track: 'bg-yellow-light', glow: 'rgba(255,214,10,0.3)' },
  sky:      { bar: 'from-sky to-sky/70', track: 'bg-sky-light', glow: 'rgba(116,192,252,0.3)' },
};

const sizeMap = {
  sm: { height: 'h-2', radius: 'rounded-full', label: 'text-xs' },
  md: { height: 'h-3.5', radius: 'rounded-full', label: 'text-sm' },
  lg: { height: 'h-5', radius: 'rounded-full', label: 'text-base' },
};

export function MFProgress({
  value,
  max = 100,
  label,
  showPercent = false,
  color = 'sakura',
  size = 'md',
  animated = true,
  className,
}: MFProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const { bar, track, glow } = colorMap[color];
  const { height, radius, label: labelSize } = sizeMap[size];

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className={cn('font-semibold text-ink-secondary', labelSize)}>{label}</span>
          )}
          {showPercent && (
            <span className={cn('font-bold text-ink-muted tabular-nums', labelSize)}>
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full', height, radius, track, 'overflow-hidden')}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={animated ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
          className={cn('h-full', radius, 'bg-gradient-to-r', bar, 'relative')}
          style={{ boxShadow: `0 0 8px ${glow}` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full overflow-hidden" />
        </motion.div>
      </div>
    </div>
  );
}

// ─── Lesson Progress Bar (with step count) ───────────────────────────────────

interface MFLessonProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function MFLessonProgress({ current, total, className }: MFLessonProgressProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex-1 h-3 rounded-full bg-cream overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand/80"
          style={{ boxShadow: '0 0 8px rgba(255,77,109,0.3)' }}
        />
      </div>
      <span className="text-xs font-bold text-ink-muted tabular-nums shrink-0">
        {current}/{total}
      </span>
    </div>
  );
}
