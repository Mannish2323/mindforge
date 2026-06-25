'use client';

import React from 'react';
import { Badge, BadgeRarity } from '@evlo/types';

interface BadgesViewProps {
  badges: Badge[];
  onBack: () => void;
}

const rarityConfig: Record<BadgeRarity, { label: string; color: string; glow: string; border: string }> = {
  common:    { label: 'Common',    color: 'var(--text-secondary)', glow: 'none', border: 'var(--border)' },
  rare:      { label: 'Rare',      color: 'var(--blue)',           glow: '0 0 12px rgba(96,165,250,0.4)', border: 'rgba(96,165,250,0.35)' },
  epic:      { label: 'Epic',      color: 'var(--purple)',         glow: '0 0 16px rgba(167,139,250,0.5)', border: 'rgba(167,139,250,0.4)' },
  legendary: { label: 'Legendary', color: 'var(--amber)',          glow: '0 0 20px rgba(251,191,36,0.55)', border: 'rgba(251,191,36,0.45)' },
};

const categoryLabels: Record<Badge['category'], string> = {
  learning: '📚 Learning',
  streak:   '🔥 Streak',
  social:   '🤝 Social',
  mastery:  '⭐ Mastery',
  special:  '✨ Special',
};

export function BadgesView({ badges, onBack }: BadgesViewProps) {
  const unlockedBadges = badges.filter(b => b.unlockedAt !== null);
  const lockedBadges = badges.filter(b => b.unlockedAt === null);

  const renderBadge = (badge: Badge) => {
    const cfg = rarityConfig[badge.rarity];
    const unlocked = badge.unlockedAt !== null;

    return (
      <div
        key={badge.badge_id}
        className={`badge-card${unlocked ? ' badge-unlocked' : ' badge-locked'}`}
        style={{
          borderColor: unlocked ? cfg.border : 'var(--border)',
          boxShadow: unlocked ? cfg.glow : 'none',
        }}
        title={badge.description}
        id={`badge-${badge.badge_id}`}
      >
        <div
          className="badge-icon-wrap"
          style={{
            filter: unlocked ? 'none' : 'grayscale(100%) opacity(0.35)',
            fontSize: '32px',
          }}
        >
          {badge.icon}
        </div>
        <div className="badge-title">{badge.title}</div>
        <div className="badge-rarity-label" style={{ color: unlocked ? cfg.color : 'var(--text-muted)' }}>
          {cfg.label}
        </div>
        {unlocked && (
          <div className="badge-unlocked-dot" />
        )}
      </div>
    );
  };

  const categories = ['learning', 'streak', 'social', 'mastery', 'special'] as Badge['category'][];

  return (
    <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} id="badges-back-btn">← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🏅 Badge Collection</h2>
      </div>

      {/* Summary */}
      <div className="badge-summary-row">
        <div className="badge-summary-stat">
          <span className="badge-summary-num">{unlockedBadges.length}</span>
          <span className="badge-summary-label">Unlocked</span>
        </div>
        <div className="badge-summary-stat">
          <span className="badge-summary-num" style={{ color: 'var(--text-muted)' }}>{lockedBadges.length}</span>
          <span className="badge-summary-label">Remaining</span>
        </div>
        <div className="badge-summary-stat">
          <span className="badge-summary-num" style={{ color: 'var(--amber)' }}>
            {badges.filter(b => b.rarity === 'legendary' && b.unlockedAt).length}
          </span>
          <span className="badge-summary-label">Legendary</span>
        </div>
      </div>

      {/* Category sections */}
      {categories.map(cat => {
        const catBadges = badges.filter(b => b.category === cat);
        if (catBadges.length === 0) return null;
        return (
          <div key={cat} className="badge-category-section">
            <h3 className="badge-category-label">{categoryLabels[cat]}</h3>
            <div className="badge-grid">
              {catBadges.map(renderBadge)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
