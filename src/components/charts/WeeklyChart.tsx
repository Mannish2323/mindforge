'use client';

import React from 'react';
import { cn } from '@/utils';

interface WeeklyChartProps {
  data: { day: string; value: number }[];
  maxValue?: number;
  color?: string;
  className?: string;
  label?: string;
  unit?: string;
}

export function WeeklyChart({
  data,
  maxValue,
  color = 'from-neon-purple to-neon-pink',
  className,
  label,
  unit = 'XP',
}: WeeklyChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <h4 className="text-[10px] font-bold text-purple-300/40 uppercase tracking-wider">
          {label}
        </h4>
      )}
      <div className="flex items-end justify-between gap-2 h-28">
        {data.map((item, i) => {
          const height = Math.max(4, (item.value / max) * 100);
          const isToday = i === data.length - 1;
          return (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[9px] font-bold text-purple-300/40">
                {item.value > 0 ? `${item.value}` : ''}
              </span>
              <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                <div
                  className={cn(
                    'w-full max-w-[28px] rounded-t-lg transition-all duration-700 ease-out',
                    isToday
                      ? `bg-gradient-to-t ${color} shadow-[0_0_12px_rgba(109,60,255,0.3)]`
                      : 'bg-white/[0.08]'
                  )}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-bold',
                  isToday ? 'text-neon-purple' : 'text-purple-300/30'
                )}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
