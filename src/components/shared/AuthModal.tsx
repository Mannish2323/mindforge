'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Flame, Shield, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/ui/Logo';

interface AuthModalState {
  open: boolean;
  feature?: string;
  title?: string;
  message?: string;
  returnUrl?: string;
}

interface AuthModalContextType {
  openAuthModal: (opts?: Omit<AuthModalState, 'open'>) => void;
  closeAuthModal: () => void;
  requireAuth: (action: () => void, featureName?: string) => void;
}

const AuthModalContext = createContext<AuthModalContextType>({
  openAuthModal: () => {},
  closeAuthModal: () => {},
  requireAuth: () => {},
});

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<AuthModalState>({ open: false });

  const openAuthModal = useCallback((opts?: Omit<AuthModalState, 'open'>) => {
    setState({
      open: true,
      feature: opts?.feature,
      title: opts?.title || 'Sign in to continue',
      message:
        opts?.message ||
        'Create your free Mindforge account to save your progress, unlock AI learning, track your streak, and access all learning features.',
      returnUrl: opts?.returnUrl,
    });
  }, []);

  const closeAuthModal = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const requireAuth = useCallback(
    (action: () => void, featureName?: string) => {
      if (user) {
        action();
      } else {
        openAuthModal({ feature: featureName });
      }
    },
    [user, openAuthModal]
  );

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal, requireAuth }}>
      {children}
      <AuthModalModal state={state} onClose={closeAuthModal} />
    </AuthModalContext.Provider>
  );
}

function AuthModalModal({
  state,
  onClose,
}: {
  state: AuthModalState;
  onClose: () => void;
}) {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.open) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.open, onClose]);

  const handleGoogleClick = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google Sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleEmailClick = () => {
    onClose();
    const dest = state.returnUrl ? `/auth?next=${encodeURIComponent(state.returnUrl)}` : '/auth';
    router.push(dest);
  };

  const titleText = state.title || 'Sign in to continue';
  const messageText =
    state.message ||
    'Create your free Mindforge account to save your progress, unlock AI learning, track your streak, and access all learning features.';

  return (
    <AnimatePresence>
      {state.open && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[250]"
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            aria-describedby="auth-modal-description"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white border border-edge rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-[251] space-y-6 overflow-hidden focus:outline-none"
            tabIndex={-1}
          >
            {/* Subtle bg decoration */}
            <div className="absolute w-[200px] h-[200px] rounded-full bg-sakura-light/40 blur-[80px] pointer-events-none top-[-10%] right-[-10%]" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-warm-soft border border-edge hover:bg-warm-cream text-ink-muted hover:text-ink flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-brand/30 cursor-pointer"
              aria-label="Close authentication modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Logo */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="p-3 rounded-2xl bg-warm-soft border border-edge flex items-center justify-center">
                <Logo size="md" glow={false} />
              </div>

              {state.feature && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/8 border border-brand/15 text-[11px] font-extrabold text-brand uppercase tracking-wider">
                  <Lock className="w-3 h-3" />
                  <span>{state.feature}</span>
                </div>
              )}

              <h2 id="auth-modal-title" className="text-2xl font-extrabold text-ink tracking-tight font-heading">
                {titleText}
              </h2>

              <p id="auth-modal-description" className="text-sm text-ink-muted font-medium leading-relaxed max-w-xs">
                {messageText}
              </p>
            </div>

            {/* Feature Perks */}
            <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-warm-soft border border-edge">
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
                <CheckCircle2 className="w-4 h-4 text-cat-green flex-shrink-0" />
                <span>Save Progress</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
                <Sparkles className="w-4 h-4 text-sakura-dark flex-shrink-0" />
                <span>Sakura AI Tutor</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
                <Flame className="w-4 h-4 text-cat-orange flex-shrink-0" />
                <span>Track Streak</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink-secondary">
                <Shield className="w-4 h-4 text-cat-blue flex-shrink-0" />
                <span>100% Free Account</span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold text-center">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-1">
              {/* Google */}
              <motion.button
                type="button"
                onClick={handleGoogleClick}
                disabled={googleLoading}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full h-12 rounded-2xl bg-white border border-edge text-ink font-bold text-sm hover:border-edge-hover hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                )}
                <span>Continue with Google</span>
              </motion.button>

              {/* Email */}
              <motion.button
                type="button"
                onClick={handleEmailClick}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-brand to-accent text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(109,60,255,0.2)] cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                <span>Continue with Email</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Not Now */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl text-sm font-semibold text-ink-muted hover:text-ink hover:bg-warm-soft transition-colors focus:outline-none cursor-pointer"
              >
                Not Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
