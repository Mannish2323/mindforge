'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Trophy, Flame, Zap, Award } from 'lucide-react';

interface LeaderboardEntry {
  uid: string;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  level: number;
  isPremium: boolean;
  rank?: number;
}

const TIER_EMOJIS = ['🥇', '🥈', '🥉'];
const TIER_COLORS = ['#fbbf24', '#9ca3af', '#cd7c2f'];

export function Leaderboard() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'xp' | 'streak'>('xp');
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'alltime'>('alltime');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        if (tab === 'xp') {
          // Fetch from user_stats ordered by xp_total (alltime) or xp_today (weekly approximation)
          const orderByField = timeFilter === 'alltime' ? 'xp_total' : 'xp_today';
          
          const { data, error } = await supabase
            .from('user_stats')
            .select(`
              xp_total,
              xp_today,
              user_id,
              profiles (
                username,
                display_name,
                avatar_url
              ),
              entitlements (
                status
              )
            `)
            .order(orderByField, { ascending: false })
            .limit(50);

          if (error) throw error;

          const formatted: LeaderboardEntry[] = (data || []).map((row: any) => {
            const p = row.profiles || {};
            const e = row.entitlements || {};
            const xpVal = timeFilter === 'alltime' ? row.xp_total : row.xp_today;
            return {
              uid: row.user_id,
              name: p.display_name || p.username || 'Learner',
              avatar: p.avatar_url || '🦊',
              xp: xpVal ?? 0,
              streak: 0, // Will fetch streaks if needed, or default
              level: Math.floor((row.xp_total ?? 0) / 100) + 1,
              isPremium: e.status === 'pro' || e.status === 'yearly'
            };
          });

          setEntries(formatted);
        } else {
          // Fetch from user_streaks ordered by streak
          const { data, error } = await supabase
            .from('user_streaks')
            .select(`
              streak,
              user_id,
              profiles (
                username,
                display_name,
                avatar_url
              ),
              user_stats (
                xp_total
              ),
              entitlements (
                status
              )
            `)
            .order('streak', { ascending: false })
            .limit(50);

          if (error) throw error;

          const formatted: LeaderboardEntry[] = (data || []).map((row: any) => {
            const p = row.profiles || {};
            const stats = row.user_stats || {};
            const e = row.entitlements || {};
            return {
              uid: row.user_id,
              name: p.display_name || p.username || 'Learner',
              avatar: p.avatar_url || '🦊',
              xp: 0,
              streak: row.streak ?? 0,
              level: Math.floor((stats.xp_total ?? 0) / 100) + 1,
              isPremium: e.status === 'pro' || e.status === 'yearly'
            };
          });

          setEntries(formatted);
        }
      } catch (err) {
        console.error('Error loading leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, [tab, timeFilter]);

  // Find user's rank
  const myRankIndex = entries.findIndex(e => e.uid === user?.id);
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : 0;
  
  // Find current user's entry
  const currentUserEntry = myRankIndex !== -1 ? entries[myRankIndex] : null;

  return (
    <div className="leaderboard-view page-transition animate-fadein" style={{ padding: 'var(--sp-4)', maxWidth: '600px', margin: '0 auto', paddingBottom: '80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        <Trophy size={28} className="text-gold" />
        <div>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 900 }}>Leaderboard League</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)' }}>Compete with learners worldwide</p>
        </div>
      </div>

      {/* Main Switchers (Tab & Time) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: 'var(--sp-5)', flexWrap: 'wrap' }}>
        
        {/* Toggle XP | Streak */}
        <div className="flex gap-1" style={{ background: 'var(--surface-2)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
          <button 
            onClick={() => setTab('xp')} 
            className={`toggle-btn ${tab === 'xp' ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: 'var(--text-xs)', border: 'none', borderRadius: 'var(--radius)' }}
          >
            <Zap size={12} style={{ display: 'inline', marginRight: '4px' }} /> XP
          </button>
          <button 
            onClick={() => setTab('streak')} 
            className={`toggle-btn ${tab === 'streak' ? 'active' : ''}`}
            style={{ padding: '6px 14px', fontSize: 'var(--text-xs)', border: 'none', borderRadius: 'var(--radius)' }}
          >
            <Flame size={12} style={{ display: 'inline', marginRight: '4px' }} /> Streak
          </button>
        </div>

        {/* Time filter: Weekly | All-Time (Only relevant for XP) */}
        {tab === 'xp' && (
          <div className="flex gap-1" style={{ background: 'var(--surface-2)', padding: '4px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setTimeFilter('weekly')} 
              className={`toggle-btn ${timeFilter === 'weekly' ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: 'var(--text-xs)', border: 'none', borderRadius: 'var(--radius)' }}
            >
              Weekly
            </button>
            <button 
              onClick={() => setTimeFilter('alltime')} 
              className={`toggle-btn ${timeFilter === 'alltime' ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: 'var(--text-xs)', border: 'none', borderRadius: 'var(--radius)' }}
            >
              All-Time
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-lg)', opacity: 1 - i * 0.12 }} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        /* Empty State */
        <div className="card text-center" style={{ padding: 'var(--sp-10)' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
          <h3 className="font-bold">No rankings yet</h3>
          <p className="text-muted text-sm mt-1">
            Complete a lesson or start reviewing to post your first score and join the league!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          {entries.length >= 1 && (
            <div className="card" style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 'var(--sp-3)',
              marginBottom: 'var(--sp-5)',
              padding: 'var(--sp-4) var(--sp-2)',
            }}>
              {/* 2nd place (if exists) */}
              {entries.length >= 2 && (
                <PodiumCard entry={entries[1]} rank={2} tab={tab} height={75} />
              )}
              
              {/* 1st place */}
              <PodiumCard entry={entries[0]} rank={1} tab={tab} height={105} />
              
              {/* 3rd place (if exists) */}
              {entries.length >= 3 && (
                <PodiumCard entry={entries[2]} rank={3} tab={tab} height={60} />
              )}
            </div>
          )}

          {/* Full ranked list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
            {entries.slice(3).map((entry, idx) => {
              const currentRank = idx + 4;
              const isCurrentUser = entry.uid === user?.id;
              return (
                <div
                  key={entry.uid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-3)',
                    padding: 'var(--sp-3) var(--sp-4)',
                    background: isCurrentUser ? 'var(--primary-light)' : 'var(--surface-1)',
                    border: `1px solid ${isCurrentUser ? 'rgba(22, 163, 74, 0.3)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <span style={{ width: '28px', fontWeight: 800, color: 'var(--text-3)', fontSize: 'var(--text-xs)' }}>
                    #{currentRank}
                  </span>
                  
                  <div style={{ fontSize: '20px', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
                    {entry.avatar}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 className="font-bold" style={{ fontSize: 'var(--text-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.name}
                      {entry.isPremium && <span style={{ color: 'var(--xp-gold)', marginLeft: '6px', fontSize: '10px' }}>PRO</span>}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>Level {entry.level}</p>
                  </div>

                  <div style={{ fontWeight: 800, color: tab === 'xp' ? 'var(--primary)' : 'var(--xp-gold)', fontSize: 'var(--text-sm)' }}>
                    {tab === 'xp' ? `${entry.xp} XP` : `${entry.streak}d`}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pinned Current User Entry at Bottom */}
          {currentUserEntry && myRank > 3 && (
            <div 
              style={{
                position: 'fixed',
                bottom: 'calc(var(--bottom-nav-h) + var(--sp-2))',
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '600px',
                width: 'calc(100% - var(--sp-8))',
                background: 'var(--surface-2)',
                border: '2px solid var(--primary)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 90,
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--sp-3) var(--sp-4)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
              }}
              className="animate-fadein"
            >
              <span style={{ width: '28px', fontWeight: 800, color: 'var(--primary)', fontSize: 'var(--text-sm)' }}>
                #{myRank}
              </span>
              
              <div style={{ fontSize: '20px', width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-3)', display: 'grid', placeItems: 'center' }}>
                {currentUserEntry.avatar}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 className="font-bold" style={{ fontSize: 'var(--text-sm)' }}>
                  {currentUserEntry.name} (You)
                  {currentUserEntry.isPremium && <span style={{ color: 'var(--xp-gold)', marginLeft: '6px', fontSize: '10px' }}>PRO</span>}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>Level {currentUserEntry.level}</p>
              </div>

              <div style={{ fontWeight: 800, color: tab === 'xp' ? 'var(--primary)' : 'var(--xp-gold)', fontSize: 'var(--text-sm)' }}>
                {tab === 'xp' ? `${currentUserEntry.xp} XP` : `${currentUserEntry.streak}d`}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}

function PodiumCard({ entry, rank, tab, height }: { entry: LeaderboardEntry; rank: number; tab: 'xp' | 'streak'; height: number }) {
  const emoji = TIER_EMOJIS[rank - 1];
  const color = TIER_COLORS[rank - 1];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      <div style={{ fontSize: '28px', marginBottom: '2px' }}>{entry.avatar}</div>
      <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', textAlign: 'center', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {entry.name}
      </div>
      <div style={{ fontSize: '11px', color: tab === 'xp' ? 'var(--primary)' : 'var(--xp-gold)', fontWeight: 800 }}>
        {tab === 'xp' ? `${entry.xp} XP` : `${entry.streak}d`}
      </div>
      <div style={{
        marginTop: '8px',
        width: '100%',
        height,
        background: `linear-gradient(to top, ${color}22, transparent)`,
        border: `1px solid ${color}44`,
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '8px',
        fontSize: '20px',
      }}>
        {emoji}
      </div>
    </div>
  );
}
