import React, { useState, useEffect, useRef } from "react";
import {
  Home, BookOpen, Mic, MessageCircle, Users, Crown, ChevronRight, Flame,
  Zap, Trophy, Target, Clock, Search, Bell, Volume2, Check, X,
  ArrowRight, LogOut, User, Mail, BarChart2, TrendingUp, Award,
  Bookmark, Edit3, Shield, Download, Trash2, CreditCard, ChevronDown,
  Heart, Send, Brain, Globe, Plus, Sparkles, Eye, EyeOff, ChevronLeft,
  Menu, Star, Settings, MoreHorizontal, Play, Pencil, RotateCcw,
  CheckCircle, Lightbulb, Headphones, Filter, Github, Calendar,
  GraduationCap, Layers, Activity, Sun, Moon, Lock, Pause
} from "lucide-react";

// ─── INJECT GLOBAL STYLES ─────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes sakura-fall {
    0%   { transform: translateY(-20px) rotate(0deg)   translateX(0px);  opacity: 1; }
    50%  { transform: translateY(50vh)  rotate(200deg) translateX(25px);  opacity: 0.9; }
    100% { transform: translateY(110vh) rotate(400deg) translateX(-10px); opacity: 0; }
  }
  @keyframes float      { 0%,100% { transform: translateY(0); }    50% { transform: translateY(-12px); } }
  @keyframes float-alt  { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(3deg); } }
  @keyframes logo-in    { 0% { opacity:0; transform: scale(0.3) rotate(-15deg); } 70% { transform: scale(1.1) rotate(2deg); } 100% { opacity:1; transform: scale(1) rotate(0); } }
  @keyframes text-reveal { 0% { opacity:0; transform: translateY(20px) skewY(3deg); } 100% { opacity:1; transform: translateY(0) skewY(0); } }
  @keyframes slide-up   { from { opacity:0; transform: translateY(28px); } to { opacity:1; transform: translateY(0); } }
  @keyframes slide-in-r { from { opacity:0; transform: translateX(28px); } to { opacity:1; transform: translateX(0); } }
  @keyframes fade-in    { from { opacity:0; } to { opacity:1; } }
  @keyframes progress-fill { from { width:0; } to { width: var(--w); } }
  @keyframes xp-shine   { from { background-position: -200px 0; } to { background-position: 200px 0; } }
  @keyframes pulse-ring { 0% { transform: scale(1); opacity:0.8; } 100% { transform: scale(2.2); opacity:0; } }
  @keyframes draw-kanji { to { stroke-dashoffset: 0; } }
  @keyframes mic-wave   { 0%,100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
  @keyframes spin-glow  { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes bounce-in  { 0% { transform: scale(0); opacity:0; } 60% { transform: scale(1.15); } 100% { transform: scale(1); opacity:1; } }
  @keyframes level-pop  { 0% { transform: scale(0) rotate(-180deg); opacity:0; } 80% { transform: scale(1.2) rotate(5deg); } 100% { transform: scale(1) rotate(0); opacity:1; } }
  @keyframes orb-drift  { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(30px,-20px) scale(1.05); } 66% { transform: translate(-20px,15px) scale(0.95); } }

  .anim-logo-in    { animation: logo-in 1.2s cubic-bezier(0.16,1,0.3,1) forwards; }
  .anim-float      { animation: float 3.5s ease-in-out infinite; }
  .anim-float-alt  { animation: float-alt 4.5s ease-in-out infinite 0.8s; }
  .anim-slide-up   { animation: slide-up 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
  .anim-slide-in-r { animation: slide-in-r 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
  .anim-fade-in    { animation: fade-in 0.6s ease forwards; }
  .anim-bounce-in  { animation: bounce-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
  .anim-level-pop  { animation: level-pop 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
  .anim-spin-glow  { animation: spin-glow 8s linear infinite; }
  .anim-orb        { animation: orb-drift 12s ease-in-out infinite; }

  .glass      { background: rgba(17,12,30,0.78); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
  .glass-lite { background: rgba(30,19,53,0.55); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
  .glass-deep { background: rgba(9,6,15,0.85);  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }

  .neon-border      { border: 1px solid rgba(124,58,237,0.28); }
  .neon-border-pink { border: 1px solid rgba(236,72,153,0.28); }
  .neon-border-teal { border: 1px solid rgba(6,182,212,0.28); }

  .glow-xs  { box-shadow: 0 0 10px rgba(124,58,237,0.2); }
  .glow-sm  { box-shadow: 0 0 20px rgba(124,58,237,0.3); }
  .glow-md  { box-shadow: 0 0 35px rgba(124,58,237,0.35), 0 0 70px rgba(124,58,237,0.12); }
  .glow-lg  { box-shadow: 0 0 50px rgba(124,58,237,0.5), 0 0 100px rgba(124,58,237,0.2); }
  .glow-acc { box-shadow: 0 0 25px rgba(236,72,153,0.4); }
  .glow-teal{ box-shadow: 0 0 20px rgba(6,182,212,0.35); }

  .text-glow      { text-shadow: 0 0 25px rgba(167,139,250,0.9); }
  .text-glow-pink { text-shadow: 0 0 20px rgba(236,72,153,0.9); }
  .text-glow-teal { text-shadow: 0 0 20px rgba(6,182,212,0.8); }

  .hover-lift { transition: transform 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s ease, border-color 0.2s ease; cursor: pointer; }
  .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 10px 35px rgba(124,58,237,0.25); border-color: rgba(124,58,237,0.45) !important; }
  .hover-scale { transition: transform 0.2s ease; cursor: pointer; }
  .hover-scale:hover { transform: scale(1.03); }

  .btn-grad { background: linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #EC4899 100%); position: relative; overflow: hidden; transition: all 0.2s ease; }
  .btn-grad::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #8B47F0 0%, #A855F7 50%, #F472B6 100%); opacity: 0; transition: opacity 0.25s; }
  .btn-grad:hover::after { opacity: 1; }
  .btn-grad:active { transform: scale(0.97); }
  .btn-grad span, .btn-grad svg { position: relative; z-index: 1; }

  .btn-ghost { background: rgba(124,58,237,0.1); border: 1px solid rgba(124,58,237,0.25); color: #C4B5FD; transition: all 0.2s ease; }
  .btn-ghost:hover { background: rgba(124,58,237,0.2); border-color: rgba(124,58,237,0.5); }

  .sidebar-item { transition: all 0.18s ease; border-radius: 10px; border: 1px solid transparent; }
  .sidebar-item:hover { background: rgba(124,58,237,0.1); }
  .sidebar-item.active { background: rgba(124,58,237,0.18); border-color: rgba(124,58,237,0.3); }
  .sidebar-item.active .s-icon { color: #A78BFA; }
  .sidebar-item.active .s-label { color: #F5F3FF; font-weight: 600; }

  .input-velmorth {
    background: rgba(124,58,237,0.07);
    border: 1px solid rgba(124,58,237,0.22);
    color: #F5F3FF;
    transition: all 0.2s ease;
    outline: none;
    font-family: Inter, sans-serif;
  }
  .input-velmorth::placeholder { color: rgba(245,243,255,0.35); }
  .input-velmorth:focus { border-color: rgba(124,58,237,0.6); box-shadow: 0 0 0 3px rgba(124,58,237,0.12); background: rgba(124,58,237,0.1); }

  .progress-bar-grad { background: linear-gradient(90deg, #7C3AED, #A855F7 50%, #EC4899); border-radius: 999px; }

  .kanji-stroke-path { stroke-dasharray: 500; stroke-dashoffset: 500; animation: draw-kanji 1.8s cubic-bezier(0.4,0,0.2,1) forwards; }

  .card-3d-wrap { perspective: 1000px; }
  .card-3d { transform-style: preserve-3d; transition: transform 0.65s cubic-bezier(0.4,0,0.2,1); }
  .card-3d.flipped { transform: rotateY(180deg); }
  .card-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; position: absolute; inset: 0; }
  .card-back { transform: rotateY(180deg); }

  .mic-bar { transform-origin: bottom; animation: mic-wave var(--d,0.8s) ease-in-out infinite var(--delay,0s); }

  .petal { position: fixed; pointer-events: none; will-change: transform; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }

  .view-transition { animation: slide-up 0.38s cubic-bezier(0.16,1,0.3,1); }

  .social-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(245,243,255,0.85); transition: all 0.2s ease; }
  .social-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); color: #fff; }

  .achievement-locked { filter: grayscale(0.7) brightness(0.5); }

  .tag-pill { background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.3); color: #C4B5FD; border-radius: 999px; padding: 2px 10px; font-size: 11px; font-weight: 500; }
  .tag-pill-pink { background: rgba(236,72,153,0.12); border: 1px solid rgba(236,72,153,0.3); color: #F9A8D4; }
  .tag-pill-teal { background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.3); color: #67E8F9; }

  .streak-fire { filter: drop-shadow(0 0 8px #F97316); }
  .xp-badge { background: linear-gradient(135deg, #7C3AED, #EC4899); }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const JLPT = [
  { level: "N5", color: "#10B981", label: "Beginner",     progress: 78, lessons: 47, total: 60, active: true },
  { level: "N4", color: "#3B82F6", label: "Elementary",   progress: 45, lessons: 27, total: 60, active: false },
  { level: "N3", color: "#F59E0B", label: "Intermediate", progress: 22, lessons: 13, total: 60, active: false },
  { level: "N2", color: "#EF4444", label: "Upper Int.",   progress: 5,  lessons: 3,  total: 60, active: false },
  { level: "N1", color: "#7C3AED", label: "Advanced",     progress: 0,  lessons: 0,  total: 60, active: false },
];

const VOCAB = [
  { word: "桜",   reading: "さくら",     meaning: "Cherry Blossom", type: "Noun",     level: "N5", mastery: 5 },
  { word: "勉強", reading: "べんきょう", meaning: "Study",          type: "Noun/Verb", level: "N5", mastery: 4 },
  { word: "先生", reading: "せんせい",   meaning: "Teacher",        type: "Noun",     level: "N5", mastery: 5 },
  { word: "電車", reading: "でんしゃ",   meaning: "Train",          type: "Noun",     level: "N5", mastery: 2 },
  { word: "図書館",reading:"としょかん", meaning: "Library",        type: "Noun",     level: "N4", mastery: 1 },
  { word: "難しい",reading:"むずかしい", meaning: "Difficult",      type: "Adjective",level: "N4", mastery: 3 },
  { word: "旅行", reading: "りょこう",   meaning: "Travel/Trip",    type: "Noun/Verb", level: "N4", mastery: 2 },
  { word: "親切", reading: "しんせつ",   meaning: "Kindness",       type: "Noun/Adj", level: "N4", mastery: 0 },
];

const KANJI_DATA = [
  { char: "日", on: "ニチ・ジツ", kun: "ひ・か",   meaning: "Sun / Day",    strokes: 4, level: "N5", examples: ["日本", "毎日", "今日"] },
  { char: "月", on: "ゲツ・ガツ", kun: "つき",     meaning: "Moon / Month", strokes: 4, level: "N5", examples: ["月曜日", "毎月", "今月"] },
  { char: "水", on: "スイ",       kun: "みず",     meaning: "Water",        strokes: 4, level: "N5", examples: ["水曜日", "水泳", "お水"] },
  { char: "火", on: "カ",         kun: "ひ・ほ",   meaning: "Fire",         strokes: 4, level: "N5", examples: ["火曜日", "花火", "火事"] },
  { char: "木", on: "モク・ボク", kun: "き・こ",   meaning: "Tree / Wood",  strokes: 4, level: "N5", examples: ["木曜日", "木村", "木材"] },
  { char: "山", on: "サン",       kun: "やま",     meaning: "Mountain",     strokes: 3, level: "N5", examples: ["山田", "富士山", "登山"] },
  { char: "川", on: "セン",       kun: "かわ",     meaning: "River",        strokes: 3, level: "N5", examples: ["川口", "小川", "川魚"] },
  { char: "人", on: "ジン・ニン", kun: "ひと",     meaning: "Person",       strokes: 2, level: "N5", examples: ["人間", "日本人", "一人"] },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Hana Yamamoto",  xp: 15420, level: 24, streak: 142, country: "JP" },
  { rank: 2, name: "Kenji Watanabe", xp: 14890, level: 22, streak: 98,  country: "US" },
  { rank: 3, name: "Sakura Mizuki",  xp: 13750, level: 21, streak: 87,  country: "KR" },
  { rank: 4, name: "Yuki Tanaka",    xp: 12340, level: 19, streak: 54,  country: "US", isUser: true },
  { rank: 5, name: "Akira Chen",     xp: 11200, level: 18, streak: 45,  country: "CN" },
  { rank: 6, name: "Mei Suzuki",     xp: 9800,  level: 16, streak: 29,  country: "UK" },
  { rank: 7, name: "Ren Hayashi",    xp: 8950,  level: 15, streak: 22,  country: "AU" },
];

const ACHIEVEMENTS_DATA = [
  { title: "First Steps",    desc: "Complete your first lesson",  Icon: Star,    earned: true,  xp: 50 },
  { title: "Streak Master",  desc: "15-day learning streak",      Icon: Flame,   earned: true,  xp: 200 },
  { title: "Kanji Hunter",   desc: "Learn 100 kanji characters",  Icon: Target,  earned: true,  xp: 500 },
  { title: "Grammar Guru",   desc: "Master all N5 grammar",       Icon: Brain,   earned: false, xp: 300 },
  { title: "Speed Demon",    desc: "Complete a quiz under 60s",   Icon: Zap,     earned: false, xp: 150 },
  { title: "Social Butterfly",desc:"Make 10 study friends",       Icon: Users,   earned: false, xp: 100 },
];

const AI_MESSAGES_INIT = [
  { role: "sakura", text: "こんにちは！ I am Sakura, your personal AI Japanese tutor. Ask me anything about Japanese — grammar, vocabulary, kanji, or culture!", time: "10:00" },
  { role: "user",   text: "Can you explain the difference between は and が?", time: "10:01" },
  { role: "sakura", text: "Great question!\n\nは (wa) = Topic marker — introduces what you are talking about.\nが (ga) = Subject marker — emphasizes WHO does the action.\n\n例文:\n私は学生です → \"As for me, I am a student.\"\n私が学生です → \"I (specifically) am the student.\"\n\nWant to practice with some exercises?", time: "10:02" },
];

const SPEAKING_PHRASES = [
  { jp: "おはようございます", romaji: "Ohayou gozaimasu", en: "Good morning (formal)" },
  { jp: "よろしくお願いします", romaji: "Yoroshiku onegaishimasu", en: "Please treat me well" },
  { jp: "ありがとうございます", romaji: "Arigatou gozaimasu", en: "Thank you very much" },
  { jp: "すみません", romaji: "Sumimasen", en: "Excuse me / I am sorry" },
];

// ─── VELMORTH LOGO ─────────────────────────────────────────────────────────────
function VelmorthLogo({ size = 36, animated = false, showText = true }: {
  size?: number; animated?: boolean; showText?: boolean;
}) {
  return (
    <div className="flex items-center gap-3" style={{ animation: animated ? "logo-in 1.2s cubic-bezier(0.16,1,0.3,1) forwards" : undefined }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vl-g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="0.5" stopColor="#9333EA" />
            <stop offset="1" stopColor="#EC4899" />
          </linearGradient>
          <filter id="vl-glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <polygon points="20,3 37,37 20,27 3,37" fill="url(#vl-g)" filter="url(#vl-glow)" />
        <polygon points="20,3 37,37 20,27 3,37" fill="none" stroke="rgba(236,72,153,0.4)" strokeWidth="0.6" />
        <line x1="20" y1="14" x2="20" y2="27" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      </svg>
      {showText && (
        <div>
          <div style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: size * 0.45, color: "#F5F3FF", letterSpacing: "0.12em", lineHeight: 1 }}>
            VELMORTH
          </div>
          <div style={{ fontFamily: "Noto Sans JP, sans-serif", fontWeight: 300, fontSize: size * 0.22, color: "#A78BFA", letterSpacing: "0.25em", lineHeight: 1.2 }}>
            学習
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SAKURA AI CHARACTER ────────────────────────────────────────────────────────
function SakuraAI({ pose = "normal", size = 160, className = "" }: {
  pose?: "normal" | "wave" | "thinking" | "celebration" | "teaching" | "chat" | "sad" | "guide";
  size?: number;
  className?: string;
}) {
  const uid = `s${pose}`;
  const arms: Record<string, { lp: string; rp: string; extra?: boolean }> = {
    normal:      { lp: "M38 122 Q28 142 30 162", rp: "M82 122 Q92 142 90 162" },
    wave:        { lp: "M38 122 Q28 145 30 165", rp: "M82 120 Q97 100 100 78", extra: true },
    thinking:    { lp: "M38 122 Q28 145 30 165", rp: "M82 120 Q92 112 98 100" },
    celebration: { lp: "M38 118 Q24 100 20 78", rp: "M82 118 Q96 100 100 78", extra: true },
    teaching:    { lp: "M38 122 Q28 145 30 165", rp: "M82 122 Q98 118 114 114" },
    chat:        { lp: "M38 122 Q28 145 30 165", rp: "M82 122 Q92 145 90 162" },
    sad:         { lp: "M38 126 Q26 148 24 170", rp: "M82 126 Q94 148 96 170" },
    guide:       { lp: "M38 122 Q22 128 12 124", rp: "M82 122 Q92 145 90 162", extra: true },
  };
  const mouths: Record<string, string> = {
    normal:      "M52 88 Q60 95 68 88",
    wave:        "M49 85 Q60 95 71 85",
    thinking:    "M53 91 Q58 89 65 91",
    celebration: "M48 84 Q60 97 72 84",
    teaching:    "M51 88 Q60 93 69 88",
    chat:        "M52 88 Q60 94 68 88",
    sad:         "M52 93 Q60 86 68 93",
    guide:       "M50 86 Q60 95 70 86",
  };
  const arm = arms[pose] || arms.normal;
  const mouth = mouths[pose] || mouths.normal;
  const sc = size / 120;
  return (
    <svg width={size} height={size * (200 / 120)} viewBox="0 0 120 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${uid}-hair`} x1="0" y1="0" x2="120" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E879F9" />
          <stop offset="1" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id={`${uid}-outfit`} x1="60" y1="100" x2="60" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <radialGradient id={`${uid}-face`} cx="50%" cy="40%" r="65%">
          <stop stopColor="#FDE8D0" />
          <stop offset="1" stopColor="#FDDCB5" />
        </radialGradient>
        <radialGradient id={`${uid}-ground`} cx="50%" cy="50%" r="50%">
          <stop stopColor="#7C3AED" stopOpacity="0.35" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Ground glow */}
      <ellipse cx="60" cy="196" rx="42" ry="7" fill={`url(#${uid}-ground)`} />

      {/* Hair — back long */}
      <path d="M22 58 Q17 115 22 172 Q40 192 60 192 Q80 192 98 172 Q103 115 98 58 Q85 22 60 20 Q35 22 22 58Z" fill={`url(#${uid}-hair)`} />

      {/* Body */}
      <path d="M36 120 Q33 168 31 192 L89 192 Q87 168 84 120Z" fill={`url(#${uid}-outfit)`} />

      {/* Shirt */}
      <path d="M42 112 Q60 120 78 112 L82 130 Q60 138 38 130Z" fill="white" opacity="0.93" />
      <path d="M50 112 L60 124 L70 112" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />

      {/* Belt buckle */}
      <rect x="36" y="148" width="48" height="6" rx="3" fill="#5B21B6" />
      <rect x="55" y="145" width="10" height="11" rx="2" fill="#EC4899" />

      {/* Skirt pleats */}
      <path d="M36 154 Q33 172 30 192 L90 192 Q87 172 84 154Z" fill="#5B21B6" />
      <path d="M36 154 Q42 160 60 162 Q78 160 84 154" stroke="#7C3AED" strokeWidth="1" fill="none" strokeLinecap="round" />
      {[42, 50, 60, 70, 78].map((x, i) => (
        <line key={i} x1={x} y1={154} x2={x - 2 + i} y2={192} stroke="rgba(124,58,237,0.3)" strokeWidth="0.8" />
      ))}

      {/* Legs */}
      <rect x="41" y="190" width="16" height="10" rx="5" fill="#FDDCB5" />
      <rect x="63" y="190" width="16" height="10" rx="5" fill="#FDDCB5" />

      {/* Shoes */}
      <path d="M39 196 Q41 202 57 202 Q59 199 57 196Z" fill="#2D1B4E" />
      <path d="M63 196 Q65 202 81 202 Q83 199 81 196Z" fill="#2D1B4E" />

      {/* Neck */}
      <rect x="52" y="100" width="16" height="17" rx="6" fill="#FDDCB5" />

      {/* LEFT ARM */}
      <path d={arm.lp} stroke="#FDDCB5" strokeWidth="14" strokeLinecap="round" fill="none" />
      <circle cx={parseInt(arm.lp.split(" ").at(-2) || "30")} cy={parseInt(arm.lp.split(" ").at(-1) || "162")} r="7" fill="#FDDCB5" />

      {/* RIGHT ARM */}
      <path d={arm.rp} stroke="#FDDCB5" strokeWidth="14" strokeLinecap="round" fill="none" />
      {arm.extra && pose !== "guide" && (
        <circle cx={parseInt(arm.rp.split(" ").at(-2) || "90")} cy={parseInt(arm.rp.split(" ").at(-1) || "78")} r="7" fill="#FDDCB5" />
      )}
      {pose === "guide" && (
        <circle cx="10" cy="124" r="7" fill="#FDDCB5" />
      )}

      {/* Face base */}
      <ellipse cx="60" cy="67" rx="29" ry="31" fill={`url(#${uid}-face)`} />

      {/* Hair front / bangs */}
      <path d="M31 64 Q34 40 60 35 Q86 40 89 64 Q84 50 73 47 Q66 42 60 44 Q54 42 47 47 Q36 50 31 64Z" fill={`url(#${uid}-hair)`} />
      <path d="M32 64 Q27 74 30 84 Q33 70 37 66Z" fill="#D946EF" />
      <path d="M88 64 Q93 74 90 84 Q87 70 83 66Z" fill="#D946EF" />
      <path d="M53 39 Q60 32 67 39 Q64 46 60 48 Q56 46 53 39Z" fill="#C026D3" />

      {/* ── LEFT EYE ── */}
      <ellipse cx="46" cy="70" rx="10" ry="11" fill="#1A0A2E" />
      <ellipse cx="46" cy="70" rx="8"  ry="9.5" fill="#5B21B6" />
      <ellipse cx="46" cy="69" rx="6"  ry="7.5" fill="#7C3AED" />
      <ellipse cx="46" cy="68" rx="4"  ry="5.5" fill="#A78BFA" />
      <ellipse cx="46" cy="70" rx="2.2" ry="2.8" fill="#080415" />
      <circle  cx="50" cy="65" r="3"  fill="white" />
      <circle  cx="42" cy="74" r="1.2" fill="rgba(255,255,255,0.65)" />
      <path d="M36 63 Q46 57 56 63" stroke="#0F051E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M37 78 Q46 83 55 78" stroke="#2D1B4E" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* ── RIGHT EYE ── */}
      <ellipse cx="74" cy="70" rx="10" ry="11" fill="#1A0A2E" />
      <ellipse cx="74" cy="70" rx="8"  ry="9.5" fill="#5B21B6" />
      <ellipse cx="74" cy="69" rx="6"  ry="7.5" fill="#7C3AED" />
      <ellipse cx="74" cy="68" rx="4"  ry="5.5" fill="#A78BFA" />
      <ellipse cx="74" cy="70" rx="2.2" ry="2.8" fill="#080415" />
      <circle  cx="78" cy="65" r="3"  fill="white" />
      <circle  cx="70" cy="74" r="1.2" fill="rgba(255,255,255,0.65)" />
      <path d="M64 63 Q74 57 84 63" stroke="#0F051E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M65 78 Q74 83 83 78" stroke="#2D1B4E" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.7" />

      {/* Eyebrows */}
      <path d="M36 59 Q46 54 56 59" stroke="#7C3AED" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M64 59 Q74 54 84 59" stroke="#7C3AED" strokeWidth="1.6" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <path d="M58 82 Q60 85 62 82" stroke="#E8A87C" strokeWidth="1.1" fill="none" strokeLinecap="round" />

      {/* Mouth */}
      <path d={mouth} stroke="#E879A0" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {(pose === "celebration" || pose === "wave") && (
        <path d={mouth} fill="rgba(236,72,153,0.18)" />
      )}

      {/* Blush */}
      <ellipse cx="36" cy="79" rx="8" ry="5" fill="#FFB7C5" opacity="0.5" />
      <ellipse cx="84" cy="79" rx="8" ry="5" fill="#FFB7C5" opacity="0.5" />

      {/* Hair accessories */}
      <circle cx="33" cy="57" r="7" fill="#EC4899" filter={`url(#${uid}-glow)`} />
      <circle cx="33" cy="57" r="5" fill="#FDE8F4" />
      <circle cx="33" cy="57" r="2.5" fill="#EC4899" />
      <circle cx="87" cy="57" r="7" fill="#7C3AED" filter={`url(#${uid}-glow)`} />
      <circle cx="87" cy="57" r="5" fill="#EDE9FE" />
      <circle cx="87" cy="57" r="2.5" fill="#7C3AED" />

      {/* Pose extras */}
      {pose === "celebration" && (
        <>
          <path d="M104 30 L106 37 L113 35 L107 42 L104 49 L101 42 L94 35 L101 37Z" fill="#F59E0B" opacity="0.9" />
          <path d="M10 55 L11.5 61 L17 59 L12 65 L10 71 L8 65 L3 59 L8 61Z" fill="#EC4899" opacity="0.9" />
          <circle cx="112" cy="65" r="4" fill="#7C3AED" opacity="0.8" />
          <circle cx="8"   cy="42" r="3" fill="#F59E0B" opacity="0.8" />
          {[0,1,2,3,4,5].map(i => (
            <circle key={i} cx={15 + i * 18} cy={8 + (i % 2) * 6} r="2" fill={["#EC4899","#7C3AED","#F59E0B","#06B6D4","#10B981","#F472B6"][i]} opacity="0.7" />
          ))}
        </>
      )}
      {pose === "thinking" && (
        <>
          <circle cx="86" cy="30" r="3.5" fill="rgba(245,243,255,0.15)" stroke="rgba(245,243,255,0.4)" strokeWidth="1" />
          <circle cx="94" cy="21" r="4.5" fill="rgba(245,243,255,0.15)" stroke="rgba(245,243,255,0.4)" strokeWidth="1" />
          <rect x="95" y="6" width="28" height="18" rx="9" fill="rgba(124,58,237,0.3)" stroke="rgba(124,58,237,0.7)" strokeWidth="1" />
          <text x="109" y="18" textAnchor="middle" fill="rgba(245,243,255,0.9)" fontSize="9" fontFamily="Noto Sans JP">？</text>
        </>
      )}
      {pose === "wave" && (
        <path d="M92 70 Q100 65 104 62 Q108 66 104 70 Q100 74 96 74" stroke="#FDDCB5" strokeWidth="8" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

// ─── FLOATING PETALS ─────────────────────────────────────────────────────────
function FloatingPetals({ count = 18 }: { count?: number }) {
  const petals = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 12}s`,
    duration: `${8 + Math.random() * 10}s`,
    size: 8 + Math.random() * 14,
    opacity: 0.3 + Math.random() * 0.5,
    color: Math.random() > 0.5 ? "#F9A8D4" : "#C4B5FD",
  }));
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {petals.map(p => (
        <div key={p.id} className="petal" style={{ left: p.left, top: "-20px", animationName: "sakura-fall", animationDuration: p.duration, animationDelay: p.delay, animationTimingFunction: "linear", animationIterationCount: "infinite", opacity: p.opacity }}>
          <svg width={p.size} height={p.size} viewBox="0 0 20 20">
            <path d="M10 2 C12 0 16 2 16 6 C16 10 10 18 10 18 C10 18 4 10 4 6 C4 2 8 0 10 2Z" fill={p.color} />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1400);
    const t3 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden" style={{ background: "#09060F" }}>
      {/* Background orbs */}
      <div className="absolute w-96 h-96 rounded-full anim-orb" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.35) 0%, transparent 70%)", top: "10%", left: "15%" }} />
      <div className="absolute w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)", bottom: "15%", right: "15%", animation: "orb-drift 14s ease-in-out infinite 2s" }} />

      {/* Rotating ring */}
      <div className="absolute anim-spin-glow" style={{ width: 300, height: 300, border: "1px solid rgba(124,58,237,0.2)", borderRadius: "50%", borderTopColor: "rgba(124,58,237,0.6)" }} />
      <div className="absolute anim-spin-glow" style={{ width: 220, height: 220, border: "1px solid rgba(236,72,153,0.15)", borderRadius: "50%", borderBottomColor: "rgba(236,72,153,0.5)", animationDuration: "6s", animationDirection: "reverse" }} />

      <FloatingPetals count={12} />

      {/* Logo */}
      <div style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.3s", animation: phase >= 1 ? "logo-in 1.2s cubic-bezier(0.16,1,0.3,1) forwards" : undefined }}>
        <div className="flex flex-col items-center gap-6">
          <div className="glow-lg" style={{ borderRadius: 20 }}>
            <VelmorthLogo size={64} showText={false} />
          </div>
          <div style={{ opacity: phase >= 1 ? 1 : 0, animation: phase >= 1 ? "text-reveal 0.8s 0.4s cubic-bezier(0.16,1,0.3,1) both" : undefined }}>
            <div className="text-center">
              <div className="text-glow" style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 36, letterSpacing: "0.14em", color: "#F5F3FF" }}>VELMORTH</div>
              <div style={{ fontFamily: "Noto Sans JP", fontWeight: 300, fontSize: 14, color: "#A78BFA", letterSpacing: "0.4em", marginTop: 4 }}>学習プラットフォーム</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading bar */}
      <div style={{ position: "absolute", bottom: 80, width: 180, opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
        <div style={{ height: 2, background: "rgba(124,58,237,0.2)", borderRadius: 999, overflow: "hidden" }}>
          <div className="progress-bar-grad" style={{ height: "100%", width: phase >= 2 ? "100%" : "0%", transition: "width 1.8s cubic-bezier(0.4,0,0.2,1)" }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.4)", letterSpacing: "0.15em" }}>INITIALIZING AI CORE</div>
      </div>

      {/* Sakura AI preview */}
      <div style={{ position: "absolute", bottom: 0, right: "10%", opacity: phase >= 2 ? 1 : 0, transition: "opacity 0.6s 0.3s", animation: phase >= 2 ? "slide-up 0.6s 0.3s both" : undefined }}>
        <SakuraAI pose="wave" size={110} />
      </div>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<"social" | "email">("social");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handleMagicLink = () => {
    if (email) setMagicSent(true);
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#09060F" }}>
      <FloatingPetals count={22} />

      {/* Background mesh */}
      <div className="absolute inset-0">
        <div style={{ position: "absolute", top: "5%", left: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 65%)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", top: "40%", left: "40%", width: 300, height: 300, background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)", borderRadius: "50%" }} />
      </div>

      <div className="relative z-10 flex h-full">
        {/* LEFT HERO PANEL */}
        <div className="hidden lg:flex flex-col justify-between p-12" style={{ width: "50%", background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(236,72,153,0.04) 100%)", borderRight: "1px solid rgba(124,58,237,0.15)" }}>
          <VelmorthLogo size={38} />

          <div className="flex flex-col gap-8">
            <div>
              <div style={{ fontFamily: "Noto Sans JP", fontSize: 13, color: "#A78BFA", letterSpacing: "0.2em", marginBottom: 16 }}>日本語学習 AI プラットフォーム</div>
              <h1 className="text-glow" style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 52, lineHeight: 1.1, color: "#F5F3FF", marginBottom: 20 }}>
                Master Japanese<br />
                <span style={{ background: "linear-gradient(135deg,#A78BFA,#EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with AI Precision.</span>
              </h1>
              <p style={{ fontFamily: "Inter", fontSize: 16, color: "rgba(245,243,255,0.55)", lineHeight: 1.7, maxWidth: 380 }}>
                From N5 to N1 — Sakura AI adapts to your learning style, tracks your progress, and makes Japanese feel effortless.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex gap-8">
              {[["2.4M+","Learners"],["98%","Pass Rate"],["JLPT N1","Certified"],].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: "#A78BFA" }}>{n}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap gap-2">
              {["JLPT N5–N1","Kanji Stroke AI","SRS Vocabulary","Speaking Practice","Sakura AI Tutor","Offline Mode"].map(f => (
                <span key={f} className="tag-pill">{f}</span>
              ))}
            </div>
          </div>

          {/* Sakura character */}
          <div className="flex items-end justify-between">
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 16, color: "#F5F3FF" }}>Meet Sakura AI</div>
              <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)" }}>Your personal Japanese tutor</div>
            </div>
            <div className="anim-float">
              <SakuraAI pose="guide" size={160} />
            </div>
          </div>
        </div>

        {/* RIGHT: LOGIN CARD */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md anim-slide-up">
            {/* Mobile logo */}
            <div className="flex lg:hidden justify-center mb-8">
              <VelmorthLogo size={36} />
            </div>

            {/* Card */}
            <div className="glass neon-border glow-sm rounded-2xl p-8">
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 26, color: "#F5F3FF" }}>Welcome back</h2>
                <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>Sign in to continue your journey</p>
              </div>

              {/* Social buttons */}
              {tab === "social" && (
                <div className="flex flex-col gap-3">
                  {[
                    { Icon: Globe, label: "Continue with Google",  bg: "rgba(234,67,53,0.1)", border: "rgba(234,67,53,0.25)", color: "#F87171" },
                    { Icon: Star,  label: "Continue with Apple",   bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.15)", color: "#F5F3FF" },
                    { Icon: Github,label: "Continue with GitHub",  bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.25)", color: "#A78BFA" },
                  ].map(({ Icon, label, bg, border, color }) => (
                    <button key={label} onClick={onLogin} className="flex items-center gap-3 rounded-xl px-4 py-3 w-full hover-lift" style={{ background: bg, border: `1px solid ${border}`, color, fontFamily: "Inter", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
                      <Icon size={18} />
                      <span>{label}</span>
                    </button>
                  ))}

                  <div className="flex items-center gap-3 my-2">
                    <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }} />
                    <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.35)" }}>or</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(124,58,237,0.2)" }} />
                  </div>

                  {/* Magic link */}
                  {!magicSent ? (
                    <div>
                      <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.6)", marginBottom: 8 }}>Magic Link — passwordless sign in</div>
                      <div className="flex gap-2">
                        <input className="input-velmorth flex-1 rounded-xl px-4 py-3" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ fontSize: 14 }} />
                        <button onClick={handleMagicLink} className="btn-grad rounded-xl px-4 py-3" style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                          <span style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 14, color: "white" }}>Send</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 anim-bounce-in" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <CheckCircle size={18} color="#10B981" />
                      <div>
                        <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 13, color: "#10B981" }}>Magic link sent!</div>
                        <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.5)" }}>Check {email || "your inbox"}</div>
                      </div>
                    </div>
                  )}

                  <button onClick={() => setTab("email")} style={{ fontFamily: "Inter", fontSize: 13, color: "#A78BFA", background: "none", border: "none", cursor: "pointer", marginTop: 4, textAlign: "center", width: "100%", textDecoration: "underline", textDecorationColor: "rgba(167,139,250,0.4)" }}>
                    Sign in with email & password
                  </button>
                </div>
              )}

              {tab === "email" && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.6)", display: "block", marginBottom: 6 }}>Email</label>
                    <input className="input-velmorth w-full rounded-xl px-4 py-3" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ fontSize: 14 }} />
                  </div>
                  <div>
                    <label style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.6)", display: "block", marginBottom: 6 }}>Password</label>
                    <div className="relative">
                      <input className="input-velmorth w-full rounded-xl px-4 py-3" type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} style={{ fontSize: 14, paddingRight: 44 }} />
                      <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(245,243,255,0.4)" }}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2" style={{ cursor: "pointer" }}>
                      <input type="checkbox" style={{ accentColor: "#7C3AED" }} />
                      <span style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)" }}>Remember me</span>
                    </label>
                    <button style={{ fontFamily: "Inter", fontSize: 13, color: "#A78BFA", background: "none", border: "none", cursor: "pointer" }}>Forgot password?</button>
                  </div>
                  <button onClick={onLogin} className="btn-grad rounded-xl py-3 w-full mt-1" style={{ cursor: "pointer" }}>
                    <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "white" }}>Sign In</span>
                  </button>
                  <button onClick={() => setTab("social")} style={{ fontFamily: "Inter", fontSize: 13, color: "#A78BFA", background: "none", border: "none", cursor: "pointer", textAlign: "center" }}>← Back to social login</button>
                </div>
              )}

              {/* Footer links */}
              <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(124,58,237,0.15)", paddingTop: 20 }}>
                <button onClick={onLogin} style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.45)", background: "none", border: "none", cursor: "pointer" }}>Continue as guest</button>
                <button onClick={onLogin} style={{ fontFamily: "Inter", fontSize: 13, color: "#A78BFA", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Create account →</button>
              </div>
              <div className="flex justify-center gap-4 mt-3">
                {["Privacy","Terms","Support"].map(l => (
                  <button key={l} style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const GOALS = [
  { id: "jlpt",    icon: GraduationCap, label: "Pass JLPT",      sub: "Ace N5 to N1 exams" },
  { id: "travel",  icon: Globe,         label: "Travel Japan",   sub: "Speak with confidence" },
  { id: "anime",   icon: Sparkles,      label: "Anime & Manga",  sub: "Understand native content" },
  { id: "business",icon: TrendingUp,    label: "Business JP",   sub: "Professional fluency" },
  { id: "culture", icon: Heart,         label: "Culture & Art",  sub: "Deep cultural immersion" },
  { id: "fun",     icon: Star,          label: "Just for fun",   sub: "Casual enjoyable learning" },
];

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [level, setLevel] = useState("");

  if (step === 0) return (
    <div className="fixed inset-0 flex items-center justify-center p-6" style={{ background: "#09060F" }}>
      <FloatingPetals count={10} />
      <div className="w-full max-w-xl z-10 anim-slide-up">
        <div className="flex items-center gap-4 mb-8">
          <SakuraAI pose="wave" size={80} />
          <div>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 24, color: "#F5F3FF" }}>
              こんにちは！ I am Sakura
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.55)" }}>
              Let me personalize your learning journey
            </div>
          </div>
        </div>
        <div className="glass neon-border rounded-2xl p-8">
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 22, color: "#F5F3FF", marginBottom: 6 }}>What is your goal?</h2>
          <p style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)", marginBottom: 24 }}>I will build the perfect curriculum for you</p>
          <div className="grid grid-cols-2 gap-3">
            {GOALS.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)} className="rounded-xl p-4 text-left hover-lift" style={{ background: goal === g.id ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.07)", border: `1px solid ${goal === g.id ? "rgba(124,58,237,0.6)" : "rgba(124,58,237,0.18)"}`, boxShadow: goal === g.id ? "0 0 20px rgba(124,58,237,0.2)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                <g.icon size={20} color={goal === g.id ? "#A78BFA" : "rgba(245,243,255,0.4)"} />
                <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: goal === g.id ? "#F5F3FF" : "rgba(245,243,255,0.7)", marginTop: 8 }}>{g.label}</div>
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)", marginTop: 2 }}>{g.sub}</div>
              </button>
            ))}
          </div>
          <button onClick={() => goal && setStep(1)} className="btn-grad rounded-xl py-3 w-full mt-6" style={{ cursor: goal ? "pointer" : "not-allowed", opacity: goal ? 1 : 0.5 }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "white" }}>Continue →</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6" style={{ background: "#09060F" }}>
      <div className="w-full max-w-xl z-10 anim-slide-in-r">
        <div className="glass neon-border rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <SakuraAI pose="teaching" size={60} />
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: "#F5F3FF" }}>What is your current level?</div>
              <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)" }}>Be honest — I will adapt to you!</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { id: "zero",    label: "Complete Beginner",   sub: "Never studied Japanese" },
              { id: "n5",      label: "N5 Level",            sub: "Know basic hiragana/katakana" },
              { id: "n4",      label: "N4 Level",            sub: "Basic conversations" },
              { id: "n3",      label: "N3 Level",            sub: "Intermediate understanding" },
              { id: "n2plus",  label: "N2 or above",         sub: "Advanced — here to sharpen up" },
            ].map(l => (
              <button key={l.id} onClick={() => setLevel(l.id)} className="flex items-center justify-between rounded-xl px-5 py-4 hover-lift" style={{ background: level === l.id ? "rgba(124,58,237,0.22)" : "rgba(124,58,237,0.07)", border: `1px solid ${level === l.id ? "rgba(124,58,237,0.55)" : "rgba(124,58,237,0.18)"}`, cursor: "pointer", transition: "all 0.2s" }}>
                <div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: level === l.id ? "#F5F3FF" : "rgba(245,243,255,0.7)" }}>{l.label}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)" }}>{l.sub}</div>
                </div>
                {level === l.id && <CheckCircle size={18} color="#A78BFA" />}
              </button>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(0)} className="btn-ghost rounded-xl py-3 flex-1" style={{ cursor: "pointer" }}>← Back</button>
            <button onClick={() => level && onDone()} className="btn-grad rounded-xl py-3 flex-1" style={{ cursor: level ? "pointer" : "not-allowed", opacity: level ? 1 : 0.5 }}>
              <span style={{ color: "white", fontFamily: "Poppins", fontWeight: 600 }}>Start Learning →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function StatBadge({ icon: Icon, value, label, color = "#7C3AED" }: { icon: typeof Flame; value: string | number; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 glass neon-border rounded-xl px-3 py-2">
      <Icon size={16} color={color} />
      <div>
        <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 15, color: "#F5F3FF", lineHeight: 1 }}>{value}</div>
        <div style={{ fontFamily: "Inter", fontSize: 10, color: "rgba(245,243,255,0.45)", lineHeight: 1.2 }}>{label}</div>
      </div>
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "linear-gradient(90deg,#7C3AED,#EC4899)", height = 6 }: { value: number; max?: number; color?: string; height?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height, background: "rgba(124,58,237,0.15)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
    </div>
  );
}

function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 16, color: "#F5F3FF" }}>{children}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── HOME VIEW ────────────────────────────────────────────────────────────────
function HomeView({ setView }: { setView: (v: string) => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "おはよう" : hour < 17 ? "こんにちは" : "こんばんは";
  const greetEn = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowLevelUp(true), 800);
    return () => clearTimeout(t);
  }, []);

  const quickActions = [
    { label: "Kanji",       Icon: Edit3,        view: "kanji",    color: "#7C3AED" },
    { label: "Vocabulary",  Icon: BookOpen,      view: "vocab",    color: "#EC4899" },
    { label: "Grammar",     Icon: Layers,        view: "learn",    color: "#3B82F6" },
    { label: "Speaking",    Icon: Mic,           view: "speaking", color: "#10B981" },
    { label: "Sakura AI",   Icon: MessageCircle, view: "sakura-ai",color: "#F59E0B" },
    { label: "Mock Test",   Icon: Trophy,        view: "learn",    color: "#EF4444" },
  ];

  return (
    <div className="view-transition flex flex-col gap-6 pb-6">
      {/* Header greeting */}
      <div className="flex items-start justify-between">
        <div>
          <div style={{ fontFamily: "Noto Sans JP", fontSize: 13, color: "#A78BFA", letterSpacing: "0.1em" }}>{greeting}！</div>
          <h1 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 28, color: "#F5F3FF", lineHeight: 1.1 }}>{greetEn}, Yuki</h1>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>You are on a 15-day streak — keep it going!</div>
        </div>
        <div className="flex gap-2">
          <button className="glass neon-border rounded-xl p-2.5 hover-scale" style={{ cursor: "pointer" }}><Search size={18} color="#A78BFA" /></button>
          <div className="relative">
            <button className="glass neon-border rounded-xl p-2.5 hover-scale" style={{ cursor: "pointer" }}><Bell size={18} color="#A78BFA" /></button>
            <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, background: "#EC4899", borderRadius: "50%", border: "2px solid #09060F" }} />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 flex-wrap">
        <StatBadge icon={Flame}  value="15" label="Day Streak" color="#F97316" />
        <StatBadge icon={Zap}    value="12,340" label="Total XP" color="#A78BFA" />
        <StatBadge icon={Trophy} value="Lv 19" label="Level" color="#F59E0B" />
        <StatBadge icon={Target} value="N4" label="Current JLPT" color="#3B82F6" />
      </div>

      {/* XP Progress */}
      <div className="glass neon-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#F5F3FF" }}>Level 19 → 20</div>
            <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>2,660 XP to next level</div>
          </div>
          <div className={showLevelUp ? "anim-level-pop" : ""} style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)", borderRadius: 10, padding: "4px 12px" }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 13, color: "white" }}>19</span>
          </div>
        </div>
        <ProgressBar value={72} max={100} />
        <div className="flex justify-between mt-2">
          <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.35)" }}>12,340 XP</span>
          <span style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.35)" }}>15,000 XP</span>
        </div>
      </div>

      {/* Continue Learning hero card */}
      <div className="rounded-2xl overflow-hidden hover-lift neon-border" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.3) 0%,rgba(236,72,153,0.2) 100%)", cursor: "pointer" }} onClick={() => setView("learn")}>
        <div className="flex items-center justify-between p-5">
          <div>
            <span className="tag-pill">N4 · Lesson 12</span>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: "#F5F3FF", marginTop: 10 }}>Te-form Verbs</div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.6)", marginTop: 4 }}>Connecting actions and making requests</div>
            <div className="flex items-center gap-3 mt-4">
              <button className="btn-grad rounded-xl px-5 py-2.5" style={{ cursor: "pointer" }}>
                <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "white" }}>Continue</span>
              </button>
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)" }}>~12 min left</span>
            </div>
          </div>
          <div style={{ opacity: 0.9 }}>
            <SakuraAI pose="teaching" size={110} />
          </div>
        </div>
        <div style={{ background: "rgba(124,58,237,0.15)", padding: "8px 20px" }}>
          <ProgressBar value={68} height={4} />
          <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.4)", marginTop: 4 }}>68% complete</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionTitle>Quick Practice</SectionTitle>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map(({ label, Icon, view, color }) => (
            <button key={label} onClick={() => setView(view)} className="glass neon-border rounded-xl p-4 hover-lift flex flex-col items-center gap-2" style={{ cursor: "pointer" }}>
              <div style={{ background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 10, padding: 10 }}>
                <Icon size={20} color={color} />
              </div>
              <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 12, color: "#F5F3FF" }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's progress */}
      <div>
        <SectionTitle action={<button style={{ fontFamily: "Inter", fontSize: 12, color: "#A78BFA", background: "none", border: "none", cursor: "pointer" }}>View all</button>}>Today&apos;s Progress</SectionTitle>
        <div className="flex flex-col gap-2">
          {[
            { label: "Vocabulary", done: 18, total: 20, color: "#EC4899" },
            { label: "Kanji",      done: 7,  total: 10, color: "#7C3AED" },
            { label: "Grammar",    done: 3,  total: 5,  color: "#3B82F6" },
            { label: "Listening",  done: 2,  total: 4,  color: "#10B981" },
          ].map(({ label, done, total, color }) => (
            <div key={label} className="glass neon-border rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 13, color: "#F5F3FF" }}>{label}</span>
                <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.5)" }}>{done}/{total}</span>
              </div>
              <ProgressBar value={done} max={total} color={`linear-gradient(90deg,${color},${color}99)`} height={5} />
            </div>
          ))}
        </div>
      </div>

      {/* Daily Goal */}
      <div className="glass neon-border-pink rounded-2xl p-5" style={{ background: "rgba(236,72,153,0.06)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div style={{ background: "rgba(236,72,153,0.15)", borderRadius: 10, padding: 8 }}>
              <Target size={18} color="#EC4899" />
            </div>
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#F5F3FF" }}>Daily Goal</div>
              <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>50 XP per day</div>
            </div>
          </div>
          <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 24, color: "#EC4899" }}>38<span style={{ fontSize: 14, color: "rgba(245,243,255,0.4)" }}>/50</span></div>
        </div>
        <ProgressBar value={38} max={50} color="linear-gradient(90deg,#EC4899,#F472B6)" />
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)", marginTop: 6 }}>12 more XP to complete today&apos;s goal</div>
      </div>

      {/* Sakura AI tip */}
      <div className="glass neon-border rounded-2xl p-5 flex items-center gap-4">
        <SakuraAI pose="thinking" size={70} />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={14} color="#F59E0B" />
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#F5F3FF" }}>Sakura&apos;s Tip</span>
          </div>
          <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.65)", lineHeight: 1.6 }}>
            Try reviewing kanji for 10 minutes before bed — memory consolidates during sleep!
          </div>
          <button onClick={() => setView("sakura-ai")} style={{ fontFamily: "Inter", fontSize: 12, color: "#A78BFA", background: "none", border: "none", cursor: "pointer", marginTop: 6, padding: 0 }}>
            Ask Sakura more →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LEARN VIEW ───────────────────────────────────────────────────────────────
function LearnView() {
  const [selectedLevel, setSelectedLevel] = useState(0);
  const level = JLPT[selectedLevel];

  const categories = [
    { name: "Vocabulary",  done: 124, total: 200, Icon: BookOpen },
    { name: "Grammar",     done: 38,  total: 80,  Icon: Layers },
    { name: "Kanji",       done: 89,  total: 150, Icon: Edit3 },
    { name: "Listening",   done: 12,  total: 30,  Icon: Headphones },
    { name: "Reading",     done: 8,   total: 20,  Icon: Eye },
    { name: "Speaking",    done: 15,  total: 25,  Icon: Mic },
  ];

  return (
    <div className="view-transition flex flex-col gap-6 pb-6">
      <div>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 24, color: "#F5F3FF" }}>JLPT Pathway</h2>
        <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>Structured curriculum from N5 to N1</p>
      </div>

      {/* JLPT Level Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {JLPT.map((j, i) => (
          <button key={j.level} onClick={() => setSelectedLevel(i)} className="rounded-xl px-5 py-3 hover-lift" style={{ background: selectedLevel === i ? `${j.color}25` : "rgba(124,58,237,0.07)", border: `1px solid ${selectedLevel === i ? j.color : "rgba(124,58,237,0.2)"}`, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", boxShadow: selectedLevel === i ? `0 0 20px ${j.color}30` : "none" }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 16, color: selectedLevel === i ? j.color : "rgba(245,243,255,0.6)" }}>{j.level}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: selectedLevel === i ? `${j.color}cc` : "rgba(245,243,255,0.35)" }}>{j.label}</div>
          </button>
        ))}
      </div>

      {/* Level detail */}
      <div className="glass neon-border rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${level.color}12 0%, rgba(17,12,30,0.8) 100%)` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 32, color: level.color }}>{level.level}</div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.6)" }}>{level.label} • {level.lessons}/{level.total} lessons</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 28, color: "#F5F3FF" }}>{level.progress}%</div>
            <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>complete</div>
          </div>
        </div>
        <ProgressBar value={level.progress} color={`linear-gradient(90deg,${level.color},${level.color}88)`} height={8} />
        <button className="btn-grad rounded-xl px-6 py-3 mt-5" style={{ cursor: "pointer" }}>
          <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "white" }}>Continue {level.level} Course</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <SectionTitle>{level.level} Categories</SectionTitle>
        <div className="grid grid-cols-1 gap-3">
          {categories.map(({ name, done, total, Icon }) => (
            <div key={name} className="glass neon-border rounded-xl px-5 py-4 hover-lift" style={{ cursor: "pointer" }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div style={{ background: "rgba(124,58,237,0.15)", borderRadius: 8, padding: 8 }}>
                    <Icon size={16} color="#A78BFA" />
                  </div>
                  <div>
                    <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#F5F3FF" }}>{name}</div>
                    <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>{done}/{total} completed</div>
                  </div>
                </div>
                <ChevronRight size={16} color="rgba(245,243,255,0.3)" />
              </div>
              <ProgressBar value={done} max={total} height={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── KANJI VIEW ───────────────────────────────────────────────────────────────
function KanjiView() {
  const [selected, setSelected] = useState(0);
  const [practicing, setPracticing] = useState(false);
  const k = KANJI_DATA[selected];

  return (
    <div className="view-transition flex flex-col gap-6 pb-6">
      <div>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 24, color: "#F5F3FF" }}>Kanji Practice</h2>
        <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>Learn stroke order, meaning, and readings</p>
      </div>

      {/* Kanji grid */}
      <div className="grid grid-cols-4 gap-2">
        {KANJI_DATA.map((k, i) => (
          <button key={k.char} onClick={() => { setSelected(i); setPracticing(false); }} className="glass neon-border rounded-xl py-4 hover-lift" style={{ cursor: "pointer", background: selected === i ? "rgba(124,58,237,0.2)" : undefined, border: selected === i ? "1px solid rgba(124,58,237,0.55)" : undefined }}>
            <div style={{ fontFamily: "Noto Sans JP", fontWeight: 700, fontSize: 26, color: selected === i ? "#F5F3FF" : "rgba(245,243,255,0.7)", textAlign: "center" }}>{k.char}</div>
            <div style={{ fontFamily: "Inter", fontSize: 10, color: "rgba(245,243,255,0.4)", textAlign: "center", marginTop: 2 }}>{k.level}</div>
          </button>
        ))}
      </div>

      {/* Kanji detail */}
      <div className="glass neon-border rounded-2xl p-6">
        {/* Main character with stroke animation */}
        <div className="flex items-center gap-6 mb-5">
          <div className="glow-md rounded-2xl flex items-center justify-center" style={{ width: 100, height: 100, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.35)" }}>
            <svg viewBox="0 0 100 100" width="80" height="80">
              <text x="50" y="72" textAnchor="middle" style={{ fontFamily: "Noto Sans JP", fontSize: 68, fill: "#A78BFA" }} className="kanji-stroke-path">{k.char}</text>
            </svg>
          </div>
          <div className="flex-1">
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: "#F5F3FF" }}>{k.meaning}</div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.55)", marginTop: 4 }}>{k.strokes} strokes • {k.level}</div>
            <div className="flex gap-2 mt-3">
              <span className="tag-pill">音: {k.on}</span>
              <span className="tag-pill-pink">訓: {k.kun}</span>
            </div>
          </div>
        </div>

        {/* Readings */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-xl px-4 py-3" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.45)", marginBottom: 4 }}>ON-YOMI (音読み)</div>
            <div style={{ fontFamily: "Noto Sans JP", fontWeight: 500, fontSize: 15, color: "#A78BFA" }}>{k.on}</div>
          </div>
          <div className="rounded-xl px-4 py-3" style={{ background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)" }}>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.45)", marginBottom: 4 }}>KUN-YOMI (訓読み)</div>
            <div style={{ fontFamily: "Noto Sans JP", fontWeight: 500, fontSize: 15, color: "#F9A8D4" }}>{k.kun}</div>
          </div>
        </div>

        {/* Example words */}
        <div>
          <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "rgba(245,243,255,0.6)", marginBottom: 8 }}>EXAMPLE WORDS</div>
          <div className="flex gap-2 flex-wrap">
            {k.examples.map(ex => (
              <div key={ex} className="flex items-center gap-2 rounded-xl px-3 py-2 hover-lift" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", cursor: "pointer" }}>
                <span style={{ fontFamily: "Noto Sans JP", fontSize: 16, color: "#F5F3FF" }}>{ex}</span>
                <Volume2 size={12} color="#A78BFA" />
              </div>
            ))}
          </div>
        </div>

        {/* Practice button */}
        <div className="flex gap-3 mt-5">
          <button onClick={() => setPracticing(!practicing)} className="btn-grad rounded-xl px-5 py-3 flex items-center gap-2" style={{ cursor: "pointer" }}>
            <Pencil size={16} />
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "white" }}>{practicing ? "Stop Practice" : "Practice Writing"}</span>
          </button>
          <button className="btn-ghost rounded-xl px-4 py-3 flex items-center gap-2" style={{ cursor: "pointer" }}>
            <Volume2 size={16} />
            <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 14 }}>Listen</span>
          </button>
          <button className="btn-ghost rounded-xl px-4 py-3 flex items-center gap-2" style={{ cursor: "pointer" }}>
            <Bookmark size={16} />
          </button>
        </div>

        {/* Practice canvas */}
        {practicing && (
          <div className="mt-5 rounded-xl overflow-hidden anim-slide-up" style={{ background: "rgba(9,6,15,0.8)", border: "1px solid rgba(124,58,237,0.3)", height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ opacity: 0.15, fontFamily: "Noto Sans JP", fontSize: 120, color: "#7C3AED", position: "absolute", userSelect: "none" }}>{k.char}</div>
            <div style={{ zIndex: 1, textAlign: "center" }}>
              <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)" }}>Tap and draw to practice</div>
              <div style={{ fontFamily: "Noto Sans JP", fontSize: 12, color: "rgba(245,243,255,0.3)", marginTop: 4 }}>Writing canvas • {k.strokes} strokes</div>
            </div>
            <button className="btn-ghost rounded-xl px-4 py-2 flex items-center gap-2" style={{ cursor: "pointer", zIndex: 1 }}>
              <RotateCcw size={14} />
              <span style={{ fontFamily: "Inter", fontSize: 13 }}>Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Sakura hint */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <SakuraAI pose="chat" size={45} />
        <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.65)", lineHeight: 1.6 }}>
          <strong style={{ color: "#A78BFA" }}>Memory tip:</strong> Associate {k.char} with its visual shape — imagine a {k.meaning.toLowerCase()} when you see this character!
        </div>
      </div>
    </div>
  );
}

// ─── VOCABULARY VIEW ──────────────────────────────────────────────────────────
function VocabView() {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");
  const filters = ["All", "N5", "N4", "Favorites", "Review"];

  const filtered = filter === "All" ? VOCAB : filter === "Favorites" ? VOCAB.slice(0, 3) : VOCAB.filter(v => v.level === filter);

  return (
    <div className="view-transition flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 24, color: "#F5F3FF" }}>Vocabulary</h2>
          <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>SRS-powered spaced repetition</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost rounded-xl p-2.5" style={{ cursor: "pointer" }}><Search size={16} /></button>
          <button className="btn-ghost rounded-xl p-2.5" style={{ cursor: "pointer" }}><Filter size={16} /></button>
        </div>
      </div>

      {/* SRS Status */}
      <div className="grid grid-cols-3 gap-3">
        {[["24","Due Today","#EC4899"],["156","Learning","#F59E0B"],["389","Mastered","#10B981"]].map(([n,l,c]) => (
          <div key={l} className="glass neon-border rounded-xl p-3 text-center">
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: c }}>{n}</div>
            <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.45)", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Start Review button */}
      <button className="btn-grad rounded-xl py-4 flex items-center justify-center gap-3" style={{ cursor: "pointer" }}>
        <Play size={18} />
        <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 15, color: "white" }}>Start SRS Review (24 cards)</span>
      </button>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className="rounded-xl px-4 py-2 hover-scale" style={{ background: filter === f ? "rgba(124,58,237,0.25)" : "rgba(124,58,237,0.07)", border: `1px solid ${filter === f ? "rgba(124,58,237,0.55)" : "rgba(124,58,237,0.18)"}`, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
            <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 13, color: filter === f ? "#C4B5FD" : "rgba(245,243,255,0.5)" }}>{f}</span>
          </button>
        ))}
      </div>

      {/* Vocab cards — flip on click */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((v, i) => (
          <div key={v.word} className="card-3d-wrap" style={{ height: 100 }}>
            <div className={`card-3d ${flipped === i ? "flipped" : ""}`} style={{ width: "100%", height: "100%" }} onClick={() => setFlipped(flipped === i ? null : i)}>
              {/* Front */}
              <div className="card-face glass neon-border rounded-xl px-5 py-4 flex items-center justify-between hover-lift" style={{ cursor: "pointer" }}>
                <div>
                  <div style={{ fontFamily: "Noto Sans JP", fontWeight: 700, fontSize: 28, color: "#F5F3FF" }}>{v.word}</div>
                  <div style={{ fontFamily: "Noto Sans JP", fontSize: 13, color: "#A78BFA", marginTop: 2 }}>{v.reading}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <div key={s} style={{ width: 6, height: 6, borderRadius: "50%", background: s <= v.mastery ? "#7C3AED" : "rgba(124,58,237,0.2)" }} />
                    ))}
                  </div>
                  <span className={`tag-pill ${v.level === "N4" ? "tag-pill-teal" : ""}`}>{v.level}</span>
                </div>
              </div>
              {/* Back */}
              <div className="card-back card-face glass rounded-xl px-5 py-4 flex items-center justify-between" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", cursor: "pointer" }}>
                <div>
                  <div style={{ fontFamily: "Inter", fontWeight: 700, fontSize: 20, color: "#F5F3FF" }}>{v.meaning}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 13, color: "#A78BFA", marginTop: 3 }}>{v.type}</div>
                </div>
                <div className="flex gap-2">
                  <button className="btn-ghost rounded-xl px-3 py-2" style={{ cursor: "pointer", fontSize: 12 }}>
                    <Volume2 size={14} color="#A78BFA" />
                  </button>
                  <button className="rounded-xl px-3 py-2" style={{ cursor: "pointer", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                    <Check size={14} color="#10B981" />
                  </button>
                  <button className="rounded-xl px-3 py-2" style={{ cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)" }}>
                    <X size={14} color="#EF4444" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SPEAKING VIEW ────────────────────────────────────────────────────────────
function SpeakingView() {
  const [recording, setRecording] = useState(false);
  const [scored, setScored] = useState(false);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const phrase = SPEAKING_PHRASES[phraseIdx];

  const handleRecord = () => {
    if (!recording) {
      setRecording(true);
      setScored(false);
      setTimeout(() => { setRecording(false); setScored(true); }, 2500);
    }
  };

  return (
    <div className="view-transition flex flex-col gap-6 pb-6">
      <div>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 24, color: "#F5F3FF" }}>Speaking Practice</h2>
        <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>AI-powered pronunciation scoring</p>
      </div>

      {/* Sakura + phrase */}
      <div className="glass neon-border rounded-2xl p-6 flex flex-col items-center text-center">
        <SakuraAI pose={scored ? "celebration" : recording ? "teaching" : "chat"} size={120} className="anim-float" />

        <div style={{ marginTop: 16, fontFamily: "Noto Sans JP", fontWeight: 700, fontSize: 28, color: "#F5F3FF" }}>{phrase.jp}</div>
        <div style={{ fontFamily: "Inter", fontSize: 14, color: "#A78BFA", marginTop: 6 }}>{phrase.romaji}</div>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>{phrase.en}</div>

        {/* Waveform visualization */}
        <div className="flex items-end justify-center gap-1.5 mt-6" style={{ height: 48 }}>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className={recording ? "mic-bar" : ""} style={{
              width: 4, height: recording ? "100%" : "20%", background: recording ? "linear-gradient(180deg,#EC4899,#7C3AED)" : "rgba(124,58,237,0.25)",
              borderRadius: 2, transformOrigin: "bottom", minHeight: 4,
              "--d": `${0.4 + Math.random() * 0.6}s`,
              "--delay": `${i * 0.05}s`,
              transition: recording ? "none" : "height 0.5s ease",
            } as React.CSSProperties} />
          ))}
        </div>

        {/* Score display */}
        {scored && (
          <div className="mt-5 anim-bounce-in rounded-2xl px-8 py-4" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 40, color: "#10B981" }}>87<span style={{ fontSize: 20 }}>/100</span></div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.6)", marginTop: 4 }}>Great pronunciation! Work on the long vowel.</div>
          </div>
        )}

        {/* Record button */}
        <button onClick={handleRecord} className="mt-6" style={{ position: "relative", cursor: "pointer", background: "none", border: "none" }}>
          {recording && (
            <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px solid rgba(236,72,153,0.5)", animation: "pulse-ring 1s ease-out infinite" }} />
          )}
          <div className={`glow-acc flex items-center justify-center rounded-full`} style={{ width: 72, height: 72, background: recording ? "linear-gradient(135deg,#EC4899,#F472B6)" : "linear-gradient(135deg,#7C3AED,#EC4899)", transition: "all 0.3s ease" }}>
            {recording ? <Pause size={28} color="white" /> : <Mic size={28} color="white" />}
          </div>
        </button>
        <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.45)", marginTop: 10 }}>{recording ? "Recording… speak clearly" : "Tap to record"}</div>
      </div>

      {/* Phrase navigation */}
      <div className="flex items-center justify-between">
        <button onClick={() => { setPhraseIdx(Math.max(0, phraseIdx - 1)); setScored(false); }} className="btn-ghost rounded-xl px-4 py-2 flex items-center gap-2" style={{ cursor: phraseIdx > 0 ? "pointer" : "not-allowed", opacity: phraseIdx > 0 ? 1 : 0.4 }}>
          <ChevronLeft size={16} />
          <span style={{ fontFamily: "Inter", fontSize: 14 }}>Previous</span>
        </button>
        <span style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.4)" }}>{phraseIdx + 1} / {SPEAKING_PHRASES.length}</span>
        <button onClick={() => { setPhraseIdx(Math.min(SPEAKING_PHRASES.length - 1, phraseIdx + 1)); setScored(false); }} className="btn-ghost rounded-xl px-4 py-2 flex items-center gap-2" style={{ cursor: phraseIdx < SPEAKING_PHRASES.length - 1 ? "pointer" : "not-allowed", opacity: phraseIdx < SPEAKING_PHRASES.length - 1 ? 1 : 0.4 }}>
          <span style={{ fontFamily: "Inter", fontSize: 14 }}>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* AI Feedback */}
      {scored && (
        <div className="glass neon-border rounded-2xl p-5 anim-slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} color="#F59E0B" />
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#F5F3FF" }}>Sakura AI Feedback</span>
          </div>
          <div className="flex flex-col gap-2">
            {[["Pitch Accent","Good — descending correctly","#10B981"],["Vowel Length","あ sound slightly short","#F59E0B"],["Clarity","Excellent consonant clarity","#10B981"]].map(([k, v, c]) => (
              <div key={k} className="flex items-center justify-between rounded-xl px-4 py-2.5" style={{ background: `${c}12`, border: `1px solid ${c}30` }}>
                <span style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.65)" }}>{k}</span>
                <span style={{ fontFamily: "Inter", fontWeight: 500, fontSize: 13, color: c }}>{v}</span>
              </div>
            ))}
          </div>
          <button className="btn-grad rounded-xl py-3 w-full mt-4" style={{ cursor: "pointer" }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "white" }}>Practice Again</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SAKURA AI CHAT VIEW ──────────────────────────────────────────────────────
