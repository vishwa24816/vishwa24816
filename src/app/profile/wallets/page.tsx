
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wallet, Plus, Eye, EyeOff, Trash2, Copy } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const mockWallets = [
  { id: 'wallet1', name: 'My Main Wallet', phrase: 'apple banana cat dog elephant frog grape house ice cream jungle' },
  { id: 'wallet2', name: 'Trading Wallet', phrase: 'king lion monkey nectar orange parrot queen rose sun tiger' },
];

const WalletCard = ({ wallet, onRemove }: { wallet: typeof mockWallets[0], onRemove: (id: string) => void }) => {
  const [showPhrase, setShowPhrase] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.phrase);
    toast({ title: 'Copied Recovery Phrase' });
  };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                {wallet.name}
            </CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your wallet and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onRemove(wallet.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Recovery Phrase</p>
          <Button variant="ghost" size="icon" onClick={() => setShowPhrase(!showPhrase)} className="h-8 w-8">
            {showPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {showPhrase && (
          <div className="mt-2 p-3 bg-muted rounded-md flex items-center justify-between animate-accordion-down">
            <p className="text-sm font-mono break-all">{wallet.phrase}</p>
            <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8 shrink-0">
                <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function WalletManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [wallets, setWallets] = useState(mockWallets);

  const handleAddWallet = () => {
    const newWallet = {
      id: `wallet${Date.now()}`,
      name: `Wallet ${wallets.length + 1}`,
      phrase: 'newly generated recovery phrase would appear here for the user to save',
    };
    setWallets(prev => [...prev, newWallet]);
    toast({
      title: 'New Wallet Added (Mock)',
      description: `${newWallet.name} has been created.`,
    });
  };

  const handleRemoveWallet = (id: string) => {
    const walletToRemove = wallets.find(w => w.id === id);
    setWallets(prev => prev.filter(w => w.id !== id));
     if (walletToRemove) {
        toast({
            title: "Wallet Removed (Mock)",
            description: `${walletToRemove.name} has been removed.`,
            variant: "destructive"
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
          <h1 className="text-xl font-bold ml-4">Wallet Management</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 space-y-6">
            <Button onClick={handleAddWallet} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add New Wallet
            </Button>

            <div className="space-y-4">
                {wallets.map((wallet) => (
                    <WalletCard key={wallet.id} wallet={wallet} onRemove={handleRemoveWallet}/>
                ))}
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
