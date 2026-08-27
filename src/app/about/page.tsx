'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Building2, User, Rocket, Award, ShieldCheck, Heart } from 'lucide-react';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { Logo } from '@/components/ui/Logo';

export default function AboutPage() {
  const stats = [
    { label: 'JLPT Curriculum', value: 'N5 to N1' },
    { label: 'Vocabulary & Kanji', value: '10,000+' },
    { label: 'AI Conversation Engine', value: 'Gemini 2.0' },
    { label: 'Spaced Repetition', value: 'SM-2 Engine' },
  ];

  const values = [
    {
      icon: Rocket,
      title: 'Effortless Learning',
      desc: 'Combining neuroscience-backed Spaced Repetition (SRS) with adaptive AI tutoring to accelerate Japanese mastery.'
    },
    {
      icon: Building2,
      title: 'Yample Labs Innovation',
      desc: 'Crafted with precision engineering and high-performance user experience standards by parent company Yample Labs.'
    },
    {
      icon: User,
      title: 'Founder\'s Vision',
      desc: 'Founded by Manish with a mission to eliminate language barriers and empower global language enthusiasts.'
    },
    {
      icon: ShieldCheck,
      title: 'Quality & Integrity',
      desc: 'Native audio recordings, verified JLPT N5–N1 curriculums, and real-time handwriting evaluation.'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen min-h-[100dvh] bg-[#09070F] text-ink flex flex-col relative overflow-hidden"
    >
      <SakuraParticles />

      {/* Ambient background glows */}
      <div className="absolute w-[50vw] h-[50vw] rounded-full bg-brand/5 blur-[120px] pointer-events-none top-[-10%] right-[-10%]" />
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-neon-pink/4 blur-[100px] pointer-events-none bottom-[-10%] left-[-10%]" />

      {/* Header */}
      <header className="w-full border-b border-edge bg-[#09070F]/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/home" className="flex items-center gap-2 text-xs font-bold text-ink-secondary/60 hover:text-ink transition-colors cursor-pointer group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-widest font-heading">
            <Logo size="sm" glow={false} />
            <span>MindForge</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 z-10 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand/10 border border-neon-purple/20 text-xs font-bold text-brand-light uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Yample Labs Software Project
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading">
            About <span className="bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta bg-clip-text text-transparent">MindForge</span>
          </h1>
          <p className="text-sm sm:text-base text-purple-200/60 max-w-2xl mx-auto leading-relaxed">
            MindForge is an intelligent, gamified Japanese learning platform engineered to make JLPT preparation effortless through real-time AI conversation and spaced-repetition memory science.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-edge text-center space-y-1">
              <span className="text-2xl font-extrabold text-ink font-heading">{s.value}</span>
              <p className="text-[11px] text-ink-muted font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Company & Founder Section */}
        <div className="p-8 rounded-3xl bg-[#12101D] border border-edge space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand/10 border border-neon-purple/20 text-brand-light">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-ink font-heading">Yample Labs</h2>
              <p className="text-xs text-ink-muted">Parent Company & Engineering Organization</p>
            </div>
          </div>

          <p className="text-sm text-purple-200/70 leading-relaxed">
            MindForge is developed and operated by <strong>Yample Labs</strong>. Founded by <strong>Manish</strong>, Yample Labs builds state-of-the-art educational tech, AI tutors, and reactive web platforms designed to elevate learning experiences across the globe.
          </p>

          <div className="pt-4 border-t border-edge flex items-center justify-between text-xs text-ink-muted font-medium">
            <span>Founder & CEO: <strong>Manish</strong></span>
            <span>Parent Org: <strong>Yample Labs</strong></span>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-ink font-heading text-center sm:text-left">
            Core Pillars
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-edge space-y-3">
                <div className="p-3 w-fit rounded-xl bg-brand/10 border border-neon-purple/20 text-brand-light">
                  <v.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-ink">{v.title}</h3>
                <p className="text-xs text-ink-secondary/60 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-edge py-6 text-center text-[10px] text-ink-secondary/20 font-bold uppercase tracking-widest px-6 z-20">
        &copy; 2026 Yample Labs. All Rights Reserved.
      </footer>
    </motion.div>
  );
}