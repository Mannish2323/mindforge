'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Search, X } from 'lucide-react';
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
  '/path': 'Learn Path', '/bookmarks': 'Bookmarks', '/job-prep': 'Job Prep',
  '/downloads': 'Downloads',
};

export function Topbar() {
  const { profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const firstName = (profile?.name?.split(' ')[0] || 'Learner').slice(0, 12);
  const pageTitle = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || 'Velmorth';

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);

  return (
    <header
      className="flex items-center gap-2 px-3 sm:px-5 py-2.5 flex-shrink-0 sticky top-0 z-30 min-w-0"
      style={{ background: 'rgba(9,7,26,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}
    >
      {/* Left — min-w-0 to allow truncation */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {pathname === '/home' ? (
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-black text-white leading-tight truncate">
              {greeting}, {firstName}! 👋
            </h1>
            <p className="text-[10px] sm:text-[11px] mt-0.5 truncate" style={{ color: 'rgba(160,150,220,0.5)' }}>
              Your Japanese journey continues…
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm sm:text-base font-black text-white truncate">{pageTitle}</h1>
            {profile?.jlpt_target && pathname !== '/home' && (
              <JLPTBadge level={profile.jlpt_target} size="xs" />
            )}
          </div>
        )}
      </div>

      {/* Full-width search overlay */}
      {searchOpen && (
        <div
          className="absolute inset-x-0 top-0 h-full flex items-center px-3 sm:px-5 z-40 animate-fade-in"
          style={{ background: 'rgba(9,7,26,0.97)' }}
        >
          <Search className="w-4 h-4 mr-2.5 flex-shrink-0" style={{ color: 'rgba(167,139,250,0.7)' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search vocab, kanji, grammar…"
            className="flex-1 min-w-0 bg-transparent outline-none text-sm text-white placeholder:text-[rgba(160,150,220,0.4)]"
            onKeyDown={e => {
              if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); }
            }}
          />
          <button
            onClick={() => { setSearchOpen(false); setQuery(''); }}
            className="ml-2 btn btn-ghost btn-icon flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Right controls — never shrink below minimum */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Search — hidden on very small, shown from sm */}
        <button
          onClick={() => setSearchOpen(true)}
          className="btn btn-ghost btn-icon hidden sm:flex"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Stat pills — only on md+ */}
        <div className="hidden md:block">
          <StatPills />
        </div>

        {/* Notification bell */}
        <button
          className="relative btn btn-ghost btn-icon flex-shrink-0"
          onClick={() => router.push('/profile')}
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[9px] font-black flex items-center justify-center rounded-full text-white"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
          >
            3
          </span>
        </button>

        {/* Avatar */}
        <button
          onClick={() => router.push('/profile')}
          className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white flex-shrink-0 hover:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 2px 8px rgba(124,58,237,0.35)', minWidth: '2rem' }}
          aria-label="Profile"
        >
          {profile?.name?.[0]?.toUpperCase() || 'V'}
        </button>
      </div>
    </header>
  );
}
