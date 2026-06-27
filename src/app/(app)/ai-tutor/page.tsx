'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import {
  Send, Mic, MicOff, Sparkles, BookOpen, Brain,
  Target, Lock, Crown, ArrowRight, CheckCircle2, Star,
  MessageSquare
} from 'lucide-react';



// ─── Data ──────────────────────────────────────────────────────────────────────
interface Message { role: 'user' | 'assistant'; content: string; ts: number; }

const QUICK_PROMPTS = [
  { label: 'Explain て-form', msg: 'Please explain the て-form (te-form) in Japanese with examples.' },
  { label: 'Daily conversation', msg: 'Let\'s practice a daily Japanese conversation. You start.' },
  { label: 'Weak grammar', msg: 'What are the most common N5 grammar mistakes beginners make?' },
  { label: 'Translate this', msg: 'How do I say "I am looking forward to meeting you" formally in Japanese?' },
  { label: 'JLPT Tips', msg: 'Give me 5 tips to pass JLPT N4 in 3 months.' },
  { label: 'Kanji tips', msg: 'What are the best mnemonics for remembering kanji?' },
];

const BENEFITS = [
  'Unlimited AI tutor conversations',
  'Grammar explainer for any pattern',
  'AI-generated JLPT practice quizzes',
  'Personalized 4-week study plans',
  'Instant translation & romanization',
  'Conversation partner (open dialogue)',
  'Writing feedback and correction',
  'Powered by Gemini — always up-to-date',
];

const TESTIMONIALS = [
  { text: 'The AI tutor explained ～てしまう in a way my textbook never did. My JLPT N3 score jumped 30 points.', author: 'Neha R.', avatar: '🇮🇳' },
  { text: 'I ask it grammar questions at 2am and get instant, detailed answers. It\'s like having a private Japanese teacher 24/7.', author: 'Liam T.', avatar: '🇦🇺' },
];

// ─── Demo chat preview ────────────────────────────────────────────────────────
const DEMO_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content: `こんにちは！ I'm Velmorth, your AI Japanese tutor 🧝‍♀️\n\nI can help you with:\n• Grammar explanations\n• Conversation practice\n• JLPT preparation\n• Translation & writing feedback\n\nWhat would you like to practice today?`,
    ts: 1,
  },
  { role: 'user', content: 'Explain the difference between は and が', ts: 2 },
  {
    role: 'assistant',
    content: `Great question! は (wa) vs が (ga) is one of the most confusing parts of Japanese:\n\n**は (topic marker)** — introduces the topic of the sentence:\n→ 私は学生です。"As for me, I am a student."\n\n**が (subject marker)** — emphasizes the subject or answers "who/what":\n→ 誰が来た？"Who came?" → 田中さんが来た。"It was Tanaka-san who came."\n\nKey rule: Use が when the subject is new information or being emphasized. Use は for known topics.`,
    ts: 3,
  },
];

