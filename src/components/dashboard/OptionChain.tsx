
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
import { Input } from "@/components/ui/input";
import { mockUnderlyings, mockOptionChains } from '@/lib/mockData/optionChainData';
import type { OptionChainData, OptionData, Underlying, SelectedOptionLeg } from '@/types';
import { cn } from '@/lib/utils';
import { Target, Plus, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface OptionChainProps {
  onAddLeg: (leg: SelectedOptionLeg) => void;
}

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
        <span className="text-green-600 dark:text-green-400 p-1 rounded-md w-full text-center">{formatNumber(bid, 2)}</span>
        <span className="text-red-600 dark:text-red-400 p-1 rounded-md w-full text-center">{formatNumber(ask, 2)}</span>
    </div>
);

const MarkCell = ({ price, iv }: { price?: number, iv?: number }) => (
    <div className="flex flex-col items-center text-xs p-1 rounded-md">
        <span className="font-semibold text-foreground">₹{formatNumber(price, 2)}</span>
        <span className="text-muted-foreground">{formatNumber(iv, 1)}%</span>
    </div>
);

const ExpandedRowContent = ({
  lotSize,
  onBuy,
  onSell
}: {
  lotSize: number;
  onBuy: (qty: number) => void;
  onSell: (qty: number) => void;
}) => {
  const [quantity, setQuantity] = useState(1);
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className="bg-muted/70 p-3 flex items-center justify-center space-x-4" onClick={stopPropagation}>
      <div className="flex items-center space-x-2">
        <Label htmlFor={`lots-${lotSize}`} className="text-xs shrink-0">Lots:</Label>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
        <Input
          id={`lots-${lotSize}`}
          type="number"
          className="w-16 h-8 text-center"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
          min="1"
        />
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
      </div>
      <span className="text-xs text-muted-foreground">Qty: {(quantity * lotSize).toLocaleString()}</span>
      <div className="flex items-center space-x-2">
        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => onBuy(quantity)}>Buy</Button>
        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => onSell(quantity)}>Sell</Button>
      </div>
    </div>
  );
};

