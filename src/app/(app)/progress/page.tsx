'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import { TrendingUp, Flame, Zap, BookOpen, Mic, Pencil, Headphones, FileText, Award, Target } from 'lucide-react';

const MODULES = [
  { label: 'Vocabulary', icon: BookOpen, color: '#3b82f6', key: 'words_learned', max: 2000 },
  { label: 'Kanji',      icon: Pencil,   color: '#8b5cf6', key: 'kanji_learned', max: 2136 },
  { label: 'Grammar',    icon: FileText, color: '#ec4899', key: 'lessons_done',  max: 100 },
  { label: 'Speaking',   icon: Mic,      color: '#22c55e', key: 'speak_sessions',max: 50 },
  { label: 'Listening',  icon: Headphones,color:'#f59e0b', key: 'reviews_done', max: 200 },
];

function HeatmapCell({ level }: { level: number }) {
  const colors = ['rgba(139,92,246,0.06)', 'rgba(139,92,246,0.2)', 'rgba(139,92,246,0.4)', 'rgba(139,92,246,0.65)', 'rgba(139,92,246,0.9)'];
  return <div className="w-3 h-3 rounded-sm" style={{ background: colors[Math.min(level, 4)] }} />;
}

function generateHeatmap() {
  const weeks = 26; const days = 7;
  return Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: days }, (_, d) => {
      const date = new Date(); date.setDate(date.getDate() - (weeks - w - 1) * 7 - (days - d - 1));
      if (date > new Date()) return -1;
      return Math.random() > 0.4 ? Math.floor(Math.random() * 5) : 0;
    })
  );
}

const HEATMAP = generateHeatmap();
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ProgressPage() {
  const { profile } = useAuth();
  const { state } = useStore();
  const [tab, setTab] = useState('overview');

  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak || 0;
  const completedLessons = Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;
  const xpInLevel = xp % (level * 1000);
  const xpForLevel = level * 1000;

  return (
    <div className="space-y-5 animate-fade-up">
      <Tabs tabs={[{id:'overview',label:'Overview'},{id:'skills',label:'Skills'},{id:'calendar',label:'Calendar'},{id:'achievements',label:'Achievements'}]}
        activeTab={tab} onChange={setTab} variant="underline" />

      {tab === 'overview' && (
        <div className="space-y-5">
          {/* Level + XP card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="lg" className="flex flex-col items-center justify-center gap-4 md:col-span-1">
              <CircularProgress value={xpInLevel} max={xpForLevel} size={120} strokeWidth={10} color="#7c3aed">
                <div className="text-center">
                  <div className="text-2xl font-black text-white">{level}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(160,150,220,0.5)' }}>LEVEL</div>
                </div>
              </CircularProgress>
              <div className="text-center w-full">
                <div className="text-xs font-bold text-white mb-1">{xp.toLocaleString()} / {(level * xpForLevel).toLocaleString()} XP</div>
                <ProgressBar value={xpInLevel} max={xpForLevel} size="sm" />
              </div>
            </Card>

            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              {[
                { icon: Flame,    color:'#f97316', label:'Day Streak',    val: streak,          sub:'Current streak' },
                { icon: Zap,      color:'#f59e0b', label:'Total XP',      val: xp.toLocaleString(), sub:'All time' },
                { icon: BookOpen, color:'#3b82f6', label:'Lessons Done',  val: completedLessons, sub:'Completed' },
                { icon: Target,   color:'#22c55e', label:'Goal Progress', val: `${profile?.goal_minutes||10}min`, sub:'Daily goal' },
              ].map(s => (
                <Card key={s.label} padding="md">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background:`${s.color}22` }}>
                    <s.icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="text-xl font-black text-white">{s.val}</div>
                  <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{s.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Skills breakdown */}
          <Card padding="md">
            <div className="section-title mb-4">Skills Breakdown</div>
            <div className="space-y-4">
              {MODULES.map(m => {
                const val = (profile as any)?.[m.key] || 0;
                const pct = Math.min((val / m.max) * 100, 100);
                return (
                  <div key={m.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:`${m.color}22` }}>
                      <m.icon className="w-4 h-4" style={{ color: m.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-white">{m.label}</span>
                        <span style={{ color: 'rgba(160,150,220,0.5)' }}>{val} / {m.max}</span>
                      </div>
                      <ProgressBar value={pct} size="sm" color="brand" />
                    </div>
                    <div className="text-sm font-black flex-shrink-0" style={{ color: m.color }}>{Math.round(pct)}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {tab === 'calendar' && (
        <Card padding="md">
          <div className="section-title mb-4">Study Calendar — Last 6 Months</div>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {HEATMAP.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    day < 0 ? <div key={di} className="w-3 h-3" /> : <HeatmapCell key={di} level={day} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>
            <span>Less</span>
            {[0,1,2,3,4].map(l => <HeatmapCell key={l} level={l} />)}
            <span>More</span>
          </div>
        </Card>
      )}

      {tab === 'skills' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MODULES.map(m => {
            const val = (profile as any)?.[m.key] || 0;
            const pct = Math.min((val / m.max) * 100, 100);
            return (
              <Card key={m.label} padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:`${m.color}22` }}>
                    <m.icon className="w-5 h-5" style={{ color: m.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">{m.label}</div>
                    <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>{val} / {m.max}</div>
                  </div>
                  <div className="ml-auto text-xl font-black" style={{ color: m.color }}>{Math.round(pct)}%</div>
                </div>
                <ProgressBar value={pct} size="md" color="brand" />
              </Card>
            );
          })}
        </div>
      )}

      {tab === 'achievements' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(state?.badges || []).map((b: any) => (
            <Card key={b.badge_id} padding="md" className={`flex flex-col items-center text-center ${!b.unlockedAt ? 'opacity-40' : ''}`}>
              <div className="text-3xl mb-2">{b.icon}</div>
              <div className="text-xs font-black text-white mb-0.5">{b.title}</div>
              <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{b.description}</div>
              {b.unlockedAt && <div className="text-[9px] mt-2 text-green-400">✓ Unlocked</div>}
            </Card>
          ))}
          {(!state?.badges || state.badges.length === 0) && (
            <div className="col-span-full">
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-sm font-bold text-white">No achievements yet</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(160,150,220,0.5)' }}>Complete lessons to unlock badges!</div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
