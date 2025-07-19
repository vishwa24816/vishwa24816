import type { Stock } from '@/types';

export const mockWeb3AI: Stock[] = [
  { 
    id: 'w3ai_fet', symbol: 'FET', name: 'Fetch.ai', price: 2.15, change: 0.18, changePercent: 9.13, exchange: 'Crypto',
    aboutCompany: 'Fetch.ai is a decentralized machine learning platform for applications such as asset trading, gig economy work, and energy grid optimization.'
  },
  { 
    id: 'w3ai_agix', symbol: 'AGIX', name: 'SingularityNET', price: 0.95, change: 0.08, changePercent: 9.20, exchange: 'Crypto',
    aboutCompany: 'SingularityNET is a decentralized platform and marketplace for artificial intelligence (AI) services.'
  },
  { 
    id: 'w3ai_ocean', symbol: 'OCEAN', name: 'Ocean Protocol', price: 0.92, change: 0.05, changePercent: 5.71, exchange: 'Crypto',
    aboutCompany: 'Ocean Protocol is a blockchain-based ecosystem that allows individuals and businesses to easily unlock the value of their data and monetize it through the use of ERC-20-based datatokens.'
  },
  {
    id: 'w3ai_rndr', symbol: 'RNDR', name: 'Render Token', price: 10.50, change: 0.85, changePercent: 8.81, exchange: 'Crypto',
    aboutCompany: 'Render Token (RNDR) is a distributed GPU rendering network built on top of the Ethereum blockchain, aiming to connect artists and studios in need of GPU compute power with mining partners willing to rent their GPU capabilities out.'
  },
];
