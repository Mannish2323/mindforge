'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck,
  Flame, Award, Zap, CheckCircle2, UserCheck, HelpCircle, BookOpen, Users
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { Mascot } from '@/components/mascot/Mascot';

export default function AuthPage() {
  const router = useRouter();
  const { user, profile, signInWithGoogle, loginWithEmail, resetPassword } = useAuth();

  // Mode: 'login' | 'forgot'
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  // Handlers
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      router.push('/home');
    } catch (err: any) {
      setError(err?.message || 'Invalid login credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setMessage('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google authentication failed.');
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setGuestLoading(true);
    setTimeout(() => {
      router.push('/home');
    }, 400);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address to receive reset instructions.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err: any) {
      setError(err?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex relative overflow-hidden font-sans">
      <SakuraParticles />

      {/* Background blurs (coral-pink / warm gradient) */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand/10 blur-[120px] pointer-events-none top-[-10%] left-[-10%]" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] pointer-events-none bottom-[-10%] right-[-10%]" />

      {/* Main Container */}
      <main className="w-full flex min-h-screen">
        
        {/* Left Column: Brand & Decorative (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative z-10">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-brand rounded-2xl p-1">
              <Logo size="md" glow={false} className="transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-wider text-ink group-hover:text-brand transition-colors">
                  MindForge
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink-light">
                  Yample Labs
                </span>
              </div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col justify-center max-w-xl mx-auto space-y-8"
          >
            <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.08] text-ink font-heading">
              Learn Japanese.{' '}
              <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent block mt-1">
                The fun way!
              </span>
            </h1>

            <div className="flex justify-center my-8">
              <Mascot expression="happy" size={200} animate />
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/50 border border-white/20 shadow-sm">
                <Users className="w-6 h-6 text-brand mb-2" />
                <span className="font-bold text-ink">10,000+</span>
                <span className="text-xs text-ink-muted">Learners</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/50 border border-white/20 shadow-sm">
                <Award className="w-6 h-6 text-accent mb-2" />
                <span className="font-bold text-ink">N5 to N1</span>
                <span className="text-xs text-ink-muted">JLPT Levels</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/50 border border-white/20 shadow-sm">
                <Sparkles className="w-6 h-6 text-brand mb-2" />
                <span className="font-bold text-ink">Free</span>
                <span className="text-xs text-ink-muted">To start</span>
              </div>
            </div>
          </motion.div>
          
          <div className="text-xs text-ink-light font-bold uppercase tracking-widest text-center">
             &copy; 2026 Yample Labs. All Rights Reserved.
          </div>
        </div>

        {/* Right Column: Auth Form */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 w-full relative z-20">
          
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="lg:hidden mb-8 flex justify-center w-full">
            <Link href="/" className="inline-flex items-center gap-3">
              <Logo size="md" glow={false} />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-wider text-ink">
                  MindForge
                </span>
              </div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={error ? { opacity: 1, y: 0, scale: 1, x: [-10, 10, -10, 10, 0] } : { opacity: 1, y: 0, scale: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[420px]"
          >
            {/* Card Body */}
            <div className="rounded-3xl p-8 border border-edge bg-card shadow-[var(--paper-shadow,0_10px_30px_rgba(0,0,0,0.05))] space-y-6">

              {/* Header */}
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  {mode === 'login' ? (
                    <Mascot expression="encouraging" size={64} animate />
                  ) : (
                    <Mascot expression="thinking" size={64} animate />
                  )}
                </div>
                <h2 className="text-2xl font-black text-ink font-heading">
                  {mode === 'login' ? 'Welcome back!' : 'Forgot Password?'}
                </h2>
                <p className="text-sm text-ink-muted">
                  {mode === 'login' 
                    ? 'Login to continue your learning journey' 
                    : "Enter your email and we'll send you a reset link."}
                </p>
              </div>

              {/* Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium"
                    role="alert"
                  >
                    {error}
                  </motion.div>
                )}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-mint-light border border-mint/30 text-ink text-sm rounded-xl font-medium"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Forms */}
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Google Sign In */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={googleLoading}
                      className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-card border border-edge text-ink font-bold text-sm transition-all hover:bg-warm focus:outline-none focus:ring-2 focus:ring-brand/30 mb-6"
                    >
                      {googleLoading ? (
                        <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                      )}
                      <span>Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center mb-6">
                      <div className="flex-grow border-t border-edge" />
                      <span className="px-3 text-xs text-ink-light font-medium">
                        — or —
                      </span>
                      <div className="flex-grow border-t border-edge" />
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
                      <div className="space-y-1.5">
                        <label htmlFor="email-input" className="block text-sm font-semibold text-ink pl-1">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            id="email-input"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 h-14 rounded-2xl bg-card border border-edge text-sm text-ink placeholder-ink-light focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between pl-1">
                          <label htmlFor="password-input" className="block text-sm font-semibold text-ink">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => { setError(''); setMode('forgot'); }}
                            className="text-xs font-semibold text-brand hover:text-brand/80 transition-colors focus:outline-none"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            id="password-input"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full pl-4 pr-12 h-14 rounded-2xl bg-card border border-edge text-sm text-ink placeholder-ink-light focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink-light hover:text-ink transition-colors focus:outline-none"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-brand text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand/40 mt-6"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Log In'
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center space-y-4">
                      <div>
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          className="text-sm text-ink-muted underline font-medium hover:text-ink transition-colors"
                        >
                          Browse as guest
                        </button>
                      </div>
                      <p className="text-sm text-ink-muted font-medium">
                        Don&apos;t have an account?{' '}
                        <Link href="/onboarding" className="font-bold text-brand hover:underline transition-colors">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="reset-email" className="block text-sm font-semibold text-ink pl-1">
                          Email Address
                        </label>
                        <input
                          id="reset-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-4 h-14 rounded-2xl bg-card border border-edge text-sm text-ink placeholder-ink-light focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 rounded-2xl bg-brand text-white font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand/40 mt-6"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          'Send Reset Link'
                        )}
                      </button>

                      <div className="mt-6 text-center">
                        <button
                          type="button"
                          onClick={() => { setError(''); setMessage(''); setMode('login'); }}
                          className="text-sm font-semibold text-brand hover:text-brand/80 transition-colors focus:outline-none"
                        >
                          Back to Login
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
