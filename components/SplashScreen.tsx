'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── 1. FLOATING LEAVES COMPONENT ─────────────────────────────────────────────
interface Leaf {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
  swayOffsets: number[]; // pre-calculated to prevent render-time Math.random() jitter
}

export function FloatingLeaves() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    // Generate 12 random leaves floating across the screen
    const generated: Leaf[] = Array.from({ length: 12 }).map((_, i) => {
      const x = Math.random() * 100; // starting horizontal percentage
      return {
        id: i,
        x,
        y: -20,
        size: Math.random() * 16 + 10, // 10px to 26px
        duration: Math.random() * 8 + 6, // 6s to 14s drift time
        delay: Math.random() * 4, // stagger entrance
        rotate: Math.random() * 360,
        swayOffsets: [
          x,
          x + (Math.random() * 16 - 8),
          x + (Math.random() * 16 - 8),
          x
        ]
      };
    });
    setLeaves(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ 
            x: `${leaf.x}vw`, 
            y: '-10vh', 
            rotate: leaf.rotate, 
            opacity: 0 
          }}
          animate={{
            y: '110vh',
            x: leaf.swayOffsets.map(val => `${val}vw`), // smooth pre-defined sway keyframes
            rotate: leaf.rotate + 360,
            opacity: [0, 0.7, 0.7, 0] // fade in, drift, fade out
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute"
          style={{ width: leaf.size, height: leaf.size }}
        >
          {/* Leaf SVG */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#4ADE80] opacity-80 w-full h-full">
            <path
              d="M2 22C2 22 8 20 12 16C16 12 20 6 22 2C22 2 16 4 12 8C8 12 2 18 2 22Z"
              fill="currentColor"
            />
            <path
              d="M2 22C10 18 14 14 22 2"
              stroke="#22C55E"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

// ─── 2. ANIMATED LOGO (SVG MASCOT) ─────────────────────────────────────────────
export function AnimatedLogo() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Background Soft Green Glow */}
      <motion.div
        animate={{
          scale: [0.95, 1.1, 0.95],
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-48 h-48 rounded-full bg-[#4ADE80] blur-3xl"
      />

      {/* 3D Mascot SVG */}
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full z-20 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <defs>
          {/* Body gradient */}
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="70%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </radialGradient>
          {/* Glasses golden gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
          {/* Book cover gradient */}
          <linearGradient id="bookCover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="100%" stopColor="#052E16" />
          </linearGradient>
        </defs>

        {/* --- LEAF CROWN (HEAD LEAVES) --- */}
        <g id="crown">
          {/* Back leaves (darker green, providing depth) */}
          <path d="M 60,65 C 45,50 60,35 75,50 C 75,55 70,60 60,65 Z" fill="#15803D" />
          <path d="M 140,65 C 155,50 140,35 125,50 C 125,55 130,60 140,65 Z" fill="#15803D" />
          
          {/* Main Leaf Wreath (overlapping leaves with micro-sways) */}
          {/* Leaf 1 (Leftmost) */}
          <motion.path
            d="M 55,75 C 35,65 45,45 65,55 C 70,60 65,70 55,75 Z"
            fill="#16A34A"
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '65px 55px' }}
          />
          {/* Leaf 2 (Left Inner) */}
          <motion.path
            d="M 75,65 C 60,50 75,30 90,45 C 90,50 85,60 75,65 Z"
            fill="#4ADE80"
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '85px 48px' }}
          />
          {/* Leaf 3 (Center) */}
          <motion.path
            d="M 100,60 C 90,35 110,35 100,60 Z"
            fill="#86EFAC"
            animate={{ scaleY: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 60px' }}
          />
          {/* Leaf 4 (Right Inner) */}
          <motion.path
            d="M 125,65 C 140,50 125,30 110,45 C 110,50 115,60 125,65 Z"
            fill="#4ADE80"
            animate={{ rotate: [3, -3, 3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '115px 48px' }}
          />
          {/* Leaf 5 (Rightmost) */}
          <motion.path
            d="M 145,75 C 165,65 155,45 135,55 C 130,60 135,70 145,75 Z"
            fill="#16A34A"
            animate={{ rotate: [2, -2, 2] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '135px 55px' }}
          />
        </g>

        {/* --- MAIN ROUND BODY --- */}
        <circle cx="100" cy="115" r="55" fill="url(#bodyGrad)" />

        {/* --- CHEEKS BLUSH --- */}
        <ellipse cx="62" cy="116" rx="8" ry="4.5" fill="#FFA4A4" opacity="0.45" />
        <ellipse cx="138" cy="116" rx="8" ry="4.5" fill="#FFA4A4" opacity="0.45" />

        {/* --- EYES BLINKING ANIMATION --- */}
        <g id="eyes">
          {/* Left Eye Pupil + Sparkles */}
          <motion.g
            animate={{
              scaleY: [1, 0.1, 1, 1, 0.1, 1, 1, 1], // Blink pattern
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '76px 104px' }}
          >
            {/* Pupil */}
            <circle cx="76" cy="104" r="10" fill="#1C3B2B" />
            {/* Sparkles */}
            <circle cx="73.5" cy="101.5" r="3.2" fill="#FFFFFF" />
            <circle cx="80" cy="107" r="1.5" fill="#FFFFFF" />
          </motion.g>

          {/* Right Eye Pupil + Sparkles */}
          <motion.g
            animate={{
              scaleY: [1, 0.1, 1, 1, 0.1, 1, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: '124px 104px' }}
          >
            {/* Pupil */}
            <circle cx="124" cy="104" r="10" fill="#1C3B2B" />
            {/* Sparkles */}
            <circle cx="121.5" cy="101.5" r="3.2" fill="#FFFFFF" />
            <circle cx="128" cy="107" r="1.5" fill="#FFFFFF" />
          </motion.g>
        </g>

        {/* --- CHIBI SMILE MOUTH --- */}
        <g id="mouth">
          {/* Smiling Open Mouth shape */}
          <path d="M 91,120 Q 100,134 109,120 Z" fill="#E11D48" />
          {/* Cute Tongue inside */}
          <path d="M 94,124 Q 100,121 106,124 Q 100,133 94,124 Z" fill="#FDA4AF" />
        </g>

        {/* --- FEET --- */}
        <g id="feet">
          <path d="M 72,166 C 68,176 80,178 84,167" fill="#15803D" />
          <path d="M 128,166 C 132,176 120,178 116,167" fill="#15803D" />
        </g>

        {/* --- ARMS --- */}
        <g id="arms">
          {/* Left arm holding the book */}
          <motion.path
            d="M 50,132 Q 40,140 54,146"
            stroke="#22C55E"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Right arm holding the book */}
          <motion.path
            d="M 150,132 Q 160,140 146,146"
            stroke="#22C55E"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            animate={{ y: [0, -1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </g>

        {/* --- GOLD SPECTACLES / GLASSES --- */}
        <g id="spectacles">
          {/* Left Rim */}
          <circle cx="76" cy="104" r="21" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          {/* Right Rim */}
          <circle cx="124" cy="104" r="21" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          {/* Bridge */}
          <path d="M 97,104 Q 100,99 103,104" stroke="url(#goldGrad)" strokeWidth="3.2" fill="none" />
          {/* Glass Diagonal Highlights */}
          <path d="M 64,96 L 70,90 M 112,96 L 118,90" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* --- BOOK OPENING ANIMATION --- */}
        <g id="book">
          {/* Left page back cover */}
          <motion.path
            d="M 100,165 L 55,150 L 55,120 L 100,135 Z"
            fill="url(#bookCover)"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            animate={{ rotateY: [12, -4, 12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 145px' }}
          />
          {/* Right page back cover */}
          <motion.path
            d="M 100,165 L 145,150 L 145,120 L 100,135 Z"
            fill="url(#bookCover)"
            stroke="url(#goldGrad)"
            strokeWidth="1.5"
            animate={{ rotateY: [-12, 4, -12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 145px' }}
          />
          {/* Inner pages left (white) */}
          <motion.path
            d="M 100,162 L 58,148 L 58,122 L 100,137 Z"
            fill="#F8FAFC"
            animate={{ rotateY: [12, -4, 12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 145px' }}
          />
          {/* Inner pages right (white) */}
          <motion.path
            d="M 100,162 L 142,148 L 142,122 L 100,137 Z"
            fill="#F8FAFC"
            animate={{ rotateY: [-12, 4, -12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '100px 145px' }}
          />
          {/* Gold leaf emblem in the center of cover */}
          <circle cx="100" cy="148" r="4.5" fill="#EAB308" />
        </g>
      </motion.svg>
    </div>
  );
}

// ─── 3. PROGRESS LOADER & MOTIVATIONAL TEXT ──────────────────────────────────
const loadingPhrases = [
  'Growing Knowledge…',
  'Tuning Speaking Ears…',
  'Polishing Kanji Brushes…',
  'Assembling Particle Rules…',
  'Sprouting Green Leaves…',
  'Preparing Your Forest Path…'
];

interface ProgressLoaderProps {
  progress: number;
}

export function ProgressLoader({ progress }: ProgressLoaderProps) {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    // Cycle text phrases every 1.4s for dynamic study comments
    const interval = setInterval(() => {
      setPhraseIdx((prev) => (prev + 1) % loadingPhrases.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 flex flex-col items-center gap-4 z-20">
      {/* Progress Bar Container */}
      <div className="w-full h-3 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[rgba(255,255,255,0.06)] shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80]"
          style={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.15 }}
        />
      </div>

      {/* Percentage Count */}
      <span className="text-xs font-black tracking-widest text-[#4ADE80] tabular-nums">
        {Math.round(progress)}%
      </span>

      {/* Growing Knowledge Text */}
      <div className="h-6 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={phraseIdx}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 0.85 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="text-xs text-[var(--text-2)] font-bold text-center tracking-wide"
          >
            {loadingPhrases[phraseIdx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── 4. FULL SPLASH SCREEN OVERVIEW ───────────────────────────────────────────
interface SplashScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export function SplashScreen({ isLoading, onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress smoothly via state function to avoid cleanup reset bugs
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600); // short wait at 100% for transition
          return 100;
        }

        // Hold at 95% while database is loading
        if (prev >= 95 && isLoading) {
          return 95;
        }

        // Smooth increment rate for premium look (minimum 2.2 seconds)
        const step = Math.random() * 2 + 1.2; 
        const next = prev + step;
        return next >= 100 ? 100 : next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete, isLoading]);

  return (
    <motion.div
      exit={{
        y: '-100vh',
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } // clean slide up reveal
      }}
      className="fixed inset-0 bg-[var(--bg)] flex flex-col items-center justify-center gap-6 z-[9999] select-none"
    >
      {/* Floating Particle Leaves */}
      <FloatingLeaves />

      {/* Mascot Logo container */}
      <AnimatedLogo />

      {/* Brand title block */}
      <div className="text-center z-20">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg font-black text-[var(--text)] tracking-widest uppercase"
        >
          VELMORTH
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.65, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[10px] text-[var(--text-2)] font-bold tracking-widest mt-1 uppercase"
        >
          Japanese Labs
        </motion.p>
      </div>

      {/* Progress metrics */}
      <ProgressLoader progress={progress} />
    </motion.div>
  );
}

// ─── 5. HOME TRANSITION WRAPPER ───────────────────────────────────────────────
export function HomeTransition({ children, show }: { children: React.ReactNode; show: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {show ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full min-h-screen"
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
