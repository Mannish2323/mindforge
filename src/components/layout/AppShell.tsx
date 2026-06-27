import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { SakuraAIWidget } from '../shared/SakuraAIWidget';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden animate-fade-in"
      style={{ background: 'linear-gradient(135deg, #09071a 0%, #0e0b22 50%, #130930 100%)' }}>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 lg:pb-6" style={{ overscrollBehavior: 'contain' }}>
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 pb-20 lg:pb-8 min-w-0 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

      {/* Floating Sakura AI Widget Mascot */}
      <SakuraAIWidget />
    </div>
  );
}
