
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { mockPortfolioHoldings } from '@/lib/mockData';
import { mockUsStocks } from '@/lib/mockData/usStocks';
import type { PortfolioHolding, IntradayPosition, FoPosition } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase, BarChart2, LayoutGrid, List, Coins, Landmark, PieChart } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';
import { FundTransferDialog } from '../shared/FundTransferDialog';


type HoldingFilterType = 'All' | 'Indian Stocks' | 'US Stocks' | 'Mutual Fund' | 'Bond';
type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';

interface FiatHoldingsSectionProps {
  holdings?: PortfolioHolding[];
  title?: string;
  intradayPositions: IntradayPosition[];
  foPositions: FoPosition[];
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
  cryptoCashBalance: number;
  setCryptoCashBalance: React.Dispatch<React.SetStateAction<number>>;
  isPledged?: boolean;
}

export function FiatHoldingsSection({ 
    holdings,
    title = "Fiat Holdings",
    intradayPositions,
    foPositions,
    mainPortfolioCashBalance, 
    setMainPortfolioCashBalance, 
    cryptoCashBalance, 
    setCryptoCashBalance,
    isPledged = false
}: FiatHoldingsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<HoldingFilterType>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { toast } = useToast();
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);
  const [pledgeDialogMode, setPledgeDialogMode] = useState<'pledge' | 'payback'>('pledge');
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');

  const allHoldings = useMemo(() => {
    if (holdings) return holdings;
    return mockPortfolioHoldings.filter(h => h.type === 'Stock' || h.type === 'ETF' || h.type === 'Mutual Fund' || h.type === 'Bond');
  }, [holdings]);

  const formatCurrency = (value: number, currency: 'INR' | 'USD' = 'INR') => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { 
        style: 'currency', 
        currency: currency, 
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

  const handleOpenFundTransferDialog = (direction: 'toCrypto' | 'fromCrypto') => {
    setTransferDirection(direction);
    setIsFundTransferDialogOpen(true);
  };
  
  const handleTransferConfirm = (amount: number, direction: 'toCrypto' | 'fromCrypto') => {
    if (direction === 'toCrypto') {
      setMainPortfolioCashBalance(prev => prev - amount);
      setCryptoCashBalance(prev => prev + amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount, 'INR')} transferred to Crypto Wallet.` });
    } else { // fromCrypto
      setMainPortfolioCashBalance(prev => prev + amount);
      setCryptoCashBalance(prev => prev - amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount, 'INR')} transferred to Main Portfolio.` });
    }
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

  const { totalCurrentValue, totalInvestmentValue, overallPandL, totalDayChangeAbsolute } = useMemo(() => {
    let holdingsCurrentValue = filteredHoldings.reduce((acc, holding) => acc + (holding.currentValue || 0), 0);
    let holdingsInvestmentValue = filteredHoldings.reduce((acc, holding) => acc + ((holding.avgCostPrice * holding.quantity) || 0), 0);
    let holdingsDayChange = filteredHoldings.reduce((acc, holding) => acc + (holding.dayChangeAbsolute || 0), 0);

    // Only include positions if the filter is 'All' or matches the position type (e.g., 'Indian Stocks')
    let intradayInvestment = 0;
    let intradayCurrentValue = 0;
    let intradayDayChange = 0;

    let foInvestment = 0;
    let foCurrentValue = 0;
    let foDayChange = 0;

    if (activeFilter === 'All' || activeFilter === 'Indian Stocks') {
        intradayInvestment = intradayPositions.reduce((acc, pos) => acc + pos.avgPrice * pos.quantity, 0);
        intradayCurrentValue = intradayPositions.reduce((acc, pos) => acc + pos.ltp * pos.quantity, 0);
        intradayDayChange = intradayPositions.reduce((acc, pos) => acc + pos.pAndL, 0);
        
        foInvestment = foPositions.reduce((acc, pos) => acc + pos.avgPrice * pos.lots * pos.quantityPerLot, 0);
        foCurrentValue = foPositions.reduce((acc, pos) => acc + pos.ltp * pos.lots * pos.quantityPerLot, 0);
        foDayChange = foPositions.reduce((acc, pos) => acc + pos.mtmPnl, 0);
    }
    
    const totalCurrentValue = holdingsCurrentValue + intradayCurrentValue + foCurrentValue;
    const totalInvestmentValue = holdingsInvestmentValue + intradayInvestment + foInvestment;
    const overallPandL = totalCurrentValue - totalInvestmentValue;
    const totalDayChangeAbsolute = holdingsDayChange + intradayDayChange + foDayChange;
    
    return { totalCurrentValue, totalInvestmentValue, overallPandL, totalDayChangeAbsolute };

  }, [filteredHoldings, intradayPositions, foPositions, activeFilter]);
  
  const chartData = useMemo(() => {
    return filteredHoldings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      fill: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`,
      label: (pos.profitAndLoss || 0) >= 0 ? 'Profit' : 'Loss'
    }));
  }, [filteredHoldings]);
  
  const chartConfig = {
      value: {
        label: 'Current Value',
      },
       ...filteredHoldings.reduce((acc, pos) => {
        acc[pos.symbol || pos.name] = {
            label: pos.symbol || pos.name,
            color: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`
        };
        return acc;
    }, {} as any)
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return filteredHoldings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      pnl: pos.profitAndLoss,
      pnlPercent: pos.profitAndLossPercent,
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
                  formatter={(value) => formatCurrency(value as number, 'INR')}
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
                      <Briefcase className="h-6 w-6 mr-2" /> {title}
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
                        {formatCurrency(overallPandL, 'INR')}
                      </p>
                      <p className="text-xs text-muted-foreground">Overall P&L</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                        {formatCurrency(totalDayChangeAbsolute, 'INR')}
                      </p>
                      <p className="text-xs text-muted-foreground">Day's P&L</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Total Investment</p>
                      <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue, 'INR')}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Current Value</p>
                      <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue, 'INR')}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Cash Balance</p>
                      <p className="font-medium text-foreground">{formatCurrency(mainPortfolioCashBalance, 'INR')}</p>
                    </div>
                     <div className="pt-2 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('toCrypto')}>
                          <Coins className="mr-2 h-4 w-4" /> Add Funds
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('fromCrypto')}>
                          <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
                        </Button>
                      </div>
                  </div>
              </div>
              
              {!isPledged && (
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
              )}

              {renderContent()}

          </CardContent>
      </Card>
      {selectedHoldingForPledge && (
        <PledgeDialog
            isOpen={pledgeDialogOpen}
            onOpenChange={setPledgeDialogOpen}
            holding={selectedHoldingForPledge}
            onConfirmPledge={handleConfirmPledge}
            currency={selectedHoldingForPledge.exchange === 'NASDAQ' || selectedHoldingForPledge.exchange === 'NYSE' ? 'USD' : 'INR'}
            mode={pledgeDialogMode}
        />
      )}
      <FundTransferDialog
        isOpen={isFundTransferDialogOpen}
        onOpenChange={setIsFundTransferDialogOpen}
        transferDirection={transferDirection}
        mainPortfolioCashBalance={mainPortfolioCashBalance}
        cryptoCashBalance={cryptoCashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={'INR'}
      />
    </>
  );
}
