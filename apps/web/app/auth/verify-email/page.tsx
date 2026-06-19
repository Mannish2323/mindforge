'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck, ArrowLeft } from 'lucide-react';

function VerifyEmailInner() {
  const params = useSearchParams();
  const email = params.get('email') || 'your email';

  return (
    <div className="auth-page">
      <div className="auth-card page-enter" style={{ textAlign: 'center' }}>
        {/* Logo */}
        <div className="auth-logo" style={{ justifyContent: 'center' }}>
          <div className="logo-mark">V</div>
          <span className="logo-text">Learn with Velmorth</span>
        </div>

        {/* Icon */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(22,163,74,0.12)', border: '2px solid rgba(22,163,74,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '8px auto 20px',
        }}>
          <MailCheck size={36} style={{ color: 'var(--primary, #16a34a)' }} />
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '10px' }}>Verify your email</h1>
        <p style={{ color: 'var(--text-2, #94a3b8)', fontSize: '14px', lineHeight: 1.7, marginBottom: '8px' }}>
          A confirmation link was sent to
        </p>
        <p style={{ fontWeight: 700, color: 'var(--text, #e5e7eb)', fontSize: '15px', marginBottom: '20px', wordBreak: 'break-all' }}>
          {email}
        </p>
        <p style={{ color: 'var(--text-3, #64748b)', fontSize: '12px', lineHeight: 1.7, marginBottom: '28px' }}>
          Click the link in your inbox to activate your account.<br />
          Check your spam folder if you don&apos;t see it within a few minutes.
        </p>

        <Link
          href="/auth/login"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '13px', borderRadius: '12px',
            background: 'var(--primary, #16a34a)', color: '#fff',
            textDecoration: 'none', fontWeight: 700, fontSize: '14px',
            marginBottom: '12px',
          }}
        >
          Back to Sign In
        </Link>
        <Link
          href="/"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            color: 'var(--text-3, #64748b)', textDecoration: 'none', fontSize: '13px',
          }}
        >
          <ArrowLeft size={14} /> Go to Home
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ color: 'var(--text-2)' }}>Loading...</div>
        </div>
      </div>
    }>
      <VerifyEmailInner />
    </Suspense>
  );
}
