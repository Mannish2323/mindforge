'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ContinueCardProps {
  isNewUser: boolean;
  onContinue: () => void;
}

export function ContinueCard({ isNewUser, onContinue }: ContinueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
      onClick={onContinue}
      style={{
        background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 193, 7, 0.08) 100%)',
        border: '1px solid rgba(255, 152, 0, 0.3)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}
    >
      <div style={{ flex: 1 }}>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          color: 'var(--primary, #ff9800)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          display: 'block'
        }}>
          {isNewUser ? 'Get Started' : 'Recommended Lesson'}
        </span>
        <h3 style={{ fontWeight: 900, marginTop: '4px', fontSize: '18px', margin: '4px 0 0 0', color: 'var(--text-primary, #fff)' }}>
          {isNewUser ? 'Begin Learning Japanese' : 'Continue Learning'}
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)', margin: '6px 0 0 0' }}>
          {isNewUser ? 'Dive into Unit 1 — Greetings & Basics' : 'Pick up where you left off & earn XP'}
        </p>
      </div>
      <span className="continue-badge" style={{
        fontSize: '28px',
        background: 'var(--surface-3, #3a3a42)',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>
        📖
      </span>
    </motion.div>
  );
}
