
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
  // Mutual Fund specific fields
  riskLevel?: 'Low' | 'Moderately Low' | 'Moderate' | 'Moderately High' | 'High' | 'Very High';
  category?: string;
  annualisedReturn?: number;
  navDate?: string;
  rating?: string | number;
  minSipAmount?: number;
  fundSize?: string;
  holdingsCount?: number;
  topHoldings?: Array<{ name: string; percentage: number }>;
  marketTrends?: {
    shortTerm: 'Positive' | 'Negative' | 'Neutral';
    longTerm: 'Positive' | 'Negative' | 'Neutral';
    analystRating?: string;
  };
  pros?: string[];
  cons?: string[];
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

export interface FoInstrumentInBasket {
  id: string;
  action: 'BUY' | 'SELL';
  name: string; 
  price: number; 
  lots: number;
  ltp?: number; 
  quantityPerLot?: number; 
}

export interface FoBasket {
  id: string;
  name: string;
  status: 'Active' | 'Pending Execution' | 'Executed' | 'Cancelled' | 'Archived';
  requiredMargin: number;
  instrumentsCount: number;
  createdDate: string;
  pnl?: number;
  instruments?: FoInstrumentInBasket[];
  probabilityOfProfit?: number; 
  maxProfit?: number; 
  maxLoss?: number; 
  riskRewardRatio?: string; 
  breakEvenPoints?: string; 
  totalMargin?: number; 
  marginBenefits?: number; 
}

export interface SelectedOptionLeg {
  id: string;
  underlyingSymbol: string;
  instrumentName: string; 
  expiryDate: string;
  strikePrice: number;
  optionType: 'Call' | 'Put';
  action: 'Buy' | 'Sell';
  ltp: number;
  quantity: number; 
}

export interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
    username: string;
  };
  timestamp: string;
  content: string;
  imageUrl?: string;
  imageAiHint?: string;
  stockSymbol?: string;
  stockChangePercent?: number;
  tags?: string[];
  source?: string;
  likes: number;
  comments: number;
  reposts: number;
  recommendationType?: 'Buy' | 'Sell' | 'Hold' | 'Accumulate';
  targetPrice?: number;
  researchFirm?: string;
  analystName?: string;
  category?: 'Fiat' | 'Exchange' | 'Web3';
}

export interface GttOrder {
  id: string;
  instrumentName: string;
  symbol: string;
  orderType: 'BUY' | 'SELL';
  triggerPrice: number;
  quantity: number;
  limitPrice?: number;
  status: 'Active' | 'Triggered' | 'Cancelled' | 'Expired';
  createdDate: string;
  exchange: string;
  productType: 'CNC' | 'MIS' | 'NRML';
}

export interface BondBid {
  id: string;
  bondName: string;
  isin: string;
  bidPrice: number;
  bidYield?: string;
  quantity: number;
  status: 'Pending' | 'Partial Fill' | 'Filled' | 'Cancelled' | 'Rejected';
  bidDate: string;
  platform: 'Exchange' | 'Primary Market';
}

export interface SipOrder {
  id: string;
  instrumentName: string;
  symbol?: string;
  assetType: 'Stock' | 'Mutual Fund' | 'ETF' | 'Gold Bond' | 'Crypto';
  amount?: number;
  quantity?: number;
  frequency: 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Annually';
  nextDueDate: string;
  status: 'Active' | 'Paused' | 'Cancelled' | 'Completed';
  startDate: string;
  installmentsDone: number;
  totalInstallments?: number;
}

export interface PriceAlert {
  id: string;
  instrumentName: string;
  symbol: string;
  targetPrice: number;
  condition: 'Above' | 'Below' | 'Equals';
  currentPrice?: number;
  status: 'Active' | 'Triggered' | 'Cancelled' | 'Expired';
  createdDate: string;
  exchange: string;
  assetType: 'Stock' | 'Mutual Fund' | 'Crypto' | 'Future' | 'Option' | 'ETF' | 'Index' | 'Crypto Future';
  notes?: string;
}
