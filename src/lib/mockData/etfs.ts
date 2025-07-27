
import type { Stock } from '@/types';

export const mockETFs: Stock[] = [
  { id: 'etf1', symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty BeES', price: 230.50, change: 1.20, changePercent: 0.52, exchange: 'NSE', sector: 'Index ETF' },
  { id: 'etf2', symbol: 'BANKBEES', name: 'Nippon India ETF Bank BeES', price: 480.70, change: -2.10, changePercent: -0.44, exchange: 'NSE', sector: 'Index ETF' },
  { id: 'etf3', symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', price: 55.80, change: 0.30, changePercent: 0.54, exchange: 'NSE', sector: 'Commodity ETF' },
  { id: 'etf4', symbol: 'ICICINIFTY', name: 'ICICI Prudential Nifty 50 ETF', price: 228.40, change: 1.10, changePercent: 0.48, exchange: 'NSE', sector: 'Index ETF' },
  { id: 'etf5', symbol: 'JUNIORBEES', name: 'Nippon India ETF Nifty Next 50 Junior BeES', price: 510.20, change: 3.50, changePercent: 0.69, exchange: 'NSE', sector: 'Index ETF' },
];
