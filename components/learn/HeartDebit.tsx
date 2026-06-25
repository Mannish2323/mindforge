'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PremiumIcon } from '../ui/PremiumIcon';

interface HeartDebitProps {
  hearts: number;
  isDeducting: boolean;
  isRefill?: boolean;
}

export function HeartDebit({ hearts, isDeducting, isRefill = false }: HeartDebitProps) {
  return (
    <motion.div
      animate={
        isDeducting
          ? {
              x: [0, -4, 4, -4, 4, 0],
              scale: [1, 1.2, 0.9, 1],
            }
          : isRefill
          ? {
              scale: [1, 1.3, 1],
            }
          : {}
      }
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 800,
      }}
    >
      <PremiumIcon
        type="heart"
        size={18}
        style={{
          filter: isDeducting ? 'grayscale(1) opacity(0.5)' : 'none',
          transition: 'filter 200ms ease',
        }}
      />
      <span 
        style={{ 
          color: isDeducting ? '#7e7e86' : 'var(--text-primary, #fff)',
          transition: 'color 200ms ease'
        }}
      >
        {hearts}
      </span>
    </motion.div>
  );
}
