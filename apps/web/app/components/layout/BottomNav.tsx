'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, PenLine, Mic, User } from 'lucide-react';
import { cn } from '@evlo/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'HOME',   path: '/home',   icon: Home },
    { label: 'PATH',   path: '/path',   icon: BookOpen },
    { label: 'SCRIPT', path: '/script', icon: PenLine },
    { label: 'SPEAK',  path: '/speak',  icon: Mic },
    { label: 'PROFILE', path: '/profile', icon: User },
  ];

  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--bottom-nav-h, 68px)',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path || pathname.startsWith(item.path + '/');

        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn('bottom-nav-item', { active: isActive })}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              height: '100%',
              color: isActive ? 'var(--primary, #16A34A)' : 'var(--text-3, #7e7e86)',
              textDecoration: 'none',
              fontSize: '10px',
              fontWeight: isActive ? 800 : 500,
              gap: '3px',
              position: 'relative',
              transition: 'color 0.2s ease',
            }}
          >
            {/* Active pill indicator */}
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 28,
                  height: 3,
                  background: 'var(--primary, #16A34A)',
                  borderRadius: '0 0 3px 3px',
                  animation: 'fadein 200ms ease both',
                }}
              />
            )}

            <Icon
              size={20}
              style={{
                transform: isActive ? 'scale(1.15) translateY(1px)' : 'scale(1)',
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                filter: isActive ? 'drop-shadow(0 0 4px rgba(22,163,74,0.55))' : 'none',
              }}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
