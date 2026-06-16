'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Zap } from 'lucide-react';

interface LeaderboardEntry {
  uid: string;
  name: string;
  xp: number;
  streak: number;
  level: number;
  isPremium?: boolean;
}

const TIER_EMOJIS = ['🥇', '🥈', '🥉'];
const TIER_COLORS = ['#fbbf24', '#9ca3af', '#cd7c2f'];

export function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'xp' | 'streak'>('xp');

  useEffect(() => {
    const field = tab === 'xp' ? 'xp' : 'streak';
    const q = query(
      collection(db, 'users'),
      orderBy(field, 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => d.data() as LeaderboardEntry);
      setEntries(data);
      setLoading(false);
    }, (err) => {
      console.error('Leaderboard error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [tab]);

  const myRank = entries.findIndex(e => e.uid === user?.id) + 1;

  return (
    <div style={{ padding: 'var(--space-5)', maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <Trophy size={28} color="var(--amber)" />
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 900, margin: 0 }}>Leaderboard</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Real-time rankings</p>
        </div>
        {myRank > 0 && (
          <div style={{
            marginLeft: 'auto',
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 12px',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--green-400)'
          }}>
            Your rank: #{myRank}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 'var(--radius-pill)',
        padding: 4,
        border: '1px solid var(--border)',
        marginBottom: 'var(--space-5)',
        width: 'fit-content'
      }}>
        {(['xp', 'streak'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 20px',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: tab === t ? 'var(--green-500)' : 'transparent',
            color: '#fff',
            fontWeight: 700,
            fontSize: 'var(--text-xs)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {t === 'xp' ? <><Zap size={12} /> XP</> : <><Flame size={12} /> Streak</>}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      {!loading && entries.length >= 3 && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 'var(--space-3)',
          marginBottom: 'var(--space-5)',
          padding: 'var(--space-4)',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
        }}>
          {/* 2nd */}
          <PodiumCard entry={entries[1]} rank={2} tab={tab} height={80} />
          {/* 1st */}
          <PodiumCard entry={entries[0]} rank={1} tab={tab} height={110} />
          {/* 3rd */}
          <PodiumCard entry={entries[2]} rank={3} tab={tab} height={60} />
        </div>
      )}

      {/* Full list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
          <div className="splash-bar" style={{ width: 120, margin: '0 auto' }} />
          <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>Loading rankings...</p>
        </div>
      ) : entries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
          <p>No players yet — be the first! 🏆</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {entries.slice(3).map((entry, i) => (
            <div
              key={entry.uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                background: entry.uid === user?.id ? 'rgba(74,222,128,0.08)' : 'var(--bg-card)',
                border: `1px solid ${entry.uid === user?.id ? 'rgba(74,222,128,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                transition: 'background 0.2s',
              }}
            >
              <span style={{ width: 28, textAlign: 'center', fontWeight: 800, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                #{i + 4}
              </span>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'var(--bg-surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                {entry.isPremium ? '⭐' : '🌿'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {entry.name || 'Learner'}
                  {entry.uid === user?.id && <span style={{ color: 'var(--green-400)', marginLeft: 6, fontSize: 10 }}>YOU</span>}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Level {entry.level || 1}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, color: tab === 'xp' ? 'var(--amber)' : 'var(--orange)', fontSize: 'var(--text-sm)' }}>
                  {tab === 'xp' ? `${entry.xp ?? 0} XP` : `${entry.streak ?? 0} 🔥`}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PodiumCard({ entry, rank, tab, height }: { entry: LeaderboardEntry; rank: number; tab: 'xp' | 'streak'; height: number }) {
  const emoji = TIER_EMOJIS[rank - 1];
  const color = TIER_COLORS[rank - 1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{ fontSize: rank === 1 ? 28 : 22, marginBottom: 4 }}>{entry.isPremium ? '⭐' : '🌿'}</div>
      <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textAlign: 'center', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.name || 'Learner'}
      </div>
      <div style={{ fontSize: 'var(--text-xs)', color: tab === 'xp' ? '#fbbf24' : 'var(--orange)', fontWeight: 800 }}>
        {tab === 'xp' ? `${entry.xp ?? 0} XP` : `${entry.streak ?? 0}🔥`}
      </div>
      <div style={{
        marginTop: 8,
        width: '100%',
        height,
        background: `linear-gradient(to top, ${color}33, transparent)`,
        border: `1px solid ${color}55`,
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 8,
        fontSize: rank === 1 ? 24 : 18,
      }}>
        {emoji}
      </div>
    </div>
  );
}
