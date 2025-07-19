
import type { Stock } from '@/types';

const USD_TO_INR = 80;

export const mockWeb3Trending: Stock[] = [
  { 
    id: 'w3tr_not', symbol: 'NOT', name: 'Notcoin', price: 0.02 * USD_TO_INR, change: 0.004 * USD_TO_INR, changePercent: 25.00, exchange: 'Crypto'
  },
  { 
    id: 'w3tr_ton', symbol: 'TON', name: 'Toncoin', price: 7.50 * USD_TO_INR, change: 0.50 * USD_TO_INR, changePercent: 7.14, exchange: 'Crypto'
  },
  { 
    id: 'w3tr_ondo', symbol: 'ONDO', name: 'Ondo', price: 1.25 * USD_TO_INR, change: 0.10 * USD_TO_INR, changePercent: 8.70, exchange: 'Crypto'
  },
];
