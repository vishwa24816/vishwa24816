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
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  { id: 'long-call', name: 'Long Call', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 5 L5 5 L15 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 5 L5 5 L15 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'short-put', name: 'Short Put', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 10 L5 5 L15 5" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 0 L5 5" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bull-call-spread', name: 'Bull Call Spread', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 6 L5 6 L10 1 L15 1" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 4 L5 4 L10 9" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bull-put-spread', name: 'Bull Put Spread', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 9 L5 4 L10 4" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 1 L5 6 L10 6" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'call-ratio-back', name: 'Call Ratio Back Spread', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 6 L8 6 L15 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 4 L8 4 L15 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'long-synthetic', name: 'Long Synthetic', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 10 L15 0" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 0 L15 10" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'range-forward', name: 'Range Forward', type: 'bullish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M3 8 L15 2" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M3 2 L15 8" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bullish-butterfly', name: 'Bullish Butterfly', type: 'bearish', payoffGraph: <svg viewBox="0 0 20 10"><path d="M0 5 L5 1 L10 5 L15 5" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 5 L15 5" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
  { id: 'bullish-condor', name: 'Bullish Condor', type: 'non-directional', payoffGraph: <svg viewBox="0 0 20 10"><path d="M3 5 L7 2 L12 2 L16 5" stroke="hsl(var(--positive))" strokeWidth="0.5" fill="none"/><path d="M0 5 L3 5 M16 5 L20 5" stroke="hsl(var(--destructive))" strokeWidth="0.5" fill="none"/></svg> },
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
  const [lotQty, setLotQty] = useState(1);

  const underlyingData = useMemo(() => {
    // This would fetch real data in a real app
    const baseData = {
        NIFTY: { spot: 24841.5, futures: 24859, lotSize: 75, iv: 16.39, ivPercentile: 82.8, dte: 0 },
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
  
  const handlePlaceFutureOrder = () => {
     toast({
      title: "Futures Order Placed (Mock)",
      description: `Order placed for ${lotQty} lot(s) of ${selectedUnderlying} futures.`,
    });
  }

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
      
      <Card className="p-4 space-y-4">
        <h3 className="text-lg font-semibold">Futures</h3>
        <Select defaultValue="futures">
            <SelectTrigger><SelectValue placeholder="Select Segment" /></SelectTrigger>
            <SelectContent><SelectItem value="futures">Futures</SelectItem></SelectContent>
        </Select>
        <Select defaultValue="26JUN2025">
            <SelectTrigger><SelectValue placeholder="Select Expiry" /></SelectTrigger>
            <SelectContent><SelectItem value="26JUN2025">26JUN2025</SelectItem></SelectContent>
        </Select>
        <RadioGroup defaultValue="buy" className="flex space-x-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="buy" id="f-buy" /><Label htmlFor="f-buy">Buy</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="sell" id="f-sell" /><Label htmlFor="f-sell">Sell</Label></div>
        </RadioGroup>
        <div className="flex items-center justify-between">
            <Label>Lot Qty.</Label>
            <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setLotQty(q => Math.max(1, q - 1))}>-</Button>
                <Input type="number" value={lotQty} onChange={e => setLotQty(Number(e.target.value))} className="w-14 h-8 text-center border-x border-y-0 rounded-none focus-visible:ring-0" />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setLotQty(q => q + 1)}>+</Button>
            </div>
        </div>
        <Button className="w-full" onClick={handlePlaceFutureOrder}>Place Order</Button>
      </Card>
    </div>
  );
}
