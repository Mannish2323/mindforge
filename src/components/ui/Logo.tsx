'use client';

import * as React from 'react';
import { cn } from '@/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'icon' | 'horizontal' | 'stacked' | 'symbol' | 'full';
  showTagline?: boolean;
  glow?: boolean;
}

export function MindForgeMascot({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Sparkles */}
      <path d="M15 20 L17 25 L22 27 L17 29 L15 34 L13 29 L8 27 L13 25 Z" fill="#F7D774" />
      <path d="M85 30 L87 33 L90 35 L87 37 L85 40 L83 37 L80 35 L83 33 Z" fill="#F7D774" />
      <path d="M20 70 L22 73 L25 75 L22 77 L20 80 L18 77 L15 75 L18 73 Z" fill="#F7D774" />

      {/* Brain Body */}
      <path d="M 35,25 C 20,25 15,40 15,55 C 15,75 35,85 50,85 C 65,85 85,75 85,55 C 85,40 80,25 65,25 C 55,25 45,30 35,25 Z" fill="#F47C86" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Brain Folds */}
      <path d="M 25,40 C 35,30 45,45 50,35 C 55,45 65,30 75,40" fill="none" stroke="#E8697A" strokeWidth="2" strokeLinecap="round" />
      <path d="M 30,30 C 40,25 45,35 50,30 C 55,35 60,25 70,30" fill="none" stroke="#E8697A" strokeWidth="2" strokeLinecap="round" />

      {/* Headband */}
      <path d="M 15.5,50 Q 50,60 84.5,50 L 84.5,60 Q 50,70 15.5,60 Z" fill="white" stroke="#2D2426" strokeWidth="2" />
      
      {/* 日本語 Text */}
      <text x="50" y="58" fontSize="8" fontWeight="bold" fill="#E85B67" textAnchor="middle">日本語</text>

      {/* Blush */}
      <circle cx="30" cy="65" r="4" fill="#E85B67" opacity="0.4" />
      <circle cx="70" cy="65" r="4" fill="#E85B67" opacity="0.4" />

      {/* Eyes */}
      <circle cx="40" cy="65" r="2.5" fill="#2D2426" />
      <circle cx="60" cy="65" r="2.5" fill="#2D2426" />

      {/* Smile */}
      <path d="M 46,67 Q 50,71 54,67" fill="none" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />

      {/* Book */}
      <g transform="translate(62, 65) rotate(-15)">
        <rect x="0" y="0" width="20" height="24" rx="2" fill="#E85B67" stroke="#2D2426" strokeWidth="2" />
        <line x1="4" y1="0" x2="4" y2="24" stroke="#2D2426" strokeWidth="1.5" />
        <text x="12" y="17" fontSize="12" fontWeight="bold" fill="white" textAnchor="middle">あ</text>
      </g>
    </svg>
  );
}

export function MindForgeWordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 36" className={cn('h-full w-auto', className)} xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="28" fontSize="28" fontWeight="900" className="fill-slate-900 dark:fill-stone-50" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', letterSpacing: '-0.02em' }}>
        MindForge
      </text>
    </svg>
  );
}

export function MindForgeAppIconMark({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'relative rounded-2xl overflow-hidden shadow-sm transition-transform duration-300 hover:scale-105 flex-shrink-0 bg-[#FFF8F6] border border-sakura/30 flex items-center justify-center',
        className
      )}
    >
      <MindForgeMascot size={size * 0.75} />
    </div>
  );
}

export function Logo({
  size = 'md',
  variant = 'icon',
  showTagline = true,
  glow = true,
  className,
  ...props
}: LogoProps) {
  const pixelSizes = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72,
  };

  const dim = typeof size === 'number' ? size : pixelSizes[size];

  if (variant === 'icon' || variant === 'symbol') {
    return (
      <div
        className={cn('relative inline-flex items-center justify-center cursor-pointer select-none', className)}
        {...props}
      >
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-sakura/20 to-yellow/20 rounded-2xl blur-[10px] pointer-events-none" />
        )}
        <MindForgeAppIconMark size={dim} />
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div
        className={cn('relative inline-flex items-center gap-3 cursor-pointer select-none group', className)}
        {...props}
      >
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-sakura/10 to-yellow/10 rounded-2xl blur-[12px] pointer-events-none" />
        )}
        <MindForgeAppIconMark size={dim} />
        <div className="flex flex-col justify-center">
          <MindForgeWordmark className="h-6 sm:h-7" />
          {showTagline && (
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight">Learn Japanese. The fun way!</span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'stacked' || variant === 'full') {
    return (
      <div
        className={cn('relative flex flex-col items-center justify-center gap-4 select-none group text-center', className)}
        {...props}
      >
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-sakura/20 to-yellow/20 rounded-3xl blur-[20px] pointer-events-none" />
        )}
        <MindForgeAppIconMark size={dim * 1.5} />
        <div className="flex flex-col items-center gap-1">
          <MindForgeWordmark className="h-8 sm:h-10" />
          {showTagline && (
            <span className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium tracking-tight">Learn Japanese. The fun way!</span>
          )}
        </div>
      </div>
    );
  }

  return null;
}
