'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStoreContext } from '../../../context/StoreContext';
import { useAuth } from '../../../context/AuthContext';
import { AppShell } from '../../../components/layout/AppShell';
import { speakText } from '@evlo/utils';
import confetti from 'canvas-confetti';
import { LessonPlayer } from '../../../components/learn/LessonPlayer';

interface LessonClientProps {
  lessonId: string;
}

export default function LessonClient({ lessonId }: LessonClientProps) {
  const router = useRouter();
  const { state, completeLesson, loseHeart, refillHearts } = useStoreContext();
  const { user, profile, updateProfileStats, updateHearts } = useAuth();

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
              english: v.meaning_en
            });

            // Q4: Speak and Match (Pro simulation)
            qs.push({
              type: 'speak-match',
              japanese: v.kanji,
              romaji: v.romaji,
              correct: v.kanji
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
              correct: ex.english,
              options: shuffle([
                ex.english,
                'Excuse me, where is the station?',
                'Good morning, nice to meet you.',
                'Please write your name here.',
                'Japanese is fun and easy to learn!'
              ].filter(x => x !== ex.english).slice(0, 3).concat(ex.english))
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
            qs.push({
              type: 'match-pair',
              leftOptions,
              rightOptions,
              matches,
              correct: JSON.stringify(matches)
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
      const currentHearts = profile.heartsTotal ?? 50;
      const newHearts = Math.max(0, currentHearts - 1);
      let nextRecover = profile.heartsRecoverAt;
      if (currentHearts === (profile.heartsMax ?? 50)) {
        nextRecover = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      }
      await updateHearts(newHearts, nextRecover, new Date().toISOString());
    }
  };

  const checkAnswer = () => {
    const q = questions[currentQIdx];
    const correct = selectedAns === q.correct;
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
    setLessonFinished(true);
    const xpGranted = lesson.xp_reward || 15;

    completeLesson(lessonId, xpGranted);

    if (user && profile) {
      await updateProfileStats(xpGranted, 5); // Add 5 gems as bonus
    }

    confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
        background: 'var(--bg-root, #121216)', color: '#fff', fontSize: '18px', fontWeight: 'bold'
      }}>
        Loading Lesson...
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
