'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, FileText, Eye } from 'lucide-react';
import { SakuraParticles } from '@/components/animations/SakuraParticles';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us when creating an account, such as your display name, email address, and profile settings. We also collect learning progress data including completed modules, streak logs, daily study metrics, and accuracy stats to optimize your personalized SRS (Spaced Repetition System) learning path.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use the collected data to personalize your Japanese learning experience, serve tailored study calendar grids, calculate rankings on the global leaderboard, and generate interactive speaking assessments. Email addresses are strictly used for secure authentication and optional daily reminder notifications.'
    },
    {
      title: '3. AI Interaction Policy (Sakura Tutor)',
      content: 'Conversation history with our virtual AI tutor (Sakura) is processed to generate contextual responses, correct grammatical structures, and suggest pronunciation improvements. Conversation details are encrypted and analyzed anonymously to improve response quality. We do not sell or share your chat transcripts with third-party advertisers.'
    },
    {
      title: '4. Data Retention & Deletion',
      content: 'Your account logs, saved vocabulary decks, and custom settings are stored securely within our encrypted database. You have full control over your personal records. If you decide to terminate your account, you can use the "Delete Account" option under Settings to instantly purge all stored records permanently.'
    },
    {
      title: '5. Cookies & Analytical Logging',
      content: 'We utilize essential session cookies to manage active log-in states and verify API authorization. Non-intrusive analytical parameters are logged to measure page responsiveness and identify latency anomalies, helping us maintain a fluid, 60 FPS learning environment.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 15 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen min-h-[100dvh] bg-[#09070F] text-white flex flex-col relative overflow-hidden"
    >
      <SakuraParticles />

      {/* Ambient background glows */}
      <div className="absolute w-[50vw] h-[50vw] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none top-[-10%] right-[-10%]" />
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-neon-pink/4 blur-[100px] pointer-events-none bottom-[-10%] left-[-10%]" />

      {/* Header toolbar */}
      <header className="w-full border-b border-white/[0.08] bg-[#09070F]/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/auth" className="flex items-center gap-2 text-xs font-bold text-purple-300/60 hover:text-white transition-colors cursor-pointer group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Login</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold text-purple-300/40 uppercase tracking-widest">
            <Shield className="w-3.5 h-3.5 text-sakura-dark" />
            <span>Privacy Policy</span>
          </div>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 z-10 space-y-10">
        {/* Title Block */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-[10px] font-bold text-brand-light tracking-wide uppercase">
            <Eye className="w-3 h-3" />
            Security & Policy Parameters
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-orbitron">
            Privacy Policy
          </h1>
          <p className="text-xs text-purple-300/35 uppercase font-bold tracking-wider">
            Last Updated: July 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-sm text-purple-200/80 leading-relaxed font-medium">
          At MindForge by Yample Labs, protecting the integrity of your personal records and academic analytics is a key priority. This policy outlines how we compile, utilize, and protect your profile specifications.
        </div>

        {/* Content sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {sections.map((section, idx) => (
            <motion.section key={idx} variants={itemVariants} className="space-y-2">
              <h2 className="text-base font-extrabold text-white font-orbitron">{section.title}</h2>
              <p className="text-xs sm:text-sm text-purple-300/70 leading-relaxed font-semibold">
                {section.content}
              </p>
            </motion.section>
          ))}
        </motion.div>

        {/* Security badge footer card */}
        <div className="p-6 rounded-3xl bg-[#12101D] border border-white/[0.08] flex flex-col sm:flex-row items-center gap-4 shadow-lg">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-extrabold text-white">End-to-End Secure Processing</h4>
            <p className="text-[11px] text-purple-300/40 leading-relaxed font-semibold">
              All client-to-server operations are verified and encrypted using SSL protocol safeguards.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/[0.06] py-6 text-center text-[10px] text-purple-300/15 font-bold uppercase tracking-widest px-6 z-20">
        &copy; 2026 Yample Labs. All Rights Reserved.
      </footer>
    </motion.div>
  );
}
