
import type { IntradayPosition } from '@/types';

export const mockCryptoIntradayPositions: IntradayPosition[] = [
  {
    id: 'c-intra1',
    name: 'Bitcoin',
    symbol: 'BTCINR',
    transactionType: 'BUY',
    quantity: 0.05,
    avgPrice: 2390000.00,
    ltp: 2400000.00,
    pAndL: 500,
    pAndLPercent: 0.42,
  },
  {
    id: 'c-intra2',
    name: 'Ethereum',
    symbol: 'ETHINR',
    transactionType: 'SELL',
    quantity: 1.5,
    avgPrice: 151000.00,
    ltp: 150000.00,
    pAndL: 1500.00,
    pAndLPercent: 0.66,
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
        pAndL: 150.00,
        pAndLPercent: 0.91,
    },
    {
        id: 'c-intra-real2',
        name: 'XRP',
        symbol: 'XRPINR',
        transactionType: 'SELL',
        quantity: 500,
        avgPrice: 40.00,
        ltp: 39.10,
        pAndL: 450.00,
        pAndLPercent: 2.25,
    }
];
