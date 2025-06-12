
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { AppFooter } from '@/components/shared/AppFooter';

export const metadata: Metadata = {
  title: 'SIM - Stock Information & Management',
  description: 'Real-time Indian stock market data, watchlists, and AI news summaries.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <div className="pb-16"> {/* Add padding for the fixed footer */}
            {children}
          </div>
          <Toaster />
          <AppFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
