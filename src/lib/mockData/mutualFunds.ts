
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockMutualFunds: Stock[] = [
  { id: 'mf1', symbol: 'PARAGPARIKH', name: 'Parag Parikh Flexi Cap Fund Direct-Growth', price: 65.78, change: 0.15, changePercent: 0.23, exchange: 'MF' },
  { id: 'mf2', symbol: 'AXISBLUECHIP', name: 'Axis Bluechip Fund Direct-Growth', price: 52.30, change: -0.05, changePercent: -0.10, exchange: 'MF' },
  { id: 'mf3', symbol: 'MIRAEELSS', name: 'Mirae Asset ELSS Tax Saver Fund Direct-Growth', price: 35.12, change: 0.20, changePercent: 0.57, exchange: 'MF' },
  { id: 'mf4', symbol: 'UTINIFTY50', name: 'UTI Nifty 50 Index Fund Direct-Growth', price: 140.50, change: 0.30, changePercent: 0.21, exchange: 'MF' },
  { id: 'mf5', symbol: 'SBI SMALLCAP', name: 'SBI Small Cap Fund Direct-Growth', price: 130.25, change: 1.10, changePercent: 0.85, exchange: 'MF' },
];
