'use client';

import React from 'react';
import { Quest } from '@evlo/types';

interface QuestsViewProps {
  quests: Quest[];
  onClaimQuest: (questId: string) => void;
  onBack: () => void;
}

const rarityColor: Record<Quest['type'], string> = {
  daily: 'var(--green-400)',
  weekly: 'var(--amber)',
  special: 'var(--purple)',
};

export function QuestsView({ quests, onClaimQuest, onBack }: QuestsViewProps) {
  const daily = quests.filter(q => q.type === 'daily');
  const weekly = quests.filter(q => q.type === 'weekly');
  const special = quests.filter(q => q.type === 'special');

  const renderQuest = (quest: Quest) => {
    const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
    const isDone = quest.status === 'completed';
    const isClaimed = quest.status === 'claimed';

    return (
      <div key={quest.quest_id} className={`quest-card${isDone ? ' quest-done' : ''}${isClaimed ? ' quest-claimed' : ''}`}>
        <div className="quest-icon-wrap">
          <span className="quest-icon">{quest.icon}</span>
        </div>
        <div className="quest-info">
          <div className="quest-header-row">
            <span className="quest-title">{quest.title}</span>
            <span className="quest-type-badge" style={{ color: rarityColor[quest.type] }}>
              {quest.type.toUpperCase()}
            </span>
          </div>
          <p className="quest-desc">{quest.description}</p>
          <div className="quest-progress-wrap">
            <div className="quest-progress-bar">
              <div
                className="quest-progress-fill"
                style={{
                  width: `${pct}%`,
                  background: isDone ? 'var(--grad-primary)' : 'var(--green-500)',
                }}
              />
            </div>
            <span className="quest-progress-text">{quest.progress}/{quest.target}</span>
          </div>
          <div className="quest-rewards">
            <span className="quest-reward xp">⚡ +{quest.xp_reward} XP</span>
            <span className="quest-reward gem">💎 +{quest.gem_reward}</span>
          </div>
        </div>
        <div className="quest-action">
          {isClaimed ? (
            <span className="quest-claimed-badge">✓ Claimed</span>
          ) : isDone ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onClaimQuest(quest.quest_id)}
              id={`claim-quest-${quest.quest_id}`}
            >
              Claim!
            </button>
          ) : (
            <span className="quest-pct">{pct}%</span>
          )}
        </div>
      </div>
    );
  };

  const Section = ({ title, items, emptyMsg }: { title: string; items: Quest[]; emptyMsg: string }) => (
    <div className="quest-section">
      <h3 className="quest-section-title">{title}</h3>
      {items.length === 0 ? (
        <p className="quest-empty">{emptyMsg}</p>
      ) : (
        <div className="quest-list">{items.map(renderQuest)}</div>
      )}
    </div>
  );

  return (
    <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack} id="quests-back-btn">← Back</button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🎯 Quests</h2>
      </div>

      {/* Season streak shield CTA */}
      <div className="quest-shield-banner">
        <span className="shield-icon">🛡️</span>
        <div>
          <div className="shield-title">Streak Shield</div>
          <div className="shield-sub">Protects your streak for 1 missed day</div>
        </div>
        <button className="btn btn-sm" style={{ background: 'var(--grad-gold)', color: '#000', fontWeight: 700 }}>
          Activate
        </button>
      </div>

      <Section title="Daily Quests" items={daily} emptyMsg="No daily quests active. Check back tomorrow!" />
      <Section title="Weekly Quests" items={weekly} emptyMsg="Weekly quests refresh on Monday." />
      {special.length > 0 && (
        <Section title="Special Events" items={special} emptyMsg="" />
      )}
    </div>
  );
}
