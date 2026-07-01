'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation';
import { Sparkles, MessageSquare, Send, X, Mic, Volume2, HelpCircle } from 'lucide-react';
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
      grammar_note: '💡 Ask me to translate, explain grammar, or suggest conversational replies!'
    }
  ]);

  const [isRecording, setIsRecording] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Don't show the widget on the full AI Tutor page itself to avoid duplication
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
        body: JSON.stringify({
          message: textToSend,
          history: formattedHistory,
          jlptLevel
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }

      const modelMsg: Message = {
        role: 'model',
        content: data.content_en || data.content_ja || 'Understood',
        content_ja: data.content_ja,
        content_romaji: data.content_romaji,
        content_en: data.content_en,
        grammar_note: data.grammar_note
      };

      setMessages(prev => [...prev, modelMsg]);

      if (data.content_ja) {
        speakJapanese(data.content_ja);
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        content: `Error: ${err.message || 'Check connection settings.'}`,
        grammar_note: '💡 Daily free limit may be reached, or server is offline.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    setIsRecording(true);
    setTimeout(() => {
      if (isRecording) {
        const phrases = [
          'こんにちは、元気ですか？',
          '日本語の勉強が楽しいです。',
          'お勧めのアニメは何ですか？'
        ];
        setInputText(phrases[Math.floor(Math.random() * phrases.length)]);
        setIsRecording(false);
      }
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
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-brand-purple to-sakura-dark p-[2px] shadow-[0_8px_32px_rgba(236,72,153,0.35)] group">
          {/* Pulsing Outer Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-purple to-sakura-dark opacity-40 blur-md group-hover:opacity-75 transition-opacity duration-300" />
          
          <div className="relative w-full h-full bg-[#0e0a1a] rounded-full overflow-hidden flex items-center justify-center">
            <Image
              src="/velmorth_mascot.png"
              alt="Sakura AI Tutor Mascot"
              fill
              className="object-cover object-top p-1"
            />
          </div>
          
          {/* Sparkles / Message indicator badge */}
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white rounded-full p-1 border border-[#09060F] shadow-md animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>

      {/* Glassmorphic Conversation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 w-[calc(100vw-48px)] sm:w-[380px] h-[480px] rounded-[24px] glass-card border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-sakura-dark p-[1px] relative overflow-hidden flex-shrink-0">
                  <div className="w-full h-full bg-[#120f26] rounded-[11px] overflow-hidden relative">
                    <Image
                      src="/velmorth_mascot.png"
                      alt="Sakura mascot"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white font-orbitron flex items-center gap-1">
                    <span>Sakura Assistant</span>
                    <Sparkles className="w-3 h-3 text-sakura-dark" />
                  </h4>
                  <p className="text-[10px] font-bold text-emerald-400">ONLINE TUTOR</p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-purple-300/40 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[18px] p-3 text-sm font-medium leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white rounded-br-none shadow-md'
                      : 'bg-white/[0.04] border border-white/5 text-purple-100 rounded-bl-none'
                  }`}>
                    {msg.role === 'model' && msg.content_ja ? (
                      <div className="space-y-1">
                        <p className="font-jp text-[15px] font-semibold text-white leading-normal">{msg.content_ja}</p>
                        <p className="text-[11px] text-purple-300/60 font-semibold italic">{msg.content_romaji}</p>
                        <p className="text-xs text-purple-200 mt-1.5 border-t border-white/5 pt-1.5">{msg.content_en}</p>
                      </div>
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>

                  {msg.grammar_note && (
                    <span className="text-[10px] text-purple-300/50 font-bold px-2 py-0.5 bg-sakura-dark/5 border border-sakura-dark/10 rounded-md">
                      {msg.grammar_note}
                    </span>
                  )}
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-2 text-xs font-bold text-purple-300/40 italic p-1 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-sakura-dark" />
                  <span>Sakura is thinking...</span>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input form */}
            <div className="p-3 bg-white/[0.01] border-t border-white/5 flex gap-2 items-center">
              <button
                onClick={handleVoiceInput}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${
                  isRecording 
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 animate-pulse' 
                    : 'bg-white/5 border-white/5 text-purple-300/60 hover:text-white hover:bg-white/10'
                }`}
                title="Voice Input (mocked)"
              >
                <Mic className="w-4 h-4" />
              </button>
              
              <input
                type="text"
                placeholder="Ask Sakura anything..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
                className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs placeholder-purple-300/30 text-white outline-none focus:border-brand-purple/50 transition-all"
                disabled={loading}
              />
              
              <button
                onClick={() => handleSend(inputText)}
                className="p-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                disabled={!inputText.trim() || loading}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
