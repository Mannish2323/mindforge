'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DailyGoalCardProps {
  dailyXp: number;  // actual daily XP earned today (from profile.xp_today)
  goalXp: number;
  // Legacy compat: if 'xp' passed, ignored (use dailyXp)
  xp?: number;
}

export function DailyGoalCard({ dailyXp = 0, goalXp }: DailyGoalCardProps) {
  const progressPct = Math.min(100, Math.round((dailyXp / Math.max(1, goalXp)) * 100));
  const isComplete = progressPct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${isComplete ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'border-color 0.3s ease',
        boxShadow: isComplete ? '0 0 0 1px rgba(74,222,128,0.15)' : 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{
            fontSize: '11px',
            color: 'var(--text-3)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>Daily Goal</span>
          <h4 style={{ fontWeight: 800, fontSize: '18px', margin: '4px 0 0 0', color: 'var(--text)' }}>
            {dailyXp} / {goalXp} <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-2)' }}>XP</span>
          </h4>
          {isComplete && (
            <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 700, marginTop: '2px', display: 'block' }}>
              ✓ Goal complete!
            </span>
          )}
        </div>

        {/* Circular progress */}
        <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
          <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="26" cy="26" r="22" fill="none" stroke="var(--surface-3)" strokeWidth="4" />
            <motion.circle
              cx="26"
              cy="26"
              r="22"
              fill="none"
              stroke={isComplete ? 'var(--success)' : 'var(--primary)'}
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
            fontSize: '11px',
            fontWeight: 800,
            color: isComplete ? 'var(--success)' : 'var(--primary)'
          }}>{progressPct}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: '10px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: isComplete
              ? 'linear-gradient(90deg, #22c55e, #4ade80)'
              : 'var(--grad-primary)',
            borderRadius: '10px'
          }}
        />
      </div>
    </motion.div>
  );
}
