'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Send, ArrowLeft, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '../lib/supabase';

interface AIChatViewProps {
  onBack: () => void;
  onPlayTTS: (text: string) => void;
  uiLang: string;
  onLimitReached?: (featureName: string) => void;
}

const CONVERSATION_TOPICS = [
  { id: 'intro', label: '👋 Self-Introduction', prompt: 'Introduce yourself in Japanese', system: 'You are a friendly Japanese teacher. The student will introduce themselves. Respond as a Japanese person, give Japanese text with romaji and English translation. Always format responses as JSON with keys: content_ja, content_romaji, content_en, hint.' },
  { id: 'food', label: '🍜 Ordering Food', prompt: 'Practice ordering food at a restaurant', system: 'You are a Japanese restaurant staff member. The student is ordering food. Always reply in Japanese and format as JSON with keys: content_ja, content_romaji, content_en, hint.' },
  { id: 'directions', label: '🗺️ Asking Directions', prompt: 'Ask for directions', system: 'You help students practice asking for directions in Japanese. Format responses as JSON with keys: content_ja, content_romaji, content_en, hint.' },
  { id: 'shopping', label: '🛒 Shopping', prompt: 'Buy something at a Japanese shop', system: 'You are a Japanese shop assistant. Format responses as JSON with keys: content_ja, content_romaji, content_en, hint.' },
  { id: 'daily', label: '☀️ Daily Routine', prompt: 'Talk about your daily routine', system: 'Help the student discuss their daily routine in Japanese. Format as JSON with keys: content_ja, content_romaji, content_en, hint.' },
];

const STARTERS: Record<string, { ja: string; romaji: string; en: string }> = {
  intro: { ja: 'こんにちは！はじめまして。あなたの名前は何ですか？', romaji: 'Konnichiwa! Hajimemashite. Anata no namae wa nan desu ka?', en: 'Hello! Nice to meet you. What is your name?' },
  food: { ja: 'いらっしゃいませ！何にしますか？', romaji: 'Irasshaimase! Nani ni shimasu ka?', en: 'Welcome! What would you like to have?' },
  directions: { ja: 'すみません、どこへ行きたいですか？', romaji: 'Sumimasen, doko e ikitai desu ka?', en: 'Excuse me, where would you like to go?' },
  shopping: { ja: 'こんにちは！今日は何をお探しですか？', romaji: 'Konnichiwa! Kyou wa nani wo osagashi desu ka?', en: 'Hello! What are you looking for today?' },
  daily: { ja: '毎日何時に起きますか？', romaji: 'Mainichi nanji ni okimasu ka?', en: 'What time do you wake up every day?' },
};

interface Message {
  id: string;
  role: 'user' | 'ai';
  ja?: string;
  romaji?: string;
  en: string;
  hint?: string;
}

