'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Sparkles, Send, Mic, Volume2, HelpCircle, History, Book, 
  MessageSquare, Lightbulb, Trash2, ArrowLeft, RefreshCw, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Message {
  role: 'user' | 'model';
  content: string; // fallback or user text
  content_ja?: string;
  content_romaji?: string;
  content_en?: string;
  grammar_note?: string;
}

export default function AITutorPage() {
  const { session, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'Konnichiwa! Let\'s practice Japanese together. What would you like to focus on today?',
      content_ja: 'こんにちは！一緒に日本語を練習しましょう。今日は何について勉強したいですか？',
      content_romaji: 'Konnichiwa! Isshoni nihongo wo renshuu shimashou. Kyou wa nani ni tsuite benkyou shitai desu ka?',
      content_en: 'Hello! Let\'s practice Japanese together. What would you like to study today?',
      grammar_note: '💡 Asking questions in Japanese ends with the particle か (ka), which acts as a question mark.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [apiUsage, setApiUsage] = useState({ used: 0, limit: 15 });
  const [selectedLanguage, setSelectedLanguage] = useState<'ja' | 'en'>('ja');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Fetch or mock API limits
  useEffect(() => {
    if (profile) {
      setApiUsage({
        used: profile.reviews_done % 15, // dynamic mockup based on actual profile counter
        limit: profile.aiLimitDaily || 15
      });
    }
  }, [profile]);

  // Load conversation history from DB
  useEffect(() => {
    const loadHistory = async () => {
      if (!session?.user) return;
      
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50);
      
      if (error) {
        console.error('Error loading chat history:', error);
        return;
      }

      if (data && data.length > 0) {
        const parsedMsgs: Message[] = data.map(m => {
          if (m.role === 'user') {
            return { role: 'user', content: m.content };
          }
          
          // Format layout is: Japanese\n\n*Romaji*\n\nEnglish\n\n💡 Grammar note
          const parts = m.content.split('\n\n');
          if (parts.length >= 3) {
            const content_ja = parts[0];
            const content_romaji = parts[1].replace(/^\*|\*$/g, ''); // strip asterisks
            const content_en = parts[2];
            const grammar_note = parts[3] || '';
            return {
              role: 'model',
              content: content_en,
              content_ja,
              content_romaji,
              content_en,
              grammar_note
            };
          }
          
          return {
            role: 'model',
            content: m.content
          };
        });
        setMessages(parsedMsgs);
      }
    };

    loadHistory();
  }, [session, supabase]);

  const speakJapanese = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      // Find a Japanese voice if possible
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

      // Format history for Gemini endpoint API schema
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

      // Add Model Response
      const modelMsg: Message = {
        role: 'model',
        content: data.content_en || data.content_ja || 'Understood',
        content_ja: data.content_ja,
        content_romaji: data.content_romaji,
        content_en: data.content_en,
        grammar_note: data.grammar_note
      };

      setMessages(prev => [...prev, modelMsg]);
      setApiUsage(prev => ({ ...prev, used: Math.min(prev.limit, prev.used + 1) }));

      // Auto speak response
      if (data.content_ja) {
        speakJapanese(data.content_ja);
      }

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'model',
        content: `Error: ${err.message || 'Check connection settings.'}`,
        grammar_note: '💡 Try upgrading to Premium or check your connection status.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Simulate Speech recognition trigger
  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    // Simulate speaking N5 phrases after 3 seconds
    setTimeout(() => {
      if (isRecording) {
        const phrases = [
          'はじめまして、どうぞよろしく。',
          '日本語の勉強が大好きです。',
          '寿司が食べたいです。',
          'これはいくらですか？'
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setInputText(randomPhrase);
        setIsRecording(false);
      }
    }, 3000);
  };

  const clearChat = () => {
    if (window.confirm('Clear current session history?')) {
      setMessages([
        {
          role: 'model',
          content: 'Hello! Session cleared. Let\'s practice again!',
          content_ja: 'こんにちは！チャットがクリアされました。また練習しましょう！',
          content_romaji: 'Konnichiwa! Chatto ga kuriadosaremashita. Mata renshuu shimashou!',
          content_en: 'Hello! Chat has been cleared. Let\'s practice again!',
          grammar_note: '💡 Start with simple sentences to build confidence.'
        }
      ]);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start min-h-[calc(100vh-140px)]">
      
      {/* Left panel: Quick Topics & Presets */}
      <div className="xl:col-span-3 space-y-6">
        <div className="glass-card p-6 rounded-[24px] space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-base font-bold text-white font-orbitron flex items-center gap-2">
              <History className="w-4 h-4 text-sakura-dark" />
              <span>Presets</span>
            </h3>
            <button 
              onClick={clearChat}
              className="p-2 text-purple-300/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
              title="Clear Session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick presets list */}
          <div className="space-y-3">
            <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase">
              CONVERSATIONAL
            </p>
            {[
              { label: 'Ordering Food', text: 'How do I order ramen at a restaurant?' },
              { label: 'Introduce Yourself', text: 'Self introduction in Japanese' },
              { label: 'Asking for Directions', text: 'Excuse me, where is the train station?' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/10 text-xs font-semibold text-purple-300/70 hover:text-white transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}

            <p className="text-[10px] font-extrabold tracking-widest text-purple-300/40 uppercase pt-3">
              EXPLANATIONS
            </p>
            {[
              { label: 'Particles: は vs が', text: 'Explain difference between topic marker WA and subject marker GA' },
              { label: 'Verb Conjugation', text: 'Explain polite dictionary form vs masu form' },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                className="w-full text-left p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-purple/40 hover:bg-brand-purple/10 text-xs font-semibold text-purple-300/70 hover:text-white transition-all cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* AI Limit Indicator */}
        <div className="glass-card p-6 rounded-[24px] space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-purple-300/60">
            <span>AI TUTOR USAGE</span>
            <span className="text-sakura-dark">{apiUsage.used} / {apiUsage.limit} Daily Limit</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-brand-purple to-sakura-dark rounded-full transition-all duration-300"
              style={{ width: `${(apiUsage.used / apiUsage.limit) * 100}%` }}
            />
          </div>
          <p className="text-[10px] font-semibold text-purple-300/40 leading-relaxed">
            Premium users get 99+ dynamic requests, advanced grammar feedback and voice assessments.
          </p>
        </div>
      </div>

      {/* Main Chat Screen Area */}
      <div className="xl:col-span-6 flex flex-col glass-card rounded-[28px] border border-white/5 overflow-hidden h-[calc(100vh-140px)] shadow-2xl relative">
        {/* Header toolbar */}
        <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center border border-brand-purple/30">
              <Sparkles className="w-5 h-5 text-sakura-dark animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white font-orbitron">Sakura Sensei</h3>
              <p className="text-[10px] text-emerald-400 font-bold tracking-wider">AI TUTOR • ONLINE</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setSelectedLanguage(prev => prev === 'ja' ? 'en' : 'ja')}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-purple-300 hover:text-white transition-all cursor-pointer"
            >
              Mode: {selectedLanguage === 'ja' ? 'Japanese Helper' : 'English Only'}
            </button>
          </div>
        </div>

        {/* Message bubble stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neon-purple to-neon-pink flex-shrink-0 flex items-center justify-center overflow-hidden p-1">
                  <Image 
                    src="/sakura_ai_avatar.png" 
                    alt="AI Mascot" 
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              )}

              <div className="space-y-2 max-w-[85%] md:max-w-[70%]">
                {/* Bubble box */}
                <div className={`p-4 rounded-2xl shadow-md border ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-brand-purple to-brand-purple-dark border-brand-purple/30 text-white rounded-tr-none' 
                    : 'bg-[#120f26]/80 border-white/5 text-purple-100 rounded-tl-none'
                }`}>
                  {msg.role === 'model' && msg.content_ja ? (
                    <div className="space-y-2">
                      <p className="text-base font-semibold leading-relaxed font-jp">{msg.content_ja}</p>
                      {msg.content_romaji && (
                        <p className="text-xs text-purple-300/60 font-semibold italic">{msg.content_romaji}</p>
                      )}
                      <div className="border-t border-white/5 my-2 pt-2" />
                      <p className="text-sm font-medium text-purple-200/90">{msg.content_en}</p>
                    </div>
                  ) : (
                    <p className="text-sm md:text-base font-medium leading-relaxed">{msg.content}</p>
                  )}
                </div>

                {/* Optional help note / tips */}
                {msg.role === 'model' && msg.grammar_note && (
                  <div className="flex items-start gap-2 p-3 bg-sakura-dark/10 border border-sakura-dark/20 text-sakura-light rounded-xl text-xs font-semibold leading-relaxed">
                    <Lightbulb className="w-3.5 h-3.5 text-sakura-dark flex-shrink-0 mt-0.5" />
                    <span>{msg.grammar_note}</span>
                  </div>
                )}

                {/* Bubble action tool buttons */}
                {msg.role === 'model' && msg.content_ja && (
                  <div className="flex items-center gap-2 pl-2">
                    <button 
                      onClick={() => speakJapanese(msg.content_ja!)}
                      className="p-1.5 text-purple-300/40 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      title="Listen Audio"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-sakura-dark flex-shrink-0 flex items-center justify-center overflow-hidden">
                <Image 
                  src="/sakura_ai_avatar.png" 
                  alt="AI Mascot" 
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <div className="p-4 rounded-2xl bg-[#120f26]/80 border border-white/5 flex items-center gap-1.5 rounded-tl-none">
                <span className="w-2 h-2 rounded-full bg-sakura-dark animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-sakura-dark animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-sakura-dark animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input layout actions */}
        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          {/* Wave animation if recording */}
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: '48px', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center justify-center gap-1 mb-3 overflow-hidden text-sakura-dark"
              >
                <div className="w-1.5 h-6 bg-sakura-dark rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-9 bg-sakura-dark rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-7 bg-sakura-dark rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-1.5 h-11 bg-sakura-dark rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                <span className="text-xs font-bold pl-2 tracking-wide uppercase">AI is Listening...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(inputText); }}
            className="flex items-center gap-3"
          >
            {/* Audio Voice Input Trigger */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3.5 rounded-xl border flex-shrink-0 transition-all cursor-pointer ${
                isRecording 
                  ? 'bg-rose-500 border-rose-500 text-white animate-pulse' 
                  : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.08] text-purple-300 hover:text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Input field wrapper */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? 'Listening...' : 'Ask a question or type in Japanese...'}
                disabled={isRecording}
                className="w-full bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl px-5 h-12 text-sm placeholder-purple-300/30 text-white outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all"
              />
            </div>

            {/* Send submit button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="p-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-sakura-dark text-white border-none flex-shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-115 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right panel: Sakura mascot float frame & feedback widget */}
      <div className="xl:col-span-3 space-y-6">
        {/* Sakura Mascot card with floating animation */}
        <div className="glass-card p-6 rounded-[24px] flex flex-col items-center text-center space-y-4 border border-white/5">
          <div className="relative w-36 h-36 rounded-2xl bg-gradient-to-tr from-brand-purple to-sakura-dark p-[1.5px] overflow-hidden shadow-lg animate-float-avatar">
            <div className="relative w-full h-full bg-[#120f26] rounded-[15px] overflow-hidden">
              <Image 
                src="/sakura_ai_avatar.png" 
                alt="AI Mascot" 
                fill 
                className="object-cover object-top"
              />
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-white font-orbitron">Sakura Avatar</h4>
            <p className="text-xs text-purple-300/60 font-medium">Your Virtual Mascot</p>
          </div>
          <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-2xl text-[11px] font-semibold text-purple-200/90 leading-relaxed">
            &ldquo;You are doing great! Completing the daily goals helps commit syntax rules to long term memory.&rdquo;
          </div>
        </div>

        {/* Suggestion list for user */}
        <div className="glass-card p-6 rounded-[24px] space-y-4">
          <h4 className="text-xs font-extrabold tracking-widest text-purple-300/40 uppercase">
            LEARNING SUGGESTIONS
          </h4>
          <div className="space-y-3">
            {[
              { title: 'Learn Vocabulary', desc: 'Unit 12: Food & Drinks' },
              { title: 'Practice Kanji', desc: 'Writing strokes for 日' },
              { title: 'Review Weak Cards', desc: '3 cards need reinforcement' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl space-y-1"
              >
                <p className="text-xs font-bold text-white">{item.title}</p>
                <p className="text-[10px] font-medium text-purple-300/40">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
