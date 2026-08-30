'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { Mascot } from '@/components/mascot/Mascot';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

export type FeedbackType = 'correct' | 'wrong';

interface MFAnswerFeedbackProps {
  type: FeedbackType;
  correctAnswer?: string;
  explanation?: string;
  xpEarned?: number;
  onNext: () => void;
  onReview?: () => void;
  visible: boolean;
  className?: string;
}

export function MFAnswerFeedback({
  type,
  correctAnswer,
  explanation,
  xpEarned,
  onNext,
  onReview,
  visible,
  className,
}: MFAnswerFeedbackProps) {
  const isCorrect = type === 'correct';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50',
            'rounded-t-3xl border-t-2 shadow-[0_-8px_32px_rgba(0,0,0,0.12)]',
            'px-5 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
            isCorrect
              ? 'bg-gradient-to-br from-mint-light to-mint-light border-mint'
              : 'bg-gradient-to-br from-coral-light to-coral-light border-coral',
            className
          )}
        >
          <div className="max-w-lg mx-auto flex flex-col gap-4">
            {/* Header row: icon + mascot */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                >
                  {isCorrect
                    ? <CheckCircle2 className="w-8 h-8 text-mint" />
                    : <XCircle className="w-8 h-8 text-coral" />
                  }
                </motion.div>
                <div>
                  <div className={cn(
                    'text-lg font-extrabold',
                    isCorrect ? 'text-mint' : 'text-coral'
                  )}>
                    {isCorrect ? '正解！ Correct!' : '残念… Not quite!'}
                  </div>
                  {isCorrect && xpEarned && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm font-bold text-orange"
                    >
                      +{xpEarned} XP earned! ⚡
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Mini mascot */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
              >
                <Mascot
                  expression={isCorrect ? 'celebrating' : 'encouraging'}
                  size={72}
                  animate={isCorrect}
                />
              </motion.div>
            </div>

            {/* Correct answer reveal */}
            {!isCorrect && correctAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl p-3.5 bg-card border-2 border-coral"
              >
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">
                  Correct Answer
                </div>
                <div className="text-lg font-extrabold text-ink" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {correctAnswer}
                </div>
              </motion.div>
            )}

            {/* Explanation */}
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className={cn(
                  'rounded-2xl p-3.5',
                  isCorrect ? 'bg-mint-light border border-mint' : 'bg-card border border-coral'
                )}
              >
                <div className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">
                  {isCorrect ? 'Great job! 🎉' : 'Tip 💡'}
                </div>
                <p className="text-sm text-ink-secondary font-medium leading-relaxed">{explanation}</p>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {!isCorrect && onReview && (
                <button
                  onClick={onReview}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm text-ink-secondary bg-card border-2 border-edge hover:border-edge-hover transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Review
                </button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onNext}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl font-extrabold text-sm text-white',
                  'shadow-lg transition-all',
                  isCorrect
                    ? 'bg-gradient-to-r from-mint to-mint shadow-[0_4px_12px_rgba(34,197,94,0.3)]'
                    : 'bg-gradient-to-r from-brand to-brand shadow-[0_4px_12px_rgba(255,77,109,0.3)]'
                )}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
