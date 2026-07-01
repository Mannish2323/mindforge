import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/utils';

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  glow?: boolean;
}

export function Logo({ size = 'md', glow = true, className, ...props }: LogoProps) {
  const dimensions = typeof size === 'number' ? size : { sm: 32, md: 48, lg: 64 }[size];

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: dimensions, height: dimensions }}
      {...props}
    >
      {/* Background radial aura glow */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-[14px] pointer-events-none animate-pulse" />
      )}
      
      <Image
        src="/icons/icon-512.png"
        alt="Velmorth Logo"
        width={dimensions}
        height={dimensions}
        className="relative z-10 object-contain rounded-2xl transition-transform hover:scale-105 hover:rotate-[3deg] duration-300 ease-out"
        priority
      />
    </div>
  );
}
