'use client';

import { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export function SplashScreen({ onFinish, duration = 1800 }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Stage 1: Trigger fade-out
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, duration - 300);

    // Stage 2: Unmount overlay
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, onFinish]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#09071a] flex flex-col items-center justify-center transition-opacity duration-300 ease-out select-none ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background soft glowing particles */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[80px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-900/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative flex flex-col items-center gap-4 text-center">
        {/* Animated logo */}
        <div className="animate-pulse scale-[1.1] transition-transform duration-1000">
          <Logo size="lg" glow />
        </div>
        
        {/* Brand name */}
        <h1 className="text-3xl font-black text-white tracking-widest uppercase mt-4 bg-gradient-to-r from-purple-100 to-purple-300 bg-clip-text text-transparent">
          Velmorth
        </h1>
        
        {/* Subtitle */}
        <p className="text-xs font-semibold text-purple-300/40 uppercase tracking-widest">
          Sensei at Your Fingertips
        </p>

        {/* Loading track indicator */}
        <div className="w-32 h-[3px] bg-purple-950/60 rounded-full overflow-hidden mt-6 relative">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 w-full animate-shimmer absolute inset-y-0 -left-full" />
        </div>
      </div>
    </div>
  );
}
