
"use client";

import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, TrendingUp, TrendingDown, MinusSquare, Shuffle } from 'lucide-react'; // Added more icons
import { cn } from '@/lib/utils';
import { mockUnderlyings, mockOptionChains } from '@/lib/mockData/optionChainData'; // Assuming these exist

const predefinedStrategies = [
  { name: 'Long Call', type: 'Bullish', icon: TrendingUp, hint: "payoff graph" },
  { name: 'Short Put', type: 'Bullish', icon: TrendingUp, hint: "payoff graph" },
  { name: 'Bull Call Spread', type: 'Bullish', icon: TrendingUp, hint: "payoff graph" },
  { name: 'Long Put', type: 'Bearish', icon: TrendingDown, hint: "payoff graph" },
  { name: 'Short Call', type: 'Bearish', icon: TrendingDown, hint: "payoff graph" },
  { name: 'Bear Put Spread', type: 'Bearish', icon: TrendingDown, hint: "payoff graph" },
  { name: 'Long Straddle', type: 'Non-Directional', icon: Shuffle, hint: "payoff graph" },
  { name: 'Short Strangle', type: 'Non-Directional', icon: MinusSquare, hint: "payoff graph" },
  { name: 'Iron Condor', type: 'Non-Directional', icon: MinusSquare, hint: "payoff graph" },
];

interface StrategyLeg {
  id: string;
  type: 'Call' | 'Put' | 'Future';
  action: 'Buy' | 'Sell';
  strike?: number;
  expiry: string;
  quantity: number;
  price: number;
}

