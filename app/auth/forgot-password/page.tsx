'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { AlertCircle, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?type=recovery`
          : undefined,
      });
      if (resetError) throw resetError;
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card page-enter">
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-mark">V</div>
          <span className="logo-text">Learn with Velmorth</span>
        </div>

        {sent ? (
          /* ── Success State ── */
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(22,163,74,0.12)', border: '2px solid rgba(22,163,74,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle2 size={32} style={{ color: 'var(--primary, #16a34a)' }} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>Check your inbox</h1>
            <p style={{ color: 'var(--text-2, #94a3b8)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              We&apos;ve sent a password reset link to<br />
              <strong style={{ color: 'var(--text, #e5e7eb)' }}>{email}</strong>
            </p>
            <p style={{ color: 'var(--text-3, #64748b)', fontSize: '12px', marginBottom: '24px' }}>
              Didn&apos;t receive it? Check your spam folder or wait a few minutes.
            </p>
            <Link
              href="/auth/login"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                padding: '12px', borderRadius: '12px', background: 'var(--surface-2, #1e293b)',
                color: 'var(--text, #e5e7eb)', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
              }}
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Request Form ── */
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(22,163,74,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Mail size={26} style={{ color: 'var(--primary, #16a34a)' }} />
              </div>
            </div>
            <h1>Forgot password?</h1>
            <p className="auth-sub">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            {error && (
              <div className="error-banner" role="alert">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="fp-email">Email Address</label>
              <input
                id="fp-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
              <button
                id="btn-reset-password"
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? <><span className="loader-sm loader-inline" /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-footer">
              Remember it?{' '}
              <Link
                href="/auth/login"
                style={{ color: 'var(--primary, #16a34a)', fontWeight: 700, textDecoration: 'none' }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
