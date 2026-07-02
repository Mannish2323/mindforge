'use client';

import { useEffect, useState } from 'react';
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
    <div className="min-h-screen min-h-[100dvh] bg-[#0B0717] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-rose-500/5 blur-[100px] pointer-events-none top-1/3 left-1/4" />
      <div className="absolute w-[30vw] h-[30vw] rounded-full bg-neon-purple/5 blur-[80px] pointer-events-none bottom-1/4 right-1/4" />

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
          className="mx-auto w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Something went wrong</h1>
          <p className="text-sm text-purple-300/40 leading-relaxed">
            We encountered an unexpected error. Don&apos;t worry — your progress is safely saved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} className="btn btn-primary" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Try Again
          </Button>
          <a href="/home">
            <Button variant="ghost" className="btn btn-ghost w-full" leftIcon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </a>
        </div>

        {error.digest && (
          <p className="text-[10px] text-purple-300/15 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
