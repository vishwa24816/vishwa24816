
import type { Stock } from '@/types';

export const mockWeb3Gainers: Stock[] = [
  { id: 'gainer-wif', symbol: 'WIF', name: 'dogwifhat', price: 2.50, change: 0.50, changePercent: 25.00, exchange: 'Crypto' },
  { id: 'gainer-pepe', symbol: 'PEPE', name: 'Pepe', price: 0.000014, change: 0.000002, changePercent: 16.67, exchange: 'Crypto' },
  { id: 'gainer-bonk', symbol: 'BONK', name: 'Bonk', price: 0.000023, change: 0.000003, changePercent: 15.00, exchange: 'Crypto' },
  { id: 'gainer-floki', symbol: 'FLOKI', name: 'FLOKI', price: 0.00017, change: 0.00002, changePercent: 13.33, exchange: 'Crypto' },
];
