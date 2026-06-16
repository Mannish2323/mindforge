'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle, Volume2, Award, Clock } from 'lucide-react';
import { speakText } from '@evlo/utils';

interface SmartReviewProps {
  srsData: Record<string, any>;
  onReviewCardUpdate: (vocab: any, quality: number) => void;
  onBack: () => void;
}

export function SmartReview({ srsData, onReviewCardUpdate, onBack }: SmartReviewProps) {
  const cards = Object.values(srsData).filter((c: any) => new Date(c.dueDate) <= new Date());
  
  const [sessionStarted, setSessionStarted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);
  const [sessionDone, setSessionDone] = useState(false);

  const currentCard = cards[activeIdx];

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handlePlaySound = (text: string) => {
    speakText(text, 'ja-JP');
  };

  const handleScore = (quality: number) => {
    onReviewCardUpdate(currentCard, quality);
    setReviewCount(prev => prev + 1);
    setFlipped(false);
    
    const nextIdx = activeIdx + 1;
    if (nextIdx < cards.length) {
      setActiveIdx(nextIdx);
    } else {
      setSessionDone(true);
    }
  };

  const totalQueue = Object.keys(srsData).length;
  const weakItems = Object.values(srsData).filter((c: any) => (c.errorCount || 0) > 1 || c.ease < 1.8).length;
  const mistakes = Object.values(srsData).filter((c: any) => (c.errorCount || 0) > 0).length;

  // 1. Landing Screen (Not started yet)
  if (!sessionStarted && !sessionDone) {
    return (
      <div className="smart-review-view page-transition flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)', maxWidth: '520px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
          <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>
            ← Back
          </button>
          <h2 className="text-xl font-black">🧠 Smart Review & SRS</h2>
        </div>

        <div className="card flex animate-fadein" style={{ flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <div style={{ textAlign: 'center', padding: 'var(--sp-2) 0' }}>
            <CheckCircle size={44} className="text-green" style={{ margin: '0 auto var(--sp-3)' }} />
            <h3 className="text-2xl font-black">Due Today: {cards.length}</h3>
            <p className="text-muted text-sm mt-1">Strengthen your memory with regular spaced repetition checks.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>📋 Review Queue</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--primary)' }}>{totalQueue} total items</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>⚠️ Weak Items</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--warn)' }}>{weakItems} cards</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface-2)', padding: 'var(--sp-4)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>❌ Mistakes Review</span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--error)' }}>{mistakes} items</span>
            </div>
          </div>

          <button 
            onClick={() => cards.length > 0 && setSessionStarted(true)}
            className="btn-primary"
            style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))', border: 'none', margin: 0 }}
            disabled={cards.length === 0}
          >
            {cards.length > 0 ? 'Start Review' : 'No Reviews Due'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-review-view page-transition" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Header */}
      <div className="flex" style={{ alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
        <button className="btn-ghost" style={{ padding: '6px 12px', borderRadius: 'var(--radius)' }} onClick={onBack}>
          ← Back
        </button>
        <h2 className="text-xl font-black">🧠 Smart Review & Spaced Repetition</h2>
      </div>

      {cards.length === 0 || sessionDone ? (
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-4)', alignItems: 'center', width: '100%' }}>
          <div className="card animate-fadein" style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
            <CheckCircle size={52} className="text-green" style={{ margin: '0 auto var(--sp-4)' }} />
            <h3 className="text-2xl font-black">Reviews Clear!</h3>
            <p className="text-muted text-sm mt-3 mb-5">
              {reviewCount > 0 ? `Great job! You successfully reviewed ${reviewCount} flashcards.` : 'No cards are due for spaced-repetition review right now.'}
            </p>
            <button 
              onClick={onBack}
              className="btn-primary"
              style={{ width: '100%', margin: 0 }}
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--sp-5)', alignItems: 'center', width: '100%' }}>
          {/* Progress indicators */}
          <div className="flex-between flex" style={{ width: '100%', maxWidth: '440px', fontSize: '12px' }}>
            <span className="text-muted">Reviewing card {activeIdx + 1} of {cards.length}</span>
            <span className="text-gold font-bold">Due Today: {cards.length} cards</span>
          </div>

          {/* FLIP CARD CONTAINER */}
          <div 
            onClick={handleFlip}
            className={`card card-interactive animate-fadescale`}
            style={{
              width: '100%',
              maxWidth: '440px',
              minHeight: '260px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {!flipped ? (
              <div className="animate-fadein">
                <h3 style={{ fontSize: '42px', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>
                  {currentCard.kanji}
                </h3>
                <span className="text-xs text-muted font-bold mt-4" style={{ display: 'block', letterSpacing: '.06em' }}>
                  TAP CARD TO REVEAL MEANING
                </span>
              </div>
            ) : (
              <div className="animate-fadein" onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '42px', fontWeight: 'bold', fontFamily: 'var(--font-ja)' }}>
                  {currentCard.kanji}
                </h3>
                <p className="text-xl font-black text-green mt-2 mb-2">
                  {currentCard.meaning_en}
                </p>
                <div className="flex" style={{ justifyContent: 'center', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-2)' }}>
                  <span className="text-sm text-muted">/{currentCard.romaji}/</span>
                  <button 
                    onClick={() => handlePlaySound(currentCard.kanji)}
                    className="flex-center flex"
                    style={{ border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', padding: 0 }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <p className="text-xs text-muted">
                  Meaning (Hindi): {currentCard.meaning_hi || 'N/A'}
                </p>
              </div>
            )}
          </div>

          {/* Scoring actions when card is flipped */}
          {flipped && (
            <div className="flex animate-fadein" style={{ gap: 'var(--sp-2)', width: '100%', maxWidth: '440px' }}>
              <button 
                onClick={() => handleScore(0)}
                className="btn-secondary"
                style={{ flex: 1, color: 'var(--error)', border: '1px solid var(--error)', background: 'var(--error-light)', marginTop: 0 }}
              >
                Hard (0)
              </button>
              <button 
                onClick={() => handleScore(1)}
                className="btn-secondary"
                style={{ flex: 1, color: 'var(--warn)', border: '1px solid var(--warn)', background: 'rgba(245,158,11,0.14)', marginTop: 0 }}
              >
                Ok (1)
              </button>
              <button 
                onClick={() => handleScore(2)}
                className="btn-secondary"
                style={{ flex: 1, color: 'var(--primary)', border: '1px solid var(--primary)', background: 'var(--primary-light)', marginTop: 0 }}
              >
                Easy (2)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
