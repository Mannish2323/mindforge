'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { Send, Mic, MicOff, Sparkles, RotateCcw, BookOpen, Brain, FileText, Target } from 'lucide-react';

interface Message { role: 'user' | 'assistant'; content: string; ts: number; }

const QUICK_PROMPTS = [
  { label: 'Explain て-form', msg: 'Please explain the て-form (te-form) in Japanese with examples.' },
  { label: 'Daily conversation', msg: 'Let\'s practice a daily Japanese conversation. You start.' },
  { label: 'Weak grammar', msg: 'What are the most common N5 grammar mistakes beginners make?' },
  { label: 'Translate this', msg: 'How do I say "I am looking forward to meeting you" formally in Japanese?' },
  { label: 'JLPT Tips', msg: 'Give me 5 tips to pass JLPT N4 in 3 months.' },
  { label: 'Kanji tips', msg: 'What are the best mnemonics for remembering kanji?' },
];

export default function AITutorPage() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `こんにちは！ I'm Velmorth, your AI Japanese tutor powered by Gemini. 🧝‍♀️\n\nI can help you with:\n• Grammar explanations\n• Conversation practice\n• Translation\n• JLPT preparation\n• Writing feedback\n\nWhat would you like to practice today?`,
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = useCallback(async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg, ts: Date.now() }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
          userId: user?.id,
          jlptLevel: profile?.jlpt_target || 'N5',
        }),
      });
      const d = await res.json();
      const reply = d.response || d.message || d.content || 'Sorry, I could not process that. Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.', ts: Date.now() }]);
    } finally { setLoading(false); }
  }, [input, loading, messages, user, profile]);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.lang = 'ja-JP'; r.interimResults = false;
    r.onresult = (e: any) => { setInput(e.results[0][0].transcript); };
    r.onend = () => setIsRecording(false);
    recRef.current = r; r.start(); setIsRecording(true);
  };

  const stopVoice = () => { recRef.current?.stop(); setIsRecording(false); };

  const TABS = [
    { id: 'chat',    label: 'Chat',     icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'grammar', label: 'Grammar',  icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'quiz',    label: 'Quiz',     icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'plan',    label: 'Study Plan',icon: <Target className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-up max-w-3xl mx-auto">
      {/* Tabs */}
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} variant="underline" className="flex-shrink-0 mb-4" />

      {tab === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {QUICK_PROMPTS.map(p => (
                  <button key={p.label} onClick={() => sendMessage(p.msg)}
                    className="card p-3 text-left text-xs font-medium hover:border-[rgba(124,58,237,0.4)] transition-all"
                    style={{ color: 'rgba(200,196,255,0.8)' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 animate-fade-up ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))', border: '1px solid rgba(219,39,119,0.3)' }}>
                    🧝‍♀️
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'rounded-tr-sm text-white'
                    : 'rounded-tl-sm'
                }`}
                style={m.role === 'user'
                  ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(109,40,217,0.4))', border: '1px solid rgba(124,58,237,0.4)', color: '#f0efff' }
                  : { background: 'rgba(18,14,36,0.9)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(200,196,255,0.9)' }
                }>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 animate-fade-up">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))' }}>
                  🧝‍♀️
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ background: 'rgba(18,14,36,0.9)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask anything in Japanese or English… (Enter to send)"
                  className="input resize-none pr-12"
                  rows={2}
                  style={{ paddingRight: '3rem' }}
                />
              </div>
              <button onClick={isRecording ? stopVoice : startVoice}
                className="btn btn-ghost btn-icon flex-shrink-0"
                style={isRecording ? { background: 'rgba(220,38,38,0.2)', borderColor: 'rgba(220,38,38,0.4)' } : {}}>
                {isRecording ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
              </button>
              <Button variant="primary" size="md" onClick={() => sendMessage()} loading={loading} className="flex-shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-[10px] mt-1.5 text-center" style={{ color: 'rgba(160,150,220,0.35)' }}>
              Powered by Gemini · Conversations are saved for personalized learning
            </div>
          </div>
        </>
      )}

      {tab === 'grammar' && (
        <div className="flex-1 overflow-y-auto">
          <Card padding="lg" className="text-center">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-sm font-black text-white mb-2">Grammar Explainer</div>
            <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>Type any grammar pattern to get a detailed AI explanation</div>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="e.g. ～てしまう, ～ことがある..." />
              <Button variant="primary" onClick={() => { setTab('chat'); sendMessage('Explain the grammar pattern I just entered'); }}>
                <Sparkles className="w-3.5 h-3.5" /> Explain
              </Button>
            </div>
          </Card>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="flex-1 overflow-y-auto">
          <Card padding="lg" className="text-center">
            <div className="text-4xl mb-3">🧠</div>
            <div className="text-sm font-black text-white mb-2">AI Quiz Generator</div>
            <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>Generate custom quizzes based on your weak areas</div>
            <Button variant="primary" className="w-full" onClick={() => { setTab('chat'); sendMessage('Generate a 5-question JLPT N5 quiz for me with answers.'); }}>
              <Brain className="w-3.5 h-3.5" /> Generate Quiz
            </Button>
          </Card>
        </div>
      )}

      {tab === 'plan' && (
        <div className="flex-1 overflow-y-auto">
          <Card padding="lg" className="text-center">
            <div className="text-4xl mb-3">📅</div>
            <div className="text-sm font-black text-white mb-2">Personalized Study Plan</div>
            <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>Get a custom weekly study plan based on your goal and level</div>
            <Button variant="primary" className="w-full" onClick={() => { setTab('chat'); sendMessage(`Create a 4-week study plan for JLPT ${profile?.jlpt_target || 'N5'} with ${profile?.goal_minutes || 30} minutes per day.`); }}>
              <Target className="w-3.5 h-3.5" /> Create My Plan
            </Button>
          </Card>
        </div>
      )}

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}
