import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0B0717] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-neon-purple/5 blur-[100px] pointer-events-none top-1/3 left-1/3" />

      <div className="text-center space-y-6 z-10 max-w-md">
        {/* 404 number */}
        <div className="relative">
          <span className="text-[120px] md:text-[160px] font-extrabold font-orbitron bg-gradient-to-b from-neon-purple/30 to-transparent bg-clip-text text-transparent leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🌸</span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white">Page Not Found</h1>
          <p className="text-sm text-purple-300/40 leading-relaxed">
            This path doesn&apos;t exist in our learning roadmap. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/home">
            <button className="btn btn-primary flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </button>
          </Link>
          <Link href="javascript:history.back()">
            <button className="btn btn-ghost flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
