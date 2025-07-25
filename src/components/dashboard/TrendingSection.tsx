
"use client";

import React from 'react';
import { MoverItem } from './MoverItem';
import type { Stock } from '@/types';
import { Flame } from 'lucide-react';

interface TrendingSectionProps {
  title: string;
  items: Stock[];
  onAssetClick: (asset: Stock) => void;
}

export const TrendingSection: React.FC<TrendingSectionProps> = ({ title, items, onAssetClick }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold font-headline text-primary flex items-center mb-2">
        <Flame className="h-6 w-6 mr-2" /> {title}
      </h2>
      <div className="space-y-1">
        {items.map(stock => <MoverItem key={stock.id} stock={stock} onAssetClick={onAssetClick} />)}
      </div>
    </div>
  );
};
