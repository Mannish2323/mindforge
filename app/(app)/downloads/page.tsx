'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressBar } from '@/components/ui/ProgressBar';
import {
  Download, Lock, CheckCircle2, HardDrive,
  Wifi, WifiOff, BookOpen, Pen, Headphones,
  ChevronRight, Sparkles
} from 'lucide-react';

interface DownloadPack {
  id: string;
  title: string;
  jpTitle: string;
  level: string;
  emoji: string;
  color: string;
  size: string;
  items: number;
  category: string;
  requiresPlan: string;
}

const DOWNLOAD_PACKS: DownloadPack[] = [
  {
    id: 'n5-vocab',
    title: 'N5 Vocabulary Pack',
    jpTitle: 'N5 語彙パック',
    level: 'N5', emoji: '📚',
    color: '#22c55e',
    size: '2.1 MB', items: 800, category: 'Vocabulary',
    requiresPlan: 'starter',
  },
  {
    id: 'n5-kanji',
    title: 'N5 Kanji Pack',
    jpTitle: 'N5 漢字パック',
    level: 'N5', emoji: '⛩️',
    color: '#22c55e',
    size: '1.4 MB', items: 100, category: 'Kanji',
    requiresPlan: 'starter',
  },
  {
    id: 'n4-vocab',
    title: 'N4 Vocabulary Pack',
    jpTitle: 'N4 語彙パック',
    level: 'N4', emoji: '📖',
    color: '#3b82f6',
    size: '3.5 MB', items: 1500, category: 'Vocabulary',
    requiresPlan: 'plus',
  },
  {
    id: 'n4-kanji',
    title: 'N4 Kanji Pack',
    jpTitle: 'N4 漢字パック',
    level: 'N4', emoji: '✍️',
    color: '#3b82f6',
    size: '2.8 MB', items: 300, category: 'Kanji',
    requiresPlan: 'plus',
  },
  {
    id: 'n3-complete',
    title: 'N3 Complete Pack',
    jpTitle: 'N3 完全パック',
    level: 'N3', emoji: '🎯',
    color: '#8b5cf6',
    size: '8.2 MB', items: 3500, category: 'Full Pack',
    requiresPlan: 'pro',
  },
  {
    id: 'job-pack',
    title: 'Business Japanese Pack',
    jpTitle: 'ビジネス日本語',
    level: 'N3', emoji: '💼',
    color: '#f59e0b',
    size: '4.1 MB', items: 600, category: 'Job Prep',
    requiresPlan: 'pro',
  },
];

const PLAN_ORDER = ['free', 'starter', 'plus', 'pro'];

function canAccess(userPlan: string, requiredPlan: string) {
  return PLAN_ORDER.indexOf(userPlan) >= PLAN_ORDER.indexOf(requiredPlan);
}

export default function DownloadsPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  const userPlan = profile?.planId || 'free';
  const isPremium = profile?.isPremium;

  const handleDownload = async (pack: DownloadPack) => {
    if (!canAccess(userPlan, pack.requiresPlan)) {
      router.push('/billing');
      return;
    }
    setDownloading(pack.id);
    // Simulate download
    await new Promise(res => setTimeout(res, 2000));
    setDownloaded(prev => new Set([...Array.from(prev), pack.id]));
    setDownloading(null);
  };

  if (!isPremium) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up space-y-5">
        {/* Premium gate with preview */}
        <div className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.1))', border: '1px solid rgba(124,58,237,0.3)' }}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
          <div className="relative z-10 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h1 className="text-xl font-black text-white mb-2">Offline Downloads</h1>
            <p className="text-sm mb-5" style={{ color: 'rgba(200,196,255,0.7)' }}>
              Download lesson packs to study Japanese even without an internet connection.
            </p>
            <Button variant="primary" onClick={() => router.push('/billing')}>
              <Sparkles className="w-4 h-4" />
              Upgrade to Access
            </Button>
          </div>
        </div>

        {/* Preview locked packs */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(139,92,246,0.5)' }}>
            Available Packs
          </div>
          {DOWNLOAD_PACKS.map(pack => (
            <div key={pack.id} className="rounded-xl p-4 opacity-60"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{pack.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-white">{pack.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>
                    {pack.items.toLocaleString()} items · {pack.size}
                  </div>
                </div>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(139,92,246,0.3)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-up space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Offline Downloads</h1>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {downloaded.size} packs downloaded
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
          <Wifi className="w-3 h-3" />
          Online
        </div>
      </div>

      {/* Storage info */}
      <Card padding="md">
        <div className="flex items-center gap-3 mb-3">
          <HardDrive className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-bold text-white">Storage</span>
          <span className="text-xs ml-auto" style={{ color: 'rgba(160,150,220,0.5)' }}>
            {downloaded.size > 0 ? `${downloaded.size * 2.1} MB used` : '0 MB used'}
          </span>
        </div>
        <ProgressBar value={downloaded.size * 5} max={100} size="sm" color="brand" />
        <div className="text-xs mt-2" style={{ color: 'rgba(160,150,220,0.5)' }}>
          Up to 2 GB available for offline content
        </div>
      </Card>

      {/* Available packs */}
      <div className="space-y-3">
        {DOWNLOAD_PACKS.map(pack => {
          const accessible = canAccess(userPlan, pack.requiresPlan);
          const isDownloaded = downloaded.has(pack.id);
          const isDownloading = downloading === pack.id;
          return (
            <div key={pack.id} className="rounded-xl p-4 transition-all"
              style={{
                background: isDownloaded ? `${pack.color}08` : 'rgba(139,92,246,0.04)',
                border: `1px solid ${isDownloaded ? `${pack.color}25` : 'rgba(139,92,246,0.12)'}`,
              }}>
              <div className="flex items-center gap-3">
                <div className="text-2xl flex-shrink-0">{pack.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-sm font-black text-white">{pack.title}</span>
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: `${pack.color}15`, color: pack.color }}>
                      {pack.level}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>
                    {pack.category} · {pack.items.toLocaleString()} items · {pack.size}
                  </div>
                  {isDownloading && (
                    <div className="mt-2">
                      <ProgressBar value={60} size="xs" color="brand" />
                      <div className="text-[10px] mt-1" style={{ color: 'rgba(160,150,220,0.5)' }}>Downloading…</div>
                    </div>
                  )}
                </div>
                {!accessible ? (
                  <button onClick={() => router.push('/billing')}
                    className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={{ background: 'rgba(219,39,119,0.1)', color: '#f472b6', border: '1px solid rgba(219,39,119,0.2)' }}>
                    🔒 Upgrade
                  </button>
                ) : isDownloaded ? (
                  <div className="flex items-center gap-1 text-xs font-bold flex-shrink-0" style={{ color: '#4ade80' }}>
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Downloaded</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDownload(pack)}
                    disabled={isDownloading}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: `${pack.color}18`, color: pack.color, border: `1px solid ${pack.color}33` }}
                  >
                    {isDownloading ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    {isDownloading ? 'Saving…' : 'Download'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Offline mode info */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.18)' }}>
        <div className="flex items-center gap-2 mb-2">
          <WifiOff className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-black text-white">Offline Mode</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(200,196,255,0.7)' }}>
          Downloaded packs are available in Study, Review, and Vocabulary sections even without internet. Progress syncs automatically when you reconnect.
        </p>
      </div>
    </div>
  );
}
