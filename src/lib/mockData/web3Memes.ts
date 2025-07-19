
import type { Stock } from '@/types';

const USD_TO_INR = 80;

export const mockWeb3Memes: Stock[] = [
  { 
    id: 'w3mm_pepe', symbol: 'PEPE', name: 'Pepe', price: 0.000014 * USD_TO_INR, change: 0.000002 * USD_TO_INR, changePercent: 16.67, exchange: 'Crypto'
  },
  { 
    id: 'w3mm_wif', symbol: 'WIF', name: 'dogwifhat', price: 3.50 * USD_TO_INR, change: 0.45 * USD_TO_INR, changePercent: 14.75, exchange: 'Crypto'
  },
  { 
    id: 'w3mm_floki', symbol: 'FLOKI', name: 'Floki', price: 0.00028 * USD_TO_INR, change: 0.00003 * USD_TO_INR, changePercent: 12.00, exchange: 'Crypto'
  },
];
