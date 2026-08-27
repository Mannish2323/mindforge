'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Settings, User, Volume2, Bell, Globe, Trash2,
  Clock, Moon, Sun, Monitor, Shield, Save, AlertTriangle,
  LogOut, HelpCircle, Lock, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { profile, updateSettings, updateProfileDetails, deleteAccount, logout } = useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [goalMinutes, setGoalMinutes] = useState(profile?.goal_minutes || 10);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(profile?.theme || 'dark');
  const [ttsEnabled, setTtsEnabled] = useState(profile?.tts_enabled ?? true);
  const [notifications, setNotifications] = useState(profile?.notifications ?? true);
  const [jlptTarget, setJlptTarget] = useState(profile?.jlpt_target || 'N5');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (updateProfileDetails) {
        await updateProfileDetails(displayName, bio, '');
      }
      if (updateSettings) {
        await updateSettings({
          theme,
          tts_enabled: ttsEnabled,
          goal_minutes: Number(goalMinutes),
          notifications,
          jlpt_target: jlptTarget,
        });
      }
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('⚠️ Are you absolutely sure? This action is IRREVERSIBLE and will permanently delete all your data.')) {
      setLoading(true);
      try {
        if (deleteAccount) {
          await deleteAccount();
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to delete account.');
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (e) {
      console.error(e);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } } };

  const themeOptions = [
    { key: 'dark' as const, label: 'Dark', icon: Moon },
    { key: 'light' as const, label: 'Light', icon: Sun },
    { key: 'system' as const, label: 'System', icon: Monitor },
  ];

  const studyTimes = [5, 10, 15, 20, 30];
  const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink flex items-center gap-2 font-heading">
          <Settings className="w-7 h-7 text-brand" /> Settings
        </h1>
        <p className="text-sm text-ink-muted">Manage your account and preferences</p>
      </motion.div>

      {/* Success / Error messages */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 font-semibold"
        >{success}</motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold"
        >{error}</motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <User className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink">Account</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-white border border-edge hover:border-edge-hover text-ink placeholder-ink-light text-sm rounded-xl h-24 p-4 transition-all outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={160}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Learning Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Globe className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink">Language & Learning</h2>
            </div>

            {/* JLPT Target */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest">JLPT Target</label>
              <div className="flex gap-2">
                {jlptLevels.map(l => (
                  <button key={l} type="button" onClick={() => setJlptTarget(l)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${jlptTarget === l ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-warm-soft text-ink-muted border border-edge hover:border-edge-hover'}`}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* Daily Study Time */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest">Daily Study Goal</label>
              <div className="flex gap-2">
                {studyTimes.map(t => (
                  <button key={t} type="button" onClick={() => setGoalMinutes(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${goalMinutes === t ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-warm-soft text-ink-muted border border-edge hover:border-edge-hover'}`}
                  >{t}m</button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Theme Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Moon className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink">Theme</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-widest">Appearance</label>
              <div className="flex gap-2">
                {themeOptions.map(t => (
                  <button key={t.key} type="button" onClick={() => setTheme(t.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${theme === t.key ? 'bg-brand/10 text-brand border border-brand/20' : 'bg-warm-soft text-ink-muted border border-edge hover:border-edge-hover'}`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications & Audio Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Bell className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink">Notifications & Audio</h2>
            </div>
            <Toggle
              checked={notifications}
              onChange={setNotifications}
              label="Push Notifications"
              description="Daily reminders to maintain your streak"
            />
            <Toggle
              checked={ttsEnabled}
              onChange={setTtsEnabled}
              label="Text-to-Speech"
              description="Audio pronunciation for vocabulary"
            />
          </Card>
        </motion.div>

        {/* Privacy Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Lock className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink">Privacy</h2>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Your data is encrypted and stored securely. We never share your personal information with third parties.
            </p>
          </Card>
        </motion.div>

        {/* Support Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <HelpCircle className="w-4 h-4 text-brand" />
              <h2 className="text-sm font-bold text-ink">Support</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Mail className="w-3.5 h-3.5" />
              <span>support@yamplelabs.com</span>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={item}>
          <Button
            type="submit"
            loading={loading}
            className="w-full btn btn-primary"
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Settings
          </Button>
        </motion.div>
      </form>

      {/* Logout */}
      <motion.div variants={item}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-ink-muted hover:text-ink hover:bg-warm-soft border border-edge hover:border-edge-hover transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-4 border-rose-500/10">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-500/10">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-rose-400">Danger Zone</h2>
          </div>
          <p className="text-xs text-ink-muted">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button
            variant="danger"
            onClick={handleDeleteAccount}
            loading={loading}
            className="btn btn-danger btn-sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account
          </Button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