// ─── Premium AI Tutor Preview ─────────────────────────────────────────────────
function PremiumAITutorPreview() {
  const router = useRouter();
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTypingDone(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Hero */}
      <div
        className="relative rounded-3xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(124,58,237,0.25) 60%, rgba(16,12,40,0.95) 100%)',
          border: '1px solid rgba(16,185,129,0.25)',
        }}
      >
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 text-[140px] select-none pointer-events-none"
          style={{ opacity: 0.05, lineHeight: 1 }} aria-hidden
        >🧝‍♀️</div>
        <div className="relative z-10 max-w-lg">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}
          >
            <Crown className="w-3.5 h-3.5" />
            Premium Feature
          </div>
          <h1 className="text-3xl font-black text-white mb-3 leading-tight">
            Velmorth AI Tutor —<br />Your 24/7 Japanese Sensei
          </h1>
          <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(200,196,255,0.7)' }}>
            Powered by Google Gemini. Ask any grammar question, practice conversation,
            get instant JLPT quizzes, and receive personalized study plans — all in one chat.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => router.push('/billing')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)', boxShadow: '0 4px 24px rgba(16,185,129,0.3)' }}
            >
              <Sparkles className="w-4 h-4" /> Unlock AI Tutor <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <MessageSquare className="w-5 h-5" />, title: 'Chat Tutor', desc: 'Ask anything, get instant answers', color: '#34d399' },
          { icon: <BookOpen className="w-5 h-5" />, title: 'Grammar Engine', desc: 'Deep explanations with examples', color: '#a78bfa' },
          { icon: <Brain className="w-5 h-5" />, title: 'Quiz Generator', desc: 'AI-crafted JLPT practice', color: '#f472b6' },
          { icon: <Target className="w-5 h-5" />, title: 'Study Plans', desc: 'Personalized weekly schedules', color: '#60a5fa' },
        ].map((f, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}18`, color: f.color }}>
              {f.icon}
            </div>
            <div className="text-sm font-black text-white mb-1">{f.title}</div>
            <div className="text-xs" style={{ color: 'rgba(160,150,220,0.6)' }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Demo chat preview */}
      <div>
        <div className="section-title mb-3 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          Live Chat Preview (Demo)
        </div>
        <Card padding="none" className="overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'rgba(139,92,246,0.15)', background: 'rgba(139,92,246,0.05)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(219,39,119,0.3))' }}>
              🧝‍♀️
            </div>
            <div>
              <div className="text-sm font-black text-white">Velmorth AI</div>
              <div className="text-[10px]" style={{ color: '#34d399' }}>● Online · Powered by Gemini</div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4 max-h-72 overflow-hidden" style={{ background: 'rgba(10,8,22,0.6)' }}>
            {DEMO_MESSAGES.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))' }}>
                    🧝‍♀️
                  </div>
                )}
                <div className={`max-w-[78%] px-3 py-2.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                  style={m.role === 'user'
                    ? { background: 'rgba(124,58,237,0.35)', border: '1px solid rgba(124,58,237,0.4)', color: '#f0efff' }
                    : { background: 'rgba(18,14,36,0.9)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(200,196,255,0.9)' }}>
                  {m.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {!typingDone && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.3))' }}>
                  🧝‍♀️
                </div>
                <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm" style={{ background: 'rgba(18,14,36,0.9)', border: '1px solid rgba(139,92,246,0.2)' }}>
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400"
                        style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Locked input */}
          <div className="p-4 relative" style={{ borderTop: '1px solid rgba(139,92,246,0.15)', background: 'rgba(10,8,22,0.8)' }}>
            <div className="flex gap-2 items-center opacity-40 pointer-events-none">
              <div className="flex-1 h-10 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.3)' }}>
                <Send className="w-4 h-4 text-purple-300" />
              </div>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center gap-2"
              style={{ background: 'rgba(10,8,22,0.7)' }}
            >
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-black text-purple-300">Unlock to chat with Velmorth AI</span>
            </div>
          </div>
        </Card>
      </div>

      {/* What you can ask */}
      <div>
        <div className="section-title mb-3">What Can You Ask?</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { q: 'Explain the difference between ～ても and ～としても', tag: 'Grammar' },
            { q: 'Give me 5 JLPT N3 listening tips', tag: 'JLPT Prep' },
            { q: 'Let\'s have a conversation in Japanese about work', tag: 'Conversation' },
            { q: 'Correct my Japanese writing: 私は昨日映画を行きました', tag: 'Writing' },
            { q: 'How do I use 〜ことにする vs 〜ようにする?', tag: 'Grammar' },
            { q: 'Create a 4-week study plan for N4', tag: 'Study Plan' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black text-white mb-0.5">{item.q}</div>
                <div
                  className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}
                >
                  {item.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {BENEFITS.map((b, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-sm" style={{ color: 'rgba(200,196,255,0.8)' }}>{b}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="p-5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <div className="flex mb-3">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
            <p className="text-sm italic mb-3" style={{ color: 'rgba(200,196,255,0.8)' }}>&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{t.avatar}</span>
              <span className="text-xs font-black text-white">{t.author}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div
        className="rounded-3xl p-8 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(124,58,237,0.2))', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <div className="text-3xl mb-3">🧝‍♀️</div>
        <h3 className="text-xl font-black text-white mb-2">Chat with Velmorth AI 24/7</h3>
        <p className="text-sm mb-6" style={{ color: 'rgba(200,196,255,0.6)' }}>
          Your personal Japanese tutor, powered by Gemini. Available anytime, for any question.
        </p>
        <button
          onClick={() => router.push('/billing')}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #059669, #7c3aed)', boxShadow: '0 4px 32px rgba(16,185,129,0.3)' }}
        >
          <Sparkles className="w-4 h-4" />
          Unlock AI Tutor — From ₹99/mo
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] mt-3" style={{ color: 'rgba(160,150,220,0.35)' }}>Cancel anytime · Secure payment</p>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
    </div>
  );
}

// ─── Full AI Tutor (Premium) ─────────────────────────────────────────────────
function FullAITutorPage() {
  const { user, profile, session } = useAuth();
  const [tab, setTab] = useState('chat');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: `こんにちは！ I'm Velmorth, your AI Japanese tutor powered by Gemini. 🧝‍♀️\n\nI can help you with:\n• Grammar explanations\n• Conversation practice\n• Translation\n• JLPT preparation\n• Writing feedback\n\nWhat would you like to practice today?`,
    ts: Date.now(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  // Load chat history from Supabase on mount
  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('ai_chat_messages')
          .select('role, content, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(30);

        if (error) throw error;
        if (data && data.length > 0) {
          setMessages(data.map(m => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
            ts: new Date(m.created_at).getTime()
          })));
        }
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    fetchHistory();
  }, [user]);

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
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          message: msg,
          history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
          userId: user?.id,
          jlptLevel: profile?.jlpt_target || 'N5'
        }),
      });
      const d = await res.json();
      
      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: d.error || 'Failed to process request.', ts: Date.now() }]);
      } else {
        let formatted = '';
        if (d.content_ja) {
          formatted = `${d.content_ja}\n\n*${d.content_romaji}*\n\n${d.content_en}`;
          if (d.grammar_note) {
            formatted += `\n\n${d.grammar_note}`;
          }
        } else {
          formatted = d.response || d.message || d.content || 'Sorry, I could not process that.';
        }
        setMessages(prev => [...prev, { role: 'assistant', content: formatted, ts: Date.now() }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.', ts: Date.now() }]);
    } finally { setLoading(false); }
  }, [input, loading, messages, user, profile, session]);

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
    { id: 'chat', label: 'Chat', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'grammar', label: 'Grammar', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'quiz', label: 'Quiz', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'plan', label: 'Study Plan', icon: <Target className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-up max-w-3xl mx-auto">
      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} variant="underline" className="flex-shrink-0 mb-4" />

      {tab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
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
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                  style={m.role === 'user'
                    ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(109,40,217,0.4))', border: '1px solid rgba(124,58,237,0.4)', color: '#f0efff' }
                    : { background: 'rgba(18,14,36,0.9)', border: '1px solid rgba(139,92,246,0.2)', color: 'rgba(200,196,255,0.9)' }}>
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
                    {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex-shrink-0">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Ask anything in Japanese or English… (Enter to send)"
                  className="input resize-none pr-12" rows={2} style={{ paddingRight: '3rem' }} />
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
              Powered by Gemini · Conversations saved for personalized learning
            </div>
          </div>
        </>
      )}

      {tab === 'grammar' && (
        <div className="flex-1 overflow-y-auto">
          <Card padding="lg" className="text-center">
            <div className="text-4xl mb-3">📖</div>
            <div className="text-sm font-black text-white mb-2">Grammar Explainer</div>
            <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>Type any grammar pattern for a detailed AI explanation</div>
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

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function AITutorPage() {
  const { profile } = useAuth();

  if (!profile?.isPremium) {
    return (
      <div className="max-w-4xl mx-auto">
        <PremiumAITutorPreview />
      </div>
    );
  }

  return <FullAITutorPage />;
}
