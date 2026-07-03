'use client';

import React, { useState, useMemo } from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { Flame, TrendingUp } from 'lucide-react';

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
  const [hoveredCell, setHoveredCell] = useState<{ date: string; value: number; x: number; y: number } | null>(null);

  // Build lookup
  const lookup = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach((d) => map.set(d.date, d.value));
    return map;
  }, [data]);

  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  // Generate date grid
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - weeks * 7 + 1);
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

  // Group into weeks
  const weekColumns: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weekColumns.push(cells.slice(i, i + 7));
  }

  // Stats
  const totalXp = data.reduce((sum, d) => sum + d.value, 0);
  const activeDays = data.filter((d) => d.value > 0).length;
  const currentStreak = (() => {
    let streak = 0;
    const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
    for (const d of sorted) {
      if (d.value > 0) streak++;
      else break;
    }
    return streak;
  })();

  const getColor = (value: number, isToday: boolean) => {
    if (value === 0) return isToday ? 'bg-neon-purple/10 ring-1 ring-neon-purple/30' : 'bg-white/[0.03]';
    const ratio = value / maxValue;
    const base = isToday ? 'ring-1 ring-neon-pink/50 ' : '';
    if (ratio < 0.25) return base + 'bg-neon-purple/20';
    if (ratio < 0.5) return base + 'bg-neon-purple/35';
    if (ratio < 0.75) return base + 'bg-neon-purple/55';
    return base + 'bg-gradient-to-br from-neon-purple/70 to-neon-pink/70';
  };

  const days = ['M', '', 'W', '', 'F', '', 'S'];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Stats Row */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-bold text-white">{currentStreak}</span>
          <span className="text-[10px] text-purple-300/35 font-semibold">day streak</span>
        </div>
        <div className="w-px h-3 bg-white/[0.06]" />
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-brand-light" />
          <span className="text-[11px] font-bold text-white">{activeDays}</span>
          <span className="text-[10px] text-purple-300/35 font-semibold">active days</span>
        </div>
        <div className="w-px h-3 bg-white/[0.06]" />
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-white">{totalXp}</span>
          <span className="text-[10px] text-purple-300/35 font-semibold">total XP</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative">
        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] pr-1.5">
            {days.map((d, i) => (
              <div key={i} className="w-3 h-[14px] flex items-center justify-center text-[8px] text-purple-300/25 font-bold">
                {d}
              </div>
            ))}
          </div>
          {/* Heatmap grid */}
          <div className="flex gap-[3px] overflow-x-auto">
            {weekColumns.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, ci) => {
                  const isToday = cell.date === todayStr;
                  return (
                    <motion.div
                      key={cell.date}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (wi * 7 + ci) * 0.003, duration: 0.2 }}
                      className={cn(
                        'w-[14px] h-[14px] rounded-[4px] transition-all duration-200 cursor-pointer',
                        getColor(cell.value, isToday),
                        isToday && 'shadow-[0_0_8px_rgba(109,60,255,0.3)]',
                        'hover:ring-1 hover:ring-white/20 hover:scale-125'
                      )}
                      onMouseEnter={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setHoveredCell({ ...cell, x: rect.left + rect.width / 2, y: rect.top });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: hoveredCell.x,
              top: hoveredCell.y - 8,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-[#1A1728] border border-white/[0.1] rounded-xl px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-center">
              <p className="text-[11px] font-bold text-white">{hoveredCell.value} XP</p>
              <p className="text-[9px] text-purple-300/40 font-semibold">{formatDate(hoveredCell.date)}</p>
            </div>
            <div className="w-2 h-2 bg-[#1A1728] border-r border-b border-white/[0.1] rotate-45 mx-auto -mt-1" />
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5">
        <span className="text-[9px] text-purple-300/25 font-bold">Less</span>
        <div className="w-[10px] h-[10px] rounded-[3px] bg-white/[0.03]" />
        <div className="w-[10px] h-[10px] rounded-[3px] bg-neon-purple/20" />
        <div className="w-[10px] h-[10px] rounded-[3px] bg-neon-purple/40" />
        <div className="w-[10px] h-[10px] rounded-[3px] bg-neon-purple/60" />
        <div className="w-[10px] h-[10px] rounded-[3px] bg-neon-purple/80" />
        <span className="text-[9px] text-purple-300/25 font-bold">More</span>
      </div>
    </div>
  );
}
