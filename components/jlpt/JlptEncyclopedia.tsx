'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Volume2, BookOpen, Clock, Calendar, 
  MapPin, Landmark, Award, Info, Smile, ChevronRight, CheckCircle2, DollarSign
} from 'lucide-react';
import { WordExplainer } from './WordExplainer';
import {
  hiraganaData, katakanaData, kanjiData, vocabData,
  numeralData, counterData, banknoteData, coinData,
  irregularDays, monthData, grammarData, conjugationData,
  indiaCenterData
} from './encyclopediaData';

// Sub-component for playing text to speech
const speakText = (text: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  utter.rate = 0.85;
  window.speechSynthesis.speak(utter);
};

interface SearchResultItem {
  typeLabel: string;
  displayTitle: string;
  details: string;
  raw: string;
  exampleSentence?: string;
}

export function JlptEncyclopedia() {
  const [activeTab, setActiveTab] = useState<'kana' | 'kanji' | 'vocab' | 'temp_nums' | 'yen' | 'jlpt_centers' | 'explainer'>('kana');
  const [searchQuery, setSearchQuery] = useState('');
  const [explainerWord, setExplainerWord] = useState('');
  const [selectedLvlFilter, setSelectedLvlFilter] = useState<'ALL' | 'N5' | 'N4' | 'N3' | 'N2' | 'N1'>('ALL');
  const [vocabCatFilter, setVocabCatFilter] = useState<string>('ALL');
  const [kanaScript, setKanaScript] = useState<'hiragana' | 'katakana'>('hiragana');

  // Global Search logic
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();

    const kanjiMatches: SearchResultItem[] = kanjiData.filter(
      k => k.kanji.includes(query) || k.meaning.toLowerCase().includes(query) || k.onyomi.includes(query) || k.kunyomi.includes(query)
    ).map(k => ({ 
      typeLabel: 'Kanji', 
      displayTitle: k.kanji, 
      details: `Level ${k.level} | Kun: ${k.kunyomi} | On: ${k.onyomi}`, 
      raw: k.kanji,
      exampleSentence: k.exampleSentence 
    }));

    const vocabMatches: SearchResultItem[] = vocabData.filter(
      v => v.japanese.includes(query) || v.english.toLowerCase().includes(query) || v.romaji.toLowerCase().includes(query) || v.hiragana.includes(query)
    ).map(v => ({ 
      typeLabel: `Vocab (${v.category})`, 
      displayTitle: v.japanese, 
      details: `${v.hiragana} (${v.romaji}) — ${v.english}`, 
      raw: v.japanese,
      exampleSentence: v.exampleSentence 
    }));

    const grammarMatches: SearchResultItem[] = grammarData.filter(
      g => g.point.toLowerCase().includes(query) || g.meaning.toLowerCase().includes(query)
    ).map(g => ({ 
      typeLabel: 'Grammar', 
      displayTitle: g.point, 
      details: `Level ${g.level} — ${g.meaning}`, 
      raw: g.point,
      exampleSentence: `Example: ${g.example}` 
    }));

    const centerMatches: SearchResultItem[] = indiaCenterData.filter(
      c => c.city.toLowerCase().includes(query) || c.sponsor.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
    ).map(c => ({ 
      typeLabel: 'Exam Center', 
      displayTitle: `${c.city} Center`, 
      details: `${c.sponsor}`, 
      raw: c.city,
      exampleSentence: c.description 
    }));

    return [...kanjiMatches, ...vocabMatches, ...grammarMatches, ...centerMatches];
  }, [searchQuery]);

  // Tab definitions
  const tabs = [
    { id: 'kana', label: '🎌 Kana Syllabaries' },
    { id: 'kanji', label: '✍️ Kanji Matrix' },
    { id: 'vocab', label: '📚 Vocab & Slang' },
    { id: 'temp_nums', label: '📅 Temporal & Math' },
    { id: 'yen', label: '💴 Currency & Finance' },
    { id: 'jlpt_centers', label: '🎓 JLPT & India' },
    { id: 'explainer', label: '🔍 Word Explainer' },
  ] as const;

  return (
    <div className="encyclopedia-container page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', width: '100%' }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(14, 165, 233, 0.08) 100%)',
        border: '1px solid var(--border-strong)',
        padding: 'var(--sp-5)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.15, transform: 'rotate(15deg)', pointerEvents: 'none' }}>
          <BookOpen size={160} className="text-green" />
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 900 }}>Velmorth Japanese Linguistics Encyclopedia</h2>
        <p className="text-muted text-xs mt-1" style={{ maxWidth: '85%' }}>
          A complete multi-layered structural database covering phonics, kanji, agglutinative morphology, Keigo, financial architectures, and regional examination standards.
        </p>

        {/* Global Search Box */}
        <div style={{ position: 'relative', marginTop: 'var(--sp-4)', maxWidth: '480px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}>
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search words, kanji, grammar, or cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              borderRadius: 'var(--radius)',
              background: 'var(--surface-3)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none',
              transition: 'all var(--t-fast)',
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer',
                fontSize: '11px', fontWeight: 'bold'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar + Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--sp-4)', alignItems: 'start' }} className="responsive-split">
        
        {/* Navigation Sidebar */}
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearchQuery(''); // clear search when navigating tabs
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: activeTab === tab.id && !searchQuery ? 'var(--surface-3)' : 'var(--surface-2)',
                color: activeTab === tab.id && !searchQuery ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id && !searchQuery ? 800 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--t-fast)',
              }}
            >
              <span>{tab.label}</span>
              <ChevronRight size={14} style={{ opacity: activeTab === tab.id && !searchQuery ? 1 : 0.3 }} />
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div style={{ minWidth: 0 }}>
          <AnimatePresence mode="wait">
            
            {/* ── SEARCH RESULTS OVERLAY ── */}
            {searchResults !== null ? (
              <motion.div
                key="search-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card"
                style={{ padding: 'var(--sp-5)' }}
              >
                <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)' }}>
                  <h3 className="font-black text-base">🔍 Search Results ({searchResults.length})</h3>
                  <button className="btn-ghost" onClick={() => setSearchQuery('')} style={{ fontSize: '12px', padding: '4px 8px' }}>
                    Close Search
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <p className="text-muted text-sm text-center py-8">No matching records found across the encyclopedia database.</p>
                ) : (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-3)' }}>
                    {searchResults.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="card" 
                        style={{ 
                          padding: '12px 16px', 
                          background: 'var(--surface-2)', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '9px', fontWeight: 800, background: 'var(--surface-3)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', color: 'var(--primary)' }}>
                            {item.typeLabel}
                          </span>
                          <h4 style={{ fontFamily: 'var(--font-ja)', fontSize: '18px', fontWeight: 800, marginTop: '4px' }}>
                            {item.displayTitle}
                          </h4>
                          <p className="text-muted text-xs mt-1">{item.details}</p>
                          {item.exampleSentence && (
                            <p className="text-xs" style={{ fontStyle: 'italic', marginTop: '6px', color: 'var(--text-3)' }}>
                              Example: {item.exampleSentence}
                            </p>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <button 
                            onClick={() => {
                              setExplainerWord(item.raw);
                              setActiveTab('explainer');
                              setSearchQuery('');
                            }}
                            className="btn-ghost"
                            style={{ padding: '6px 12px', borderRadius: 'var(--radius)', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)' }}
                          >
                            💡 Explain
                          </button>
                          <button 
                            onClick={() => speakText(item.raw)} 
                            className="btn-ghost" 
                            style={{ padding: '8px', borderRadius: '50%' }}
                            title="Listen Pronunciation"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              
              /* ── STANDARD TABS ── */
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
              >
                
                {/* ── TAB: WORD EXPLAINER ── */}
                {activeTab === 'explainer' && (
                  <WordExplainer initialWord={explainerWord} />
                )}

                {/* ── TAB 1: KANA SYLLABARIES ── */}
                {activeTab === 'kana' && (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)' }}>
                        <div>
                          <h3 className="text-lg font-black">Phonetic Syllabaries (かな)</h3>
                          <p className="text-muted text-xs mt-1">
                            Developed in the Heian period. Tap any character below to hear its native phonetics.
                          </p>
                        </div>
                        <div className="flex gap-2" style={{ background: 'var(--surface-3)', padding: '4px', borderRadius: '8px' }}>
                          <button 
                            className={`toggle-btn ${kanaScript === 'hiragana' ? 'active' : ''}`}
                            onClick={() => setKanaScript('hiragana')}
                            style={{ padding: '6px 12px', fontSize: '12px', border: 'none', borderRadius: '6px' }}
                          >
                            Hiragana
                          </button>
                          <button 
                            className={`toggle-btn ${kanaScript === 'katakana' ? 'active' : ''}`}
                            onClick={() => setKanaScript('katakana')}
                            style={{ padding: '6px 12px', fontSize: '12px', border: 'none', borderRadius: '6px' }}
                          >
                            Katakana
                          </button>
                        </div>
                      </div>

                      {/* Character matrix */}
                      <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Basic Mora (Goūon)</h4>
                      <div className="kana-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
                        gap: '8px',
                        marginBottom: 'var(--sp-5)'
                      }}>
                        {(kanaScript === 'hiragana' ? hiraganaData : katakanaData)
                          .filter(k => k.type === 'basic')
                          .map((item) => (
                            <button
                              key={item.kana}
                              onClick={() => speakText(item.kana)}
                              className="card card-interactive"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '12px 6px',
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <span style={{ fontSize: '22px', fontWeight: 900, fontFamily: 'var(--font-ja)' }}>{item.kana}</span>
                              <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px' }}>
                                {item.romaji}
                              </span>
                            </button>
                          ))}
                      </div>

                      {/* Dakuten / Handakuten Row */}
                      <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Voiced & Plosives (Dakuten / Handakuten)</h4>
                      <div className="kana-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(64px, 1fr))',
                        gap: '8px',
                        marginBottom: 'var(--sp-5)'
                      }}>
                        {(kanaScript === 'hiragana' ? hiraganaData : katakanaData)
                          .filter(k => k.type === 'dakuten' || k.type === 'handakuten')
                          .map((item) => (
                            <button
                              key={item.kana}
                              onClick={() => speakText(item.kana)}
                              className="card card-interactive"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '10px 4px',
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)'
                              }}
                            >
                              <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-ja)' }}>{item.kana}</span>
                              <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 700, textTransform: 'uppercase' }}>
                                {item.romaji}
                              </span>
                            </button>
                          ))}
                      </div>

                      {/* Extended Katakana Specifics */}
                      {kanaScript === 'katakana' && (
                        <>
                          <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Modern European Phonetic Adaptations</h4>
                          <div className="kana-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                            gap: '8px'
                          }}>
                            {katakanaData
                              .filter(k => k.type === 'extended')
                              .map((item) => (
                                <button
                                  key={item.kana}
                                  onClick={() => speakText(item.kana)}
                                  className="card card-interactive"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '10px 4px',
                                    background: 'rgba(14, 165, 233, 0.06)',
                                    border: '1px solid rgba(14, 165, 233, 0.2)'
                                  }}
                                >
                                  <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-ja)', color: 'var(--accent-ai)' }}>{item.kana}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-2)', fontWeight: 800, textTransform: 'uppercase' }}>
                                    {item.romaji}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </>
                      )}

                      {/* Obsolete Hiragana */}
                      {kanaScript === 'hiragana' && (
                        <>
                          <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Historical/Obsolete (Obsoleted 1946)</h4>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {hiraganaData
                              .filter(k => k.type === 'obsolete')
                              .map((item) => (
                                <button
                                  key={item.kana}
                                  onClick={() => speakText(item.kana)}
                                  className="card card-interactive"
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '10px 16px',
                                    background: 'var(--surface-2)',
                                    border: '1px dashed var(--border-strong)'
                                  }}
                                >
                                  <span style={{ fontSize: '18px', color: 'var(--text-3)', fontFamily: 'var(--font-ja)' }}>{item.kana}</span>
                                  <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 700 }}>{item.romaji}</span>
                                </button>
                              ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* ── TAB 2: KANJI PROGRESSION MATRIX ── */}
                {activeTab === 'kanji' && (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h3 className="text-lg font-black">Kanji progression database</h3>
                          <p className="text-muted text-xs mt-1">2,136 mandated Jōyō characters are evaluated in standard JLPT tracks.</p>
                        </div>
                        {/* Filter tabs */}
                        <div className="flex gap-1" style={{ background: 'var(--surface-3)', padding: '3px', borderRadius: '8px' }}>
                          {(['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'] as const).map(lvl => (
                            <button
                              key={lvl}
                              className={`toggle-btn ${selectedLvlFilter === lvl ? 'active' : ''}`}
                              onClick={() => setSelectedLvlFilter(lvl)}
                              style={{ padding: '4px 10px', fontSize: '11px', border: 'none', borderRadius: '6px' }}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Grid representation */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        {kanjiData
                          .filter(k => selectedLvlFilter === 'ALL' || k.level === selectedLvlFilter)
                          .map((k) => (
                            <div 
                              key={k.kanji} 
                              className="card hover-glow" 
                              style={{ 
                                padding: '16px', 
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                display: 'grid',
                                gridTemplateColumns: '70px 1fr',
                                gap: '16px'
                              }}
                            >
                              {/* Big Kanji Block */}
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                background: 'var(--surface-3)',
                                borderRadius: '12px',
                                border: '1px solid var(--border-strong)',
                                minHeight: '80px'
                              }}>
                                <span style={{ fontSize: '32px', fontFamily: 'var(--font-ja)', fontWeight: 900 }}>{k.kanji}</span>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', marginTop: '2px' }}>{k.level}</span>
                              </div>

                              {/* Details */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div className="flex-between flex" style={{ alignItems: 'flex-start' }}>
                                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>
                                    {k.meaning}
                                  </h4>
                                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <button 
                                      onClick={() => {
                                        setExplainerWord(k.kanji);
                                        setActiveTab('explainer');
                                      }}
                                      className="btn-ghost"
                                      style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold' }}
                                    >
                                      💡 Explain
                                    </button>
                                    <button 
                                      className="btn-ghost" 
                                      onClick={() => speakText(k.kanji)} 
                                      style={{ padding: '4px', borderRadius: '50%' }}
                                    >
                                      <Volume2 size={14} />
                                    </button>
                                  </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: 'var(--text-2)' }}>
                                  <div><strong>Onyomi:</strong> {k.onyomi}</div>
                                  <div><strong>Kunyomi:</strong> {k.kunyomi}</div>
                                  <div><strong>Strokes:</strong> {k.strokes}</div>
                                  <div><strong>Radical:</strong> {k.radical}</div>
                                </div>

                                <div style={{ marginTop: '8px', padding: '8px 12px', background: 'var(--surface-3)', borderRadius: '8px', fontSize: '12px' }}>
                                  <div><strong>Compound:</strong> <span style={{ fontFamily: 'var(--font-ja)' }}>{k.exampleCompound}</span></div>
                                  <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>
                                    <strong>Example:</strong> <span style={{ fontFamily: 'var(--font-ja)' }}>{k.exampleSentence}</span>
                                    <button 
                                      className="btn-ghost inline-flex" 
                                      onClick={() => speakText(k.exampleSentence)} 
                                      style={{ padding: '2px', marginLeft: '6px', verticalAlign: 'middle' }}
                                    >
                                      <Volume2 size={10} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: VOCABULARY & SLANG ── */}
                {activeTab === 'vocab' && (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <div className="flex-between flex" style={{ marginBottom: 'var(--sp-4)', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h3 className="text-lg font-black">Vocabulary, Slang, & Honorifics</h3>
                          <p className="text-muted text-xs mt-1">Multi-domain lexical databases spanning corporate and subcultural registers.</p>
                        </div>
                        {/* Selector */}
                        <select
                          value={vocabCatFilter}
                          onChange={(e) => setVocabCatFilter(e.target.value)}
                          style={{
                            padding: '8px 12px',
                            background: 'var(--surface-3)',
                            border: '1px solid var(--border-strong)',
                            borderRadius: '8px',
                            color: 'var(--text)',
                            fontSize: '12px',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="ALL">Show All Categories</option>
                          <option value="daily">🏠 Daily Life & Food</option>
                          <option value="travel">✈️ Travel & Health</option>
                          <option value="tech">💻 Business & Tech</option>
                          <option value="color">🎨 Chromatic Colors</option>
                          <option value="kinship">👥 Kinship (Uchi/Soto)</option>
                          <option value="conversation">💬 Dialogues</option>
                          <option value="keigo">👔 Business Keigo</option>
                          <option value="slang">🍿 Anime Slang</option>
                          <option value="lexicon">📖 Lexicographical Dict</option>
                        </select>
                      </div>

                      <div className="flex" style={{ flexDirection: 'column', gap: '12px' }}>
                        {vocabData
                          .filter(v => vocabCatFilter === 'ALL' || v.category === vocabCatFilter)
                          .map((v, idx) => (
                            <div 
                              key={idx} 
                              className="card hover-glow" 
                              style={{ 
                                padding: '14px', 
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '12px'
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '8px', fontWeight: 800, background: 'var(--surface-3)', color: 'var(--primary)', padding: '1px 5px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                    {v.category}
                                  </span>
                                </div>
                                <h4 style={{ fontFamily: 'var(--font-ja)', fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>
                                  {v.japanese}
                                </h4>
                                <div className="text-muted text-xs mt-1" style={{ display: 'flex', gap: '8px' }}>
                                  <span>{v.hiragana}</span>
                                  <span>•</span>
                                  <span style={{ fontStyle: 'italic' }}>{v.romaji}</span>
                                </div>
                                <p style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '6px', color: 'var(--text)' }}>
                                  {v.english}
                                </p>
                                <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px', fontFamily: 'var(--font-ja)' }}>
                                  {v.exampleSentence}
                                </p>
                              </div>

                              <div className="flex" style={{ flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                <button 
                                  onClick={() => {
                                    setExplainerWord(v.japanese.split('/')[0].trim());
                                    setActiveTab('explainer');
                                  }}
                                  className="btn-ghost"
                                  style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '10px', color: 'var(--primary)', fontWeight: 'bold' }}
                                >
                                  💡 Explain
                                </button>
                                <button 
                                  onClick={() => speakText(v.japanese.split('/')[0].trim())} 
                                  className="btn-ghost" 
                                  style={{ padding: '8px', borderRadius: '50%' }}
                                  title="Play Word Audio"
                                >
                                  <Volume2 size={16} />
                                </button>
                                <button 
                                  onClick={() => speakText(v.exampleSentence.split('(')[0])} 
                                  className="btn-ghost" 
                                  style={{ padding: '6px', borderRadius: '50%', color: 'var(--text-3)' }}
                                  title="Play Example Audio"
                                >
                                  <Volume2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: TEMPORAL & MATH ── */}
                {activeTab === 'temp_nums' && (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    
                    {/* Numbers Matrix */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">🔢 Base Numerals & Scale Factors</h3>
                      <p className="text-muted text-xs mb-4">Japanese scales in blocks of four zeros (myriads) rather than three.</p>
                      
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-strong)', textAlign: 'left' }}>
                              <th style={{ padding: '8px' }}>Value</th>
                              <th style={{ padding: '8px' }}>Sino-Japanese</th>
                              <th style={{ padding: '8px' }}>Romaji</th>
                              <th style={{ padding: '8px' }}>Native Japanese (Wago)</th>
                              <th style={{ padding: '8px' }}>Wago Romaji</th>
                            </tr>
                          </thead>
                          <tbody>
                            {numeralData.map((num) => (
                              <tr key={num.val} style={{ borderBottom: '1px solid var(--border)', background: 'transparent' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{num.val}</td>
                                <td style={{ padding: '8px', fontFamily: 'var(--font-ja)' }}>{num.kango}</td>
                                <td style={{ padding: '8px' }}>{num.kangoRomaji}</td>
                                <td style={{ padding: '8px', fontFamily: 'var(--font-ja)' }}>{num.wago}</td>
                                <td style={{ padding: '8px' }}>{num.wagoRomaji}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Numeric Classifiers */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">🏷️ Numeric Classifiers (Counters)</h3>
                      <p className="text-muted text-xs mb-4">Classifiers are syntactically mandatory. Native pronunciation changes (gemination/rendaku) occur on quantities 1-4.</p>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        {counterData.map((c) => (
                          <div key={c.category} style={{ padding: '12px', background: 'var(--surface-2)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div className="flex-between flex">
                              <h4 style={{ fontWeight: 800, fontSize: '13px' }}>{c.category} ({c.suffix})</h4>
                            </div>
                            <div className="grid gap-2 mt-2" style={{ gridTemplateColumns: 'repeat(4, 1fr)', fontSize: '11px', textAlign: 'center' }}>
                              <div style={{ background: 'var(--surface-3)', padding: '6px', borderRadius: '4px' }}>
                                <div style={{ color: 'var(--text-3)' }}>1</div>
                                <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{c.qty1}</div>
                              </div>
                              <div style={{ background: 'var(--surface-3)', padding: '6px', borderRadius: '4px' }}>
                                <div style={{ color: 'var(--text-3)' }}>2</div>
                                <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{c.qty2}</div>
                              </div>
                              <div style={{ background: 'var(--surface-3)', padding: '6px', borderRadius: '4px' }}>
                                <div style={{ color: 'var(--text-3)' }}>3</div>
                                <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{c.qty3}</div>
                              </div>
                              <div style={{ background: 'var(--surface-3)', padding: '6px', borderRadius: '4px' }}>
                                <div style={{ color: 'var(--text-3)' }}>4</div>
                                <div style={{ fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{c.qty4}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Irregular Calendar Days */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">📅 Days of the Month: Irregular Readings</h3>
                      <p className="text-muted text-xs mb-4">Days 1-10, plus 14th, 20th, and 24th do not use standard Sino-Japanese numbers.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px' }}>
                        {irregularDays.map((d) => (
                          <div key={d.day} style={{ padding: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', color: 'var(--text-3)', fontWeight: 'bold' }}>{d.day}</span>
                            <span style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'var(--font-ja)', margin: '2px 0' }}>{d.kanji}</span>
                            <span style={{ fontSize: '10px', color: 'var(--primary)', fontStyle: 'italic' }}>{d.reading}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Traditional Month Names (Wafu Getsumei) */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">🌸 Traditional Calendar Months (Wafū Getsumei)</h3>
                      <p className="text-muted text-xs mb-4">Deeply poetic traditional months used before the 1868 Meiji reform.</p>
                      
                      <div className="flex" style={{ flexDirection: 'column', gap: '8px' }}>
                        {monthData.map((m) => (
                          <div key={m.number} style={{ display: 'grid', gridTemplateColumns: '80px 140px 1fr', gap: '12px', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 'bold' }}>Month {m.number}</div>
                            <div>
                              <div style={{ fontFamily: 'var(--font-ja)', fontWeight: 800, color: 'var(--primary)' }}>
                                {m.traditional}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--text-3)' }}>({m.traditionalRomaji})</div>
                            </div>
                            <div>
                              <div style={{ color: 'var(--text)', fontWeight: 700 }}>{m.modern}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '2px' }}>{m.meaning}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 5: YEN & FINANCE ── */}
                {activeTab === 'yen' && (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    
                    {/* Banknotes Card */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">💴 Banknote redesign matrix (July 3, 2024 Epoch)</h3>
                      <p className="text-muted text-xs mb-4">Incorporates state-of-the-art 3D holograms, high-definition watermarks, and new historical portraits.</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {banknoteData.map((note) => (
                          <div 
                            key={note.denomination} 
                            style={{ 
                              padding: '16px', 
                              background: 'var(--surface-2)', 
                              borderRadius: '12px', 
                              border: '1px solid var(--border)',
                              display: 'grid',
                              gridTemplateColumns: '90px 1fr',
                              gap: '16px'
                            }}
                          >
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              background: 'var(--surface-3)', 
                              border: '1px solid var(--border-strong)', 
                              borderRadius: '8px',
                              fontWeight: 900,
                              color: 'var(--primary)',
                              fontSize: '14px'
                            }}>
                              {note.denomination}
                            </div>
                            <div>
                              <h4 style={{ fontWeight: 800, fontSize: '14px' }}>
                                Portrait: {note.portrait}
                              </h4>
                              <p className="text-xs text-muted mt-1">Backside Design: {note.backDesign}</p>
                              <p style={{ fontSize: '12px', marginTop: '8px', color: 'var(--text)' }}>
                                {note.symbolism}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Coins table */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">🪙 Modern Coin Specifications</h3>
                      <p className="text-muted text-xs mb-4">Detailed coin compositions and reverse/obverse designs.</p>
                      
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-strong)', textAlign: 'left' }}>
                              <th style={{ padding: '8px' }}>Denomination</th>
                              <th style={{ padding: '8px' }}>Composition</th>
                              <th style={{ padding: '8px' }}>Obverse Design</th>
                              <th style={{ padding: '8px' }}>Reverse Design</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coinData.map((c) => (
                              <tr key={c.denomination} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '8px', fontWeight: 'bold' }}>{c.denomination}</td>
                                <td style={{ padding: '8px' }}>{c.composition}</td>
                                <td style={{ padding: '8px', fontFamily: 'var(--font-ja)' }}>{c.obverse}</td>
                                <td style={{ padding: '8px', fontFamily: 'var(--font-ja)' }}>{c.reverse}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                )}

                {/* ── TAB 6: JLPT & INDIA CENTERS ── */}
                {activeTab === 'jlpt_centers' && (
                  <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)' }}>
                    
                    {/* Exam mechanics */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">🎓 Examination Mechanics & IRT Scoring</h3>
                      <p className="text-muted text-xs mb-4">Standardized scoring infrastructure managed by Japan Foundation & JEES.</p>

                      <div className="grid gap-3 responsive-split" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><Award size={16} /> Item Response Theory (IRT)</h4>
                          <p style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-secondary)' }}>
                            Scores are scaled statistically based on response patterns to ensure equality across exams, rather than calculating raw correct counts.
                          </p>
                        </div>
                        <div style={{ background: 'var(--surface-2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontWeight: 800, fontSize: '13px' }} className="flex gap-2"><Info size={16} /> Section Pass Cutoffs</h4>
                          <p style={{ fontSize: '11px', marginTop: '6px', color: 'var(--text-secondary)' }}>
                            Candidates must pass both the cumulative overall score and achieve a minimum of 31.67% on each isolated skill section (Vocabulary/Grammar, Reading, Listening).
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* India exam centers list */}
                    <div className="card" style={{ padding: 'var(--sp-5)' }}>
                      <h3 className="text-base font-black mb-1">📍 Authorized JLPT Exam Centers in India</h3>
                      <p className="text-muted text-xs mb-4">Conducts tests biannually in July and December utilizing physical OMR marksheets and pencils.</p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        {indiaCenterData.map((center) => (
                          <div 
                            key={center.city} 
                            style={{ 
                              padding: '12px', 
                              background: 'var(--surface-2)', 
                              borderRadius: '8px', 
                              border: '1px solid var(--border)',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px'
                            }}
                          >
                            <div style={{ 
                              background: 'rgba(22, 163, 74, 0.1)', 
                              padding: '8px', 
                              borderRadius: '6px', 
                              color: 'var(--primary)' 
                            }}>
                              <MapPin size={18} />
                            </div>
                            <div>
                              <h4 style={{ fontWeight: 800, fontSize: '13px' }}>
                                {center.city} Center
                              </h4>
                              <div style={{ fontSize: '11px', color: 'var(--text-2)', marginTop: '2px', fontWeight: 'bold' }}>
                                Host: {center.sponsor}
                              </div>
                              <p style={{ fontSize: '11px', marginTop: '4px', color: 'var(--text-3)' }}>
                                {center.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
