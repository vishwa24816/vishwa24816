
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
import { mockFoPositions } from '@/lib/mockData';
import type { FoPosition } from '@/types';
import { cn } from '@/lib/utils';
import { Layers, PlusCircle, MinusCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FoPositionsSection() {
  const positions = mockFoPositions;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : positionId));
  };

  const totalPandL = positions.reduce((acc, pos) => acc + pos.pAndL, 0);
  const totalMtmPnl = positions.reduce((acc, pos) => acc + pos.mtmPnl, 0);
  const totalQuantity = (pos: FoPosition) => pos.lots * pos.quantityPerLot;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center mb-2 sm:mb-0">
            <Layers className="h-6 w-6 mr-2" /> F&O Positions
          </CardTitle>
          <div className="grid grid-cols-2 gap-4 text-left sm:text-right">
            <div>
              <p className="text-sm text-muted-foreground">MTM P&L</p>
              <p className={cn("text-lg font-semibold", totalMtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalMtmPnl)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall P&L</p>
              <p className={cn("text-lg font-semibold", totalPandL >= 0 ? 'text-green-600' : 'text-red-600')}>
                {formatCurrency(totalPandL)}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {positions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8 px-6">You have no open F&O positions.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Instrument</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Lots</TableHead>
                <TableHead className="text-right">Qty.</TableHead>
                <TableHead className="text-right">Avg. Price</TableHead>
                <TableHead className="text-right">LTP</TableHead>
                <TableHead className="text-right">MTM P&L</TableHead>
                <TableHead className="text-right">Overall P&L (%)</TableHead>
                <TableHead className="text-right">Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((pos) => (
                <React.Fragment key={pos.id}>
                  <TableRow
                    onClick={() => handleRowClick(pos.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{pos.instrumentName}</TableCell>
                    <TableCell>
                      <span className={cn(pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600')}>{pos.transactionType}</span>
                      <span className="ml-1 text-xs text-muted-foreground">({pos.optionType})</span>
                    </TableCell>
                    <TableCell className="text-right">{pos.lots}</TableCell>
                    <TableCell className="text-right">{totalQuantity(pos).toLocaleString()}</TableCell>
                    <TableCell className="text-right">{formatCurrency(pos.avgPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(pos.ltp)}</TableCell>
                    <TableCell className={cn("text-right", pos.mtmPnl >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {formatCurrency(pos.mtmPnl)}
                    </TableCell>
                    <TableCell className={cn("text-right whitespace-nowrap", pos.pAndL >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {formatCurrency(pos.pAndL)}<br/>({pos.pAndLPercent.toFixed(2)}%)
                    </TableCell>
                    <TableCell className="text-right">{new Date(pos.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric'})}</TableCell>
                  </TableRow>
                  {expandedRowId === pos.id && (
                    <TableRow className="bg-muted/50 hover:bg-muted/60">
                      <TableCell colSpan={9} className="p-0">
                        <div className="p-4 space-y-3">
                          <h4 className="font-semibold text-md text-foreground">
                            {pos.instrumentName} - Actions
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 justify-center text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Add Lots: ${pos.instrumentName}`});
                              }}
                            >
                              <PlusCircle className="mr-2 h-4 w-4" /> Add Lots
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 justify-center text-orange-600 border-orange-500 hover:bg-orange-500/10 hover:text-orange-700" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ title: `Reduce Lots: ${pos.instrumentName}`});
                              }}
                            >
                              <MinusCircle className="mr-2 h-4 w-4" /> Reduce Lots
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex-1 justify-center" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  toast({ 
                                      title: `Square Off: ${pos.instrumentName}`,
                                      description: "This action would square off your F&O position.",
                                      variant: "destructive"
                                  });
                              }}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Square Off Position
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
