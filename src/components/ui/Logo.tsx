import * as React from 'react';
import { cn } from '@/utils';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  glow?: boolean;
}

export function Logo({ size = 'md', glow = true, className, ...props }: LogoProps) {
  const dimensions = typeof size === 'number' ? size : { sm: 32, md: 48, lg: 64 }[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Background radial aura glow */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/25 to-pink-500/25 rounded-full blur-[16px] pointer-events-none animate-pulse" />
      )}
      
      <svg
        width={dimensions}
        height={dimensions}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform hover:rotate-[15deg] duration-500 ease-out"
        {...props}
      >
        <defs>
          <linearGradient id="sakuraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" /> {/* Purple */}
            <stop offset="50%" stopColor="#ec4899" /> {/* Pink */}
            <stop offset="100%" stopColor="#ffb7c5" /> {/* Sakura */}
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Glowing Sakura flower base shape */}
        <path
          d="M50 15 
             C56 30, 70 30, 85 30
             C70 40, 70 54, 80 70
             C64 64, 56 76, 50 85
             C44 76, 36 64, 20 70
             C30 54, 30 40, 15 30
             C30 30, 44 30, 50 15 Z"
          fill="url(#sakuraGrad)"
          filter="url(#glowFilter)"
        />
        
        {/* Core spark details */}
        <circle cx="50" cy="50" r="4" fill="#ffffff" />
        <line x1="50" y1="38" x2="50" y2="44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="50" y1="56" x2="50" y2="62" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="38" y1="50" x2="44" y2="50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        <line x1="56" y1="50" x2="62" y2="50" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </svg>
    </div>
  );
}
