'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Mic, MicOff, RotateCcw, Volume2, Sparkles, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

const CONVERSATIONS = [
  {
    id: 'greet', title: 'Greetings', level: 'N5', emoji: '👋',
    prompts: [
      { jp: 'おはようございます。', en: 'Good morning.', hint: 'A formal morning greeting' },
      { jp: 'お元気ですか？', en: 'How are you?', hint: 'A polite inquiry about someone\'s well-being' },
      { jp: 'はじめまして。どうぞよろしく。', en: 'Nice to meet you. Please treat me well.', hint: 'Standard first-time meeting phrase' },
    ],
  },
  {
    id: 'shopping', title: 'Shopping', level: 'N5', emoji: '🛍️',
    prompts: [
      { jp: 'これはいくらですか？', en: 'How much is this?', hint: 'Asking for a price' },
      { jp: 'これをください。', en: 'Please give me this.', hint: 'Making a purchase request' },
      { jp: 'カードで払えますか？', en: 'Can I pay by card?', hint: 'Asking about payment method' },
    ],
  },
  {
    id: 'restaurant', title: 'Restaurant', level: 'N5', emoji: '🍜',
    prompts: [
      { jp: 'メニューをください。', en: 'Please give me the menu.', hint: 'Asking for a menu' },
      { jp: 'おすすめは何ですか？', en: 'What do you recommend?', hint: 'Asking for recommendations' },
      { jp: 'お会計をお願いします。', en: 'Check please.', hint: 'Asking for the bill' },
    ],
  },
];

type RecordingState = 'idle' | 'recording' | 'processing' | 'done';

