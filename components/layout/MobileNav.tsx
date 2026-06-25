'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, BookOpen, Brain, BarChart3, User } from 'lucide-react';

const TABS = [
  { icon: Home,      label: 'Home',     href: '/home' },
  { icon: BookOpen,  label: 'Learn',    href: '/path' },
  { icon: Brain,     label: 'AI',       href: '/ai-tutor' },
  { icon: BarChart3, label: 'Progress', href: '/progress' },
  { icon: User,      label: 'Profile',  href: '/profile' },
];

export function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 lg:hidden"
      style={{ background: 'rgba(9,7,26,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="flex items-stretch h-16 safe-bottom">
        {TABS.map(tab => {
          const active = pathname.startsWith(tab.href);
          return (
            <button key={tab.label} onClick={() => router.push(tab.href)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative">
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                  style={{ background: 'linear-gradient(90deg, #7c3aed, #db2777)' }} />
              )}
              <tab.icon className="w-5 h-5 transition-all"
                style={{ color: active ? '#a78bfa' : 'rgba(139,92,246,0.35)', transform: active ? 'scale(1.1)' : 'scale(1)' }} />
              <span className="text-[10px] font-bold transition-colors"
                style={{ color: active ? '#a78bfa' : 'rgba(139,92,246,0.35)' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
