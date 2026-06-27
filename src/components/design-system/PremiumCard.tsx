'use client';

import { ReactNode } from 'react';
import { VELMORTH_COLORS } from '@/constants/design';

interface PremiumCardProps {
  children: ReactNode;
  hover?: boolean;
  glow?: boolean;
  variant?: 'default' | 'gradient' | 'accent';
  className?: string;
  onClick?: () => void;
}

export function PremiumCard({
  children,
  hover = true,
  glow = false,
  variant = 'default',
  className = '',
  onClick,
}: PremiumCardProps) {
  const baseStyles =
    'rounded-2xl backdrop-blur-xl border transition-all duration-300';

  let variantStyles = '';
  let borderColor = '';
  let background = '';

  switch (variant) {
    case 'gradient':
      background =
        'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.05))';
      borderColor = 'rgba(139, 92, 246, 0.25)';
      break;
    case 'accent':
      background =
        'linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(124, 58, 237, 0.05))';
      borderColor = 'rgba(236, 72, 153, 0.2)';
      break;
    default:
      background = VELMORTH_COLORS.glassDark;
      borderColor = VELMORTH_COLORS.border;
  }

  const hoverStyles = hover
    ? 'hover:scale-105 hover:shadow-xl hover:border-opacity-50 cursor-pointer'
    : '';
  const glowStyles = glow
    ? 'shadow-lg shadow-purple-500/20'
    : 'shadow-lg shadow-black/20';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${className}`}
      style={{
        background,
        border: `1px solid ${borderColor}`,
      }}
    >
      {children}
    </div>
  );
}
