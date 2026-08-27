'use client';

import React from 'react';

interface WhiteboardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 🏠 1. Home Icon (Cottage + Heart)
export function IconHome({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF0F3" stroke="#FFD6E0" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* Roof */}
      <path d="M18 32L32 20L46 32" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#FFAEC0" />
      {/* House Body */}
      <path d="M22 30V44H42V30" stroke="#2D2426" strokeWidth="2.5" strokeLinejoin="round" fill="#FFF4E6" />
      {/* Door */}
      <rect x="28" y="34" width="8" height="10" rx="3" fill="#D4A373" stroke="#2D2426" strokeWidth="1.5" />
      {/* Window */}
      <circle cx="38" cy="36" r="2.5" fill="#A5D8FF" stroke="#2D2426" strokeWidth="1" />
      {/* Mini Heart above chimney */}
      <path d="M43 19C41.5 17 40 18.5 40 18.5C40 18.5 38.5 17 37 19C35.5 21 38.5 23.5 40 25C41.5 23.5 44.5 21 43 19Z" fill="#FF4D6D" />
    </svg>
  );
}

// 📖 2. Learn Icon (Open Japanese Textbook)
export function IconLearn({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF0F3" stroke="#FFD6E0" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* Book Covers */}
      <path d="M16 22C24 20 32 24 32 24C32 24 40 20 48 22V44C40 42 32 46 32 46C32 46 24 42 16 44V22Z" fill="#FFAEC0" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
      {/* Book Pages */}
      <path d="M18 24C24 22 31 25 31 25V43C24 41 18 42 18 42V24Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="1" />
      <path d="M46 24C40 22 33 25 33 25V43C40 41 46 42 46 42V24Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="1" />
      {/* Bookmark Ribbon */}
      <path d="M32 24V34L35 32L38 34V24" fill="#FF4D6D" />
    </svg>
  );
}

// ✏️ 3. Practice Icon (Wooden Pencil with Sparkles)
export function IconPractice({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF9DB" stroke="#FFE066" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* Pencil */}
      <g transform="rotate(-40 32 32)">
        <rect x="27" y="16" width="10" height="28" rx="2" fill="#FCC419" stroke="#2D2426" strokeWidth="2" />
        <rect x="27" y="16" width="10" height="6" fill="#FF8787" stroke="#2D2426" strokeWidth="2" />
        <path d="M27 44L32 54L37 44Z" fill="#FFE8CC" stroke="#2D2426" strokeWidth="2" />
        <path d="M30 50L32 54L34 50Z" fill="#2D2426" />
      </g>
      {/* Sparkles */}
      <path d="M18 20L19.5 23L22.5 24.5L19.5 26L18 29L16.5 26L13.5 24.5L16.5 23L18 20Z" fill="#FCC419" />
      <path d="M46 44L47 46L49 47L47 48L46 50L45 48L43 47L45 46L46 44Z" fill="#FCC419" />
    </svg>
  );
}

// 📋 4. Review Icon (Checklist Clipboard)
export function IconReview({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#E6FCF5" stroke="#96F2D7" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* Board */}
      <rect x="18" y="18" width="28" height="32" rx="6" fill="#E6FCF5" stroke="#2D2426" strokeWidth="2" />
      {/* Clip */}
      <rect x="26" y="15" width="12" height="6" rx="3" fill="#D4A373" stroke="#2D2426" strokeWidth="1.5" />
      {/* Checks */}
      <path d="M24 26L27 29L34 23" stroke="#20C997" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 34L27 37L34 31" stroke="#20C997" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 42L27 45L34 39" stroke="#20C997" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Star Badge */}
      <circle cx="42" cy="42" r="6" fill="#FCC419" stroke="#2D2426" strokeWidth="1.5" />
    </svg>
  );
}

// 🌸 5. Hiragana Icon ('あ')
export function IconHiragana({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF0F3" stroke="#FFB3C1" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <text x="32" y="42" textAnchor="middle" fill="#FF4D6D" fontSize="30" fontWeight="900" fontFamily="sans-serif">
        あ
      </text>
    </svg>
  );
}

// 🔷 6. Katakana Icon ('ア')
export function IconKatakana({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#E7F5FF" stroke="#A5D8FF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <text x="32" y="42" textAnchor="middle" fill="#228BE6" fontSize="30" fontWeight="900" fontFamily="sans-serif">
        ア
      </text>
    </svg>
  );
}

// 🏯 7. Kanji Icon ('日')
export function IconKanji({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F3F0FF" stroke="#D0BFFF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <text x="32" y="42" textAnchor="middle" fill="#7950F2" fontSize="28" fontWeight="900" fontFamily="sans-serif">
        日
      </text>
    </svg>
  );
}

