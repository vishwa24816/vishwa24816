
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  volume?: string;
  exchange?: string; // Added exchange
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

export interface IntradayPosition {
  id: string;
  name: string;
  symbol: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  avgPrice: number;
  ltp: number;
  pAndL: number;
  pAndLPercent: number;
}

export interface FoPosition {
  id: string;
  instrumentName: string; // e.g., NIFTY 23OCT23 19500 CE
  optionType: 'CE' | 'PE' | 'FUT'; // Call, Put, or Future
  transactionType: 'BUY' | 'SELL';
  lots: number;
  quantityPerLot: number;
  avgPrice: number; // Price per unit, not per lot
  ltp: number;
  pAndL: number;
  pAndLPercent: number;
  expiryDate: string; // YYYY-MM-DD
}

export interface CryptoFuturePosition {
  id: string;
  symbol: string; // e.g., BTCUSDT
  positionSide: 'LONG' | 'SHORT';
  quantity: number; // Number of contracts or base asset amount
  entryPrice: number;
  markPrice: number; // Current market price for calculating P&L
  liquidationPrice?: number;
  unrealizedPnL: number; // In quote currency (e.g., USDT)
  margin: number; // In quote currency (e.g., USDT)
  leverage: number; // e.g., 10x
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

