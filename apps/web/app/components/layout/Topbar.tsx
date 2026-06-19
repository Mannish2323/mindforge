'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown } from 'lucide-react';
import { useStoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Button, Modal } from '@evlo/ui';

export function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { state, refillHearts } = useStoreContext();
  const { user, profile, updateHearts } = useAuth();
  const router = useRouter();
  const [showRefillModal, setShowRefillModal] = useState(false);

  const activeState = React.useMemo(() => {
    if (user && profile) {
      return {
        ...state,
        xp: profile.xp,
        gems: profile.leafBalance,
        streak: profile.streak,
        username: profile.name,
        hearts: profile.heartsTotal ?? state.hearts,
        maxHearts: profile.heartsMax ?? state.maxHearts,
        heartsRecoverAt: profile.heartsRecoverAt ?? state.heartsRecoverAt,
        heartRecoveryHours: profile.heartRecoveryHours ?? state.heartRecoveryHours,
      };
    }
    return state;
  }, [state, user, profile]);

  const handleRefillClick = () => {
    if (profile?.isPremium) {
      refillHearts(activeState.maxHearts);
      if (user && profile) {
        updateHearts(activeState.maxHearts, null, null);
      }
    } else {
      setShowRefillModal(true);
    }
  };

  const handleSpendGemsRefill = () => {
    if (activeState.gems >= 10) {
      refillHearts(activeState.maxHearts);
      if (user) {
        updateHearts(activeState.maxHearts, null, null);
      }
      setShowRefillModal(false);
    }
  };

  return (
    <>
      <header id="topbar" className="topbar" style={{
        position: 'fixed',
        top: 0,
        left: 'var(--topbar-left, 0)',
        right: 0,
        height: 'var(--topbar-height, 56px)',
        background: 'var(--bg-surface, #1e1e24)',
        borderBottom: '1px solid var(--border-strong, #2d2d34)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        zIndex: 100,
      }}>
        {/* Left: Hamburger menu + Brand Icon + Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Hamburger button - visible on mobile only */}
          <button
            onClick={onToggleSidebar}
            className="mobile-menu-toggle"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'var(--surface-2, #2d2d34)',
              border: '1px solid var(--border-strong, #2d2d34)',
              color: 'var(--text, #fff)',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill="currentColor"/>
            </svg>
          </button>

          <Link href="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div className="logo-mark" style={{
              background: 'linear-gradient(135deg, #16A34A, #4ade80)',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-md, 8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '16px',
              boxShadow: '0 0 12px rgba(22,163,74,0.4)',
            }}>V</div>
            <span className="topbar-wordmark" style={{
              fontWeight: 800,
              fontSize: '16px',
              color: 'var(--text, #fff)',
              letterSpacing: '-0.02em',
            }}>Velmorth</span>
          </Link>
        </div>

        {/* Right: Stats strip */}
        <div className="topbar-stats" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '100%',
        }}>
          {/* XP */}
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <div className="stat-pill xp" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--surface-2, #2d2d34)',
              padding: '4px 8px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary, #fff)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '16px' }}>⭐</span>
              <span>{activeState.xp ?? 0}</span>
            </div>
          </Link>

          {/* Streak */}
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <div className="stat-pill streak" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--surface-2, #2d2d34)',
              padding: '4px 8px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary, #fff)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              <span style={{
                fontSize: '16px',
                animation: 'flame-rise 2.4s ease-in-out infinite',
                display: 'inline-block',
                transformOrigin: 'bottom center'
              }}>🔥</span>
              <span>{activeState.streak ?? 0}</span>
            </div>
          </Link>

          {/* Hearts */}
          <div 
            className="stat-pill hearts" 
            onClick={handleRefillClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--surface-2, #2d2d34)',
              padding: '4px 8px',
              borderRadius: '16px',
              fontSize: '13px',
              fontWeight: 700,
              color: 'var(--text-primary, #fff)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ fontSize: '16px' }}>❤️</span>
            <span>{activeState.hearts ?? 50}</span>
          </div>

          {/* Gems */}
          <div className="stat-pill gems" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--surface-2, #2d2d34)',
            padding: '4px 8px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--text-primary, #fff)',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ fontSize: '16px' }}>💎</span>
            <span>{activeState.gems ?? 0}</span>
          </div>

          {/* Pro badge */}
          {profile?.isPremium ? (
            <Link href="/billing" style={{ textDecoration: 'none' }}>
              <div className="pro-badge" style={{
                background: 'linear-gradient(135deg, #ffc107, #ff9800)',
                color: '#000',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                <Crown size={12} />
                PRO
              </div>
            </Link>
          ) : (
            <Link href="/billing" style={{ textDecoration: 'none' }}>
              <div className="pro-badge" style={{
                background: 'var(--surface-3, #3a3a42)',
                color: 'var(--text-secondary, #b3b3b9)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                <Crown size={12} />
                PRO
              </div>
            </Link>
          )}

          {/* Profile Avatar */}
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--surface-3, #3a3a42)',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'grid',
              placeItems: 'center',
              fontSize: '16px',
              cursor: 'pointer',
              marginLeft: '4px',
            }} title="Go to Profile">
              {profile?.avatarUrl || '🦊'}
            </div>
          </Link>
        </div>
      </header>

      {/* Heart Refill Modal */}
      <Modal isOpen={showRefillModal} onClose={() => setShowRefillModal(false)} title="Refill Hearts">
        <div style={{ textAlign: 'center', padding: '16px 8px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>❤️</span>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Need more hearts to continue learning? Refill them now!
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button
              variant="primary"
              onClick={handleSpendGemsRefill}
              disabled={activeState.gems < 10}
              style={{ width: '100%' }}
            >
              Use 10 Gems (You have {activeState.gems} 💎)
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowRefillModal(false)}
              style={{ width: '100%' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
