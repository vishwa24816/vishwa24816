
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, PlayCircle, SlidersHorizontal, Bot, Info, CalendarIcon, Settings, Share2, Save, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


const SegmentedControl = ({
    options,
    value,
    onValueChange,
}: {
    options: string[];
    value: string;
    onValueChange: (value: string) => void;
}) => {
    return (
        <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
            {options.map((option) => (
                <Button
                    key={option}
                    variant={value === option ? 'secondary' : 'ghost'}
                    onClick={() => onValueChange(option)}
                    className="py-1.5 h-auto text-sm"
                >
                    {option}
                </Button>
            ))}
        </div>
    );
};


export function BacktesterPageContent() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [strategy, setStrategy] = useState("WHEN SMA(50) crosses above SMA(200)\nBUY 1 BTC\n\nWHEN SMA(50) crosses below SMA(200)\nSELL ALL");
    const [aiQuery, setAiQuery] = useState("Find profitable momentum strategies for NIFTY 50 index stocks.");
    const [isBacktesting, setIsBacktesting] = useState(false);
    const [backtestResult, setBacktestResult] = useState<any>(null);
    
    // State for the manual tester form
    const [atmType, setAtmType] = useState('point');
    const [index, setIndex] = useState('nifty');
    const [segment, setSegment] = useState('options');
    const [optionType, setOptionType] = useState('call');
    const [actionType, setActionType] = useState('buy');
    const [strikePrice, setStrikePrice] = useState('atm');
    const [totalLots, setTotalLots] = useState('1');
    const [expiryType, setExpiryType] = useState('weekly');
    
    // State for the new detailed builder
    const [showDetailedBuilder, setShowDetailedBuilder] = useState(false);
    const [fromDate, setFromDate] = useState<Date | undefined>(new Date('2025-09-20'));
    const [toDate, setToDate] = useState<Date | undefined>(new Date('2025-10-21'));


    const handleRunBacktest = () => {
        setIsBacktesting(true);
        // Simulate API call
        setTimeout(() => {
            setBacktestResult({
                pnl: 152340.50,
                winRate: 65.2,
                maxDrawdown: 12.5,
                sharpeRatio: 1.2,
                trades: [
                    { id: 1, type: 'BUY', symbol: 'BTC', qty: 1, price: 5210050.50, date: '2023-01-15' },
                    { id: 2, type: 'SELL', symbol: 'BTC', qty: 1, price: 5435000.00, date: '2023-03-20' },
                    { id: 3, type: 'BUY', symbol: 'BTC', qty: 1, price: 5525080.80, date: '2023-05-10' },
                    { id: 4, type: 'SELL', symbol: 'BTC', qty: 1, price: 5860020.20, date: '2023-08-01' },
                ]
            });
            setIsBacktesting(false);
        }, 2000);
    }
    
    const handleAddPosition = () => {
        setShowDetailedBuilder(true);
    }

    return (
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Strategy Backtester</h1>
                
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Bot className="mr-2 h-5 w-5 text-primary" />
                            AI Strategy Backtester
                        </CardTitle>
                        <CardDescription>
                            Describe a strategy in natural language and let our AI test it for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            rows={4}
                            placeholder="e.g., 'Test a moving average crossover strategy on BTC/USD'"
                            className="font-mono text-sm"
                        />
                        <Button onClick={handleRunBacktest} disabled={isBacktesting} className="mt-4 w-full sm:w-auto">
                            <PlayCircle className="mr-2 h-5 w-5" />
                            {isBacktesting ? 'Running AI Backtest...' : 'Run AI Backtest'}
                        </Button>
                    </CardContent>
                </Card>
                
                 <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
                            Manual Tester
                        </CardTitle>
                        <CardDescription>
                            Define your options position and backtest it against historical data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <RadioGroup value={atmType} onValueChange={setAtmType} className="grid grid-cols-2 gap-x-4 gap-y-2">
                           <div className="flex items-center space-x-2">
                                <RadioGroupItem value="point" id="atm-point" />
                                <Label htmlFor="atm-point">ATM Point</Label>
                           </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="percent" id="atm-percent" />
                                <Label htmlFor="atm-percent">ATM Percent</Label>
                           </div>
                           <div className="flex items-center space-x-2">
                                <RadioGroupItem value="width" id="straddle-width" />
                                <Label htmlFor="straddle-width" className="flex items-center">Straddle Width <Badge variant="secondary" className="ml-2 text-green-600 bg-green-100">New</Badge></Label>
                           </div>
                           <div className="flex items-center space-x-2">
                                <RadioGroupItem value="closest" id="closest-premium" />
                                <Label htmlFor="closest-premium" className="flex items-center">Closest Premium (CP) <Info className="h-3 w-3 ml-1 text-muted-foreground"/></Label>
                           </div>
                           <div className="flex items-center space-x-2 col-span-2">
                                <RadioGroupItem value="cp-based" id="cp-based" />
                                <Label htmlFor="cp-based" className="flex items-center">CP based on Straddle Premium (SP) <Info className="h-3 w-3 ml-1 text-muted-foreground"/></Label>
                           </div>
                        </RadioGroup>

                        <div className="space-y-2">
                            <Label>Select Index:</Label>
                            <Select value={index} onValueChange={setIndex}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nifty">Nifty</SelectItem>
                                    <SelectItem value="banknifty">Bank Nifty</SelectItem>
                                    <SelectItem value="finnifty">Fin Nifty</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Select Segment:</Label>
                            <SegmentedControl options={['Futures', 'Options']} value={segment} onValueChange={setSegment} />
                        </div>
                         <div className="space-y-2">
                            <Label>Option Type:</Label>
                            <SegmentedControl options={['Call', 'Put']} value={optionType} onValueChange={setOptionType} />
                        </div>
                         <div className="space-y-2">
                            <Label>Action Type:</Label>
                             <SegmentedControl options={['Buy', 'Sell']} value={actionType} onValueChange={setActionType} />
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Strike Price:</Label>
                            <Select value={strikePrice} onValueChange={setStrikePrice}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="atm">ATM</SelectItem>
                                    <SelectItem value="itm">ITM</SelectItem>
                                    <SelectItem value="otm">OTM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="total-lots">Total Lot:</Label>
                            <Input id="total-lots" type="number" value={totalLots} onChange={e => setTotalLots(e.target.value)} min="1" />
                        </div>

                         <div className="space-y-2">
                            <Label>Expiry Type:</Label>
                            <Select value={expiryType} onValueChange={setExpiryType}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleAddPosition} className="w-full">Add Position</Button>
                    </CardContent>
                </Card>
                
                {showDetailedBuilder && (
                    <Card className="mb-6 animate-accordion-down">
                        <CardHeader>
                            <CardTitle>Detailed Strategy Builder</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-4">
                               <Label htmlFor="live-spot-atm" className="flex flex-col items-center gap-1 cursor-pointer">
                                  <span>Live Spot as ATM</span>
                                  <Switch id="live-spot-atm" />
                               </Label>
                                <Label htmlFor="futures-atm" className="flex flex-col items-center gap-1 cursor-pointer">
                                  <span>Use Futures as ATM</span>
                                  <Switch id="futures-atm" />
                               </Label>
                            </div>
                            <RadioGroup defaultValue="one-leg" className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="one-leg" id="one-leg" />
                                    <Label htmlFor="one-leg">Square Off One Leg</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all-legs" id="all-legs" />
                                    <Label htmlFor="all-legs">Square Off All Legs</Label>
                                </div>
                            </RadioGroup>
                            
                            <Button variant="outline" className="w-full justify-start"><Plus className="mr-2 h-4 w-4"/> Strategy Target Profit</Button>
                            <Button variant="outline" className="w-full justify-start"><Plus className="mr-2 h-4 w-4"/> Strategy Stop Loss</Button>

                            <div className="space-y-2">
                                <Label>Date Range</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("justify-start text-left font-normal", !fromDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {fromDate ? format(fromDate, "PPP") : <span>From date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus /></PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className={cn("justify-start text-left font-normal", !toDate && "text-muted-foreground")}>
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {toDate ? format(toDate, "PPP") : <span>To date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                             <div className="flex flex-col gap-4">
                               <Button onClick={handleRunBacktest} className="w-full bg-green-600 hover:bg-green-700">Start Backtest</Button>
                               <Button variant="outline" className="w-full"><Share2 className="mr-2 h-4 w-4" /> Share Strategy</Button>
                               <Button variant="outline" className="w-full"><Save className="mr-2 h-4 w-4" /> Save Strategy</Button>
                               <Button variant="outline" className="w-full"><Plus className="mr-2 h-4 w-4" /> New Strategy</Button>
                           </div>
                        </CardContent>
                    </Card>
                )}


                {isBacktesting && (
                    <div className="text-center p-8">
                        <p className="text-muted-foreground">Running backtest, please wait...</p>
                    </div>
                )}

                {backtestResult && !isBacktesting && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <LineChart className="mr-2 h-5 w-5 text-primary" />
                                Backtest Results
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Total P&L</p>
                                    <p className="text-2xl font-bold text-green-600">₹{backtestResult.pnl.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Win Rate</p>
                                    <p className="text-2xl font-bold">{backtestResult.winRate}%</p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Max Drawdown</p>
                                    <p className="text-2xl font-bold">{backtestResult.maxDrawdown}%</p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Sharpe Ratio</p>
                                    <p className="text-2xl font-bold">{backtestResult.sharpeRatio}</p>
                                </div>
                            </div>
                            
                            <h4 className="font-semibold mb-2">Trades Executed</h4>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Symbol</TableHead>
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {backtestResult.trades.map((trade: any) => (
                                        <TableRow key={trade.id}>
                                            <TableCell className={trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'}>{trade.type}</TableCell>
                                            <TableCell>{trade.symbol}</TableCell>
                                            <TableCell className="text-right">{trade.qty}</TableCell>
                                            <TableCell className="text-right">₹{trade.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{trade.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </main>
    );
}

export default function BacktesterPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <BacktesterPageContent />
            </div>
        </ProtectedRoute>
    )
}
