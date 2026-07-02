'use client';

import React from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

type CardVariant = 'glass' | 'solid' | 'gradient' | 'stat' | 'neon';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  active?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  animate?: boolean;
}

export function Card({
  variant = 'glass',
  hover = true,
  active = false,
  padding = 'md',
  animate = false,
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
    glass: 'glass-card',
    solid: 'bg-surface border border-white/[0.06]',
    gradient: 'bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 border border-neon-purple/20',
    stat: 'glass-card border-neon-purple/15',
    neon: 'glass-card neon-border',
  };

  const baseClasses = cn(
    'rounded-card-lg relative overflow-hidden',
    variants[variant],
    hover && 'glass-card-hover',
    active && 'glass-card-active',
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
