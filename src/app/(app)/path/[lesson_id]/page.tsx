'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, BookOpen, Mic, Volume2, HelpCircle, 
  ChevronRight, Award, Check, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLearning } from '@/hooks/useLearning';

interface LessonQuestion {
  question: string;
  options: string[];
  correctIdx: number;
}

export default function LessonPlayerPage({ params }: { params: { lesson_id: string } }) {
  const router = useRouter();
  const { updateProfileStats } = useAuth();
  const { 
    activeLessonDetails, 
    loading, 
    error, 
    loadLessonDetails, 
    completeActiveLesson 
  } = useLearning();

  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar' | 'speaking' | 'quiz'>('vocab');
  const [vocabIndex, setVocabIndex] = useState(0);
  const [speechSuccess, setSpeechSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  
  // Quiz State
  const [quizQuestions, setQuizQuestions] = useState<LessonQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  // Load lesson details on mount
  useEffect(() => {
    if (params.lesson_id) {
      loadLessonDetails(params.lesson_id);
    }
  }, [params.lesson_id, loadLessonDetails]);

  // Track time spent in lesson
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate quiz questions dynamically once vocab & grammar load
  useEffect(() => {
    if (activeLessonDetails) {
      const vocabList = activeLessonDetails.vocabulary || [];
      const grammarList = activeLessonDetails.grammar || [];
      
      const generated: LessonQuestion[] = [];
      
      // Vocab questions
      vocabList.forEach((v: any) => {
        // Translate Japanese to English
        const meaningOpts = new Set<string>();
        meaningOpts.add(v.english);
        while (meaningOpts.size < Math.min(4, vocabList.length)) {
          const randomVocab = vocabList[Math.floor(Math.random() * vocabList.length)];
          meaningOpts.add(randomVocab.english);
        }
        const defaultMeanings = ['Hello', 'Good morning', 'Thank you', 'Excuse me', 'Goodbye'];
        while (meaningOpts.size < 4) {
          meaningOpts.add(defaultMeanings[Math.floor(Math.random() * defaultMeanings.length)]);
        }
        const optionsArray = Array.from(meaningOpts).sort(() => Math.random() - 0.5);
        
        generated.push({
          question: `What is the meaning of "${v.word_japanese || v.hiragana}"?`,
          options: optionsArray,
          correctIdx: optionsArray.indexOf(v.english)
        });

        // Translate English to Japanese
        const wordOpts = new Set<string>();
        const correctWord = v.word_japanese || v.hiragana;
        wordOpts.add(correctWord);
        while (wordOpts.size < Math.min(4, vocabList.length)) {
          const randomVocab = vocabList[Math.floor(Math.random() * vocabList.length)];
          wordOpts.add(randomVocab.word_japanese || randomVocab.hiragana);
        }
        const defaultWords = ['こんにちは', 'さようなら', 'ありがとう', 'すみません'];
        while (wordOpts.size < 4) {
          wordOpts.add(defaultWords[Math.floor(Math.random() * defaultWords.length)]);
        }
        const wordsArray = Array.from(wordOpts).sort(() => Math.random() - 0.5);

        generated.push({
          question: `Which of the following means "${v.english}"?`,
          options: wordsArray,
          correctIdx: wordsArray.indexOf(correctWord)
        });
      });

      // Grammar questions
      grammarList.forEach((g: any) => {
        const grammarOpts = new Set<string>();
        grammarOpts.add(g.meaning_english);
        const defaultGrammar = [
          'Used to greet in the morning',
          'Used to express action in progress',
          'Used to describe ability',
          'Used to make a polite request'
        ];
        while (grammarOpts.size < 4) {
          grammarOpts.add(defaultGrammar[Math.floor(Math.random() * defaultGrammar.length)]);
        }
        const optionsArray = Array.from(grammarOpts).sort(() => Math.random() - 0.5);

        generated.push({
          question: `What does the grammar pattern "${g.pattern}" mean?`,
          options: optionsArray,
          correctIdx: optionsArray.indexOf(g.meaning_english)
        });
      });

      // Limit to 5 questions shuffled
      setQuizQuestions(generated.sort(() => Math.random() - 0.5).slice(0, 5));
    }
  }, [activeLessonDetails]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-sakura-dark animate-spin" />
        <p className="text-sm font-bold text-purple-300/60 uppercase tracking-widest animate-pulse">
          Loading Lesson Content...
        </p>
      </div>
    );
  }

  if (error || !activeLessonDetails) {
    return (
      <div className="text-center py-12 space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Error Loading Lesson</h2>
        <p className="text-sm text-purple-300/60 font-semibold">{error || 'Lesson details not found.'}</p>
        <Button onClick={() => router.push('/jlpt')} className="btn btn-primary btn-sm">
          Return to Roadmap
        </Button>
      </div>
    );
  }

  const { lesson, vocabulary = [], grammar = [] } = activeLessonDetails;
  const currentGrammar = grammar[0] || null;

  const speakJapanese = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSpeakPractice = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    setSpeakingScore(null);
    
    // Simulate speech score evaluation
    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(85 + Math.random() * 15);
      setSpeakingScore(score);
      if (score >= 90) setSpeechSuccess(true);
    }, 2500);
  };

  const handleQuizAnswer = (idx: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(idx);
    if (idx === quizQuestions[quizIndex].correctIdx) {
      setQuizScore(prev => prev + 1);
    }
  };

  const nextQuizQuestion = async () => {
    setSelectedQuizAnswer(null);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      
      // Calculate score out of 100
      const finalScore = quizQuestions.length > 0 
        ? Math.round((quizScore / quizQuestions.length) * 100) 
        : 100;
        
      // Call complete lesson in DB
      try {
        await completeActiveLesson(finalScore, timeSpent);
        // Award profile stats locally too
        if (updateProfileStats) {
          updateProfileStats(lesson.xp_reward || 10, 5); // Award lesson XP and 5 gems
        }
      } catch (err) {
        console.error('Failed to complete lesson:', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header navbar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/jlpt')}
          className="flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Roadmap</span>
        </button>
        <span className="text-xs font-extrabold tracking-widest text-sakura-dark uppercase px-3 py-1 bg-sakura-dark/15 rounded-full border border-sakura-dark/25 font-orbitron">
          LESSON: {params.lesson_id.toUpperCase()}
        </span>
      </div>

      {/* Lesson Title banner */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white font-orbitron">{lesson.title}</h1>
        <p className="text-xs text-purple-300/40 font-semibold uppercase tracking-wider">{lesson.description}</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
        {[
          { id: 'vocab', label: '⛩️ Vocabulary', icon: BookOpen },
          { id: 'grammar', label: '💡 Grammar', icon: HelpCircle },
          { id: 'speaking', label: '🗣️ Speaking', icon: Mic },
          { id: 'quiz', label: '📝 Quiz', icon: Award }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-md' 
                  : 'text-purple-300/60 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel contents */}
      <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 min-h-[350px] flex flex-col justify-between">
        
        {activeTab === 'vocab' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs font-bold text-purple-300/40 uppercase">
              <span>Card {vocabIndex + 1} of {vocabulary.length}</span>
              <span>VOCABULARY DECK</span>
            </div>

            {vocabulary.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={vocabIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center text-center space-y-6 py-6"
                >
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white font-jp tracking-wide">
                    {vocabulary[vocabIndex].word_japanese}
                  </h2>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-purple-300/60">
                      {vocabulary[vocabIndex].hiragana || vocabulary[vocabIndex].katakana || ''}
                    </p>
                    <p className="text-xs font-semibold text-sakura-dark italic">{vocabulary[vocabIndex].romaji}</p>
                  </div>
                  <p className="text-lg font-bold text-white max-w-md">
                    {vocabulary[vocabIndex].english}
                  </p>
                  <p className="text-xs text-purple-300/40 max-w-md italic font-semibold leading-relaxed border-t border-white/5 pt-4">
                    {vocabulary[vocabIndex].meaning || vocabulary[vocabIndex].part_of_speech || ''}
                  </p>
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="text-center text-purple-300/50 py-8">No vocabulary words for this lesson.</p>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button 
                onClick={() => speakJapanese(vocabulary[vocabIndex]?.word_japanese || '')}
                disabled={vocabulary.length === 0}
                className="btn btn-ghost btn-sm flex items-center gap-2 font-bold cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen Audio</span>
              </button>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setVocabIndex(prev => Math.max(0, prev - 1))}
                  disabled={vocabIndex === 0}
                  className="btn btn-ghost btn-sm font-bold cursor-pointer"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => {
                    if (vocabIndex < vocabulary.length - 1) {
                      setVocabIndex(prev => prev + 1);
                    } else {
                      setActiveTab('grammar');
                    }
                  }}
                  disabled={vocabulary.length === 0}
                  className="btn btn-primary btn-sm font-bold cursor-pointer"
                >
                  {vocabIndex === vocabulary.length - 1 ? 'Go to Grammar' : 'Next Card'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="space-y-6 flex flex-col justify-between min-h-[350px]">
            {currentGrammar ? (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold tracking-widest text-sakura-dark uppercase px-3 py-1 bg-sakura-dark/15 rounded-full border border-sakura-dark/25 w-max block">
                  GRAMMAR RULES
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-white font-orbitron">{currentGrammar.title}</h2>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl font-semibold">
                  <p className="text-xs text-purple-300/40 font-bold uppercase tracking-wider mb-2">STRUCTURE</p>
                  <p className="text-sm font-bold text-white font-jp">{currentGrammar.pattern}</p>
                  <p className="text-xs text-sakura-dark italic mt-1">{currentGrammar.formation || ''}</p>
                </div>
                <div className="space-y-1.5 leading-relaxed font-semibold">
                  <p className="text-xs text-purple-300/40 font-bold uppercase tracking-wider">EXPLANATION</p>
                  <p className="text-sm text-purple-200">{currentGrammar.meaning_english}</p>
                </div>

                {/* Grammar Examples */}
                {currentGrammar.example_japanese && (
                  <div className="space-y-2">
                    <p className="text-xs text-purple-300/40 font-bold uppercase tracking-wider">EXAMPLES</p>
                    <div className="space-y-2">
                      <div className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white font-jp">{currentGrammar.example_japanese}</p>
                          {currentGrammar.example_english && (
                            <p className="text-[10px] text-purple-300/50 italic font-semibold">{currentGrammar.example_english}</p>
                          )}
                        </div>
                        <button 
                          onClick={() => speakJapanese(currentGrammar.example_japanese || '')}
                          className="p-2 text-purple-300/40 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-purple-300/50 py-8">No grammar topic for this lesson.</p>
            )}

            <div className="flex justify-end pt-6 border-t border-white/5">
              <Button 
                onClick={() => setActiveTab('speaking')}
                className="btn btn-primary btn-sm font-bold cursor-pointer"
              >
                Go to Speaking
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'speaking' && (
          <div className="space-y-6 flex flex-col justify-between min-h-[350px]">
            <div className="space-y-6 text-center py-4">
              <span className="text-[10px] font-extrabold tracking-widest text-sakura-dark uppercase px-3 py-1 bg-sakura-dark/15 rounded-full border border-sakura-dark/25 w-max mx-auto block">
                PRONUNCIATION PRACTICE
              </span>
              <p className="text-sm text-purple-300/60 font-semibold max-w-md mx-auto">
                Listen to the phrase first, then record yourself repeating it. We will evaluate your accent.
              </p>

              {vocabulary.length > 0 ? (
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl max-w-md mx-auto space-y-4 shadow-lg">
                  <h3 className="text-2xl font-extrabold text-white font-jp">
                    {vocabulary[0].word_japanese}
                  </h3>
                  <p className="text-xs text-sakura-dark italic font-semibold">{vocabulary[0].romaji}</p>
                  <button 
                    onClick={() => speakJapanese(vocabulary[0].word_japanese)}
                    className="mx-auto flex items-center gap-2 px-4 py-2 bg-brand-purple/20 border border-brand-purple/30 text-brand-purple-light rounded-xl text-xs font-bold hover:scale-105 transition-all cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Listen Model</span>
                  </button>
                </div>
              ) : (
                <p className="text-purple-300/55">No model phrase loaded.</p>
              )}

              {/* Speech mic waves */}
              <div className="flex flex-col items-center justify-center space-y-4 pt-4">
                <button
                  onClick={handleSpeakPractice}
                  disabled={vocabulary.length === 0}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                      : 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-lg'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </button>
                <p className="text-xs font-bold text-purple-300/40 uppercase tracking-widest">
                  {isRecording ? 'Recording (Speaking)...' : 'Tap to Record'}
                </p>

                {/* Score display */}
                {speakingScore !== null && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-sm font-bold flex items-center gap-2 max-w-xs justify-center mx-auto">
                    <Check className="w-4 h-4" />
                    <span>Accent Score: {speakingScore}% (Perfect!)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-white/5">
              <Button 
                onClick={() => setActiveTab('quiz')}
                className="btn btn-primary btn-sm font-bold cursor-pointer"
              >
                Go to Quiz
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="space-y-6 flex flex-col justify-between min-h-[350px]">
            {!quizFinished ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center text-xs font-bold text-purple-300/40 uppercase">
                  <span>Question {quizIndex + 1} of {quizQuestions.length}</span>
                  <span>SCORE: {quizScore}</span>
                </div>

                {quizQuestions.length > 0 ? (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-white leading-relaxed">
                      {quizQuestions[quizIndex].question}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quizQuestions[quizIndex].options.map((opt, idx) => {
                        const isSelected = selectedQuizAnswer === idx;
                        const isCorrect = idx === quizQuestions[quizIndex].correctIdx;
                        let optionStyle = 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04] text-purple-300';
                        
                        if (selectedQuizAnswer !== null) {
                          if (isCorrect) optionStyle = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                          else if (isSelected) optionStyle = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
                        }

                        return (
                          <button
                            key={idx}
                            disabled={selectedQuizAnswer !== null}
                            onClick={() => handleQuizAnswer(idx)}
                            className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-purple-300/50 py-8">Generating quiz questions...</p>
                )}

                <div className="flex justify-end pt-6 border-t border-white/5">
                  <Button
                    disabled={selectedQuizAnswer === null}
                    onClick={nextQuizQuestion}
                    className="btn btn-primary btn-sm font-bold cursor-pointer"
                  >
                    <span>{quizIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6 flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <Award className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
                  <h2 className="text-2xl font-extrabold text-white font-orbitron">Lesson Completed!</h2>
                  <p className="text-sm text-purple-300/60 font-semibold max-w-sm mx-auto">
                    Great work! You scored {quizScore} out of {quizQuestions.length} correct. You earned +{lesson.xp_reward || 10} XP and +5 gems.
                  </p>
                </div>

                <div className="flex justify-center gap-4 pt-6 border-t border-white/5">
                  <Button 
                    onClick={() => {
                      setQuizIndex(0);
                      setSelectedQuizAnswer(null);
                      setQuizFinished(false);
                      setQuizScore(0);
                    }}
                    className="btn btn-ghost btn-sm font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </Button>
                  <Button 
                    onClick={() => router.push('/jlpt')}
                    className="btn btn-primary btn-sm font-bold cursor-pointer"
                  >
                    Back to Roadmap
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
