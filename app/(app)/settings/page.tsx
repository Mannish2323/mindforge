'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import {
  Bell, Volume2, Globe, Shield, Palette,
  ChevronRight, LogOut, Trash2, Download, Lock, HelpCircle, FileText, Info
} from 'lucide-react';

function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{ background: on ? 'linear-gradient(90deg,#7c3aed,#a855f7)' : 'rgba(139,92,246,0.15)', border: on ? 'none' : '1px solid rgba(139,92,246,0.25)' }}>
      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
        style={{ left: on ? 'calc(100% - 22px)' : '2px' }} />
    </button>
  );
}

function SettingRow({ icon: Icon, label, description, children, onClick }: { icon: any; label: string; description?: string; children?: React.ReactNode; onClick?: () => void }) {
  return (
    <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all hover:bg-[rgba(139,92,246,0.06)] text-left group"
      onClick={onClick}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(139,92,246,0.1)' }}>
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-white">{label}</div>
        {description && <div className="text-xs mt-0.5" style={{ color: 'rgba(160,150,220,0.5)' }}>{description}</div>}
      </div>
      {children || <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" />}
    </button>
  );
}

export default function SettingsPage() {
  const { profile, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('general');
  const [notifLesson, setNotifLesson] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(0.85);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-up">
      <Tabs
        tabs={[{id:'general',label:'General'},{id:'notifications',label:'Notifications'},{id:'learning',label:'Learning'},{id:'privacy',label:'Privacy & Legal'}]}
        activeTab={tab} onChange={setTab} variant="underline" />

      {tab === 'general' && (
        <div className="space-y-3">
          <Card padding="none">
            <SettingRow icon={Palette} label="Theme" description="Dark mode (recommended)" onClick={() => {}}>
              <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa' }}>Dark</span>
            </SettingRow>
            <div className="divider mx-4" />
            <SettingRow icon={Globe} label="App Language" description="English" onClick={() => {}} />
            <div className="divider mx-4" />
            <SettingRow icon={Download} label="Download Offline Content" description="Download lessons for offline use" onClick={() => router.push('/downloads')} />
          </Card>

          <Card padding="none">
            <SettingRow icon={Lock} label="Change Password" onClick={() => {}} />
            <div className="divider mx-4" />
            <SettingRow icon={Shield} label="Two-Factor Authentication" description="Add extra security" onClick={() => {}} />
            <div className="divider mx-4" />
            <SettingRow icon={Download} label="Export My Data" description="Download all your learning data" onClick={() => {}} />
          </Card>

          <Card padding="none">
            <SettingRow icon={LogOut} label="Sign Out" description={profile?.email} onClick={logout}>
              <span />
            </SettingRow>
          </Card>

          <Card padding="none" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
            <button className="w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all hover:bg-[rgba(239,68,68,0.06)] text-left"
              onClick={() => setShowDeleteConfirm(true)}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-red-400">Delete Account</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(239,68,68,0.5)' }}>Permanently delete all data. Irreversible.</div>
              </div>
            </button>
          </Card>

          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
              <Card padding="lg" className="max-w-sm w-full animate-scale-in">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">⚠️</div>
                  <div className="text-base font-black text-white mb-2">Delete Account?</div>
                  <div className="text-sm" style={{ color: 'rgba(160,150,220,0.6)' }}>This will permanently delete all your data including progress, XP, and achievements. This cannot be undone.</div>
                </div>
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                  <Button variant="danger" className="flex-1">Delete Forever</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {tab === 'notifications' && (
        <Card padding="none">
          <SettingRow icon={Bell} label="Lesson Reminders" description="Daily study reminder">
            <ToggleSwitch on={notifLesson} onToggle={() => setNotifLesson(!notifLesson)} />
          </SettingRow>
          <div className="divider mx-4" />
          <SettingRow icon={Bell} label="Streak Alerts" description="Lose streak warning">
            <ToggleSwitch on={notifStreak} onToggle={() => setNotifStreak(!notifStreak)} />
          </SettingRow>
          <div className="divider mx-4" />
          <SettingRow icon={Bell} label="Community" description="Likes, comments, challenges">
            <ToggleSwitch on={notifCommunity} onToggle={() => setNotifCommunity(!notifCommunity)} />
          </SettingRow>
        </Card>
      )}

      {tab === 'learning' && (
        <div className="space-y-3">
          <Card padding="none">
            <SettingRow icon={Volume2} label="Sound Effects" description="Audio cues and feedback">
              <ToggleSwitch on={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
            </SettingRow>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <Volume2 className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Speech Speed</div>
                <div className="text-xs" style={{ color: 'rgba(160,150,220,0.5)' }}>Controls native audio playback rate</div>
              </div>
              <div className="ml-auto text-sm font-black text-purple-400">{speechSpeed}x</div>
            </div>
            <input type="range" min="0.5" max="1.5" step="0.05" value={speechSpeed}
              onChange={e => setSpeechSpeed(parseFloat(e.target.value))}
              className="w-full accent-purple-500" />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'rgba(160,150,220,0.4)' }}>
              <span>0.5x Slow</span><span>1.0x Normal</span><span>1.5x Fast</span>
            </div>
          </Card>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="space-y-3">
          <Card padding="none">
            {[
              { icon: FileText, label: 'Terms of Service',    href: '/terms' },
              { icon: Shield,   label: 'Privacy Policy',      href: '/privacy' },
              { icon: FileText, label: 'Refund Policy',       href: '/refund' },
              { icon: FileText, label: 'Cookie Policy',       href: '/cookies' },
            ].map((item, i) => (
              <div key={item.label}>
                {i > 0 && <div className="divider mx-4" />}
                <SettingRow icon={item.icon} label={item.label} onClick={() => router.push(item.href)} />
              </div>
            ))}
          </Card>

          <Card padding="none">
            {[
              { icon: HelpCircle, label: 'Help Center', desc: 'FAQs and tutorials' },
              { icon: Info,       label: 'About Velmorth', desc: 'Version 1.0.0 · Built with ❤️' },
            ].map((item, i) => (
              <div key={item.label}>
                {i > 0 && <div className="divider mx-4" />}
                <SettingRow icon={item.icon} label={item.label} description={item.desc} />
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
