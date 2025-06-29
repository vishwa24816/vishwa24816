"use client";

import React, { useState } from 'react';
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
import { TrendingUp, PlusCircle, MinusCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


export function IntradayPositionsSection() {
  const positions = mockIntradayPositions;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : positionId));
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
                <TrendingUp className="h-6 w-6 mr-2" /> Intraday Positions
            </CardTitle>
            <div className="text-left sm:text-right">
                <p className="text-sm text-muted-foreground">Total P&L</p>
                <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                    {formatCurrency(totalPandL)}
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 px-6">You have no open intraday positions.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Instrument</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Qty.</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
                <TableHead className="text-right">LTP</TableHead>
                <TableHead className="text-right">P&L (%)</TableHead>
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
                      <div>{pos.name}</div>
                      <div className="text-xs text-muted-foreground">{pos.symbol}</div>
                    </TableCell>
                    <TableCell
                      className={cn(
                        pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {pos.transactionType}
                    </TableCell>
                    <TableCell className="text-right">{pos.quantity.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(pos.avgPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(pos.ltp)}</TableCell>
                    <TableCell className={cn("text-right whitespace-nowrap", pos.pAndL >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {formatCurrency(pos.pAndL)}<br/>({pos.pAndLPercent.toFixed(2)}%)
                    </TableCell>
                  </TableRow>
                  {expandedRowId === pos.id && (
                    <TableRow className="bg-muted/50 hover:bg-muted/60">
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 space-y-3">
                          <h4 className="font-semibold text-md text-foreground">
                            {pos.name} ({pos.symbol}) - Actions
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 justify-center text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Add to ${pos.symbol}`, description: "Action for adding more to this intraday position."});
                              }}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Quantity
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 justify-center text-orange-600 border-orange-500 hover:bg-orange-500/10 hover:text-orange-700" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Reduce from ${pos.symbol}`, description: "Action for reducing quantity from this intraday position."});
                              }}
                            >
                              <MinusCircle className="mr-2 h-4 w-4" /> Reduce Quantity
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex-1 justify-center" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ 
                                      title: `Square Off: ${pos.symbol}`,
                                      description: "This action would square off your intraday position.",
                                      variant: "destructive"
                                  });
                              }}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Square Off
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
      </CardContent>
    </Card>
  );
}
