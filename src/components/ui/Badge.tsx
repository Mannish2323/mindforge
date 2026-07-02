'use client';

import React from 'react';
import { cn } from '@/utils';

type BadgeVariant = 'default' | 'purple' | 'pink' | 'amber' | 'emerald' | 'sky' | 'rose' | 'neon';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  glow?: boolean;
}

export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  glow = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-white/[0.06] border-white/[0.08] text-white/80',
    purple: 'bg-neon-purple/15 border-neon-purple/25 text-brand-light',
    pink: 'bg-pink-500/15 border-pink-500/25 text-pink-400',
    amber: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
    emerald: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
    sky: 'bg-sky-500/15 border-sky-500/25 text-sky-400',
    rose: 'bg-rose-500/15 border-rose-500/25 text-rose-400',
    neon: 'bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border-neon-purple/30 text-white',
  };

  const sizes: Record<string, string> = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center font-bold rounded-full border select-none whitespace-nowrap',
        variants[variant],
        sizes[size],
        glow && 'animate-glow-pulse',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </div>
  );
}
