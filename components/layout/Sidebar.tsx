'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import {
  Home, Map, BookOpen, Pen, Mic, Headphones, BookOpenCheck,
  RotateCcw, HelpCircle, Sparkles, Users, Trophy, Award,
  Bookmark, Download, User, CreditCard, Settings, Shield,
  ChevronRight, GraduationCap, Brain, FileText, Gamepad2
} from 'lucide-react';
import { JLPTBadge, PlanBadge } from '@/components/shared/JLPTBadge';
import { CircularProgress } from '@/components/ui/ProgressBar';

const NAV_GROUPS = [
  {
    label: 'Learn',
    items: [
      { icon: Home,          label: 'Home',           href: '/home' },
      { icon: GraduationCap, label: 'Continue Learning',href: '/path' },
      { icon: BookOpen,      label: 'Vocabulary',      href: '/vocabulary' },
      { icon: Pen,           label: 'Kanji',           href: '/kanji' },
      { icon: BookOpenCheck, label: 'Grammar',         href: '/grammar' },
      { icon: FileText,      label: 'Reading',         href: '/reading' },
      { icon: Headphones,    label: 'Listening',       href: '/listening' },
      { icon: Pen,           label: 'Writing',         href: '/writing' },
      { icon: Mic,           label: 'Speaking',        href: '/speaking' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { icon: RotateCcw,     label: 'Review (SRS)',    href: '/review' },
      { icon: Gamepad2,      label: 'Quiz',            href: '/quiz' },
      { icon: Map,           label: 'JLPT Roadmap',    href: '/jlpt' },
      { icon: Brain,         label: 'AI Tutor',        href: '/ai-tutor' },
    ],
  },
  {
    label: 'Social',
    items: [
      { icon: Users,         label: 'Community',      href: '/community' },
      { icon: Trophy,        label: 'Leaderboard',    href: '/leaderboard' },
      { icon: Award,         label: 'Achievements',   href: '/achievements' },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: Bookmark,      label: 'Bookmarks',      href: '/bookmarks' },
      { icon: Download,      label: 'Downloads',      href: '/downloads' },
      { icon: User,          label: 'Profile',        href: '/profile' },
      { icon: CreditCard,    label: 'Subscription',   href: '/billing' },
      { icon: Settings,      label: 'Settings',       href: '/settings' },
    ],
  },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, logout } = useAuth();
  const { state } = useStore();

  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const xpInLevel = xp % (level * 1000);
  const xpForLevel = level * 1000;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: 'linear-gradient(180deg, #0b0920 0%, #0e0b22 60%, #130930 100%)', borderRight: '1px solid rgba(139,92,246,0.13)' }}>

      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-20 pointer-events-none blur-2xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-20 left-0 w-20 h-20 opacity-15 pointer-events-none blur-2xl"
        style={{ background: 'radial-gradient(circle, #db2777, transparent)' }} />

      {/* Logo */}
      <div className="px-4 pt-5 pb-4 flex-shrink-0">
        <button onClick={() => router.push('/home')} className="flex items-center gap-2.5 w-full hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}>
            <span className="text-white font-black text-sm">V</span>
          </div>
          <div className="text-left">
            <div className="text-white font-black text-sm tracking-wide leading-none">Velmorth</div>
            <div className="text-[10px] font-jp tracking-widest mt-0.5" style={{ color: 'rgba(167,139,250,0.5)' }}>ベルモルス</div>
          </div>
        </button>
      </div>

      <div className="divider mx-4" />

      {/* Nav groups */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-none">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-4">
            <div className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-widest"
              style={{ color: 'rgba(139,92,246,0.45)' }}>
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left group relative"
                      style={active ? {
                        background: 'linear-gradient(90deg, rgba(124,58,237,0.25), rgba(124,58,237,0.08))',
                        border: '1px solid rgba(124,58,237,0.3)',
                      } : { border: '1px solid transparent' }}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                          style={{ background: 'linear-gradient(180deg, #7c3aed, #db2777)' }} />
                      )}
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                        style={{ color: active ? '#a78bfa' : 'rgba(139,92,246,0.45)' }} />
                      <span className="text-xs font-semibold transition-colors truncate"
                        style={{ color: active ? '#f0efff' : 'rgba(200,196,255,0.5)' }}>
                        {item.label}
                      </span>
                      {active && <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: 'rgba(167,139,250,0.5)' }} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Admin link */}
        {profile?.isAdmin && (
          <button onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left mt-1"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Shield className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span className="text-xs font-bold text-red-400">Admin</span>
          </button>
        )}
      </nav>

      <div className="divider mx-4" />

      {/* User section */}
      <div className="p-3 flex-shrink-0">
        <button onClick={() => router.push('/profile')}
          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all hover:bg-[rgba(139,92,246,0.08)]">
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}>
              {profile?.name?.[0]?.toUpperCase() || 'V'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5">
              <PlanBadge plan={profile?.planId || 'free'} className="!text-[8px] !px-1 !py-0" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-xs font-bold text-white truncate">{profile?.name || 'Learner'}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <JLPTBadge level={profile?.jlpt_target || 'N5'} size="xs" />
              <span className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>Lv.{level}</span>
            </div>
          </div>
        </button>

        {/* XP progress */}
        <div className="mt-2 px-1">
          <div className="flex justify-between mb-1">
            <span className="text-[9px] font-bold" style={{ color: 'rgba(160,150,220,0.45)' }}>{xp.toLocaleString()} XP</span>
            <span className="text-[9px]" style={{ color: 'rgba(160,150,220,0.3)' }}>{xpForLevel.toLocaleString()}</span>
          </div>
          <div className="progress-track h-1">
            <div className="progress-fill"
              style={{ width: `${(xpInLevel / xpForLevel) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #db2777)' }} />
          </div>
        </div>
      </div>
    </aside>
  );
}
