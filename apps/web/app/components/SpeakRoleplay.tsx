'use client';

import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, RefreshCw, Check, Star } from 'lucide-react';
import { speakText } from '@evlo/utils';

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

export function SpeakRoleplay({ onBack }: SpeakRoleplayProps) {
  const [selectedScenario, setSelectedScenario] = useState<any | null>(null);
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [selectedReply, setSelectedReply] = useState<any | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  const startRecording = () => {
    setRecording(true);
    setRecorded(false);
    setAnalysisResult(null);
    setTimeout(() => {
      setRecording(false);
      setRecorded(true);
      // Generate mock speaking analytics
      setAnalysisResult({
        score: Math.floor(Math.random() * 15) + 85, // 85-99
        pitch: (Math.random() * 1.5 + 8.5).toFixed(1),
        fluency: (Math.random() * 1.5 + 8.5).toFixed(1),
        feedback: 'Excellent pronunciation! Watch the double consonant vowel length.'
      });
    }, 2500);
  };

  const handlePlayAudio = (text: string) => {
    speakText(text, 'ja-JP');
  };

  return (
    <div className="speak-roleplay-view page-enter" style={{ padding: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
        <button className="btn btn-ghost btn-sm" onClick={selectedScenario ? () => setSelectedScenario(null) : onBack}>
          ← Back
        </button>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>🗣️ Phrase Speaking & Roleplay</h2>
      </div>

      {!selectedScenario ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Choose a situational scenario to practice conversational speaking with real-time AI pronunciation feedback.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {SCENARIOS.map((scenario) => (
              <div 
                key={scenario.id}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setSelectedReply(null);
                  setRecorded(false);
                  setAnalysisResult(null);
                }}
                className="card-glass hover-card"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}
              >
                <h3 style={{ fontWeight: 'bold', fontSize: 'var(--text-md)' }}>{scenario.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{scenario.context}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
          {/* Conversation Lane */}
          <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SCENARIO: {selectedScenario.title}</span>

            {/* AI speaking line */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', margin: 'var(--space-4) 0 var(--space-6)' }}>
              <span style={{ fontSize: '32px' }}>{selectedScenario.dialogue[0].avatar}</span>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 'var(--space-3) var(--space-4)', borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)', border: '1px solid var(--border)', position: 'relative', flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-ja)', fontSize: '16px', fontWeight: 'bold' }}>{selectedScenario.dialogue[0].text}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>{selectedScenario.dialogue[0].romaji}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '4px' }}>
                  {selectedScenario.dialogue[0].translation}
                </p>
                <button 
                  onClick={() => handlePlayAudio(selectedScenario.dialogue[0].text)}
                  style={{ position: 'absolute', right: '8px', top: '8px', border: 'none', background: 'transparent', color: 'var(--green-400)', cursor: 'pointer' }}
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>

            {/* Choose reply */}
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: 'var(--space-3)' }}>Your Response:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {selectedScenario.replies.map((reply: any, rIdx: number) => (
                <div 
                  key={rIdx}
                  onClick={() => {
                    setSelectedReply(reply);
                    setRecorded(false);
                    setAnalysisResult(null);
                  }}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${selectedReply?.text === reply.text ? 'var(--blue)' : 'var(--border)'}`,
                    background: selectedReply?.text === reply.text ? 'rgba(14, 165, 233, 0.08)' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <p style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>{reply.text}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{reply.translation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Record button */}
          {selectedReply && (
            <div className="card-glass" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Press mic, and read your selected response aloud:
              </p>

              {recording ? (
                <div className="flex flex-col items-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div 
                    className="animate-pulse" 
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '2px solid var(--red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Mic size={24} color="var(--red)" />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--red)', fontWeight: 'bold' }}>Recording... Read now!</span>
                </div>
              ) : (
                <button 
                  onClick={startRecording}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'rgba(14, 165, 233, 0.15)',
                    border: '2px solid var(--blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Mic size={24} color="var(--blue)" />
                </button>
              )}

              {/* Analysis Result */}
              {analysisResult && (
                <div style={{ width: '100%', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={16} color="var(--blue)" /> Pronunciation Score:
                    </span>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--green-400)' }}>
                      {analysisResult.score}%
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PITCH ACCENT</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--blue)' }}>{analysisResult.pitch} / 10</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FLUENCY</span>
                      <p style={{ fontWeight: 'bold', color: 'var(--blue)' }}>{analysisResult.fluency} / 10</p>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>
                    {analysisResult.feedback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
