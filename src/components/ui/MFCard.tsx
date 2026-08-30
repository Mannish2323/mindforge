'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface MFCardProps extends HTMLMotionProps<'div'> {
  variant?: 'paper' | 'note' | 'sakura' | 'yellow' | 'mint' | 'lavender' | 'sky' | 'coral' | 'cream';
  washiTape?: 'pink' | 'yellow' | 'mint' | 'lavender' | 'none';
  lifted?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  paper: 'bg-card border-edge text-ink shadow-[var(--paper-shadow)]',
  cream: 'bg-cream border-edge text-ink shadow-[var(--paper-shadow)]',
  note: 'bg-card-subtle border-edge text-ink shadow-[var(--paper-shadow)]',
  sakura: 'bg-brand-light border-brand/25 text-ink shadow-[var(--paper-shadow)]',
  yellow: 'bg-yellow-light border-yellow/30 text-ink shadow-[var(--paper-shadow)]',
  mint: 'bg-mint-light border-mint/30 text-ink shadow-[var(--paper-shadow)]',
  lavender: 'bg-lavender-light border-lavender/30 text-ink shadow-[var(--paper-shadow)]',
  sky: 'bg-sky-light border-sky/30 text-ink shadow-[var(--paper-shadow)]',
  coral: 'bg-coral-light border-coral/30 text-ink shadow-[var(--paper-shadow)]',
};

const paddingStyles: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5 md:p-6',
  lg: 'p-6 sm:p-7 md:p-8',
  xl: 'p-8 sm:p-10',
};

const washiClasses: Record<string, string> = {
  pink: 'washi-tape-pink',
  yellow: 'washi-tape-yellow',
  mint: 'washi-tape-mint',
  lavender: 'washi-tape-lavender',
  none: '',
};

export const MFCard = React.forwardRef<HTMLDivElement, MFCardProps>(
  (
    {
      variant = 'paper',
      washiTape = 'none',
      lifted = false,
      padding = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          lifted
            ? {
                y: -3,
                transition: { type: 'spring', stiffness: 350, damping: 25 },
              }
            : undefined
        }
        className={`
          relative rounded-[22px] border-[1.5px] transition-colors
          ${variantStyles[variant] || variantStyles.paper}
          ${paddingStyles[padding]}
          ${className}
        `}
        {...props}
      >
        {washiTape !== 'none' && <div className={washiClasses[washiTape]} />}
        {children}
      </motion.div>
    );
  }
);

MFCard.displayName = 'MFCard';
