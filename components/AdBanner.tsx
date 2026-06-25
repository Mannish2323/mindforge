'use client';

import React from 'react';
import { Crown } from 'lucide-react';

/**
 * AdBanner — shown ONLY for Free users.
 * Never renders inside: lesson player, billing, auth, speak recording, review answers.
 * Parent components control whether to mount this (check profile.adsEnabled first).
 */

interface AdBannerProps {
  placement: 'home_footer' | 'lesson_end' | 'dashboard_mid';
  onUpgrade?: () => void;
}

export function AdBanner({ placement, onUpgrade }: AdBannerProps) {
  const isFooter = placement === 'home_footer';
  const isEnd    = placement === 'lesson_end';

  return (
    <div
      id={`ad-banner-${placement}`}
      style={{
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.02)',
        padding: isFooter ? '10px 16px' : '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        margin: isFooter ? '0' : '0 0 var(--sp-4)',
      }}
      role="complementary"
      aria-label="Advertisement"
    >
      {/* Ad slot placeholder — replace this div with AdSense code when ready */}
      <div
        style={{
          flex: 1,
          minWidth: 200,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 18 }}>🎯</span>
        <div>
          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-3)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Advertisement
          </p>
          {/* ── AdSense slot goes here ──
              Replace the div below with your Google AdSense code:
              <ins className="adsbygoogle" data-ad-slot="YOUR_SLOT_ID" ... />
          ── */}
          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-2)',
              fontStyle: 'italic',
            }}
          >
            {isEnd
              ? 'Great job finishing this lesson! 🎉'
              : 'Learn Japanese faster with Velmorth Pro.'}
          </div>
        </div>
      </div>

      {/* Remove ads CTA */}
      {onUpgrade && (
        <button
          id={`btn-remove-ads-${placement}`}
          onClick={onUpgrade}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 'var(--radius)',
            background: 'linear-gradient(135deg, rgba(22,163,74,.15), rgba(22,163,74,.08))',
            border: '1px solid rgba(22,163,74,.3)',
            color: 'var(--primary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Crown size={12} />
          Remove Ads
        </button>
      )}
    </div>
  );
}
