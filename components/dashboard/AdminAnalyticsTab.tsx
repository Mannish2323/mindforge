'use client';

import React, { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

// ================================================================
// AdminAnalyticsTab — Real analytics from /api/admin/analytics
// Drop this into AdminView's analytics case
// ================================================================

interface AnalyticsData {
  overview?: {
    total_users: number;
    premium_users: number;
    active_last_7d: number;
    active_last_30d: number;
    total_lessons_done: number;
    total_words_learned: number;
    avg_streak: number;
    total_xp_awarded: number;
  };
  retention?: {
    day1: number;
    day7: number;
    day30: number;
  };
  xp_by_type?: Record<string, number>;
  lesson_completions?: Array<{
    lesson_id: string;
    completions: number;
    avg_score?: number;
    avg_time_secs?: number;
  }>;
  top_learners?: Array<{
    user_id: string;
    username: string;
    xp_total: number;
    streak: number;
    lessons_done: number;
  }>;
}

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div style={{
      background: 'var(--card-bg, rgba(255,255,255,0.04))',
      borderRadius: '14px',
      padding: '16px',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontSize: '22px', fontWeight: 900, color }}>{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div style={{ color: 'var(--text-3, #9ca3af)', fontSize: '11px', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

export function AdminAnalyticsTab({ baseStats }: { baseStats: { totalUsers: number; premiumUsers: number; activeToday: number } }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(30);

  const load = useCallback(async (d: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${d}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('[AdminAnalytics] Load failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const conversionRate = baseStats.totalUsers > 0
    ? Math.round((baseStats.premiumUsers / baseStats.totalUsers) * 100)
    : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        <StatCard icon="👥" label="Total Users"    value={data?.overview?.total_users ?? baseStats.totalUsers}    color="#22d3ee" />
        <StatCard icon="👑" label="Premium Users"  value={data?.overview?.premium_users ?? baseStats.premiumUsers}  color="#f59e0b" />
        <StatCard icon="⚡" label="Active (7d)"    value={data?.overview?.active_last_7d ?? baseStats.activeToday}  color="#4ade80" />
        <StatCard icon="📚" label="Lessons Done"   value={data?.overview?.total_lessons_done ?? 0}                  color="#a78bfa" />
      </div>

      {/* Day Range Selector + Refresh */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {[7, 14, 30, 90].map(d => (
          <button
            key={d}
            onClick={() => { setDays(d); load(d); }}
            style={{
              padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: days === d ? '#ff9800' : 'rgba(255,255,255,0.07)',
              color: days === d ? '#000' : 'var(--text, #e5e7eb)',
              fontWeight: 700, fontSize: '12px', transition: 'all 150ms',
            }}
          >
            {d}d
          </button>
        ))}
        <button
          onClick={() => load(days)}
          disabled={loading}
          style={{
            marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px', border: 'none',
            cursor: 'pointer', background: 'rgba(255,255,255,0.07)',
            color: 'var(--text, #e5e7eb)', fontSize: '12px',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}
        >
          <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Conversion */}
      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '8px', fontSize: '14px', color: 'var(--text)' }}>
          📈 Conversion Rate
        </h3>
        <div style={{ fontSize: '28px', fontWeight: 900, color: '#4ade80' }}>{conversionRate}%</div>
        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Free → Premium conversion</p>
      </div>

      {/* Retention */}
      {data?.retention && (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '14px', color: 'var(--text)' }}>
            🔁 User Retention
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {([
              { label: 'Day 1',  val: data.retention.day1  },
              { label: 'Day 7',  val: data.retention.day7  },
              { label: 'Day 30', val: data.retention.day30 },
            ] as Array<{ label: string; val: number }>).map(({ label, val }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '22px', fontWeight: 900,
                  color: val >= 40 ? '#4ade80' : val >= 20 ? '#f59e0b' : '#f87171',
                }}>
                  {val ?? 0}%
                </div>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* XP by Event Type */}
      {data?.xp_by_type && Object.keys(data.xp_by_type).length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '14px', color: 'var(--text)' }}>
            ⚡ XP by Event Type
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(data.xp_by_type)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([type, xp]) => {
                const total = Object.values(data.xp_by_type!).reduce((a: number, b) => a + (b as number), 0);
                const pct = total > 0 ? Math.round(((xp as number) / total) * 100) : 0;
                return (
                  <div key={type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text, #e5e7eb)', fontSize: '12px', textTransform: 'capitalize' }}>
                        {type.replace(/_/g, ' ')}
                      </span>
                      <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '12px' }}>
                        {(xp as number).toLocaleString()} XP ({pct}%)
                      </span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '99px' }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Top Lessons */}
      {data?.lesson_completions && data.lesson_completions.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '14px', color: 'var(--text)' }}>
            📚 Most Completed Lessons (Last {days}d)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.lesson_completions.slice(0, 10).map((lesson, i) => (
              <div key={lesson.lesson_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div>
                  <span style={{ color: '#9ca3af', fontSize: '11px', marginRight: '8px' }}>#{i + 1}</span>
                  <span style={{ color: 'var(--text, #e5e7eb)', fontSize: '13px' }}>
                    {lesson.lesson_id.replace(/_/g, ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>{lesson.completions} done</span>
                  {lesson.avg_score != null && (
                    <span style={{ color: '#9ca3af' }}>avg {lesson.avg_score}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Learners */}
      {data?.top_learners && data.top_learners.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '14px', fontSize: '14px', color: 'var(--text)' }}>
            🏆 Top Learners
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.top_learners.map((learner, i) => (
              <div key={learner.user_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '14px', minWidth: '24px' }}>#{i + 1}</span>
                  <span style={{ color: 'var(--text, #e5e7eb)', fontSize: '13px' }}>{learner.username}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>
                    {learner.xp_total?.toLocaleString()} XP
                  </span>
                  <span style={{ color: '#ff6b35' }}>🔥 {learner.streak}d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!data && !loading && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '40px 16px',
          textAlign: 'center', border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <p style={{ color: '#9ca3af', marginBottom: '16px' }}>Load real analytics data for the selected period</p>
          <button
            onClick={() => load(days)}
            style={{
              padding: '10px 24px', borderRadius: '10px', background: '#ff9800',
              color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px',
            }}
          >
            Load Analytics
          </button>
        </div>
      )}
    </div>
  );
}
