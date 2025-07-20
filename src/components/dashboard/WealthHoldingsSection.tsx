
"use client";

import React, { useState, useMemo } from 'react';
import type { PortfolioHolding } from '@/types';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { cn } from '@/lib/utils';
import { Landmark, BarChart2, LayoutGrid, List, PieChart } from 'lucide-react'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';
import { useToast } from "@/hooks/use-toast";


type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';

interface WealthHoldingsSectionProps {
  holdings: PortfolioHolding[];
  isPledged?: boolean;
}

export function WealthHoldingsSection({ holdings, isPledged = false }: WealthHoldingsSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);
  const [pledgeDialogMode, setPledgeDialogMode] = useState<'pledge' | 'payback'>('pledge');
  const { toast } = useToast();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
        style: 'currency', 
        currency: 'INR', 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(value);
  };
  
  const handlePledgeClick = (holding: PortfolioHolding, mode: 'pledge' | 'payback') => {
    setSelectedHoldingForPledge(holding);
    setPledgeDialogMode(mode);
    setPledgeDialogOpen(true);
  };

  const handleConfirmPledge = (holding: PortfolioHolding, quantity: number, mode: 'pledge' | 'payback') => {
      const actionText = mode === 'pledge' ? 'Pledged' : 'Payback initiated for';
      toast({
          title: `Action Submitted (Mock)`,
          description: `${actionText} ${quantity} units of ${holding.symbol}.`,
      });
      setPledgeDialogOpen(false);
  };

  const { totalCurrentValue, totalInvestmentValue, overallPandL, totalDayChangeAbsolute } = useMemo(() => {
    const totalCurrentValue = holdings.reduce((acc, holding) => acc + (holding.currentValue || 0), 0);
    const totalInvestmentValue = holdings.reduce((acc, holding) => acc + ((holding.avgCostPrice * holding.quantity) || 0), 0);
    const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + (holding.dayChangeAbsolute || 0), 0);
    const overallPandL = totalCurrentValue - totalInvestmentValue;
    
    return { totalCurrentValue, totalInvestmentValue, overallPandL, totalDayChangeAbsolute };
  }, [holdings]);
  
  const chartData = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      fill: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`,
      label: (pos.profitAndLoss || 0) >= 0 ? 'Profit' : 'Loss'
    }));
  }, [holdings]);
  
  const chartConfig = {
      value: {
        label: 'Current Value',
      },
       ...holdings.reduce((acc, pos) => {
        acc[pos.symbol || pos.name] = {
            label: pos.symbol || pos.name,
            color: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`
        };
        return acc;
    }, {} as any)
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      pnl: pos.profitAndLoss,
      pnlPercent: pos.profitAndLossPercent,
    }));
  }, [holdings]);

  const renderContent = () => {
    if (holdings.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          You have no wealth holdings (Mutual Funds, Bonds).
        </div>
      );
    }

    switch (viewMode) {
      case 'list':
        return (
          <div className="mt-4">
            {holdings.map((holding) => (
              <HoldingCard 
                  key={holding.id} 
                  holding={holding} 
                  onPledgeClick={handlePledgeClick}
                  isPledged={isPledged}
              />
            ))}
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
                    <Chart.LegendContent />
                </Chart.PieChart>
            </Chart.Container>
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
                      <Landmark className="h-6 w-6 mr-2" /> {isPledged ? 'Pledged Wealth' : 'Wealth Holdings'}
                  </CardTitle>
                  <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                      <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                      <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                      <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                      <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
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
                      <p className="text-muted-foreground">{isPledged ? 'Total Pledged Value' : 'Total Investment'}</p>
                      <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Current Value</p>
                      <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                    </div>
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
            currency={'INR'}
            mode={pledgeDialogMode}
        />
      )}
    </>
  );
}
