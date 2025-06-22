
import type { Stock } from '@/types';

export const mockWeb3Memes: Stock[] = [
  { id: 'meme-doge', symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change: -0.01, changePercent: -7.69, exchange: 'Crypto' },
  { id: 'meme-shib', symbol: 'SHIB', name: 'Shiba Inu', price: 0.000018, change: 0.000001, changePercent: 5.88, exchange: 'Crypto' },
  { id: 'meme-wif', symbol: 'WIF', name: 'dogwifhat', price: 2.50, change: 0.50, changePercent: 25.00, exchange: 'Crypto' },
  { id: 'meme-pepe', symbol: 'PEPE', name: 'Pepe', price: 0.000014, change: 0.000002, changePercent: 16.67, exchange: 'Crypto' },
];
