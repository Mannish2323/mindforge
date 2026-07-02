'use client';

import React from 'react';
import { cn } from '@/utils';

interface HeatmapEntry {
  date: string;
  value: number;
}

interface HeatmapCalendarProps {
  data: HeatmapEntry[];
  weeks?: number;
  className?: string;
}

export function HeatmapCalendar({ data, weeks = 12, className }: HeatmapCalendarProps) {
  // Build a lookup map
  const lookup = new Map<string, number>();
  data.forEach((d) => lookup.set(d.date, d.value));

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  // Generate date grid (last N weeks)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - weeks * 7 + 1);
  // Align to Monday
  while (startDate.getDay() !== 1) {
    startDate.setDate(startDate.getDate() - 1);
  }

  const cells: { date: string; value: number }[] = [];
  const current = new Date(startDate);
  while (current <= today) {
    const dateStr = current.toISOString().split('T')[0];
    cells.push({ date: dateStr, value: lookup.get(dateStr) || 0 });
    current.setDate(current.getDate() + 1);
  }

  // Group into weeks (columns of 7)
  const weekColumns: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weekColumns.push(cells.slice(i, i + 7));
  }

  const getColor = (value: number) => {
    if (value === 0) return 'bg-white/[0.03]';
    const ratio = value / maxValue;
    if (ratio < 0.25) return 'bg-neon-purple/20';
    if (ratio < 0.5) return 'bg-neon-purple/40';
    if (ratio < 0.75) return 'bg-neon-purple/60';
    return 'bg-neon-purple/80';
  };

  const days = ['M', '', 'W', '', 'F', '', 'S'];

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-1">
          {days.map((d, i) => (
            <div key={i} className="w-3 h-3 flex items-center justify-center text-[7px] text-purple-300/30 font-bold">
              {d}
            </div>
          ))}
        </div>
        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto">
          {weekColumns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className={cn('w-3 h-3 rounded-[3px] transition-colors', getColor(cell.value))}
                  title={`${cell.date}: ${cell.value} XP`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
