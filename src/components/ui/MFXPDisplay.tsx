'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { Zap } from 'lucide-react';

interface MFXPDisplayProps {
  xp: number;
  level?: number;
  xpToNext?: number;
  showLevel?: boolean;
  showPop?: number | null;  // trigger pop animation with this XP amount
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function useCountUp(target: number, duration = 800) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    let raf: number;
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * ease));
      if (progress < 1) raf = requestAnimationFrame(step);
      else prevRef.current = target;
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return display;
}

const sizeConfig = {
  sm: { icon: 'w-3.5 h-3.5', xp: 'text-sm font-extrabold', label: 'text-[10px]', badge: 'px-2.5 py-1' },
  md: { icon: 'w-4 h-4', xp: 'text-lg font-extrabold', label: 'text-xs', badge: 'px-3 py-1.5' },
  lg: { icon: 'w-5 h-5', xp: 'text-2xl font-extrabold', label: 'text-sm', badge: 'px-4 py-2' },
};

export function MFXPDisplay({
  xp,
  level,
  xpToNext,
  showLevel = false,
  showPop = null,
  size = 'md',
  className,
}: MFXPDisplayProps) {
  const displayXP = useCountUp(xp);
  const s = sizeConfig[size];

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      <div className="inline-flex items-center gap-1.5 bg-yellow-light border-2 border-yellow rounded-full shadow-sm"
        style={{ padding: size === 'sm' ? '4px 10px' : size === 'md' ? '6px 14px' : '8px 18px' }}
      >
        <Zap className={cn(s.icon, 'text-orange fill-orange')} />
        <span className={cn(s.xp, 'text-ink tabular-nums')}>
          {displayXP.toLocaleString()}
        </span>
        <span className={cn(s.label, 'text-ink-muted font-bold')}>XP</span>
      </div>

      {/* XP pop animation */}
      <AnimatePresence>
        {showPop && (
          <motion.div
            key={showPop}
            initial={{ y: 0, opacity: 1, scale: 0.6 }}
            animate={{ y: -40, opacity: 0, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 pointer-events-none font-extrabold text-orange text-sm whitespace-nowrap"
            aria-live="polite"
          >
            +{showPop} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Level Badge ─────────────────────────────────────────────────────────────

interface MFLevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MFLevelBadge({ level, size = 'md', className }: MFLevelBadgeProps) {
  const pad = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : size === 'md' ? 'px-3 py-1 text-sm' : 'px-4 py-1.5 text-base';
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-extrabold',
        'bg-gradient-to-r from-lavender to-lavender/80 text-white',
        'shadow-[0_2px_8px_rgba(151,117,250,0.35)]',
        pad, className
      )}
    >
      <span className="opacity-80 text-xs">Lv.</span>
      <span>{level}</span>
    </div>
  );
}
