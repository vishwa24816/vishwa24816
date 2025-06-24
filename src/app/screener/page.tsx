
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Zap } from 'lucide-react';
import { runScreenerAction } from '@/app/actions';
import type { Stock } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const suggestionQueries = [
    "IT stocks with P/E less than 30",
    "Banking stocks with ROE greater than 15%",
    "Large cap stocks over 5,00,000Cr market cap",
    "FMCG stocks with low debt",
];

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
