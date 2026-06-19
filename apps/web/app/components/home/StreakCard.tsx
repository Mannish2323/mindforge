'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Button } from '@evlo/ui';

interface StreakCardProps {
  streak: number;
  todayStudied: boolean;
  onStudyNow: () => void;
}

export function StreakCard({ streak, todayStudied, onStudyNow }: StreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      style={{
        background: streak > 0
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)'
          : 'var(--surface-2, #2d2d34)',
        border: streak > 0 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-strong, #2d2d34)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <motion.span
          animate={streak > 0 ? {
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut'
          }}
          style={{ fontSize: '36px', display: 'inline-block' }}
        >
          🔥
        </motion.span>
        <div>
          <h3 style={{
            fontWeight: 900,
            fontSize: '18px',
            margin: 0,
            color: streak > 0 ? 'var(--xp-gold, #ffc107)' : 'var(--text-primary, #fff)'
          }}>
            {streak > 0 ? `${streak} Day Streak!` : 'Start Your Streak'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)', margin: '4px 0 0 0' }}>
            {todayStudied
              ? '✅ You studied today — streak protected!'
              : streak > 0
              ? '⚠️ Study today to protect your streak!'
              : 'Complete a lesson or review to begin your streak.'}
          </p>
        </div>
      </div>

      {!todayStudied ? (
        <span onClick={(e) => {
          e.stopPropagation();
          onStudyNow();
        }}>
          <Button
            variant="primary"
            onClick={() => {}}
            style={{ whiteSpace: 'nowrap', width: 'auto', padding: '8px 16px', fontSize: '12px', height: '36px' }}
          >
            Study Now
          </Button>
        </span>
      ) : (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ fontSize: '24px' }}
        >
          ✅
        </motion.span>
      )}
    </motion.div>
  );
}
