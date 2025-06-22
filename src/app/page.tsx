"use client";

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DemoDashboard } from '@/components/dashboard/DemoDashboard';
import { RealDashboard } from '@/components/dashboard/RealDashboard';
import { AppHeader } from '@/components/shared/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  // Default to 'Exchange' for the three-way toggle
  const [searchMode, setSearchMode] = useState<'Fiat' | 'Exchange' | 'Web3'>('Exchange');
  
  if (loading || !user) {
     return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <AppHeader searchMode={searchMode} onSearchModeChange={setSearchMode} />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-96 w-full" />
                </main>
                 <footer className="py-6 text-center text-sm text-muted-foreground border-t">
                    <Skeleton className="h-4 w-1/3 mx-auto" />
                </footer>
            </div>
        </ProtectedRoute>
      );
  }

  const isRealMode = user.id === 'REAL456';

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader 
          searchMode={searchMode}
          onSearchModeChange={setSearchMode}
        />
        {isRealMode ? <RealDashboard searchMode={searchMode} /> : <DemoDashboard />}
        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          © {new Date().getFullYear()} SIM - Stock Information &amp; Management. All rights reserved.
        </footer>
      </div>
    </ProtectedRoute>
  );
}
