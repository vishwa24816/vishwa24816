
"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Zap, TrendingUp, Rocket, Star, PiggyBank, CandlestickChart, Bell, ArrowUpDown, FileText } from 'lucide-react';
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
  qib: string;
  hni: string;
  retail: string;
  totalSubscription: string;
};

const ipoData: IpoInfo[] = [
  { companyName: 'SambhV Steel Tubes', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 182, issuePrice: 82, type: 'SME', qib: '15.2x', hni: '45.1x', retail: '22.8x', totalSubscription: '27.7x' },
  { companyName: 'HDB Financial Services', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 20, issuePrice: 740, type: 'Mainboard', qib: '90.5x', hni: '150.2x', retail: '40.1x', totalSubscription: '95.3x' },
  { companyName: 'Suntech Infra Solutions', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 1600, issuePrice: 86, type: 'SME', qib: '12.1x', hni: '33.4x', retail: '18.9x', totalSubscription: '21.5x' },
  { companyName: 'Supertech EV', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 1200, issuePrice: 92, type: 'SME', qib: '20.8x', hni: '60.7x', retail: '30.2x', totalSubscription: '37.2x' },
  { companyName: 'Rama Telecom', openDate: "25 Jun '25", closeDate: "27 Jun '25", lotSize: 2000, issuePrice: 68, type: 'SME', qib: '8.9x', hni: '25.6x', retail: '15.3x', totalSubscription: '16.6x' },
  { companyName: 'Kalpataru', openDate: "24 Jun '25", closeDate: "26 Jun '25", lotSize: 36, issuePrice: 414, type: 'Mainboard', qib: '75.3x', hni: '110.8x', retail: '32.6x', totalSubscription: '72.1x' },
  { companyName: 'Ellenbarrie Industrial Gases', openDate: "24 Jun '25", closeDate: "26 Jun '25", lotSize: 37, issuePrice: 400, type: 'Mainboard', qib: '55.1x', hni: '80.2x', retail: '25.9x', totalSubscription: '53.7x' },
  { companyName: 'Globe Civil Projects', openDate: "24 Jun '25", closeDate: "26 Jun '25", lotSize: 211, issuePrice: 71, type: 'SME', qib: '18.4x', hni: '55.9x', retail: '28.1x', totalSubscription: '34.1x' },
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
    const mainboardIpos = ipoData.filter((ipo) => ipo.type === 'Mainboard');
    const smeIpos = ipoData.filter((ipo) => ipo.type === 'SME');

    const renderTable = (data: IpoInfo[], title: string) => {
        if (data.length === 0) {
            return <p className="text-sm text-muted-foreground mt-4">No {title.toLowerCase()} found.</p>;
        }

        return (
            <div className="mb-8">
                <h4 className="text-md font-semibold mb-2">{title}</h4>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHeader>Company Name</SortableHeader>
                                <SortableHeader>Close Date</SortableHeader>
                                <SortableHeader className="text-right">Price</SortableHeader>
                                <SortableHeader className="text-right">QIB</SortableHeader>
                                <SortableHeader className="text-right">HNI</SortableHeader>
                                <SortableHeader className="text-right">Retail</SortableHeader>
                                <SortableHeader className="text-right">Total</SortableHeader>
                                <TableHead className="text-center">PDF</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((ipo) => (
                                <TableRow key={ipo.companyName}>
                                    <TableCell className="font-medium">
                                        <Link href="#" className="text-primary hover:underline">{ipo.companyName}</Link>
                                        <p className="text-xs text-muted-foreground">Lot: {ipo.lotSize}</p>
                                    </TableCell>
                                    <TableCell>{ipo.closeDate}</TableCell>
                                    <TableCell className="text-right">₹{ipo.issuePrice}</TableCell>
                                    <TableCell className="text-right">{ipo.qib}</TableCell>
                                    <TableCell className="text-right">{ipo.hni}</TableCell>
                                    <TableCell className="text-right">{ipo.retail}</TableCell>
                                    <TableCell className="text-right font-semibold">{ipo.totalSubscription}</TableCell>
                                    <TableCell className="text-center">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => alert(`Downloading PDF for ${ipo.companyName}`)}>
                                            <FileText className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div>
                    <h3 className="text-lg font-semibold">UPCOMING/OPEN IPOS</h3>
                    <p className="text-sm text-muted-foreground">New and upcoming IPOs tracker</p>
                </div>
            </div>
            {renderTable(mainboardIpos, 'Mainboard IPOs')}
            {renderTable(smeIpos, 'SME IPOs')}
        </div>
    );
};

// Superstars Table Component
type InvestorType = 'Individual' | 'Institutional' | 'FII';

type SuperstarInvestor = {
  name: string;
  stocks: number;
  netWorth: string; // Keep as string to match format "X,XX,XXX.XXX Cr"
  type: InvestorType;
};

const superstarData: SuperstarInvestor[] = [
  { name: 'Mukesh Ambani and Family', stocks: 2, netWorth: '4,02,775.592 Cr', type: 'Individual' },
  { name: 'Premji and Associates', stocks: 1, netWorth: '2,00,299.585 Cr', type: 'Institutional' },
  { name: 'Radhakishan Damani', stocks: 12, netWorth: '1,95,517.365 Cr', type: 'Individual' },
  { name: 'Rakesh Jhunjhunwala and Associates', stocks: 27, netWorth: '62,562.585 Cr', type: 'Institutional' },
  { name: 'Rekha Jhunjhunwala', stocks: 26, netWorth: '40,687.162 Cr', type: 'Individual' },
  { name: 'Mukul Agrawal', stocks: 60, netWorth: '6,343.217 Cr', type: 'Individual' },
  { name: 'Akash Bhanshali', stocks: 18, netWorth: '5,787.057 Cr', type: 'Individual' },
  // Add some dummy FII data
  { name: 'Government Pension Fund Global', stocks: 150, netWorth: '1,50,000.000 Cr', type: 'FII' },
  { name: 'Vanguard Group', stocks: 200, netWorth: '1,20,000.000 Cr', type: 'FII' },
];

const SuperstarsTable = () => {
    const [activeFilter, setActiveFilter] = useState<InvestorType>('Individual');

    const filteredData = superstarData.filter(investor => investor.type === activeFilter);

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                {(['Individual', 'Institutional', 'FII'] as InvestorType[]).map(filter => (
                    <Button
                        key={filter}
                        variant={activeFilter === filter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveFilter(filter)}
                        className="rounded-full px-4"
                    >
                        {filter}
                    </Button>
                ))}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>INVESTOR</TableHead>
                        <TableHead className="text-right"># STOCKS</TableHead>
                        <TableHead className="text-right">NET WORTH</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredData.map((investor) => (
                        <TableRow key={investor.name}>
                            <TableCell className="font-medium">
                                <Link href="#" className="text-primary hover:underline">{investor.name}</Link>
                            </TableCell>
                            <TableCell className="text-right">{investor.stocks}</TableCell>
                            <TableCell className="text-right font-semibold">{investor.netWorth}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

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
        // No auto-switching logic needed anymore as per recent changes
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
                                <Accordion type="single" collapsible className="w-full">
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
                                                ) : item.title === 'Superstars' ? (
                                                    <SuperstarsTable />
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

    
