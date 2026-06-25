'use client';

import React from 'react';
import { motion } from 'framer-motion';

const WORD_OF_DAY = [
  { kanji: '勉強', romaji: 'benkyou', meaning: 'Study / Learning', level: 'N5' },
  { kanji: '友達', romaji: 'tomodachi', meaning: 'Friend', level: 'N5' },
  { kanji: '電車', romaji: 'densha', meaning: 'Train', level: 'N5' },
  { kanji: '図書館', romaji: 'toshokan', meaning: 'Library', level: 'N4' },
  { kanji: '挑戦', romaji: 'chousen', meaning: 'Challenge', level: 'N3' },
];

export function FocusCard() {
  const wordIdx = React.useMemo(() => new Date().getDate() % WORD_OF_DAY.length, []);
  const wordOfDay = WORD_OF_DAY[wordIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px',
          color: 'var(--text-secondary, #b3b3b9)',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>Focus of the Day</span>
        <span style={{
          fontSize: '11px',
          background: 'var(--surface-3, #3a3a42)',
          color: 'var(--text-primary, #fff)',
          padding: '2px 8px',
          borderRadius: '12px',
          fontWeight: 600
        }}>{wordOfDay.level}</span>
      </div>
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <h2 style={{
          fontFamily: 'var(--font-ja, "Noto Sans JP", sans-serif)',
          fontSize: '52px',
          fontWeight: 900,
          margin: '0 0 4px 0',
          color: 'var(--text-primary, #fff)',
          letterSpacing: '0.05em',
        }}>
          {wordOfDay.kanji}
        </h2>
        <div style={{ fontSize: '14px', color: 'var(--primary, #ff9800)', fontWeight: 600 }}>{wordOfDay.romaji}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px' }}>{wordOfDay.meaning}</div>
      </div>
    </motion.div>
  );
}
