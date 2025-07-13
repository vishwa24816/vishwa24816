
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
import type { CryptoFuturePosition } from '@/types';
import { cn } from '@/lib/utils';
import { Repeat, XCircle, Table2, BarChart2, LayoutGrid, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
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


interface CryptoFuturesSectionProps {
  positions: CryptoFuturePosition[];
  cashBalance: number;
}

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function CryptoFuturesSection({ positions, cashBalance }: CryptoFuturesSectionProps) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'table' | 'bar' | 'heatmap'>('table');
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
   const formatPrice = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : prevId));
  };
  
  const handleAdjustPosition = (e: React.MouseEvent, pos: CryptoFuturePosition) => {
      e.stopPropagation();
      router.push(`/order/crypto-future/${encodeURIComponent(pos.symbol)}`);
  };

  const handleExitPosition = (e: React.MouseEvent, pos: CryptoFuturePosition) => {
    e.stopPropagation();
    toast({
      title: `Exiting Position (Mock): ${pos.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
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

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return positions.map(p => ({
      name: p.symbol,
      value: p.margin,
      pnl: p.unrealizedPnL,
      pnlPercent: (p.unrealizedPnL / p.margin) * 100, // Approximate PnL %
    }));
  }, [positions]);

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
                <Button variant={viewType === 'heatmap' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('heatmap')} aria-label="Heatmap View"><LayoutGrid className="h-4 w-4" /></Button>
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
                  <TableHead>Symbol / Mark</TableHead>
                  <TableHead>Side / Qty</TableHead>
                  <TableHead>Entry / Liq.</TableHead>
                  <TableHead className="text-right">MTM / P&L</TableHead>
                  <TableHead className="text-right">Margin / Lev</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((pos) => (
                  <React.Fragment key={pos.id}>
                    <TableRow
                      onClick={() => handleRowClick(pos.id)}
                      className="cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        <div>{pos.symbol}</div>
                        <div className="text-xs text-muted-foreground">Mark: {formatPrice(pos.markPrice)}</div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(pos.positionSide === 'LONG' ? 'text-green-600' : 'text-red-600')}>
                          {pos.positionSide}
                        </div>
                        <div className="text-xs text-muted-foreground">Qty: {pos.quantity.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 4})}</div>
                      </TableCell>
                      <TableCell>
                        <div>{formatPrice(pos.entryPrice)}</div>
                        <div className="text-xs text-muted-foreground">Liq: {pos.liquidationPrice ? formatPrice(pos.liquidationPrice) : '-'}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={cn(pos.mtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {formatCurrency(pos.mtmPnl)}
                        </div>
                        <div className={cn("text-xs", pos.unrealizedPnL >= 0 ? 'text-green-500' : 'text-red-500')}>
                          {formatCurrency(pos.unrealizedPnL)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div>{formatPrice(pos.margin)}</div>
                        <div className="text-xs text-muted-foreground">{pos.leverage}x</div>
                      </TableCell>
                    </TableRow>
                    {expandedRowId === pos.id && (
                      <TableRow className="bg-muted/50 hover:bg-muted/60">
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 justify-center"
                                onClick={(e) => handleAdjustPosition(e, pos)}
                              >
                                <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                              </Button>
                               <Button 
                                size="sm" 
                                variant="destructive" 
                                className="flex-1 justify-center"
                                onClick={(e) => handleExitPosition(e, pos)}
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
          ) : (
            <p className="text-muted-foreground text-center py-8">You have no open crypto futures positions.</p>
          )
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

      </CardContent>
    </Card>
  );
}
