'use client';

import React from 'react';
import { FlipCard } from './FlipCard';
import { motion } from 'framer-motion';

interface ReviewCardProps {
  card: any;
  flipped: boolean;
  onFlip: () => void;
  onSpeak: (text: string) => void;
  onRating: (quality: number) => void;
  x: any;
  rotate: any;
  opacity: any;
  cardBorderColor: any;
  handleDragEnd: (event: any, info: any) => void;
  activeIdx: number;
  totalCards: number;
}

export function ReviewCard({
  card,
  flipped,
  onFlip,
  onSpeak,
  onRating,
  x,
  rotate,
  opacity,
  cardBorderColor,
  handleDragEnd,
  activeIdx,
  totalCards,
}: ReviewCardProps) {
  return (
    <div style={{
      padding: '16px',
      maxWidth: '440px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Progress header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
        <span style={{ color: 'var(--text-secondary, #b3b3b9)' }}>
          Reviewing card {activeIdx + 1} of {totalCards}
        </span>
        <span style={{ color: 'var(--xp-gold, #ffc107)', fontWeight: 700 }}>
          {totalCards - activeIdx} left
        </span>
      </div>

      {/* 3D Flip Card */}
      <FlipCard
        card={card}
        flipped={flipped}
        onFlip={onFlip}
        onSpeak={onSpeak}
        x={x}
        rotate={rotate}
        opacity={opacity}
        cardBorderColor={cardBorderColor}
        handleDragEnd={handleDragEnd}
      />

      {/* Rating buttons below card (visible when flipped) */}
      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', gap: '8px', width: '100%' }}
        >
          <button
            onClick={() => onRating(0)}
            style={{
              flex: 1,
              border: '1px solid #ef4444',
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
            type="button"
          >
            😓 Hard
          </button>
          <button
            onClick={() => onRating(1)}
            style={{
              flex: 1,
              border: '1px solid #f59e0b',
              background: 'rgba(245, 158, 11, 0.08)',
              color: '#f59e0b',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
            type="button"
          >
            👍 OK
          </button>
          <button
            onClick={() => onRating(2)}
            style={{
              flex: 1,
              border: '1px solid #4caf50',
              background: 'rgba(76, 175, 80, 0.08)',
              color: '#4caf50',
              padding: '12px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'transform 0.1s ease',
            }}
            type="button"
          >
            🚀 Easy
          </button>
        </motion.div>
      )}
    </div>
  );
}
