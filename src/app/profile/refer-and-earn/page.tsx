
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function ReferAndEarnPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Refer and Earn</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
                <Gift className="mx-auto h-12 w-12 text-primary mb-4" />
                <p className="text-lg">Refer friends and earn rewards!</p>
                <p className="text-sm mt-2">(Referral program details coming soon)</p>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
