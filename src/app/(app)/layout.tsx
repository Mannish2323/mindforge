'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { SplashScreen } from '@/components/ui/SplashScreen';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return <SplashScreen duration={1200} />;
  }

  if (!user) return null;

  return <AppShell>{children}</AppShell>;
}
