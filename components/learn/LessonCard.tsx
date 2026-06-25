'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle2 } from 'lucide-react';

interface LessonCardProps {
  lessonId: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  isInProgress: boolean;
  category: string;
  index: number;
  onClick: () => void;
}

export function LessonCard({
  lessonId,
  title,
  description,
  xpReward,
  isCompleted,
  isLocked,
  isInProgress,
  category,
  index,
  onClick
}: LessonCardProps) {
  // Determine gradient color based on category
  const gradientColor = React.useMemo(() => {
    switch (category?.toLowerCase()) {
      case 'greetings':
        return 'linear-gradient(to bottom, #ec4899, #8b5cf6)';
      case 'numbers':
        return 'linear-gradient(to bottom, #f97316, #eab308)';
      case 'days':
        return 'linear-gradient(to bottom, #3b82f6, #06b6d4)';
      case 'jlpt n5':
        return 'linear-gradient(to bottom, #6366f1, #a855f7)';
      case 'phrases':
        return 'linear-gradient(to bottom, #10b981, #14b8a6)';
      default:
        return 'linear-gradient(to bottom, #6366f1, #3b82f6)';
    }
  }, [category]);

  const handleCardClick = () => {
    if (isLocked) {
      // Locked shake animation logic is handled by parent/motion div via animate state
      onClick();
    } else {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={!isLocked ? { y: -4, boxShadow: 'var(--shadow-lg, 0 12px 24px rgba(0,0,0,0.3))', transition: { duration: 0.15 } } : {}}
      whileTap={!isLocked ? { scale: 0.97, transition: { duration: 0.1 } } : { scale: 0.98 }}
      onClick={handleCardClick}
      style={{
        background: 'var(--surface-2, #2d2d34)',
        border: '1px solid var(--border-strong, #2d2d34)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        boxShadow: 'var(--shadow-sm)',
        opacity: isLocked ? 0.6 : 1,
        marginBottom: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Accent Left Border */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '5px',
        background: isLocked ? '#7e7e86' : gradientColor,
      }} />

      {/* Icon on Left */}
      <div style={{
        marginRight: '16px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isCompleted
          ? 'rgba(76, 175, 80, 0.12)'
          : isLocked
          ? 'var(--surface-3, #3a3a42)'
          : isInProgress
          ? 'rgba(255, 152, 0, 0.12)'
          : 'var(--surface-3, #3a3a42)',
        color: isCompleted
          ? 'var(--success, #4caf50)'
          : isLocked
          ? '#7e7e86'
          : isInProgress
          ? 'var(--primary, #ff9800)'
          : 'var(--text-secondary, #b3b3b9)',
        border: isInProgress ? '2px solid var(--primary, #ff9800)' : 'none',
        flexShrink: 0,
        boxShadow: isInProgress ? '0 0 10px rgba(255, 152, 0, 0.4)' : 'none',
      }}>
        {isCompleted ? (
          <CheckCircle2 size={22} />
        ) : isLocked ? (
          <Lock size={20} />
        ) : (
          <Play size={20} style={{ marginLeft: isInProgress ? '2px' : '0px' }} />
        )}
      </div>

      {/* Title & Description */}
      <div style={{ flex: 1, paddingRight: '48px' }}>
        <h4 style={{
          margin: 0,
          fontWeight: 800,
          fontSize: '15px',
          color: isLocked ? '#7e7e86' : 'var(--text-primary, #fff)',
        }}>
          {title}
        </h4>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '12px',
          color: 'var(--text-secondary, #b3b3b9)',
          lineHeight: 1.4,
        }}>
          {description}
        </p>
      </div>

      {/* Completion Badge (Top Right) */}
      {isCompleted && (
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(76, 175, 80, 0.15)',
          color: 'var(--success, #4caf50)',
          fontSize: '10px',
          fontWeight: 800,
          padding: '2px 6px',
          borderRadius: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Done
        </span>
      )}

      {/* XP Reward (Bottom Right) */}
      <span style={{
        position: 'absolute',
        bottom: '12px',
        right: '12px',
        color: 'var(--xp-gold, #ffc107)',
        fontSize: '11px',
        fontWeight: 800,
      }}>
        +{xpReward} XP
      </span>
    </motion.div>
  );
}
