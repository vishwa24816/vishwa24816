
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockUnderlyings, mockOptionChains } from '@/lib/mockData/optionChainData';
import type { OptionChainData, OptionData, OptionChainEntry, Underlying } from '@/types';
import { cn } from '@/lib/utils';
import { ArrowRightLeft, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type OptionChainViewType = 'price' | 'volume_oi' | 'greeks';

const formatNumber = (num?: number, precision = 0) => {
  if (num === undefined || num === null || isNaN(num)) return '-';
  return num.toLocaleString('en-IN', { minimumFractionDigits: precision, maximumFractionDigits: precision });
};

const renderOptionTableHeaders = (view: OptionChainViewType, isCallSide: boolean): JSX.Element[] => {
  const callHeaderClass = "bg-blue-500/10 dark:bg-blue-500/20";
  const putHeaderClass = "bg-orange-500/10 dark:bg-orange-500/20";
  let headers: string[];
  const appliedHeaderClass = isCallSide ? callHeaderClass : putHeaderClass;

  if (view === 'price') {
    headers = isCallSide 
      ? ["Ask Qty", "Ask Price", "LTP", "Net Chng", "Bid Price", "Bid Qty"]
      : ["Bid Qty", "Bid Price", "Net Chng", "LTP", "Ask Price", "Ask Qty"];
  } else if (view === 'volume_oi') {
    headers = isCallSide
      ? ["IV", "Volume", "Chng in OI", "OI", "LTP", "Net Chng"]
      : ["Net Chng", "LTP", "OI", "Chng in OI", "Volume", "IV"];
  } else { // greeks
    headers = isCallSide
      ? ["Delta", "Gamma", "Theta", "Vega", "Rho", "LTP"]
      : ["LTP", "Rho", "Vega", "Theta", "Gamma", "Delta"];
  }
  
  return headers.map(header => (
    <TableHead key={`${isCallSide ? 'call' : 'put'}-${header}-${view}`} className={cn("text-right min-w-[80px] px-2 align-middle", appliedHeaderClass)}>{header}</TableHead>
  ));
};

const renderCells = (data: OptionData | undefined, view: OptionChainViewType, isCall: boolean): JSX.Element[] => {
  const cellClass = cn(isCall ? "bg-blue-500/5 dark:bg-blue-500/10" : "bg-orange-500/5 dark:bg-orange-500/10", "px-2 align-middle");

  if (!data) {
    return Array(6).fill(null).map((_, idx) => <TableCell key={`empty-${idx}-${view}-${isCall ? 'call' : 'put'}`} className={cn("text-center", cellClass)}>-</TableCell>);
  }

  const isPositiveChange = data.netChng >= 0;

  if (view === 'price') {
    const cells = isCall
      ? [data.askQty, data.askPrice, data.ltp, data.netChng, data.bidPrice, data.bidQty]
      : [data.bidQty, data.bidPrice, data.netChng, data.ltp, data.askPrice, data.askQty];
    const precisions = isCall ? [0,2,2,2,2,0] : [0,2,2,2,2,0];
    
    return cells.map((value, idx) => {
        let specialClass = "";
        if((isCall && idx === 2) || (!isCall && idx === 3)) specialClass = "font-bold"; // LTP
        if((isCall && idx === 3) || (!isCall && idx === 2)) specialClass = cn(specialClass, data.netChng >= 0 ? 'text-green-600' : 'text-red-600'); // NetChng

        const content = (isCall && idx === 3) || (!isCall && idx === 2) // NetChng column
            ? `${data.netChng !== 0 ? (isPositiveChange ? '+' : '') : ''}${formatNumber(data.netChng, 2)}`
            : formatNumber(value as number | undefined, precisions[idx]);

        return <TableCell key={`price-${idx}-${view}-${isCall ? 'call' : 'put'}`} className={cn("text-right", cellClass, specialClass)}>{content}</TableCell>
    });

  } else if (view === 'volume_oi') {
     const cells = isCall
      ? [data.iv, data.volume, data.chngInOI, data.oi, data.ltp, data.netChng]
      : [data.netChng, data.ltp, data.oi, data.chngInOI, data.volume, data.iv];
    const precisions = isCall ? [2,0,0,0,2,2] : [2,2,0,0,0,2];
     
    return cells.map((value, idx) => {
        let specialClass = "";
        if((isCall && idx === 2) || (!isCall && idx === 3)) specialClass = cn(data.chngInOI > 0 ? 'text-green-600' : data.chngInOI < 0 ? 'text-red-600' : '', "font-semibold"); // ChngInOI
        if((isCall && idx === 4) || (!isCall && idx === 1)) specialClass = "font-bold"; // LTP
        if((isCall && idx === 5) || (!isCall && idx === 0)) specialClass = cn(specialClass, data.netChng >= 0 ? 'text-green-600' : 'text-red-600'); // NetChng

        const content = (isCall && idx === 5) || (!isCall && idx === 0) // NetChng column
            ? `${data.netChng !== 0 ? (isPositiveChange ? '+' : '') : ''}${formatNumber(data.netChng, 2)}`
            : formatNumber(value as number | undefined, precisions[idx]);

        return <TableCell key={`vol-${idx}-${view}-${isCall ? 'call' : 'put'}`} className={cn("text-right", cellClass, specialClass)}>{content}</TableCell>;
    });
  } else { // greeks
    const cells = isCall
      ? [data.delta, data.gamma, data.theta, data.vega, data.rho, data.ltp]
      : [data.ltp, data.rho, data.vega, data.theta, data.gamma, data.delta];
    const precisions = isCall ? [4,4,4,4,4,2] : [2,4,4,4,4,4];

    return cells.map((value, idx) => {
        let specialClass = "";
        if((isCall && idx === 5) || (!isCall && idx === 0)) specialClass = "font-bold"; // LTP
        return <TableCell key={`greek-${idx}-${view}-${isCall ? 'call' : 'put'}`} className={cn("text-right", cellClass, specialClass)}>{formatNumber(value as number | undefined, precisions[idx])}</TableCell>;
    });
  }
};


export function OptionChain() {
  const [selectedUnderlyingSymbol, setSelectedUnderlyingSymbol] = useState<string>(mockUnderlyings[0].symbol);
  const [availableExpiries, setAvailableExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  const [optionChainData, setOptionChainData] = useState<OptionChainData | null>(null);
  const [optionChainView, setOptionChainView] = useState<OptionChainViewType>('volume_oi');
  const { toast } = useToast();

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

  const handleSelectOptionForStrategy = (
    optionType: 'Call' | 'Put',
    action: 'Buy' | 'Sell',
    strikePrice: number,
    optionData?: OptionData
  ) => {
    if (!selectedUnderlyingDetails || !optionChainData || !optionData) {
      toast({ title: "Error", description: "Option data not available to select for strategy.", variant: "destructive" });
      return;
    }

    toast({
      title: "Option Selected for Strategy",
      description: `${action} ${selectedUnderlyingSymbol} ${optionChainData.expiryDate} ${strikePrice} ${optionType} @ ${formatNumber(optionData.ltp, 2)} selected.`,
    });
  };


  const callCellBaseClass = "bg-blue-500/5 dark:bg-blue-500/10 px-2 align-middle";
  const putCellBaseClass = "bg-orange-500/5 dark:bg-orange-500/10 px-2 align-middle";
  const callHeaderBaseClass = "bg-blue-500/10 dark:bg-blue-500/20 align-middle";
  const putHeaderBaseClass = "bg-orange-500/10 dark:bg-orange-500/20 align-middle";


  return (
    <div className="bg-card text-card-foreground border rounded-lg shadow-lg w-full">
      <div className="p-4 sm:p-6 border-b">
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
        <RadioGroup 
            value={optionChainView} 
            onValueChange={(value) => setOptionChainView(value as OptionChainViewType)} 
            className="flex flex-wrap gap-2 mt-4"
        >
            {(['price', 'volume_oi', 'greeks'] as OptionChainViewType[]).map(viewType => (
                <Label 
                    key={viewType}
                    htmlFor={`view-${viewType}`} 
                    className={cn(
                        "flex items-center space-x-2 px-3 py-1.5 rounded-md border cursor-pointer text-xs sm:text-sm transition-colors hover:bg-muted/50",
                        optionChainView === viewType && "bg-primary/10 border-primary text-primary"
                    )}
                >
                    <RadioGroupItem value={viewType} id={`view-${viewType}`} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>{viewType === 'volume_oi' ? 'Volume/OI' : viewType.charAt(0).toUpperCase() + viewType.slice(1)}</span>
                </Label>
            ))}
        </RadioGroup>
      </div>
      <div className="overflow-x-auto"> 
        {optionChainData && optionChainData.data.length > 0 ? (
          <Table className="min-w-[1600px] text-xs"> {/* Adjusted min-width */}
            <TableHeader>
              <TableRow>
                <TableHead className="text-center bg-card" colSpan={7}>CALLS</TableHead>
                <TableHead className="text-center w-[100px] sm:w-[120px] bg-muted dark:bg-muted/50 align-middle">Strike</TableHead>
                <TableHead className="text-center bg-card" colSpan={7}>PUTS</TableHead>
              </TableRow>
              <TableRow>
                {renderOptionTableHeaders(optionChainView, true)}
                <TableHead className={cn("text-center px-2 min-w-[70px]", callHeaderBaseClass)}>Action</TableHead>
                
                <TableHead className="text-center font-bold bg-muted dark:bg-muted/50 w-[100px] sm:w-[120px] align-middle">Price</TableHead>
                
                <TableHead className={cn("text-center px-2 min-w-[70px]", putHeaderBaseClass)}>Action</TableHead>
                {renderOptionTableHeaders(optionChainView, false)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {optionChainData.data.map((entry: OptionChainEntry) => (
                <TableRow key={entry.strikePrice} className={cn("hover:bg-muted/20",getStrikePriceRowClass(entry.strikePrice, optionChainData.underlyingValue))}>
                  {renderCells(entry.call, optionChainView, true)}
                  <TableCell className={cn("text-center align-middle px-1", callCellBaseClass)}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1">
                        <Button variant="outline" className="h-6 px-1.5 text-xs font-medium text-green-600 border-green-600 hover:bg-green-600/10 hover:text-green-700" onClick={() => handleSelectOptionForStrategy('Call', 'Buy', entry.strikePrice, entry.call)}>B</Button>
                        <Button variant="outline" className="h-6 px-1.5 text-xs font-medium text-red-600 border-red-600 hover:bg-red-600/10 hover:text-red-700" onClick={() => handleSelectOptionForStrategy('Call', 'Sell', entry.strikePrice, entry.call)}>S</Button>
                    </div>
                  </TableCell>

                  <TableCell className={cn("text-center font-bold bg-muted dark:bg-muted/50 align-middle", getStrikePriceRowClass(entry.strikePrice, optionChainData.underlyingValue))}>
                    {formatNumber(entry.strikePrice)}
                  </TableCell>

                  <TableCell className={cn("text-center align-middle px-1", putCellBaseClass)}>
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1">
                        <Button variant="outline" className="h-6 px-1.5 text-xs font-medium text-green-600 border-green-600 hover:bg-green-600/10 hover:text-green-700" onClick={() => handleSelectOptionForStrategy('Put', 'Buy', entry.strikePrice, entry.put)}>B</Button>
                        <Button variant="outline" className="h-6 px-1.5 text-xs font-medium text-red-600 border-red-600 hover:bg-red-600/10 hover:text-red-700" onClick={() => handleSelectOptionForStrategy('Put', 'Sell', entry.strikePrice, entry.put)}>S</Button>
                    </div>
                  </TableCell>
                  {renderCells(entry.put, optionChainView, false)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 text-muted-foreground p-4 sm:p-6">
            <p>No option chain data available for the selected underlying and expiry.</p>
            <p>Please select an underlying and expiry date.</p>
          </div>
        )}
      </div>
    </div>
  );
}

