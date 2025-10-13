
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { mockFiiDiiData, FiiDiiData } from '@/lib/mockData/fiiDiiData';
import { cn } from '@/lib/utils';
import { Info, ArrowUpDown } from 'lucide-react';
import { Chart } from "@/components/ui/chart";

const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
        return `₹${(value / 1000).toFixed(2)}k Cr`;
    }
    return `₹${value.toFixed(2)} Cr`;
};

const chartConfig = {
    fii: { label: "FII", color: "hsl(var(--destructive))" },
    dii: { label: "DII", color: "hsl(var(--positive))" },
};

const ActivityRow: React.FC<{ item: FiiDiiData }> = ({ item }) => {
    const isFiiNegative = item.fiiTotal < 0;
    const isDiiNegative = item.diiTotal < 0;

    return (
        <tr className="border-b">
            <td className="p-2 text-xs">
                {item.date}
                <p className="text-muted-foreground">{item.day}</p>
            </td>
            <td className={cn("p-2 text-center text-xs font-semibold", isFiiNegative ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600')}>
                {formatCurrency(item.fiiTotal)}
            </td>
            <td className={cn("p-2 text-center text-xs font-semibold", isDiiNegative ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600')}>
                {formatCurrency(item.diiTotal)}
            </td>
             <td className="p-2 text-center text-xs">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    );
};

const SummaryRow: React.FC<{ label: string; fiiTotal: number; diiTotal: number }> = ({ label, fiiTotal, diiTotal }) => {
     const isFiiNegative = fiiTotal < 0;
     const isDiiNegative = diiTotal < 0;
    return (
         <tr className="border-b bg-muted/50 font-semibold">
            <td className="p-2 text-xs">{label}</td>
            <td className={cn("p-2 text-center text-xs", isFiiNegative ? 'text-red-600' : 'text-green-600')}>{formatCurrency(fiiTotal)}</td>
            <td className={cn("p-2 text-center text-xs", isDiiNegative ? 'text-red-600' : 'text-green-600')}>{formatCurrency(diiTotal)}</td>
            <td className="p-2 text-center text-xs">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </td>
        </tr>
    )
};


export function FiiDiiActivity() {
    const [activeTab, setActiveTab] = useState<'past_month' | 'monthly' | 'yearly'>('past_month');
    
    // Reverse data for chart so it goes from oldest to newest
    const chartData = [...mockFiiDiiData].reverse().slice(-30);

    const summaryData = {
        last30Days: { fii: 8483.7, dii: 1916.6 },
        last2Weeks: { fii: 9572.5, dii: 2512.6 },
        last1Week: { fii: -7184.1, diiTotal: 7001.4 },
    };

    return (
        <div className="p-4 space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">FII DII Data: Activity Today and Monthly</CardTitle>
                    <CardDescription>FII DII data today and monthly summary (25 Jun 2025 to 25 Jul 2025)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Chart.Container config={chartConfig} className="w-full h-[150px]">
                      <Chart.ResponsiveContainer>
                        <Chart.BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: -10 }}>
                             <Chart.CartesianGrid vertical={false} />
                             <Chart.XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} className="text-xs" />
                             <Chart.YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value/1000}k`} />
                            <Chart.Bar dataKey="fiiTotal" fill="var(--color-fii)" radius={2} />
                            <Chart.Bar dataKey="diiTotal" fill="var(--color-dii)" radius={2} />
                        </Chart.BarChart>
                      </Chart.ResponsiveContainer>
                    </Chart.Container>

                     <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold flex items-center">FII/DII Activity <Info className="h-3 w-3 ml-1 text-muted-foreground" /></h4>
                            <p className="text-xs text-muted-foreground">July 25, 2025</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-destructive font-medium">FII</span>
                                <span className="text-destructive font-medium">{formatCurrency(-1976.96)}</span>
                            </div>
                            <Progress value={40} className="h-2" indicatorClassName="bg-destructive" />
                        </div>
                         <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-green-600 font-medium">DII</span>
                                <span className="text-green-600 font-medium">{formatCurrency(2126.59)}</span>
                            </div>
                            <Progress value={60} className="h-2" indicatorClassName="bg-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle className="text-lg font-semibold">FII & DII TRADING ACTIVITY</CardTitle>
                    <CardDescription>FOR 25 Jun 2025 to 25 Jul 2025</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full">
                         <thead>
                            <tr className="border-b">
                                <th className="p-2 text-left text-xs text-muted-foreground font-medium"><Button variant="ghost" size="sm" className="p-1 h-auto text-xs -ml-1">DATE <ArrowUpDown className="h-3 w-3 ml-1" /></Button></th>
                                <th className="p-2 text-center text-xs text-muted-foreground font-medium"><Button variant="ghost" size="sm" className="p-1 h-auto text-xs">FII TOTAL <ArrowUpDown className="h-3 w-3 ml-1" /></Button></th>
                                <th className="p-2 text-center text-xs text-muted-foreground font-medium"><Button variant="ghost" size="sm" className="p-1 h-auto text-xs">DII TOTAL <ArrowUpDown className="h-3 w-3 ml-1" /></Button></th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <SummaryRow label="Last 30 Days" fiiTotal={summaryData.last30Days.fii} diiTotal={summaryData.last30Days.dii} />
                            <SummaryRow label="Last 2 Weeks" fiiTotal={summaryData.last2Weeks.fii} diiTotal={summaryData.last2Weeks.dii} />
                            <SummaryRow label="Last 1 Week" fiiTotal={summaryData.last1Week.fii} diiTotal={summaryData.last1Week.diiTotal} />
                            {mockFiiDiiData.map(item => <ActivityRow key={item.date} item={item} />)}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

        </div>
    );
}

// Helper components for the detailed table view
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
