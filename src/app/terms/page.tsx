'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Lock, ShieldAlert, Sparkles } from 'lucide-react';
import { SakuraParticles } from '@/components/animations/SakuraParticles';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing or utilizing the MindForge learning application by Yample Labs, you verify that you have read, understood, and agreed to adhere to these Terms of Service. If you do not accept these parameters, you are not authorized to use the platform.'
    },
    {
      title: '2. Account Credentials & Security',
      content: 'You are responsible for safeguarding your authorization credentials and maintaining the confidentiality of your session state. Any actions logged under your credentials will be considered your direct responsibility. You must immediately notify support if you suspect unauthorized access.'
    },
    {
      title: '3. Premium Features & Subscriptions',
      content: 'Access to premium JLPT modules and unlimited AI tutor interactions is governed by our membership plans. Subscriptions auto-renew according to the billing interval specifications until cancelled in billing management. Refunds are evaluated pursuant to our standard Refund Policy parameters.'
    },
    {
      title: '4. Appropriate Platform Behavior',
      content: 'You agree to utilize our AI tutor, community chat networks, and speaking tools for educational purposes only. You must not submit toxic, offensive, or malicious materials. Violations of code of conduct parameters will result in active account suspension.'
    },
    {
      title: '5. Limitation of Liability',
      content: 'MindForge, Yample Labs, and its developers do not guarantee absolute learning proficiency outcomes. The platform services are provided "as-is" without warranty. We are not liable for session downtime, data loss, or indirect damages caused by external API constraints.'
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
      className="min-h-screen min-h-[100dvh] bg-[#09070F] text-ink flex flex-col relative overflow-hidden"
    >
      <SakuraParticles />

      {/* Ambient background glows */}
      <div className="absolute w-[50vw] h-[50vw] rounded-full bg-brand/5 blur-[120px] pointer-events-none top-[-10%] right-[-10%]" />
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-neon-pink/4 blur-[100px] pointer-events-none bottom-[-10%] left-[-10%]" />

      {/* Header toolbar */}
      <header className="w-full border-b border-edge bg-[#09070F]/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/auth" className="flex items-center gap-2 text-xs font-bold text-ink-secondary/60 hover:text-ink transition-colors cursor-pointer group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Login</span>
          </Link>
          
          <div className="flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-widest">
            <FileText className="w-3.5 h-3.5 text-sakura-dark" />
            <span>Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Main content body */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 z-10 space-y-10">
        {/* Title Block */}
        <div className="space-y-3 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 border border-neon-purple/20 text-[10px] font-bold text-brand-light tracking-wide uppercase">
            <Sparkles className="w-3 h-3 text-sakura-dark" />
            Platform Rules & Guidelines
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink font-heading">
            Terms of Service
          </h1>
          <p className="text-xs text-ink-secondary/35 uppercase font-bold tracking-wider">
            Last Updated: July 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-edge text-sm text-purple-200/80 leading-relaxed font-medium">
          Please review the following rules and parameters before engaging with the MindForge interactive dashboard and AI training units.
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
              <h2 className="text-base font-extrabold text-ink font-heading">{section.title}</h2>
              <p className="text-xs sm:text-sm text-ink-secondary/70 leading-relaxed font-semibold">
                {section.content}
              </p>
            </motion.section>
          ))}
        </motion.div>

        {/* Legal notice footer card */}
        <div className="p-6 rounded-3xl bg-[#12101D] border border-edge flex flex-col sm:flex-row items-center gap-4 shadow-lg">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-extrabold text-ink">Compliance & Safeguards</h4>
            <p className="text-[11px] text-ink-muted leading-relaxed font-semibold">
              Failure to comply with these terms may result in account restriction or revocation of access credentials.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-edge py-6 text-center text-[10px] text-ink-secondary/15 font-bold uppercase tracking-widest px-6 z-20">
        &copy; 2026 Yample Labs. All Rights Reserved.
      </footer>
    </motion.div>
  );
}