'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg, #0B1220)',
        color: 'var(--text, #E5E7EB)',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '24px',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #16A34A, #4ade80)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontWeight: 900,
          color: 'white',
          boxShadow: '0 8px 32px rgba(22,163,74,0.3)',
          marginBottom: 8,
        }}
      >
        V
      </div>

      {/* 404 Japanese */}
      <div
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 48,
          fontWeight: 900,
          background: 'linear-gradient(135deg, #16A34A, #4ade80)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}
      >
        404
      </div>

      <div
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          color: '#94A3B8',
        }}
      >
        ページが見つかりません
      </div>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>
        Pēji ga mitsukarimasen — Page not found
      </p>

      <p style={{ fontSize: 14, color: '#94A3B8', maxWidth: 360 }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to learning Japanese!
      </p>

      <Link
        href="/"
        style={{
          marginTop: 8,
          padding: '13px 32px',
          background: '#16A34A',
          color: 'white',
          borderRadius: 12,
          fontWeight: 700,
          fontSize: 15,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          transition: 'background 0.15s ease',
        }}
      >
        🏠 Go Home
      </Link>
    </div>
  );
}
