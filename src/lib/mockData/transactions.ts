
import type { Transaction } from '@/types';

export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    description: 'Sent BTC',
    amount: 0.05 * 5200000,
    type: 'DEBIT',
    asset: 'BTC',
  },
  {
    id: 'tx2',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    description: 'Received ETH',
    amount: 1.2 * 285000,
    type: 'CREDIT',
    asset: 'ETH',
  },
  {
    id: 'tx3',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Swapped SOL for USDC',
    amount: 0,
    type: 'NEUTRAL',
    asset: 'SOL',
  },
  {
    id: 'tx4',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Sent USDT',
    amount: -1000 * 80,
    type: 'DEBIT',
    asset: 'USDT',
  },
  {
    id: 'tx5',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Received BTC',
    amount: 0.01 * 5200000,
    type: 'CREDIT',
    asset: 'BTC',
  },
];

    