
"use client";

import React, { useState } from 'react';
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
import { mockFoPositions } from '@/lib/mockData';
import type { FoPosition } from '@/types';
import { cn } from '@/lib/utils';
import { Layers, XCircle, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FoPositionsSection() {
  const positions = mockFoPositions;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const handleRowClick = (positionId: string) => {
    setExpandedRowId(prevId => (prevId === positionId ? null : prevId));
  };
  
  const handleAdjustPosition = (pos: FoPosition) => {
    let path = '';
    if (pos.optionType === 'FUT') {
        path = `/order/future/${encodeURIComponent(pos.instrumentName)}`;
    } else if (pos.optionType === 'CE' || pos.optionType === 'PE') {
        path = `/order/option/${encodeURIComponent(pos.instrumentName)}`;
    }
    if (path) {
        router.push(path);
    }
  };

  const handleExitPosition = (pos: FoPosition) => {
    toast({
      title: `Exiting Position (Mock): ${pos.instrumentName}`,
      description: `A market order would be placed to close this position.`,
      variant: "destructive"
    });
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
                <TableHead className="w-[40%]">Instrument / MTM</TableHead>
                <TableHead className="w-[30%]">Qty. / Type</TableHead>
                <TableHead className="text-right w-[30%]">Overall P&L (%)</TableHead>
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
                        <div>{pos.instrumentName}</div>
                        <div className={cn("text-xs", pos.mtmPnl >= 0 ? 'text-green-500' : 'text-red-500')}>MTM: {formatCurrency(pos.mtmPnl)}</div>
                    </TableCell>
                    <TableCell>
                      <div>{totalQuantity(pos).toLocaleString()} ({pos.lots} lots)</div>
                      <div className={cn("text-xs", pos.transactionType === 'BUY' ? 'text-green-600' : 'text-red-600')}>
                        {pos.transactionType} ({pos.optionType})
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
                        <div className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1 justify-center" 
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleAdjustPosition(pos);
                              }}
                            >
                              <Settings2 className="mr-2 h-4 w-4" /> Adjust Position
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="flex-1 justify-center"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleExitPosition(pos);
                              }}
                            >
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
      </CardContent>
    </Card>
  );
}
