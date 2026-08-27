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
    glass: 'bg-white border border-edge shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
    solid: 'bg-warm-cream border border-edge',
    gradient: 'bg-gradient-to-br from-brand/5 to-cat-purple/5 border border-brand/15',
    stat: 'bg-white border border-edge shadow-[0_2px_12px_rgba(0,0,0,0.06)]',
    neon: 'bg-white border-2 border-brand/20 shadow-[0_4px_16px_rgba(109,60,255,0.1)]',
    category: cn('bg-white border-2 shadow-[0_2px_12px_rgba(0,0,0,0.06)]', color || 'border-edge'),
  };

  const baseClasses = cn(
    'rounded-card-lg relative overflow-hidden',
    variants[variant],
    hover && 'card-hover',
    active && 'card-active',
    paddings[padding],
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
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
