'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Award, RefreshCw, BookOpen, Sparkles, Check } from 'lucide-react';
import { speakText } from '@evlo/utils';

interface ScriptLabProps {
  onBack: () => void;
}

const HIRAGANA_DATA = [
  { id: 'h_a', char: 'あ', romaji: 'a', type: 'Hiragana', hints: 'Looks like an apple with a stem.' },
  { id: 'h_i', char: 'い', romaji: 'i', type: 'Hiragana', hints: 'Two vertical strokes, like two eels.' },
  { id: 'h_u', char: 'う', romaji: 'u', type: 'Hiragana', hints: 'Looks like a person bending over carrying a heavy load.' },
  { id: 'h_e', char: 'え', romaji: 'e', type: 'Hiragana', hints: 'Looks like an exotic bird or a running man.' },
  { id: 'h_o', char: 'お', romaji: 'o', type: 'Hiragana', hints: 'Looks like a person golfing (ball flying to the right).' },
  { id: 'h_ka', char: 'か', romaji: 'ka', type: 'Hiragana', hints: 'Looks like a kangaroo kicking up its heels.' },
  { id: 'h_ki', char: 'き', romaji: 'ki', type: 'Hiragana', hints: 'Looks like a key.' },
  { id: 'h_ku', char: 'く', romaji: 'ku', type: 'Hiragana', hints: 'Looks like a bird beak saying "kookoo".' },
  { id: 'h_ke', char: 'け', romaji: 'ke', type: 'Hiragana', hints: 'Looks like a keg of beer with a tap on the left.' },
  { id: 'h_ko', char: 'こ', romaji: 'ko', type: 'Hiragana', hints: 'Two lines like two corner pieces.' },
  { id: 'h_sa', char: 'さ', romaji: 'sa', type: 'Hiragana', hints: 'Looks like a key, but the loop breaks.' },
  { id: 'h_shi', char: 'し', romaji: 'shi', type: 'Hiragana', hints: 'Looks like a fishing hook.' },
  { id: 'h_su', char: 'す', romaji: 'su', type: 'Hiragana', hints: 'Looks like a swing with a loop in the rope.' },
  { id: 'h_se', char: 'せ', romaji: 'se', type: 'Hiragana', hints: 'Looks like a mouth showing sexy teeth.' },
  { id: 'h_so', char: 'そ', romaji: 'so', type: 'Hiragana', hints: 'Looks like a sewing needle going zig-zag.' },
  { id: 'h_ta', char: 'た', romaji: 'ta', type: 'Hiragana', hints: 'Looks like the letters T and A.' },
  { id: 'h_chi', char: 'ち', romaji: 'chi', type: 'Hiragana', hints: 'Looks like sa but flipped, crossing like a 5.' },
  { id: 'h_tsu', char: 'つ', romaji: 'tsu', type: 'Hiragana', hints: 'Looks like a tsunami wave.' },
  { id: 'h_te', char: 'て', romaji: 'te', type: 'Hiragana', hints: 'Looks like a tennis racket handle.' },
  { id: 'h_to', char: 'と', romaji: 'to', type: 'Hiragana', hints: 'Looks like a toe with a splinter in it.' },
];

