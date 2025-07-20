import type { Stock } from '@/types';

const USD_TO_INR = 80;

export const mockCryptoOptionsForWatchlist: Stock[] = [
  { 
    id: 'optBTC_1', 
    symbol: 'BTC-26JUL24-70000-C', 
    name: 'BTC 26JUL24 70000 Call', 
    price: 1500 * USD_TO_INR, 
    change: 150 * USD_TO_INR, 
    changePercent: 11.11, 
    exchange: 'Crypto Options',
    volume: 1200,
  },
  { 
    id: 'optBTC_2', 
    symbol: 'BTC-26JUL24-65000-P', 
    name: 'BTC 26JUL24 65000 Put', 
    price: 850 * USD_TO_INR, 
    change: -50 * USD_TO_INR, 
    changePercent: -5.56, 
    exchange: 'Crypto Options',
    volume: 950,
  },
  { 
    id: 'optETH_1', 
    symbol: 'ETH-26JUL24-3500-C', 
    name: 'ETH 26JUL24 3500 Call', 
    price: 120 * USD_TO_INR, 
    change: 25 * USD_TO_INR, 
    changePercent: 26.32, 
    exchange: 'Crypto Options',
    volume: 5500,
  },
  { 
    id: 'optETH_2', 
    symbol: 'ETH-26JUL24-3300-P', 
    name: 'ETH 26JUL24 3300 Put', 
    price: 75 * USD_TO_INR, 
    change: 5 * USD_TO_INR, 
    changePercent: 7.14, 
    exchange: 'Crypto Options',
    volume: 4800,
  },
  { 
    id: 'optBTC_3', 
    symbol: 'BTC-2AUG24-72000-C', 
    name: 'BTC 2AUG24 72000 Call', 
    price: 980 * USD_TO_INR, 
    change: 120 * USD_TO_INR, 
    changePercent: 13.95, 
    exchange: 'Crypto Options',
    volume: 800,
  },
];
