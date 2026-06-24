'use client';

import React from 'react';
import { WritingPracticeView } from '../../components/writing/WritingPracticeView';
import { AppShell } from '../../components/layout/AppShell';

export default function ScriptPage() {
  return (
    <AppShell>
      <WritingPracticeView />
    </AppShell>
  );
}

