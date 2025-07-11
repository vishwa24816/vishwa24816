
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import { Button } from "@/components/ui/button";
import { mockUnderlyings, mockOptionChains } from '@/lib/mockData/optionChainData';
import type { OptionChainData, OptionData, Underlying } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowUpDown, LineChart } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';


type OptionChainViewType = 'price' | 'volume_oi' | 'greeks';

const formatNumber = (num?: number, precision = 2) => {
  if (num === undefined || num === null || isNaN(num)) return '-';
  const fixedNum = num.toFixed(precision);
  if (parseFloat(fixedNum) >= 1000) {
    return parseFloat(fixedNum).toLocaleString('en-IN', { minimumFractionDigits: precision, maximumFractionDigits: precision });
  }
  return fixedNum;
};

const HeaderCell = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className="flex flex-col items-center">
        <span className="text-xs text-muted-foreground font-medium">{title}</span>
        {subtitle && <span className="text-[10px] text-muted-foreground/70 -mt-0.5">{subtitle}</span>}
    </div>
);

const PriceCell = ({ bid, ask }: { bid?: number, ask?: number }) => (
    <div className="flex flex-col items-center text-xs">
        <span className="text-green-600 dark:text-green-400">{formatNumber(bid, 2)}</span>
        <span className="text-red-600 dark:text-red-400">{formatNumber(ask, 2)}</span>
    </div>
);

const MarkCell = ({ price, iv }: { price?: number, iv?: number }) => (
    <div className="flex flex-col items-center text-xs">
        <span className="font-semibold text-foreground">₹{formatNumber(price, 2)}</span>
        <span className="text-muted-foreground">{formatNumber(iv, 1)}%</span>
    </div>
);

const OIBAR_MAX_WIDTH = 60; // max width for OI bars on each side

const OIBars = ({ callOI, putOI, totalOI }: { callOI?: number, putOI?: number, totalOI: number }) => {
    const callWidth = totalOI > 0 && callOI ? (callOI / totalOI) * OIBAR_MAX_WIDTH : 0;
    const putWidth = totalOI > 0 && putOI ? (putOI / totalOI) * OIBAR_MAX_WIDTH : 0;

    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="flex items-center justify-end w-1/2 pr-1">
                <div className="bg-red-500/50 h-2.5 rounded-l-sm" style={{ width: `${putWidth}px` }} />
            </div>
            <div className="flex items-center justify-start w-1/2 pl-1">
                <div className="bg-green-500/50 h-2.5 rounded-r-sm" style={{ width: `${callWidth}px` }} />
            </div>
        </div>
    );
};


