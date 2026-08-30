'use client';

import React from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

type CardVariant = 'glass' | 'solid' | 'gradient' | 'stat' | 'neon' | 'category';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  active?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  animate?: boolean;
  color?: string;
}

export function Card({
  variant = 'glass',
  hover = true,
  active = false,
  padding = 'md',
  animate = false,
  color,
  className,
  children,
  ...props
}: CardProps) {
  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8',
  };

  const variants: Record<CardVariant, string> = {
    glass: 'bg-card border-[1.5px] border-edge text-ink shadow-[var(--paper-shadow)]',
    solid: 'bg-cream border-[1.5px] border-edge text-ink shadow-[var(--paper-shadow)]',
    gradient: 'bg-brand-light border-[1.5px] border-brand/20 text-ink shadow-[var(--paper-shadow)]',
    stat: 'bg-card border-[1.5px] border-edge text-ink shadow-[var(--paper-shadow)]',
    neon: 'bg-card border-[1.5px] border-brand text-ink shadow-[var(--paper-shadow)]',
    category: cn('bg-card border-[1.5px] text-ink shadow-[var(--paper-shadow)]', color || 'border-edge'),
  };

  const baseClasses = cn(
    'rounded-[22px] relative overflow-hidden transition-colors',
    variants[variant],
    hover && 'card-hover',
    active && 'card-active',
    paddings[padding],
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        className={baseClasses}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}
