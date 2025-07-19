
"use client";

import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DemoDashboard } from '@/components/dashboard/DemoDashboard';
import { RealDashboard } from '@/components/dashboard/RealDashboard';
import { AppHeader } from '@/components/shared/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  const isRealMode = user?.id === 'REAL456';

  const [activeMode, setActiveMode] = useState<'Portfolio' | 'Fiat' | 'Crypto' | 'Web3'>(isRealMode ? 'Crypto' : 'Portfolio');
  
  useEffect(() => {
    if (isRealMode && (activeMode === 'Fiat' || activeMode === 'Portfolio')) {
      setActiveMode('Crypto');
    }
  }, [isRealMode, activeMode]);

  if (loading || !user) {
     return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <AppHeader activeMode={activeMode} onModeChange={setActiveMode} isRealMode={false} />
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
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader 
          activeMode={activeMode}
          onModeChange={setActiveMode}
          isRealMode={isRealMode}
        />
        {isRealMode ? <RealDashboard activeMode={activeMode} /> : <DemoDashboard activeMode={activeMode} />}
      </div>
    </ProtectedRoute>
  );
}
