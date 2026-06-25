'use client';

import React from 'react';

interface BadgeDef {
  badge_id: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
}

interface BadgesRowProps {
  unlockedBadges: BadgeDef[];
}

export function BadgesRow({ unlockedBadges }: BadgesRowProps) {
  return (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary, #fff)', margin: '0 0 8px 0' }}>🏅 Badges Earned</h3>
      {unlockedBadges.length === 0 ? (
        <div className="card" style={{ padding: '16px', textAlign: 'center', background: 'var(--surface-2, #2d2d34)' }}>
          <span style={{ fontSize: '24px' }}>🏆</span>
          <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)' }}>
            Complete lessons to earn badges!
          </p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {unlockedBadges.map((badge) => (
            <div 
              key={badge.badge_id} 
              title={badge.description}
              style={{
                fontSize: '32px',
                background: 'var(--surface-3, #3a3a42)',
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {badge.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