export function OptionChain() {
  const [selectedUnderlyingSymbol, setSelectedUnderlyingSymbol] = useState<string>(mockUnderlyings[0].symbol);
  const [availableExpiries, setAvailableExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [optionChainData, setOptionChainData] = useState<OptionChainData | null>(null);
  const [optionChainView, setOptionChainView] = useState<OptionChainViewType>('price');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const atmRowRef = useRef<HTMLTableRowElement>(null);

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

  useEffect(() => {
    if (atmRowRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if(container){
            const containerHeight = container.clientHeight;
            const rowTop = atmRowRef.current.offsetTop;
            const rowHeight = atmRowRef.current.clientHeight;
            container.scrollTop = rowTop - (containerHeight / 2) + (rowHeight / 2);
        }
    }
  }, [optionChainData]);


  const selectedUnderlyingDetails = mockUnderlyings.find(u => u.symbol === selectedUnderlyingSymbol);

  const findATMIndex = (data: typeof optionChainData.data, underlyingPrice: number) => {
    let closestIndex = -1;
    let minDiff = Infinity;
    data.forEach((entry, index) => {
      const diff = Math.abs(entry.strikePrice - underlyingPrice);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });
    return closestIndex;
  };
  
  const atmIndex = optionChainData?.data && optionChainData?.underlyingValue ? findATMIndex(optionChainData.data, optionChainData.underlyingValue) : -1;
  const totalOI = useMemo(() => {
    if (!optionChainData) return 0;
    return Math.max(...optionChainData.data.map(d => (d.call?.oi || 0) + (d.put?.oi || 0)));
  }, [optionChainData]);

  const renderHeaders = () => {
    if (optionChainView === 'price') {
      return (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[15%] text-center"><HeaderCell title="BID" subtitle="ASK" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Mark" subtitle="Price/IV" /></TableHead>
            <TableHead className="w-[40%] text-center" colSpan={2}>
                <div className="flex items-center justify-center">
                <HeaderCell title="Strike" /> <ArrowUpDown className="h-3 w-3 ml-1 text-muted-foreground" />
                </div>
            </TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Mark" subtitle="Price/IV" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="BID" subtitle="ASK" /></TableHead>
        </TableRow>
      );
    }
    // Implement other headers if needed
    return null;
  }

  const renderCells = (data: OptionData | undefined, view: OptionChainViewType) => {
     if (!data || view !== 'price') return (
        <>
            <TableCell className="text-center w-[15%]">-</TableCell>
            <TableCell className="text-center w-[15%]">-</TableCell>
        </>
     );
     return <>
        <TableCell className="w-[15%]"><PriceCell bid={data.bidPrice} ask={data.askPrice} /></TableCell>
        <TableCell className="w-[15%]"><MarkCell price={data.ltp} iv={data.iv} /></TableCell>
     </>
  }

  return (
    <div className="bg-background text-foreground w-full flex flex-col h-[70vh] border rounded-lg shadow-lg">
        {/* Header Controls */}
        <div className="p-2 sm:p-3 border-b border-border flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                 <Select value={selectedUnderlyingSymbol} onValueChange={setSelectedUnderlyingSymbol}>
                    <SelectTrigger className="w-full sm:w-[160px] h-8 bg-background border-border text-xs">
                        <SelectValue placeholder="Select Underlying" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                        {mockUnderlyings.map((underlying) => (
                        <SelectItem key={underlying.id} value={underlying.symbol} className="text-xs">
                            {underlying.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedExpiry} onValueChange={setSelectedExpiry} disabled={availableExpiries.length === 0}>
                    <SelectTrigger className="w-full sm:w-[140px] h-8 bg-background border-border text-xs">
                        <SelectValue placeholder="Select Expiry" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                        {availableExpiries.map((expiry) => (
                        <SelectItem key={expiry} value={expiry} className="text-xs">
                            {mockOptionChains[selectedUnderlyingSymbol]?.[expiry]?.expiryDate || expiry}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center bg-muted p-0.5 rounded-md">
                <Button onClick={() => setOptionChainView('price')} variant="ghost" size="sm" className={cn("h-7 text-xs px-3", optionChainView === 'price' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>Price</Button>
                <Button onClick={() => setOptionChainView('volume_oi')} variant="ghost" size="sm" className={cn("h-7 text-xs px-3", optionChainView === 'volume_oi' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>OI/Vol</Button>
                <Button onClick={() => setOptionChainView('greeks')} variant="ghost" size="sm" className={cn("h-7 text-xs px-3", optionChainView === 'greeks' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>Greeks</Button>
            </div>
        </div>

        {/* Option Chain Table */}
        <div className="flex-grow overflow-hidden">
        {optionChainData && optionChainData.data.length > 0 ? (
            <ScrollArea className="h-full" ref={scrollContainerRef}>
                <Table className="min-w-full text-xs">
                    <TableHeader className="sticky top-0 bg-background z-10">
                        {renderHeaders()}
                    </TableHeader>
                    <TableBody>
                        {optionChainData.data.map((entry, index) => (
                           <React.Fragment key={entry.strikePrice}>
                             {index === atmIndex && (
                                <TableRow className="sticky top-10 z-10 hover:bg-transparent">
                                    <TableCell colSpan={6} className="p-0 h-8">
                                        <div className="h-full w-full flex items-center justify-center bg-muted/80 backdrop-blur-sm">
                                            <div className="bg-background border rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-2">
                                                <LineChart className="h-4 w-4 text-primary" />
                                                <span>{selectedUnderlyingSymbol}</span>
                                                <span>₹{formatNumber(optionChainData.underlyingValue, 2)}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                             )}
                            <TableRow 
                                ref={index === atmIndex ? atmRowRef : null}
                                className={cn("border-border hover:bg-muted/50 cursor-pointer",
                                // Puts are ITM when strike > underlying; Calls are ITM when strike < underlying
                                (optionChainData.underlyingValue && entry.strikePrice < optionChainData.underlyingValue && "bg-primary/5"), 
                                (optionChainData.underlyingValue && entry.strikePrice > optionChainData.underlyingValue && "bg-accent/5")
                                )}
                            >
                                {renderCells(entry.call, optionChainView)}
                                <TableCell className="w-[20%] font-semibold text-base text-center p-0">{formatNumber(entry.strikePrice, 0)}</TableCell>
                                <TableCell className="w-[20%] p-0"><OIBars callOI={entry.call?.oi} putOI={entry.put?.oi} totalOI={totalOI} /></TableCell>
                                {renderCells(entry.put, optionChainView)}
                            </TableRow>
                           </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        ) : (
            <div className="text-center py-10 text-muted-foreground p-4 sm:p-6">
                <p>No option chain data available for the selected underlying and expiry.</p>
            </div>
        )}
        </div>
    </div>
  );
}
