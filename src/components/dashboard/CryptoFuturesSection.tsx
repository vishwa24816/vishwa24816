
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
import type { CryptoFuturePosition } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat, PlusCircle, MinusCircle, XCircle, Table2, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"


interface CryptoFuturesSectionProps {
  positions: CryptoFuturePosition[];
  cashBalance: number;
}

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function CryptoFuturesSection({ positions, cashBalance }: CryptoFuturesSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'table' | 'bar' | 'pie'>('table');
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
   const formatPrice = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : positionId));
  };

  const totalUnrealizedPnL = positions.reduce((acc, pos) => acc + pos.unrealizedPnL, 0);
  const totalMtmPnl = positions.reduce((acc, pos) => acc + pos.mtmPnl, 0);
  const totalMargin = positions.reduce((acc, pos) => acc + pos.margin, 0);

  const chartConfig = useMemo(() => {
    const config = positions.reduce((acc, pos, index) => {
      const key = slugify(pos.symbol);
      acc[key] = {
        label: pos.symbol,
        color: `hsl(var(--chart-${(index % 4) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig);

    config["cash"] = {
      label: "Available Margin",
      color: `hsl(var(--chart-5))`,
    }
    
    return config
  }, [positions]);

  const chartData = useMemo(() => {
    const positionsData = positions.map(p => ({
      name: slugify(p.symbol),
      value: parseFloat(p.margin.toFixed(2)),
      label: p.symbol
    }));
    
    if (cashBalance > 0) {
      positionsData.push({
          name: 'cash',
          value: parseFloat(cashBalance.toFixed(2)),
          label: 'Available Margin'
      });
    }

    return positionsData;
  }, [positions, cashBalance]);

  const tickFormatter = (value: string) => {
    return chartConfig[value]?.label || value;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Repeat className="h-6 w-6 mr-2" /> Crypto Futures
            </CardTitle>
            <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                <Button variant={viewType === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('table')} aria-label="Table View"><Table2 className="h-4 w-4" /></Button>
                <Button variant={viewType === 'bar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('bar')} aria-label="Bar Chart View"><BarChart2 className="h-4 w-4" /></Button>
                <Button variant={viewType === 'pie' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('pie')} aria-label="Pie Chart View"><PieChartIcon className="h-4 w-4" /></Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-6 pb-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">MTM P&L</p>
              <p className={cn("text-lg font-semibold", totalMtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(totalMtmPnl)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall P&L</p>
              <p className={cn("text-lg font-semibold", totalUnrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                  {formatCurrency(totalUnrealizedPnL)}
              </p>
            </div>
            <div className='text-right'>
               <p className="text-sm text-muted-foreground">Used Margin</p>
               <p className="text-lg font-semibold">{formatCurrency(totalMargin)}</p>
            </div>
            <div className='text-right'>
               <p className="text-sm text-muted-foreground">Available Margin</p>
               <p className="text-lg font-semibold">{formatCurrency(cashBalance)}</p>
            </div>
          </div>
        </div>
        
        {viewType === 'table' && (
          positions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Qty.</TableHead>
                  <TableHead className="text-right">Entry Price</TableHead>
                  <TableHead className="text-right">Mark Price</TableHead>
                  <TableHead className="text-right">Liq. Price</TableHead>
                  <TableHead className="text-right">MTM P&L</TableHead>
                  <TableHead className="text-right">Overall P&L</TableHead>
                  <TableHead className="text-right">Margin (INR)</TableHead>
                  <TableHead className="text-right">Leverage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos) => (
                  <React.Fragment key={pos.id}>
                    <TableRow
                      onClick={() => handleRowClick(pos.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">{pos.symbol}</TableCell>
                      <TableCell className={cn(pos.positionSide === 'LONG' ? 'text-green-600' : 'text-red-600')}>
                        {pos.positionSide}
                      </TableCell>
                      <TableCell className="text-right">{pos.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</TableCell>
                      <TableCell className="text-right">{formatPrice(pos.entryPrice)}</TableCell>
                      <TableCell className="text-right">{formatPrice(pos.markPrice)}</TableCell>
                      <TableCell className="text-right">{pos.liquidationPrice ? formatPrice(pos.liquidationPrice) : '-'}</TableCell>
                       <TableCell className={cn("text-right", pos.mtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(pos.mtmPnl)}
                      </TableCell>
                      <TableCell className={cn("text-right", pos.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(pos.unrealizedPnL)}
                      </TableCell>
                      <TableCell className="text-right">{formatPrice(pos.margin)}</TableCell>
                      <TableCell className="text-right">{pos.leverage}x</TableCell>
                    </TableRow>
                    {expandedRowId === pos.id && (
                      <TableRow className="bg-muted/50 hover:bg-muted/60">
                        <TableCell colSpan={10} className="p-0">
                          <div className="p-4 space-y-3">
                            <h4 className="font-semibold text-md text-foreground">
                              {pos.symbol} ({pos.positionSide}) - Actions
                            </h4>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 justify-center text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toast({ title: `Increase Position: ${pos.symbol}`});
                                }}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" /> Increase Position
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 justify-center text-orange-600 border-orange-500 hover:bg-orange-500/10 hover:text-orange-700" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toast({ title: `Reduce Position: ${pos.symbol}`});
                                }}
                              >
                                <MinusCircle className="mr-2 h-4 w-4" /> Reduce Position
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="flex-1 justify-center" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toast({ 
                                        title: `Close Position: ${pos.symbol}`,
                                        description: "This action would close your crypto future position.",
                                        variant: "destructive"
                                    });
                                }}
                              >
                                <XCircle className="mr-2 h-4 w-4" /> Close Position
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
          ) : (
            <p className="text-muted-foreground text-center py-8">You have no open crypto futures positions.</p>
          )
        )}
        
        {viewType === 'bar' && (
            <div className="p-4">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer>
                <BarChart layout="vertical" data={chartData} margin={{ right: 20 }}>
                    <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} tick={{ fill: "hsl(var(--muted-foreground))" }} tickFormatter={tickFormatter} />
                    <XAxis type="number" hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="value" layout="vertical" radius={5}>
                        {chartData.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                        ))}
                    </Bar>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
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
                        <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                    ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
