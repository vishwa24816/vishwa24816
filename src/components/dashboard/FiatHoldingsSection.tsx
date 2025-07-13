
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
import { mockPortfolioHoldings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { cn } from '@/lib/utils';
import { Briefcase, Info, XCircle, Settings2, BarChart2, PieChart as PieChartIcon, Table2 } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
  Chart,
} from "@/components/ui/chart";

type HoldingFilterType = 'All' | 'Stock' | 'Mutual Fund' | 'Bond';

interface FiatHoldingsSectionProps {
  mainPortfolioCashBalance: number;
  setMainPortfolioCashBalance: React.Dispatch<React.SetStateAction<number>>;
}

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function FiatHoldingsSection({ mainPortfolioCashBalance, setMainPortfolioCashBalance }: FiatHoldingsSectionProps) {
  const holdings = mockPortfolioHoldings.filter(h => h.type !== 'Crypto');
  const [activeFilter, setActiveFilter] = useState<HoldingFilterType>('All');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'table' | 'bar' | 'pie'>('table');
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const handleRowClick = (holdingId: string) => {
    setExpandedRowId(prevId => (prevId === holdingId ? null : holdingId));
  };

  const handleAdjustPosition = (holding: PortfolioHolding) => {
      let path = `/order/stock/${encodeURIComponent(holding.symbol || holding.name)}`;
      if (holding.type === 'Mutual Fund') {
          path = `/order/mutual-fund/${encodeURIComponent(holding.symbol || holding.name)}`;
      } else if (holding.type === 'Bond') {
          path = `/order/bond/${encodeURIComponent(holding.symbol || holding.name)}`;
      }
      router.push(path);
  };

  const handleExitPosition = (holding: PortfolioHolding) => {
    toast({
      title: `Exiting Position (Mock): ${holding.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const filterOptions: { label: string; value: HoldingFilterType }[] = [
    { label: "All", value: "All" },
    { label: "Stocks", value: "Stock" },
    { label: "Mutual Funds", value: "Mutual Fund" },
    { label: "Bonds", value: "Bond" },
  ];

  const filteredHoldings = holdings.filter(holding => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Stock') return holding.type === 'Stock' || holding.type === 'ETF';
    if (activeFilter === 'Mutual Fund') return holding.type === 'Mutual Fund';
    if (activeFilter === 'Bond') return holding.type === 'Bond';
    return false;
  });

  const totalCurrentValue = filteredHoldings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = filteredHoldings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  
  const totalDayChangeAbsolute = filteredHoldings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  
  const chartConfig = useMemo(() => {
    const config = filteredHoldings.reduce((acc, holding, index) => {
      const key = slugify(holding.name);
      acc[key] = {
        label: holding.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig);

    config["cash"] = {
      label: "Cash",
      color: `hsl(var(--chart-5))`,
    }
    
    return config
  }, [filteredHoldings])

  const chartData = useMemo(() => {
    const holdingsData = filteredHoldings.map(h => ({
      name: slugify(h.name),
      value: parseFloat(h.currentValue.toFixed(2)),
      label: h.name,
    }));
    
    if (mainPortfolioCashBalance > 0) {
      holdingsData.push({
          name: 'cash',
          value: parseFloat(mainPortfolioCashBalance.toFixed(2)),
          label: "Cash Balance"
      });
    }

    return holdingsData;
  }, [filteredHoldings, mainPortfolioCashBalance]);

  const tickFormatter = (value: string) => {
    const label = chartConfig[value]?.label || value;
    return typeof label === 'string' ? (label.length > 15 ? label.slice(0, 12) + "..." : label) : label;
  }

  return (
    <Card className="shadow-md">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Briefcase className="h-6 w-6 mr-2" /> Fiat Holdings
                </CardTitle>
                <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewType === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('table')} aria-label="Table View"><Table2 className="h-4 w-4" /></Button>
                    <Button variant={viewType === 'bar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('bar')} aria-label="Bar Chart View"><BarChart2 className="h-4 w-4" /></Button>
                    <Button variant={viewType === 'pie' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('pie')} aria-label="Pie Chart View"><PieChartIcon className="h-4 w-4" /></Button>
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
            
            {viewType === 'table' && (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[35%]">Instrument</TableHead>
                        <TableHead className="w-[20%] text-right">Qty.</TableHead>
                        <TableHead className="w-[20%] text-right">LTP / Value</TableHead>
                        <TableHead className="w-[25%] text-right">Overall / Day P&L</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredHoldings.length > 0 ? (
                        filteredHoldings.map((holding) => (
                        <React.Fragment key={holding.id}>
                            <TableRow 
                                onClick={() => handleRowClick(holding.id)}
                                className="cursor-pointer"
                            >
                                <TableCell className="font-medium">
                                    <div>{holding.name}</div>
                                    <div className="text-xs text-muted-foreground">{holding.symbol}</div>
                                </TableCell>
                                <TableCell className="text-right">{holding.quantity.toLocaleString()}</TableCell>
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
                                    <TableCell colSpan={4} className="p-0">
                                        <div className="p-4 flex gap-2">
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                className="flex-1 justify-center"
                                                onClick={() => handleAdjustPosition(holding)}
                                            >
                                                <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive" 
                                                className="flex-1 justify-center"
                                                onClick={() => handleExitPosition(holding)}
                                            >
                                                <XCircle className="mr-2 h-4 w-4" /> Exit Position
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No holdings match the selected filter.
                        </TableCell>
                        </TableRow>
                    )}
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

            {viewType === 'pie' && (
                <div className="p-4 flex justify-center">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                    <Chart.ResponsiveContainer>
                    <Chart.PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Chart.Pie data={chartData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                        {chartData.map((entry) => (
                            <Chart.Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                        ))}
                        </Chart.Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                    </Chart.PieChart>
                    </Chart.ResponsiveContainer>
                </ChartContainer>
                </div>
            )}

        </CardContent>
    </Card>
  );
}
