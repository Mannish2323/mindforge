'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { JLPTBadge, PlanBadge } from '@/components/shared/JLPTBadge';
import { SubscriptionCard } from '@/components/shared/SubscriptionCard';
import {
  Flame, Zap, BookOpen, Star, Award, RotateCcw,
  Mic, Pencil, Camera, Edit3, Check, X, Settings,
  TrendingUp, CreditCard, ChevronRight, LogOut, Headphones
} from 'lucide-react';

const JLPT_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1'];

export default function ProfilePage() {
  const { profile, logout, updateProfileDetails, updateSettings } = useAuth();
  const { state } = useStore();
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [editingJLPT, setEditingJLPT] = useState(false);
  const [nameVal, setNameVal] = useState(profile?.name || '');
  const [bioVal, setBioVal] = useState(profile?.bio || '');
  const [jlptVal, setJlptVal] = useState(profile?.jlpt_target || 'N5');
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const completedLessons = Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;
  const badges = state?.badges?.filter((b: any) => b.unlockedAt) || [];
  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak || 0;
  const xpInLevel = xp % (level * 1000);
  const xpForLevel = level * 1000;

  const saveName = async () => {
    if (!nameVal.trim()) return;
    setSaving(true);
    try { await updateProfileDetails(nameVal.trim(), profile?.bio || '', profile?.avatarUrl || ''); } catch {}
    setSaving(false); setEditingName(false);
  };

  const saveBio = async () => {
    setSaving(true);
    try { await updateProfileDetails(profile?.name || '', bioVal, profile?.avatarUrl || ''); } catch {}
    setSaving(false); setEditingBio(false);
  };

  const saveJLPT = async () => {
    setSaving(true);
    try { await updateSettings({ jlpt_target: jlptVal }); } catch {}
    setSaving(false); setEditingJLPT(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.uid) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${profile.uid}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
        await updateProfileDetails(profile.name, profile.bio || '', publicUrl);
      }
    } catch {}
    setUploadingAvatar(false);
  };

  const stats = [
    { icon: Zap,       label: 'Total XP',   value: xp >= 1000 ? `${(xp/1000).toFixed(1)}K` : xp.toString(), color: '#f59e0b' },
    { icon: Flame,     label: 'Streak',     value: `${streak}🔥`,                              color: '#f97316' },
    { icon: BookOpen,  label: 'Lessons',    value: completedLessons.toString(),                color: '#3b82f6' },
    { icon: Star,      label: 'Level',      value: `Lv.${level}`,                              color: '#8b5cf6' },
    { icon: Award,     label: 'Words',      value: (profile?.words_learned || 0) >= 1000 ? `${((profile?.words_learned||0)/1000).toFixed(1)}K` : String(profile?.words_learned || 0), color: '#22c55e' },
    { icon: RotateCcw, label: 'Reviews',    value: String(profile?.reviews_done || 0),         color: '#6366f1' },
    { icon: Mic,       label: 'Speaking',   value: String(profile?.speak_sessions || 0),       color: '#ec4899' },
    { icon: Pencil,    label: 'Kanji',      value: String(profile?.kanji_learned || 0),        color: '#a78bfa' },
  ];

  const initials = (profile?.name || 'V').charAt(0).toUpperCase();
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-up">

      {/* ── Identity Card ─────────────────────── */}
      <Card padding="none" className="overflow-hidden">
        {/* Cover gradient */}
        <div className="h-20 sm:h-24 relative flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #0b0920, #1a0f3c, #0e0b22)' }}>
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.6), transparent 70%)' }} />
        </div>

        <div className="px-4 sm:px-5 pb-5">
        {/* Avatar row — flex-wrap to prevent overlap on tiny screens */}
          <div className="flex flex-wrap items-end gap-3 -mt-8 sm:-mt-10 mb-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-[3px] sm:border-4 overflow-hidden relative"
                style={{ borderColor: '#0e0b22', background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
              >
                {profile?.avatarUrl ? (
                  <Image src={profile.avatarUrl} alt="Avatar" fill sizes="80px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl sm:text-3xl font-black text-white select-none">
                    {initials}
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              {/* Camera button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', border: '2px solid #0e0b22' }}
                aria-label="Upload avatar"
              >
                <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>

            {/* Plan badge and date — aligned to bottom of avatar, wraps on very small */}
            <div className="flex-1 min-w-0 pb-1" style={{ minWidth: '0' }}>
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <PlanBadge plan={profile?.planId || 'free'} />
                {profile?.isAdmin && (
                  <span className="text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                    Admin
                  </span>
                )}
                {memberSince && (
                  <span className="text-[9px] sm:text-[10px] flex-shrink-0" style={{ color: 'rgba(130,120,190,0.4)' }}>
                    {memberSince}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Name row */}
          <div className="mb-2 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2 min-w-0">
                <input
                  value={nameVal}
                  onChange={e => setNameVal(e.target.value)}
                  className="input flex-1 min-w-0 font-black text-base sm:text-lg h-9 py-0"
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setEditingName(false); setNameVal(profile?.name || ''); } }}
                />
                <button onClick={saveName} disabled={saving}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-green-400 hover:bg-green-400/10 transition-colors">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditingName(false); setNameVal(profile?.name || ''); }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-red-400 hover:bg-red-400/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <h1 className="text-xl sm:text-2xl font-black text-white truncate min-w-0 max-w-[calc(100%-2.5rem)]">
                  {profile?.name || 'Learner'}
                </h1>
                <button
                  onClick={() => setEditingName(true)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors hover:bg-[rgba(139,92,246,0.15)]"
                  aria-label="Edit name"
                >
                  <Edit3 className="w-3 h-3" style={{ color: 'rgba(167,139,250,0.5)' }} />
                </button>
              </div>
            )}
          </div>

          {/* Username + email */}
          <div className="text-xs sm:text-sm mb-2 truncate min-w-0 overflow-hidden" style={{ color: 'rgba(160,150,220,0.5)' }}>
            @{profile?.username || 'user'} · {profile?.email}
          </div>

          {/* Bio */}
          <div className="mb-3">
            {editingBio ? (
              <div className="space-y-2">
                <textarea
                  value={bioVal}
                  onChange={e => setBioVal(e.target.value)}
                  className="input w-full resize-none text-sm"
                  rows={2}
                  placeholder="Tell your story…"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={saveBio} loading={saving}>Save</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingBio(false); setBioVal(profile?.bio || ''); }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <button onClick={() => setEditingBio(true)} className="text-left w-full group">
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: profile?.bio ? 'rgba(200,196,255,0.75)' : 'rgba(139,92,246,0.35)' }}>
                  {profile?.bio || 'Tap to add a bio…'}
                </p>
              </button>
            )}
          </div>

          {/* JLPT target */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] sm:text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Target:</span>
            {editingJLPT ? (
              <div className="flex items-center gap-1.5">
                <select
                  value={jlptVal}
                  onChange={e => setJlptVal(e.target.value)}
                  className="text-xs px-2 py-1 rounded-lg text-white"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  {JLPT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <button onClick={saveJLPT} disabled={saving} className="text-green-400 hover:opacity-80 flex-shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => { setEditingJLPT(false); setJlptVal(profile?.jlpt_target || 'N5'); }} className="text-red-400 hover:opacity-80 flex-shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setEditingJLPT(true)} className="flex items-center gap-1 group flex-shrink-0">
                <JLPTBadge level={profile?.jlpt_target || 'N5'} />
                <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-50 transition-opacity"
                  style={{ color: 'rgba(167,139,250,0.5)' }} />
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* ── XP Ring + Level ───────────────────── */}
      <Card padding="md">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex-shrink-0">
            <CircularProgress value={xpInLevel} max={xpForLevel} size={80} strokeWidth={7} color="#7c3aed">
              <div className="text-center">
                <div className="text-lg font-black text-white leading-none">{level}</div>
                <div className="text-[8px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>LVL</div>
              </div>
            </CircularProgress>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs mb-1.5 gap-2">
              <span className="font-bold text-white truncate">{xp.toLocaleString()} XP</span>
              <span className="flex-shrink-0" style={{ color: 'rgba(160,150,220,0.5)' }}>
                Next: {(level * xpForLevel).toLocaleString()}
              </span>
            </div>
            <ProgressBar value={xpInLevel} max={xpForLevel} size="sm" />
            <div className="text-[10px] sm:text-xs mt-2" style={{ color: 'rgba(160,150,220,0.5)' }}>
              {(xpForLevel - xpInLevel).toLocaleString()} XP to Level {level + 1}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Stats Grid ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {stats.map(s => (
          <Card key={s.label} padding="sm" className="sm:p-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 flex-shrink-0"
              style={{ background: `${s.color}18` }}>
              <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: s.color }} />
            </div>
            <div className="text-base sm:text-lg font-black text-white truncate">{s.value}</div>
            <div className="text-[9px] sm:text-[10px] mt-0.5 truncate" style={{ color: 'rgba(160,150,220,0.5)' }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* ── Subscription Card ─────────────────── */}
      <SubscriptionCard />

      {/* ── Badges ───────────────────────────── */}
      {badges.length > 0 && (
        <Card padding="sm" className="sm:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-black text-white">🏆 Achievements</div>
            <button onClick={() => router.push('/achievements')}
              className="text-[10px] sm:text-xs flex items-center gap-1 transition-colors flex-shrink-0"
              style={{ color: 'rgba(167,139,250,0.6)' }}>
              All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.slice(0, 12).map((b: any) => (
              <div
                key={b.badge_id}
                title={b.title}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-transform hover:scale-110 cursor-default"
                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.15)' }}
              >
                {b.icon}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Quick Links ──────────────────────── */}
      <Card padding="sm">
        {[
          { icon: TrendingUp, label: 'My Progress',   sub: 'Skills, calendar & history', href: '/progress', color: '#8b5cf6' },
          { icon: CreditCard, label: 'Subscription',  sub: profile?.isPremium ? `${(profile.planId||'').toUpperCase()} plan` : 'Upgrade', href: '/billing', color: '#f59e0b' },
          { icon: Settings,   label: 'Settings',      sub: 'Theme, notifications', href: '/settings', color: '#3b82f6' },
        ].map(item => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className="w-full flex items-center gap-3 py-3 px-3 rounded-xl transition-all hover:bg-[rgba(139,92,246,0.06)] group text-left"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${item.color}15` }}>
              <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white truncate">{item.label}</div>
              <div className="text-[10px] sm:text-xs mt-0.5 truncate" style={{ color: 'rgba(160,150,220,0.5)' }}>{item.sub}</div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-70 transition-opacity flex-shrink-0" style={{ color: 'rgba(167,139,250,0.5)' }} />
          </button>
        ))}
      </Card>

      {/* ── Logout ───────────────────────────── */}
      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>

      {/* Bottom spacer for mobile nav */}
      <div className="h-2" />
    </div>
  );
}
