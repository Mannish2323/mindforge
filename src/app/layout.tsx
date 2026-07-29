import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { UpgradeDialogProvider } from '@/components/shared/UpgradeDialog';

export const metadata: Metadata = {
  metadataBase: new URL('https://mindforge.yamplelabs.com'),
  title: 'MindForge — Japanese Made Effortless by Yample Labs',
  description: 'Interactive gamified platform to learn Japanese (JLPT N5 to N1) with AI tutoring, spaced-repetition flashcards, and live speaking practice.',
  manifest: '/manifest.json',
  keywords: ['MindForge', 'Yample Labs', 'Japanese learning', 'JLPT', 'hiragana', 'katakana', 'kanji'],
  authors: [{ name: 'Yample Labs', url: 'https://yamplelabs.com' }],
  icons: {
    icon: '/velmorth_logo.png',
    shortcut: '/velmorth_logo.png',
    apple: '/velmorth_logo.png',
  },
  openGraph: {
    title: 'MindForge — Powered by Yample Labs',
    description: 'Learn Japanese the smart way — AI + SRS + Speaking',
    url: 'https://mindforge.yamplelabs.com',
    siteName: 'MindForge',
    images: [{ url: '/velmorth_logo.png', width: 512, height: 512, alt: 'MindForge Logo' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'MindForge — Powered by Yample Labs',
    description: 'Learn Japanese the smart way — AI + SRS + Speaking',
    images: ['/velmorth_logo.png'],
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
        <link rel="icon" href="/velmorth_logo.png" />
        <link rel="apple-touch-icon" href="/velmorth_logo.png" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8150181705727957"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>
          <StoreProvider>
            <UpgradeDialogProvider>
              {children}
            </UpgradeDialogProvider>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}


