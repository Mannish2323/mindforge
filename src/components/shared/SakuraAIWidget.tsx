'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Send, X, Sparkles, MessageSquare, Flame, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { scaleIn, fadeInUp } from '@/lib/motion/motion.config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WIDGET_PROMPTS = [
  { label: 'Explain は vs が', msg: 'Explain the difference between particle は (wa) and が (ga) in Japanese.' },
  { label: 'Japanese greetings', msg: 'Teach me standard Japanese greetings for morning, noon, and night.' },
  { label: 'Explain て-form', msg: 'Explain standard Japanese verb te-form rules with examples.' },
];

export function SakuraAIWidget() {
  const { user, session, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'こんにちは！ I\'m Sakura, your AI Sensei. 🧝‍♀️ How can I help you study Japanese today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = useCallback(async (text?: string) => {
    const textToSend = text || input.trim();
    if (!textToSend || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
          userId: user?.id,
          jlptLevel: profile?.jlpt_target || 'N5',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: data.error || 'Oops, I had a bit of trouble connecting to my servers. Please try again.' },
        ]);
      } else {
        let content = '';
        if (data.content_ja) {
          content = `${data.content_ja}\n*${data.content_romaji}*\n${data.content_en}`;
          if (data.grammar_note) {
            content += `\n\n${data.grammar_note}`;
          }
        } else {
          content = data.response || data.message || 'I couldn\'t process that question properly.';
        }
        setMessages(prev => [...prev, { role: 'assistant', content }]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Connection timed out. Please check your network and try again!' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, session, user, profile]);

  return (
    <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-50 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={scaleIn}
            className="absolute bottom-16 right-0 w-80 max-w-[calc(100vw-2rem)] bg-[#120f26]/90 border border-purple-500/25 rounded-2xl shadow-brand backdrop-blur-xl overflow-hidden flex flex-col z-50 h-[400px] md:h-[450px]"
            style={{ boxShadow: '0 12px 40px rgba(124, 58, 237, 0.45)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-between border-b border-purple-500/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                  🌸
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white leading-none">Sakura AI Mascot</div>
                  <div className="text-[9px] text-pink-200 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-ping" /> Online Sensei
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-none">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-up`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      🌸
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-purple-600/35 border border-purple-500/40 text-white rounded-tr-none'
                        : 'bg-[#181236] border border-purple-900/40 text-purple-200 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    🌸
                  </div>
                  <div className="bg-[#181236] border border-purple-900/40 px-3 py-2 rounded-xl rounded-tl-none flex items-center">
                    <div className="flex gap-1 items-center h-3">
                      {[0, 1, 2].map(dot => (
                        <span
                          key={dot}
                          className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"
                          style={{
                            animation: 'float 1.2s ease-in-out infinite',
                            animationDelay: `${dot * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (Only when user hasn't asked many questions) */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t border-purple-500/5 bg-[#09071a]/50">
                <div className="text-[9px] font-bold text-purple-400/50 uppercase tracking-wider mb-1.5 text-left">Quick Questions</div>
                <div className="flex flex-col gap-1">
                  {WIDGET_PROMPTS.map(p => (
                    <button
                      key={p.label}
                      onClick={() => handleSend(p.msg)}
                      className="w-full text-left text-[10px] px-2.5 py-1.5 rounded-lg border border-purple-500/10 hover:border-purple-500/20 text-purple-300 hover:text-white transition-all bg-purple-950/10"
                    >
                      💡 {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-[#0a0815] border-t border-purple-500/10 flex gap-2 items-center">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Sakura anything..."
                className="flex-1 bg-purple-950/20 border border-purple-900/40 rounded-xl px-3 py-2 text-xs text-white placeholder-purple-300/30 outline-none focus:border-purple-500/50"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSend()}
                loading={loading}
                className="!h-8 !w-8 !p-0 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button Mascot */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg border border-pink-300/30 animate-float cursor-pointer relative hover:scale-105 active:scale-95 transition-all"
        style={{
          boxShadow: '0 4px 20px rgba(219, 39, 119, 0.45)',
          animationDuration: '3s',
        }}
        aria-label="Ask Sakura AI"
      >
        🌸
        {unread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 text-[8px] font-black text-white items-center justify-center">1</span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
