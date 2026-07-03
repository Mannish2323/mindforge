'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Bell, X, Check, Sparkles, Flame, Award, BookOpen, Zap, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  title: string;
  message: string;
  href: string;
  icon: 'streak' | 'achievement' | 'lesson' | 'xp' | 'ai' | 'system';
  read: boolean;
  createdAt: Date;
}

const ICON_MAP = {
  streak: { icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  achievement: { icon: Award, color: 'text-neon-pink', bg: 'bg-pink-500/15' },
  lesson: { icon: BookOpen, color: 'text-brand-light', bg: 'bg-neon-purple/15' },
  xp: { icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
  ai: { icon: Sparkles, color: 'text-sakura-dark', bg: 'bg-sakura-dark/15' },
  system: { icon: MessageSquare, color: 'text-sky-400', bg: 'bg-sky-500/15' },
};

// Generate initial notifications from real user events (will be replaced with Supabase later)
function generateInitialNotifications(): Notification[] {
  return [
    {
      id: '1',
      title: 'Keep your streak alive!',
      message: 'You studied yesterday — come back today to maintain your streak.',
      href: '/home',
      icon: 'streak',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: '2',
      title: 'New lesson available',
      message: 'JLPT N5 — Numbers unit is ready for you.',
      href: '/jlpt',
      icon: 'lesson',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: '3',
      title: 'Sakura AI tip',
      message: 'Try practicing particle usage with the AI tutor today.',
      href: '/ai-tutor',
      icon: 'ai',
      read: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
  ];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(generateInitialNotifications());
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-purple-300/50 hover:text-white transition-all relative cursor-pointer"
        aria-label="Notifications"
        whileTap={{ scale: 0.93 }}
      >
        <Bell className="w-4 h-4" />
        {/* Unread badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-r from-neon-purple to-neon-pink text-white text-[9px] font-extrabold rounded-full px-1 shadow-[0_0_8px_rgba(193,91,255,0.5)]"
            >
              {unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] rounded-2xl bg-[#12101D] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-brand-light hover:text-white transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-purple-300/40 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 text-purple-300/20" />
                  </div>
                  <p className="text-sm font-semibold text-purple-300/40">No notifications yet</p>
                  <p className="text-[11px] text-purple-300/25 mt-1">Your activity updates will appear here</p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const iconConfig = ICON_MAP[notification.icon];
                  const IconComponent = iconConfig.icon;

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04, type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <Link
                        href={notification.href}
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                        className={`flex items-start gap-3 px-5 py-3.5 transition-all hover:bg-white/[0.03] border-b border-white/[0.03] last:border-0 ${
                          !notification.read ? 'bg-neon-purple/[0.03]' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className={`p-2 rounded-xl ${iconConfig.bg} flex-shrink-0 mt-0.5`}>
                          <IconComponent className={`w-4 h-4 ${iconConfig.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold leading-tight ${notification.read ? 'text-purple-200/60' : 'text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-[11px] text-purple-300/40 mt-0.5 line-clamp-2 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[9px] text-purple-300/25 mt-1.5 font-bold uppercase tracking-wider">
                            {timeAgo(notification.createdAt)}
                          </p>
                        </div>

                        {/* Unread dot */}
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-neon-pink flex-shrink-0 mt-2 shadow-[0_0_6px_rgba(193,91,255,0.5)]" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
