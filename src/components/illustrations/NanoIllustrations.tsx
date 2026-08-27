'use client';

import React from 'react';

interface IllustrationProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 🧠 Official MindForge Mascot — "Kumo" (くもくん) Whiteboard Vector
export function MindForgeMascotIllustration({ size = 80, className = '', ...props }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Soft Warm Glow */}
        <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD1DC" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFE4EC" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background Soft Glow */}
      <circle cx="80" cy="80" r="70" fill="url(#mascotGlow)" />

      {/* Sparkles */}
      <path d="M30 40L33 46L39 49L33 52L30 58L27 52L21 49L27 46L30 40Z" fill="#FCC419" />
      <path d="M135 48L137 52L141 54L137 56L135 60L133 56L129 54L133 52L135 48Z" fill="#FCC419" />
      <path d="M24 88C22 84 25 80 29 82C33 84 31 92 27 92C25 92 24 90 24 88Z" fill="#FF8EA3" />
      <path d="M136 84C134 80 137 76 141 78C145 80 143 88 139 88C137 88 136 86 136 84Z" fill="#FF8EA3" />

      {/* Mascot Brain Cloud Body */}
      <g filter="drop-shadow(0px 4px 10px rgba(255, 107, 139, 0.2))">
        {/* Cloud bumps */}
        <circle cx="55" cy="70" r="26" fill="#FFAEC0" />
        <circle cx="105" cy="70" r="26" fill="#FFAEC0" />
        <circle cx="80" cy="54" r="28" fill="#FFAEC0" />
        <circle cx="52" cy="94" r="24" fill="#FFAEC0" />
        <circle cx="108" cy="94" r="24" fill="#FFAEC0" />
        <circle cx="80" cy="98" r="28" fill="#FFAEC0" />
        {/* Core highlight surface */}
        <circle cx="56" cy="68" r="23" fill="#FFC2D1" />
        <circle cx="104" cy="68" r="23" fill="#FFC2D1" />
        <circle cx="80" cy="52" r="25" fill="#FFD1DC" />
        <circle cx="53" cy="92" r="21" fill="#FFBCCB" />
        <circle cx="107" cy="92" r="21" fill="#FFBCCB" />
        <circle cx="80" cy="96" r="25" fill="#FFC2D1" />
      </g>

      {/* Headband Ties (Back) */}
      <path d="M118 62L132 54C134 52 138 56 136 60L126 68L138 72C140 76 136 80 132 78L118 70Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Headband Body (Hachimaki) */}
      <path d="M42 66C42 66 60 56 80 56C100 56 118 66 118 66L116 78C116 78 98 68 80 68C62 68 44 78 44 78L42 66Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="3" strokeLinejoin="round" />

      {/* Kanji Text on Headband: 日本語 */}
      <text x="80" y="73" textAnchor="middle" fill="#2D2426" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
        日本語
      </text>

      {/* Cute Eyes */}
      {/* Left Eye: Open sparkly */}
      <ellipse cx="68" cy="85" rx="4.5" ry="6" fill="#2D2426" />
      <circle cx="66.5" cy="82.5" r="2" fill="#FFFFFF" />
      {/* Right Eye: Cute Wink ^ or > */}
      <path d="M89 83L95 86L89 89" stroke="#2D2426" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Rosy Blush Cheeks */}
      <ellipse cx="58" cy="92" rx="6" ry="4" fill="#FF6B8B" opacity="0.6" />
      <ellipse cx="102" cy="92" rx="6" ry="4" fill="#FF6B8B" opacity="0.6" />

      {/* Happy Smile */}
      <path d="M76 90C76 93.5 84 93.5 84 90" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M78 91C78 93 82 93 82 91Z" fill="#FF4D6D" />

      {/* Open Japanese Textbook */}
      <g filter="drop-shadow(0px 3px 6px rgba(0,0,0,0.12))">
        {/* Book Cover */}
        <path d="M52 108L78 116V142L52 134Z" fill="#FF4D6D" stroke="#2D2426" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M108 108L82 116V142L108 134Z" fill="#FF4D6D" stroke="#2D2426" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Book Pages */}
        <path d="M54 106L78 113V138L54 131Z" fill="#FFF8F0" stroke="#2D2426" strokeWidth="1.5" />
        <path d="M106 106L82 113V138L106 131Z" fill="#FFF8F0" stroke="#2D2426" strokeWidth="1.5" />
        {/* Hiragana Character "あ" on right page */}
        <text x="94" y="128" textAnchor="middle" fill="#2D2426" fontSize="13" fontWeight="900" fontFamily="sans-serif">
          あ
        </text>
        {/* Bookmark lines on left page */}
        <path d="M60 114H72M60 120H70M60 126H68" stroke="#FF8EA3" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Cute Mascot Hands Holding Book */}
      <circle cx="50" cy="118" r="6" fill="#FFAEC0" stroke="#2D2426" strokeWidth="2.5" />
      <circle cx="110" cy="118" r="6" fill="#FFAEC0" stroke="#2D2426" strokeWidth="2.5" />
    </svg>
  );
}

