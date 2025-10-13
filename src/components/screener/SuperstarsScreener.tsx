
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { mockSuperstarInvestors, mockInstitutionalInvestors, mockFiiInvestors } from '@/lib/mockData/superstars';
import type { SuperstarInvestor } from '@/types';
import { ScrollArea } from '../ui/scroll-area';

type InvestorType = 'individual' | 'institutional' | 'fii';
type SortKey = 'netWorth' | 'stocksCount';

const formatNetWorth = (value: number) => {
    if (value >= 10000) {
        return `₹${(value / 10000).toFixed(2)} Lakh Cr`;
    }
    return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Cr`;
};

export const SuperstarsScreener = () => {
    const [activeTab, setActiveTab] = useState<InvestorType>('individual');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'netWorth', direction: 'desc' });

    const investors = useMemo(() => {
        let sourceData: SuperstarInvestor[];
        switch (activeTab) {
            case 'individual':
                sourceData = mockSuperstarInvestors;
                break;
            case 'institutional':
                sourceData = mockInstitutionalInvestors;
                break;
            case 'fii':
                sourceData = mockFiiInvestors;
                break;
            default:
                sourceData = [];
        }

        const sortedInvestors = [...sourceData].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
        return sortedInvestors;
    }, [activeTab, sortConfig]);
    
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
