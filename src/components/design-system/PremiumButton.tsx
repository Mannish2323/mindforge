'use client';

import { ReactNode } from 'react';
import { VELMORTH_COLORS } from '@/constants/design';

interface PremiumButtonProps {
  children: ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'ghost'
    | 'outline'
    | 'glow';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function PremiumButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}: PremiumButtonProps) {
  const baseStyles =
    'font-bold rounded-xl transition-all duration-300 font-poppins border inline-flex items-center justify-center gap-2 whitespace-nowrap';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles =
        'bg-gradient-to-r from-purple-600 to-purple-500 text-white border-purple-400/30 hover:from-purple-500 hover:to-purple-400 hover:shadow-lg hover:shadow-purple-500/40';
      break;
    case 'secondary':
      variantStyles =
        'bg-gradient-to-r from-purple-900/50 to-purple-800/50 text-white border-purple-400/20 hover:from-purple-800/70 hover:to-purple-700/70';
      break;
    case 'accent':
      variantStyles =
        'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400/30 hover:from-pink-500 hover:to-rose-500 hover:shadow-lg hover:shadow-pink-500/40';
      break;
    case 'ghost':
      variantStyles =
        'bg-transparent text-white border-white/10 hover:bg-white/5 hover:border-white/20';
      break;
    case 'outline':
      variantStyles =
        'bg-transparent text-white border-purple-400/40 hover:bg-purple-500/10 hover:border-purple-400/60';
      break;
    case 'glow':
      variantStyles =
        'bg-transparent text-white border-purple-500/50 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/50 animate-pulse';
      break;
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed hover:from-purple-600 hover:to-purple-500'
    : 'cursor-pointer';

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${disabledStyles} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
}
