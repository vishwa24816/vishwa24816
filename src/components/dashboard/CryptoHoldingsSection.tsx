
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import type { PortfolioHolding, Stock } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin, XCircle, Coins, Landmark, Settings2, ChevronDown, BarChart2, LayoutGrid, List, PieChart, Repeat, Send, History, ArrowDownToLine } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';


export type WalletMode = 'exchange' | 'personal';
type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';

interface CryptoHoldingsSectionProps {
  holdings: PortfolioHolding[];
  title: string;
  isRealMode?: boolean;
  isPledged?: boolean;
  onAssetClick: (asset: Stock) => void;
  walletMode: WalletMode;
  setWalletMode: (mode: WalletMode) => void;
}

export function CryptoHoldingsSection({
  holdings,
  title,
  isRealMode = false,
  isPledged = false,
  onAssetClick,
  walletMode,
  setWalletMode,
}: CryptoHoldingsSectionProps) {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);
  const [pledgeDialogMode, setPledgeDialogMode] = useState<'pledge' | 'payback'>('pledge');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handlePledgeClick = (holding: PortfolioHolding, mode: 'pledge' | 'payback') => {
    setSelectedHoldingForPledge(holding);
    setPledgeDialogMode(mode);
    setPledgeDialogOpen(true);
  };

  const handleConfirmPledge = (holding: PortfolioHolding, quantity: number, mode: 'pledge' | 'payback') => {
      const actionText = mode === 'pledge' ? 'Pledged' : 'Payback initiated for';
      toast({
          title: "Action Submitted (Mock)",
          description: `${actionText} ${quantity} units of ${holding.symbol}.`,
      });
      setPledgeDialogOpen(false);
  };

  const totalCurrentValue = holdings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = holdings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;

  const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  const walletCardTitle = isRealMode ? 'Crypto Wallet' : 'Crypto & Web3 Wallet';
  const holdingsCardTitle = 'Crypto & Web3 Holdings';

  const chartData = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      fill: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`,
      label: pos.profitAndLoss >= 0 ? 'Profit' : 'Loss'
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
        <div className="p-6 text-center text-muted-foreground">
          You have no crypto assets.
        </div>
      );
    }
    switch(viewMode) {
      case 'list':
        return (
          <div className="mt-4">
            {holdings.map((holding) => (
              <HoldingCard 
                  key={holding.id} 
                  holding={holding} 
                  onPledgeClick={handlePledgeClick}
                  isPledged={isPledged}
                  onAssetClick={onAssetClick}
              />
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="w-full h-[300px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.ResponsiveContainer>
                <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} tickLine={false} axisLine={false} />
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
              </Chart.ResponsiveContainer>
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
              <Chart.ResponsiveContainer>
                <Chart.PieChart>
                    <Chart.Tooltip 
                      content={<Chart.TooltipContent hideLabel nameKey="name" />}
                      formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`}
                    />
                    <Chart.Pie data={chartData} dataKey="value" nameKey="name" />
                    <Chart.LegendContent />
                </Chart.PieChart>
              </Chart.ResponsiveContainer>
            </Chart.Container>
          </div>
        );
      default:
        return null;
    }
  };


  if(isPledged) {
    return (
        <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Bitcoin className="h-6 w-6 mr-2" /> {title}
                </CardTitle>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                    <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                    <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                    <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 pt-2 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                        <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(overallPandL)}
                        </p>
                        <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                        </div>
                        <div className="text-right">
                        <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(totalDayChangeAbsolute)}
                        </p>
                        <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Total Pledged Value</p>
                        <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Current Value</p>
                        <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                        </div>
                    </div>
                </div>
                 {holdings.length > 0 ? (
                    renderContent()
                ) : (
                     <div className="text-center py-10 text-muted-foreground">
                        <p>No Pledged {title.includes('Web3') ? 'Web3' : 'Crypto'} Holdings.</p>
                    </div>
                )}
            </CardContent>
             {selectedHoldingForPledge && (
                <PledgeDialog
                    isOpen={pledgeDialogOpen}
                    onOpenChange={setPledgeDialogOpen}
                    holding={selectedHoldingForPledge}
                    onConfirmPledge={handleConfirmPledge}
                    currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'INR' : 'INR'}
                    mode={pledgeDialogMode}
                />
            )}
        </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="w-full shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Bitcoin className="h-6 w-6 mr-2" /> {walletCardTitle}
            </CardTitle>
            <Button
              onClick={() => setWalletMode(walletMode === 'exchange' ? 'personal' : 'exchange')}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs capitalize flex items-center gap-2"
            >
              <Repeat className="h-4 w-4" />
              {walletMode}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(overallPandL)}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(totalDayChangeAbsolute)}
                  </p>
                  <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
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
              </div>
            </div>
             {walletMode === 'personal' && (
                <div className="pt-4 border-t grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => toast({title: "Send Action (WIP)"})}>
                        <Send className="mr-2 h-4 w-4" /> Send
                    </Button>
                    <Button variant="outline" onClick={() => toast({title: "Receive Action (WIP)"})}>
                        <ArrowDownToLine className="mr-2 h-4 w-4" /> Receive
                    </Button>
                    <Button variant="outline" onClick={() => toast({title: "History Action (WIP)"})}>
                        <History className="mr-2 h-4 w-4" /> History
                    </Button>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Coins className="h-6 w-6 mr-2" /> {holdingsCardTitle}
                </CardTitle>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                    <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                    <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                    <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
      {selectedHoldingForPledge && (
        <PledgeDialog
            isOpen={pledgeDialogOpen}
            onOpenChange={setPledgeDialogOpen}
            holding={selectedHoldingForPledge}
            onConfirmPledge={handleConfirmPledge}
            currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'INR' : 'INR'}
            mode={pledgeDialogMode}
        />
      )}
    </>
  );
}
