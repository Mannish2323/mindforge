'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Search, Volume2, Plus, Sparkles, Filter, Check,
  Trash2, Layers, Brain, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VocabWord {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  pos: 'noun' | 'verb' | 'adjective' | 'expression';
  level: 'N5' | 'N4' | 'N3';
  status: 'new' | 'learning' | 'mastered' | 'weak';
}

export default function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deck, setDeck] = useState<string[]>([]); // Added vocab word IDs

  const vocabularyList: VocabWord[] = [
    { id: '1', kanji: 'おはようございます', kana: 'おはようございます', romaji: 'ohayou gozaimasu', meaning: 'good morning (polite)', pos: 'expression', level: 'N5', status: 'learning' },
    { id: '2', kanji: 'こんにちは', kana: 'こんにちは', romaji: 'konnichiwa', meaning: 'hello / good afternoon', pos: 'expression', level: 'N5', status: 'mastered' },
    { id: '3', kanji: 'さようなら', kana: 'さようなら', romaji: 'sayounara', meaning: 'goodbye', pos: 'expression', level: 'N5', status: 'new' },
    { id: '4', kanji: '水', kana: 'みず', romaji: 'mizu', meaning: 'water', pos: 'noun', level: 'N5', status: 'mastered' },
    { id: '5', kanji: '食べる', kana: 'たべる', romaji: 'taberu', meaning: 'to eat', pos: 'verb', level: 'N5', status: 'weak' },
    { id: '6', kanji: '美味しい', kana: 'おいしい', romaji: 'oishii', meaning: 'delicious / tasty', pos: 'adjective', level: 'N5', status: 'learning' },
    { id: '7', kanji: '猫', kana: 'ねこ', romaji: 'neko', meaning: 'cat', pos: 'noun', level: 'N5', status: 'new' },
    { id: '8', kanji: '行く', kana: 'いく', romaji: 'iku', meaning: 'to go', pos: 'verb', level: 'N5', status: 'learning' },
    { id: '9', kanji: '本', kana: 'ほん', romaji: 'hon', meaning: 'book', pos: 'noun', level: 'N5', status: 'mastered' }
  ];

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleDeck = (id: string) => {
    setDeck(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredWords = vocabularyList.filter(vocab => {
    const matchesSearch = 
      vocab.kanji.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.kana.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vocab.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPos = selectedPos === 'all' || vocab.pos === selectedPos;
    const matchesStatus = selectedStatus === 'all' || vocab.status === selectedStatus;

    return matchesSearch && matchesPos && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Page Header toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/[0.08] pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink font-heading">
            Vocabulary Bank
          </h1>
          <p className="text-xs md:text-sm text-ink-muted font-semibold tracking-wide uppercase">
            Browse, search and manage your spaced repetition vocabulary decks
          </p>
        </div>

        {/* Quick status counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-warm-soft border border-edge rounded-xl text-xs font-semibold text-ink-secondary">
            <Layers className="w-3.5 h-3.5 text-sakura-dark" />
            <span>Deck: {deck.length} words</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Layout panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Search bar input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search words by Kanji, Kana, Romaji or English..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.12] rounded-xl pl-11 pr-5 h-12 text-sm placeholder-purple-300/30 text-ink outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all"
          />
        </div>

        {/* Category selector */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="w-full bg-[#12101D] border border-white/[0.08] hover:border-white/[0.12] text-xs font-semibold text-ink-secondary/80 rounded-xl px-4 h-12 outline-none focus:border-brand-purple/60 transition-all appearance-none cursor-pointer"
          >
            <option value="all">POS: All Categories</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="expression">Expression</option>
          </select>
          <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>

        {/* SRS Status selector */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#12101D] border border-white/[0.08] hover:border-white/[0.12] text-xs font-semibold text-ink-secondary/80 rounded-xl px-4 h-12 outline-none focus:border-brand-purple/60 transition-all appearance-none cursor-pointer"
          >
            <option value="all">SRS: All Status</option>
            <option value="new">New</option>
            <option value="learning">Learning</option>
            <option value="weak">Weak Cards</option>
            <option value="mastered">Mastered</option>
          </select>
          <Layers className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>

      </div>

      {/* Vocabulary Cards Grid */}
      {filteredWords.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-[28px] border border-white/[0.08]">
          <BookOpen className="w-12 h-12 text-ink-secondary/20 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-ink font-heading">No Matching Words</h3>
          <p className="text-xs text-ink-muted mt-1">Try refining search phrases or selection filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWords.map((vocab) => {
            const inDeck = deck.includes(vocab.id);
            let statusBadge = 'border-purple-500/20 text-ink-muted bg-purple-500/5';
            if (vocab.status === 'mastered') statusBadge = 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5';
            else if (vocab.status === 'weak') statusBadge = 'border-rose-500/20 text-rose-400 bg-rose-500/5';
            else if (vocab.status === 'learning') statusBadge = 'border-orange-500/20 text-orange-400 bg-orange-500/5';

            return (
              <motion.div 
                key={vocab.id}
                layout
                className="glass-card p-6 rounded-[24px] flex flex-col justify-between space-y-4 hover:border-edge hover:bg-white/[0.04] transition-all duration-300"
              >
                {/* Top info and status badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-ink-muted uppercase tracking-widest">{vocab.pos}</span>
                  <span className={`text-[9px] font-extrabold tracking-wider border px-2 py-0.5 rounded-md ${statusBadge}`}>
                    {vocab.status.toUpperCase()}
                  </span>
                </div>

                {/* Vocabulary display */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl font-extrabold text-ink font-jp truncate">{vocab.kanji}</h3>
                  <p className="text-xs font-bold text-ink-muted font-jp truncate">{vocab.kana}</p>
                  <p className="text-[10px] font-semibold text-sakura-dark italic">{vocab.romaji}</p>
                </div>

                <div className="border-t border-white/[0.08] my-1 pt-3">
                  <p className="text-sm font-semibold text-white/90 leading-relaxed">{vocab.meaning}</p>
                </div>

                {/* Action button row */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                  <button 
                    onClick={() => speakWord(vocab.kanji)}
                    className="p-2.5 rounded-lg bg-warm-soft border border-edge hover:border-edge-hover text-ink-secondary hover:text-ink transition-all cursor-pointer"
                    title="Speak word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleDeck(vocab.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      inDeck 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple-light hover:border-brand-purple/40 hover:bg-brand-purple/20'
                    }`}
                  >
                    {inDeck ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Deck</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
