
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
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ReportItem = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <React.Fragment>
        <button className="w-full text-left p-4 hover:bg-muted/50 transition-colors">
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
        { icon: FileText, title: 'Ledger', description: 'See all your transactions along with the billing details.' },
        { icon: FileText, title: 'Profit & Loss', description: 'Get your profit and loss report.' },
        { icon: FileText, title: 'Tax', description: 'Get your tax report.' },
        { icon: FileText, title: 'Tax loss harvesting', description: 'Reduce tax liability on capital gains.' },
        { icon: FileText, title: 'Dividend Reports', description: 'Get your Dividend report.' },
        { icon: FileText, title: 'Holdings', description: 'See all your equity and mutual funds.' },
        { icon: FileText, title: 'Trade', description: 'Get an overview of all your trades (sell/buy orders).' },
        { icon: FileText, title: 'Bill', description: 'Check the brokerage and transaction charges on your trades.' },
        { icon: FileText, title: 'Miscellaneous', description: 'Find reports like contract notes, margin report, retention report, etc.' },
        { icon: FileText, title: 'Mutual Funds', description: 'See all of your mutual funds\' details here like ELSS and Capital Gains.' },
        { icon: FileText, title: 'Interest Charged', description: 'Reports on interest & payment charges.' },
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
                        <TabsTrigger value="profile" onClick={() => router.push('/profile')} className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Profile</TabsTrigger>
                        <TabsTrigger value="reports" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Reports</TabsTrigger>
                        <TabsTrigger value="actions" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Actions</TabsTrigger>
                        <TabsTrigger value="rewards" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Rewards</TabsTrigger>
                        <TabsTrigger value="apps" className="py-3 px-4 rounded-none flex-shrink-0 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none">Apps</TabsTrigger>
                        <TabsTrigger value="help" className="py-3 px-4 ml-auto rounded-none flex-shrink-0">
                           <HelpCircle className="w-5 h-5" />
                        </TabsTrigger>
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
                    <TabsContent value="actions">
                        <div className="p-8 text-center text-muted-foreground">Actions content coming soon.</div>
                    </TabsContent>
                    <TabsContent value="rewards">
                         <div className="p-8 text-center text-muted-foreground">Rewards content coming soon.</div>
                    </TabsContent>
                    <TabsContent value="apps">
                         <div className="p-8 text-center text-muted-foreground">Apps content coming soon.</div>
                    </TabsContent>
                </div>
            </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AnalyticsPage;
