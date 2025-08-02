"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';

// Mock data for existing sub-accounts
const mockInitialSubAccounts = [
  { id: 'sub1', name: 'Spouse', ucc: 'DEMO457', avatar: 'S' },
  { id: 'sub2', name: 'Child 1', ucc: 'DEMO458', avatar: 'C' },
];

const SubAccountCard = ({ account, onRemove }: { account: typeof mockInitialSubAccounts[0], onRemove: (id: string) => void }) => (
  <Card>
    <CardContent className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{account.avatar}</AvatarFallback>
        </Avatar>
        <div>
            <p className="font-semibold">{account.name}</p>
            <p className="text-sm text-muted-foreground">UCC: {account.ucc}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onRemove(account.id)}>
          <Trash2 className="h-4 w-4" />
      </Button>
    </CardContent>
  </Card>
);

export default function FamilyAccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [subAccounts, setSubAccounts] = useState(mockInitialSubAccounts);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountUcc, setNewAccountUcc] = useState('');

  const handleAddAccount = () => {
    if (!newAccountName.trim() || !newAccountUcc.trim()) {
      toast({
        title: "Incomplete Details",
        description: "Please enter a name and UCC for the sub-account.",
        variant: "destructive",
      });
      return;
    }
    const newAccount = {
        id: `sub${Date.now()}`,
        name: newAccountName,
        ucc: newAccountUcc.toUpperCase(),
        avatar: newAccountName.charAt(0).toUpperCase(),
    };
    setSubAccounts(prev => [...prev, newAccount]);
    setNewAccountName('');
    setNewAccountUcc('');
    toast({
      title: "Sub-Account Added (Mock)",
      description: `${newAccount.name} has been added to your family account.`,
    });
  };

  const handleRemoveAccount = (id: string) => {
    const accountToRemove = subAccounts.find(acc => acc.id === id);
    setSubAccounts(prev => prev.filter(acc => acc.id !== id));
    if (accountToRemove) {
        toast({
            title: "Sub-Account Removed (Mock)",
            description: `${accountToRemove.name} has been removed.`,
        });
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-muted/20">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Family Accounts</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Add New Sub-Account
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="account-name">Account Holder's Name</Label>
                        <Input 
                            id="account-name" 
                            placeholder="e.g., Spouse, Child"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="account-ucc">UCC (Client Code)</Label>
                        <Input 
                            id="account-ucc" 
                            placeholder="e.g., DEMO999"
                            value={newAccountUcc}
                            onChange={(e) => setNewAccountUcc(e.target.value)} 
                        />
                    </div>
                    <Button onClick={handleAddAccount} className="w-full">Add Account</Button>
                </CardContent>
            </Card>

            <div>
                <h2 className="text-lg font-semibold mb-3">Linked Accounts ({subAccounts.length})</h2>
                <div className="space-y-3">
                    {subAccounts.map((account) => (
                        <SubAccountCard key={account.id} account={account} onRemove={handleRemoveAccount}/>
                    ))}
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
