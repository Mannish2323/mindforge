'use client';

import React from 'react';

export type MFIconType =
  | 'home'
  | 'learn'
  | 'practice'
  | 'review'
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'speaking'
  | 'kanji'
  | 'hiragana'
  | 'katakana'
  | 'progress'
  | 'streak'
  | 'flame'
  | 'heart'
  | 'xp'
  | 'zap'
  | 'star'
  | 'crown'
  | 'seedling'
  | 'robot'
  | 'sparkles'
  | 'wave'
  | 'question'
  | 'user'
  | 'shield'
  | 'gift'
  | 'trophy'
  | 'card'
  | 'check'
  | 'lock'
  | 'travel'
  | 'career'
  | 'anime'
  | 'conversation'
  | 'study'
  | 'food'
  | 'music'
  | 'game'
  | 'culture'
  | 'search'
  | 'settings'
  | 'notifications'
  | 'shop'
  | 'rewards'
  | 'leaderboard'
  | 'profile'
  | 'more'
  | 'back'
  | 'forward'
  | 'close'
  | 'menu'
  | 'warning'
  | 'error'
  | 'success'
  | 'play'
  | 'pause'
  | 'audio'
  | 'microphone'
  | 'camera'
  | 'upload'
  | 'download'
  | 'edit'
  | 'delete'
  | 'share'
  | 'bookmarks'
  | 'jlpt'
  | 'reading'
  | 'writing'
  | 'quiz'
  | 'ai-tutor'
  | 'community'
  | 'achievements'
  | 'subscription';

export interface MFIconProps extends React.SVGProps<SVGSVGElement> {
  name: MFIconType;
  size?: number;
  className?: string;
  variant?: 'card' | 'transparent';
  active?: boolean;
}

