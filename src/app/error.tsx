'use client';

import { useEffect } from 'react';
import React from 'react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle decorative blurs */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-cat-pink-light/30 blur-[100px] pointer-events-none top-1/3 left-1/4" />
      <div className="absolute w-[30vw] h-[30vw] rounded-full bg-cat-purple-light/30 blur-[80px] pointer-events-none bottom-1/4 right-1/4" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-center space-y-6 z-10 max-w-md"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mx-auto w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center"
        >
          <span className="text-4xl">😅</span>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-ink font-heading">Oops! Something went wrong.</h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            Don&apos;t worry — your progress is safely saved. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
          <a href="/home">
            <Button variant="ghost" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </a>
        </div>

        {error.digest && (
          <p className="text-[10px] text-ink-light font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
