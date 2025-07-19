
import type { CryptoFuturePosition } from '@/types';

const USD_TO_INR = 80;

export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTC-PERP',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 65000.00 * USD_TO_INR,
    markPrice: 65150.00 * USD_TO_INR,
    liquidationPrice: 58500.00 * USD_TO_INR,
    unrealizedPnL: 15.00 * USD_TO_INR,
    mtmPnl: 4.50 * USD_TO_INR,
    margin: 6500.00 * USD_TO_INR,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETH-PERP',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 3450.00 * USD_TO_INR,
    markPrice: 3420.00 * USD_TO_INR,
    liquidationPrice: 3795.00 * USD_TO_INR,
    unrealizedPnL: 60.00 * USD_TO_INR,
    mtmPnl: 18.00 * USD_TO_INR,
    margin: 690.00 * USD_TO_INR,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOL-PERP',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 168.00 * USD_TO_INR,
    markPrice: 170.50 * USD_TO_INR,
    unrealizedPnL: 25.00 * USD_TO_INR,
    mtmPnl: 7.50 * USD_TO_INR,
    margin: 168.00 * USD_TO_INR,
    leverage: 10,
  },
];

export const mockRealCryptoFutures: CryptoFuturePosition[] = [
    {
      id: 'cf-real1',
      symbol: 'BTC-PERP',
      positionSide: 'SHORT',
      quantity: 0.05,
      entryPrice: 65200.00 * USD_TO_INR,
      markPrice: 65150.00 * USD_TO_INR,
      liquidationPrice: 68460.00 * USD_TO_INR,
      unrealizedPnL: 2.50 * USD_TO_INR,
      mtmPnl: 0.75 * USD_TO_INR,
      margin: 163.00 * USD_TO_INR,
      leverage: 20,
    },
    {
      id: 'cf-real2',
      symbol: 'BNB-PERP',
      positionSide: 'LONG',
      quantity: 5,
      entryPrice: 578.00 * USD_TO_INR,
      markPrice: 580.00 * USD_TO_INR,
      liquidationPrice: 520.20 * USD_TO_INR,
      unrealizedPnL: 10.00 * USD_TO_INR,
      mtmPnl: 3.00 * USD_TO_INR,
      margin: 289.00 * USD_TO_INR,
      leverage: 10,
    }
];
