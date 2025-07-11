
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
import { ArrowUpDown, LineChart, Target, Plus, Minus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface OptionChainProps {
  onAddLeg: (legs: SelectedOptionLeg[]) => void;
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

const PriceCell = ({ bid, ask, onClick }: { bid?: number, ask?: number, onClick: (price: number, type: 'bid' | 'ask') => void }) => (
    <div className="flex flex-col items-center text-xs">
        <span className="text-green-600 dark:text-green-400 p-1 hover:bg-green-500/10 rounded-md w-full text-center" onClick={(e) => { e.stopPropagation(); onClick(bid || 0, 'bid'); }}>{formatNumber(bid, 2)}</span>
        <span className="text-red-600 dark:text-red-400 p-1 hover:bg-red-500/10 rounded-md w-full text-center" onClick={(e) => { e.stopPropagation(); onClick(ask || 0, 'ask'); }}>{formatNumber(ask, 2)}</span>
    </div>
);

const MarkCell = ({ price, iv, onClick }: { price?: number, iv?: number, onClick: (price: number, type: 'ltp') => void }) => (
    <div className="flex flex-col items-center text-xs p-1 hover:bg-primary/10 rounded-md" onClick={(e) => { e.stopPropagation(); onClick(price || 0, 'ltp'); }}>
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

const ExpandedRowContent = ({ lotSize, onBuy, onSell }: { lotSize: number; onBuy: (qty: number) => void; onSell: (qty: number) => void; }) => {
    const [quantity, setQuantity] = useState(1);
    
    const handleBuy = (e: React.MouseEvent) => {
      e.stopPropagation();
      onBuy(quantity);
    }
    const handleSell = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSell(quantity);
    }
    const handleQuantityClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    }

    return (
        <div className="bg-muted/70 p-3 flex items-center justify-center space-x-4" onClick={handleQuantityClick}>
            <div className="flex items-center space-x-2">
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <Input 
                    type="number" 
                    className="w-20 h-9 text-center" 
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min="1"
                />
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <span className="text-xs text-muted-foreground">Qty: {(quantity * lotSize).toLocaleString()}</span>
            <div className="flex items-center space-x-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleBuy}>Buy</Button>
                <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleSell}>Sell</Button>
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
    setExpandedStrike(null); // Collapse rows on data change
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

  const handleAddLeg = (strikePrice: number, optionType: 'Call' | 'Put', action: 'Buy' | 'Sell', price: number) => {
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
      quantity: 1, // Default to 1 lot
    };

    onAddLeg((prevLegs) => [...prevLegs, newLeg]);
    toast({
      title: 'Leg Added',
      description: `${action} ${newLeg.instrumentName} at ₹${price.toFixed(2)}`,
    });
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
    if (optionChainView === 'volume_oi') {
      return (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[15%] text-center"><HeaderCell title="Volume" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Open Int." /></TableHead>
            <TableHead className="w-[40%] text-center" colSpan={2}><HeaderCell title="Strike" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Open Int." /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Volume" /></TableHead>
        </TableRow>
      );
    }
    if (optionChainView === 'greeks') {
      return (
        <TableRow className="border-border hover:bg-transparent">
            <TableHead className="w-[15%] text-center"><HeaderCell title="Delta" subtitle="Vega" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Theta" subtitle="Gamma" /></TableHead>
            <TableHead className="w-[40%] text-center" colSpan={2}><HeaderCell title="Strike" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Theta" subtitle="Gamma" /></TableHead>
            <TableHead className="w-[15%] text-center"><HeaderCell title="Delta" subtitle="Vega" /></TableHead>
        </TableRow>
      );
    }
    return null;
  }

  const renderCells = (data: OptionData | undefined, view: OptionChainViewType, type: 'Call' | 'Put', strike: number) => {
     if (!data) return <><TableCell/><TableCell/></>;

     if (view === 'price') return <>
        <TableCell className="w-[15%]"><PriceCell bid={data.bidPrice} ask={data.askPrice} onClick={(price, actionType) => handleAddLeg(strike, type, actionType === 'bid' ? 'Sell' : 'Buy', price)} /></TableCell>
        <TableCell className="w-[15%]"><MarkCell price={data.ltp} iv={data.iv} onClick={(price) => handleAddLeg(strike, type, 'Buy', price)} /></TableCell>
     </>
     if (view === 'volume_oi') return <>
        <TableCell className="w-[15%] text-center">{formatNumber(data.volume, 0)}</TableCell>
        <TableCell className="w-[15%] text-center">{formatNumber(data.oi, 0)}</TableCell>
     </>
     if (view === 'greeks') return <>
        <TableCell className="w-[15%] text-center"><div className="flex flex-col items-center text-xs"><p>{formatNumber(data.delta, 2)}</p><p className="text-muted-foreground">{formatNumber(data.vega, 2)}</p></div></TableCell>
        <TableCell className="w-[15%] text-center"><div className="flex flex-col items-center text-xs"><p>{formatNumber(data.theta, 2)}</p><p className="text-muted-foreground">{formatNumber(data.gamma, 2)}</p></div></TableCell>
     </>
     return null;
  }

  return (
    <div className="bg-background text-foreground w-full flex flex-col h-[70vh]">
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
                         <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="w-[30%]" colSpan={2}>CALLS</TableHead>
                            <TableHead className="w-[40%] text-center" colSpan={2}><HeaderCell title="" /></TableHead>
                            <TableHead className="w-[30%] text-right" colSpan={2}>PUTS</TableHead>
                         </TableRow>
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
                                <TableRow className="sticky top-20 z-10 hover:bg-transparent">
                                    <TableCell colSpan={6} className="p-0 h-8">
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
                            <TableRow 
                                ref={index === atmIndex ? atmRowRef : null}
                                className="border-border cursor-pointer"
                                onClick={() => setExpandedStrike(isExpanded ? null : entry.strikePrice)}
                            >
                                {renderCells(entry.call, optionChainView, 'Call', entry.strikePrice).props.children.map((cell: React.ReactElement, cellIndex: number) => React.cloneElement(cell, { className: cn(cell.props.className, isCallItm && 'bg-primary/5') }))}

                                <TableCell className="w-[20%] font-semibold text-base text-center p-0">{formatNumber(entry.strikePrice, 0)}</TableCell>
                                <TableCell className="w-[20%] p-0"><OIBars callOI={entry.call?.oi} putOI={entry.put?.oi} totalOI={totalOI} /></TableCell>

                                {renderCells(entry.put, optionChainView, 'Put', entry.strikePrice).props.children.map((cell: React.ReactElement, cellIndex: number) => React.cloneElement(cell, { className: cn(cell.props.className, isPutItm && 'bg-primary/5') }))}
                            </TableRow>
                            {isExpanded && (
                                <TableRow className="border-border bg-muted hover:bg-muted/90">
                                    <TableCell colSpan={2} className="p-0">
                                        <ExpandedRowContent 
                                            lotSize={selectedUnderlyingDetails?.symbol === 'BANKNIFTY' ? 15 : 50} 
                                            onBuy={(qty) => toast({ title: `BUY ${qty} lot(s) of ${entry.strikePrice} CALL`})}
                                            onSell={(qty) => toast({ title: `SELL ${qty} lot(s) of ${entry.strikePrice} CALL`})}
                                        />
                                    </TableCell>
                                    <TableCell colSpan={2} />
                                    <TableCell colSpan={2} className="p-0">
                                        <ExpandedRowContent 
                                            lotSize={selectedUnderlyingDetails?.symbol === 'BANKNIFTY' ? 15 : 50} 
                                            onBuy={(qty) => toast({ title: `BUY ${qty} lot(s) of ${entry.strikePrice} PUT`})}
                                            onSell={(qty) => toast({ title: `SELL ${qty} lot(s) of ${entry.strikePrice} PUT`})}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                           </React.Fragment>
                        )})}
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
