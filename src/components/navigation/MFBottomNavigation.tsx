'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils';
import { MFIcon, MFIconType } from '@/components/ui/MFIcon';

interface NavItem {
  id: string;
  label: string;
  icon: MFIconType;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',     label: 'Home',    icon: 'home',      href: '/home' },
  { id: 'learn',    label: 'Learn',   icon: 'study',     href: '/learn' },
  { id: 'practice', label: 'Practice',icon: 'quiz',      href: '/practice' },
  { id: 'community',label: 'Community',icon: 'community',href: '/community' },
  { id: 'profile',  label: 'Profile', icon: 'profile',   href: '/profile' },
];

interface MFBottomNavigationProps {
  className?: string;
}

export function MFBottomNavigation({ className }: MFBottomNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === '/home') return pathname === '/home' || pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-card border-t border-edge',
        'shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]',
        'pb-[env(safe-area-inset-bottom)]',
        className
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-stretch h-16 max-w-xl mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-0.5',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-xl mx-0.5',
                'transition-colors duration-150',
                active ? 'text-brand' : 'text-ink-muted hover:text-ink-secondary'
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {/* Active background highlight */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-1 rounded-xl bg-brand/10 -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <motion.div
                animate={active ? { scale: 1.1, y: 0 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <MFIcon
                  name={item.icon}
                  size={26}
                  variant="transparent"
                />
              </motion.div>

              {/* Label */}
              <span className={cn(
                'text-[10px] font-bold tracking-wide',
                active ? 'text-brand' : 'text-ink-muted'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
