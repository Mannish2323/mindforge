'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../context/AuthContext';

interface AppShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

/** Premium animated splash shown while session is loading */
function VelmorthSplash() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg, #0B1220)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 9999,
      }}
    >
      {/* Animated logo mark */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #16A34A, #4ade80)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
          fontWeight: 900,
          color: '#fff',
          boxShadow: '0 0 40px rgba(22,163,74,0.45)',
          animation: 'splashPulse 1.6s ease-in-out infinite',
        }}
      >
        V
      </div>

      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #fff, #4ade80)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Velmorth
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--text-3, #7e7e86)',
            marginTop: 4,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          日本語を学ぼう
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 160,
          height: 3,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 99,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #16A34A, #4ade80)',
            borderRadius: 99,
            animation: 'splashBar 1.4s ease-in-out infinite',
            backgroundSize: '200% 100%',
          }}
        />
      </div>

      <style>{`
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(22,163,74,0.45); }
          50%       { transform: scale(1.06); box-shadow: 0 0 60px rgba(22,163,74,0.70); }
        }
        @keyframes splashBar {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}

export function AppShell({ children, hideNav = false }: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Client-side guard for static export deploy (where middleware is disabled)
  useEffect(() => {
    if (!loading && !user) {
      const loginUrl = `/auth/login?next=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) {
    return <VelmorthSplash />;
  }

  if (hideNav) {
    return (
      <div
        className="app-shell-fullscreen"
        style={{
          minHeight: '100vh',
          background: 'var(--bg, #0B1220)',
          color: 'var(--text, #fff)',
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="app-layout"
      style={{
        minHeight: '100vh',
        background: 'var(--bg, #0B1220)',
        color: 'var(--text, #fff)',
      }}
    >
      {/* Sidebar Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="mobile-sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Topbar */}
      <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <main
        id="page-content"
        className="main-content"
        style={{
          paddingTop: 'var(--topbar-height, 56px)',
          paddingBottom: '80px', // Clear bottom nav on mobile
        }}
      >
        <div
          className="content-container"
          style={{
            width: '100%',
            margin: '0 auto',
            maxWidth: '1280px',
          }}
        >
          {children}
        </div>
      </main>

      {/* Bottom Nav — Mobile only */}
      <BottomNav />
    </div>
  );
}
