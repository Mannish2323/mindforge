'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface MFButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'paper' | 'yellow' | 'mint' | 'lavender' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: 'btn btn-primary',
  secondary: 'bg-card text-ink border-[1.5px] border-edge shadow-[var(--paper-press-shadow)] hover:bg-card-hover',
  paper: 'bg-cream text-ink border-[1.5px] border-edge shadow-[var(--paper-press-shadow)] hover:bg-card',
  accent: 'btn btn-accent',
  success: 'btn btn-success',
  danger: 'btn btn-danger',
  ghost: 'btn btn-ghost',
  yellow: 'bg-yellow text-ink border-[1.5px] border-yellow/80 shadow-[var(--paper-press-shadow)] hover:brightness-105',
  mint: 'bg-mint text-ink border-[1.5px] border-mint/80 shadow-[var(--paper-press-shadow)] hover:brightness-105',
  lavender: 'bg-lavender text-white border-[1.5px] border-lavender/80 shadow-[var(--paper-press-shadow)] hover:brightness-105',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-10 px-3.5 text-xs rounded-xl gap-1.5 font-bold',
  md: 'h-12 px-5 text-sm rounded-2xl gap-2 font-bold',
  lg: 'h-14 px-7 text-base rounded-2xl gap-2.5 font-extrabold',
};

export const MFButton = React.forwardRef<HTMLButtonElement, MFButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled = false,
      isLoading = false,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        whileHover={
          disabled || isLoading
            ? undefined
            : {
                y: -1,
                transition: { type: 'spring', stiffness: 400, damping: 20 },
              }
        }
        whileTap={
          disabled || isLoading
            ? undefined
            : {
                y: 2,
                boxShadow: '0 1px 0 rgba(45,36,38,0.12)',
                transition: { duration: 0.08 },
              }
        }
        className={`
          inline-flex items-center justify-center font-heading select-none transition-colors
          ${sizeStyles[size]}
          ${variantStyles[variant] || variantStyles.primary}
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed shadow-none border-edge' : 'cursor-pointer'}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

MFButton.displayName = 'MFButton';
