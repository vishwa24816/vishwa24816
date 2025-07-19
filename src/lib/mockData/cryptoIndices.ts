import type { MarketIndex } from '@/types';

export const mockCryptoIndices: MarketIndex[] = [
  { id: 'defi_index', name: 'DeFi Index', value: 1250.45, change: 35.10, changePercent: 2.89 },
  { id: 'ai_crypto_index', name: 'AI Crypto Index', value: 880.90, change: 75.60, changePercent: 9.38 },
  { id: 'web3_index', name: 'Web3 Index', value: 2100.30, change: -12.50, changePercent: -0.59 },
  { id: 'meme_index', name: 'Meme Coin Index', value: 420.69, change: 69.42, changePercent: 19.75 },
  { id: 'l1_index', name: 'Layer-1 Index', value: 4500.00, change: 150.00, changePercent: 3.45 },
];
