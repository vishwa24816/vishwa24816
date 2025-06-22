
import type { IntradayPosition } from '@/types';

export const mockCryptoIntradayPositions: IntradayPosition[] = [
  {
    id: 'c-intra1',
    name: 'Bitcoin',
    symbol: 'BTCINR',
    transactionType: 'BUY',
    quantity: 0.05,
    avgPrice: 3590500.00,
    ltp: 3600891.75,
    pAndL: 519.59,
    pAndLPercent: 0.23,
  },
  {
    id: 'c-intra2',
    name: 'Ethereum',
    symbol: 'ETHINR',
    transactionType: 'SELL',
    quantity: 1.5,
    avgPrice: 180360.00,
    ltp: 179588.13,
    pAndL: 1157.81,
    pAndLPercent: 0.43,
  },
];
