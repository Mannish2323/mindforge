'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { Button } from '@evlo/ui';

interface FlipCardProps {
  card: any;
  flipped: boolean;
  onFlip: () => void;
  onSpeak: (text: string) => void;
  x: any;
  rotate: any;
  opacity: any;
  cardBorderColor: any;
  handleDragEnd: (event: any, info: any) => void;
}

export function FlipCard({
  card,
  flipped,
  onFlip,
  onSpeak,
  x,
  rotate,
  opacity,
  cardBorderColor,
  handleDragEnd,
}: FlipCardProps) {
  return (
    <div style={{ perspective: 1000, width: '100%', height: '300px', cursor: 'pointer' }}>
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          position: 'relative',
          x,
          rotate,
          opacity,
          border: '2px solid',
          borderColor: cardBorderColor,
          borderRadius: '20px',
        }}
        drag={flipped ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={onFlip}
      >
        {/* Front Face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          background: 'var(--surface-2, #2d2d34)',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
        }}>
          <span style={{ fontSize: '48px', fontWeight: 900, fontFamily: 'var(--font-ja)' }}>
            {card.kanji}
          </span>
          <span style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '11px',
            color: 'var(--text-secondary, #b3b3b9)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Tap to reveal meaning
          </span>
        </div>

        {/* Back Face */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          background: 'var(--surface-2, #2d2d34)',
          borderRadius: '18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          transform: 'rotateY(180deg)',
        }}>
          <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-ja)' }}>
            {card.kanji}
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px' }}>
            /{card.romaji}/
          </span>
          <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--success, #4caf50)', margin: '12px 0 8px 0' }}>
            {card.meaning_en}
          </h3>
          {card.meaning_hi && (
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', margin: 0 }}>
              Hindi: {card.meaning_hi}
            </p>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(card.kanji)}
              style={{
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                padding: 0
              }}
            >
              <Volume2 size={16} />
            </Button>
          </div>

          <span style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '11px',
            color: 'var(--text-secondary, #b3b3b9)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Swipe Right (Got it!) • Swipe Left (Hard)
          </span>
        </div>
      </motion.div>
    </div>
  );
}
