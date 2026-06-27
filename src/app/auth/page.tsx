'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  Apple,
  Github,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, fadeIn, scaleIn } from '@/lib/motion/motion.config';
import Image from 'next/image';

export default function AuthPage() {
  const { loginWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        router.replace('/home');
      } else {
        await signUpWithEmail(email, password, name);
        router.replace('/onboarding');
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  }

  const petals = Array.from({ length: 15 }).map((_, idx) => ({
    id: idx,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${8 + Math.random() * 6}s`,
    scale: 0.5 + Math.random() * 1,
  }));

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 relative overflow-hidden select-none"
      style={{
        background:
          'linear-gradient(135deg, rgb(9, 7, 26) 0%, rgb(14, 11, 34) 50%, rgb(19, 9, 48) 100%)',
      }}
    >
      {/* Animated background elements */}
      <div
        className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent)',
        }}
      />
      <div
        className="absolute -bottom-40 right-[-5%] w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent)',
        }}
      />

      {/* Floating petals */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute text-pink-500"
            initial={{
              left: p.left,
              top: '-20px',
              opacity: 0.3,
              scale: p.scale,
            }}
            animate={{
              top: '100vh',
              rotate: 360,
            }}
            transition={{
              duration: parseFloat(p.duration),
              delay: parseFloat(p.delay),
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.69l3.66 7.41h8.15l-6.59 4.78 2.52 8.12L12 20.82l-6.74 4.18 2.52-8.12-6.59-4.78h8.15L12 2.69z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Left side - Hero */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="hidden lg:flex flex-1 flex-col items-center justify-center gap-8 relative z-10 max-w-md"
      >
        {/* Hero illustration */}
        <div className="relative w-full h-80">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40"
              style={{
                background:
                  'radial-gradient(circle, rgba(124, 58, 237, 0.5), transparent)',
              }}
            />
            <motion.div
              className="relative w-64 h-64"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, linear: true }}
            >
              <svg
                width="256"
                height="256"
                viewBox="0 0 256 256"
                className="w-full h-full"
              >
                {/* Decorative book */}
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="rgba(124, 58, 237, 0.2)"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                />
                <path
                  d="M 80 100 L 80 180 Q 80 200 100 200 L 176 200 Q 200 200 200 180 L 200 100 Z"
                  fill="rgba(200, 196, 255, 0.08)"
                  stroke="rgba(124, 58, 237, 0.4)"
                  strokeWidth="2"
                />
                {/* Pages */}
                <rect
                  x="90"
                  y="110"
                  width="35"
                  height="85"
                  fill="rgba(236, 72, 153, 0.1)"
                  stroke="rgba(236, 72, 153, 0.3)"
                  strokeWidth="1"
                />
                <rect
                  x="131"
                  y="110"
                  width="35"
                  height="85"
                  fill="rgba(124, 58, 237, 0.1)"
                  stroke="rgba(124, 58, 237, 0.3)"
                  strokeWidth="1"
                />
                {/* Kanji */}
                <text
                  x="128"
                  y="160"
                  fontSize="48"
                  fontWeight="900"
                  textAnchor="middle"
                  fill="url(#gradientText)"
                >
                  学
                </text>
                <defs>
                  <linearGradient
                    id="gradientText"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(124, 58, 237, 0.8)" />
                    <stop
                      offset="100%"
                      stopColor="rgba(236, 72, 153, 0.8)"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Benefits */}
        <div className="space-y-4 text-left">
          <h2 className="text-2xl font-black text-white">
            Master Japanese the Smart Way
          </h2>
          <div className="space-y-3">
            {[
              'AI-Powered Lessons',
              'Spaced Repetition Learning',
              'Track Progress & Achievements',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-sm text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right side - Auth Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex-1 w-full max-w-md relative z-10"
      >
        {/* Greeting message */}
        <div className="mb-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-2 justify-center lg:justify-start">
              <Logo size="md" />
              Konnichiwa!
            </h1>
            <p
              className="text-sm"
              style={{ color: 'rgba(167, 139, 250, 0.6)' }}
            >
              {mode === 'login'
                ? 'Welcome back to your Japanese journey'
                : 'Begin your path to fluency'}
            </p>
          </motion.div>
        </div>

        {/* Main auth card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="rounded-2xl backdrop-blur-xl border p-6 sm:p-8 shadow-2xl"
          style={{
            background: 'rgba(17, 12, 30, 0.4)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
          }}
        >
          {/* Mode tabs */}
          <div className="flex gap-2 mb-6 bg-black/30 p-1 rounded-xl">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className="flex-1 py-2 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all"
                style={{
                  background:
                    mode === m
                      ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.6), rgba(236, 72, 153, 0.4))'
                      : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(160, 150, 220, 0.5)',
                }}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Input
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required={mode === 'signup'}
                    leftIcon={<User className="w-4 h-4" />}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-purple-400/60 hover:text-white transition-colors"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{
                      background: 'rgba(124, 58, 237, 0.2)',
                      border: '1px solid rgba(124, 58, 237, 0.4)',
                    }}
                  />
                  <span style={{ color: 'rgba(160, 150, 220, 0.6)' }}>
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => router.push('/reset-password')}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs px-3 py-2 rounded-lg text-red-400"
                style={{ background: 'rgba(239, 68, 68, 0.1)' }}
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm mt-6 flex items-center justify-center gap-2"
              style={{
                background:
                  'linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(219, 39, 119, 0.6))',
                border: '1px solid rgba(124, 58, 237, 0.3)',
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-transparent border-t-white animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(139, 92, 246, 0.1)' }} />
            <span
              className="text-xs font-bold"
              style={{ color: 'rgba(160, 150, 220, 0.4)' }}
            >
              OR CONTINUE WITH
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139, 92, 246, 0.1)' }} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="p-3 rounded-lg border transition-all hover:scale-105"
              style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
              title="Sign in with Google"
            >
              <Chrome className="w-5 h-5 mx-auto text-white" />
            </button>
            <button
              disabled={loading}
              className="p-3 rounded-lg border transition-all hover:scale-105"
              style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
              title="Sign in with Apple"
            >
              <Apple className="w-5 h-5 mx-auto text-white" />
            </button>
            <button
              disabled={loading}
              className="p-3 rounded-lg border transition-all hover:scale-105"
              style={{
                background: 'rgba(139, 92, 246, 0.05)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}
              title="Sign in with GitHub"
            >
              <Github className="w-5 h-5 mx-auto text-white" />
            </button>
          </div>

          {/* Continue as guest */}
          <button
            onClick={() => router.push('/home')}
            className="w-full mt-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              color: 'rgba(167, 139, 250, 0.8)',
              background: 'transparent',
              border: '1px solid rgba(124, 58, 237, 0.2)',
            }}
          >
            Continue as Guest
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-6"
          style={{ color: 'rgba(160, 150, 220, 0.4)' }}
        >
          By continuing, you agree to our{' '}
          <a
            href="/terms"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Terms
          </a>{' '}
          and{' '}
          <a
            href="/privacy"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Privacy Policy
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
