
import type { Stock, MarketIndex, NewsArticle, PortfolioHolding, IntradayPosition, FoPosition, CryptoFuturePosition } from '@/types';

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
  { id: 'news4', headline: 'Tech stocks rally on strong Q2 earnings expectations for INFY and TCS', source: 'Reuters India', timestamp: '2023-10-05T15:00:00Z', url: '#' },
  { id: 'news5', headline: 'Government announces new PLI scheme for electronics manufacturing, Reliance to benefit', source: 'PIB India', timestamp: '2023-10-05T12:00:00Z', url: '#' },
  { id: 'news6', headline: 'Bitcoin price surges past $43,000, ETH follows', source: 'Crypto News Daily', timestamp: '2023-10-07T11:00:00Z', url: '#' },
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
   {
    id: 'holding6',
    name: 'Infosys Ltd.',
    symbol: 'INFY',
    type: 'Stock',
    quantity: 20,
    avgCostPrice: 1300.00,
    ltp: 1350.00,
    currentValue: 27000.00,
    profitAndLoss: 1000.00,
    profitAndLossPercent: 3.85,
    dayChangeAbsolute: 450.00, // 20 shares * 22.50
    dayChangePercent: 1.69,
  },
];

export const mockIntradayPositions: IntradayPosition[] = [
  {
    id: 'intra1',
    name: 'Tata Motors Ltd.',
    symbol: 'TATAMOTORS',
    transactionType: 'BUY',
    quantity: 100,
    avgPrice: 650.25,
    ltp: 655.75,
    pAndL: 550.00,
    pAndLPercent: 0.85,
  },
  {
    id: 'intra2',
    name: 'Infosys Ltd.',
    symbol: 'INFY',
    transactionType: 'SELL',
    quantity: 50,
    avgPrice: 1355.00,
    ltp: 1350.50,
    pAndL: 225.00,
    pAndLPercent: 0.33,
  },
  {
    id: 'intra3',
    name: 'Reliance Industries Ltd.',
    symbol: 'RELIANCE',
    transactionType: 'BUY',
    quantity: 25,
    avgPrice: 2440.00,
    ltp: 2450.50,
    pAndL: 262.50,
    pAndLPercent: 0.43,
  },
];

export const mockFoPositions: FoPosition[] = [
  {
    id: 'fo1',
    instrumentName: 'NIFTY 28DEC23 20000 CE',
    optionType: 'CE',
    transactionType: 'BUY',
    lots: 2,
    quantityPerLot: 50,
    avgPrice: 120.50,
    ltp: 135.25,
    pAndL: (135.25 - 120.50) * 2 * 50,
    pAndLPercent: (((135.25 - 120.50) * 2 * 50) / (120.50 * 2 * 50)) * 100,
    expiryDate: '2023-12-28',
  },
  {
    id: 'fo2',
    instrumentName: 'BANKNIFTY 28DEC23 45000 PE',
    optionType: 'PE',
    transactionType: 'BUY',
    lots: 1,
    quantityPerLot: 15,
    avgPrice: 250.75,
    ltp: 230.10,
    pAndL: (230.10 - 250.75) * 1 * 15,
    pAndLPercent: (((230.10 - 250.75) * 1 * 15) / (250.75 * 1 * 15)) * 100,
    expiryDate: '2023-12-28',
  },
   {
    id: 'fo3',
    instrumentName: 'RELIANCE JAN24 FUT',
    optionType: 'FUT',
    transactionType: 'SELL',
    lots: 1,
    quantityPerLot: 250,
    avgPrice: 2480.00,
    ltp: 2450.50,
    pAndL: (2480.00 - 2450.50) * 1 * 250,
    pAndLPercent: (((2480.00 - 2450.50) * 1 * 250) / (2480.00 * 1 * 250)) * 100,
    expiryDate: '2024-01-25',
  },
];


export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTCUSDT',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 42500.00,
    markPrice: 43100.50,
    liquidationPrice: 38000.00,
    unrealizedPnL: (43100.50 - 42500.00) * 0.1,
    margin: 425.00,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETHUSDT',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 2200.00,
    markPrice: 2150.75,
    unrealizedPnL: (2200.00 - 2150.75) * 2,
    margin: 440.00,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOLUSDT',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 60.00,
    markPrice: 65.50,
    unrealizedPnL: (65.50 - 60.00) * 10,
    margin: 60.00,
    leverage: 10,
  },
];
