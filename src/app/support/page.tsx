
"use client";

import React, { useState } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Mail,
  Compass,
  User,
  LineChart,
  Wallet,
  PieChart,
  ChevronRight,
} from 'lucide-react';

export function SupportPageContent() {
    
    const contactMethods = [
        {
            icon: Mail,
            title: "Email us",
            details: "support@simulation.app",
             href: "mailto:support@simulation.app"
        }
    ]

    const faqItems = [
        { icon: Compass, text: 'Getting Started' },
        { icon: User, text: 'My Account' },
        { icon: LineChart, text: 'How to use simbot' },
        { icon: Wallet, text: 'Payments & Withdrawals' },
        { icon: PieChart, text: 'Others' },
    ];

  return (
        <>
            <main className="flex-grow p-4 sm:p-6 lg:p-8">
                <h1 className="text-2xl font-bold mb-6">Contact us 24x7</h1>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contactMethods.map((method, index) => (
                            <a href={method.href} key={index} className="block">
                                <Card className="p-4 flex items-center space-x-4 hover:bg-muted/50 transition-colors h-full">
                                    <method.icon className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="font-semibold">{method.title}</p>
                                        <p className="text-sm text-muted-foreground">{method.details}</p>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>

                <h2 className="text-2xl font-bold mt-10 mb-6">FAQs</h2>
                
                <div className="space-y-2">
                    {faqItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <Button variant="ghost" className="w-full justify-between items-center p-4 h-auto text-base">
                                <div className="flex items-center">
                                    <item.icon className="w-6 h-6 mr-4 text-muted-foreground" />
                                    <span>{item.text}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </Button>
                            {index < faqItems.length - 1 && <Separator />}
                        </React.Fragment>
                    ))}
                </div>
            </main>
            <footer className="border-t p-4">
                <div className="container mx-auto flex justify-around items-center text-sm font-medium">
                    <Button variant="link" className="text-muted-foreground hover:text-primary">
                        Past tickets
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button variant="link" className="text-muted-foreground hover:text-primary">
                        Feedback
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button variant="link" className="text-muted-foreground hover:text-primary">
                        Grievance
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </footer>
        </>
  );
};

export default function SupportPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <SupportPageContent />
            </div>
        </ProtectedRoute>
    )
}
