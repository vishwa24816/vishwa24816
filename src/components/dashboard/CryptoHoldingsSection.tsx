
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin, XCircle, Coins, Landmark, BarChart2, LayoutGrid, Table2, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FundTransferDialog } from '@/components/shared/FundTransferDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
  Chart,
} from "@/components/ui/chart";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';


interface CryptoHoldingsSectionProps {
  holdings: PortfolioHolding[];
  title: string;
  cashBalance: number;
  setCashBalance: React.Dispatch<React.SetStateAction<number>>;
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
  isRealMode?: boolean;
}

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function CryptoHoldingsSection({
  holdings,
  title,
  cashBalance,
  setCashBalance,
  mainPortfolioCashBalance,
  setMainPortfolioCashBalance,
  isRealMode = false
}: CryptoHoldingsSectionProps) {
  const cryptoHoldings = holdings;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');
  const [viewType, setViewType] = useState<'table' | 'bar' | 'heatmap'>('table');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const handleRowClick = (holdingId: string) => {
    setExpandedRowId(prevId => (prevId === holdingId ? null : prevId));
  };
  
  const handleAdjustPosition = (e: React.MouseEvent, holding: PortfolioHolding) => {
    e.stopPropagation();
    router.push(`/order/crypto/${encodeURIComponent(holding.symbol || holding.name)}`);
  };

  const handleExitPosition = (e: React.MouseEvent, holding: PortfolioHolding) => {
    e.stopPropagation();
    toast({
      title: `Exiting Position (Mock): ${holding.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalCurrentValue = cryptoHoldings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = cryptoHoldings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;

  const totalDayChangeAbsolute = cryptoHoldings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
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

  const chartConfig = useMemo(() => {
    const config = holdings.reduce((acc, holding, index) => {
      const key = slugify(holding.name);
      acc[key] = {
        label: holding.name,
        color: `hsl(var(--chart-${(index % 4) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig);

    config["cash"] = {
      label: "Cash",
      color: `hsl(var(--chart-5))`,
    }
    
    return config
  }, [holdings])

  const chartData = useMemo(() => {
    const holdingsData = holdings.map(h => ({
      name: slugify(h.name),
      value: parseFloat(h.currentValue.toFixed(2)),
    }));
    
    if (cashBalance > 0) {
      holdingsData.push({
          name: 'cash',
          value: parseFloat(cashBalance.toFixed(2)),
      });
    }

    return holdingsData;
  }, [holdings, cashBalance]);

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return cryptoHoldings.map(h => ({
      name: h.name,
      value: h.currentValue,
      pnl: h.profitAndLoss,
      pnlPercent: h.profitAndLossPercent,
    }));
  }, [cryptoHoldings]);

  const tickFormatter = (value: string) => {
    return chartConfig[value]?.label || value;
  }
  
  if (cryptoHoldings.length === 0 && cashBalance === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
          <Bitcoin className="h-6 w-6 mr-2" /> {title}
        </h2>
        <p className="text-muted-foreground text-center py-4">You have no crypto assets or balance in this wallet.</p>
      </section>
    );
  }

  const walletCardTitle = title.includes('Web3') ? 'Web3 Wallet' : 'Crypto Wallet';
  const holdingsCardTitle = title.includes('Web3') ? 'Web3 Holdings' : 'Crypto Holdings';

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
                <Button variant={viewType === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('table')} aria-label="Table View"><Table2 className="h-4 w-4" /></Button>
                <Button variant={viewType === 'bar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('bar')} aria-label="Bar Chart View"><BarChart2 className="h-4 w-4" /></Button>
                <Button variant={viewType === 'heatmap' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('heatmap')} aria-label="Heatmap View"><LayoutGrid className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {chartData.length > 0 ? (
              <>
                {viewType === 'table' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[35%]">Asset</TableHead>
                        <TableHead className="w-[20%] text-right">Qty.</TableHead>
                        <TableHead className="w-[20%] text-right">LTP / Value</TableHead>
                        <TableHead className="w-[25%] text-right">Overall / Day P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cryptoHoldings.map((holding) => (
                        <React.Fragment key={holding.id}>
                          <TableRow onClick={() => handleRowClick(holding.id)} className="cursor-pointer">
                            <TableCell className="font-medium">
                              <div>{holding.name}</div>
                              {holding.symbol && <div className="text-xs text-muted-foreground">{holding.symbol}</div>}
                            </TableCell>
                            <TableCell className="text-right">{holding.quantity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</TableCell>
                            <TableCell className="text-right">
                                <div>{formatCurrency(holding.ltp)}</div>
                                <div className="text-xs text-muted-foreground">{formatCurrency(holding.currentValue)}</div>
                            </TableCell>
                            <TableCell className={cn("text-right whitespace-nowrap")}>
                                <div className={cn(holding.profitAndLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                                    {formatCurrency(holding.profitAndLoss)} ({holding.profitAndLossPercent.toFixed(2)}%)
                                </div>
                                <div className={cn("text-xs", holding.dayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                                    {formatCurrency(holding.dayChangeAbsolute)} ({holding.dayChangePercent.toFixed(2)}%)
                                </div>
                            </TableCell>
                          </TableRow>
                          {expandedRowId === holding.id && (
                            <TableRow className="bg-muted/50 hover:bg-muted/60 data-[state=selected]:bg-muted/70">
                              <TableCell colSpan={4}>
                                <div className="p-4 flex gap-2">
                                     <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="flex-1 justify-center"
                                        onClick={(e) => handleAdjustPosition(e, holding)}
                                    >
                                        <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="destructive" 
                                        className="flex-1 justify-center"
                                        onClick={(e) => handleExitPosition(e, holding)}
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Exit Position
                                    </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {viewType === 'bar' && (
                  <div className="p-4">
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                      <Chart.ResponsiveContainer>
                        <Chart.BarChart layout="vertical" data={chartData} margin={{ right: 20 }}>
                          <Chart.YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={tickFormatter} />
                          <Chart.XAxis type="number" hide />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Chart.Bar dataKey="value" layout="vertical" radius={5}>
                             {chartData.map((entry) => (
                                <Chart.Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                            ))}
                          </Chart.Bar>
                          <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                        </Chart.BarChart>
                      </Chart.ResponsiveContainer>
                    </ChartContainer>
                  </div>
                )}
                 {viewType === 'heatmap' && (
                    <div className="p-4 min-h-[300px]">
                      <PortfolioHeatmap items={heatmapData} />
                    </div>
                )}
              </>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                You have no crypto assets in this wallet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <FundTransferDialog
        isOpen={isFundTransferDialogOpen}
        onOpenChange={setIsFundTransferDialogOpen}
        transferDirection={transferDirection}
        mainPortfolioCashBalance={mainPortfolioCashBalance}
        cryptoCashBalance={cryptoCashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={'USD'}
      />
    </>
  );
}
