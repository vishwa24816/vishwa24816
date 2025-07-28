
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, User, Star, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AlertSection = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {children}
            </div>
        </CardContent>
    </Card>
);

const AlertItem = ({ text }: { text: string }) => (
     <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <p className="text-sm">{text}</p>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
);


export default function AlertsPage() {
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
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Alerts</h1>
                <p className="text-muted-foreground">Stay ahead of the market with custom alerts.</p>
            </div>
            
            <AlertSection title="Alpha Alerts" description="Get notified on market-moving news and analysis.">
                <AlertItem text="52 Week High/Low Breakouts" />
                <AlertItem text="Unusual Volume Spikes" />
                <AlertItem text="Block/Bulk Deal Notifications" />
            </AlertSection>

            <AlertSection title="Superstar & Deals" description="Track the big players and significant market events.">
                <AlertItem text="Superstar Investor Portfolio Changes" />
                <AlertItem text="Insider Trading Activity" />
            </AlertSection>

            <AlertSection title="Price Target Alerts" description="Set your own price targets for any stock or crypto.">
                 <AlertItem text="RELIANCE hits ₹3000" />
                 <AlertItem text="BTC crosses ₹60,00,000" />
            </AlertSection>

             <AlertSection title="Email Alerts" description="Manage your email notifications for all alert types.">
                <AlertItem text="Daily Market Summary" />
                <AlertItem text="Weekly Portfolio Recap" />
            </AlertSection>
            
        </main>
      </div>
    </ProtectedRoute>
  );
}