export function AIChatView({ onBack, onPlayTTS, uiLang, onLimitReached }: AIChatViewProps) {
  const { user, session, profile } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const startTopic = async (topicId: string) => {
    // Check limits before starting conversation if not admin
    if (user && profile && !profile.isAdmin) {
      try {
        const checkRes = await fetch('/api/limits/check', {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        if (checkRes.ok) {
          const limits = await checkRes.json();
          if (!limits.can_use_ai) {
            if (onLimitReached) onLimitReached('AI Tutor Conversations');
            return;
          }
        }
      } catch (err) {
        console.error('Failed to check AI limits:', err);
      }
    }

    const starter = STARTERS[topicId];
    setSelectedTopic(topicId);
    setTotalXP(0);
    const firstMsg: Message = {
      id: `ai-start-${Date.now()}`,
      role: 'ai',
      ja: starter.ja,
      romaji: starter.romaji,
      en: starter.en,
    };
    setMessages([firstMsg]);
    onPlayTTS(starter.ja);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !selectedTopic) return;

    // Double check limits client-side before sending if not admin
    if (user && profile && !profile.isAdmin) {
      try {
        const checkRes = await fetch('/api/limits/check', {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        if (checkRes.ok) {
          const limits = await checkRes.json();
          if (!limits.can_use_ai) {
            if (onLimitReached) onLimitReached('AI Tutor Conversations');
            return;
          }
        }
      } catch (err) {
        console.error('Failed to check AI limits:', err);
      }
    }

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      en: inputText,
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const topic = CONVERSATION_TOPICS.find(t => t.id === selectedTopic)!;

    // Build history for backend API
    const formattedHistory = messages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.role === 'ai' ? m.ja || m.en : m.en
    }));

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          topic: topic.label,
          messages: [
            ...formattedHistory,
            { role: 'user', content: userMsg.en }
          ],
          user_id: user?.id,
        })
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        }
        throw new Error('Server error');
      }

      const parsed = await res.json();

      const aiMsg: Message = {
        id: parsed.message_id || `ai-${Date.now()}`,
        role: 'ai',
        ja: parsed.content_ja || '',
        romaji: parsed.content_romaji || '',
        en: parsed.content_en || 'I see!',
        hint: parsed.grammar_note || undefined,
      };

      setMessages(prev => [...prev, aiMsg]);
      onPlayTTS(aiMsg.ja || '');
      setTotalXP(x => x + 10);

      // Increment usage in database atomically
      if (user) {
        const supabase = createClient();
        await supabase.rpc('increment_daily_usage', {
          p_user_id: user.id,
          p_counter: 'ai_requests'
        });
      }
    } catch (err: any) {
      console.error('[AI Chat] Send error:', err);
      // Fallback response on failure
      await new Promise(r => setTimeout(r, 600));
      const fallbacks = [
        { ja: 'なるほど！もっと教えてください。', romaji: 'Naruhodo! Motto oshiete kudasai.', en: 'I see! Please tell me more.', hint: 'Great effort! Keep practicing.' },
        { ja: 'それは面白いですね！', romaji: 'Sore wa omoshiroi desu ne!', en: 'That is interesting!', hint: 'Try using です (desu) at the end of sentences.' },
        { ja: 'とてもいい日本語ですね！', romaji: 'Totemo ii nihongo desu ne!', en: 'That is very good Japanese!', hint: 'Excellent work! Your Japanese is improving.' },
      ];
      const f = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      const aiMsg: Message = { id: `ai-fallback-${Date.now()}`, role: 'ai', ...f };
      setMessages(prev => [...prev, aiMsg]);
      onPlayTTS(f.ja);
      setTotalXP(x => x + 5);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedTopic) {
    return (
      <div className="page-home page-enter" style={{ padding: 'var(--space-5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
          <button className="btn btn-ghost btn-sm" onClick={onBack} id="ai-chat-back-btn">← Back</button>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, margin: 0 }}>🤖 AI Conversation</h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>Secure Server-Side AI Tutor</p>
          </div>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
          Practice real Japanese conversations with your AI tutor. Pick a topic to start!
        </p>
        <div className="ai-topic-grid">
          {CONVERSATION_TOPICS.map(topic => (
            <button key={topic.id} className="ai-topic-card" onClick={() => startTopic(topic.id)} id={`topic-${topic.id}`}>
              <span className="ai-topic-label">{topic.label}</span>
              <span className="ai-topic-prompt">{topic.prompt}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const topicLabel = CONVERSATION_TOPICS.find(t => t.id === selectedTopic)?.label || 'Conversation';

  return (
    <div className="ai-chat-view page-enter">
      <div className="ai-chat-header">
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTopic(null)}>
          <ArrowLeft size={14} /> Topics
        </button>
        <div className="ai-chat-title">
          <div className="ai-chat-avatar">🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>Velmorth AI Tutor</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{topicLabel} • Gemini</div>
          </div>
        </div>
        <div className="ai-chat-xp"><Zap size={12} /> {totalXP} XP</div>
      </div>

      <div className="ai-chat-messages" ref={scrollRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble-wrap ${msg.role}`}>
            {msg.role === 'ai' && <div className="chat-ai-avatar">🤖</div>}
            <div className={`chat-bubble ${msg.role}`}>
              {msg.role === 'ai' ? (
                <>
                  <div className="chat-ja">{msg.ja}</div>
                  {msg.romaji && <div className="chat-romaji">{msg.romaji}</div>}
                  <div className="chat-en">{msg.en}</div>
                  <div className="chat-bubble-footer">
                    <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => onPlayTTS(msg.ja || '')}>
                      <Volume2 size={12} />
                    </button>
                  </div>
                  {msg.hint && <div className="chat-hint">💡 {msg.hint}</div>}
                </>
              ) : (
                <div className="chat-user-text">{msg.en}</div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble-wrap ai">
            <div className="chat-ai-avatar">🤖</div>
            <div className="chat-bubble ai chat-typing">
              <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="ai-chat-input-area">
        <input
          type="text"
          className="ai-chat-input"
          placeholder="Type in Japanese or English..."
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          id="ai-chat-input"
        />
        <button
          className="btn btn-primary ai-chat-send"
          onClick={sendMessage}
          disabled={!inputText.trim() || isLoading}
          id="ai-chat-send-btn"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
