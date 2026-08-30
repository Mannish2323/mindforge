'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, Volume2, Sparkles, CheckCircle2, ChevronRight, 
  HelpCircle, BookOpen, Layers, Award, MessageSquare
} from 'lucide-react';
import { MFCard } from '@/components/ui/MFCard';
import { MFButton } from '@/components/ui/MFButton';
import { MFIcon } from '@/components/ui/MFIcon';

type TabType = 'keigo' | 'interview' | 'email' | 'quiz';

interface KeigoPair {
  plain: string;
  polite: string;
  sonkeigo: string; // Respectful (about client/boss)
  kenjougo: string; // Humble (about yourself)
  meaning: string;
}

const KEIGO_PAIRS: KeigoPair[] = [
  { plain: '言う (iu)', polite: '言います (iimasu)', sonkeigo: 'おっしゃる (ossharu)', kenjougo: '申す / 申し上げる (mousu)', meaning: 'To say / tell' },
  { plain: '行く / 来る (iku/kuru)', polite: '行きます/来ます', sonkeigo: 'いらっしゃる / おいでになる', kenjougo: '参る / 伺う (mairu/ukagau)', meaning: 'To go / come' },
  { plain: '食べる / 飲む', polite: '食べます/飲みます', sonkeigo: '召し上がる (meshiagaru)', kenjougo: 'いただく (itadaku)', meaning: 'To eat / drink' },
  { plain: '見る (miru)', polite: '見ます (mimasu)', sonkeigo: 'ご覧になる (goran ni naru)', kenjougo: '拝見する (haiken suru)', meaning: 'To look / see' },
  { plain: '知っている', polite: '知っています', sonkeigo: 'ご存じ (gozonji)', kenjougo: '存じております (zonjite orimasu)', meaning: 'To know' },
  { plain: 'する (suru)', polite: 'します (shimasu)', sonkeigo: 'なさる / される (nasaru)', kenjougo: 'いたす (itasu)', meaning: 'To do' },
];

const INTERVIEW_QUESTIONS = [
  {
    q_jp: '簡単に自己紹介をお願いいたします。',
    q_romaji: 'Kantan ni jikoshoukai wo onegai itashimasu.',
    q_en: 'Please introduce yourself briefly.',
    tip: 'State your name, background, major skills, and end with "本日はよろしくお願いいたします" (Honjitsu wa yoroshiku onegai itashimasu).',
    model_answer_jp: '初めまして。山田太郎と申します。大学で情報工学を専攻し、ソフトウェア開発に携わってまいりました。本日は貴重なお時間をいただき、ありがとうございます。よろしくお願いいたします。',
  },
  {
    q_jp: '弊社を志望した理由を教えてください。',
    q_romaji: 'Heisha wo shibou shita riyuu wo oshiete kudasai.',
    q_en: 'What made you apply to our company?',
    tip: 'Mention the company’s mission, how your skills align with their technical stack, and how you want to contribute.',
    model_answer_jp: '貴社が推進されているグローバルな教育プラットフォーム事業に強く共感いたしました。私の技術力を活かし、サービスの成長に貢献したいと考え、志望いたしました。',
  },
  {
    q_jp: 'ご自身の長所と短所は何ですか？',
    q_romaji: 'Gojishin no choushou to tanshou wa nan desu ka?',
    q_en: 'What are your strengths and weaknesses?',
    tip: 'Share a real strength with an example, and a weakness framed as something you actively manage or improve.',
    model_answer_jp: '私の長所は問題解決に向けた粘り強さです。一方、短所は何事も一人で抱え込みがちな点ですが、現在は早期にチームへ相談することを心がけております。',
  },
];

const EMAIL_TEMPLATES = [
  {
    title: 'Formal Business Greeting & Acknowledgement',
    jp: 'いつも大変お世話になっております。株式会社〇〇の山田でございます。ご連絡いただき、誠にありがとうございます。',
    romaji: 'Itsumo taihen osewa ni natte orimasu. Kabushikigaisha XX no Yamada de gozaimasu. Gorenraku itadaki, makoto ni arigatou gozaimasu.',
    en: 'Thank you very much for your continuous support. This is Yamada from XX Corp. Thank you for contacting us.',
  },
  {
    title: 'Scheduling an Interview / Meeting',
    jp: '面接の日程について、下記の日程でご都合いかがでしょうか。ご検討のほど、よろしくお願い申し上げます。',
    romaji: 'Mensetsu no nittei ni tsuite, kaki no nittei de gotsugou ikaga deshou ka. Gokentou no hodo, yoroshiku onegai moushiagemasu.',
    en: 'Regarding the interview schedule, would any of the following dates suit you? Thank you for your consideration.',
  },
  {
    title: 'Expressing Gratitude After an Interview',
    jp: '本日はお忙しい中、面接のお時間をいただき誠にありがとうございました。貴社への志望度がより一層高まりました。',
    romaji: 'Honjitsu wa oisogashii naka, mensetsu no ojikan wo itadaki makoto ni arigatou gozaimashita. Kisha e no shiboudo ga yori issou takamarimashita.',
    en: 'Thank you very much for taking the time to interview me today despite your busy schedule. My desire to join your company has grown even stronger.',
  }
];

