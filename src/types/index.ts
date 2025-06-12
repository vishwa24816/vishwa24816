
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  volume?: string;
}

export interface MarketIndex {
  id: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  url?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface PortfolioHolding {
  id: string;
  name: string;
  symbol?: string;
  type: 'Stock' | 'Mutual Fund' | 'Crypto' | 'Bond' | 'ETF';
  quantity: number;
  avgCostPrice: number;
  ltp: number; // Last Traded Price
  currentValue: number;
  profitAndLoss: number;
  profitAndLossPercent: number;
  dayChangeAbsolute: number; // Total absolute change for the quantity held on that day
  dayChangePercent: number; // Percentage change of the instrument's price/NAV for the day
}
