
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
    Info, 
    FileText, 
    ListOrdered, 
    Scaling, 
    ClipboardCheck, 
    PieChart, 
    ArrowRightLeft, 
    History,
    Download
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type ReportInfo = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor: string;
};

const reportsData: ReportInfo[] = [
  { id: 'complete', title: 'Complete Tax Report', description: 'A detailed summary of all your crypto income, trades, and taxes. It includes every transaction required to compute your final tax liability.', icon: FileText, iconBgColor: 'bg-blue-500' },
  { id: 'vda', title: 'Schedule VDA Report', description: 'A detailed report of all your crypto disposals, gains, and losses formatted for the Schedule VDA section of the ITR.', icon: ListOrdered, iconBgColor: 'bg-pink-500' },
  { id: 'vda-derivatives', title: 'Schedule VDA Derivatives Report', description: 'A detailed report of gains and losses from crypto derivatives such as futures, formatted for the Schedule VDA section of the ITR.', icon: Scaling, iconBgColor: 'bg-purple-500' },
  { id: 'filing-data', title: 'Tax Filing Data Report', description: 'Summary of your total income, gains, and losses for the financial year for accurate tax filing.', icon: ClipboardCheck, iconBgColor: 'bg-orange-500' },
  { id: 'income-summary', title: 'Income Summary Report', description: 'A consolidated report of all your crypto income earned during the year, including staking rewards, interest, airdrops, and other earnings.', icon: PieChart, iconBgColor: 'bg-green-500' },
  { id: 'buy-sell', title: 'Buy-Sell Report', description: 'A detailed report of all your crypto buy and sell transactions. This report helps you to track cost basis and realized gains or losses.', icon: ArrowRightLeft, iconBgColor: 'bg-cyan-500' },
  { id: 'transaction-history', title: 'Transaction History Report', description: 'Chronological report of all your trades, transfers, deposits, and withdrawals across your integrations.', icon: History, iconBgColor: 'bg-rose-500' },
  { id: 'tds-summary', title: 'TDS Summary Report', description: 'A summary of all Tax Deducted at Source (TDS) on your crypto transactions for the financial year.', icon: FileText, iconBgColor: 'bg-indigo-500' },
  { id: 'tds-certificate', title: 'TDS Certificate', description: 'Download your TDS certificate (Form 16A) for the selected quarter to claim tax credits.', icon: FileText, iconBgColor: 'bg-teal-500' },
];

const ReportCard = ({ report }: { report: ReportInfo; }) => {
  const Icon = report.icon;
  return (
    <Card 
        className="bg-card border-border hover:border-primary/50 transition-colors"
    >
        <div className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${report.iconBgColor}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-card-foreground">{report.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground flex-grow mb-4">{report.description}</p>
        </div>
    </Card>
  )
}

export default function TaxyPage() {
  const { user } = useAuth();
  const isRealMode = user?.id === 'REAL456';
  const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');
  
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <AppHeader 
            isRealMode={isRealMode} 
            activeMode={activeMode} 
            onModeChange={setActiveMode} 
        />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-foreground">Tax Reports</h1>
                <Button>Previously Generated Reports</Button>
            </div>

            <div className="flex items-center gap-4 mb-6">
                <label htmlFor="tax-year" className="text-sm font-medium">Tax Year:</label>
                <Select defaultValue="fy-24-25">
                    <SelectTrigger id="tax-year" className="w-[180px]">
                        <SelectValue placeholder="Select Tax Year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fy-24-25">FY 2024-25</SelectItem>
                        <SelectItem value="fy-23-24">FY 2023-24</SelectItem>
                        <SelectItem value="fy-22-23">FY 2022-23</SelectItem>
                    </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">1 Apr '24 - 31 Mar '25</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportsData.map(report => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                    />
                ))}
            </div>
            
            <div className="mt-8 sticky bottom-4 z-10">
                <Card className="bg-background/80 backdrop-blur-sm border-primary/30 max-w-2xl mx-auto animate-fade-in">
                  <div className="p-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button>Download All Reports</Button>
                  </div>
                </Card>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
