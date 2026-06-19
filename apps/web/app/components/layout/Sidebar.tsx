'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, PenLine, Mic, Medal, RotateCcw, User, Settings, CreditCard, Crown, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '@evlo/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const mainNav = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Learn Path', path: '/path', icon: BookOpen },
    { label: 'Script Lab', path: '/script', icon: PenLine },
    { label: 'Speak', path: '/speak', icon: Mic },
    { label: 'JLPT', path: '/jlpt', icon: Medal },
    { label: 'Review', path: '/review', icon: RotateCcw },
  ];

  return (
    <aside className="sidebar" style={{
      width: '240px',
      background: 'var(--bg-surface, #1e1e24)',
      borderRight: '1px solid var(--border-strong, #2d2d34)',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 90,
      padding: '16px 0',
    }}>
      <div className="sidebar-logo" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 16px',
        marginBottom: '24px',
      }}>
        <div className="logo-mark" style={{
          background: 'linear-gradient(135deg, #16A34A, #4ade80)',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#fff',
          fontSize: '18px',
          boxShadow: '0 0 16px rgba(22,163,74,0.4)',
        }}>V</div>
        <div>
          <div className="logo-name" style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>Velmorth</div>
          <div className="logo-sub" style={{ fontSize: '10px', color: 'var(--text-muted, #7e7e86)' }}>Japanese Labs</div>
        </div>
      </div>

      <nav className="sidebar-nav" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '0 12px',
        flex: 1,
        overflowY: 'auto',
      }}>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn({ active: isActive })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '8px',
                color: isActive ? 'var(--primary, #ff9800)' : 'var(--text-secondary, #b3b3b9)',
                textDecoration: 'none',
                fontWeight: isActive ? 700 : 500,
                fontSize: '14px',
                background: isActive ? 'var(--surface-2, #2d2d34)' : 'transparent',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="sidebar-divider" style={{
          height: '1px',
          background: 'var(--border-strong, #2d2d34)',
          margin: '12px 0',
        }} />

        {/* Profile */}
        <Link
          href="/profile?tab=profile"
          className={cn({ active: pathname === '/profile' && !global?.window?.location?.search?.includes('settings') })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            color: pathname === '/profile' ? 'var(--primary, #ff9800)' : 'var(--text-secondary, #b3b3b9)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '14px',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <User size={18} />
          <span>Profile</span>
        </Link>

        {/* Settings inside Profile tab */}
        <Link
          href="/profile?tab=settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            color: 'var(--text-secondary, #b3b3b9)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '14px',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>

        {/* Billing */}
        <Link
          href="/billing"
          className={cn({ active: pathname === '/billing' })}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            color: pathname === '/billing' ? 'var(--primary, #ff9800)' : 'var(--text-secondary, #b3b3b9)',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '14px',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <CreditCard size={18} />
          <span>Billing</span>
        </Link>

        {/* Admin panel */}
        {profile?.isAdmin && (
          <Link
            href="/admin"
            className={cn({ active: pathname === '/admin' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 16px',
              borderRadius: '8px',
              color: 'var(--error, #f44336)',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '14px',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            <BarChart2 size={18} />
            <span>Admin</span>
          </Link>
        )}
      </nav>

      {/* Upgrade CTA */}
      {!profile?.isPremium && (
        <div className="sidebar-upgrade" style={{ padding: '0 16px' }}>
          <Link href="/billing" style={{ textDecoration: 'none' }}>
            <button
              className="sidebar-upgrade-btn"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #ffc107, #ff9800)',
                border: 'none',
                padding: '10px 12px',
                borderRadius: '8px',
                color: '#000',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Crown size={14} />
              <span>Upgrade to Pro</span>
            </button>
          </Link>
        </div>
      )}
    </aside>
  );
}
