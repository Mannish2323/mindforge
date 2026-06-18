'use client';

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, BarChart2, Flag, ShieldAlert, ToggleLeft, CreditCard, Megaphone, Search, ChevronRight, Crown, Ban, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '../lib/supabase';

interface AdminViewProps {}

type AdminTab = 'users' | 'content' | 'plans' | 'ads' | 'moderation' | 'analytics' | 'flags';

export function AdminView({}: AdminViewProps) {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, activeToday: 0, premiumUsers: 0, lessonsToday: 0 });

  // Guard — only admins
  if (!profile?.isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 'var(--sp-8)', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: 'var(--sp-4)' }}>🔒</div>
        <h2 style={{ fontWeight: 800, marginBottom: 'var(--sp-2)' }}>Admin Access Only</h2>
        <p style={{ color: 'var(--text-2)' }}>You don't have permission to view this panel.</p>
      </div>
    );
  }

  useEffect(() => {
    loadStats();
    if (activeTab === 'users') loadUsers();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const supabase = createClient();
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: premiumUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true);
      setStats(s => ({ ...s, totalUsers: totalUsers || 0, premiumUsers: premiumUsers || 0 }));
    } catch { /* silent */ }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const supabase = createClient();
      const query = supabase.from('profiles').select('id, username, display_name, xp_total, is_premium, plan_id, created_at').limit(50).order('created_at', { ascending: false });
      const { data } = searchQuery ? await query.ilike('username', `%${searchQuery}%`) : await query;
      setUsers(data || []);
    } catch { /* silent */ } finally {
      setLoadingUsers(false);
    }
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'users', label: 'Users', icon: <Users size={16} /> },
    { id: 'content', label: 'Content', icon: <BookOpen size={16} /> },
    { id: 'plans', label: 'Plans', icon: <CreditCard size={16} /> },
    { id: 'ads', label: 'Ads', icon: <Megaphone size={16} /> },
    { id: 'moderation', label: 'Moderation', icon: <ShieldAlert size={16} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={16} /> },
    { id: 'flags', label: 'Feature Flags', icon: <Flag size={16} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div>
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  placeholder="Search users by username…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && loadUsers()}
                  style={{ paddingLeft: '34px', width: '100%', margin: 0 }}
                />
              </div>
              <button className="btn-primary" onClick={loadUsers} style={{ width: 'auto', padding: '0 16px', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>
            {loadingUsers ? (
              <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-3)' }}>Loading users…</div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {users.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-3)' }}>No users found</div>
                ) : (
                  users.map((u, i) => (
                    <div key={u.id} style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--sp-3)',
                      padding: 'var(--sp-3) var(--sp-4)',
                      borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{u.display_name || u.username}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>@{u.username} · {u.xp_total || 0} XP</div>
                      </div>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)',
                        background: u.is_premium ? 'rgba(251,191,36,0.15)' : 'var(--surface-3)',
                        color: u.is_premium ? 'var(--xp-gold)' : 'var(--text-3)',
                      }}>
                        {u.plan_id?.toUpperCase() || 'FREE'}
                      </span>
                      <button className="btn-ghost" style={{ fontSize: '11px', padding: '3px 10px' }}>Manage</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );

      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-3)' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, color: 'var(--accent-ai)', icon: '👥' },
                { label: 'Premium Users', value: stats.premiumUsers, color: 'var(--xp-gold)', icon: '👑' },
                { label: 'Active Today', value: stats.activeToday || '—', color: 'var(--primary)', icon: '⚡' },
                { label: 'Lessons Today', value: stats.lessonsToday || '—', color: 'var(--gem)', icon: '📖' },
              ].map(s => (
                <div key={s.label} className="card" style={{ textAlign: 'center', padding: 'var(--sp-4)' }}>
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-3)' }}>Revenue Overview</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>Connect Razorpay dashboard for live revenue data.</p>
            </div>
          </div>
        );

      case 'flags':
        return (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { key: 'ads_enabled', label: 'Ads Enabled', sub: 'Show ads to free users', value: true },
              { key: 'ai_tutor_enabled', label: 'AI Tutor', sub: 'Enable AI chat feature', value: true },
              { key: 'social_enabled', label: 'Social Features', sub: 'Friends, duels, circles', value: true },
              { key: 'speak_mode_enabled', label: 'Speak Mode', sub: 'Voice practice feature', value: true },
              { key: 'maintenance_mode', label: 'Maintenance Mode', sub: 'Show maintenance banner', value: false },
            ].map((flag, i, arr) => (
              <div key={flag.key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--sp-3) var(--sp-4)',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{flag.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{flag.sub}</div>
                </div>
                <label className="toggle-switch" style={{ margin: 0 }}>
                  <input type="checkbox" defaultChecked={flag.value} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        );

      case 'plans':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {[
              { id: 'free', name: 'Free', color: '#64748B', users: '—' },
              { id: 'starter', name: 'Starter ₹99', color: '#0EA5E9', users: '—' },
              { id: 'plus', name: 'Plus ₹149', color: '#8B5CF6', users: '—' },
              { id: 'pro', name: 'Pro ₹199', color: '#F59E0B', users: '—' },
            ].map(plan => (
              <div key={plan.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: plan.color }} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{plan.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Subscribers: {plan.users}</div>
                  </div>
                </div>
                <button className="btn-ghost" style={{ fontSize: '11px', padding: '4px 12px' }}>Manage</button>
              </div>
            ))}
          </div>
        );

      case 'ads':
        return (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {[
              { label: 'Home Footer Ad', sub: 'Banner below home cards', enabled: true },
              { label: 'Lesson Completion Ad', sub: 'After finishing a lesson', enabled: true },
              { label: 'Review Summary Ad', sub: 'After review session ends', enabled: false },
              { label: 'Dashboard Ad', sub: 'Between dashboard sections', enabled: false },
            ].map((ad, i, arr) => (
              <div key={ad.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 'var(--sp-3) var(--sp-4)',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{ad.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{ad.sub}</div>
                </div>
                <label className="toggle-switch" style={{ margin: 0 }}>
                  <input type="checkbox" defaultChecked={ad.enabled} />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        );

      case 'moderation':
        return (
          <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-3)' }}>
            <ShieldAlert size={40} style={{ marginBottom: 'var(--sp-3)', opacity: 0.4 }} />
            <p>No reports pending moderation.</p>
          </div>
        );

      case 'content':
        return (
          <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-3)' }}>
            <BookOpen size={40} style={{ marginBottom: 'var(--sp-3)', opacity: 0.4 }} />
            <p>Manage lesson content and units via the CMS.</p>
            <button className="btn-primary" style={{ marginTop: 'var(--sp-4)', width: 'auto', padding: '10px 24px' }}>
              Open CMS
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-home page-enter" style={{ padding: 'var(--sp-5)', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: '4px' }}>
          <span style={{ fontSize: '24px' }}>⚙️</span>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900 }}>Admin Panel</h1>
          <span style={{ fontSize: '11px', background: 'var(--error)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>ADMIN</span>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>Full control — Velmorth Labs internal</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginBottom: 'var(--sp-5)' }}>
        {navItems.map(item => (
          <button key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', borderRadius: 'var(--radius-pill)',
              background: activeTab === item.id ? 'var(--primary)' : 'var(--surface-2)',
              color: activeTab === item.id ? 'white' : 'var(--text-2)',
              border: '1px solid ' + (activeTab === item.id ? 'transparent' : 'var(--border)'),
              fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer',
              transition: 'all var(--t-fast)',
            }}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
