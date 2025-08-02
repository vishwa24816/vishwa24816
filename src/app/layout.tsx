
"use client";

import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { useEffect } from 'react';

// export const metadata: Metadata = {
//   title: 'SIM - Stock Information & Management',
//   description: 'Real-time Indian stock market data, watchlists, and AI news summaries.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    const savedTheme = localStorage.getItem('sim-theme') || 'blue';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SIM - Stock Information & Management</title>
        <meta name="description" content="Real-time Indian stock market data, watchlists, and AI news summaries." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
