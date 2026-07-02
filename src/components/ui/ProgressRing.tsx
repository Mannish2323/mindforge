'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/utils';

interface ProgressRingProps {
  value: number;       // 0-100
  size?: number;       // px
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  children?: React.ReactNode;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'url(#progressGradient)',
  trackColor = 'rgba(255,255,255,0.06)',
  className,
  showLabel = true,
  label,
  animated = true,
  children,
}: ProgressRingProps) {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setDisplayValue(value), 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D3CFF" />
            <stop offset="50%" stopColor="#C15BFF" />
            <stop offset="100%" stopColor="#FF6BD6" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animated ? 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            {showLabel && (
              <span className="text-lg font-bold text-white font-orbitron">
                {Math.round(displayValue)}%
              </span>
            )}
            {label && (
              <span className="text-[10px] font-semibold text-purple-300/50 uppercase tracking-wider mt-0.5">
                {label}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
