'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

function AuthCallbackContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const errParam = searchParams.get('error');
        const errDesc = searchParams.get('error_description');
        const type = searchParams.get('type');
        const next = searchParams.get('next') ?? '/home';

        if (errParam) {
          console.error('Auth error from provider:', errParam, errDesc);
          setStatus('error');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
          return;
        }

        if (!code) {
          console.error('No authorization code found in URL search parameters');
          setStatus('error');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
          return;
        }

        // Exchange the code in the URL for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error('Auth callback error during code exchange:', error);
          setStatus('error');
          setTimeout(() => {
            router.push('/auth/login');
          }, 2000);
          return;
        }
        
        setStatus('success');
        if (type === 'recovery') {
          router.push('/profile?tab=settings&reset=true');
        } else {
          router.push(next);
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setStatus('error');
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, supabase.auth]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg, #0B1E12)',
        color: 'var(--text, #E8F5E9)',
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
          <p style={{ color: 'var(--text-3, #5E7D63)', fontSize: 14 }}>Signing you in...</p>
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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1E12', color: '#E8F5E9' }}>
        Loading...
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
