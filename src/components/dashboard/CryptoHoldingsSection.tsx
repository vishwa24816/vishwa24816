
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import { mockPortfolioHoldings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin, XCircle, Coins, Landmark, Settings2, ChevronDown, BarChart2, LayoutGrid, List } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FundTransferDialog } from '@/components/shared/FundTransferDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';

type ViewMode = 'list' | 'bar' | 'heatmap';

interface CryptoHoldingsSectionProps {
  holdings: PortfolioHolding[];
  title: string;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
  isRealMode?: boolean;
}

export function CryptoHoldingsSection({
  holdings,
  title,
  cashBalance,
  setCashBalance,
  mainPortfolioCashBalance,
  setMainPortfolioCashBalance,
  isRealMode = false
}: CryptoHoldingsSectionProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
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

  const totalCurrentValue = holdings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = holdings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;

  const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  const handleOpenFundTransferDialog = (direction: 'toCrypto' | 'fromCrypto') => {
    setTransferDirection(direction);
    setIsFundTransferDialogOpen(true);
  };

  const handleTransferConfirm = (amount: number, direction: 'toCrypto' | 'fromCrypto') => {
    if (direction === 'toCrypto') {
      setMainPortfolioCashBalance(prev => prev - amount);
      setCashBalance(prev => prev + amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to ${title}.` });
    } else { // fromCrypto
      setMainPortfolioCashBalance(prev => prev + amount);
      setCashBalance(prev => prev - amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount)} transferred to Main Portfolio.` });
    }
  };

  const walletCardTitle = title.includes('Web3') ? 'Web3 Wallet' : 'Crypto Wallet';
  const holdingsCardTitle = title.includes('Web3') ? 'Web3 Holdings' : 'Crypto Holdings';

  const chartData = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      fill: pos.profitAndLoss >= 0 ? "hsl(var(--positive))" : "hsl(var(--destructive))",
      label: pos.profitAndLoss >= 0 ? 'Profit' : 'Loss'
    }));
  }, [holdings]);

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
          You have no crypto assets in this wallet.
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
      <div className="space-y-4">
        <Card className="w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Bitcoin className="h-6 w-6 mr-2" /> {walletCardTitle}
            </CardTitle>
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
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Cash Balance</p>
                  <p className="font-medium text-foreground">{formatCurrency(cashBalance)}</p>
                </div>
                {!isRealMode && (
                  <div className="pt-2 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('toCrypto')}>
                      <Coins className="mr-2 h-4 w-4" /> Add Funds
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('fromCrypto')}>
                      <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
                    </Button>
                  </div>
                )}
              </div>
            </div>
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
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </div>

      <FundTransferDialog
        isOpen={isFundTransferDialogOpen}
        onOpenChange={setIsFundTransferDialogOpen}
        transferDirection={transferDirection}
        mainPortfolioCashBalance={mainPortfolioCashBalance}
        cryptoCashBalance={cashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={'USD'}
      />
      {selectedHoldingForPledge && (
        <PledgeDialog
            isOpen={pledgeDialogOpen}
            onOpenChange={setPledgeDialogOpen}
            holding={selectedHoldingForPledge}
            onConfirmPledge={handleConfirmPledge}
            currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'USD' : 'INR'}
        />
      )}
    </>
  );
}
