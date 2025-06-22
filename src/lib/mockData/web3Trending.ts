
import type { Stock } from '@/types';

export const mockWeb3Trending: Stock[] = [
  { id: 'trend-ton', symbol: 'TON', name: 'Toncoin', price: 7.50, change: 0.25, changePercent: 3.45, exchange: 'Crypto' },
  { id: 'trend-not', symbol: 'NOT', name: 'Notcoin', price: 0.015, change: -0.001, changePercent: -6.25, exchange: 'Crypto' },
  { id: 'trend-eth', symbol: 'ETH', name: 'Ethereum', price: 3500.00, change: 50.00, changePercent: 1.45, exchange: 'Crypto' },
  { id: 'trend-sol', symbol: 'SOL', name: 'Solana', price: 135.00, change: -2.50, changePercent: -1.82, exchange: 'Crypto' },
];
