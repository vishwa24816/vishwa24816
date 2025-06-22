
import type { Stock } from '@/types';

export const mockWeb3DeFi: Stock[] = [
  { id: 'defi-uni', symbol: 'UNI', name: 'Uniswap', price: 9.90, change: 0.45, changePercent: 4.76, exchange: 'Crypto' },
  { id: 'defi-link', symbol: 'LINK', name: 'Chainlink', price: 14.20, change: -0.15, changePercent: -1.04, exchange: 'Crypto' },
  { id: 'defi-aave', symbol: 'AAVE', name: 'Aave', price: 91.50, change: 2.50, changePercent: 2.81, exchange: 'Crypto' },
  { id: 'defi-lido', symbol: 'LDO', name: 'Lido DAO', price: 2.30, change: 0.10, changePercent: 4.55, exchange: 'Crypto' },
];
