'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useStore } from '@/hooks/useStore';
import { Card } from '@/components/ui/Card';
import { Tabs } from '@/components/ui/Tabs';
import { Skeleton, ListSkeleton } from '@/components/ui/Skeleton';
import { Trophy, Medal, Crown, Flame, Zap } from 'lucide-react';

interface LeaderEntry { rank: number; name: string; avatar: string; xp: number; streak: number; country: string; isYou?: boolean; }

const MOCK_GLOBAL: LeaderEntry[] = [
  { rank: 1, name: 'SakuraSensei', avatar: '🌸', xp: 45200, streak: 98,  country: '🇯🇵' },
  { rank: 2, name: 'Nihongo Master', avatar: '⛩️', xp: 41800, streak: 72, country: '🇺🇸' },
  { rank: 3, name: 'KaizenLearner', avatar: '🎌', xp: 38500, streak: 55, country: '🇬🇧' },
  { rank: 4, name: 'TanukiSan', avatar: '🦝', xp: 32100, streak: 41, country: '🇰🇷' },
  { rank: 5, name: 'FujiClimber', avatar: '🗻', xp: 28900, streak: 30, country: '🇮🇳' },
];

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm font-black" style={{ color: 'rgba(160,150,220,0.5)' }}>#{rank}</span>;
}

function LeaderRow({ entry }: { entry: LeaderEntry }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${entry.isYou ? 'ring-1 ring-purple-500' : 'hover:bg-[rgba(139,92,246,0.06)]'}`}
      style={entry.isYou ? { background: 'rgba(124,58,237,0.12)' } : {}}>
      <div className="w-7 flex items-center justify-center flex-shrink-0"><RankIcon rank={entry.rank} /></div>
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
        {entry.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-white truncate">{entry.name}</span>
          {entry.isYou && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">YOU</span>}
          <span className="text-sm flex-shrink-0">{entry.country}</span>
        </div>
        <div className="flex items-center gap-3 text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>
          <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{entry.streak}d</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" />{entry.xp.toLocaleString()} XP</span>
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const { profile } = useAuth();
  const { state } = useAuth() as any;
  const [tab, setTab] = useState('global');
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const me: LeaderEntry = {
        rank: 23, name: profile?.name || 'You', avatar: '🦊',
        xp: profile?.xp || 0, streak: profile?.streak || 0, country: '🌏', isYou: true,
      };
      const list = [...MOCK_GLOBAL];
      // Insert "You" at the correct position
      const yourRank = list.findIndex(e => (profile?.xp || 0) > e.xp);
      if (yourRank >= 0) { list.splice(yourRank, 0, { ...me, rank: yourRank + 1 }); }
      else { list.push({ ...me, rank: list.length + 1 }); }
      setEntries(list);
      setLoading(false);
    }, 700);
  }, [tab, profile]);

  return (
    <div className="space-y-5 animate-fade-up max-w-2xl mx-auto">
      <Tabs
        tabs={[{id:'global',label:'Global'},{id:'weekly',label:'Weekly'},{id:'friends',label:'Friends'},{id:'country',label:'Country'}]}
        activeTab={tab} onChange={setTab} variant="segment" />

      {/* Top 3 podium */}
      {!loading && entries.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-4">
          {/* 2nd */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">{entries[1]?.avatar}</div>
            <div className="text-xs font-bold text-white">{entries[1]?.name}</div>
            <div className="w-20 h-20 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, rgba(156,163,175,0.2), rgba(156,163,175,0.1))', border: '1px solid rgba(156,163,175,0.3)' }}>
              <Medal className="w-8 h-8 text-gray-300" />
            </div>
            <div className="text-xs text-gray-300 font-black">{entries[1]?.xp.toLocaleString()} XP</div>
          </div>
          {/* 1st */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">{entries[0]?.avatar}</div>
            <div className="text-xs font-bold text-white">{entries[0]?.name}</div>
            <div className="w-24 h-28 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, rgba(250,204,21,0.2), rgba(234,179,8,0.1))', border: '1px solid rgba(250,204,21,0.4)' }}>
              <Crown className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="text-xs text-yellow-400 font-black">{entries[0]?.xp.toLocaleString()} XP</div>
          </div>
          {/* 3rd */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl">{entries[2]?.avatar}</div>
            <div className="text-xs font-bold text-white">{entries[2]?.name}</div>
            <div className="w-20 h-16 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(180deg, rgba(180,83,9,0.2), rgba(180,83,9,0.1))', border: '1px solid rgba(180,83,9,0.3)' }}>
              <Medal className="w-7 h-7 text-amber-600" />
            </div>
            <div className="text-xs text-amber-600 font-black">{entries[2]?.xp.toLocaleString()} XP</div>
          </div>
        </div>
      )}

      {/* Full list */}
      <Card padding="sm">
        {loading ? <ListSkeleton rows={10} /> : (
          <div className="space-y-1 p-2">
            {entries.map((e, i) => <LeaderRow key={i} entry={e} />)}
          </div>
        )}
      </Card>
    </div>
  );
}