const KATAKANA_DATA = [
  { id: 'k_a', char: 'ア', romaji: 'a', type: 'Katakana', hints: 'Looks like a cliff corner.' },
  { id: 'k_i', char: 'イ', romaji: 'i', type: 'Katakana', hints: 'Looks like an easel.' },
  { id: 'k_u', char: 'ウ', romaji: 'u', type: 'Katakana', hints: 'Looks like a cook under an umbrella.' },
  { id: 'k_e', char: 'エ', romaji: 'e', type: 'Katakana', hints: 'Looks like a steel girder or capital letter I.' },
  { id: 'k_o', char: 'オ', romaji: 'o', type: 'Katakana', hints: 'Looks like a person running with their arms outstretched.' },
  { id: 'k_ka', char: 'カ', romaji: 'ka', type: 'Katakana', hints: 'Looks exactly like hiragana か but sharper.' },
  { id: 'k_ki', char: 'キ', romaji: 'ki', type: 'Katakana', hints: 'Looks like key lines.' },
  { id: 'k_ku', char: 'ク', romaji: 'ku', type: 'Katakana', hints: 'Looks like a cook hat.' },
  { id: 'k_ke', char: 'ケ', romaji: 'ke', type: 'Katakana', hints: 'Looks like a chevron corner.' },
  { id: 'k_ko', char: 'コ', romaji: 'ko', type: 'Katakana', hints: 'Looks like a corner box.' },
  { id: 'k_sa', char: 'サ', romaji: 'sa', type: 'Katakana', hints: 'Three lines like a corner garden.' },
  { id: 'k_shi', char: 'シ', romaji: 'shi', type: 'Katakana', hints: 'Smile face with two eyes looking up.' },
  { id: 'k_su', char: 'ス', romaji: 'su', type: 'Katakana', hints: 'Looks like a hanger hook.' },
  { id: 'k_se', char: 'セ', romaji: 'se', type: 'Katakana', hints: 'Looks like a corner bracket.' },
  { id: 'k_so', char: 'ソ', romaji: 'so', type: 'Katakana', hints: 'One dot and a stroke going down.' },
  { id: 'k_ta', char: 'タ', romaji: 'ta', type: 'Katakana', hints: 'Looks like ku with a line inside.' },
  { id: 'k_chi', char: 'チ', romaji: 'chi', type: 'Katakana', hints: 'Looks like a thousand indicator.' },
  { id: 'k_tsu', char: 'ツ', romaji: 'tsu', type: 'Katakana', hints: 'Smile face with two eyes looking down.' },
  { id: 'k_te', char: 'テ', romaji: 'te', type: 'Katakana', hints: 'Looks like telephone pole cables.' },
  { id: 'k_to', char: 'ト', romaji: 'to', type: 'Katakana', hints: 'Looks like a totem pole.' },
];

const KANJI_DATA = [
  { id: 'kn_1', char: '一', romaji: 'ichi', meaning: 'One', type: 'Kanji', hints: 'A single horizontal line.' },
  { id: 'kn_2', char: '二', romaji: 'ni', meaning: 'Two', type: 'Kanji', hints: 'Two horizontal lines.' },
  { id: 'kn_3', char: '三', romaji: 'san', meaning: 'Three', type: 'Kanji', hints: 'Three horizontal lines.' },
  { id: 'kn_4', char: '四', romaji: 'yon', meaning: 'Four', type: 'Kanji', hints: 'A box with two legs inside (four corners).' },
  { id: 'kn_5', char: '五', romaji: 'go', meaning: 'Five', type: 'Kanji', hints: 'Looks like a stylized number 5.' },
  { id: 'kn_6', char: '六', romaji: 'roku', meaning: 'Six', type: 'Kanji', hints: 'Looks like a top hat on a person.' },
  { id: 'kn_7', char: '七', romaji: 'nana', meaning: 'Seven', type: 'Kanji', hints: 'Looks like an upside down number 7.' },
  { id: 'kn_8', char: '八', romaji: 'hachi', meaning: 'Eight', type: 'Kanji', hints: 'Two open strokes (like a mountain top).' },
  { id: 'kn_9', char: '九', romaji: 'kyuu', meaning: 'Nine', type: 'Kanji', hints: 'Strokes crossing (like a runner).' },
  { id: 'kn_10', char: '十', romaji: 'juu', meaning: 'Ten', type: 'Kanji', hints: 'A cross representing ten directions.' },
];

