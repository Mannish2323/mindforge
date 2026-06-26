'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import {
  Bookmark, BookmarkCheck, Volume2, Trash2, Search,
  BookOpen, Pen, FileText, ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookmarkRecord {
  id: string;
  action: string;
  metadata: {
    type: 'vocabulary' | 'kanji' | 'grammar';
    word?: string;
    hiragana?: string;
    romaji?: string;
    meaning?: string;
    level?: string;
    char?: string;
    example?: string;
    point?: string;
  };
  created_at: string;
}

function speak(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP'; u.rate = 0.85;
    speechSynthesis.speak(u);
  }
}

function VocabBookmarkCard({ bm, onRemove }: { bm: BookmarkRecord; onRemove: (id: string) => void }) {
  const m = bm.metadata;
  return (
    <Card padding="md" hover className="relative group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-jp font-black text-white"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)' }}>
          {m.word?.[0] || '言'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-base font-jp font-black text-white">{m.word || '—'}</span>
            {m.level && <JLPTBadge level={m.level} size="xs" />}
          </div>
          <div className="text-xs mb-1" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {m.hiragana} {m.romaji ? `· ${m.romaji}` : ''}
          </div>
          <div className="text-sm text-white font-medium">{m.meaning || '—'}</div>
          {m.example && (
            <div className="text-xs mt-1 font-jp" style={{ color: 'rgba(200,196,255,0.6)' }}>{m.example}</div>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {m.word && (
            <button onClick={() => speak(m.word!)}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            </button>
          )}
          <button onClick={() => onRemove(bm.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
            style={{ background: 'rgba(239,68,68,0.1)' }}>
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>
      </div>
      <div className="text-[10px] mt-2" style={{ color: 'rgba(130,120,190,0.35)' }}>
        Bookmarked {new Date(bm.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </Card>
  );
}

function KanjiBookmarkCard({ bm, onRemove }: { bm: BookmarkRecord; onRemove: (id: string) => void }) {
  const m = bm.metadata;
  return (
    <Card padding="md" hover className="relative group">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-3xl font-jp font-black"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(219,39,119,0.1))', border: '1px solid rgba(139,92,246,0.2)' }}>
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {m.char || '字'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {m.level && <JLPTBadge level={m.level} size="xs" />}
          </div>
          <div className="text-sm font-bold text-white">{m.meaning || '—'}</div>
          {m.hiragana && (
            <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{m.hiragana}</div>
          )}
        </div>
        <button onClick={() => onRemove(bm.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100 flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.1)' }}>
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
      <div className="text-[10px] mt-2" style={{ color: 'rgba(130,120,190,0.35)' }}>
        Bookmarked {new Date(bm.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </Card>
  );
}

function GrammarBookmarkCard({ bm, onRemove }: { bm: BookmarkRecord; onRemove: (id: string) => void }) {
  const m = bm.metadata;
  return (
    <Card padding="md" hover className="relative group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)' }}>
          <FileText className="w-4 h-4" style={{ color: '#ec4899' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-jp font-black text-white">{m.point || '—'}</span>
            {m.level && <JLPTBadge level={m.level} size="xs" />}
          </div>
          <div className="text-sm text-white font-medium">{m.meaning || '—'}</div>
          {m.example && (
            <div className="text-xs mt-1 font-jp" style={{ color: 'rgba(200,196,255,0.6)' }}>{m.example}</div>
          )}
        </div>
        <button onClick={() => onRemove(bm.id)}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 opacity-0 group-hover:opacity-100 flex-shrink-0"
          style={{ background: 'rgba(239,68,68,0.1)' }}>
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      </div>
      <div className="text-[10px] mt-2" style={{ color: 'rgba(130,120,190,0.35)' }}>
        Bookmarked {new Date(bm.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </Card>
  );
}

export default function BookmarksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('vocabulary');
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadBookmarks = useCallback(async () => {
    const supabase = createClient();
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('id, action, metadata, created_at')
        .eq('user_id', user.id)
        .eq('action', 'bookmark')
        .order('created_at', { ascending: false });
      if (!error && data) setBookmarks(data as BookmarkRecord[]);
    } catch {
      // fall back to empty
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadBookmarks(); }, [loadBookmarks]);

  const removeBookmark = async (id: string) => {
    if (!user) return;
    setBookmarks(prev => prev.filter(b => b.id !== id));
    try {
      const supabase = createClient();
      await supabase.from('activity_logs').delete().eq('id', id).eq('user_id', user.id);
    } catch {}
  };

  const filtered = bookmarks.filter(bm => {
    if (bm.metadata?.type !== tab) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    const m = bm.metadata;
    return (
      (m.word || '').toLowerCase().includes(s) ||
      (m.meaning || '').toLowerCase().includes(s) ||
      (m.char || '').includes(s) ||
      (m.point || '').includes(s) ||
      (m.hiragana || '').includes(s)
    );
  });

  const counts = {
    vocabulary: bookmarks.filter(b => b.metadata?.type === 'vocabulary').length,
    kanji: bookmarks.filter(b => b.metadata?.type === 'kanji').length,
    grammar: bookmarks.filter(b => b.metadata?.type === 'grammar').length,
  };

  return (
    <div className="space-y-5 animate-fade-up max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.2))', border: '1px solid rgba(124,58,237,0.3)' }}>
          <BookmarkCheck className="w-5 h-5 text-purple-300" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">My Bookmarks</h1>
          <p className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Tabs with counts */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, count: counts.vocabulary, color: '#3b82f6' },
          { id: 'kanji',      label: 'Kanji',      icon: Pen,      count: counts.kanji,      color: '#8b5cf6' },
          { id: 'grammar',    label: 'Grammar',    icon: FileText, count: counts.grammar,    color: '#ec4899' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
            style={{
              background: tab === t.id ? `${t.color}18` : 'rgba(139,92,246,0.06)',
              border: `1px solid ${tab === t.id ? `${t.color}44` : 'rgba(139,92,246,0.15)'}`,
              color: tab === t.id ? t.color : 'rgba(160,150,220,0.6)',
            }}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={{ background: `${t.color}20`, color: t.color }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(139,92,246,0.5)' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${tab}…`}
          className="input w-full pl-10"
        />
      </div>

      {/* Content */}
      {loading ? (
        <ListSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        bookmarks.filter(b => b.metadata?.type === tab).length === 0 ? (
          <EmptyState
            variant="empty"
            icon={<Bookmark className="w-10 h-10" />}
            title={`No ${tab} bookmarks`}
            description={`Tap the 🔖 bookmark icon on any ${tab} card to save it here for quick access.`}
            action={
              <Button variant="primary" onClick={() => router.push(`/${tab}`)}>
                Browse {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            }
          />
        ) : (
          <EmptyState
            variant="empty"
            icon={<Search className="w-10 h-10" />}
            title="No results found"
            description={`No ${tab} bookmarks match "${search}"`}
          />
        )
      ) : (
        <div className="space-y-3">
          {filtered.map(bm =>
            bm.metadata?.type === 'vocabulary' ? (
              <VocabBookmarkCard key={bm.id} bm={bm} onRemove={removeBookmark} />
            ) : bm.metadata?.type === 'kanji' ? (
              <KanjiBookmarkCard key={bm.id} bm={bm} onRemove={removeBookmark} />
            ) : (
              <GrammarBookmarkCard key={bm.id} bm={bm} onRemove={removeBookmark} />
            )
          )}
        </div>
      )}

      {/* How to bookmark tip */}
      {bookmarks.length === 0 && !loading && (
        <div className="p-4 rounded-xl"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)' }}>
          <div className="text-xs font-black text-white mb-2">💡 How to bookmark</div>
          <div className="space-y-1.5">
            {[
              { route: '/vocabulary', label: 'Vocabulary — tap 🔖 on any word card' },
              { route: '/kanji',      label: 'Kanji — tap 🔖 on any kanji card' },
              { route: '/grammar',    label: 'Grammar — tap 🔖 on any grammar point' },
            ].map(h => (
              <button key={h.route} onClick={() => router.push(h.route)}
                className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg transition-colors hover:bg-[rgba(139,92,246,0.08)]">
                <span className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>{h.label}</span>
                <ChevronRight className="w-3 h-3" style={{ color: 'rgba(139,92,246,0.4)' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
