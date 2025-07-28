
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { mockSuperstarInvestors } from '@/lib/mockData/superstars';
import type { SuperstarInvestor } from '@/types';
import { ScrollArea } from '../ui/scroll-area';

type InvestorType = 'individual' | 'institutional' | 'fii';
type SortKey = 'netWorth' | 'stocksCount';

const formatNetWorth = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 3,
    }).format(value) + ' Cr';
};

export const SuperstarsScreener = () => {
    const [activeTab, setActiveTab] = useState<InvestorType>('individual');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'netWorth', direction: 'desc' });

    // In a real app, this data would be filtered based on activeTab
    const investors = useMemo(() => {
        const sortedInvestors = [...mockSuperstarInvestors].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortedInvestors;
    }, [sortConfig]);
    
    const requestSort = (key: SortKey) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="w-full">
            <div className="flex border-b">
                {(['individual', 'institutional', 'fii'] as InvestorType[]).map(tab => (
                    <Button 
                        key={tab}
                        variant="ghost"
                        className={`capitalize px-4 rounded-none border-b-2 ${activeTab === tab ? 'border-primary text-primary font-semibold' : 'border-transparent text-muted-foreground'}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-2 p-2 bg-muted/50 text-xs">
                <span>SORT BY:</span>
                <Button 
                    variant={sortConfig.key === 'netWorth' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => requestSort('netWorth')}
                >
                    Networth <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
                <Button 
                    variant={sortConfig.key === 'stocksCount' ? 'secondary' : 'ghost'} 
                    size="sm"
                    onClick={() => requestSort('stocksCount')}
                >
                    Companies <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
            </div>
            <ScrollArea className="h-80">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Investor</TableHead>
                            <TableHead className="text-center"># Stocks</TableHead>
                            <TableHead className="text-right">Net Worth</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {investors.map(investor => (
                            <TableRow key={investor.id}>
                                <TableCell className="font-medium text-primary py-3">{investor.name}</TableCell>
                                <TableCell className="text-center py-3">{investor.stocksCount}</TableCell>
                                <TableCell className="text-right py-3 font-semibold">{formatNetWorth(investor.netWorth)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    )
}
