'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DailyGoalCardProps {
  xp: number;
  goalXp: number;
}

export function DailyGoalCard({ xp, goalXp }: DailyGoalCardProps) {
  const currentDailyXP = xp % goalXp;
  const progressPct = Math.min(100, Math.round((currentDailyXP / goalXp) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        background: 'var(--surface-2, #2d2d34)',
        border: '1px solid var(--border-strong, #2d2d34)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-secondary, #b3b3b9)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>Daily Goal</span>
          <h4 style={{ fontWeight: 800, fontSize: '18px', margin: '4px 0 0 0', color: 'var(--text-primary, #fff)' }}>
            {currentDailyXP} / {goalXp} XP
          </h4>
        </div>
        <div style={{ position: 'relative', width: '52px', height: '52px' }}>
          <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="26" cy="26" r="22" fill="none" stroke="var(--surface-3, #3a3a42)" strokeWidth="4" />
            <motion.circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke={progressPct >= 100 ? 'var(--success, #4caf50)' : 'var(--primary, #ff9800)'}
              strokeWidth="4"
              strokeDasharray="138.2"
              initial={{ strokeDashoffset: 138.2 }}
              animate={{ strokeDashoffset: 138.2 - (progressPct / 100) * 138.2 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <span style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 800,
            color: progressPct >= 100 ? 'var(--success, #4caf50)' : 'var(--primary, #ff9800)'
          }}>{progressPct}%</span>
        </div>
      </div>
      <div style={{ height: '6px', background: 'var(--surface-3, #3a3a42)', borderRadius: '10px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'var(--grad-primary, linear-gradient(135deg, #ffc107, #ff9800))',
            borderRadius: '10px'
          }}
        />
      </div>
    </motion.div>
  );
}
