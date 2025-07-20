
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { mockUnderlyings } from '@/lib/mockData';
import type { SelectedOptionLeg, StrategyType, Strategy } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StrategyPayoffChart } from './StrategyPayoffChart';


const strategies: Strategy[] = [
  // Bullish
  { id: 'long-call', name: 'Long Call', type: 'bullish', strikesNeeded: 1 },
  { id: 'short-put', name: 'Short Put', type: 'bullish', strikesNeeded: 1 },
  { id: 'bull-call-spread', name: 'Bull Call Spread', type: 'bullish', strikesNeeded: 2 },
  { id: 'bull-put-spread', name: 'Bull Put Spread', type: 'bullish', strikesNeeded: 2 },
  { id: 'call-ratio-backspread', name: 'Call Ratio Backspread', type: 'bullish', strikesNeeded: 2 },
  
  // Bearish
  { id: 'long-put', name: 'Long Put', type: 'bearish', strikesNeeded: 1 },
  { id: 'short-call', name: 'Short Call', type: 'bearish', strikesNeeded: 1 },
  { id: 'bear-call-spread', name: 'Bear Call Spread', type: 'bearish', strikesNeeded: 2 },
  { id: 'bear-put-spread', name: 'Bear Put Spread', type: 'bearish', strikesNeeded: 2 },
  { id: 'put-ratio-backspread', name: 'Put Ratio Backspread', type: 'bearish', strikesNeeded: 2 },
  
  // Non-Directional
  { id: 'long-straddle', name: 'Long Straddle', type: 'non-directional', strikesNeeded: 1 },
  { id: 'short-straddle', name: 'Short Straddle', type: 'non-directional', strikesNeeded: 1 },
  { id: 'long-strangle', name: 'Long Strangle', type: 'non-directional', strikesNeeded: 2 },
  { id: 'short-strangle', name: 'Short Strangle', type: 'non-directional', strikesNeeded: 2 },
  { id: 'iron-condor', name: 'Iron Condor', type: 'non-directional', strikesNeeded: 2 },
  { id: 'iron-butterfly', name: 'Iron Butterfly', type: 'non-directional', strikesNeeded: 1 },
  { id: 'call-butterfly', name: 'Call Butterfly', type: 'non-directional', strikesNeeded: 2 },
  { id: 'put-butterfly', name: 'Put Butterfly', type: 'non-directional', strikesNeeded: 2 },
];

const InfoBadge = ({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) => (
  <div className={cn("text-xs px-2.5 py-1.5 rounded-md flex justify-center items-center font-medium", colorClass)}>
    {label}: {value}
  </div>
);

// Helper to generate a random mock greek value
const mockGreek = (base: number) => base * (Math.random() * 0.4 + 0.8);

interface StrategyDialogProps {
    strategy: Strategy | null;
    underlyingSymbol: string;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onCreateStrategy: (legs: SelectedOptionLeg[]) => void;
}

const StrategyDialog: React.FC<StrategyDialogProps> = ({ strategy, underlyingSymbol, isOpen, onOpenChange, onCreateStrategy }) => {
    const [strike1, setStrike1] = useState('');
    const [strike2, setStrike2] = useState('');

    const handleCreate = () => {
        if (!strategy) return;

        const legs: SelectedOptionLeg[] = [];
        const strikePrice1 = parseFloat(strike1);
        const strikePrice2 = parseFloat(strike2);

        // This is a mock implementation. A real one would be more complex.
        if (strategy.name === 'Long Call' && !isNaN(strikePrice1)) {
            legs.push({ id: `leg1-${Date.now()}`, underlyingSymbol, instrumentName: `${underlyingSymbol} ${strikePrice1} CE`, expiryDate: '25 JUL 2024', strikePrice: strikePrice1, optionType: 'Call', action: 'Buy', ltp: 100, quantity: 1, delta: mockGreek(0.5), gamma: mockGreek(0.02), theta: mockGreek(-5), vega: mockGreek(2) });
        } else if (strategy.name === 'Bull Call Spread' && !isNaN(strikePrice1) && !isNaN(strikePrice2)) {
            legs.push({ id: `leg1-${Date.now()}`, underlyingSymbol, instrumentName: `${underlyingSymbol} ${strikePrice1} CE`, expiryDate: '25 JUL 2024', strikePrice: strikePrice1, optionType: 'Call', action: 'Buy', ltp: 120, quantity: 1, delta: mockGreek(0.6), gamma: mockGreek(0.018), theta: mockGreek(-4.5), vega: mockGreek(2.2) });
            legs.push({ id: `leg2-${Date.now()}`, underlyingSymbol, instrumentName: `${underlyingSymbol} ${strikePrice2} CE`, expiryDate: '25 JUL 2024', strikePrice: strikePrice2, optionType: 'Call', action: 'Sell', ltp: 80, quantity: 1, delta: mockGreek(0.4), gamma: mockGreek(0.015), theta: mockGreek(-3.8), vega: mockGreek(1.8) });
        }
        // ... add logic for other strategies

        if (legs.length > 0) {
            onCreateStrategy(legs);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Configure {strategy?.name}</DialogTitle>
                    <DialogDescription>
                        Enter the strike prices for your strategy.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {strategy && strategy.strikesNeeded >= 1 && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="strike1" className="text-right">Strike 1</Label>
                            <Input id="strike1" value={strike1} onChange={(e) => setStrike1(e.target.value)} className="col-span-3" placeholder="e.g., 21500" />
                        </div>
                    )}
                     {strategy && strategy.strikesNeeded >= 2 && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="strike2" className="text-right">Strike 2</Label>
                            <Input id="strike2" value={strike2} onChange={(e) => setStrike2(e.target.value)} className="col-span-3" placeholder="e.g., 21600" />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate}>Create Strategy</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export function ReadymadeStrategiesSection({ onStrategySelect }: { onStrategySelect: (legs: SelectedOptionLeg[]) => void }) {
  const { toast } = useToast();
  const [selectedUnderlying, setSelectedUnderlying] = useState('NIFTY');
  const [activeFilter, setActiveFilter] = useState<StrategyType>('bullish');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

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
  
  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <StrategyDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        strategy={selectedStrategy}
        underlyingSymbol={selectedUnderlying}
        onCreateStrategy={onStrategySelect}
      />
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
              className="flex flex-col text-center cursor-pointer hover:shadow-md hover:border-primary transition-all"
              onClick={() => handleStrategyClick(strategy)}
            >
              <CardContent className="p-2 flex-grow flex flex-col">
                <div className="w-full h-20 bg-muted/50 rounded-md mb-2 p-1">
                   <StrategyPayoffChart strategyId={strategy.id} />
                </div>
                <p className="text-xs font-medium mt-auto">{strategy.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
