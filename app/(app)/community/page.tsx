'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { Heart, MessageCircle, Share2, Plus, Users, Trophy } from 'lucide-react';

const MOCK_POSTS = [
  { id: 'p1', author: 'SakuraSensei', avatar: '🌸', time: '2h ago', content: 'Finally passed my JLPT N3! 🎌 It took me 8 months of daily practice. The key was consistency and using Velmorth every single day. ありがとう everyone for the support!', likes: 47, comments: 12, liked: false },
  { id: 'p2', author: 'KaizenLearner', avatar: '⛩️', time: '4h ago', content: 'Quick tip: When learning kanji, try to associate each character with a story or image. For example, 山 (mountain) literally looks like three mountain peaks! 🗻 Works great for memory.', likes: 31, comments: 8, liked: true },
  { id: 'p3', author: 'TokyoDreamer', avatar: '🌙', time: '6h ago', content: 'Anyone else struggling with て-form conjugations? I created a simple chart that helped me:\n\nRu-verbs: drop る → + て\nU-verbs: depends on ending\n\nI can share more details if anyone wants!', likes: 23, comments: 19, liked: false },
  { id: 'p4', author: 'NihongoNinja', avatar: '🥷', time: '1d ago', content: '100 day streak!! 🔥 Never missed a single day. Starting my N4 study plan tomorrow. おめでとう to myself 😂', likes: 89, comments: 34, liked: false },
];

const STUDY_GROUPS = [
  { id: 'g1', name: 'N5 Beginners', members: 234, emoji: '🌱', active: 12 },
  { id: 'g2', name: 'JLPT Prep', members: 445, emoji: '📝', active: 28 },
  { id: 'g3', name: 'Kanji Masters', members: 189, emoji: '⛩️', active: 9 },
  { id: 'g4', name: 'Conversation Club', members: 312, emoji: '💬', active: 34 },
];

function PostCard({ post: p, onLike }: { post: typeof MOCK_POSTS[0]; onLike: (id: string) => void }) {
  return (
    <Card padding="md" className="hover:border-[rgba(139,92,246,0.3)] transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
          {p.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-black text-white">{p.author}</div>
          <div className="text-[10px]" style={{ color: 'rgba(160,150,220,0.5)' }}>{p.time}</div>
        </div>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line mb-4" style={{ color: 'rgba(200,196,255,0.85)' }}>{p.content}</p>
      <div className="flex items-center gap-4 pt-3 border-t" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
        <button onClick={() => onLike(p.id)}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: p.liked ? '#f472b6' : 'rgba(160,150,220,0.5)' }}>
          <Heart className={`w-4 h-4 ${p.liked ? 'fill-pink-400' : ''}`} />
          {p.likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
          <MessageCircle className="w-4 h-4" /> {p.comments}
        </button>
        <button className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </Card>
  );
}

export default function CommunityPage() {
  const [tab, setTab] = useState('feed');
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      await fetch('/api/social', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: newPost }) });
    } catch {}
    setPosts(prev => [{ id: `new-${Date.now()}`, author: 'You', avatar: '🦊', time: 'just now', content: newPost, likes: 0, comments: 0, liked: false }, ...prev]);
    setNewPost(''); setPosting(false);
  };

  return (
    <div className="space-y-5 animate-fade-up max-w-2xl mx-auto">
      <Tabs tabs={[{id:'feed',label:'Feed'},{id:'groups',label:'Study Groups'},{id:'challenges',label:'Challenges'}]}
        activeTab={tab} onChange={setTab} variant="underline" />

      {tab === 'feed' && (
        <div className="space-y-4">
          {/* Post composer */}
          <Card padding="md">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.2))' }}>
                🦊
              </div>
              <div className="flex-1">
                <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
                  placeholder="Share your Japanese learning journey…"
                  className="input resize-none" rows={3} />
                <div className="flex justify-end mt-2">
                  <Button variant="primary" size="sm" onClick={handlePost} loading={posting} disabled={!newPost.trim()}>
                    <Plus className="w-3.5 h-3.5" /> Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          {posts.map(p => <PostCard key={p.id} post={p} onLike={handleLike} />)}
        </div>
      )}

      {tab === 'groups' && (
        <div className="grid sm:grid-cols-2 gap-4">
          {STUDY_GROUPS.map(g => (
            <Card key={g.id} padding="md" hover>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{g.emoji}</div>
                <div>
                  <div className="text-sm font-black text-white">{g.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>
                    <Users className="w-3 h-3 inline mr-1" />{g.members} members
                    <span className="ml-2 text-green-400">● {g.active} online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full">Join Group</Button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'challenges' && (
        <Card padding="lg" className="text-center">
          <div className="text-4xl mb-3">🏆</div>
          <div className="text-sm font-black text-white mb-2">Weekly Challenge</div>
          <div className="text-xs mb-4" style={{ color: 'rgba(160,150,220,0.6)' }}>Learn 50 new vocabulary words this week and earn a special badge!</div>
          <Button variant="primary">Join Challenge</Button>
        </Card>
      )}
    </div>
  );
}
