
"use client";

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, List, BarChart2, PieChart, LayoutGrid } from 'lucide-react';
import { PortfolioCategoryCard } from './PortfolioCategoryCard';
import { Chart } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type PositionItem = PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;

interface OpenPositionsDisplayProps {
  fiatHoldings: PortfolioHolding[];
  wealthHoldings: PortfolioHolding[];
  cryptoHoldings: PortfolioHolding[];
  web3Holdings: PortfolioHolding[];
  intradayPositions: IntradayPosition[];
  foPositions: FoPosition[];
  cryptoFutures: CryptoFuturePosition[];
  onAssetClick: (asset: Stock) => void;
  onCategoryClick: (category: 'Fiat' | 'Wealth' | 'Crypto' | 'Web3') => void;
}

type ViewMode = 'list' | 'bar' | 'pie' | 'heatmap';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
};

export function OpenPositionsDisplay({
  fiatHoldings,
  wealthHoldings,
  cryptoHoldings,
  web3Holdings,
  intradayPositions,
  foPositions,
  cryptoFutures,
  onAssetClick,
  onCategoryClick,
}: OpenPositionsDisplayProps) {
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const categories = useMemo(() => {
    const fiatItems = [...fiatHoldings, ...intradayPositions, ...foPositions];
    const wealthItems = [...wealthHoldings];
    const cryptoItems = [...cryptoHoldings, ...cryptoFutures];
    const web3Items = [...web3Holdings];

    const calculateCategoryData = (items: PositionItem[]) => {
      let totalValue = 0;
      let totalPnl = 0;
      items.forEach(item => {
        if ('currentValue' in item) totalValue += item.currentValue;
        else if ('ltp' in item && 'quantity' in item) totalValue += item.ltp * ('lots' in item ? item.lots * item.quantityPerLot : item.quantity);

        if ('profitAndLoss' in item) totalPnl += item.profitAndLoss;
        else if ('pAndL' in item) totalPnl += item.pAndL;
        else if ('unrealizedPnL' in item) totalPnl += item.unrealizedPnL * 80;
      });
      return { totalValue, totalPnl };
    };

    return [
      { title: "Fiat Assets", items: fiatItems, category: 'Fiat' as const, ...calculateCategoryData(fiatItems) },
      { title: "Wealth Assets", items: wealthItems, category: 'Wealth' as const, ...calculateCategoryData(wealthItems) },
      { title: "Crypto Assets", items: cryptoItems, category: 'Crypto' as const, ...calculateCategoryData(cryptoItems) },
      { title: "Web3 Assets", items: web3Items, category: 'Web3' as const, ...calculateCategoryData(web3Items) },
    ].filter(cat => cat.items.length > 0);
  }, [fiatHoldings, wealthHoldings, cryptoHoldings, web3Holdings, intradayPositions, foPositions, cryptoFutures]);

  const chartData = useMemo(() => {
    return categories.map((cat, index) => ({
      name: cat.title,
      value: cat.totalValue,
      pnl: cat.totalPnl,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  }, [categories]);

  const chartConfig = {
    value: { label: 'Total Value' },
    ...chartData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as any)
  };
  
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  if (totalItems === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No open positions or holdings found.</p>
      </div>
    );
  }
  
  const renderContent = () => {
    switch(viewMode) {
        case 'bar':
            return (
                <div className="w-full h-[300px] mt-4">
                    <Chart.Container config={chartConfig} className="h-full w-full">
                        <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                            <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                            <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} tickLine={false} axisLine={false} />
                            <Chart.Tooltip cursor={false} contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value) => formatCurrency(value as number)} />
                            <Chart.Bar dataKey="value" radius={4} />
                        </Chart.BarChart>
                    </Chart.Container>
                </div>
            );
        case 'pie':
             return (
                <div className="w-full h-[300px] mt-4 flex items-center justify-center">
                    <Chart.Container config={chartConfig} className="h-full w-full">
                        <Chart.PieChart>
                            <Chart.Tooltip content={<Chart.TooltipContent hideLabel nameKey="name" />} formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`} />
                            <Chart.Pie data={chartData} dataKey="value" nameKey="name" />
                            <Chart.LegendContent />
                        </Chart.PieChart>
                    </Chart.Container>
                </div>
            );
        case 'heatmap':
            const totalPortfolioValue = chartData.reduce((acc, item) => acc + item.value, 0);
            return (
                <TooltipProvider delayDuration={100}>
                    <div className="flex flex-wrap gap-1 p-1 rounded-lg bg-muted/20 w-full min-h-[250px] content-start">
                        {chartData.map(item => {
                            const sizePercent = totalPortfolioValue > 0 ? (item.value / totalPortfolioValue) * 100 : 0;
                            const isPositive = item.pnl >= 0;
                            const pnlStrength = Math.min(Math.abs(item.pnl / item.value) * 10, 1) || 0; // Normalize PnL %
                            const colorIntensity = 400 + Math.floor(pnlStrength * 300);

                            return (
                                <Tooltip key={item.name}>
                                    <TooltipTrigger asChild>
                                        <div 
                                          style={{ flexBasis: `${sizePercent}%`, flexGrow: sizePercent }}
                                          className={cn(
                                            "p-2 rounded-md flex flex-col justify-between text-white flex-shrink-0 min-h-[70px] min-w-[90px] shadow-inner transition-all duration-300 border-2 border-transparent hover:border-primary/50 cursor-pointer",
                                            isPositive ? `bg-green-${colorIntensity}` : `bg-red-${colorIntensity}`
                                          )}
                                          onClick={() => onCategoryClick(categories.find(c => c.title === item.name)!.category)}
                                        >
                                          <span className={cn("text-xs font-semibold", colorIntensity > 600 ? "text-white" : "text-gray-800")}>{item.name.replace(' Assets','')}</span>
                                          <span className={cn("text-xs", colorIntensity > 600 ? "text-white/80" : "text-gray-700")}>
                                            {isPositive ? '+' : ''}{formatCurrency(item.pnl)}
                                          </span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{item.name}</p>
                                        <p>Value: {formatCurrency(item.value)}</p>
                                        <p>P&L: {formatCurrency(item.pnl)}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                </TooltipProvider>
            );
        case 'list':
        default:
             return (
                 <div className="space-y-4">
                    {categories.map((category) => 
                      category.items.length > 0 && (
                        <PortfolioCategoryCard
                          key={category.title}
                          title={category.title}
                          items={category.items}
                          onCategoryClick={() => onCategoryClick(category.category)}
                        />
                      )
                    )}
                </div>
            );
    }
  }


  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
          <Briefcase className="h-6 w-6 mr-2" />
          Asset Overview
        </CardTitle>
         <div className="flex items-center gap-1 rounded-md bg-muted p-1">
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
            <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
            <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
            <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
