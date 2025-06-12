
"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bot } from 'lucide-react';

export default function SimbotPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <Bot className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold mb-4">Simbot - AI Assistant</h1>
          <p className="text-muted-foreground mb-8">Your intelligent assistant for market insights and help.</p>
          <div className="bg-muted p-6 rounded-lg shadow">
             <p className="text-foreground">This page is currently under construction.</p>
             <p className="text-sm text-muted-foreground mt-2">The AI chatbot feature will be available soon!</p>
          </div>
          <Link href="/" className="mt-8">
            <Button>Go to Home</Button>
          </Link>
        </main>
      </div>
    </ProtectedRoute>
  );
}
