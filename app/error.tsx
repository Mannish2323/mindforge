'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    console.error('[Velmorth Error Boundary]', error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B1220',
          color: '#E5E7EB',
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

        {/* Error emoji */}
        <div style={{ fontSize: 48 }}>⚠️</div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: '#E5E7EB',
            margin: 0,
          }}
        >
          Something went wrong
        </h1>

        <div
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: 16,
            color: '#94A3B8',
          }}
        >
          エラーが発生しました
        </div>

        <p style={{ fontSize: 14, color: '#64748B', maxWidth: 360 }}>
          An unexpected error occurred. Our team has been notified.
          Try refreshing the page or return home.
        </p>

        {/* Error digest for debugging */}
        {error.digest && (
          <p style={{ fontSize: 11, color: '#334155', fontFamily: 'monospace' }}>
            Error ID: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={reset}
            style={{
              padding: '12px 24px',
              background: '#16A34A',
              color: 'white',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              background: '#1E293B',
              color: '#E5E7EB',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-block',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            🏠 Go Home
          </Link>
        </div>
      </body>
    </html>
  );
}
