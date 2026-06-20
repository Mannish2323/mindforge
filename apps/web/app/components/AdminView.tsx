'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, BookOpen, BarChart2, Flag, ShieldAlert, CreditCard, Megaphone,
  Search, ChevronRight, Crown, Ban, CheckCircle, Activity, ClipboardList,
  Settings, Zap, RefreshCw, Eye, EyeOff, AlertTriangle, Database,
  MessageSquare, Key, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '../lib/supabase';

type AdminTab =
  | 'overview' | 'users' | 'content' | 'billing'
  | 'ads' | 'moderation' | 'analytics' | 'features'
  | 'audit' | 'system';

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  premiumUsers: number;
  lessonsToday: number;
  revenueEstimate: string;
  totalMessages: number;
}

export function AdminView() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeToday: 0,
    premiumUsers: 0,
    lessonsToday: 0,
    revenueEstimate: '—',
    totalMessages: 0,
  });
  const [flags, setFlags] = useState({
    ads_enabled: true,
    ai_tutor_enabled: true,
    social_enabled: true,
    speak_mode_enabled: true,
    maintenance_mode: false,
    jft_mode_enabled: true,
    ssw_mode_enabled: true,
  });
  const [actionMsg, setActionMsg] = useState('');

  const loadStats = useCallback(async () => {
    try {
      const supabase = createClient();
      const [
        { count: totalUsers },
        { count: premiumUsers },
        { count: totalMessages },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('entitlements').select('*', { count: 'exact', head: true }).neq('status', 'free'),
        supabase.from('ai_chat_messages').select('*', { count: 'exact', head: true }),
      ]);

      const today = new Date().toISOString().split('T')[0];
      const { count: activeToday } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })
        .eq('last_active', today);

      setStats(s => ({
        ...s,
        totalUsers: totalUsers || 0,
        premiumUsers: premiumUsers || 0,
        totalMessages: totalMessages || 0,
        activeToday: activeToday || 0,
      }));
    } catch { /* silent */ }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from('profiles')
        .select('id, username, display_name, created_at, avatar_url')
        .limit(50)
        .order('created_at', { ascending: false });

      if (searchQuery.trim()) {
        query = query.ilike('username', `%${searchQuery.trim()}%`);
      }

      const { data: profileData } = await query;
      if (!profileData) { setUsers([]); return; }

      const ids = profileData.map((p: any) => p.id);
      const { data: entData } = await supabase
        .from('entitlements')
        .select('user_id, status, plan_id')
        .in('user_id', ids);

      const { data: statsData } = await supabase
        .from('user_stats')
        .select('user_id, xp_total')
        .in('user_id', ids);

      const entMap: Record<string, any> = {};
      entData?.forEach((e: any) => { entMap[e.user_id] = e; });
      const statsMap: Record<string, any> = {};
      statsData?.forEach((s: any) => { statsMap[s.user_id] = s; });

      setUsers(profileData.map((p: any) => ({
        ...p,
        status: entMap[p.id]?.status || 'free',
        plan_id: entMap[p.id]?.plan_id || 'free',
        xp_total: statsMap[p.id]?.xp_total || 0,
        is_premium: !['free'].includes(entMap[p.id]?.status || 'free'),
      })));
    } catch { /* silent */ } finally {
      setLoadingUsers(false);
    }
  }, [searchQuery]);

  const loadAuditLogs = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setAuditLogs(data || []);
    } catch { /* silent */ } finally {
      setLoadingAudit(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    if (activeTab === 'users') loadUsers();
    if (activeTab === 'audit') loadAuditLogs();
  }, [activeTab, loadUsers, loadAuditLogs]);

  const grantPro = async (userId: string) => {
    try {
      const supabase = createClient();
      await supabase.from('entitlements').upsert({
        user_id: userId,
        status: 'pro',
        plan_id: 'pro',
        hearts_limit: 100,
        ai_limit_daily: 99,
        lessons_limit_daily: 99,
        ads_enabled: false,
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: 'user_id' });
      setActionMsg(`✅ Pro granted to user`);
      setTimeout(() => setActionMsg(''), 3000);
      loadUsers();
    } catch { setActionMsg('❌ Failed to grant Pro'); }
  };

  const suspendUser = async (userId: string) => {
    if (!confirm('Suspend this user? They will be logged out.')) return;
    setActionMsg(`⚠️ Suspend: contact Supabase dashboard to disable auth user ${userId}`);
    setTimeout(() => setActionMsg(''), 5000);
  };

  // ── Guard — only admins ──
  // NOTE: all hooks are above this return to comply with React rules of hooks
  if (!profile?.isAdmin || profile?.email !== 'manish63018@gmail.com') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: 'var(--sp-8)', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: 'var(--sp-4)' }}>🔒</div>
        <h2 style={{ fontWeight: 800, marginBottom: 'var(--sp-2)' }}>Admin Access Only</h2>
        <p style={{ color: 'var(--text-2)' }}>This panel is restricted to <strong>manish63018@gmail.com</strong>.</p>
      </div>
    );
  }

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',    label: 'Overview',   icon: <Activity size={15} /> },
    { id: 'users',       label: 'Users',      icon: <Users size={15} /> },
    { id: 'content',     label: 'Content',    icon: <BookOpen size={15} /> },
    { id: 'billing',     label: 'Billing',    icon: <CreditCard size={15} /> },
    { id: 'ads',         label: 'Ads',        icon: <Megaphone size={15} /> },
    { id: 'moderation',  label: 'Moderation', icon: <ShieldAlert size={15} /> },
    { id: 'analytics',   label: 'Analytics',  icon: <BarChart2 size={15} /> },
    { id: 'features',    label: 'Features',   icon: <Flag size={15} /> },
    { id: 'audit',       label: 'Audit',      icon: <ClipboardList size={15} /> },
    { id: 'system',      label: 'System',     icon: <Settings size={15} /> },
  ];

  const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) => (
    <div className="card" style={{ textAlign: 'center', padding: 'var(--sp-4)' }}>
      <div style={{ fontSize: '28px', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontSize: '28px', fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{label}</div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-3)' }}>
              <StatCard icon="👥" label="Total Users"    value={stats.totalUsers}    color="var(--accent-ai)" />
              <StatCard icon="👑" label="Premium Users"  value={stats.premiumUsers}  color="var(--xp-gold)" />
              <StatCard icon="⚡" label="Active Today"   value={stats.activeToday}   color="var(--primary)" />
              <StatCard icon="📖" label="Lessons Today"  value={stats.lessonsToday || '—'} color="var(--gem)" />
              <StatCard icon="💬" label="AI Messages"    value={stats.totalMessages} color="var(--accent-ai)" />
              <StatCard icon="💰" label="Revenue"        value={stats.revenueEstimate} color="var(--success)" />
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-3)' }}>🚀 Quick Actions</h3>
              <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                {[
                  { label: 'Refresh Stats', action: loadStats, icon: '🔄' },
                  { label: 'View Users',    action: () => setActiveTab('users'), icon: '👥' },
                  { label: 'Audit Logs',   action: () => setActiveTab('audit'), icon: '📋' },
                  { label: 'Feature Flags',action: () => setActiveTab('features'), icon: '🚩' },
                ].map(a => (
                  <button key={a.label} className="btn-ghost"
                    onClick={a.action}
                    style={{ fontSize: '12px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-2)' }}>📢 Admin Notes</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', lineHeight: 1.6 }}>
                Revenue: Connect Razorpay dashboard for live data.<br />
                Push notifications: Managed via Firebase FCM.<br />
                Content: Add vocab via <code>/public/data/vocab/</code> JSON files.
              </p>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            {actionMsg && (
              <div style={{ padding: 'var(--sp-3)', background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 'var(--radius)', marginBottom: 'var(--sp-3)', fontSize: 'var(--text-sm)' }}>
                {actionMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
                <input
                  placeholder="Search by username…"
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
                      flexWrap: 'wrap',
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                        {u.avatar_url || '🦊'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.display_name || u.username}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>@{u.username} · {u.xp_total || 0} XP</div>
                      </div>
                      <span style={{
                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-pill)', flexShrink: 0,
                        background: u.is_premium ? 'rgba(251,191,36,0.15)' : 'var(--surface-3)',
                        color: u.is_premium ? 'var(--xp-gold)' : 'var(--text-3)',
                      }}>
                        {u.plan_id?.toUpperCase() || 'FREE'}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button className="btn-ghost" onClick={() => grantPro(u.id)}
                          style={{ fontSize: '11px', padding: '3px 10px', color: 'var(--xp-gold)', border: '1px solid rgba(251,191,36,.35)' }}>
                          <Crown size={11} style={{ display: 'inline', marginRight: 3 }} />Pro
                        </button>
                        <button className="btn-ghost" onClick={() => suspendUser(u.id)}
                          style={{ fontSize: '11px', padding: '3px 10px', color: 'var(--error)', border: '1px solid rgba(239,68,68,.3)' }}>
                          <Ban size={11} style={{ display: 'inline', marginRight: 3 }} />Ban
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );

      case 'content':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-3)' }}>📚 Vocabulary Content</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)', marginBottom: 'var(--sp-3)' }}>
                Content is managed via JSON files in <code>/public/data/vocab/</code>. Edit the files to add/remove words.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                {[
                  { name: 'JLPT N5', file: 'jlpt_n5.json', count: '100 words' },
                  { name: 'JLPT N4', file: 'jlpt_n4.json', count: '50 words' },
                  { name: 'JFT Basic', file: 'jft_basic.json', count: '50 words' },
                  { name: 'SSW Vocab', file: 'ssw.json', count: '50 words' },
                ].map(f => (
                  <div key={f.file} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-3)', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{f.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{f.file} · {f.count}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>Active</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-3)' }}>📖 Lesson Units</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>
                Lessons are loaded from <code>/public/data/lessons/</code>. Add new unit JSON files to expand content.
              </p>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[
              { id: 'free',    name: 'Free',           color: '#64748B', hearts: 50,  ai: 5,  lessons: 5  },
              { id: 'starter', name: 'Starter — ₹99',  color: '#0EA5E9', hearts: 75,  ai: 15, lessons: 15 },
              { id: 'plus',    name: 'Plus — ₹149',    color: '#8B5CF6', hearts: 90,  ai: 30, lessons: 30 },
              { id: 'pro',     name: 'Pro — ₹199',     color: '#F59E0B', hearts: 100, ai: 99, lessons: 99 },
            ].map(plan => (
              <div key={plan.id} className="card" style={{ padding: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: plan.color }} />
                    <div style={{ fontWeight: 700 }}>{plan.name}</div>
                  </div>
                  <button className="btn-ghost" style={{ fontSize: '11px', padding: '4px 12px' }}>Manage</button>
                </div>
                <div style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Hearts', val: plan.hearts },
                    { label: 'AI/day', val: plan.ai },
                    { label: 'Lessons/day', val: plan.lessons },
                  ].map(m => (
                    <span key={m.label} style={{ fontSize: '11px', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', color: 'var(--text-2)' }}>
                      {m.label}: {m.val === 99 ? '∞' : m.val}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div className="card" style={{ padding: 'var(--sp-4)', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-2)', color: 'var(--xp-gold)' }}>💳 Razorpay</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>
                Live key: <code>rzp_live_T2dYb10K430xQ6</code><br />
                View transactions at dashboard.razorpay.com
              </p>
            </div>
          </div>
        );

      case 'ads':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {[
                { label: 'Home Footer Ad',         sub: 'Banner below home cards',    key: 'home_footer', enabled: true  },
                { label: 'Lesson Completion Ad',    sub: 'After finishing a lesson',   key: 'lesson_end',  enabled: true  },
                { label: 'Review Summary Ad',       sub: 'After review session ends',  key: 'review_end',  enabled: false },
                { label: 'Dashboard Mid Ad',        sub: 'Between dashboard sections', key: 'dash_mid',    enabled: false },
                { label: 'Vocab Session Ad',        sub: 'After vocab learning session', key: 'vocab_end', enabled: true  },
              ].map((ad, i, arr) => (
                <div key={ad.key} style={{
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
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>
                ℹ️ Ads are never shown to Pro users (plan_id = pro or pro_yearly).
              </p>
            </div>
          </div>
        );

      case 'moderation':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="card" style={{ padding: 'var(--sp-6)', textAlign: 'center' }}>
              <ShieldAlert size={40} style={{ marginBottom: 'var(--sp-3)', opacity: 0.4, margin: '0 auto var(--sp-3)' }} />
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-2)' }}>No Pending Reports</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>All moderation reports will appear here.</p>
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-3)' }}>⚙️ Moderation Rules</h3>
              {[
                { rule: 'Profanity filter',     status: 'Active'   },
                { rule: 'Chat rate limiting',   status: 'Active'   },
                { rule: 'Username validation',  status: 'Active'   },
                { rule: 'Image upload scanning', status: 'Pending' },
              ].map(r => (
                <div key={r.rule} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--sp-2) 0', borderBottom: '1px solid var(--border)', fontSize: 'var(--text-sm)' }}>
                  <span>{r.rule}</span>
                  <span style={{ fontSize: '11px', color: r.status === 'Active' ? 'var(--primary)' : 'var(--warn)', fontWeight: 600 }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--sp-3)' }}>
              <StatCard icon="👥" label="Total Users"   value={stats.totalUsers}   color="var(--accent-ai)" />
              <StatCard icon="👑" label="Premium Users" value={stats.premiumUsers} color="var(--xp-gold)" />
              <StatCard icon="⚡" label="Active Today"  value={stats.activeToday}  color="var(--primary)" />
              <StatCard icon="💬" label="AI Messages"   value={stats.totalMessages} color="var(--gem)" />
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-2)' }}>📈 Conversion Rate</h3>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)' }}>
                {stats.totalUsers > 0 ? `${Math.round((stats.premiumUsers / stats.totalUsers) * 100)}%` : '—'}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '4px' }}>Free → Premium conversion</p>
            </div>
            <div className="card" style={{ padding: 'var(--sp-4)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-3)' }}>💰 Revenue Overview</h3>
              <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>Connect Razorpay dashboard at dashboard.razorpay.com for live revenue data.</p>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {(Object.keys(flags) as Array<keyof typeof flags>).map((key, i, arr) => {
              const labels: Record<string, { label: string; sub: string }> = {
                ads_enabled:         { label: 'Ads Enabled',          sub: 'Show ads to free users' },
                ai_tutor_enabled:    { label: 'AI Tutor',             sub: 'Enable AI chat + grammar explanation' },
                social_enabled:      { label: 'Social Features',      sub: 'Friends, duels, circles' },
                speak_mode_enabled:  { label: 'Speak Mode',           sub: 'Voice practice feature' },
                maintenance_mode:    { label: 'Maintenance Mode',     sub: 'Show maintenance banner to all users' },
                jft_mode_enabled:    { label: 'JFT-Basic Mode',       sub: 'JFT work vocab learning mode' },
                ssw_mode_enabled:    { label: 'SSW Mode',             sub: 'SSW industry vocab for visa exam' },
              };
              const info = labels[key] || { label: key, sub: '' };
              return (
                <div key={key} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 'var(--sp-3) var(--sp-4)',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: key === 'maintenance_mode' ? 'var(--warn)' : 'var(--text)' }}>{info.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{info.sub}</div>
                  </div>
                  <label className="toggle-switch" style={{ margin: 0 }}>
                    <input type="checkbox" checked={flags[key]} onChange={() => setFlags(f => ({ ...f, [key]: !f[key] }))} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              );
            })}
          </div>
        );

      case 'audit':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
              <h3 style={{ fontWeight: 700 }}>📋 Audit Logs</h3>
              <button className="btn-ghost" onClick={loadAuditLogs} style={{ fontSize: '11px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <RefreshCw size={11} /> Refresh
              </button>
            </div>
            {loadingAudit ? (
              <div style={{ textAlign: 'center', padding: 'var(--sp-8)', color: 'var(--text-3)' }}>Loading…</div>
            ) : auditLogs.length === 0 ? (
              <div className="card" style={{ padding: 'var(--sp-6)', textAlign: 'center' }}>
                <ClipboardList size={32} style={{ opacity: 0.3, margin: '0 auto var(--sp-3)' }} />
                <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>No audit logs yet. Admin actions will appear here.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {auditLogs.map((log, i) => (
                  <div key={log.id} style={{
                    padding: 'var(--sp-3) var(--sp-4)',
                    borderBottom: i < auditLogs.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{log.action}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                      {log.target_type} · {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'system':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {[
              { label: 'Supabase DB',       status: 'Connected', color: 'var(--primary)',    icon: <Database size={16} /> },
              { label: 'Gemini AI (4 keys)', status: 'Active',   color: 'var(--accent-ai)', icon: <Zap size={16} /> },
              { label: 'Razorpay Payments',  status: 'Live',     color: 'var(--xp-gold)',   icon: <CreditCard size={16} /> },
              { label: 'Firebase FCM',       status: 'Active',   color: 'var(--primary)',   icon: <MessageSquare size={16} /> },
              { label: 'Vercel Hosting',     status: 'Deployed', color: 'var(--success)',   icon: <Globe size={16} /> },
            ].map(s => (
              <div key={s.label} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--sp-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: `${s.color}22`, display: 'grid', placeItems: 'center', color: s.color }}>
                    {s.icon}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{s.label}</div>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: s.color, background: `${s.color}15`, padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>
                  {s.status}
                </span>
              </div>
            ))}
            <div className="card" style={{ padding: 'var(--sp-4)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--sp-2)', color: 'var(--error)' }}>⚠️ Env Variables Check</h3>
              <div style={{ fontSize: '11px', lineHeight: 1.8, fontFamily: 'monospace', color: 'var(--text-2)' }}>
                {['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'GEMINI_API_KEY_1', 'NEXT_PUBLIC_RAZORPAY_KEY_ID'].map(key => (
                  <div key={key}>✅ {key}</div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-home page-enter" style={{ padding: 'var(--sp-4)', maxWidth: '860px', margin: '0 auto', paddingBottom: 'calc(var(--bottom-nav-h) + 20px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: '4px' }}>
          <span style={{ fontSize: '24px' }}>⚙️</span>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900 }}>Admin Panel</h1>
          <span style={{ fontSize: '11px', background: 'var(--error)', color: 'white', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 700 }}>SUPER ADMIN</span>
        </div>
        <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)' }}>Full control — manish63018@gmail.com · Velmorth Labs</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--sp-5)', overflowX: 'auto', paddingBottom: '4px' }}>
        {navItems.map(item => (
          <button key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '6px 12px', borderRadius: 'var(--radius-pill)',
              background: activeTab === item.id ? 'var(--primary)' : 'var(--surface-2)',
              color: activeTab === item.id ? 'white' : 'var(--text-2)',
              border: '1px solid ' + (activeTab === item.id ? 'transparent' : 'var(--border)'),
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              transition: 'all var(--t-fast)', whiteSpace: 'nowrap', flexShrink: 0,
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
