'use client';

import React from 'react';
import { cn } from '@/utils';

type BadgeVariant = 'default' | 'purple' | 'pink' | 'amber' | 'emerald' | 'sky' | 'rose' | 'neon' | 'green' | 'blue' | 'orange' | 'teal';

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
    default: 'bg-warm-soft border-edge text-ink-secondary',
    purple: 'bg-cat-purple-light border-cat-purple/20 text-cat-purple',
    pink: 'bg-cat-pink-light border-cat-pink/20 text-cat-pink',
    amber: 'bg-cat-orange-light border-cat-orange/20 text-cat-orange',
    emerald: 'bg-cat-green-light border-cat-green/20 text-cat-green',
    sky: 'bg-cat-blue-light border-cat-blue/20 text-cat-blue',
    rose: 'bg-cat-pink-light border-cat-pink/20 text-cat-pink',
    neon: 'bg-gradient-to-r from-brand/10 to-accent/10 border-brand/20 text-brand',
    green: 'bg-cat-green-light border-cat-green/20 text-cat-green',
    blue: 'bg-cat-blue-light border-cat-blue/20 text-cat-blue',
    orange: 'bg-cat-orange-light border-cat-orange/20 text-cat-orange',
    teal: 'bg-cat-teal-light border-cat-teal/20 text-cat-teal',
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
