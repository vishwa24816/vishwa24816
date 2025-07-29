
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Zap, TrendingUp, Rocket, Star, PiggyBank, CandlestickChart, Bell, ArrowUpDown, FileText, InfoIcon, LandPlot, AreaChart, Newspaper, Repeat } from 'lucide-react';
import { runScreenerAction } from '@/app/actions';
import type { Stock } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SuperstarsScreener } from './SuperstarsScreener';
import { mockStocks } from '@/lib/mockData';

const suggestionQueries = [
    { label: "IT stocks with P/E greater than 30", key: 'it' },
    { label: "Banking stocks with ROE greater than 15%", key: 'banking' },
    { label: "Large cap stocks over 5,00,000Cr market cap", key: 'large_cap' },
    { label: "FMCG stocks with low debt", key: 'fmcg' },
];

const marketSubItems = [
  'Indian Stocks',
  'US Stocks',
  'Sectors',
  'Events Calendar',
  'FII & DII',
  'Insider trade deals',
  'Bulk/Block Deals',
  'Insights',
  'Earnings Calls',
];

const alertSubItems = [
    'Alpha Alerts',
    'Superstar & Deals',
    'Price Target Alert',
    'Email Alerts',
];

const cryptoSubItems = ['Market', 'Analysis', 'News', 'Study'];

const screenerItems = [
  { title: 'Markets', icon: TrendingUp, content: marketSubItems, hasDot: false },
  { title: 'Superstars', icon: Star, content: 'Superstars screener content', hasDot: false },
  { title: 'Mutual Funds', icon: PiggyBank, content: ['Index Fund', 'Large Cap', 'Mid Cap', 'Small Cap', 'Flexi Cap', 'ELSS', 'Sectoral', 'Thematic'], hasDot: true },
  { title: 'Bonds', icon: LandPlot, content: ['Government Bonds', 'Corporate Bonds'], hasDot: false },
  { title: 'Crypto', icon: Repeat, content: cryptoSubItems, hasDot: false },
  { title: 'Alerts', icon: Bell, content: alertSubItems, hasDot: false },
];


const ExpandedScreenerRow = ({ stock, onAction, onNav }: { stock: Stock, onAction: (type: 'buy' | 'sell', qty: number) => void, onNav: () => void }) => {
    const { toast } = useToast();
    const [quantity, setQuantity] = useState('1');
    const [orderType, setOrderType] = useState('Limit');
    
    const handleBuy = () => {
        onAction('buy', parseInt(quantity, 10));
    };

    const handleSell = () => {
        onAction('sell', parseInt(quantity, 10));
    };

    return (
      <TableCell colSpan={5} className="p-0">
        <div className="bg-muted/50 p-3 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2">
                <Label htmlFor={`qty-${stock.id}`} className="shrink-0">Qty:</Label>
                <Input
                    id={`qty-${stock.id}`}
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="h-9 w-24"
                    min="1"
                />
            </div>
            <RadioGroup value={orderType} onValueChange={setOrderType} className="flex gap-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Market" id={`market-${stock.id}`} />
                    <Label htmlFor={`market-${stock.id}`}>Market</Label>
                </div>
                 <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Limit" id={`limit-${stock.id}`} />
                    <Label htmlFor={`limit-${stock.id}`}>Limit</Label>
                </div>
            </RadioGroup>
            <div className="flex gap-2 justify-self-end">
                <Button size="sm" onClick={handleBuy}>Buy</Button>
                <Button size="sm" variant="destructive" onClick={handleSell}>Sell</Button>
                <Button size="sm" variant="outline" onClick={onNav}>
                    <InfoIcon className="h-4 w-4 mr-1"/> Details
                </Button>
            </div>
        </div>
      </TableCell>
    );
};

