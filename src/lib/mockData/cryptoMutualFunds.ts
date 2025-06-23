
import type { Stock } from '@/types';

export const mockCryptoMutualFunds: Stock[] = [
  { 
    id: 'cmf1', 
    symbol: 'CRYPINNO', 
    name: 'Crypto Innovators Fund Direct-Growth', 
    price: 25.50, // This represents NAV for MFs
    change: 0.75, 
    changePercent: 3.03, 
    exchange: 'Crypto MF', 
    sector: 'Thematic', 
    riskLevel: 'Very High',
    category: 'Thematic',
    annualisedReturn: 40.57,
    navDate: '20-Jun-2025',
    rating: 'NA',
    minSipAmount: 500,
    fundSize: '5,258 Cr',
    holdingsCount: 26,
    aboutCompany: 'An open-ended thematic mutual fund scheme investing in a diversified portfolio of companies that are participating in and benefiting from the crypto and blockchain innovation ecosystem.',
    topHoldings: [
        { name: 'Bitcoin (BTC)', percentage: 25.50 },
        { name: 'Ethereum (ETH)', percentage: 20.20 },
        { name: 'Solana (SOL)', percentage: 15.80 },
        { name: 'Render (RNDR)', percentage: 10.10 },
        { name: 'Fetch.ai (FET)', percentage: 8.40 },
    ],
    marketTrends: {
        shortTerm: 'Positive',
        longTerm: 'Positive',
        analystRating: '4.2/5'
    },
    pros: [
        'Diversified across major crypto assets.',
        'Exposure to innovative blockchain projects.',
        'Managed by experienced crypto analysts.'
    ],
    cons: [
        'High volatility inherent to the crypto market.',
        'Regulatory uncertainty remains a risk.',
        'Expense ratio is higher than traditional ETFs.'
    ]
  },
  { 
    id: 'cmf2', 
    symbol: 'DEFIADV', 
    name: 'DeFi Advantage Fund Direct-Growth', 
    price: 18.20, 
    change: -0.15, 
    changePercent: -0.82, 
    exchange: 'Crypto MF', 
    sector: 'DeFi',
    riskLevel: 'Very High',
    category: 'Sectoral',
    annualisedReturn: 25.10,
    navDate: '20-Jun-2025',
    rating: 'NA',
    minSipAmount: 1000,
    fundSize: '2,100 Cr',
    holdingsCount: 18,
    aboutCompany: 'An open-ended sectoral mutual fund scheme investing in a diversified portfolio of decentralized finance (DeFi) protocols and applications on various blockchains.',
    topHoldings: [
        { name: 'Uniswap (UNI)', percentage: 22.50 },
        { name: 'Aave (AAVE)', percentage: 18.75 },
        { name: 'Lido DAO (LDO)', percentage: 15.30 },
        { name: 'Chainlink (LINK)', percentage: 12.10 },
        { name: 'Maker (MKR)', percentage: 9.80 },
    ],
    marketTrends: {
        shortTerm: 'Neutral',
        longTerm: 'Positive',
        analystRating: '3.8/5'
    },
    pros: [
        'Focused exposure to the high-growth DeFi sector.',
        'Potential for significant returns.',
        'Actively managed to navigate DeFi risks.'
    ],
    cons: [
        'Extremely high risk and volatility.',
        'Vulnerable to smart contract exploits and hacks.',
        'Liquidity can be a concern for some underlying assets.'
    ]
  },
  { 
    id: 'cmf3', 
    symbol: 'BLOCKCHAINPL', 
    name: 'Blockchain Plus Fund Direct-Growth', 
    price: 32.80, 
    change: 1.10, 
    changePercent: 3.46, 
    exchange: 'Crypto MF', 
    sector: 'Infrastructure',
    riskLevel: 'High',
    category: 'Thematic',
    annualisedReturn: 35.20,
    navDate: '20-Jun-2025',
    rating: 'NA',
    minSipAmount: 500,
    fundSize: '8,500 Cr',
    holdingsCount: 35,
    aboutCompany: 'An open-ended thematic mutual fund scheme investing in companies providing blockchain infrastructure, including layer-1s, layer-2s, and interoperability solutions.',
     topHoldings: [
        { name: 'Ethereum (ETH)', percentage: 30.10 },
        { name: 'Cardano (ADA)', percentage: 15.50 },
        { name: 'Polkadot (DOT)', percentage: 12.80 },
        { name: 'Cosmos (ATOM)', percentage: 10.20 },
        { name: 'Avalanche (AVAX)', percentage: 8.90 },
    ],
    marketTrends: {
        shortTerm: 'Positive',
        longTerm: 'Very Positive',
        analystRating: '4.5/5'
    },
    pros: [
        'Invests in the fundamental building blocks of Web3.',
        'Less volatile than investing in single applications.',
        'Strong long-term growth potential.'
    ],
    cons: [
        'Success is tied to broader blockchain adoption.',
        'Competition among layer-1 protocols is fierce.',
        'Complex technology to evaluate.'
    ]
  },
];
