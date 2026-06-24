'use client';

import React from 'react';
import { AppShell } from '../../components/layout/AppShell';
import { BillingView } from '../../components/BillingView';

export default function BillingPage() {
  return (
    <AppShell>
      <BillingView />
    </AppShell>
  );
}
