'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ScriptLab } from '../../components/ScriptLab';
import { AppShell } from '../../components/layout/AppShell';

export default function ScriptPage() {
  const router = useRouter();

  return (
    <AppShell>
      <ScriptLab onBack={() => router.push('/home')} />
    </AppShell>
  );
}
