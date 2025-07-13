
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { mockUnderlyings } from '@/lib/mockData';

type StrategyType = 'bullish' | 'bearish' | 'non-directional';

interface Strategy {
  id: string;
  name: string;
  type: StrategyType;
  payoffGraph: React.ReactNode;
}

const strategies: Strategy[] = [
  // Bullish
  { id: 'long-call', name: 'Long Call', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 8 L10 8 L20 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M10 8 L0 8" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'short-put', name: 'Short Put', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 2 L10 2 L20 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/><path d="M0 2 L10 2" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bull-call-spread', name: 'Bull Call Spread', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M5 8 L10 4 L15 4" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 6 L5 6 L10 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bull-put-spread', name: 'Bull Put Spread', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 4 L5 4 L10 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M5 4 L10 8 L15 8" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'call-ratio-backspread', name: 'Call Ratio Backspread', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M5 6 L10 0 L15 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 4 L5 4 L10 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  
  // Bearish
  { id: 'long-put', name: 'Long Put', type: 'bearish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 0 L10 8 L20 8" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M10 8 L20 8" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'short-call', name: 'Short Call', type: 'bearish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 8 L10 2 L20 2" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M10 2 L0 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bear-call-spread', name: 'Bear Call Spread', type: 'bearish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 4 L5 4 L10 8" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M5 4 L10 0 L15 0" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bear-put-spread', name: 'Bear Put Spread', type: 'bearish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 2 L5 2 L10 6" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M5 2 L10 8 L15 8" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'put-ratio-backspread', name: 'Put Ratio Backspread', type: 'bearish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 0 L5 4 L10 4" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M5 4 L10 10 L15 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  
  // Non-Directional
  { id: 'long-straddle', name: 'Long Straddle', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 0 L10 8 L20 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M10 8 L10 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'short-straddle', name: 'Short Straddle', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 10 L10 2 L20 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/><path d="M10 2 L10 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'long-strangle', name: 'Long Strangle', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 0 L8 6 L12 6 L20 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M8 6 L12 6" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'short-strangle', name: 'Short Strangle', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 10 L8 4 L12 4 L20 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/><path d="M8 4 L12 4" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'iron-condor', name: 'Iron Condor', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M5 6 L8 4 L12 4 L15 6" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 6 L5 6 M15 6 L20 6" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'iron-butterfly', name: 'Iron Butterfly', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M5 6 L10 2 L15 6" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 6 L5 6 M15 6 L20 6" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
];

const InfoBadge = ({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) => (
  <div className={cn("text-xs px-2.5 py-1.5 rounded-md flex justify-center items-center font-medium", colorClass)}>
    {label}: {value}
  </div>
);

export function ReadymadeStrategiesSection() {
  const { toast } = useToast();
  const [selectedUnderlying, setSelectedUnderlying] = useState('NIFTY');
  const [activeFilter, setActiveFilter] = useState<StrategyType>('bullish');

  const underlyingData = useMemo(() => {
    const baseData = {
        NIFTY: { spot: 24841.5, futures: 24859, lotSize: 25, iv: 16.39, ivPercentile: 82.8, dte: 0 },
        BANKNIFTY: { spot: 47500.2, futures: 47550, lotSize: 15, iv: 18.5, ivPercentile: 75.1, dte: 0 },
        BTC: { spot: 65123.4, futures: 65180, lotSize: 1, iv: 65.2, ivPercentile: 60.5, dte: 1 },
        ETH: { spot: 3456.7, futures: 3460, lotSize: 1, iv: 72.8, ivPercentile: 68.3, dte: 1 },
    };
    return baseData[selectedUnderlying as keyof typeof baseData] || baseData.NIFTY;
  }, [selectedUnderlying]);

  const filteredStrategies = strategies.filter(s => s.type === activeFilter);
  
  const handleStrategyClick = (strategyName: string) => {
    toast({
      title: "Strategy Selected",
      description: `${strategyName} selected for ${selectedUnderlying}. Legs would be added to builder.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <Select value={selectedUnderlying} onValueChange={setSelectedUnderlying}>
            <SelectTrigger className="w-full sm:w-[280px]">
              <SelectValue placeholder="Select Index/Stock" />
            </SelectTrigger>
            <SelectContent>
              {mockUnderlyings.map(u => (
                <SelectItem key={u.id} value={u.symbol}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <InfoBadge label="Spot Price" value={underlyingData.spot} colorClass="bg-cyan-100 text-cyan-800" />
            <InfoBadge label="Futures Price" value={underlyingData.futures} colorClass="bg-orange-100 text-orange-800" />
            <InfoBadge label="Lot Size" value={underlyingData.lotSize} colorClass="bg-lime-100 text-lime-800" />
            <InfoBadge label="IV" value={underlyingData.iv} colorClass="bg-yellow-100 text-yellow-800" />
            <InfoBadge label="IV Percentile" value={underlyingData.ivPercentile} colorClass="bg-purple-100 text-purple-800" />
            <InfoBadge label="DTE" value={underlyingData.dte} colorClass="bg-red-100 text-red-800" />
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Select Pay-off Date</p>
            <p className="text-lg font-semibold">17-06-2025</p>
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex md:flex-col gap-2 w-full md:w-40 shrink-0">
          {(['bullish', 'bearish', 'non-directional'] as StrategyType[]).map(type => (
            <Button
              key={type}
              onClick={() => setActiveFilter(type)}
              variant={activeFilter === type ? 'default' : 'outline'}
              className={cn("capitalize w-full justify-center py-3", 
                activeFilter === type && type === 'bullish' && 'bg-green-600 hover:bg-green-700',
                activeFilter === type && type === 'bearish' && 'bg-red-600 hover:bg-red-700',
              )}
            >
              {type}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-grow">
          {filteredStrategies.map(strategy => (
            <Card 
              key={strategy.id} 
              className="flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:shadow-md hover:border-primary"
              onClick={() => handleStrategyClick(strategy.name)}
            >
              <div className="w-full h-16 bg-muted/50 rounded-md mb-2 flex items-center justify-center p-1">
                {strategy.payoffGraph}
              </div>
              <p className="text-xs font-medium">{strategy.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
