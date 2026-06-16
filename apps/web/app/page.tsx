'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../hooks/useStore';
import { speakText, formatDate, cn } from '@evlo/utils';
import { Card, Button, Modal } from '@evlo/ui';
import {
  BookOpen,
  RotateCcw,
  Trophy,
  User,
  Settings,
  Book,
  Sparkles,
  Clock,
  Mic,
  Heart,
  ChevronRight,
  Search,
  Volume2,
  AlertCircle,
  Users,
  Flame,
  LogOut,
  BarChart2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestsView } from './components/QuestsView';
import { BadgesView } from './components/BadgesView';
import { SocialTab } from './components/SocialTab';
import { StoriesView } from './components/StoriesView';
import { AIChatView } from './components/AIChatView';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnPath } from './components/LearnPath';
import { ScriptLab } from './components/ScriptLab';
import { SpeakRoleplay } from './components/SpeakRoleplay';
import { JlptPrep } from './components/JlptPrep';
import { SmartReview } from './components/SmartReview';
import { getDaysUntilLeagueReset, getLeagueThresholds } from '@evlo/core-logic';
import { useAuth } from './context/AuthContext';
import { AuthView } from './components/AuthView';
import { Leaderboard } from './components/Leaderboard';
import { PremiumModal } from './components/PremiumModal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { usePushNotifications } from './hooks/usePushNotifications';

