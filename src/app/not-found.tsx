import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { EmptyStateIllustration } from '@/components/illustrations/NanoIllustrations';

export default function NotFound() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm text-ink flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute w-[40vw] h-[40vw] rounded-full bg-cat-purple-light/30 blur-[100px] pointer-events-none top-1/3 left-1/3" />

      <div className="text-center space-y-6 z-10 max-w-md">
        {/* 404 number */}
        <div className="relative flex flex-col items-center">
          <span className="text-[120px] md:text-[140px] font-extrabold font-heading bg-gradient-to-b from-brand/20 to-transparent bg-clip-text text-transparent leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center pt-4">
            <EmptyStateIllustration size={88} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-ink font-heading">Page Not Found</h1>
          <p className="text-sm text-ink-muted leading-relaxed">
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
