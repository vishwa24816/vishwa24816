
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Gift } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockPortfolioHoldings, mockWeb3Holdings } from '@/lib/mockData';
import type { PortfolioHolding } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const allHoldings = [...mockPortfolioHoldings, ...mockWeb3Holdings];

const HoldingItem = ({ holding }: { holding: PortfolioHolding }) => {
    const { toast } = useToast();
    const [isGifting, setIsGifting] = useState(false);
    const [recipientName, setRecipientName] = useState('');
    const [recipientContact, setRecipientContact] = useState('');
    const [recipientMessage, setRecipientMessage] = useState('');

    const handleGiftClick = () => {
        setIsGifting(!isGifting);
    };

    const handleSendGift = () => {
         if (!recipientName || !recipientContact) {
            toast({
                title: "Incomplete Details",
                description: "Please enter the recipient's name and contact information.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: 'Gift Sent (Mock)',
            description: `Gift of ${holding.name} sent to ${recipientName}.`,
        });
        setIsGifting(false);
        setRecipientName('');
        setRecipientContact('');
        setRecipientMessage('');
    };

    const isProfit = holding.profitAndLoss >= 0;

    return (
        <Card className="shadow-sm transition-all duration-300">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="font-semibold">{holding.name} ({holding.symbol})</p>
                        <p className="text-sm text-muted-foreground">Qty: {holding.quantity.toFixed(4)} | Value: ₹{holding.currentValue.toLocaleString()}</p>
                        <p className={cn("text-sm", isProfit ? 'text-green-600' : 'text-red-600')}>
                            P&L: {isProfit ? '+' : ''}₹{holding.profitAndLoss.toLocaleString()}
                        </p>
                    </div>
                    <Button onClick={handleGiftClick} size="sm">
                        <Gift className="mr-2 h-4 w-4" />
                        {isGifting ? 'Cancel' : 'Gift'}
                    </Button>
                </div>
                 {isGifting && (
                    <div className="mt-4 pt-4 border-t space-y-4 animate-accordion-down">
                        <h4 className="font-semibold text-center text-primary">Gifting to:</h4>
                        <Input 
                            placeholder="Recipient's Name" 
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                        />
                        <Input 
                            placeholder="Recipient's Mobile or Email" 
                            value={recipientContact}
                             onChange={(e) => setRecipientContact(e.target.value)}
                        />
                        <Textarea 
                            placeholder="Message (optional)"
                            value={recipientMessage}
                            onChange={(e) => setRecipientMessage(e.target.value)}
                        />
                        <Button onClick={handleSendGift} className="w-full">Send Gift</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default function GiftPage() {
    const router = useRouter();
    
    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <header className="flex items-center p-4 border-b">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Gift an Asset</h1>
                </header>
                <main className="flex-grow">
                    <ScrollArea className="h-[calc(100vh-80px)]">
                        <div className="p-4 space-y-3">
                            {allHoldings.map(holding => (
                                <HoldingItem key={holding.id} holding={holding} />
                            ))}
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </ProtectedRoute>
    );
}
