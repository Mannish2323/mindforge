'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, PenLine, ChevronRight, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudyActivityHeatmap } from './StudyActivityHeatmap';

interface ProfileViewProps {
  state: any;
  onNavigate: (tab: string, subView?: string) => void;
}

const AVATARS = ['🐼', '🦊', '🐸', '🐺', '🦁', '🐻', '🐯', '🦉', '🐨', '🐱', '🦅', '🦋'];

// Real stat builder — derives ALL values from store state (zero for new users)
function buildStats(state: any, completedLessons: number) {
  const wordsLearned = Object.keys(state?.srsData || {}).length;
  const speakSessions = state?.storiesCompleted || 0;
  return [
    { label: 'Total XP',       value: state?.xp        || 0, icon: '⭐', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Day Streak',     value: state?.streak     || 0, icon: '🔥', color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
    { label: 'Lessons Done',   value: completedLessons,       icon: '📖', color: '#16A34A', bg: 'rgba(22,163,74,0.12)'  },
    { label: 'Words Learnt',   value: wordsLearned,           icon: '🈳', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Reviews Done',   value: state?.dailyReviewsDone || 0, icon: '🔁', color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)' },
    { label: 'Speak Sessions', value: speakSessions,          icon: '🎤', color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  ];
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    ref.current = 0;
    const diff = value;
    if (diff === 0) { setDisplay(0); return; }
    const duration = 900;
    const step = 16;
    const inc = diff / (duration / step);
    const timer = setInterval(() => {
      ref.current = Math.min(ref.current + inc, value);
      setDisplay(Math.round(ref.current));
      if (ref.current >= value) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}</>;
}

export function ProfileView({ state, onNavigate }: ProfileViewProps) {
  const { user, profile, updateProfileDetails } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🦊');
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!user || !profile) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--sp-8)', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px', animation: 'bounce-in 0.6s ease both' }}>🔒</div>
        <h2 style={{ fontWeight: 800, marginBottom: '8px' }}>Sign in to view your profile</h2>
        <p style={{ color: 'var(--text-2)', marginBottom: '20px' }}>Track your progress, badges, and activity.</p>
        <button className="btn-primary" onClick={() => onNavigate('home')} style={{ width: 'auto', padding: '10px 28px' }}>Sign In</button>
      </div>
    );
  }

  const completedLessons = Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;
  const unlockedBadges = (state?.badges || []).filter((b: any) => b.unlockedAt !== null);
  const stats = buildStats(state, completedLessons);

  // Build real activity data for heatmap from state.activityLog
  const activityData: Record<string, { sessions: number; xp: number }> = {};
  const log = state?.activityLog || {};
  const lprog = state?.lessonProgress || {};
  // Populate sessions from activityLog
  Object.entries(log).forEach(([date, sessions]) => {
    activityData[date] = { sessions: sessions as number, xp: 0 };
  });
  // Add XP per day from lessonProgress
  Object.values(lprog).forEach((l: any) => {
    if (l.completedAt) {
      const d = l.completedAt.split('T')[0];
      if (activityData[d]) activityData[d].xp += (l.xp || 0);
      else activityData[d] = { sessions: 1, xp: l.xp || 0 };
    }
  });
  const hasAnyActivity = Object.keys(activityData).length > 0;

  const completionItems = [!!profile.avatarUrl, !!(profile.name && profile.name !== 'Learner'), !!profile.bio, !!profile.jlpt_target, completedLessons > 0];
  const completionPct = Math.round((completionItems.filter(Boolean).length / completionItems.length) * 100);
  const xpInLevel = (state?.xp || 0) % 100;
  const level = Math.floor((state?.xp || 0) / 100) + 1;

  const handleStartEdit = () => { setEditName(profile.name || ''); setEditBio(profile.bio || ''); setIsEditing(true); };
  const handleSave = async () => {
    setSaving(true);
    try { await updateProfileDetails(editName, editBio, profile.avatarUrl || '🦊'); setIsEditing(false); }
    catch { } finally { setSaving(false); }
  };
  const handleAvatarSelect = async (av: string) => {
    try { 
      await updateProfileDetails(profile.name || 'Learner', profile.bio || '', av); 
      setShowAvatarPicker(false); 
    } catch (err) {
      alert('Failed to save avatar. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="profile-container-main" style={{ maxWidth: '680px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

      {/* ══ HERO HEADER ══════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', overflow: 'visible',
        background: 'linear-gradient(135deg, rgba(22,163,74,0.18) 0%, rgba(139,92,246,0.14) 50%, rgba(14,165,233,0.10) 100%)',
        borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
        padding: 'var(--sp-8) var(--sp-5) var(--sp-6)',
        marginBottom: 'var(--sp-4)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-30px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(139,92,246,0.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(22,163,74,0.10)', filter: 'blur(30px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)', textAlign: 'center' }}>

          {/* Avatar + glow ring */}
          <div
            style={{
              position: 'relative', width: '100px', height: '100px',
              opacity: mounted ? 1 : 0, transform: mounted ? 'scale(1)' : 'scale(0.7)',
              transition: 'all 0.55s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Pulsing glow */}
            <div style={{
              position: 'absolute', inset: '-6px', borderRadius: '50%',
              background: 'var(--grad-primary)',
              animation: 'profile-glow-pulse 3s ease-in-out infinite',
              opacity: 0.6,
            }} />
            {/* SVG completion ring */}
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle cx="50" cy="50" r="44" fill="none"
                stroke="url(#profileRingGrad)" strokeWidth="4"
                strokeDasharray={`${mounted ? (completionPct / 100) * 276.5 : 0} 276.5`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1) 0.3s' }}
              />
              <defs>
                <linearGradient id="profileRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#16A34A" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            {/* Avatar face */}
            <div
              onClick={() => {
                if (!showAvatarPicker) {
                  setSelectedAvatar(profile.avatarUrl || '🦊');
                }
                setShowAvatarPicker(v => !v);
              }}
              title="Change avatar"
              style={{
                position: 'absolute', inset: '8px',
                borderRadius: '50%',
                background: 'var(--surface)',
                border: '2px solid rgba(255,255,255,0.1)',
                display: 'grid', placeItems: 'center',
                fontSize: '42px', cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              className="avatar-hover"
            >
              {profile.avatarUrl || '🦊'}
            </div>
            {/* Edit badge */}
            <div style={{
              position: 'absolute', bottom: '8px', right: '4px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: 'var(--primary)', border: '2px solid var(--bg)',
              display: 'grid', placeItems: 'center', fontSize: '10px',
              cursor: 'pointer', pointerEvents: 'none',
            }}>✏️</div>
          </div>

          <button
            type="button"
            className="btn-ghost"
            style={{
              padding: '6px 16px',
              fontSize: 'var(--text-xs)',
              height: '32px',
              width: 'auto',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (!showAvatarPicker) {
                setSelectedAvatar(profile.avatarUrl || '🦊');
              }
              setShowAvatarPicker(v => !v);
            }}
          >
            <span>{profile.avatarUrl || '🦊'}</span>
            <span>Select Avatar</span>
          </button>

          {/* Avatar picker — centered fixed overlay, mobile-safe */}
          {showAvatarPicker && (
            <>
              {/* Backdrop */}
              <div
                onClick={() => setShowAvatarPicker(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 199,
                  background: 'rgba(0,0,0,0.55)',
                  backdropFilter: 'blur(4px)',
                  animation: 'fadein 0.15s ease both',
                }}
              />
              {/* Picker panel — always centered on screen */}
              <div style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 200,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--sp-4)',
                display: 'flex', flexDirection: 'column', gap: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                animation: 'fadescale 0.2s ease both',
                width: 'min(280px, 90vw)',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase', textAlign: 'center' }}>
                  Select New Avatar
                </div>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
                }}>
                  {AVATARS.map(av => {
                    const isSelected = selectedAvatar === av;
                    return (
                      <button key={av} type="button" onClick={() => setSelectedAvatar(av)}
                        style={{
                          fontSize: '24px', width: '100%', aspectRatio: '1',
                          borderRadius: 'var(--radius)',
                          border: isSelected ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                          background: isSelected ? 'rgba(22,163,74,0.12)' : 'var(--surface-2)',
                          cursor: 'pointer', transition: 'all 0.15s ease',
                          transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                          boxShadow: isSelected ? '0 0 12px rgba(22,163,74,0.3)' : 'none',
                          display: 'grid', placeItems: 'center',
                        }}
                        className="avatar-pick-btn"
                      >
                        {av}
                      </button>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <button className="btn-ghost" onClick={() => setShowAvatarPicker(false)}
                    style={{ flex: 1, padding: '10px 12px', fontSize: '13px', height: '42px', width: 'auto', minHeight: 'unset' }}>
                    Cancel
                  </button>
                  <button
                    id="btn-avatar-select"
                    className="btn-primary"
                    onClick={() => handleAvatarSelect(selectedAvatar)}
                    style={{ flex: 1, padding: '10px 12px', fontSize: '13px', height: '42px', width: 'auto', minHeight: 'unset', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: 0 }}
                  >
                    <Check size={14} /> Save Avatar
                  </button>
                </div>
              </div>
            </>
          )}


          {/* Name / Bio / Plan badge */}
          <div style={{
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.5s ease 0.18s',
          }}>
            {isEditing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '280px' }}>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  placeholder="Display Name" style={{ textAlign: 'center', margin: 0, background: 'rgba(255,255,255,0.06)' }} />
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)}
                  placeholder="Your Japanese learning goal…"
                  style={{ textAlign: 'center', height: '56px', resize: 'none', margin: 0, background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button className="btn-ghost" onClick={() => setIsEditing(false)}
                    style={{ width: 'auto', padding: '6px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <X size={12} /> Cancel
                  </button>
                  <button className="btn-primary" onClick={handleSave} disabled={saving}
                    style={{ width: 'auto', padding: '6px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.02em' }}>
                  {profile.name || 'Learner'}
                </h1>
                <p style={{ fontSize: '13px', color: 'var(--text-3)', marginBottom: '8px' }}>@{profile.username || 'learner'}</p>

                {/* Plan badge */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {profile.isPremium && (
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: 'linear-gradient(135deg,#F59E0B,#8B5CF6)', color: 'white', letterSpacing: '0.04em' }}>
                      ✨ {profile.planId?.toUpperCase() || 'PRO'}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-pill)', background: 'rgba(22,163,74,0.15)', color: 'var(--primary)', border: '1px solid rgba(22,163,74,0.25)' }}>
                    🎯 JLPT {profile.jlpt_target || 'N5'}
                  </span>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-2)', maxWidth: '320px', lineHeight: 1.6, marginBottom: '12px' }}>
                  {profile.bio || 'No bio yet — add your Japanese learning goal!'}
                </p>

                <button onClick={handleStartEdit}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '7px 18px', borderRadius: 'var(--radius-pill)',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                    color: 'var(--text)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s ease', backdropFilter: 'blur(8px)',
                  }}
                  className="edit-profile-btn"
                >
                  <PenLine size={13} /> Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 var(--sp-4)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>

        {/* ══ LEVEL + XP BAR ═══════════════════════════════════════════ */}
        <div className="card profile-xp-card"
          style={{
            padding: 'var(--sp-4) var(--sp-5)',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s ease 0.22s',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--text-3)', textTransform: 'uppercase' }}>Level {level}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                <AnimatedNumber value={state?.xp || 0} /> <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-3)' }}>XP total</span>
              </div>
            </div>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: 'var(--grad-primary)',
              display: 'grid', placeItems: 'center',
              fontSize: '22px', fontWeight: 900, color: 'white',
              boxShadow: '0 4px 20px rgba(22,163,74,0.35)',
            }}>
              {level}
            </div>
          </div>
          {/* XP bar */}
          <div style={{ height: '8px', background: 'var(--surface-3)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', marginBottom: '6px' }}>
            <div style={{
              height: '100%', borderRadius: 'var(--radius-pill)',
              background: 'var(--grad-primary)',
              width: mounted ? `${xpInLevel}%` : '0%',
              transition: 'width 1.1s cubic-bezier(0.4,0,0.2,1) 0.4s',
              boxShadow: '0 0 8px rgba(22,163,74,0.5)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)' }}>
            <span>{xpInLevel} / 100 XP to Level {level + 1}</span>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{xpInLevel}%</span>
          </div>
        </div>

        {/* ══ STATS GRID (6) ═══════════════════════════════════════════ */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--sp-2)',
          opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s ease 0.30s',
        }}>
          {stats.map((s, i) => (
            <div key={s.label} className="card profile-stat-card"
              style={{
                textAlign: 'center', padding: 'var(--sp-4) var(--sp-2)',
                background: s.bg,
                border: `1px solid ${s.color}22`,
                animationDelay: `${0.30 + i * 0.06}s`,
              }}>
              <div style={{ fontSize: '24px', marginBottom: '4px', fontFamily: i === 4 ? 'var(--font-ja)' : 'initial' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: '2px' }}>
                <AnimatedNumber value={typeof s.value === 'number' ? s.value : 0} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ══ PROFILE COMPLETION ═══════════════════════════════════════ */}
        <div className="card"
          style={{
            padding: 'var(--sp-4) var(--sp-5)',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s ease 0.38s',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Profile Completion</div>
              <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '2px' }}>{completionPct}% complete</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--radius-pill)',
              background: completionPct >= 100 ? 'rgba(22,163,74,0.15)' : 'var(--surface-3)',
              color: completionPct >= 100 ? 'var(--primary)' : 'var(--text-3)' }}>
              {completionItems.filter(Boolean).length}/{completionItems.length} done
            </span>
          </div>
          <div style={{ height: '6px', background: 'var(--surface-3)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
            <div style={{
              width: mounted ? `${completionPct}%` : '0%', height: '100%', borderRadius: 'var(--radius-pill)',
              background: completionPct >= 100 ? 'var(--grad-primary)' : 'linear-gradient(90deg,var(--primary),#8B5CF6)',
              transition: 'width 1s cubic-bezier(0.4,0,0.2,1) 0.5s',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
            {['Avatar', 'Name', 'Bio', 'JLPT Goal', '1st Lesson'].map((item, i) => (
              <span key={item} style={{
                fontSize: '10px', fontWeight: 700, padding: '3px 8px',
                borderRadius: 'var(--radius-pill)',
                background: completionItems[i] ? 'rgba(22,163,74,0.15)' : 'var(--surface-3)',
                color: completionItems[i] ? 'var(--primary)' : 'var(--text-3)',
                border: completionItems[i] ? '1px solid rgba(22,163,74,0.25)' : '1px solid transparent',
              }}>
                {completionItems[i] ? '✓' : '○'} {item}
              </span>
            ))}
          </div>
        </div>

        {/* ══ BADGES ═══════════════════════════════════════════════════ */}
        <div className="card"
          style={{
            padding: 'var(--sp-4) var(--sp-5)',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s ease 0.44s',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
            <h3 style={{ fontWeight: 800, fontSize: '15px' }}>🏅 Badges Earned</h3>
            {unlockedBadges.length > 0 && (
              <button className="btn-ghost" onClick={() => onNavigate('learn')}
                style={{ fontSize: '11px', padding: '4px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                View All <ChevronRight size={12} />
              </button>
            )}
          </div>
          {unlockedBadges.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-5)', color: 'var(--text-3)' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px', opacity: 0.5 }}>🏆</div>
              <p style={{ fontSize: '13px' }}>Complete lessons to earn your first badge!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {unlockedBadges.slice(0, 10).map((badge: any, i: number) => (
                <div key={badge.badge_id}
                  title={badge.description}
                  style={{
                    fontSize: '32px', cursor: 'help',
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'scale(1)' : 'scale(0)',
                    transition: `all 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.5 + i * 0.05}s`,
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
                  }}
                  className="badge-hover">
                  {badge.icon}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ ACTIVITY HEATMAP ═════════════════════════════════════════ */}
        <div className="card"
          style={{
            padding: 0, overflow: 'hidden',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s ease 0.50s',
          }}>
          <StudyActivityHeatmap activityData={hasAnyActivity ? activityData : null} realDataOnly={true} />
        </div>

        {/* ══ ACHIEVEMENT TIMELINE ════════════════════════════════════ */}
        <div className="card"
          style={{
            padding: 'var(--sp-4) var(--sp-5)',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.5s ease 0.56s',
          }}>
          <h3 style={{ fontWeight: 800, fontSize: '15px', marginBottom: 'var(--sp-4)' }}>📜 Achievement Timeline</h3>
          {completedLessons === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--sp-4)', color: 'var(--text-3)' }}>
              <p style={{ fontSize: '13px' }}>Complete your first lesson to start your story! 🌱</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                completedLessons > 0 && { icon: '🎉', title: 'First Lesson!', sub: 'Your Japanese journey started', color: 'var(--primary)' },
                (state?.xp || 0) >= 100 && { icon: '⭐', title: 'Reached Level 2', sub: '100 XP milestone', color: '#F59E0B' },
                (state?.streak || 0) >= 3 && { icon: '🔥', title: '3-Day Streak!', sub: 'Consistency is your superpower', color: '#EF4444' },
                unlockedBadges.length > 0 && { icon: '🏅', title: 'First Badge Earned', sub: unlockedBadges[0]?.name || 'Great work!', color: '#8B5CF6' },
              ].filter(Boolean).map((item: any, i, arr) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  paddingBottom: i < arr.length - 1 ? 'var(--sp-3)' : 0,
                  opacity: mounted ? 1 : 0, transform: mounted ? 'translateX(0)' : 'translateX(-12px)',
                  transition: `all 0.45s ease ${0.60 + i * 0.08}s`,
                }}>
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '2px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: `${item.color}22`, border: `2px solid ${item.color}44`, display: 'grid', placeItems: 'center', fontSize: '16px' }}>
                      {item.icon}
                    </div>
                    {i < arr.length - 1 && <div style={{ width: '2px', flex: 1, minHeight: '20px', background: 'var(--border)', margin: '4px 0' }} />}
                  </div>
                  <div style={{ paddingTop: '4px' }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: item.color }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ SETTINGS SHORTCUT ═══════════════════════════════════════ */}
        <button id="profile-settings-shortcut" onClick={() => onNavigate('settings')}
          className="card card-interactive"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 'var(--sp-4) var(--sp-5)', cursor: 'pointer', color: 'var(--text)',
            border: '1px solid var(--border)', textAlign: 'left',
            opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.45s ease 0.62s',
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'var(--surface-2)', display: 'grid', placeItems: 'center' }}>
              <Settings size={18} style={{ color: 'var(--text-2)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px' }}>App Settings</div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Theme, language, notifications, account</div>
            </div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-3)' }} />
        </button>

        {/* ══ UPGRADE CTA (free users) ════════════════════════════════ */}
        {!profile.isPremium && (
          <button onClick={() => onNavigate('billing')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--sp-4) var(--sp-5)', cursor: 'pointer', color: 'var(--text)',
              background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(139,92,246,0.10))',
              border: '1px solid rgba(251,191,36,0.25)', borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)',
              transition: 'all 0.45s ease 0.68s',
            }}
            className="card-interactive">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'rgba(251,191,36,0.15)', display: 'grid', placeItems: 'center', fontSize: '20px' }}>
                👑
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14px', color: '#F59E0B' }}>Upgrade to Pro</div>
                <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>Unlimited lessons, AI tutor &amp; more</div>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: '#F59E0B' }} />
          </button>
        )}

      </div>
    </div>
  );
}
