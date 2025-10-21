
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { DemoDashboard } from '@/components/dashboard/DemoDashboard';
import { RealDashboard } from '@/components/dashboard/RealDashboard';
import { AppHeader } from '@/components/shared/AppHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { OrdersPageContent } from '@/components/orders/OrdersPageContent';
import { SimbotPageContent } from '@/components/simbot/SimbotPageContent';
import { ScreenerPageContent } from '@/components/screener/ScreenerPageContent';
import { CommunityPageContent } from '@/components/community/CommunityPageContent';
import { AnalyticsPageContent } from '@/components/analytics/AnalyticsPageContent';
import { AppFooter } from '@/components/shared/AppFooter';
import type { Stock } from '@/types';
import { OrderPageDispatcher } from '@/components/order/OrderPageDispatcher';
import { SimbotInputBar } from '@/components/simbot/SimbotInputBar';
import { OrderPageFooter } from '@/components/shared/OrderPageFooter';
import { cn } from '@/lib/utils';
import { BacktesterPageContent } from '@/app/backtester/page';
import { SimballPageContent } from '@/app/simball/page';
import { TaxyPageContent } from '@/app/taxy/page';
import { FamilyAccountPageContent } from './family/page';
import { GiftPageContent } from './gift/page';
import { SupportPageContent } from './support/page';
import { DXBallGame } from '@/components/simball/DXBallGame';
import { NoCodeAlgoPageContent } from '@/app/nocode-algo/page';


export type MainView = 'home' | 'orders' | 'simbot' | 'screener' | 'community' | 'asset_order' | 'analytics' | 'backtester' | 'simball' | 'taxy' | 'family' | 'gift' | 'support' | 'nocode_algo' | 'strategy_builder';

export interface InitialOrderDetails {
    quantity?: number;
    orderType?: string; // 'SIP' etc.
    sipAmount?: number;
    sipFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Annually';
    leverage?: number;
    legs?: any[];
    targetView?: string;
    navigationTarget?: string;
}

