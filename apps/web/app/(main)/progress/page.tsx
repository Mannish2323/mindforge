'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { ProgressDashboard } from '../../components/dashboard/ProgressDashboard';

export default function ProgressPage() {
  return (
    <AppShell>
      <ProgressDashboard />
    </AppShell>
  );
}