// 🌸 Hiragana Icon Illustration (Coral Pink Card with 'あ')
export function HiraganaIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FFF0F3" stroke="#FFB3C1" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      <text x="50" y="62" textAnchor="middle" fill="#FF4D6D" fontSize="42" fontWeight="900" fontFamily="sans-serif">
        あ
      </text>
      <circle cx="78" cy="24" r="3" fill="#FF6B8B" />
      <circle cx="22" cy="76" r="2.5" fill="#FCC419" />
    </svg>
  );
}

// 🔷 Katakana Icon Illustration (Sky Blue Card with 'ア')
export function KatakanaIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#E7F5FF" stroke="#A5D8FF" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      <text x="50" y="62" textAnchor="middle" fill="#228BE6" fontSize="42" fontWeight="900" fontFamily="sans-serif">
        ア
      </text>
      <circle cx="78" cy="24" r="3" fill="#339AF0" />
      <circle cx="22" cy="76" r="2.5" fill="#51CF66" />
    </svg>
  );
}

// 🏯 Kanji Icon Illustration (Royal Lavender Card with '日' on easel)
export function KanjiIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#F3F0FF" stroke="#D0BFFF" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      <text x="50" y="62" textAnchor="middle" fill="#7950F2" fontSize="40" fontWeight="900" fontFamily="sans-serif">
        日
      </text>
      <path d="M68 68L78 78M74 68L80 74" stroke="#FCC419" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 📒 Vocabulary Icon Illustration (Butter Yellow Card with Flashcard binder)
export function VocabIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FFF9DB" stroke="#FFE066" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      {/* Mini Flashcard */}
      <rect x="26" y="24" width="48" height="52" rx="10" fill="#FFF9DB" stroke="#2D2426" strokeWidth="2.5" />
      <circle cx="34" cy="34" r="2.5" fill="#2D2426" />
      <circle cx="34" cy="50" r="2.5" fill="#2D2426" />
      <circle cx="34" cy="66" r="2.5" fill="#2D2426" />
      <text x="54" y="56" textAnchor="middle" fill="#F59F00" fontSize="22" fontWeight="900" fontFamily="sans-serif">
        あ
      </text>
    </svg>
  );
}

// 💬 Grammar Node Illustration (Fresh Mint Card with speech bubble)
export function GrammarIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#E6FCF5" stroke="#96F2D7" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      <path d="M26 36C26 28 34 22 50 22C66 22 74 28 74 36C74 44 66 50 50 50C44 50 40 52 32 58C34 52 26 48 26 36Z" fill="#E6FCF5" stroke="#2D2426" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="40" cy="36" r="3" fill="#20C997" />
      <circle cx="50" cy="36" r="3" fill="#20C997" />
      <circle cx="60" cy="36" r="3" fill="#20C997" />
    </svg>
  );
}

