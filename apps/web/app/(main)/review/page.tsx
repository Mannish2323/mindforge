'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMotionValue, useTransform } from 'framer-motion';
import { useStoreContext } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { speakText } from '@evlo/utils';
import { Button } from '@evlo/ui';
import { ReviewEmpty } from '../../components/review/ReviewEmpty';
import { ReviewCard } from '../../components/review/ReviewCard';

export default function ReviewPage() {
  const router = useRouter();
  const { state, isLoaded, handleSRSCardUpdate } = useStoreContext();
  const { user, profile } = useAuth();

  const activeState = React.useMemo(() => {
    if (user && profile) {
      return {
        ...state,
        srsData: state.srsData || {},
      };
    }
    return state;
  }, [state, user, profile]);

  const cards = React.useMemo(() => {
    return Object.values(activeState.srsData || {}).filter(
      (c: any) => new Date(c.dueDate) <= new Date()
    );
  }, [activeState.srsData]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  // Drag animations
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  const cardBorderColor = useTransform(x, [-100, 0, 100], ['#ef4444', '#2d2d34', '#4caf50']);

  const currentCard = cards[activeIdx];

  const handleFlip = () => {
    setFlipped(!flipped);
    if (!flipped && currentCard) {
      speakText(currentCard.kanji, 'ja-JP');
    }
  };

  const handleRating = (quality: number) => {
    if (!currentCard) return;

    handleSRSCardUpdate(currentCard, quality);
    setReviewCount((prev) => prev + 1);
    setFlipped(false);
    x.set(0);

    const nextIdx = activeIdx + 1;
    if (nextIdx < cards.length) {
      setActiveIdx(nextIdx);
    } else {
      setSessionDone(true);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (!flipped) return; // Only allow swipe-rating when card is flipped

    if (info.offset.x > 120) {
      // Swiped right -> Easy/Correct
      handleRating(2);
    } else if (info.offset.x < -120) {
      // Swiped left -> Hard/Incorrect
      handleRating(0);
    }
  };

  const motivationTexts = [
    "Consistency is the key to mastering Japanese!",
    "Every card you review brings you closer to fluency.",
    "Your brain is forming new neural connections right now!",
    "Outstanding progress! Velmorth is proud of you.",
  ];

  const randomMotivation = React.useMemo(() => {
    return motivationTexts[new Date().getDay() % motivationTexts.length];
  }, []);

  if (!isLoaded) {
    return (
      <AppShell>
        <div style={{ padding: '20px' }} className="skeleton skeleton-card" />
      </AppShell>
    );
  }

  // No cards due or session complete
  if (cards.length === 0 || sessionDone) {
    return (
      <AppShell>
        <ReviewEmpty
          reviewCount={reviewCount}
          onBackToHome={() => router.push('/home')}
          motivationText={randomMotivation}
        />
      </AppShell>
    );
  }

  // Not started yet
  if (!sessionStarted) {
    return (
      <AppShell>
        <div style={{ padding: '16px', maxWidth: '440px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '16px' }}>🧠 Spaced Repetition Review</h2>
          <div className="card" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(255, 152, 0, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}>
              🔁
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 900, fontSize: '20px' }}>Cards Due Today: {cards.length}</h3>
              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', lineHeight: 1.5 }}>
                Keep your vocabulary fresh by completing your scheduled spaced repetition reviews.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setSessionStarted(true)}
              style={{ width: '100%', marginTop: '8px' }}
            >
              Start Review Session
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ReviewCard
        card={currentCard}
        flipped={flipped}
        onFlip={handleFlip}
        onSpeak={(text) => speakText(text, 'ja-JP')}
        onRating={handleRating}
        x={x}
        rotate={rotate}
        opacity={opacity}
        cardBorderColor={cardBorderColor}
        handleDragEnd={handleDragEnd}
        activeIdx={activeIdx}
        totalCards={cards.length}
      />
    </AppShell>
  );
}