export function ScriptLab({ onBack }: ScriptLabProps) {
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana' | 'kanji'>('hiragana');
  const [mode, setMode] = useState<'study' | 'quiz'>('study');
  
  // Studied IDs set to keep track of progress (starts empty -> 0% progress)
  const [studiedIds, setStudiedIds] = useState<string[]>([]);
  const [selectedChar, setSelectedChar] = useState<any>(null);

  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const getCurrentDataset = () => {
    if (activeTab === 'katakana') return KATAKANA_DATA;
    if (activeTab === 'kanji') return KANJI_DATA;
    return HIRAGANA_DATA;
  };

  const dataset = getCurrentDataset();

  // Set initial selected character on tab change
  useEffect(() => {
    setSelectedChar(dataset[0]);
    setMode('study'); // Reset to study mode on tab change
    setQuizDone(false);
  }, [activeTab]);

  const handlePlaySound = (text: string) => {
    speakText(text, 'ja-JP');
  };

  const handleSelectChar = (char: any) => {
    setSelectedChar(char);
    handlePlaySound(char.char);
    
    // Add to studied list if not already there
    if (!studiedIds.includes(char.id)) {
      setStudiedIds(prev => [...prev, char.id]);
    }
  };

  // Compute progress percentage
  const currentTabIds = dataset.map(c => c.id);
  const studiedInCurrentTab = studiedIds.filter(id => currentTabIds.includes(id)).length;
  const progressPercentage = Math.round((studiedInCurrentTab / dataset.length) * 100);

  // Quiz preparation
  const startQuiz = () => {
    setQuizIdx(0);
    setQuizScore(0);
    setQuizDone(false);
    setIsAnswered(false);
    setSelectedOption(null);
    generateQuizOptions(0);
    setMode('quiz');
  };

  const generateQuizOptions = (idx: number) => {
    const correct = activeTab === 'kanji' ? dataset[idx].meaning : dataset[idx].romaji;
    const pool = dataset.filter((_, i) => i !== idx).map(k => activeTab === 'kanji' ? k.meaning : k.romaji);
    
    // Shuffle pool and take 3 random options
    const wrongOptions = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    wrongOptions.push(correct);
    
    // Shuffle options array
    setShuffledOptions(wrongOptions.sort(() => 0.5 - Math.random()));
  };

  const handleQuizAnswer = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    
    const correct = activeTab === 'kanji' ? dataset[quizIdx].meaning : dataset[quizIdx].romaji;
    if (option === correct) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleQuizNext = () => {
    const nextIdx = quizIdx + 1;
    if (nextIdx < 5 && nextIdx < dataset.length) { // 5 questions per quiz
      setQuizIdx(nextIdx);
      setIsAnswered(false);
      setSelectedOption(null);
      generateQuizOptions(nextIdx);
    } else {
      setQuizDone(true);
    }
  };

  return (
    <div className="script-lab-view page-transition animate-fadein" style={{ padding: 'var(--sp-4)', maxWidth: '640px', margin: '0 auto' }}>
      
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>← Back</button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>✍️ Script Lab</h2>
        </div>
        <div className="flex gap-2">
          <button 
            className={`btn-ghost ${mode === 'study' ? 'active' : ''}`}
            onClick={() => setMode('study')}
            style={{ padding: '6px 12px', borderRadius: 'var(--radius)', border: mode === 'study' ? '1px solid var(--primary)' : '1px solid transparent', color: mode === 'study' ? 'var(--primary)' : 'var(--text-3)' }}
          >
            Study
          </button>
          <button 
            className={`btn-ghost ${mode === 'quiz' ? 'active' : ''}`}
            onClick={startQuiz}
            style={{ padding: '6px 12px', borderRadius: 'var(--radius)', border: mode === 'quiz' ? '1px solid var(--primary)' : '1px solid transparent', color: mode === 'quiz' ? 'var(--primary)' : 'var(--text-3)' }}
          >
            Quiz
          </button>
        </div>
      </div>

      {/* Script selection tabs */}
      <div className="flex gap-2" style={{ background: 'var(--surface-2)', padding: '6px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', marginBottom: 'var(--sp-4)' }}>
        {(['hiragana', 'katakana', 'kanji'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`toggle-btn ${activeTab === tab ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center', padding: '8px 0', border: 'none', borderRadius: 'var(--radius)', textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ padding: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 'bold', marginBottom: '6px' }}>
          <span style={{ textTransform: 'capitalize' }}>{activeTab} Mastery</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="lesson-progress-bar" style={{ height: '8px', marginBottom: 0 }}>
          <div className="lesson-progress-fill" style={{ width: `${progressPercentage}%`, background: 'var(--primary)' }} />
        </div>
      </div>

      {/* STUDY MODE */}
      {mode === 'study' && (
        <div className="script-study-grid">
          {/* Character Grid */}
          <div className="card" style={{ padding: 'var(--sp-4)', maxHeight: '350px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', marginBottom: 'var(--sp-3)', color: 'var(--text-3)' }}>Characters Grid</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {dataset.map((char) => {
                const isStudied = studiedIds.includes(char.id);
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectChar(char)}
                    style={{
                      height: '48px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      borderRadius: 'var(--radius)',
                      background: selectedChar?.id === char.id ? 'var(--primary-light)' : 'var(--surface-2)',
                      border: selectedChar?.id === char.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                      color: selectedChar?.id === char.id ? 'var(--primary)' : 'var(--text-1)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}
                  >
                    {char.char}
                    {isStudied && (
                      <div style={{ position: 'absolute', top: '2px', right: '2px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail Card */}
          {selectedChar && (
            <div className="card flex" style={{ flexDirection: 'column', padding: 'var(--sp-5)', gap: 'var(--sp-4)', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: '72px', fontWeight: 'bold', fontFamily: 'var(--font-ja)', color: 'var(--primary)' }}>
                {selectedChar.char}
              </div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {activeTab === 'kanji' ? `"${selectedChar.meaning}"` : `/${selectedChar.romaji}/`}
                </h3>
                {activeTab === 'kanji' && (
                  <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '2px' }}>Pronunciation: /{selectedChar.romaji}/</p>
                )}
              </div>
              
              <button
                onClick={() => handlePlaySound(selectedChar.char)}
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, padding: '8px 16px', minHeight: 'unset' }}
              >
                <Volume2 size={16} /> Listen Audio
              </button>

              <div className="feedback-panel info" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-2)', width: '100%', margin: 0, padding: 'var(--sp-3)', fontSize: 'var(--text-xs)' }}>
                💡 <strong>Hint:</strong> {selectedChar.hints}
              </div>
            </div>
          )}
        </div>
      )}

      {/* QUIZ MODE */}
      {mode === 'quiz' && !quizDone && (
        <div className="card animate-fadein" style={{ padding: 'var(--sp-6)', textAlign: 'center', maxWidth: '440px', margin: '0 auto' }}>
          <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)' }}>
            <span className="text-xs text-muted">Question {quizIdx + 1} of 5</span>
            <span className="badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '10px', fontWeight: 'bold', textTransform: 'capitalize' }}>
              {activeTab} Quiz
            </span>
          </div>

          <div style={{ fontSize: '80px', fontWeight: 'bold', margin: '20px 0', fontFamily: 'var(--font-ja)', color: 'var(--primary)' }}>
            {dataset[quizIdx]?.char}
          </div>
          
          <p style={{ fontSize: '12px', color: 'var(--text-2)', marginBottom: 'var(--sp-4)' }}>What is the correct reading / meaning?</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {shuffledOptions.map((opt) => {
              const correct = activeTab === 'kanji' ? dataset[quizIdx].meaning : dataset[quizIdx].romaji;
              const isSelected = selectedOption === opt;
              let classState = '';

              if (isAnswered) {
                if (opt === correct) {
                  classState = 'correct';
                } else if (isSelected) {
                  classState = 'incorrect';
                }
              } else if (isSelected) {
                classState = 'selected';
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`choice-btn ${classState}`}
                  disabled={isAnswered}
                  style={{ margin: 0, minHeight: '50px' }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <button
              onClick={handleQuizNext}
              className="btn-primary"
              style={{ marginTop: 'var(--sp-5)', width: '100%', background: 'var(--primary)', border: 'none' }}
            >
              Continue
            </button>
          )}
        </div>
      )}

      {/* QUIZ DONE */}
      {mode === 'quiz' && quizDone && (
        <div className="card animate-fadein" style={{ padding: 'var(--sp-6)', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
          <Award size={48} className="text-gold" style={{ margin: '0 auto var(--sp-4)' }} />
          <h3 className="text-2xl font-black">Quiz Complete!</h3>
          <p className="text-muted text-sm mt-3 mb-5">
            You scored {quizScore} out of 5 correctly. Keep practicing!
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setMode('study')}
              className="btn-secondary"
              style={{ flex: 1, margin: 0 }}
            >
              Study Grid
            </button>
            <button
              onClick={startQuiz}
              className="btn-primary"
              style={{ flex: 1, margin: 0, background: 'var(--primary)' }}
            >
              Retry Quiz
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
