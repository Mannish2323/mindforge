'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/utils';

export type MascotExpression =
  | 'happy'
  | 'thinking'
  | 'excited'
  | 'confused'
  | 'celebrating'
  | 'studying'
  | 'encouraging'
  | 'sleeping'
  | 'surprised'
  | 'proud';

export interface MascotProps {
  expression?: MascotExpression;
  size?: number;
  animate?: boolean;
  className?: string;
  speechText?: string;
}

const EXPRESSION_BADGES: Record<MascotExpression, { emoji: string; text?: string; bg: string }> = {
  happy: { emoji: '🌸', text: 'Konnichiwa!', bg: 'bg-brand-light text-brand border-brand/30' },
  thinking: { emoji: '💭', text: 'Hmm...', bg: 'bg-lavender-light text-lavender border-lavender/30' },
  excited: { emoji: '✨', text: 'Sugoi!', bg: 'bg-yellow-light text-orange border-yellow/30' },
  confused: { emoji: '❓', text: 'Nani?', bg: 'bg-lavender-light text-lavender border-lavender/30' },
  celebrating: { emoji: '🎉', text: 'Omedetou!', bg: 'bg-mint-light text-cat-green border-mint/30' },
  studying: { emoji: '📖', text: 'Benkyou!', bg: 'bg-sky-light text-sky border-sky/30' },
  encouraging: { emoji: '💪', text: 'Ganbatte!', bg: 'bg-coral-light text-coral border-coral/30' },
  sleeping: { emoji: '💤', text: 'Oyasumi', bg: 'bg-lavender-light text-ink-muted border-lavender/30' },
  surprised: { emoji: '⚡', text: 'Bikkuri!', bg: 'bg-yellow-light text-orange border-yellow/30' },
  proud: { emoji: '🏆', text: 'Yatta!', bg: 'bg-yellow-light text-orange border-yellow/30' },
};

export function Mascot({
  expression = 'happy',
  size = 120,
  animate = true,
  className,
  speechText,
}: MascotProps) {
  const badge = EXPRESSION_BADGES[expression];
  const displayText = speechText || badge.text;

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        'relative inline-flex items-center justify-center select-none flex-shrink-0',
        animate && 'mascot-float',
        className
      )}
      role="img"
      aria-label={`MindForge mascot — ${expression}`}
    >
      {/* Soft mascot backdrop glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand/20 via-sakura/15 to-yellow/15 rounded-full blur-xl pointer-events-none scale-90" />

      {/* Official Mascot Image */}
      <div className="relative w-full h-full">
        <Image
          src="/mindforge_app_logo.png"
          alt="MindForge Mascot"
          fill
          sizes={`${size}px`}
          className="object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* Speech bubble or expression badge */}
      {displayText && (
        <div
          className={cn(
            'absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide border shadow-sm flex items-center gap-1 z-10 whitespace-nowrap animate-bounce duration-1000',
            badge.bg
          )}
        >
          <span>{badge.emoji}</span>
          <span>{displayText}</span>
        </div>
      )}
    </div>
  );
}

export const MascotHappy = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="happy" {...p} />;
export const MascotThinking = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="thinking" {...p} />;
export const MascotExcited = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="excited" {...p} />;
export const MascotConfused = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="confused" {...p} />;
export const MascotCelebrating = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="celebrating" {...p} />;
export const MascotStudying = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="studying" {...p} />;
export const MascotEncouraging = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="encouraging" {...p} />;
export const MascotSleeping = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="sleeping" {...p} />;
export const MascotSurprised = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="surprised" {...p} />;
export const MascotProud = (p: Omit<MascotProps, 'expression'>) => <Mascot expression="proud" {...p} />;

