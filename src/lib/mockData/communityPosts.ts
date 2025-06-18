
import type { CommunityPost } from '@/types';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post1',
    user: {
      name: 'Market Maven',
      username: '@MarketMaven123',
      avatarUrl: 'https://placehold.co/40x40.png?text=MM',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    content: 'Reliance Industries (RELIANCE) looking bullish after recent announcements. Expecting a breakout above 2500 levels soon. Strong volume today.',
    imageUrl: 'https://placehold.co/600x400.png',
    imageAiHint: 'company building',
    stockSymbol: 'RELIANCE',
    stockChangePercent: 1.54,
    tags: ['Analysis', 'Bullish', 'Reliance'],
    source: 'User Generated',
    likes: 152,
    comments: 18,
    reposts: 25,
  },
  {
    id: 'post2',
    user: {
      name: 'Crypto King',
      username: '@CryptoKingETH',
      avatarUrl: 'https://placehold.co/40x40.png?text=CK',
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    content: 'Bitcoin (BTC) facing resistance at $31k. Important level to watch. If it breaks, next target $35k. Holding my spot positions for now.',
    stockSymbol: 'BTC',
    stockChangePercent: -0.50,
    tags: ['Crypto', 'Bitcoin', 'Technical Analysis'],
    source: 'User Generated',
    likes: 289,
    comments: 45,
    reposts: 60,
  },
  {
    id: 'post3',
    user: {
      name: 'Nifty Trader',
      username: '@NiftyProTrader',
      avatarUrl: 'https://placehold.co/40x40.png?text=NT',
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    content: 'NIFTY 50 showing signs of consolidation around 21500. Option chain data suggests strong support at 21400 PE and resistance at 21700 CE. #NIFTY #OptionsTrading',
    tags: ['NIFTY', 'Market Update', 'Options'],
    source: 'User Generated',
    likes: 98,
    comments: 12,
    reposts: 10,
  },
  {
    id: 'post4',
    user: {
      name: 'Value Investor',
      username: '@ValueSeeker',
      avatarUrl: 'https://placehold.co/40x40.png?text=VI',
    },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    content: 'Identified a potentially undervalued small-cap stock: XYZ Ltd. Trading at a P/E of 8 with good growth prospects. Doing further research. Not financial advice.',
    imageUrl: 'https://placehold.co/600x300.png',
    imageAiHint: 'stock graph',
    stockSymbol: 'XYZLtd',
    stockChangePercent: 3.20,
    tags: ['SmallCap', 'Value Investing', 'Research'],
    source: 'User Generated',
    likes: 75,
    comments: 22,
    reposts: 5,
  },
  {
    id: 'post5',
    user: {
      name: 'News Hub',
      username: '@MarketNewsBot',
      avatarUrl: 'https://placehold.co/40x40.png?text=NB',
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    content: 'SEBI announces new framework for SME listings. Aims to boost capital formation for small and medium enterprises. Impact on specific stocks to be seen.',
    tags: ['SEBI', 'Regulation', 'Market News'],
    source: 'Aggregated News',
    likes: 110,
    comments: 5,
    reposts: 30,
  },
];
