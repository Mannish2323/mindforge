'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

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
      <Heart
        size={18}
        fill={isDeducting ? '#7e7e86' : '#ef4444'}
        color={isDeducting ? '#7e7e86' : '#ef4444'}
        style={{
          transition: 'fill 200ms ease, color 200ms ease',
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
