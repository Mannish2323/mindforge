import React from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09071a] text-white">
      {children}
    </div>
  );
}
