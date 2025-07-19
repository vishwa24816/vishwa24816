
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { mockPortfolioHoldings } from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase, BarChart2, LayoutGrid, List } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';


type HoldingFilterType = 'All' | 'Indian Stocks' | 'US Stocks' | 'Mutual Fund' | 'Bond';
type ViewMode = 'list' | 'bar' | 'heatmap';

interface FiatHoldingsSectionProps {
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function FiatHoldingsSection({ mainPortfolioCashBalance, setMainPortfolioCashBalance }: FiatHoldingsSectionProps) {
  const allHoldings = [...mockPortfolioHoldings.filter(h => h.type !== 'Crypto'), ...mockUsStocks.map(s => ({...s, type: 'Stock'} as PortfolioHolding))];
  const [activeFilter, setActiveFilter] = useState<HoldingFilterType>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { toast } = useToast();
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handlePledgeClick = (holding: PortfolioHolding) => {
    setSelectedHoldingForPledge(holding);
    setPledgeDialogOpen(true);
  };
  
  const handleConfirmPledge = (holding: PortfolioHolding, quantity: number) => {
      toast({
          title: "Pledge Submitted (Mock)",
          description: `Pledged ${quantity} units of ${holding.symbol}. Margin will be updated shortly.`,
      });
      setPledgeDialogOpen(false);
  };

  const filterOptions: { label: string; value: HoldingFilterType }[] = [
    { label: "All", value: "All" },
    { label: "Indian Stocks", value: "Indian Stocks" },
    { label: "US Stocks", value: "US Stocks" },
    { label: "Mutual Funds", value: "Mutual Fund" },
    { label: "Bonds", value: "Bond" },
  ];

  const filteredHoldings = allHoldings.filter(holding => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Indian Stocks') return (holding.type === 'Stock' || holding.type === 'ETF') && (holding.exchange === 'NSE' || holding.exchange === 'BSE');
    if (activeFilter === 'US Stocks') return (holding.type === 'Stock' || holding.type === 'ETF') && (holding.exchange === 'NASDAQ' || holding.exchange === 'NYSE');
    if (activeFilter === 'Mutual Fund') return holding.type === 'Mutual Fund';
    if (activeFilter === 'Bond') return holding.type === 'Bond';
    return false;
  });

  const totalCurrentValue = filteredHoldings.reduce((acc, holding) => acc + (holding.currentValue || (holding.price * holding.quantity)), 0);
  const totalInvestmentValue = filteredHoldings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  
  const totalDayChangeAbsolute = filteredHoldings.reduce((acc, holding) => acc + (holding.dayChangeAbsolute || (holding.change * holding.quantity)), 0);

  const chartData = useMemo(() => {
    return filteredHoldings.map(pos => ({
      name: pos.symbol || pos.name,
      value: (pos.currentValue || (pos.price * pos.quantity)),
      fill: (pos.profitAndLoss || 0) >= 0 ? "hsl(var(--positive))" : "hsl(var(--destructive))",
      label: (pos.profitAndLoss || 0) >= 0 ? 'Profit' : 'Loss'
    }));
  }, [filteredHoldings]);
  
  const chartConfig = {
      value: {
        label: 'Current Value',
      },
      Profit: {
        label: 'Profit',
        color: 'hsl(var(--positive))',
      },
      Loss: {
        label: 'Loss',
        color: 'hsl(var(--destructive))',
      },
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return filteredHoldings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue || (pos.price * pos.quantity),
      pnl: pos.profitAndLoss || 0,
      pnlPercent: pos.profitAndLossPercent || 0,
    }));
  }, [filteredHoldings]);

  const renderContent = () => {
    if (filteredHoldings.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No holdings match the selected filter.
        </div>
      );
    }

    switch (viewMode) {
      case 'list':
        return (
          <div className="mt-4">
            {filteredHoldings.map((holding) => (
              <HoldingCard 
                  key={holding.id} 
                  holding={holding} 
                  onPledgeClick={handlePledgeClick}
              />
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="w-full h-[300px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <Chart.XAxis type="number" hide />
                <Chart.YAxis type="category" dataKey="name" hide />
                <Chart.Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))'
                  }}
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
          <div className="w-full h-[300px] mt-4">
            <PortfolioHeatmap items={heatmapData} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="shadow-md">
          <CardHeader>
              <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                      <Briefcase className="h-6 w-6 mr-2" /> Fiat Holdings
                  </CardTitle>
                  <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                      <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                      <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                      <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                  </div>
              </div>
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

              {renderContent()}

          </CardContent>
      </Card>
      {selectedHoldingForPledge && (
        <PledgeDialog
            isOpen={pledgeDialogOpen}
            onOpenChange={setPledgeDialogOpen}
            holding={selectedHoldingForPledge}
            onConfirmPledge={handleConfirmPledge}
        />
      )}
    </>
  );
}
