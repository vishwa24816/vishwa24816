
import type { Stock } from '@/types';

// NOTE: These values are nominal USD values. They will be displayed with a $ prefix.
// For portfolio summary, they should be converted to INR.
export const mockUsStocks: Stock[] = [
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 195.50,
    change: 2.75,
    changePercent: 1.43,
    exchange: 'NASDAQ',
    sector: 'Technology',
    marketCap: '$3.0T'
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 340.80,
    change: -1.20,
    changePercent: -0.35,
    exchange: 'NASDAQ',
    sector: 'Technology',
    marketCap: '$2.5T'
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 135.20,
    change: 1.10,
    changePercent: 0.82,
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    marketCap: '$1.7T'
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 130.45,
    change: 0.95,
    changePercent: 0.73,
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    marketCap: '$1.3T'
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 250.60,
    change: -5.40,
    changePercent: -2.11,
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    marketCap: '$790B'
  },
];
