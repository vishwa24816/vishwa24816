
import type { Stock } from '@/types';

export const mockCryptoETFs: Stock[] = [
  { id: 'cetf1', symbol: 'CRYPBEES', name: 'CryptoBluechip ETF', price: 120.50, change: 2.30, changePercent: 1.95, exchange: 'NSE', sector: 'Crypto ETF' },
  { id: 'cetf2', symbol: 'DEFIETF', name: 'DeFi Basket ETF', price: 85.70, change: -1.10, changePercent: -1.27, exchange: 'NSE', sector: 'Crypto ETF' },
  { id: 'cetf3', symbol: 'BTCETF', name: 'Bitcoin Tracker ETF', price: 240.00, change: 5.50, changePercent: 2.34, exchange: 'BSE', sector: 'Crypto ETF' },
];
