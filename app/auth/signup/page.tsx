'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { AuthView } from '@/components/AuthView';

export default function SignupPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Belt-and-suspenders client-side redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.replace('/home');
    }
  }, [user, loading, router]);

  if (loading || user) return null;

  return <AuthView initialMode="signup" />;
}
