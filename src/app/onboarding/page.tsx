'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { useState } from 'react';
import { OnboardingFlow } from '@/components/design-system/OnboardingFlow';

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfileDetails, updateSettings } = useAuth();
  const { setGoalMinutes } = useStore();
  const [loading, setLoading] = useState(false);

  const handleComplete = async (data: {
    name: string;
    goal: number;
    jlptTarget: string;
  }) => {
    setLoading(true);
    try {
      await updateProfileDetails(
        data.name,
        profile?.bio || '',
        profile?.avatarUrl || '🦊'
      );

      await updateSettings({
        goal_minutes: data.goal,
        jlpt_target: data.jlptTarget,
      });

      setGoalMinutes(data.goal);

      router.replace('/home');
    } catch (err) {
      console.error('Onboarding error:', err);
      router.replace('/home');
    } finally {
      setLoading(false);
    }
  };

  return <OnboardingFlow onComplete={handleComplete} isLoading={loading} />;
}
