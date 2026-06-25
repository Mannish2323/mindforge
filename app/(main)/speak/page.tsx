'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SpeakRoleplay } from '@/components/SpeakRoleplay';
import { AppShell } from '@/components/layout/AppShell';

export default function SpeakPage() {
  const router = useRouter();

  return (
    <AppShell>
      <SpeakRoleplay onBack={() => router.push('/home')} />
    </AppShell>
  );
}
