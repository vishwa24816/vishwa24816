
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DemoDashboard } from '@/components/dashboard/DemoDashboard';
import { RealDashboard } from '@/components/dashboard/RealDashboard';
import { AppHeader } from '@/components/shared/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import type { WalletMode } from '@/components/dashboard/CryptoHoldingsSection';
import { OrdersPageContent } from '@/components/orders/OrdersPageContent';
import { SimbotPageContent } from '@/components/simbot/SimbotPageContent';
import { ScreenerPageContent } from '@/components/screener/ScreenerPageContent';
import { CommunityPageContent } from '@/components/community/CommunityPageContent';
import { AppFooter } from '@/components/shared/AppFooter';

export type MainView = 'home' | 'orders' | 'simbot' | 'screener' | 'community';

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  const isRealMode = user?.id === 'REAL456';

  const [activeMainView, setActiveMainView] = useState<MainView>('home');
  const [activeMode, setActiveMode] = useState<'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3'>(isRealMode ? 'Crypto' : 'Portfolio');
  const [walletMode, setWalletMode] = useState<WalletMode>('hot');
  
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

  const renderContent = () => {
    switch (activeMainView) {
      case 'home':
        return isRealMode ? (
          <RealDashboard activeMode={activeMode} />
        ) : (
          <DemoDashboard activeMode={activeMode} onModeChange={setActiveMode} walletMode={walletMode} setWalletMode={setWalletMode} />
        );
      case 'orders':
        return <OrdersPageContent />;
      case 'simbot':
        return <SimbotPageContent />;
      case 'screener':
        return <ScreenerPageContent />;
      case 'community':
        return <CommunityPageContent />;
      default:
        return null;
    }
  }
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen pb-16">
        <AppHeader 
          activeMode={activeMode}
          onModeChange={setActiveMode}
          isRealMode={isRealMode}
          walletMode={walletMode}
        />
        {renderContent()}
      </div>
      <AppFooter activeView={activeMainView} onNavigate={setActiveMainView} />
    </ProtectedRoute>
  );
}
