
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
import type { Stock } from '@/types';
import { OrderPageDispatcher } from '@/components/order/OrderPageDispatcher';

export type MainView = 'home' | 'orders' | 'simbot' | 'screener' | 'community' | 'asset_order';

export default function DashboardRouterPage() {
  const { user, loading } = useAuth();
  const isRealMode = user?.id === 'REAL456';

  const [activeMainView, setActiveMainView] = useState<MainView>('home');
  const [previousMainView, setPreviousMainView] = useState<MainView>('home');
  const [activeMode, setActiveMode] = useState<'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3'>(isRealMode ? 'Crypto' : 'Portfolio');
  const [walletMode, setWalletMode] = useState<WalletMode>('hot');
  const [selectedAsset, setSelectedAsset] = useState<Stock | null>(null);
  
  useEffect(() => {
    if (isRealMode && (activeMode === 'Fiat' || activeMode === 'Portfolio')) {
      setActiveMode('Crypto');
    }
  }, [isRealMode, activeMode]);

  const handleNavigate = (view: MainView) => {
    if (view !== 'asset_order') {
        setPreviousMainView(activeMainView);
    }
    setActiveMainView(view);
    if(view !== 'asset_order') {
        setSelectedAsset(null); // Reset selected asset when changing main view
    }
  };

  const handleAssetClick = (asset: Stock) => {
    setPreviousMainView(activeMainView);
    setSelectedAsset(asset);
    setActiveMainView('asset_order');
  };

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
          <RealDashboard activeMode={activeMode} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={handleAssetClick} />
        ) : (
          <DemoDashboard activeMode={activeMode} onModeChange={setActiveMode} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={handleAssetClick}/>
        );
      case 'orders':
        return <OrdersPageContent onAssetClick={handleAssetClick} activeMode={activeMode} />;
      case 'simbot':
        return <SimbotPageContent />;
      case 'screener':
        return <ScreenerPageContent onAssetClick={onAssetClick} />;
      case 'community':
        return <CommunityPageContent onAssetClick={onAssetClick}/>;
      case 'asset_order':
        if (selectedAsset) {
          return <OrderPageDispatcher asset={selectedAsset} onBack={() => handleNavigate(previousMainView)} />;
        }
        // Fallback to home if no asset is selected
        return isRealMode ? <RealDashboard activeMode={activeMode} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={handleAssetClick} /> : <DemoDashboard activeMode={activeMode} onModeChange={setActiveMode} walletMode={walletMode} setWalletMode={setWalletMode} onAssetClick={handleAssetClick}/>;
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
      <AppFooter activeView={activeMainView} onNavigate={handleNavigate} />
    </ProtectedRoute>
  );
}
