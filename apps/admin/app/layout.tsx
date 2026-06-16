import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EVLO Admin Panel',
  description: 'EVLO Admin dashboard for managing lessons and users',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
