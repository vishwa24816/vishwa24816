
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  User,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { mockMarketIndices, mockCryptoAssets } from '@/lib/mockData';
import { SideMenu } from './SideMenu';

interface AppHeaderProps {
  searchMode?: 'Fiat' | 'Exchange' | 'Web3';
  onSearchModeChange?: (mode: 'Fiat' | 'Exchange' | 'Web3') => void;
  isRealMode?: boolean;
}

export function AppHeader({ searchMode, onSearchModeChange, isRealMode }: AppHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Default to collapsed

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      alert(`Searching for: ${searchTerm}`);
    }
  };

  const handleModeChange = (mode: 'Fiat' | 'Exchange' | 'Web3') => {
    if (onSearchModeChange && mode !== searchMode) {
        onSearchModeChange(mode);
        toast({
            title: 'Mode Switched',
            description: `Now in ${mode} mode.`,
        });
    }
  };
  
  const getPlaceholderText = () => {
    if (searchMode === 'Fiat') return "Search stocks, futures...";
    if (searchMode === 'Exchange') return "Search crypto spot, futures...";
    if (searchMode === 'Web3') return "Search Web3 assets...";
    return "Search...";
  };

  const searchPlaceholder = getPlaceholderText();
  const searchAriaLabel = `Search ${searchMode}`;
  
  const { marketOverviewTitle, marketOverviewItems } = useMemo(() => {
    let isCryptoView = false;
    if (isRealMode) {
        isCryptoView = true;
    } else {
        isCryptoView = searchMode === 'Exchange' || searchMode === 'Web3';
    }
    
    return {
      marketOverviewTitle: isCryptoView ? "Top Cryptocurrencies" : "Market Overview",
      marketOverviewItems: isCryptoView ? mockCryptoAssets.slice(0, 5) : mockMarketIndices,
    };
  }, [searchMode, isRealMode]);

  const hideFiatButton = isRealMode && (pathname === '/' || pathname === '/orders');

  if (!isMounted) {
    // Skeleton loader
    return (
      <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
          <div className="flex-1 h-9 bg-primary-foreground/10 rounded-md animate-pulse ml-4"></div>
          <div className="flex items-center space-x-1 sm:space-x-2 ml-4">
            <div className="h-9 w-9 bg-primary-foreground/10 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 rounded-b-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
                <SideMenu />
            </div>
            
            <form onSubmit={handleSearchSubmit} className="flex-1 items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-accent pointer-events-none" />
                <Input
                    type="search"
                    placeholder={searchPlaceholder}
                    className="bg-primary-foreground/10 border-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-0 text-primary-foreground placeholder:text-primary-foreground/70 h-9 pl-10 pr-3 rounded-md w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={searchAriaLabel}
                />
            </form>
            
            <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} className="hover:bg-primary-foreground/10 text-accent shrink-0">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open profile</span>
                </Button>
            </div>
        </div>

        {onSearchModeChange && (
            <div className="flex items-center justify-center pb-2">
                <div className="flex items-center rounded-md bg-primary-foreground/10 p-1 space-x-1 w-full">
                    {!hideFiatButton && (
                        <Button 
                            onClick={() => handleModeChange('Fiat')}
                            variant="ghost"
                            className={cn(
                                "h-7 px-3 text-xs rounded-md border-none flex-1",
                                searchMode === 'Fiat' 
                                    ? 'bg-primary-foreground/20 text-white shadow-sm' 
                                    : 'bg-transparent text-primary-foreground/70 hover:bg-primary-foreground/15'
                            )}
                        >
                            Fiat
                        </Button>
                    )}
                    <Button 
                        onClick={() => handleModeChange('Exchange')}
                        variant="ghost"
                        className={cn(
                            "h-7 px-3 text-xs rounded-md border-none flex-1",
                            searchMode === 'Exchange' 
                                ? 'bg-primary-foreground/20 text-white shadow-sm' 
                                : 'bg-transparent text-primary-foreground/70 hover:bg-primary-foreground/15'
                        )}
                    >
                        Exchange
                    </Button>
                    <Button 
                        onClick={() => handleModeChange('Web3')}
                        variant="ghost"
                        className={cn(
                            "h-7 px-3 text-xs rounded-md border-none flex-1",
                            searchMode === 'Web3' 
                                ? 'bg-primary-foreground/20 text-white shadow-sm' 
                                : 'bg-transparent text-primary-foreground/70 hover:bg-primary-foreground/15'
                        )}
                    >
                        Web3
                    </Button>
                </div>
            </div>
        )}

        <div className={cn(
            "transition-all duration-500 ease-in-out overflow-hidden",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
            <div className="pt-2 pb-4">
                <MarketOverview 
                    title={marketOverviewTitle}
                    items={marketOverviewItems}
                />
            </div>
        </div>
        
        <div 
          className="w-full h-4 flex justify-center items-center cursor-pointer group"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse header' : 'Expand header'}
        >
          <div className="w-8 h-1 bg-primary-foreground/30 rounded-full group-hover:bg-primary-foreground/60 transition-colors"></div>
        </div>
      </div>
    </header>
  );
}
