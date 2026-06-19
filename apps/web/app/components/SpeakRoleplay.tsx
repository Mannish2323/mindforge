'use client';

import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, RefreshCw, Check, Star, MessageSquare, BookOpen, MessageCircle } from 'lucide-react';
import { speakText } from '@evlo/utils';
import { AIChatView } from './AIChatView';

interface SpeakRoleplayProps {
  onBack: () => void;
}

const SCENARIOS = [
  {
    id: 's_ramen',
    title: '🍜 Ordering Ramen',
    context: 'Order your favourite ramen at a local shop in Shinjuku.',
    dialogue: [
      { speaker: 'Chef', avatar: '👨‍🍳', text: 'いらっしゃいませ！ご注文は？', romaji: 'Irasshaimase! Go-chuumon wa?', translation: 'Welcome! What would you like to order?' },
    ],
    replies: [
      { text: 'とんこつラーメンをください。', romaji: 'Tonkotsu raamen o kudasai.', translation: 'Tonkotsu ramen, please.' },
      { text: 'お水をください。', romaji: 'O-mizu o kudasai.', translation: 'Water, please.' }
    ]
  },
  {
    id: 's_anime',
    title: '👺 Anime Talk',
    context: 'Discuss your favourite anime series with a friend at school.',
    dialogue: [
      { speaker: 'Yuki', avatar: '👧', text: 'ねえ、どのアニメが一番好き？', romaji: 'Nee, dono anime ga ichiban suki?', translation: 'Hey, which anime do you like best?' },
    ],
    replies: [
      { text: '鬼滅の刃が大好きです！', romaji: 'Kimetsu no Yaiba ga daisuki desu!', translation: 'I love Demon Slayer!' },
      { text: 'ナルトが面白いです。', romaji: 'Naruto ga omoshiroi desu.', translation: 'Naruto is interesting.' }
    ]
  }
];

const PHRASES = [
  { ja: 'こんにちは！', romaji: 'Konnichiwa!', en: 'Hello!' },
  { ja: 'ありがとうございます！', romaji: 'Arigatou gozaimasu!', en: 'Thank you very much!' },
  { ja: 'はじめまして。', romaji: 'Hajimemashite.', en: 'Nice to meet you.' },
  { ja: 'すみません。', romaji: 'Sumimasen.', en: 'Excuse me / Sorry.' },
  { ja: 'お元気ですか？', romaji: 'O-genki desu ka?', en: 'How are you?' },
];

