'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { Button } from '@/components/ui/Button';
import { Search, Bookmark, BookmarkCheck, Volume2, ChevronRight, Filter } from 'lucide-react';

interface VocabWord {
  vocab_id: string;
  japanese: string;
  romaji: string;
  meaning: string;
  part_of_speech?: string;
  jlpt_level?: string;
  example_jp?: string;
  example_en?: string;
  tags?: string[];
  frequency?: number;
  difficulty?: number;
  is_bookmarked?: boolean;
}

const JLPT_TABS = [
  { id: 'all', label: 'All' },
  { id: 'N5', label: 'N5' },
  { id: 'N4', label: 'N4' },
  { id: 'N3', label: 'N3' },
  { id: 'N2', label: 'N2' },
  { id: 'N1', label: 'N1' },
];

const POS_COLORS: Record<string, string> = {
  noun: '#3b82f6', verb: '#8b5cf6', adjective: '#ec4899',
  adverb: '#22c55e', particle: '#f59e0b', expression: '#06b6d4',
};

function WordCard({ word, onBookmark }: { word: VocabWord; onBookmark: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const posColor = POS_COLORS[word.part_of_speech?.toLowerCase() || ''] || '#8b5cf6';

  const playAudio = () => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(word.japanese);
      u.lang = 'ja-JP'; u.rate = 0.85;
      speechSynthesis.speak(u);
    }
  };

  return (
    <div className="card p-4 hover:border-[rgba(139,92,246,0.35)] transition-all cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl font-jp font-black text-white">{word.japanese}</span>
            <span className="text-sm" style={{ color: 'rgba(167,139,250,0.7)' }}>{word.romaji}</span>
            {word.jlpt_level && <JLPTBadge level={word.jlpt_level} size="xs" />}
            {word.part_of_speech && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: `${posColor}18`, color: posColor, border: `1px solid ${posColor}30` }}>
                {word.part_of_speech}
              </span>
            )}
          </div>
          <div className="text-sm text-white/80 mt-1">{word.meaning}</div>
          {expanded && word.example_jp && (
            <div className="mt-3 p-3 rounded-xl animate-fade-in" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="text-sm font-jp text-white mb-1">{word.example_jp}</div>
              <div className="text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>{word.example_en}</div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={e => { e.stopPropagation(); playAudio(); }}
            className="btn btn-ghost btn-icon">
            <Volume2 className="w-4 h-4" />
          </button>
          <button onClick={e => { e.stopPropagation(); onBookmark(word.vocab_id); }}
            className="btn btn-ghost btn-icon">
            {word.is_bookmarked
              ? <BookmarkCheck className="w-4 h-4 text-purple-400" />
              : <Bookmark className="w-4 h-4" />}
          </button>
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            style={{ color: 'rgba(167,139,250,0.5)' }} />
        </div>
      </div>
    </div>
  );
}

