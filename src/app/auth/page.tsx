'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Eye, EyeOff, Sparkles, Mail, Lock, User, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, fadeIn, scaleIn } from '@/lib/motion/motion.config';

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

  // Create an array of petals with randomized left offsets and animation delays
  const petals = Array.from({ length: 12 }).map((_, idx) => ({
    id: idx,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${8 + Math.random() * 6}s`,
    scale: 0.6 + Math.random() * 0.8,
  }));

  return (
    <div className="min-h-screen bg-[#09071a] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background auras */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-900/10 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2.5s' }} />

      {/* Falling Sakura Petals Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {petals.map(p => (
          <div
            key={p.id}
            className="absolute top-[-5%] bg-gradient-to-tr from-pink-300 to-pink-200/80 rounded-full animate-petal-fall"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: `${12 * p.scale}px`,
              height: `${6 * p.scale}px`,
              opacity: 0.45,
              borderRadius: '50% 0 50% 50%',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10 text-center space-y-6">
        {/* Header Branding */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="flex flex-col items-center gap-3.5"
        >
          <Logo size="lg" glow />
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest uppercase bg-gradient-to-r from-purple-100 to-purple-300 bg-clip-text text-transparent">
              Velmorth
            </h1>
            <p className="text-[11px] font-bold text-purple-300/40 uppercase tracking-widest mt-1">
              Sensei at your fingertips
            </p>
          </div>
        </motion.div>

        {/* Auth Glassmorphism Card */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={scaleIn}
          className="bg-[#120f26]/80 border border-purple-800/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-purple-950/40"
        >
          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-[#0a0815] border border-purple-900/10 rounded-2xl mb-6">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  mode === m
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/10'
                    : 'text-purple-300/40 hover:text-purple-200'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'signup' && (
                <motion.div
                  key="signup-name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    label="Display Name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your nickname"
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
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Secret Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="text-purple-400/60 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              }
            />

            {error && (
              <motion.div
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3 rounded-xl text-left"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm mt-2"
            >
              {mode === 'login' ? 'Sign In to Dashboard' : 'Get Started Now'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-purple-900/15" />
            <span className="text-[10px] font-black text-purple-400/35 tracking-widest">OR</span>
            <div className="flex-1 h-px bg-purple-900/15" />
          </div>

          {/* Social Google Login */}
          <Button
            variant="outline"
            disabled={loading}
            onClick={handleGoogle}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-transparent border border-purple-900/20 hover:bg-purple-900/5 text-purple-200 transition-colors flex items-center justify-center gap-2.5"
            leftIcon={<Chrome className="w-4 h-4 text-purple-400" />}
          >
            Continue with Google
          </Button>
        </motion.div>

        {/* Footer legal disclaimer */}
        <p className="text-[10px] text-purple-300/25 leading-normal max-w-xs mx-auto">
          By registering, you agree to Velmorth&apos;s{' '}
          <a href="/terms" className="hover:underline text-purple-300/40">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="hover:underline text-purple-300/40">
            Privacy Policy
          </a>.
        </p>
      </div>
    </div>
  );
}
