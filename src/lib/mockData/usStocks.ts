
import type { Stock } from '@/types';

const USD_TO_INR = 83;

// NOTE: All values are now converted to INR.
export const mockUsStocks: Stock[] = [
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.50 * USD_TO_INR,
    change: 2.75 * USD_TO_INR,
    changePercent: 1.43,
    exchange: 'NASDAQ',
    sector: 'Technology',
    marketCap: '₹249T'
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 340.80 * USD_TO_INR,
    change: -1.20 * USD_TO_INR,
    changePercent: -0.35,
    exchange: 'NASDAQ',
    sector: 'Technology',
    marketCap: '₹207T'
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 135.20 * USD_TO_INR,
    change: 1.10 * USD_TO_INR,
    changePercent: 0.82,
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    marketCap: '₹141T'
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 130.45 * USD_TO_INR,
    change: 0.95 * USD_TO_INR,
    changePercent: 0.73,
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    marketCap: '₹108T'
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 250.60 * USD_TO_INR,
    change: -5.40 * USD_TO_INR,
    changePercent: -2.11,
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    marketCap: '₹65T'
  },
];
