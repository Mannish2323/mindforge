'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Map, BookOpen, Book, Volume2, Mic, FileText, PenTool,
  Brain, LayoutGrid, Trophy, Users, Award, User, CreditCard,
  Settings, Flame, Zap, Bell, Menu, X, ChevronRight,
  Sparkles, LogOut, Bookmark, Download, BarChart3
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/app/context/AuthContext';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { SakuraMascotWidget } from '@/components/shared/SakuraMascotWidget';
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
  const userName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner';
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
          <Logo size="md" glow={true} className="flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white group-hover:text-glow-pink transition-all font-orbitron">
              Velmorth
            </span>
            <span className="text-[9px] text-purple-300/40 font-bold tracking-widest uppercase">
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
                ? 'bg-gradient-to-r from-neon-purple/25 to-neon-pink/10 border border-neon-purple/25 text-white shadow-[0_0_15px_rgba(109,60,255,0.15)]'
                : 'text-purple-300/60 hover:text-white hover:bg-white/[0.04] border border-transparent'
            }`}
          >
            <Home className="w-[18px] h-[18px] flex-shrink-0" />
            <span>Home</span>
          </Link>
        </div>

        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <h3 className="px-4 mb-2 text-[9px] font-extrabold tracking-[0.2em] text-purple-300/30 uppercase">
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
                      ? 'bg-neon-purple/15 border border-neon-purple/20 text-white font-semibold'
                      : 'text-purple-300/55 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-neon-pink' : 'text-purple-300/40'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3 h-3 text-neon-pink" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User profile card */}
      <div className="p-3 border-t border-white/[0.04]">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
          <div className="flex items-center gap-3">
            <Avatar
              name={userName}
              emoji={profile?.avatarUrl}
              size="md"
              level={userLevel}
              showLevel
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-neon-purple/20 text-brand-light rounded-md">
                  {jlptLevel}
                </span>
                <span className="text-[9px] text-purple-300/40 font-medium">
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

        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-dark-base text-white flex relative overflow-hidden">
      {/* Sakura Petals Background */}
      <SakuraParticles />

      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-purple/8 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/6 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-white/[0.04] bg-dark-surface/60 backdrop-blur-xl h-screen sticky top-0 flex-shrink-0 overflow-hidden">
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex flex-col w-[280px] border-r border-white/[0.06] bg-dark-surface h-full shadow-2xl"
            >
              <button
                className="absolute top-4 right-4 p-2 text-purple-300/50 hover:text-white transition-colors z-20 cursor-pointer"
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
        <header className="sticky top-0 z-40 bg-dark-base/80 backdrop-blur-xl border-b border-white/[0.04] px-4 md:px-6 py-3 flex items-center justify-between gap-3 safe-top">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-purple-300/60 hover:text-white transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile logo */}
            <Link href="/home" className="lg:hidden flex items-center gap-2">
              <Logo size="sm" glow={true} />
              <span className="font-bold text-sm text-white font-orbitron">Velmorth</span>
            </Link>
          </div>

          {/* Right side badges */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Daily Progress (desktop) */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-xs font-bold text-emerald-400">
              <span>{xpToday}/{dailyGoalXp} XP</span>
            </div>

            {/* Streak */}
            <Badge variant="amber" size="sm" icon={<Flame className="w-3.5 h-3.5 fill-amber-500" />}>
              {userStreak}
            </Badge>

            {/* XP */}
            <Badge variant="purple" size="sm" icon={<Zap className="w-3.5 h-3.5 fill-brand-light" />} className="hidden sm:inline-flex">
              {userXp}
            </Badge>

            {/* Level */}
            <Badge variant="neon" size="sm" className="hidden md:inline-flex">
              <span className="font-orbitron">{jlptLevel}</span>
              <span className="text-[9px] opacity-60 ml-0.5">Lv.{userLevel}</span>
            </Badge>

            {/* Notifications */}
            <button
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] text-purple-300/50 hover:text-white transition-all relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-neon-pink rounded-full" />
            </button>

            {/* Profile */}
            <Link href="/profile">
              <Avatar name={userName} emoji={profile?.avatarUrl} size="sm" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 relative z-10 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Sakura Mascot Widget */}
      <SakuraMascotWidget />

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-surface/95 backdrop-blur-xl border-t border-white/[0.04] px-2 py-1.5 safe-bottom">
        <div className="flex items-center justify-around max-w-lg mx-auto">
          {[
            { name: 'Home', href: '/home', icon: Home },
            { name: 'Lessons', href: '/jlpt', icon: Map },
            { name: 'Sakura AI', href: '/ai-tutor', icon: Sparkles },
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
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'text-white scale-110'
                      : 'text-purple-300/35'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[9px] font-bold tracking-wider uppercase ${
                    isActive ? 'text-neon-pink' : 'text-purple-300/30'
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
