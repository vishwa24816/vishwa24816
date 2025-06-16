
"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUnderlyings, mockOptionChains } from '@/lib/mockData/optionChainData';
import type { OptionChainData, OptionData, OptionChainEntry, Underlying } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRightLeft } from 'lucide-react';

const formatNumber = (num?: number, precision = 0) => {
  if (num === undefined || num === null) return '-';
  return num.toLocaleString('en-IN', { minimumFractionDigits: precision, maximumFractionDigits: precision });
};

const OptionChainCell: React.FC<{ data?: OptionData, isCall?: boolean, isPut?: boolean }> = ({ data, isCall, isPut }) => {
  if (!data) return <TableCell className="text-center">-</TableCell>;
  const isPositiveChange = data.netChng >= 0;
  return (
    <>
      <TableCell className={cn("text-right", isCall && "bg-blue-500/5 dark:bg-blue-500/10", isPut && "bg-orange-500/5 dark:bg-orange-500/10")}>{formatNumber(data.iv, 2)}</TableCell>
      <TableCell className={cn("text-right", isCall && "bg-blue-500/5 dark:bg-blue-500/10", isPut && "bg-orange-500/5 dark:bg-orange-500/10")}>{formatNumber(data.volume)}</TableCell>
      <TableCell className={cn("text-right font-semibold", data.chngInOI > 0 ? 'text-green-600' : data.chngInOI < 0 ? 'text-red-600' : '', isCall && "bg-blue-500/5 dark:bg-blue-500/10", isPut && "bg-orange-500/5 dark:bg-orange-500/10")}>{formatNumber(data.chngInOI)}</TableCell>
      <TableCell className={cn("text-right", isCall && "bg-blue-500/5 dark:bg-blue-500/10", isPut && "bg-orange-500/5 dark:bg-orange-500/10")}>{formatNumber(data.oi)}</TableCell>
      <TableCell className={cn("text-right font-bold", isCall && "bg-blue-500/5 dark:bg-blue-500/10", isPut && "bg-orange-500/5 dark:bg-orange-500/10")}>{formatNumber(data.ltp, 2)}</TableCell>
      <TableCell className={cn("text-right", isPositiveChange ? 'text-green-600' : 'text-red-600', isCall && "bg-blue-500/5 dark:bg-blue-500/10", isPut && "bg-orange-500/5 dark:bg-orange-500/10")}>
        {data.netChng !== 0 ? (isPositiveChange ? '+' : '') : ''}{formatNumber(data.netChng, 2)}
      </TableCell>
    </>
  );
};


