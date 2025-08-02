"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  ChevronRight,
  HelpCircle,
  Gavel,
  Wallet,
  ShieldAlert,
  XCircle,
  ArrowRightLeft,
  ListOrdered,
  Scaling,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ReportItem = ({ icon: Icon, title, description, onClick }: { icon: React.ElementType, title: string, description: string, onClick?: () => void }) => (
    <React.Fragment>
        <button className="w-full text-left p-4 hover:bg-muted/50 transition-colors" onClick={onClick}>
            <div className="flex items-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
        </button>
        <Separator />
    </React.Fragment>
);


const AnalyticsPage = () => {
    const { user } = useAuth();
    const router = useRouter();
    const isRealMode = user?.id === 'REAL456';
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');

    const reports = [
        { icon: FileText, title: 'Ledger', description: 'See all your transactions along with the billing details.', onClick: () => router.push('/analytics/ledger') },
        { icon: FileText, title: 'Profit & Loss', description: 'Get your profit and loss report.' },
        { icon: ListOrdered, title: 'VDA Report', description: 'A detailed report of all your crypto disposals, gains, and losses formatted for the Schedule VDA section of the ITR.'},
        { icon: Scaling, title: 'VDA Derivatives Report', description: 'A detailed report of gains and losses from crypto derivatives such as futures, formatted for the Schedule VDA section of the ITR.'},
        { icon: FileText, title: 'Dividend Reports', description: 'Get your Dividend report.' },
        { icon: FileText, title: 'Trade', description: 'Get an overview of all your trades (sell/buy orders).' },
        { icon: FileText, title: 'Bill', description: 'Check the brokerage and transaction charges on your trades.' },
        { icon: FileText, title: 'Miscellaneous', description: 'Find reports like contract notes, margin report, retention report, etc.' },
        { icon: FileText, title: 'Mutual Funds', description: 'See all of your mutual funds\' details here like ELSS and Capital Gains.' },
        { icon: FileText, title: 'Interest Charged', description: 'Reports on interest & payment charges.' },
    ];

    const actions = [
        { icon: Gavel, title: 'Corporate Actions', description: 'View and place request for corporate actions' },
        { icon: Wallet, title: 'Margin Pledge', description: 'Pledge your existing holdings for extra margin' },
        { icon: ShieldAlert, title: 'MTF authorisation', description: 'Authorize your MTF orders for the day' },
        { icon: ShieldAlert, title: 'Post-trade authorisation', description: 'Authorize your Post-trades for the day' },
        { icon: XCircle, title: 'Revoke authorised scrips', description: 'Cancel or revoke the scrips already authorised' },
        { icon: ArrowRightLeft, title: 'MTF: Convert to Delivery', description: 'Convert your MTF shares to delivery' },
    ];
    
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <AppHeader
            activeMode={activeMode}
            onModeChange={setActiveMode}
            isRealMode={isRealMode}
        />
        <main className="flex-grow flex flex-col">
            <Tabs defaultValue="reports" className="w-full flex flex-col">
                 <div className="border-b bg-background sticky top-0 z-10">
                    <TabsList className="w-full justify-start rounded-none bg-transparent p-0 px-4 overflow-x-auto no-scrollbar h-auto">
                        <TabsTrigger value="reports" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Reports</TabsTrigger>
                        <TabsTrigger value="actions" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Actions</TabsTrigger>
                    </TabsList>
                </div>
                <div>
                    <TabsContent value="reports" className="mt-0">
                        <div className="bg-background">
                            {reports.map((report, index) => (
                                <ReportItem key={index} {...report} />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="actions" className="mt-0">
                       <div className="bg-background">
                            {actions.map((action, index) => (
                                <ReportItem key={index} {...action} />
                            ))}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
