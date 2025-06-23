"use client";

import React, { useState, useMemo } from 'react';
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
import { Bitcoin, PlusCircle, MinusCircle, XCircle, Coins, Landmark, BarChart2, PieChart as PieChartIcon, Table2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { FundTransferDialog } from '@/components/shared/FundTransferDialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

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
  const cryptoHoldings = holdings;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isFundTransferDialogOpen, setIsFundTransferDialogOpen] = useState(false);
  const [transferDirection, setTransferDirection] = useState<'toCrypto' | 'fromCrypto'>('toCrypto');
  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USDT'>('INR');
  const [viewType, setViewType] = useState<'table' | 'bar' | 'pie'>('table');
  const INR_TO_USDT_RATE = 83.5;

  const formatCurrency = (value: number, mode: 'INR' | 'USDT') => {
    if (mode === 'USDT') {
      const usdtValue = value / INR_TO_USDT_RATE;
      return usdtValue.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' USDT';
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (holdingId: string) => {
    setExpandedRowId(prevId => (prevId === holdingId ? null : holdingId));
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
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount, 'INR')} transferred to ${title}.` });
    } else { // fromCrypto
      setMainPortfolioCashBalance(prev => prev + amount);
      setCashBalance(prev => prev - amount);
      toast({ title: "Transfer Successful", description: `${formatCurrency(amount, 'INR')} transferred to Main Portfolio.` });
    }
  };

  const chartConfig = useMemo(() => {
    return holdings.reduce((acc, holding, index) => {
      const key = holding.name; // Use original name as key
      acc[key] = {
        label: holding.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig);
  }, [holdings]) satisfies ChartConfig;

  const chartData = useMemo(() => {
    return holdings.map(h => ({
      name: h.name,
      value: parseFloat(h.currentValue.toFixed(2)),
      fill: chartConfig[h.name]?.color,
    }));
  }, [holdings, chartConfig]);


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
                    {formatCurrency(overallPandL, currencyMode)}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(totalDayChangeAbsolute, currencyMode)}
                  </p>
                  <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Total Investment</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue, currencyMode)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Current Value</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue, currencyMode)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Cash Balance</p>
                  <p className="font-medium text-foreground">{formatCurrency(cashBalance, currencyMode)}</p>
                </div>
                {!isRealMode && (
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('toCrypto')}>
                      <Coins className="mr-2 h-4 w-4" /> Add Funds
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-11" onClick={() => handleOpenFundTransferDialog('fromCrypto')}>
                      <Landmark className="mr-2 h-4 w-4" /> Withdraw Funds
                    </Button>
                  </div>
                )}
                <div className="pt-4">
                  <Label className="text-sm font-medium">Display Currency</Label>
                  <RadioGroup value={currencyMode} onValueChange={(v) => setCurrencyMode(v as any)} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INR" id="currency-inr" />
                      <Label htmlFor="currency-inr" className="font-normal">Rupee (₹)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USDT" id="currency-usdt" />
                      <Label htmlFor="currency-usdt" className="font-normal">USDT ($)</Label>
                    </div>
                  </RadioGroup>
                </div>
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
                <Button variant={viewType === 'pie' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('pie')} aria-label="Pie Chart View"><PieChartIcon className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {cryptoHoldings.length > 0 ? (
              <>
                {viewType === 'table' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px] min-w-[150px]">Asset</TableHead>
                        <TableHead className="text-right">Qty.</TableHead>
                        <TableHead className="text-right">Avg. Cost</TableHead>
                        <TableHead className="text-right">LTP</TableHead>
                        <TableHead className="text-right">Current Val.</TableHead>
                        <TableHead className="text-right">P&L (%)</TableHead>
                        <TableHead className="text-right">Day's Chg (%)</TableHead>
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
                            <TableCell className="text-right">{formatCurrency(holding.avgCostPrice, currencyMode)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(holding.ltp, currencyMode)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(holding.currentValue, currencyMode)}</TableCell>
                            <TableCell className={cn("text-right whitespace-nowrap", holding.profitAndLoss >= 0 ? 'text-green-600' : 'text-red-600')}>
                              {formatCurrency(holding.profitAndLoss, currencyMode)}<br />({holding.profitAndLossPercent.toFixed(2)}%)
                            </TableCell>
                            <TableCell className={cn("text-right whitespace-nowrap", holding.dayChangeAbsolute >= 0 ? 'text-green-600' : 'text-red-600')}>
                              {formatCurrency(holding.dayChangeAbsolute, currencyMode)}<br />({holding.dayChangePercent.toFixed(2)}%)
                            </TableCell>
                          </TableRow>
                          {expandedRowId === holding.id && (
                            <TableRow className="bg-muted/50 hover:bg-muted/60 data-[state=selected]:bg-muted/70">
                              <TableCell colSpan={7} className="p-0">
                                <div className="p-4 space-y-3">
                                  <h4 className="font-semibold text-md text-foreground">{holding.name} ({holding.symbol || holding.type}) - Actions</h4>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button size="sm" variant="outline" className="flex-1 justify-center text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" onClick={(e) => { e.stopPropagation(); toast({ title: `Buy More: ${holding.symbol || holding.name}` }); }}>
                                      <PlusCircle className="mr-2 h-4 w-4" /> Buy More
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1 justify-center text-orange-600 border-orange-500 hover:bg-orange-500/10 hover:text-orange-700" onClick={(e) => { e.stopPropagation(); toast({ title: `Sell/Reduce: ${holding.symbol || holding.name}` }); }}>
                                      <MinusCircle className="mr-2 h-4 w-4" /> Sell/Reduce
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex-1 justify-center" onClick={(e) => { e.stopPropagation(); toast({ title: `Exit Position: ${holding.symbol || holding.name}`, description: "This action would close your entire position.", variant: "destructive" }); }}>
                                      <XCircle className="mr-2 h-4 w-4" /> Exit Position
                                    </Button>
                                  </div>
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
                      <ResponsiveContainer>
                        <BarChart layout="vertical" data={chartData} margin={{ right: 20 }}>
                          <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                          <XAxis type="number" hide />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                          <Bar dataKey="value" layout="vertical" radius={5}>
                            {chartData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 mt-4 text-xs">
                        {chartData.map((entry) => (
                            <div key={entry.name} className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ backgroundColor: entry.fill }} />
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                  </div>
                )}
                {viewType === 'pie' && (
                  <div className="p-4 flex justify-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                      <ResponsiveContainer>
                        <PieChart>
                          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                            {chartData.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                            ))}
                            </Pie>
                          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
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
        cryptoCashBalance={cashBalance}
        onTransferConfirm={handleTransferConfirm}
        currencyMode={currencyMode}
      />
    </>
  );
}
