'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookOpen, PenTool, FileText, Trash2, Volume2 } from 'lucide-react';
import { MFIcon } from '@/components/ui/MFIcon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const MOCK_BOOKMARKS = [
  { id: 1, type: 'vocab', kanji: '食べる', romaji: 'taberu', meaning: 'to eat', level: 'N5' },
  { id: 2, type: 'vocab', kanji: '天気', romaji: 'tenki', meaning: 'weather', level: 'N5' },
  { id: 3, type: 'grammar', kanji: '～ています', romaji: 'te-imasu', meaning: 'ongoing action', level: 'N5' },
  { id: 4, type: 'kanji', kanji: '日', romaji: 'hi / nichi', meaning: 'day / sun', level: 'N5' },
  { id: 5, type: 'vocab', kanji: '勉強する', romaji: 'benkyou suru', meaning: 'to study', level: 'N5' },
  { id: 6, type: 'grammar', kanji: '～たい', romaji: '-tai', meaning: 'want to do', level: 'N4' },
];

type BookmarkType = 'all' | 'vocab' | 'grammar' | 'kanji';

export default function BookmarksPage() {
  const [activeFilter, setActiveFilter] = useState<BookmarkType>('all');
  const [bookmarks, setBookmarks] = useState(MOCK_BOOKMARKS);

  const filters: { key: BookmarkType; label: string; iconName: string }[] = [
    { key: 'all', label: 'All', iconName: 'bookmarks' },
    { key: 'vocab', label: 'Vocabulary', iconName: 'vocabulary' },
    { key: 'grammar', label: 'Grammar', iconName: 'grammar' },
    { key: 'kanji', label: 'Kanji', iconName: 'kanji' },
  ];

  const filtered = activeFilter === 'all' ? bookmarks : bookmarks.filter(b => b.type === activeFilter);

  const removeBookmark = (id: number) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink flex items-center gap-2">
          <MFIcon name="bookmarks" size={28} /> Bookmarks
        </h1>
        <p className="text-sm text-ink-muted">{bookmarks.length} saved items</p>
      </motion.div>

      {/* Filters */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1">
        {filters.map(f => (
          <button key={f.key} onClick={() => setActiveFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeFilter === f.key ? 'bg-brand/20 text-ink border border-brand/30' : 'bg-card/[0.03] text-ink-muted border border-white/[0.04] hover:border-edge'}`}
          ><MFIcon name={f.iconName as any} size={14} />{f.label}</button>
        ))}
      </motion.div>

      {/* Bookmarks List */}
      {filtered.length > 0 ? (
        <motion.div variants={container} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((bm) => (
            <motion.div key={bm.id} variants={item}>
              <Card variant="glass" padding="md" className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={bm.type === 'vocab' ? 'brand' : bm.type === 'grammar' ? 'sakura' : 'yellow'} size="sm">
                      {bm.type}
                    </Badge>
                    <Badge variant="default" size="sm">{bm.level}</Badge>
                  </div>
                  <button onClick={() => removeBookmark(bm.id)}
                    className="p-1.5 rounded-lg text-ink-light hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-1">
                  <span className="text-2xl font-jp font-bold text-ink block">{bm.kanji}</span>
                  <span className="text-sm text-brand-light font-medium block">{bm.romaji}</span>
                  <span className="text-xs text-ink-muted">{bm.meaning}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <Card variant="glass" padding="lg" className="text-center space-y-3">
          <MFIcon name="bookmarks" size={40} />
          <p className="text-sm text-ink-muted">No bookmarks yet</p>
          <p className="text-xs text-ink-light">Save vocabulary, grammar, and kanji while studying</p>
        </Card>
      )}
    </motion.div>
  );
}
