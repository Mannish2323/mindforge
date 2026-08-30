'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

export type QuizOptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled';

interface MFQuizOptionProps {
  label: string;
  sublabel?: string;        // romaji or translation hint
  index?: number;           // for keyboard A/B/C/D labels
  state?: QuizOptionState;
  onClick?: () => void;
  className?: string;
}

const stateStyles: Record<QuizOptionState, string> = {
  idle:     'border-edge bg-card hover:border-brand hover:bg-brand-light cursor-pointer',
  selected: 'border-lavender bg-lavender-light cursor-pointer shadow-[0_3px_0px_rgba(177,151,252,0.3)]',
  correct:  'border-[#34C759] bg-mint-light cursor-default shadow-[0_3px_0px_rgba(52,199,89,0.25)]',
  wrong:    'border-[#FF3B30] bg-coral-light cursor-default shadow-[0_3px_0px_rgba(255,59,48,0.25)]',
  disabled: 'border-edge bg-cream cursor-not-allowed opacity-60',
};

const indexLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

export function MFQuizOption({
  label,
  sublabel,
  index,
  state = 'idle',
  onClick,
  className,
}: MFQuizOptionProps) {
  const isClickable = state === 'idle' || state === 'selected';

  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      whileHover={isClickable ? { y: -2, boxShadow: '0 5px 0px rgba(45,36,38,0.1)' } : {}}
      whileTap={isClickable ? { y: 1, scale: 0.99 } : {}}
      animate={state === 'wrong' ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={state === 'wrong' ? { duration: 0.4 } : { type: 'spring', stiffness: 400 }}
      className={cn(
        'relative w-full min-h-[60px] px-4 py-3 rounded-2xl border-2.5 flex items-center gap-3',
        'text-left font-semibold text-ink transition-colors duration-150',
        'shadow-[0_3px_0px_rgba(45,36,38,0.08)]',
        stateStyles[state],
        className
      )}
      aria-pressed={state === 'selected'}
      aria-label={`${indexLabels[index ?? 0]}: ${label}`}
    >
      {/* Index badge */}
      {index !== undefined && (
        <div className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 transition-colors',
          state === 'correct' ? 'bg-mint text-white' :
          state === 'wrong'   ? 'bg-coral text-white' :
          state === 'selected'? 'bg-lavender text-white' :
                                'bg-cream text-ink-muted'
        )}>
          {indexLabels[index]}
        </div>
      )}

      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className="text-base leading-snug truncate font-semibold">{label}</div>
        {sublabel && (
          <div className="text-xs text-ink-muted font-medium mt-0.5">{sublabel}</div>
        )}
      </div>

      {/* Result icon */}
      {state === 'correct' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="flex-shrink-0"
        >
          <CheckCircle2 className="w-5 h-5 text-mint" />
        </motion.div>
      )}
      {state === 'wrong' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="flex-shrink-0"
        >
          <XCircle className="w-5 h-5 text-coral" />
        </motion.div>
      )}
    </motion.button>
  );
}

// ─── Quiz Option Grid ─────────────────────────────────────────────────────────

interface MFQuizGridProps {
  options: Array<{ label: string; sublabel?: string; isCorrect: boolean }>;
  selected: number | null;
  answered: boolean;
  onSelect: (index: number) => void;
  className?: string;
}

export function MFQuizGrid({ options, selected, answered, onSelect, className }: MFQuizGridProps) {
  function getState(index: number, isCorrect: boolean): QuizOptionState {
    if (!answered) return selected === index ? 'selected' : 'idle';
    if (isCorrect) return 'correct';
    if (selected === index && !isCorrect) return 'wrong';
    return 'disabled';
  }

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
      {options.map((opt, i) => (
        <MFQuizOption
          key={i}
          index={i}
          label={opt.label}
          sublabel={opt.sublabel}
          state={getState(i, opt.isCorrect)}
          onClick={() => !answered && onSelect(i)}
        />
      ))}
    </div>
  );
}
