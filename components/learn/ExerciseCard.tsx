'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Check, Mic, Sparkles } from 'lucide-react';
import { Button } from '@evlo/ui';
import { PremiumIcon } from '../ui/PremiumIcon';

interface ExerciseCardProps {
  question: any;
  selectedAns: string | null;
  onSelect: (ans: string) => void;
  isAnswered: boolean;
  isCorrect: boolean;
  playTTS: (text: string) => void;
  isProUser?: boolean;
}

export function ExerciseCard({
  question,
  selectedAns,
  onSelect,
  isAnswered,
  isCorrect,
  playTTS,
  isProUser = false,
}: ExerciseCardProps) {
  // Local state for special exercise types
  const [typedInput, setTypedInput] = useState('');
  
  // Match the pairs local state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  
  // Speak & Match recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);

  // Reset local state when question changes
  useEffect(() => {
    setTypedInput('');
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs({});
    setIsRecording(false);
    setRecordingDone(false);
  }, [question]);

  // Handle Match the Pair taps
  const handleLeftTap = (val: string) => {
    if (isAnswered) return;
    setSelectedLeft(val);
    if (selectedRight) {
      checkMatch(val, selectedRight);
    }
  };

  const handleRightTap = (val: string) => {
    if (isAnswered) return;
    setSelectedRight(val);
    if (selectedLeft) {
      checkMatch(selectedLeft, val);
    }
  };

  const checkMatch = (left: string, right: string) => {
    const correctMap = question.matches || {};
    if (correctMap[left] === right) {
      const newMatched = { ...matchedPairs, [left]: right };
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      
      // If all matches complete, trigger selection
      const totalKeys = Object.keys(correctMap).length;
      if (Object.keys(newMatched).length === totalKeys) {
        onSelect(JSON.stringify(newMatched));
      }
    } else {
      // Flashes mismatch
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  // Trigger speak simulation
  const startRecordingSim = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setRecordingDone(true);
      onSelect(question.correct); // auto-complete correct speaking mock
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Exercise header description */}
      <span style={{ fontSize: '11px', color: 'var(--text-secondary, #b3b3b9)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {question.type === 'mcq-meaning' && (
          <>
            <PremiumIcon type="numbers" size={12} /> MCQ — Translate Word
          </>
        )}
        {question.type === 'mcq-japanese' && (
          <>
            <PremiumIcon type="kana" size={12} /> MCQ — Pick Japanese
          </>
        )}
        {question.type === 'translate' && (
          <>
            <PremiumIcon type="book" size={12} /> MCQ — Translate Sentence
          </>
        )}
        {question.type === 'listen-pick' && (
          <>
            <PremiumIcon type="speaker" size={12} /> Listening — Choose Correct
          </>
        )}
        {question.type === 'fill-blank' && (
          <>
            <PremiumIcon type="book" size={12} /> Fill in the Blank
          </>
        )}
        {question.type === 'match-pair' && (
          <>
            <PremiumIcon type="tips" size={12} /> Match the Pairs
          </>
        )}
        {question.type === 'speak-match' && (
          <>
            <PremiumIcon type="greetings" size={12} /> Speak & Match
          </>
        )}
      </span>

      {/* Main Question Header */}
      <div style={{ textAlign: 'center', margin: '12px 0' }}>
        {question.type === 'mcq-meaning' && (
          <>
            <h2 style={{ fontFamily: 'var(--font-ja)', fontSize: '44px', fontWeight: 900, margin: 0 }}>
              {question.japanese}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px' }}>
              /{question.romaji}/
            </p>
            <Button variant="ghost" size="sm" onClick={() => playTTS(question.japanese)} style={{ marginTop: '8px' }}>
              <Volume2 size={16} style={{ marginRight: '4px' }} /> Speak
            </Button>
          </>
        )}

        {question.type === 'mcq-japanese' && (
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: 'var(--primary, #ff9800)' }}>
            {question.english}
          </h2>
        )}

        {question.type === 'translate' && (
          <>
            <h2 style={{ fontFamily: 'var(--font-ja)', fontSize: '28px', fontWeight: 800, margin: 0 }}>
              {question.japanese}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px' }}>
              /{question.romaji}/
            </p>
            <Button variant="ghost" size="sm" onClick={() => playTTS(question.japanese)} style={{ marginTop: '8px' }}>
              <Volume2 size={16} style={{ marginRight: '4px' }} /> Speak
            </Button>
          </>
        )}

        {question.type === 'listen-pick' && (
          <>
            <button
              onClick={() => playTTS(question.listenText)}
              style={{
                width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(255,152,0,0.12)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}
            >
              <Volume2 size={28} color="var(--primary, #ff9800)" />
            </button>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', margin: 0 }}>Tap to hear audio</p>
          </>
        )}

        {question.type === 'fill-blank' && (
          <>
            <h2 style={{ fontFamily: 'var(--font-ja)', fontSize: '28px', fontWeight: 800, margin: 0 }}>
              {question.japanesePrompt.replace('___', '______')}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '8px' }}>
              Meaning: &ldquo;{question.english}&rdquo;
            </p>
            <Button variant="ghost" size="sm" onClick={() => playTTS(question.japanese)} style={{ marginTop: '8px' }}>
              <Volume2 size={16} style={{ marginRight: '4px' }} /> Speak
            </Button>
          </>
        )}

        {question.type === 'match-pair' && (
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--primary, #ff9800)' }}>
            Match the Japanese to its meaning
          </h2>
        )}

        {question.type === 'speak-match' && (
          <>
            <h2 style={{ fontFamily: 'var(--font-ja)', fontSize: '36px', fontWeight: 900, margin: 0, color: 'var(--text-primary, #fff)' }}>
              {question.japanese}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary, #b3b3b9)', marginTop: '4px' }}>
              /{question.romaji}/
            </p>
            <Button variant="ghost" size="sm" onClick={() => playTTS(question.japanese)} style={{ marginTop: '8px' }}>
              <Volume2 size={16} style={{ marginRight: '4px' }} /> Listen
            </Button>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary, #b3b3b9)', margin: '12px 0 0 0' }}>
              Press microphone button below and read aloud.
            </p>
          </>
        )}
      </div>

      {/* Answer Options Row / Input Fields */}
      <div style={{ marginTop: '8px' }}>
        
        {/* Standard MCQ Options (mcq-meaning, mcq-japanese, translate, listen-pick) */}
        {(question.type === 'mcq-meaning' || question.type === 'mcq-japanese' || question.type === 'translate' || question.type === 'listen-pick') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {question.options.map((opt: any, idx: number) => {
              const optString = typeof opt === 'object' ? opt.kanji : opt;
              const optLabel = typeof opt === 'object' ? `${opt.kanji} (${opt.romaji})` : opt;
              
              const isSelected = selectedAns === optString;
              const isCorrectAns = optString === question.correct;
              let bg = 'var(--surface-3, #3a3a42)';
              let border = '1px solid var(--border-strong, #2d2d34)';
              let text = 'var(--text-primary, #fff)';

              if (isSelected) {
                bg = 'rgba(255, 152, 0, 0.12)';
                border = '2px solid var(--primary, #ff9800)';
              }

              if (isAnswered) {
                if (isCorrectAns) {
                  bg = 'rgba(76, 175, 80, 0.15)';
                  border = '2px solid var(--success, #4caf50)';
                  text = 'var(--success, #4caf50)';
                } else if (isSelected) {
                  bg = 'rgba(239, 68, 68, 0.15)';
                  border = '2px solid var(--error, #ef4444)';
                  text = 'var(--error, #ef4444)';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => onSelect(optString)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', background: bg, border,
                    color: text, fontWeight: 700, fontSize: '14px', textAlign: 'left', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{optLabel}</span>
                  {isAnswered && isCorrectAns && <Check size={16} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill in the Blank (text input field) */}
        {question.type === 'fill-blank' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              value={typedInput}
              disabled={isAnswered}
              onChange={(e) => {
                setTypedInput(e.target.value);
                onSelect(e.target.value.trim().toLowerCase());
              }}
              placeholder="Type the missing word..."
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                background: 'var(--surface-3, #3a3a42)',
                border: isAnswered
                  ? isCorrect
                    ? '2px solid var(--success, #4caf50)'
                    : '2px solid var(--error, #ef4444)'
                  : '1px solid var(--border-strong, #2d2d34)',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                outline: 'none',
                textAlign: 'center',
              }}
            />
            {isAnswered && !isCorrect && (
              <p style={{ color: 'var(--error, #ef4444)', fontSize: '13px', textAlign: 'center', margin: 0 }}>
                Correct answer: <strong>{question.correct}</strong>
              </p>
            )}
          </div>
        )}

        {/* Match the Pairs UI */}
        {question.type === 'match-pair' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Left Japanese Words */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {question.leftOptions.map((leftVal: string) => {
                const isMatched = !!matchedPairs[leftVal];
                const isSelected = selectedLeft === leftVal;
                
                let bg = 'var(--surface-3, #3a3a42)';
                let border = '1px solid var(--border-strong, #2d2d34)';
                if (isSelected) {
                  bg = 'rgba(255, 152, 0, 0.12)';
                  border = '2px solid var(--primary, #ff9800)';
                }
                if (isMatched) {
                  bg = 'rgba(76, 175, 80, 0.08)';
                  border = '1px solid var(--success, #4caf50)';
                }

                return (
                  <button
                    key={leftVal}
                    disabled={isMatched || isAnswered}
                    onClick={() => handleLeftTap(leftVal)}
                    style={{
                      padding: '12px', borderRadius: '10px', background: bg, border,
                      color: isMatched ? 'var(--success, #4caf50)' : '#fff',
                      fontFamily: 'var(--font-ja)', fontSize: '16px', fontWeight: 700,
                      cursor: 'pointer', opacity: isMatched ? 0.6 : 1, minHeight: '48px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {leftVal}
                  </button>
                );
              })}
            </div>

            {/* Right Meaning Words */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {question.rightOptions.map((rightVal: string) => {
                const isMatched = Object.values(matchedPairs).includes(rightVal);
                const isSelected = selectedRight === rightVal;
                
                let bg = 'var(--surface-3, #3a3a42)';
                let border = '1px solid var(--border-strong, #2d2d34)';
                if (isSelected) {
                  bg = 'rgba(255, 152, 0, 0.12)';
                  border = '2px solid var(--primary, #ff9800)';
                }
                if (isMatched) {
                  bg = 'rgba(76, 175, 80, 0.08)';
                  border = '1px solid var(--success, #4caf50)';
                }

                return (
                  <button
                    key={rightVal}
                    disabled={isMatched || isAnswered}
                    onClick={() => handleRightTap(rightVal)}
                    style={{
                      padding: '12px', borderRadius: '10px', background: bg, border,
                      color: isMatched ? 'var(--success, #4caf50)' : '#fff',
                      fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', opacity: isMatched ? 0.6 : 1, minHeight: '48px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {rightVal}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Speak and Match (Pro simulation UI) */}
        {question.type === 'speak-match' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={startRecordingSim}
              disabled={isAnswered || isRecording}
              style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: isRecording
                  ? 'rgba(239, 68, 68, 0.2)'
                  : recordingDone
                  ? 'rgba(76, 175, 80, 0.15)'
                  : 'rgba(255, 152, 0, 0.12)',
                border: '2px solid',
                borderColor: isRecording ? '#ef4444' : recordingDone ? 'var(--success, #4caf50)' : 'var(--primary, #ff9800)',
                cursor: isAnswered ? 'default' : 'pointer',
                display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                boxShadow: isRecording ? '0 0 20px rgba(239,68,68,0.5)' : 'none',
                position: 'relative'
              }}
            >
              <Mic size={32} color={isRecording ? '#ef4444' : recordingDone ? 'var(--success, #4caf50)' : 'var(--primary, #ff9800)'} />
              {isRecording && (
                <span className="pulse-ring" style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '2px solid rgba(239,68,68,0.5)',
                  animation: 'spin 1.5s linear infinite'
                }} />
              )}
            </button>

            {!isProUser && (
              <div style={{
                background: 'rgba(251,191,36,0.15)',
                border: '1px solid rgba(251,191,36,0.3)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                color: 'var(--xp-gold, #ffc107)',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Sparkles size={12} />
                PRO Option ONLY — Speak and match is simulated for Free Tier.
              </div>
            )}

            {isRecording && <p style={{ fontSize: '13px', color: '#ef4444', fontWeight: 700, margin: 0 }}>Listening... Speak now</p>}
            {recordingDone && <p style={{ fontSize: '13px', color: 'var(--success, #4caf50)', fontWeight: 700, margin: 0 }}>Speech Recognized successfully!</p>}
          </div>
        )}

      </div>

      {/* Post-Answer Explanation Box */}
      {isAnswered && (question.meaning_hi || question.notes) && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          borderRadius: '12px',
          background: 'var(--surface-2, #2d2d34)',
          border: '1px solid var(--border-strong, #3a3a42)',
          animation: 'fadeIn 300ms ease both',
        }}>
          {question.meaning_hi && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary, #b3b3b9)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                Hindi Translation
              </span>
              <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary, #16A34A)', margin: 0 }}>
                {question.meaning_hi}
              </p>
            </div>
          )}
          {question.notes && (
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary, #b3b3b9)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                Explanation & Context
              </span>
              <p style={{ fontSize: '13px', color: 'var(--text-2, #e8f5e9)', margin: 0, lineHeight: '1.5' }}>
                {question.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
