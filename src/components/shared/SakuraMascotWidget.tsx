'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthModal } from '@/components/shared/AuthModal';
import { usePathname } from 'next/navigation';
import { Sparkles, Send, X, Mic, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  role: 'user' | 'model';
  content: string;
  content_ja?: string;
  content_romaji?: string;
  content_en?: string;
  grammar_note?: string;
}

export function SakuraMascotWidget() {
  const { session, profile } = useAuth();
  const { requireAuth } = useAuthModal();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Konnichiwa! I am Sakura, your virtual AI tutor. Feel free to ask me anything about Japanese!',
      content_ja: 'こんにちは！私はサクラ、あなたのAIチューターです。日本語について何でも聞いてくださいね！',
      content_romaji: 'Konnichiwa! Watashi wa Sakura, anata no AI chuutaa desu. Nihongo ni tsuite nandemo kiite kudasai ne!',
      content_en: 'Hello! I am Sakura, your virtual AI tutor. Feel free to ask me anything about Japanese!',
      grammar_note: 'Ask me to translate, explain grammar, or suggest conversational replies!'
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Don't show widget on the full AI Tutor page
  if (pathname === '/ai-tutor') return null;

  const speakJapanese = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      const voices = window.speechSynthesis.getVoices();
      const jaVoice = voices.find(v => v.lang.startsWith('ja'));
      if (jaVoice) utterance.voice = jaVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const token = session?.access_token;
      const jlptLevel = profile?.jlpt_target || 'N5';

      const formattedHistory = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content_ja || m.content }]
      }));

      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: textToSend, history: formattedHistory, jlptLevel })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to generate response');

      const modelMsg: Message = {
        role: 'model',
        content: data.content_en || data.content_ja || 'Understood',
        content_ja: data.content_ja,
        content_romaji: data.content_romaji,
        content_en: data.content_en,
        grammar_note: data.grammar_note
      };

      setMessages(prev => [...prev, modelMsg]);
      if (data.content_ja) speakJapanese(data.content_ja);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        content: `Error: ${err.message || 'Check connection settings.'}`,
        grammar_note: 'Daily free limit may be reached, or server is offline.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) { setIsRecording(false); return; }
    setIsRecording(true);
    setTimeout(() => {
      const phrases = ['こんにちは、元気ですか？', '日本語の勉強が楽しいです。', 'お勧めのアニメは何ですか？'];
      setInputText(phrases[Math.floor(Math.random() * phrases.length)]);
      setIsRecording(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating Mascot Button */}
      <motion.div
        className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-50 cursor-pointer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
        transition={{
          scale: { type: 'spring', stiffness: 260, damping: 20 },
          y: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
        }}
        onClick={() => requireAuth(() => setIsOpen(!isOpen), 'Sakura AI Tutor')}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-brand to-accent p-[2px] shadow-[0_8px_24px_rgba(109,60,255,0.25)] group">
          {/* Pulsing soft glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand/40 to-accent/40 blur-md group-hover:blur-lg transition-all duration-300" />

          <div className="relative w-full h-full bg-card rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/sakura_ai_avatar.png"
              alt="Sakura AI Tutor Mascot"
              fill
              className="object-contain p-1.5"
            />
          </div>

          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-brand to-accent text-white rounded-full p-1 border-2 border-white shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 w-[calc(100vw-48px)] sm:w-[380px] h-[480px] rounded-[24px] bg-card border border-edge shadow-[0_12px_40px_rgba(0,0,0,0.12)] z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {/* Header */}
            <div className="p-4 bg-warm-cream border-b border-edge flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-card border border-edge relative overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src="/sakura_ai_avatar.png"
                    alt="Sakura mascot"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-ink font-heading flex items-center gap-1">
                    <span>Sakura AI</span>
                    <Sparkles className="w-3 h-3 text-sakura-dark" />
                  </h4>
                  <p className="text-[10px] font-bold text-cat-green uppercase tracking-wider">Online Tutor</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-warm-soft transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-warm">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  className={`flex flex-col space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[18px] p-3.5 text-sm font-medium leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand to-accent text-white rounded-br-sm shadow-md'
                      : 'bg-card border border-edge text-ink rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.role === 'model' && msg.content_ja ? (
                      <div className="space-y-1.5">
                        <p className="font-jp text-[15px] font-semibold text-ink leading-normal">{msg.content_ja}</p>
                        <p className="text-[11px] text-ink-muted font-semibold italic">{msg.content_romaji}</p>
                        <p className="text-xs text-ink-secondary mt-1.5 border-t border-edge pt-1.5">{msg.content_en}</p>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {msg.grammar_note && (
                    <span className="text-[10px] text-ink-muted font-bold px-2.5 py-1 bg-sakura-light border border-sakura/20 rounded-lg">
                      {msg.grammar_note}
                    </span>
                  )}

                  {msg.role === 'model' && msg.content_ja && (
                    <button
                      onClick={() => speakJapanese(msg.content_ja!)}
                      className="p-1 text-ink-light hover:text-brand rounded-lg hover:bg-warm-soft transition-colors cursor-pointer ml-1"
                      title="Listen"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  )}
                </motion.div>
              ))}

              {/* Typing dots */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-card border border-edge rounded-[18px] rounded-bl-sm w-fit shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-sakura-dark" style={{ animation: 'typing-dots 1.2s ease-in-out infinite', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sakura-dark" style={{ animation: 'typing-dots 1.2s ease-in-out infinite', animationDelay: '200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-sakura-dark" style={{ animation: 'typing-dots 1.2s ease-in-out infinite', animationDelay: '400ms' }} />
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-card border-t border-edge flex gap-2 items-center">
              <motion.button
                onClick={handleVoiceInput}
                whileTap={{ scale: 0.9 }}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                  isRecording
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-warm-soft border-edge text-ink-muted hover:text-ink hover:bg-warm-cream'
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </motion.button>

              <input
                type="text"
                placeholder="Ask Sakura anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                className="flex-1 bg-warm-soft border border-edge rounded-xl px-3.5 py-2.5 text-xs placeholder-ink-light text-ink outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/10 transition-all"
                disabled={loading}
              />

              <motion.button
                onClick={() => handleSend(inputText)}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-gradient-to-r from-brand to-accent text-white shadow-md transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                disabled={!inputText.trim() || loading}
              >
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
