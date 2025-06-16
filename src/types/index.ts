
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string; // e.g., "29,377Cr"
  volume?: number;
  exchange?: string;
  todayLow?: number;
  todayHigh?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  openPrice?: number;
  prevClosePrice?: number;
  sector?: string;
  lowerCircuit?: number;
  upperCircuit?: number;
  lotSize?: number; 
  marginFactor?: number; 
  availableExpiries?: string[]; 
  fundamentals?: {
    marketCap: string; 
    peRatioTTM?: number;
    pbRatio?: number;
    industryPe?: number;
    debtToEquity?: number;
    roe?: number; 
    epsTTM?: number;
    divYield?: number; 
    bookValue?: number;
    faceValue?: number;
  };
  financials?: {
    revenue: Array<{ period: string; value: number }>;
    profit: Array<{ period: string; value: number }>;
    netWorth: Array<{ period: string; value: number }>;
  };
  aboutCompany?: string;
  shareholdingPattern?: Array<{
    period: string; 
    data: Array<{
      category: string; 
      percentage: number;
    }>;
  }>;
  topMutualFundsInvested?: Array<{
    id: string;
    name: string;
    schemeType?: string; 
    nav?: number;
    assetValue?: string; 
  }>;
  similarStocks?: Array<{
    id: string;
    symbol: string;
    name: string;
    price: number;
    changePercent: number;
    marketCap?: string;
  }>;
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
  ltp: number; 
  currentValue: number;
  profitAndLoss: number;
  profitAndLossPercent: number;
  dayChangeAbsolute: number; 
  dayChangePercent: number; 
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
  instrumentName: string; 
  optionType: 'CE' | 'PE' | 'FUT'; 
  transactionType: 'BUY' | 'SELL';
  lots: number;
  quantityPerLot: number;
  avgPrice: number; 
  ltp: number;
  pAndL: number;
  pAndLPercent: number;
  expiryDate: string; 
}

export interface CryptoFuturePosition {
  id: string;
  symbol: string; 
  positionSide: 'LONG' | 'SHORT';
  quantity: number; 
  entryPrice: number;
  markPrice: number; 
  liquidationPrice?: number;
  unrealizedPnL: number; 
  margin: number; 
  leverage: number; 
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface OptionData {
  oi: number;
  chngInOI: number;
  volume: number;
  iv?: number; 
  ltp: number;
  netChng: number;
  bidQty?: number;
  bidPrice?: number;
  askPrice?: number;
  askQty?: number;
  delta?: number;
  gamma?: number;
  theta?: number;
  vega?: number;
  rho?: number;
}

export interface OptionChainEntry {
  strikePrice: number;
  call?: OptionData;
  put?: OptionData;
}

export interface OptionChainData {
  underlyingValue?: number;
  expiryDate: string;
  data: OptionChainEntry[];
}

export interface Underlying {
  id: string;
  name: string;
  symbol: string;
}

export interface FoBasket {
  id: string;
  name: string;
  status: 'Active' | 'Pending Execution' | 'Executed' | 'Cancelled' | 'Archived';
  requiredMargin: number;
  instrumentsCount: number;
  createdDate: string; 
  pnl?: number; 
}
