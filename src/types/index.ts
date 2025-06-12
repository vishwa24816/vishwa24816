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
