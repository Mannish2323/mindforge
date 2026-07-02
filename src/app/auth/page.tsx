'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Mic, Brain, Trophy, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const features = [
    { icon: Sparkles, title: 'AI Tutor', desc: 'Sakura AI assistant' },
    { icon: BookOpen, title: 'JLPT N5→N1', desc: 'Complete roadmap' },
    { icon: Mic, title: 'Speaking', desc: 'Pronunciation AI' },
    { icon: Brain, title: 'Smart SRS', desc: 'Spaced repetition' },
    { icon: Trophy, title: 'Gamification', desc: 'XP & achievements' },
    { icon: Shield, title: 'Cross Platform', desc: 'Web + Android' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0B0717] text-white flex flex-col relative overflow-hidden">
      {/* Sakura Petals */}
      <SakuraParticles />

      {/* Background glows */}
      <div className="absolute w-[50vw] h-[50vw] rounded-full bg-neon-purple/8 blur-[120px] pointer-events-none top-[10%] left-[10%] animate-pulse-glow" />
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-neon-pink/5 blur-[100px] pointer-events-none bottom-[10%] right-[10%]" />

      {/* Top Bar */}
      <header className="w-full flex items-center justify-between px-6 py-4 z-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Logo size="sm" glow={true} />
          <span className="font-bold text-base text-white font-orbitron tracking-tight">
            Velmorth
          </span>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 py-8 z-10 max-w-7xl mx-auto w-full"
      >
        {/* Left: Hero Section */}
        <motion.div variants={itemVariants} className="flex-1 max-w-xl space-y-8 text-center lg:text-left">
          <div className="space-y-5">
            {/* Large Logo for mobile / desktop hero */}
            <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
              <Logo size={96} glow={true} className="rounded-3xl" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/15 border border-neon-purple/30 text-xs font-bold text-brand-light">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Japanese Learning
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Learn Japanese{' '}
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta bg-clip-text text-transparent">
                The Smart Way
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-purple-200/50 text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              AI-powered lessons, practice, and real-time feedback.
              Master JLPT N5 to N1 with Sakura AI, your personal tutor.
            </motion.p>
          </div>

          {/* Feature Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="flex flex-col items-center lg:items-start gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-neon-purple/20 hover:bg-white/[0.04] transition-all"
              >
                <div className="p-2 rounded-lg bg-neon-purple/10">
                  <f.icon className="w-4 h-4 text-brand-light" />
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-xs font-bold text-white block">{f.title}</span>
                  <span className="text-[10px] text-purple-300/40 font-medium">{f.desc}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: Login Card */}
        <motion.div variants={itemVariants} className="w-full max-w-[420px]">
          {/* Neon border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple to-neon-pink rounded-[28px] opacity-15 blur-sm pointer-events-none" />

          <div className="glass-card rounded-[28px] p-8 md:p-10 border border-white/[0.08] shadow-2xl relative z-10 space-y-8">
            {/* Header */}
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-sm text-purple-300/50">
                Continue your Japanese learning journey
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-semibold text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 h-14 rounded-xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 transition-all shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/[0.06]" />
              <span className="px-4 text-[10px] font-bold text-purple-300/25 uppercase tracking-widest">
                secure login
              </span>
              <div className="flex-grow border-t border-white/[0.06]" />
            </div>

            {/* Info text */}
            <p className="text-center text-[11px] text-purple-300/30 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-neon-purple hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-neon-purple hover:underline">Privacy Policy</Link>
            </p>

            {/* Security badge */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-purple-300/20 uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              <span>End-to-end encrypted</span>
            </div>
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-20 text-[10px] text-purple-300/15 font-bold uppercase tracking-widest px-6">
        &copy; {new Date().getFullYear()} Velmorth Labs. All rights reserved.
      </footer>
    </div>
  );
}
