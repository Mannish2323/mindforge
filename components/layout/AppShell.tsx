import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #09071a 0%, #0e0b22 50%, #130930 100%)' }}>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 lg:pb-6" style={{ overscrollBehavior: 'contain' }}>
          <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
