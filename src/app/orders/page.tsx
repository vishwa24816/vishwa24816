
"use client";

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center">
          <FileText className="h-16 w-16 text-primary mb-6" />
          <h1 className="text-3xl font-bold mb-4">Orders</h1>
          <p className="text-muted-foreground mb-8">View and manage your past and current orders here.</p>
          <div className="bg-muted p-6 rounded-lg shadow">
             <p className="text-foreground">This page is currently under construction.</p>
             <p className="text-sm text-muted-foreground mt-2">Check back soon for updates!</p>
          </div>
          <Link href="/" className="mt-8">
            <Button>Go to Home</Button>
          </Link>
        </main>
      </div>
    </ProtectedRoute>
  );
}
