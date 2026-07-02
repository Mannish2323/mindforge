'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import {
  Settings, User, Volume2, Bell, Globe, Trash2,
  Clock, Moon, Sun, Monitor, Shield, Save, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { profile, updateSettings, updateProfileDetails, deleteAccount } = useAuth();

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

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

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
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-brand-light" /> Settings
        </h1>
        <p className="text-sm text-purple-300/45">Manage your account and preferences</p>
      </motion.div>

      {/* Success / Error messages */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold"
        >{success}</motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold"
        >{error}</motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-5">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-brand-light" />
              <h2 className="text-sm font-bold text-white">Account</h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
              />
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#0a0815] border border-purple-900/20 hover:border-purple-800/40 text-white placeholder-purple-300/20 text-sm rounded-xl h-24 p-4 transition-all outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/20 resize-none"
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
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-light" />
              <h2 className="text-sm font-bold text-white">Learning</h2>
            </div>

            {/* JLPT Target */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">JLPT Target</label>
              <div className="flex gap-2">
                {jlptLevels.map(l => (
                  <button key={l} type="button" onClick={() => setJlptTarget(l)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${jlptTarget === l ? 'bg-neon-purple/20 text-white border border-neon-purple/30' : 'bg-white/[0.03] text-purple-300/50 border border-white/[0.06] hover:border-white/10'}`}
                  >{l}</button>
                ))}
              </div>
            </div>

            {/* Daily Study Time */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">Daily Study Goal</label>
              <div className="flex gap-2">
                {studyTimes.map(t => (
                  <button key={t} type="button" onClick={() => setGoalMinutes(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${goalMinutes === t ? 'bg-neon-purple/20 text-white border border-neon-purple/30' : 'bg-white/[0.03] text-purple-300/50 border border-white/[0.06] hover:border-white/10'}`}
                  >{t}m</button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appearance Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-5">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-brand-light" />
              <h2 className="text-sm font-bold text-white">Appearance</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">Theme</label>
              <div className="flex gap-2">
                {themeOptions.map(t => (
                  <button key={t.key} type="button" onClick={() => setTheme(t.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${theme === t.key ? 'bg-neon-purple/20 text-white border border-neon-purple/30' : 'bg-white/[0.03] text-purple-300/50 border border-white/[0.06] hover:border-white/10'}`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={item}>
          <Card variant="glass" padding="md" className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-light" />
              <h2 className="text-sm font-bold text-white">Notifications & Audio</h2>
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

      {/* Danger Zone */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-4 border-rose-500/10">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold text-rose-400">Danger Zone</h2>
          </div>
          <p className="text-xs text-purple-300/40">
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
