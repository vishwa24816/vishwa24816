import type { Stock } from '@/types';

export const mockWeb3Trending: Stock[] = [
  { 
    id: 'w3tr_not', symbol: 'NOT', name: 'Notcoin', price: 0.02, change: 0.004, changePercent: 25.00, exchange: 'Crypto'
  },
  { 
    id: 'w3tr_ton', symbol: 'TON', name: 'Toncoin', price: 7.50, change: 0.50, changePercent: 7.14, exchange: 'Crypto'
  },
  { 
    id: 'w3tr_ondo', symbol: 'ONDO', name: 'Ondo', price: 1.25, change: 0.10, changePercent: 8.70, exchange: 'Crypto'
  },
];
