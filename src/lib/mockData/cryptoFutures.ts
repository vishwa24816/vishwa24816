
import type { CryptoFuturePosition } from '@/types';

export const mockCryptoFutures: CryptoFuturePosition[] = [
  {
    id: 'cf1',
    symbol: 'BTCUSDT',
    positionSide: 'LONG',
    quantity: 0.1,
    entryPrice: 42500.00,
    markPrice: 43100.50,
    liquidationPrice: 38000.00,
    unrealizedPnL: (43100.50 - 42500.00) * 0.1,
    margin: 425.00,
    leverage: 10,
  },
  {
    id: 'cf2',
    symbol: 'ETHUSDT',
    positionSide: 'SHORT',
    quantity: 2,
    entryPrice: 2200.00,
    markPrice: 2150.75,
    unrealizedPnL: (2200.00 - 2150.75) * 2,
    margin: 440.00,
    leverage: 10,
  },
  {
    id: 'cf3',
    symbol: 'SOLUSDT',
    positionSide: 'LONG',
    quantity: 10,
    entryPrice: 60.00,
    markPrice: 65.50,
    unrealizedPnL: (65.50 - 60.00) * 10,
    margin: 60.00,
    leverage: 10,
  },
];
