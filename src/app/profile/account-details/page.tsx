
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Landmark } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';

const mockBankAccounts = [
  {
    id: 'bank1',
    bankName: 'ICICI Bank',
    accountNumber: 'XXXX XXXX 6789',
    ifsc: 'ICIC0001234',
    isPrimary: true,
  },
  {
    id: 'bank2',
    bankName: 'HDFC Bank',
    accountNumber: 'XXXX XXXX 4321',
    ifsc: 'HDFC0005678',
    isPrimary: false,
  },
];

const BankAccountCard = ({ account }: { account: typeof mockBankAccounts[0] }) => (
  <Card>
    <CardContent className="p-4 flex items-start gap-4">
      <div className="bg-muted p-3 rounded-full">
        <Landmark className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
            <h3 className="font-semibold text-foreground">{account.bankName}</h3>
            {account.isPrimary && <Badge variant="default">Primary</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
        <p className="text-xs text-muted-foreground">IFSC: {account.ifsc}</p>
      </div>
    </CardContent>
  </Card>
);

export default function AccountDetailsPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Bank Accounts</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-4">
          {mockBankAccounts.map((account) => (
            <BankAccountCard key={account.id} account={account} />
          ))}

          <Button variant="outline" className="w-full mt-4">
            Add another bank account
          </Button>
        </main>
      </div>
    </ProtectedRoute>
  );
}
