'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPFlashProps {
  xp: number;
  visible: boolean;
}

export function XPFlash({ xp, visible }: XPFlashProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: [0, 1, 1, 0], y: -40, scale: 1.1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--xp-gold, #ffc107)',
            fontWeight: 900,
            fontSize: '28px',
            zIndex: 1000,
            textShadow: '0 0 10px rgba(255, 193, 7, 0.5)',
            pointerEvents: 'none',
          }}
        >
          +{xp} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