function SakuraAIView() {
  const [messages, setMessages] = useState(AI_MESSAGES_INIT);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = ["Explain が vs は", "N5 grammar point", "Kanji stroke order", "Daily vocabulary", "Check my sentence"];

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const sakuraReply = { role: "sakura", text: "Great question! Let me help you with that. In Japanese, this concept is very important for daily communication. Practice it with simple sentences first, then move to more complex structures. がんばって！", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(m => [...m, userMsg, sakuraReply]);
    setInput("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="view-transition flex flex-col h-full" style={{ minHeight: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="anim-float-alt">
          <SakuraAI pose="chat" size={60} />
        </div>
        <div>
          <h2 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: "#F5F3FF" }}>Sakura AI</h2>
          <div className="flex items-center gap-2">
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
            <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.5)" }}>Online — ready to teach</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="btn-ghost rounded-xl p-2.5" style={{ cursor: "pointer" }}><Mic size={16} /></button>
          <button className="btn-ghost rounded-xl p-2.5" style={{ cursor: "pointer" }}><MoreHorizontal size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4" style={{ minHeight: 300, maxHeight: 440 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""} anim-slide-up`}>
            {m.role === "sakura" && <SakuraAI pose="chat" size={40} />}
            <div style={{ maxWidth: "75%" }}>
              <div className="rounded-2xl px-4 py-3" style={{
                background: m.role === "user" ? "linear-gradient(135deg,#7C3AED,#9333EA)" : "rgba(30,19,53,0.9)",
                border: m.role === "user" ? "none" : "1px solid rgba(124,58,237,0.25)",
                borderBottomLeftRadius: m.role === "sakura" ? 4 : undefined,
                borderBottomRightRadius: m.role === "user" ? 4 : undefined,
              }}>
                <div style={{ fontFamily: "Inter", fontSize: 14, color: "#F5F3FF", lineHeight: 1.7, whiteSpace: "pre-line" }}>{m.text}</div>
              </div>
              <div style={{ fontFamily: "Inter", fontSize: 10, color: "rgba(245,243,255,0.3)", marginTop: 4, textAlign: m.role === "user" ? "right" : "left" }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-3">
        {suggestions.map(s => (
          <button key={s} onClick={() => setInput(s)} className="rounded-xl px-3 py-2 hover-scale" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.25)", cursor: "pointer", whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "Inter", fontSize: 12, color: "#C4B5FD" }}>{s}</span>
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2 mt-1">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} className="input-velmorth flex-1 rounded-xl px-4 py-3" placeholder="Ask Sakura anything…" style={{ fontSize: 14 }} />
        <button onClick={sendMessage} className="btn-grad rounded-xl px-4 py-3" style={{ cursor: "pointer" }}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── COMMUNITY VIEW ───────────────────────────────────────────────────────────
function CommunityView() {
  const [tab, setTab] = useState<"leaderboard" | "friends" | "challenges">("leaderboard");
  const rankColors: Record<number, string> = { 1: "#F59E0B", 2: "#94A3B8", 3: "#CD7C3A" };

  return (
    <div className="view-transition flex flex-col gap-5 pb-6">
      <div>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 24, color: "#F5F3FF" }}>Community</h2>
        <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.5)", marginTop: 4 }}>Compete, connect, and grow together</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 glass neon-border rounded-xl p-1">
        {(["leaderboard","friends","challenges"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 rounded-lg py-2.5 capitalize" style={{ background: tab === t ? "rgba(124,58,237,0.3)" : "transparent", border: tab === t ? "1px solid rgba(124,58,237,0.4)" : "1px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: tab === t ? "#C4B5FD" : "rgba(245,243,255,0.45)" }}>{t}</span>
          </button>
        ))}
      </div>

      {tab === "leaderboard" && (
        <>
          {/* Weekly challenge card */}
          <div className="glass neon-border-pink rounded-2xl p-5" style={{ background: "rgba(236,72,153,0.07)" }}>
            <div className="flex items-center gap-3 mb-3">
              <Trophy size={20} color="#EC4899" />
              <div>
                <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "#F5F3FF" }}>Weekly Leaderboard</div>
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>Resets in 3d 14h</div>
              </div>
            </div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.6)" }}>You are rank <strong style={{ color: "#EC4899" }}>#4</strong> — earn 2,080 more XP to reach #3</div>
          </div>

          {/* Leaderboard list */}
          <div className="flex flex-col gap-2">
            {LEADERBOARD_DATA.map(u => (
              <div key={u.rank} className={`flex items-center gap-4 rounded-xl px-4 py-3 hover-lift ${u.isUser ? "glow-xs" : ""}`} style={{ background: u.isUser ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.05)", border: `1px solid ${u.isUser ? "rgba(124,58,237,0.45)" : "rgba(124,58,237,0.15)"}`, cursor: "pointer" }}>
                <div style={{ width: 28, textAlign: "center", fontFamily: "Poppins", fontWeight: 700, fontSize: 16, color: rankColors[u.rank] || "rgba(245,243,255,0.4)" }}>
                  {u.rank <= 3 ? ["🥇","🥈","🥉"][u.rank - 1] : u.rank}
                </div>
                <div className="flex-1">
                  <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: u.isUser ? "#F5F3FF" : "rgba(245,243,255,0.8)" }}>
                    {u.name} {u.isUser && <span style={{ fontFamily: "Inter", fontSize: 11, color: "#A78BFA", fontWeight: 400 }}>· You</span>}
                  </div>
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)", marginTop: 1 }}>Level {u.level} · {u.streak}d streak</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 15, color: u.isUser ? "#A78BFA" : "rgba(245,243,255,0.7)" }}>{u.xp.toLocaleString()}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.35)" }}>XP</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "friends" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <SakuraAI pose="sad" size={100} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 18, color: "#F5F3FF" }}>No study friends yet</div>
            <div style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.45)", marginTop: 6 }}>Add friends to study together and stay motivated</div>
          </div>
          <button className="btn-grad rounded-xl px-6 py-3" style={{ cursor: "pointer" }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 14, color: "white" }}>Find Study Partners</span>
          </button>
        </div>
      )}

      {tab === "challenges" && (
        <div className="flex flex-col gap-3">
          {[
            { title: "7-Day Vocab Sprint", desc: "Learn 70 new words this week", reward: "500 XP", participants: 1240, ends: "5d left", active: true },
            { title: "Kanji Conqueror", desc: "Write 30 kanji without hints", reward: "300 XP", participants: 890, ends: "2d left", active: false },
            { title: "N5 Grammar Master", desc: "Score 90%+ on grammar quiz", reward: "250 XP", participants: 2100, ends: "Today", active: false },
          ].map(c => (
            <div key={c.title} className="glass neon-border rounded-xl p-5 hover-lift" style={{ cursor: "pointer" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 15, color: "#F5F3FF" }}>{c.title}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)", marginTop: 3 }}>{c.desc}</div>
                </div>
                <span className="tag-pill" style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA" }}>{c.reward}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)" }}>{c.participants.toLocaleString()} participants · {c.ends}</div>
                <button className={c.active ? "btn-ghost" : "btn-grad"} style={{ borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, fontFamily: "Inter", fontWeight: 600, color: c.active ? "#A78BFA" : "white" }}>{c.active ? "Joined" : "Join"}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE VIEW ─────────────────────────────────────────────────────────────
function ProfileView({ setView }: { setView: (v: string) => void }) {
  return (
    <div className="view-transition flex flex-col gap-5 pb-6">
      {/* Profile header */}
      <div className="glass neon-border rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="glow-sm rounded-2xl overflow-hidden" style={{ width: 72, height: 72, background: "linear-gradient(135deg,#7C3AED,#EC4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 28, color: "white" }}>YT</span>
            </div>
            <div className="anim-bounce-in absolute -bottom-1 -right-1 rounded-full px-2 py-0.5 xp-badge" style={{ fontSize: 11, fontFamily: "Poppins", fontWeight: 700, color: "white" }}>19</div>
          </div>
          <div className="flex-1">
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 20, color: "#F5F3FF" }}>Yuki Tanaka</div>
            <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.5)" }}>@yukitanaka · Member since 2024</div>
            <div className="flex gap-2 mt-2">
              <span className="tag-pill">N4 Student</span>
              <span className="tag-pill-pink">15-day streak</span>
            </div>
          </div>
          <button className="btn-ghost rounded-xl p-2.5" style={{ cursor: "pointer" }}><Edit3 size={16} /></button>
        </div>

        {/* XP progress */}
        <div className="mt-5">
          <div className="flex justify-between mb-2">
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#F5F3FF" }}>Level 19 Progress</span>
            <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.45)" }}>12,340 / 15,000 XP</span>
          </div>
          <ProgressBar value={12340} max={15000} height={8} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[["15","Day Streak","#F97316"],["12,340","Total XP","#7C3AED"],["#4","Global Rank","#F59E0B"]].map(([v,l,c]) => (
            <div key={l} className="rounded-xl px-3 py-3 text-center" style={{ background: `${c}12`, border: `1px solid ${c}25` }}>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 18, color: c }}>{v}</div>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.4)", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <SectionTitle action={<button style={{ fontFamily: "Inter", fontSize: 12, color: "#A78BFA", background: "none", border: "none", cursor: "pointer" }}>View all</button>}>Achievements</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS_DATA.map(({ title, desc, Icon, earned, xp }) => (
            <div key={title} className={`glass neon-border rounded-xl p-4 hover-lift ${!earned ? "achievement-locked" : ""}`} style={{ cursor: "pointer" }}>
              <div className="flex items-center gap-3 mb-2">
                <div style={{ background: earned ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.08)", borderRadius: 8, padding: 8, border: `1px solid ${earned ? "rgba(124,58,237,0.4)" : "rgba(124,58,237,0.15)"}` }}>
                  <Icon size={18} color={earned ? "#A78BFA" : "rgba(167,139,250,0.4)"} />
                </div>
              </div>
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: earned ? "#F5F3FF" : "rgba(245,243,255,0.4)" }}>{title}</div>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.4)", marginTop: 2 }}>{desc}</div>
              <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 11, color: earned ? "#A78BFA" : "rgba(245,243,255,0.25)", marginTop: 6 }}>+{xp} XP</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <div className="flex flex-col gap-2">
        {[
          { label: "Subscription",   Icon: Crown,       action: () => setView("premium") },
          { label: "Bookmarks",      Icon: Bookmark,    action: () => {} },
          { label: "Certificates",   Icon: Award,       action: () => {} },
          { label: "Download Packs", Icon: Download,    action: () => {} },
          { label: "Settings",       Icon: Settings,    action: () => setView("settings") },
        ].map(({ label, Icon, action }) => (
          <button key={label} onClick={action} className="flex items-center justify-between glass neon-border rounded-xl px-5 py-4 hover-lift w-full" style={{ cursor: "pointer" }}>
            <div className="flex items-center gap-3">
              <Icon size={18} color="#A78BFA" />
              <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 14, color: "#F5F3FF" }}>{label}</span>
            </div>
            <ChevronRight size={16} color="rgba(245,243,255,0.3)" />
          </button>
        ))}
        <button className="flex items-center justify-between rounded-xl px-5 py-4 hover-lift w-full" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}>
          <div className="flex items-center gap-3">
            <LogOut size={18} color="#EF4444" />
            <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 14, color: "#EF4444" }}>Sign Out</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── PREMIUM VIEW ─────────────────────────────────────────────────────────────
