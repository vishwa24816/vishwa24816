
"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition } from '@/types';
import { Briefcase } from 'lucide-react';
import { PortfolioCategoryCard } from './PortfolioCategoryCard';

type PositionItem = PortfolioHolding | IntradayPosition | FoPosition | CryptoFuturePosition;

interface OpenPositionsDisplayProps {
  fiatHoldings: PortfolioHolding[];
  wealthHoldings: PortfolioHolding[];
  cryptoHoldings: PortfolioHolding[];
  web3Holdings: PortfolioHolding[];
  intradayPositions: IntradayPosition[];
  foPositions: FoPosition[];
  cryptoFutures: CryptoFuturePosition[];
  onCategoryClick: (category: 'Fiat' | 'Crypto') => void;
}

export function OpenPositionsDisplay({
  fiatHoldings,
  wealthHoldings,
  cryptoHoldings,
  web3Holdings,
  intradayPositions,
  foPositions,
  cryptoFutures,
  onCategoryClick,
}: OpenPositionsDisplayProps) {

  const categories = React.useMemo(() => {
    const fiatItems = [...fiatHoldings, ...intradayPositions, ...foPositions];
    const wealthItems = [...wealthHoldings];
    const cryptoItems = [...cryptoHoldings, ...cryptoFutures];
    const web3Items = [...web3Holdings];

    return [
      { title: "Fiat Assets", items: fiatItems, category: 'Fiat' as const },
      { title: "Wealth Assets", items: wealthItems, category: 'Fiat' as const }, // Wealth is under Fiat
      { title: "Crypto Assets", items: cryptoItems, category: 'Crypto' as const },
      { title: "Web3 Assets", items: web3Items, category: 'Crypto' as const }, // Web3 is under Crypto
    ].filter(cat => cat.items.length > 0);
  }, [fiatHoldings, wealthHoldings, cryptoHoldings, web3Holdings, intradayPositions, foPositions, cryptoFutures]);
  
  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  if (totalItems === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No open positions or holdings found.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
          <Briefcase className="h-6 w-6 mr-2" />
          Asset Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-4">
          {categories.map((category) => 
            <PortfolioCategoryCard
              key={category.title}
              title={category.title}
              items={category.items}
              onCategoryClick={() => onCategoryClick(category.category)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
