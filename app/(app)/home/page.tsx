'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { ProgressBar, CircularProgress } from '@/components/ui/ProgressBar';
import { Card, CardHeader } from '@/components/ui/Card';
import { JLPTBadge } from '@/components/shared/JLPTBadge';
import {
  ArrowRight, CheckCircle2, Lock, Flame, Zap, BookOpen,
  Mic, RotateCcw, Brain, ChevronRight, Target, Clock,
  TrendingUp, Star, Sparkles, Volume2, Pencil
} from 'lucide-react';

/* ─── constants ─────────────────────────────── */
const QUOTES = [
  { jp: '「七転び八起き」', en: '"Fall seven times, rise eight."' },
  { jp: '「石の上にも三年」', en: '"Three years on a stone." (Patience pays off)' },
  { jp: '「塵も積もれば山となる」', en: '"Even dust piles up to form a mountain."' },
  { jp: '「継続は力なり」', en: '"Continuity is power."' },
  { jp: '「急がば回れ」', en: '"More haste, less speed."' },
];

const JLPT_LEVELS = [
  { level: 'N5', words: 800,    color: '#22c55e', minXP: 0 },
  { level: 'N4', words: 1500,   color: '#3b82f6', minXP: 2000 },
  { level: 'N3', words: 3500,   color: '#8b5cf6', minXP: 5000 },
  { level: 'N2', words: 6000,   color: '#ec4899', minXP: 10000 },
  { level: 'N1', words: 10000,  color: '#f59e0b', minXP: 20000 },
];

const PLAN_ITEMS = [
  { icon: '📚', label: '15 New Vocabulary', done: 0, total: 15, href: '/vocabulary' },
  { icon: '⛩️', label: '10 Kanji Practice', done: 0, total: 10, href: '/kanji' },
  { icon: '📖', label: '5 Grammar Points',  done: 0, total: 5,  href: '/grammar' },
  { icon: '🎤', label: 'Speaking Practice', done: 0, total: 1,  href: '/speaking' },
];

const WEAK_AREAS = [
  { topic: 'て-form verbs', level: 'N4', pct: 38 },
  { topic: 'Keigo (敬語)', level: 'N3', pct: 22 },
  { topic: 'Counters', level: 'N5', pct: 51 },
];

