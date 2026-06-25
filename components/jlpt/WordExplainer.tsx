'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, Lightbulb, Sparkles, BookOpen, AlertCircle, HelpCircle, Star, Layers, MessageSquare, BadgeAlert, MapPin, Info } from 'lucide-react';
import { fallbackRegistry, WordExplanation } from './fallbackExplanations';

const speakText = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
};

export function WordExplainer({ initialWord }: { initialWord?: string }) {
  const [searchWord, setSearchWord] = useState(initialWord || '');
  const [explanation, setExplanation] = useState<WordExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [activeSentenceTab, setActiveSentenceTab] = useState<'easy' | 'int' | 'adv'>('easy');

  // Trigger search / explain
  const handleExplain = async (wordToSearch: string) => {
    const trimmed = wordToSearch.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg(null);
    setFallbackUsed(false);
    setExplanation(null);

    try {
      const res = await fetch('/api/ai/word-explainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: trimmed })
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setExplanation(data);
    } catch (err: any) {
      console.warn('[Explainer] Falling back to local static database for:', trimmed);
      
      // Fallback check
      if (fallbackRegistry[trimmed]) {
        setExplanation(fallbackRegistry[trimmed]);
        setFallbackUsed(true);
      } else {
        // Try fuzzy check (e.g. matching without suffix or standardizing)
        const matchedKey = Object.keys(fallbackRegistry).find(k => k.includes(trimmed) || trimmed.includes(k));
        if (matchedKey) {
          setExplanation(fallbackRegistry[matchedKey]);
          setFallbackUsed(true);
        } else {
          setErrorMsg(`Unable to load AI analysis for "${trimmed}". Please try one of our pre-cached words: ${Object.keys(fallbackRegistry).join(', ')}.`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Pre-load benchmark on mount or when initialWord changes
  useEffect(() => {
    if (initialWord) {
      setSearchWord(initialWord);
      handleExplain(initialWord);
    } else {
      handleExplain('食べる');
    }
  }, [initialWord]);

  return (
    <div className="word-explainer-view animate-fadein" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Explain Search Input Card */}
      <div className="card" style={{ padding: 'var(--sp-5)' }}>
        <h3 className="text-base font-black flex gap-2"><Sparkles className="text-gold" size={18} /> Advanced Word Explainer</h3>
        <p className="text-muted text-xs mt-1 mb-4">
          Type any word below to generate a complete 30-point learning matrix, complete with mnemonics, example sentences, and friendly sensei advice.
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="Type Japanese word (e.g., 空港, ヤバい, 鬱)..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplain(searchWord)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              background: 'var(--surface-3)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button 
            onClick={() => handleExplain(searchWord)}
            disabled={loading}
            className="btn-primary" 
            style={{ width: 'auto', margin: 0, padding: '0 24px', background: 'var(--primary)' }}
          >
            Explain
          </button>
        </div>

        {/* Suggestion Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-3)' }}>Recommended:</span>
          {Object.keys(fallbackRegistry).map(w => (
            <button
              key={w}
              onClick={() => {
                setSearchWord(w);
                handleExplain(w);
              }}
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--primary)',
                cursor: 'pointer',
                transition: 'all var(--t-fast)'
              }}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="spinner" style={{
            width: '40px', height: '40px', border: '3px solid var(--border)',
            borderTop: '3px solid var(--primary)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <div>
            <h4 style={{ fontWeight: 800 }}>Velmorth Sensei is reading the scrolls...</h4>
            <p className="text-muted text-xs mt-1">Analyzing character compositions, mnemonics, and etymological registers.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="card" style={{ padding: 'var(--sp-4)', border: '1px solid var(--error)', background: 'var(--error-light)', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <AlertCircle className="text-error" size={24} />
          <div style={{ fontSize: '13px', color: 'var(--text)' }}>{errorMsg}</div>
        </div>
      )}

      {/* Explanations Display */}
      {explanation && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {fallbackUsed && (
            <div style={{
              fontSize: '11px', fontWeight: 'bold', background: 'var(--primary-light)',
              color: 'var(--primary)', padding: '6px 12px', borderRadius: '6px', textAlign: 'center',
              border: '1px dashed var(--primary)'
            }}>
              💡 Loaded from Local Static Database (Offline/Key Rotation Fallback)
            </div>
          )}

          {/* MAIN OVERVIEW HEADER CARD */}
          <div className="card" style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, var(--surface-2) 0%, var(--surface-3) 100%)',
            border: '1px solid var(--border-strong)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background huge emoji */}
            <div style={{ position: 'absolute', right: '-10px', top: '-10px', fontSize: '100px', opacity: 0.15, pointerEvents: 'none' }}>
              {explanation.emoji || '🎌'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Large Word Display */}
                <div style={{ 
                  background: 'var(--bg)', 
                  padding: '16px 24px', 
                  borderRadius: '16px', 
                  border: '2px solid var(--primary)', 
                  display: 'inline-block' 
                }}>
                  <h1 style={{ fontSize: '42px', fontFamily: 'var(--font-ja)', fontWeight: 900, lineHeight: 1.1 }}>
                    {explanation.japanese}
                  </h1>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--surface-3)', color: 'var(--primary)', padding: '3px 8px', borderRadius: '4px' }}>
                      {explanation.wordType}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--surface-3)', color: 'var(--warn)', padding: '3px 8px', borderRadius: '4px' }}>
                      JLPT {explanation.jlptLevel}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 800, background: 'var(--surface-3)', color: 'var(--accent-ai)', padding: '3px 8px', borderRadius: '4px' }}>
                      Freq: {explanation.frequencyRank}
                    </span>
                  </div>
                  <div className="text-muted text-xs mt-2" style={{ display: 'flex', gap: '8px' }}>
                    <span>Kana: <strong>{explanation.hiragana || explanation.katakana}</strong></span>
                    <span>•</span>
                    <span>Romaji: <strong style={{ fontStyle: 'italic' }}>{explanation.romaji}</strong></span>
                  </div>
                </div>
              </div>

              {/* Translations Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '16px' }} className="responsive-split">
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-3)' }}>ENGLISH TRANSLATION</span>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text)', marginTop: '2px' }}>{explanation.english}</div>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-3)' }}>HINDI MEANING</span>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: 'var(--accent-ai)', marginTop: '2px' }}>🇮🇳 {explanation.hindi}</div>
                </div>
              </div>
            </div>
          </div>

          {/* MEANINGS & RADICAL BREAKDOWN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="responsive-split">
            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><BookOpen size={16} /> Semantic Meanings</h4>
              <div className="mt-3">
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>SIMPLE MEANING</span>
                <p style={{ fontSize: '13px', marginTop: '2px', fontWeight: 600 }}>{explanation.simpleMeaning}</p>
              </div>
              <div className="mt-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>DETAILED LINGUISTIC MEANING</span>
                <p style={{ fontSize: '12px', marginTop: '2px', color: 'var(--text-secondary)' }}>{explanation.detailedMeaning}</p>
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><Layers size={16} /> Structure & Components</h4>
              <div className="mt-3">
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>KANJI / RADICAL BREAKDOWN</span>
                <p style={{ fontSize: '13px', marginTop: '2px', fontFamily: 'var(--font-ja)' }}>{explanation.rootBreakdown}</p>
              </div>
              <div className="mt-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>SYNONYMS</span>
                  <p style={{ fontSize: '11px', marginTop: '2px' }}>{explanation.synonyms || 'None listed'}</p>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>OPPOSITES</span>
                  <p style={{ fontSize: '11px', marginTop: '2px' }}>{explanation.opposites || 'None listed'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MEMORY TRICK & PRONUNCIATION */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="responsive-split">
            <div className="card" style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <h4 style={{ fontWeight: 800, fontSize: '13px', color: 'var(--warn)' }} className="flex gap-2"><Lightbulb size={16} /> Mnemonic & Memory Tricks</h4>
              <p className="mt-2" style={{ fontSize: '13px', fontWeight: 600 }}>
                💡 &ldquo;{explanation.memoryTrick}&rdquo;
              </p>
              <div className="mt-2" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                <strong>Visual Association:</strong> {explanation.visualAssociation}
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><Volume2 size={16} /> Pronunciation & Audio</h4>
              <div className="mt-2">
                <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>PRONUNCIATION TIPS</span>
                <p style={{ fontSize: '12px', marginTop: '2px' }}>{explanation.pronunciationTips}</p>
              </div>
              <div className="mt-2" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--surface-3)', padding: '8px 12px', borderRadius: '8px' }}>
                <button 
                  onClick={() => speakText(explanation.japanese)}
                  className="btn-ghost" 
                  style={{ padding: '6px', borderRadius: '50%' }}
                >
                  <Volume2 size={18} />
                </button>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>AUDIO READING TEXT</span>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{explanation.audioReadingText}</div>
                </div>
              </div>
            </div>
          </div>

          {/* THREE-TIER EXAMPLE SENTENCES */}
          <div className="card" style={{ padding: '20px' }}>
            <h4 style={{ fontWeight: 800, fontSize: '14px', marginBottom: '12px' }}>📝 Real Sentence Drills (Three Levels)</h4>
            
            {/* Expandable Tabs */}
            <div className="flex gap-2" style={{ background: 'var(--surface-3)', padding: '4px', borderRadius: '8px', marginBottom: '16px' }}>
              {(['easy', 'int', 'adv'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveSentenceTab(tab)}
                  className={`toggle-btn ${activeSentenceTab === tab ? 'active' : ''}`}
                  style={{ flex: 1, padding: '6px 0', fontSize: '12px', border: 'none', borderRadius: '6px', textTransform: 'capitalize' }}
                >
                  {tab === 'easy' && '🟢 Easy'}
                  {tab === 'int' && '🟡 Intermediate'}
                  {tab === 'adv' && '🔴 Advanced'}
                </button>
              ))}
            </div>

            <div style={{ background: 'var(--surface-2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              {activeSentenceTab === 'easy' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <h5 style={{ fontSize: '20px', fontFamily: 'var(--font-ja)', fontWeight: 800 }}>{explanation.easySentenceJa}</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{explanation.easySentenceEn}</p>
                  </div>
                  <button onClick={() => speakText(explanation.easySentenceJa)} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%', alignSelf: 'flex-start' }}>
                    <Volume2 size={16} />
                  </button>
                </div>
              )}
              {activeSentenceTab === 'int' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <h5 style={{ fontSize: '18px', fontFamily: 'var(--font-ja)', fontWeight: 800 }}>{explanation.intermediateSentenceJa}</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{explanation.intermediateSentenceEn}</p>
                  </div>
                  <button onClick={() => speakText(explanation.intermediateSentenceJa)} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%', alignSelf: 'flex-start' }}>
                    <Volume2 size={16} />
                  </button>
                </div>
              )}
              {activeSentenceTab === 'adv' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                  <div>
                    <h5 style={{ fontSize: '16px', fontFamily: 'var(--font-ja)', fontWeight: 700, lineHeight: 1.4 }}>{explanation.advancedSentenceJa}</h5>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>{explanation.advancedSentenceEn}</p>
                  </div>
                  <button onClick={() => speakText(explanation.advancedSentenceJa)} className="btn-ghost" style={{ padding: '8px', borderRadius: '50%', alignSelf: 'flex-start' }}>
                    <Volume2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* REAL LIFE USAGE & GRAMMAR LINKS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="responsive-split">
            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><MapPin size={16} /> Real-Life & Situational Context</h4>
              <div className="mt-3">
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>COMMON SITUATIONS / PLACES</span>
                <p style={{ fontSize: '12px', marginTop: '2px' }}>{explanation.commonSituations}</p>
              </div>
              <div className="mt-3">
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>REAL LIFE NATIVE USAGE</span>
                <p style={{ fontSize: '12px', marginTop: '2px', color: 'var(--text-secondary)' }}>{explanation.realLifeUsage}</p>
              </div>
              <div className="mt-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-3)', fontWeight: 800 }} className="text-error flex gap-1"><BadgeAlert size={12} /> COMMON LEARNER MISTAKES</span>
                <p style={{ fontSize: '12px', marginTop: '2px', color: 'var(--text-secondary)' }}>{explanation.commonMistakes}</p>
              </div>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><Info size={16} /> Linguistic Details & Culture</h4>
              <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>USAGE REGISTER</span>
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>{explanation.usageRegister}</p>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>DIFFICULTY</span>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: explanation.difficulty === 'Hard' ? 'var(--error)' : explanation.difficulty === 'Medium' ? 'var(--warn)' : 'var(--success)' }}>
                    {explanation.difficulty}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>REVIEW PRIORITY</span>
                  <p style={{ fontSize: '12px', fontWeight: 'bold' }}>{explanation.reviewPriority}</p>
                </div>
                <div>
                  <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>RELATED GRAMMAR</span>
                  <p style={{ fontSize: '11px' }}>{explanation.relatedGrammar}</p>
                </div>
              </div>
              <div className="mt-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>CULTURAL NOTES</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{explanation.culturalNotes}</p>
              </div>
              <div className="mt-3">
                <span style={{ fontSize: '9px', color: 'var(--text-3)' }}>RELATED VOCABULARY</span>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{explanation.relatedVocabulary}</p>
              </div>
            </div>
          </div>

          {/* VELMORTH SENSEI FRIENDLY COMMENTARY */}
          <div className="card flex" style={{ padding: '20px', gap: '20px', alignItems: 'center', background: 'rgba(22, 163, 74, 0.04)', border: '1px solid rgba(22, 163, 74, 0.15)' }}>
            <img 
              src="/velmorth_mascot.png" 
              alt="Velmorth Mascot"
              className="animate-sway"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>VELMORTH SENSEI AI TUTOR EXPLANATION</span>
              
              {/* Chat speech bubble styling */}
              <div className="speech-bubble" style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-strong)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                lineHeight: 1.5,
                marginTop: '6px',
                color: 'var(--text)',
                position: 'relative'
              }}>
                {explanation.aiTutorExplanation}
                <div style={{
                  position: 'absolute', left: '-6px', top: '16px',
                  width: '0', height: '0',
                  borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
                  borderRight: '6px solid var(--surface-2)', zIndex: 2
                }} />
                <div style={{
                  position: 'absolute', left: '-7px', top: '16px',
                  width: '0', height: '0',
                  borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
                  borderRight: '6px solid var(--border-strong)', zIndex: 1
                }} />
              </div>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
