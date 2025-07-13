
import type { IntradayPosition } from '@/types';

export const mockCryptoIntradayPositions: IntradayPosition[] = [
  {
    id: 'c-intra1',
    name: 'Bitcoin',
    symbol: 'BTCUSDT',
    transactionType: 'BUY',
    quantity: 0.05,
    avgPrice: 64800.00,
    ltp: 65000.00,
    pAndL: 10,
    pAndLPercent: 0.31,
  },
  {
    id: 'c-intra2',
    name: 'Ethereum',
    symbol: 'ETHUSDT',
    transactionType: 'SELL',
    quantity: 1.5,
    avgPrice: 3480.00,
    ltp: 3400.00,
    pAndL: 120.00,
    pAndLPercent: 2.30,
  },
];

export const mockRealCryptoIntradayPositions: IntradayPosition[] = [
    {
        id: 'c-intra-real1',
        name: 'Solana',
        symbol: 'SOLUSDT',
        transactionType: 'BUY',
        quantity: 10,
        avgPrice: 168.00,
        ltp: 170.00,
        pAndL: 20.00,
        pAndLPercent: 1.19,
    },
    {
        id: 'c-intra-real2',
        name: 'XRP',
        symbol: 'XRPUSDT',
        transactionType: 'SELL',
        quantity: 500,
        avgPrice: 0.49,
        ltp: 0.48,
        pAndL: 5.00,
        pAndLPercent: 2.04,
    }
];
