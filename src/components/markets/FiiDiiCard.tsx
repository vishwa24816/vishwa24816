
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Landmark, Globe } from 'lucide-react';
import { Button } from '../ui/button';

const formatCurrency = (value: number) => {
    return `₹${(value / 100).toFixed(2)} Cr`;
};

export function FiiDiiCard() {
    const data = {
        date: "Jul 25, 2025",
        fii: {
            buy: 8976.54,
            sell: 12453.21,
            net: -3476.67
        },
        dii: {
            buy: 9876.54,
            sell: 7654.32,
            net: 2222.22
        }
    };
    
    const isFiiNegative = data.fii.net < 0;
    const isDiiNegative = data.dii.net < 0;

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">FII DII Provisional</CardTitle>
                <Button variant="link" size="sm" className="text-primary pr-0">{data.date}</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">FII</span>
                        </div>
                        <span className={`font-semibold ${isFiiNegative ? 'text-red-500' : 'text-green-500'}`}>
                            {formatCurrency(data.fii.net)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">DII</span>
                        </div>
                        <span className={`font-semibold ${isDiiNegative ? 'text-red-500' : 'text-green-500'}`}>
                             {formatCurrency(data.dii.net)}
                        </span>
                    </div>
                </div>
                 <Button variant="link" className="w-full justify-end mt-2 pr-0">View all</Button>
            </CardContent>
        </Card>
    );
}
