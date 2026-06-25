'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreContext } from '../../../context/StoreContext';
import { useAuth } from '../../../context/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { speakText } from '@evlo/utils';
import confetti from 'canvas-confetti';
import { LessonPlayer } from '@/components/learn/LessonPlayer';
import { useProgress } from '@/hooks/useProgress';
import { useVocabProgress } from '@/hooks/useVocabProgress';
import { useAchievements } from '@/hooks/useAchievements';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';

interface LessonClientProps {
  lessonId: string;
}

export default function LessonClient({ lessonId }: LessonClientProps) {
  const router = useRouter();
  const { state, completeLesson: completeLocalLesson, loseHeart, refillHearts } = useStoreContext();
  const { user, profile, updateProfileStats, updateHearts } = useAuth();
  const { completeLesson: saveProgress, updateLessonProgress } = useProgress();
  const { markWordsBulk } = useVocabProgress();
  const { checkAchievements } = useAchievements();
  const { enqueue, flush } = useOfflineQueue();

  const [lesson, setLesson] = useState<any>(null);
  const [unitId, setUnitId] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [lessonTimeStart, setLessonTimeStart] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<string[]>([]);
  const wordIdsRef = useRef<string[]>([]);
  const progressSavedRef = useRef(false);

  // Animations & Floating badges
  const [showXPBadge, setShowXPBadge] = useState(false);
  const [showHeartDeduct, setShowHeartDeduct] = useState(false);
  const [isCardShaking, setIsCardShaking] = useState(false);

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

  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch('/data/config/units_index.json');
        const indexData = await res.json();

        let foundLesson: any = null;
        let foundUnitId: string = '';

        for (const unit of indexData.units) {
          const ures = await fetch(`/data/lessons/${unit.unit_id}.json`);
          const unitData = await ures.json();
          const les = unitData.lessons.find((l: any) => l.lesson_id === lessonId);
          if (les) {
            foundLesson = les;
            foundUnitId = unit.unit_id;
            break;
          }
        }

        if (foundLesson) {
          setLesson(foundLesson);
          setUnitId(foundUnitId);
          setLessonTimeStart(Date.now());
          // Collect word IDs from vocabulary for progress tracking
          const vocabIds = (foundLesson.vocabulary || []).map((v: any) => v.kanji || v.id || v.word_id).filter(Boolean);
          wordIdsRef.current = vocabIds;
          // Mark lesson as in_progress
          if (user) {
            updateLessonProgress({ lessonId, completionPercentage: 0, timeSeconds: 0 });
          }

          // Build Questions
          const vocab = foundLesson.vocabulary || [];
          const qs: any[] = [];

          vocab.forEach((v: any, i: number) => {
            // Q1: Translate meaning
            qs.push({
              type: 'mcq-meaning',
              prompt: 'What does this mean?',
              japanese: v.kanji,
              romaji: v.romaji,
              correct: v.meaning_en,
              meaning_hi: v.meaning_hi,
              notes: v.notes,
              options: shuffle([
                v.meaning_en,
                ...shuffle(vocab.filter((_: any, idx: number) => idx !== i).map((x: any) => x.meaning_en)).slice(0, 3)
              ])
            });

            // Q2: Pick Japanese
            qs.push({
              type: 'mcq-japanese',
              prompt: 'How do you say this in Japanese?',
              english: v.meaning_en,
              correct: v.kanji,
              meaning_hi: v.meaning_hi,
              notes: v.notes,
              options: shuffle([
                v.kanji,
                ...shuffle(vocab.filter((_: any, idx: number) => idx !== i).map((x: any) => x.kanji)).slice(0, 3)
              ]),
              optionsRomaji: vocab.map((x: any) => x.romaji)
            });

            // Q3: Fill in the blank (romaji/meaning based)
            qs.push({
              type: 'fill-blank',
              japanesePrompt: `${v.kanji} (___)`,
              correct: v.romaji.toLowerCase(),
              japanese: v.kanji,
              english: v.meaning_en,
              meaning_hi: v.meaning_hi,
              notes: v.notes
            });

            // Q4: Speak and Match (Pro simulation)
            qs.push({
              type: 'speak-match',
              japanese: v.kanji,
              romaji: v.romaji,
              correct: v.kanji,
              meaning_hi: v.meaning_hi,
              notes: v.notes
            });
          });

          // Add sentence translation
          if (foundLesson.grammar_point && foundLesson.examples?.length > 0) {
            const ex = foundLesson.examples[0];
            qs.push({
              type: 'translate',
              prompt: 'Translate this sentence:',
              japanese: ex.japanese,
              romaji: ex.romaji,
              correct: ex.translation_en,
              meaning_hi: ex.translation_hi,
              notes: ex.context_note,
              options: shuffle([
                ex.translation_en,
                'Excuse me, where is the station?',
                'Good morning, nice to meet you.',
                'Please write your name here.',
                'Japanese is fun and easy to learn!'
              ].filter(x => x !== ex.translation_en).slice(0, 3).concat(ex.translation_en))
            });
          }

          // Add listening
          if (vocab.length >= 2) {
            const listenVocab = vocab[Math.floor(Math.random() * vocab.length)];
            const distractors = shuffle(vocab.filter((v2: any) => v2.kanji !== listenVocab.kanji)).slice(0, 3);
            qs.push({
              type: 'listen-pick',
              prompt: 'Listen and choose the correct word:',
              listenText: listenVocab.kanji,
              correct: listenVocab.kanji,
              meaning_hi: listenVocab.meaning_hi,
              notes: listenVocab.notes,
              options: shuffle([listenVocab, ...distractors]),
            });
          }

          // Add Match the Pair
          if (vocab.length >= 3) {
            const leftOptions = shuffle(vocab.map((x: any) => x.kanji)).slice(0, 3);
            const matches: Record<string, string> = {};
            leftOptions.forEach((k: string) => {
              const item = vocab.find((x: any) => x.kanji === k);
              if (item) matches[k] = item.meaning_en;
            });
            const rightOptions = shuffle(Object.values(matches));
            
            // Build vocabulary list for match pair explanation
            const listHi = leftOptions.map(k => {
              const item = vocab.find((x: any) => x.kanji === k);
              return item ? `${k}: ${item.meaning_en} (${item.meaning_hi || ''})` : '';
            }).filter(Boolean).join(' | ');

            qs.push({
              type: 'match-pair',
              leftOptions,
              rightOptions,
              matches,
              correct: JSON.stringify(matches),
              meaning_hi: 'जोड़े मिलाएं',
              notes: `Matches: ${listHi}`
            });
          }

          setQuestions(shuffle(qs).slice(0, 5)); // 5 questions session
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [lessonId]);

  const playTTS = (text: string) => {
    if (state.ttsEnabled) {
      speakText(text, 'ja-JP');
    }
  };

  const handleLoseHeart = async () => {
    loseHeart();
    setShowHeartDeduct(true);
    setTimeout(() => setShowHeartDeduct(false), 600);

    if (user && profile) {
      const currentHearts = profile.heartsTotal ?? 25;
      const newHearts = Math.max(0, currentHearts - 1);
      let nextRecover = profile.heartsRecoverAt;
      if (currentHearts === (profile.heartsMax ?? 25)) {
        nextRecover = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }
      await updateHearts(newHearts, nextRecover, new Date().toISOString());
    }
  };

  const checkAnswer = () => {
    const q = questions[currentQIdx];
    let correct = false;
    if (q.type === 'match-pair') {
      try {
        const selObj = JSON.parse(selectedAns || '{}');
        const correctObj = JSON.parse(q.correct || '{}');
        const selKeys = Object.keys(selObj);
        const correctKeys = Object.keys(correctObj);
        if (selKeys.length === correctKeys.length) {
          correct = correctKeys.every(k => selObj[k] === correctObj[k]);
        }
      } catch (e) {
        correct = false;
      }
    } else {
      const normSel = (selectedAns || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const normCorrect = (q.correct || '').trim().toLowerCase().replace(/\s+/g, ' ');
      correct = normSel === normCorrect;
    }
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      playTTS(q.japanese || q.listenText || '');
      setShowXPBadge(true);
      setTimeout(() => setShowXPBadge(false), 800);
    } else {
      setIsCardShaking(true);
      setTimeout(() => setIsCardShaking(false), 200);
      handleLoseHeart();
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAns(null);
    if (currentQIdx + 1 < questions.length) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      handleFinishLesson();
    }
  };

  const handleFinishLesson = async () => {
    if (progressSavedRef.current) return; // Prevent double submission
    progressSavedRef.current = true;
    setLessonFinished(true);

    const xpGranted = lesson.xp_reward || 15;
    const timeElapsed = Math.round((Date.now() - lessonTimeStart) / 1000);
    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
    const wordIds = wordIdsRef.current;

    // 1. Update local store (optimistic)
    completeLocalLesson(lessonId, xpGranted);
    if (user && profile) {
      await updateProfileStats(xpGranted, 5);
    }

    // 2. Save to Supabase via production RPC
    if (user) {
      try {
        const result = await saveProgress({
          lessonId,
          score,
          xp: xpGranted,
          timeSeconds: timeElapsed,
          wordsLearnedCount: wordIds.length,
          wordIds,
          metadata: { unit_id: unitId, correct_count: correctCount, question_count: questions.length },
        });

        if (result) {
          // Update local streak display
          setNewlyUnlockedBadges(result.newlyUnlockedBadges ?? []);
        }

        // 3. Mark words as learned in vocab_progress
        if (wordIds.length > 0) {
          await markWordsBulk(wordIds);
        }

        // 4. Check achievements
        await checkAchievements();

      } catch (err) {
        console.error('[LessonClient] Progress save failed, queuing offline:', err);
        // Enqueue for retry when online
        await enqueue({
          type: 'complete_lesson',
          payload: {
            lessonId, score, xp: xpGranted,
            timeSeconds: timeElapsed,
            wordsCount: wordIds.length,
            wordIds,
          },
        });
      }

      // 5. Flush any previously queued offline actions
      flush(async (action) => {
        try {
          const res = await fetch('/api/progress/complete-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action.payload),
          });
          return res.ok;
        } catch {
          return false;
        }
      });
    }

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
  };

  if (loading) {
    return (
      <div style={{
        background: 'var(--bg, #0B1E12)',
        color: 'var(--text, #E8F5E9)',
        minHeight: '100vh',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '440px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {/* Progress bar skeleton */}
          <div className="skeleton" style={{ height: '6px', borderRadius: '99px', width: '100%' }} />
          {/* Header skeleton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <div className="skeleton" style={{ width: '80px', height: '28px', borderRadius: '16px' }} />
          </div>
          {/* Question card skeleton */}
          <div className="skeleton skeleton-card" style={{ height: '240px', borderRadius: '20px' }} />
          {/* Options skeleton */}
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '12px', animationDelay: `${i * 60}ms` }} />
          ))}
          {/* Button skeleton */}
          <div className="skeleton" style={{ height: '48px', borderRadius: '12px' }} />
        </div>
      </div>
    );
  }

  return (
    <AppShell hideNav>
      <LessonPlayer
        questions={questions}
        currentQIdx={currentQIdx}
        selectedAns={selectedAns}
        onSelect={setSelectedAns}
        isAnswered={isAnswered}
        isCorrect={isCorrect}
        onCheckAnswer={checkAnswer}
        onNextQuestion={handleNextQuestion}
        onClose={() => router.push('/path')}
        hearts={activeState.hearts}
        showXPBadge={showXPBadge}
        showHeartDeduct={showHeartDeduct}
        isCardShaking={isCardShaking}
        lessonFinished={lessonFinished}
        correctCount={correctCount}
        xpReward={lesson.xp_reward || 15}
        playTTS={playTTS}
        isProUser={profile?.isPremium}
      />
    </AppShell>
  );
}
