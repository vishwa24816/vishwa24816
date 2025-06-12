
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

export function IntradayPositionsSection() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
          <TrendingUp className="h-6 w-6 mr-2" /> Intraday Positions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-4">
          Your intraday positions will be displayed here. This feature is coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
