'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface WelcomeCardProps {
  username: string;
  isNewUser: boolean;
  onNavigate: (tab: string, subView?: string) => void;
  onContinueLesson: () => void;
}

export function WelcomeCard({ username, isNewUser, onNavigate, onContinueLesson }: WelcomeCardProps) {
  if (!isNewUser) return null;

  const quickLaunchItems = [
    { icon: '📖', label: 'First Lesson', action: onContinueLesson },
    { icon: 'あ', label: 'Script Lab', action: () => onNavigate('script') },
    { icon: '🎯', label: 'JLPT Path', action: () => onNavigate('jlpt') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(21, 128, 61, 0.08) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.3)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div>
        <h2 style={{ fontWeight: 900, fontSize: '20px', margin: 0, color: 'var(--text-primary, #fff)' }}>
          🌿 Welcome to Velmorth, {username}!
        </h2>
        <p style={{ color: 'var(--text-secondary, #b3b3b9)', fontSize: '13px', margin: '6px 0 0 0', lineHeight: 1.6 }}>
          Start your Japanese journey the smart way. Complete your first lesson to earn XP and kick off your streak!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        {quickLaunchItems.map((item, idx) => (
          <motion.button
            key={item.label}
            onClick={item.action}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 8px',
              borderRadius: '12px',
              border: '1px solid var(--border-strong, #2d2d34)',
              background: 'var(--bg-surface, #1e1e24)',
              cursor: 'pointer',
              color: 'var(--text-primary, #fff)',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: '24px', fontFamily: 'var(--font-ja)' }}>{item.icon}</span>
            <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
