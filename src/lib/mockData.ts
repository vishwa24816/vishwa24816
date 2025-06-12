
import type { Stock, MarketIndex, NewsArticle, PortfolioHolding } from '@/types';

export const mockMarketIndices: MarketIndex[] = [
  { id: 'nifty50', name: 'NIFTY 50', value: 18250.75, change: 75.20, changePercent: 0.41 },
  { id: 'sensex', name: 'SENSEX', value: 61350.26, change: 250.80, changePercent: 0.41 },
  { id: 'niftybank', name: 'NIFTY Bank', value: 43200.50, change: -150.10, changePercent: -0.35 },
];

export const mockStocks: Stock[] = [
  { id: 'reliance', symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2450.50, change: 12.75, changePercent: 0.52 },
  { id: 'tcs', symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3280.10, change: -5.20, changePercent: -0.16 },
  { id: 'hdfcbank', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1610.70, change: 8.15, changePercent: 0.51 },
  { id: 'infosys', symbol: 'INFY', name: 'Infosys Ltd.', price: 1350.00, change: 22.50, changePercent: 1.69 },
  { id: 'icicibank', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 925.30, change: -1.05, changePercent: -0.11 },
  { id: 'sbin', symbol: 'SBIN', name: 'State Bank of India', price: 570.80, change: 3.40, changePercent: 0.60 },
  { id: 'bajfinance', symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 7100.20, change: 50.90, changePercent: 0.72 },
];

export const mockNewsArticles: NewsArticle[] = [
  { id: 'news1', headline: 'RBI keeps repo rate unchanged, GDP growth projected at 7%', source: 'Business Standard', timestamp: '2023-10-06T10:00:00Z', url: '#' },
  { id: 'news2', headline: 'Indian markets hit record highs amid global cues', source: 'The Economic Times', timestamp: '2023-10-06T09:30:00Z', url: '#' },
  { id: 'news3', headline: 'FIIs turn net buyers in October, infuse Rs 5,000 crore', source: 'Livemint', timestamp: '2023-10-06T08:00:00Z', url: '#' },
  { id: 'news4', headline: 'Tech stocks rally on strong Q2 earnings expectations', source: 'Reuters India', timestamp: '2023-10-05T15:00:00Z', url: '#' },
  { id: 'news5', headline: 'Government announces new PLI scheme for electronics manufacturing', source: 'PIB India', timestamp: '2023-10-05T12:00:00Z', url: '#' },
];

export const mockPortfolioHoldings: PortfolioHolding[] = [
  {
    id: 'holding1',
    name: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    type: 'Stock',
    quantity: 10,
    avgCostPrice: 2400.00,
    ltp: 2450.50,
    currentValue: 24505.00,
    profitAndLoss: 505.00,
    profitAndLossPercent: 2.10,
    dayChangeAbsolute: 127.50, // 10 shares * 12.75 price change per share
    dayChangePercent: 0.52,
  },
  {
    id: 'holding2',
    name: 'Tata Digital India Fund Direct-Growth',
    type: 'Mutual Fund',
    quantity: 500,
    avgCostPrice: 30.00,
    ltp: 33.50,
    currentValue: 16750.00,
    profitAndLoss: 1750.00,
    profitAndLossPercent: 11.67,
    dayChangeAbsolute: 75.00, // 500 units * 0.15 NAV change per unit
    dayChangePercent: 0.45,
  },
  {
    id: 'holding3',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'Crypto',
    quantity: 0.05,
    avgCostPrice: 2200000.00,
    ltp: 2350000.00,
    currentValue: 117500.00,
    profitAndLoss: 7500.00,
    profitAndLossPercent: 6.82,
    dayChangeAbsolute: 750.00, // 0.05 BTC * 15000 price change per BTC
    dayChangePercent: 0.64,
  },
  {
    id: 'holding4',
    name: '7.26% GS 2033',
    symbol: 'GOI2033',
    type: 'Bond',
    quantity: 20,
    avgCostPrice: 990.00,
    ltp: 1010.50,
    currentValue: 20210.00,
    profitAndLoss: 410.00,
    profitAndLossPercent: 2.07,
    dayChangeAbsolute: 30.00, // 20 units * 1.50 price change per unit
    dayChangePercent: 0.15,
  },
  {
    id: 'holding5',
    name: 'NIFTYBEES',
    symbol: 'NIFTYBEES',
    type: 'ETF',
    quantity: 100,
    avgCostPrice: 200.00,
    ltp: 215.30,
    currentValue: 21530.00,
    profitAndLoss: 1530.00,
    profitAndLossPercent: 7.65,
    dayChangeAbsolute: 110.00, // 100 units * 1.10 price change per unit
    dayChangePercent: 0.51,
  },
];
