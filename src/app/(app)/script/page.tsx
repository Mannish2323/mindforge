'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Eye, EyeOff, Sparkles, BookOpen, Layers, 
  Check, RefreshCw, ChevronRight, HelpCircle
} from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

type ScriptType = 'hiragana' | 'katakana' | 'dakuten' | 'yoon';

interface KanaChar {
  kana: string;
  romaji: string;
  example?: { word: string; reading: string; meaning: string };
}

// ── Gojuon 46 Basic Characters ────────────────────────────────────────────────
const HIRAGANA_GRID: (KanaChar | null)[][] = [
  // A row
  [
    { kana: 'あ', romaji: 'a', example: { word: 'あさ', reading: 'asa', meaning: 'morning' } },
    { kana: 'い', romaji: 'i', example: { word: 'いぬ', reading: 'inu', meaning: 'dog' } },
    { kana: 'う', romaji: 'u', example: { word: 'うみ', reading: 'umi', meaning: 'sea' } },
    { kana: 'え', romaji: 'e', example: { word: 'えき', reading: 'eki', meaning: 'station' } },
    { kana: 'お', romaji: 'o', example: { word: 'お茶', reading: 'ocha', meaning: 'tea' } },
  ],
  // Ka row
  [
    { kana: 'か', romaji: 'ka', example: { word: 'かさ', reading: 'kasa', meaning: 'umbrella' } },
    { kana: 'き', romaji: 'ki', example: { word: '木', reading: 'ki', meaning: 'tree' } },
    { kana: 'く', romaji: 'ku', example: { word: 'くるま', reading: 'kuruma', meaning: 'car' } },
    { kana: 'け', romaji: 'ke', example: { word: 'けさ', reading: 'kesa', meaning: 'this morning' } },
    { kana: 'こ', romaji: 'ko', example: { word: 'こども', reading: 'kodomo', meaning: 'child' } },
  ],
  // Sa row
  [
    { kana: 'さ', romaji: 'sa', example: { word: 'さくら', reading: 'sakura', meaning: 'cherry blossom' } },
    { kana: 'し', romaji: 'shi', example: { word: 'しろ', reading: 'shiro', meaning: 'white' } },
    { kana: 'す', romaji: 'su', example: { word: 'すし', reading: 'sushi', meaning: 'sushi' } },
    { kana: 'せ', romaji: 'se', example: { word: 'せんせい', reading: 'sensei', meaning: 'teacher' } },
    { kana: 'そ', romaji: 'so', example: { word: 'そら', reading: 'sora', meaning: 'sky' } },
  ],
  // Ta row
  [
    { kana: 'た', romaji: 'ta', example: { word: 'たべる', reading: 'taberu', meaning: 'to eat' } },
    { kana: 'ち', romaji: 'chi', example: { word: 'ちず', reading: 'chizu', meaning: 'map' } },
    { kana: 'つ', romaji: 'tsu', example: { word: 'つき', reading: 'tsuki', meaning: 'moon' } },
    { kana: 'て', romaji: 'te', example: { word: '手', reading: 'te', meaning: 'hand' } },
    { kana: 'と', romaji: 'to', example: { word: 'とり', reading: 'tori', meaning: 'bird' } },
  ],
  // Na row
  [
    { kana: 'な', romaji: 'na', example: { word: 'なつ', reading: 'natsu', meaning: 'summer' } },
    { kana: 'に', romaji: 'ni', example: { word: 'にほん', reading: 'nihon', meaning: 'Japan' } },
    { kana: 'ぬ', romaji: 'nu', example: { word: 'ぬいぐるみ', reading: 'nuigurumi', meaning: 'stuffed animal' } },
    { kana: 'ね', romaji: 'ne', example: { word: 'ねこ', reading: 'neko', meaning: 'cat' } },
    { kana: 'の', romaji: 'no', example: { word: 'のむ', reading: 'nomu', meaning: 'to drink' } },
  ],
  // Ha row
  [
    { kana: 'は', romaji: 'ha', example: { word: 'はな', reading: 'hana', meaning: 'flower' } },
    { kana: 'ひ', romaji: 'hi', example: { word: 'ひと', reading: 'hito', meaning: 'person' } },
    { kana: 'ふ', romaji: 'fu', example: { word: 'ふね', reading: 'fune', meaning: 'boat' } },
    { kana: 'へ', romaji: 'he', example: { word: 'へや', reading: 'heya', meaning: 'room' } },
    { kana: 'ほ', romaji: 'ho', example: { word: 'ほん', reading: 'hon', meaning: 'book' } },
  ],
  // Ma row
  [
    { kana: 'ま', romaji: 'ma', example: { word: 'まち', reading: 'machi', meaning: 'town' } },
    { kana: 'み', romaji: 'mi', example: { word: 'みず', reading: 'mizu', meaning: 'water' } },
    { kana: 'む', romaji: 'mu', example: { word: 'むし', reading: 'mushi', meaning: 'insect' } },
    { kana: 'め', romaji: 'me', example: { word: '目', reading: 'me', meaning: 'eye' } },
    { kana: 'も', romaji: 'mo', example: { word: 'もり', reading: 'mori', meaning: 'forest' } },
  ],
  // Ya row
  [
    { kana: 'や', romaji: 'ya', example: { word: 'やま', reading: 'yama', meaning: 'mountain' } },
    null,
    { kana: 'ゆ', romaji: 'yu', example: { word: 'ゆき', reading: 'yuki', meaning: 'snow' } },
    null,
    { kana: 'よ', romaji: 'yo', example: { word: 'よる', reading: 'yoru', meaning: 'night' } },
  ],
  // Ra row
  [
    { kana: 'ら', romaji: 'ra', example: { word: 'らいしゅう', reading: 'raishuu', meaning: 'next week' } },
    { kana: 'り', romaji: 'ri', example: { word: 'りんご', reading: 'ringo', meaning: 'apple' } },
    { kana: 'る', romaji: 'ru', example: { word: 'るす', reading: 'rusu', meaning: 'absence' } },
    { kana: 'れ', romaji: 're', example: { word: 'れいぞうこ', reading: 'reizouko', meaning: 'refrigerator' } },
    { kana: 'ろ', romaji: 'ro', example: { word: 'ろうそく', reading: 'rousoku', meaning: 'candle' } },
  ],
  // Wa / N row
  [
    { kana: 'わ', romaji: 'wa', example: { word: 'わたし', reading: 'watashi', meaning: 'I / me' } },
    null,
    null,
    null,
    { kana: 'を', romaji: 'wo', example: { word: '～を', reading: 'wo', meaning: 'object particle' } },
  ],
  // Special N
  [
    { kana: 'ん', romaji: 'n', example: { word: 'ほん', reading: 'hon', meaning: 'book' } },
    null, null, null, null
  ]
];

