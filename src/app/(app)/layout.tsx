'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

function LoadingScreen() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0B0717] flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <Logo size={80} glow={true} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-3"
      >
        <span className="font-orbitron text-lg font-bold text-white tracking-wider">
          MindForge
        </span>
        {/* Animated loading bar */}
        <div className="w-32 h-1 rounded-full overflow-hidden bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-pink to-accent-magenta"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) return null;

  return <AppShell>{children}</AppShell>;
}
