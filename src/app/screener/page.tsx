
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Zap, TrendingUp, Rocket, Star, PiggyBank, CandlestickChart, Bell, ArrowUpDown } from 'lucide-react';
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

const suggestionQueries = [
    "IT stocks with P/E less than 30",
    "Banking stocks with ROE greater than 15%",
    "Large cap stocks over 5,00,000Cr market cap",
    "FMCG stocks with low debt",
];

const marketSubItems = [
  'Stocks',
  'Sectors',
  'Events Calendar',
  'FII & DII',
  'Insider Trades',
  'Bulk Block Deals',
  'Insights',
  'Earnings Calls',
];

const fiatScreenerItems = [
  {
    title: 'Markets',
    icon: TrendingUp,
    content: marketSubItems,
    hasDot: false,
  },
  {
    title: 'IPO',
    icon: Rocket,
    content: 'Information on upcoming and recent Initial Public Offerings.',
    hasDot: true,
  },
  {
    title: 'Superstars',
    icon: Star,
    content: 'Track portfolios of well-known investors and superstar funds.',
    hasDot: false,
  },
  {
    title: 'Mutual Funds',
    icon: PiggyBank,
    content: 'Explore and analyze mutual funds.',
    hasDot: true,
  },
  {
    title: 'Futures and Options',
    icon: CandlestickChart,
    content: 'Access F&O data, option chain, and analysis tools.',
    hasDot: false,
  },
  {
    title: 'Alerts',
    icon: Bell,
    content: 'Manage your price and news alerts.',
    hasDot: false,
  },
];

// IPO Table Component
type IpoInfo = {
  companyName: string;
  openDate: string;
  closeDate: string;
  lotSize: number;
  issuePrice: number;
  type: 'SME' | 'Mainboard';
};

const ipoData: IpoInfo[] = [
  { companyName: 'SambhV Steel Tubes', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 182, issuePrice: 82, type: 'SME' },
  { companyName: 'HDB Financial Services', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 20, issuePrice: 740, type: 'Mainboard' },
  { companyName: 'Suntech Infra Solutions', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 1600, issuePrice: 86, type: 'SME' },
  { companyName: 'Supertech EV', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 1200, issuePrice: 92, type: 'SME' },
  { companyName: 'Rama Telecom', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 2000, issuePrice: 68, type: 'SME' },
  { companyName: 'Kalpataru', openDate: "24 Jun '25", closeDate: "26 Jun '25", lotSize: 36, issuePrice: 414, type: 'Mainboard' },
  { companyName: 'Ellenbarrie Industrial Gases', openDate: "24 Jun '25", closeDate: "26 Jun '25", lotSize: 37, issuePrice: 400, type: 'Mainboard' },
  { companyName: 'Globe Civil Projects', openDate: "24 Jun '25", closeDate: "26 Jun '25", lotSize: 211, issuePrice: 71, type: 'SME' },
];

const SortableHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <TableHead className={cn(className)}>
        <Button variant="ghost" size="sm" className="p-1 h-auto -ml-2">
            {children}
            <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
    </TableHead>
);

