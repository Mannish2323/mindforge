'use client';

import React, { useState } from 'react';
import { Friend, Duel, StudyCircle } from '@evlo/types';
import { cn } from '@evlo/utils';

interface SocialTabProps {
  friends: Friend[];
  duels: Duel[];
  circles: StudyCircle[];
  onNudgeFriend: (friendId: string) => void;
  onChallengeDuel: (friendId: string) => void;
  onJoinCircle: (circleId: string) => void;
  onAddFriend: (username: string) => void;
  myUserId: string;
}

type SocialSubTab = 'friends' | 'duels' | 'circles';

// Mock function to generate time-since string
function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}

export function SocialTab({
  friends,
  duels,
  circles,
  onNudgeFriend,
  onChallengeDuel,
  onJoinCircle,
  onAddFriend,
  myUserId,
}: SocialTabProps) {
  const [subTab, setSubTab] = useState<SocialSubTab>('friends');
  const [addInput, setAddInput] = useState('');
  const [showAddField, setShowAddField] = useState(false);

  const renderFriends = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{friends.filter(f => f.status === 'accepted').length} friends</p>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setShowAddField(v => !v)}
          id="add-friend-toggle-btn"
        >
          + Add Friend
        </button>
      </div>

      {showAddField && (
        <div className="add-friend-form">
          <input
            type="text"
            className="add-friend-input"
            placeholder="Enter username..."
            value={addInput}
            onChange={e => setAddInput(e.target.value)}
            id="add-friend-input"
          />
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { onAddFriend(addInput); setAddInput(''); setShowAddField(false); }}
            id="add-friend-submit-btn"
          >
            Send
          </button>
        </div>
      )}

      {friends.length === 0 ? (
        <div className="social-empty">
          <div style={{ fontSize: '48px' }}>👥</div>
          <h3>No friends yet</h3>
          <p>Add friends to compare progress, send nudges, and duel!</p>
        </div>
      ) : (
        <div className="friend-list">
          {friends.map(friend => (
            <div key={friend.friend_id} className={`friend-card ${friend.status}`} id={`friend-${friend.friend_id}`}>
              <div className="friend-avatar">{friend.avatar}</div>
              <div className="friend-info">
                <div className="friend-name">{friend.username}</div>
                <div className="friend-stats">
                  <span className="friend-stat xp">⚡ {friend.xp.toLocaleString()}</span>
                  <span className="friend-stat streak">🔥 {friend.streak}d</span>
                  <span className="friend-last-active">{timeSince(friend.lastActive)}</span>
                </div>
              </div>
              {friend.status === 'accepted' ? (
                <div className="friend-actions">
                  <button
                    className={cn('btn btn-sm', friend.nudged_today ? 'btn-ghost' : 'btn-secondary')}
                    disabled={friend.nudged_today}
                    onClick={() => onNudgeFriend(friend.friend_id)}
                    id={`nudge-${friend.friend_id}`}
                    title="Send a nudge to motivate your friend"
                  >
                    {friend.nudged_today ? '👋 Sent' : '👋 Nudge'}
                  </button>
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => onChallengeDuel(friend.friend_id)}
                    id={`duel-${friend.friend_id}`}
                    title="Challenge to a lesson duel"
                  >
                    ⚔️
                  </button>
                </div>
              ) : (
                <span className="friend-pending-badge">Pending</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDuels = () => (
    <div>
      {duels.length === 0 ? (
        <div className="social-empty">
          <div style={{ fontSize: '48px' }}>⚔️</div>
          <h3>No active duels</h3>
          <p>Challenge a friend to a lesson duel. Whoever scores higher wins!</p>
        </div>
      ) : (
        <div className="duel-list">
          {duels.map(duel => {
            const isChallenger = duel.challenger_id === myUserId;
            const myScore = isChallenger ? duel.challenger_score : duel.opponent_score;
            const oppScore = isChallenger ? duel.opponent_score : duel.challenger_score;
            const oppName = isChallenger ? duel.opponent_name : duel.challenger_name;
            const oppAvatar = isChallenger ? duel.opponent_avatar : duel.challenger_avatar;

            return (
              <div key={duel.duel_id} className={`duel-card ${duel.status}`} id={`duel-card-${duel.duel_id}`}>
                <div className="duel-players">
                  <div className="duel-player you">
                    <div className="duel-player-avatar">😊</div>
                    <div className="duel-player-name">You</div>
                    <div className="duel-player-score">
                      {myScore !== null ? myScore : '—'}
                    </div>
                  </div>
                  <div className="duel-vs">
                    <span className="duel-vs-text">VS</span>
                    <span className="duel-stake">±{duel.xp_stake} XP</span>
                  </div>
                  <div className="duel-player opp">
                    <div className="duel-player-avatar">{oppAvatar}</div>
                    <div className="duel-player-name">{oppName}</div>
                    <div className="duel-player-score">
                      {oppScore !== null ? oppScore : '—'}
                    </div>
                  </div>
                </div>

                <div className="duel-footer">
                  <span className={`duel-status-badge ${duel.status}`}>
                    {duel.status === 'pending' && '⏳ Waiting'}
                    {duel.status === 'active' && '⚡ Active'}
                    {duel.status === 'completed' && (duel.winner_id === myUserId ? '🏆 You Won!' : '😤 Opponent Won')}
                    {duel.status === 'expired' && '⌛ Expired'}
                  </span>
                  {duel.status === 'pending' && isChallenger && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Waiting for {duel.opponent_name} to accept
                    </span>
                  )}
                  {duel.status === 'active' && myScore === null && (
                    <button className="btn btn-primary btn-sm">
                      Play Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCircles = () => (
    <div>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Study circles are groups that tackle weekly learning missions together.
        </p>
      </div>
      {circles.length === 0 ? (
        <div className="social-empty">
          <div style={{ fontSize: '48px' }}>🔵</div>
          <h3>No circles yet</h3>
          <p>Join a study circle to collaborate on weekly missions.</p>
        </div>
      ) : (
        <div className="circle-list">
          {circles.map(circle => {
            const missionPct = Math.round((circle.mission_progress / circle.mission_target) * 100);
            return (
              <div key={circle.circle_id} className={`circle-card${circle.is_member ? ' member' : ''}`} id={`circle-${circle.circle_id}`}>
                <div className="circle-avatar">{circle.avatar}</div>
                <div className="circle-info">
                  <div className="circle-name">{circle.name}</div>
                  <div className="circle-desc">{circle.description}</div>
                  <div className="circle-stats-row">
                    <span className="circle-stat">👥 {circle.member_count}</span>
                    <span className="circle-stat">⚡ {circle.weekly_xp.toLocaleString()} this week</span>
                  </div>
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Mission: {circle.current_mission} — {missionPct}%
                    </div>
                    <div className="circle-mission-bar">
                      <div className="circle-mission-fill" style={{ width: `${missionPct}%` }} />
                    </div>
                  </div>
                </div>
                <div>
                  {circle.is_member ? (
                    <span className="circle-member-badge">✓ Member</span>
                  ) : (
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => onJoinCircle(circle.circle_id)}
                      id={`join-circle-${circle.circle_id}`}
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
      <div className="home-header">
        <h2>👥 Social</h2>
        <p>Friends, duels, and study circles</p>
      </div>

      {/* Sub-tab switcher */}
      <div className="social-sub-tabs">
        {(['friends', 'duels', 'circles'] as SocialSubTab[]).map(tab => (
          <button
            key={tab}
            className={cn('social-sub-tab', { active: subTab === tab })}
            onClick={() => setSubTab(tab)}
            id={`social-subtab-${tab}`}
          >
            {tab === 'friends' && '👫 Friends'}
            {tab === 'duels' && '⚔️ Duels'}
            {tab === 'circles' && '🔵 Circles'}
          </button>
        ))}
      </div>

      <div className="social-content">
        {subTab === 'friends' && renderFriends()}
        {subTab === 'duels' && renderDuels()}
        {subTab === 'circles' && renderCircles()}
      </div>
    </div>
  );
}
