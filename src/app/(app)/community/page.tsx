'use client';

import React, { useState } from 'react';
import { 
  Users, MessageSquare, ThumbsUp, MessageCircle, Send, Plus, 
  Share2, Trophy, Award, CheckSquare, Search, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: string;
  author: string;
  avatar: string;
  level: string;
  time: string;
  content: string;
  likes: number;
  commentsCount: number;
  liked: boolean;
  comments: { author: string; content: string }[];
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  active: boolean;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'groups'>('feed');
  const [newPostText, setNewPostText] = useState('');
  const [commentsInput, setCommentsInput] = useState<Record<string, string>>({});
  
  // Social Posts Mock data
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'p1',
      author: 'Sakura_99',
      avatar: '🌸',
      level: 'N4',
      time: '2 hours ago',
      content: 'Just finished Unit 12 Vocabulary on Food & Drinks! The ramen matching quiz was super fun. 🍜 What unit are you guys currently working on?',
      likes: 12,
      commentsCount: 2,
      liked: false,
      comments: [
        { author: 'TokyoDrift', content: 'Congrats! I am currently struggling with Unit 8 colors counters.' },
        { author: 'NihongoKing', content: 'Awesome! Keep building that daily streak!' }
      ]
    },
    {
      id: 'p2',
      author: 'KanjiMaster',
      avatar: '⛩️',
      level: 'N3',
      time: '5 hours ago',
      content: 'Quick tip for remembering the kanji 日 (day/sun): Think of it as a window look through to see the sun rising outside! ☀️ Hope this helps other beginners!',
      likes: 24,
      commentsCount: 1,
      liked: true,
      comments: [
        { author: 'Yuki_learns', content: 'Wow, simple memory hook! Thanks for sharing.' }
      ]
    }
  ]);

  // Study Groups Mock data
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([
    { id: 'g1', name: 'N5 Absolute Beginners', description: 'Study group focusing on N5 grammar counters, basic kanjis and particles wa/ga.', members: 42, active: false },
    { id: 'g2', name: 'Speaking Practice Room', description: 'Weekly conversation rooms to build confidence repeating phrases and accent flow.', members: 28, active: true },
    { id: 'g3', name: 'Daily Streak Warriors', description: 'Keep each other motivated. Reminders, challenges, and XP stakes.', members: 89, active: false }
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: `p-${Date.now()}`,
      author: 'You (Learner)',
      avatar: '🎓',
      level: 'N5',
      time: 'Just now',
      content: newPostText,
      likes: 0,
      commentsCount: 0,
      liked: false,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPostText('');
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentsInput[postId];
    if (!text || !text.trim()) return;

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, { author: 'You (Learner)', content: text }]
        };
      }
      return p;
    }));

    setCommentsInput(prev => ({ ...prev, [postId]: '' }));
  };

  const toggleJoinGroup = (id: string) => {
    setStudyGroups(prev => prev.map(g => {
      if (g.id === id) {
        return {
          ...g,
          active: !g.active,
          members: g.active ? g.members - 1 : g.members + 1
        };
      }
      return g;
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-orbitron">
            Community Hub
          </h1>
          <p className="text-xs md:text-sm text-purple-300/50 font-semibold tracking-wide uppercase">
            Share progress tips, ask questions, and join study cohorts
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl">
          {[
            { id: 'feed', label: '💬 Discussion Feed', icon: MessageSquare },
            { id: 'groups', label: '👥 Study Groups', icon: Users }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-brand-purple to-sakura-dark text-white shadow-md' 
                    : 'text-purple-300/60 hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Switcher grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Feed or Groups list */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'feed' && (
            <div className="space-y-6">
              {/* Create post form */}
              <form onSubmit={handleCreatePost} className="glass-card p-5 rounded-[24px] border border-white/5 space-y-4">
                <textarea
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Share your Japanese study target, milestones or questions today..."
                  className="w-full min-h-[100px] bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl p-4 text-sm placeholder-purple-300/30 text-white outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/20 transition-all resize-none"
                />
                
                <div className="flex justify-end pt-2 border-t border-white/5">
                  <button
                    type="submit"
                    disabled={!newPostText.trim()}
                    className="btn btn-primary btn-sm flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Update</span>
                  </button>
                </div>
              </form>

              {/* Feed posts stream */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="glass-card p-6 rounded-[24px] border border-white/5 space-y-4">
                    {/* User profile metadata */}
                    <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg select-none">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white leading-none">{post.author}</h4>
                          <span className="text-[8px] font-bold text-brand-purple-light bg-brand-purple/20 px-1.5 py-0.5 rounded uppercase">
                            {post.level}
                          </span>
                        </div>
                        <p className="text-[10px] text-purple-300/40 font-semibold mt-1 uppercase tracking-wider">{post.time}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-sm text-purple-100 font-medium leading-relaxed font-jp">
                      {post.content}
                    </p>

                    {/* Like & Comment counter triggers */}
                    <div className="flex items-center gap-6 pt-3 border-t border-white/5 text-xs font-bold text-purple-300/40 select-none">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ${
                          post.liked ? 'text-sakura-dark hover:text-sakura-dark' : ''
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{post.likes} Likes</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount} Comments</span>
                      </div>
                    </div>

                    {/* Comment section */}
                    <div className="space-y-3 pt-3 border-t border-white/5 bg-white/[0.01] rounded-2xl p-3">
                      {post.comments.map((c, idx) => (
                        <div key={idx} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl space-y-1">
                          <p className="text-xs font-bold text-white font-orbitron">{c.author}</p>
                          <p className="text-xs font-medium text-purple-200">{c.content}</p>
                        </div>
                      ))}

                      {/* Comment Input */}
                      <div className="flex gap-2.5 pt-2">
                        <input
                          type="text"
                          value={commentsInput[post.id] || ''}
                          onChange={(e) => setCommentsInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment reply..."
                          className="flex-1 bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-xl px-4 h-10 text-xs placeholder-purple-300/30 text-white outline-none focus:border-brand-purple/60 transition-all"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-4 bg-brand-purple/20 border border-brand-purple/30 text-brand-purple-light rounded-xl text-xs font-bold hover:bg-brand-purple/30 transition-all cursor-pointer"
                        >
                          Send
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              {studyGroups.map((group) => (
                <div key={group.id} className="glass-card p-6 rounded-[24px] border border-white/5 flex flex-col justify-between space-y-6 hover:border-white/10 transition-all">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-base font-bold text-white font-orbitron">{group.name}</h4>
                      <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">{group.members} Members</span>
                    </div>
                    <p className="text-xs text-purple-300/60 font-semibold leading-relaxed">
                      {group.description}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleJoinGroup(group.id)}
                    className={`w-full btn btn-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      group.active 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'btn-primary'
                    }`}
                  >
                    {group.active ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join Cohort</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Column: Community Leaderboard Side panel widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 md:p-8 rounded-[28px] border border-white/5 space-y-5">
            <h3 className="text-base font-bold text-white font-orbitron flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Weekly Leaderboard</span>
            </h3>

            <div className="space-y-3">
              {[
                { name: 'Sakura_99', rank: 1, xp: 980, icon: '🌸' },
                { name: 'TokyoDrift', rank: 2, xp: 870, icon: '🏎️' },
                { name: 'NihongoKing', rank: 3, xp: 740, icon: '👑' },
                { name: 'You (Learner)', rank: 4, xp: 120, icon: '🎓' }
              ].map((user) => (
                <div 
                  key={user.rank}
                  className={`p-3 bg-white/[0.01] border rounded-xl flex items-center justify-between ${
                    user.rank <= 3 ? 'border-yellow-500/15 bg-yellow-500/[0.01]' : 'border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-purple-300/40 w-4 font-orbitron">{user.rank}</span>
                    <span className="text-sm">{user.icon}</span>
                    <span className="text-xs font-bold text-white">{user.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-sakura-dark font-orbitron">{user.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