export function OptionChain() {
  const [selectedUnderlyingSymbol, setSelectedUnderlyingSymbol] = useState<string>(mockUnderlyings[0].symbol);
  const [availableExpiries, setAvailableExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [optionChainData, setOptionChainData] = useState<OptionChainData | null>(null);

  useEffect(() => {
    const chainsForUnderlying = mockOptionChains[selectedUnderlyingSymbol];
    if (chainsForUnderlying) {
      const expiries = Object.keys(chainsForUnderlying);
      setAvailableExpiries(expiries);
      if (expiries.length > 0) {
        const firstExpiry = expiries[0];
        setSelectedExpiry(firstExpiry);
        setOptionChainData(chainsForUnderlying[firstExpiry]);
      } else {
        setSelectedExpiry('');
        setOptionChainData(null);
      }
    } else {
      setAvailableExpiries([]);
      setSelectedExpiry('');
      setOptionChainData(null);
    }
  }, [selectedUnderlyingSymbol]);

  useEffect(() => {
    if (selectedUnderlyingSymbol && selectedExpiry) {
      const chainsForUnderlying = mockOptionChains[selectedUnderlyingSymbol];
      if (chainsForUnderlying && chainsForUnderlying[selectedExpiry]) {
        setOptionChainData(chainsForUnderlying[selectedExpiry]);
      } else {
        setOptionChainData(null);
      }
    }
  }, [selectedUnderlyingSymbol, selectedExpiry]);
  
  const selectedUnderlyingDetails = mockUnderlyings.find(u => u.symbol === selectedUnderlyingSymbol);

  const getStrikePriceRowClass = (strike: number, underlyingValue?: number): string => {
    if (!underlyingValue) return "";
    const lowerBound = underlyingValue * 0.995; 
    const upperBound = underlyingValue * 1.005; 
    if (strike >= lowerBound && strike <= upperBound) {
      return "bg-yellow-400/20 dark:bg-yellow-600/20"; 
    }
    return "";
  };


  return (
    <div className="bg-card text-card-foreground border rounded-lg shadow-lg w-full">
      <div className="p-4 sm:p-6 border-b"> {/* Mimics CardHeader styling */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 className="text-xl font-semibold font-headline text-primary flex items-center">
                    <ArrowRightLeft className="h-6 w-6 mr-2" /> Option Chain
                </h2>
                {selectedUnderlyingDetails && optionChainData?.underlyingValue && (
                    <p className="text-xs mt-1 text-muted-foreground">
                        {selectedUnderlyingDetails.name} at {formatNumber(optionChainData.underlyingValue, 2)} as of mock data time.
                    </p>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Select value={selectedUnderlyingSymbol} onValueChange={setSelectedUnderlyingSymbol}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Underlying" />
              </SelectTrigger>
              <SelectContent>
                {mockUnderlyings.map((underlying) => (
                  <SelectItem key={underlying.id} value={underlying.symbol}>
                    {underlying.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedExpiry} onValueChange={setSelectedExpiry} disabled={availableExpiries.length === 0}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Expiry" />
              </SelectTrigger>
              <SelectContent>
                {availableExpiries.map((expiry) => (
                  <SelectItem key={expiry} value={expiry}>
                    {mockOptionChains[selectedUnderlyingSymbol]?.[expiry]?.expiryDate || expiry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto"> {/* Mimics CardContent behavior for the table */}
        {optionChainData && optionChainData.data.length > 0 ? (
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center sticky left-0 z-10 bg-card" colSpan={6}>CALLS</TableHead>
                <TableHead className="text-center w-[120px] bg-muted dark:bg-muted/50">Strike</TableHead>
                <TableHead className="text-center sticky right-0 z-10 bg-card" colSpan={6}>PUTS</TableHead>
              </TableRow>
              <TableRow>
                {/* Calls Headers */}
                <TableHead className="text-right min-w-[70px] bg-blue-500/10 dark:bg-blue-500/20">IV</TableHead>
                <TableHead className="text-right min-w-[80px] bg-blue-500/10 dark:bg-blue-500/20">Volume</TableHead>
                <TableHead className="text-right min-w-[100px] bg-blue-500/10 dark:bg-blue-500/20">Chg in OI</TableHead>
                <TableHead className="text-right min-w-[100px] bg-blue-500/10 dark:bg-blue-500/20">OI</TableHead>
                <TableHead className="text-right min-w-[80px] bg-blue-500/10 dark:bg-blue-500/20">LTP</TableHead>
                <TableHead className="text-right min-w-[80px] bg-blue-500/10 dark:bg-blue-500/20">Net Chng</TableHead>
                
                <TableHead className="text-center font-bold bg-muted dark:bg-muted/50 w-[120px]">Price</TableHead>
                
                {/* Puts Headers */}
                <TableHead className="text-right min-w-[80px] bg-orange-500/10 dark:bg-orange-500/20">Net Chng</TableHead>
                <TableHead className="text-right min-w-[80px] bg-orange-500/10 dark:bg-orange-500/20">LTP</TableHead>
                <TableHead className="text-right min-w-[100px] bg-orange-500/10 dark:bg-orange-500/20">OI</TableHead>
                <TableHead className="text-right min-w-[100px] bg-orange-500/10 dark:bg-orange-500/20">Chg in OI</TableHead>
                <TableHead className="text-right min-w-[80px] bg-orange-500/10 dark:bg-orange-500/20">Volume</TableHead>
                <TableHead className="text-right min-w-[70px] bg-orange-500/10 dark:bg-orange-500/20">IV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optionChainData.data.map((entry: OptionChainEntry) => (
                <TableRow key={entry.strikePrice} className={getStrikePriceRowClass(entry.strikePrice, optionChainData.underlyingValue)}>
                  <OptionChainCell data={entry.call} isCall />
                  <TableCell className={cn("text-center font-bold bg-muted dark:bg-muted/50", getStrikePriceRowClass(entry.strikePrice, optionChainData.underlyingValue))}>
                    {formatNumber(entry.strikePrice)}
                  </TableCell>
                  <OptionChainCell data={entry.put} isPut />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-muted-foreground p-4 sm:p-6"> {/* Added padding to mimic content area */}
            <p>No option chain data available for the selected underlying and expiry.</p>
            <p>Please select an underlying and expiry date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