export default function EVLOApp() {
  const {
    state,
    isLoaded,
    addXP,
    loseHeart,
    refillHearts,
    addGems,
    spendGems,
    completeLesson,
    handleSRSCardUpdate,
    setTheme,
    setUILang,
    toggleTTS,
    getLeaderboardList,
    getHeatmapList,
    claimQuest,
    nudgeFriend,
    addFriend,
    challengeDuel,
    joinCircle,
    completeStory,
    activateStreakShield,
  } = useStore();

  const { user, profile, loading: authLoading, updateProfileStats, logout } = useAuth();

  const activeState = React.useMemo(() => {
    if (user && profile) {
      return {
        ...state,
        xp: profile.xp,
        gems: profile.leafBalance,
        streak: profile.streak,
        username: profile.name,
      };
    }
    return state;
  }, [state, user, profile]);

  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'script' | 'speak' | 'jlpt' | 'review' | 'leaderboard' | 'analytics' | 'social' | 'profile' | 'settings'>('home');
  const [activeSubView, setActiveSubView] = useState<'none' | 'hiragana' | 'jlpt-plan' | 'phrases' | 'lesson-player' | 'script-lab' | 'stories' | 'ai-chat' | 'quests' | 'badges'>('none');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { permission: notifPermission, requestPermission: requestNotifPermission } = usePushNotifications(user?.id || null);
  const [selectedLessonParams, setSelectedLessonParams] = useState<any>(null);

  // Lesson player states
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [lessonTimeStart, setLessonTimeStart] = useState<number>(0);
  const [aiTutorAnswer, setAiTutorAnswer] = useState<string | null>(null);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Flashcard / SRS Review session
  const [reviewSessionCards, setReviewSessionCards] = useState<any[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [reviewSessionActive, setReviewSessionActive] = useState(false);
  const [reviewResults, setReviewResults] = useState<{hard:number,ok:number,easy:number}>({hard:0,ok:0,easy:0});
  const [reviewDone, setReviewDone] = useState(false);

  // Listen & pick: currently playing
  const [listenPlaying, setListenPlaying] = useState(false);

  // Script Lab mode
  const [scriptMode, setScriptMode] = useState<'hiragana'|'katakana'>('hiragana');
  const [scriptPracticeMode, setScriptPracticeMode] = useState(false);
  const [scriptPracticeChar, setScriptPracticeChar] = useState<any>(null);
  const [scriptPracticeAns, setScriptPracticeAns] = useState<string|null>(null);
  const [scriptPracticeAnswered, setScriptPracticeAnswered] = useState(false);
  const [scriptPracticeOptions, setScriptPracticeOptions] = useState<any[]>([]);

  // Hiragana, JLPT and Phrases states
  const [searchPhrase, setSearchPhrase] = useState('');
  
  // Data index caches
  const [unitsIndex, setUnitsIndex] = useState<any>(null);
  const [lessonsCache, setLessonsCache] = useState<Record<string, any>>({});
  const [loadingLessons, setLoadingLessons] = useState(true);

  // Load configuration
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/data/config/units_index.json');
        const data = await res.json();
        setUnitsIndex(data);

        // Fetch lessons for all units
        const cache: Record<string, any> = {};
        for (const unit of data.units) {
          const ures = await fetch(`/data/lessons/${unit.unit_id}.json`);
          cache[unit.unit_id] = await ures.json();
        }
        setLessonsCache(cache);
      } catch (e) {
        console.error('Failed to load lessons config data', e);
      } finally {
        setLoadingLessons(false);
      }
    }
    loadConfig();
  }, []);

  // Set initial theme attribute
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [isLoaded, state.theme]);

  if (!isLoaded || loadingLessons) {
    return (
      <div id="splash-screen">
        <div className="splash-logo">
          <div className="splash-icon">🌿</div>
          <h1 className="splash-title">VELMORTH</h1>
          <p className="splash-sub">Learn Japanese — Web Edition</p>
          <div className="splash-loader">
            <div className="splash-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- TTS Voice triggers ---
  const playTTS = (text: string) => {
    if (state.ttsEnabled) {
      speakText(text);
    }
  };

  // --- Spaced Repetition (SRS) States ---
  const dueCardsList = Object.values(state.srsData).filter(
    (card) => new Date(card.dueDate) <= new Date()
  );

  // --- MCQ Generation logic ---
  const startLesson = (unitId: string, lessonId: string) => {
    const unitData = lessonsCache[unitId];
    const lesson = unitData.lessons.find((l: any) => l.lesson_id === lessonId);
    if (!lesson) return;

    // Build questions
    const vocab = lesson.vocabulary || [];
    const qs: any[] = [];

    vocab.forEach((v: any, i: number) => {
      // Q1: Japanese to meaning
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

      // Q2: Meaning to Japanese
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
    });

    if (lesson.grammar_point && lesson.examples?.length > 0) {
      const ex = lesson.examples[0];
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

    // Add fill-in-the-blank question from grammar examples
    if (lesson.grammar_point && lesson.examples?.length > 1) {
      const ex2 = lesson.examples[1] || lesson.examples[0];
      // Determine particle/blank from grammar structure
      const particles = ['は', 'が', 'を', 'に', 'で', 'と', 'も', 'の', 'へ', 'から'];
      const blankParticle = particles[Math.floor(Math.random() * 4)];
      const blankOptions = shuffle(particles.slice(0, 8)).slice(0, 4);
      if (!blankOptions.includes(blankParticle)) blankOptions[0] = blankParticle;
      qs.push({
        type: 'fill-blank',
        prompt: 'Fill in the blank:',
        sentence: ex2.japanese || '私___学生です。',
        displaySentence: (ex2.japanese || '私___学生です。').replace('___', '___'),
        correct: blankParticle,
        options: shuffle(blankOptions),
        romaji: ex2.romaji || '',
      });
    }

    // Add Listen & Pick question from vocabulary
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

    const shuffledQs = shuffle(qs).slice(0, 8);
    setQuestions(shuffledQs);
    setCurrentQIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setLessonFinished(false);
    setAiTutorAnswer(null);
    setLessonTimeStart(Date.now());
    
    setSelectedLessonParams({ unitId, lessonId, lesson });
    setActiveSubView('lesson-player');
  };

  const shuffle = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const checkAnswer = async () => {
    const q = questions[currentQIdx];
    const correct = selectedAns === q.correct;
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      playTTS(q.japanese || '');
    } else {
      loseHeart();
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAns(null);
    setAiTutorAnswer(null);
    if (currentQIdx + 1 < questions.length) {
      setCurrentQIdx(prev => prev + 1);
    } else {
      finishLesson();
    }
  };

  const finishLesson = async () => {
    setLessonFinished(true);
    const { lesson, unitId } = selectedLessonParams;
    const timeElapsed = Math.round((Date.now() - lessonTimeStart) / 1000);

    // Call Rust backend for scoring & anti-cheat check
    let verifiedScore = (correctCount * 100) / questions.length;
    let xpGranted = lesson.xp_reward;
    let antiCheatReason = null;

    try {
      const response = await fetch('http://localhost:8080/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: questions.map((_, i) => i === currentQIdx ? selectedAns : "sample"),
          correct_answers: questions.map(q => q.correct),
          elapsed_seconds: timeElapsed
        })
      });
      const scoreData = await response.json();
      if (scoreData.cheated) {
        xpGranted = 0;
        antiCheatReason = scoreData.anti_cheat_reason;
      } else {
        xpGranted = scoreData.xp_rewarded;
      }
    } catch (e) {
      console.warn('Rust core service offline. Using local calculations.', e);
    }

    // Complete local store sync
    completeLesson(lesson.lesson_id, xpGranted);

    if (user && profile) {
      await updateProfileStats(xpGranted, 2);
    }

    // Sync to Spaced Repetition (SRS)
    lesson.vocabulary?.forEach((v: any) => {
      handleSRSCardUpdate(v, 1);
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Ask Python AI Tutor Grammar explanation
  const askAITutor = async (q: any) => {
    setAiTutorOpen(true);
    setAiTutorAnswer(null);
    setAiLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grammar_id: selectedLessonParams?.lesson.grammar_point?.grammar_id || "default",
          structure: selectedLessonParams?.lesson.grammar_point?.structure || "form",
          title: selectedLessonParams?.lesson.grammar_point?.title || "Grammar Rule",
          explanation_en: q.prompt + " " + q.correct,
          lang: state.uiLang
        })
      });
      const data = await response.json();
      setAiTutorAnswer(data.explanation);
    } catch (e) {
      setAiTutorAnswer(`💡 Correct answer: "${q.correct}"\n\nThis grammar pattern follows:\n• Subject + は/が (topic/subject marker)\n• Predicate + です (polite verb)\n\nPractice tip: Try saying it aloud 3 times!`);
    } finally {
      setAiLoading(false);
    }
  };

  // Flashcard review session
  const startReviewSession = () => {
    const cards = Object.values(state.srsData).filter(
      (card: any) => new Date(card.dueDate) <= new Date()
    );
    setReviewSessionCards(shuffle([...cards]));
    setReviewIdx(0);
    setCardFlipped(false);
    setReviewResults({hard:0,ok:0,easy:0});
    setReviewDone(false);
    setReviewSessionActive(true);
  };

  const handleSRSRate = (rating: number, card: any) => {
    handleSRSCardUpdate(card, rating);
    const label = rating === 0 ? 'hard' : rating === 2 ? 'easy' : 'ok';
    setReviewResults(prev => ({...prev, [label]: prev[label as 'hard'|'ok'|'easy'] + 1}));
    setCardFlipped(false);
    if (reviewIdx + 1 >= reviewSessionCards.length) {
      setReviewDone(true);
    } else {
      setTimeout(() => setReviewIdx(prev => prev + 1), 200);
    }
  };

  // Script Lab practice
  const startScriptPractice = (char: any, allChars: any[]) => {
    const distractors = shuffle(allChars.filter((c: any) => c.r !== char.r && c.k.trim())).slice(0, 5);
    const opts = shuffle([char, ...distractors]).slice(0, 6);
    setScriptPracticeChar(char);
    setScriptPracticeOptions(opts);
    setScriptPracticeAns(null);
    setScriptPracticeAnswered(false);
    setScriptPracticeMode(true);
  };

  // Sync with Java legacy SSO/school server
  const triggerJavaSync = async () => {
    try {
      const response = await fetch('http://localhost:8090/api/legacy/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: 'velmorth_user_web',
          username: state.username,
          xp: state.xp,
          streak: state.streak,
          level: Math.floor(state.xp / 100) + 1
        })
      });
      const resData = await response.json();
      alert(`Java Integration Sync Success! Transaction ID: ${resData.transactionId}`);
    } catch (e) {
      alert("Java legacy server offline. Simulated sync offline.");
    }
  };

  // --- AI Tutor slide-up panel renderer ---
  const renderAITutorPanel = (q: any) => (
    aiTutorOpen ? (
      <>
        <div className="ai-tutor-backdrop" onClick={() => setAiTutorOpen(false)} />
        <div className="ai-tutor-panel">
          <div className="ai-tutor-handle" />
          <div className="ai-tutor-header">
            <div className="ai-tutor-avatar">🤖</div>
            <div>
              <div className="ai-tutor-name">Velmorth AI Tutor</div>
              <div className="ai-tutor-subtitle">Grammar explanation</div>
            </div>
            <button
              onClick={() => setAiTutorOpen(false)}
              style={{ marginLeft: 'auto', background: 'transparent', color: 'var(--text-muted)', fontSize: '20px', border: 'none', cursor: 'pointer' }}
            >✕</button>
          </div>
          <div style={{ marginBottom: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Correct answer: </span>
            <span style={{ fontFamily: 'var(--font-ja)', fontWeight: 'bold', color: 'var(--green-400)' }}>{q?.correct}</span>
          </div>
          {aiLoading ? (
            <div className="ai-tutor-loading">
              <div className="ai-dot" />
              <div className="ai-dot" />
              <div className="ai-dot" />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginLeft: 'var(--space-2)' }}>Thinking...</span>
            </div>
          ) : (
            <div className="ai-tutor-body">{aiTutorAnswer}</div>
          )}
          <Button variant="primary" size="sm" style={{ marginTop: 'var(--space-5)', width: '100%' }} onClick={() => setAiTutorOpen(false)}>Got it!</Button>
        </div>
      </>
    ) : null
  );

  // --- Sub-View: Script Lab (Hiragana + Katakana) ---
  const renderScriptLabView = () => {
    const hiraganaRows = [
      { row: 'A', items: [{ k: 'あ', r: 'a' }, { k: 'い', r: 'i' }, { k: 'う', r: 'u' }, { k: 'え', r: 'e' }, { k: 'お', r: 'o' }] },
      { row: 'K', items: [{ k: 'か', r: 'ka' }, { k: 'き', r: 'ki' }, { k: 'く', r: 'ku' }, { k: 'け', r: 'ke' }, { k: 'こ', r: 'ko' }] },
      { row: 'S', items: [{ k: 'さ', r: 'sa' }, { k: 'し', r: 'shi' }, { k: 'す', r: 'su' }, { k: 'せ', r: 'se' }, { k: 'そ', r: 'so' }] },
      { row: 'T', items: [{ k: 'た', r: 'ta' }, { k: 'ち', r: 'chi' }, { k: 'つ', r: 'tsu' }, { k: 'て', r: 'te' }, { k: 'と', r: 'to' }] },
      { row: 'N', items: [{ k: 'な', r: 'na' }, { k: 'に', r: 'ni' }, { k: 'ぬ', r: 'nu' }, { k: 'ね', r: 'ne' }, { k: 'の', r: 'no' }] },
      { row: 'H', items: [{ k: 'は', r: 'ha' }, { k: 'ひ', r: 'hi' }, { k: 'ふ', r: 'fu' }, { k: 'へ', r: 'he' }, { k: 'ほ', r: 'ho' }] },
      { row: 'M', items: [{ k: 'ま', r: 'ma' }, { k: 'み', r: 'mi' }, { k: 'む', r: 'mu' }, { k: 'め', r: 'me' }, { k: 'も', r: 'mo' }] },
      { row: 'Y', items: [{ k: 'や', r: 'ya' }, { k: ' ', r: '' }, { k: 'ゆ', r: 'yu' }, { k: ' ', r: '' }, { k: 'よ', r: 'yo' }] },
      { row: 'R', items: [{ k: 'ら', r: 'ra' }, { k: 'り', r: 'ri' }, { k: 'る', r: 'ru' }, { k: 'れ', r: 're' }, { k: 'ろ', r: 'ro' }] },
      { row: 'W', items: [{ k: 'わ', r: 'wa' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: 'を', r: 'wo' }] },
      { row: 'N', items: [{ k: 'ん', r: 'n' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: ' ', r: '' }] }
    ];
    const katakanaRows = [
      { row: 'A', items: [{ k: 'ア', r: 'a' }, { k: 'イ', r: 'i' }, { k: 'ウ', r: 'u' }, { k: 'エ', r: 'e' }, { k: 'オ', r: 'o' }] },
      { row: 'K', items: [{ k: 'カ', r: 'ka' }, { k: 'キ', r: 'ki' }, { k: 'ク', r: 'ku' }, { k: 'ケ', r: 'ke' }, { k: 'コ', r: 'ko' }] },
      { row: 'S', items: [{ k: 'サ', r: 'sa' }, { k: 'シ', r: 'shi' }, { k: 'ス', r: 'su' }, { k: 'セ', r: 'se' }, { k: 'ソ', r: 'so' }] },
      { row: 'T', items: [{ k: 'タ', r: 'ta' }, { k: 'チ', r: 'chi' }, { k: 'ツ', r: 'tsu' }, { k: 'テ', r: 'te' }, { k: 'ト', r: 'to' }] },
      { row: 'N', items: [{ k: 'ナ', r: 'na' }, { k: 'ニ', r: 'ni' }, { k: 'ヌ', r: 'nu' }, { k: 'ネ', r: 'ne' }, { k: 'ノ', r: 'no' }] },
    ];

    const currentRows = scriptMode === 'hiragana' ? hiraganaRows : katakanaRows;
    const allChars = currentRows.flatMap(r => r.items.filter(c => c.k.trim()));

    if (scriptPracticeMode && scriptPracticeChar) {
      return (
        <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            <Button variant="ghost" size="sm" onClick={() => setScriptPracticeMode(false)}>← Back</Button>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Script Practice</h2>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div className="question-type-label">🔤 What is this character?</div>
            <div style={{ fontFamily: 'var(--font-ja)', fontSize: '80px', fontWeight: 'bold', margin: 'var(--space-6) 0', filter: 'drop-shadow(0 0 20px rgba(74,222,128,0.4))' }}>
              {scriptPracticeChar.k}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
            {scriptPracticeOptions.map((opt: any, i: number) => (
              <button
                key={i}
                className={cn('mcq-btn', {
                  correct: scriptPracticeAnswered && opt.r === scriptPracticeChar.r,
                  wrong: scriptPracticeAnswered && scriptPracticeAns === opt.r && opt.r !== scriptPracticeChar.r,
                  selected: scriptPracticeAns === opt.r
                })}
                onClick={() => {
                  if (scriptPracticeAnswered) return;
                  setScriptPracticeAns(opt.r);
                  setScriptPracticeAnswered(true);
                  if (opt.r === scriptPracticeChar.r) playTTS(scriptPracticeChar.k);
                }}
                style={{ padding: 'var(--space-4)', fontSize: 'var(--text-base)', fontWeight: 700 }}
              >
                {opt.r || '—'}
              </button>
            ))}
          </div>
          {scriptPracticeAnswered && (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <Button variant="primary" fullWidth size="lg" onClick={() => {
                const next = allChars[Math.floor(Math.random() * allChars.length)];
                startScriptPractice(next, allChars);
              }}>Next Character →</Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Button variant="ghost" size="sm" onClick={() => setActiveSubView('none')}>← Back</Button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Script Lab</h2>
        </div>

        {/* Script mode selector */}
        <div className="script-entry-grid">
          <button
            className={cn('script-entry-card')}
            style={{ border: scriptMode === 'hiragana' ? '2px solid var(--green-400)' : undefined }}
            onClick={() => setScriptMode('hiragana')}
          >
            <span className="script-entry-kana">あ</span>
            <div className="script-entry-title">Hiragana</div>
            <div className="script-entry-count">46 characters</div>
            <div className="script-entry-progress">
              <div className="script-entry-progress-fill" style={{ width: '52%' }} />
            </div>
          </button>
          <button
            className={cn('script-entry-card')}
            style={{ border: scriptMode === 'katakana' ? '2px solid var(--blue)' : undefined }}
            onClick={() => setScriptMode('katakana')}
          >
            <span className="script-entry-kana" style={{ color: 'var(--blue)' }}>ア</span>
            <div className="script-entry-title">Katakana</div>
            <div className="script-entry-count">46 characters</div>
            <div className="script-entry-progress">
              <div className="script-entry-progress-fill" style={{ width: '15%', background: 'var(--blue)' }} />
            </div>
          </button>
        </div>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          style={{ marginBottom: 'var(--space-5)' }}
          onClick={() => {
            const first = allChars[Math.floor(Math.random() * allChars.length)];
            startScriptPractice(first, allChars);
          }}
        >
          ✏️ Practice Mode
        </Button>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {currentRows.map((row, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2)' }}>
                {row.items.map((item, itemIdx) => (
                  item.k.trim() ? (
                    <button
                      key={itemIdx}
                      className="mcq-btn"
                      onClick={() => playTTS(item.k)}
                      style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{item.k}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.r}</span>
                    </button>
                  ) : (
                    <div key={itemIdx}></div>
                  )
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // --- Sub-View: Hiragana complete chart (A -> O) ---
  const renderHiraganaView = () => {
    const kanaRows = [
      { row: 'A', items: [{ k: 'あ', r: 'a' }, { k: 'い', r: 'i' }, { k: 'う', r: 'u' }, { k: 'え', r: 'e' }, { k: 'お', r: 'o' }] },
      { row: 'K', items: [{ k: 'か', r: 'ka' }, { k: 'き', r: 'ki' }, { k: 'く', r: 'ku' }, { k: 'け', r: 'ke' }, { k: 'こ', r: 'ko' }] },
      { row: 'S', items: [{ k: 'さ', r: 'sa' }, { k: 'し', r: 'shi' }, { k: 'す', r: 'su' }, { k: 'せ', r: 'se' }, { k: 'そ', r: 'so' }] },
      { row: 'T', items: [{ k: 'た', r: 'ta' }, { k: 'ち', r: 'chi' }, { k: 'つ', r: 'tsu' }, { k: 'て', r: 'te' }, { k: 'と', r: 'to' }] },
      { row: 'N', items: [{ k: 'な', r: 'na' }, { k: 'に', r: 'ni' }, { k: 'ぬ', r: 'nu' }, { k: 'ね', r: 'ne' }, { k: 'の', r: 'no' }] },
      { row: 'H', items: [{ k: 'は', r: 'ha' }, { k: 'ひ', r: 'hi' }, { k: 'ふ', r: 'fu' }, { k: 'へ', r: 'he' }, { k: 'ほ', r: 'ho' }] },
      { row: 'M', items: [{ k: 'ま', r: 'ma' }, { k: 'み', r: 'mi' }, { k: 'む', r: 'mu' }, { k: 'め', r: 'me' }, { k: 'も', r: 'mo' }] },
      { row: 'Y', items: [{ k: 'や', r: 'ya' }, { k: ' ', r: '' }, { k: 'ゆ', r: 'yu' }, { k: ' ', r: '' }, { k: 'よ', r: 'yo' }] },
      { row: 'R', items: [{ k: 'ら', r: 'ra' }, { k: 'り', r: 'ri' }, { k: 'る', r: 'ru' }, { k: 'れ', r: 're' }, { k: 'ろ', r: 'ro' }] },
      { row: 'W', items: [{ k: 'わ', r: 'wa' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: 'を', r: 'wo' }] },
      { row: 'N', items: [{ k: 'ん', r: 'n' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: ' ', r: '' }, { k: ' ', r: '' }] }
    ];

    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Button variant="ghost" size="sm" onClick={() => setActiveSubView('none')}>← Back</Button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Hiragana complete chart</h2>
        </div>
        
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {kanaRows.map((row, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-2)' }}>
                {row.items.map((item, itemIdx) => (
                  item.k.trim() ? (
                    <button
                      key={itemIdx}
                      className="mcq-btn"
                      onClick={() => playTTS(item.k)}
                      style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{item.k}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.r}</span>
                    </button>
                  ) : (
                    <div key={itemIdx}></div>
                  )
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // --- Sub-View: JLPT N5→N1 Level Selector + Month Plan ---
  const renderJLPTPlanView = () => {
    const levels = [
      { id: 'n5', label: 'N5', name: 'Beginner', desc: 'Hiragana, Katakana, ~800 vocab, basic grammar', est: '~2 months', status: 'active', exam: 'Dec 2025' },
      { id: 'n4', label: 'N4', name: 'Elementary', desc: '~1,500 vocab, polite speech, daily conversations', est: '~4 months', status: 'locked', exam: 'Jul 2026' },
      { id: 'n3', label: 'N3', name: 'Intermediate', desc: '~3,750 vocab, complex sentences, kanji 370+', est: '~8 months', status: 'locked', exam: 'Dec 2026' },
      { id: 'n2', label: 'N2', name: 'Upper-Intermediate', desc: '~6,000 vocab, newspaper text, business Japanese', est: '~18 months', status: 'locked', exam: 'Jul 2027' },
      { id: 'n1', label: 'N1', name: 'Advanced', desc: '~10,000 vocab, academic text, full fluency', est: '~36 months', status: 'locked', exam: 'Dec 2027' },
    ];

    const scheduleWeeks = [
      { week: 1, topic: 'Hiragana & Katakana Complete Chart', detail: 'Read, write, and practice pronunciation using speech synthesizers.' },
      { week: 2, topic: 'Basic Greetings & Expressions', detail: 'Learn how to introduce yourself and greetings for daily interactions.' },
      { week: 3, topic: 'Numbers, Time, Calendar Days', detail: 'Learn numbers 1 to 10,000, hours, calendar days, and basic particles.' },
      { week: 4, topic: 'Essential N5 Vocabulary & Nouns', detail: 'Master 100+ nouns covering family, food, locations, and colors.' },
      { week: 5, topic: 'Intro to Verbs & Adjectives', detail: 'Learn ~masu polite form verbs, I-adjectives, and Na-adjectives.' },
      { week: 6, topic: 'Particles: wa, ga, o, ni, de, e', detail: 'Understand basic grammar connectors and sentence flow.' },
      { week: 7, topic: 'Reading simple Japanese sentences', detail: 'Read elementary comprehension passages and dialogues.' },
      { week: 8, topic: 'JLPT N5 mock test & revision', detail: 'Review vocabulary, flashcards, and sit for a full mock examination.' }
    ];

    return (
      <div className="page-home page-enter">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-5)', paddingBottom: 0 }}>
          <Button variant="ghost" size="sm" onClick={() => setActiveSubView('none')}>← Back</Button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🎯 JLPT Path: N5 → N1</h2>
        </div>

        {/* JLPT Level cards */}
        <div className="jlpt-path-container">
          {levels.map(lv => (
            <div key={lv.id} className={`jlpt-path-card ${lv.status}`}>
              <div className={`jlpt-level-badge ${lv.id}`}>{lv.label}</div>
              <div className="jlpt-level-info">
                <div className="jlpt-level-name">{lv.name}</div>
                <div className="jlpt-level-desc">{lv.desc}</div>
                <div className="jlpt-level-est">⏱ {lv.est} · Exam: {lv.exam}</div>
              </div>
              <div className="jlpt-status-icon">
                {lv.status === 'completed' ? '✅' : lv.status === 'active' ? '📝' : '🔒'}
              </div>
            </div>
          ))}
        </div>

        {/* Exam dates */}
        <div className="exam-dates-banner">
          <h4>📅 Upcoming Exam Dates</h4>
          <div className="exam-date-row">
            <span>July 2026 — N5/N4/N3</span>
            <span className="exam-date-tag open">Open Soon</span>
          </div>
          <div className="exam-date-row">
            <span>December 2025 — All Levels</span>
            <span className="exam-date-tag soon">6 months</span>
          </div>
        </div>

        {/* N5 8-Week Study Plan */}
        <div style={{ padding: '0 var(--space-5) var(--space-5)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--text-secondary)' }}>N5 — 8 Week Study Plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {scheduleWeeks.map(w => (
              <Card key={w.week}>
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{
                    background: 'var(--grad-primary)',
                    width: '40px', height: '40px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', color: 'white', flexShrink: 0
                  }}>
                    W{w.week}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{w.topic}</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>{w.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- Sub-View: Basic Phrases Table ---
  const renderPhrasesView = () => {
    const phrases = [
      { jp: 'こんにちは', ro: 'konnichiwa', en: 'Hello / Good afternoon', hi: 'नमस्ते' },
      { jp: 'ありがとう', ro: 'arigatou', en: 'Thank you', hi: 'धन्यवाद' },
      { jp: 'はい', ro: 'hai', en: 'Yes', hi: 'हाँ' },
      { jp: 'いいえ', ro: 'iie', en: 'No', hi: 'नहीं' },
      { jp: 'すみません', ro: 'sumimasen', en: 'Excuse me / Sorry', hi: 'माफ़ कीजिये' },
      { jp: 'はじめまして', ro: 'hajimemashite', en: 'Nice to meet you', hi: 'आपसे मिलकर ख़ुशी हुई' },
      { jp: 'お元気ですか', ro: 'o-genki desu ka', en: 'How are you?', hi: 'आप कैसे हैं?' },
      { jp: 'さようなら', ro: 'sayounara', en: 'Goodbye', hi: 'अलविदा' },
      { jp: 'おやすみなさい', ro: 'oyasuminasai', en: 'Good night', hi: 'शुभ रात्रि' },
      { jp: 'いただきます', ro: 'itadakimasu', en: 'Thank you for the food (before meal)', hi: 'भोजन ग्रहण करने की प्रार्थना' }
    ];

    const filtered = phrases.filter(
      p => p.en.toLowerCase().includes(searchPhrase.toLowerCase()) || 
           p.jp.includes(searchPhrase) ||
           p.ro.includes(searchPhrase) ||
           p.hi.includes(searchPhrase)
    );

    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Button variant="ghost" size="sm" onClick={() => setActiveSubView('none')}>← Back</Button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Searchable basic phrases</h2>
        </div>

        <div style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
          <input
            type="text"
            placeholder="Search phrases (English, Hindi, Japanese)..."
            value={searchPhrase}
            onChange={(e) => setSearchPhrase(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)'
            }}
          />
          <Search size={18} style={{ position: 'absolute', right: '16px', top: '14px', color: 'var(--text-muted)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {filtered.map((p, idx) => (
            <Card key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{p.jp}</h3>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{p.ro}</p>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {state.uiLang === 'hi' ? p.hi : p.en}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => playTTS(p.jp)} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
                  🔊
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // --- Sub-View: MCQ Lesson Player ---
  const renderLessonPlayerView = () => {
    if (lessonFinished) {
      const { lesson } = selectedLessonParams;
      return (
        <div className="page-lesson page-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🎉</div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Lesson Complete!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 'var(--space-6)' }}>
            You got {correctCount} out of {questions.length} questions correct.
          </p>
          <Card style={{ width: '100%', maxWidth: '360px', marginBottom: 'var(--space-6)', textAlign: 'center' }}>
            <h4 style={{ color: 'var(--amber)', fontWeight: 'bold' }}>+{lesson.xp_reward} XP Earned</h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>Gems gained: +5 💎</p>
          </Card>
          <Button variant="primary" size="lg" onClick={() => setActiveSubView('none')}>Return to Path</Button>
        </div>
      );
    }

    const q = questions[currentQIdx];
    const progressPct = (currentQIdx / questions.length) * 100;
    const hearts = state.hearts;

    return (
      <div className="page-lesson page-enter">
        <div className="lesson-progress-bar-wrap">
          <button className="lesson-close-btn" onClick={() => { if (confirm('Leave lesson? Progress will be lost.')) setActiveSubView('none'); }}>✕</button>
          <div className="lesson-prog-bar">
            <div className="lesson-prog-fill" style={{ width: `${progressPct}%` }}></div>
          </div>
          <div className="lesson-hearts">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ opacity: i >= hearts ? 0.25 : 1 }}>❤️</span>
            ))}
          </div>
        </div>

        {hearts <= 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>💔</div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>No Hearts Left</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '4px 0 var(--space-6)', textAlign: 'center' }}>
              Refill hearts in the shop or return to the path.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={() => setActiveSubView('none')}>Return Path</Button>
              <Button variant="primary" onClick={() => { refillHearts(); }}>Refill (Free)</Button>
            </div>
          </div>
        ) : (
          <div className="question-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {q.type === 'mcq-meaning' && (
              <>
                <div className="question-type-label">🔤 Translate</div>
                <div className="question-japanese">{q.japanese}</div>
                <div className="question-romaji">{q.romaji}</div>
                <Button variant="ghost" size="sm" onClick={() => playTTS(q.japanese)} style={{ margin: '0 auto var(--space-4)', display: 'flex', gap: '6px' }}>
                  🔊 Listen
                </Button>
                <div className="mcq-options">
                  {q.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      className={cn('mcq-btn', {
                        selected: selectedAns === opt,
                        correct: isAnswered && opt === q.correct,
                        wrong: isAnswered && selectedAns === opt && opt !== q.correct
                      })}
                      onClick={() => !isAnswered && setSelectedAns(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {q.type === 'mcq-japanese' && (
              <>
                <div className="question-type-label">🇯🇵 Pick Japanese</div>
                <div className="question-prompt">{q.english}</div>
                <div className="mcq-options">
                  {q.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      className={cn('mcq-btn', {
                        selected: selectedAns === opt,
                        correct: isAnswered && opt === q.correct,
                        wrong: isAnswered && selectedAns === opt && opt !== q.correct
                      })}
                      onClick={() => !isAnswered && setSelectedAns(opt)}
                    >
                      <span className="ja-text">{opt}</span>
                      <span className="en-text">{q.optionsRomaji?.[idx] || ''}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {q.type === 'translate' && (
              <>
                <div className="question-type-label">📝 Translate the sentence</div>
                <div className="question-japanese" style={{ fontSize: 'var(--text-ja-md)' }}>{q.japanese}</div>
                <div className="question-romaji">{q.romaji}</div>
                <Button variant="ghost" size="sm" onClick={() => playTTS(q.japanese)} style={{ margin: '0 auto var(--space-4)', display: 'flex', gap: '6px' }}>
                  🔊 Listen
                </Button>
                <div className="mcq-options" style={{ gridTemplateColumns: '1fr' }}>
                  {q.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      className={cn('mcq-btn', {
                        selected: selectedAns === opt,
                        correct: isAnswered && opt === q.correct,
                        wrong: isAnswered && selectedAns === opt && opt !== q.correct
                      })}
                      onClick={() => !isAnswered && setSelectedAns(opt)}
                      style={{ textAlign: 'left' }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Fill-in-the-blank question type */}
            {q.type === 'fill-blank' && (
              <>
                <div className="question-type-label">✏️ Fill in the blank</div>
                <div className="fill-blank-sentence">
                  {(q.sentence || '').split('___').map((part: string, i: number, arr: string[]) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className={`fill-blank-gap ${!selectedAns ? 'empty' : ''}`}>
                          {selectedAns || ''}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                {q.romaji && <div className="question-romaji">{q.romaji}</div>}
                <div className="fill-blank-options">
                  {q.options.map((opt: string, idx: number) => (
                    <button
                      key={idx}
                      className={`fill-blank-btn${selectedAns === opt ? ' selected' : ''}${isAnswered && opt === q.correct ? ' correct' : ''}${isAnswered && selectedAns === opt && opt !== q.correct ? ' wrong' : ''}`}
                      onClick={() => !isAnswered && setSelectedAns(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Listen & Pick question type */}
            {q.type === 'listen-pick' && (
              <div className="listen-pick-container">
                <div className="question-type-label">🎧 {q.prompt}</div>
                <div style={{ position: 'relative' }}>
                  <button
                    className={`listen-play-btn ${listenPlaying ? 'playing' : ''}`}
                    onClick={() => {
                      setListenPlaying(true);
                      playTTS(q.listenText);
                      setTimeout(() => setListenPlaying(false), 1500);
                    }}
                  >
                    {listenPlaying ? (
                      <><div className="listen-ripple" /><div className="listen-ripple" /><div className="listen-ripple" />🔊</>
                    ) : '▶'}
                  </button>
                </div>
                <div className="listen-label">Tap to listen</div>
                <div className="listen-options-grid">
                  {q.options.map((opt: any, idx: number) => (
                    <button
                      key={idx}
                      className={cn('mcq-btn', {
                        selected: selectedAns === opt.kanji,
                        correct: isAnswered && opt.kanji === q.correct,
                        wrong: isAnswered && selectedAns === opt.kanji && opt.kanji !== q.correct
                      })}
                      onClick={() => !isAnswered && setSelectedAns(opt.kanji)}
                    >
                      <span className="ja-text">{opt.kanji}</span>
                      <span className="en-text">{opt.romaji}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isAnswered && !isCorrect && (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <Button variant="ghost" size="sm" onClick={() => askAITutor(q)} disabled={aiLoading}>
                  💡 Ask AI Tutor
                </Button>
              </div>
            )}

            {/* AI Tutor slide-up panel */}
            {renderAITutorPanel(questions[currentQIdx])}

            <div style={{ marginTop: 'var(--space-5)' }}>
              {!isAnswered ? (
                <Button variant="primary" fullWidth size="lg" disabled={!selectedAns} onClick={checkAnswer}>
                  Check Answer
                </Button>
              ) : (
                <Button variant={isCorrect ? 'primary' : 'danger'} fullWidth size="lg" onClick={handleNextQuestion}>
                  {isCorrect ? 'Continue ✓' : 'Got it'}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- TABS RENDERING ---

  const renderLearnTab = () => {
    if (activeSubView === 'script-lab') return renderScriptLabView();
    if (activeSubView === 'hiragana') return renderHiraganaView();
    if (activeSubView === 'jlpt-plan') return renderJLPTPlanView();
    if (activeSubView === 'phrases') return renderPhrasesView();
    if (activeSubView === 'lesson-player') return renderLessonPlayerView();

    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>日本語を学ぼう</h2>
          <p>Learn Japanese — All Units</p>
        </div>

        {/* Shortcuts — 6-button grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
          <button className="mcq-btn" onClick={() => setActiveSubView('script-lab')} style={{ padding: 'var(--space-3)' }} id="shortcut-script">
            <span style={{ fontSize: '22px', fontFamily: 'var(--font-ja)' }}>あア</span>
            <span style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>Script</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('jlpt-plan')} style={{ padding: 'var(--space-3)' }} id="shortcut-jlpt">
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>JLPT</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('phrases')} style={{ padding: 'var(--space-3)' }} id="shortcut-phrases">
            <span style={{ fontSize: '20px' }}>🗣️</span>
            <span style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>Phrases</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('stories')} style={{ padding: 'var(--space-3)' }} id="shortcut-stories">
            <span style={{ fontSize: '20px' }}>📖</span>
            <span style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>Stories</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('ai-chat')} style={{ padding: 'var(--space-3)' }} id="shortcut-ai-chat">
            <span style={{ fontSize: '20px' }}>🤖</span>
            <span style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>AI Chat</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('quests')} style={{ padding: 'var(--space-3)' }} id="shortcut-quests">
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ display: 'block', fontSize: '10px', marginTop: '4px' }}>Quests</span>
          </button>
        </div>

        {/* Units Map list */}
        {unitsIndex && unitsIndex.units.map((unit: any, unitIdx: number) => {
          // Generate pseudo lesson IDs
          const lessonIds = Array.from({ length: unit.total_lessons }, (_, i) => `${unit.unit_id}_l0${i + 1}`);
          const completedCount = lessonIds.filter(id => state.lessonProgress[id]?.completed).length;
          const totalCount = lessonIds.length;
          const pct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

          return (
            <div key={unit.unit_id} className="unit-section">
              <div className="unit-header">
                <div className="unit-icon">{unit.icon}</div>
                <div className="unit-meta">
                  <h3>Unit {unitIdx + 1}: {unit.unit_title}</h3>
                  <p>{completedCount}/{totalCount} lessons · {Math.round(pct)}% complete</p>
                </div>
                <div className="unit-progress">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle className="bg" cx="24" cy="24" r="20" />
                    <circle 
                      className="fill" 
                      cx="24" 
                      cy="24" 
                      r="20"
                      strokeDasharray="125.6"
                      strokeDashoffset={125.6 * (1 - completedCount / totalCount)}
                    />
                  </svg>
                </div>
              </div>

              <div className="lessons-grid">
                {lessonsCache[unit.unit_id]?.lessons.map((lesson: any, idx: number) => {
                  const isCompleted = !!state.lessonProgress[lesson.lesson_id]?.completed;
                  const isLocked = idx > 0 && !isCompleted && !state.lessonProgress[lessonsCache[unit.unit_id]?.lessons[idx - 1].lesson_id]?.completed;

                  return (
                    <div 
                      key={lesson.lesson_id} 
                      className={cn('lesson-card', { completed: isCompleted, locked: isLocked })}
                      onClick={() => !isLocked && startLesson(unit.unit_id, lesson.lesson_id)}
                    >
                      <div className="lesson-icon">
                        {isCompleted ? '✅' : isLocked ? '🔒' : '📝'}
                      </div>
                      <div className="lesson-info">
                        <h4>{lesson.lesson_title}</h4>
                        <p>{lesson.vocabulary?.length ?? 0} words · {lesson.difficulty}</p>
                      </div>
                      <div className="lesson-xp">+{lesson.xp_reward} XP</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderReviewTab = () => {
    // --- Review session: flashcard flip mode ---
    if (reviewSessionActive && !reviewDone) {
      const card = reviewSessionCards[reviewIdx];
      if (!card) return null;
      return (
        <div className="flashcard-session page-enter">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <Button variant="ghost" size="sm" onClick={() => setReviewSessionActive(false)}>✕ Quit</Button>
            <div className="flashcard-counter">{reviewIdx + 1} / {reviewSessionCards.length}</div>
            <div style={{ display: 'flex', gap: 'var(--space-1)', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--red)' }}>😓{reviewResults.hard}</span>
              <span style={{ color: 'var(--text-muted)' }}> 👍{reviewResults.ok}</span>
              <span style={{ color: 'var(--green-400)' }}> 🚀{reviewResults.easy}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-6)', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--grad-primary)', width: `${((reviewIdx) / reviewSessionCards.length) * 100}%`, transition: 'width 0.4s ease', borderRadius: 'var(--radius-full)' }} />
          </div>

          {/* 3D Flashcard */}
          <div
            className={`flashcard-scene ${cardFlipped ? 'flipped' : ''}`}
            onClick={() => !cardFlipped && setCardFlipped(true)}
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                <div className="flashcard-kana">{(card as any).kanji}</div>
                <div className="flashcard-tap-hint">Tap to reveal →</div>
              </div>
              <div className="flashcard-face flashcard-back">
                <div className="flashcard-kana">{(card as any).kanji}</div>
                <div className="flashcard-romaji">{(card as any).romaji}</div>
                <div className="flashcard-meaning">{(card as any).meaning_en || (card as any).kanji}</div>
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 'var(--space-2)' }}>
                  <Button variant="ghost" size="sm" onClick={() => playTTS((card as any).kanji)}>🔊</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Rating buttons — only visible after flip */}
          {cardFlipped ? (
            <>
              <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>How well did you know this?</p>
              <div className="srs-rate-buttons">
                <button className="srs-btn hard" onClick={() => handleSRSRate(0, card)}>
                  😓 Hard
                  <span className="interval-hint">×0.5</span>
                </button>
                <button className="srs-btn ok" onClick={() => handleSRSRate(1, card)}>
                  👍 OK
                  <span className="interval-hint">×1</span>
                </button>
                <button className="srs-btn easy" onClick={() => handleSRSRate(2, card)}>
                  🚀 Easy
                  <span className="interval-hint">×2.5</span>
                </button>
              </div>
            </>
          ) : (
            <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Tap the card to reveal the answer</p>
          )}
        </div>
      );
    }

    // --- Review done screen ---
    if (reviewDone) {
      return (
        <div className="page-home page-enter" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>⚡</div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Review Done!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>All {reviewSessionCards.length} cards reviewed</p>
          <Card style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
              <div><div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--red)' }}>{reviewResults.hard}</div><div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hard</div></div>
              <div><div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-secondary)' }}>{reviewResults.ok}</div><div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>OK</div></div>
              <div><div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--green-400)' }}>{reviewResults.easy}</div><div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Easy</div></div>
            </div>
          </Card>
          <Button variant="primary" size="lg" onClick={() => setReviewSessionActive(false)}>Back to Home</Button>
        </div>
      );
    }

    // --- Review dashboard ---
    return (
      <div className="review-dashboard page-enter">
        <div className="home-header">
          <h2>⚡ Smart Review</h2>
          <p>Spaced Repetition · SM-2 algorithm</p>
        </div>

        <div className="review-stats-row">
          <div className="review-stat-card">
            <span className="review-stat-num" style={{ color: 'var(--amber)' }}>{dueCardsList.length}</span>
            <span className="review-stat-label">Due Today</span>
          </div>
          <div className="review-stat-card">
            <span className="review-stat-num" style={{ color: 'var(--green-400)' }}>{Object.keys(state.srsData).length}</span>
            <span className="review-stat-label">Total Cards</span>
          </div>
          <div className="review-stat-card">
            <span className="review-stat-num" style={{ color: 'var(--purple)' }}>{state.streak}</span>
            <span className="review-stat-label">Day Streak</span>
          </div>
        </div>

        {dueCardsList.length > 0 ? (
          <button className="review-start-btn" onClick={startReviewSession}>
            ⚡ Start Review ({dueCardsList.length} cards)
          </button>
        ) : (
          <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>✅</div>
            <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>All caught up!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Complete more lessons to add cards to your review queue.</p>
          </Card>
        )}

        {dueCardsList.length > 0 && (
          <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Preview</h3>
            {dueCardsList.slice(0, 5).map((card: any) => (
              <div key={card.vocab_id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'var(--bg-card)', padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
              }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-ja)', fontSize: '22px', fontWeight: 'bold' }}>{card.kanji}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>{card.romaji}</span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--amber)', fontWeight: 700 }}>Due now</span>
              </div>
            ))}
            {dueCardsList.length > 5 && (
              <p style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>+{dueCardsList.length - 5} more cards...</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLeaderboardTab = () => {
    const board = getLeaderboardList();
    const tierColors: Record<string, string> = {
      bronze: '#cd7f32', silver: '#c0c0c0', gold: '#fbbf24',
      platinum: '#60a5fa', diamond: '#a78bfa', obsidian: '#ef4444'
    };
    const tierEmojis: Record<string, string> = {
      bronze: '🥉', silver: '🥈', gold: '🥇',
      platinum: '💠', diamond: '💎', obsidian: '🔥'
    };
    const daysLeft = getDaysUntilLeagueReset();
    const myTier = (state.leagueTier as string) || 'bronze';
    const tierLabel = myTier.charAt(0).toUpperCase() + myTier.slice(1);

    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>{tierEmojis[myTier]} {tierLabel} League</h2>
          <p>Compete weekly with other learners</p>
        </div>

        {/* Season info banner */}
        <div className="league-season-banner">
          <div className="league-season-left">
            <span className="league-tier-icon" style={{ color: tierColors[myTier] }}>{tierEmojis[myTier]}</span>
            <div>
              <div className="league-tier-name" style={{ color: tierColors[myTier] }}>{tierLabel}</div>
              <div className="league-tier-sub">{state.weeklyXP || 0} XP this week</div>
            </div>
          </div>
          <div className="league-season-right">
            <div className="league-countdown">{daysLeft}d left</div>
            <div className="league-season-label">Season reset</div>
          </div>
        </div>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {board.map((u, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                background: u.isYou ? 'rgba(74, 222, 128, 0.15)' : 'transparent',
                border: u.isYou ? '1px solid var(--green-400)' : 'none',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <span style={{ fontWeight: 'bold', width: '24px', color: idx < 3 ? 'var(--amber)' : 'var(--text-muted)' }}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${u.rank}`}
                </span>
                <span style={{ fontSize: '24px' }}>{u.avatar}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: u.isYou ? 'bold' : 'normal' }}>{u.name} {u.isYou && '(You)'}</h4>
                </div>
                <span className="lesson-xp" style={{ padding: '4px 12px' }}>{u.xp} XP</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };


  const renderProfileTab = () => {
    if (!user) {
      return <AuthView />;
    }

    const heatmap = getHeatmapList();
    const unlockedBadges = (state.badges || []).filter(b => b.unlockedAt !== null).slice(0, 6);
    const activeQuests = (state.quests || []).filter(q => q.status !== 'claimed');

    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>Profile Stats</h2>
          <p>Track your Japanese learning metrics</p>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Card style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '11px' }}>TOTAL XP</h4>
            <h2 style={{ fontSize: '24px', color: 'var(--amber)', fontWeight: 'bold', marginTop: '4px' }}>{activeState.xp}</h2>
          </Card>
          <Card style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '11px' }}>STREAK</h4>
            <h2 style={{ fontSize: '24px', color: 'var(--orange)', fontWeight: 'bold', marginTop: '4px' }}>{activeState.streak} 🔥</h2>
          </Card>
          <Card style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '11px' }}>BADGES</h4>
            <h2 style={{ fontSize: '24px', color: 'var(--purple)', fontWeight: 'bold', marginTop: '4px' }}>{unlockedBadges.length}</h2>
          </Card>
        </div>

        {/* Badge preview */}
        {unlockedBadges.length > 0 && (
          <Card style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>🏅 Badges</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveSubView('badges')} id="view-all-badges-btn">View All</button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {unlockedBadges.map(badge => (
                <div key={badge.badge_id} title={badge.title} style={{ fontSize: '28px' }}>{badge.icon}</div>
              ))}
            </div>
          </Card>
        )}

        {/* Active quests preview */}
        {activeQuests.length > 0 && (
          <Card style={{ marginBottom: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>🎯 Daily Quests</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveSubView('quests')} id="view-quests-btn">View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {activeQuests.slice(0, 3).map(q => {
                const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
                return (
                  <div key={q.quest_id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <span style={{ fontSize: '20px' }}>{q.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: '3px' }}>{q.title}</div>
                      <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--grad-primary)', borderRadius: 'var(--radius-full)' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{q.progress}/{q.target}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Streak shield */}
        <Card style={{ marginBottom: 'var(--space-5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: '28px' }}>🛡️</span>
              <div>
                <h4 style={{ fontWeight: 700 }}>Streak Shield</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {activeState.streakShield?.active
                    ? `Active — ${activeState.streakShield.uses_remaining} use(s) remaining`
                    : 'Protects your streak for 1 missed day'}
                </p>
              </div>
            </div>
            {!activeState.streakShield?.active && (
              <button
                className="btn btn-sm"
                style={{ background: 'var(--grad-gold)', color: '#000', fontWeight: 700 }}
                onClick={activateStreakShield}
                id="activate-shield-btn"
              >
                10 💎
              </button>
            )}
            {activeState.streakShield?.active && (
              <span style={{ color: 'var(--green-400)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>✓ Active</span>
            )}
          </div>
        </Card>

        {/* Activity heatmap */}
        <Card style={{ marginBottom: 'var(--space-5)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>Activity Heatmap</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(14, 1fr)', gap: '4px' }}>
            {heatmap.slice(-98).map((h, i) => (
              <div
                key={i}
                title={`${h.date}: ${h.sessions} sessions`}
                style={{
                  height: '16px',
                  borderRadius: '2px',
                  backgroundColor: h.sessions > 0 ? `rgba(74, 222, 128, ${0.2 + h.level * 0.2})` : 'var(--bg-surface)'
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            <span>98 days ago</span>
            <span>Today</span>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Button variant="secondary" fullWidth onClick={triggerJavaSync}>
            💼 Sync stats to enterprise (Java backend)
          </Button>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-3)' }}>
            Logged in as <strong style={{ color: 'var(--text-secondary)' }}>{user.email}</strong>
          </div>
          <Button 
            variant="ghost" 
            fullWidth 
            onClick={logout}
            style={{ 
              border: '1px solid var(--border)', 
              color: 'var(--red)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px' 
            }}
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>
    );
  };


  const renderSettingsTab = () => {
    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>Settings</h2>
          <p>Customize your learn preferences</p>
        </div>

        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {/* Theme */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 'bold' }}>Dark Mode</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Toggle dark/light appearance</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(state.theme === 'dark' ? 'light' : 'dark')}
              >
                {state.theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
              </Button>
            </div>

            {/* Language */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 'bold' }}>Tutor Interface Language</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Switch explanatory translations</p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  variant={state.uiLang === 'en' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setUILang('en')}
                >
                  EN
                </Button>
                <Button
                  variant={state.uiLang === 'hi' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setUILang('hi')}
                >
                  हिन्दी
                </Button>
              </div>
            </div>

            {/* Speech */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontWeight: 'bold' }}>Text-to-Speech (TTS)</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Automatically speak Japanese text</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTTS}
              >
                {state.ttsEnabled ? '🔊 Enabled' : '🔇 Disabled'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderSocialTab = () => (
    <SocialTab
      friends={state.friends || []}
      duels={state.duels || []}
      circles={state.circles || []}
      onNudgeFriend={nudgeFriend}
      onChallengeDuel={challengeDuel}
      onJoinCircle={joinCircle}
      onAddFriend={addFriend}
      myUserId="me"
    />
  );

  const renderActiveTab = () => {
    // Sub-views that override tab content
    if (activeSubView === 'quests') return <QuestsView quests={state.quests || []} onClaimQuest={claimQuest} onBack={() => setActiveSubView('none')} />;
    if (activeSubView === 'badges') return <BadgesView badges={state.badges || []} onBack={() => setActiveSubView('none')} />;
    if (activeSubView === 'stories') return <StoriesView stories={state.stories || []} onBack={() => setActiveSubView('none')} onCompleteStory={completeStory} onPlayTTS={playTTS} />;
    if (activeSubView === 'ai-chat') return <AIChatView onBack={() => setActiveSubView('none')} onPlayTTS={playTTS} uiLang={state.uiLang} />;

    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            state={activeState}
            onNavigate={(tab, subView) => {
              setActiveTab(tab);
              if (subView) {
                if (subView === 'hiragana') {
                  setActiveTab('script');
                } else if (subView === 'phrases') {
                  setActiveTab('speak');
                } else {
                  setActiveSubView(subView);
                }
              }
            }}
            onContinueLesson={() => setActiveTab('learn')}
            onActivateShield={activateStreakShield}
          />
        );
      case 'learn':
        return (
          <LearnPath
            state={activeState}
            units={unitsIndex?.units || []}
            lessonsCache={lessonsCache}
            onStartLesson={(lessonId) => {
              const lesson = Object.values(lessonsCache).flatMap((u: any) => u.lessons || []).find((l: any) => l.lesson_id === lessonId);
              if (lesson) {
                setSelectedLessonParams(lesson);
                setQuestions(lesson.exercises || []);
                setCurrentQIdx(0);
                setSelectedAns(null);
                setIsAnswered(false);
                setCorrectCount(0);
                setLessonFinished(false);
                setLessonTimeStart(Date.now());
                setActiveSubView('lesson-player');
              }
            }}
            onBack={() => setActiveTab('home')}
          />
        );
      case 'script':
        return <ScriptLab onBack={() => setActiveTab('home')} />;
      case 'speak':
        return <SpeakRoleplay onBack={() => setActiveTab('home')} />;
      case 'jlpt':
        return <JlptPrep onBack={() => setActiveTab('home')} />;
      case 'review':
        return (
          <SmartReview
            srsData={activeState.srsData || {}}
            onReviewCardUpdate={handleSRSCardUpdate}
            onBack={() => setActiveTab('home')}
          />
        );
      case 'leaderboard': return <Leaderboard />;
      case 'analytics': return <AnalyticsDashboard />;
      case 'social': return renderSocialTab();
      case 'profile': return renderProfileTab();
      case 'settings': return renderSettingsTab();
    }
  };

  return (
    <>
      {/* Sidebar - Tablet & Desktop */}
      {activeSubView === 'none' && (
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">V</div>
            <div>
              <div className="logo-name">Velmorth</div>
              <div className="logo-sub">Japanese Labs</div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <button className={cn({ active: activeTab === 'home' })} onClick={() => setActiveTab('home')}>
              <Flame size={20} />
              <span>Home</span>
            </button>
            <button className={cn({ active: activeTab === 'learn' })} onClick={() => setActiveTab('learn')}>
              <BookOpen size={20} />
              <span>Learn Path</span>
            </button>
            <button className={cn({ active: activeTab === 'review' })} onClick={() => setActiveTab('review')}>
              <RotateCcw size={20} />
              <span>Review</span>
            </button>
            <button className={cn({ active: activeTab === 'speak' })} onClick={() => setActiveTab('speak')}>
              <Mic size={20} />
              <span>Speak Mode</span>
            </button>
            <button className={cn({ active: activeTab === 'jlpt' })} onClick={() => setActiveTab('jlpt')}>
              <Trophy size={20} />
              <span>JLPT Prep</span>
            </button>
            <button className={cn({ active: activeTab === 'script' })} onClick={() => setActiveTab('script')}>
              <Sparkles size={20} />
              <span>Script Lab</span>
            </button>
            <button className={cn({ active: activeTab === 'social' })} onClick={() => setActiveTab('social')}>
              <Users size={20} />
              <span>Social & Duels</span>
            </button>
            <button className={cn({ active: activeTab === 'analytics' })} onClick={() => setActiveTab('analytics')}>
              <BarChart2 size={20} />
              <span>Analytics</span>
            </button>
            <button className={cn({ active: activeTab === 'profile' })} onClick={() => setActiveTab('profile')}>
              <User size={20} />
              <span>Profile</span>
            </button>
            <button className={cn({ active: activeTab === 'settings' })} onClick={() => setActiveTab('settings')}>
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </nav>
        </aside>
      )}

      {/* Topbar */}
      {activeSubView === 'none' && (
        <header id="topbar" className="topbar">
          <div className="topbar-logo" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', fontWeight: 900 }} onClick={() => setActiveTab('home')}>Velmorth</span>
            <div style={{ display: 'flex', gap: '12px', marginLeft: '16px', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
              <button title="Leagues" onClick={() => setActiveTab('leaderboard')} style={{ border: 'none', background: 'transparent', color: activeTab === 'leaderboard' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Trophy size={16} /></button>
              <button title="Social" onClick={() => setActiveTab('social')} style={{ border: 'none', background: 'transparent', color: activeTab === 'social' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Users size={16} /></button>
              <button title="Analytics" onClick={() => setActiveTab('analytics')} style={{ border: 'none', background: 'transparent', color: activeTab === 'analytics' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><BarChart2 size={16} /></button>
              <button title="Profile" onClick={() => setActiveTab('profile')} style={{ border: 'none', background: 'transparent', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><User size={16} /></button>
              <button title="Settings" onClick={() => setActiveTab('settings')} style={{ border: 'none', background: 'transparent', color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Settings size={16} /></button>
            </div>
          </div>
          <div className="topbar-stats">
            <div className="stat-pill xp" title="Total XP balance">
              <span className="icon">🏆</span>
              <span>{activeState.xp}</span>
            </div>
            <div className="stat-pill streak" title="Daily active streak">
              <span className="icon">🔥</span>
              <span>{activeState.streak}</span>
              {activeState.streakShield?.active && <span className="shield-micro">🛡️</span>}
            </div>
            <div className="stat-pill hearts" title="Refill hearts balance">
              <span className="icon">❤️</span>
              <span>{activeState.hearts}</span>
            </div>
            <div className="stat-pill gems" title="Shop currency gems">
              <span className="icon">💎</span>
              <span>{activeState.gems}</span>
            </div>
            {!profile?.isPremium && (
              <button
                id="btn-upgrade-premium"
                onClick={() => setShowPremiumModal(true)}
                style={{
                  background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                  color: '#000',
                  border: 'none',
                  borderRadius: 'var(--radius-pill)',
                  padding: '4px 10px',
                  fontWeight: 800,
                  fontSize: 11,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                👑 PRO
              </button>
            )}
          </div>
        </header>
      )}

      {/* Page Content */}
      <main id="page-content" className="main-content" style={{ paddingTop: activeSubView !== 'none' ? '0px' : 'var(--topbar-height)' }}>
        {activeSubView === 'none' && ['home', 'learn'].includes(activeTab) ? (
          <div className="dashboard-three-col">
            <div className="center-content-column">
              {renderActiveTab()}
            </div>
            <aside className="stats-panel-card">
              {/* 1. Streak */}
              <div className="streak-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
                <span className="streak-flame" style={{ fontSize: '32px' }}>🔥</span>
                <div>
                  <div className="streak-count" style={{ fontSize: 'var(--text-2xl)', color: 'var(--xp-gold)' }}>{activeState.streak} Days</div>
                  <div className="streak-label" style={{ fontSize: 'var(--text-xs)' }}>ACTIVE STREAK</div>
                </div>
              </div>

              {/* 2. Daily Goal Progress */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--xp-gold)' }}>DAILY GOAL</span>
                  <span>{activeState.xp % 50} / 50 XP</span>
                </div>
                <div className="lesson-progress-bar" style={{ height: '8px', marginBottom: '4px' }}>
                  <div className="lesson-progress-fill" style={{ width: `${Math.min(100, ((activeState.xp % 50) / 50) * 100)}%` }} />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-3)', textAlign: 'right' }}>
                  {Math.min(100, Math.round(((activeState.xp % 50) / 50) * 100))}% Completed
                </span>
              </div>

              {/* 3. XP Progress */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>XP PROGRESS</h4>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={16} style={{ color: 'var(--xp-gold)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Total Earned</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--xp-gold)' }}>{activeState.xp} XP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={16} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>Current Level</span>
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--primary)' }}>Level {Math.floor((activeState.xp || 0) / 100) + 1}</span>
                </div>
              </div>

              {/* 4. Weekly Goal Progress Graph */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>WEEKLY PROGRESS</h4>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', padding: '0 4px' }}>
                  {[12, 24, 0, 45, 10, 50, 15].map((xp, index) => {
                    const pct = Math.min(100, (xp / 50) * 100);
                    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    return (
                      <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%', justifyContent: 'flex-end', gap: '4px' }}>
                        <div style={{ width: '100%', height: `${pct || 8}%`, background: xp >= 50 ? 'var(--success)' : xp > 0 ? 'var(--primary)' : 'var(--surface-2)', borderRadius: '4px' }} title={`${xp} XP`} />
                        <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>{days[index]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Leaderboard Summary */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} onClick={() => setActiveTab('leaderboard')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>LEADERBOARD</h4>
                  <span style={{ fontSize: '11px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>View All</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-2)', padding: '8px 12px', borderRadius: 'var(--radius)', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>🏆 Velmorth</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--xp-gold)' }}>1,240 XP</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-2)', padding: '8px 12px', borderRadius: 'var(--radius)', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>⚡ Mannish</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-2)' }}>1,120 XP</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-2)', padding: '8px 12px', borderRadius: 'var(--radius)', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>⭐ Tanaka</span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: '#cd7c2f' }}>980 XP</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          renderActiveTab()
        )}
      </main>

      {/* Bottom Navbar — 5 tabs for core learning loops (Mobile only) */}
      {activeSubView === 'none' && (
        <nav className="bottom-nav">
          <button className={cn({ active: activeTab === 'home' })} onClick={() => setActiveTab('home')}>
            <Flame size={20} />
            <span>Home</span>
          </button>
          <button className={cn({ active: activeTab === 'learn' })} onClick={() => setActiveTab('learn')}>
            <BookOpen size={20} />
            <span>Learn</span>
          </button>
          <button className={cn({ active: activeTab === 'review' })} onClick={() => setActiveTab('review')}>
            <RotateCcw size={20} />
            <span>Review</span>
          </button>
          <button className={cn({ active: activeTab === 'speak' })} onClick={() => setActiveTab('speak')}>
            <Mic size={20} />
            <span>Speak</span>
          </button>
          <button className={cn({ active: activeTab === 'profile' })} onClick={() => setActiveTab('profile')}>
            <User size={20} />
            <span>Profile</span>
          </button>
        </nav>
      )}
      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
    </>
  );
}
