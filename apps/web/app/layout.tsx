import type { Metadata } from 'next';
import './globals.css';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Velmorth — Learn Japanese',
  description: 'Interactive and gamified platform to learn Japanese (JLPT N5 to N1) with AI tutoring and spaced-repetition flashcards.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <div id="root">
          <div id="app-shell">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