const KATAKANA_GRID: (KanaChar | null)[][] = [
  // A row
  [
    { kana: 'ア', romaji: 'a', example: { word: 'アイス', reading: 'aisu', meaning: 'ice cream' } },
    { kana: 'イ', romaji: 'i', example: { word: 'インク', reading: 'inku', meaning: 'ink' } },
    { kana: 'ウ', romaji: 'u', example: { word: 'ウール', reading: 'uuru', meaning: 'wool' } },
    { kana: 'エ', romaji: 'e', example: { word: 'エアコン', reading: 'eakon', meaning: 'air conditioner' } },
    { kana: 'オ', romaji: 'o', example: { word: 'オレンジ', reading: 'orenji', meaning: 'orange' } },
  ],
  // Ka row
  [
    { kana: 'カ', romaji: 'ka', example: { word: 'カメラ', reading: 'kamera', meaning: 'camera' } },
    { kana: 'キ', romaji: 'ki', example: { word: 'キー', reading: 'kii', meaning: 'key' } },
    { kana: 'ク', romaji: 'ku', example: { word: 'クラス', reading: 'kurasu', meaning: 'class' } },
    { kana: 'ケ', romaji: 'ke', example: { word: 'ケーキ', reading: 'keeki', meaning: 'cake' } },
    { kana: 'コ', romaji: 'ko', example: { word: 'コーヒー', reading: 'koohii', meaning: 'coffee' } },
  ],
  // Sa row
  [
    { kana: 'サ', romaji: 'sa', example: { word: 'サラダ', reading: 'sarada', meaning: 'salad' } },
    { kana: 'シ', romaji: 'shi', example: { word: 'シャツ', reading: 'shatsu', meaning: 'shirt' } },
    { kana: 'ス', romaji: 'su', example: { word: 'スポーツ', reading: 'supootsu', meaning: 'sports' } },
    { kana: 'セ', romaji: 'se', example: { word: 'セーター', reading: 'seetaa', meaning: 'sweater' } },
    { kana: 'ソ', romaji: 'so', example: { word: 'ソファー', reading: 'sofaa', meaning: 'sofa' } },
  ],
  // Ta row
  [
    { kana: 'タ', romaji: 'ta', example: { word: 'タクシー', reading: 'takushii', meaning: 'taxi' } },
    { kana: 'チ', romaji: 'chi', example: { word: 'チーズ', reading: 'chiizu', meaning: 'cheese' } },
    { kana: 'ツ', romaji: 'tsu', example: { word: 'ツアー', reading: 'tsuaa', meaning: 'tour' } },
    { kana: 'テ', romaji: 'te', example: { word: 'テスト', reading: 'tesuto', meaning: 'test' } },
    { kana: 'ト', romaji: 'to', example: { word: 'トイレ', reading: 'toire', meaning: 'toilet' } },
  ],
  // Na row
  [
    { kana: 'ナ', romaji: 'na', example: { word: 'ナイフ', reading: 'naifu', meaning: 'knife' } },
    { kana: 'ニ', romaji: 'ni', example: { word: 'ニュース', reading: 'nyuusu', meaning: 'news' } },
    { kana: 'ヌ', romaji: 'nu', example: { word: 'ヌードル', reading: 'nuudoru', meaning: 'noodles' } },
    { kana: 'ネ', romaji: 'ne', example: { word: 'ネクタイ', reading: 'nekutai', meaning: 'necktie' } },
    { kana: 'ノ', romaji: 'no', example: { word: 'ノート', reading: 'nooto', meaning: 'notebook' } },
  ],
  // Ha row
  [
    { kana: 'ハ', romaji: 'ha', example: { word: 'パン', reading: 'pan', meaning: 'bread' } },
    { kana: 'ヒ', romaji: 'hi', example: { word: 'ヒーター', reading: 'hiitaa', meaning: 'heater' } },
    { kana: 'フ', romaji: 'fu', example: { word: 'フォーク', reading: 'fooku', meaning: 'fork' } },
    { kana: 'ヘ', romaji: 'he', example: { word: 'ヘルメット', reading: 'herumetto', meaning: 'helmet' } },
    { kana: 'ホ', romaji: 'ho', example: { word: 'ホテル', reading: 'hoteru', meaning: 'hotel' } },
  ],
  // Ma row
  [
    { kana: 'マ', romaji: 'ma', example: { word: 'マスク', reading: 'masuku', meaning: 'mask' } },
    { kana: 'ミ', romaji: 'mi', example: { word: 'ミルク', reading: 'miruku', meaning: 'milk' } },
    { kana: 'ム', romaji: 'mu', example: { word: 'ムービー', reading: 'muubii', meaning: 'movie' } },
    { kana: 'メ', romaji: 'me', example: { word: 'メール', reading: 'meeru', meaning: 'email' } },
    { kana: 'モ', romaji: 'mo', example: { word: 'モデル', reading: 'moderu', meaning: 'model' } },
  ],
  // Ya row
  [
    { kana: 'ヤ', romaji: 'ya', example: { word: 'ヤード', reading: 'yaado', meaning: 'yard' } },
    null,
    { kana: 'ユ', romaji: 'yu', example: { word: 'ユーザー', reading: 'yuuzaa', meaning: 'user' } },
    null,
    { kana: 'ヨ', romaji: 'yo', example: { word: 'ヨーグルト', reading: 'yooguruto', meaning: 'yogurt' } },
  ],
  // Ra row
  [
    { kana: 'ラ', romaji: 'ra', example: { word: 'ラジオ', reading: 'rajio', meaning: 'radio' } },
    { kana: 'リ', romaji: 'ri', example: { word: 'リーダー', reading: 'riidaa', meaning: 'leader' } },
    { kana: 'ル', romaji: 'ru', example: { word: 'ルール', reading: 'ruuru', meaning: 'rule' } },
    { kana: 'レ', romaji: 're', example: { word: 'レモン', reading: 'remon', meaning: 'lemon' } },
    { kana: 'ロ', romaji: 'ro', example: { word: 'ロボット', reading: 'robotto', meaning: 'robot' } },
  ],
  // Wa / N row
  [
    { kana: 'ワ', romaji: 'wa', example: { word: 'ワイン', reading: 'wain', meaning: 'wine' } },
    null, null, null,
    { kana: 'ヲ', romaji: 'wo', example: { word: 'ヲ', reading: 'wo', meaning: 'object particle' } },
  ],
  // Special N
  [
    { kana: 'ン', romaji: 'n', example: { word: 'サン', reading: 'san', meaning: 'sun / three' } },
    null, null, null, null
  ]
];

