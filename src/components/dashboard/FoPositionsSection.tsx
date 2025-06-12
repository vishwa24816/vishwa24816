
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from 'lucide-react';

export function FoPositionsSection() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
          <Layers className="h-6 w-6 mr-2" /> F&O Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-4">
          Your Futures & Options positions will be displayed here. This feature is coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
