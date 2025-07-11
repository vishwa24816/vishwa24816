
"use client";

import React from 'react';
import type { SelectedOptionLeg } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Trash2, LineChart, TrendingUp, TrendingDown, Sigma } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StrategyBuilderProps {
  legs: SelectedOptionLeg[];
  setLegs: React.Dispatch<React.SetStateAction<SelectedOptionLeg[]>>;
}

const formatCurrency = (value?: number) => {
    if (value === undefined) return 'N/A';
    return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function StrategyBuilder({ legs, setLegs }: StrategyBuilderProps) {
    const { toast } = useToast();

    const updateLegAction = (id: string, action: 'Buy' | 'Sell') => {
        setLegs(legs.map(leg => leg.id === id ? { ...leg, action } : leg));
    };

    const updateLegQuantity = (id: string, quantity: number) => {
        setLegs(legs.map(leg => leg.id === id ? { ...leg, quantity } : leg));
    };

    const removeLeg = (id: string) => {
        setLegs(legs.filter(leg => leg.id !== id));
        toast({ title: 'Leg Removed', description: 'The option leg has been removed from the strategy.' });
    };

    const handleAnalyze = () => {
        if (legs.length === 0) {
            toast({ title: 'No Legs Selected', description: 'Please add at least one option leg to analyze a strategy.', variant: 'destructive' });
            return;
        }
        toast({ title: 'Analyzing Strategy (Mock)', description: `Calculating payoff for ${legs.length} leg(s).` });
    };
    
    // Placeholder calculations
    const lotSize = 50; // Should be dynamic based on underlying
    const requiredMargin = legs.reduce((acc, leg) => acc + (leg.ltp * leg.quantity * lotSize) * (leg.action === 'Sell' ? 0.25 : 0), 25000);
    const maxProfit = legs.length > 1 ? 12500 : undefined;
    const maxLoss = legs.length > 1 ? 8500 : undefined;

    return (
        <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Strategy Builder</h2>
            {legs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground bg-muted/50 rounded-lg">
                    <p>Click on an option in the chain above to start building your strategy.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Legs Table */}
                    <div className="lg:col-span-2">
                        <div className="overflow-x-auto">
                             <Table>
                                <TableHeader>
                                <TableRow>
                                    <TableHead>Instrument</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Qty (Lots)</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right"></TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {legs.map(leg => (
                                    <TableRow key={leg.id}>
                                    <TableCell className="font-medium text-xs">{leg.instrumentName}</TableCell>
                                    <TableCell>
                                        <RadioGroup
                                            value={leg.action}
                                            onValueChange={(value) => updateLegAction(leg.id, value as 'Buy' | 'Sell')}
                                            className="flex"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Buy" id={`buy-${leg.id}`} className="text-green-500 border-green-500"/>
                                                <Label htmlFor={`buy-${leg.id}`} className="font-normal text-xs">Buy</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="Sell" id={`sell-${leg.id}`} className="text-red-500 border-red-500" />
                                                <Label htmlFor={`sell-${leg.id}`} className="font-normal text-xs">Sell</Label>
                                            </div>
                                        </RadioGroup>
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={leg.quantity}
                                            onChange={(e) => updateLegQuantity(leg.id, parseInt(e.target.value) || 1)}
                                            className="w-16 h-8 text-center"
                                            min="1"
                                        />
                                    </TableCell>
                                    <TableCell>₹{leg.ltp.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => removeLeg(leg.id)} className="h-7 w-7">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </div>
                       
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <Button className="flex-1" onClick={handleAnalyze}>Analyze Strategy</Button>
                            <Button variant="outline" className="flex-1" onClick={() => setLegs([])}>Reset</Button>
                        </div>
                    </div>

                    {/* Payoff & Metrics */}
                    <div>
                        <div className="space-y-4">
                            <div className="bg-muted/50 rounded-lg p-4 h-48 flex items-center justify-center">
                                <LineChart className="h-16 w-16 text-muted-foreground" />
                                <p className="absolute text-sm text-muted-foreground">Payoff Chart</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-muted-foreground flex items-center gap-1"><TrendingUp className="h-4 w-4 text-green-500"/> Max Profit</div>
                                    <div className={cn("font-semibold", maxProfit ? "text-green-600" : "text-foreground")}>{maxProfit ? formatCurrency(maxProfit) : "Unlimited"}</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <div className="text-muted-foreground flex items-center gap-1"><TrendingDown className="h-4 w-4 text-red-500"/> Max Loss</div>
                                    <div className={cn("font-semibold", maxLoss ? "text-red-600" : "text-foreground")}>{maxLoss ? formatCurrency(maxLoss) : "Unlimited"}</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                                    <div className="text-muted-foreground flex items-center gap-1"><Sigma className="h-4 w-4"/> Break-even(s)</div>
                                    <div className="font-semibold text-foreground">₹21,550.25</div>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg col-span-2">
                                    <div className="text-muted-foreground">Required Margin</div>
                                    <div className="font-semibold text-foreground">{formatCurrency(requiredMargin)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
