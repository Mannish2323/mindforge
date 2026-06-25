'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../app/context/AuthContext';

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
        background: 'var(--bg, #0B1E12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        zIndex: 9999,
      }}
    >
      {/* Background Soft Glow */}
      <div
        className="splash-glow"
        style={{
          position: 'absolute',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(74, 222, 128, 0.25)',
          filter: 'blur(40px)',
          animation: 'splashGlowPulse 3s ease-in-out infinite',
        }}
      />

      {/* Mascot SVG (Simplified self-contained CSS animations) */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: '140px',
          height: '140px',
          zIndex: 2,
          filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.35))',
        }}
      >
        <defs>
          <radialGradient id="bodyGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#86EFAC" />
            <stop offset="70%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#16A34A" />
          </radialGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
          <linearGradient id="bookCover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="100%" stopColor="#052E16" />
          </linearGradient>
        </defs>

        {/* Crown leaves */}
        <g>
          <path d="M 60,65 C 45,50 60,35 75,50 C 75,55 70,60 60,65 Z" fill="#15803D" />
          <path d="M 140,65 C 155,50 140,35 125,50 C 125,55 130,60 140,65 Z" fill="#15803D" />
          
          <path className="leaf-sway-1" d="M 55,75 C 35,65 45,45 65,55 C 70,60 65,70 55,75 Z" fill="#16A34A" style={{ transformOrigin: '65px 55px' }} />
          <path className="leaf-sway-2" d="M 75,65 C 60,50 75,30 90,45 C 90,50 85,60 75,65 Z" fill="#4ADE80" style={{ transformOrigin: '85px 48px' }} />
          <path className="leaf-pulse" d="M 100,60 C 90,35 110,35 100,60 Z" fill="#86EFAC" style={{ transformOrigin: '100px 60px' }} />
          <path className="leaf-sway-2" d="M 125,65 C 140,50 125,30 110,45 C 110,50 115,60 125,65 Z" fill="#4ADE80" style={{ transformOrigin: '115px 48px' }} />
          <path className="leaf-sway-1" d="M 145,75 C 165,65 155,45 135,55 C 130,60 135,70 145,75 Z" fill="#16A34A" style={{ transformOrigin: '135px 55px' }} />
        </g>

        {/* Body */}
        <circle cx="100" cy="115" r="55" fill="url(#bodyGrad)" />

        {/* Blush */}
        <ellipse cx="62" cy="116" rx="8" ry="4.5" fill="#FFA4A4" opacity="0.45" />
        <ellipse cx="138" cy="116" rx="8" ry="4.5" fill="#FFA4A4" opacity="0.45" />

        {/* Eyes (Blinking) */}
        <g className="mascot-eyes" style={{ transformOrigin: '100px 104px' }}>
          <circle cx="76" cy="104" r="10" fill="#1C3B2B" />
          <circle cx="73.5" cy="101.5" r="3.2" fill="#FFFFFF" />
          <circle cx="80" cy="107" r="1.5" fill="#FFFFFF" />
          
          <circle cx="124" cy="104" r="10" fill="#1C3B2B" />
          <circle cx="121.5" cy="101.5" r="3.2" fill="#FFFFFF" />
          <circle cx="128" cy="107" r="1.5" fill="#FFFFFF" />
        </g>

        {/* Mouth */}
        <g>
          <path d="M 91,120 Q 100,134 109,120 Z" fill="#E11D48" />
          <path d="M 94,124 Q 100,121 106,124 Q 100,133 94,124 Z" fill="#FDA4AF" />
        </g>

        {/* Feet */}
        <g>
          <path d="M 72,166 C 68,176 80,178 84,167" fill="#15803D" />
          <path d="M 128,166 C 132,176 120,178 116,167" fill="#15803D" />
        </g>

        {/* Arms */}
        <g>
          <path d="M 50,132 Q 40,140 54,146" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M 150,132 Q 160,140 146,146" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>

        {/* Spectacles */}
        <g>
          <circle cx="76" cy="104" r="21" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          <circle cx="124" cy="104" r="21" stroke="url(#goldGrad)" strokeWidth="3" fill="none" />
          <path d="M 97,104 Q 100,99 103,104" stroke="url(#goldGrad)" strokeWidth="3.2" fill="none" />
          <path d="M 64,96 L 70,90 M 112,96 L 118,90" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Book */}
        <g className="book-float" style={{ transformOrigin: '100px 145px' }}>
          <path d="M 100,165 L 55,150 L 55,120 L 100,135 Z" fill="url(#bookCover)" stroke="url(#goldGrad)" strokeWidth="1.5" />
          <path d="M 100,165 L 145,150 L 145,120 L 100,135 Z" fill="url(#bookCover)" stroke="url(#goldGrad)" strokeWidth="1.5" />
          <path d="M 100,162 L 58,148 L 58,122 L 100,137 Z" fill="#F8FAFC" />
          <path d="M 100,162 L 142,148 L 142,122 L 100,137 Z" fill="#F8FAFC" />
          <circle cx="100" cy="148" r="4.5" fill="#EAB308" />
        </g>
      </svg>

      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div
          style={{
            fontSize: '18px',
            fontWeight: 900,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text, #E8F5E9)',
          }}
        >
          Velmorth
        </div>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'var(--text-3, #5E7D63)',
            marginTop: 4,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Japanese Labs
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 140,
          height: 3,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 99,
          overflow: 'hidden',
          zIndex: 2,
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
        @keyframes splashGlowPulse {
          0%, 100% { transform: scale(0.9); opacity: 0.4; }
          50%       { transform: scale(1.1); opacity: 0.7; }
        }
        @keyframes splashBar {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .leaf-sway-1 {
          animation: leafSway1 2.5s ease-in-out infinite;
        }
        .leaf-sway-2 {
          animation: leafSway2 2.2s ease-in-out infinite;
        }
        .leaf-pulse {
          animation: leafPulse 1.8s ease-in-out infinite;
        }
        .mascot-eyes {
          animation: eyesBlink 4s ease-in-out infinite;
        }
        .book-float {
          animation: bookFloatAnimation 2.5s ease-in-out infinite;
        }
        @keyframes leafSway1 {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes leafSway2 {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes leafPulse {
          0%, 100% { transform: scaleY(0.95); }
          50% { transform: scaleY(1.05); }
        }
        @keyframes eyesBlink {
          0%, 8%, 10%, 100% { transform: scaleY(1); }
          9% { transform: scaleY(0.1); }
        }
        @keyframes bookFloatAnimation {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
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

  // Client-side guard: redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      const loginUrl = `/auth/login?next=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [user, loading, router, pathname]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return <VelmorthSplash />;
  }

  if (hideNav) {
    return (
      <div
        className="app-shell-fullscreen"
        style={{
          minHeight: '100vh',
          background: 'var(--bg, #0B1E12)',
          color: 'var(--text, #E8F5E9)',
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className="app-layout has-sidebar"
      style={{
        minHeight: '100vh',
        background: 'var(--bg, #0B1E12)',
        color: 'var(--text, #E8F5E9)',
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
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar Drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Topbar — passes toggle handler */}
      <Topbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

      {/* Main Content Area — offset handled by CSS .has-sidebar rules */}
      <main
        id="page-content"
        className="main-content"
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
