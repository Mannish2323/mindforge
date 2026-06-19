'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@evlo/ui';
import { ProgressBar } from './ProgressBar';
import { XPFlash } from './XPFlash';
import { HeartDebit } from './HeartDebit';
import { ExerciseCard } from './ExerciseCard';

interface LessonPlayerProps {
  questions: any[];
  currentQIdx: number;
  selectedAns: string | null;
  onSelect: (ans: string) => void;
  isAnswered: boolean;
  isCorrect: boolean;
  onCheckAnswer: () => void;
  onNextQuestion: () => void;
  onClose: () => void;
  hearts: number;
  showXPBadge: boolean;
  showHeartDeduct: boolean;
  isCardShaking: boolean;
  lessonFinished: boolean;
  correctCount: number;
  xpReward: number;
  playTTS: (text: string) => void;
  isProUser?: boolean;
}

// 400ms Animated Count-up for Completion screen
function AnimatedXPCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    
    const duration = 400; // ms
    const incrementTime = 16; // ~60fps
    const steps = duration / incrementTime;
    const stepValue = end / steps;
    
    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [target]);

  return <span style={{ color: 'var(--xp-gold, #ffc107)', fontWeight: 900, fontSize: '24px', display: 'block' }}>+{count} XP Earned</span>;
}

export function LessonPlayer({
  questions,
  currentQIdx,
  selectedAns,
  onSelect,
  isAnswered,
  isCorrect,
  onCheckAnswer,
  onNextQuestion,
  onClose,
  hearts,
  showXPBadge,
  showHeartDeduct,
  isCardShaking,
  lessonFinished,
  correctCount,
  xpReward,
  playTTS,
  isProUser = false,
}: LessonPlayerProps) {
  
  if (hearts <= 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '80vh', textAlign: 'center', padding: '24px'
      }}>
        <span style={{ fontSize: '64px' }}>💔</span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '12px 0' }}>No Hearts Left</h2>
        <p style={{ color: 'var(--text-secondary, #b3b3b9)', maxWidth: '300px', marginBottom: '24px' }}>
          Refill your hearts capacity using gems in settings or return to the lessons path.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" onClick={onClose}>Return Path</Button>
        </div>
      </div>
    );
  }

  if (lessonFinished) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '90vh', textAlign: 'center', padding: '24px', maxWidth: '440px', margin: '0 auto'
      }}>
        <motion.span 
          initial={{ scale: 0 }} 
          animate={{ scale: [0, 1.2, 1] }} 
          transition={{ duration: 0.5, type: 'spring' }} 
          style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}
        >
          🎉
        </motion.span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Lesson Complete!</h2>
        <p style={{ color: 'var(--text-secondary, #b3b3b9)', margin: '8px 0 24px 0', fontSize: '14px' }}>
          Outstanding! You correctly answered {correctCount} out of {questions.length} questions.
        </p>

        <div className="card" style={{ width: '100%', padding: '20px', background: 'var(--surface-2, #2d2d34)', marginBottom: '24px' }}>
          <AnimatedXPCounter target={xpReward} />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px', display: 'block' }}>
            Bonus Reward: +5 Gems 💎
          </span>
        </div>

        <Button variant="primary" onClick={onClose} style={{ width: '100%' }}>
          Return to Path
        </Button>
      </div>
    );
  }

  const q = questions[currentQIdx];
  const progressPct = (currentQIdx / questions.length) * 100;

  return (
    <div style={{
      padding: '16px', maxWidth: '440px', margin: '0 auto', minHeight: '90vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    }}>
      
      {/* 1. Progress Bar at top (240ms transition) */}
      <div style={{ width: '100%', marginBottom: '12px' }}>
        <ProgressBar progressPct={progressPct} />
      </div>

      {/* 2 & 3. Close button top-left, Hearts remaining top-right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '40px', marginBottom: '12px' }}>
        <button 
          onClick={() => {
            if (confirm('Are you sure you want to quit? Your current lesson progress will be lost.')) {
              onClose();
            }
          }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary, #b3b3b9)', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>
        
        <HeartDebit hearts={hearts} isDeducting={showHeartDeduct} />
      </div>

      {/* 7. XP flash on correct */}
      <XPFlash xp={xpReward} visible={showXPBadge} />

      {/* 4. Question card (center, full width) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '12px 0' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQIdx}
            // Next question slides in from right, 200ms ease
            initial={{ opacity: 0, x: 100 }}
            animate={isCardShaking ? {
              x: [-10, 10, -10, 10, -10, 10, 0],
              scale: 1,
              opacity: 1,
            } : isAnswered && isCorrect ? {
              scale: 1.02,
              x: 0,
              opacity: 1,
            } : {
              scale: 1,
              x: 0,
              opacity: 1,
            }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              background: 'var(--surface-2, #2d2d34)',
              border: isAnswered
                ? isCorrect
                  ? '2px solid var(--success, #4caf50)'
                  : '2px solid var(--error, #ef4444)'
                : '1px solid var(--border-strong, #2d2d34)',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: 'var(--shadow-md)',
              transition: 'border-color 200ms ease'
            }}
          >
            {/* Render 5. Exercise options or inputs */}
            <ExerciseCard
              question={q}
              selectedAns={selectedAns}
              onSelect={onSelect}
              isAnswered={isAnswered}
              isCorrect={isCorrect}
              playTTS={playTTS}
              isProUser={isProUser}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 6. Submit / Continue button at bottom */}
      <div style={{ marginTop: '16px' }}>
        {!isAnswered ? (
          <Button
            variant="primary"
            disabled={!selectedAns}
            onClick={onCheckAnswer}
            style={{ width: '100%', height: '48px', fontWeight: 800 }}
          >
            Check Answer
          </Button>
        ) : (
          <Button
            variant={isCorrect ? 'primary' : 'danger'}
            onClick={onNextQuestion}
            style={{ width: '100%', height: '48px', fontWeight: 800 }}
          >
            {isCorrect ? 'Continue ✓' : 'Got it'}
          </Button>
        )}
      </div>

    </div>
  );
}
