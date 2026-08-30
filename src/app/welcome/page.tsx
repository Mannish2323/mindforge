'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mascot } from '@/components/mascot/Mascot';
import { Logo } from '@/components/ui/Logo';
import { SakuraParticles } from '@/components/animations/SakuraParticles';

const slides = [
  {
    mascot: <Mascot expression="excited" size={160} animate />,
    jp: '楽しく学ぼう',
    romanji: 'Tanoshiku manabou',
    en: "Let's learn in a fun way!",
    tagline: 'Learn Japanese. The fun way!',
  },
  {
    mascot: <Mascot expression="studying" size={160} animate />,
    jp: '毎日少しずつ',
    romanji: 'Mainichi sukoshi zutsu',
    en: 'A little every day makes a big difference!',
    tagline: 'Build a daily habit with short lessons.',
  },
  {
    mascot: <Mascot expression="encouraging" size={160} animate />,
    jp: '一緒に頑張ろう',
    romanji: 'Issho ni ganbarou',
    en: "Let's achieve your goals together!",
    tagline: 'Join a community of passionate learners.',
  }
];

export default function WelcomePage() {
  const router = useRouter();
  const [slideIdx, setSlideIdx] = useState(0);

  const nextSlide = () => {
    if (slideIdx < slides.length - 1) {
      setSlideIdx(prev => prev + 1);
    } else {
      router.push('/onboarding');
    }
  };

  const skip = () => {
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-warm relative overflow-hidden flex flex-col font-sans">
      <SakuraParticles />

      {/* Skip Button */}
      <div className="absolute top-0 right-0 z-20 p-6 pt-[env(safe-area-inset-top)] mt-4">
        <button 
          onClick={skip}
          className="text-sm font-bold text-ink-muted hover:text-ink transition-colors focus:outline-none"
        >
          Skip
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 z-10 relative">
        <div className="w-full max-w-sm mx-auto bg-card rounded-[32px] shadow-sm border-2 border-edge p-6 flex flex-col min-h-[520px]">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
             <Logo size="md" variant="horizontal" glow={false} showTagline={false} />
          </div>

          <div className="flex-1 flex flex-col relative justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center flex-1 justify-center"
              >
                <div className="h-48 flex items-center justify-center mb-6">
                  {slides[slideIdx].mascot}
                </div>
                
                <div className="text-center space-y-2">
                  <h2 className="text-[28px] font-black font-jp text-ink">
                    {slides[slideIdx].jp}
                  </h2>
                  <p className="text-xs font-bold text-brand uppercase tracking-wider mb-2">
                    {slides[slideIdx].romanji}
                  </p>
                  <p className="text-[17px] font-bold text-ink-secondary leading-snug">
                    {slides[slideIdx].en}
                  </p>
                  <p className="text-sm text-ink-muted mt-2 font-medium">
                    {slides[slideIdx].tagline}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 space-y-6">
            {/* Dots */}
            <div className="flex justify-center gap-2">
              {slides.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setSlideIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${i === slideIdx ? 'w-8 bg-brand' : 'w-2 bg-edge hover:bg-edge-hover'}`} 
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={nextSlide}
                className="w-full h-14 rounded-2xl bg-brand text-white font-extrabold text-[17px] flex items-center justify-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.98] focus:outline-none"
              >
                {slideIdx < slides.length - 1 ? 'Next' : 'Get Started'}
              </button>
              
              <Link
                href="/auth"
                className={`block w-full text-center py-2 text-sm font-bold transition-colors ${slideIdx === slides.length - 1 ? 'text-ink-muted hover:text-brand' : 'opacity-0 pointer-events-none'}`}
              >
                Already have an account? Login
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
