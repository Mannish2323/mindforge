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
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  } = useStore();

  const [activeTab, setActiveTab] = useState<'learn' | 'review' | 'leaderboard' | 'profile' | 'settings'>('learn');
  const [activeSubView, setActiveSubView] = useState<'none' | 'hiragana' | 'jlpt-plan' | 'phrases' | 'lesson-player'>('none');
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
  const [aiLoading, setAiLoading] = useState(false);

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

    // Sync to Spaced Repetition (SRS)
    lesson.vocabulary?.forEach((v: any) => {
      handleSRSCardUpdate(v, 1);
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  // Ask Python AI Tutor Grammar explanation
  const askAITutor = async (q: any) => {
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
      setAiTutorAnswer("Python AI Tutor is currently sleeping. Rule formula: [Base Sentence Structure] represents this meaning.");
    } finally {
      setAiLoading(false);
    }
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

  // --- Sub-View: JLPT N5 Month Plan ---
  const renderJLPTPlanView = () => {
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
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <Button variant="ghost" size="sm" onClick={() => setActiveSubView('none')}>← Back</Button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>JLPT N5 2-Month study plan</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {scheduleWeeks.map(w => (
            <Card key={w.week}>
              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <div style={{
                  background: 'var(--grad-primary)',
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                  flexShrink: 0
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

            {isAnswered && !isCorrect && (
              <div style={{ marginTop: 'var(--space-3)' }}>
                <Button variant="ghost" size="sm" onClick={() => askAITutor(q)} disabled={aiLoading}>
                  {aiLoading ? 'Asking Tutor...' : '💡 Ask AI Tutor explaining grammar'}
                </Button>
                {aiTutorAnswer && (
                  <Card style={{ marginTop: 'var(--space-3)', background: 'var(--bg-surface)' }}>
                    <p style={{ fontSize: 'var(--text-sm)', whiteSpace: 'pre-line' }}>{aiTutorAnswer}</p>
                  </Card>
                )}
              </div>
            )}

            <div style={{ marginTop: 'var(--space-5)' }}>
              {!isAnswered ? (
                <Button variant="primary" fullWidth size="lg" disabled={!selectedAns} onClick={checkAnswer}>
                  Check Answer
                </Button>
              ) : (
                <Button variant={isCorrect ? 'primary' : 'danger'} fullWidth size="lg" onClick={handleNextQuestion}>
                  {isCorrect ? 'Continue' : 'Got it'}
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

        {/* Shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <button className="mcq-btn" onClick={() => setActiveSubView('hiragana')}>
            <span style={{ fontSize: '20px' }}>あ</span>
            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Chart</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('jlpt-plan')}>
            <span style={{ fontSize: '20px' }}>📅</span>
            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Plan</span>
          </button>
          <button className="mcq-btn" onClick={() => setActiveSubView('phrases')}>
            <span style={{ fontSize: '20px' }}>🗣️</span>
            <span style={{ display: 'block', fontSize: '11px', marginTop: '4px' }}>Phrases</span>
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
    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>Spaced Repetition</h2>
          <p>Review vocab cards based on SM-2</p>
        </div>

        <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-3)' }}>⚡</div>
          <h3>Cards Due for Review</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 var(--space-5)' }}>
            You have <strong>{dueCardsList.length}</strong> cards ready to revise.
          </p>
          {dueCardsList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {dueCardsList.map((card) => (
                <div key={card.vocab_id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-surface)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontFamily: 'var(--font-ja)', fontSize: '20px', fontWeight: 'bold' }}>{card.kanji}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>{card.romaji}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Button variant="secondary" size="sm" onClick={() => handleSRSCardUpdate(card, 0)}>Hard</Button>
                    <Button variant="primary" size="sm" onClick={() => handleSRSCardUpdate(card, 2)}>Easy</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Come back later or complete more lessons!</p>
          )}
        </Card>
      </div>
    );
  };

  const renderLeaderboardTab = () => {
    const board = getLeaderboardList();
    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>Silver League</h2>
          <p>Compete weekly with other learners</p>
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
                <span style={{ fontWeight: 'bold', width: '20px' }}>#{u.rank}</span>
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
    const heatmap = getHeatmapList();
    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div className="home-header">
          <h2>Profile Stats</h2>
          <p>Track your Japanese learning metrics</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
          <Card style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '12px' }}>TOTAL XP</h4>
            <h2 style={{ fontSize: '28px', color: 'var(--amber)', fontWeight: 'bold', marginTop: '4px' }}>{state.xp}</h2>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '12px' }}>STREAK</h4>
            <h2 style={{ fontSize: '28px', color: 'var(--orange)', fontWeight: 'bold', marginTop: '4px' }}>{state.streak} 🔥</h2>
          </Card>
        </div>

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

        <Button variant="secondary" fullWidth onClick={triggerJavaSync}>
          💼 Sync stats to enterprise (Java backend)
        </Button>
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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'learn': return renderLearnTab();
      case 'review': return renderReviewTab();
      case 'leaderboard': return renderLeaderboardTab();
      case 'profile': return renderProfileTab();
      case 'settings': return renderSettingsTab();
    }
  };

  return (
    <>
      {/* Topbar */}
      {activeSubView === 'none' && (
        <header id="topbar">
          <div className="topbar-logo">EVLO</div>
          <div className="topbar-stats">
            <div className="stat-pill xp" title="Total XP balance">
              <span className="icon">🏆</span>
              <span>{state.xp}</span>
            </div>
            <div className="stat-pill streak" title="Daily active streak">
              <span className="icon">🔥</span>
              <span>{state.streak}</span>
            </div>
            <div className="stat-pill hearts" title="Refill hearts balance">
              <span className="icon">❤️</span>
              <span>{state.hearts}</span>
            </div>
            <div className="stat-pill gems" title="Shop currency gems">
              <span className="icon">💎</span>
              <span>{state.gems}</span>
            </div>
          </div>
        </header>
      )}

      {/* Page Content */}
      <main id="page-content" style={{ paddingTop: activeSubView !== 'none' ? '0px' : 'var(--topbar-height)' }}>
        {renderActiveTab()}
      </main>

      {/* Bottom Navbar */}
      {activeSubView === 'none' && (
        <nav id="bottom-nav">
          <div className={cn('nav-item', { active: activeTab === 'learn' })} onClick={() => setActiveTab('learn')}>
            <BookOpen className="nav-icon" size={20} />
            <span>Learn</span>
          </div>
          <div className={cn('nav-item', { active: activeTab === 'review' })} onClick={() => setActiveTab('review')}>
            <RotateCcw className="nav-icon" size={20} />
            <span>Review</span>
          </div>
          <div className={cn('nav-item', { active: activeTab === 'leaderboard' })} onClick={() => setActiveTab('leaderboard')}>
            <Trophy className="nav-icon" size={20} />
            <span>Leagues</span>
          </div>
          <div className={cn('nav-item', { active: activeTab === 'profile' })} onClick={() => setActiveTab('profile')}>
            <User className="nav-icon" size={20} />
            <span>Profile</span>
          </div>
          <div className={cn('nav-item', { active: activeTab === 'settings' })} onClick={() => setActiveTab('settings')}>
            <Settings className="nav-icon" size={20} />
            <span>Settings</span>
          </div>
        </nav>
      )}
    </>
  );
}
