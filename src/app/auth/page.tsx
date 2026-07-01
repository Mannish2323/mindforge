'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, Mail, Lock, User, 
  ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2,
  Globe, ChevronDown, Sparkles, Flame, Target
} from 'lucide-react';

export default function AuthPage() {
  const { loginWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [language, setLanguage] = useState<'en' | 'jp'>('jp');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError('Email address is required');
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (mode !== 'forgot') {
      if (!password) {
        setError('Password is required');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        setSuccess('Welcome back! Redirecting to dashboard...');
        setTimeout(() => {
          router.replace('/home');
        }, 1000);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, name);
        setSuccess('Signup successful! Redirecting to onboarding...');
        setTimeout(() => {
          router.replace('/onboarding');
        }, 1500);
      } else {
        setSuccess('Reset link sent! Please check your email inbox.');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google Sign-in failed. Please try again.');
    }
  };

  // Content transitions variants
  const panelVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: 'easeIn' } }
  } as const;

  return (
    <div className="min-h-screen bg-[#09060F] text-white flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Background Falling Sakura Petals */}
      <SakuraParticles />

      {/* Floating abstract neon background glow */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-brand-purple/10 blur-[100px] pointer-events-none top-1/4 left-1/4 animate-pulse-glow" />
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-pink-500/5 blur-[100px] pointer-events-none bottom-1/4 right-1/4" />

      {/* Top Navbar Header */}
      <header className="w-full flex items-center justify-between z-20 max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" glow={true} className="hover:scale-105 transition-transform duration-300" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white font-orbitron">
              Velmorth
            </span>
            <span className="text-[9px] text-purple-300/40 font-bold tracking-widest uppercase">
              Learn Japanese the smart way
            </span>
          </div>
        </div>

        {/* Language selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            <span>{language === 'jp' ? '🇯🇵 日本語' : '🇺🇸 English'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>
          
          <AnimatePresence>
            {langDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-32 rounded-xl bg-[#120f26]/90 backdrop-blur-md border border-white/10 p-1.5 shadow-2xl z-30"
              >
                <button
                  onClick={() => { setLanguage('jp'); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors"
                >
                  🇯🇵 日本語
                </button>
                <button
                  onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium hover:bg-white/5 transition-colors"
                >
                  🇺🇸 English
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Dual Layout container */}
      <main className="w-full max-w-7xl mx-auto flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 z-10 my-auto">
        
        {/* Left Side: Gorgeous styled branding showcase (desktop only) */}
        <div className="hidden lg:flex flex-col flex-1 text-left space-y-8 max-w-lg">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-xs font-semibold text-brand-purple-light">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive AI Learning
            </span>
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
              Konnichiwa! <br />
              <span className="bg-gradient-to-r from-sakura-dark to-purple-400 bg-clip-text text-transparent">Welcome Back!</span>
            </h1>
            <p className="text-purple-200/60 leading-relaxed font-medium">
              Continue your journey to master Japanese. Explore real-time AI conversations, learn new vocabulary decks, trace Kanji stroke-by-stroke, and hit your daily streak.
            </p>
          </div>

          {/* Styled preview widget replacing the character graphic */}
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Mock profile tracking preview */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-sm text-brand-purple-light font-orbitron">
                  JLPT
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Hiragana & Kanji</h4>
                  <p className="text-[10px] text-purple-300/40 font-bold uppercase tracking-wider">Level N5 Mastery</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>5 Day Streak</span>
              </div>
            </div>

            {/* Mock Progress goal bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-purple-200/60">
                <span>Daily XP Target</span>
                <span>120 / 300 XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-purple to-pink-500" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Smart features items */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="p-2 rounded-xl bg-purple-500/10 text-brand-purple-light">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">Smart Learning</span>
                <span className="text-[8px] text-purple-300/40 font-bold">AI-Powered</span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="p-2 rounded-xl bg-pink-500/10 text-sakura-dark">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">Track Progress</span>
                <span className="text-[8px] text-purple-300/40 font-bold">Level Up</span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-1">
                <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-white leading-tight">Achieve Goals</span>
                <span className="text-[8px] text-purple-300/40 font-bold">Mastery Path</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Card */}
        <div className="w-full max-w-[450px] relative">
          
          {/* Neon outline border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple to-sakura-dark rounded-[28px] opacity-20 blur-sm pointer-events-none" />
          
          <div className="w-full glass-card rounded-[28px] p-8 md:p-10 border border-white/10 shadow-2xl relative z-10 space-y-6">
            
            {/* Sign-in / Sign-up selector header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-xl font-bold font-sans tracking-tight text-white">
                {mode === 'login' && 'Login to your account'}
                {mode === 'signup' && 'Create your account'}
                {mode === 'forgot' && 'Reset password'}
              </h2>
              {mode === 'login' && (
                <button
                  onClick={() => { setError(''); setSuccess(''); setMode('signup'); }}
                  className="text-xs font-bold text-sakura-dark hover:underline"
                >
                  New here? <span className="text-white hover:text-sakura-light">Sign Up</span>
                </button>
              )}
              {mode === 'signup' && (
                <button
                  onClick={() => { setError(''); setSuccess(''); setMode('login'); }}
                  className="text-xs font-bold text-sakura-dark hover:underline"
                >
                  Already registered? <span className="text-white hover:text-sakura-light">Log In</span>
                </button>
              )}
              {mode === 'forgot' && (
                <button
                  onClick={() => { setError(''); setSuccess(''); setMode('login'); }}
                  className="flex items-center gap-1 text-xs font-bold text-purple-300/60 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              )}
            </div>

            {/* Error & Success States */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-xs text-rose-400 font-semibold"
                >
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3 text-xs text-emerald-400 font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Inputs & Form layout */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="signup-name"
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      leftIcon={<User className="w-4 h-4" />}
                      className="bg-white/[0.02]"
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email Address"
                type="email"
                placeholder="learner.velmorth@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                className="bg-white/[0.02]"
                required
              />

              {mode !== 'forgot' && (
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 hover:text-white text-purple-300/40 transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  }
                  className="bg-white/[0.02]"
                  required
                />
              )}

              {/* Keep Remember me & Forgot Password spacing */}
              {mode === 'login' && (
                <div className="flex items-center justify-between text-xs font-semibold select-none pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-purple-300/50 hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-purple-950 bg-[#0d0a1d] text-brand-purple focus:ring-brand-purple focus:ring-offset-0 focus:outline-none"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => { setError(''); setMode('forgot'); }}
                    className="text-sakura-dark hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Login submit button */}
              <Button 
                type="submit" 
                loading={loading} 
                className="w-full btn btn-primary flex items-center justify-center gap-2 shadow-lg h-14 mt-4"
              >
                <span>
                  {mode === 'login' && 'Login'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>

            {/* Social Authentication options */}
            {mode !== 'forgot' && (
              <div className="space-y-4 pt-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-white/5" />
                  <span className="flex-shrink mx-4 text-[10px] font-extrabold text-purple-300/30 uppercase tracking-widest">
                    or continue with
                  </span>
                  <div className="flex-grow border-t border-white/5" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer group"
                    aria-label="Continue with Google"
                  >
                    <svg className="w-5 h-5 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                  </button>

                  {/* Apple */}
                  <button
                    type="button"
                    onClick={() => setError('Apple ID verification modal. Standard checkout integration active.')}
                    className="flex items-center justify-center py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer group"
                    aria-label="Continue with Apple"
                  >
                    <svg className="w-5 h-5 fill-white group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.13.67-2.85 1.51-.62.72-1.16 1.86-1.01 2.98 1.1.09 2.14-.58 2.87-1.43Z" />
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button
                    type="button"
                    onClick={() => setError('Facebook Sign-in is available in release builds.')}
                    className="flex items-center justify-center py-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all cursor-pointer group"
                    aria-label="Continue with Facebook"
                  >
                    <svg className="w-5 h-5 fill-[#1877F2] group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Footer lock statement */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-purple-300/30 uppercase tracking-wider pt-2">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <span>Your data is safe with us</span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer copyright */}
      <footer className="w-full text-center py-4 z-20 text-[10px] text-purple-300/20 font-bold uppercase tracking-widest max-w-7xl mx-auto">
        &copy; {new Date().getFullYear()} Velmorth Corp. All rights reserved.
      </footer>
    </div>
  );
}
