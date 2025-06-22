
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

export const mockRealCryptoIntradayPositions: IntradayPosition[] = [
    {
        id: 'c-intra-real1',
        name: 'Solana',
        symbol: 'SOLINR',
        transactionType: 'BUY',
        quantity: 10,
        avgPrice: 1650.00,
        ltp: 1665.00,
        pAndL: (1665.00 - 1650.00) * 10,
        pAndLPercent: ((1665.00 - 1650.00) / 1650.00) * 100,
    },
    {
        id: 'c-intra-real2',
        name: 'XRP',
        symbol: 'XRPINR',
        transactionType: 'SELL',
        quantity: 500,
        avgPrice: 40.00,
        ltp: 39.10,
        pAndL: (40.00 - 39.10) * 500,
        pAndLPercent: ((40.00 - 39.10) / 40.00) * 100,
    }
];
