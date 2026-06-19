'use client';

import React from 'react';
import { AppShell } from '../components/layout/AppShell';
import { AdminView } from '../components/AdminView';

export default function AdminPage() {
  return (
    <AppShell>
      <AdminView />
    </AppShell>
  );
}
