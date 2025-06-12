
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat } from 'lucide-react';

export function CryptoFuturesSection() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
          <Repeat className="h-6 w-6 mr-2" /> Crypto Futures
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-4">
          Your crypto futures positions will be displayed here. This feature is coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