export default function VocabularyPage() {
  const { profile, user } = useAuth();
  const [words, setWords] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [jlptFilter, setJlptFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'flashcard'>('list');
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/vocab');
        if (res.ok) { const d = await res.json(); setWords(d.vocab || d || []); }
      } catch {
        // Fallback sample data
        setWords([
          { vocab_id: '1', japanese: '食べ物', romaji: 'tabemono', meaning: 'food', jlpt_level: 'N5', part_of_speech: 'noun', example_jp: '日本の食べ物が大好きです。', example_en: 'I love Japanese food.' },
          { vocab_id: '2', japanese: '飲む', romaji: 'nomu', meaning: 'to drink', jlpt_level: 'N5', part_of_speech: 'verb', example_jp: '水を飲みます。', example_en: 'I drink water.' },
          { vocab_id: '3', japanese: '美味しい', romaji: 'oishii', meaning: 'delicious, tasty', jlpt_level: 'N5', part_of_speech: 'adjective', example_jp: 'このラーメンは美味しいです。', example_en: 'This ramen is delicious.' },
          { vocab_id: '4', japanese: '勉強する', romaji: 'benkyou suru', meaning: 'to study', jlpt_level: 'N5', part_of_speech: 'verb', example_jp: '毎日日本語を勉強します。', example_en: 'I study Japanese every day.' },
          { vocab_id: '5', japanese: '友達', romaji: 'tomodachi', meaning: 'friend', jlpt_level: 'N5', part_of_speech: 'noun', example_jp: '友達と一緒に行きます。', example_en: 'I will go with a friend.' },
          { vocab_id: '6', japanese: '電車', romaji: 'densha', meaning: 'train, electric train', jlpt_level: 'N5', part_of_speech: 'noun', example_jp: '電車で学校へ行きます。', example_en: 'I go to school by train.' },
          { vocab_id: '7', japanese: '仕事', romaji: 'shigoto', meaning: 'work, job', jlpt_level: 'N4', part_of_speech: 'noun', example_jp: '仕事が終わりました。', example_en: 'Work has finished.' },
          { vocab_id: '8', japanese: '経験', romaji: 'keiken', meaning: 'experience', jlpt_level: 'N3', part_of_speech: 'noun', example_jp: '良い経験になりました。', example_en: 'It became a good experience.' },
        ]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = words.filter(w => {
    const matchesJlpt = jlptFilter === 'all' || w.jlpt_level === jlptFilter;
    const matchesQuery = !query || w.japanese.includes(query) || w.romaji.toLowerCase().includes(query.toLowerCase()) || w.meaning.toLowerCase().includes(query.toLowerCase());
    return matchesJlpt && matchesQuery;
  });

  const toggleBookmark = useCallback(async (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setWords(prev => prev.map(w => w.vocab_id === id ? { ...w, is_bookmarked: !w.is_bookmarked } : w));
  }, []);

  const flashWord = filtered[flashIdx];

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(167,139,250,0.5)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search vocabulary…"
            className="input pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} size="sm" onClick={() => setViewMode('list')}>List</Button>
          <Button variant={viewMode === 'flashcard' ? 'primary' : 'ghost'} size="sm" onClick={() => { setViewMode('flashcard'); setFlashIdx(0); setFlashFlipped(false); }}>Flashcards</Button>
        </div>
      </div>

      {/* JLPT filter */}
      <Tabs tabs={JLPT_TABS} activeTab={jlptFilter} onChange={setJlptFilter} variant="pill" />

      {/* Progress */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">Vocabulary Progress</span>
          <span className="text-xs font-bold text-white">{words.length} words loaded</span>
        </div>
        <ProgressBar value={profile?.words_learned || 0} max={1000} showLabel size="md" />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(160,150,220,0.5)' }}>
          <span>{profile?.words_learned || 0} learned</span><span>1,000 goal</span>
        </div>
      </Card>

      {/* Content */}
      {loading ? <ListSkeleton rows={6} />
        : viewMode === 'flashcard' && flashWord ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-4 text-sm" style={{ color: 'rgba(160,150,220,0.5)' }}>
              {flashIdx + 1} / {filtered.length}
            </div>
            <div className="card p-8 flex flex-col items-center justify-center min-h-60 cursor-pointer transition-all"
              onClick={() => setFlashFlipped(!flashFlipped)}
              style={{ minHeight: 240 }}>
              {!flashFlipped ? (
                <div className="text-center animate-fade-in">
                  <div className="text-5xl font-jp font-black text-white mb-3">{flashWord.japanese}</div>
                  <div className="text-lg" style={{ color: 'rgba(167,139,250,0.7)' }}>{flashWord.romaji}</div>
                  {flashWord.jlpt_level && <JLPTBadge level={flashWord.jlpt_level} className="mt-2" />}
                  <div className="text-sm mt-4" style={{ color: 'rgba(160,150,220,0.5)' }}>Tap to reveal meaning</div>
                </div>
              ) : (
                <div className="text-center animate-fade-in">
                  <div className="text-2xl font-black text-white mb-2">{flashWord.meaning}</div>
                  {flashWord.example_jp && (
                    <div className="mt-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)' }}>
                      <div className="text-sm font-jp text-white">{flashWord.example_jp}</div>
                      <div className="text-xs mt-1" style={{ color: 'rgba(160,150,220,0.6)' }}>{flashWord.example_en}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="ghost" className="flex-1" onClick={() => { setFlashIdx(Math.max(0, flashIdx - 1)); setFlashFlipped(false); }}>← Prev</Button>
              <Button variant="primary" className="flex-1" onClick={() => { setFlashIdx(Math.min(filtered.length - 1, flashIdx + 1)); setFlashFlipped(false); }}>Next →</Button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState variant="search" />
        ) : (
          <div className="space-y-2">
            {filtered.map(w => (
              <WordCard key={w.vocab_id} word={{ ...w, is_bookmarked: bookmarks.has(w.vocab_id) }} onBookmark={toggleBookmark} />
            ))}
          </div>
        )}
    </div>
  );
}
