// ================================================================
// Learn with Velmorth — Writing Practice Main View
// ================================================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, Award, RefreshCw, BookOpen, Sparkles, Check, 
  ArrowRight, Star, HelpCircle, MessageSquare, Flame, Zap, Award as BadgeIcon
} from 'lucide-react';
import { speakText } from '@evlo/utils';
import { createClient } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { WritingCanvas } from './WritingCanvas';
import { 
  CharacterMeta, HIRAGANA_META, KATAKANA_META, KANJI_META, 
  getStrokePaths, getUnicodeHex 
} from './strokeData';
import { 
  Point, evaluateCharacter, evaluateStroke, CharacterEvaluation 
} from '../../lib/writingEvaluator';

export function WritingPracticeView() {
  const { user, profile, updateProfileStats } = useAuth();
  const supabase = createClient();

  // Active View states
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [activeLevel, setActiveLevel] = useState<'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('N5');
  const [selectedChar, setSelectedChar] = useState<CharacterMeta | null>(null);
  const [characterList, setCharacterList] = useState<CharacterMeta[]>([]);
  const [masteryData, setMasteryData] = useState<Record<string, number>>({}); // char_id -> level (0-5)
  const [weakCharacters, setWeakCharacters] = useState<string[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Learning flow states: 'select' | 'learn' | 'trace' | 'blind' | 'feedback'
  const [flowStep, setFlowStep] = useState<'select' | 'learn' | 'trace' | 'blind' | 'feedback'>('select');
  const [strokePaths, setStrokePaths] = useState<string[]>([]);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState(0);
  const [completedStrokes, setCompletedStrokes] = useState<Point[][]>([]);
  const [isCorrectStroke, setIsCorrectStroke] = useState<boolean | null>(null);

  // Undo/Redo Stacks
  const [redoStack, setRedoStack] = useState<Point[][]>([]);


  // Feedback / Evaluation states
  const [evaluation, setEvaluation] = useState<CharacterEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [badgeUnlocked, setBadgeUnlocked] = useState<string | null>(null);

  // AI Sensei Coach Coach states
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [canvasSnapshot, setCanvasSnapshot] = useState<string>('');

  // Fetch character definitions on tab / level change
  useEffect(() => {
    setIsLoadingList(true);
    let list: CharacterMeta[] = [];
    if (activeTab === 'hiragana') {
      list = HIRAGANA_META;
    } else if (activeTab === 'katakana') {
      list = KATAKANA_META;
    } else if (activeTab === 'kanji') {
      // Filter Kanji by JLPT level. Fallback to KANJI_META which are static N5 characters
      list = KANJI_META.filter(c => c.level === activeLevel);
      if (list.length === 0 && activeLevel !== 'N5') {
        // Fallback or generate placeholders dynamically for higher levels
        // In production, Kanji list would load from database or comprehensive dataset
        // Let's generate a few common N4-N1 kanji dynamically for testing
        const sampleKanji: Record<string, CharacterMeta[]> = {
          'N4': [
            { char: '会', romaji: 'kai / au', meaning: 'Meet', type: 'kanji', level: 'N4', strokesCount: 6, hints: 'A roof over two people meeting.', examples: [{ japanese: '会社', romaji: 'kaisha', meaning: 'Company' }] },
            { char: '同', romaji: 'dou / onaji', meaning: 'Same', type: 'kanji', level: 'N4', strokesCount: 6, hints: 'A frame enclosing one mouth saying the same thing.', examples: [{ japanese: '同じ', romaji: 'onaji', meaning: 'Same' }] }
          ],
          'N3': [
            { char: '最', romaji: 'sai / motto', meaning: 'Most', type: 'kanji', level: 'N3', strokesCount: 12, hints: 'Sun on top of a ear and take, meaning the absolute most.', examples: [{ japanese: '最近', romaji: 'saikin', meaning: 'Recently' }] },
            { char: '新', romaji: 'shin / atarashii', meaning: 'New', type: 'kanji', level: 'N3', strokesCount: 13, hints: 'A standing tree cut by an axe to make new wood.', examples: [{ japanese: '新しい', romaji: 'atarashii', meaning: 'New' }] }
          ],
          'N2': [
            { char: '情', romaji: 'jou / nasake', meaning: 'Emotion / Info', type: 'kanji', level: 'N2', strokesCount: 11, hints: 'Heart next to green (growth/youth), representing pure emotion.', examples: [{ japanese: '情報', romaji: 'jouhou', meaning: 'Information' }] }
          ],
          'N1': [
            { char: '厳', romaji: 'gen / kibishii', meaning: 'Strict', type: 'kanji', level: 'N1', strokesCount: 17, hints: 'Two cliffs enclosing a strict rule.', examples: [{ japanese: '厳しい', romaji: 'kibishii', meaning: 'Strict / Severe' }] }
          ]
        };
        list = sampleKanji[activeLevel] || [];
      }
    }
    setCharacterList(list);
    setIsLoadingList(false);
  }, [activeTab, activeLevel]);

  // Load user writing progress from Supabase
  const loadUserProgress = async () => {
    if (!user) return;
    try {
      const { data: mastery, error: masteryErr } = await supabase
        .from('writing_mastery')
        .select('char_id, mastery_level, last_score');

      if (masteryErr) throw masteryErr;

      const masteryMap: Record<string, number> = {};
      const weakList: string[] = [];

      mastery.forEach((item: any) => {
        masteryMap[item.char_id] = item.mastery_level;
        if (item.last_score < 70 && item.attempts > 0) {
          weakList.push(item.char_id);
        }
      });

      setMasteryData(masteryMap);
      setWeakCharacters(weakList);
    } catch (err) {
      console.error('Error loading writing progress:', err);
    }
  };

  useEffect(() => {
    loadUserProgress();
  }, [user, flowStep]);

  const handlePlaySound = (text: string) => {
    speakText(text, 'ja-JP');
  };

  const startLearningFlow = async (char: CharacterMeta) => {
    setSelectedChar(char);
    setIsEvaluating(false);
    setFlowStep('learn');
    handlePlaySound(char.char);
    
    // Load SVG paths (statically packaged or fetched from KanjiVG CDN)
    const paths = await getStrokePaths(char.char);
    setStrokePaths(paths);
  };

  const startGuidedTrace = () => {
    setCompletedStrokes([]);
    setCurrentStrokeIndex(0);
    setRedoStack([]);
    setFlowStep('trace');
  };

  const startBlindWrite = () => {
    setCompletedStrokes([]);
    setCurrentStrokeIndex(0);
    setRedoStack([]);
    setFlowStep('blind');
  };

  // Canvas Actions
  const handleUndo = () => {
    if (completedStrokes.length === 0) return;
    const newStrokes = [...completedStrokes];
    const undone = newStrokes.pop();
    if (undone) {
      setRedoStack((prev) => [undone, ...prev]);
    }
    setCompletedStrokes(newStrokes);
    setCurrentStrokeIndex((prev) => Math.max(0, prev - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextStrokes = [...redoStack];
    const redone = nextStrokes.shift();
    if (redone) {
      setCompletedStrokes((prev) => [...prev, redone]);
      setCurrentStrokeIndex((prev) => Math.min(strokePaths.length - 1, prev + 1));
    }
    setRedoStack(nextStrokes);
  };

  const handleClear = () => {
    setCompletedStrokes([]);
    setCurrentStrokeIndex(0);
    setRedoStack([]);
  };

  // Stroke completion callback
  const handleStrokeComplete = (strokePoints: Point[]) => {
    if (flowStep === 'trace') {
      // 1. Tracing mode checks each stroke in real-time
      const targetPath = strokePaths[currentStrokeIndex];
      const evaluation = evaluateStroke(strokePoints, targetPath, currentStrokeIndex, currentStrokeIndex);

      if (evaluation.accuracyScore >= 65 && evaluation.isCorrectDirection && evaluation.isCorrectOrder) {
        // Correct stroke! Save it and go to the next one
        setIsCorrectStroke(true);
        setCompletedStrokes((prev) => [...prev, strokePoints]);
        setRedoStack([]);
        setCurrentStrokeIndex((prev) => prev + 1);

        setTimeout(() => setIsCorrectStroke(null), 800);
      } else {
        // Failed stroke. Flash red and show guidelines
        setIsCorrectStroke(false);
        setTimeout(() => setIsCorrectStroke(null), 800);
      }
    } else {
      // 2. Blind write mode allows writing all strokes before evaluation
      setCompletedStrokes((prev) => [...prev, strokePoints]);
      setRedoStack([]);
      setCurrentStrokeIndex((prev) => prev + 1);
    }
  };


  // Evaluate the entire drawing
  const submitDrawingForEvaluation = async () => {
    if (!selectedChar) return;
    setIsEvaluating(true);

    const evalResult = evaluateCharacter(completedStrokes, strokePaths);
    setEvaluation(evalResult);

    // Save snapshot of canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      setCanvasSnapshot(canvas.toDataURL('image/png'));
    }

    // Reward XP & save history/mastery to Supabase
    let earned = 15; // base XP
    if (evalResult.overallScore >= 90) {
      earned += 15; // perfect score bonus
    }
    setXpEarned(earned);

    if (user) {
      try {
        // 1. Insert Writing History
        const { error: histErr } = await supabase.from('writing_history').insert({
          user_id: user.id,
          char_id: selectedChar.char,
          char_type: selectedChar.type,
          level: selectedChar.level,
          accuracy_score: evalResult.accuracyScore,
          stroke_order_score: evalResult.strokeOrderScore,
          shape_score: evalResult.shapeScore,
          proportion_score: evalResult.proportionScore,
          suggestions: evalResult.suggestions,
        });

        if (histErr) throw histErr;

        // 2. Load current mastery attempts to compute new mastery level
        const currentMastery = masteryData[selectedChar.char] || 0;
        let newMasteryLevel = currentMastery;

        if (evalResult.overallScore >= 90) {
          newMasteryLevel = Math.min(5, currentMastery + 1);
        } else if (evalResult.overallScore < 60) {
          newMasteryLevel = Math.max(0, currentMastery - 1);
        }

        // 3. Upsert Writing Mastery
        const { error: mastErr } = await supabase.from('writing_mastery').upsert({
          user_id: user.id,
          char_id: selectedChar.char,
          char_type: selectedChar.type,
          level: selectedChar.level,
          mastery_level: newMasteryLevel,
          attempts: 1, // Will be accumulated dynamically by supabase insert defaults
          last_score: evalResult.overallScore,
          updated_at: new Date().toISOString(),
        });

        if (mastErr) throw mastErr;

        // 4. Check Calligrapher Achievement Badge
        if (evalResult.overallScore === 100) {
          // Check how many perfect scores this user has in history
          const { count, error: countErr } = await supabase
            .from('writing_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('accuracy_score', 100);

          if (!countErr && count && count >= 10) {
            // Unlock calligrapher badge
            const { error: badgeErr } = await supabase.from('user_badges').insert({
              user_id: user.id,
              badge_id: 'writing_master_10',
            });
            if (!badgeErr) {
              setBadgeUnlocked('Calligrapher');
            }
          }
        }

        // 5. Update user stats / XP
        await updateProfileStats(earned, 0);

      } catch (dbErr) {
        console.error('Error updating writing database records:', dbErr);
      }
    }

    setFlowStep('feedback');
    setIsEvaluating(false);
  };

  // Call Gemini AI Writing Coach Critique
  const getAISenseiCritique = async () => {
    if (!selectedChar || !canvasSnapshot) return;
    setIsAiLoading(true);
    setAiFeedback('');

    try {
      const cleanBase64 = canvasSnapshot.replace(/^data:image\/\w+;base64,/, '');

      const res = await fetch('/api/ai/writing-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: selectedChar.char,
          image: cleanBase64,
        }),
      });

      if (!res.ok) {
        throw new Error('AI Coach response was not ok');
      }

      const data = await res.json();
      setAiFeedback(data.feedback);
    } catch (err) {
      console.error('Error getting AI coach critique:', err);
      setAiFeedback('💡 Velmorth Sensei Tip: Pay close attention to curves and line weight. Take your time drawing and trace carefully!');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 text-zinc-100 min-h-[calc(100vh-100px)]">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-400 flex items-center gap-2">
            🖌️ Shodo Studio
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Master Hiragana, Katakana, and Kanji stroke-by-stroke with real-time AI critique.
          </p>
        </div>

        {/* Global XP/Streak display */}
        <div className="flex gap-4 items-center bg-zinc-900/60 border border-zinc-800 px-4 py-2 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Flame size={18} className="fill-amber-500/20" />
            <span>{profile?.streak || 0} Day Streak</span>
          </div>
          <div className="w-[1px] h-6 bg-zinc-800" />
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Zap size={18} className="fill-emerald-400/20" />
            <span>{profile?.xp || 0} XP</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ── STEP 1: SELECT CHARACTER VIEW ── */}
        {flowStep === 'select' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Nav tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg">
              {(['hiragana', 'katakana', 'kanji'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-h-[44px] text-sm font-black capitalize rounded-xl transition-all ${
                    activeTab === tab 
                      ? 'bg-emerald-500 text-zinc-950 font-extrabold shadow-md' 
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Kanji JLPT selector */}
            {activeTab === 'kanji' && (
              <div className="flex flex-wrap gap-2 p-1 bg-zinc-900/50 border border-zinc-850 rounded-xl max-w-md">
                {(['N5', 'N4', 'N3', 'N2', 'N1'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={`flex-1 min-h-[36px] text-xs font-black rounded-lg transition-all ${
                      activeLevel === lvl 
                        ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                        : 'text-zinc-500 hover:text-zinc-350 border border-transparent'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            )}

            {/* Character grid */}
            <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-zinc-300 mb-4 flex items-center gap-2 capitalize">
                <BookOpen size={18} /> {activeTab} Characters
              </h2>

              {isLoadingList ? (
                <div className="grid grid-columns grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-zinc-900 animate-pulse rounded-2xl border border-zinc-850" />
                  ))}
                </div>
              ) : characterList.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl">
                  <HelpCircle className="mx-auto text-zinc-650 mb-3" size={32} />
                  <p className="text-sm text-zinc-500">No characters found for this category yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                  {characterList.map((char) => {
                    const level = masteryData[char.char] || 0;
                    const isWeak = weakCharacters.includes(char.char);
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={char.char}
                        onClick={() => startLearningFlow(char)}
                        className={`relative aspect-square flex flex-col items-center justify-center border rounded-2xl p-3 bg-zinc-900 border-zinc-850 hover:border-emerald-500/50 hover:bg-zinc-900/60 shadow-lg text-center transition-all ${
                          isWeak ? 'border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.05)]' : ''
                        }`}
                      >
                        {/* Weak indicator */}
                        {isWeak && (
                          <div className="absolute top-2 right-2 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-bold border border-red-500/30">
                            Review
                          </div>
                        )}

                        <span className="text-3xl font-bold font-ja text-emerald-400 mb-1">{char.char}</span>
                        <span className="text-xs text-zinc-400 font-medium">/{char.romaji}/</span>
                        
                        {/* Mastery stars */}
                        <div className="flex gap-0.5 mt-2">
                          {Array(5).fill(0).map((_, i) => (
                            <Star 
                              key={i} 
                              size={10} 
                              className={i < level ? 'fill-amber-400 text-amber-400' : 'text-zinc-700'} 
                            />
                          ))}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: INTRODUCE CHARACTER FLOW ── */}
        {flowStep === 'learn' && selectedChar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
          >
            {/* Left: Info Card */}
            <div className="flex flex-col gap-6 bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 md:p-8 shadow-xl justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 capitalize">
                    {selectedChar.type} Study
                  </span>
                  <button 
                    onClick={() => setFlowStep('select')}
                    className="text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    ← Exit Practice
                  </button>
                </div>

                <div className="text-center py-6">
                  <span className="text-8xl md:text-9xl font-black font-ja text-emerald-400 select-none">
                    {selectedChar.char}
                  </span>
                  <h3 className="text-2xl font-black mt-4">
                    {selectedChar.type === 'kanji' ? `"${selectedChar.meaning}"` : `/${selectedChar.romaji}/`}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-1">Pronunciation: /{selectedChar.romaji}/</p>
                </div>

                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handlePlaySound(selectedChar.char)}
                    className="min-h-[44px] px-6 bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                  >
                    <Volume2 size={18} /> Listen Pronunciation
                  </button>
                </div>

                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl mt-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">💡 Sensei Mnemonics</h4>
                  <p className="text-sm text-zinc-350">{selectedChar.hints}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={startGuidedTrace}
                  className="flex-1 min-h-[50px] bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  Start Guided Trace <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* Right: Example Words */}
            <div className="flex flex-col gap-6 bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 md:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-zinc-300">📖 Example Words</h3>
              
              <div className="flex flex-col gap-4">
                {selectedChar.examples.map((ex, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-zinc-950 border border-zinc-850 rounded-2xl hover:border-emerald-500/20 transition-all">
                    <div>
                      <h4 className="text-2xl font-bold font-ja text-emerald-400">{ex.japanese}</h4>
                      <p className="text-xs text-zinc-500 font-medium">/{ex.romaji}/</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-300">{ex.meaning}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stroke Order Animation Preview */}
              <div className="mt-auto">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">🖊️ Stroke Order Animation ({selectedChar.strokesCount} Strokes)</h4>
                <div className="aspect-video max-w-xs mx-auto border border-zinc-850 bg-zinc-950 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <svg className="w-1/2 h-1/2 text-zinc-800" viewBox="0 0 109 109">
                    {strokePaths.map((d, index) => (
                      <path
                        key={index}
                        d={d}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                    {strokePaths.map((d, index) => (
                      <path
                        key={`play-${index}`}
                        d={d}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                          strokeDasharray: '200',
                          strokeDashoffset: '200',
                          animation: `drawStrokePlay 3s infinite linear`,
                          animationDelay: `${index * 0.8}s`
                        }}
                      />
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3 & 4: GUIDED TRACE & BLIND WRITE CANVAS ── */}
        {(flowStep === 'trace' || flowStep === 'blind') && selectedChar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
          >
            {/* Left Box: Directions */}
            <div className="flex flex-col gap-6 bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 md:p-8 shadow-xl justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 capitalize">
                    {flowStep === 'trace' ? 'Step 1: Guided Trace' : 'Step 2: Write from Memory'}
                  </span>
                  <button 
                    onClick={handleClear}
                    className="text-xs text-zinc-400 hover:text-zinc-250 flex items-center gap-1"
                  >
                    Clear Drawing
                  </button>
                </div>

                <div className="text-center py-4">
                  <h3 className="text-2xl font-black">
                    {flowStep === 'trace' ? 'Trace the Character' : 'Write from Memory'}
                  </h3>
                  <p className="text-sm text-zinc-500 mt-2">
                    {flowStep === 'trace' 
                      ? 'Follow the animated white guide stroke-by-stroke.' 
                      : `Write "${selectedChar.char}" (/${selectedChar.romaji}/) without any guides.`}
                  </p>
                </div>

                {/* Real-time stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl text-center">
                    <span className="block text-xs text-zinc-500 font-bold uppercase tracking-wider">Strokes drawn</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1">
                      {completedStrokes.length} <span className="text-zinc-650">/ {strokePaths.length}</span>
                    </span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl text-center">
                    <span className="block text-xs text-zinc-500 font-bold uppercase tracking-wider">Target Level</span>
                    <span className="text-2xl font-black text-emerald-400 mt-1 uppercase">
                      {selectedChar.level}
                    </span>
                  </div>
                </div>

                {/* Helpful tips overlay */}
                {flowStep === 'trace' && (
                  <div className="bg-zinc-950 border border-emerald-500/10 p-4 rounded-2xl mt-4 flex items-start gap-3">
                    <HelpCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300">Stroke Order Tip</h4>
                      <p className="text-xs text-zinc-450 mt-1">
                        Always write top-to-bottom and left-to-right. The flashing line shows the correct path.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation button */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => startLearningFlow(selectedChar)}
                  className="flex-1 min-h-[50px] bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 font-bold rounded-2xl flex items-center justify-center transition-all"
                >
                  Back
                </button>
                {flowStep === 'trace' && completedStrokes.length === strokePaths.length ? (
                  <button
                    onClick={startBlindWrite}
                    className="flex-1 min-h-[50px] bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    Continue to Test <ArrowRight size={18} />
                  </button>
                ) : flowStep === 'blind' && completedStrokes.length > 0 ? (
                  <button
                    onClick={submitDrawingForEvaluation}
                    disabled={isEvaluating}
                    className="flex-1 min-h-[50px] bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:hover:bg-emerald-500 transition-all"
                  >
                    {isEvaluating ? 'Evaluating...' : 'Evaluate Calligraphy'} <ArrowRight size={18} />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right Box: Writing Canvas */}
            <div className="flex flex-col items-center bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 md:p-8 shadow-xl">
              <WritingCanvas
                strokePaths={strokePaths}
                currentStrokeIndex={currentStrokeIndex}
                mode={flowStep}
                onStrokeComplete={handleStrokeComplete}
                completedStrokes={completedStrokes}
                undo={handleUndo}
                redo={handleRedo}
                clear={handleClear}
                canUndo={completedStrokes.length > 0}
                canRedo={redoStack.length > 0}
                isCorrectStroke={isCorrectStroke}
              />
            </div>
          </motion.div>
        )}

        {/* ── STEP 5: SCORED FEEDBACK & AI COACH VIEW ── */}
        {flowStep === 'feedback' && selectedChar && evaluation && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-8"
          >
            {/* Header score card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score breakdown */}
              <div className="md:col-span-2 bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-zinc-300 mb-6 flex items-center gap-2">
                    📊 Writing Score Analysis
                  </h3>

                  <div className="flex flex-col gap-5">
                    {/* Accuracy Score */}
                    <div>
                      <div className="flex justify-between text-sm font-bold text-zinc-400 mb-1">
                        <span>Accuracy</span>
                        <span className="text-emerald-400">{evaluation.accuracyScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evaluation.accuracyScore}%` }} />
                      </div>
                    </div>

                    {/* Stroke Order Score */}
                    <div>
                      <div className="flex justify-between text-sm font-bold text-zinc-400 mb-1">
                        <span>Stroke Order</span>
                        <span className="text-emerald-400">{evaluation.strokeOrderScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evaluation.strokeOrderScore}%` }} />
                      </div>
                    </div>

                    {/* Shape Score */}
                    <div>
                      <div className="flex justify-between text-sm font-bold text-zinc-400 mb-1">
                        <span>Shape Similarity</span>
                        <span className="text-emerald-400">{evaluation.shapeScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evaluation.shapeScore}%` }} />
                      </div>
                    </div>

                    {/* Proportion Score */}
                    <div>
                      <div className="flex justify-between text-sm font-bold text-zinc-400 mb-1">
                        <span>Proportions & Balance</span>
                        <span className="text-emerald-400">{evaluation.proportionScore}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${evaluation.proportionScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl mt-6 flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">💡 Suggestions for Improvement</h4>
                  {evaluation.suggestions.map((sug, i) => (
                    <p key={i} className="text-sm text-zinc-300">• {sug}</p>
                  ))}
                </div>
              </div>

              {/* Big Score badge & XP rewards */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col items-center justify-center text-center">
                <div className="relative w-36 h-36 flex items-center justify-center bg-zinc-950 border-4 border-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <div className="text-center">
                    <span className="text-5xl font-black text-emerald-400">{evaluation.overallScore}</span>
                    <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">Overall</span>
                  </div>
                </div>

                <h4 className="text-lg font-black text-zinc-200 mt-6">
                  {evaluation.overallScore >= 90 ? 'Sublime Writing!' : evaluation.overallScore >= 75 ? 'Good Effort!' : 'Keep Practicing!'}
                </h4>

                {/* XP Reward card */}
                <div className="mt-4 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/25 px-5 py-2.5 rounded-2xl">
                  <Zap className="text-emerald-400 fill-emerald-400/20 animate-bounce" size={20} />
                  <div className="text-left">
                    <span className="block text-xs text-emerald-400 font-black uppercase tracking-wider">XP Awarded</span>
                    <span className="text-lg font-black text-emerald-300">+{xpEarned} XP</span>
                  </div>
                </div>

                {/* Badge Unlocked Notification */}
                {badgeUnlocked && (
                  <div className="mt-4 flex items-center gap-3 bg-amber-500/10 border border-amber-500/25 px-5 py-2.5 rounded-2xl animate-pulse">
                    <BadgeIcon className="text-amber-400 fill-amber-500/20" size={20} />
                    <div className="text-left">
                      <span className="block text-xs text-amber-400 font-black uppercase tracking-wider">Badge Unlocked!</span>
                      <span className="text-sm font-black text-amber-300">{badgeUnlocked}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom visual overlay & AI Coach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Drawing comparison overlay */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 shadow-xl flex flex-col items-center">
                <h3 className="text-md font-bold text-zinc-300 self-start mb-4">🖊️ Draw Overlay Match</h3>
                
                <div className="relative w-full aspect-square max-w-[280px] bg-zinc-950 border border-zinc-850 rounded-2xl flex items-center justify-center overflow-hidden">
                  {/* Reference strokes (grey) */}
                  <svg className="absolute w-[80%] h-[80%] opacity-20 text-zinc-400" viewBox="0 0 109 109">
                    {strokePaths.map((d, index) => (
                      <path
                        key={index}
                        d={d}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ))}
                  </svg>

                  {/* User strokes overlay */}
                  {canvasSnapshot && (
                    <img 
                      src={canvasSnapshot} 
                      alt="User drawing" 
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none opacity-80"
                    />
                  )}
                </div>
              </div>

              {/* AI Coach panel */}
              <div className="bg-zinc-900/40 border border-zinc-850 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-md font-bold text-zinc-300 mb-2 flex items-center gap-2">
                    <Sparkles className="text-emerald-400" size={18} /> AI Sensei Calligraphy Coach
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    Send your drawing image directly to Velmorth Sensei for a deep visual critique.
                  </p>

                  <AnimatePresence mode="wait">
                    {isAiLoading ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 text-center"
                      >
                        <div className="inline-block w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-3" />
                        <p className="text-sm text-zinc-500">Sensei is analyzing your stroke curvatures...</p>
                      </motion.div>
                    ) : aiFeedback ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-zinc-950/60 border border-zinc-850 p-5 rounded-2xl text-sm leading-relaxed text-zinc-300 relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                        <h4 className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide flex items-center gap-1">
                          <MessageSquare size={12} /> Sensei Review
                        </h4>
                        <p className="font-ja text-sm italic">&ldquo;{aiFeedback}&rdquo;</p>
                      </motion.div>
                    ) : (
                      <div className="py-12 text-center border-2 border-dashed border-zinc-850 rounded-2xl">
                        <Sparkles className="mx-auto text-zinc-700 mb-2" size={24} />
                        <p className="text-xs text-zinc-500">Click below to request your AI calligraphy feedback.</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

                {!aiFeedback && !isAiLoading && (
                  <button
                    onClick={getAISenseiCritique}
                    className="w-full min-h-[44px] mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Sparkles size={16} /> Request Sensei critique
                  </button>
                )}
              </div>

            </div>

            {/* Action buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setFlowStep('select')}
                className="flex-1 min-h-[50px] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-250 font-bold rounded-2xl flex items-center justify-center transition-all"
              >
                Return to Characters
              </button>
              <button
                onClick={() => startLearningFlow(selectedChar)}
                className="flex-1 min-h-[50px] bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                Retry Practice
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