function PremiumView() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const plans = [
    { id: "monthly", label: "Monthly", price: "$12.99", sub: "/month", savings: null },
    { id: "yearly",  label: "Yearly",  price: "$7.99",  sub: "/month", savings: "Save 38%" },
  ];

  const features = [
    "Unlimited JLPT lessons (N5–N1)",
    "Sakura AI unlimited conversations",
    "Speaking practice & scoring",
    "Offline mode — download packs",
    "Advanced SRS vocabulary system",
    "Mock exams & detailed analytics",
    "Priority support",
    "Certificates of completion",
  ];

  return (
    <div className="view-transition flex flex-col gap-6 pb-6">
      {/* Hero */}
      <div className="glass neon-border rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))" }}>
        <div className="anim-float inline-block">
          <SakuraAI pose="celebration" size={130} />
        </div>
        <h2 className="text-glow" style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 28, color: "#F5F3FF", marginTop: 12 }}>Unlock Velmorth Premium</h2>
        <p style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.55)", marginTop: 6, lineHeight: 1.7 }}>
          Everything you need to achieve Japanese mastery — from N5 beginner to N1 fluency.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex gap-1 glass neon-border rounded-xl p-1">
        {plans.map(p => (
          <button key={p.id} onClick={() => setBilling(p.id as "monthly" | "yearly")} className="flex-1 rounded-lg py-3 flex items-center justify-center gap-2" style={{ background: billing === p.id ? "rgba(124,58,237,0.3)" : "transparent", border: billing === p.id ? "1px solid rgba(124,58,237,0.45)" : "1px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: billing === p.id ? "#C4B5FD" : "rgba(245,243,255,0.45)" }}>{p.label}</span>
            {p.savings && <span style={{ fontFamily: "Inter", fontSize: 11, color: "#10B981", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 999, padding: "2px 6px" }}>{p.savings}</span>}
          </button>
        ))}
      </div>

      {/* Price display */}
      <div className="glass glow-md neon-border rounded-2xl p-6 text-center">
        <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 48, color: "#F5F3FF" }}>
          {billing === "yearly" ? "$7.99" : "$12.99"}
          <span style={{ fontSize: 16, color: "rgba(245,243,255,0.45)", fontWeight: 400 }}>/month</span>
        </div>
        {billing === "yearly" && <div style={{ fontFamily: "Inter", fontSize: 13, color: "rgba(245,243,255,0.45)", marginTop: 4 }}>Billed annually — $95.88/year</div>}
        <button className="btn-grad rounded-2xl py-4 w-full mt-5" style={{ cursor: "pointer" }}>
          <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 16, color: "white" }}>Start 7-Day Free Trial</span>
        </button>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.35)", marginTop: 8 }}>No credit card required · Cancel anytime</div>
      </div>

      {/* Features */}
      <div>
        <SectionTitle>Everything Included</SectionTitle>
        <div className="flex flex-col gap-2">
          {features.map(f => (
            <div key={f} className="flex items-center gap-3 glass neon-border rounded-xl px-4 py-3">
              <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "50%", padding: 4 }}>
                <Check size={12} color="#10B981" />
              </div>
              <span style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.8)" }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial */}
      <div className="glass neon-border-pink rounded-2xl p-5" style={{ background: "rgba(236,72,153,0.06)" }}>
        <div style={{ fontFamily: "Inter", fontSize: 14, color: "rgba(245,243,255,0.7)", lineHeight: 1.7, fontStyle: "italic" }}>
          &ldquo;I passed N3 in just 8 months using Velmorth. Sakura AI made grammar finally click — and I actually enjoyed studying!&rdquo;
        </div>
        <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#F9A8D4", marginTop: 10 }}>— Maria S., JLPT N3 Passer</div>
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────
function SettingsView() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifs, setNotifs] = useState(true);
  const [daily, setDaily] = useState(true);

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, background: value ? "linear-gradient(135deg,#7C3AED,#EC4899)" : "rgba(124,58,237,0.2)", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
    </button>
  );

  const sections = [
    {
      title: "App Preferences",
      items: [
        { label: "Dark Mode", sub: "Always on for best experience", control: <Toggle value={darkMode} onChange={() => setDarkMode(!darkMode)} /> },
        { label: "Daily Reminder", sub: "Get notified to practice", control: <Toggle value={daily} onChange={() => setDaily(!daily)} /> },
        { label: "Notifications", sub: "Streaks, achievements, updates", control: <Toggle value={notifs} onChange={() => setNotifs(!notifs)} /> },
      ]
    },
    {
      title: "Learning",
      items: [
        { label: "Daily Goal", sub: "50 XP per day", control: <ChevronRight size={16} color="rgba(245,243,255,0.3)" /> },
        { label: "Study Reminders", sub: "8:00 PM daily", control: <ChevronRight size={16} color="rgba(245,243,255,0.3)" /> },
        { label: "Download Packs", sub: "For offline learning", control: <ChevronRight size={16} color="rgba(245,243,255,0.3)" /> },
      ]
    },
    {
      title: "Account",
      items: [
        { label: "Change Password", sub: "Update your security", control: <ChevronRight size={16} color="rgba(245,243,255,0.3)" /> },
        { label: "Privacy Settings", sub: "Control your data", control: <ChevronRight size={16} color="rgba(245,243,255,0.3)" /> },
        { label: "Linked Accounts", sub: "Google, Apple, GitHub", control: <ChevronRight size={16} color="rgba(245,243,255,0.3)" /> },
      ]
    }
  ];

  return (
    <div className="view-transition flex flex-col gap-6 pb-6">
      <h2 style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 24, color: "#F5F3FF" }}>Settings</h2>

      {sections.map(s => (
        <div key={s.title}>
          <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>{s.title}</div>
          <div className="flex flex-col gap-2">
            {s.items.map(item => (
              <div key={item.label} className="glass neon-border rounded-xl px-5 py-4 flex items-center justify-between hover-lift" style={{ cursor: "pointer" }}>
                <div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 14, color: "#F5F3FF" }}>{item.label}</div>
                  <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.4)" }}>{item.sub}</div>
                </div>
                {item.control}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div>
        <div style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(239,68,68,0.6)", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>Danger Zone</div>
        <div className="flex flex-col gap-2">
          <button className="glass rounded-xl px-5 py-4 flex items-center gap-3 w-full" style={{ border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}>
            <Trash2 size={16} color="#EF4444" />
            <span style={{ fontFamily: "Poppins", fontWeight: 500, fontSize: 14, color: "#EF4444" }}>Delete Account</span>
          </button>
        </div>
      </div>

      {/* App version */}
      <div style={{ textAlign: "center", fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.25)" }}>
        Velmorth Learning v2.4.1 · Built with Sakura AI
      </div>
    </div>
  );
}

// ─── DASHBOARD LAYOUT ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",      label: "Home",     Icon: Home },
  { id: "learn",     label: "Learn",    Icon: BookOpen },
  { id: "kanji",     label: "Kanji",    Icon: Edit3 },
  { id: "vocab",     label: "Vocab",    Icon: Layers },
  { id: "speaking",  label: "Speaking", Icon: Mic },
  { id: "sakura-ai", label: "Sakura AI",Icon: MessageCircle },
  { id: "community", label: "Community",Icon: Users },
  { id: "profile",   label: "Profile",  Icon: User },
  { id: "premium",   label: "Premium",  Icon: Crown },
  { id: "settings",  label: "Settings", Icon: Settings },
];

function DashboardLayout() {
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    const props = { setView };
    switch (view) {
      case "home":      return <HomeView {...props} />;
      case "learn":     return <LearnView />;
      case "kanji":     return <KanjiView />;
      case "vocab":     return <VocabView />;
      case "speaking":  return <SpeakingView />;
      case "sakura-ai": return <SakuraAIView />;
      case "community": return <CommunityView />;
      case "profile":   return <ProfileView {...props} />;
      case "premium":   return <PremiumView />;
      case "settings":  return <SettingsView />;
      default:          return <HomeView {...props} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#09060F" }}>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col" style={{ width: 240, background: "#0D0818", borderRight: "1px solid rgba(124,58,237,0.15)", flexShrink: 0 }}>
        {/* Logo area */}
        <div className="p-6 pb-4">
          <VelmorthLogo size={30} />
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.slice(0, 8).map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setView(id)} className={`sidebar-item ${view === id ? "active" : ""} flex items-center gap-3 px-4 py-3 w-full`} style={{ cursor: "pointer", background: "none", border: "none", textAlign: "left" }}>
              <Icon size={18} className="s-icon" color={view === id ? "#A78BFA" : "rgba(245,243,255,0.4)"} />
              <span className="s-label" style={{ fontFamily: "Poppins", fontWeight: view === id ? 600 : 400, fontSize: 14, color: view === id ? "#F5F3FF" : "rgba(245,243,255,0.5)" }}>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
          {/* Sakura AI */}
          <button onClick={() => setView("sakura-ai")} className={`sidebar-item ${view === "sakura-ai" ? "active" : ""} flex items-center gap-3 px-4 py-3 w-full mb-1`} style={{ cursor: "pointer", background: view === "sakura-ai" ? "rgba(236,72,153,0.1)" : "rgba(236,72,153,0.05)", border: `1px solid ${view === "sakura-ai" ? "rgba(236,72,153,0.4)" : "rgba(236,72,153,0.15)"}` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
            <span style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#F9A8D4" }}>Sakura AI</span>
            <span className="ml-auto tag-pill-pink" style={{ fontSize: 10 }}>Online</span>
          </button>

          {/* Premium / Settings */}
          <div className="flex gap-2 px-1">
            <button onClick={() => setView("premium")} className={`sidebar-item ${view === "premium" ? "active" : ""} flex-1 flex items-center justify-center gap-2 py-2`} style={{ cursor: "pointer", background: "none", border: "none" }}>
              <Crown size={15} color="#F59E0B" />
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.5)" }}>Premium</span>
            </button>
            <button onClick={() => setView("settings")} className={`sidebar-item ${view === "settings" ? "active" : ""} flex-1 flex items-center justify-center gap-2 py-2`} style={{ cursor: "pointer", background: "none", border: "none" }}>
              <Settings size={15} color="rgba(245,243,255,0.4)" />
              <span style={{ fontFamily: "Inter", fontSize: 12, color: "rgba(245,243,255,0.5)" }}>Settings</span>
            </button>
          </div>

          {/* User card */}
          <div className="flex items-center gap-3 mt-3 px-3 py-3 rounded-xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
            <div className="rounded-xl flex items-center justify-center" style={{ width: 34, height: 34, background: "linear-gradient(135deg,#7C3AED,#EC4899)", flexShrink: 0 }}>
              <span style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 12, color: "white" }}>YT</span>
            </div>
            <div className="flex-1 min-w-0">
              <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: 13, color: "#F5F3FF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Yuki Tanaka</div>
              <div style={{ fontFamily: "Inter", fontSize: 11, color: "rgba(245,243,255,0.4)" }}>Level 19 · N4</div>
            </div>
            <Flame size={14} color="#F97316" className="streak-fire" />
          </div>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0" style={{ background: "rgba(9,6,15,0.8)" }} onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 flex flex-col" style={{ background: "#0D0818", borderRight: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="flex items-center justify-between p-5">
              <VelmorthLogo size={28} />
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(245,243,255,0.5)" }}><X size={20} /></button>
            </div>
            <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
              {NAV_ITEMS.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => { setView(id); setSidebarOpen(false); }} className={`sidebar-item ${view === id ? "active" : ""} flex items-center gap-3 px-4 py-3 w-full`} style={{ cursor: "pointer", background: "none", border: "none", textAlign: "left" }}>
                  <Icon size={18} color={view === id ? "#A78BFA" : "rgba(245,243,255,0.4)"} />
                  <span style={{ fontFamily: "Poppins", fontWeight: view === id ? 600 : 400, fontSize: 14, color: view === id ? "#F5F3FF" : "rgba(245,243,255,0.5)" }}>{label}</span>
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3" style={{ background: "rgba(13,8,24,0.95)", borderBottom: "1px solid rgba(124,58,237,0.15)", backdropFilter: "blur(16px)" }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Menu size={22} color="rgba(245,243,255,0.7)" />
          </button>
          <VelmorthLogo size={24} />
          <div className="relative">
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><Bell size={22} color="rgba(245,243,255,0.7)" /></button>
            <div style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: "#EC4899", borderRadius: "50%", border: "1.5px solid #09060F" }} />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 pt-6 lg:px-8">
            {renderView()}
          </div>
        </main>

        {/* ── BOTTOM NAV (mobile) ── */}
        <nav className="lg:hidden flex" style={{ background: "rgba(13,8,24,0.97)", borderTop: "1px solid rgba(124,58,237,0.18)", backdropFilter: "blur(20px)", paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          {NAV_ITEMS.slice(0, 5).map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setView(id)} className="flex-1 flex flex-col items-center py-3 gap-1" style={{ cursor: "pointer", background: "none", border: "none" }}>
              <Icon size={20} color={view === id ? "#A78BFA" : "rgba(245,243,255,0.35)"} />
              <span style={{ fontFamily: "Inter", fontSize: 10, fontWeight: view === id ? 600 : 400, color: view === id ? "#A78BFA" : "rgba(245,243,255,0.35)" }}>{label}</span>
              {view === id && <div style={{ width: 20, height: 2, borderRadius: 999, background: "linear-gradient(90deg,#7C3AED,#EC4899)", marginTop: -2 }} />}
            </button>
          ))}
          <button onClick={() => setSidebarOpen(true)} className="flex-1 flex flex-col items-center py-3 gap-1" style={{ cursor: "pointer", background: "none", border: "none" }}>
            <MoreHorizontal size={20} color="rgba(245,243,255,0.35)" />
            <span style={{ fontFamily: "Inter", fontSize: 10, color: "rgba(245,243,255,0.35)" }}>More</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<"splash" | "login" | "onboarding" | "dashboard">("splash");

  // Inject global styles once
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    // Apply font families to body
    document.body.style.fontFamily = "Inter, Poppins, Noto Sans JP, sans-serif";
    document.body.style.background = "#09060F";
    return () => document.head.removeChild(style);
  }, []);

  return (
    <>
      {screen === "splash" && <SplashScreen onDone={() => setScreen("login")} />}
      {screen === "login" && <LoginScreen onLogin={() => setScreen("onboarding")} />}
      {screen === "onboarding" && <OnboardingScreen onDone={() => setScreen("dashboard")} />}
      {screen === "dashboard" && <DashboardLayout />}
    </>
  );
}
