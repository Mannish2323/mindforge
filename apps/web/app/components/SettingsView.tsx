'use client';

import React, { useState } from 'react';
import { LogOut, Trash2, Moon, Sun, Monitor, Bell, BellOff, Globe, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SettingsViewProps {
  state: any;
  onSetTheme: (t: 'dark' | 'light' | 'system') => void;
  onSetUILang: (l: 'en' | 'hi') => void;
  onToggleTTS: () => void;
  onSetGoalMinutes: (m: number) => void;
  onNavigate: (tab: string) => void;
}

export function SettingsView({
  state,
  onSetTheme,
  onSetUILang,
  onToggleTTS,
  onSetGoalMinutes,
  onNavigate,
}: SettingsViewProps) {
  const { user, profile, logout, updateSettings } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notifications ?? true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      setLoggingOut(false);
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    try {
      await updateSettings({ notifications: val });
    } catch { /* silent */ }
  };

  const handleTheme = async (t: 'dark' | 'light' | 'system') => {
    onSetTheme(t);
    try {
      await updateSettings({ theme: t });
    } catch { /* silent */ }
  };

  const handleTTS = async () => {
    onToggleTTS();
    try {
      await updateSettings({ tts_enabled: !state.ttsEnabled });
    } catch { /* silent */ }
  };

  const handleGoal = async (m: number) => {
    onSetGoalMinutes(m);
    try {
      await updateSettings({ goal_minutes: m });
    } catch { /* silent */ }
  };

  const handleLang = async (l: 'en' | 'hi') => {
    onSetUILang(l);
    try {
      await updateSettings({ ui_language: l });
    } catch { /* silent */ }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--text-3)', padding: 'var(--sp-5) var(--sp-5) var(--sp-2)', textTransform: 'uppercase' }}>
      {title}
    </div>
  );

  const SettingsRow = ({
    label, sub, right, danger, onClick
  }: { label: string; sub?: string; right?: React.ReactNode; danger?: boolean; onClick?: () => void }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: 'var(--sp-4) var(--sp-5)', borderBottom: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background var(--t-fast)',
      }}
      className={onClick ? 'card-interactive-row' : ''}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: danger ? 'var(--error)' : 'var(--text)' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <label className="toggle-switch" style={{ margin: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );

  return (
    <div className="settings-page page-enter" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ padding: 'var(--sp-5) var(--sp-5) 0' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 900 }}>Settings</h1>
        <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>Preferences and account control</p>
      </div>

      {/* ── APPEARANCE ── */}
      <SectionHeader title="Appearance" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        <SettingsRow
          label="Theme"
          sub="Controls the color scheme of the app"
          right={
            <div className="theme-toggle" role="group" aria-label="Theme selector">
              {(['system', 'light', 'dark'] as const).map(t => (
                <button
                  key={t}
                  className={`theme-toggle-btn${(state.theme ?? 'dark') === t ? ' active' : ''}`}
                  onClick={() => handleTheme(t)}
                  aria-pressed={(state.theme ?? 'dark') === t}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {t === 'system' ? <Monitor size={12} /> : t === 'light' ? <Sun size={12} /> : <Moon size={12} />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          }
        />
      </div>

      {/* ── LEARNING ── */}
      <SectionHeader title="Learning" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        <SettingsRow
          label="Daily Goal"
          sub="Minutes of study per day"
          right={
            <div className="chip-group" style={{ flexWrap: 'nowrap', gap: 'var(--sp-1)' }}>
              {[5, 10, 15, 20, 30].map(m => (
                <button key={m}
                  className={`chip${(state.goalMinutes ?? 10) === m ? ' active' : ''}`}
                  style={{ padding: '5px 8px', fontSize: '11px' }}
                  onClick={() => handleGoal(m)}>
                  {m}m
                </button>
              ))}
            </div>
          }
        />
        <SettingsRow
          label="Text-to-Speech"
          sub="Auto-play Japanese audio in lessons"
          right={<Toggle checked={!!state.ttsEnabled} onChange={handleTTS} />}
        />
        <SettingsRow
          label="UI Language"
          sub="Language for explanations and hints"
          right={
            <div className="chip-group" style={{ flexWrap: 'nowrap', gap: 'var(--sp-1)' }}>
              {(['en', 'hi'] as const).map(l => (
                <button key={l}
                  className={`chip${state.uiLang === l ? ' active' : ''}`}
                  style={{ padding: '5px 10px', fontSize: '11px' }}
                  onClick={() => handleLang(l)}>
                  {l === 'en' ? '🇬🇧 EN' : '🇮🇳 HI'}
                </button>
              ))}
            </div>
          }
        />
        <SettingsRow
          label="JLPT Target"
          sub={`Current: ${profile?.jlpt_target || 'N5'}`}
          right={<ChevronRight size={16} style={{ color: 'var(--text-3)' }} />}
        />
      </div>

      {/* ── NOTIFICATIONS ── */}
      <SectionHeader title="Notifications" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        <SettingsRow
          label="Push Notifications"
          sub="Daily reminders and streak alerts"
          right={<Toggle checked={notificationsEnabled} onChange={() => handleToggleNotifications(!notificationsEnabled)} />}
        />
        <SettingsRow
          label="Streak Reminders"
          sub="Reminded before your streak breaks"
          right={<Toggle checked={notificationsEnabled} onChange={() => handleToggleNotifications(!notificationsEnabled)} />}
        />
      </div>

      {/* ── ACCOUNT ── */}
      <SectionHeader title="Account" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        <SettingsRow label="Email" sub={user?.email ?? '—'} />
        <SettingsRow
          label="Username"
          sub={`@${profile?.username ?? '—'}`}
          right={<span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>Edit</span>}
        />
        <SettingsRow
          label="Subscription"
          sub={profile?.isPremium ? `✨ ${profile.planId?.toUpperCase() || 'Pro'} — Active` : 'Free Plan'}
          right={
            !profile?.isPremium
              ? <button className="btn-ghost" onClick={() => onNavigate('billing')}
                  style={{ fontSize: '11px', padding: '4px 12px', color: 'var(--xp-gold)', border: '1px solid rgba(251,191,36,.4)' }}>
                  Upgrade
                </button>
              : <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>Manage</span>
          }
        />
        <SettingsRow
          label="Payment History"
          sub="View past invoices and transactions"
          right={<ChevronRight size={16} style={{ color: 'var(--text-3)' }} />}
          onClick={() => onNavigate('billing')}
        />
      </div>

      {/* ── PRIVACY ── */}
      <SectionHeader title="Privacy" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        <SettingsRow
          label="Public Profile"
          sub="Show your profile on leaderboards"
          right={<Toggle checked={true} onChange={() => {}} />}
        />
        <SettingsRow
          label="Show Streak Publicly"
          sub="Others can see your streak in social"
          right={<Toggle checked={true} onChange={() => {}} />}
        />
      </div>

      {/* ── DANGER ZONE ── */}
      <SectionHeader title="Danger Zone" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        <SettingsRow
          label="Sign Out"
          sub="You can sign back in at any time"
          danger={false}
          right={
            <button
              id="btn-sign-out"
              className="btn-ghost"
              onClick={handleLogout}
              disabled={loggingOut}
              style={{ minHeight: 34, fontSize: '12px', color: 'var(--error)', border: '1px solid rgba(239,68,68,.4)', padding: '4px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={13} />
              {loggingOut ? 'Signing out…' : 'Sign Out'}
            </button>
          }
        />
        <SettingsRow
          label="Delete Account"
          sub="Permanently delete all your data. Irreversible."
          danger={true}
          right={
            showDeleteConfirm ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => setShowDeleteConfirm(false)}
                  style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--surface-3)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'var(--text)' }}>
                  Cancel
                </button>
                <button
                  style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--error)', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', color: 'white', fontWeight: 700 }}>
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button className="btn-ghost"
                onClick={() => setShowDeleteConfirm(true)}
                style={{ minHeight: 34, fontSize: '12px', color: 'var(--error)', border: '1px solid rgba(239,68,68,.4)', padding: '4px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={13} />
                Delete
              </button>
            )
          }
        />
      </div>

      {/* ── LEGAL ── */}
      <SectionHeader title="Legal" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden' }}>
        {[
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Refund Policy', href: '/refund' },
          { label: 'Cookie Policy', href: '/cookies' },
          { label: 'Moderation Policy', href: '/moderation' },
        ].map(({ label, href }, i, arr) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 'var(--sp-3) var(--sp-5)',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              color: 'var(--text)', textDecoration: 'none', fontSize: 'var(--text-sm)',
              transition: 'background var(--t-fast)',
            }}
            className="card-interactive-row"
          >
            {label}
            <ExternalLink size={13} style={{ color: 'var(--text-3)' }} />
          </a>
        ))}
      </div>

      {/* ── SUPPORT ── */}
      <SectionHeader title="Support" />
      <div className="card" style={{ margin: '0 var(--sp-4)', padding: 0, overflow: 'hidden', marginBottom: 'var(--sp-2)' }}>
        <SettingsRow
          label="Send Feedback"
          sub="Help us improve Learn with Velmorth"
          right={<ChevronRight size={16} style={{ color: 'var(--text-3)' }} />}
          onClick={() => window.open('mailto:support@velmorth.com', '_blank')}
        />
        <SettingsRow
          label="Report a Bug"
          sub="Something not working? Let us know"
          right={<ChevronRight size={16} style={{ color: 'var(--text-3)' }} />}
          onClick={() => window.open('mailto:bugs@velmorth.com', '_blank')}
        />
      </div>

      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-3)', padding: 'var(--sp-5) 0 var(--sp-8)' }}>
        Learn with Velmorth v4 · Velmorth Labs · Founder: Mannish
      </div>
    </div>
  );
}
