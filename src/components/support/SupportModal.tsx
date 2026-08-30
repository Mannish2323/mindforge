'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE_CONFIG } from '@/config/site';
import { Mail, Send, CheckCircle2, X, MessageSquare, AlertCircle, Sparkles, ExternalLink, Instagram } from 'lucide-react';
import { MFButton } from '@/components/ui/MFButton';
import { useAuth } from '@/app/context/AuthContext';
import { createBrowserClient } from '@supabase/ssr';

export interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'support' | 'bug' | 'feedback';
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'support',
}) => {
  const { user, profile } = useAuth();
  const [type, setType] = useState<'support' | 'bug' | 'feedback'>(defaultType);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // 1. Log to activity_logs table for audit trail
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const sb = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );
        await sb.from('activity_logs').insert({
          user_id: user?.id || null,
          action: `feedback_${type}`,
          metadata: {
            type,
            subject: subject || `${type.toUpperCase()} from ${profile?.name || user?.email || 'User'}`,
            message,
            email: user?.email || profile?.email || 'guest',
            created_at: new Date().toISOString(),
          },
        });
      }

      // 2. Prepare mailto fallback link for immediate email delivery to official support email
      const prefix =
        type === 'bug'
          ? SITE_CONFIG.support.reportSubjectPrefix
          : type === 'feedback'
          ? SITE_CONFIG.support.feedbackSubjectPrefix
          : SITE_CONFIG.support.subjectPrefix;

      const finalSubject = encodeURIComponent(`${prefix} ${subject || 'User Inquiry'}`);
      const finalBody = encodeURIComponent(
        `Type: ${type}\nUser: ${profile?.name || user?.email || 'Anonymous'}\nUser ID: ${user?.id || 'N/A'}\n\nMessage:\n${message}`
      );

      const mailtoUrl = `mailto:${SITE_CONFIG.support.email}?subject=${finalSubject}&body=${finalBody}`;
      window.open(mailtoUrl, '_blank');

      setSent(true);
      setTimeout(() => {
        setSent(false);
        setMessage('');
        setSubject('');
        onClose();
      }, 2500);
    } catch (err) {
      console.warn('Feedback log warning:', err);
      setSent(true);
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            className="relative w-full max-w-lg bg-card dark:bg-card rounded-3xl p-6 sm:p-7 border-[2px] border-edge dark:border-edge shadow-2xl z-10 space-y-4"
          >
            <div className="washi-tape-pink" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-ink-muted hover:text-ink dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light dark:bg-brand-light text-brand text-xs font-extrabold border border-brand/30 dark:border-brand/30 mb-2">
                <Mail className="w-3.5 h-3.5" />
                <span>Yample Labs Support</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-ink dark:text-ink">
                How Can We Help You?
              </h3>
              <p className="text-xs text-ink-muted dark:text-ink-muted mt-0.5">
                Official support email: <strong>{SITE_CONFIG.support.email}</strong> • Responds {SITE_CONFIG.support.responseTime}
              </p>
            </div>

            {/* Type selector tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-cream dark:bg-card border border-edge dark:border-edge">
              {[
                { key: 'support' as const, label: 'Support', icon: MessageSquare },
                { key: 'bug' as const, label: 'Report Bug', icon: AlertCircle },
                { key: 'feedback' as const, label: 'Feedback', icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setType(tab.key)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    type === tab.key
                      ? 'bg-white dark:bg-card-subtle text-brand shadow-sm border border-edge dark:border-edge'
                      : 'text-ink-muted dark:text-ink-muted hover:text-ink'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 text-center space-y-2 rounded-2xl bg-mint-light dark:bg-mint-light border border-mint text-[#087F5B] dark:text-mint"
              >
                <CheckCircle2 className="w-10 h-10 mx-auto text-mint" />
                <h4 className="font-heading font-extrabold text-base">Message Ready & Dispatched!</h4>
                <p className="text-xs">
                  We have logged your request. Our engineering team at Yample Labs will review and follow up with you.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-ink-muted dark:text-ink-muted mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      type === 'bug'
                        ? 'e.g., Lesson audio is not playing on JLPT N5'
                        : type === 'feedback'
                        ? 'e.g., Suggestion for Kanji stroke quiz'
                        : 'e.g., Question about my subscription'
                    }
                    className="w-full h-11 px-3.5 rounded-xl bg-card border border-edge dark:border-edge text-xs text-ink dark:text-ink focus:outline-none focus:border-brand"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-ink-muted dark:text-ink-muted mb-1">
                    Description & Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide as much detail as possible so our team can assist you immediately..."
                    className="w-full p-3.5 rounded-xl bg-card border border-edge dark:border-edge text-xs text-ink dark:text-ink focus:outline-none focus:border-brand resize-none"
                  />
                </div>

                {/* Social community handles */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-cream dark:bg-card border border-edge dark:border-edge text-xs">
                  <span className="font-bold text-ink-muted dark:text-ink-muted">Connect on Instagram:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={SITE_CONFIG.social.instagramPersonal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-brand hover:underline"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>@{SITE_CONFIG.social.instagramPersonal.handle}</span>
                    </a>
                    <span className="text-ink-light">|</span>
                    <a
                      href={SITE_CONFIG.social.instagramBrand.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-lavender hover:underline"
                    >
                      <span>@{SITE_CONFIG.social.instagramBrand.handle}</span>
                    </a>
                  </div>
                </div>

                <div className="pt-1">
                  <MFButton
                    variant="primary"
                    size="md"
                    className="w-full"
                    type="submit"
                    isLoading={loading}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Send to Yample Labs
                  </MFButton>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
