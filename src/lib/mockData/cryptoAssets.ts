
import type { Stock } from '@/types';
import { mockWeb3AI } from './web3AI';
import { mockWeb3DeFi } from './web3DeFi';
import { mockWeb3Trending } from './web3Trending';
import { mockWeb3Memes } from './web3Memes';

// Approx conversion rate: 1 USD = 80 INR
const USD_TO_INR = 80;

const baseCryptoAssets: Stock[] = [
  { 
    id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 65000.00 * USD_TO_INR, change: 1200.50 * USD_TO_INR, changePercent: 1.88, exchange: 'Crypto', 
    todayLow: 64500.00 * USD_TO_INR, todayHigh: 66000.00 * USD_TO_INR, fiftyTwoWeekLow: 25000.00 * USD_TO_INR, fiftyTwoWeekHigh: 73000.00 * USD_TO_INR,
    openPrice: 64800.00 * USD_TO_INR, prevClosePrice: 63799.50 * USD_TO_INR, volume: 30000, marketCap: '₹102.4T',
    aboutCompany: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.',
    fundamentals: {
        marketCap: '₹102.4T',
        technology: 'Utilizes Proof-of-Work (PoW) consensus',
        introductionYear: 2009,
        techScoreIndicator: 88.2,
        safetyScore: 90.0,
        marketRank: 1,
        sixMonthReturn: 47.81,
    }
  },
  { 
    id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3400.00 * USD_TO_INR, change: -50.20 * USD_TO_INR, changePercent: -1.45, exchange: 'Crypto',
    todayLow: 3380.00 * USD_TO_INR, todayHigh: 3480.00 * USD_TO_INR, fiftyTwoWeekLow: 1500.00 * USD_TO_INR, fiftyTwoWeekHigh: 4800.00 * USD_TO_INR,
    openPrice: 3450.20 * USD_TO_INR, prevClosePrice: 3450.20 * USD_TO_INR, volume: 500000, marketCap: '₹32.6T',
    aboutCompany: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
  },
  { 
    id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00 * USD_TO_INR, change: 0.00, changePercent: 0.00, exchange: 'Crypto',
    todayLow: 0.99 * USD_TO_INR, todayHigh: 1.01 * USD_TO_INR, fiftyTwoWeekLow: 0.98 * USD_TO_INR, fiftyTwoWeekHigh: 1.02 * USD_TO_INR,
    openPrice: 1.00 * USD_TO_INR, prevClosePrice: 1.00 * USD_TO_INR, volume: 50000000, marketCap: '₹8.8T',
    aboutCompany: 'Tether (USDT) is a stablecoin, a type of cryptocurrency which aims to keep its valuation stable. It is pegged to the U.S. dollar, which means it maintains a value of approximately $1.00.'
  },
  { 
    id: 'bnb', symbol: 'BNB', name: 'BNB', price: 580.00 * USD_TO_INR, change: 5.10 * USD_TO_INR, changePercent: 0.89, exchange: 'Crypto',
    todayLow: 575.00 * USD_TO_INR, todayHigh: 590.00 * USD_TO_INR, fiftyTwoWeekLow: 200.00 * USD_TO_INR, fiftyTwoWeekHigh: 700.00 * USD_TO_INR,
    openPrice: 574.90 * USD_TO_INR, prevClosePrice: 574.90 * USD_TO_INR, volume: 1500000, marketCap: '₹6.8T',
    aboutCompany: 'BNB is the native cryptocurrency of the BNB Chain ecosystem, which includes the BNB Beacon Chain and the BNB Smart Chain. It is used for paying transaction fees, participating in token sales, and more.'
  },
  { 
    id: 'xrp', symbol: 'XRP', name: 'XRP', price: 0.48 * USD_TO_INR, change: 0.01 * USD_TO_INR, changePercent: 2.13, exchange: 'Crypto',
    todayLow: 0.47 * USD_TO_INR, todayHigh: 0.49 * USD_TO_INR, fiftyTwoWeekLow: 0.30 * USD_TO_INR, fiftyTwoWeekHigh: 0.90 * USD_TO_INR,
    openPrice: 0.47 * USD_TO_INR, prevClosePrice: 0.47 * USD_TO_INR, volume: 100000000, marketCap: '₹2.1T',
    aboutCompany: 'XRP is the native cryptocurrency for products developed by Ripple Labs Inc. Its products are used for payment settlement, asset exchange, and remittance systems that work more like SWIFT, a service for international money and security transfers.'
  },
  { 
    id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00 * USD_TO_INR, change: 0.00, changePercent: 0.00, exchange: 'Crypto',
    todayLow: 0.99 * USD_TO_INR, todayHigh: 1.01 * USD_TO_INR, fiftyTwoWeekLow: 0.98 * USD_TO_INR, fiftyTwoWeekHigh: 1.02 * USD_TO_INR,
    openPrice: 1.00 * USD_TO_INR, prevClosePrice: 1.00 * USD_TO_INR, volume: 80000000, marketCap: '₹2.6T',
    aboutCompany: 'USD Coin (USDC) is a stablecoin that is pegged to the U.S. dollar on a 1:1 basis. It is managed by a consortium called Centre, which was founded by Circle and includes members from the cryptocurrency exchange Coinbase.'
  },
  { 
    id: 'ada', symbol: 'ADA', name: 'Cardano', price: 0.45 * USD_TO_INR, change: -0.01 * USD_TO_INR, changePercent: -2.17, exchange: 'Crypto',
    todayLow: 0.44 * USD_TO_INR, todayHigh: 0.46 * USD_TO_INR, fiftyTwoWeekLow: 0.23 * USD_TO_INR, fiftyTwoWeekHigh: 0.80 * USD_TO_INR,
    openPrice: 0.46 * USD_TO_INR, prevClosePrice: 0.46 * USD_TO_INR, volume: 50000000, marketCap: '₹1.3T',
    aboutCompany: 'Cardano is a proof-of-stake blockchain platform that says its goal is to allow “changemakers, innovators and visionaries” to bring about positive global change. The open-source project also aims to “redistribute power from unaccountable structures to the margins to individuals”.'
  },
  { 
    id: 'doge', symbol: 'DOGE', name: 'Dogecoin', price: 0.16 * USD_TO_INR, change: 0.005 * USD_TO_INR, changePercent: 3.23, exchange: 'Crypto',
    todayLow: 0.15 * USD_TO_INR, todayHigh: 0.17 * USD_TO_INR, fiftyTwoWeekLow: 0.05 * USD_TO_INR, fiftyTwoWeekHigh: 0.22 * USD_TO_INR,
    openPrice: 0.155 * USD_TO_INR, prevClosePrice: 0.155 * USD_TO_INR, volume: 120000000, marketCap: '₹1.8T',
    aboutCompany: 'Dogecoin is a cryptocurrency created by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system as a "joke," taking aim at the wild speculation in cryptocurrencies at the time.'
  },
  { 
    id: 'sol', symbol: 'SOL', name: 'Solana', price: 170.00 * USD_TO_INR, change: 8.50 * USD_TO_INR, changePercent: 5.26, exchange: 'Crypto',
    todayLow: 165.00 * USD_TO_INR, todayHigh: 175.00 * USD_TO_INR, fiftyTwoWeekLow: 18.00 * USD_TO_INR, fiftyTwoWeekHigh: 260.00 * USD_TO_INR,
    openPrice: 161.50 * USD_TO_INR, prevClosePrice: 161.50 * USD_TO_INR, volume: 2000000, marketCap: '₹6.1T',
    aboutCompany: 'Solana is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions. It aims to improve scalability by introducing a proof-of-history (PoH) consensus combined with the underlying proof-of-stake (PoS) consensus of the blockchain.'
  },
  { 
    id: 'trx', symbol: 'TRX', name: 'TRON', price: 0.12 * USD_TO_INR, change: 0.003 * USD_TO_INR, changePercent: 2.56, exchange: 'Crypto',
    todayLow: 0.117 * USD_TO_INR, todayHigh: 0.122 * USD_TO_INR, fiftyTwoWeekLow: 0.06 * USD_TO_INR, fiftyTwoWeekHigh: 0.15 * USD_TO_INR,
    openPrice: 0.117 * USD_TO_INR, prevClosePrice: 0.117 * USD_TO_INR, volume: 90000000, marketCap: '₹0.8T',
  },
  {
    id: 'shib', symbol: 'SHIB', name: 'Shiba Inu', price: 0.000028 * USD_TO_INR, change: 0.000001 * USD_TO_INR, changePercent: 3.70, exchange: 'Crypto',
    todayLow: 0.000027 * USD_TO_INR, todayHigh: 0.000029 * USD_TO_INR, fiftyTwoWeekLow: 0.000006 * USD_TO_INR, fiftyTwoWeekHigh: 0.000045 * USD_TO_INR,
    openPrice: 0.000027 * USD_TO_INR, prevClosePrice: 0.000027 * USD_TO_INR, volume: 500000000000, marketCap: '₹1.3T'
  },
  {
    id: 'avax', symbol: 'AVAX', name: 'Avalanche', price: 38.50 * USD_TO_INR, change: -1.20 * USD_TO_INR, changePercent: -3.03, exchange: 'Crypto',
    todayLow: 38.00 * USD_TO_INR, todayHigh: 40.00 * USD_TO_INR, fiftyTwoWeekLow: 9.00 * USD_TO_INR, fiftyTwoWeekHigh: 65.00 * USD_TO_INR,
    openPrice: 39.70 * USD_TO_INR, prevClosePrice: 39.70 * USD_TO_INR, volume: 800000, marketCap: '₹1.1T'
  },
  {
    id: 'dot', symbol: 'DOT', name: 'Polkadot', price: 7.20 * USD_TO_INR, change: 0.15 * USD_TO_INR, changePercent: 2.13, exchange: 'Crypto',
    todayLow: 7.00 * USD_TO_INR, todayHigh: 7.30 * USD_TO_INR, fiftyTwoWeekLow: 3.60 * USD_TO_INR, fiftyTwoWeekHigh: 11.80 * USD_TO_INR,
    openPrice: 7.05 * USD_TO_INR, prevClosePrice: 7.05 * USD_TO_INR, volume: 4000000, marketCap: '₹0.7T'
  },
  {
    id: 'link', symbol: 'LINK', name: 'Chainlink', price: 18.20 * USD_TO_INR, change: 0.82 * USD_TO_INR, changePercent: 4.71, exchange: 'Crypto',
    todayLow: 17.50 * USD_TO_INR, todayHigh: 18.50 * USD_TO_INR, fiftyTwoWeekLow: 5.00 * USD_TO_INR, fiftyTwoWeekHigh: 22.00 * USD_TO_INR,
    openPrice: 17.38 * USD_TO_INR, prevClosePrice: 17.38 * USD_TO_INR, volume: 3000000, marketCap: '₹0.8T'
  },
  {
    id: 'matic', symbol: 'MATIC', name: 'Polygon', price: 0.72 * USD_TO_INR, change: 0.02 * USD_TO_INR, changePercent: 2.86, exchange: 'Crypto',
    todayLow: 0.70 * USD_TO_INR, todayHigh: 0.73 * USD_TO_INR, fiftyTwoWeekLow: 0.50 * USD_TO_INR, fiftyTwoWeekHigh: 1.50 * USD_TO_INR,
    openPrice: 0.70 * USD_TO_INR, prevClosePrice: 0.70 * USD_TO_INR, volume: 60000000, marketCap: '₹0.5T'
  },
  {
    id: 'icp', symbol: 'ICP', name: 'Internet Computer', price: 12.80 * USD_TO_INR, change: -0.30 * USD_TO_INR, changePercent: -2.29, exchange: 'Crypto',
    todayLow: 12.50 * USD_TO_INR, todayHigh: 13.20 * USD_TO_INR, fiftyTwoWeekLow: 2.80 * USD_TO_INR, fiftyTwoWeekHigh: 20.00 * USD_TO_INR,
    openPrice: 13.10 * USD_TO_INR, prevClosePrice: 13.10 * USD_TO_INR, volume: 2000000, marketCap: '₹0.4T'
  },
  {
    id: 'uni', symbol: 'UNI', name: 'Uniswap', price: 11.50 * USD_TO_INR, change: 0.80 * USD_TO_INR, changePercent: 7.48, exchange: 'Crypto',
    todayLow: 10.50 * USD_TO_INR, todayHigh: 11.60 * USD_TO_INR, fiftyTwoWeekLow: 3.80 * USD_TO_INR, fiftyTwoWeekHigh: 15.00 * USD_TO_INR,
    openPrice: 10.70 * USD_TO_INR, prevClosePrice: 10.70 * USD_TO_INR, volume: 5000000, marketCap: '₹0.7T'
  },
  {
    id: 'ltc', symbol: 'LTC', name: 'Litecoin', price: 85.20 * USD_TO_INR, change: 1.50 * USD_TO_INR, changePercent: 1.79, exchange: 'Crypto',
    todayLow: 83.50 * USD_TO_INR, todayHigh: 86.00 * USD_TO_INR, fiftyTwoWeekLow: 55.00 * USD_TO_INR, fiftyTwoWeekHigh: 115.00 * USD_TO_INR,
    openPrice: 83.70 * USD_TO_INR, prevClosePrice: 83.70 * USD_TO_INR, volume: 1000000, marketCap: '₹0.5T'
  },
  {
    id: 'bch', symbol: 'BCH', name: 'Bitcoin Cash', price: 480.50 * USD_TO_INR, change: 10.20 * USD_TO_INR, changePercent: 2.17, exchange: 'Crypto',
    todayLow: 470.00 * USD_TO_INR, todayHigh: 485.00 * USD_TO_INR, fiftyTwoWeekLow: 180.00 * USD_TO_INR, fiftyTwoWeekHigh: 520.00 * USD_TO_INR,
    openPrice: 470.30 * USD_TO_INR, prevClosePrice: 470.30 * USD_TO_INR, volume: 500000, marketCap: '₹0.7T'
  },
  {
    id: 'near', symbol: 'NEAR', name: 'NEAR Protocol', price: 7.80 * USD_TO_INR, change: -0.10 * USD_TO_INR, changePercent: -1.27, exchange: 'Crypto',
    todayLow: 7.60 * USD_TO_INR, todayHigh: 8.00 * USD_TO_INR, fiftyTwoWeekLow: 1.00 * USD_TO_INR, fiftyTwoWeekHigh: 9.00 * USD_TO_INR,
    openPrice: 7.90 * USD_TO_INR, prevClosePrice: 7.90 * USD_TO_INR, volume: 3000000, marketCap: '₹0.6T'
  }
];

export const mockCryptoAssets: Stock[] = [
  ...baseCryptoAssets,
  ...mockWeb3AI,
  ...mockWeb3DeFi,
  ...mockWeb3Trending,
  ...mockWeb3Memes
];
