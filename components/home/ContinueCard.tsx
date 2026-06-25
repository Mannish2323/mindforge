'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../app/context/AuthContext';
import { useStoreContext } from '../../app/context/StoreContext';

interface ContinueCardProps {
  isNewUser: boolean;
  onContinue: () => void;
}

function VineProgressBar({ progress }: { progress: number }) {
  // Vine coordinates for rendering leaves
  const leaves = [
    { x: 30, y: 15, rot: -30, thresh: 20 },
    { x: 75, y: 25, rot: 45, thresh: 40 },
    { x: 120, y: 15, rot: -15, thresh: 60 },
    { x: 165, y: 25, rot: 30, thresh: 80 },
    { x: 210, y: 15, rot: -45, thresh: 95 },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '40px', marginTop: '12px' }}>
      <svg viewBox="0 0 240 40" width="100%" height="100%" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
        {/* Background vine/branch */}
        <path
          d="M 10,20 C 50,0 70,40 110,20 C 150,0 170,40 210,20 L 230,20"
          fill="none"
          stroke="var(--surface-3, #E7E0D3)"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Foreground (active) vine/branch */}
        <path
          d="M 10,20 C 50,0 70,40 110,20 C 150,0 170,40 210,20 L 230,20"
          fill="none"
          stroke="var(--success, #5D9C59)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="240"
          strokeDashoffset={240 - (240 * progress) / 100}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />

        {/* Leaves */}
        {leaves.map((leaf, index) => {
          const active = progress >= leaf.thresh;
          return (
            <g
              key={index}
              transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.rot})`}
              style={{ transition: 'all 0.5s ease', transformOrigin: 'center' }}
            >
              {/* Stem */}
              <path
                d="M 0,0 L 0,-6"
                stroke={active ? 'var(--success, #5D9C59)' : 'var(--surface-3, #E7E0D3)'}
                strokeWidth="1.5"
              />
              {/* Leaf blade */}
              <path
                d="M 0,-6 C -4,-12 0,-18 0,-18 C 0,-18 4,-12 0,-6 Z"
                fill={active ? '#A3E635' : 'var(--surface-3, #E7E0D3)'}
                stroke={active ? 'var(--success, #5D9C59)' : 'var(--border-strong)'}
                strokeWidth="1.2"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ContinueCard({ isNewUser, onContinue }: ContinueCardProps) {
  const { profile } = useAuth();
  const { state } = useStoreContext();

  const progress = React.useMemo(() => {
    if (isNewUser) return 0;
    const goalXp = Math.max(50, (state?.goalMinutes || 20) * 5);
    const xp = profile?.xp ?? state?.xp ?? 0;
    const todayXp = xp % goalXp;
    const computed = Math.min(100, Math.round((todayXp / goalXp) * 100));
    // Default returning users to at least 25% progress so the vine has some green leaves growing
    return computed === 0 ? 25 : computed;
  }, [profile, state, isNewUser]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      onClick={onContinue}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-strong)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: 'var(--shadow)',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--primary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'block'
          }}>
            Continue Lesson
          </span>
          <h3 style={{ fontWeight: 900, marginTop: '4px', fontSize: '18px', margin: '4px 0 0 0', color: 'var(--text)' }}>
            {isNewUser ? 'Begin Learning Japanese' : 'Continue Learning'}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-2)', margin: '6px 0 0 0' }}>
            {isNewUser ? 'Dive into Unit 1 — Greetings & Basics' : 'Pick up where you left off & grow today!'}
          </p>
        </div>
        <span style={{ fontSize: '28px' }}>🌱</span>
      </div>

      {/* Dynamic leafy vine progress bar */}
      <VineProgressBar progress={progress} />

      {/* Start Button at bottom right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContinue();
          }}
          style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '10px 24px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 800,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
            transition: 'all 0.2s ease',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(22, 163, 74, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.25)';
          }}
        >
          Start
        </button>
      </div>
    </motion.div>
  );
}

