import type { Stock, MarketIndex, NewsArticle } from '@/types';

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