export function StrategyBuilder() {
  const [selectedUnderlying, setSelectedUnderlying] = useState(mockUnderlyings[0].symbol);
  const [payoffDate, setPayoffDate] = useState("17-06-2025"); // Mock data
  const [spotPrice, setSpotPrice] = useState(24841.5);
  const [futuresPrice, setFuturesPrice] = useState(24859);
  const [lotSize, setLotSize] = useState(75);
  const [iv, setIv] = useState(16.39);
  const [ivPercentile, setIvPercentile] = useState(82.8);
  const [dte, setDte] = useState(0);

  const [activeOutlook, setActiveOutlook] = useState<'Bullish' | 'Bearish' | 'Non-Directional'>('Bullish');
  const [selectedSegment, setSelectedSegment] = useState('Futures');
  const [selectedExpiry, setSelectedExpiry] = useState('26JUN2025');
  const [buySellAction, setBuySellAction] = useState<'Buy' | 'Sell'>('Buy');
  const [lotQuantity, setLotQuantity] = useState(1);
  
  const [strategyLegs, setStrategyLegs] = useState<StrategyLeg[]>([]);

  const handleAddLeg = () => {
    const newLeg: StrategyLeg = {
      id: `leg-${Date.now()}`,
      type: selectedSegment === 'Futures' ? 'Future' : 'Call', // Simplified
      action: buySellAction,
      expiry: selectedExpiry,
      quantity: lotQuantity,
      price: selectedSegment === 'Futures' ? futuresPrice : spotPrice, // Placeholder price
      strike: selectedSegment === 'Options' ? spotPrice : undefined, // Placeholder strike
    };
    setStrategyLegs(prev => [...prev, newLeg]);
  }

  const handleRemoveLeg = (id: string) => {
    setStrategyLegs(prev => prev.filter(leg => leg.id !== id));
  }

  const filteredStrategies = predefinedStrategies.filter(s => s.type === activeOutlook);

  return (
    <div className="space-y-6 p-1">
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Top Section: Underlying and Info Badges */}
          <div>
            <Label htmlFor="underlying-select" className="text-sm font-medium">Select Index/Stock</Label>
            <Select value={selectedUnderlying} onValueChange={setSelectedUnderlying}>
              <SelectTrigger id="underlying-select">
                <SelectValue placeholder="Select Underlying" />
              </SelectTrigger>
              <SelectContent>
                {mockUnderlyings.map(u => (
                  <SelectItem key={u.id} value={u.symbol}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
            <InfoBadge label="Spot Price" value={spotPrice.toFixed(1)} color="bg-cyan-100 text-cyan-700" />
            <InfoBadge label="Futures Price" value={futuresPrice} color="bg-orange-100 text-orange-700" />
            <InfoBadge label="Lot Size" value={lotSize} color="bg-lime-100 text-lime-700" />
            <InfoBadge label="IV" value={iv.toFixed(2)} color="bg-fuchsia-100 text-fuchsia-700" />
            <InfoBadge label="IV Percentile" value={ivPercentile.toFixed(1)} color="bg-purple-100 text-purple-700" />
            <Button variant="outline" size="sm" className="text-xs h-auto py-1.5 px-2 border-sky-500 text-sky-600 hover:bg-sky-50">NIFTY IV Chart</Button>
            <InfoBadge label="DTE" value={dte} color="bg-pink-100 text-pink-700" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Date (Pay-off Date)</p>
            <p className="text-lg font-semibold">{payoffDate}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Middle Section: Outlook and Predefined Strategies */}
       <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
              {(['Bullish', 'Bearish', 'Non-Directional'] as const).map(outlook => (
                <Button
                  key={outlook}
                  variant={activeOutlook === outlook ? 'default' : 'outline'}
                  onClick={() => setActiveOutlook(outlook)}
                  className={cn(
                    "w-full md:w-auto justify-start text-left px-4 py-2 text-sm",
                    activeOutlook === outlook && outlook === 'Bullish' && 'bg-green-500 hover:bg-green-600 text-white',
                    activeOutlook === outlook && outlook === 'Bearish' && 'bg-red-500 hover:bg-red-600 text-white',
                    activeOutlook === outlook && outlook === 'Non-Directional' && 'bg-gray-500 hover:bg-gray-600 text-white',
                    activeOutlook !== outlook && 'border-gray-300 text-gray-600'
                  )}
                >
                  {outlook.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
              {filteredStrategies.map(strategy => (
                <Card key={strategy.name} className="shadow hover:shadow-md cursor-pointer" onClick={() => alert(`${strategy.name} selected (mock)`)}>
                  <CardContent className="p-2 text-center space-y-1">
                    <div className="h-16 bg-muted rounded flex items-center justify-center" data-ai-hint={strategy.hint}>
                       <strategy.icon className={cn("w-8 h-8", 
                        strategy.type === 'Bullish' && 'text-green-500',
                        strategy.type === 'Bearish' && 'text-red-500',
                        strategy.type === 'Non-Directional' && 'text-gray-500'
                       )} />
                    </div>
                    <p className="text-xs font-medium">{strategy.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section: Segment, Expiry, Buy/Sell, Lot Qty */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Build Your Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="segment-select">Select Segment</Label>
              <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                <SelectTrigger id="segment-select">
                  <SelectValue placeholder="Select Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Futures">Futures</SelectItem>
                  <SelectItem value="Options">Options</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="expiry-select">Select Expiry</Label>
              <Select value={selectedExpiry} onValueChange={setSelectedExpiry}>
                <SelectTrigger id="expiry-select">
                  <SelectValue placeholder="Select Expiry" />
                </SelectTrigger>
                <SelectContent>
                  {/* Populate with actual expiries based on underlying and segment */}
                  <SelectItem value="26JUN2025">26JUN2025</SelectItem>
                  <SelectItem value="31JUL2025">31JUL2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <RadioGroup value={buySellAction} onValueChange={(val) => setBuySellAction(val as 'Buy' | 'Sell')} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Buy" id="action-buy" />
              <Label htmlFor="action-buy">Buy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Sell" id="action-sell" />
              <Label htmlFor="action-sell">Sell</Label>
            </div>
          </RadioGroup>

          <div>
            <Label htmlFor="lot-qty">Lot Qty.</Label>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={() => setLotQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
              <Input id="lot-qty" type="number" value={lotQuantity} onChange={e => setLotQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center mx-2" />
              <Button variant="outline" size="icon" onClick={() => setLotQuantity(q => q + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
          <Button onClick={handleAddLeg} className="w-full sm:w-auto">Add Leg</Button>
        </CardContent>
      </Card>

      {/* Strategy Legs Display */}
      {strategyLegs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Strategy Legs</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-40">
              <ul className="space-y-2">
                {strategyLegs.map(leg => (
                  <li key={leg.id} className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                      <span className={cn("font-semibold", leg.action === "Buy" ? "text-green-600" : "text-red-600")}>{leg.action} {leg.quantity} Lot(s)</span> -
                      <span> {leg.type}</span>
                      {leg.strike && <span> @ Strike {leg.strike}</span>}
                      <span> (Expiry: {leg.expiry})</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLeg(leg.id)}>Remove</Button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
             <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline">Analyze (Mock)</Button>
                <Button>Execute (Mock)</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payoff Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payoff Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded flex items-center justify-center text-muted-foreground" data-ai-hint="strategy payoff graph analysis">
            Payoff chart will appear here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const InfoBadge: React.FC<{ label: string; value: string | number; color?: string }> = ({ label, value, color = "bg-gray-100 text-gray-700" }) => (
  <div className={cn("p-2 rounded-md text-center", color)}>
    <p className="text-xs font-medium">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

    