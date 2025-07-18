
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { mockPortfolioHoldings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase, Info, XCircle, Settings2, BarChart2, LayoutGrid, Table2, ChevronDown } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';

type HoldingFilterType = 'All' | 'Stock' | 'Mutual Fund' | 'Bond';

interface FiatHoldingsSectionProps {
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
}


const HoldingRow = ({ holding, onAdjust, onExit }: { holding: PortfolioHolding, onAdjust: () => void, onExit: () => void }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    const isProfit = holding.profitAndLoss >= 0;
    const isDayProfit = holding.dayChangeAbsolute >= 0;

    return (
        <Card className="mb-2 shadow-sm transition-all duration-300">
            <div 
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{holding.name}</p>
                    <p className="text-xs text-muted-foreground">{holding.symbol}</p>
                </div>
                <div className="text-right ml-2 shrink-0">
                    <p className={cn("text-sm font-medium", isProfit ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(holding.profitAndLoss)}
                    </p>
                    <p className="text-xs text-muted-foreground">({holding.profitAndLossPercent.toFixed(2)}%)</p>
                </div>
                <ChevronDown className={cn("h-4 w-4 ml-3 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
            </div>

            {isExpanded && (
                <div className="border-t px-3 py-3 space-y-3 animate-accordion-down">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium text-foreground">{holding.quantity.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">Avg. Cost</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.avgCostPrice)}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">LTP</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.ltp)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-muted-foreground">Current Value</p>
                            <p className="font-medium text-foreground">{formatCurrency(holding.currentValue)}</p>
                        </div>
                         <div>
                            <p className="text-muted-foreground">Day's P&L</p>
                            <p className={cn("font-medium", isDayProfit ? 'text-green-600' : 'text-red-600')}>
                                {formatCurrency(holding.dayChangeAbsolute)} ({holding.dayChangePercent.toFixed(2)}%)
                            </p>
                        </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 justify-center" onClick={onAdjust}>
                            <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                        </Button>
                        <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={onExit}>
                            <XCircle className="mr-2 h-4 w-4" /> Exit Position
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};


export function FiatHoldingsSection({ mainPortfolioCashBalance, setMainPortfolioCashBalance }: FiatHoldingsSectionProps) {
  const holdings = mockPortfolioHoldings.filter(h => h.type !== 'Crypto');
  const [activeFilter, setActiveFilter] = useState<HoldingFilterType>('All');
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const handleAdjustPosition = (holding: PortfolioHolding) => {
      let path = `/order/stock/${encodeURIComponent(holding.symbol || holding.name)}`;
      if (holding.type === 'Mutual Fund') {
          path = `/order/mutual-fund/${encodeURIComponent(holding.symbol || holding.name)}`;
      } else if (holding.type === 'Bond') {
          path = `/order/bond/${encodeURIComponent(holding.symbol || holding.name)}`;
      }
      router.push(path);
  };

  const handleExitPosition = (holding: PortfolioHolding) => {
    toast({
      title: `Exiting Position (Mock): ${holding.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const filterOptions: { label: string; value: HoldingFilterType }[] = [
    { label: "All", value: "All" },
    { label: "Stocks", value: "Stock" },
    { label: "Mutual Funds", value: "Mutual Fund" },
    { label: "Bonds", value: "Bond" },
  ];

  const filteredHoldings = holdings.filter(holding => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Stock') return holding.type === 'Stock' || holding.type === 'ETF';
    if (activeFilter === 'Mutual Fund') return holding.type === 'Mutual Fund';
    if (activeFilter === 'Bond') return holding.type === 'Bond';
    return false;
  });

  const totalCurrentValue = filteredHoldings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = filteredHoldings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  
  const totalDayChangeAbsolute = filteredHoldings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);

  return (
    <Card className="shadow-md">
        <CardHeader>
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                <Briefcase className="h-6 w-6 mr-2" /> Fiat Holdings
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="space-y-3 pt-2 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                      {formatCurrency(overallPandL)}
                    </p>
                    <p className="text-xs text-muted-foreground">Overall P&L</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                      {formatCurrency(totalDayChangeAbsolute)}
                    </p>
                    <p className="text-xs text-muted-foreground">Day's P&L</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Total Investment</p>
                    <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Current Value</p>
                    <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <p className="text-muted-foreground">Cash Balance</p>
                    <p className="font-medium text-foreground">{formatCurrency(mainPortfolioCashBalance)}</p>
                  </div>
                </div>
            </div>
            
            <div className="border-b border-border">
                <div className="flex space-x-1 overflow-x-auto whitespace-nowrap pb-0 no-scrollbar">
                {filterOptions.map((option) => (
                    <Button
                    key={option.value}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "px-3 py-1.5 h-auto text-xs font-medium rounded-t-md rounded-b-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        "border-b-2 hover:bg-transparent",
                        activeFilter === option.value
                        ? "text-primary border-primary font-semibold"
                        : "text-muted-foreground border-transparent hover:text-primary hover:border-primary/30"
                    )}
                    onClick={() => setActiveFilter(option.value)}
                    >
                    {option.label}
                    </Button>
                ))}
                </div>
            </div>

            <div className="mt-4">
                {filteredHoldings.length > 0 ? (
                    filteredHoldings.map((holding) => (
                       <HoldingRow 
                            key={holding.id} 
                            holding={holding} 
                            onAdjust={() => handleAdjustPosition(holding)}
                            onExit={() => handleExitPosition(holding)}
                        />
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        No holdings match the selected filter.
                    </div>
                )}
            </div>

        </CardContent>
    </Card>
  );
}
