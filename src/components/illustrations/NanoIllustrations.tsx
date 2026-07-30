'use client';

import React from 'react';

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 🌸 Sakura AI Sensei Mascot Vector Illustration
export function SakuraAiIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="sakuraGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D3CFF" />
        </linearGradient>
        <linearGradient id="haloGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.1" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Glowing Halo */}
      <circle cx="60" cy="60" r="50" fill="url(#haloGrad)" filter="url(#glow)" />
      
      {/* Sakura Petals Halo BG */}
      <path
        d="M60 12C63 24 72 33 84 36C72 39 63 48 60 60C57 48 48 39 36 36C48 33 57 24 60 12Z"
        fill="url(#sakuraGrad)"
        opacity="0.35"
      />
      
      {/* Core AI Sensei Orb */}
      <circle cx="60" cy="60" r="32" fill="url(#sakuraGrad)" />
      
      {/* Face Visor / Expression Lines */}
      <rect x="42" y="48" width="36" height="20" rx="10" fill="#0B0717" opacity="0.9" />
      <circle cx="51" cy="58" r="3" fill="#38BDF8" />
      <circle cx="69" cy="58" r="3" fill="#38BDF8" />
      
      {/* Sparkle Accent */}
      <path d="M82 28L84.5 34.5L91 37L84.5 39.5L82 46L79.5 39.5L73 37L79.5 34.5L82 28Z" fill="#F472B6" />
      <path d="M30 76L31.5 80L35.5 81.5L31.5 83L30 87L28.5 83L24.5 81.5L28.5 80L30 76Z" fill="#C15BFF" />
    </svg>
  );
}

// 🔥 Active Streak & Flame Vector Illustration
export function StreakIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="flameOuter" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="0.5" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="flameInner" x1="40" y1="30" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="1" stopColor="#EF4444" />
        </linearGradient>
      </defs>
      
      {/* Outer Flame Shadow */}
      <circle cx="60" cy="65" r="42" fill="#F59E0B" opacity="0.15" />
      
      {/* Flame Main Body */}
      <path
        d="M60 14C60 14 78 38 78 62C78 80.0964 69.9442 94 60 94C50.0558 94 42 80.0964 42 62C42 46 52 28 60 14Z"
        fill="url(#flameOuter)"
      />
      <path
        d="M60 38C60 38 70 54 70 68C70 78.4934 65.5228 86 60 86C54.4772 86 50 78.4934 50 68C50 58 56 46 60 38Z"
        fill="url(#flameInner)"
      />
      
      {/* Particle Sparks */}
      <circle cx="34" cy="40" r="3" fill="#F59E0B" />
      <circle cx="86" cy="48" r="2.5" fill="#EF4444" />
      <circle cx="76" cy="24" r="2" fill="#FBBF24" />
    </svg>
  );
}

// 🈁 Kanji Vector Illustration
export function KanjiIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="kanjiBg" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D3CFF" />
        </linearGradient>
      </defs>

      <rect x="16" y="16" width="88" height="88" rx="24" fill="url(#kanjiBg)" opacity="0.2" />
      <rect x="20" y="20" width="80" height="80" rx="20" fill="#0B0717" stroke="#8B5CF6" strokeWidth="2" />

      {/* Kanji Character Lines */}
      <path d="M40 38H80" stroke="#EC4899" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 38V54" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 54H76" stroke="#C15BFF" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 68C56 70 64 70 72 68" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 68V86" stroke="#6D3CFF" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 86H78" stroke="#F472B6" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// 📚 Grammar Node Illustration
export function GrammarIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="gramGrad" x1="15" y1="15" x2="105" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#6D3CFF" />
        </linearGradient>
      </defs>
      
      <circle cx="60" cy="60" r="44" fill="url(#gramGrad)" opacity="0.15" />
      
      {/* Node connectors */}
      <path d="M36 60H84M60 36V84" stroke="#06B6D4" strokeWidth="3" strokeDasharray="4 4" />
      
      <circle cx="60" cy="36" r="10" fill="#06B6D4" />
      <circle cx="36" cy="60" r="10" fill="#6D3CFF" />
      <circle cx="84" cy="60" r="10" fill="#EC4899" />
      <circle cx="60" cy="84" r="10" fill="#38BDF8" />
      <circle cx="60" cy="60" r="14" fill="#0B0717" stroke="#F472B6" strokeWidth="3" />
    </svg>
  );
}

