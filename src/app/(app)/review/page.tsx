'use client';
import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
// handleSRSCardUpdate(cardId, quality: 1-5) is the correct SRS function

export default function ReviewPage() {
  const { state, handleSRSCardUpdate } = useStore();
  const [flipped, setFlipped] = useState(false);

  const dueCards = Object.values(state?.srsData || {}).filter((c: any) => {
    if (!c.dueDate) return true;
    return new Date(c.dueDate) <= new Date();
  });

  const card = dueCards[0] as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-white">Smart Review</h1>
        <span className="bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {dueCards.length} due
        </span>
      </div>

      {dueCards.length === 0 ? (
        <div className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-14 h-14 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">All caught up! 🎉</h2>
          <p className="text-purple-300/50 text-sm">
            No cards due. Come back later or learn new words first.
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          {/* Card */}
          <div
            className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-10 text-center cursor-pointer hover:border-purple-600/50 transition-all min-h-[260px] flex flex-col items-center justify-center"
            onClick={() => setFlipped(!flipped)}
          >
            {!flipped ? (
              <>
                <div className="text-7xl mb-4 font-jp">{card?.kanji || card?.vocab_id}</div>
                <div className="text-purple-300/40 text-sm">Tap to reveal meaning</div>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 font-jp">{card?.kanji}</div>
                <div className="text-purple-300/70 text-base mb-1">{card?.romaji}</div>
                <div className="text-xl font-bold text-white">{card?.meaning_en}</div>
                {card?.meaning_hi && (
                  <div className="text-sm text-purple-300/50 mt-1">{card?.meaning_hi}</div>
                )}
              </>
            )}
          </div>

          {/* Rating buttons */}
          {flipped && (
            <div className="flex gap-3 mt-4">
              {[
                { label: 'Again', quality: 1, cls: 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30' },
                { label: 'Hard',  quality: 2, cls: 'bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30' },
                { label: 'Good',  quality: 4, cls: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30' },
                { label: 'Easy',  quality: 5, cls: 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30' },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={() => {
                    handleSRSCardUpdate(card.cardId || card.vocab_id, btn.quality);
                    setFlipped(false);
                  }}
                  className={`flex-1 py-3 border rounded-xl font-semibold text-sm transition-all ${btn.cls}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 text-purple-300/30 text-xs justify-center">
            <RotateCcw className="w-3 h-3" />
            {dueCards.length} cards remaining
          </div>
        </div>
      )}
    </div>
  );
}
