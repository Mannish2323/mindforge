'use client';

import React, { useEffect, useState } from 'react';
import { Crown, Check, X, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── 24h cooldown ──────────────────────────────────────────────────────────
const COOLDOWN_KEY = 'velmorth_premium_modal_closed';
const COOLDOWN_MS  = 24 * 60 * 60 * 1000; // 24 hours

function shouldShowModal(): boolean {
  try {
    const ts = localStorage.getItem(COOLDOWN_KEY);
    if (!ts) return true;
    return Date.now() - parseInt(ts, 10) > COOLDOWN_MS;
  } catch { return true; }
}

function recordDismiss() {
  try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch {}
}
// ───────────────────────────────────────────────────────────────────────────

const PERKS = [
  'Unlimited AI conversation sessions',
  'JLPT N5 → N1 all lesson packs',
  'Offline mode & downloadable content',
  'Unlimited hearts & no daily limit',
  'Priority support & early features',
  'Custom streak goals & reminders',
];

interface PremiumModalProps {
  onClose: () => void;
  onUpgrade?: () => void;    // Navigate to BillingView
  featureName?: string;      // Name of locked feature that was tapped
}

declare global {
  interface Window { Razorpay: any; }
}

export function PremiumModal({ onClose, onUpgrade, featureName }: PremiumModalProps) {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Only show if cooldown has passed ──
  useEffect(() => {
    if (shouldShowModal()) {
      setVisible(true);
    } else {
      onClose(); // cooldown active — silently dismiss
    }
  }, [onClose]);

  const handleClose = () => {
    recordDismiss(); // start 24h cooldown
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpgrade = () => {
    handleClose();
    if (onUpgrade) onUpgrade();
  };

  if (!visible) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-modal-title"
    >
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 440 }}
      >
        {/* ── Always-visible close button ── */}
        <button
          id="btn-premium-modal-close"
          className="modal-close"
          onClick={handleClose}
          aria-label="Close upgrade prompt"
        >
          <X size={18} />
        </button>

        {/* ── Header ── */}
        <div className="premium-modal-header">
          <span className="premium-modal-icon">👑</span>
          <h2 id="premium-modal-title" style={{ fontWeight: 900, fontSize: 'var(--text-xl)', marginBottom: 4 }}>
            {featureName ? `Unlock ${featureName}` : 'Upgrade to Pro'}
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: 'var(--text-sm)' }}>
            Get full access to everything Velmorth has to offer
          </p>
        </div>

        {/* ── Perks ── */}
        <div className="premium-modal-features">
          {PERKS.map(perk => (
            <div key={perk} className="premium-feature-item">
              <span className="premium-feature-icon">
                <Check size={16} style={{ color: 'var(--primary)' }} />
              </span>
              <span className="premium-feature-text">{perk}</span>
            </div>
          ))}
        </div>

        {/* ── Pricing hint ── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(22,163,74,.12), rgba(22,163,74,.05))',
          border: '1px solid rgba(22,163,74,.25)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--sp-4)',
          textAlign: 'center',
          marginBottom: 'var(--sp-4)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--sp-6)', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--primary)' }}>₹199</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)' }}>/month</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-3)' }}>or</div>
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--xp-gold)' }}>₹999</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--xp-gold)' }}>/year — Save 58%</div>
            </div>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="error-banner" role="alert" style={{ marginBottom: 'var(--sp-3)' }}>
            <AlertCircle size={14} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ── CTA ── */}
        <button
          id="btn-upgrade-now"
          className="btn-primary"
          onClick={handleUpgrade}
          disabled={loading}
          style={{ gap: 'var(--sp-2)', fontSize: 'var(--text-base)', padding: '14px var(--sp-6)' }}
        >
          <Crown size={18} />
          {loading ? 'Loading...' : 'View All Plans'}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: 11,
          color: 'var(--text-3)',
          marginTop: 'var(--sp-3)',
        }}>
          🔒 Secured by Razorpay · Cancel anytime · 7-day refund policy
        </p>
      </div>
    </div>
  );
}
