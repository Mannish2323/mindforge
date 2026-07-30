'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck,
  Flame, Award, Zap, CheckCircle2, UserCheck, HelpCircle
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { SakuraParticles } from '@/components/animations/SakuraParticles';

export default function AuthPage() {
  const router = useRouter();
  const { user, profile, signInWithGoogle, loginWithEmail, resetPassword } = useAuth();

  // Dynamic preview or real statistics
  const displayStreak = user && profile ? `${profile.streak} Days` : 'Start your streak';
  const displayLevel = user && profile ? `Level ${profile.level}` : 'Begins after 1st lesson';
  const displayXp = user && profile ? `${profile.xp.toLocaleString()} XP` : '0 XP';
  const displayRank = user && profile ? `JLPT ${profile.jlpt_target}` : 'Not Started';

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
    // Instant smooth navigation to main app for guest preview
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen min-h-[100dvh] bg-[#07050D] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-neon-pink selection:text-white"
    >
      {/* 🌸 Floating Sakura Petals Engine */}
      <SakuraParticles />

      {/* 🔮 Multi-layered Ambient Glow System */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-pink/10 blur-[150px] pointer-events-none top-[-10%] left-[-10%] animate-pulse-glow" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-accent-magenta/15 to-indigo-600/10 blur-[160px] pointer-events-none bottom-[-10%] right-[-10%]" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-pink-500/10 blur-[130px] pointer-events-none top-[35%] left-[30%]" />

      {/* 🗻 Subtle Mount Fuji & Torii Silhouette Backdrop */}
      <div className="absolute inset-x-0 bottom-0 h-64 pointer-events-none opacity-20 z-0 flex items-end justify-between px-8 md:px-20 overflow-hidden">
        {/* Torii Gate SVG Minimal Accent */}
        <div className="hidden sm:block text-neon-purple/30 mb-4">
          <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
            <path d="M10 20 H90 V26 H10 Z M15 15 H85 V20 H15 Z M30 26 V85 H38 V26 Z M62 26 V85 H70 V26 Z M20 40 H80 V45 H20 Z" />
          </svg>
        </div>
        {/* Mount Fuji Vector */}
        <div className="w-[500px] h-[180px] bg-gradient-to-t from-neon-purple/20 via-purple-900/10 to-transparent clip-fuji mx-auto rounded-t-full blur-[2px]" />
      </div>

      {/* ── Top Header Navigation Bar ──────────────────────────────────────── */}
      <header className="w-full flex items-center justify-between px-6 md:px-12 py-6 z-20 max-w-7xl mx-auto">
        <Link href="/home" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-neon-purple rounded-2xl p-1">
          <Logo size="md" glow={true} className="transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-orbitron font-extrabold text-lg tracking-wider text-white group-hover:text-glow-pink transition-colors">
              MindForge
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-300/40">
              Yample Labs
            </span>
          </div>
        </Link>

        {/* Top Right Quick Badges */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-xs font-bold text-amber-400 shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-amber-400 animate-bounce" />
            <span>Streak Mode Ready</span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-xs font-bold text-neon-pink shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-neon-pink" />
            <span>JLPT N5-N1</span>
          </div>
        </div>
      </header>

      {/* ── Main Interactive Section ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 px-6 py-6 z-10 max-w-7xl mx-auto w-full">

        {/* ── Left Column: Hero & Brand Tagline ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 max-w-xl space-y-8 text-center lg:text-left"
        >
          <div className="space-y-4">
            {/* Animated Japanese Greeting */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-purple/15 to-neon-pink/15 border border-neon-purple/25 backdrop-blur-xl text-xs font-bold text-brand-light shadow-[0_0_20px_rgba(109,60,255,0.2)]"
            >
              <Sparkles className="w-4 h-4 text-neon-pink animate-spin-slow" />
              <span className="font-japanese text-sm font-extrabold text-white">こんにちは</span>
              <span className="animate-wave inline-block">👋</span>
              <span className="text-purple-300/60 font-medium">| Welcome Back</span>
            </motion.div>

            {/* Main Headline & Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white font-orbitron">
              Master Japanese.{' '}
              <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(109,60,255,0.3)] block mt-1">
                Shape Your Future.
              </span>
            </h1>

            <p className="text-purple-200/50 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
              Join thousands of learners mastering Japanese effortlessly with real-time AI conversation, spaced repetition flashcards, and native audio practice.
            </p>
          </div>

          {/* 🏅 Interactive Floating Live Status Preview / Preview Mode State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl grid grid-cols-3 gap-3 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Streak Preview / Real Streak */}
            <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span className="text-xs font-extrabold font-orbitron">{displayStreak}</span>
              </div>
              <span className="text-[10px] text-purple-300/40 font-bold uppercase tracking-wider">
                {user ? 'Active Streak' : 'Streak Mode'}
              </span>
            </div>

            {/* Level Badge / Preview Level */}
            <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-neon-pink mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xs font-extrabold font-orbitron">{displayLevel}</span>
              </div>
              <span className="text-[10px] text-purple-300/40 font-bold uppercase tracking-wider">
                {user ? displayRank : 'JLPT Rank'}
              </span>
            </div>

            {/* XP Progress / Preview XP */}
            <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                <Zap className="w-4 h-4 fill-emerald-400" />
                <span className="text-xs font-extrabold font-orbitron">{displayXp}</span>
              </div>
              <span className="text-[10px] text-purple-300/40 font-bold uppercase tracking-wider">
                {user ? 'Mastery XP' : 'Earn Progress'}
              </span>
            </div>
          </motion.div>

          {/* Social Proof */}
          <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-purple-300/40 font-medium pt-1">
            <div className="flex -space-x-2 overflow-hidden">
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#07050D] bg-purple-600/60 flex items-center justify-center text-[10px] font-bold text-white">🌸</div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#07050D] bg-pink-600/60 flex items-center justify-center text-[10px] font-bold text-white">⚡</div>
              <div className="inline-block h-7 w-7 rounded-full ring-2 ring-[#07050D] bg-indigo-600/60 flex items-center justify-center text-[10px] font-bold text-white">⛩️</div>
            </div>
            <span>Master Japanese with AI conversation, SRS flashcards & JLPT curriculum</span>
          </div>
        </motion.div>

        {/* ── Right Column: Award-Winning Floating Glassmorphism Auth Card ──── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] relative z-20"
        >
          {/* Animated Gradient Edge Aura */}
          <div className="absolute -inset-[1px] bg-gradient-to-br from-neon-purple via-neon-pink to-accent-magenta rounded-[32px] opacity-30 blur-md pointer-events-none animate-pulse-glow" />

          {/* Card Body */}
          <div className="relative rounded-[32px] p-8 sm:p-10 border border-white/[0.12] bg-[#0E0B1A]/85 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] space-y-7">

            {/* Card Mode Toggle / Title Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-extrabold text-white tracking-tight font-orbitron">
                {mode === 'login' ? 'Welcome Back' : 'Reset Password'}
              </h2>
              <p className="text-xs text-purple-300/50 font-medium">
                {mode === 'login'
                  ? 'Sign in to sync your Japanese lessons & streak'
                  : 'Enter your email to receive recovery instructions'}
              </p>
            </div>

            {/* Error Message Box */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 font-semibold flex items-center gap-2.5"
                  role="alert"
                >
                  <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span className="flex-1">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message Box */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-semibold flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="flex-1">{message}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Section */}
            {mode === 'login' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4" noValidate>
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label htmlFor="email-input" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300/60 pl-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/40 group-focus-within:text-neon-pink transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full pl-11 pr-4 h-13 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-purple-300/25 focus:bg-white/[0.06] focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30 outline-none transition-all font-medium"
                      aria-label="Email Address"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between pl-1">
                    <label htmlFor="password-input" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300/60">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setError(''); setMode('forgot'); }}
                      className="text-xs font-semibold text-brand-light hover:text-neon-pink transition-colors focus:outline-none focus:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/40 group-focus-within:text-neon-pink transition-colors">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-12 h-13 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-purple-300/25 focus:bg-white/[0.06] focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30 outline-none transition-all font-medium"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300/40 hover:text-white transition-colors focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-purple-300/70 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md border-white/20 bg-white/5 text-neon-purple focus:ring-neon-purple/30 focus:ring-offset-0 cursor-pointer accent-purple-600"
                    />
                    <span>Remember me on this device</span>
                  </label>
                </div>

                {/* Primary Email Login Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.015, boxShadow: '0 10px 30px rgba(109,60,255,0.4)' }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full h-13 rounded-2xl bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta text-white font-extrabold text-sm tracking-wide shadow-[0_6px_25px_rgba(109,60,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-neon-purple/80"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <span>Sign In with Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="reset-email" className="block text-[11px] font-bold uppercase tracking-wider text-purple-300/60 pl-1">
                    Your Registered Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300/40 group-focus-within:text-neon-pink transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      className="w-full pl-11 pr-4 h-13 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder-purple-300/25 focus:bg-white/[0.06] focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full h-13 rounded-2xl bg-neon-purple text-white font-extrabold text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-neon-purple/80"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Send Reset Email</span>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => { setError(''); setMessage(''); setMode('login'); }}
                  className="w-full text-center text-xs font-semibold text-purple-300/60 hover:text-white transition-colors pt-2 focus:outline-none focus:underline"
                >
                  ← Back to Login
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/[0.08]" />
              <span className="px-3 text-[10px] font-bold text-purple-300/30 uppercase tracking-widest">
                or continue with
              </span>
              <div className="flex-grow border-t border-white/[0.08]" />
            </div>

            {/* OAuth Provider Button (Google Only) */}
            <div className="w-full">
              {/* Google Login */}
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                whileHover={{ scale: 1.015, backgroundColor: 'rgba(255,255,255,0.06)' }}
                whileTap={{ scale: 0.985 }}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white font-bold text-xs transition-all cursor-pointer disabled:opacity-50 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-neon-purple/60"
                aria-label="Sign in with Google"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            </div>

            {/* Guest Entry Accent Button */}
            <motion.button
              type="button"
              onClick={handleGuestLogin}
              disabled={guestLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full h-11 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-purple-300/70 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {guestLoading ? (
                <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-neon-pink" />
                  <span>Continue as Guest</span>
                </>
              )}
            </motion.button>

            {/* Bottom Terms & Security Compliance */}
            <div className="pt-2 border-t border-white/[0.04] text-center space-y-2">
              <p className="text-[11px] text-purple-300/30 leading-relaxed font-medium">
                By continuing, you agree to our{' '}
                <Link href="/terms" className="text-brand-light hover:text-neon-pink transition-colors underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-light hover:text-neon-pink transition-colors underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-purple-300/20 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Encrypted Session</span>
              </div>
            </div>

          </div>
        </motion.div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="w-full text-center py-5 z-20 text-[10px] text-purple-300/20 font-bold uppercase tracking-widest px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/[0.04]">
        <span>&copy; 2026 Yample Labs. All Rights Reserved.</span>
        <div className="flex items-center gap-4 text-purple-300/30">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </footer>
    </motion.div>
  );
}
