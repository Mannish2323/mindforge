'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile?.isAdmin) router.replace('/home');
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d18] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }
  if (!profile?.isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#0d0d18] p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-purple-400" />
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Analytics', href: '/api/admin/analytics', desc: 'User stats, DAU, MAU, XP totals' },
          { label: 'Users', href: '/api/user', desc: 'Manage user accounts and plans' },
          { label: 'Content', href: '/api/lesson', desc: 'Lessons, units, vocabulary' },
        ].map(item => (
          <div key={item.label} className="bg-purple-950/40 border border-purple-800/30 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-1">{item.label}</h2>
            <p className="text-sm text-purple-300/50 mb-4">{item.desc}</p>
            <div className="text-xs text-purple-400/50 font-mono">API: {item.href}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
