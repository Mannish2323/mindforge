'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Map, BookOpen, Book, Volume2, Mic, FileText, PenTool,
  Brain, LayoutGrid, Trophy, Users, Award, User, CreditCard,
  Settings, Flame, Zap, Menu, X, ChevronRight,
  Sparkles, LogOut, Bookmark, BarChart3
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthModal } from '@/components/shared/AuthModal';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { SakuraMascotWidget } from '@/components/shared/SakuraMascotWidget';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { PageTransition } from '@/components/layout/PageTransition';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
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
        { name: 'JLPT Roadmap', href: '/jlpt', icon: Map },
        { name: 'Vocabulary', href: '/vocabulary', icon: BookOpen },
        { name: 'Grammar', href: '/grammar', icon: Book },
        { name: 'Kanji', href: '/kanji', icon: PenTool },
        { name: 'Listening', href: '/listening', icon: Volume2 },
        { name: 'Speaking', href: '/speaking', icon: Mic },
        { name: 'Reading', href: '/reading', icon: FileText },
        { name: 'Writing', href: '/writing', icon: PenTool },
      ]
    },
    {
      title: 'PRACTICE',
      items: [
        { name: 'Review (SRS)', href: '/review', icon: Brain },
        { name: 'Quiz', href: '/quiz', icon: LayoutGrid },
        { name: 'AI Tutor', href: '/ai-tutor', icon: Sparkles },
      ]
    },
    {
      title: 'COMMUNITY',
      items: [
        { name: 'Community', href: '/community', icon: Users },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Achievements', href: '/achievements', icon: Award },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { name: 'Profile', href: '/profile', icon: User },
        { name: 'Progress', href: '/progress', icon: BarChart3 },
        { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
        { name: 'Subscription', href: '/billing', icon: CreditCard },
        { name: 'Settings', href: '/settings', icon: Settings },
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
              pathname === '/home'
                ? 'bg-brand/8 border border-brand/15 text-brand shadow-sm'
                : 'text-ink-secondary hover:text-ink hover:bg-warm-soft border border-transparent'
            }`}
          >
            <Home className="w-[18px] h-[18px] flex-shrink-0" />
            <span>Home</span>
          </Link>
        </div>

        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <h3 className="px-4 mb-2 text-[9px] font-extrabold tracking-[0.2em] text-ink-light uppercase">
              {group.title}
            </h3>
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-[13px] font-medium ${
                    isActive
                      ? 'bg-brand/8 border border-brand/15 text-brand font-semibold'
                      : 'text-ink-muted hover:text-ink hover:bg-warm-soft border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand' : 'text-ink-light'}`} />
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
        <div className="p-3 rounded-xl bg-warm-cream border border-edge space-y-3">
          <div className="flex items-center gap-3">
            <Avatar
              name={userName}
              emoji={profile?.avatarUrl}
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
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand to-accent shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex relative overflow-hidden">
      {/* Sakura Petals Background */}
      <SakuraParticles />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-edge bg-white h-screen sticky top-0 flex-shrink-0 overflow-hidden">
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
              className="relative flex flex-col w-[280px] border-r border-edge bg-white h-full shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 p-2 text-ink-muted hover:text-ink transition-colors z-20 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              {renderSidebarContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen h-[100dvh] overflow-y-auto scrollbar-thin">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-edge px-4 md:px-6 py-3 flex items-center justify-between gap-3 safe-top">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-warm-soft hover:bg-warm-cream text-ink-muted hover:text-ink transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile logo */}
            <Link href="/home" className="lg:hidden flex items-center gap-2">
              <Logo size="sm" glow={false} />
              <span className="font-bold text-sm text-ink font-heading">MindForge</span>
            </Link>
          </div>

          {/* Right side badges */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Daily Progress (desktop) */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-cat-green-light border border-cat-green/15 rounded-xl text-xs font-bold text-cat-green">
              <span>{xpToday}/{dailyGoalXp} XP</span>
            </div>

            {/* Streak */}
            <Badge variant="amber" size="sm" icon={<Flame className="w-3.5 h-3.5 fill-cat-orange text-cat-orange" />}>
              {userStreak}
            </Badge>

            {/* XP */}
            <Badge variant="purple" size="sm" icon={<Zap className="w-3.5 h-3.5 fill-brand text-brand" />} className="hidden sm:inline-flex">
              {userXp}
            </Badge>

            {/* Level */}
            <Badge variant="neon" size="sm" className="hidden md:inline-flex">
              <span className="font-heading font-bold">{jlptLevel}</span>
              <span className="text-[9px] opacity-60 ml-0.5">Lv.{userLevel}</span>
            </Badge>

            {/* Notifications */}
            <NotificationBell />

            {/* Profile */}
            <Link href="/profile">
              <Avatar name={userName} emoji={profile?.avatarUrl} size="sm" />
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

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-edge px-2 py-1.5 safe-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { name: 'Home', href: '/home', icon: Home },
            { name: 'Learn', href: '/jlpt', icon: BookOpen },
            { name: 'Practice', href: '/ai-tutor', icon: Sparkles },
            { name: 'Progress', href: '/progress', icon: BarChart3 },
            { name: 'Profile', href: '/profile', icon: User },
          ].map((item) => {
            const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 relative"
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-brand/10 text-brand scale-110'
                      : 'text-ink-light'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wider ${
                    isActive ? 'text-brand' : 'text-ink-light'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
