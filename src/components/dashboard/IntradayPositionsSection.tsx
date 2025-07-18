
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
import { mockIntradayPositions } from '@/lib/mockData';
import type { IntradayPosition } from '@/types';
import { cn } from '@/lib/utils';
import { TrendingUp, XCircle, Settings2, BarChart2, LayoutGrid, Table2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
  Chart,
} from "@/components/ui/chart";
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';


const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export function IntradayPositionsSection() {
  const positions = mockIntradayPositions;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [viewType, setViewType] = useState<'table' | 'bar' | 'heatmap'>('table');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : prevId));
  };
  
  const handleAdjustPosition = (pos: IntradayPosition) => {
      router.push(`/order/stock/${encodeURIComponent(pos.symbol)}`);
  };

  const handleExitPosition = (pos: IntradayPosition) => {
    toast({
      title: `Exiting Position (Mock): ${pos.symbol}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);

  const chartConfig = useMemo(() => {
    return positions.reduce((acc, pos, index) => {
      const key = slugify(pos.symbol);
      acc[key] = {
        label: pos.symbol,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return acc;
    }, {} as ChartConfig);
  }, [positions]);

  const chartData = useMemo(() => {
    return positions.map(p => ({
      name: slugify(p.symbol),
      value: parseFloat((p.quantity * p.avgPrice).toFixed(2)), // Investment value
    }));
  }, [positions]);

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return positions.map(p => ({
      name: p.symbol,
      value: p.quantity * p.ltp, // Current value
      pnl: p.pAndL,
      pnlPercent: p.pAndLPercent,
    }));
  }, [positions]);

  const tickFormatter = (value: string) => {
    return chartConfig[value]?.label || value;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
                <TrendingUp className="h-6 w-6 mr-2" /> Intraday Positions
            </CardTitle>
             <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">Total P&L</p>
                    <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                        {formatCurrency(totalPandL)}
                    </p>
                </div>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewType === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('table')} aria-label="Table View"><Table2 className="h-4 w-4" /></Button>
                    <Button variant={viewType === 'bar' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('bar')} aria-label="Bar Chart View"><BarChart2 className="h-4 w-4" /></Button>
                    <Button variant={viewType === 'heatmap' ? 'secondary' : 'ghost'} size="sm" className="h-7 px-2" onClick={() => setViewType('heatmap')} aria-label="Heatmap View"><LayoutGrid className="h-4 w-4" /></Button>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 px-6">You have no open intraday positions.</p>
        ) : (
          <>
            {viewType === 'table' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Instrument / LTP</TableHead>
                    <TableHead className="w-[30%]">Qty. / Type</TableHead>
                    <TableHead className="text-right w-[30%]">P&L (%)</TableHead>
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
                            <div>{pos.name} ({pos.symbol})</div>
                            <div className="text-xs text-muted-foreground">LTP: {formatCurrency(pos.ltp)}</div>
                        </TableCell>
                         <TableCell>
                          <div>{pos.quantity.toLocaleString()}</div>
                          <div
                            className={cn(
                              "text-xs",
                              pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {pos.transactionType}
                          </div>
                        </TableCell>
                        <TableCell className={cn("text-right whitespace-nowrap", pos.pAndL >= 0 ? 'text-green-600' : 'text-red-600')}>
                            <div>{formatCurrency(pos.pAndL)}</div>
                            <div className="text-xs">({pos.pAndLPercent.toFixed(2)}%)</div>
                        </TableCell>
                      </TableRow>
                      {expandedRowId === pos.id && (
                        <TableRow className="bg-muted/50 hover:bg-muted/60">
                          <TableCell colSpan={3} className="p-0">
                            <div className="p-4 flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1 justify-center" 
                                  onClick={() => handleAdjustPosition(pos)}
                                >
                                  <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                                </Button>
                                 <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  className="flex-1 justify-center"
                                  onClick={() => handleExitPosition(pos)}
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
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
                    </Chart.BarChart>
                  </Chart.ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
            {viewType === 'heatmap' && (
              <div className="p-4 min-h-[250px]">
                <PortfolioHeatmap items={heatmapData} />
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
