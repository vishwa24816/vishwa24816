
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const mockTransactions = [
  { id: 'txn1', date: '2024-07-26', description: 'Bought 10 RELIANCE @ 2950.50', amount: -29505.00, type: 'DEBIT' },
  { id: 'txn2', date: '2024-07-26', description: 'Funds added via UPI', amount: 50000.00, type: 'CREDIT' },
  { id: 'txn3', date: '2024-07-25', description: 'Sold 5 INFY @ 1650.00', amount: 8250.00, type: 'CREDIT' },
  { id: 'txn4', date: '2024-07-24', description: 'Withdrawal to bank account', amount: -10000.00, type: 'DEBIT' },
  { id: 'txn5', date: '2024-07-22', description: 'Bought 0.01 BTC @ 5200000.00', amount: -52000.00, type: 'DEBIT' },
  { id: 'txn6', date: '2024-07-20', description: 'Brokerage charges for July', amount: -350.00, type: 'DEBIT' },
  { id: 'txn7', date: '2024-07-18', description: 'Dividend from HUL', amount: 450.00, type: 'CREDIT' },
  { id: 'txn8', date: '2024-07-15', description: 'SIP Investment - Axis Bluechip', amount: -5000.00, type: 'DEBIT' },
  { id: 'txn9', date: '2024-07-12', description: 'Interest on uninvested funds', amount: 125.50, type: 'CREDIT' },
  { id: 'txn10', date: '2024-07-10', description: 'Sold 2 NIFTYBEES @ 230.50', amount: 461.00, type: 'CREDIT' },
];

const TransactionItem = ({ transaction }: { transaction: typeof mockTransactions[0] }) => {
    const isCredit = transaction.type === 'CREDIT';
    return (
        <div className="flex items-center p-4 border-b">
            <div className={cn("p-2 rounded-full mr-4", isCredit ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30")}>
                {isCredit ? <ArrowDownLeft className="h-5 w-5 text-green-600" /> : <ArrowUpRight className="h-5 w-5 text-red-600" />}
            </div>
            <div className="flex-grow">
                <p className="font-medium text-foreground">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{transaction.date}</p>
            </div>
            <div className={cn("text-right font-semibold", isCredit ? "text-green-600" : "text-red-600")}>
                {isCredit ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
            </div>
        </div>
    );
};

export default function LedgerPage() {
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <header className="flex items-center p-4 border-b sticky top-0 bg-background z-10">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Transaction Ledger</h1>
                </header>
                <main className="flex-grow">
                    <ScrollArea className="h-[calc(100vh-69px)]">
                        <div className="divide-y">
                            {mockTransactions.map(txn => (
                                <TransactionItem key={txn.id} transaction={txn} />
                            ))}
                        </div>
                    </ScrollArea>
                </main>
            </div>
        </ProtectedRoute>
    )
}
