
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, PlayCircle, SlidersHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function BacktesterPage() {
    const { user } = useAuth();
    const isRealMode = user?.id === 'REAL456';
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');
    const [strategy, setStrategy] = useState("WHEN SMA(50) crosses above SMA(200)\nBUY 1 BTC\n\nWHEN SMA(50) crosses below SMA(200)\nSELL ALL");
    const [isBacktesting, setIsBacktesting] = useState(false);
    const [backtestResult, setBacktestResult] = useState<any>(null);


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

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <AppHeader 
                    isRealMode={isRealMode} 
                    activeMode={activeMode} 
                    onModeChange={setActiveMode} 
                />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6">Strategy Backtester</h1>
                        
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <SlidersHorizontal className="mr-2 h-5 w-5 text-primary" />
                                    Define Your Strategy
                                </CardTitle>
                                <CardDescription>
                                    Write your trading logic using simple conditions. The system will parse and execute it over historical data.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea 
                                    value={strategy}
                                    onChange={(e) => setStrategy(e.target.value)}
                                    rows={6}
                                    placeholder="e.g., WHEN SMA(50) > SMA(200) BUY 1 BTC..."
                                    className="font-mono text-sm"
                                />
                                <Button onClick={handleRunBacktest} disabled={isBacktesting} className="mt-4 w-full sm:w-auto">
                                    <PlayCircle className="mr-2 h-5 w-5" />
                                    {isBacktesting ? 'Running Backtest...' : 'Run Backtest'}
                                </Button>
                            </CardContent>
                        </Card>

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
            </div>
        </ProtectedRoute>
    );
}
