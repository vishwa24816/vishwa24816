
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { Briefcase, List, BarChart2, LayoutGrid, PieChart } from 'lucide-react';
import { PortfolioCategoryCard } from './PortfolioCategoryCard';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Chart } from "@/components/ui/chart";
import { PortfolioHeatmap, type HeatmapItem } from '@/components/dashboard/PortfolioHeatmap';

type PositionItem = PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;
type ViewMode = 'list' | 'bar' | 'pie' | 'heatmap';

interface OpenPositionsDisplayProps {
  fiatHoldings: PortfolioHolding[];
  wealthHoldings: PortfolioHolding[];
  cryptoHoldings: PortfolioHolding[];
  web3Holdings: PortfolioHolding[];
  intradayPositions: IntradayPosition[];
  foPositions: FoPosition[];
  cryptoFutures: CryptoFuturePosition[];
  onCategoryClick: (category: 'Fiat' | 'Crypto' | 'Wealth' | 'Web3' | 'Pledged') => void;
  onAssetClick: (asset: Stock) => void;
}

const formatCurrency = (value: number, currency: 'INR' | 'USDT' = 'INR') => {
  if (currency === 'USDT') return `${value.toFixed(2)} USDT`;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
  onCategoryClick,
  onAssetClick,
}: OpenPositionsDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const categories = React.useMemo(() => {
    const fiatItems: PositionItem[] = [...fiatHoldings, ...intradayPositions, ...foPositions];
    const wealthItems: PositionItem[] = [...wealthHoldings];
    const cryptoItems: PositionItem[] = [...cryptoHoldings, ...cryptoFutures];
    const web3Items: PositionItem[] = [...web3Holdings];

    return [
      { title: "Fiat Assets", items: fiatItems, category: 'Fiat' as const },
      { title: "Wealth Assets", items: wealthItems, category: 'Wealth' as const },
      { title: "Crypto Assets", items: cryptoItems, category: 'Crypto' as const },
      { title: "Web3 Assets", items: web3Items, category: 'Web3' as const },
    ].filter(cat => cat.items.length > 0);
  }, [fiatHoldings, wealthHoldings, cryptoHoldings, web3Holdings, intradayPositions, foPositions, cryptoFutures]);

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  const chartData = useMemo(() => {
    return categories.map((category, index) => {
      const totalValue = category.items.reduce((acc, item) => {
        if ('currentValue' in item) return acc + item.currentValue;
        if ('ltp' in item && 'quantity' in item) {
          const qty = 'lots' in item ? item.lots * item.quantityPerLot : item.quantity;
          return acc + (item.ltp * qty);
        }
        return acc;
      }, 0);

      return {
        name: category.title.replace(' Assets', ''),
        value: totalValue,
        fill: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
  }, [categories]);

  const chartConfig = {
      value: {
        label: 'Current Value',
      },
      ...chartData.reduce((acc, item) => {
        acc[item.name] = {
            label: item.name,
            color: item.fill
        };
        return acc;
    }, {} as any)
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return categories.map(category => {
      let totalValue = 0;
      let totalPnl = 0;

      category.items.forEach(item => {
        if ('currentValue' in item) totalValue += item.currentValue;
        else if ('ltp' in item && 'quantity' in item) {
          const qty = 'lots' in item ? item.lots * item.quantityPerLot : item.quantity;
          totalValue += item.ltp * qty;
        }

        if ('profitAndLoss' in item && item.profitAndLoss) totalPnl += item.profitAndLoss;
        else if ('pAndL' in item && item.pAndL) totalPnl += item.pAndL;
        else if ('unrealizedPnL' in item && item.unrealizedPnL) totalPnl += item.unrealizedPnL * 83; // Approx INR conversion
      });
      
      const totalInvestment = totalValue - totalPnl;

      return {
        name: category.title.replace(' Assets', ''),
        value: totalValue,
        pnl: totalPnl,
        pnlPercent: totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0,
      };
    });
  }, [categories]);


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
      case 'list':
        return (
          <div className="space-y-4">
            {categories.map((category) => 
              <PortfolioCategoryCard
                key={category.title}
                title={category.title}
                items={category.items}
                onCategoryClick={() => onCategoryClick(category.category)}
              />
            )}
          </div>
        );
      case 'bar':
        return (
          <div className="w-full h-[300px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} tickLine={false} axisLine={false} />
                <Chart.Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
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
                    <Chart.Tooltip 
                      content={<Chart.TooltipContent hideLabel nameKey="name" />}
                      formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`}
                    />
                    <Chart.Pie data={chartData} dataKey="value" nameKey="name" />
                </Chart.PieChart>
            </Chart.Container>
          </div>
        );
      case 'heatmap':
        return (
          <div className="w-full h-[300px] mt-4">
            <PortfolioHeatmap items={heatmapData} />
          </div>
        );
      default:
        return null;
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
            <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
            <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