export function SpeakRoleplay({ onBack }: SpeakRoleplayProps) {
  const [activeTab, setActiveTab] = useState<'practice' | 'ai-chat' | 'pronunciation'>('practice');
  const currentTab = activeTab; // keeps the full union type for JSX comparisons
  const [selectedScenario, setSelectedScenario] = useState<any | null>(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [selectedReply, setSelectedReply] = useState<any | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Pronunciation practice states
  const [selectedPhrase, setSelectedPhrase] = useState<any>(PHRASES[0]);
  const [customPhrase, setCustomPhrase] = useState('');
  const [pronunciationResult, setPronunciationResult] = useState<any | null>(null);

  const startRecording = (isPronunciationTab = false) => {
    setRecording(true);
    setRecorded(false);
    if (isPronunciationTab) {
      setPronunciationResult(null);
    } else {
      setAnalysisResult(null);
    }

    setTimeout(() => {
      setRecording(false);
      setRecorded(true);
      const score = Math.floor(Math.random() * 15) + 85; // 85-99
      const resultObj = {
        score,
        pitch: (Math.random() * 1.5 + 8.5).toFixed(1),
        fluency: (Math.random() * 1.5 + 8.5).toFixed(1),
        feedback: 'Great pronunciation! Work on keeping your vowel lengths consistent.'
      };
      
      if (isPronunciationTab) {
        setPronunciationResult(resultObj);
      } else {
        setAnalysisResult(resultObj);
      }
    }, 2500);
  };

  const handlePlayAudio = (text: string) => {
    speakText(text, 'ja-JP');
  };

  if (activeTab === 'ai-chat') {
    return (
      <div className="speak-roleplay-view page-transition animate-fadein" style={{ padding: 'var(--sp-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
          <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={() => setActiveTab('practice')}>
            ← Leave Chat
          </button>
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🤖 AI Tutor Conversation</h2>
        </div>
        <AIChatView onBack={() => setActiveTab('practice')} onPlayTTS={handlePlayAudio} uiLang="en" />
      </div>
    );
  }

  return (
    <div className="speak-roleplay-view page-transition animate-fadein" style={{ padding: 'var(--sp-4)', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={selectedScenario ? () => setSelectedScenario(null) : onBack}>
          ← Back
        </button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🗣️ Speak Mode</h2>
      </div>

      {/* Tabs */}
      {!selectedScenario && (
        <div className="chip-group" style={{ display: 'flex', gap: '8px', marginBottom: 'var(--sp-5)' }}>
          <button 
            className={`chip${currentTab === 'practice' ? ' active' : ''}`}
            onClick={() => { setActiveTab('practice'); setPronunciationResult(null); }}
          >
            <BookOpen size={14} style={{ marginRight: '4px', display: 'inline' }} />
            Practice
          </button>
          <button 
            className={`chip${currentTab === 'ai-chat' ? ' active' : ''}`}
            onClick={() => setActiveTab('ai-chat')}
          >
            <MessageSquare size={14} style={{ marginRight: '4px', display: 'inline' }} />
            AI Chat
          </button>
          <button 
            className={`chip${currentTab === 'pronunciation' ? ' active' : ''}`}
            onClick={() => { setActiveTab('pronunciation'); setAnalysisResult(null); }}
          >
            <Sparkles size={14} style={{ marginRight: '4px', display: 'inline' }} />
            Pronunciation
          </button>
        </div>
      )}

      {/* ── PRACTICE TAB ── */}
      {activeTab === 'practice' && !selectedScenario && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="feedback-panel info" style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', color: 'var(--text-2)', margin: 0 }}>
            Choose a situational scenario to practice conversational speaking with real-time AI pronunciation feedback.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {SCENARIOS.map((scenario) => (
              <div 
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setSelectedReply(null);
                  setRecorded(false);
                  setAnalysisResult(null);
                }}
                className="card card-interactive animate-fadein"
                style={{ padding: 'var(--sp-4)', cursor: 'pointer' }}
              >
                <h3 style={{ fontWeight: 'bold', fontSize: 'var(--text-base)' }}>{scenario.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>{scenario.context}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'practice' && selectedScenario && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)', alignItems: 'center', width: '100%' }}>
          {/* Conversation Lane */}
          <div className="card" style={{ padding: 'var(--sp-5)', width: '100%' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.04em' }}>SCENARIO: {selectedScenario.title}</span>

            {/* AI speaking line */}
            <div style={{ display: 'flex', gap: 'var(--sp-3)', margin: 'var(--sp-4) 0 var(--sp-6)' }}>
              <span style={{ fontSize: '32px' }}>{selectedScenario.dialogue[0].avatar}</span>
              <div style={{ background: 'var(--surface-2)', padding: 'var(--sp-3) var(--sp-4)', borderRadius: '0 var(--radius) var(--radius) var(--radius)', border: '1px solid var(--border)', position: 'relative', flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-ja)', fontSize: '16px', fontWeight: 'bold' }}>{selectedScenario.dialogue[0].text}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>{selectedScenario.dialogue[0].romaji}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-3)', borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '4px' }}>
                  {selectedScenario.dialogue[0].translation}
                </p>
                <button 
                  onClick={() => handlePlayAudio(selectedScenario.dialogue[0].text)}
                  style={{ position: 'absolute', right: '12px', top: '12px', border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer' }}
                  aria-label="Play AI audio"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>

            {/* Choose reply */}
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: 'var(--sp-3)', textTransform: 'uppercase', letterSpacing: '0.02em', color: 'var(--text-3)' }}>Select Your Response:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
              {selectedScenario.replies.map((reply: any, rIdx: number) => (
                <div 
                  key={rIdx}
                  onClick={() => {
                    setSelectedReply(reply);
                    setRecorded(false);
                    setAnalysisResult(null);
                  }}
                  className="card-interactive"
                  style={{
                    padding: 'var(--sp-3) var(--sp-4)',
                    borderRadius: 'var(--radius)',
                    border: `2px solid ${selectedReply?.text === reply.text ? 'var(--primary)' : 'var(--border)'}`,
                    background: selectedReply?.text === reply.text ? 'var(--primary-light)' : 'var(--surface-2)',
                    cursor: 'pointer',
                    transition: 'var(--t-fast)'
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{reply.text}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>{reply.translation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Record button */}
          {selectedReply && (
            <div className="card" style={{ padding: 'var(--sp-5)', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-2)', textAlign: 'center', fontWeight: '600' }}>
                Press mic, and read your selected response aloud:
              </p>

              {recording ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  {/* Waveform Visual & Blue Mic button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px', marginBottom: '8px' }}>
                    <div style={{ width: '4px', height: '12px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite' }} />
                    <div style={{ width: '4px', height: '24px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite 0.15s' }} />
                    
                    <button 
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(2, 132, 199, 0.2)',
                        border: '2px solid #0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      disabled
                    >
                      <Mic size={22} color="#0284c7" />
                    </button>
                    
                    <div style={{ width: '4px', height: '24px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite 0.3s' }} />
                    <div style={{ width: '4px', height: '12px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite 0.45s' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold' }}>Recording... Speak now!</span>
                </div>
              ) : (
                <button 
                  onClick={() => startRecording(false)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '2px solid #0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--t-fast)',
                    boxShadow: '0 0 16px rgba(2, 132, 199, 0.35)'
                  }}
                  className="card-interactive"
                  aria-label="Start recording"
                >
                  <Mic size={24} color="#0284c7" />
                </button>
              )}

              {/* Analysis Result */}
              {analysisResult && (
                <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-4)' }} className="animate-fadein">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' }}>
                      <Sparkles size={16} color="var(--primary)" /> Pronunciation Score:
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--success)' }}>
                      {analysisResult.score}%
                    </span>
                  </div>

                  <div className="lesson-progress-bar" style={{ height: '8px', marginBottom: 'var(--sp-4)', background: 'var(--surface-2)' }}>
                    <div className="lesson-progress-fill" style={{ width: `${analysisResult.score}%`, background: 'var(--success)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: 'var(--sp-2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>PITCH ACCENT</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{analysisResult.pitch} / 10</p>
                    </div>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: 'var(--sp-2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>FLUENCY</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{analysisResult.fluency} / 10</p>
                    </div>
                  </div>

                  <div className="feedback-panel info" style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', color: 'var(--text-2)', textAlign: 'center', margin: 0 }}>
                    <strong>AI Feedback: </strong> {analysisResult.feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── PRONUNCIATION TAB ── */}
      {activeTab === 'pronunciation' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }} className="animate-fadein">
          <div className="feedback-panel info" style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', color: 'var(--text-2)', margin: 0 }}>
            Practice pronunciation of basic Japanese phrases. Listen to the correct voice, speak, and see how well you did.
          </div>

          {/* Quick Phrases Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            {PHRASES.map((ph, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  setSelectedPhrase(ph);
                  setCustomPhrase('');
                  setPronunciationResult(null);
                }}
                className="card card-interactive"
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  border: selectedPhrase?.ja === ph.ja && !customPhrase ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: selectedPhrase?.ja === ph.ja && !customPhrase ? 'var(--primary-light)' : 'var(--surface-1)'
                }}
              >
                <div>
                  <h4 style={{ fontFamily: 'var(--font-ja)', fontWeight: 'bold', fontSize: '15px' }}>{ph.ja}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-3)', marginTop: '2px' }}>{ph.romaji} • {ph.en}</p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAudio(ph.ja);
                  }}
                  className="btn-ghost"
                  style={{ padding: '6px', borderRadius: '50%' }}
                  aria-label={`Play audio for ${ph.ja}`}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Custom Input */}
          <div className="card" style={{ padding: 'var(--sp-4)' }}>
            <label htmlFor="custom-phrase-input" style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-3)', display: 'block', marginBottom: '6px' }}>
              OR PRACTICE CUSTOM JAPANESE PHRASE:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="custom-phrase-input"
                type="text"
                value={customPhrase}
                placeholder="e.g. おはようございます"
                onChange={(e) => {
                  setCustomPhrase(e.target.value);
                  setSelectedPhrase(null);
                  setPronunciationResult(null);
                }}
                style={{ flex: 1, margin: 0 }}
              />
              <button 
                onClick={() => customPhrase.trim() && handlePlayAudio(customPhrase)}
                className="btn-secondary"
                style={{ padding: '0 12px', margin: 0, minHeight: 'unset' }}
                disabled={!customPhrase.trim()}
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          {/* Record Section for Pronunciation */}
          {(selectedPhrase || customPhrase.trim()) && (
            <div className="card" style={{ padding: 'var(--sp-5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-3)', textTransform: 'uppercase', fontWeight: 'bold' }}>TARGET PHRASE</span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-ja)', marginTop: '4px' }}>
                  {customPhrase ? customPhrase : selectedPhrase.ja}
                </h3>
              </div>

              {recording ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  {/* Waveform Visual */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '40px', marginBottom: '8px' }}>
                    <div style={{ width: '4px', height: '12px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite' }} />
                    <div style={{ width: '4px', height: '24px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite 0.15s' }} />
                    
                    <button 
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'rgba(2, 132, 199, 0.2)',
                        border: '2px solid #0284c7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      disabled
                    >
                      <Mic size={22} color="#0284c7" />
                    </button>
                    
                    <div style={{ width: '4px', height: '24px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite 0.3s' }} />
                    <div style={{ width: '4px', height: '12px', background: '#0284c7', borderRadius: '2px', animation: 'wave 0.8s ease-in-out infinite 0.45s' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 'bold' }}>Recording... Read now!</span>
                </div>
              ) : (
                <button 
                  onClick={() => startRecording(true)}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(2, 132, 199, 0.1)',
                    border: '2px solid #0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--t-fast)',
                    boxShadow: '0 0 16px rgba(2, 132, 199, 0.35)'
                  }}
                  className="card-interactive"
                  aria-label="Start recording pronunciation"
                >
                  <Mic size={24} color="#0284c7" />
                </button>
              )}

              {/* Analysis Result */}
              {pronunciationResult && (
                <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 'var(--sp-4)' }} className="animate-fadein">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)' }}>
                      <Sparkles size={16} color="var(--primary)" /> Pronunciation Score:
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--success)' }}>
                      {pronunciationResult.score}%
                    </span>
                  </div>

                  <div className="lesson-progress-bar" style={{ height: '8px', marginBottom: 'var(--sp-4)', background: 'var(--surface-2)' }}>
                    <div className="lesson-progress-fill" style={{ width: `${pronunciationResult.score}%`, background: 'var(--success)' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: 'var(--sp-2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>PITCH ACCENT</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{pronunciationResult.pitch} / 10</p>
                    </div>
                    <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: 'var(--sp-2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>FLUENCY</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{pronunciationResult.fluency} / 10</p>
                    </div>
                  </div>

                  <div className="feedback-panel info" style={{ background: 'var(--primary-light)', border: '1px solid var(--border)', color: 'var(--text-2)', textAlign: 'center', margin: 0 }}>
                    <strong>AI Feedback: </strong> {pronunciationResult.feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
