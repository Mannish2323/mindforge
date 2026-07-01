'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Settings, User, Lock, Volume2, ShieldAlert, Bell, Globe, 
  Trash2, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { profile, updateSettings, updateProfileDetails, deleteAccount } = useAuth();
  
  // Settings Form States
  const [displayName, setDisplayName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [goalMinutes, setGoalMinutes] = useState(profile?.goal_minutes || 10);
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(profile?.theme || 'dark');
  const [ttsEnabled, setTtsEnabled] = useState(profile?.tts_enabled ?? true);
  const [notifications, setNotifications] = useState(profile?.notifications ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSavePreferences = async (e: React.FormEvent) => {
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
          notifications
        });
      }

      setSuccess('Preferences saved successfully! Refreshing dashboard tokens...');
    } catch (err: any) {
      setError(err?.message || 'Failed to update preferences.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you absolutely sure you want to permanently delete your account? This action is irreversible.')) {
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

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
          Settings
        </h1>
        <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
          Manage your account profile, study parameters and layout configurations
        </p>
      </div>

      {/* Notifications feedback */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile Card details */}
        <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-6">
          <h3 className="text-sm font-extrabold text-white font-orbitron flex items-center gap-2 uppercase tracking-wider">
            <User className="w-4 h-4 text-sakura-dark" />
            <span>Profile Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="bg-white/[0.02]"
            />
            <Input
              label="Bio Details"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your Japanese target"
              className="bg-white/[0.02]"
            />
          </div>
        </div>

        {/* Study Preferences details */}
        <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-6">
          <h3 className="text-sm font-extrabold text-white font-orbitron flex items-center gap-2 uppercase tracking-wider">
            <Volume2 className="w-4 h-4 text-sakura-dark" />
            <span>Learning Preferences</span>
          </h3>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Goal selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">
                  Daily Goal Minutes
                </label>
                <select
                  value={goalMinutes}
                  onChange={(e) => setGoalMinutes(Number(e.target.value))}
                  className="w-full bg-[#0e0a1a] border border-white/5 hover:border-white/10 text-xs font-semibold text-purple-300/80 rounded-xl px-4 h-14 outline-none focus:border-brand-purple/60 transition-all appearance-none cursor-pointer"
                >
                  <option value={5}>5 Minutes / Day</option>
                  <option value={10}>10 Minutes / Day</option>
                  <option value={15}>15 Minutes / Day</option>
                  <option value={30}>30 Minutes / Day</option>
                </select>
              </div>

              {/* Theme selector */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">
                  Theme Option
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                  className="w-full bg-[#0e0a1a] border border-white/5 hover:border-white/10 text-xs font-semibold text-purple-300/80 rounded-xl px-4 h-14 outline-none focus:border-brand-purple/60 transition-all appearance-none cursor-pointer"
                >
                  <option value="dark">Dark Theme (Default)</option>
                  <option value="light">Light Theme</option>
                  <option value="system">System Preference</option>
                </select>
              </div>
            </div>

            {/* Toggle checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer select-none transition-all">
                <input
                  type="checkbox"
                  checked={ttsEnabled}
                  onChange={(e) => setTtsEnabled(e.target.checked)}
                  className="rounded border-purple-900/20 bg-[#0a0815] text-brand-purple focus:ring-brand-purple w-4.5 h-4.5"
                />
                <div>
                  <p className="text-xs font-bold text-white">Enable TTS Audio</p>
                  <p className="text-[9px] text-purple-300/40 font-semibold mt-0.5">Auto-speak vocabulary pronunciations</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-white/[0.01] border border-white/5 hover:border-white/10 rounded-2xl cursor-pointer select-none transition-all">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="rounded border-purple-900/20 bg-[#0a0815] text-brand-purple focus:ring-brand-purple w-4.5 h-4.5"
                />
                <div>
                  <p className="text-xs font-bold text-white">Enable Notifications</p>
                  <p className="text-[9px] text-purple-300/40 font-semibold mt-0.5">Daily reminder streaks freeze flags</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Danger zone actions card */}
        <div className="glass-card p-6 md:p-8 rounded-[28px] border border-rose-500/10 bg-rose-500/[0.01] space-y-6">
          <h3 className="text-sm font-extrabold text-rose-400 font-orbitron flex items-center gap-2 uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Danger Zone</span>
          </h3>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-xs font-bold text-white">Delete Learning Account</p>
              <p className="text-[10px] text-rose-400/50 font-semibold mt-0.5">Permanently delete metadata logs and billing</p>
            </div>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full sm:w-auto btn btn-danger btn-sm flex items-center justify-center gap-1.5 font-bold cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>

        {/* Save button row */}
        <div className="flex justify-end pt-4">
          <Button 
            type="submit"
            loading={loading}
            className="btn btn-primary font-bold cursor-pointer w-full sm:w-auto"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
