
import type { Stock } from '@/types';

export const mockCryptoAssets: Stock[] = [
  { 
    id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 65000.00, change: 1200.50, changePercent: 1.88, exchange: 'Crypto', 
    todayLow: 64500.00, todayHigh: 66000.00, fiftyTwoWeekLow: 25000.00, fiftyTwoWeekHigh: 73000.00,
    openPrice: 64800.00, prevClosePrice: 63799.50, volume: 30000, marketCap: '$1.28T',
    aboutCompany: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  { 
    id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 3400.00, change: -50.20, changePercent: -1.45, exchange: 'Crypto',
    todayLow: 3380.00, todayHigh: 3480.00, fiftyTwoWeekLow: 1500.00, fiftyTwoWeekHigh: 4800.00,
    openPrice: 3450.20, prevClosePrice: 3450.20, volume: 500000, marketCap: '$408B',
    aboutCompany: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
  },
  { 
    id: 'usdt', symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.00, changePercent: 0.00, exchange: 'Crypto',
    todayLow: 0.99, todayHigh: 1.01, fiftyTwoWeekLow: 0.98, fiftyTwoWeekHigh: 1.02,
    openPrice: 1.00, prevClosePrice: 1.00, volume: 50000000, marketCap: '$110B',
    aboutCompany: 'Tether (USDT) is a stablecoin, a type of cryptocurrency which aims to keep its valuation stable. It is pegged to the U.S. dollar, which means it maintains a value of approximately $1.00.'
  },
  { 
    id: 'bnb', symbol: 'BNB', name: 'BNB', price: 580.00, change: 5.10, changePercent: 0.89, exchange: 'Crypto',
    todayLow: 575.00, todayHigh: 590.00, fiftyTwoWeekLow: 200.00, fiftyTwoWeekHigh: 700.00,
    openPrice: 574.90, prevClosePrice: 574.90, volume: 1500000, marketCap: '$85B',
    aboutCompany: 'BNB is the native cryptocurrency of the BNB Chain ecosystem, which includes the BNB Beacon Chain and the BNB Smart Chain. It is used for paying transaction fees, participating in token sales, and more.'
  },
  { 
    id: 'xrp', symbol: 'XRP', name: 'XRP', price: 0.48, change: 0.01, changePercent: 2.13, exchange: 'Crypto',
    todayLow: 0.47, todayHigh: 0.49, fiftyTwoWeekLow: 0.30, fiftyTwoWeekHigh: 0.90,
    openPrice: 0.47, prevClosePrice: 0.47, volume: 100000000, marketCap: '$26B',
    aboutCompany: 'XRP is the native cryptocurrency for products developed by Ripple Labs Inc. Its products are used for payment settlement, asset exchange, and remittance systems that work more like SWIFT, a service for international money and security transfers.'
  },
  { 
    id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 1.00, change: 0.00, changePercent: 0.00, exchange: 'Crypto',
    todayLow: 0.99, todayHigh: 1.01, fiftyTwoWeekLow: 0.98, fiftyTwoWeekHigh: 1.02,
    openPrice: 1.00, prevClosePrice: 1.00, volume: 80000000, marketCap: '$33B',
    aboutCompany: 'USD Coin (USDC) is a stablecoin that is pegged to the U.S. dollar on a 1:1 basis. It is managed by a consortium called Centre, which was founded by Circle and includes members from the cryptocurrency exchange Coinbase.'
  },
  { 
    id: 'ada', symbol: 'ADA', name: 'Cardano', price: 0.45, change: -0.01, changePercent: -2.17, exchange: 'Crypto',
    todayLow: 0.44, todayHigh: 0.46, fiftyTwoWeekLow: 0.23, fiftyTwoWeekHigh: 0.80,
    openPrice: 0.46, prevClosePrice: 0.46, volume: 50000000, marketCap: '$16B',
    aboutCompany: 'Cardano is a proof-of-stake blockchain platform that says its goal is to allow “changemakers, innovators and visionaries” to bring about positive global change. The open-source project also aims to “redistribute power from unaccountable structures to the margins to individuals”.'
  },
  { 
    id: 'doge', symbol: 'DOGE', name: 'Dogecoin', price: 0.16, change: 0.005, changePercent: 3.23, exchange: 'Crypto',
    todayLow: 0.15, todayHigh: 0.17, fiftyTwoWeekLow: 0.05, fiftyTwoWeekHigh: 0.22,
    openPrice: 0.155, prevClosePrice: 0.155, volume: 120000000, marketCap: '$23B',
    aboutCompany: 'Dogecoin is a cryptocurrency created by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system as a "joke," taking aim at the wild speculation in cryptocurrencies at the time.'
  },
  { 
    id: 'sol', symbol: 'SOL', name: 'Solana', price: 170.00, change: 8.50, changePercent: 5.26, exchange: 'Crypto',
    todayLow: 165.00, todayHigh: 175.00, fiftyTwoWeekLow: 18.00, fiftyTwoWeekHigh: 260.00,
    openPrice: 161.50, prevClosePrice: 161.50, volume: 2000000, marketCap: '$76B',
    aboutCompany: 'Solana is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions. It aims to improve scalability by introducing a proof-of-history (PoH) consensus combined with the underlying proof-of-stake (PoS) consensus of the blockchain.'
  },
  { 
    id: 'trx', symbol: 'TRX', name: 'TRON', price: 0.12, change: 0.003, changePercent: 2.56, exchange: 'Crypto',
    todayLow: 0.117, todayHigh: 0.122, fiftyTwoWeekLow: 0.06, fiftyTwoWeekHigh: 0.15,
    openPrice: 0.117, prevClosePrice: 0.117, volume: 90000000, marketCap: '$10B',
    aboutCompany: 'TRON is a decentralized, open-source blockchain-based operating system with smart contract functionality, proof-of-stake principles as its consensus algorithm and a cryptocurrency native to the system, known as Tronix (TRX).'
  },
];
