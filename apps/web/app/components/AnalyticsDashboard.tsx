'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { BarChart2, TrendingUp, Flame, Zap, BookOpen, Target } from 'lucide-react';

interface DailyLog {
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
}

export function AnalyticsDashboard() {
  const { user, profile } = useAuth();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const loadLogs = async () => {
      try {
        const q = query(
          collection(db, 'users', user.id, 'dailyLogs'),
          orderBy('date', 'desc'),
          limit(30)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => d.data() as DailyLog).reverse();
        setLogs(data);
      } catch {
        // No logs yet — generate sample from profile
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [user?.id]);

  const totalXP = profile?.xp ?? 0;
  const streak = profile?.streak ?? 0;
  const level = profile?.level ?? 1;
  const xpToNextLevel = (level * 100) - (totalXP % (level * 100));
  const xpProgress = (totalXP % (level * 100)) / (level * 100) * 100;
  const weekXP = logs.slice(-7).reduce((s, l) => s + (l.xpEarned || 0), 0);
  const avgXP = logs.length ? Math.round(logs.reduce((s, l) => s + (l.xpEarned || 0), 0) / logs.length) : 0;
  const maxXP = logs.length ? Math.max(...logs.map(l => l.xpEarned || 0)) : 0;

  const StatCard = ({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) => (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-4)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color }}>
        {icon}
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-5)', maxWidth: 680, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <BarChart2 size={26} color="var(--green-400)" />
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 900, margin: 0 }}>Analytics</h2>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Your learning progress</p>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <StatCard icon={<Zap size={16} />} label="Total XP" value={totalXP.toLocaleString()} sub="lifetime earned" color="var(--amber)" />
        <StatCard icon={<Flame size={16} />} label="Streak" value={`${streak}🔥`} sub="days in a row" color="var(--orange)" />
        <StatCard icon={<Target size={16} />} label="Level" value={level} sub={`${xpProgress.toFixed(0)}% to next`} color="var(--green-400)" />
        <StatCard icon={<TrendingUp size={16} />} label="This Week" value={`${weekXP} XP`} sub="last 7 days" color="var(--blue)" />
        <StatCard icon={<BookOpen size={16} />} label="Avg/Day" value={`${avgXP} XP`} sub="daily average" color="#a78bfa" />
        <StatCard icon={<Zap size={16} />} label="Best Day" value={`${maxXP} XP`} sub="personal record" color="#f472b6" />
      </div>

      {/* XP Level Progress */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-5)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Level {level} Progress</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{xpToNextLevel} XP to Level {level + 1}</span>
        </div>
        <div style={{ height: 10, background: 'var(--bg-surface)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(xpProgress, 100)}%`,
            background: 'linear-gradient(90deg, var(--green-500), var(--amber))',
            borderRadius: 'var(--radius-pill)',
            transition: 'width 0.8s ease',
          }} />
        </div>
      </div>

      {/* XP Bar Chart (last 30 days) */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
          <div className="splash-bar" style={{ width: 120, margin: '0 auto' }} />
          <p style={{ marginTop: 'var(--space-3)' }}>Loading activity...</p>
        </div>
      ) : logs.length === 0 ? (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}>
          <BarChart2 size={32} style={{ marginBottom: 'var(--space-3)', opacity: 0.4 }} />
          <p style={{ fontSize: 'var(--text-sm)' }}>Complete lessons to see your XP history here!</p>
        </div>
      ) : (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-4)',
        }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
            XP — Last 30 Days
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
            {logs.map((log, i) => {
              const h = maxXP > 0 ? Math.max(4, (log.xpEarned / maxXP) * 72) : 4;
              const isWeekend = new Date(log.date).getDay() % 6 === 0;
              return (
                <div key={i} title={`${log.date}: ${log.xpEarned} XP`} style={{
                  flex: 1,
                  height: h,
                  borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                  background: isWeekend ? 'var(--green-400)' : 'var(--green-500)',
                  opacity: 0.85,
                  transition: 'height 0.4s ease',
                  cursor: 'default',
                  minWidth: 4,
                }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)', fontSize: 10, color: 'var(--text-muted)' }}>
            <span>{logs[0]?.date || '—'}</span>
            <span>Today</span>
          </div>
        </div>
      )}
    </div>
  );
}
