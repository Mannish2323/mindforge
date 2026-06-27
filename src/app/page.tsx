'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreenPremium } from '@/components/design-system/SplashScreenPremium';
import { useAuth } from './context/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    if (splashDone) {
      const timer = setTimeout(() => {
        const destination = profile ? '/home' : '/auth';
        router.replace(destination);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [splashDone, profile, router]);

  return <SplashScreenPremium onComplete={() => setSplashDone(true)} />;
}
