'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useStoreContext } from '../../context/StoreContext';
import { createClient } from '../../lib/supabase';
import { LogOut, Trash2, Moon, Sun, Monitor, Globe, ChevronRight, ExternalLink, Lock } from 'lucide-react';
import { Button } from '@evlo/ui';

export function SettingsTab() {
  const { state, setTheme, setUILang, toggleTTS, setGoalMinutes } = useStoreContext();
  const { user, profile, logout, updateSettings, deleteAccount, updateProfileDetails } = useAuth();
  const router = useRouter();

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(profile?.notifications ?? true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || '');
  const [usernameMsg, setUsernameMsg] = useState('');

  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(profile?.name || '');

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch {
      setLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      router.push('/');
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account');
      setDeleting(false);
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    try {
      await updateSettings({ notifications: val });
    } catch {}
  };

  const handleThemeChange = async (t: 'dark' | 'light' | 'system') => {
    setTheme(t);
    try {
      await updateSettings({ theme: t });
    } catch {}
  };

  const handleTTSChange = async () => {
    toggleTTS();
    try {
      await updateSettings({ tts_enabled: !state.ttsEnabled });
    } catch {}
  };

  const handleGoalChange = async (m: number) => {
    setGoalMinutes(m);
    try {
      await updateSettings({ goal_minutes: m });
    } catch {}
  };

  const handleLangChange = async (l: 'en' | 'hi') => {
    setUILang(l);
    try {
      await updateSettings({ ui_language: l });
    } catch {}
  };

  const handleUpdateUsername = async () => {
    if (!newUsername || newUsername.length < 3) {
      setUsernameMsg('Username must be at least 3 characters.');
      return;
    }
    setUsernameMsg('Saving...');
    try {
      await updateProfileDetails(profile?.name || 'Learner', profile?.bio || '', profile?.avatarUrl || '🦊', newUsername);
      setUsernameMsg('✅ Saved!');
      setTimeout(() => {
        setIsEditingUsername(false);
        setUsernameMsg('');
      }, 1000);
    } catch (err: any) {
      setUsernameMsg(`❌ ${err.message || 'Failed to update username'}`);
    }
  };

  const handleUpdateDisplayName = async () => {
    if (!newDisplayName.trim()) return;
    try {
      await updateProfileDetails(newDisplayName, profile?.bio || '', profile?.avatarUrl || '🦊');
      setIsEditingDisplayName(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      setPwMsg('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg('Passwords do not match.');
      return;
    }
    setPwLoading(true);
    setPwMsg('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPwMsg('✅ Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowChangePassword(false);
        setPwMsg('');
      }, 2000);
    } catch (err: any) {
      setPwMsg(`❌ ${err.message || 'Failed to change password'}`);
    } finally {
      setPwLoading(false);
    }
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <div style={{
      fontSize: '11px',
      fontWeight: 800,
      letterSpacing: '0.1em',
      color: 'var(--text-secondary, #b3b3b9)',
      padding: '12px 8px 6px 8px',
      textTransform: 'uppercase'
    }}>
      {title}
    </div>
  );

  const SettingsRow = ({
    label,
    sub,
    right,
    onClick
  }: { label: string; sub?: string; right?: React.ReactNode; onClick?: () => void }) => (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 8px',
        borderBottom: '1px solid var(--border-strong, #2d2d34)',
        cursor: onClick ? 'pointer' : 'default',
        gap: '8px',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary, #fff)' }}>{label}</div>
        {sub && <div style={{ fontSize: '11px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '2px' }}>{sub}</div>}
      </div>
      {right}
    </div>
  );

  const Divider = () => (
    <div style={{ height: '1px', background: 'var(--border-strong, #2d2d34)', margin: '12px 0' }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '32px' }}>
      
      {/* Change Password Modal */}
      {showChangePassword && (
        <>
          <div onClick={() => setShowChangePassword(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            zIndex: 1001, background: 'var(--surface-2, #2d2d34)', border: '1px solid var(--border-strong, #2d2d34)',
            borderRadius: '16px', padding: '24px', width: 'min(360px, 92vw)',
          }}>
            <h3 style={{ fontWeight: 900, marginBottom: '16px' }}>🔒 Change Password</h3>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)' }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Min. 6 characters"
              style={{ width: '100%', margin: '6px 0 12px 0', background: 'var(--surface-3, #3a3a42)', border: 'none', padding: '8px' }}
            />
            <label style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              style={{ width: '100%', margin: '6px 0 12px 0', background: 'var(--surface-3, #3a3a42)', border: 'none', padding: '8px' }}
            />
            {pwMsg && <p style={{ fontSize: '12px', color: pwMsg.startsWith('✅') ? 'var(--success, #4caf50)' : 'var(--error, #ef4444)' }}>{pwMsg}</p>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button variant="ghost" onClick={() => setShowChangePassword(false)} style={{ flex: 1 }}>Cancel</Button>
              <Button variant="primary" onClick={handleChangePassword} disabled={pwLoading} style={{ flex: 1 }}>
                {pwLoading ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* 1. Account section */}
      <SectionHeader title="Account" />

      {/* Username Row */}
      <SettingsRow
        label="Username"
        sub={isEditingUsername ? undefined : `@${profile?.username || 'learner'}`}
        right={
          isEditingUsername ? (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                style={{ fontSize: '13px', width: '100px', height: '28px', padding: '0 4px', background: 'var(--surface-3, #3a3a42)', border: 'none' }}
              />
              <Button variant="primary" onClick={handleUpdateUsername} style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}>Save</Button>
            </div>
          ) : (
            <span onClick={() => setIsEditingUsername(true)} style={{ color: 'var(--primary, #ff9800)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Change</span>
          )
        }
      />
      {usernameMsg && <div style={{ fontSize: '11px', color: 'var(--primary, #ff9800)', padding: '0 8px' }}>{usernameMsg}</div>}

      {/* Display name Row */}
      <SettingsRow
        label="Display Name"
        sub={isEditingDisplayName ? undefined : profile?.name || 'Learner'}
        right={
          isEditingDisplayName ? (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <input
                type="text"
                value={newDisplayName}
                onChange={e => setNewDisplayName(e.target.value)}
                style={{ fontSize: '13px', width: '100px', height: '28px', padding: '0 4px', background: 'var(--surface-3, #3a3a42)', border: 'none' }}
              />
              <Button variant="primary" onClick={handleUpdateDisplayName} style={{ height: '28px', padding: '0 8px', fontSize: '11px' }}>Save</Button>
            </div>
          ) : (
            <span onClick={() => setIsEditingDisplayName(true)} style={{ color: 'var(--primary, #ff9800)', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Edit</span>
          )
        }
      />

      {/* Email Row (Read-only) */}
      <SettingsRow label="Email (Read-only)" sub={user?.email ?? '—'} />

      {/* Change Password Row */}
      <SettingsRow
        label="Change Password"
        sub="Update account password"
        right={<Lock size={15} style={{ color: 'var(--text-secondary, #b3b3b9)' }} />}
        onClick={() => setShowChangePassword(true)}
      />

      <Divider />

      {/* 2. Preferences section */}
      <SectionHeader title="Preferences" />

      {/* Theme selector */}
      <SettingsRow
        label="Theme"
        sub="System / Light / Dark"
        right={
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-3, #3a3a42)', padding: '2px', borderRadius: '8px' }}>
            {(['system', 'light', 'dark'] as const).map(t => {
              const active = (state.theme || 'dark') === t;
              return (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  style={{
                    background: active ? 'var(--primary, #ff9800)' : 'transparent',
                    color: active ? '#000' : 'var(--text-secondary, #b3b3b9)',
                    border: 'none', borderRadius: '6px', padding: '4px 8px',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {t.toUpperCase()}
                </button>
              );
            })}
          </div>
        }
      />

      {/* Language */}
      <SettingsRow
        label="Language"
        sub="English / 日本語"
        right={
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-3, #3a3a42)', padding: '2px', borderRadius: '8px' }}>
            {(['en', 'hi'] as const).map(l => {
              const active = (state.uiLang || 'en') === l;
              return (
                <button
                  key={l}
                  onClick={() => handleLangChange(l)}
                  style={{
                    background: active ? 'var(--primary, #ff9800)' : 'transparent',
                    color: active ? '#000' : 'var(--text-secondary, #b3b3b9)',
                    border: 'none', borderRadius: '6px', padding: '4px 8px',
                    fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {l === 'en' ? 'EN' : 'HI'}
                </button>
              );
            })}
          </div>
        }
      />

      {/* TTS Toggle */}
      <SettingsRow
        label="Text-to-Speech (TTS)"
        sub="Speak Japanese audio in reviews"
        right={
          <label className="toggle-switch" style={{ margin: 0 }}>
            <input type="checkbox" checked={!!state.ttsEnabled} onChange={handleTTSChange} />
            <span className="toggle-slider" />
          </label>
        }
      />

      {/* Daily Goal selector */}
      <SettingsRow
        label="Daily Goal"
        sub="Target XP to earn per day"
        right={
          <select
            value={state.goalMinutes || 10}
            onChange={(e) => handleGoalChange(Number(e.target.value))}
            style={{ background: 'var(--surface-3, #3a3a42)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}
          >
            {[10, 20, 30, 50].map(xp => (
              <option key={xp} value={xp}>{xp} XP</option>
            ))}
          </select>
        }
      />

      {/* Notifications toggle */}
      <SettingsRow
        label="Notifications"
        sub="Daily reminders & activity logs"
        right={
          <label className="toggle-switch" style={{ margin: 0 }}>
            <input type="checkbox" checked={notificationsEnabled} onChange={() => handleToggleNotifications(!notificationsEnabled)} />
            <span className="toggle-slider" />
          </label>
        }
      />

      {/* JLPT target selector */}
      <SettingsRow
        label="JLPT Target"
        sub="Level target for preparation"
        right={
          <select
            value={profile?.jlpt_target || 'N5'}
            onChange={async (e) => {
              try {
                await updateSettings({ jlpt_target: e.target.value });
              } catch {}
            }}
            style={{ background: 'var(--surface-3, #3a3a42)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '12px' }}
          >
            {['N5', 'N4', 'N3', 'N2', 'N1'].map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        }
      />

      <Divider />

      {/* 3. About section */}
      <SectionHeader title="About" />
      <SettingsRow label="Privacy Policy" onClick={() => window.open('/privacy', '_blank')} right={<ExternalLink size={14} />} />
      <SettingsRow label="Terms of Service" onClick={() => window.open('/terms', '_blank')} right={<ExternalLink size={14} />} />
      <SettingsRow label="Moderation Policy" onClick={() => window.open('/moderation', '_blank')} right={<ExternalLink size={14} />} />
      <SettingsRow label="Instagram Support" sub="@Mannish_2323" onClick={() => window.open('https://instagram.com/Mannish_2323', '_blank')} right={<InstagramSupportIcon />} />
      <SettingsRow label="App Version" sub="v7.0.0" />

      <Divider />

      {/* 4. Danger Zone */}
      <SectionHeader title="Danger Zone" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            background: 'none', border: '1px solid rgba(239, 68, 68, 0.4)',
            color: 'var(--error, #ef4444)', padding: '12px', borderRadius: '12px',
            fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          <LogOut size={16} />
          {loggingOut ? 'Signing out...' : 'Sign Out'}
        </button>

        {showDeleteConfirm ? (
          <div className="card" style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid var(--error, #ef4444)' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)' }}>
              Are you absolutely sure you want to permanently delete your account? This action is IRREVERSIBLE and all data will be lost.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} disabled={deleting} style={{ flex: 1 }}>
                Cancel
              </Button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                style={{
                  flex: 1, background: 'var(--error, #ef4444)', color: '#fff', border: 'none',
                  borderRadius: '12px', fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                }}
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
            {deleteError && <div style={{ color: 'var(--error, #ef4444)', fontSize: '11px', marginTop: '8px' }}>{deleteError}</div>}
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{
              background: 'var(--error, #ef4444)', border: 'none',
              color: '#fff', padding: '12px', borderRadius: '12px',
              fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        )}
      </div>
    </div>
  );
}

function InstagramSupportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
