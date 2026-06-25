'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@evlo/ui';
import { motion } from 'framer-motion';

interface ReviewEmptyProps {
  reviewCount: number;
  onBackToHome: () => void;
  motivationText: string;
}

export function ReviewEmpty({ reviewCount, onBackToHome, motivationText }: ReviewEmptyProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px',
      maxWidth: '440px',
      margin: '40px auto',
    }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(76, 175, 80, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--success, #4caf50)',
          marginBottom: '24px',
        }}
      >
        <CheckCircle2 size={48} />
      </motion.div>

      <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary, #fff)', margin: '0 0 8px 0' }}>
        Reviews Clear!
      </h3>
      
      <p style={{ fontSize: '14px', color: 'var(--text-secondary, #b3b3b9)', margin: '0 0 24px 0', lineHeight: 1.5 }}>
        {reviewCount > 0
          ? `Outstanding! You successfully reviewed ${reviewCount} flashcards.`
          : 'No cards are due right now.'}
      </p>

      <Button
        variant="primary"
        onClick={onBackToHome}
        style={{ width: '100%', marginBottom: '24px' }}
      >
        Back to Home
      </Button>

      <div style={{
        fontSize: '13px',
        color: 'var(--text-secondary, #b3b3b9)',
        fontStyle: 'italic',
        borderTop: '1px solid var(--border-strong, #2d2d34)',
        paddingTop: '16px',
        width: '100%',
      }}>
        💡 {motivationText}
      </div>
    </div>
  );
}
