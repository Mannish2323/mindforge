'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Cloud, Wifi, Lock, Sparkles, RefreshCw, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function DownloadsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-neon-pink" />
            <span>Future Roadmap</span>
          </Badge>
          <Badge variant="pink" className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-sakura-dark" />
            <span>Coming Soon</span>
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3 font-orbitron">
          <Download className="w-8 h-8 text-neon-purple-light" /> Offline Learning
        </h1>
        <p className="text-sm md:text-base text-purple-300/50 max-w-xl">
          Study anywhere without an internet connection. Download full lesson units, flashcards, and audio guides.
        </p>
      </motion.div>

      {/* Main Glass Card Feature Highlight */}
      <motion.div variants={item}>
        <div className="relative group">
          {/* Animated Glow Backdrop */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-purple via-neon-pink to-sakura-dark rounded-3xl blur-md opacity-30 group-hover:opacity-50 transition duration-500 pointer-events-none" />

          <Card variant="glass" padding="lg" className="relative rounded-3xl border border-white/10 space-y-6 overflow-hidden bg-[#12101D]/90 backdrop-blur-2xl">
            {/* Top Bar Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-neon-purple/10 border border-neon-purple/20 text-neon-purple-light">
                  <Wifi className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-white">Full Offline Mode</h2>
                  <p className="text-xs text-purple-300/40">Zero latency • Study without Wi-Fi or Data</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold text-amber-300">
                <Lock className="w-3.5 h-3.5" />
                <span>Play Store Exclusive</span>
              </div>
            </div>

            {/* Feature Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-4">
                <p className="text-sm text-purple-200/70 leading-relaxed">
                  Download complete Japanese learning packages directly to your device storage. Practice vocabulary, listen to native audio, and attempt quizzes seamlessly off-grid.
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-xs text-purple-300/60">
                    <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                    <span>Auto-sync progress to cloud when reconnected</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-purple-300/60">
                    <Cloud className="w-4 h-4 text-neon-pink" />
                    <span>Instant background sync with Supabase database</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-purple-300/60">
                    <Smartphone className="w-4 h-4 text-brand-light" />
                    <span>Optimized for Android APK & iOS Capacitor wrappers</span>
                  </div>
                </div>
              </div>

              {/* Illustration / Coming Soon Action Block */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 border border-white/10 flex items-center justify-center shadow-glow-purple">
                  <Download className="w-8 h-8 text-sakura-medium" />
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Download Package</span>
                  <span className="text-[11px] text-purple-300/40 block">Status: Coming Soon</span>
                </div>

                <button
                  disabled
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-purple-300/40 flex items-center justify-center gap-2 cursor-not-allowed opacity-60"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Download Disabled (Coming Soon)</span>
                </button>

                <p className="text-[10px] text-purple-300/30 italic">
                  Note: Available immediately following the official Android Play Store release.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}
