'use client';

import React, { useState } from 'react';
import { Friend, Duel, StudyCircle } from '@evlo/types';
import { cn } from '@evlo/utils';
import { Trash2, UserPlus, Trophy, Users, ShieldAlert, Sparkles } from 'lucide-react';

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

function timeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}

export function SocialTab({
  friends: initialFriends,
  duels: initialDuels,
  circles: initialCircles,
  onNudgeFriend,
  onChallengeDuel,
  onJoinCircle,
  onAddFriend,
  myUserId,
}: SocialTabProps) {
  const [subTab, setSubTab] = useState<SocialSubTab>('friends');
  const [addInput, setAddInput] = useState('');
  const [showAddField, setShowAddField] = useState(false);

  // Local state for interactive friend removal and duel additions
  const [friendsList, setFriendsList] = useState<Friend[]>(initialFriends);
  const [duelsList, setDuelsList] = useState<Duel[]>(initialDuels);
  const [circlesList, setCirclesList] = useState<StudyCircle[]>(initialCircles);

  // Sync state if props change
  React.useEffect(() => {
    setFriendsList(initialFriends);
  }, [initialFriends]);

  React.useEffect(() => {
    setDuelsList(initialDuels);
  }, [initialDuels]);

  React.useEffect(() => {
    setCirclesList(initialCircles);
  }, [initialCircles]);

  const handleRemoveFriend = (friendId: string) => {
    setFriendsList(prev => prev.filter(f => f.friend_id !== friendId));
  };

  const handleChallenge = (friendId: string) => {
    onChallengeDuel(friendId);
    
    // Add to local duels list for instant UI feedback
    const friend = friendsList.find(f => f.friend_id === friendId);
    if (friend) {
      const newDuel: Duel = {
        duel_id: `d_temp_${Date.now()}`,
        challenger_id: myUserId,
        challenger_name: 'You',
        challenger_avatar: '🦊',
        opponent_id: friend.friend_id,
        opponent_name: friend.username,
        opponent_avatar: friend.avatar,
        lesson_id: 'ja_u01_l01_hello_basic',
        challenger_score: 0,
        opponent_score: null,
        status: 'pending',
        winner_id: null,
        xp_stake: 50,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
      setDuelsList(prev => [newDuel, ...prev]);
    }
  };

  const handleJoinLocalCircle = (circleId: string) => {
    onJoinCircle(circleId);
    setCirclesList(prev => prev.map(c => c.circle_id === circleId ? { ...c, is_member: true, member_count: c.member_count + 1 } : c));
  };

  const handleNudgeLocal = (friendId: string) => {
    onNudgeFriend(friendId);
    setFriendsList(prev => prev.map(f => f.friend_id === friendId ? { ...f, nudged_today: true } : f));
  };

  const handleAddLocalFriend = () => {
    if (!addInput.trim()) return;
    onAddFriend(addInput);
    
    // Add new friend to local list for immediate visual confirmation
    const newFriend: Friend = {
      friend_id: `f_temp_${Date.now()}`,
      username: addInput,
      avatar: '🐼',
      xp: 0,
      streak: 0,
      status: 'pending',
      lastActive: new Date().toISOString(),
      nudged_today: false,
    };
    setFriendsList(prev => [...prev, newFriend]);
    setAddInput('');
    setShowAddField(false);
  };

  const renderFriends = () => (
    <div className="animate-fadein">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-4)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{friendsList.filter(f => f.status === 'accepted').length} friends</p>
        <button
          className="btn-secondary"
          onClick={() => setShowAddField(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: 'var(--text-xs)', margin: 0, minHeight: 'unset' }}
        >
          <UserPlus size={14} /> Add Friend
        </button>
      </div>

      {showAddField && (
        <div className="card animate-fadein" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-4)', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            style={{ flex: 1, margin: 0 }}
            placeholder="Enter friend's username..."
            value={addInput}
            onChange={e => setAddInput(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={handleAddLocalFriend}
            style={{ width: 'auto', margin: 0, padding: '0 16px', background: 'var(--primary)' }}
          >
            Add
          </button>
        </div>
      )}

      {friendsList.length === 0 ? (
        <div className="social-empty text-center" style={{ padding: 'var(--sp-10)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
          <h3 className="font-bold">No friends yet</h3>
          <p className="text-muted text-sm mt-1">Add friends to compare progress, send nudges, and duel!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {friendsList.map(friend => (
            <div key={friend.friend_id} className="card" style={{ padding: 'var(--sp-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '32px', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                  {friend.avatar}
                </div>
                <div>
                  <h4 className="font-bold">{friend.username}</h4>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>
                    <span>⭐ {friend.xp} XP</span>
                    <span>•</span>
                    <span>🔥 {friend.streak}d streak</span>
                    <span>•</span>
                    <span>{timeSince(friend.lastActive)}</span>
                  </div>
                </div>
              </div>
              
              <div className="friend-actions">
                {friend.status === 'accepted' ? (
                  <>
                    <button
                      className={`btn-ghost ${friend.nudged_today ? 'disabled' : ''}`}
                      disabled={friend.nudged_today}
                      onClick={() => handleNudgeLocal(friend.friend_id)}
                      style={{ padding: '6px 12px', fontSize: '11px', minHeight: 'unset', background: friend.nudged_today ? 'var(--surface-3)' : 'var(--primary-light)', color: friend.nudged_today ? 'var(--text-3)' : 'var(--primary)', border: 'none', borderRadius: 'var(--radius)' }}
                    >
                      {friend.nudged_today ? '👋 Sent' : '👋 Nudge'}
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => handleChallenge(friend.friend_id)}
                      style={{ padding: '6px', borderRadius: 'var(--radius)', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}
                      title="Challenge to a duel"
                    >
                      ⚔️
                    </button>
                  </>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-3)', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: '4px' }}>Pending</span>
                )}
                
                <button
                  className="btn-ghost"
                  onClick={() => handleRemoveFriend(friend.friend_id)}
                  style={{ padding: '6px', borderRadius: 'var(--radius)', color: 'var(--text-3)' }}
                  title="Remove friend"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDuels = () => (
    <div className="animate-fadein">
      {/* Challenge Card inside Duels tab */}
      <div className="card" style={{ padding: 'var(--sp-4)', marginBottom: 'var(--sp-5)' }}>
        <h3 className="font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} className="text-gold" /> Challenge a Friend
        </h3>
        <p className="text-muted text-xs mt-1 mb-4">
          Challenge any of your accepted friends to a 24-hour Japanese vocabulary duel!
        </p>
        
        {friendsList.filter(f => f.status === 'accepted').length === 0 ? (
          <p className="text-xs text-muted">You need to have accepted friends to start a duel.</p>
        ) : (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {friendsList.filter(f => f.status === 'accepted').map(friend => (
              <button
                key={friend.friend_id}
                onClick={() => handleChallenge(friend.friend_id)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, minHeight: 'unset' }}
              >
                <span>{friend.avatar}</span>
                <span>Challenge {friend.username}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Duels List */}
      <h3 className="text-base font-bold mb-3">Active Duels</h3>
      
      {duelsList.length === 0 ? (
        <div className="social-empty text-center" style={{ padding: 'var(--sp-10)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚔️</div>
          <h3 className="font-bold">No active duels</h3>
          <p className="text-muted text-sm mt-1">Challenge a friend to a lesson duel. Whoever scores higher wins!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {duelsList.map(duel => {
            const isChallenger = duel.challenger_id === myUserId;
            const myScore = isChallenger ? duel.challenger_score : duel.opponent_score;
            const oppScore = isChallenger ? duel.opponent_score : duel.challenger_score;
            const oppName = isChallenger ? duel.opponent_name : duel.challenger_name;
            const oppAvatar = isChallenger ? duel.opponent_avatar : duel.challenger_avatar;

            return (
              <div key={duel.duel_id} className="card" style={{ padding: 'var(--sp-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 'var(--sp-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px' }}>🦊</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 'bold' }}>You</span>
                      <p style={{ fontSize: '16px', fontWeight: 900, marginTop: '2px' }}>{myScore !== null ? myScore : '—'}</p>
                    </div>
                    
                    <div style={{ padding: '0 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--error)' }}>VS</span>
                      <p style={{ fontSize: '9px', color: 'var(--text-3)', marginTop: '2px', background: 'var(--surface-3)', padding: '2px 6px', borderRadius: '4px' }}>
                        {duel.xp_stake} XP
                      </p>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px' }}>{oppAvatar}</div>
                      <span style={{ fontSize: '11px', color: 'var(--text-2)', fontWeight: 'bold' }}>{oppName}</span>
                      <p style={{ fontSize: '16px', fontWeight: 900, marginTop: '2px' }}>{oppScore !== null ? oppScore : '—'}</p>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: duel.status === 'completed' ? 'var(--success)' : 'var(--primary)', background: duel.status === 'completed' ? 'var(--success-light)' : 'var(--primary-light)', padding: '4px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                    {duel.status === 'pending' ? '⏳ Pending' : duel.status === 'active' ? '⚡ Active' : duel.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderCircles = () => (
    <div className="animate-fadein">
      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          Study circles are groups that tackle weekly learning missions together. Join one to collaborate!
        </p>
      </div>

      {circlesList.length === 0 ? (
        <div className="social-empty text-center" style={{ padding: 'var(--sp-10)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔵</div>
          <h3 className="font-bold">No circles yet</h3>
          <p className="text-muted text-sm mt-1">Join a study circle to collaborate on weekly missions.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {circlesList.map(circle => {
            const missionPct = Math.round((circle.mission_progress / circle.mission_target) * 100);
            return (
              <div key={circle.circle_id} className="card" style={{ padding: 'var(--sp-4)', display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '36px', width: '54px', height: '54px', borderRadius: '12px', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                    {circle.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 className="font-bold">{circle.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-2)', marginTop: '2px' }}>{circle.description}</p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '11px', color: 'var(--text-3)', marginTop: '6px' }}>
                      <span>👥 {circle.member_count} members</span>
                      <span>•</span>
                      <span>⚡ {circle.weekly_xp} weekly XP</span>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold', color: 'var(--text-3)', marginBottom: '4px' }}>
                        <span>Mission: {circle.current_mission}</span>
                        <span>{missionPct}%</span>
                      </div>
                      <div className="lesson-progress-bar" style={{ height: '6px', marginBottom: 0 }}>
                        <div className="lesson-progress-fill" style={{ width: `${missionPct}%`, background: 'var(--primary)' }} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  {circle.is_member ? (
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--success)', background: 'var(--success-light)', padding: '6px 12px', borderRadius: 'var(--radius)' }}>
                      ✓ Member
                    </span>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => handleJoinLocalCircle(circle.circle_id)}
                      style={{ padding: '6px 16px', fontSize: '12px', width: 'auto', margin: 0, minHeight: 'unset', background: 'var(--primary)' }}
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
    <div className="social-view page-transition animate-fadein" style={{ padding: 'var(--sp-4)', maxWidth: '600px', margin: '0 auto' }}>
      <div className="home-header" style={{ marginBottom: 'var(--sp-4)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>👥 Social Hub</h2>
        <p style={{ color: 'var(--text-2)', fontSize: 'var(--text-sm)', marginTop: '2px' }}>Friends, duels, and study circles</p>
      </div>

      {/* Sub-tab switcher */}
      <div className="flex gap-2" style={{ background: 'var(--surface-2)', padding: '6px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: 'var(--sp-5)' }}>
        {(['friends', 'duels', 'circles'] as SocialSubTab[]).map(tab => (
          <button
            key={tab}
            className={`toggle-btn ${subTab === tab ? 'active' : ''}`}
            onClick={() => setSubTab(tab)}
            style={{ flex: 1, textAlign: 'center', padding: '8px 0', border: 'none', borderRadius: 'var(--radius)', textTransform: 'capitalize' }}
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