// 🔥 Streak Illustration (Campfire in warm orange)
export function StreakIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FFE8CC" stroke="#FFD8A8" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      {/* Outer Flame */}
      <path d="M50 20C50 20 66 38 66 56C66 66 58 74 50 74C42 74 34 66 34 56C34 44 44 32 50 20Z" fill="#FF922B" stroke="#2D2426" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Inner Flame */}
      <path d="M50 40C50 40 58 48 58 58C58 64 54 68 50 68C46 68 42 64 42 58C42 50 48 44 50 40Z" fill="#FCC419" />
    </svg>
  );
}

// 🎧 Listening Soundwave Illustration
export function ListeningIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FFF0F6" stroke="#FCC2D7" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      {/* Headphone Band */}
      <path d="M30 52V46C30 34 38 26 50 26C62 26 70 34 70 46V52" stroke="#2D2426" strokeWidth="3" strokeLinecap="round" />
      {/* Ear cups */}
      <rect x="24" y="48" width="12" height="22" rx="6" fill="#F06595" stroke="#2D2426" strokeWidth="2.5" />
      <rect x="64" y="48" width="12" height="22" rx="6" fill="#F06595" stroke="#2D2426" strokeWidth="2.5" />
      {/* Musical note */}
      <path d="M46 62V48L54 52V64" stroke="#FF6B8B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="44" cy="62" r="3" fill="#FF6B8B" />
      <circle cx="52" cy="64" r="3" fill="#FF6B8B" />
    </svg>
  );
}

// 🎤 Speaking Illustration
export function SpeakingIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FFF4E6" stroke="#FFE8CC" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      <rect x="42" y="26" width="16" height="30" rx="8" fill="#FF922B" stroke="#2D2426" strokeWidth="2.5" />
      <path d="M34 46V50C34 58 41 64 50 64C59 64 66 58 66 50V46" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 64V74M40 74H60" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// 🏆 Leaderboard / Trophy Illustration
export function TrophyIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#FFF3BF" stroke="#FFE066" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      {/* Trophy cup */}
      <path d="M34 30H66V46C66 56 58 62 50 62C42 62 34 56 34 46V30Z" fill="#FCC419" stroke="#2D2426" strokeWidth="2.5" />
      <path d="M34 36H24C24 46 32 48 34 48" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />
      <path d="M66 36H76C76 46 68 48 66 48" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 62V72M38 72H62" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 38L52 42L56 43L53 46L54 50L50 48L46 50L47 46L44 43L48 42L50 38Z" fill="#FFFFFF" />
    </svg>
  );
}

// ✍️ Writing Practice Illustration
export function WritingIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="8" y="8" width="84" height="84" rx="22" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="2" />
      <rect x="12" y="12" width="76" height="76" rx="18" fill="#FFFFFF" />
      {/* Wooden pencil */}
      <g transform="rotate(-35 50 50)">
        <rect x="42" y="24" width="16" height="46" fill="#FCC419" stroke="#2D2426" strokeWidth="2" />
        <rect x="42" y="24" width="16" height="8" fill="#FF8787" stroke="#2D2426" strokeWidth="2" />
        <path d="M42 70L50 84L58 70Z" fill="#FFE8CC" stroke="#2D2426" strokeWidth="2" />
        <path d="M48 80L50 84L52 80Z" fill="#2D2426" />
      </g>
    </svg>
  );
}

// 📦 Empty State / Placeholder Illustration
export function EmptyStateIllustration({ size = 80, className = '', ...props }: IllustrationProps) {
  return <MindForgeMascotIllustration size={size} className={className} {...props} />;
}

// 👑 Premium Crown Illustration
export function PremiumCrownIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return <TrophyIllustration size={size} className={className} {...props} />;
}

// 🌸 Sakura AI Sensei Legacy alias
export function SakuraAiIllustration({ size = 64, className = '', ...props }: IllustrationProps) {
  return <MindForgeMascotIllustration size={size} className={className} {...props} />;
}
