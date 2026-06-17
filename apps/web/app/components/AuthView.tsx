'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const AVATARS = ['🐼', '🦊', '🐸', '🐺', '🦁', '🐻', '🐯', '🦉'];
const GOALS = [
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '20 min', value: 20 },
  { label: '30 min', value: 30 },
];

type SignupStep = 1 | 2 | 3;

export function AuthView() {
  const { loginWithEmail, signUpWithEmail, signInWithGoogle, signUpStep2, signUpStep3 } = useAuth();
  const [mode, setMode]     = useState<'login' | 'signup'>('login');
  const [step, setStep]     = useState<SignupStep>(1);
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Login fields
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  // Signup step 1
  const [sEmail,    setSEmail]    = useState('');
  const [sPassword, setSPassword] = useState('');

  // Signup step 2
  const [username,     setUsername]     = useState('');
  const [displayName,  setDisplayName]  = useState('');
  const [avatar,       setAvatar]       = useState('🦊');

  // Signup step 3
  const [goalMinutes, setGoalMinutes] = useState(10);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError(err.message || 'Sign-in failed. Check your email and password.');
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

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sEmail || !sPassword) { setError('Please fill in all fields.'); return; }
    if (sPassword.length < 8)  { setError('Password must be at least 8 characters.'); return; }
    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(sEmail, sPassword, displayName || sEmail.split('@')[0]);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Sign-up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) { setError('Please enter a display name.'); return; }
    setError(null);
    setLoading(true);
    try {
      await signUpStep2(username || displayName.toLowerCase().replace(/[^a-z0-9_]/g, ''), displayName, avatar);
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Profile setup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpStep3(goalMinutes);
      setStep(1);
    } catch (err: any) {
      setError(err.message || 'Goal setup failed.');
    } finally {
      setLoading(false);
    }
  };

  const GoogleSVG = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );

  // ── LOGIN SCREEN ──
  const renderLogin = () => (
    <div className="auth-page">
      <div className="auth-card page-enter">
        <div className="auth-logo">
          <div className="logo-mark">V</div>
          <span className="logo-text">Learn with Velmorth</span>
        </div>
        <h1>Welcome back</h1>
        <p className="auth-sub">Sign in to continue your Japanese journey</p>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <button
          id="btn-google-signin"
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
          aria-label="Continue with Google"
        >
          <GoogleSVG /> Continue with Google
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleLogin} noValidate>
          <label htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
            style={{ marginBottom: 'var(--sp-1)' }}
          />
          <div style={{ textAlign: 'right', marginTop: 'var(--sp-1)' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setError('Password reset: check your email for instructions.')}
            >
              Forgot password?
            </button>
          </div>
          <button
            id="btn-email-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? <><span className="loader-sm loader-inline" /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'var(--text-sm)' }}
            onClick={() => { setMode('signup'); setError(null); setStep(1); }}
          >
            Create account
          </button>
        </p>
      </div>
    </div>
  );

  // ── SIGNUP STEP 1: Credentials ──
  const renderSignupStep1 = () => (
    <div className="auth-page">
      <div className="auth-card page-enter">
        <div className="auth-logo">
          <div className="logo-mark">V</div>
          <span className="logo-text">Learn with Velmorth</span>
        </div>
        <div className="step-dots" role="list" aria-label="Step 1 of 3">
          <div className="step-dot active" role="listitem" aria-label="Step 1: Credentials (current)" />
          <div className="step-dot" role="listitem" aria-label="Step 2: Profile" />
          <div className="step-dot" role="listitem" aria-label="Step 3: Goal" />
        </div>
        <h1>Create account</h1>
        <p className="auth-sub">Step 1 of 3 — Your credentials</p>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <button
          id="btn-google-signup"
          className="btn-google"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleSVG /> Sign up with Google
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleSignupStep1} noValidate>
          <label htmlFor="signup-email">Email Address</label>
          <input
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            value={sEmail}
            onChange={e => setSEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Min. 8 characters"
            value={sPassword}
            onChange={e => setSPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={8}
            disabled={loading}
          />
          <button
            id="btn-signup-step1"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? <><span className="loader-sm loader-inline" /> Creating account...</> : 'Continue →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <button
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0, fontSize: 'var(--text-sm)' }}
            onClick={() => { setMode('login'); setError(null); }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );

  // ── SIGNUP STEP 2: Username + Avatar ──
  const renderSignupStep2 = () => (
    <div className="auth-page">
      <div className="auth-card page-enter">
        <div className="auth-logo">
          <div className="logo-mark">V</div>
          <span className="logo-text">Learn with Velmorth</span>
        </div>
        <div className="step-dots" role="list" aria-label="Step 2 of 3">
          <div className="step-dot done" role="listitem" />
          <div className="step-dot active" role="listitem" aria-label="Step 2: Profile (current)" />
          <div className="step-dot" role="listitem" />
        </div>
        <h1>Your profile</h1>
        <p className="auth-sub">Step 2 of 3 — Choose your identity</p>

        {error && (
          <div className="error-banner" role="alert">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignupStep2} noValidate>
          <label>Pick an avatar</label>
          <div className="avatar-picker">
            {AVATARS.map(a => (
              <button
                key={a}
                type="button"
                className={`avatar-option${avatar === a ? ' selected' : ''}`}
                onClick={() => setAvatar(a)}
                aria-label={`Avatar ${a}`}
                aria-pressed={avatar === a}
              >
                {a}
              </button>
            ))}
          </div>

          <label htmlFor="display-name">Display Name</label>
          <input
            id="display-name"
            type="text"
            placeholder="e.g. Manish"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
            autoComplete="name"
          />

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="e.g. manish_jp"
            value={username}
            onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            maxLength={30}
            autoComplete="username"
          />
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-3)', marginTop: 4 }}>
            Lowercase letters, numbers, and underscores only
          </p>

          <button type="submit" className="btn-primary">
            Continue →
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStep(1)}
            style={{ marginTop: 'var(--sp-2)' }}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );

  // ── SIGNUP STEP 3: Daily Goal ──
  const renderSignupStep3 = () => (
    <div className="auth-page">
      <div className="auth-card page-enter">
        <div className="auth-logo">
          <div className="logo-mark">V</div>
          <span className="logo-text">Learn with Velmorth</span>
        </div>
        <div className="step-dots" role="list" aria-label="Step 3 of 3">
          <div className="step-dot done" role="listitem" />
          <div className="step-dot done" role="listitem" />
          <div className="step-dot active" role="listitem" aria-label="Step 3: Goal (current)" />
        </div>
        <h1>Set your daily goal</h1>
        <p className="auth-sub">Step 3 of 3 — How long do you want to study each day?</p>

        <form onSubmit={handleSignupStep3} noValidate>
          <label>Study time per day</label>
          <div className="chip-group" role="radiogroup" aria-label="Daily goal">
            {GOALS.map(g => (
              <button
                key={g.value}
                type="button"
                className={`chip${goalMinutes === g.value ? ' active' : ''}`}
                onClick={() => setGoalMinutes(g.value)}
                role="radio"
                aria-checked={goalMinutes === g.value}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div style={{
            margin: 'var(--sp-5) 0',
            padding: 'var(--sp-4)',
            background: 'var(--primary-light)',
            border: '1px solid rgba(22,163,74,.3)',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, color: 'var(--primary)' }}>
              {goalMinutes}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-2)', marginTop: 2 }}>
              minutes per day
            </div>
          </div>

          <button type="submit" className="btn-primary" id="btn-signup-complete">
            🎉 Start Learning!
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setStep(2)}
            style={{ marginTop: 'var(--sp-2)' }}
          >
            ← Back
          </button>
        </form>
      </div>
    </div>
  );

  if (mode === 'login') return renderLogin();
  if (step === 1) return renderSignupStep1();
  if (step === 2) return renderSignupStep2();
  return renderSignupStep3();
}
