
import type { IntradayPosition } from '@/types';

export const mockCryptoIntradayPositions: IntradayPosition[] = [
  {
    id: 'c-intra1',
    name: 'Bitcoin',
    symbol: 'BTCUSDT',
    transactionType: 'BUY',
    quantity: 0.05,
    avgPrice: 43000.00,
    ltp: 43100.50,
    pAndL: 5.025, // (43100.50 - 43000.00) * 0.05
    pAndLPercent: 0.23, // (((43100.50 - 43000.00) * 0.05) / (43000.00 * 0.05)) * 100
  },
  {
    id: 'c-intra2',
    name: 'Ethereum',
    symbol: 'ETHUSDT',
    transactionType: 'SELL',
    quantity: 1.5,
    avgPrice: 2160.00,
    ltp: 2150.75,
    pAndL: 13.875, // (2160.00 - 2150.75) * 1.5
    pAndLPercent: 0.43, // (((2160.00 - 2150.75) * 1.5) / (2160.00 * 1.5)) * 100
  },
];
