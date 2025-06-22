
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Search,
  User,
  Repeat,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { mockMarketIndices, mockCryptoAssets } from '@/lib/mockData';
import { SideMenu } from './SideMenu';

interface AppHeaderProps {
  searchMode: 'Fiat' | 'Exchange' | 'Web3';
  onSearchModeChange: (mode: 'Fiat' | 'Exchange' | 'Web3') => void;
  isRealMode: boolean;
}

export function AppHeader({ searchMode, onSearchModeChange, isRealMode }: AppHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

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
    if (mode === searchMode) return;
    onSearchModeChange(mode);
    toast({
        title: 'Mode Switched',
        description: `Now in ${mode} mode.`,
    });
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


  if (!isMounted) {
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
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative pb-4 cursor-pointer"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex h-20 items-center justify-between gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
                <SideMenu />
            </div>
            <form onSubmit={handleSearchSubmit} className="flex-1 items-center relative" onClick={(e) => e.stopPropagation()}>
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
            <div className="flex items-center space-x-1 sm:space-x-2" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-9 px-3 hover:bg-primary-foreground/20 text-accent shrink-0"
                        >
                            <Repeat className="h-4 w-4 mr-2" />
                            {searchMode}
                            <ChevronDown className="h-4 w-4 ml-1 opacity-75" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleModeChange('Fiat')}>Fiat</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleModeChange('Exchange')}>Exchange</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleModeChange('Web3')}>Web3</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} className="hover:bg-primary-foreground/10 text-accent shrink-0">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open profile</span>
                </Button>
            </div>
        </div>

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
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-5 rounded-b-md bg-primary/80 flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="w-6 h-1 bg-accent/70 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
