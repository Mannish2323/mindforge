'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/lib/supabase';
import {
  Shield, Loader2, Users, TrendingUp, CreditCard,
  AlertTriangle, Activity, Search, CheckCircle2, XCircle,
  ChevronRight, RefreshCcw, Database, Zap, Flame
} from 'lucide-react';

interface UserRow {
  id: string;
  username: string;
  display_name: string;
  created_at: string;
  user_stats?: { xp_total: number; streak: number; lessons_done: number } | null;
  entitlements?: { plan_id: string; status: string } | null;
}

interface ModerationReport {
  id: string;
  reporter_id: string;
  reason: string;
  status: string;
  target_type: string;
  created_at: string;
}

interface AdminStats {
  totalUsers: number;
  activeToday: number;
  proUsers: number;
  totalXP: number;
  pendingReports: number;
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: `${color}08`, border: `1px solid ${color}22` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs font-bold mt-0.5" style={{ color: 'rgba(160,150,220,0.6)' }}>{label}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: 'rgba(130,120,190,0.45)' }}>{sub}</div>}
    </div>
  );
}

const PLAN_COLORS: Record<string, string> = {
  free: '#9ca3af', starter: '#60a5fa', plus: '#a78bfa', pro: '#f59e0b'
};

export default function AdminPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<'overview' | 'users' | 'reports'>('overview');
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, activeToday: 0, proUsers: 0, totalXP: 0, pendingReports: 0 });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!loading && !profile?.isAdmin) router.replace('/home');
  }, [profile, loading, router]);

  const loadStats = useCallback(async () => {
    if (!profile?.isAdmin) return;
    setStatsLoading(true);
    try {
      const [profilesRes, entRes, reportsRes, statsRes] = await Promise.allSettled([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('entitlements').select('plan_id').in('plan_id', ['pro', 'plus', 'starter']),
        supabase.from('moderation_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('user_stats').select('xp_total, last_active'),
      ]);

      const totalUsers = profilesRes.status === 'fulfilled' ? (profilesRes.value.count || 0) : 0;
      const proUsers = entRes.status === 'fulfilled' ? (entRes.value.data?.length || 0) : 0;
      const pendingReports = reportsRes.status === 'fulfilled' ? (reportsRes.value.count || 0) : 0;

      const statsData = statsRes.status === 'fulfilled' ? (statsRes.value.data || []) : [];
      const today = new Date().toISOString().split('T')[0];
      const activeToday = statsData.filter((s: any) => s.last_active === today).length;
      const totalXP = statsData.reduce((sum: number, s: any) => sum + (s.xp_total || 0), 0);

      setStats({ totalUsers, activeToday, proUsers, totalXP, pendingReports });
    } catch {}
    setStatsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.isAdmin]);

  const loadUsers = useCallback(async () => {
    if (!profile?.isAdmin) return;
    setUsersLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, username, display_name, created_at,
          user_stats ( xp_total, streak, lessons_done ),
          entitlements ( plan_id, status )
        `)
        .order('created_at', { ascending: false })
        .limit(50);
      if (!error && data) setUsers(data as unknown as UserRow[]);
    } catch {}
    setUsersLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.isAdmin]);

  const loadReports = useCallback(async () => {
    if (!profile?.isAdmin) return;
    setReportsLoading(true);
    try {
      const { data, error } = await supabase
        .from('moderation_reports')
        .select('id, reporter_id, reason, status, target_type, created_at')
        .order('created_at', { ascending: false })
        .limit(30);
      if (!error && data) setReports(data as ModerationReport[]);
    } catch {}
    setReportsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.isAdmin]);

  useEffect(() => {
    if (profile?.isAdmin) {
      loadStats();
      if (tab === 'users') loadUsers();
      if (tab === 'reports') loadReports();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.isAdmin, tab]);

  const resolveReport = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      await supabase.from('moderation_reports').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id);
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }
  if (!profile?.isAdmin) return null;

  const filteredUsers = users.filter(u =>
    !search ||
    u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const TABS = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'users'    as const, label: 'Users',    icon: Users },
    { id: 'reports'  as const, label: 'Reports',  icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: '#09071a' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Admin Dashboard</h1>
            <p className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Velmorth Control Panel</p>
          </div>
        </div>
        <button onClick={() => { loadStats(); if (tab === 'users') loadUsers(); if (tab === 'reports') loadReports(); }}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <RefreshCcw className="w-4 h-4 text-purple-400" />
        </button>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t.id ? 'rgba(239,68,68,0.12)' : 'rgba(139,92,246,0.06)',
              border: `1px solid ${tab === t.id ? 'rgba(239,68,68,0.3)' : 'rgba(139,92,246,0.15)'}`,
              color: tab === t.id ? '#f87171' : 'rgba(160,150,220,0.6)',
            }}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          {statsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: 'rgba(139,92,246,0.08)' }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard icon={Users}       label="Total Users"    value={stats.totalUsers.toLocaleString()} sub="All time" color="#3b82f6" />
              <StatCard icon={Activity}    label="Active Today"   value={stats.activeToday}                 sub="Unique sessions" color="#22c55e" />
              <StatCard icon={CreditCard}  label="Paid Users"     value={stats.proUsers}                    sub="Starter + Plus + Pro" color="#f59e0b" />
              <StatCard icon={Zap}         label="Total XP"       value={`${(stats.totalXP / 1000).toFixed(1)}K`} sub="All users" color="#8b5cf6" />
            </div>
          )}

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'User Management', sub: 'View, search, and filter all users', icon: Users, tab: 'users' as const, color: '#3b82f6' },
              { label: 'Moderation', sub: `${stats.pendingReports} reports pending`, icon: AlertTriangle, tab: 'reports' as const, color: stats.pendingReports > 0 ? '#ef4444' : '#9ca3af' },
              { label: 'Database', sub: 'Supabase dashboard', icon: Database, url: 'https://supabase.com', color: '#22c55e' },
            ].map(item => (
              <button key={item.label}
                onClick={() => (item as any).tab ? setTab((item as any).tab) : window.open((item as any).url)}
                className="rounded-2xl p-5 text-left transition-all hover:scale-[1.01]"
                style={{ background: `${item.color}08`, border: `1px solid ${item.color}22` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${item.color}18` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="text-sm font-black text-white">{item.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{item.sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS ───────────────────────────────── */}
      {tab === 'users' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(139,92,246,0.5)' }} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or username…"
              className="input w-full pl-10"
            />
          </div>

          {usersLoading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(139,92,246,0.06)' }} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="p-3 text-xs font-black uppercase tracking-widest grid grid-cols-12 gap-2"
                style={{ background: 'rgba(139,92,246,0.06)', color: 'rgba(139,92,246,0.5)' }}>
                <div className="col-span-4">User</div>
                <div className="col-span-2 hidden sm:block">Plan</div>
                <div className="col-span-2 hidden sm:block">XP</div>
                <div className="col-span-2 hidden sm:block">Streak</div>
                <div className="col-span-2 hidden sm:block">Joined</div>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-sm" style={{ color: 'rgba(160,150,220,0.4)' }}>
                  No users found
                </div>
              ) : (
                filteredUsers.map((u, i) => {
                  const plan = (u.entitlements as any)?.plan_id || 'free';
                  const xp = (u.user_stats as any)?.xp_total || 0;
                  const streak = (u.user_stats as any)?.streak || 0;
                  return (
                    <div key={u.id}
                      className="grid grid-cols-12 gap-2 p-3 items-center transition-colors hover:bg-[rgba(139,92,246,0.04)]"
                      style={{ borderTop: i > 0 ? '1px solid rgba(139,92,246,0.08)' : 'none' }}>
                      <div className="col-span-4 flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 text-white"
                          style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
                          {(u.display_name || u.username || 'U')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate">{u.display_name || u.username}</div>
                          <div className="text-[10px] truncate" style={{ color: 'rgba(160,150,220,0.4)' }}>@{u.username}</div>
                        </div>
                      </div>
                      <div className="col-span-2 hidden sm:block">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `${PLAN_COLORS[plan]}15`, color: PLAN_COLORS[plan] }}>
                          {plan.toUpperCase()}
                        </span>
                      </div>
                      <div className="col-span-2 hidden sm:block text-sm font-bold text-white">
                        {xp.toLocaleString()}
                      </div>
                      <div className="col-span-2 hidden sm:block">
                        <span className="flex items-center gap-1 text-sm" style={{ color: streak > 0 ? '#f97316' : 'rgba(160,150,220,0.4)' }}>
                          {streak > 0 && <Flame className="w-3 h-3" />}
                          {streak}d
                        </span>
                      </div>
                      <div className="col-span-2 hidden sm:block text-xs" style={{ color: 'rgba(130,120,190,0.4)' }}>
                        {new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
          {!usersLoading && filteredUsers.length > 0 && (
            <p className="text-xs text-center" style={{ color: 'rgba(130,120,190,0.4)' }}>
              Showing {filteredUsers.length} of {users.length} users (max 50)
            </p>
          )}
        </div>
      )}

      {/* ── REPORTS ─────────────────────────────── */}
      {tab === 'reports' && (
        <div className="space-y-3">
          {reportsLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: 'rgba(139,92,246,0.06)' }} />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl p-10 text-center" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <div className="text-sm font-bold text-white">No reports</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(160,150,220,0.5)' }}>No moderation reports to review</div>
            </div>
          ) : (
            reports.map(r => (
              <div key={r.id} className="rounded-xl p-4"
                style={{ background: 'rgba(139,92,246,0.04)', border: `1px solid ${r.status === 'pending' ? 'rgba(239,68,68,0.25)' : 'rgba(139,92,246,0.12)'}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full"
                        style={{ background: r.status === 'pending' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.1)', color: r.status === 'pending' ? '#f87171' : '#4ade80' }}>
                        {r.status}
                      </span>
                      <span className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{r.target_type}</span>
                    </div>
                    <div className="text-sm text-white mb-1">{r.reason}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(130,120,190,0.4)' }}>
                      {new Date(r.created_at).toLocaleString('en-IN')}
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => resolveReport(r.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                        style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                        Resolve
                      </button>
                      <button onClick={() => resolveReport(r.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                        style={{ background: 'rgba(107,114,128,0.12)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.2)' }}>
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
