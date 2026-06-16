'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, AlertCircle, Sparkles } from 'lucide-react';

export function AuthView() {
  const { loginWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      padding: 'var(--space-4)',
      paddingBottom: 'var(--space-8)'
    }} className="page-enter">
      <div className="card-glass" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-6)',
        width: '100%',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(22, 163, 74, 0.1)',
            color: 'var(--green-400)',
            marginBottom: 'var(--space-3)'
          }}>
            <Sparkles size={24} />
          </div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>Welcome to Velmorth</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isSignUp ? 'Create an account to track your progress' : 'Log in to continue your learning path'}
          </p>
        </div>

        {/* Google Sign-In — shown first for prominence */}
        <button
          id="btn-google-signin"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '11px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: 'var(--space-4)',
            transition: 'background 0.2s'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          color: 'var(--text-muted)',
          fontSize: '11px'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          <span style={{ padding: '0 10px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
          marginBottom: 'var(--space-4)',
          border: '1px solid var(--border)'
        }}>
          <button
            id="tab-signin"
            onClick={() => { setIsSignUp(false); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: !isSignUp ? 'var(--green-500)' : 'transparent',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            id="tab-register"
            onClick={() => { setIsSignUp(true); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: isSignUp ? 'var(--green-500)' : 'transparent',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--red)',
              color: '#f87171',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {isSignUp && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Display Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  id="input-name"
                  type="text"
                  placeholder="e.g. Manish"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.2)',
                    color: '#fff',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                id="input-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'rgba(0,0,0,0.2)',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                id="input-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'rgba(0,0,0,0.2)',
                  color: '#fff',
                  fontSize: '13px'
                }}
              />
            </div>
          </div>

          <button
            id="btn-email-submit"
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--green-500)',
              color: '#fff',
              border: 'none',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              marginTop: 'var(--space-2)'
            }}
          >
            {loading ? 'Processing...' : isSignUp ? '🚀 Create Account' : '✓ Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
