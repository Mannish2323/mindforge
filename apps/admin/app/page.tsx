'use client';

import React, { useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([
    { id: '1', name: 'Sakura_99', email: 'sakura@example.com', xp: 750, level: 8, streak: 12, flagged: false },
    { id: '2', name: 'TokyoDrift', email: 'drift@example.com', xp: 520, level: 6, streak: 4, flagged: false },
    { id: '3', name: 'NihongoKing', email: 'king@example.com', xp: 980, level: 10, streak: 21, flagged: true, flagReason: 'Elapsed seconds: 1s' },
  ]);

  const toggleFlag = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, flagged: !u.flagged, flagReason: !u.flagged ? 'Manually flagged by admin' : undefined } : u));
  };

  return (
    <div id="root" style={{ minHeight: '100vh', background: 'var(--grad-bg)', padding: 'var(--space-6)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              EVLO Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Manage users, view anti-cheat flags, and curate courses</p>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '13px', fontWeight: 'bold', color: 'var(--green-400)' }}>
            🟢 Services Online
          </div>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Active Users</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '4px' }}>142</p>
            </div>
            <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Anti-Cheat Flags</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--red)', marginTop: '4px' }}>1</p>
            </div>
            <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database Syllabi</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--green-400)', marginTop: '4px' }}>10 Lessons</p>
            </div>
          </div>

          {/* User Table */}
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>User Moderation & Cheat Checks</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px' }}>User</th>
                    <th style={{ padding: '8px' }}>XP</th>
                    <th style={{ padding: '8px' }}>Level</th>
                    <th style={{ padding: '8px' }}>Streak</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>{user.xp}</td>
                      <td style={{ padding: '12px 8px' }}>{user.level}</td>
                      <td style={{ padding: '12px 8px' }}>{user.streak} days</td>
                      <td style={{ padding: '12px 8px' }}>
                        {user.flagged ? (
                          <span style={{ color: 'var(--red)', background: 'rgba(239, 68, 68, 0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }} title={user.flagReason}>
                            ⚠️ Flagged
                          </span>
                        ) : (
                          <span style={{ color: 'var(--green-400)', background: 'rgba(74, 222, 128, 0.15)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                            ✓ Legit
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleFlag(user.id)}
                          style={{
                            background: user.flagged ? 'var(--green-600)' : 'var(--red-dim)',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          {user.flagged ? 'Resolve' : 'Flag User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
