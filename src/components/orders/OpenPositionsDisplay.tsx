
"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition, Stock } from '@/types';
import { mockPortfolioHoldings, mockIntradayPositions, mockFoPositions, mockCryptoFutures, mockWeb3Holdings } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, InfoIcon, XCircle, Settings2, BarChart2, LayoutGrid, List, PieChart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PortfolioCategoryCard } from './PortfolioCategoryCard';
import { PortfolioHeatmap, type HeatmapItem } from '../dashboard/PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";

type PositionItem = PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;
type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';

interface OpenPositionsDisplayProps {
  fiatHoldings: PortfolioHolding[];
  wealthHoldings: PortfolioHolding[];
  cryptoHoldings: PortfolioHolding[];
  intradayPositions: IntradayPosition[];
  foPositions: FoPosition[];
  cryptoFutures: CryptoFuturePosition[];
  onCategoryClick: (category: 'Fiat' | 'Crypto') => void;
  onAssetClick: (asset: Stock) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};


export function OpenPositionsDisplay({
  fiatHoldings,
  wealthHoldings,
  cryptoHoldings,
  intradayPositions,
  foPositions,
  cryptoFutures,
  onCategoryClick,
  onAssetClick,
}: OpenPositionsDisplayProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const { categories, allItems } = React.useMemo(() => {
    const fiatItems = [...fiatHoldings, ...intradayPositions, ...foPositions];
    const wealthItems = [...wealthHoldings];
    const cryptoItems = [...cryptoHoldings, ...cryptoFutures];

    const categories = [
      { title: "Fiat Assets", items: fiatItems, category: 'Fiat' as const },
      { title: "Wealth Assets", items: wealthItems, category: 'Fiat' as const }, // Wealth is under Fiat
      { title: "Crypto Assets", items: cryptoItems, category: 'Crypto' as const },
    ].filter(cat => cat.items.length > 0);

    const allItems = [...fiatItems, ...wealthItems, ...cryptoItems];

    return { categories, allItems };
  }, [fiatHoldings, wealthHoldings, cryptoHoldings, intradayPositions, foPositions, cryptoFutures]);
  
  const totalItems = allItems.length;
  
  const chartData = useMemo(() => {
    return allItems.map(item => {
      const name = 'symbol' in item ? item.symbol : 'instrumentName' in item ? item.instrumentName : 'Unknown';
      let value = 0;
      if ('currentValue' in item) value = item.currentValue || 0;
      else if ('ltp' in item && 'quantity' in item) {
         value = item.ltp * ('lots' in item && item.lots && item.quantityPerLot ? item.lots * item.quantityPerLot : item.quantity);
      }
      return {
        name,
        value,
        fill: `hsl(var(--chart-${(name.charCodeAt(name.length - 1) % 5) + 1}))`,
      };
    }).filter(item => item.value > 0);
  }, [allItems]);

  const chartConfig = useMemo(() => {
      const config: any = {
          value: { label: 'Current Value' },
      };
      chartData.forEach(item => {
          config[item.name] = {
              label: item.name,
              color: item.fill,
          };
      });
      return config;
  }, [chartData]);


  const heatmapData: HeatmapItem[] = useMemo(() => {
    return allItems.map(item => {
      let pnl = 0;
      if ('pAndL' in item) pnl = item.pAndL;
      else if ('profitAndLoss' in item) pnl = item.profitAndLoss || 0;
      else if ('unrealizedPnL' in item) pnl = item.unrealizedPnL * 80;

      let value = 0;
      if ('currentValue' in item) value = item.currentValue || 0;
      else if ('ltp' in item && 'quantity' in item) {
          value = item.ltp * ('lots' in item && item.lots && item.quantityPerLot ? item.lots * item.quantityPerLot : item.quantity);
      }

      const investment = value - pnl;
      const pnlPercent = investment > 0 ? (pnl / investment) * 100 : 0;
      
      return {
        name: 'symbol' in item ? item.symbol : 'instrumentName' in item ? item.instrumentName : 'Unknown',
        value: value,
        pnl: pnl,
        pnlPercent: pnlPercent,
      };
    }).filter(item => item.value > 0);
  }, [allItems]);

  const renderContent = () => {
    switch (viewMode) {
      case 'list':
        return (
           <div className="space-y-4">
            {categories.map((category) => 
              <PortfolioCategoryCard
                key={category.title}
                title={category.title}
                items={category.items}
                onCategoryClick={() => onCategoryClick(category.category)}
                onAssetClick={onAssetClick}
              />
            )}
          </div>
        );
      case 'bar':
        return (
          <div className="w-full h-[400px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} tickLine={false} axisLine={false} />
                <Chart.Tooltip
                  cursor={false}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Chart.Legend content={<Chart.LegendContent />} />
                <Chart.Bar dataKey="value" radius={4} />
              </Chart.BarChart>
            </Chart.Container>
          </div>
        );
      case 'heatmap':
        return (
          <div className="w-full h-[400px] mt-4">
            <PortfolioHeatmap items={heatmapData} />
          </div>
        );
       case 'pie':
        return (
          <div className="w-full h-[400px] mt-4 flex items-center justify-center">
            <Chart.Container config={chartConfig} className="h-full w-full">
                <Chart.PieChart>
                    <Chart.Tooltip 
                      content={<Chart.TooltipContent hideLabel nameKey="name" />}
                      formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`}
                    />
                    <Chart.Pie data={chartData} dataKey="value" nameKey="name" />
                    <Chart.LegendContent />
                </Chart.PieChart>
            </Chart.Container>
          </div>
        );
      default:
        return null;
    }
  };

  if (totalItems === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No open positions or holdings found.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
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
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
