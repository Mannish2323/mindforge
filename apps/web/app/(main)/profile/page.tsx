'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppShell } from '../../components/layout/AppShell';
import { ProfileTab } from '../../components/profile/ProfileTab';
import { SettingsTab } from '../../components/profile/SettingsTab';

function ProfilePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'settings' ? 'settings' : 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(initialTab);

  // Sync tab state when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'settings') {
      setActiveTab('settings');
    } else if (tabParam === 'profile') {
      setActiveTab('profile');
    }
  }, [searchParams]);

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      
      {/* Tab switcher header with sliding underline */}
      <div style={{
        display: 'flex',
        position: 'relative',
        borderBottom: '1px solid var(--border-strong, #2d2d34)',
        marginBottom: '20px',
      }}>
        <button
          onClick={() => {
            setActiveTab('profile');
            router.push('/profile?tab=profile');
          }}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '12px 0',
            fontWeight: 800,
            fontSize: '15px',
            color: activeTab === 'profile' ? 'var(--primary, #ff9800)' : 'var(--text-secondary, #b3b3b9)',
            cursor: 'pointer',
            outline: 'none',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Profile
        </button>
        <button
          onClick={() => {
            setActiveTab('settings');
            router.push('/profile?tab=settings');
          }}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            padding: '12px 0',
            fontWeight: 800,
            fontSize: '15px',
            color: activeTab === 'settings' ? 'var(--primary, #ff9800)' : 'var(--text-secondary, #b3b3b9)',
            cursor: 'pointer',
            outline: 'none',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Settings
        </button>
        {/* Sliding Underline Indicator using CSS transition */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '50%',
          height: '2px',
          background: 'var(--primary, #ff9800)',
          transform: activeTab === 'profile' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 200ms ease',
        }} />
      </div>

      {/* Tab Content rendering */}
      <div>
        {activeTab === 'profile' ? (
          <ProfileTab onNavigateToBilling={() => router.push('/billing')} />
        ) : (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AppShell>
      <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading profile...</div>}>
        <ProfilePageInner />
      </Suspense>
    </AppShell>
  );
}