export const MFIcon: React.FC<MFIconProps> = ({
  name,
  size = 24,
  className = '',
  variant = 'transparent',
  active = false,
  ...props
}) => {
  const renderIcon = () => {
    switch (name) {
      // ── Core Navigation ───────────────────────────────────────────────────
      case 'home':
        return (
          <>
            <path d="M6 13L16 5L26 13" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="#FFAEC0" />
            <path d="M9 11.5V23H23V11.5" stroke="#2D2426" strokeWidth="2" strokeLinejoin="round" fill="#FFF4E6" />
            <rect x="13" y="16" width="6" height="7" rx="1.5" fill="#D4A373" stroke="#2D2426" strokeWidth="1.2" />
          </>
        );

      case 'learn':
      case 'study':
        return (
          <>
            <path d="M4 8C9 6 16 9 16 9C16 9 23 6 28 8V24C23 22 16 25 16 25C16 25 9 22 4 24V8Z" fill="#FFAEC0" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M6 9.5C10 8 15 10 15 10V23.5C10 21.5 6 22.5 6 22.5V9.5Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="0.8" />
            <path d="M26 9.5C22 8 17 10 17 10V23.5C22 21.5 26 22.5 26 22.5V9.5Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="0.8" />
            <path d="M16 10V18L18 16.5L20 18V10" fill="#FF4D6D" />
          </>
        );

      case 'practice':
        return (
          <g transform="rotate(-35 16 16)">
            <rect x="13" y="6" width="6" height="18" rx="1.5" fill="#FCC419" stroke="#2D2426" strokeWidth="1.8" />
            <rect x="13" y="6" width="6" height="4" fill="#FF8787" stroke="#2D2426" strokeWidth="1.5" />
            <path d="M13 24L16 29L19 24Z" fill="#FFE8CC" stroke="#2D2426" strokeWidth="1.5" />
            <path d="M15 27L16 29L17 27Z" fill="#2D2426" />
          </g>
        );

      case 'review':
        return (
          <>
            <rect x="5" y="5" width="22" height="22" rx="7" fill="#F3E8FF" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M16 8V16L22 19" stroke="#AF52DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="8" stroke="#2D2426" strokeWidth="1.8" strokeDasharray="3 2" fill="none" />
          </>
        );

      // ── Japanese Categories ───────────────────────────────────────────────
      case 'hiragana':
        return (
          <>
            <rect x="3" y="3" width="26" height="26" rx="8" fill="#FFF0F3" stroke="#FFD6E0" strokeWidth="1.5" />
            <text x="16" y="21" fontFamily="sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#FF4D6D">
              あ
            </text>
          </>
        );

      case 'katakana':
        return (
          <>
            <rect x="3" y="3" width="26" height="26" rx="8" fill="#E6FCF5" stroke="#96F2D7" strokeWidth="1.5" />
            <text x="16" y="21" fontFamily="sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#0CA678">
              カ
            </text>
          </>
        );

      case 'kanji':
        return (
          <>
            <rect x="3" y="3" width="26" height="26" rx="8" fill="#FFF9DB" stroke="#FFE066" strokeWidth="1.5" />
            <text x="16" y="21" fontFamily="sans-serif" fontSize="15" fontWeight="bold" textAnchor="middle" fill="#F08C00">
              日
            </text>
          </>
        );

      case 'vocabulary':
        return (
          <>
            <rect x="3" y="3" width="26" height="26" rx="8" fill="#F3F0FF" stroke="#D0BFFF" strokeWidth="1.5" />
            <path d="M9 10H23M9 16H23M9 22H17" stroke="#7048E8" strokeWidth="2.2" strokeLinecap="round" />
          </>
        );

      case 'grammar':
        return (
          <>
            <rect x="3" y="3" width="26" height="26" rx="8" fill="#E7F5FF" stroke="#A5D8FF" strokeWidth="1.5" />
            <path d="M8 8H24V24H8Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="1.5" />
            <path d="M11 12H21M11 16H18M11 20H15" stroke="#1C7ED6" strokeWidth="1.8" strokeLinecap="round" />
          </>
        );

      case 'listening':
        return (
          <>
            <path d="M6 16C6 10.4772 10.4772 6 16 6C21.5228 6 26 10.4772 26 16V22" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="none" />
            <rect x="4" y="16" width="6" height="9" rx="3" fill="#74C0FC" stroke="#2D2426" strokeWidth="1.8" />
            <rect x="22" y="16" width="6" height="9" rx="3" fill="#74C0FC" stroke="#2D2426" strokeWidth="1.8" />
          </>
        );

      case 'speaking':
        return (
          <>
            <rect x="11" y="5" width="10" height="15" rx="5" fill="#FF8FA3" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M6 14C6 19.5 10.5 24 16 24C21.5 24 26 19.5 26 14" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M16 24V28M11 28H21" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      // ── Gamification & Stats ──────────────────────────────────────────────
      case 'streak':
      case 'flame':
        return (
          <>
            <path
              d="M16 4C16 4 19 8 19 11C19 12.5 18 13.5 16 13.5C14 13.5 13 12 13 10C9 14 7 19 9 23C11 27 16 28 20 26C24 24 25 18 22 14C21 17 19 18 17 17C15 16 16 13 18 9C19 7 16 4 16 4Z"
              fill="#FF922B"
              stroke="#2D2426"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path d="M16 17C14.5 19 15 22 17 23C19 24 20 22 19 20C18.5 19 17.5 18 16 17Z" fill="#FFE066" />
          </>
        );

      case 'heart':
        return (
          <path
            d="M16 8C13.5 4 8 5 6 9.5C4 14 8.5 19.5 16 26C23.5 19.5 28 14 26 9.5C24 5 18.5 4 16 8Z"
            fill="#FF4D6D"
            stroke="#2D2426"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        );

      case 'xp':
      case 'zap':
        return (
          <path
            d="M17 3L7 16H16L14 29L25 14H16L17 3Z"
            fill="#FCC419"
            stroke="#2D2426"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        );

      case 'star':
        return (
          <path
            d="M16 4L19.5 11.5L28 12.5L21.5 18.5L23.5 27L16 22.5L8.5 27L10.5 18.5L4 12.5L12.5 11.5L16 4Z"
            fill="#FFD43B"
            stroke="#2D2426"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        );

      case 'crown':
        return (
          <>
            <path d="M5 23L7 9L12.5 16L16 8L19.5 16L25 9L27 23H5Z" fill="#FAB005" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="7" cy="8" r="1.5" fill="#FF8787" />
            <circle cx="16" cy="7" r="1.5" fill="#4DABF7" />
            <circle cx="25" cy="8" r="1.5" fill="#69DB7C" />
          </>
        );

      case 'trophy':
        return (
          <>
            <path d="M9 7H23V15C23 18.5 19.5 21 16 21C12.5 21 9 18.5 9 15V7Z" fill="#FCC419" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 10H5C5 14 7.5 15.5 9 15.5" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M23 10H27C27 14 24.5 15.5 23 15.5" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M16 21V25M11 25H21" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'sparkles':
        return (
          <>
            <path d="M16 4L18 11L25 13L18 15L16 22L14 15L7 13L14 11L16 4Z" fill="#FCC419" stroke="#2D2426" strokeWidth="1.2" />
            <path d="M25 20L26 23L29 24L26 25L25 28L24 25L21 24L24 23L25 20Z" fill="#FF8FA3" />
          </>
        );

      case 'gift':
        return (
          <>
            <rect x="5" y="11" width="22" height="15" rx="3" fill="#63E6BE" stroke="#2D2426" strokeWidth="1.8" />
            <rect x="4" y="8" width="24" height="4" rx="1.5" fill="#FF8FA3" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M16 8V26" stroke="#FF4D6D" strokeWidth="2" />
            <path d="M13 5C11 3 8 5 10 7L16 8L12 7" stroke="#FF4D6D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M19 5C21 3 24 5 22 7L16 8L20 7" stroke="#FF4D6D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </>
        );

      case 'seedling':
        return (
          <>
            <path d="M16 26V16C16 12 12 10 7 11C7 16 10 19 16 19" fill="#69DB7C" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M16 16C16 11 20 8 26 9C26 15 22 18 16 18" fill="#8CE99A" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
          </>
        );

      case 'robot':
        return (
          <>
            <rect x="7" y="10" width="18" height="14" rx="4" fill="#E5DBFF" stroke="#2D2426" strokeWidth="1.8" />
            <circle cx="12" cy="16" r="2" fill="#7048E8" />
            <circle cx="20" cy="16" r="2" fill="#7048E8" />
            <path d="M13 20H19" stroke="#2D2426" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 6V10M14 6H18" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" />
          </>
        );

      case 'wave':
        return (
          <path
            d="M10 12C9 9 12 8 13 11L14 7C15 5 18 6 18 9V6C19 4 22 5 22 8V8C23 6 26 8 25 11V18C25 22 21 25 17 25C13 25 9 21 9 17L10 12Z"
            fill="#FFE8CC"
            stroke="#2D2426"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        );

      case 'question':
        return (
          <>
            <circle cx="16" cy="16" r="12" fill="#FFF9DB" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M13 11C13 9.5 14.5 8.5 16 8.5C17.5 8.5 19 9.5 19 11C19 13.5 16 14 16 16.5" stroke="#F08C00" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="16" cy="20.5" r="1.2" fill="#F08C00" />
          </>
        );

      case 'user':
      case 'profile':
        return (
          <>
            <circle cx="16" cy="11" r="5" fill="#FFAEC0" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M7 25C7 20.5 11 18 16 18C21 18 25 20.5 25 25" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="#FFF0F3" />
          </>
        );

      case 'shield':
        return (
          <path
            d="M16 4L26 8V15C26 21 21 26 16 28C11 26 6 21 6 15V8L16 4Z"
            fill="#E6FCF5"
            stroke="#2D2426"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        );

      case 'card':
        return (
          <>
            <rect x="4" y="7" width="24" height="18" rx="4" fill="#FFFDF9" stroke="#2D2426" strokeWidth="1.8" />
            <rect x="4" y="11" width="24" height="4" fill="#FF8FA3" />
            <rect x="8" y="19" width="6" height="2" rx="1" fill="#D4D0E2" />
          </>
        );

      case 'check':
        return (
          <path
            d="M7 16L13 22L25 9"
            stroke="#0CA678"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        );

      case 'lock':
        return (
          <>
            <rect x="7" y="13" width="18" height="13" rx="3" fill="#FFEAA7" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M11 13V9C11 6.5 13 4.5 16 4.5C19 4.5 21 6.5 21 9V13" stroke="#2D2426" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="16" cy="19.5" r="1.5" fill="#2D2426" />
          </>
        );

      case 'travel':
        return (
          <>
            <rect x="8" y="10" width="16" height="16" rx="3" fill="#74C0FC" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M12 10V6H20V10" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <path d="M14 10V26M18 10V26" stroke="#2D2426" strokeWidth="1.2" />
          </>
        );

      case 'career':
        return (
          <>
            <rect x="6" y="11" width="20" height="14" rx="3" fill="#D4A373" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M11 11V8H21V11" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            <rect x="14" y="16" width="4" height="3" rx="1" fill="#FCC419" stroke="#2D2426" strokeWidth="1" />
          </>
        );

      case 'anime':
        return (
          <>
            <rect x="5" y="8" width="22" height="16" rx="4" fill="#FFAEC0" stroke="#2D2426" strokeWidth="1.8" />
            <polygon points="13,12 21,16 13,20" fill="#FFFFFF" stroke="#2D2426" strokeWidth="1.2" />
          </>
        );

      case 'conversation':
        return (
          <>
            <path d="M6 8C6 6 8 4 10 4H22C24 4 26 6 26 8V16C26 18 24 20 22 20H12L7 24V20H10C8 20 6 18 6 16V8Z" fill="#B197FC" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="11" cy="12" r="1.2" fill="#FFFFFF" />
            <circle cx="16" cy="12" r="1.2" fill="#FFFFFF" />
            <circle cx="21" cy="12" r="1.2" fill="#FFFFFF" />
          </>
        );

      case 'food':
        return (
          <>
            <path d="M6 14C6 21 10 24 16 24C22 24 26 21 26 14H6Z" fill="#FF8787" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M7 10L24 7M10 12L25 9" stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" />
          </>
        );

      case 'music':
        return (
          <>
            <circle cx="10" cy="22" r="3.5" fill="#63E6BE" stroke="#2D2426" strokeWidth="1.8" />
            <circle cx="22" cy="18" r="3.5" fill="#63E6BE" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M13.5 22V8L25.5 4V18" stroke="#2D2426" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );

      case 'game':
        return (
          <>
            <rect x="5" y="10" width="22" height="14" rx="6" fill="#D0BFFF" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M10 14V20M7 17H13" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="20" cy="15" r="1.2" fill="#FF4D6D" />
            <circle cx="23" cy="18" r="1.2" fill="#FCC419" />
          </>
        );

      case 'culture':
        return (
          <>
            <path d="M4 8H28M6 12H26M10 8V26M22 8V26" stroke="#E03153" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M4 6C16 10 28 6 28 6" stroke="#2D2426" strokeWidth="1.8" fill="none" />
          </>
        );

      case 'settings':
        return (
          <>
            <circle cx="16" cy="16" r="4" fill="#FAF6EE" stroke="#2D2426" strokeWidth="1.8" />
            <path d="M16 4V8M16 24V28M4 16H8M24 16H28M7.5 7.5L10.5 10.5M21.5 21.5L24.5 24.5M7.5 24.5L10.5 21.5M21.5 10.5L24.5 7.5" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" />
          </>
        );

      case 'notifications':
        return (
          <>
            <path d="M16 4C11.5 4 9 7.5 9 13C9 17.5 7 19.5 7 19.5H25C25 19.5 23 17.5 23 13C23 7.5 20.5 4 16 4Z" fill="#FEF8E6" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M13 22C13 24 14.3 25.5 16 25.5C17.7 25.5 19 24 19 22" stroke="#2D2426" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <circle cx="22" cy="8" r="4" fill="#F47C86" stroke="#FFFFFF" strokeWidth="1.5"/>
          </>
        );

      case 'search':
        return (
          <>
            <circle cx="14" cy="14" r="8" fill="#F0ECE3" stroke="#2D2426" strokeWidth="2" />
            <path d="M20 20L27 27" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
        
      case 'back':
        return (
          <path d="M20 8L12 16L20 24" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        );

      case 'close':
        return (
          <path d="M8 8L24 24M24 8L8 24" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
        );

      case 'jlpt':
        return (
          <>
            <rect x="6" y="22" width="20" height="5" rx="1.5" fill="#F47C86" stroke="#2D2426" strokeWidth="1.8"/>
            <rect x="8" y="17" width="16" height="3" rx="1" fill="#F47C86" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M8 11H24" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <path d="M6 14H26" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="14" x2="12" y2="22" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="20" y1="14" x2="20" y2="22" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round"/>
          </>
        );

      case 'reading':
        return (
          <>
            <path d="M4 7C9 5 16 8 16 8C16 8 23 5 28 7V23C23 21 16 24 16 24C16 24 9 21 4 23V7Z" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M16 8V24" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M20 5V14L22.5 12L25 14V5" fill="#F47C86" stroke="#2D2426" strokeWidth="1.2"/>
          </>
        );

      case 'writing':
        return (
          <>
            <path d="M8 22L6 26L10 24L22 12L18 8L8 22Z" fill="#FEF0F1" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M18 8L22 12" stroke="#F47C86" strokeWidth="2" strokeLinecap="round"/>
            <path d="M21 7L25 11L23 13L19 9L21 7Z" fill="#F7D774" stroke="#2D2426" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M6 26L10 24" stroke="#2D2426" strokeWidth="1.5" strokeLinecap="round"/>
          </>
        );

      case 'quiz':
        return (
          <>
            <rect x="7" y="5" width="18" height="22" rx="3" fill="#F3E8FF" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M12 5V8H20V5" stroke="#2D2426" strokeWidth="1.8" fill="none"/>
            <rect x="12" y="5" width="8" height="4" rx="1.5" fill="#C8B5E8" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M14 14C14 12.5 14.8 11.5 16 11.5C17.2 11.5 18 12.3 18 13.5C18 15 16 15.5 16 17" stroke="#7048E8" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <circle cx="16" cy="19.5" r="1" fill="#7048E8"/>
          </>
        );

      case 'community':
        return (
          <>
            <circle cx="12" cy="10" r="3.5" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.8"/>
            <circle cx="20" cy="10" r="3.5" fill="#F47C86" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M5 22C5 18.5 8 16.5 12 16.5" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M27 22C27 18.5 24 16.5 20 16.5" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <circle cx="16" cy="13" r="4" fill="#A9DCC8" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M9 22C9 18.8 12.1 17 16 17C19.9 17 23 18.8 23 22" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </>
        );

      case 'achievements':
        return (
          <>
            <path d="M10 7H22V15C22 18 19.5 20 16 20C12.5 20 10 18 10 15V7Z" fill="#FCC419" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M10 10H7C7 13.5 9 15 10 15" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M22 10H25C25 13.5 23 15 22 15" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
            <path d="M16 20V24M12 24H20" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 10L17 12.5L20 12.5L17.5 14.5L18.5 17L16 15L13.5 17L14.5 14.5L12 12.5L15 12.5Z" fill="#FFFFFF" stroke="#2D2426" strokeWidth="0.8"/>
          </>
        );

      case 'subscription':
        return (
          <>
            <path d="M6 22L8 10L13 17L16 9L19 17L24 10L26 22H6Z" fill="#FCC419" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <rect x="5" y="22" width="22" height="3.5" rx="1.5" fill="#FAB005" stroke="#2D2426" strokeWidth="1.5"/>
            <circle cx="8" cy="10" r="1.5" fill="#FF8FA3"/>
            <circle cx="16" cy="9" r="1.5" fill="#74C0FC"/>
            <circle cx="24" cy="10" r="1.5" fill="#69DB7C"/>
          </>
        );

      case 'bookmarks':
        return (
          <>
            <path d="M8 5H24V28L16 22L8 28V5Z" fill="#FEF0F1" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 11H20M12 15H17" stroke="#F47C86" strokeWidth="1.8" strokeLinecap="round"/>
          </>
        );

      case 'edit':
        return (
          <>
            <path d="M5 23L7 27L11 25L25 11L21 7L5 23Z" fill="#EEF7FD" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M21 7L25 11" stroke="#A9D5F5" strokeWidth="2" strokeLinecap="round"/>
            <path d="M23 5L27 9L25 11L21 7L23 5Z" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.5" strokeLinejoin="round"/>
          </>
        );

      case 'delete':
        return (
          <>
            <path d="M7 10H25L23 26H9L7 10Z" fill="#FEE8E8" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M5 10H27" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 7H20" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <path d="M13 14V22M16 14V22M19 14V22" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round"/>
          </>
        );

      case 'microphone':
        return (
          <>
            <rect x="11" y="4" width="10" height="14" rx="5" fill="#F47C86" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M7 13C7 18.5 11 22 16 22C21 22 25 18.5 25 13" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M16 22V27M11 27H21" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
          </>
        );

      case 'audio':
        return (
          <>
            <path d="M6 12H10L15 7V25L10 20H6V12Z" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M19 11C21 13 21 19 19 21" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M22 8C25 11 25 21 22 24" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </>
        );

      case 'play':
        return (
          <>
            <circle cx="16" cy="16" r="12" fill="#A9DCC8" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M13 11L23 16L13 21V11Z" fill="#2D2426" stroke="#2D2426" strokeWidth="1" strokeLinejoin="round"/>
          </>
        );

      case 'pause':
        return (
          <>
            <circle cx="16" cy="16" r="12" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M12 11V21M20 11V21" stroke="#2D2426" strokeWidth="2.5" strokeLinecap="round"/>
          </>
        );

      case 'upload':
        return (
          <>
            <path d="M16 5V20" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 11L16 5L22 11" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 24H26" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <rect x="6" y="18" width="20" height="8" rx="3" fill="#EEF8F4" stroke="#2D2426" strokeWidth="1.5"/>
          </>
        );

      case 'download':
        return (
          <>
            <rect x="6" y="18" width="20" height="8" rx="3" fill="#F2EEF9" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M16 5V18" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
            <path d="M10 13L16 19L22 13" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 24H26" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
          </>
        );

      case 'share':
        return (
          <>
            <circle cx="24" cy="7" r="3.5" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.8"/>
            <circle cx="8" cy="16" r="3.5" fill="#A9DCC8" stroke="#2D2426" strokeWidth="1.8"/>
            <circle cx="24" cy="25" r="3.5" fill="#F47C86" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M11 14.5L21 8.5M11 17.5L21 23.5" stroke="#2D2426" strokeWidth="1.8" strokeLinecap="round"/>
          </>
        );

      case 'ai-tutor':
        return (
          <>
            <ellipse cx="16" cy="15" rx="9" ry="8" fill="#F2EEF9" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M10 12C10 12 11 10 13 11" stroke="#2D2426" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <path d="M22 12C22 12 21 10 19 11" stroke="#2D2426" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            <circle cx="13" cy="14" r="1.5" fill="#7048E8"/>
            <circle cx="19" cy="14" r="1.5" fill="#7048E8"/>
            <path d="M13 18C13 18 14.5 20 16 20C17.5 20 19 18 19 18" stroke="#2D2426" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <path d="M6 8L8 10M26 8L24 10M16 4V6" stroke="#FCC419" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="6" cy="7" r="1" fill="#FCC419"/>
            <circle cx="26" cy="7" r="1" fill="#FCC419"/>
          </>
        );

      case 'warning':
        return (
          <>
            <path d="M16 5L28 26H4L16 5Z" fill="#FEF8E6" stroke="#F7D774" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M16 13V19" stroke="#F08C00" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="16" cy="22.5" r="1.2" fill="#F08C00"/>
          </>
        );

      case 'error':
        return (
          <>
            <circle cx="16" cy="16" r="12" fill="#FFF5F5" stroke="#FF6B6B" strokeWidth="1.8"/>
            <path d="M11 11L21 21M21 11L11 21" stroke="#C92A2A" strokeWidth="2" strokeLinecap="round"/>
          </>
        );

      case 'success':
        return (
          <>
            <circle cx="16" cy="16" r="12" fill="#EEF8F4" stroke="#A9DCC8" strokeWidth="1.8"/>
            <path d="M9 16L14 21L23 11" stroke="#0CA678" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </>
        );

      case 'menu':
        return (
          <path d="M5 10H27M5 16H27M5 22H27" stroke="#2D2426" strokeWidth="2" strokeLinecap="round"/>
        );

      case 'forward':
        return (
          <path d="M12 8L20 16L12 24" stroke="#2D2426" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        );

      case 'camera':
        return (
          <>
            <rect x="3" y="9" width="26" height="18" rx="4" fill="#EEF7FD" stroke="#2D2426" strokeWidth="1.8"/>
            <circle cx="16" cy="18" r="5" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M11 9V7C11 6 12 5 13 5H19C20 5 21 6 21 7V9" stroke="#2D2426" strokeWidth="1.5" fill="none"/>
            <circle cx="24" cy="13" r="1.5" fill="#FCC419"/>
          </>
        );

      case 'progress':
        return (
          <>
            <rect x="5" y="18" width="5" height="9" rx="1.5" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.5"/>
            <rect x="13" y="12" width="5" height="15" rx="1.5" fill="#A9DCC8" stroke="#2D2426" strokeWidth="1.5"/>
            <rect x="21" y="6" width="5" height="21" rx="1.5" fill="#F47C86" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M22 4L23 6.5L26 6.5L23.5 8.5L24.5 11L22 9L19.5 11L20.5 8.5L18 6.5L21 6.5Z" fill="#FCC419" stroke="#2D2426" strokeWidth="0.8"/>
          </>
        );

      case 'leaderboard':
        return (
          <>
            <rect x="11" y="14" width="9" height="14" rx="2" fill="#FCC419" stroke="#2D2426" strokeWidth="1.5"/>
            <rect x="4" y="18" width="8" height="10" rx="2" fill="#A9D5F5" stroke="#2D2426" strokeWidth="1.5"/>
            <rect x="19" y="20" width="8" height="8" rx="2" fill="#F6B38F" stroke="#2D2426" strokeWidth="1.5"/>
            <path d="M15 10L16 12.5L19 12.5L16.5 14.5L17.5 17L15 15L12.5 17L13.5 14.5L11 12.5L14 12.5Z" fill="#FAB005" stroke="#2D2426" strokeWidth="1"/>
          </>
        );

      case 'shop':
        return (
          <>
            <path d="M8 10H24L22 26H10L8 10Z" fill="#EEF8F4" stroke="#2D2426" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 10V8C12 5.8 13.8 4 16 4C18.2 4 20 5.8 20 8V10" stroke="#2D2426" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M12 16H20" stroke="#A9DCC8" strokeWidth="1.5" strokeLinecap="round"/>
          </>
        );

      case 'rewards':
        return (
          <>
            <rect x="5" y="12" width="22" height="15" rx="3" fill="#EEF8F4" stroke="#2D2426" strokeWidth="1.8"/>
            <rect x="4" y="8" width="24" height="5" rx="2" fill="#F47C86" stroke="#2D2426" strokeWidth="1.8"/>
            <path d="M16 8V27" stroke="#E85B67" strokeWidth="2"/>
            <path d="M13 5C11 3 9 5.5 11 7.5L16 8.5L12 7" stroke="#E85B67" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M19 5C21 3 23 5.5 21 7.5L16 8.5L20 7" stroke="#E85B67" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          </>
        );

      case 'more':
        return (
          <>
            <circle cx="8" cy="16" r="2.5" fill="#9E9189"/>
            <circle cx="16" cy="16" r="2.5" fill="#9E9189"/>
            <circle cx="24" cy="16" r="2.5" fill="#9E9189"/>
          </>
        );

      default:
        return <circle cx="16" cy="16" r="6" fill="#FF8FA3" stroke="#2D2426" strokeWidth="1.8" />;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      {...props}
    >
      {renderIcon()}
    </svg>
  );
};