export default function JobPrepPage() {
  const [activeTab, setActiveTab] = useState<TabType>('keigo');

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-7 md:space-y-9 max-w-5xl mx-auto pb-14"
    >
      {/* Top Banner */}
      <motion.div variants={item}>
        <MFCard variant="yellow" washiTape="yellow" padding="lg">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-edge text-xs font-extrabold text-brand shadow-sm">
              <Briefcase className="w-4 h-4 text-brand" />
              <span>Career & Business Japanese</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight">
              Job Interview & Keigo Master Lab
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary font-medium max-w-2xl leading-relaxed">
              Master business etiquette (Keigo), common Japanese job interview questions, and professional email phrasing required for working in Japan.
            </p>
          </div>
        </MFCard>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'keigo' as TabType, label: 'Keigo Matrix (敬語)', count: '6 Core Verbs' },
          { id: 'interview' as TabType, label: 'Job Interview Q&A (面接)', count: '3 Questions' },
          { id: 'email' as TabType, label: 'Business Emails (ビジネスメール)', count: '3 Templates' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-brand text-white border-brand shadow-[var(--paper-press-shadow)]'
                  : 'bg-card text-ink-muted border-edge hover:text-ink hover:bg-cream'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-cream text-ink-muted'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Tab 1: Keigo Matrix */}
      {activeTab === 'keigo' && (
        <motion.div variants={container} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {KEIGO_PAIRS.map((k) => (
              <MFCard key={k.plain} variant="paper" lifted padding="md" className="space-y-3 border">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-brand-light text-brand border border-brand/30">
                      {k.meaning}
                    </span>
                    <h3 className="text-base font-extrabold text-ink font-heading mt-1">
                      {k.plain}
                    </h3>
                  </div>
                  <button
                    onClick={() => speak(k.sonkeigo)}
                    className="p-2 rounded-xl bg-cream border border-edge text-brand hover:scale-105 transition-all cursor-pointer"
                    title="Listen pronunciation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs border-t border-dashed border-edge pt-2">
                  <div className="p-2 rounded-xl bg-card border border-edge">
                    <span className="font-extrabold text-brand block text-[10px] uppercase tracking-wider">
                      尊敬語 (Sonkeigo — Respectful / Boss or Client)
                    </span>
                    <span className="text-sm font-bold font-jp text-ink mt-0.5 block">{k.sonkeigo}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-card border border-edge">
                    <span className="font-extrabold text-mint block text-[10px] uppercase tracking-wider">
                      謙譲語 (Kenjougo — Humble / Yourself)
                    </span>
                    <span className="text-sm font-bold font-jp text-ink mt-0.5 block">{k.kenjougo}</span>
                  </div>
                </div>
              </MFCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tab 2: Interview Q&A */}
      {activeTab === 'interview' && (
        <motion.div variants={container} className="space-y-4">
          {INTERVIEW_QUESTIONS.map((q, idx) => (
            <MFCard key={idx} variant="paper" lifted padding="lg" className="space-y-4 border">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-yellow-light text-ink border border-yellow/40">
                    Question #{idx + 1}
                  </span>
                  <h3 className="text-lg font-black text-ink font-jp mt-1">
                    {q.q_jp}
                  </h3>
                  <p className="text-xs text-brand font-medium italic">{q.q_romaji}</p>
                  <p className="text-xs font-bold text-ink-secondary">{q.q_en}</p>
                </div>
                <button
                  onClick={() => speak(q.q_jp)}
                  className="p-2.5 rounded-2xl bg-cream border border-edge text-brand shrink-0 hover:scale-105 transition-all cursor-pointer"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Tip & Model Answer */}
              <div className="space-y-2 pt-2 border-t border-dashed border-edge">
                <div className="p-3 rounded-2xl bg-brand-light/40 border border-brand/20 text-xs">
                  <span className="font-bold text-brand block mb-1">💡 Sensei Interview Tip:</span>
                  <p className="text-ink-secondary">{q.tip}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-card border border-edge space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-ink-muted uppercase tracking-wider">
                      Model Japanese Response
                    </span>
                    <button
                      onClick={() => speak(q.model_answer_jp)}
                      className="text-xs font-extrabold text-brand flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Answer</span>
                    </button>
                  </div>
                  <p className="text-sm font-medium font-jp text-ink leading-relaxed">
                    {q.model_answer_jp}
                  </p>
                </div>
              </div>
            </MFCard>
          ))}
        </motion.div>
      )}

      {/* Tab 3: Email Templates */}
      {activeTab === 'email' && (
        <motion.div variants={container} className="space-y-4">
          {EMAIL_TEMPLATES.map((tmpl, idx) => (
            <MFCard key={idx} variant="paper" lifted padding="lg" className="space-y-3 border">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-ink font-heading">
                  {tmpl.title}
                </h3>
                <button
                  onClick={() => speak(tmpl.jp)}
                  className="p-2 rounded-xl bg-cream border border-edge text-brand hover:scale-105 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream border border-edge">
                <p className="text-sm font-bold font-jp text-ink leading-relaxed">
                  {tmpl.jp}
                </p>
                <p className="text-xs text-brand font-medium italic mt-1">
                  {tmpl.romaji}
                </p>
              </div>

              <p className="text-xs text-ink-secondary italic pt-1">
                Translation: {tmpl.en}
              </p>
            </MFCard>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