export function OptionChain({ onAddLeg }: OptionChainProps) {
  const [selectedUnderlyingSymbol, setSelectedUnderlyingSymbol] = useState<string>(mockUnderlyings[0].symbol);
  const [availableExpiries, setAvailableExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [optionChainData, setOptionChainData] = useState<OptionChainData | null>(null);
  const [optionChainView, setOptionChainView] = useState<OptionChainViewType>('price');
  const [expandedStrike, setExpandedStrike] = useState<number | null>(null);
  const { toast } = useToast();
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const atmRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    const chainsForUnderlying = mockOptionChains[selectedUnderlyingSymbol];
    if (chainsForUnderlying) {
      const expiries = Object.keys(chainsForUnderlying);
      setAvailableExpiries(expiries);
      const firstExpiry = expiries[0] || '';
      setSelectedExpiry(firstExpiry);
      setOptionChainData(chainsForUnderlying[firstExpiry] || null);
    } else {
      setAvailableExpiries([]);
      setSelectedExpiry('');
      setOptionChainData(null);
    }
  }, [selectedUnderlyingSymbol]);

  useEffect(() => {
    if (selectedUnderlyingSymbol && selectedExpiry) {
      setOptionChainData(mockOptionChains[selectedUnderlyingSymbol]?.[selectedExpiry] || null);
    }
    setExpandedStrike(null); // Collapse rows on data change
  }, [selectedUnderlyingSymbol, selectedExpiry]);

  useEffect(() => {
    if (atmRowRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (container) {
        const containerHeight = container.clientHeight;
        const rowTop = atmRowRef.current.offsetTop;
        const rowHeight = atmRowRef.current.clientHeight;
        container.scrollTop = rowTop - (containerHeight / 2) + (rowHeight / 2);
      }
    }
  }, [optionChainData]);

  const selectedUnderlyingDetails = useMemo(() => mockUnderlyings.find(u => u.symbol === selectedUnderlyingSymbol), [selectedUnderlyingSymbol]);
  
  const atmIndex = useMemo(() => {
    if (!optionChainData?.data || !optionChainData?.underlyingValue) return -1;
    let closestIndex = -1;
    let minDiff = Infinity;
    optionChainData.data.forEach((entry, index) => {
      const diff = Math.abs(entry.strikePrice - optionChainData.underlyingValue!);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = index;
      }
    });
    return closestIndex;
  }, [optionChainData]);

  const handleAddLeg = (strikePrice: number, optionType: 'Call' | 'Put', action: 'Buy' | 'Sell', price: number, quantity: number) => {
    if (!optionChainData || !selectedUnderlyingDetails) return;
    
    const newLeg: SelectedOptionLeg = {
      id: `${selectedUnderlyingDetails.symbol}-${selectedExpiry}-${strikePrice}-${optionType}-${action}-${Date.now()}`,
      underlyingSymbol: selectedUnderlyingDetails.symbol,
      instrumentName: `${selectedUnderlyingDetails.symbol} ${selectedExpiry} ${strikePrice} ${optionType === 'Call' ? 'CE' : 'PE'}`,
      expiryDate: optionChainData.expiryDate,
      strikePrice,
      optionType,
      action,
      ltp: price,
      quantity: quantity,
    };

    onAddLeg(newLeg);
    toast({
      title: 'Leg Added',
      description: `${action} ${quantity} lot(s) of ${newLeg.instrumentName} at ₹${price.toFixed(2)}`,
    });
  };

  const renderCells = (data: OptionData | undefined, view: OptionChainViewType): React.ReactNode[] => {
     if (!data) return [<TableCell key="empty1" />, <TableCell key="empty2" />];

     if (view === 'price') return [
        <TableCell key="price-bidask"><PriceCell bid={data.bidPrice} ask={data.askPrice} /></TableCell>,
        <TableCell key="price-mark"><MarkCell price={data.ltp} iv={data.iv} /></TableCell>
     ];
     if (view === 'volume_oi') return [
        <TableCell key="vol" className="text-center">{formatNumber(data.volume, 0)}</TableCell>,
        <TableCell key="oi" className="text-center">{formatNumber(data.oi, 0)}</TableCell>
     ];
     if (view === 'greeks') return [
        <TableCell key="greeks1" className="text-center"><div className="flex flex-col items-center text-xs"><p>{formatNumber(data.delta, 2)}</p><p className="text-muted-foreground">{formatNumber(data.vega, 2)}</p></div></TableCell>,
        <TableCell key="greeks2" className="text-center"><div className="flex flex-col items-center text-xs"><p>{formatNumber(data.theta, 2)}</p><p className="text-muted-foreground">{formatNumber(data.gamma, 2)}</p></div></TableCell>
     ];
     return [<TableCell key="empty1" />, <TableCell key="empty2" />];
  }

  const renderHeaders = () => {
    const baseHeaders = (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead colSpan={2} className="text-center font-semibold">CALLS</TableHead>
            <TableHead className="text-center w-[15%]"><HeaderCell title="Strike" /></TableHead>
            <TableHead colSpan={2} className="text-center font-semibold">PUTS</TableHead>
        </TableRow>
    );

    let specificHeaders;
    if (optionChainView === 'price') specificHeaders = (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="BID" subtitle="ASK" /></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Mark" subtitle="Price/IV" /></TableHead>
            <TableHead className="w-[15%]"></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Mark" subtitle="Price/IV" /></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="BID" subtitle="ASK" /></TableHead>
        </TableRow>
    );
    if (optionChainView === 'volume_oi') specificHeaders = (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Volume" /></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Open Int." /></TableHead>
            <TableHead className="w-[15%]"></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Open Int." /></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Volume" /></TableHead>
        </TableRow>
    );
    if (optionChainView === 'greeks') specificHeaders = (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Delta" subtitle="Vega" /></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Theta" subtitle="Gamma" /></TableHead>
            <TableHead className="w-[15%]"></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Theta" subtitle="Gamma" /></TableHead>
            <TableHead className="text-center w-[21.25%]"><HeaderCell title="Delta" subtitle="Vega" /></TableHead>
        </TableRow>
    );
    return <>{baseHeaders}{specificHeaders}</>;
  }

  return (
    <div className="bg-background text-foreground w-full flex flex-col h-[70vh]">
      {/* Header Controls */}
      <div className="p-2 sm:p-3 border-b border-border flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={selectedUnderlyingSymbol} onValueChange={setSelectedUnderlyingSymbol}>
            <SelectTrigger className="w-full sm:w-[160px] h-8 bg-background border-border text-xs">
              <SelectValue placeholder="Select Underlying" />
            </SelectTrigger>
            <SelectContent>{mockUnderlyings.map(u => <SelectItem key={u.id} value={u.symbol} className="text-xs">{u.name}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedExpiry} onValueChange={setSelectedExpiry} disabled={!availableExpiries.length}>
            <SelectTrigger className="w-full sm:w-[140px] h-8 bg-background border-border text-xs">
              <SelectValue placeholder="Select Expiry" />
            </SelectTrigger>
            <SelectContent>{availableExpiries.map(expiry => <SelectItem key={expiry} value={expiry} className="text-xs">{mockOptionChains[selectedUnderlyingSymbol]?.[expiry]?.expiryDate || expiry}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center bg-muted p-0.5 rounded-md">
          {(['price', 'volume_oi', 'greeks'] as const).map(view => (
            <Button key={view} onClick={() => setOptionChainView(view)} variant="ghost" size="sm" className={cn("h-7 text-xs px-3 capitalize", optionChainView === view ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              {view.replace('_', '/')}
            </Button>
          ))}
        </div>
      </div>

      {/* Option Chain Table */}
      <div className="flex-grow overflow-hidden">
        {optionChainData?.data.length ? (
          <ScrollArea className="h-full" ref={scrollContainerRef}>
            <Table className="min-w-full text-xs" style={{ tableLayout: 'fixed' }}>
              <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                {renderHeaders()}
              </TableHeader>
              <TableBody>
                {optionChainData.data.map((entry, index) => {
                  const isCallItm = optionChainData.underlyingValue && entry.strikePrice < optionChainData.underlyingValue;
                  const isPutItm = optionChainData.underlyingValue && entry.strikePrice > optionChainData.underlyingValue;
                  const isExpanded = expandedStrike === entry.strikePrice;

                  return (
                    <React.Fragment key={entry.strikePrice}>
                      {index === atmIndex && (
                        <TableRow className="sticky top-[7.5rem] z-10 hover:bg-transparent">
                          <TableCell colSpan={5} className="p-0 h-8">
                            <div className="h-full w-full flex items-center justify-center bg-muted/80 backdrop-blur-sm">
                              <div className="bg-background border rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span>{selectedUnderlyingSymbol}</span>
                                <span>₹{formatNumber(optionChainData.underlyingValue, 2)}</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      <TableRow ref={index === atmIndex ? atmRowRef : null} className="border-border cursor-pointer" onClick={() => setExpandedStrike(isExpanded ? null : entry.strikePrice)}>
                        {renderCells(entry.call, optionChainView).map((cell, cellIndex) => React.cloneElement(cell as React.ReactElement, { key: `call-${cellIndex}`, className: cn((cell as React.ReactElement).props.className, isCallItm && 'bg-primary/5') }))}
                        <TableCell className="font-semibold text-base text-center p-0">{formatNumber(entry.strikePrice, 0)}</TableCell>
                        {renderCells(entry.put, optionChainView).map((cell, cellIndex) => React.cloneElement(cell as React.ReactElement, { key: `put-${cellIndex}`, className: cn((cell as React.ReactElement).props.className, isPutItm && 'bg-primary/5') }))}
                      </TableRow>
                      {isExpanded && (
                        <TableRow className="border-border bg-muted hover:bg-muted/90">
                          <TableCell colSpan={5} className="p-0">
                            <div className="flex justify-between items-center w-full">
                              <div className="w-[42.5%] flex justify-center">
                                <ExpandedRowContent lotSize={selectedUnderlyingDetails?.symbol === 'BANKNIFTY' ? 15 : 50} onBuy={(qty) => handleAddLeg(entry.strikePrice, 'Call', 'Buy', entry.call?.ltp ?? 0, qty)} onSell={(qty) => handleAddLeg(entry.strikePrice, 'Call', 'Sell', entry.call?.ltp ?? 0, qty)} />
                              </div>
                               <div className="w-[15%]"></div>
                              <div className="w-[42.5%] flex justify-center">
                                <ExpandedRowContent lotSize={selectedUnderlyingDetails?.symbol === 'BANKNIFTY' ? 15 : 50} onBuy={(qty) => handleAddLeg(entry.strikePrice, 'Put', 'Buy', entry.put?.ltp ?? 0, qty)} onSell={(qty) => handleAddLeg(entry.strikePrice, 'Put', 'Sell', entry.put?.ltp ?? 0, qty)} />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
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
