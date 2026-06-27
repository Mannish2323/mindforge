'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Volume2, ArrowRight, ArrowLeft, Trophy, CheckCircle,
  XCircle, HelpCircle, Star, Sparkles, BookOpen, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, scaleIn } from '@/lib/motion/motion.config';

interface LessonData {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  content: {
    pronunciation?: {
      tips_en?: string[];
      tips_hi?: string[];
    };
    examples?: Array<{
      example_id: string;
      japanese: string;
      romaji: string;
      translation_en: string;
      translation_hi: string;
    }>;
  };
}

interface VocabData {
  id: string;
  word_japanese: string;
  hiragana: string;
  romaji: string;
  english: string;
  hindi: string;
  meaning: string;
  part_of_speech: string;
}

interface GrammarData {
  id: string;
  pattern: string;
  title: string;
  meaning_english: string;
  meaning_hindi: string;
  formation: string;
  notes: string;
  example_japanese: string;
  example_english: string;
}

export default function LessonPlayerPage() {
  const { lesson_id } = useParams() as { lesson_id: string };
  const router = useRouter();
  const { user } = useAuth();
  const { completeLesson } = useStore();

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [vocab, setVocab] = useState<VocabData[]>([]);
  const [grammar, setGrammar] = useState<GrammarData | null>(null);
  const [loading, setLoading] = useState(true);

  // Slides state
  const [slideIndex, setSlideIndex] = useState(0);
  
  // MCQ state
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null);
  const [mcqChecked, setMcqChecked] = useState(false);
  const [mcqIsCorrect, setMcqIsCorrect] = useState(false);

  // Matching state
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [selectedMatchJa, setSelectedMatchJa] = useState<string | null>(null);
  const [selectedMatchEn, setSelectedMatchEn] = useState<string | null>(null);

  // Fill in the blank state
  const [blankAnswer, setBlankAnswer] = useState<string | null>(null);
  const [blankChecked, setBlankChecked] = useState(false);
  const [blankIsCorrect, setBlankIsCorrect] = useState(false);

  // Overall lesson statistics
  const [quizScore, setQuizScore] = useState(0);
  const [synced, setSynced] = useState(false);

  // Fetch lesson data on mount
  useEffect(() => {
    if (!lesson_id) return;
    const fetchLessonContent = async () => {
      try {
        const supabase = createClient();

        // 1. Fetch lesson meta
        const { data: les, error: lesErr } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lesson_id)
          .single();
        if (lesErr || !les) throw new Error('Lesson metadata not found');

        // 2. Fetch vocab items
        const { data: voc, error: vocErr } = await supabase
          .from('vocabulary')
          .select('*')
          .eq('lesson_id', lesson_id);
        if (vocErr) console.error('Error fetching vocab items:', vocErr.message);

        // 3. Fetch grammar points
        const { data: gram, error: gramErr } = await supabase
          .from('grammar')
          .select('*')
          .eq('lesson_id', lesson_id)
          .maybeSingle();
        if (gramErr) console.error('Error fetching grammar points:', gramErr.message);

        setLesson(les as LessonData);
        setVocab(voc || []);
        setGrammar(gram || null);
      } catch (err) {
        console.error('Error loading lesson player content:', err);
        router.replace('/path');
      } finally {
        setLoading(false);
      }
    };
    fetchLessonContent();
  }, [lesson_id, router]);

  // Dynamic slides list computation
  const slides = useMemo(() => {
    if (!lesson) return [];
    const list: Array<{ type: 'intro' | 'vocab' | 'grammar' | 'quiz_mcq' | 'quiz_match' | 'quiz_blank' | 'complete'; data?: any }> = [];
    
    // Slide 0: Intro welcome
    list.push({ type: 'intro' });

    // Slides 1..V: Vocabulary items
    vocab.forEach(v => {
      list.push({ type: 'vocab', data: v });
    });

    // Slide V+1: Grammar (if present)
    if (grammar) {
      list.push({ type: 'grammar', data: grammar });
    }

    // Quiz slide 1: MCQ (if we have at least 1 vocab item)
    if (vocab.length > 0) {
      list.push({ type: 'quiz_mcq' });
    }

    // Quiz slide 2: Matching Pairs (if we have at least 2 vocab items)
    if (vocab.length >= 2) {
      list.push({ type: 'quiz_match' });
    }

    // Quiz slide 3: Fill-in-the-blank (if we have example sentences)
    const hasExample = vocab.some(v => v.word_japanese);
    if (hasExample && vocab.length > 0) {
      list.push({ type: 'quiz_blank' });
    }

    // Final Slide: Completion
    list.push({ type: 'complete' });

    return list;
  }, [lesson, vocab, grammar]);

  // Voice synthesis text-to-speech
  const playSpeech = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Generate options for Multiple Choice Question
  const mcqQuestion = useMemo(() => {
    if (vocab.length === 0) return null;
    const target = vocab[0]; // test first word
    const correct = target.english;
    const distractors = [
      'Good morning',
      'Thank you',
      'Excuse me',
      'Water',
      'School',
      'Teacher',
    ].filter(d => d.toLowerCase() !== correct.toLowerCase());

    const options = [correct, ...distractors.slice(0, 3)].sort(() => Math.random() - 0.5);

    return {
      word: target.word_japanese,
      kana: target.hiragana,
      correct,
      options,
    };
  }, [vocab]);

  // Generate shuffled pairs for matching
  const matchingPairsData = useMemo(() => {
    if (vocab.length < 2) return null;
    const slice = vocab.slice(0, 4); // Match up to 4 items
    const jaItems = slice.map(v => ({ id: v.id, value: v.word_japanese })).sort(() => Math.random() - 0.5);
    const enItems = slice.map(v => ({ id: v.id, value: v.english })).sort(() => Math.random() - 0.5);
    return { jaItems, enItems };
  }, [vocab]);

  // Generate fill in the blank question
  const blankQuestion = useMemo(() => {
    if (vocab.length === 0) return null;
    const target = vocab[vocab.length - 1]; // test last word
    const sentence = target.word_japanese === 'こんにちは' 
      ? '皆さん、_____！'
      : `これは_____です。`;
    const options = [
      target.word_japanese,
      ...vocab.slice(0, -1).map(v => v.word_japanese),
      'はい',
      'いいえ',
    ].slice(0, 4).sort(() => Math.random() - 0.5);

    return {
      sentence,
      correct: target.word_japanese,
      options,
    };
  }, [vocab]);

  // Handle MCQ check
  const checkMCQ = () => {
    if (!selectedMCQOption || !mcqQuestion) return;
    const isCorrect = selectedMCQOption === mcqQuestion.correct;
    setMcqIsCorrect(isCorrect);
    setMcqChecked(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Handle Matching Pairs selection
  const handleMatchSelect = (type: 'ja' | 'en', item: { id: string; value: string }) => {
    if (type === 'ja') {
      setSelectedMatchJa(item.id);
      if (selectedMatchEn === item.id) {
        // Correct pair match!
        setMatchedPairs(prev => ({ ...prev, [item.id]: selectedMatchEn }));
        setSelectedMatchJa(null);
        setSelectedMatchEn(null);
      } else if (selectedMatchEn !== null) {
        // Mismatch - reset selection
        setSelectedMatchJa(null);
        setSelectedMatchEn(null);
      }
    } else {
      setSelectedMatchEn(item.id);
      if (selectedMatchJa === item.id) {
        // Correct pair match!
        setMatchedPairs(prev => ({ ...prev, [selectedMatchJa]: item.id }));
        setSelectedMatchJa(null);
        setSelectedMatchEn(null);
      } else if (selectedMatchJa !== null) {
        // Mismatch - reset selection
        setSelectedMatchJa(null);
        setSelectedMatchEn(null);
      }
    }
  };

  // Handle Blank Check
  const checkBlank = () => {
    if (!blankAnswer || !blankQuestion) return;
    const isCorrect = blankAnswer === blankQuestion.correct;
    setBlankIsCorrect(isCorrect);
    setBlankChecked(true);
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  // Sync completion stats once complete slide is reached
  useEffect(() => {
    if (slides.length > 0 && slideIndex === slides.length - 1 && !synced && lesson) {
      setSynced(true);
      completeLesson(lesson.id, lesson.xp_reward);
    }
  }, [slideIndex, slides, synced, lesson, completeLesson]);

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (slideIndex > 0) {
      setSlideIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09071a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!lesson) return null;

  const currentSlide = slides[slideIndex];
  const progressPercent = (slideIndex / (slides.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#09071a] flex flex-col justify-between p-4 relative overflow-hidden select-none">
      {/* Background soft grids/auras */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(124,58,237,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-30%] left-[-30%] w-[80%] h-[80%] bg-purple-900/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-4 py-2 z-10">
        <Button variant="ghost" size="sm" onClick={() => router.replace('/path')} className="flex items-center gap-1.5 px-3">
          Exit Lesson
        </Button>
        <div className="flex-1 max-w-lg">
          <ProgressBar value={progressPercent} color="brand" size="sm" className="shadow-lg shadow-purple-500/5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300/40 select-none">
          XP REWARD: +{lesson.xp_reward}
        </span>
      </div>

      {/* Slide body area */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex items-center justify-center my-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={scaleIn}
            className="w-full"
          >
            {/* 1. INTRO SLIDE */}
            {currentSlide.type === 'intro' && (
              <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/10">
                  <BookOpen className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl font-black text-white leading-tight bg-gradient-to-r from-purple-100 to-pink-200 bg-clip-text text-transparent">
                  {lesson.title}
                </h1>
                <p className="text-sm text-purple-300/60 mt-3 max-w-md mx-auto leading-relaxed">
                  {lesson.description}
                </p>
                <div className="divider my-6 opacity-30" />
                <div className="flex justify-center gap-4 text-xs font-bold text-purple-300/40 uppercase tracking-widest">
                  <span>🎯 Goal: Teach First</span>
                  <span>⚡ 3 Quiz Questions</span>
                </div>
              </Card>
            )}

            {/* 2. VOCABULARY CARDS SLIDE */}
            {currentSlide.type === 'vocab' && (
              <div className="space-y-4">
                <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl relative">
                  <button
                    onClick={() => playSpeech(currentSlide.data.word_japanese)}
                    className="absolute top-4 right-4 w-10 h-10 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 transition-colors"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest border border-pink-500/20 bg-pink-500/5 px-2 py-0.5 rounded-full">
                    Vocabulary card
                  </span>

                  <h2 className="text-5xl font-black font-jp text-white leading-none mt-6">
                    {currentSlide.data.word_japanese}
                  </h2>
                  <p className="text-sm text-purple-300/50 mt-2 tracking-wide font-medium">
                    {currentSlide.data.hiragana} · <span className="italic">{currentSlide.data.romaji}</span>
                  </p>

                  <div className="divider my-6 opacity-30" />

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-purple-300/30 uppercase tracking-widest block">MEANINGS</span>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {currentSlide.data.english}
                    </h3>
                    {currentSlide.data.hindi && (
                      <p className="text-sm text-purple-300/60 font-medium">
                        {currentSlide.data.hindi}
                      </p>
                    )}
                  </div>

                  {currentSlide.data.meaning && (
                    <div className="bg-purple-950/20 border border-purple-900/10 rounded-xl p-3.5 text-left mt-6">
                      <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-1">NOTES</span>
                      <p className="text-xs text-purple-300/70 leading-relaxed font-medium">
                        {currentSlide.data.meaning}
                      </p>
                    </div>
                  )}
                </Card>

                {/* Example sentence widget if present */}
                {lesson.content.examples && lesson.content.examples.length > 0 && (
                  <Card className="p-5 bg-purple-950/20 border-purple-900/10 text-left">
                    <span className="text-[9px] font-black text-purple-400/40 uppercase tracking-widest block mb-2">SAMPLE CONVERSATION</span>
                    <p className="text-base font-medium font-jp text-white">
                      {lesson.content.examples[0].japanese}
                    </p>
                    <p className="text-xs italic text-purple-300/40 mt-1">
                      {lesson.content.examples[0].romaji}
                    </p>
                    <p className="text-xs text-purple-300/60 mt-1 font-medium">
                      {lesson.content.examples[0].translation_en}
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* 3. GRAMMAR SLIDE */}
            {currentSlide.type === 'grammar' && (
              <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl relative">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded-full">
                  Grammar logic
                </span>

                <h2 className="text-3xl font-black text-white leading-tight mt-6">
                  {currentSlide.data.title}
                </h2>
                <div className="bg-[#0a0815] border border-purple-900/10 rounded-xl py-3 px-4 inline-block mt-3 text-sm font-bold text-purple-300">
                  {currentSlide.data.pattern} <span className="text-xs font-medium text-purple-300/40">({currentSlide.data.formation})</span>
                </div>

                <div className="divider my-6 opacity-30" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-[9px] font-bold text-purple-300/30 uppercase tracking-widest block mb-1">ENGLISH EXPLANATION</span>
                    <p className="text-xs text-purple-300/70 leading-relaxed font-medium">
                      {currentSlide.data.meaning_english}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-purple-300/30 uppercase tracking-widest block mb-1">HINDI EXPLANATION</span>
                    <p className="text-xs text-purple-300/70 leading-relaxed font-medium">
                      {currentSlide.data.meaning_hindi}
                    </p>
                  </div>
                </div>

                {currentSlide.data.notes && (
                  <div className="bg-purple-950/20 border border-purple-900/10 rounded-xl p-3.5 text-left mt-6">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block mb-1">GRAMMAR NOTES</span>
                    <p className="text-xs text-purple-300/70 leading-relaxed font-medium">
                      {currentSlide.data.notes}
                    </p>
                  </div>
                )}
              </Card>
            )}

            {/* 4. QUIZ MCQ SLIDE */}
            {currentSlide.type === 'quiz_mcq' && mcqQuestion && (
              <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20 bg-purple-500/5 px-2.5 py-0.5 rounded-full">
                  QUIZ: 1 of 3
                </span>

                <h2 className="text-lg font-bold text-purple-200/50 mt-6 leading-none">
                  What does this word mean?
                </h2>
                <h3 className="text-4xl font-black font-jp text-white leading-none mt-4">
                  {mcqQuestion.word}
                </h3>
                <p className="text-xs text-purple-300/40 mt-1 italic font-medium">
                  {mcqQuestion.kana}
                </p>

                <div className="grid grid-cols-1 gap-2.5 mt-8">
                  {mcqQuestion.options.map((opt) => {
                    const isSelected = selectedMCQOption === opt;
                    const isCorrectOption = opt === mcqQuestion.correct;
                    
                    let btnStyle = 'bg-[#0a0815] border-purple-900/20 hover:border-purple-800/40 text-purple-200';
                    if (isSelected) {
                      btnStyle = 'bg-purple-500/10 border-purple-500 text-purple-300';
                    }
                    if (mcqChecked) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-green-500/10 border-green-500 text-green-400';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-500/10 border-red-500 text-red-400';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={mcqChecked}
                        onClick={() => setSelectedMCQOption(opt)}
                        className={`w-full py-3.5 px-4 rounded-xl border text-center font-bold text-sm transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedMCQOption && !mcqChecked && (
                  <Button variant="primary" className="w-full mt-6 py-3" onClick={checkMCQ}>
                    Check Answer
                  </Button>
                )}

                {mcqChecked && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold">
                    {mcqIsCorrect ? (
                      <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-5 h-5" /> Correct! Excellent job.</span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-5 h-5" /> Incorrect. Correct is: {mcqQuestion.correct}</span>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* 5. QUIZ MATCH SLIDE */}
            {currentSlide.type === 'quiz_match' && matchingPairsData && (
              <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20 bg-purple-500/5 px-2.5 py-0.5 rounded-full">
                  QUIZ: 2 of 3
                </span>

                <h2 className="text-lg font-bold text-purple-200/50 mt-6 leading-none mb-8">
                  Match the Japanese words with translations
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column: Japanese Words */}
                  <div className="space-y-2">
                    {matchingPairsData.jaItems.map(item => {
                      const isMatched = matchedPairs[item.id] !== undefined;
                      const isSelected = selectedMatchJa === item.id;
                      
                      let blockStyle = 'bg-[#0a0815] border-purple-900/20 hover:border-purple-800/40 text-white';
                      if (isSelected) blockStyle = 'bg-purple-500/10 border-purple-500 text-purple-300';
                      if (isMatched) blockStyle = 'bg-green-500/10 border-green-500/30 text-green-500/60 opacity-50 cursor-not-allowed';

                      return (
                        <button
                          key={item.id}
                          disabled={isMatched}
                          onClick={() => handleMatchSelect('ja', item)}
                          className={`w-full py-4 px-3 rounded-xl border text-center font-bold text-sm transition-all font-jp ${blockStyle}`}
                        >
                          {item.value}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column: English Meanings */}
                  <div className="space-y-2">
                    {matchingPairsData.enItems.map(item => {
                      const isMatched = Object.values(matchedPairs).includes(item.id);
                      const isSelected = selectedMatchEn === item.id;

                      let blockStyle = 'bg-[#0a0815] border-purple-900/20 hover:border-purple-800/40 text-white';
                      if (isSelected) blockStyle = 'bg-purple-500/10 border-purple-500 text-purple-300';
                      if (isMatched) blockStyle = 'bg-green-500/10 border-green-500/30 text-green-500/60 opacity-50 cursor-not-allowed';

                      return (
                        <button
                          key={item.id}
                          disabled={isMatched}
                          onClick={() => handleMatchSelect('en', item)}
                          className={`w-full py-4 px-3 rounded-xl border text-center font-bold text-xs transition-all ${blockStyle}`}
                        >
                          {item.value}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {Object.keys(matchedPairs).length === matchingPairsData.jaItems.length && (
                  <div className="mt-8 text-green-400 flex items-center justify-center gap-1.5 text-sm font-bold">
                    <CheckCircle className="w-5 h-5" /> All pairs matched successfully!
                  </div>
                )}
              </Card>
            )}

            {/* 6. QUIZ FILL IN THE BLANK SLIDE */}
            {currentSlide.type === 'quiz_blank' && blankQuestion && (
              <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest border border-purple-500/20 bg-purple-500/5 px-2.5 py-0.5 rounded-full">
                  QUIZ: 3 of 3
                </span>

                <h2 className="text-lg font-bold text-purple-200/50 mt-6 leading-none mb-6">
                  Complete the sentence with the correct word
                </h2>

                <h3 className="text-3xl font-black font-jp text-white leading-none mb-8">
                  {blankQuestion.sentence.replace('_____', blankAnswer || '_____')}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {blankQuestion.options.map(opt => {
                    const isSelected = blankAnswer === opt;
                    
                    let blockStyle = 'bg-[#0a0815] border-purple-900/20 hover:border-purple-800/40 text-white';
                    if (isSelected) blockStyle = 'bg-purple-500/10 border-purple-500 text-purple-300';
                    if (blankChecked) {
                      if (opt === blankQuestion.correct) {
                        blockStyle = 'bg-green-500/10 border-green-500 text-green-400';
                      } else if (isSelected) {
                        blockStyle = 'bg-red-500/10 border-red-500 text-red-400';
                      }
                    }

                    return (
                      <button
                        key={opt}
                        disabled={blankChecked}
                        onClick={() => setBlankAnswer(opt)}
                        className={`w-full py-3.5 px-3 rounded-xl border text-center font-bold text-sm transition-all font-jp ${blockStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {blankAnswer && !blankChecked && (
                  <Button variant="primary" className="w-full mt-6 py-3" onClick={checkBlank}>
                    Check Answer
                  </Button>
                )}

                {blankChecked && (
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold">
                    {blankIsCorrect ? (
                      <span className="text-green-400 flex items-center gap-1.5"><CheckCircle className="w-5 h-5" /> Correct! Outstanding work.</span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1.5"><XCircle className="w-5 h-5" /> Mismatch. Correct is: {blankQuestion.correct}</span>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* 7. COMPLETE SLIDE */}
            {currentSlide.type === 'complete' && (
              <Card className="p-8 text-center bg-[#120f26]/80 border-purple-800/20 backdrop-blur-xl relative">
                <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                  {/* Glowing background highlights */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/15 rounded-full blur-[40px] pointer-events-none" />
                </div>

                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20 animate-bounce">
                  <Trophy className="w-8 h-8 text-white" />
                </div>

                <h1 className="text-3xl font-black text-white leading-tight">
                  Lesson Complete!
                </h1>
                <p className="text-sm text-purple-300/60 mt-2 max-w-xs mx-auto">
                  You have successfully finished <span className="font-bold text-white">{lesson.title}</span>.
                </p>

                <div className="divider my-6 opacity-30" />

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                  <div className="bg-purple-950/20 border border-purple-900/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-purple-300/30 uppercase tracking-widest block">XP REWARD</span>
                    <span className="text-2xl font-black text-purple-400 block mt-1">+{lesson.xp_reward}</span>
                  </div>
                  <div className="bg-purple-950/20 border border-purple-900/10 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-purple-300/30 uppercase tracking-widest block">QUIZ SCORE</span>
                    <span className="text-2xl font-black text-pink-400 block mt-1">{quizScore}/3</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full max-w-xs py-3.5 rounded-xl font-bold text-sm"
                  onClick={() => router.replace('/path')}
                >
                  Return to Learning Path
                </Button>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer controls bar */}
      <div className="w-full max-w-lg mx-auto flex gap-4 py-4 z-10">
        {slideIndex > 0 && currentSlide.type !== 'complete' && (
          <Button variant="ghost" className="flex-1 py-3" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}
        
        {currentSlide.type !== 'complete' && (
          <Button
            variant="primary"
            className="flex-1 py-3"
            onClick={handleNext}
            disabled={
              (currentSlide.type === 'quiz_mcq' && !mcqChecked) ||
              (currentSlide.type === 'quiz_blank' && !blankChecked) ||
              (currentSlide.type === 'quiz_match' && (matchingPairsData ? Object.keys(matchedPairs).length < matchingPairsData.jaItems.length : false))
            }
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
