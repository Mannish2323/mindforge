'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { StreakCard } from '../../components/home/StreakCard';
import { WelcomeCard } from '../../components/home/WelcomeCard';
import { ContinueCard } from '../../components/home/ContinueCard';
import { DailyGoalCard } from '../../components/home/DailyGoalCard';
import { MissionsCard } from '../../components/home/MissionsCard';
import { FocusCard } from '../../components/home/FocusCard';
import { LeagueCard } from '../../components/home/LeagueCard';
import { QuickActions } from '../../components/home/QuickActions';
import { BadgesPreview } from '../../components/home/BadgesPreview';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { state, isLoaded } = useStoreContext();
  const { user, profile } = useAuth();
  const router = useRouter();

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
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[120, 200, 100, 150].map((h, i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: `${h}px`, borderRadius: '16px' }} />
          ))}
        </div>
      </AppShell>
    );
  }

  // Daily goal: each lesson = ~10-20 XP. Target 100 XP ≈ 5-7 lessons.
  // goalMinutes is a time setting but XP is the actual trackable unit.
  const goalXp = Math.max(50, (activeState.goalMinutes || 20) * 5);
  const todayXp = (activeState.xp || 0) % goalXp;
  const currentDailyXP = todayXp;
  const todayStudied = currentDailyXP > 0;
  const isNewUser = (activeState.xp || 0) === 0;

  const handleStudyNow = () => {
    router.push('/path');
  };

  const handleNavigate = (tab: string) => {
    router.push(`/${tab}`);
  };

  return (
    <AppShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '16px',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* 1. Start Your Streak Card */}
        <StreakCard
          streak={activeState.streak || 0}
          todayStudied={todayStudied}
          onStudyNow={handleStudyNow}
        />

        {/* 2. Welcome Card */}
        <WelcomeCard
          username={activeState.username || 'Learner'}
          isNewUser={isNewUser}
          onNavigate={handleNavigate}
          onContinueLesson={handleStudyNow}
        />

        {/* 3. Continue Learning Card */}
        <ContinueCard
          isNewUser={isNewUser}
          onContinue={handleStudyNow}
        />

        {/* 4. Daily Goal Progress Card */}
        <DailyGoalCard
          xp={activeState.xp || 0}
          goalXp={goalXp}
        />

        {/* 5. Daily Missions Card */}
        <MissionsCard
          lessonProgress={activeState.lessonProgress || {}}
          dailyReviewsDone={activeState.dailyReviewsDone || 0}
          speakSessionsToday={profile?.speak_sessions || 0}
        />

        {/* 6. Focus of the Day Card */}
        <FocusCard />

        {/* 7. League / Leaderboard Status Card */}
        <LeagueCard
          leagueTier={activeState.leagueTier || 'bronze'}
          weeklyXP={activeState.weeklyXP || 0}
        />

        {/* 8. Quick Actions Row */}
        <QuickActions />

        {/* 9. Recent Badges Row */}
        <BadgesPreview badges={activeState.badges || []} />
      </motion.div>
    </AppShell>
  );
}
