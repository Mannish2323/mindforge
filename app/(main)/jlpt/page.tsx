'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { JlptPrep } from '@/components/JlptPrep';
import { AppShell } from '@/components/layout/AppShell';
import { useStoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export default function JlptPage() {
  const router = useRouter();
  const { state, isLoaded } = useStoreContext();
  const { user, profile } = useAuth();

  const activeState = React.useMemo(() => {
    if (user && profile) {
      return {
        ...state,
        xp: profile.xp,
        gems: profile.leafBalance,
        streak: profile.streak,
        username: profile.name,
        hearts: profile.heartsTotal ?? state.hearts,
        maxHearts: profile.heartsMax ?? state.maxHearts,
        heartsRecoverAt: profile.heartsRecoverAt ?? state.heartsRecoverAt,
        heartRecoveryHours: profile.heartRecoveryHours ?? state.heartRecoveryHours,
      };
    }
    return state;
  }, [state, user, profile]);

  if (!isLoaded) {
    return (
      <AppShell>
        <div style={{ padding: '20px' }} className="skeleton skeleton-card" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <JlptPrep state={activeState} onBack={() => router.push('/home')} />
    </AppShell>
  );
}
