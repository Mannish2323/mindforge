'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Eye, EyeOff, ChevronRight, BookOpen, Volume2, 
  ArrowLeft, CheckCircle2, XCircle, Sparkles, HelpCircle 
} from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

interface Passage {
  id: number;
  title: string;
  level: string;
  japanese: string;
  romaji: string;
  english: string;
  questions: {
    q: string;
    options: string[];
    answer: number;
  }[];
}

const READING_PASSAGES: Passage[] = [
  {
    id: 1,
    title: '自己紹介 (Self Introduction)',
    level: 'N5',
    japanese: '初めまして。私の名前はさくらです。日本から来ました。毎日日本語と英語を勉強しています。どうぞよろしくお願いします。',
    romaji: 'Hajimemashite. Watashi no namae wa Sakura desu. Nihon kara kimashita. Mainichi nihongo to eigo wo benkyou shiteimasu. Douzo yoroshiku onegai shimasu.',
    english: 'Nice to meet you. My name is Sakura. I came from Japan. I study Japanese and English every day. Please treat me well.',
    questions: [
      { q: 'What is the speaker\'s name?', options: ['Yuki', 'Sakura', 'Tanaka', 'Ken'], answer: 1 },
      { q: 'How often do they practice studying?', options: ['Every day', 'Weekly', 'Once a month', 'Only on weekends'], answer: 0 },
    ],
  },
  {
    id: 2,
    title: '天気と週末 (Weather & Weekend)',
    level: 'N5',
    japanese: '今日はとてもいい天気です。空が青くて、太陽が明るいです。明日の日曜日は公園で友達と散歩したいです。',
    romaji: 'Kyou wa totemo ii tenki desu. Sora ga aokute, taiyou ga akarui desu. Ashita no nichiyoubi wa kouen de tomodachi to sanpo shitai desu.',
    english: 'Today the weather is very nice. The sky is blue and the sun is bright. Tomorrow on Sunday, I want to take a walk in the park with my friend.',
    questions: [
      { q: 'What is the weather like today?', options: ['Rainy', 'Cloudy', 'Very nice / Sunny', 'Snowy'], answer: 2 },
      { q: 'What does the speaker want to do tomorrow?', options: ['Go shopping', 'Walk in the park', 'Stay home', 'Study at library'], answer: 1 },
    ],
  },
  {
    id: 3,
    title: 'レストランで注文 (Ordering at a Restaurant)',
    level: 'N4',
    japanese: 'すみません、注文をお願いします。ラーメン一つと、緑茶を二つください。あと、お水もお願いします。',
    romaji: 'Sumimasen, chuumon wo onegai shimasu. Raamen hitotsu to, ryokucha wo futatsu kudasai. Ato, omizu mo onegai shimasu.',
    english: 'Excuse me, I would like to order. Please give me one ramen and two green teas. Also, please bring some water.',
    questions: [
      { q: 'How many green teas did they order?', options: ['One', 'Two', 'Three', 'Four'], answer: 1 },
      { q: 'What food item was ordered?', options: ['Sushi', 'Ramen', 'Udon', 'Tempura'], answer: 1 },
    ],
  },
];

