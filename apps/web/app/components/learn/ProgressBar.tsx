'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progressPct: number;
}

export function ProgressBar({ progressPct }: ProgressBarProps) {
  return (
    <div 
      className="progress-bar-container"
      style={{ 
        flex: 1, 
        height: '12px', 
        background: 'var(--surface-3, #3a3a42)', 
        borderRadius: '6px', 
        overflow: 'hidden' 
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progressPct}%` }}
        transition={{ duration: 0.24, ease: 'easeInOut' }}
        style={{ 
          height: '100%', 
          background: 'linear-gradient(90deg, var(--primary, #ff9800), #eab308)' 
        }}
      />
    </div>
  );
}