// ── Dakuten / Handakuten (Voiced sounds) ──────────────────────────────────────
const DAKUTEN_HIRAGANA: KanaChar[] = [
  { kana: 'が', romaji: 'ga' }, { kana: 'ぎ', romaji: 'gi' }, { kana: 'ぐ', romaji: 'gu' }, { kana: 'げ', romaji: 'ge' }, { kana: 'ご', romaji: 'go' },
  { kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' },
  { kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' },
  { kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' },
  { kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' },
];

const YOON_HIRAGANA: KanaChar[] = [
  { kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' },
  { kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' },
  { kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' },
  { kana: 'にゃ', romaji: 'nya' }, { kana: 'にゅ', romaji: 'nyu' }, { kana: 'にょ', romaji: 'nyo' },
  { kana: 'ひゃ', romaji: 'hya' }, { kana: 'ひゅ', romaji: 'hyu' }, { kana: 'ひょ', romaji: 'hyo' },
  { kana: 'みゃ', romaji: 'mya' }, { kana: 'みゅ', romaji: 'myu' }, { kana: 'みょ', romaji: 'myo' },
  { kana: 'りゃ', romaji: 'rya' }, { kana: 'りゅ', romaji: 'ryu' }, { kana: 'りょ', romaji: 'ryo' },
  { kana: 'ぎゃ', romaji: 'gya' }, { kana: 'ぎゅ', romaji: 'gyu' }, { kana: 'ぎょ', romaji: 'gyo' },
  { kana: 'じゃ', romaji: 'ja' }, { kana: 'じゅ', romaji: 'ju' }, { kana: 'じょ', romaji: 'jo' },
  { kana: 'びゃ', romaji: 'bya' }, { kana: 'びゅ', romaji: 'byu' }, { kana: 'びょ', romaji: 'byo' },
  { kana: 'ぴゃ', romaji: 'pya' }, { kana: 'ぴゅ', romaji: 'pyu' }, { kana: 'ぴょ', romaji: 'pyo' },
];

export default function ScriptPage() {
  const [activeTab, setActiveTab] = useState<ScriptType>('hiragana');
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedChar, setSelectedChar] = useState<KanaChar | null>(null);

  const speakKana = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelect = (char: KanaChar) => {
    setSelectedChar(char);
    speakKana(char.kana);
  };

  return (
    <div className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14">
      {/* ── Top Banner ──────────────────────────────────────────────────────── */}
      <MFCard variant="sakura" washiTape="pink" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="hiragana" size={16} />
              <span>Japanese Syllabary Lab</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
              Hiragana & Katakana Master Chart
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Click any character to hear native audio pronunciation. Toggle Romaji off to test your character recognition!
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2 bg-card border border-edge p-1.5 rounded-2xl shadow-sm shrink-0">
            <button
              onClick={() => setShowRomaji(!showRomaji)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                showRomaji
                  ? 'bg-brand-light text-brand border border-brand/30'
                  : 'bg-cream text-ink-muted border border-edge'
              }`}
            >
              {showRomaji ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{showRomaji ? 'Romaji ON' : 'Romaji OFF'}</span>
            </button>
          </div>
        </div>
      </MFCard>

      {/* ── Navigation Tabs ─────────────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'hiragana' as ScriptType, label: 'Hiragana (平仮名)', count: '46 chars' },
          { id: 'katakana' as ScriptType, label: 'Katakana (片仮名)', count: '46 chars' },
          { id: 'dakuten' as ScriptType, label: 'Dakuten (濁音・半濁音)', count: '25 chars' },
          { id: 'yoon' as ScriptType, label: 'Yoon (拗音)', count: '33 combos' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedChar(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-brand text-white border-brand shadow-[var(--paper-press-shadow)]'
                  : 'bg-card text-ink-muted border-edge hover:text-ink hover:bg-cream'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-cream text-ink-muted'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Main Syllabary Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <MFCard variant="paper" padding="md" className="space-y-4">
            {/* Header Columns: A I U E O */}
            {(activeTab === 'hiragana' || activeTab === 'katakana') && (
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-extrabold text-ink-muted pb-1 border-b border-dashed border-edge">
                <span>a (あ)</span>
                <span>i (い)</span>
                <span>u (う)</span>
                <span>e (え)</span>
                <span>o (お)</span>
              </div>
            )}

            {/* Gojuon Chart Grid */}
            {activeTab === 'hiragana' && (
              <div className="space-y-2">
                {HIRAGANA_GRID.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-5 gap-2">
                    {row.map((item, colIdx) => {
                      if (!item) {
                        return <div key={colIdx} className="p-2 rounded-xl bg-transparent" />;
                      }
                      const isSelected = selectedChar?.kana === item.kana;
                      return (
                        <motion.button
                          key={item.kana}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelect(item)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-brand text-white border-brand shadow-md'
                              : 'bg-card border-edge text-ink hover:border-brand/40 hover:bg-cream'
                          }`}
                        >
                          <span className="text-2xl font-black font-jp">{item.kana}</span>
                          {showRomaji && (
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-ink-muted'}`}>
                              {item.romaji}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Katakana Chart Grid */}
            {activeTab === 'katakana' && (
              <div className="space-y-2">
                {KATAKANA_GRID.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-5 gap-2">
                    {row.map((item, colIdx) => {
                      if (!item) {
                        return <div key={colIdx} className="p-2 rounded-xl bg-transparent" />;
                      }
                      const isSelected = selectedChar?.kana === item.kana;
                      return (
                        <motion.button
                          key={item.kana}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelect(item)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-mint text-white border-mint shadow-md'
                              : 'bg-card border-edge text-ink hover:border-mint/40 hover:bg-cream'
                          }`}
                        >
                          <span className="text-2xl font-black font-jp">{item.kana}</span>
                          {showRomaji && (
                            <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-ink-muted'}`}>
                              {item.romaji}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Dakuten Grid */}
            {activeTab === 'dakuten' && (
              <div className="grid grid-cols-5 gap-2.5">
                {DAKUTEN_HIRAGANA.map((item) => {
                  const isSelected = selectedChar?.kana === item.kana;
                  return (
                    <motion.button
                      key={item.kana}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(item)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow text-ink border-yellow shadow-md'
                          : 'bg-card border-edge text-ink hover:border-yellow/40 hover:bg-cream'
                      }`}
                    >
                      <span className="text-2xl font-black font-jp">{item.kana}</span>
                      {showRomaji && (
                        <span className="text-[10px] font-bold text-ink-muted">
                          {item.romaji}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Yoon Grid */}
            {activeTab === 'yoon' && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {YOON_HIRAGANA.map((item) => {
                  const isSelected = selectedChar?.kana === item.kana;
                  return (
                    <motion.button
                      key={item.kana}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelect(item)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-lavender text-white border-lavender shadow-md'
                          : 'bg-card border-edge text-ink hover:border-lavender/40 hover:bg-cream'
                      }`}
                    >
                      <span className="text-2xl font-black font-jp">{item.kana}</span>
                      {showRomaji && (
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-ink-muted'}`}>
                          {item.romaji}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </MFCard>
        </div>

        {/* ── Right Column: Character Focus Card ──────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4">
          {selectedChar ? (
            <MFCard variant="sakura" lifted padding="lg" className="space-y-4 text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-brand px-3 py-1 bg-card rounded-full border border-edge inline-block">
                Character Detail
              </span>

              <div className="py-4">
                <span className="text-6xl sm:text-7xl font-black font-jp text-ink block">
                  {selectedChar.kana}
                </span>
                <span className="text-lg font-bold text-brand italic mt-2 block">
                  /{selectedChar.romaji}/
                </span>
              </div>

              <div className="pt-2">
                <MFButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => speakKana(selectedChar.kana)}
                  leftIcon={<Volume2 className="w-4 h-4" />}
                >
                  Play Native Audio
                </MFButton>
              </div>

              {selectedChar.example && (
                <div className="p-3.5 rounded-2xl bg-card border border-edge text-left space-y-1 mt-3">
                  <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider block">
                    Example Word
                  </span>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-base font-bold font-jp text-ink">{selectedChar.example.word}</p>
                      <p className="text-xs text-brand font-medium italic">{selectedChar.example.reading}</p>
                    </div>
                    <span className="text-xs font-bold text-ink-secondary">{selectedChar.example.meaning}</span>
                  </div>
                </div>
              )}
            </MFCard>
          ) : (
            <MFCard variant="cream" padding="lg" className="text-center space-y-3 py-10">
              <div className="p-3 rounded-2xl bg-card border border-edge text-brand w-max mx-auto shadow-sm">
                <MFIcon name="hiragana" size={28} />
              </div>
              <h3 className="text-sm font-bold text-ink font-heading">Select Any Character</h3>
              <p className="text-xs text-ink-muted leading-relaxed font-medium">
                Tap on any kana in the chart to inspect its reading, play audio, and see vocabulary examples.
              </p>
            </MFCard>
          )}
        </div>
      </div>
    </div>
  );
}
