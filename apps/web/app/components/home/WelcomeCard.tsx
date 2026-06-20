'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useStoreContext } from '../../context/StoreContext';

interface WelcomeCardProps {
  username: string;
  isNewUser: boolean;
  onNavigate: (tab: string, subView?: string) => void;
  onContinueLesson: () => void;
}

export function WelcomeCard({ username, isNewUser, onNavigate, onContinueLesson }: WelcomeCardProps) {
  const { profile } = useAuth();
  const { state } = useStoreContext();

  const activeStats = React.useMemo(() => {
    return {
      xp: profile?.xp ?? state?.xp ?? 0,
      gems: profile?.leafBalance ?? state?.gems ?? 5,
      streak: profile?.streak ?? state?.streak ?? 0,
      completedToday: Object.values(state?.lessonProgress || {}).some((l: any) => {
        const ts = l.completedAt;
        return ts && new Date(ts).toDateString() === new Date().toDateString();
      }),
    };
  }, [profile, state]);

  const quickLaunchItems = [
    { icon: '📖', label: 'First Lesson', action: onContinueLesson },
    { icon: 'あ', label: 'Script Lab', action: () => onNavigate('script') },
    { icon: '🎯', label: 'JLPT Path', action: () => onNavigate('jlpt') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: 'var(--shadow)',
      }}
    >
      <style>{`
        .speech-bubble {
          position: relative;
          background: var(--surface-2);
          border: 1px solid var(--border-strong);
          border-radius: var(--radius-lg);
          padding: 14px 16px;
          flex: 1;
        }
        .speech-bubble::before {
          content: '';
          position: absolute;
          left: -8px;
          top: 24px;
          border-width: 8px 8px 8px 0;
          border-style: solid;
          border-color: transparent var(--border-strong) transparent transparent;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          left: -7px;
          top: 24px;
          border-width: 8px 8px 8px 0;
          border-style: solid;
          border-color: transparent var(--surface-2) transparent transparent;
        }
        .stat-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-pill);
          background: var(--surface-2);
          border: 1px solid var(--border);
          font-size: 13px;
          font-weight: 700;
          flex: 1;
          min-width: 0;
        }
      `}</style>

      {/* Mascot & Speech Bubble Section */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        {/* Mascot */}
        <div style={{ flexShrink: 0 }}>
          <img
            src="/velmorth_mascot.png"
            alt="Velmorth"
            className="animate-sway"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* Speech Bubble */}
        <div className="speech-bubble">
          <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text)', lineHeight: 1.3 }}>
            {isNewUser ? `Welcome to Velmorth! Ready to grow today?` : `Welcome back! Ready to grow today?`}
          </div>
        </div>
      </div>

      {/* Stats Pills Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {/* Streak */}
        <div className="stat-badge" style={{ color: activeStats.streak > 0 ? '#f97316' : 'var(--text-3)' }}>
          <span style={{ fontSize: '16px' }}>🔥</span>
          <span style={{ whiteSpace: 'nowrap' }}>{activeStats.streak} day{activeStats.streak !== 1 ? 's' : ''}</span>
        </div>

        {/* XP */}
        <div className="stat-badge" style={{ color: 'var(--xp-gold)' }}>
          <span style={{ fontSize: '16px' }}>⭐</span>
          <span style={{ whiteSpace: 'nowrap' }}>{activeStats.xp} XP</span>
        </div>

        {/* Leaves */}
        <div className="stat-badge" style={{ color: '#22c55e' }}>
          <span style={{ fontSize: '16px' }}>🌿</span>
          <span style={{ whiteSpace: 'nowrap' }}>{activeStats.gems}</span>
        </div>
      </div>

      {/* Quick Launch Buttons (Only for New Users) */}
      {isNewUser && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Start
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {quickLaunchItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 8px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--surface-2)',
                  cursor: 'pointer',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  transition: 'background var(--t-fast)',
                }}
              >
                <span style={{ fontSize: '24px', fontFamily: 'var(--font-ja)' }}>{item.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