export default function DashboardRouterPage() {
  const { user, loading, isRealMode } = useAuth();

  const [activeMainView, setActiveMainView] = useState<MainView>('home');
  const [previousMainView, setPreviousMainView] = useState<MainView>('home');
  const [activeMode, setActiveMode] = useState<'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3'>(isRealMode ? 'Portfolio' : 'Portfolio');
  const [selectedAsset, setSelectedAsset] = useState<Stock | null>(null);
  const [initialOrderDetails, setInitialOrderDetails] = useState<InitialOrderDetails | null>(null);
  const [productTypeForOrder, setProductTypeForOrder] = useState('Delivery');
  
  const [activeSimballGame, setActiveSimballGame] = useState<number | null>(null);

  const handleModeChange = (mode: 'Portfolio' | 'Fiat' | 'Wealth' | 'Crypto' | 'Web3') => {
      if (isRealMode && mode === 'Fiat') {
          setActiveMode('Portfolio'); // Default to portfolio in real mode if Fiat is clicked
      } else {
          setActiveMode(mode);
      }
  };

  const handleNavigate = (view: MainView) => {
    if (view !== 'asset_order') {
        setPreviousMainView(activeMainView);
    }
    setActiveMainView(view);
    if(view !== 'asset_order') {
        setSelectedAsset(null); // Reset selected asset when changing main view
        setInitialOrderDetails(null); // Reset order details
    }
  };

  const handleAssetClick = (asset: Stock, details?: InitialOrderDetails) => {
    if (details?.navigationTarget === 'strategy-builder' || details?.legs) {
        setPreviousMainView(activeMainView);
        if (details.targetView === 'Crypto') {
            handleModeChange('Crypto');
        } else {
            handleModeChange('Fiat');
        }
        // A bit of a hack to ensure mode state updates before rendering the builder
        setTimeout(() => {
            handleNavigate('strategy_builder');
            setInitialOrderDetails(details);
        }, 0);
        return;
    }

    setPreviousMainView(activeMainView);
    setSelectedAsset(asset);
    setInitialOrderDetails(details || null);
    setActiveMainView('asset_order');
  };
  
  const handleLaunchSimball = (brokerage: number) => {
    setActiveSimballGame(brokerage);
  }
  
  const handleEndSimball = () => {
    setActiveSimballGame(null);
  }

  if (loading || !user) {
     return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen">
                <AppHeader activeMode={activeMode} onModeChange={handleModeChange} isRealMode={false} onNavigate={handleNavigate} />
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
  
  if (activeSimballGame !== null) {
    return (
        <ProtectedRoute>
            <DXBallGame 
                brickCount={activeSimballGame}
                onGameEnd={handleEndSimball}
            />
        </ProtectedRoute>
    );
  }
  
  const showModeSwitcher = !['orders', 'screener', 'simbot', 'analytics', 'backtester', 'simball', 'taxy', 'family', 'gift', 'support', 'nocode_algo', 'strategy_builder'].includes(activeMainView);

  const shouldShowOrderFooter = 
    activeMainView === 'asset_order' && 
    selectedAsset?.exchange?.toLowerCase().includes('mf') === false &&
    selectedAsset?.exchange?.toLowerCase().includes('bond') === false;

  const shouldShowSimbotOnlyFooter = 
    (activeMainView === 'asset_order' &&
    (selectedAsset?.exchange?.toLowerCase().includes('mf') === true ||
     selectedAsset?.exchange?.toLowerCase().includes('bond') === true)) ||
     activeMainView === 'nocode_algo';

  const getPaddingBottom = () => {
    if (shouldShowOrderFooter) return 'pb-[120px]'; // Space for OrderPageFooter
    if (shouldShowSimbotOnlyFooter) return 'pb-[60px]'; // Space for Simbot only footer
    if (activeMainView !== 'simbot') return 'pb-16'; // Space for AppFooter
    return 'pb-16'; 
  }
  
  const noFooterViews: MainView[] = ['backtester', 'simball', 'taxy', 'family', 'gift', 'support', 'strategy_builder'];
  const showAppFooter = !shouldShowOrderFooter && !shouldShowSimbotOnlyFooter && activeMainView !== 'asset_order' && !noFooterViews.includes(activeMainView);

  const renderContent = () => {
    switch (activeMainView) {
      case 'home':
        return isRealMode ? (
          <RealDashboard activeMode={activeMode} onAssetClick={handleAssetClick} />
        ) : (
          <DemoDashboard activeMode={activeMode} onModeChange={handleModeChange} onAssetClick={handleAssetClick}/>
        );
      case 'orders':
        return <OrdersPageContent onAssetClick={handleAssetClick} activeMode={activeMode} onNavigate={handleNavigate} />;
      case 'simbot':
        return <SimbotPageContent onNavigateRequest={handleAssetClick} />;
      case 'screener':
        return <ScreenerPageContent onAssetClick={handleAssetClick} />;
      case 'community':
        return <CommunityPageContent onAssetClick={handleAssetClick} activeMode={activeMode} />;
      case 'analytics':
        return <AnalyticsPageContent />;
      case 'nocode_algo':
        return <NoCodeAlgoPageContent onNavigate={handleNavigate} />;
      case 'backtester':
        return <BacktesterPageContent />;
      case 'simball':
        return <SimballPageContent onPlayGame={handleLaunchSimball} />;
      case 'taxy':
        return <TaxyPageContent />;
      case 'family':
        return <FamilyAccountPageContent />;
      case 'gift':
        return <GiftPageContent />;
      case 'support':
        return <SupportPageContent />;
      case 'strategy_builder':
         return isRealMode ? (
          <RealDashboard activeMode={activeMode} onAssetClick={handleAssetClick} />
        ) : (
          <DemoDashboard activeMode={activeMode} onModeChange={handleModeChange} onAssetClick={handleAssetClick}/>
        );
      case 'asset_order':
        if (selectedAsset) {
          return <OrderPageDispatcher asset={selectedAsset} onBack={() => handleNavigate(previousMainView)} initialDetails={initialOrderDetails} productType={productTypeForOrder} onProductTypeChange={setProductTypeForOrder} />;
        }
        // Fallback to home if no asset is selected
        return isRealMode ? <RealDashboard activeMode={activeMode} onAssetClick={handleAssetClick} /> : <DemoDashboard activeMode={activeMode} onModeChange={handleModeChange} onAssetClick={handleAssetClick}/>;
      default:
        return null;
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        {activeMainView !== 'nocode_algo' && (
          <AppHeader 
            activeMode={activeMode}
            onModeChange={showModeSwitcher ? handleModeChange : undefined}
            isRealMode={isRealMode}
            onNavigate={handleNavigate}
          />
        )}
        <div className={cn("flex-grow overflow-y-auto", getPaddingBottom())}>
            {renderContent()}
        </div>
      </div>
      {shouldShowOrderFooter ? (
        <OrderPageFooter 
          asset={selectedAsset}
          productType={productTypeForOrder}
          onNavigateRequest={handleAssetClick}
        />
      ) : shouldShowSimbotOnlyFooter ? (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border rounded-t-2xl shadow-lg p-2">
            <SimbotInputBar onNavigateRequest={handleAssetClick} isRealMode={isRealMode} />
        </footer>
      ) : showAppFooter ? (
         <AppFooter activeView={activeMainView} onNavigate={handleNavigate} />
      ) : null}
    </ProtectedRoute>
  );
}