const QUICK_ACTIONS = [
  { icon: RotateCcw, label: 'Review',    href: '/review',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
  { icon: Mic,       label: 'Speak',     href: '/speaking',  color: '#ec4899', bg: 'rgba(236,72,153,0.15)' },
  { icon: Brain,     label: 'AI Tutor',  href: '/ai-tutor',  color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  { icon: BookOpen,  label: 'Vocab',     href: '/vocabulary',color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { icon: Pencil,    label: 'Writing',   href: '/writing',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { icon: Volume2,   label: 'Listen',    href: '/listening', color: '#06b6d4', bg: 'rgba(6,182,212,0.15)' },
];

/* ─── tiny helper ───────────────────────────── */
function SectionTitle({ children, action, href }: { children: React.ReactNode; action?: string; href?: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="section-title">{children}</h2>
      {action && href && (
        <button onClick={() => router.push(href)} className="flex items-center gap-1 text-[11px] font-bold transition-colors hover:text-white"
          style={{ color: 'rgba(167,139,250,0.6)' }}>
          {action} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ─── PAGE ──────────────────────────────────── */
export default function HomePage() {
  const { profile } = useAuth();
  const { state } = useStore();
  const router = useRouter();

  const xp = profile?.xp || 0;
  const level = profile?.level || 1;
  const streak = profile?.streak || 0;
  const words = profile?.words_learned || 0;
  const kanji = profile?.kanji_learned || 0;
  const goalMin = profile?.goal_minutes || 10;
  const studiedMin = state?.dailyXPEarned ? Math.round(state.dailyXPEarned / 2) : 0;
  const goalPct = Math.min((studiedMin / goalMin) * 100, 100);
  const completedLessons = Object.values(state?.lessonProgress || {}).filter((l: any) => l.completed).length;
  const dueCards = Object.values(state?.srsData || {}).filter((c: any) => !c.dueDate || new Date(c.dueDate) <= new Date()).length;
  const todayQuote = QUOTES[new Date().getDay() % QUOTES.length];
  const isPremium = profile?.isPremium;

  return (
    <div className="space-y-5 animate-fade-up">

      {/* ── HERO ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Hero Card */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl cursor-pointer group h-52"
          onClick={() => router.push('/path')}
          style={{ border: '1px solid rgba(139,92,246,0.25)' }}>
          <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80"
            alt="Tokyo" className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-55 transition-opacity duration-500" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(9,7,26,0.97) 35%, rgba(9,7,26,0.3) 100%)' }} />
          {/* Torii */}
          <div className="absolute right-12 top-0 bottom-0 flex items-center opacity-25 pointer-events-none">
            <svg width="70" height="160" viewBox="0 0 70 160"><rect x="8" y="25" width="7" height="135" fill="#f472b6"/><rect x="55" y="25" width="7" height="135" fill="#f472b6"/><rect x="0" y="20" width="70" height="9" rx="4" fill="#f472b6"/><rect x="-4" y="10" width="78" height="7" rx="3" fill="#f472b6"/></svg>
          </div>
          <div className="relative z-10 p-6 h-full flex flex-col justify-between">
            <div>
              <div className="font-jp font-black text-white text-xl leading-snug">「毎日少しずつ、</div>
              <div className="font-jp font-black text-white text-xl leading-snug">大きな成果に。」</div>
              <div className="text-xs italic mt-2" style={{ color: 'rgba(200,196,255,0.6)' }}>"Little by little, one goes a long way."</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(167,139,250,0.4)' }}>— Japanese Proverb</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-black text-orange-400">{streak} day streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(219,39,119,0.4))', border: '1px solid rgba(124,58,237,0.4)' }}>
                Continue Learning <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Goal Ring */}
        <Card className="flex flex-col items-center justify-center p-5 gap-4">
          <SectionTitle>Daily Goal</SectionTitle>
          <CircularProgress value={studiedMin} max={goalMin} size={100} strokeWidth={8} color="#7c3aed">
            <div className="text-center">
              <div className="text-xl font-black text-white">{studiedMin}</div>
              <div className="text-[9px]" style={{ color: 'rgba(160,150,220,0.5)' }}>/ {goalMin} min</div>
            </div>
          </CircularProgress>
          <div className="w-full text-center">
            <div className="text-xs font-bold text-white mb-1">
              {goalPct >= 100 ? '🎉 Goal reached!' : `${Math.round(goalPct)}% of daily goal`}
            </div>
            <ProgressBar value={goalPct} size="sm" color={goalPct >= 100 ? 'success' : 'brand'} />
          </div>
        </Card>
      </div>

      {/* ── STATS ROW ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 stagger-children">
        {[
          { icon: Zap,       color: '#f59e0b', label: 'Total XP',          val: xp.toLocaleString(),        sub: `Level ${level}`,         badge: '' },
          { icon: Flame,     color: '#f97316', label: 'Day Streak',        val: `${streak}`,                sub: 'Keep it up! 🔥',         badge: '' },
          { icon: BookOpen,  color: '#3b82f6', label: 'Lessons Done',      val: completedLessons,           sub: 'Total completed',        badge: dueCards > 0 ? `${dueCards} due` : '' },
          { icon: Target,    color: '#ec4899', label: 'Words Learned',     val: words.toLocaleString(),     sub: 'Vocabulary',             badge: '' },
          { icon: Star,      color: '#22c55e', label: 'Kanji Mastered',    val: kanji.toLocaleString(),     sub: `N5 + ${profile?.jlpt_target || 'N5'}`, badge: '' },
        ].map(s => (
          <Card key={s.label} hover className="p-4 animate-fade-up">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${s.color}22` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-[10px] mb-1" style={{ color: 'rgba(160,150,220,0.5)' }}>{s.label}</div>
            <div className="text-xl font-black text-white">{s.val}</div>
            <div className="flex items-center justify-between mt-1 gap-1">
              <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.4)' }}>{s.sub}</div>
              {s.badge && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full text-green-400" style={{ background: 'rgba(34,197,94,0.12)' }}>{s.badge}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT + CENTER 2/3 */}
        <div className="lg:col-span-2 space-y-5">

          {/* Quick Actions */}
          <Card padding="md">
            <SectionTitle>Quick Actions</SectionTitle>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {QUICK_ACTIONS.map(a => (
                <button key={a.label} onClick={() => router.push(a.href)}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all hover:scale-105 group"
                  style={{ background: a.bg, border: `1px solid ${a.color}22` }}>
                  <a.icon className="w-5 h-5" style={{ color: a.color }} />
                  <span className="text-[10px] font-bold text-white">{a.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* JLPT Roadmap */}
          <Card padding="md">
            <SectionTitle action="Full Roadmap" href="/jlpt">JLPT Roadmap</SectionTitle>
            <div className="flex items-center justify-between">
              {JLPT_LEVELS.map((lvl, i) => {
                const done = xp >= lvl.minXP;
                const current = profile?.jlpt_target === lvl.level;
                const locked = !done && !current;
                return (
                  <div key={lvl.level} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-13 h-13 rounded-full flex items-center justify-center font-black text-sm transition-all"
                        style={locked ? {
                          width: 48, height: 48, background: 'rgba(139,92,246,0.06)', border: '2px solid rgba(139,92,246,0.12)', color: 'rgba(139,92,246,0.3)',
                        } : {
                          width: 48, height: 48, background: `linear-gradient(135deg, ${lvl.color}33, ${lvl.color}11)`,
                          border: `2px solid ${lvl.color}`,  color: lvl.color,
                          boxShadow: current ? `0 0 20px ${lvl.color}44` : undefined,
                          transform: current ? 'scale(1.12)' : undefined,
                        }}>
                        {locked ? <Lock className="w-4 h-4" style={{ color: 'rgba(139,92,246,0.3)' }} />
                          : done && !current ? <CheckCircle2 className="w-5 h-5" style={{ color: lvl.color }} />
                          : lvl.level}
                      </div>
                      <div className="text-[10px] font-bold mt-1.5 text-white/70">{lvl.level}</div>
                      <div className="text-[9px]" style={{ color: 'rgba(160,150,220,0.4)' }}>{(lvl.words/1000).toFixed(1)}K words</div>
                    </div>
                    {i < JLPT_LEVELS.length - 1 && (
                      <div className="h-0.5 w-6 flex-shrink-0"
                        style={{ background: JLPT_LEVELS[i+1] && xp >= JLPT_LEVELS[i+1].minXP ? 'linear-gradient(90deg,#22c55e,#3b82f6)' : 'rgba(139,92,246,0.12)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Bottom panels: Grammar + Speaking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title">Grammar</span>
                <JLPTBadge level="N5" />
              </div>
              <div className="text-xs mb-1" style={{ color: 'rgba(160,150,220,0.6)' }}>〜たい　<span style={{ color: 'rgba(160,150,220,0.4)' }}>(verb) to want</span></div>
              <div className="text-lg font-jp font-black text-white mb-1">私は日本へ行きたいです。</div>
              <div className="text-xs italic mb-1" style={{ color: 'rgba(160,150,220,0.55)' }}>Watashi wa Nihon e ikitai desu.</div>
              <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.4)' }}>I want to go to Japan.</div>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm flex-1" onClick={() => router.push('/grammar')}>Examples</button>
                <button className="btn btn-primary btn-sm flex-1" onClick={() => router.push('/grammar')}>Practice →</button>
              </div>
            </Card>

            <Card padding="md">
              <div className="flex items-center justify-between mb-3">
                <span className="section-title">Speaking Practice</span>
                <span className="flex items-center gap-1 text-[10px] font-bold" style={{ color: 'rgba(167,139,250,0.7)' }}>
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-end">
                  <div className="px-3 py-2 rounded-xl rounded-tr-sm text-xs text-white max-w-[80%]"
                    style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.3)' }}>
                    こんにちは！元気ですか？
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl rounded-tl-sm text-xs text-white max-w-[80%]"
                    style={{ background: 'rgba(30,20,50,0.8)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    はい、元気です！😊
                  </div>
                </div>
              </div>
              <button onClick={() => router.push('/speaking')} className="btn btn-accent btn-sm w-full">
                🎤 Start Speaking
              </button>
            </Card>
          </div>

          {/* Weak Areas */}
          <Card padding="md">
            <SectionTitle action="View All" href="/progress">Weak Areas</SectionTitle>
            <div className="space-y-3">
              {WEAK_AREAS.map(w => (
                <div key={w.topic} className="flex items-center gap-3">
                  <JLPTBadge level={w.level} size="xs" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white font-medium">{w.topic}</span>
                      <span style={{ color: 'rgba(160,150,220,0.5)' }}>{w.pct}%</span>
                    </div>
                    <ProgressBar value={w.pct} color={w.pct < 40 ? 'error' : 'warning'} size="xs" />
                  </div>
                  <button onClick={() => router.push('/review')} className="btn btn-ghost btn-sm !py-1 !px-2 text-[10px]">
                    Fix
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* RIGHT 1/3 */}
        <div className="space-y-4">

          {/* Continue Learning */}
          <Card padding="md">
            <SectionTitle action="All Lessons" href="/path">Continue Learning</SectionTitle>
            <div className="space-y-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.18)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold text-white">N5 Vocabulary – Unit 12</div>
                    <div className="text-[10px] mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>Food & Drinks</div>
                  </div>
                  <JLPTBadge level="N5" size="xs" />
                </div>
                <ProgressBar value={68} size="xs" />
                <div className="flex justify-between text-[9px] mt-1" style={{ color: 'rgba(160,150,220,0.4)' }}>
                  <span>68% complete</span><span>🍱 食べ物</span>
                </div>
              </div>
              <button onClick={() => router.push('/path')} className="btn btn-primary w-full">
                Continue →
              </button>
            </div>
          </Card>

          {/* Today's Plan */}
          <Card padding="md">
            <SectionTitle>Today&apos;s Plan</SectionTitle>
            <div className="space-y-3">
              {PLAN_ITEMS.map(item => {
                const pct = (item.done / item.total) * 100;
                const done = item.done >= item.total;
                return (
                  <button key={item.label} onClick={() => router.push(item.href)}
                    className="w-full flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                    <span className="text-base flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium" style={{ color: done ? '#4ade80' : 'rgba(200,196,255,0.8)' }}>{item.label}</span>
                        <span style={{ color: 'rgba(160,150,220,0.4)' }}>{item.done}/{item.total}</span>
                      </div>
                      <ProgressBar value={pct} size="xs" color={done ? 'success' : 'brand'} />
                    </div>
                    {done && <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* AI Tutor */}
          <Card padding="md" style={{ border: '1px solid rgba(219,39,119,0.2)' }}>
            <div className="absolute inset-0 rounded-2xl opacity-5 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, #db2777, transparent)' }} />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))', border: '1px solid rgba(219,39,119,0.25)' }}>
                🧝‍♀️
              </div>
              <div>
                <div className="text-xs font-black text-white">AI Tutor Velmorth</div>
                <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>Powered by Gemini</div>
              </div>
            </div>
            <div className="px-3 py-2 rounded-xl text-xs mb-3" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.18)' }}>
              <span style={{ color: 'rgba(200,196,255,0.7)' }}>こんにちは！今日は何を練習しますか？</span>
            </div>
            <button onClick={() => router.push('/ai-tutor')} className="btn btn-accent w-full">
              <Sparkles className="w-3.5 h-3.5" /> Start AI Session
            </button>
          </Card>

          {/* Writing Preview */}
          <Card padding="md">
            <SectionTitle action="Practice" href="/writing">Writing Practice</SectionTitle>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center text-4xl font-jp font-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(219,39,119,0.1))', border: '1px solid rgba(139,92,246,0.2)' }}>
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>学</span>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'rgba(160,150,220,0.6)' }}>gaku / mana.bu</div>
                <div className="text-xs text-white font-medium mb-2">study, learn</div>
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>
              </div>
            </div>
            <div className="mt-3 flex justify-between text-xs">
              <span style={{ color: 'rgba(160,150,220,0.5)' }}>Accuracy</span>
              <span className="text-white font-black">98%</span>
            </div>
            <ProgressBar value={98} size="xs" color="success" className="mt-1" />
          </Card>

          {/* Daily Quote */}
          <Card padding="md" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)' }}>
            <div className="section-title mb-2">Daily Quote</div>
            <div className="font-jp text-sm font-black text-white mb-1">{todayQuote.jp}</div>
            <div className="text-xs italic" style={{ color: 'rgba(200,196,255,0.6)' }}>{todayQuote.en}</div>
          </Card>

          {/* Subscription banner */}
          {!isPremium && (
            <div className="rounded-2xl p-4 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => router.push('/billing')}
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(219,39,119,0.2))', border: '1px solid rgba(219,39,119,0.3)' }}>
              <div className="text-xs font-black text-white mb-1">🌟 Upgrade to Pro</div>
              <div className="text-[10px] mb-3" style={{ color: 'rgba(200,196,255,0.7)' }}>Unlock N1, unlimited AI, offline & more</div>
              <div className="btn btn-accent btn-sm w-full">View Plans</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
