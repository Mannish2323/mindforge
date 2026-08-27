'use client';

import React from 'react';
import { cn } from '@/utils';

interface ProgressBarProps {
  value: number;  // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'pink' | 'amber' | 'emerald' | 'gradient' | 'green' | 'blue' | 'orange' | 'teal';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  size = 'md',
  color = 'gradient',
  showLabel = false,
  label,
  className,
  animated = true,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const heights: Record<string, string> = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors: Record<string, string> = {
    purple: 'bg-brand',
    pink: 'bg-sakura-dark',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    gradient: 'bg-gradient-to-r from-brand via-cat-purple to-accent',
    green: 'bg-cat-green',
    blue: 'bg-cat-blue',
    orange: 'bg-cat-orange',
    teal: 'bg-cat-teal',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-xs font-semibold text-ink-muted">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-bold text-brand">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden bg-warm-soft', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full',
            colors[color],
            animated && 'transition-all duration-700 ease-out'
          )}
          style={{
            width: `${clampedValue}%`,
            animation: animated ? 'progress-fill 0.8s ease-out' : 'none',
          }}
        />
      </div>
    </div>
  );
}
