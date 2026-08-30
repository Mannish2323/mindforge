'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from 'next-themes';
import {
  Settings, User, Volume2, Bell, Globe, Trash2,
  Clock, Moon, Sun, Monitor, Shield, Save, AlertTriangle,
  LogOut, HelpCircle, Lock, Mail, MessageSquare, AlertCircle, Sparkles, ExternalLink, Instagram
} from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';
import { Toggle } from '@/components/ui/Toggle';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SITE_CONFIG } from '@/config/site';
import { SupportModal } from '@/components/support/SupportModal';

export default function SettingsPage() {
  const { profile, updateSettings, updateProfileDetails, deleteAccount, logout } = useAuth();
  const { theme: activeTheme, setTheme: setNextTheme } = useTheme();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [goalMinutes, setGoalMinutes] = useState(profile?.goal_minutes || 10);
  const [theme, setThemeState] = useState<'dark' | 'light' | 'system'>(
    (profile?.theme as any) || 'system'
  );
  const [ttsEnabled, setTtsEnabled] = useState(profile?.tts_enabled ?? true);
  const [notifications, setNotifications] = useState(profile?.notifications ?? true);
  const [jlptTarget, setJlptTarget] = useState(profile?.jlpt_target || 'N5');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportType, setSupportType] = useState<'support' | 'bug' | 'feedback'>('support');

  useEffect(() => {
    if (activeTheme) {
      setThemeState(activeTheme as any);
    }
  }, [activeTheme]);

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setThemeState(newTheme);
    setNextTheme(newTheme);
  };

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
    if (window.confirm('Are you absolutely sure? This action will permanently delete all your data.')) {
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

  const openSupport = (type: 'support' | 'bug' | 'feedback') => {
    setSupportType(type);
    setSupportModalOpen(true);
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 14 } } };

  const themeOptions = [
    { key: 'light' as const, label: 'Light', icon: Sun },
    { key: 'dark' as const, label: 'Dark', icon: Moon },
    { key: 'system' as const, label: 'System', icon: Monitor },
  ];

  const studyTimes = [5, 10, 15, 20, 30];
  const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header */}
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink flex items-center gap-2 font-heading">
          <MFIcon name="settings" size={28} className="text-brand" /> Settings & Preferences
        </h1>
        <p className="text-sm text-ink-muted">
          Customize your study experience, theme mode, and account preferences
        </p>
      </motion.div>

      {/* Success / Error messages */}
      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-mint-light border border-mint text-xs text-mint font-bold"
        >{success}</motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-2xl bg-coral-light border border-coral text-xs text-coral font-bold"
        >{error}</motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Account Section */}
        <motion.div variants={item}>
          <MFCard variant="paper" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <MFIcon name="profile" size={16} className="text-brand" />
              <h2 className="font-heading font-extrabold text-sm text-ink">Account Profile</h2>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-extrabold text-ink-muted uppercase tracking-wider mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-card border border-edge text-xs font-semibold text-ink focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-ink-muted uppercase tracking-wider mb-1">
                  Bio / Learning Goal
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  maxLength={160}
                  className="w-full p-3.5 rounded-xl bg-card border border-edge text-xs font-semibold text-ink focus:outline-none focus:border-brand resize-none"
                  placeholder="e.g. Aiming for JLPT N4 this December!"
                />
              </div>
            </div>
          </MFCard>
        </motion.div>

        {/* Theme Section (Dark Mode System) */}
        <motion.div variants={item}>
          <MFCard variant="paper" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Moon className="w-4 h-4 text-brand" />
              <h2 className="font-heading font-extrabold text-sm text-ink">Theme & Appearance</h2>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-ink-muted uppercase tracking-wider">
                Select Theme (Instant Live Switch)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {themeOptions.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => handleThemeChange(t.key)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                      theme === t.key
                        ? 'bg-brand-light text-brand border-2 border-brand shadow-sm'
                        : 'bg-cream text-ink-muted border border-edge hover:border-brand'
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </MFCard>
        </motion.div>

        {/* Learning Targets Section */}
        <motion.div variants={item}>
          <MFCard variant="paper" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Globe className="w-4 h-4 text-brand" />
              <h2 className="font-heading font-extrabold text-sm text-ink">JLPT Level & Target</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-extrabold text-ink-muted uppercase tracking-wider mb-1.5">
                  Target Proficiency
                </label>
                <div className="flex gap-2">
                  {jlptLevels.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setJlptTarget(l)}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        jlptTarget === l
                          ? 'bg-brand-light text-brand border border-brand'
                          : 'bg-cream text-ink-muted border border-edge'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-ink-muted uppercase tracking-wider mb-1.5">
                  Daily Study Goal (Minutes)
                </label>
                <div className="flex gap-2">
                  {studyTimes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setGoalMinutes(t)}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        goalMinutes === t
                          ? 'bg-brand-light text-brand border border-brand'
                          : 'bg-cream text-ink-muted border border-edge'
                      }`}
                    >
                      {t}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </MFCard>
        </motion.div>

        {/* Audio & Notifications */}
        <motion.div variants={item}>
          <MFCard variant="paper" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <Volume2 className="w-4 h-4 text-brand" />
              <h2 className="font-heading font-extrabold text-sm text-ink">Audio & Speech</h2>
            </div>
            <Toggle
              checked={ttsEnabled}
              onChange={setTtsEnabled}
              label="Native Audio Pronunciation"
              description="Play authentic Japanese pronunciation on Kanji and Vocabulary flashcards"
            />
            <Toggle
              checked={notifications}
              onChange={setNotifications}
              label="Daily Study Reminders"
              description="Notifications to protect your daily study streak"
            />
          </MFCard>
        </motion.div>

        {/* Support & Community Section */}
        <motion.div variants={item}>
          <MFCard variant="cream" padding="md" className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-edge">
              <HelpCircle className="w-4 h-4 text-brand" />
              <h2 className="font-heading font-extrabold text-sm text-ink">Support & Community</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => openSupport('support')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-edge text-xs font-bold text-ink hover:border-brand transition-all cursor-pointer shadow-sm"
              >
                <Mail className="w-4 h-4 text-brand" />
                <span>Contact Support</span>
              </button>

              <button
                type="button"
                onClick={() => openSupport('bug')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-edge text-xs font-bold text-ink hover:border-brand transition-all cursor-pointer shadow-sm"
              >
                <AlertCircle className="w-4 h-4 text-orange" />
                <span>Report Problem</span>
              </button>

              <button
                type="button"
                onClick={() => openSupport('feedback')}
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-edge text-xs font-bold text-ink hover:border-brand transition-all cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-lavender" />
                <span>Send Feedback</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card/80 dark:bg-card border border-edge text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand" />
                <span className="font-bold text-ink-muted">Support:</span>
                <span className="font-bold text-ink">{SITE_CONFIG.support.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={SITE_CONFIG.social.instagramPersonal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-extrabold text-brand hover:underline"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@{SITE_CONFIG.social.instagramPersonal.handle}</span>
                </a>
                <span className="text-ink-light">|</span>
                <a
                  href={SITE_CONFIG.social.instagramBrand.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-extrabold text-lavender hover:underline"
                >
                  <span>@{SITE_CONFIG.social.instagramBrand.handle}</span>
                </a>
              </div>
            </div>
          </MFCard>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={item}>
          <MFButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Preferences
          </MFButton>
        </motion.div>
      </form>

      {/* Logout & Danger Zone */}
      <motion.div variants={item} className="space-y-4 pt-2">
        <MFButton
          variant="secondary"
          size="md"
          className="w-full"
          onClick={handleLogout}
          leftIcon={<LogOut className="w-4 h-4" />}
        >
          Sign Out of MindForge
        </MFButton>

        <div className="p-4 rounded-2xl bg-coral-light border border-coral flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-extrabold text-coral">Delete Account</p>
            <p className="text-ink-muted dark:text-ink-muted">Permanently delete all study data and records</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl bg-brand text-white font-extrabold hover:bg-brand-hover transition-colors cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </motion.div>

      {/* Support Modal */}
      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
        defaultType={supportType}
      />
    </motion.div>
  );
}
