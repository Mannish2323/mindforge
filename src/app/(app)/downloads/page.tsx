'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, HardDrive, Trash2, Check, Cloud, WifiOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

const DOWNLOADABLE = [
  { id: 1, name: 'N5 Vocabulary Pack', size: '2.4 MB', items: 800, downloaded: true },
  { id: 2, name: 'N5 Grammar Guide', size: '1.8 MB', items: 120, downloaded: true },
  { id: 3, name: 'N5 Kanji Set', size: '3.1 MB', items: 100, downloaded: false },
  { id: 4, name: 'N4 Vocabulary Pack', size: '4.2 MB', items: 1500, downloaded: false },
  { id: 5, name: 'N4 Grammar Guide', size: '2.5 MB', items: 200, downloaded: false },
  { id: 6, name: 'Listening Audio Pack', size: '15.8 MB', items: 50, downloaded: false },
];

export default function DownloadsPage() {
  const downloadedItems = DOWNLOADABLE.filter(d => d.downloaded);
  const totalSize = downloadedItems.reduce((acc, d) => acc + parseFloat(d.size), 0).toFixed(1);

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Download className="w-7 h-7 text-brand-light" /> Downloads
        </h1>
        <p className="text-sm text-purple-300/45">Manage offline content</p>
      </motion.div>

      {/* Storage Usage */}
      <motion.div variants={item}>
        <Card variant="glass" padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-brand-light" />
              <span className="text-sm font-semibold text-white">Storage Used</span>
            </div>
            <span className="text-sm font-bold text-brand-light">{totalSize} MB</span>
          </div>
          <ProgressBar value={parseFloat(totalSize) / 50 * 100} label="50 MB available" showLabel color="gradient" />
        </Card>
      </motion.div>

      {/* Downloaded */}
      {downloadedItems.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <WifiOff className="w-3 h-3" /> Available Offline
          </h3>
          {downloadedItems.map(dl => (
            <Card key={dl.id} variant="glass" padding="md" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">{dl.name}</span>
                  <span className="text-[10px] text-purple-300/40">{dl.size} • {dl.items} items</span>
                </div>
              </div>
              <button className="p-2 rounded-lg text-purple-300/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </motion.div>
      )}

      {/* Available to Download */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-[10px] font-extrabold text-purple-300/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <Cloud className="w-3 h-3" /> Available to Download
        </h3>
        {DOWNLOADABLE.filter(d => !d.downloaded).map(dl => (
          <Card key={dl.id} variant="glass" padding="md" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand/10">
                <Download className="w-4 h-4 text-brand-light" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">{dl.name}</span>
                <span className="text-[10px] text-purple-300/40">{dl.size} • {dl.items} items</span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-neon-purple/15 text-xs font-bold text-brand-light hover:bg-neon-purple/25 transition-all cursor-pointer">
              Download
            </button>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
