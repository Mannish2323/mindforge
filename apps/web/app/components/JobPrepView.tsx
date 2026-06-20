'use client';

import React, { useState, useMemo } from 'react';
import { 
  Briefcase, BookOpen, Volume2, Copy, Check, FileText, 
  MessageSquare, User, GraduationCap, Award, CheckCircle, 
  Printer, RefreshCw, Sparkles, Send, Play, HelpCircle, ArrowRight
} from 'lucide-react';
import { 
  industryLexicons, keigoVerbs, emailTemplates, interviewQuestions 
} from './jlpt/jobPrepData';

interface JobPrepViewProps {
  onBack: () => void;
}

export function JobPrepView({ onBack }: JobPrepViewProps) {
  const [activeTab, setActiveTab] = useState<'lexicons' | 'keigo' | 'emails' | 'resume' | 'interview'>('lexicons');

  // Lexicons State
  const [selectedIndustry, setSelectedIndustry] = useState<string>('it');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  // Email Builder State
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emailTemplates[0].id);
  const [emailInputs, setEmailInputs] = useState<Record<string, string>>({
    '[相手の会社名]': '木村商事株式会社',
    '[相手の役職・氏名]': '開発部部長　木村一郎',
    '[自分の会社名]': 'ベルモース開発ラボ',
    '[自分の氏名]': '山田太郎',
    '[日時候補1]': '6月23日（火）10:00〜11:00',
    '[日時候補2]': '6月24日（水）14:00〜15:00',
    '[日時候補3]': '6月25日（木）16:00〜17:00',
    '[署名 (Signature)]': '山田太郎 (Taro Yamada)\nEmail: taro@velmorth.com\nTel: 080-1234-5678',
    '[資料の名前]': '要件定義書及び設計モックアップ',
    '[変更後の提出日]': '6月24日',
    '[時間]': '12:00',
    '[決定事項・次回タスク1]': 'フロントエンドアーキテクチャの選定 (Vite + React)',
    '[決定事項・次回タスク2]': 'データベース構造のモデリングとスキーマFIX',
    '[次の期日]': '6月29日'
  });
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Resume Builder State
  const [resumeData, setResumeData] = useState({
    nameJp: '山田 太郎',
    nameKana: 'ヤマダ タロウ',
    birthDate: '1998-05-15',
    gender: '男性',
    postalCode: '100-0005',
    addressJp: '東京都千代田区丸の内１丁目',
    phone: '080-1234-5678',
    email: 'yamada@example.com',
    education: [
      { year: '2017', month: '04', detail: 'デリー工科大学 コンピューターサイエンス学科 入学' },
      { year: '2021', month: '03', detail: 'デリー工科大学 コンピューターサイエンス学科 卒業' }
    ],
    workHistory: [
      { year: '2021', month: '04', detail: 'インフォシス・インディア株式会社 入社 (フルスタックエンジニア)' },
      { year: '2024', month: '03', detail: '一身上の都合により退職' },
      { year: '', month: '', detail: '現在に至る' }
    ],
    qualifications: [
      { year: '2020', month: '12', detail: '日本語能力試験 (JLPT) N2 合格' },
      { year: '2022', month: '05', detail: 'AWS 認定ソリューションアーキテクト アソシエイト 合格' }
    ],
    selfPR: '私は問題解決に対して粘り強く取り組む姿勢を持っています。前職では、ウェブアプリケーションの読み込み速度を35%向上させ、UX改善に貢献しました。JLPT N2を取得しており、日本語での技術仕様書の理解や簡単なミーティング進行が可能です。貴社の開発チームにおいても、培った技術力を活かして貢献いたします。'
  });
  const [showResumePreview, setShowResumePreview] = useState(false);

  // Interview Simulator State
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'interviewer' | 'candidate'; text: string; audioId?: string }>>([]);
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [feedbackComments, setFeedbackComments] = useState<string[]>([]);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Speech Synthesis helper
  const speakText = (text: string, id: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;
      
      utterance.onstart = () => setSpeakingWordId(id);
      utterance.onend = () => setSpeakingWordId(null);
      utterance.onerror = () => setSpeakingWordId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Compile final email text
  const currentEmailTemplate = useMemo(() => {
    return emailTemplates.find(t => t.id === selectedEmailId);
  }, [selectedEmailId]);

  const compiledEmailBody = useMemo(() => {
    if (!currentEmailTemplate) return '';
    let body = currentEmailTemplate.body;
    Object.entries(emailInputs).forEach(([key, val]) => {
      body = body.replaceAll(key, val);
    });
    return body;
  }, [currentEmailTemplate, emailInputs]);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`件名: ${currentEmailTemplate?.subject || ''}\n\n${compiledEmailBody}`);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleEmailInputChange = (variableName: string, val: string) => {
    setEmailInputs(prev => ({
      ...prev,
      [variableName]: val
    }));
  };

  // Resume print handler
  const handlePrintResume = () => {
    window.print();
  };

  // Resume inputs handler
  const handleResumeChange = (field: string, val: string) => {
    setResumeData(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const updateResumeRow = (type: 'education' | 'workHistory' | 'qualifications', idx: number, field: string, val: string) => {
    setResumeData(prev => {
      const targetList = [...prev[type]];
      targetList[idx] = { ...targetList[idx], [field]: val };
      return { ...prev, [type]: targetList };
    });
  };

  const addResumeRow = (type: 'education' | 'workHistory' | 'qualifications') => {
    setResumeData(prev => {
      const newRow = { year: '', month: '', detail: '' };
      return { ...prev, [type]: [...prev[type], newRow] };
    });
  };

  const removeResumeRow = (type: 'education' | 'workHistory' | 'qualifications', idx: number) => {
    setResumeData(prev => {
      const targetList = [...prev[type]];
      targetList.splice(idx, 1);
      return { ...prev, [type]: targetList };
    });
  };

  // Interview logic
  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIdx(0);
    setChatHistory([]);
    setFeedbackScore(null);
    setFeedbackComments([]);
    setInterviewCompleted(false);
    setUserAnswerText('');

    // Trigger first question
    const firstQ = interviewQuestions[0];
    setChatHistory([{ sender: 'interviewer', text: firstQ.question, audioId: 'q-0' }]);
    speakText(firstQ.question, 'q-0');
  };

  const handleSendAnswer = () => {
    if (!userAnswerText.trim()) return;

    // Add candidate reply to history
    const userMsg = userAnswerText;
    setChatHistory(prev => [...prev, { sender: 'candidate', text: userMsg }]);
    setUserAnswerText('');

    // Evaluate answer heuristics
    const evaluation = evaluatePoliteness(userMsg);
    setFeedbackScore(evaluation.score);
    setFeedbackComments(evaluation.comments);

    // Proceed to next question or complete after 2.5s display of feedback
    setTimeout(() => {
      const nextIdx = currentQuestionIdx + 1;
      if (nextIdx < interviewQuestions.length) {
        setCurrentQuestionIdx(nextIdx);
        const nextQ = interviewQuestions[nextIdx];
        setChatHistory(prev => [...prev, { sender: 'interviewer', text: nextQ.question, audioId: `q-${nextIdx}` }]);
        speakText(nextQ.question, `q-${nextIdx}`);
        // Reset local scores during transition
        setFeedbackScore(null);
        setFeedbackComments([]);
      } else {
        setInterviewCompleted(true);
      }
    }, 4500);
  };

  // Simple rule-based validation checking for humble markers and polite verbs
  const evaluatePoliteness = (text: string) => {
    const comments: string[] = [];
    let score = 60; // baseline

    // Checks for casual copula (だ、だよ、である - bad in interview unless quote)
    if (text.includes('だよ') || text.includes('だね')) {
      score -= 20;
      comments.push('⚠️ Avoid casual endings like 「〜だよ」 or 「〜だね」. Use 「〜です」 or 「〜ます」.');
    }

    // Checks for standard polite copula
    if (text.includes('です') || text.includes('ます') || text.includes('でした') || text.includes('ました')) {
      score += 15;
    } else {
      score -= 20;
      comments.push('⚠️ Make sure your sentences end with polite verbs or copula 「です/ます」.');
    }

    // Checks for humble/honorific vocabulary expressions
    const humbleVerbs = ['申します', 'いたします', '存じます', '参ります', '拝見', 'お目にかかる', 'いただきます'];
    let humbleCount = 0;
    humbleVerbs.forEach(v => {
      if (text.includes(v)) humbleCount++;
    });

    if (humbleCount > 0) {
      score += Math.min(25, humbleCount * 10);
      comments.push(`✨ Excellent! You used humble Keigo (謙譲語) terms like ${humbleVerbs.filter(v => text.includes(v)).map(v => `「${v}」`).join(', ')}.`);
    } else {
      comments.push('💡 Hint: Upgrade standard verbs to humble forms (e.g. use 「申します」 instead of 「言います」).');
    }

    // Check for polite particles
    if (text.includes('よろしくお願いいたします') || text.includes('よろしくおねがいします')) {
      score += 10;
      comments.push('✨ Great job closing with a respectful greeting.');
    }

    const finalScore = Math.min(100, Math.max(10, score));

    return {
      score: finalScore,
      comments: comments.length > 0 ? comments : ['✨ Good grammatical structure. Polite tone maintained.']
    };
  };

  const activeQuestion = interviewQuestions[currentQuestionIdx];

  return (
    <div className="job-prep-container page-transition animate-fadein" style={{
      maxWidth: '1000px',
      margin: '0 auto',
      padding: 'var(--sp-4)',
      paddingBottom: 'calc(var(--bottom-nav-h) + 32px)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--sp-4)'
    }}>
      <style>{`
        .job-tab-btn {
          padding: 10px 16px;
          border: none;
          background: transparent;
          color: var(--text-secondary, #b3b3b9);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .job-tab-btn.active {
          color: var(--primary, #16A34A);
          border-bottom-color: var(--primary, #16A34A);
        }
        .job-tab-btn:hover {
          color: var(--text-primary, #fff);
          background: rgba(255, 255, 255, 0.02);
        }
        .lexicon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--sp-4);
        }
        .rirekisho-grid {
          display: grid;
          grid-template-columns: 120px 1fr;
          border: 1.5px solid #000;
          background: #fff;
          color: #000;
          font-family: "MS Mincho", "Hiragino Mincho ProN", serif;
        }
        .rirekisho-cell {
          border: 0.5px solid #000;
          padding: 8px 12px;
          font-size: 13px;
          display: flex;
          align-items: center;
        }
        .rirekisho-header {
          grid-column: span 2;
          background: #f3f4f6;
          font-weight: 900;
          text-align: center;
          padding: 6px;
          font-size: 14px;
          letter-spacing: 0.1em;
          border-bottom: 1.5px solid #000;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-rirekisho-modal, .printable-rirekisho-modal * {
            visibility: visible;
          }
          .printable-rirekisho-modal {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex-between flex no-print" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)' }}>
          <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>
            ← Back
          </button>
          <h2 className="text-xl font-black flex" style={{ alignItems: 'center', gap: '8px' }}>
            💼 Job-Ready Japan Hub
          </h2>
        </div>
        <div className="badge" style={{
          background: 'rgba(22, 163, 74, 0.1)',
          border: '1px solid rgba(22, 163, 74, 0.3)',
          color: 'var(--primary, #16A34A)',
          padding: '6px 12px',
          fontWeight: 800,
          borderRadius: '20px',
          fontSize: '11px'
        }}>
          🎯 Level 0 to N1 Employment Path
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="card no-print" style={{ padding: '4px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '4px', scrollbarWidth: 'none' }}>
          <button 
            className={`job-tab-btn ${activeTab === 'lexicons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lexicons')}
          >
            <BookOpen size={16} />
            <span>Industry Lexicons</span>
          </button>
          <button 
            className={`job-tab-btn ${activeTab === 'keigo' ? 'active' : ''}`}
            onClick={() => setActiveTab('keigo')}
          >
            <Award size={16} />
            <span>Keigo Lab</span>
          </button>
          <button 
            className={`job-tab-btn ${activeTab === 'emails' ? 'active' : ''}`}
            onClick={() => setActiveTab('emails')}
          >
            <FileText size={16} />
            <span>Email Templates</span>
          </button>
          <button 
            className={`job-tab-btn ${activeTab === 'resume' ? 'active' : ''}`}
            onClick={() => setActiveTab('resume')}
          >
            <User size={16} />
            <span>Resume Builder</span>
          </button>
          <button 
            className={`job-tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
            onClick={() => setActiveTab('interview')}
          >
            <MessageSquare size={16} />
            <span>Interview Prep</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT: INDUSTRY LEXICONS */}
      {activeTab === 'lexicons' && (
        <div className="card animate-fadein no-print" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <h3 className="font-bold text-lg">🌿 Industry Specialized Vocabularies</h3>
            <p className="text-muted text-xs mt-1">Master key terminology commonly used on the job across primary sectors.</p>
          </div>

          {/* Industry Selection Buttons */}
          <div className="flex gap-2" style={{ flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--sp-3)' }}>
            {Object.entries(industryLexicons).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedIndustry(key)}
                className={`chip ${selectedIndustry === key ? 'active' : ''}`}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {value.jpTitle} {value.title}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--surface-2)', padding: 'var(--sp-3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <p className="text-xs text-muted font-bold uppercase tracking-wider">Sector Focus</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text)' }}>
              {industryLexicons[selectedIndustry].description}
            </p>
          </div>

          {/* Vocabulary list */}
          <div className="lexicon-grid">
            {industryLexicons[selectedIndustry].vocab.map((item) => (
              <div 
                key={item.id} 
                className="card flex" 
                style={{ 
                  flexDirection: 'column', 
                  gap: '8px', 
                  background: 'var(--surface-3)', 
                  border: '1px solid var(--border-strong)',
                  padding: '16px',
                  borderRadius: '16px'
                }}
              >
                <div className="flex-between flex" style={{ width: '100%' }}>
                  <span className="text-xs text-muted uppercase font-bold tracking-wider">{item.romaji}</span>
                  <button 
                    onClick={() => speakText(item.word, item.id)}
                    className="btn-ghost"
                    style={{
                      padding: '4px',
                      borderRadius: '50%',
                      background: speakingWordId === item.id ? 'var(--primary-light)' : 'transparent',
                      color: speakingWordId === item.id ? 'var(--primary)' : 'var(--text)'
                    }}
                    aria-label="Speak Japanese word"
                  >
                    <Volume2 size={16} />
                  </button>
                </div>

                <div>
                  <h4 style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-ja)' }}>{item.word}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '2px', fontWeight: 800 }}>({item.hiragana})</p>
                </div>

                <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                    🇬🇧 {item.meaning_en}
                  </p>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary, #b3b3b9)' }}>
                    🇮🇳 {item.meaning_hi}
                  </p>
                </div>

                <div className="sidebar-divider" style={{ margin: '8px 0', height: '1px', background: 'var(--border)' }} />

                <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <p style={{ color: 'var(--text-3)' }}><span className="font-bold text-muted">Situation:</span> {item.situation}</p>
                  <p style={{ color: 'var(--text-3)' }}><span className="font-bold text-muted">Cultural Tip:</span> {item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BUSINESS KEIGO */}
      {activeTab === 'keigo' && (
        <div className="card animate-fadein no-print" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <h3 className="font-bold text-lg">🤝 Business Keigo Lab (ビジネス敬語)</h3>
            <p className="text-muted text-xs mt-1">
              Master the distinction between Polite (丁寧語), Honorific (尊敬語 - for boss/client), and Humble (謙譲語 - for yourself) verbs.
            </p>
          </div>

          {/* Keigo Matrix */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-3)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Concept / Meaning</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Plain Form</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Polite (丁寧語)</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'var(--xp-gold)' }}>Honorific (尊敬語)</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold', color: 'var(--primary)' }}>Humble (謙譲語)</th>
                </tr>
              </thead>
              <tbody>
                {keigoVerbs.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.meaning}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-ja)' }}>{item.plain}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-ja)' }}>{item.polite}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-ja)', fontWeight: 700, color: 'var(--xp-gold)' }}>{item.honorific}</td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-ja)', fontWeight: 700, color: 'var(--primary)' }}>{item.humble}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Usage Examples Section */}
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <h4 className="font-bold text-sm mb-3 flex" style={{ alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} className="text-gold" /> Real Life Dialogue Scenarios
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {keigoVerbs.map((item) => (
                <div 
                  key={`ex-${item.id}`} 
                  style={{ 
                    background: 'var(--surface-2)', 
                    borderLeft: '4px solid var(--primary)', 
                    padding: '12px 16px',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '13px'
                  }}
                >
                  <p className="font-bold text-xs uppercase text-muted tracking-wider mb-2">VERB: {item.meaning}</p>
                  <pre style={{ 
                    margin: 0, 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: 'var(--font-ja)', 
                    color: 'var(--text)', 
                    fontSize: '13px', 
                    lineHeight: '1.6' 
                  }}>
                    {item.example}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EMAIL TEMPLATE BUILDER */}
      {activeTab === 'emails' && (
        <div className="card animate-fadein no-print" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--sp-5)' }}>
          <div>
            <h3 className="font-bold text-lg">📧 Professional Email Builder</h3>
            <p className="text-muted text-xs mt-1">Select standard situation templates, customize placeholders, and export draft emails immediately.</p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Input Config Panel */}
            <div className="flex" style={{ flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider">Select Scenario</label>
                <select 
                  value={selectedEmailId} 
                  onChange={(e) => setSelectedEmailId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--surface-2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginTop: '4px'
                  }}
                >
                  {emailTemplates.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                  ))}
                </select>
              </div>

              {currentEmailTemplate && (
                <div style={{ background: 'var(--surface-3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <p className="text-xs text-muted font-bold uppercase tracking-wider">Scenario Context</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>🇬🇧 {currentEmailTemplate.explanation_en}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>🇮🇳 {currentEmailTemplate.explanation_hi}</p>
                </div>
              )}

              {/* Dynamic Variables Form */}
              <div className="sidebar-divider" style={{ margin: '8px 0', height: '1px', background: 'var(--border)' }} />
              <h4 className="font-bold text-xs uppercase text-muted tracking-wider">Form Variables</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                {currentEmailTemplate?.variables.map((variable) => (
                  <div key={variable} className="flex" style={{ flexDirection: 'column', gap: '3px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-3)', fontWeight: 800 }}>{variable}</label>
                    <input 
                      type="text" 
                      value={emailInputs[variable] || ''} 
                      onChange={(e) => handleEmailInputChange(variable, e.target.value)}
                      placeholder={`Enter ${variable}...`}
                      style={{
                        padding: '8px 12px',
                        background: 'var(--surface-2)',
                        color: 'var(--text)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Compiled Preview Panel */}
            <div className="card" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex-between flex" style={{ width: '100%' }}>
                <span className="text-xs font-bold text-muted uppercase tracking-wider">Email Subject & Body Preview</span>
                <button 
                  onClick={handleCopyEmail}
                  className="btn-primary"
                  style={{
                    width: 'auto',
                    margin: 0,
                    padding: '6px 12px',
                    fontSize: '11px',
                    background: copiedEmail ? 'var(--success)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedEmail ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                </button>
              </div>

              <div style={{
                background: 'var(--bg-card, #121216)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#fff',
                whiteSpace: 'pre-wrap',
                flex: 1,
                overflowY: 'auto',
                minHeight: '260px',
                lineHeight: '1.6'
              }}>
                <span style={{ color: 'var(--xp-gold)' }}>件名:</span> {currentEmailTemplate?.subject}
                {'\n\n'}
                {compiledEmailBody}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RESUME BUILDER */}
      {activeTab === 'resume' && (
        <div className="card animate-fadein no-print" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="flex-between flex" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 className="font-bold text-lg">📝 Japanese Resume (履歴書) Builder</h3>
              <p className="text-muted text-xs mt-1">Construct your personal details, academic history, qualifications, and click preview to export a Japanese Standard Rirekisho.</p>
            </div>
            <button 
              onClick={() => setShowResumePreview(true)}
              className="btn-primary"
              style={{
                width: 'auto',
                margin: 0,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px'
              }}
            >
              <FileText size={16} />
              <span>Preview Rirekisho Sheet</span>
            </button>
          </div>

          {/* Form input sections */}
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Personal Details */}
            <div className="card flex" style={{ flexDirection: 'column', gap: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <h4 className="font-bold text-sm text-green border-b pb-1" style={{ borderBottom: '1px solid var(--border)' }}>Personal Information</h4>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <label className="text-xs text-muted">Name (Kanji)</label>
                  <input type="text" value={resumeData.nameJp} onChange={(e) => handleResumeChange('nameJp', e.target.value)} style={{ padding: '8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <label className="text-xs text-muted">Name (Katakana)</label>
                  <input type="text" value={resumeData.nameKana} onChange={(e) => handleResumeChange('nameKana', e.target.value)} style={{ padding: '8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <label className="text-xs text-muted">Birth Date</label>
                  <input type="date" value={resumeData.birthDate} onChange={(e) => handleResumeChange('birthDate', e.target.value)} style={{ padding: '6px 8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <label className="text-xs text-muted">Gender</label>
                  <input type="text" value={resumeData.gender} onChange={(e) => handleResumeChange('gender', e.target.value)} style={{ padding: '8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
                </div>
              </div>
              <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                <label className="text-xs text-muted">Address (Japan/Overseas)</label>
                <input type="text" value={resumeData.addressJp} onChange={(e) => handleResumeChange('addressJp', e.target.value)} style={{ padding: '8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <label className="text-xs text-muted">Phone Number</label>
                  <input type="text" value={resumeData.phone} onChange={(e) => handleResumeChange('phone', e.target.value)} style={{ padding: '8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
                </div>
                <div className="flex" style={{ flexDirection: 'column', gap: '4px' }}>
                  <label className="text-xs text-muted">Email Address</label>
                  <input type="text" value={resumeData.email} onChange={(e) => handleResumeChange('email', e.target.value)} style={{ padding: '8px', background: 'var(--surface-3)', color: '#fff', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }} />
                </div>
              </div>
            </div>

            {/* Self PR / Motivation */}
            <div className="card flex" style={{ flexDirection: 'column', gap: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <h4 className="font-bold text-sm text-green border-b pb-1" style={{ borderBottom: '1px solid var(--border)' }}>Self PR & Motivation Statement</h4>
              <p className="text-xs text-muted">Write a formal statement explaining your strengths. Tips: Use 「〜です/ます」 and humble language.</p>
              <textarea 
                value={resumeData.selfPR} 
                onChange={(e) => handleResumeChange('selfPR', e.target.value)}
                style={{
                  width: '100%',
                  height: '160px',
                  background: 'var(--surface-3)',
                  color: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  resize: 'none',
                  flex: 1
                }}
              />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <span className="text-xs text-muted">Useful Phrases:</span>
                <button 
                  onClick={() => handleResumeChange('selfPR', resumeData.selfPR + ' これまでの経験を活かし、貴社に貢献したいと考えております。')}
                  className="btn-ghost" style={{ padding: '3px 8px', fontSize: '10px', background: 'var(--surface-3)', borderRadius: '4px' }}
                >
                  + Add "Contribute using experience"
                </button>
                <button 
                  onClick={() => handleResumeChange('selfPR', resumeData.selfPR + ' 現在に至るまで、技術力の向上に努めてまいりました。')}
                  className="btn-ghost" style={{ padding: '3px 8px', fontSize: '10px', background: 'var(--surface-3)', borderRadius: '4px' }}
                >
                  + Add "Strive to improve tech skills"
                </button>
              </div>
            </div>
          </div>

          {/* Academic & Work Experience Row Editor */}
          <div className="card flex" style={{ flexDirection: 'column', gap: '12px', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <div className="flex-between flex">
              <h4 className="font-bold text-sm text-green">Education & Employment History</h4>
              <button 
                onClick={() => addResumeRow('education')} 
                className="btn-ghost" 
                style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--surface-3)', borderRadius: '4px' }}
              >
                + Add Academic Entry
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resumeData.education.map((row, idx) => (
                <div key={`edu-${idx}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder="Year" value={row.year} onChange={(e) => updateResumeRow('education', idx, 'year', e.target.value)} style={{ width: '70px', padding: '6px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', color: '#fff', fontSize: '12px' }} />
                  <input type="text" placeholder="Month" value={row.month} onChange={(e) => updateResumeRow('education', idx, 'month', e.target.value)} style={{ width: '50px', padding: '6px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', color: '#fff', fontSize: '12px' }} />
                  <input type="text" placeholder="Institution / Detail" value={row.detail} onChange={(e) => updateResumeRow('education', idx, 'detail', e.target.value)} style={{ flex: 1, padding: '6px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', color: '#fff', fontSize: '12px' }} />
                  <button onClick={() => removeResumeRow('education', idx)} className="btn-ghost" style={{ padding: '6px', color: 'var(--error)' }} aria-label="Remove academic row">
                    <Trash2Icon />
                  </button>
                </div>
              ))}
            </div>

            <div className="sidebar-divider" style={{ margin: '8px 0', height: '1px', background: 'var(--border)' }} />

            <div className="flex-between flex">
              <h4 className="font-bold text-xs uppercase text-muted tracking-wider">Employment History Rows</h4>
              <button 
                onClick={() => addResumeRow('workHistory')} 
                className="btn-ghost" 
                style={{ padding: '4px 10px', fontSize: '11px', background: 'var(--surface-3)', borderRadius: '4px' }}
              >
                + Add Employment Entry
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resumeData.workHistory.map((row, idx) => (
                <div key={`work-${idx}`} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" placeholder="Year" value={row.year} onChange={(e) => updateResumeRow('workHistory', idx, 'year', e.target.value)} style={{ width: '70px', padding: '6px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', color: '#fff', fontSize: '12px' }} />
                  <input type="text" placeholder="Month" value={row.month} onChange={(e) => updateResumeRow('workHistory', idx, 'month', e.target.value)} style={{ width: '50px', padding: '6px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', color: '#fff', fontSize: '12px' }} />
                  <input type="text" placeholder="Company / Position Detail" value={row.detail} onChange={(e) => updateResumeRow('workHistory', idx, 'detail', e.target.value)} style={{ flex: 1, padding: '6px 8px', background: 'var(--surface-3)', border: '1px solid var(--border)', borderRadius: '4px', color: '#fff', fontSize: '12px' }} />
                  <button onClick={() => removeResumeRow('workHistory', idx)} className="btn-ghost" style={{ padding: '6px', color: 'var(--error)' }} aria-label="Remove employment row">
                    <Trash2Icon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: INTERVIEW SIMULATOR */}
      {activeTab === 'interview' && (
        <div className="card animate-fadein no-print" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div>
            <h3 className="font-bold text-lg">🗣️ Japanese Interview Q&A Simulator</h3>
            <p className="text-muted text-xs mt-1">Practice responding to standard hiring prompts. Check formatting alignment and receive immediate politeness feedback.</p>
          </div>

          {!interviewStarted ? (
            /* Intro State */
            <div style={{ textAlign: 'center', padding: 'var(--sp-8) 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                <Briefcase size={32} />
              </div>
              <div>
                <h4 className="font-black text-lg">Simulated Interview Protocol</h4>
                <p className="text-muted text-xs mt-2" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  The interviewer will speak common Japanese hiring prompts. Respond in formal keigo, and receive feedback on your grammar, vocabulary, and honorific usage.
                </p>
              </div>
              <button 
                onClick={startInterview}
                className="btn-primary"
                style={{ width: 'auto', background: 'var(--primary)', padding: '10px 24px' }}
              >
                Begin Practice Interview
              </button>
            </div>
          ) : (
            /* Active Chat State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-between flex text-xs text-muted" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <span>Interviewer Session Progress</span>
                <span className="font-bold">Question {currentQuestionIdx + 1} of {interviewQuestions.length}</span>
              </div>

              {/* Chat Log Window */}
              <div style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border-strong)',
                borderRadius: '16px',
                padding: '16px',
                minHeight: '260px',
                maxHeight: '360px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {chatHistory.map((msg, index) => {
                  const isInterviewer = msg.sender === 'interviewer';
                  return (
                    <div 
                      key={index} 
                      className="animate-fadein"
                      style={{ 
                        alignSelf: isInterviewer ? 'flex-start' : 'flex-end',
                        maxWidth: '80%',
                        background: isInterviewer ? 'var(--surface-3)' : 'var(--primary-light)',
                        border: isInterviewer ? '1px solid var(--border-strong)' : '1px solid var(--primary)',
                        padding: '10px 14px',
                        borderRadius: isInterviewer ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                        color: '#fff',
                        fontSize: '13px'
                      }}
                    >
                      <div className="flex" style={{ gap: '8px', alignItems: 'flex-start' }}>
                        {isInterviewer && (
                          <button 
                            onClick={() => speakText(msg.text, msg.audioId || '')}
                            style={{ 
                              background: 'transparent', 
                              border: 'none', 
                              color: speakingWordId === msg.audioId ? 'var(--primary)' : 'var(--text-3)',
                              cursor: 'pointer',
                              padding: '2px',
                              marginTop: '2px'
                            }}
                            aria-label="Repeat audio question"
                          >
                            <Volume2 size={14} />
                          </button>
                        )}
                        <div>
                          <p style={{ fontWeight: 800, fontSize: '11px', color: isInterviewer ? 'var(--xp-gold)' : 'var(--primary)', marginBottom: '4px' }}>
                            {isInterviewer ? 'Velmorth Interviewer 🤖' : 'You (Candidate) 👤'}
                          </p>
                          <p style={{ fontFamily: 'var(--font-ja)', lineHeight: '1.5' }}>{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Score Alert overlay feedback inside simulator */}
                {feedbackScore !== null && (
                  <div 
                    className="card animate-bounce" 
                    style={{ 
                      alignSelf: 'center', 
                      background: 'rgba(22, 163, 74, 0.1)', 
                      border: '1px solid rgba(22, 163, 74, 0.3)',
                      color: '#fff',
                      padding: '12px 18px',
                      borderRadius: '16px',
                      maxWidth: '90%',
                      marginTop: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary)' }}>Real-time Formality Analysis</p>
                    <h4 style={{ fontSize: '18px', fontWeight: 900, margin: '4px 0' }}>Formality Score: {feedbackScore}/100</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px', textAlign: 'left' }}>
                      {feedbackComments.map((c, i) => (
                        <p key={i} style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{c}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Console */}
              {!interviewCompleted ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={userAnswerText}
                    onChange={(e) => setUserAnswerText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
                    placeholder="Type your polite Keigo response here..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'var(--surface-2)',
                      color: '#fff',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '13px'
                    }}
                  />
                  <button 
                    onClick={handleSendAnswer}
                    className="btn-primary"
                    style={{ width: 'auto', margin: 0, padding: '0 20px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={14} />
                    <span>Send</span>
                  </button>
                </div>
              ) : (
                /* Completed State */
                <div className="card text-center animate-fadein" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={32} className="text-green" />
                  <div>
                    <h4 className="font-bold">Interview Completed!</h4>
                    <p className="text-muted text-xs mt-1">Review the advice and try again to improve your overall formality scoring.</p>
                  </div>
                  <button 
                    onClick={startInterview}
                    className="btn-secondary"
                    style={{ width: 'auto', margin: 0, padding: '8px 18px' }}
                  >
                    Restart Practice
                  </button>
                </div>
              )}

              {/* Advisor tips pane */}
              {activeQuestion && !interviewCompleted && (
                <div style={{ background: 'var(--surface-3)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '12px' }}>
                  <p className="font-bold text-xs uppercase text-muted mb-2">Sensei Interview Hints</p>
                  <p style={{ color: 'var(--text)' }}><strong>English Advice:</strong> {activeQuestion.advice_en}</p>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}><strong>Hindi Advice:</strong> {activeQuestion.advice_hi}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RIKEKISHO PRINT / PREVIEW MODAL OVERLAY */}
      {showResumePreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}>
          <div className="card printable-rirekisho-modal" style={{
            background: '#fff',
            color: '#000',
            width: '100%',
            maxWidth: '800px',
            borderRadius: '0px', // authentic paper shape
            padding: '40px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal actions */}
            <div className="flex-between flex no-print" style={{ marginBottom: '24px', borderBottom: '1px solid #ccc', paddingBottom: '12px' }}>
              <h4 style={{ margin: 0, fontWeight: 900, color: '#000', fontSize: '16px' }}>履歴書プレビュー (Official Japanese Resume Preview)</h4>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrintResume} 
                  className="btn-primary" 
                  style={{ width: 'auto', margin: 0, background: '#16A34A', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                >
                  <Printer size={14} />
                  <span>Print / Export PDF</span>
                </button>
                <button 
                  onClick={() => setShowResumePreview(false)} 
                  className="btn-ghost" 
                  style={{ width: 'auto', margin: 0, border: '1px solid #999', color: '#000', fontSize: '12px', padding: '6px 12px' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Resume Sheet Content */}
            <div style={{ 
              background: '#fff', 
              color: '#000', 
              fontFamily: '"MS Mincho", "Hiragino Mincho ProN", serif',
              border: '2px solid #000',
              padding: '16px'
            }}>
              {/* Header Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', paddingBottom: '12px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 900, margin: 0, letterSpacing: '0.2em' }}>履 歴 書</h1>
                <div style={{ textAlign: 'right', fontSize: '12px' }}>
                  <p>{new Date().getFullYear()}年 {new Date().getMonth() + 1}月 {new Date().getDate()}日現在</p>
                </div>
              </div>

              {/* Personal Details Table */}
              <div className="rirekisho-grid" style={{ marginTop: '12px' }}>
                <div className="rirekisho-cell" style={{ background: '#f8fafc', fontWeight: 'bold' }}>ふりがな</div>
                <div className="rirekisho-cell">{resumeData.nameKana}</div>

                <div className="rirekisho-cell" style={{ background: '#f8fafc', fontWeight: 'bold' }}>氏 名</div>
                <div className="rirekisho-cell" style={{ fontSize: '20px', fontWeight: 'bold' }}>{resumeData.nameJp}</div>

                <div className="rirekisho-cell" style={{ background: '#f8fafc', fontWeight: 'bold' }}>生年月日</div>
                <div className="rirekisho-cell">
                  {resumeData.birthDate.split('-')[0]} 年 {resumeData.birthDate.split('-')[1]} 月 {resumeData.birthDate.split('-')[2]} 日生 （満 {new Date().getFullYear() - parseInt(resumeData.birthDate.split('-')[0] || '1998')} 歳）
                </div>

                <div className="rirekisho-cell" style={{ background: '#f8fafc', fontWeight: 'bold' }}>性 別</div>
                <div className="rirekisho-cell">{resumeData.gender}</div>

                <div className="rirekisho-cell" style={{ background: '#f8fafc', fontWeight: 'bold' }}>現住所</div>
                <div className="rirekisho-cell">〒 {resumeData.postalCode} {'\n'} {resumeData.addressJp}</div>

                <div className="rirekisho-cell" style={{ background: '#f8fafc', fontWeight: 'bold' }}>連絡先</div>
                <div className="rirekisho-cell">
                  電話番号: {resumeData.phone} {'\n'} 
                  E-mail: {resumeData.email}
                </div>
              </div>

              {/* Educational & Work History Table */}
              <div style={{ marginTop: '16px', border: '1.5px solid #000' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', background: '#f8fafc', fontWeight: 'bold', fontSize: '12px', borderBottom: '1.5px solid #000', padding: '6px 0', textAlign: 'center' }}>
                  <div>年</div>
                  <div>月</div>
                  <div>学歴・職歴 (Academic & Work History)</div>
                </div>

                {/* Combined list */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Education Label */}
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', fontSize: '12px', padding: '4px 0', borderBottom: '0.5px solid #ccc', textAlign: 'center' }}>
                    <div></div>
                    <div></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: '0.5em' }}>学 歴</div>
                  </div>

                  {resumeData.education.map((row, idx) => (
                    <div key={`print-edu-${idx}`} style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', fontSize: '12px', padding: '6px 0', borderBottom: '0.5px solid #ccc' }}>
                      <div style={{ textAlign: 'center' }}>{row.year}</div>
                      <div style={{ textAlign: 'center' }}>{row.month}</div>
                      <div style={{ paddingLeft: '12px' }}>{row.detail}</div>
                    </div>
                  ))}

                  {/* Work History Label */}
                  <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', fontSize: '12px', padding: '4px 0', borderBottom: '0.5px solid #ccc' }}>
                    <div></div>
                    <div></div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: '0.5em' }}>職 歴</div>
                  </div>

                  {resumeData.workHistory.map((row, idx) => (
                    <div key={`print-work-${idx}`} style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', fontSize: '12px', padding: '6px 0', borderBottom: '0.5px solid #ccc' }}>
                      <div style={{ textAlign: 'center' }}>{row.year}</div>
                      <div style={{ textAlign: 'center' }}>{row.month}</div>
                      <div style={{ paddingLeft: '12px' }}>{row.detail}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications / Licences */}
              <div style={{ marginTop: '16px', border: '1.5px solid #000' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', background: '#f8fafc', fontWeight: 'bold', fontSize: '12px', borderBottom: '1.5px solid #000', padding: '6px 0', textAlign: 'center' }}>
                  <div>年</div>
                  <div>月</div>
                  <div>免許・資格 (Licenses & Qualifications)</div>
                </div>
                {resumeData.qualifications.map((row, idx) => (
                  <div key={`print-qual-${idx}`} style={{ display: 'grid', gridTemplateColumns: '80px 50px 1fr', fontSize: '12px', padding: '6px 0', borderBottom: '0.5px solid #ccc' }}>
                    <div style={{ textAlign: 'center' }}>{row.year}</div>
                    <div style={{ textAlign: 'center' }}>{row.month}</div>
                    <div style={{ paddingLeft: '12px' }}>{row.detail}</div>
                  </div>
                ))}
              </div>

              {/* Self PR Column */}
              <div style={{ marginTop: '16px', border: '1.5px solid #000' }}>
                <div style={{ background: '#f8fafc', fontWeight: 'bold', fontSize: '12px', padding: '8px 12px', borderBottom: '1px solid #000' }}>
                  自己PR・志望動機 (Self Promotion & Motivations)
                </div>
                <div style={{ padding: '16px', fontSize: '12px', lineHeight: '1.8', minHeight: '140px', whiteSpace: 'pre-wrap' }}>
                  {resumeData.selfPR}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline placeholder for Trash icon to bypass Lucide bundle version issues
function Trash2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
  );
}
