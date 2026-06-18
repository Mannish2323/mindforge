'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errParam = urlParams.get('error');
        const errDesc = urlParams.get('error_description');

        if (errParam) {
          console.error('Auth error from provider:', errParam, errDesc);
          setStatus('error');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }

        if (!code) {
          console.error('No authorization code found in URL search parameters');
          setStatus('error');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }

        // Exchange the code in the URL for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Auth callback error during code exchange:', error);
          setStatus('error');
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          return;
        }
        setStatus('success');
        window.location.href = '/';
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setStatus('error');
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary, #0a1a0f)',
        color: 'var(--text-primary, #e8f5e9)',
        fontFamily: 'Inter, sans-serif',
        gap: '16px',
      }}
    >
      {status === 'loading' && (
        <>
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid rgba(74,222,128,0.2)',
              borderTop: '3px solid #4ade80',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#a7c4aa', fontSize: 14 }}>Signing you in...</p>
        </>
      )}
      {status === 'success' && (
        <p style={{ color: '#4ade80', fontSize: 16 }}>✓ Signed in! Redirecting...</p>
      )}
      {status === 'error' && (
        <p style={{ color: '#ef4444', fontSize: 16 }}>
          Sign-in failed. Redirecting back...
        </p>
      )}
    </div>
  );
}