// 📒 8. Vocabulary Icon (Binder)
export function IconVocabulary({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF9DB" stroke="#FFE066" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <rect x="18" y="16" width="28" height="34" rx="6" fill="#FFF9DB" stroke="#2D2426" strokeWidth="2" />
      <circle cx="22" cy="23" r="1.5" fill="#2D2426" />
      <circle cx="22" cy="33" r="1.5" fill="#2D2426" />
      <circle cx="22" cy="43" r="1.5" fill="#2D2426" />
      <text x="35" y="38" textAnchor="middle" fill="#F59F00" fontSize="18" fontWeight="900" fontFamily="sans-serif">
        あ
      </text>
    </svg>
  );
}

// 💬 9. Grammar Icon (Speech Bubble)
export function IconGrammar({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F3F0FF" stroke="#D0BFFF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <path d="M16 26C16 20 22 16 32 16C42 16 48 20 48 26C48 32 42 36 32 36C28 36 26 38 20 42C21 38 16 34 16 26Z" fill="#D0BFFF" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="25" cy="26" r="2" fill="#7950F2" />
      <circle cx="32" cy="26" r="2" fill="#7950F2" />
      <circle cx="39" cy="26" r="2" fill="#7950F2" />
    </svg>
  );
}

// 🎧 10. Listening Icon (Headphones)
export function IconListening({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF0F6" stroke="#FCC2D7" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <path d="M20 34V30C20 22 25 16 32 16C39 16 44 22 44 30V34" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="16" y="32" width="8" height="14" rx="4" fill="#F06595" stroke="#2D2426" strokeWidth="2" />
      <rect x="40" y="32" width="8" height="14" rx="4" fill="#F06595" stroke="#2D2426" strokeWidth="2" />
      {/* Musical note */}
      <circle cx="30" cy="38" r="2" fill="#FF6B8B" />
      <path d="M32 38V30" stroke="#FF6B8B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 🗣️ 11. Speaking Icon (Voice Dialogue)
export function IconSpeaking({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF4E6" stroke="#FFE8CC" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* Mascot / Student Face */}
      <circle cx="30" cy="32" r="12" fill="#FFAEC0" stroke="#2D2426" strokeWidth="2" />
      <circle cx="26" cy="30" r="1.5" fill="#2D2426" />
      <circle cx="34" cy="30" r="1.5" fill="#2D2426" />
      <path d="M28 34C28 36 32 36 32 34" stroke="#2D2426" strokeWidth="1.5" strokeLinecap="round" />
      {/* Speech dots bubble */}
      <circle cx="44" cy="22" r="6" fill="#FFE8CC" stroke="#2D2426" strokeWidth="1.5" />
      <circle cx="42" cy="22" r="1" fill="#FF922B" />
      <circle cx="44" cy="22" r="1" fill="#FF922B" />
      <circle cx="46" cy="22" r="1" fill="#FF922B" />
    </svg>
  );
}

// 🔥 12. Streak Icon (Campfire)
export function IconStreak({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFE8CC" stroke="#FFD8A8" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <path d="M32 16C32 16 42 28 42 38C42 44 38 48 32 48C26 48 22 44 22 38C22 30 28 22 32 16Z" fill="#FF922B" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 28C32 28 37 34 37 40C37 44 35 46 32 46C29 46 27 44 27 40C27 34 30 30 32 28Z" fill="#FCC419" />
    </svg>
  );
}

// 📊 13. Progress Icon (Rising Bars)
export function IconProgress({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#EBFBEE" stroke="#B2F2BB" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <rect x="18" y="36" width="6" height="12" rx="2" fill="#69DB7C" stroke="#2D2426" strokeWidth="1.5" />
      <rect x="28" y="28" width="6" height="20" rx="2" fill="#38D9A9" stroke="#2D2426" strokeWidth="1.5" />
      <rect x="38" y="20" width="6" height="28" rx="2" fill="#FF6B8B" stroke="#2D2426" strokeWidth="1.5" />
      {/* Golden Star on top of 3rd bar */}
      <path d="M41 12L42 14L44 14.5L42.5 16L43 18L41 17L39 18L39.5 16L38 14.5L40 14L41 12Z" fill="#FCC419" stroke="#2D2426" strokeWidth="1" />
    </svg>
  );
}

// 🏆 14. Leaderboard Icon (Podium + Crown)
export function IconLeaderboard({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF3BF" stroke="#FFE066" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* 2nd place */}
      <rect x="16" y="32" width="10" height="16" fill="#D0BFFF" stroke="#2D2426" strokeWidth="1.5" />
      <text x="21" y="43" textAnchor="middle" fill="#2D2426" fontSize="8" fontWeight="bold">2</text>
      {/* 1st place */}
      <rect x="26" y="26" width="12" height="22" fill="#FFE066" stroke="#2D2426" strokeWidth="1.5" />
      <text x="32" y="39" textAnchor="middle" fill="#2D2426" fontSize="10" fontWeight="bold">1</text>
      {/* 3rd place */}
      <rect x="38" y="36" width="10" height="12" fill="#FFC9C9" stroke="#2D2426" strokeWidth="1.5" />
      <text x="43" y="45" textAnchor="middle" fill="#2D2426" fontSize="8" fontWeight="bold">3</text>
      {/* Crown */}
      <path d="M27 22L29 18L32 20L35 18L37 22H27Z" fill="#FCC419" stroke="#2D2426" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// 👤 15. Profile Icon (Anime Student)
export function IconProfile({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      {/* Head */}
      <circle cx="32" cy="26" r="10" fill="#FFAEC0" stroke="#2D2426" strokeWidth="2" />
      <circle cx="29" cy="25" r="1.5" fill="#2D2426" />
      <circle cx="35" cy="25" r="1.5" fill="#2D2426" />
      <path d="M30 28C30 30 34 30 34 28" stroke="#2D2426" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body / Shirt */}
      <path d="M20 46C20 38 25 36 32 36C39 36 44 38 44 46" fill="#A5D8FF" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// ⚙️ 16. Settings Icon (Mechanical Gear)
export function IconSettings({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <circle cx="32" cy="32" r="10" fill="#CED4DA" stroke="#2D2426" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="#FFFFFF" stroke="#2D2426" strokeWidth="2" />
      {/* Cog teeth */}
      <rect x="30" y="18" width="4" height="4" rx="1" fill="#CED4DA" stroke="#2D2426" strokeWidth="1.5" />
      <rect x="30" y="42" width="4" height="4" rx="1" fill="#CED4DA" stroke="#2D2426" strokeWidth="1.5" />
      <rect x="18" y="30" width="4" height="4" rx="1" fill="#CED4DA" stroke="#2D2426" strokeWidth="1.5" />
      <rect x="42" y="30" width="4" height="4" rx="1" fill="#CED4DA" stroke="#2D2426" strokeWidth="1.5" />
    </svg>
  );
}

// 🛍️ 17. Shop Icon (Lavender Tote Bag)
export function IconShop({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F3F0FF" stroke="#D0BFFF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <path d="M26 26V22C26 18 29 16 32 16C35 16 38 18 38 22V26" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />
      <rect x="20" y="26" width="24" height="22" rx="6" fill="#D0BFFF" stroke="#2D2426" strokeWidth="2" />
      <path d="M30 32C30 34 34 34 34 32" stroke="#FF6B8B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 🎁 18. Rewards Icon (Gift Box)
export function IconRewards({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF0F3" stroke="#FFB3C1" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <rect x="20" y="28" width="24" height="18" rx="4" fill="#FFAEC0" stroke="#2D2426" strokeWidth="2" />
      <rect x="18" y="24" width="28" height="6" rx="2" fill="#FF4D6D" stroke="#2D2426" strokeWidth="2" />
      {/* Ribbon */}
      <rect x="30" y="24" width="4" height="22" fill="#FCC419" stroke="#2D2426" strokeWidth="1" />
      {/* Bow */}
      <circle cx="28" cy="20" r="3" fill="#FCC419" stroke="#2D2426" strokeWidth="1.5" />
      <circle cx="36" cy="20" r="3" fill="#FCC419" stroke="#2D2426" strokeWidth="1.5" />
    </svg>
  );
}

// 🔔 19. Notifications Icon (Golden Bell)
export function IconNotifications({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#FFF9DB" stroke="#FFE066" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <path d="M32 18C26 18 22 24 22 34H42C42 24 38 18 32 18Z" fill="#FCC419" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" />
      <rect x="20" y="34" width="24" height="4" rx="2" fill="#FCC419" stroke="#2D2426" strokeWidth="1.5" />
      <circle cx="32" cy="41" r="3" fill="#D4A373" stroke="#2D2426" strokeWidth="1.5" />
      {/* Red alert dot */}
      <circle cx="42" cy="20" r="3.5" fill="#FF4D6D" stroke="#FFFFFF" strokeWidth="1.5" />
    </svg>
  );
}

// 🔍 20. Search Icon (Magnifying Glass)
export function IconSearch({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#E7F5FF" stroke="#A5D8FF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <circle cx="28" cy="28" r="10" fill="#A5D8FF" stroke="#2D2426" strokeWidth="2.5" />
      <path d="M36 36L46 46" stroke="#2D2426" strokeWidth="3.5" strokeLinecap="round" />
      {/* Lens reflection */}
      <path d="M24 24C26 22 29 22 31 23" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ••• 21. More Icon (Horizontal Dots)
export function IconMore({ size = 48, className = '', ...props }: WhiteboardIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#F8F9FA" stroke="#E9ECEF" strokeWidth="1.5" />
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#FFFFFF" />
      <rect x="18" y="24" width="28" height="16" rx="8" fill="#F1F3F5" stroke="#2D2426" strokeWidth="2" />
      <circle cx="26" cy="32" r="2" fill="#2D2426" />
      <circle cx="32" cy="32" r="2" fill="#2D2426" />
      <circle cx="38" cy="32" r="2" fill="#2D2426" />
    </svg>
  );
}
