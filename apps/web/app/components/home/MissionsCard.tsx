'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MissionsCardProps {
  lessonProgress: any;
  dailyReviewsDone?: number;
  speakSessionsToday?: number;
}

export function MissionsCard({ lessonProgress, dailyReviewsDone = 0, speakSessionsToday = 0 }: MissionsCardProps) {
  const missions = useMemo(() => [
    {
      id: 'lesson',
      label: 'Complete 1 Lesson',
      icon: '📖',
      done: Object.values(lessonProgress || {}).some((l: any) => {
        const ts = l.completedAt;
        return ts && new Date(ts).toDateString() === new Date().toDateString();
      }),
      xp: 20,
    },
    {
      id: 'review',
      label: `Do 5 Reviews (${Math.min(5, dailyReviewsDone)}/5)`,
      icon: '🔁',
      done: dailyReviewsDone >= 5,
      xp: 15,
    },
    {
      id: 'speak',
      label: 'Speak 1 Session',
      icon: '🎤',
      done: speakSessionsToday > 0,
      xp: 25,
    },
  ], [lessonProgress, dailyReviewsDone, speakSessionsToday]);

  const completedCount = missions.filter(m => m.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
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
          }}>Daily Missions</span>
          <h4 style={{ fontWeight: 800, fontSize: '18px', margin: '4px 0 0 0', color: 'var(--text-primary, #fff)' }}>
            {completedCount} / {missions.length} Done
          </h4>
        </div>
        <span style={{ fontSize: '24px' }}>🎯</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {missions.map((mission, idx) => (
          <motion.div
            key={mission.id}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 + idx * 0.05 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              background: mission.done ? 'rgba(76, 175, 80, 0.08)' : 'var(--surface-3, #3a3a42)',
              borderRadius: '12px',
              border: mission.done ? '1px solid rgba(76, 175, 80, 0.2)' : '1px solid transparent',
              opacity: mission.done ? 0.7 : 1,
            }}
          >
            <span style={{ fontSize: '18px' }}>{mission.icon}</span>
            <span style={{
              flex: 1,
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: mission.done ? 'line-through' : 'none',
              color: mission.done ? 'var(--text-secondary, #b3b3b9)' : 'var(--text-primary, #fff)'
            }}>
              {mission.label}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--xp-gold, #ffc107)' }}>
              +{mission.xp} XP
            </span>
            {mission.done && (
              <span style={{ fontSize: '14px', color: 'var(--success, #4caf50)' }}>✅</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