export function ScreenerPageContent({ onAssetClick }: { onAssetClick: (asset: Stock) => void; }) {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Stock[]>([]);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedStockId, setExpandedStockId] = useState<string | null>(null);
    const [suggestedResults, setSuggestedResults] = useState<{ title: string; stocks: Stock[] } | null>(null);

    const isRealMode = user?.id === 'REAL456';
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a query.');
            return;
        }
        setIsLoading(true);
        setError('');
        setResults([]);
        setAnalysis('');
        setSuggestedResults(null);
        setExpandedStockId(null);

        try {
            const response = await runScreenerAction({ query });
            if (response.error) {
                setError(response.error);
            } else {
                setResults(response.stocks || []);
                setAnalysis(response.analysis || '');
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred. Please try again.');
            toast({
                title: 'Error',
                description: 'Failed to run the screener. The AI model might be busy.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSuggestionClick = (suggestionKey: string, suggestionLabel: string) => {
        let stocksToShow: Stock[] = [];
        switch (suggestionKey) {
            case 'it':
                stocksToShow = mockStocks.filter(s => s.sector === 'IT Services' && s.fundamentals?.peRatioTTM && s.fundamentals.peRatioTTM > 30);
                break;
            case 'banking':
                stocksToShow = mockStocks.filter(s => s.sector === 'Banking' && s.fundamentals?.roe && s.fundamentals.roe > 15);
                break;
            case 'large_cap':
                 stocksToShow = mockStocks.filter(s => {
                    if (!s.fundamentals?.marketCap) return false;
                    const mcValue = parseFloat(s.fundamentals.marketCap.replace(/,/g, '').replace('Cr', ''));
                    return !isNaN(mcValue) && mcValue > 500000;
                });
                break;
            case 'fmcg':
                 stocksToShow = mockStocks.filter(s => (s.sector === 'FMCG' || s.sector === 'FMCG Conglomerate') && s.fundamentals?.debtToEquity && s.fundamentals.debtToEquity < 0.1);
                 break;
            default:
                stocksToShow = [];
        }
        setSuggestedResults({ title: `Results`, stocks: stocksToShow });
        // Clear AI results
        setResults([]);
        setAnalysis('');
        setError('');
        setQuery('');
        setExpandedStockId(null);
    };
    
    const handleRowClick = (stockId: string) => {
        setExpandedStockId(currentId => (currentId === stockId ? null : stockId));
    };

    const handleAction = (stock: Stock, type: 'buy' | 'sell', qty: number) => {
        toast({
            title: `Order Placed (Mock)`,
            description: `Placed ${type.toUpperCase()} order for ${qty} shares of ${stock.symbol}.`,
        });
    };
    
    const handleMarketSubItemClick = (subItem: string) => {
        const tabMapping: Record<string, string> = {
            'Sectors': 'sectors',
            'Events Calendar': 'events',
            'FII & DII': 'fii-dii',
            'Insider trade deals': 'insider-deals',
            'Bulk/Block Deals': 'bulk-deals',
            'Insights': 'insights',
            'Earnings Calls': 'earnings-calls',
        };
        const targetTab = tabMapping[subItem];

        if (targetTab) {
            router.push(`/markets?tab=${targetTab}`);
        } else if (subItem === 'Indian Stocks' || subItem === 'US Stocks') {
            router.push('/markets');
        } else {
            toast({
                title: `${subItem}`,
                description: 'This feature is coming soon!',
            })
        }
    }
    
    const handleAlertsSubItemClick = () => {
        router.push('/alerts');
    }

    const handleWealthSubItemClick = (subItem: string) => {
        const primaryTab = subItem.includes('Bond') ? 'Bonds' : 'Mutual Funds';
        router.push(`/?mode=Wealth&primary=${primaryTab}&secondary=Top watchlist`);
    }

    const handleCryptoSubItemClick = (subItem: string) => {
        router.push('/markets/crypto');
    };

    return (
        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
            <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                <Button variant={activeMode === 'Fiat' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => setActiveMode('Fiat')}>Fiat Screener</Button>
                <Button variant={activeMode === 'Crypto' ? 'secondary' : 'ghost'} className="flex-1" onClick={() => setActiveMode('Crypto')}>Crypto Screener</Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center">
                        <Zap className="mr-2 h-6 w-6 text-primary" />
                        AI {activeMode} Screener
                    </CardTitle>
                    <CardDescription>
                        Describe the assets you're looking for in plain English, or use a preset filter below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            placeholder="e.g., 'Show me banking stocks with P/E under 20 and ROE above 15%'"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            rows={3}
                            disabled={isLoading}
                        />
                        <div className="flex flex-wrap gap-2">
                            {suggestionQueries.map((suggestion) => (
                                <Button
                                    key={suggestion.key}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSuggestionClick(suggestion.key, suggestion.label)}
                                    disabled={isLoading}
                                >
                                    {suggestion.label}
                                </Button>
                            ))}
                        </div>
                        <Button type="submit" disabled={isLoading || !query.trim()} className="w-full sm:w-auto">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                            {isLoading ? 'Screening...' : 'Run Screener'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {(suggestedResults) && !isLoading && (
                 <Card>
                    <CardHeader>
                        <CardTitle>
                            {suggestedResults.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Price (₹)</TableHead>
                                    <TableHead>P/E</TableHead>
                                    <TableHead>ROE (%)</TableHead>
                                    <TableHead>Mkt Cap</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suggestedResults.stocks.map((stock) => (
                                    <React.Fragment key={stock.id}>
                                        <TableRow onClick={() => handleRowClick(stock.id)} className="cursor-pointer">
                                            <TableCell className="font-semibold">{stock.symbol}</TableCell>
                                            <TableCell>{stock.price.toFixed(2)}</TableCell>
                                            <TableCell>{stock.fundamentals?.peRatioTTM?.toFixed(2) ?? 'N/A'}</TableCell>
                                            <TableCell>{stock.fundamentals?.roe?.toFixed(2) ?? 'N/A'}</TableCell>
                                            <TableCell>{stock.fundamentals?.marketCap ?? 'N/A'}</TableCell>
                                        </TableRow>
                                        {expandedStockId === stock.id && (
                                            <TableRow>
                                                <ExpandedScreenerRow
                                                    stock={stock}
                                                    onAction={(type, qty) => handleAction(stock, type, qty)}
                                                    onNav={() => onAssetClick(stock)}
                                                />
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {isLoading && (
                <div className="text-center py-10">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-muted-foreground">The AI is analyzing your query and screening stocks...</p>
                </div>
            )}

            {error && (
                <Card className="border-destructive">
                        <CardHeader>
                        <CardTitle className="text-destructive">Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p>{error}</p>
                        </CardContent>
                </Card>
            )}

            {(results.length > 0) && !isLoading && (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            AI Screening Results
                        </CardTitle>
                        {analysis && (
                            <CardDescription className="pt-2 text-foreground/90">{analysis}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Symbol</TableHead>
                                    <TableHead>Price (₹)</TableHead>
                                    <TableHead>P/E</TableHead>
                                    <TableHead>ROE (%)</TableHead>
                                    <TableHead>Mkt Cap</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {results.map((stock) => (
                                    <React.Fragment key={stock.id}>
                                        <TableRow onClick={() => handleRowClick(stock.id)} className="cursor-pointer">
                                            <TableCell className="font-semibold">{stock.symbol}</TableCell>
                                            <TableCell>{stock.price.toFixed(2)}</TableCell>
                                            <TableCell>{stock.fundamentals?.peRatioTTM?.toFixed(2) ?? 'N/A'}</TableCell>
                                            <TableCell>{stock.fundamentals?.roe?.toFixed(2) ?? 'N/A'}</TableCell>
                                            <TableCell>{stock.fundamentals?.marketCap ?? 'N/A'}</TableCell>
                                        </TableRow>
                                        {expandedStockId === stock.id && (
                                            <TableRow>
                                                <ExpandedScreenerRow
                                                    stock={stock}
                                                    onAction={(type, qty) => handleAction(stock, type, qty)}
                                                    onNav={() => onAssetClick(stock)}
                                                />
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardContent className="p-2">
                    <Accordion type="single" collapsible className="w-full">
                        {screenerItems.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={item.title}>
                                <AccordionTrigger className="text-base font-medium hover:no-underline px-2">
                                    <div className="flex items-center gap-4">
                                        <item.icon className="h-6 w-6 text-primary" />
                                        <span>{item.title}</span>
                                        {item.hasDot && <div className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-2 pt-0 text-muted-foreground">
                                    {item.title === 'Superstars' ? (
                                        <SuperstarsScreener />
                                    ) : Array.isArray(item.content) ? (
                                        <ul className="space-y-1">
                                            {item.content.map((subItem) => (
                                                <li key={subItem}>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full justify-start p-2 h-auto font-normal text-muted-foreground hover:text-primary text-sm"
                                                    onClick={() => {
                                                        if(item.title === 'Markets') {
                                                            handleMarketSubItemClick(subItem)
                                                        } else if(item.title === 'Mutual Funds' || item.title === 'Bonds') {
                                                            handleWealthSubItemClick(subItem)
                                                        } else if (item.title === 'Alerts') {
                                                            handleAlertsSubItemClick()
                                                        } else if (item.title === 'Crypto') {
                                                            handleCryptoSubItemClick(subItem)
                                                        } else {
                                                            toast({
                                                                title: `${subItem}`,
                                                                description: 'This feature is coming soon!',
                                                            })
                                                        }
                                                    }}
                                                >
                                                    {subItem}
                                                </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        typeof item.content === 'string' ? item.content : ''
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </main>
    );
}
