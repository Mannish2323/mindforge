'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { JobPrepView } from '@/components/JobPrepView';
import { AppShell } from '@/components/layout/AppShell';

export default function JobPrepPage() {
  const router = useRouter();

  return (
    <AppShell>
      <JobPrepView onBack={() => router.push('/home')} />
    </AppShell>
  );
}
