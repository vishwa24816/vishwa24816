
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockCryptoFuturesForWatchlist: Stock[] = [
  { 
    id: 'btcusdtperp', symbol: 'BTCUSDT.P', name: 'Bitcoin Perpetual', price: 30500.00, change: 150.00, changePercent: 0.49, exchange: 'Crypto Futures',
    todayLow: 30200.00, todayHigh: 30800.50, fiftyTwoWeekLow: 15000.00, fiftyTwoWeekHigh: 45000.00,
    openPrice: 30350.00, prevClosePrice: 30350.00, volume: 50000, lotSize: 1,
  },
  { 
    id: 'ethusdtperp', symbol: 'ETHUSDT.P', name: 'Ethereum Perpetual', price: 1820.50, change: -10.25, changePercent: -0.56, exchange: 'Crypto Futures',
    todayLow: 1805.00, todayHigh: 1840.00, fiftyTwoWeekLow: 900.00, fiftyTwoWeekHigh: 2500.00,
    openPrice: 1830.75, prevClosePrice: 1830.75, volume: 150000, lotSize: 1,
  },
  { 
    id: 'solusdtperp', symbol: 'SOLUSDT.P', name: 'Solana Perpetual', price: 20.75, change: 0.50, changePercent: 2.47, exchange: 'Crypto Futures',
    todayLow: 19.50, todayHigh: 21.00, fiftyTwoWeekLow: 8.00, fiftyTwoWeekHigh: 120.00,
    openPrice: 20.25, prevClosePrice: 20.25, volume: 300000, lotSize: 1,
  },
  { 
    id: 'adausdtperp', symbol: 'ADAUSDT.P', name: 'Cardano Perpetual', price: 0.2650, change: 0.0020, changePercent: 0.76, exchange: 'Crypto Futures',
    todayLow: 0.2600, todayHigh: 0.2700, fiftyTwoWeekLow: 0.2000, fiftyTwoWeekHigh: 0.6000,
    openPrice: 0.2630, prevClosePrice: 0.2630, volume: 5000000, lotSize: 1,
  },
  { 
    id: 'dogeusdtperp', symbol: 'DOGEUSDT.P', name: 'Dogecoin Perpetual', price: 0.0625, change: -0.0005, changePercent: -0.79, exchange: 'Crypto Futures',
    todayLow: 0.0610, todayHigh: 0.0640, fiftyTwoWeekLow: 0.0500, fiftyTwoWeekHigh: 0.1500,
    openPrice: 0.0630, prevClosePrice: 0.0630, volume: 10000000, lotSize: 1,
  },
];
