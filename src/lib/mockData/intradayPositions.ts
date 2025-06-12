
import type { IntradayPosition } from '@/types';

export const mockIntradayPositions: IntradayPosition[] = [
  {
    id: 'intra1',
    name: 'Tata Motors Ltd.',
    symbol: 'TATAMOTORS',
    transactionType: 'BUY',
    quantity: 100,
    avgPrice: 650.25,
    ltp: 655.75,
    pAndL: 550.00,
    pAndLPercent: 0.85,
  },
  {
    id: 'intra2',
    name: 'Infosys Ltd.',
    symbol: 'INFY',
    transactionType: 'SELL',
    quantity: 50,
    avgPrice: 1355.00,
    ltp: 1350.50,
    pAndL: 225.00,
    pAndLPercent: 0.33,
  },
  {
    id: 'intra3',
    name: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    transactionType: 'BUY',
    quantity: 25,
    avgPrice: 2440.00,
    ltp: 2450.50,
    pAndL: 262.50,
    pAndLPercent: 0.43,
  },
];
