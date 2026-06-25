'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Volume2, Pencil, BookOpen, ChevronRight } from 'lucide-react';

interface Kanji {
  id: string; char: string; meaning: string; onyomi: string; kunyomi: string;
  strokes: number; jlpt: string; examples: { word: string; reading: string; meaning: string }[];
  learned?: boolean;
}

const KANJI_DATA: Kanji[] = [
  { id:'k1', char:'日', meaning:'sun, day', onyomi:'ニチ、ジツ', kunyomi:'ひ、か', strokes:4, jlpt:'N5', examples:[{word:'日本',reading:'にほん',meaning:'Japan'},{word:'毎日',reading:'まいにち',meaning:'every day'}] },
  { id:'k2', char:'月', meaning:'moon, month', onyomi:'ゲツ、ガツ', kunyomi:'つき', strokes:4, jlpt:'N5', examples:[{word:'月曜日',reading:'げつようび',meaning:'Monday'},{word:'今月',reading:'こんげつ',meaning:'this month'}] },
  { id:'k3', char:'火', meaning:'fire', onyomi:'カ', kunyomi:'ひ', strokes:4, jlpt:'N5', examples:[{word:'火曜日',reading:'かようび',meaning:'Tuesday'},{word:'花火',reading:'はなび',meaning:'fireworks'}] },
  { id:'k4', char:'水', meaning:'water', onyomi:'スイ', kunyomi:'みず', strokes:4, jlpt:'N5', examples:[{word:'水曜日',reading:'すいようび',meaning:'Wednesday'},{word:'水道',reading:'すいどう',meaning:'waterworks'}] },
  { id:'k5', char:'木', meaning:'tree, wood', onyomi:'モク、ボク', kunyomi:'き、こ', strokes:4, jlpt:'N5', examples:[{word:'木曜日',reading:'もくようび',meaning:'Thursday'},{word:'木材',reading:'もくざい',meaning:'lumber'}] },
  { id:'k6', char:'金', meaning:'gold, money', onyomi:'キン、コン', kunyomi:'かね、かな', strokes:8, jlpt:'N5', examples:[{word:'金曜日',reading:'きんようび',meaning:'Friday'},{word:'お金',reading:'おかね',meaning:'money'}] },
  { id:'k7', char:'土', meaning:'earth, soil', onyomi:'ド、ト', kunyomi:'つち', strokes:3, jlpt:'N5', examples:[{word:'土曜日',reading:'どようび',meaning:'Saturday'},{word:'土地',reading:'とち',meaning:'land'}] },
  { id:'k8', char:'山', meaning:'mountain', onyomi:'サン', kunyomi:'やま', strokes:3, jlpt:'N5', examples:[{word:'富士山',reading:'ふじさん',meaning:'Mt. Fuji'},{word:'山道',reading:'やまみち',meaning:'mountain path'}] },
  { id:'k9', char:'川', meaning:'river', onyomi:'セン', kunyomi:'かわ', strokes:3, jlpt:'N5', examples:[{word:'川辺',reading:'かわべ',meaning:'riverside'},{word:'小川',reading:'おがわ',meaning:'brook'}] },
  { id:'k10', char:'学', meaning:'study, learn', onyomi:'ガク', kunyomi:'まな', strokes:8, jlpt:'N5', examples:[{word:'学校',reading:'がっこう',meaning:'school'},{word:'学生',reading:'がくせい',meaning:'student'}] },
  { id:'k11', char:'生', meaning:'life, birth', onyomi:'セイ、ショウ', kunyomi:'い、う', strokes:5, jlpt:'N5', examples:[{word:'先生',reading:'せんせい',meaning:'teacher'},{word:'学生',reading:'がくせい',meaning:'student'}] },
  { id:'k12', char:'本', meaning:'book, origin', onyomi:'ホン', kunyomi:'もと', strokes:5, jlpt:'N5', examples:[{word:'日本',reading:'にほん',meaning:'Japan'},{word:'本屋',reading:'ほんや',meaning:'bookstore'}] },
];

function StrokeOrderSVG({ char }: { char: string }) {
  return (
    <div className="w-28 h-28 rounded-2xl flex items-center justify-center"
      style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
      <span className="font-jp font-black"
        style={{ fontSize: 64, background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {char}
      </span>
    </div>
  );
}

export default function KanjiPage() {
  const router = useRouter();
  const [jlptFilter, setJlptFilter] = useState('N5');
  const [selected, setSelected] = useState<Kanji | null>(null);

  const filtered = KANJI_DATA.filter(k => jlptFilter === 'all' || k.jlpt === jlptFilter);

  const playAudio = (char: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(char); u.lang = 'ja-JP'; u.rate = 0.8;
      speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <Tabs tabs={[{id:'all',label:'All'},{id:'N5',label:'N5'},{id:'N4',label:'N4'},{id:'N3',label:'N3'},{id:'N2',label:'N2'},{id:'N1',label:'N1'}]}
          activeTab={jlptFilter} onChange={setJlptFilter} variant="pill" />
        <Button variant="primary" size="sm" onClick={() => router.push('/writing')}>
          <Pencil className="w-3.5 h-3.5" /> Practice Writing
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Kanji grid */}
        <div className="lg:col-span-2">
          <Card padding="sm">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 p-2">
              {filtered.map(k => (
                <button key={k.id} onClick={() => setSelected(k)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105"
                  style={selected?.id === k.id ? {
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.2))',
                    border: '2px solid rgba(124,58,237,0.5)',
                  } : {
                    background: 'rgba(139,92,246,0.08)',
                    border: '1px solid rgba(139,92,246,0.15)',
                  }}>
                  <span className="font-jp font-black text-xl text-white leading-none">{k.char}</span>
                  <span className="text-[8px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{k.strokes}画</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <Card padding="md" className="space-y-4 animate-scale-in">
              <div className="flex items-start gap-4">
                <StrokeOrderSVG char={selected.char} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <JLPTBadge level={selected.jlpt} />
                    <span className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{selected.strokes} strokes</span>
                  </div>
                  <div className="text-sm font-black text-white">{selected.meaning}</div>
                  <div className="text-[10px] mt-2" style={{ color: 'rgba(167,139,250,0.7)' }}>
                    <div>ON: {selected.onyomi}</div>
                    <div>KUN: {selected.kunyomi}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => playAudio(selected.char)}>
                  <Volume2 className="w-3.5 h-3.5" /> Audio
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={() => router.push('/writing')}>
                  <Pencil className="w-3.5 h-3.5" /> Write
                </Button>
              </div>

              {/* Examples */}
              <div>
                <div className="section-title mb-2">Example Words</div>
                <div className="space-y-2">
                  {selected.examples.map((ex, i) => (
                    <div key={i} className="p-2.5 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)' }}>
                      <div className="flex items-center gap-2">
                        <span className="font-jp font-black text-white text-sm">{ex.word}</span>
                        <span className="text-xs" style={{ color: 'rgba(167,139,250,0.6)' }}>{ex.reading}</span>
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{ex.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="ghost" size="sm" className="w-full" onClick={() => router.push('/vocabulary')}>
                <BookOpen className="w-3.5 h-3.5" /> View in Vocabulary
              </Button>
            </Card>
          ) : (
            <Card padding="lg" className="flex flex-col items-center justify-center text-center min-h-60">
              <div className="text-4xl mb-3 font-jp">漢字</div>
              <div className="text-sm font-bold text-white mb-1">Select a Kanji</div>
              <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Click any character to see details, readings, and example words</div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
