
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockCryptoFuturesForWatchlist: Stock[] = [
  { id: 'btcusdtperp', symbol: 'BTCUSDT.P', name: 'Bitcoin Perpetual', price: 30500.00, change: 150.00, changePercent: 0.49, exchange: 'Crypto Futures' },
  { id: 'ethusdtperp', symbol: 'ETHUSDT.P', name: 'Ethereum Perpetual', price: 1820.50, change: -10.25, changePercent: -0.56, exchange: 'Crypto Futures' },
  { id: 'solusdtperp', symbol: 'SOLUSDT.P', name: 'Solana Perpetual', price: 20.75, change: 0.50, changePercent: 2.47, exchange: 'Crypto Futures' },
  { id: 'adausdtperp', symbol: 'ADAUSDT.P', name: 'Cardano Perpetual', price: 0.2650, change: 0.0020, changePercent: 0.76, exchange: 'Crypto Futures' },
  { id: 'dogeusdtperp', symbol: 'DOGEUSDT.P', name: 'Dogecoin Perpetual', price: 0.0625, change: -0.0005, changePercent: -0.79, exchange: 'Crypto Futures' },
];
