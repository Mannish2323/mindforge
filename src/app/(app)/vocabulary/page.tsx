'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Search, Volume2, Plus, Sparkles, Filter, Check,
  Trash2, Layers, Brain, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

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
  const [deck, setDeck] = useState<string[]>([]);

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
    <div className="space-y-7 md:space-y-9 max-w-6xl mx-auto pb-14">
      {/* Top Study Sheet Banner */}
      <MFCard variant="lavender" washiTape="lavender" padding="lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <MFIcon name="vocabulary" size={16} />
              <span>Spaced Repetition Deck</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-ink font-heading">
              Vocabulary Study Bank
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
              Browse, search, listen to authentic native audio, and build your custom spaced repetition study flashcard decks.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-card border border-edge rounded-2xl text-xs font-bold text-ink shadow-sm shrink-0">
            <Layers className="w-4 h-4 text-brand" />
            <span>Deck: {deck.length} words</span>
          </div>
        </div>
      </MFCard>

      {/* Filter and Search Layout panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
        {/* Search bar input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Search words by Kanji, Kana, Romaji or English..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border-[1.5px] border-edge hover:border-edge-hover rounded-2xl pl-10 pr-4 h-12 text-xs font-semibold text-ink placeholder-ink-muted outline-none focus:border-brand transition-all shadow-sm"
          />
        </div>

        {/* Category selector */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedPos}
            onChange={(e) => setSelectedPos(e.target.value)}
            className="w-full bg-card border-[1.5px] border-edge hover:border-edge-hover text-xs font-bold text-ink rounded-2xl px-4 h-12 outline-none focus:border-brand transition-all appearance-none cursor-pointer shadow-sm"
          >
            <option value="all">POS: All Categories</option>
            <option value="noun">Noun</option>
            <option value="verb">Verb</option>
            <option value="adjective">Adjective</option>
            <option value="expression">Expression</option>
          </select>
          <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>

        {/* SRS Status selector */}
        <div className="md:col-span-3 relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-card border-[1.5px] border-edge hover:border-edge-hover text-xs font-bold text-ink rounded-2xl px-4 h-12 outline-none focus:border-brand transition-all appearance-none cursor-pointer shadow-sm"
          >
            <option value="all">SRS: All Status</option>
            <option value="new">New</option>
            <option value="learning">Learning</option>
            <option value="weak">Weak Cards</option>
            <option value="mastered">Mastered</option>
          </select>
          <Layers className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {filteredWords.length === 0 ? (
        <MFCard variant="cream" padding="lg" className="text-center">
          <BookOpen className="w-12 h-12 text-ink-muted mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-ink font-heading">No Matching Words</h3>
          <p className="text-xs text-ink-muted mt-1">Try refining search phrases or selection filters.</p>
        </MFCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((vocab) => {
            const inDeck = deck.includes(vocab.id);
            let statusBadge = 'bg-cream text-ink-muted border-edge';
            if (vocab.status === 'mastered') statusBadge = 'bg-mint-light text-ink border-mint/40';
            else if (vocab.status === 'weak') statusBadge = 'bg-coral-light text-ink border-coral/40';
            else if (vocab.status === 'learning') statusBadge = 'bg-yellow-light text-ink border-yellow/40';

            return (
              <MFCard 
                key={vocab.id}
                variant="paper"
                lifted
                padding="md"
                className="flex flex-col justify-between space-y-3"
              >
                {/* Top info and status badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider">{vocab.pos}</span>
                  <span className={`text-[10px] font-extrabold tracking-wider border px-2 py-0.5 rounded-lg ${statusBadge}`}>
                    {vocab.status.toUpperCase()}
                  </span>
                </div>

                {/* Vocabulary display */}
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-ink font-jp truncate">{vocab.kanji}</h3>
                  <p className="text-xs font-bold text-ink-muted font-jp truncate">{vocab.kana}</p>
                  <p className="text-[11px] font-semibold text-brand italic">{vocab.romaji}</p>
                </div>

                <div className="border-t border-dashed border-edge pt-2.5 my-1">
                  <p className="text-xs font-bold text-ink leading-relaxed">{vocab.meaning}</p>
                </div>

                {/* Action button row */}
                <div className="flex items-center justify-between pt-2 border-t border-edge">
                  <button 
                    onClick={() => speakWord(vocab.kanji)}
                    className="p-2 rounded-xl bg-cream border border-edge hover:border-edge-hover text-ink transition-all cursor-pointer"
                    title="Speak word"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleDeck(vocab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      inDeck 
                        ? 'bg-mint-light border-mint text-ink' 
                        : 'bg-card border-edge text-ink hover:border-brand hover:text-brand'
                    }`}
                  >
                    {inDeck ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-mint" />
                        <span>Added to Deck</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Deck</span>
                      </>
                    )}
                  </button>
                </div>
              </MFCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
