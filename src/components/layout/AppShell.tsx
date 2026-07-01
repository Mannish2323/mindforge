'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Map, BookOpen, Book, Volume2, Mic, FileText, PenTool,
  Brain, LayoutGrid, Trophy, Users, Award, User, CreditCard, 
  Settings, Search, Flame, Zap, Bell, Menu, X, ChevronRight, 
  Sparkles, LogOut, ChevronLeft, Calendar
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/app/context/AuthContext';
import { SakuraParticles } from '@/components/animations/SakuraParticles';
import { Button } from '@/components/ui/Button';
import { SakuraMascotWidget } from '@/components/shared/SakuraMascotWidget';

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
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
        { name: 'Mock Tests', href: '/quiz?type=mock', icon: FileText },
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

  const currentLevelName = user?.user_metadata?.jlpt_level || 'N5';
  const currentLevelXp = user?.user_metadata?.xp || 120;
  const targetXp = 300;
  const xpPercentage = Math.min(100, Math.round((currentLevelXp / targetXp) * 100));

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full z-10">
      {/* Branding Header */}
      <div className="p-6 pb-2">
        <Link href="/home" className="flex items-center gap-3 group">
          <Logo size="md" glow={true} className="flex-shrink-0" />
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-glow-pink transition-all font-orbitron">
              Learning <span className="text-sakura-dark">Velmorth</span>
            </span>
            <span className="text-[10px] text-purple-300/60 font-semibold tracking-wider uppercase font-sans">
              Master Japanese.
            </span>
          </div>
        </Link>
      </div>

      {/* Main navigation list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
        {/* Home Tab */}
        <div>
          <Link
            href="/home"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-semibold text-sm ${
              pathname === '/home'
                ? 'bg-gradient-to-r from-brand-purple/40 to-pink-500/10 border border-brand-purple/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]'
                : 'text-purple-300/70 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            <span>Home</span>
          </Link>
        </div>

        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <h3 className="px-4 text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? 'bg-brand-purple/20 border border-brand-purple/20 text-white font-semibold'
                        : 'text-purple-300/70 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sakura-dark' : 'text-purple-300/50'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3 h-3 text-sakura-dark animate-pulse" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User profile bottom card */}
      <div className="p-4 border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-pink-500 flex items-center justify-center font-bold text-white shadow-md relative overflow-hidden">
            {user?.email?.[0].toUpperCase() || 'U'}
            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-brand-purple/30 text-brand-purple-light rounded-md">
                {currentLevelName}
              </span>
              <span className="text-[10px] text-purple-300/50 font-medium">
                Level 2
              </span>
            </div>
          </div>
        </div>

        {/* Mini XP progress bar */}
        <div className="mt-3 px-1 space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-purple-300/50">
            <span>XP PROGRESS</span>
            <span className="text-sakura-dark">{currentLevelXp} / {targetXp} XP</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-purple to-sakura-dark rounded-full transition-all duration-500 ease-out"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#09060F] text-white flex relative overflow-hidden">
      {/* Background Falling Sakura Petals */}
      <SakuraParticles />

      {/* Background Radial Aura Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Desktop Sidebar (Left Sidebar) */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0e0a1a]/60 backdrop-blur-xl h-screen sticky top-0 flex-shrink-0 overflow-hidden">
        {renderSidebarContent()}
      </aside>

      {/* Tablet/Mobile Drawer (Collapsible Sidebar) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex flex-col w-64 border-r border-white/10 bg-[#0e0a1a] h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <button 
              className="absolute top-4 right-4 p-2 text-purple-300 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scrollbar-thin">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-[#09060F]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Menu Trigger for Tablet / Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Input */}
            <div className="relative max-w-md hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/40" />
              <input
                type="text"
                placeholder="Search lessons, vocabulary, grammar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-80 bg-white/[0.03] border ${
                  searchFocused 
                    ? 'border-brand-purple/60 shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                    : 'border-white/5 hover:border-white/10'
                } rounded-xl pl-11 pr-14 py-2.5 text-sm placeholder-purple-300/30 text-white outline-none transition-all`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-purple-300/40 font-bold select-none">
                <span>⌘</span>
                <span>K</span>
              </div>
            </div>
          </div>

          {/* User Status Badges and Profile */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-xs font-bold hover:scale-105 transition-transform select-none">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>5 Day Streak</span>
            </div>

            {/* XP Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs font-bold hover:scale-105 transition-transform select-none">
              <Zap className="w-4 h-4 fill-yellow-500" />
              <span>120 XP</span>
            </div>

            {/* Level Badge */}
            <div className="flex items-center gap-1 px-3 py-1.5 bg-brand-purple/10 border border-brand-purple/20 text-brand-purple-light rounded-xl text-xs font-extrabold hover:scale-105 transition-transform select-none">
              <span className="font-orbitron">{currentLevelName}</span>
              <span className="text-[10px] opacity-75 font-normal ml-0.5">Lv.2</span>
            </div>

            {/* Notification Bell */}
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-purple-300 hover:text-white transition-all relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full" />
            </button>

            {/* Quick Profile Dropdown Trigger */}
            <Link
              href="/profile"
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-pink-500 flex items-center justify-center font-bold text-white shadow-md hover:scale-105 transition-all select-none"
            >
              {user?.email?.[0].toUpperCase() || 'U'}
            </Link>
          </div>
        </header>

        {/* Content Children wrapper */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 relative z-10 pb-28 md:pb-8">
          {children}
        </main>
      </div>

      {/* Floating Sakura Mascot Widget */}
      <SakuraMascotWidget />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0e0a1a]/95 backdrop-blur-xl border-t border-white/5 px-4 py-2 pb-[calc(env(safe-area-inset-bottom)+8px)] flex items-center justify-around shadow-2xl">
        {[
          { name: 'Home', href: '/home', icon: Home },
          { name: 'Roadmap', href: '/jlpt', icon: Map },
          { name: 'AI Tutor', href: '/ai-tutor', icon: Sparkles },
          { name: 'Review', href: '/review', icon: Brain },
          { name: 'Profile', href: '/profile', icon: User },
        ].map((item) => {
          const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 py-1 px-3 relative group">
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-tr from-brand-purple/30 to-sakura-dark/20 text-white shadow-[0_0_12px_rgba(236,72,153,0.25)] scale-110' 
                  : 'text-purple-300/40 group-hover:text-purple-200'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[9px] font-bold tracking-wider transition-all duration-300 uppercase ${
                isActive ? 'text-sakura-dark font-extrabold scale-105' : 'text-purple-300/40 group-hover:text-purple-200'
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