export default function ReadingPage() {
  const [activeTab, setActiveTab] = useState('N5');
  const [selectedPassage, setSelectedPassage] = useState<Passage | null>(null);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const tabs = ['N5', 'N4', 'N3', 'N2', 'N1'];
  const filtered = READING_PASSAGES.filter(p => p.level === activeTab);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.88;
      window.speechSynthesis.speak(utterance);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-7 md:space-y-9 max-w-4xl mx-auto pb-14">
      {/* Top Banner */}
      <MFCard variant="sakura" washiTape="pink" padding="lg">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
            <BookOpen className="w-4 h-4 text-brand" />
            <span>Japanese Reading Lab</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
            Reading Comprehension
          </h1>
          <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-xl leading-relaxed">
            Read natural Japanese articles and dialogues, check readings and translations, and test your understanding with comprehension quizzes.
          </p>
        </div>
      </MFCard>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedPassage(null); }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeTab === tab
                ? 'bg-brand text-white border-brand shadow-[var(--paper-press-shadow)]'
                : 'bg-card text-ink-muted border-edge hover:text-ink hover:bg-cream'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {selectedPassage ? (
        <motion.div variants={item} className="space-y-6">
          {/* Passage Reading Card */}
          <MFCard variant="paper" lifted padding="lg" className="space-y-4 border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dashed border-edge pb-3">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-brand-light text-brand border border-brand/30">
                  JLPT {selectedPassage.level}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-ink font-heading mt-1">
                  {selectedPassage.title}
                </h3>
              </div>

              {/* Action toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(selectedPassage.japanese)}
                  className="p-2 rounded-xl bg-cream border border-edge text-brand hover:scale-105 transition-all cursor-pointer"
                  title="Listen to passage"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowRomaji(!showRomaji)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showRomaji ? 'bg-brand-light text-brand border-brand/30' : 'bg-cream text-ink-muted border-edge'
                  }`}
                >
                  Romaji
                </button>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    showTranslation ? 'bg-mint-light text-mint border-mint/30' : 'bg-cream text-ink-muted border-edge'
                  }`}
                >
                  {showTranslation ? 'Hide English' : 'English'}
                </button>
              </div>
            </div>

            {/* Japanese Text Body */}
            <div className="p-4 sm:p-6 rounded-2xl bg-cream border border-edge">
              <p className="text-lg sm:text-xl font-jp text-ink leading-loose tracking-wide">
                {selectedPassage.japanese}
              </p>

              {showRomaji && (
                <p className="text-xs text-brand font-medium italic mt-3 pt-3 border-t border-dashed border-edge">
                  {selectedPassage.romaji}
                </p>
              )}
            </div>

            {/* English Translation */}
            {showTranslation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-card border border-edge text-xs font-medium text-ink-secondary leading-relaxed"
              >
                <span className="font-bold text-ink block mb-1">English Translation:</span>
                {selectedPassage.english}
              </motion.div>
            )}
          </MFCard>

          {/* Comprehension Quiz */}
          <MFCard variant="paper" padding="lg" className="space-y-4 border">
            <h4 className="text-sm font-extrabold text-ink font-heading flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand" />
              <span>Comprehension Check</span>
            </h4>

            {selectedPassage.questions.map((q, qi) => (
              <div key={qi} className="space-y-2 pt-2 border-t border-dashed border-edge first:border-0 first:pt-0">
                <p className="text-xs font-bold text-ink">{qi + 1}. {q.q}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = selectedAnswers[qi] === oi;
                    const isCorrect = isSelected && oi === q.answer;
                    const isWrong = isSelected && oi !== q.answer;

                    return (
                      <button
                        key={oi}
                        onClick={() => setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                        className={`p-3 rounded-2xl text-xs font-medium border transition-all cursor-pointer text-left flex items-center justify-between ${
                          isCorrect
                            ? 'bg-mint text-white border-mint font-bold'
                            : isWrong
                            ? 'bg-coral text-white border-coral font-bold'
                            : 'bg-cream border-edge text-ink hover:bg-card hover:border-brand/30'
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <CheckCircle2 className="w-4 h-4" />}
                        {isWrong && <XCircle className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </MFCard>

          <MFButton
            onClick={() => setSelectedPassage(null)}
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Passages
          </MFButton>
        </motion.div>
      ) : (
        <motion.div variants={item} className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map(passage => (
              <MFCard
                key={passage.id}
                variant="paper"
                lifted
                padding="md"
                className="flex items-center justify-between cursor-pointer hover:border-brand/40"
                onClick={() => { setSelectedPassage(passage); setSelectedAnswers({}); }}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-brand-light text-brand border border-brand/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-ink font-heading">{passage.title}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-cream border border-edge text-ink-muted">
                        JLPT {passage.level}
                      </span>
                      <span className="text-[11px] text-ink-muted font-medium">{passage.questions.length} questions</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-muted" />
              </MFCard>
            ))
          ) : (
            <MFCard variant="cream" padding="lg" className="text-center">
              <p className="text-xs text-ink-muted font-medium">No passages available for {activeTab} yet. Check N5 and N4!</p>
            </MFCard>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
