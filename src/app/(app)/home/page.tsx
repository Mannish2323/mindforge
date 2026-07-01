'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Flame, Zap, BookOpen, Brain, Sparkles, Mic, PenTool, Volume2, 
  ChevronRight, Calendar, CheckSquare, Award, Play, AlertCircle, Clock
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Welcome back');
  const [checklist, setChecklist] = useState([
    { id: 1, text: '15 New Vocabulary', checked: false, value: '0/15' },
    { id: 2, text: '10 Kanji Practice', checked: false, value: '0/10' },
    { id: 3, text: '5 Grammar Points', checked: false, value: '0/5' },
    { id: 4, text: 'Speaking Practice', checked: false, value: '0/1' },
  ]);

  // Determine standard greeting based on current time
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting('Good Morning');
    else if (hours < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const toggleCheck = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const planProgressPercentage = Math.round((completedCount / checklist.length) * 100);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Learner';

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  } as const;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Dynamic Header Greeting */}
      <motion.div variants={itemVariants} className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
          {greeting}, <span className="bg-gradient-to-r from-sakura-dark to-purple-400 bg-clip-text text-transparent">{userName}</span>! 👋
        </h1>
        <p className="text-purple-300/60 text-sm md:text-base font-medium">
          Let&apos;s continue your Japanese learning journey. Stay consistent, achieve your goals.
        </p>
      </motion.div>

      {/* Main Grid: Left Main Section (Sidebar + Top Navbar layout) & Right Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main content block: 8 cols out of 12 */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Premium Welcome Banner */}
          <motion.div 
            variants={itemVariants}
            className="relative glass-card rounded-[28px] overflow-hidden group border border-white/5 flex flex-col md:flex-row min-h-[300px] shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
          >
            {/* Banner Content */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-between relative z-10 space-y-6">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold tracking-widest text-sakura-dark uppercase px-3 py-1 bg-sakura-dark/15 rounded-full border border-sakura-dark/25 w-max">
                  Daily Quote
                </span>
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-relaxed font-jp">
                    「毎日少しずつ、大きな成果に。」
                  </h2>
                  <p className="text-purple-100/80 text-sm md:text-base font-medium italic">
                    &ldquo;Little by little, one goes a long way.&rdquo;
                  </p>
                  <p className="text-purple-300/40 text-xs font-semibold">
                    — Japanese Proverb
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-xl text-xs font-bold">
                  <Flame className="w-4 h-4 fill-orange-500" />
                  <span>5 day streak</span>
                </div>
                <Link href="/jlpt">
                  <span className="btn btn-primary btn-sm flex items-center gap-2 cursor-pointer">
                    <span>Continue Learning</span>
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Banner Side Image Container */}
            <div className="relative w-full md:w-[40%] min-h-[200px] md:min-h-auto">
              <Image 
                src="/sakura_banner.png" 
                alt="Sakura Mascot and Mount Fuji Banner" 
                fill 
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#09060F] via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Quick Statistics Row */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-5 gap-4"
          >
            {[
              { label: 'XP', val: '120', sub: 'Level 2', icon: Zap, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
              { label: 'Day Streak', val: '5', sub: 'Keep it up! 🔥', icon: Flame, color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
              { label: 'Lessons Done', val: '0', sub: 'Total completed', icon: BookOpen, color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
              { label: 'Words Learned', val: '12', sub: 'Vocabulary', icon: Brain, color: 'text-pink-400 bg-pink-400/10 border-pink-400/20' },
              { label: 'Quizzes Done', val: '4', sub: 'All time', icon: Award, color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="glass-card p-4 rounded-[20px] flex flex-col justify-between space-y-3 hover:border-white/10 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-300/40 tracking-wider uppercase">{stat.label}</span>
                  <div className={`p-1.5 rounded-lg border ${stat.color.split(' ').slice(1).join(' ')}`}>
                    <stat.icon className={`w-3.5 h-3.5 ${stat.color.split(' ')[0]}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-orbitron">{stat.val}</h3>
                  <p className="text-[10px] font-medium text-purple-300/50 mt-0.5 truncate">{stat.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-bold text-purple-200 tracking-wide font-orbitron">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { name: 'Review (SRS)', href: '/review', icon: Brain, color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-300 hover:border-purple-400/60' },
                { name: 'Speak', href: '/speaking', icon: Mic, color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300 hover:border-pink-400/60' },
                { name: 'AI Tutor', href: '/ai-tutor', icon: Sparkles, color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-300 hover:border-indigo-400/60' },
                { name: 'Vocab', href: '/vocabulary', icon: BookOpen, color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60' },
                { name: 'Writing', href: '/writing', icon: PenTool, color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300 hover:border-amber-400/60' },
                { name: 'Listen', href: '/listening', icon: Volume2, color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300 hover:border-blue-400/60' },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <span className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br ${action.color} border transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] font-bold cursor-pointer text-sm shadow-md`}>
                    <action.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{action.name}</span>
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Lower Two Columns: JLPT Roadmap & Continue Learning widget */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* JLPT Roadmap Path */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-orbitron">JLPT Roadmap</h3>
                <Link href="/jlpt" className="text-xs text-sakura-dark hover:underline flex items-center gap-1 font-semibold">
                  <span>View Full Roadmap</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Progress Pathway nodes */}
              <div className="flex items-center justify-between px-2 py-4 relative">
                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-white/5" />
                {[
                  { level: 'N5', title: 'Beginner', active: true },
                  { level: 'N4', title: 'Next', active: false },
                  { level: 'N3', title: 'Next', active: false },
                  { level: 'N2', title: 'Next', active: false },
                  { level: 'N1', title: 'Next', active: false },
                ].map((node, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-orbitron text-sm border shadow-lg transition-all ${
                      node.active 
                        ? 'bg-gradient-to-br from-brand-purple to-sakura-dark border-brand-purple text-white scale-110 shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                        : 'bg-[#120f26] border-white/5 text-purple-300/40'
                    }`}>
                      {node.level}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider text-purple-300/50 uppercase">
                      {node.active ? node.title : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Learning Widget */}
            <div className="glass-card p-6 rounded-[24px] flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-orbitron">Continue Learning</h3>
                <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 shadow-inner overflow-hidden">
                  <Image 
                    src="/ramen_icon.png" 
                    alt="Ramen Icon" 
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">N5 Vocabulary – Unit 12</h4>
                  <p className="text-xs text-purple-300/60 font-medium mt-0.5">Food & Drinks</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-purple to-sakura-dark rounded-full w-[68%]" />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-purple-300/40">
                      <span>PROGRESS</span>
                      <span>68% completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/vocabulary">
                <span className="btn btn-primary w-full btn-sm flex items-center justify-center gap-2 cursor-pointer font-bold">
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>

          </motion.div>

        </div>

        {/* Right column: 4 cols out of 12 for Widgets */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Daily Goal Card */}
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-[24px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-orbitron">Daily Goal</h3>
              <button className="text-xs text-sakura-dark hover:underline font-semibold cursor-pointer">
                Edit Goal
              </button>
            </div>

            {/* Circular Progress Display */}
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="8" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#purplePinkGrad)" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2} // 0% completed
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="purplePinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white font-orbitron">0</span>
                  <span className="text-[10px] font-bold text-purple-300/40 uppercase tracking-widest">/ 25 XP</span>
                </div>
              </div>
              <p className="text-xs font-semibold text-purple-300/60 text-center">
                0% completed today. Practice daily to build memory hooks!
              </p>
            </div>
          </motion.div>

          {/* Today's Plan Checklist */}
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-[24px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-orbitron">Today&apos;s Plan</h3>
              <span className="text-xs font-bold text-sakura-dark">{planProgressPercentage}%</span>
            </div>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all ${
                    item.checked 
                      ? 'bg-brand-purple/10 border-brand-purple/30 text-white' 
                      : 'bg-white/[0.02] border-white/5 text-purple-300/70 hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      item.checked 
                        ? 'bg-gradient-to-r from-brand-purple to-sakura-dark border-transparent text-white' 
                        : 'border-purple-300/20'
                    }`}>
                      {item.checked && <CheckSquare className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-semibold">{item.text}</span>
                  </div>
                  <span className="text-[11px] font-bold text-purple-300/40 font-orbitron">{item.value}</span>
                </div>
              ))}
            </div>

            <Link href="/jlpt">
              <span className="btn btn-primary w-full btn-sm flex items-center justify-center font-bold cursor-pointer">
                Start Plan
              </span>
            </Link>
          </motion.div>

          {/* AI Tutor Sakura widget */}
          <motion.div 
            variants={itemVariants} 
            className="glass-card p-6 rounded-[24px] relative overflow-hidden group border border-white/5"
          >
            {/* Ambient Background Glow */}
            <div className="absolute right-[-20px] bottom-[-20px] w-40 h-40 bg-sakura-dark/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-sakura-dark/20 transition-all duration-500" />
            
            <div className="flex items-start gap-4 relative z-10">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-purple to-sakura-dark p-[1px] flex-shrink-0 shadow-lg overflow-hidden animate-float-avatar">
                <div className="relative w-full h-full bg-[#120f26] rounded-[15px] overflow-hidden">
                  <Image 
                    src="/velmorth_mascot.png" 
                    alt="AI Tutor Sakura Avatar" 
                    fill 
                    className="object-cover object-top"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white font-orbitron flex items-center gap-1.5">
                  <span>AI Tutor Sakura</span>
                  <Sparkles className="w-3.5 h-3.5 text-sakura-dark animate-pulse" />
                </h4>
                <p className="text-xs text-purple-300/70 font-semibold leading-relaxed">
                  Need help with Japanese today? Let&apos;s practice conversation or explain grammar.
                </p>
              </div>
            </div>

            <div className="mt-5 relative z-10">
              <Link href="/ai-tutor">
                <span className="btn btn-ghost w-full btn-sm flex items-center justify-center gap-2 cursor-pointer font-bold">
                  <span>Chat Now</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Upcoming Section */}
          <motion.div variants={itemVariants} className="glass-card p-6 rounded-[24px] space-y-4">
            <h3 className="text-base font-bold text-white font-orbitron">Upcoming</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-purple-300/60">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-purple-300/80 leading-relaxed">No upcoming events</p>
                <p className="text-[10px] font-medium text-purple-300/40 mt-0.5">Stay consistent and achieve your goals!</p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>

      {/* Footer layout links */}
      <motion.footer 
        variants={itemVariants}
        className="pt-10 pb-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-purple-300/40"
      >
        <p>© 2026 Learning Velmorth. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-purple-300/80 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-purple-300/80 transition-colors">Terms of Service</Link>
          <Link href="/help" className="hover:text-purple-300/80 transition-colors">Help Center</Link>
        </div>
      </motion.footer>

    </motion.div>
  );
}