const IpoTable = () => {
    const [filter, setFilter] = useState<'Both' | 'SME' | 'Mainboard'>('Both');

    const filteredData = useMemo(() => {
        if (filter === 'Both') return ipoData;
        return ipoData.filter(ipo => ipo.type === filter);
    }, [filter]);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div>
                    <h3 className="text-lg font-semibold">UPCOMING/OPEN IPOS</h3>
                    <p className="text-sm text-muted-foreground">New and upcoming IPOs tracker</p>
                </div>
                <div className="flex items-center space-x-1 border p-1 rounded-md bg-muted/50 self-end sm:self-center">
                    <Button variant={filter === 'Both' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('Both')} className="px-3">Both</Button>
                    <Button variant={filter === 'SME' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('SME')} className="px-3">SME</Button>
                    <Button variant={filter === 'Mainboard' ? 'secondary' : 'ghost'} size="sm" onClick={() => setFilter('Mainboard')} className="px-3">Mainboard</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableHeader>Company Name</SortableHeader>
                            <SortableHeader>Issue Open Date</SortableHeader>
                            <SortableHeader>Issue Close Date</SortableHeader>
                            <SortableHeader className="text-right">Lot Size</SortableHeader>
                            <TableHead className="text-right">Issue Price Per Share</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((ipo) => (
                            <TableRow key={ipo.companyName}>
                                <TableCell className="font-medium text-primary hover:underline">
                                    <Link href="#">{ipo.companyName}</Link>
                                </TableCell>
                                <TableCell>{ipo.openDate}</TableCell>
                                <TableCell>{ipo.closeDate}</TableCell>
                                <TableCell className="text-right">{ipo.lotSize}</TableCell>
                                <TableCell className="text-right">₹ {ipo.issuePrice}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default function ScreenerPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Stock[]>([]);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isRealMode = user?.id === 'REAL456';
    const [searchMode, setSearchMode] = useState<'Fiat' | 'Exchange' | 'Web3'>(isRealMode ? 'Exchange' : 'Fiat');
    
    React.useEffect(() => {
        if (isRealMode && searchMode === 'Fiat') {
            setSearchMode('Exchange');
        }
    }, [isRealMode, searchMode]);

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
    
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
    };
    
    const handleRowClick = (symbol: string) => {
        router.push(`/order/stock/${symbol}`);
    };

    return (
        <ProtectedRoute>
            <div className="flex flex-col h-screen bg-background text-foreground">
                <AppHeader 
                    searchMode={searchMode}
                    onSearchModeChange={setSearchMode}
                    isRealMode={isRealMode}
                />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold flex items-center">
                                <Zap className="mr-2 h-6 w-6 text-primary" />
                                AI Stock Screener
                            </CardTitle>
                            <CardDescription>
                                Describe the stocks you're looking for in plain English.
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
                                            key={suggestion}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            disabled={isLoading}
                                        >
                                            {suggestion}
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

                    {searchMode === 'Fiat' && (
                         <Card>
                            <CardContent className="p-2">
                                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                                    {fiatScreenerItems.map((item, index) => (
                                        <AccordionItem value={`item-${index}`} key={item.title}>
                                            <AccordionTrigger className="text-base font-medium hover:no-underline px-2">
                                                <div className="flex items-center gap-4">
                                                    <item.icon className="h-6 w-6 text-primary" />
                                                    <span>{item.title}</span>
                                                    {item.hasDot && <div className="h-2.5 w-2.5 rounded-full bg-green-500" />}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-2 pt-0 text-muted-foreground">
                                                {item.title === 'IPO' ? (
                                                    <IpoTable />
                                                ) : Array.isArray(item.content) ? (
                                                    <ul className="space-y-1">
                                                        {item.content.map((subItem) => (
                                                            <li key={subItem}>
                                                            <Button
                                                                variant="ghost"
                                                                className="w-full justify-start p-2 h-auto font-normal text-muted-foreground hover:text-primary text-sm"
                                                                onClick={() =>
                                                                toast({
                                                                    title: `${subItem}`,
                                                                    description: 'This feature is coming soon!',
                                                                })
                                                                }
                                                            >
                                                                {subItem}
                                                            </Button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    item.content
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
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

                    {results.length > 0 && !isLoading && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Screening Results</CardTitle>
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
                                            <TableRow key={stock.id} onClick={() => handleRowClick(stock.symbol)} className="cursor-pointer">
                                                <TableCell className="font-semibold">{stock.symbol}</TableCell>
                                                <TableCell>{stock.price.toFixed(2)}</TableCell>
                                                <TableCell>{stock.fundamentals?.peRatioTTM?.toFixed(2) ?? 'N/A'}</TableCell>
                                                <TableCell>{stock.fundamentals?.roe?.toFixed(2) ?? 'N/A'}</TableCell>
                                                <TableCell>{stock.fundamentals?.marketCap ?? 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
