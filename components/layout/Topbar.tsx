'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../../app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { StatPills } from '@/components/shared/XPBar';
import { JLPTBadge } from '@/components/shared/JLPTBadge';

const PAGE_TITLES: Record<string, string> = {
  '/home': 'Home', '/vocabulary': 'Vocabulary', '/kanji': 'Kanji',
  '/grammar': 'Grammar', '/reading': 'Reading', '/listening': 'Listening',
  '/writing': 'Writing', '/speaking': 'Speaking', '/review': 'SRS Review',
  '/quiz': 'Quiz', '/jlpt': 'JLPT Roadmap', '/ai-tutor': 'AI Tutor',
  '/community': 'Community', '/leaderboard': 'Leaderboard',
  '/achievements': 'Achievements', '/profile': 'Profile',
  '/billing': 'Subscription', '/settings': 'Settings', '/progress': 'Progress',
  '/path': 'Learn Path', '/bookmarks': 'Bookmarks',
};

export function Topbar() {
  const { profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.name?.split(' ')[0] || 'Learner';
  const pageTitle = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || 'Velmorth';

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  return (
    <header className="flex items-center justify-between px-5 py-3 flex-shrink-0 sticky top-0 z-30"
      style={{ background: 'rgba(9,7,26,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}>

      {/* Left */}
      <div className="flex-1 min-w-0">
        {pathname === '/home' ? (
          <div>
            <h1 className="text-base font-black text-white leading-tight">
              {greeting}, {firstName}! <span>👋</span>
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>
              Your Japanese journey continues…
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-white">{pageTitle}</h1>
            {profile?.jlpt_target && pathname !== '/home' && (
              <JLPTBadge level={profile.jlpt_target} size="xs" />
            )}
          </div>
        )}
      </div>

      {/* Center search (when open) */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-0 h-full flex items-center px-5 z-40 animate-fade-in"
          style={{ background: 'rgba(9,7,26,0.97)' }}>
          <Search className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: 'rgba(167,139,250,0.7)' }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search vocabulary, kanji, grammar…"
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-[rgba(160,150,220,0.4)]"
            onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); } }} />
          <button onClick={() => { setSearchOpen(false); setQuery(''); }} className="ml-3 btn btn-ghost btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search button */}
        <button onClick={() => setSearchOpen(true)}
          className="btn btn-ghost btn-icon hidden md:flex">
          <Search className="w-4 h-4" />
        </button>

        {/* Stat pills */}
        <div className="hidden sm:block">
          <StatPills />
        </div>

        {/* Notifications */}
        <button className="relative btn btn-ghost btn-icon" onClick={() => router.push('/profile')}>
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-black flex items-center justify-center rounded-full text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
            3
          </span>
        </button>

        {/* Avatar */}
        <button onClick={() => router.push('/profile')}
          className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}>
          {profile?.name?.[0]?.toUpperCase() || 'V'}
        </button>
      </div>
    </header>
  );
}
