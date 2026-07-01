import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';

export const metadata: Metadata = {
  title: 'Learn with Velmorth — Japanese Made Effortless',
  description: 'Interactive gamified platform to learn Japanese (JLPT N5 to N1) with AI tutoring, spaced-repetition flashcards, and live speaking practice.',
  manifest: '/manifest.json',
  keywords: ['Japanese learning', 'JLPT', 'hiragana', 'katakana', 'kanji', 'Velmorth'],
  authors: [{ name: 'Velmorth Labs', url: 'https://learn-with-velmorth.vercel.app' }],
  openGraph: {
    title: 'Learn with Velmorth',
    description: 'Learn Japanese the smart way — AI + SRS + Speaking',
    url: 'https://learn-with-velmorth.vercel.app',
    siteName: 'Velmorth',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700;900&family=Orbitron:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icons/icon-192.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8150181705727957"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


