
import type { Stock } from '@/types';

export const mockCryptoAssets: Stock[] = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 30000.00, change: 500.00, changePercent: 1.69, exchange: 'Crypto' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 1800.00, change: -20.50, changePercent: -1.12, exchange: 'Crypto' },
  { id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.00, changePercent: 0.00, exchange: 'Crypto' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', price: 240.00, change: 2.10, changePercent: 0.88, exchange: 'Crypto' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP', price: 0.47, change: 0.01, changePercent: 2.17, exchange: 'Crypto' },
  { id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.00, changePercent: 0.00, exchange: 'Crypto' },
  { id: 'ada', symbol: 'ADA', name: 'Cardano', price: 0.26, change: -0.005, changePercent: -1.88, exchange: 'Crypto' },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', price: 0.062, change: 0.001, changePercent: 1.64, exchange: 'Crypto' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', price: 20.00, change: 0.75, changePercent: 3.90, exchange: 'Crypto' },
  { id: 'trx', symbol: 'TRX', name: 'TRON', price: 0.076, change: 0.002, changePercent: 2.70, exchange: 'Crypto' },
];
