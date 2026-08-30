'use client';

import React from 'react';
import { cn } from '@/utils';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'muted' | 'level' | 'default' | 'brand' | 'sakura' | 'yellow' | 'mint' | 'lavender' | 'coral' | 'purple' | 'pink' | 'amber' | 'emerald' | 'sky' | 'rose' | 'neon' | 'green' | 'blue' | 'orange' | 'teal';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  glow?: boolean;
}

export function Badge({
  variant = 'primary',
  size = 'md',
  icon,
  glow = false,
  className,
  children,
  ...props
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    primary: 'bg-brand/10 text-brand border-brand/20',
    brand: 'bg-brand/10 text-brand border-brand/20',
    sakura: 'bg-coral-light text-coral border-coral/30',
    coral: 'bg-coral-light text-coral border-coral/30',
    yellow: 'bg-yellow-light text-ink border-yellow/30',
    mint: 'bg-mint-light text-ink border-mint/30',
    lavender: 'bg-lavender-light text-ink border-lavender/30',
    success: 'bg-mint-light text-ink border-mint/30',
    warning: 'bg-yellow-light text-ink border-yellow/30',
    error: 'bg-red-50 text-red-600 border-red-200',
    muted: 'bg-cream text-ink-muted border-edge',
    level: 'bg-coral-light border-coral/30 text-coral',
    default: 'bg-cream text-ink-muted border-edge',
    purple: 'bg-lavender-light text-ink border-lavender/30',
    pink: 'bg-coral-light text-coral border-coral/30',
    amber: 'bg-yellow-light text-ink border-yellow/30',
    emerald: 'bg-mint-light text-ink border-mint/30',
    sky: 'bg-sky-light text-ink border-sky/30',
    rose: 'bg-coral-light border-coral/30 text-coral',
    neon: 'bg-brand/10 text-brand border-brand/20',
    green: 'bg-mint-light text-ink border-mint/30',
    blue: 'bg-sky-light text-ink border-sky/30',
    orange: 'bg-orange-light text-ink border-orange/30',
    teal: 'bg-mint-light text-ink border-mint/30',
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
        variants[variant] || variants.primary,
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
