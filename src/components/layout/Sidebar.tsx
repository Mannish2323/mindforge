'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import {
  Home, Map, BookOpen, Pen, Mic, Headphones, BookOpenCheck,
  RotateCcw, Sparkles, Users, Trophy, Award,
  Bookmark, Download, User, CreditCard, Settings, Shield,
  ChevronRight, GraduationCap, Brain, FileText, Gamepad2, Briefcase
} from 'lucide-react';
import { JLPTBadge, PlanBadge } from '@/components/shared/JLPTBadge';

const NAV_GROUPS = [
  {
    label: 'Learn',
    items: [
      { icon: Home,          label: 'Home',            href: '/home' },
      { icon: GraduationCap, label: 'Continue',        href: '/path' },
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
      { icon: RotateCcw,  label: 'Review (SRS)', href: '/review' },
      { icon: Gamepad2,   label: 'Quiz',         href: '/quiz' },
      { icon: Map,        label: 'JLPT Roadmap', href: '/jlpt' },
      { icon: Brain,      label: 'AI Tutor',     href: '/ai-tutor' },
      { icon: Briefcase,  label: 'Job Prep',     href: '/job-prep' },
    ],
  },
  {
    label: 'Social',
    items: [
      { icon: Users,  label: 'Community',   href: '/community' },
      { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
      { icon: Award,  label: 'Achievements',href: '/achievements' },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: Bookmark,   label: 'Bookmarks',    href: '/bookmarks' },
      { icon: Download,   label: 'Downloads',    href: '/downloads' },
      { icon: User,       label: 'Profile',      href: '/profile' },
      { icon: CreditCard, label: 'Subscription', href: '/billing' },
      { icon: Settings,   label: 'Settings',     href: '/settings' },
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
    <aside
      className="w-[200px] xl:w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0b0920 0%, #0e0b22 60%, #130930 100%)',
        borderRight: '1px solid rgba(139,92,246,0.13)',
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-20 pointer-events-none blur-2xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-20 left-0 w-16 h-16 opacity-15 pointer-events-none blur-2xl"
        style={{ background: 'radial-gradient(circle, #db2777, transparent)' }} />

      {/* Logo */}
      <div className="px-3 pt-4 pb-3 flex-shrink-0">
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-2 w-full hover:opacity-80 transition-opacity min-w-0"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 4px 12px rgba(124,58,237,0.4)' }}
          >
            <span className="text-white font-black text-xs">V</span>
          </div>
          <div className="text-left min-w-0 overflow-hidden">
            <div className="text-white font-black text-sm tracking-wide leading-none truncate">Velmorth</div>
            <div className="text-[9px] font-jp tracking-widest mt-0.5 truncate" style={{ color: 'rgba(167,139,250,0.5)' }}>ベルモルス</div>
          </div>
        </button>
      </div>

      <div className="divider mx-3" />

      {/* Nav groups */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto overflow-x-hidden scrollbar-none min-w-0">
        {NAV_GROUPS.map(group => (
          <div key={group.label} className="mb-3">
            <div
              className="px-2.5 mb-1 text-[9px] font-black uppercase tracking-widest truncate"
              style={{ color: 'rgba(139,92,246,0.45)' }}
            >
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href);
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all text-left group relative min-w-0"
                      style={
                        active
                          ? { background: 'linear-gradient(90deg, rgba(124,58,237,0.25), rgba(124,58,237,0.08))', border: '1px solid rgba(124,58,237,0.3)' }
                          : { border: '1px solid transparent' }
                      }
                    >
                      {active && (
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full"
                          style={{ background: 'linear-gradient(180deg, #7c3aed, #db2777)' }}
                        />
                      )}
                      <item.icon
                        className="w-3.5 h-3.5 flex-shrink-0 transition-colors"
                        style={{ color: active ? '#a78bfa' : 'rgba(139,92,246,0.45)' }}
                      />
                      <span
                        className="text-xs font-semibold transition-colors truncate min-w-0"
                        style={{ color: active ? '#f0efff' : 'rgba(200,196,255,0.5)' }}
                      >
                        {item.label}
                      </span>
                      {active && (
                        <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: 'rgba(167,139,250,0.5)' }} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* Admin link */}
        {profile?.isAdmin && (
          <button
            onClick={() => router.push('/admin')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all text-left mt-1"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <Shield className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
            <span className="text-xs font-bold text-red-400 truncate">Admin</span>
          </button>
        )}
      </nav>

      <div className="divider mx-3" />

      {/* User section */}
      <div className="p-2.5 flex-shrink-0">
        <button
          onClick={() => router.push('/profile')}
          className="w-full flex items-center gap-2 p-2 rounded-xl transition-all hover:bg-[rgba(139,92,246,0.08)] min-w-0 overflow-hidden"
        >
          {/* Avatar — fixed size */}
          <div className="relative flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)' }}
            >
              {profile?.name?.[0]?.toUpperCase() || 'V'}
            </div>
          </div>

          {/* Name + level — truncate to prevent overflow */}
          <div className="flex-1 min-w-0 overflow-hidden text-left">
            <div className="text-xs font-bold text-white truncate leading-tight">{profile?.name || 'Learner'}</div>
            <div className="flex items-center gap-1 mt-0.5 flex-nowrap overflow-hidden">
              <JLPTBadge level={profile?.jlpt_target || 'N5'} size="xs" />
              <span className="text-[9px] flex-shrink-0" style={{ color: 'rgba(160,150,220,0.5)' }}>Lv.{level}</span>
            </div>
          </div>

          {/* Plan badge — always visible, flex-shrink-0 */}
          <div className="flex-shrink-0 ml-auto">
            <PlanBadge plan={profile?.planId || 'free'} className="!text-[8px] !px-1 !py-0" />
          </div>
        </button>

        {/* XP bar */}
        <div className="mt-2 px-1">
          <div className="flex justify-between mb-1">
            <span className="text-[9px] font-bold" style={{ color: 'rgba(160,150,220,0.45)' }}>
              {xp >= 1000 ? `${(xp/1000).toFixed(1)}K` : xp} XP
            </span>
            <span className="text-[9px]" style={{ color: 'rgba(160,150,220,0.3)' }}>
              {xpForLevel >= 1000 ? `${(xpForLevel/1000).toFixed(0)}K` : xpForLevel}
            </span>
          </div>
          <div className="progress-track h-1">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((xpInLevel / xpForLevel) * 100, 100)}%`, background: 'linear-gradient(90deg, #7c3aed, #db2777)' }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
