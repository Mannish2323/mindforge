'use client';

import React from 'react';

interface StatsRowProps {
  xp: number;
  streak: number;
  completedLessons: number;
  wordsLearned: number;
}

export function StatsRow({ xp, streak, completedLessons, wordsLearned }: StatsRowProps) {
  const stats = [
    { label: 'XP', value: xp, icon: '⭐' },
    { label: 'Streak', value: streak, icon: '🔥' },
    { label: 'Lessons', value: completedLessons, icon: '📖' },
    { label: 'Words', value: wordsLearned, icon: '🈳' },
  ];

  return (
    <div className="profile-stats-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      background: 'var(--surface-2, #2d2d34)',
      padding: '12px 8px',
      borderRadius: '16px',
      border: '1px solid var(--border-strong, #2d2d34)',
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '18px', display: 'block' }}>{s.icon}</span>
          <span style={{ fontSize: '18px', fontWeight: 900, display: 'block', color: 'var(--text-primary, #fff)', marginTop: '4px' }}>
            {s.value}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary, #b3b3b9)', textTransform: 'uppercase', fontWeight: 700 }}>
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