// 🎴 Flashcard / Vocab Illustration
export function VocabIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="cardGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Back Card */}
      <rect x="36" y="20" width="56" height="74" rx="14" fill="#6D3CFF" opacity="0.4" transform="rotate(8 64 57)" />
      {/* Front Card */}
      <rect x="30" y="24" width="58" height="76" rx="14" fill="#0B0717" stroke="url(#cardGrad)" strokeWidth="3" />

      {/* Card Content Lines */}
      <rect x="42" y="42" width="34" height="6" rx="3" fill="#EC4899" />
      <rect x="42" y="56" width="24" height="4" rx="2" fill="#8B5CF6" />
      <rect x="42" y="66" width="28" height="4" rx="2" fill="#38BDF8" opacity="0.7" />
    </svg>
  );
}

// ✍️ Writing Stylus Illustration
export function WritingIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="writeGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      <path d="M25 95C45 95 60 85 95 40" stroke="url(#writeGrad)" strokeWidth="5" strokeLinecap="round" />
      <path d="M95 25L100 20L105 25L100 30L95 25Z" fill="#F59E0B" />
      <rect x="30" y="70" width="60" height="2" fill="#F472B6" opacity="0.4" />
    </svg>
  );
}

// 🎧 Listening Soundwave Illustration
export function ListeningIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="soundGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#C15BFF" />
        </linearGradient>
      </defs>

      {/* Headphone Arc */}
      <path d="M30 65V50C30 33.4315 43.4315 20 60 20C76.5685 20 90 33.4315 90 50V65" stroke="url(#soundGrad)" strokeWidth="6" strokeLinecap="round" />
      {/* Ear Cups */}
      <rect x="22" y="60" width="16" height="30" rx="8" fill="#3B82F6" />
      <rect x="82" y="60" width="16" height="30" rx="8" fill="#C15BFF" />
      
      {/* Soundwaves */}
      <path d="M50 60V70M60 52V78M70 58V72" stroke="#EC4899" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// 🎤 Speaking Microphone Illustration
export function SpeakingIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="micGrad" x1="30" y1="10" x2="90" y2="110" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F472B6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      <rect x="46" y="24" width="28" height="46" rx="14" fill="url(#micGrad)" />
      <path d="M36 54V60C36 73.2548 46.7452 84 60 84C73.2548 84 84 73.2548 84 60V54" stroke="#F472B6" strokeWidth="5" strokeLinecap="round" />
      <path d="M60 84V98M46 98H74" stroke="#8B5CF6" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

// 📦 Empty State / 404 Illustration
export function EmptyStateIllustration({ size = 80, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="emptyGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="1" stopColor="#6D3CFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="46" fill="url(#emptyGrad)" />
      <path d="M42 48C42 48 50 42 60 42C70 42 78 48 78 48" stroke="#F472B6" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <circle cx="48" cy="56" r="4" fill="#F472B6" />
      <circle cx="72" cy="56" r="4" fill="#F472B6" />
      <path d="M48 76C54 72 66 72 72 76" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// 👑 Premium Crown Illustration
export function PremiumCrownIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="crownGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.5" stopColor="#FBBF24" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
      </defs>

      <path
        d="M24 82L18 36L42 54L60 26L78 54L102 36L96 82H24Z"
        fill="url(#crownGrad)"
        stroke="#FBBF24"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="60" cy="24" r="5" fill="#FFF" />
      <circle cx="18" cy="34" r="4" fill="#FFF" />
      <circle cx="102" cy="34" r="4" fill="#FFF" />
      <rect x="24" y="86" width="72" height="8" rx="4" fill="#D97706" />
    </svg>
  );
}
