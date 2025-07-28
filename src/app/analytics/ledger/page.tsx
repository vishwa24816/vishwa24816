
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';

export default function LedgerPage() {
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <header className="flex items-center p-4 border-b">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-xl font-bold ml-4">Transaction Ledger</h1>
                </header>
                <main className="flex-grow p-6">
                    <div className="text-center text-muted-foreground">
                        <p>Detailed transaction analytics will be displayed here.</p>
                        <p className="text-sm mt-2">(Content under development)</p>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}
