'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Volume2 } from 'lucide-react';

export type ScriptType = 'hiragana' | 'katakana' | 'kanji' | 'vocabulary';

interface MFJapaneseCharacterProps {
  character: string;          // e.g., "あ"
  romaji: string;             // e.g., "A"
  meaning?: string;           // for kanji/vocab
  exampleWord?: string;       // e.g., "あめ"
  exampleWordRomaji?: string; // e.g., "Ame"
  exampleMeaning?: string;    // e.g., "Rain"
  onAudio?: () => void;
  type?: ScriptType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showCard?: boolean;
}

const typeColor: Record<ScriptType, { bg: string; border: string; accent: string; label: string }> = {
  hiragana:  { bg: 'var(--color-primary-light)', border: 'var(--color-primary)', accent: 'var(--color-primary)', label: 'Hiragana' },
  katakana:  { bg: 'var(--color-sky-light)', border: 'var(--color-sky)', accent: 'var(--color-sky)', label: 'Katakana' },
  kanji:     { bg: 'var(--color-lavender-light)', border: 'var(--color-lavender)', accent: 'var(--color-lavender)', label: 'Kanji' },
  vocabulary:{ bg: 'var(--color-yellow-light)', border: 'var(--color-yellow)', accent: 'var(--color-orange)', label: 'Vocabulary' },
};

const sizeConfig = {
  sm: { char: '3.5rem',  card: 'p-4', romaji: 'text-base', example: 'text-xs' },
  md: { char: '5.5rem',  card: 'p-6', romaji: 'text-xl',   example: 'text-sm' },
  lg: { char: '8rem',    card: 'p-8', romaji: 'text-2xl',  example: 'text-base' },
};

export function MFJapaneseCharacter({
  character,
  romaji,
  meaning,
  exampleWord,
  exampleWordRomaji,
  exampleMeaning,
  onAudio,
  type = 'hiragana',
  size = 'md',
  className,
  showCard = true,
}: MFJapaneseCharacterProps) {
  const color = typeColor[type];
  const s = sizeConfig[size];

  const content = (
    <div className="space-y-4">
      {/* Type label */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ color: color.accent, background: color.bg, border: `1.5px solid ${color.border}` }}
        >
          {color.label}
        </span>
        {onAudio && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={onAudio}
            className="p-2.5 rounded-xl transition-colors"
            style={{ background: color.bg, border: `1.5px solid ${color.border}` }}
            aria-label={`Listen to ${character}`}
          >
            <Volume2 className="w-4 h-4" style={{ color: color.accent }} />
          </motion.button>
        )}
      </div>

      {/* Large Character */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="jp-text font-black leading-none select-none"
          style={{ fontSize: s.char, color: 'var(--text-primary)', fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          {character}
        </motion.div>
        <div className={cn('font-extrabold mt-2', s.romaji)} style={{ color: color.accent }}>
          {romaji}
        </div>
        {meaning && (
          <div className="text-sm text-ink-muted font-medium mt-1">{meaning}</div>
        )}
      </div>

      {/* Example word */}
      {exampleWord && (
        <div
          className="rounded-xl p-3 space-y-1"
          style={{ background: color.bg, border: `1.5px solid ${color.border}` }}
        >
          <div className="text-[10px] font-bold text-ink-muted uppercase tracking-widest">Example</div>
          <div className="flex items-center justify-between">
            <div>
              <span
                className="text-xl font-black"
                style={{ color: 'var(--text-primary)', fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                {exampleWord}
              </span>
              {exampleWordRomaji && (
                <span className="text-sm font-semibold text-ink-muted ml-2">{exampleWordRomaji}</span>
              )}
            </div>
            {exampleMeaning && (
              <span className="text-sm font-bold text-ink-secondary">{exampleMeaning}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (!showCard) return <div className={cn(s.card, className)}>{content}</div>;

  return (
    <div
      className={cn('rounded-3xl', s.card, className)}
      style={{
        background: 'var(--bg-card)',
        border: `2.5px solid ${color.border}`,
        boxShadow: `0 5px 0px ${color.border}80, 0 2px 16px rgba(0,0,0,0.06)`,
      }}
    >
      {content}
    </div>
  );
}
