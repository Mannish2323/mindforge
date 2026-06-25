'use client';
import { useState, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Mic, MicOff, Loader2, Send, Sparkles } from 'lucide-react';

interface Message { role: 'user' | 'ai'; text: string; }

export default function SpeakPage() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'こんにちは！I\'m your AI speaking partner. What would you like to practice today? 🎌' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.message || 'すみません、もう一度お願いします。' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection error. Please try again.' }]);
    } finally {
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (!profile?.isPremium && (profile?.aiLimitDaily || 0) <= 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Speak Practice</h1>
        <div className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-10 text-center">
          <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Upgrade to unlock AI Tutor</h2>
          <p className="text-purple-300/50 text-sm mb-5">AI speaking sessions require a Starter plan or above.</p>
          <a href="/billing" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">View Plans</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
      <h1 className="text-2xl font-bold text-white flex-shrink-0">Speak Practice</h1>

      {/* Chat */}
      <div className="flex-1 bg-purple-950/40 border border-purple-800/30 rounded-2xl p-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                : 'bg-purple-900/50 border border-purple-800/30 text-purple-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-purple-900/50 border border-purple-800/30 px-4 py-3 rounded-2xl">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder="Type in Japanese or English…"
          className="flex-1 bg-purple-950/60 border border-purple-800/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/30 focus:outline-none focus:border-purple-500/60 text-sm"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:opacity-40 text-white px-4 py-3 rounded-xl transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
