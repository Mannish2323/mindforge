'use client';

import * as React from 'react';
import { cn } from '@/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'icon' | 'horizontal' | 'stacked' | 'symbol';
  showTagline?: boolean;
  glow?: boolean;
}

// 🧠 Official MindForge Squircle App Icon Mark (Vector SVG)
export function MindForgeAppIconMark({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-sm transition-transform duration-300 hover:scale-105", className)}
    >
      {/* Outer Squircle Container with double border */}
      <rect x="4" y="4" width="112" height="112" rx="30" fill="#FFF8F6" stroke="#FFD6DF" strokeWidth="4" />
      <rect x="8" y="8" width="104" height="104" rx="26" fill="#FFFFFF" />

      {/* Background Soft Glow */}
      <circle cx="60" cy="54" r="42" fill="#FFE8EE" opacity="0.6" />

      {/* Little Sparkles */}
      <path d="M26 26L28.5 31L33.5 33.5L28.5 36L26 41L23.5 36L18.5 33.5L23.5 31L26 26Z" fill="#FCC419" />
      <path d="M96 32L97.5 35L100.5 36.5L97.5 38L96 41L94.5 38L91.5 36.5L94.5 35L96 32Z" fill="#FCC419" />
      {/* Mini hand-drawn heart */}
      <path d="M22 60C20 57 23 54 26 56C29 57 28 63 25 63C23 63 22 61 22 60Z" fill="#FF6B8B" />
      <path d="M98 62C96 59 99 56 102 58C105 59 104 65 101 65C99 65 98 63 98 62Z" fill="#FF6B8B" />

      {/* Mascot Brain Cloud Body */}
      <g filter="drop-shadow(0px 2px 6px rgba(255, 107, 139, 0.25))">
        <circle cx="44" cy="46" r="18" fill="#FFAEC0" />
        <circle cx="76" cy="46" r="18" fill="#FFAEC0" />
        <circle cx="60" cy="34" r="19" fill="#FFAEC0" />
        <circle cx="42" cy="62" r="16" fill="#FFAEC0" />
        <circle cx="78" cy="62" r="16" fill="#FFAEC0" />
        <circle cx="60" cy="66" r="19" fill="#FFAEC0" />

        {/* Soft highlight */}
        <circle cx="44" cy="45" r="15" fill="#FFC2D1" />
        <circle cx="76" cy="45" r="15" fill="#FFC2D1" />
        <circle cx="60" cy="33" r="16" fill="#FFD1DC" />
        <circle cx="42" cy="61" r="13" fill="#FFBCCB" />
        <circle cx="78" cy="61" r="13" fill="#FFBCCB" />
        <circle cx="60" cy="64" r="16" fill="#FFC2D1" />
      </g>

      {/* Headband Body (日本語) */}
      <path d="M32 44C32 44 46 36 60 36C74 36 88 44 88 44L86 52C86 52 72 45 60 45C48 45 34 52 34 52L32 44Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
      <text x="60" y="49" textAnchor="middle" fill="#2D2426" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
        日本語
      </text>
      {/* Headband ties */}
      <path d="M88 42L98 37L94 45L100 48L88 47Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="1.5" />

      {/* Eyes: Left open, Right wink */}
      <ellipse cx="51" cy="56" rx="3.5" ry="4.5" fill="#2D2426" />
      <circle cx="50" cy="54" r="1.5" fill="#FFFFFF" />
      <path d="M66 54L71 56.5L66 59" stroke="#2D2426" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Cheeks */}
      <ellipse cx="43" cy="61" rx="4.5" ry="3" fill="#FF6B8B" opacity="0.6" />
      <ellipse cx="77" cy="61" rx="4.5" ry="3" fill="#FF6B8B" opacity="0.6" />

      {/* Smile */}
      <path d="M57 60C57 62.5 63 62.5 63 60" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M58 60.5C58 62 62 62 62 60.5Z" fill="#FF4D6D" />

      {/* Book */}
      <g filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.15))">
        <path d="M40 73L60 78V96L40 91Z" fill="#FF4D6D" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M80 73L60 78V96L80 91Z" fill="#FF4D6D" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M42 71L60 76V93L42 88Z" fill="#FFF8F0" stroke="#2D2426" strokeWidth="1" />
        <path d="M78 71L60 76V93L78 88Z" fill="#FFF8F0" stroke="#2D2426" strokeWidth="1" />
        <text x="70" y="86" textAnchor="middle" fill="#2D2426" fontSize="9" fontWeight="900" fontFamily="sans-serif">
          あ
        </text>
      </g>

      {/* Hands */}
      <circle cx="39" cy="80" r="4.5" fill="#FFAEC0" stroke="#2D2426" strokeWidth="1.8" />
      <circle cx="81" cy="80" r="4.5" fill="#FFAEC0" stroke="#2D2426" strokeWidth="1.8" />

      {/* Wordmark: MindForge */}
      <text x="60" y="107" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="9.5" letterSpacing="0.3">
        <tspan fill="#2D2426">Mind</tspan>
        <tspan fill="#FF4D6D">Forge</tspan>
      </text>
    </svg>
  );
}

export function Logo({
  size = 'md',
  variant = 'icon',
  showTagline = false,
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
        className={cn("relative inline-flex items-center justify-center cursor-pointer select-none", className)}
        {...props}
      >
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFAEC0]/30 to-[#FCC419]/20 rounded-full blur-[10px] pointer-events-none" />
        )}
        <MindForgeAppIconMark size={dim} />
      </div>
    );
  }

  // Horizontal variant: Mascot Mark + Bold MindForge Wordmark
  return (
    <div
      className={cn("inline-flex items-center gap-3 cursor-pointer select-none group", className)}
      {...props}
    >
      <div className="relative flex-shrink-0">
        {glow && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFAEC0]/30 to-[#FCC419]/20 rounded-full blur-[8px] pointer-events-none" />
        )}
        <MindForgeAppIconMark size={dim} />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center text-xl sm:text-2xl font-extrabold tracking-tight font-heading leading-tight">
          <span className="text-[#2D2426] group-hover:text-[#FF4D6D] transition-colors">Mind</span>
          <span className="text-[#FF4D6D] group-hover:text-[#FF2A55] transition-colors">Forge</span>
        </div>

        {showTagline ? (
          <span className="text-[10px] sm:text-[11px] font-bold text-[#FF6B8B] tracking-wide">
            Learn Japanese. The fun way! ❤️
          </span>
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-light">
            Japanese Made Fun
          </span>
        )}
      </div>
    </div>
  );
}
