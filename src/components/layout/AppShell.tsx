'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Sparkles, LogOut, Sun, Moon, Monitor
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { MFIcon, MFIconType } from '@/components/ui/MFIcon';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthModal } from '@/components/shared/AuthModal';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { SakuraMascotWidget } from '@/components/shared/SakuraMascotWidget';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { PageTransition } from '@/components/layout/PageTransition';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { MFBottomNavigation } from '@/components/navigation/MFBottomNavigation';

interface SidebarItem {
  name: string;
  href: string;
  iconName: MFIconType;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

// Theme toggle button
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="flex items-center p-1 rounded-xl bg-cream border border-edge gap-0.5">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
            theme === value
              ? 'bg-card shadow-[var(--paper-press-shadow)] text-ink'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { user, profile, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navigationGroups: SidebarGroup[] = [
    {
      title: 'LEARN',
      items: [
        { name: 'JLPT Roadmap', href: '/jlpt', iconName: 'jlpt' },
        { name: 'Vocabulary', href: '/vocabulary', iconName: 'vocabulary' },
        { name: 'Grammar', href: '/grammar', iconName: 'grammar' },
        { name: 'Kanji', href: '/kanji', iconName: 'kanji' },
        { name: 'Listening', href: '/listening', iconName: 'listening' },
        { name: 'Speaking', href: '/speaking', iconName: 'speaking' },
        { name: 'Reading', href: '/reading', iconName: 'reading' },
        { name: 'Writing', href: '/writing', iconName: 'writing' },
      ]
    },
    {
      title: 'PRACTICE',
      items: [
        { name: 'Review (SRS)', href: '/review', iconName: 'review' },
        { name: 'Quiz', href: '/quiz', iconName: 'quiz' },
        { name: 'AI Tutor', href: '/ai-tutor', iconName: 'ai-tutor' },
      ]
    },
    {
      title: 'COMMUNITY',
      items: [
        { name: 'Community', href: '/community', iconName: 'community' },
        { name: 'Leaderboard', href: '/leaderboard', iconName: 'leaderboard' },
        { name: 'Achievements', href: '/achievements', iconName: 'achievements' },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Profile', href: '/profile', iconName: 'profile' },
        { name: 'Progress', href: '/progress', iconName: 'progress' },
        { name: 'Bookmarks', href: '/bookmarks', iconName: 'bookmarks' },
        { name: 'Subscription', href: '/billing', iconName: 'subscription' },
        { name: 'Settings', href: '/settings', iconName: 'settings' },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (e) {
      console.error(e);
    }
  };

  // Real profile data
  const userName = user ? (profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner') : 'Guest Learner';
  const userXp = profile?.xp ?? 0;
  const userLevel = profile?.level ?? 1;
  const userStreak = profile?.streak ?? 0;
  const jlptLevel = profile?.jlpt_target || 'N5';
  const xpToday = profile?.xp_today ?? 0;
  const dailyGoalXp = profile?.daily_goal_xp ?? 25;
  const dailyProgress = Math.min(100, Math.round((xpToday / dailyGoalXp) * 100));

  // XP for current level progress
  const calcLevelProgress = () => {
    let threshold = 100;
    let accumulated = 0;
    for (let l = 1; l < userLevel; l++) {
      accumulated += threshold;
      threshold += 100;
    }
    const xpInLevel = userXp - accumulated;
    const xpForNext = threshold;
    return Math.min(100, Math.round((xpInLevel / xpForNext) * 100));
  };
  const levelProgress = calcLevelProgress();

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full z-10">
      {/* Branding */}
      <div className="p-5 pb-3">
        <Link href="/home" className="flex items-center gap-3 group">
          <Logo size="md" glow={false} className="flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-ink group-hover:text-brand transition-all font-heading">
              MindForge
            </span>
            <span className="text-[9px] text-ink-muted font-bold tracking-widest uppercase">
              Master Japanese
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin">
        {/* Home */}
        <div>
          <Link
            href="/home"
            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm overflow-hidden ${
              pathname === '/home'
                ? 'bg-brand/10 text-brand before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand'
                : 'text-ink-secondary hover:text-ink hover:bg-cream border border-transparent'
            }`}
          >
            <MFIcon name="home" size={18} className="flex-shrink-0" />
            <span>Home</span>
          </Link>
        </div>

        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <h3 className="px-4 mb-1.5 text-[9px] font-extrabold tracking-[0.18em] text-ink-light uppercase">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-semibold overflow-hidden ${
                    isActive
                      ? 'bg-brand/10 text-brand before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-brand'
                      : 'text-ink-muted hover:text-ink hover:bg-cream border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MFIcon
                      name={item.iconName}
                      size={17}
                      className={`flex-shrink-0 ${isActive ? 'text-brand' : 'text-ink-light'}`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-brand" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User profile card */}
      <div className="p-3 border-t border-edge">
        <div className="p-3 rounded-xl bg-cream border border-edge space-y-3">
          <div className="flex items-center gap-3">
            <Avatar
              name={userName}
              size="md"
              level={userLevel}
              showLevel
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand/10 text-brand rounded-md">
                  {jlptLevel}
                </span>
                <span className="text-[9px] text-ink-muted font-medium">
                  Lv.{userLevel}
                </span>
              </div>
            </div>
          </div>
          <ProgressBar
            value={levelProgress}
            size="sm"
            label="XP Progress"
            showLabel
          />
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal({ title: 'Sign in to continue' })}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand to-coral shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex relative overflow-hidden font-sans">
      {/* Sakura Petals Background */}
      <SakuraParticles />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] border-r border-edge bg-card h-screen sticky top-0 flex-shrink-0 overflow-hidden shadow-[1px_0_0_var(--border-subtle)]">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex flex-col w-[280px] border-r border-edge bg-card h-full shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink transition-colors z-20 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MFIcon name="close" size={20} />
              </button>
              {renderSidebarContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen h-[100dvh] overflow-y-auto scrollbar-thin">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-edge px-4 md:px-6 py-3 flex items-center justify-between gap-3 safe-top min-h-[56px]">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-cream hover:bg-card text-ink-muted hover:text-ink border border-edge transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <MFIcon name="menu" size={20} />
            </button>

            {/* Mobile logo */}
            <Link href="/home" className="lg:hidden flex items-center gap-2">
              <Logo size="sm" glow={false} variant="icon" />
            </Link>
          </div>

          {/* Right side badges */}
          <div className="flex items-center gap-2">
            {/* Hearts (lives) */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-light border border-brand/25 rounded-xl text-xs font-extrabold text-brand" title="Hearts (Display Only)">
              <MFIcon name="heart" size={16} />
              <span>5 Full</span>
            </div>
            
            {/* XP */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-yellow-light border border-yellow/25 rounded-xl text-xs font-extrabold text-ink">
              <MFIcon name="star" size={16} />
              <span>{userXp} XP</span>
              <span className="bg-yellow text-white px-1.5 py-0.5 rounded-md text-[10px] ml-1">Lv.{userLevel}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-light border border-orange/25 rounded-xl text-xs font-extrabold text-ink">
              <MFIcon name="flame" size={16} />
              <span className="hidden sm:inline">{userStreak}</span>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <NotificationBell />

            {/* Profile */}
            <Link href="/profile">
              <Avatar name={userName} size="sm" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10 pb-24 md:pb-8">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>

      {/* Sakura Mascot Widget */}
      <SakuraMascotWidget />

      {/* Mobile Bottom Navigation — MindForge Whiteboard Style */}
      <MFBottomNavigation className="lg:hidden" />
    </div>
  );
}