export default function SpeakingPage() {
  const { user } = useAuth();
  const [selectedConv, setSelectedConv] = useState(CONVERSATIONS[0]);
  const [promptIdx, setPromptIdx] = useState(0);
  const [recordState, setRecordState] = useState<RecordingState>('idle');
  const [transcript, setTranscript] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<{jp:string;said:string;score:number}[]>([]);
  const recognitionRef = useRef<any>(null);

  const currentPrompt = selectedConv.prompts[promptIdx];

  const playNative = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP'; u.rate = 0.85; u.pitch = 1.1;
      speechSynthesis.speak(u);
    }
  };

  const calculateScore = (said: string, target: string): number => {
    const s = said.replace(/[。、！？\s]/g, '').toLowerCase();
    const t = target.replace(/[。、！？\s]/g, '').toLowerCase();
    if (s === t) return 100;
    let matches = 0;
    for (const char of s) { if (t.includes(char)) matches++; }
    return Math.round((matches / Math.max(s.length, t.length)) * 100);
  };

  const startRecording = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser. Use Chrome.'); return; }
    const recognition = new SR();
    recognition.lang = 'ja-JP';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      setTranscript(result[0].transcript);
    };
    recognition.onend = () => {
      setRecordState('processing');
      setTimeout(() => {
        const sc = calculateScore(transcript, currentPrompt.jp);
        setScore(sc);
        setHistory(prev => [...prev, { jp: currentPrompt.jp, said: transcript, score: sc }]);
        setRecordState('done');
      }, 600);
    };
    recognition.onerror = () => setRecordState('idle');

    setRecordState('recording');
    setTranscript('');
    setScore(null);
    recognition.start();
  }, [transcript, currentPrompt]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const nextPrompt = () => {
    const next = (promptIdx + 1) % selectedConv.prompts.length;
    setPromptIdx(next);
    setRecordState('idle');
    setTranscript('');
    setScore(null);
  };

  return (
    <div className="space-y-5 animate-fade-up max-w-3xl mx-auto">
      {/* Conversation selector */}
      <div className="grid grid-cols-3 gap-3">
        {CONVERSATIONS.map(c => (
          <button key={c.id} onClick={() => { setSelectedConv(c); setPromptIdx(0); setRecordState('idle'); setTranscript(''); setScore(null); }}
            className="card p-3 text-left transition-all hover:scale-[1.02]"
            style={selectedConv.id === c.id ? { border: '2px solid rgba(124,58,237,0.5)', background: 'rgba(124,58,237,0.12)' } : {}}>
            <div className="text-xl mb-1">{c.emoji}</div>
            <div className="text-xs font-black text-white">{c.title}</div>
            <JLPTBadge level={c.level} size="xs" className="mt-1" />
          </button>
        ))}
      </div>

      {/* Main practice card */}
      <Card padding="lg">
        {/* Prompt */}
        <div className="text-center mb-6">
          <div className="text-xs mb-3 font-bold" style={{ color: 'rgba(167,139,250,0.6)' }}>
            {promptIdx + 1} / {selectedConv.prompts.length} — {selectedConv.title}
          </div>
          <div className="text-3xl font-jp font-black text-white mb-2">{currentPrompt.jp}</div>
          <div className="text-base mb-1" style={{ color: 'rgba(200,196,255,0.7)' }}>{currentPrompt.en}</div>
          <div className="text-xs italic" style={{ color: 'rgba(160,150,220,0.5)' }}>{currentPrompt.hint}</div>
        </div>

        {/* Listen button */}
        <div className="flex justify-center mb-6">
          <Button variant="ghost" onClick={() => playNative(currentPrompt.jp)}>
            <Volume2 className="w-4 h-4" /> Listen to Native
          </Button>
        </div>

        {/* Transcript display */}
        <div className="min-h-14 mb-6 p-4 rounded-xl text-center"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}>
          {transcript
            ? <span className="text-lg font-jp text-white">{transcript}</span>
            : <span className="text-sm" style={{ color: 'rgba(160,150,220,0.4)' }}>
                {recordState === 'recording' ? '🎙 Listening…' : 'Your speech will appear here'}
              </span>
          }
        </div>

        {/* Score */}
        {score !== null && (
          <div className="mb-6 animate-fade-up">
            <div className="text-center mb-3">
              <div className="text-4xl font-black mb-1"
                style={{ color: score >= 80 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171' }}>
                {score}%
              </div>
              <div className="text-sm" style={{ color: 'rgba(160,150,220,0.6)' }}>
                {score >= 80 ? '🎉 Excellent pronunciation!' : score >= 50 ? '👍 Good effort! Keep practicing.' : '💪 Keep trying! Listen and repeat.'}
              </div>
            </div>
            <ProgressBar value={score} color={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'} size="md" animated />
          </div>
        )}

        {/* Record button */}
        <div className="flex flex-col items-center gap-3">
          {recordState === 'idle' || recordState === 'done' ? (
            <button onClick={startRecording}
              className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #db2777)', boxShadow: '0 0 32px rgba(124,58,237,0.5)' }}>
              <Mic className="w-8 h-8 text-white" />
            </button>
          ) : recordState === 'recording' ? (
            <button onClick={stopRecording}
              className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
              <MicOff className="w-8 h-8 text-white" />
            </button>
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.2)' }}>
              <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {recordState === 'idle' ? 'Tap to speak' : recordState === 'recording' ? 'Tap to stop' : recordState === 'processing' ? 'Analyzing…' : 'Done!'}
          </div>
          {recordState === 'done' && (
            <Button variant="primary" onClick={nextPrompt}>
              Next Phrase <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </Card>

      {/* History */}
      {history.length > 0 && (
        <Card padding="md">
          <div className="section-title mb-3">Session History</div>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)' }}>
                {h.score >= 80
                  ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                  : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-jp text-white truncate">{h.jp}</div>
                  <div className="text-[10px] truncate" style={{ color: 'rgba(160,150,220,0.5)' }}>You said: {h.said || '(no speech detected)'}</div>
                </div>
                <div className="text-sm font-black flex-shrink-0"
                  style={{ color: h.score >= 80 ? '#4ade80' : h.score >= 50 ? '#fbbf24' : '#f87171' }}>
                  {h.score}%
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
