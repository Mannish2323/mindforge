'use client';

import React from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

interface BadgeIconProps {
  type: string;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

// Premium SVG badge icon definitions
const BADGE_DEFS: Record<string, { gradient: [string, string]; path: string; label: string }> = {
  'first-lesson': {
    gradient: ['#6D3CFF', '#C15BFF'],
    label: 'First Lesson',
    path: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  },
  'streak-7': {
    gradient: ['#F59E0B', '#EF4444'],
    label: '7 Day Streak',
    path: 'M12 23C16.97 23 21 18.97 21 14C21 10.5 19 7.5 17 5.5C16.36 4.85 15.5 5.5 15.75 6.5C16 8 15 9.5 13 9.5C11.5 9.5 10 8.5 10 6.5C10 4.5 11.5 2.5 12 2C12 2 4 5 4 12C4 18.5 7.5 23 12 23Z',
  },
  'vocab-master': {
    gradient: ['#8B5CF6', '#EC4899'],
    label: 'Vocabulary Master',
    path: 'M4 19.5C4 20.88 5.12 22 6.5 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2H6C4.9 2 4 2.9 4 4V19.5ZM9 6H15V8H9V6ZM9 10H15V12H9V10Z',
  },
  'grammar-expert': {
    gradient: ['#06B6D4', '#6D3CFF'],
    label: 'Grammar Expert',
    path: 'M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z',
  },
  'jlpt-n5': {
    gradient: ['#10B981', '#6D3CFF'],
    label: 'JLPT N5 Complete',
    path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z',
  },
  'speaking-champion': {
    gradient: ['#F472B6', '#8B5CF6'],
    label: 'Speaking Champion',
    path: 'M12 15C15.31 15 18 12.31 18 9V3H6V9C6 12.31 8.69 15 12 15ZM3 9H1V11H3V9ZM21 9H23V11H21V9ZM5 20H19V22H5V20ZM12 17C8.69 17 6 15.31 6 12H4C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12H18C18 15.31 15.31 17 12 17Z',
  },
  'listening-hero': {
    gradient: ['#3B82F6', '#C15BFF'],
    label: 'Listening Hero',
    path: 'M12 1C7.03 1 3 5.03 3 10V17C3 18.66 4.34 20 6 20H9V12H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V12H15V20H19C20.66 20 22 18.66 22 17V10C22 5.03 17.97 1 12 1Z',
  },
  'writing-master': {
    gradient: ['#F59E0B', '#EC4899'],
    label: 'Writing Master',
    path: 'M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z',
  },
  'perfect-quiz': {
    gradient: ['#EF4444', '#F59E0B'],
    label: 'Perfect Quiz',
    path: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  },
  'fire-starter': {
    gradient: ['#F97316', '#EF4444'],
    label: 'Fire Starter',
    path: 'M12 23C16.97 23 21 18.97 21 14C21 10.5 19 7.5 17 5.5C16.36 4.85 15.5 5.5 15.75 6.5C16 8 15 9.5 13 9.5C11.5 9.5 10 8.5 10 6.5C10 4.5 11.5 2.5 12 2C12 2 4 5 4 12C4 18.5 7.5 23 12 23Z',
  },
  'bookworm': {
    gradient: ['#8B5CF6', '#6D3CFF'],
    label: 'Bookworm',
    path: 'M21 5C19.89 4.65 18.67 4.5 17.5 4.5C15.55 4.5 13.45 4.9 12 6C10.55 4.9 8.45 4.5 6.5 4.5C4.55 4.5 2.45 4.9 1 6V20.65C1 20.9 1.25 21.15 1.5 21.15C1.6 21.15 1.65 21.1 1.75 21.1C3.1 20.45 5.05 20 6.5 20C8.45 20 10.55 20.4 12 21.5C13.35 20.65 15.8 20 17.5 20C19.15 20 20.85 20.3 22.25 21.05C22.35 21.1 22.4 21.1 22.5 21.1C22.75 21.1 23 20.85 23 20.6V6C22.4 5.55 21.75 5.25 21 5ZM21 18.5C19.9 18.15 18.7 18 17.5 18C15.8 18 13.35 18.65 12 19.5V8C13.35 7.15 15.8 6.5 17.5 6.5C18.7 6.5 19.9 6.65 21 7V18.5Z',
  },
  'explorer': {
    gradient: ['#10B981', '#3B82F6'],
    label: 'Explorer',
    path: 'M12 10.9C11.39 10.9 10.9 11.39 10.9 12C10.9 12.61 11.39 13.1 12 13.1C12.61 13.1 13.1 12.61 13.1 12C13.1 11.39 12.61 10.9 12 10.9ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM14.19 14.19L6 18L9.81 9.81L18 6L14.19 14.19Z',
  },
  'rising-star': {
    gradient: ['#F59E0B', '#6D3CFF'],
    label: 'Rising Star',
    path: 'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  },
  'on-fire': {
    gradient: ['#EF4444', '#F97316'],
    label: 'On Fire',
    path: 'M12 23C16.97 23 21 18.97 21 14C21 10.5 19 7.5 17 5.5C16.36 4.85 15.5 5.5 15.75 6.5C16 8 15 9.5 13 9.5C11.5 9.5 10 8.5 10 6.5C10 4.5 11.5 2.5 12 2C12 2 4 5 4 12C4 18.5 7.5 23 12 23Z',
  },
  'diamond-streak': {
    gradient: ['#06B6D4', '#8B5CF6'],
    label: 'Diamond Streak',
    path: 'M12 2L5 12L12 22L19 12L12 2ZM12 5.5L16.5 12L12 18.5L7.5 12L12 5.5Z',
  },
  'champion': {
    gradient: ['#F59E0B', '#EF4444'],
    label: 'Champion',
    path: 'M12 2L20 7V17L12 22L4 17V7L12 2ZM12 4.5L6 8.27V15.73L12 19.5L18 15.73V8.27L12 4.5ZM12 8L15 12L12 16L9 12L12 8Z',
  },
  'sharpshooter': {
    gradient: ['#EF4444', '#F59E0B'],
    label: 'Sharpshooter',
    path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z',
  },
  'social-butterfly': {
    gradient: ['#EC4899', '#8B5CF6'],
    label: 'Social Butterfly',
    path: 'M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z',
  },
  'duelist': {
    gradient: ['#EF4444', '#6D3CFF'],
    label: 'Duelist',
    path: 'M6.92 5H5L14 14L15 13.06L6.92 5ZM19.06 3.5L17.5 2L15 4.5L16.5 6L19.06 3.5ZM3.5 19.06L2 17.5L4.5 15L6 16.5L3.5 19.06ZM10 15.47L7.5 13L2 18.5L3.5 20L5.5 18L8.47 18.97L10 15.47Z',
  },
  'memory-master': {
    gradient: ['#10B981', '#06B6D4'],
    label: 'Memory Master',
    path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM15.88 8.29L10 14.17L8.12 12.29L6.71 13.71L10 17L17.29 9.71L15.88 8.29Z',
  },
  'voice-actor': {
    gradient: ['#F472B6', '#EC4899'],
    label: 'Voice Actor',
    path: 'M12 15C15.31 15 18 12.31 18 9V3H6V9C6 12.31 8.69 15 12 15ZM3 9H1V11H3V9ZM21 9H23V11H21V9ZM5 20H19V22H5V20Z',
  },
};

// Legacy emoji → badge type mapping for achievements migration
const EMOJI_TO_TYPE: Record<string, string> = {
  '🔥': 'fire-starter',
  '📚': 'bookworm',
  '🗾': 'explorer',
  '⭐': 'rising-star',
  '💎': 'diamond-streak',
  '🏆': 'champion',
  '🎯': 'sharpshooter',
  '🤝': 'social-butterfly',
  '⚔️': 'duelist',
  '🧠': 'memory-master',
  '🎙️': 'voice-actor',
  '🌱': 'first-lesson',
  '⚡': 'streak-7',
  '🈶': 'vocab-master',
};

export function resolveBadgeType(emojiOrType: string): string {
  return EMOJI_TO_TYPE[emojiOrType] || emojiOrType;
}

export function BadgeIcon({ type, unlocked = true, size = 'md', className, animate = true }: BadgeIconProps) {
  const badgeType = resolveBadgeType(type);
  const def = BADGE_DEFS[badgeType] || BADGE_DEFS['first-lesson'];
  
  const sizes = {
    sm: { container: 'w-10 h-10', icon: 20 },
    md: { container: 'w-12 h-12', icon: 24 },
    lg: { container: 'w-16 h-16', icon: 32 },
  };

  const s = sizes[size];
  const gradientId = `badge-grad-${badgeType}-${Math.random().toString(36).slice(2, 7)}`;

  const Wrapper = animate ? motion.div : 'div' as any;
  const wrapperProps = animate ? {
    whileHover: unlocked ? { scale: 1.1, rotate: 3 } : {},
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  } : {};

  return (
    <Wrapper
      className={cn(
        s.container,
        'rounded-2xl flex items-center justify-center relative overflow-hidden transition-all',
        unlocked
          ? 'border border-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
          : 'border border-white/[0.04] opacity-40 grayscale',
        className
      )}
      style={unlocked ? {
        background: `linear-gradient(135deg, ${def.gradient[0]}15, ${def.gradient[1]}15)`,
      } : {
        background: 'rgba(255,255,255,0.02)',
      }}
      {...wrapperProps}
    >
      {/* Glow effect for unlocked badges */}
      {unlocked && (
        <div
          className="absolute inset-0 opacity-20 blur-lg pointer-events-none"
          style={{ background: `radial-gradient(circle, ${def.gradient[0]}, transparent 70%)` }}
        />
      )}

      {/* SVG Icon */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={unlocked ? def.gradient[0] : '#4a4560'} />
            <stop offset="100%" stopColor={unlocked ? def.gradient[1] : '#3a3550'} />
          </linearGradient>
        </defs>
        <path d={def.path} fill={`url(#${gradientId})`} />
      </svg>

      {/* Unlock shimmer */}
      {unlocked && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -inset-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" style={{ animationDuration: '3s' }} />
        </div>
      )}
    </Wrapper>
  );
}

export function getBadgeLabel(emojiOrType: string): string {
  const badgeType = resolveBadgeType(emojiOrType);
  return BADGE_DEFS[badgeType]?.label || badgeType;
}
