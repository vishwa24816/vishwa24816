
import type { Stock } from '@/types';

export const mockCryptoAssets: Stock[] = [
  { 
    id: 'btc', symbol: 'BTC', name: 'Bitcoin', price: 2400000.00, change: 40000.00, changePercent: 1.69, exchange: 'Crypto', 
    todayLow: 2350000.00, todayHigh: 2420000.00, fiftyTwoWeekLow: 1300000.00, fiftyTwoWeekHigh: 3500000.00,
    openPrice: 2360000.00, prevClosePrice: 2360000.00, volume: 5000, marketCap: '46.5T',
    aboutCompany: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  { 
    id: 'eth', symbol: 'ETH', name: 'Ethereum', price: 150000.00, change: -1640.00, changePercent: -1.12, exchange: 'Crypto',
    todayLow: 148000.00, todayHigh: 152000.00, fiftyTwoWeekLow: 80000.00, fiftyTwoWeekHigh: 250000.00,
    openPrice: 151640.00, prevClosePrice: 151640.00, volume: 75000, marketCap: '18.1T',
    aboutCompany: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
  },
  { 
    id: 'usdt', symbol: 'USDT', name: 'Tether', price: 83.15, change: 0.01, changePercent: 0.01, exchange: 'Crypto',
    todayLow: 83.10, todayHigh: 83.20, fiftyTwoWeekLow: 82.00, fiftyTwoWeekHigh: 84.00,
    openPrice: 83.14, prevClosePrice: 83.14, volume: 10000000, marketCap: '7.5T',
    aboutCompany: 'Tether (USDT) is a stablecoin, a type of cryptocurrency which aims to keep its valuation stable. It is pegged to the U.S. dollar, which means it maintains a value of approximately $1.00.'
  },
  { 
    id: 'bnb', symbol: 'BNB', name: 'BNB', price: 20000.00, change: 176.40, changePercent: 0.88, exchange: 'Crypto',
    todayLow: 19800.00, todayHigh: 20200.00, fiftyTwoWeekLow: 15000.00, fiftyTwoWeekHigh: 30000.00,
    openPrice: 19823.60, prevClosePrice: 19823.60, volume: 200000, marketCap: '3.1T',
    aboutCompany: 'BNB is the native cryptocurrency of the BNB Chain ecosystem, which includes the BNB Beacon Chain and the BNB Smart Chain. It is used for paying transaction fees, participating in token sales, and more.'
  },
  { 
    id: 'xrp', symbol: 'XRP', name: 'XRP', price: 39.10, change: 0.83, changePercent: 2.17, exchange: 'Crypto',
    todayLow: 38.00, todayHigh: 40.00, fiftyTwoWeekLow: 25.00, fiftyTwoWeekHigh: 70.00,
    openPrice: 38.27, prevClosePrice: 38.27, volume: 8000000, marketCap: '2.1T',
    aboutCompany: 'XRP is the native cryptocurrency for products developed by Ripple Labs Inc. Its products are used for payment settlement, asset exchange, and remittance systems that work more like SWIFT, a service for international money and security transfers.'
  },
  { 
    id: 'usdc', symbol: 'USDC', name: 'USD Coin', price: 83.16, change: 0.00, changePercent: 0.00, exchange: 'Crypto',
    todayLow: 83.10, todayHigh: 83.20, fiftyTwoWeekLow: 82.00, fiftyTwoWeekHigh: 84.00,
    openPrice: 83.16, prevClosePrice: 83.16, volume: 9000000, marketCap: '2.5T',
    aboutCompany: 'USD Coin (USDC) is a stablecoin that is pegged to the U.S. dollar on a 1:1 basis. It is managed by a consortium called Centre, which was founded by Circle and includes members from the cryptocurrency exchange Coinbase.'
  },
  { 
    id: 'ada', symbol: 'ADA', name: 'Cardano', price: 21.65, change: -0.41, changePercent: -1.88, exchange: 'Crypto',
    todayLow: 21.00, todayHigh: 22.00, fiftyTwoWeekLow: 15.00, fiftyTwoWeekHigh: 40.00,
    openPrice: 22.06, prevClosePrice: 22.06, volume: 6000000, marketCap: '770B',
    aboutCompany: 'Cardano is a proof-of-stake blockchain platform that says its goal is to allow “changemakers, innovators and visionaries” to bring about positive global change. The open-source project also aims to “redistribute power from unaccountable structures to the margins to individuals”.'
  },
  { 
    id: 'doge', symbol: 'DOGE', name: 'Dogecoin', price: 5.15, change: 0.08, changePercent: 1.64, exchange: 'Crypto',
    todayLow: 5.00, todayHigh: 5.25, fiftyTwoWeekLow: 4.00, fiftyTwoWeekHigh: 10.00,
    openPrice: 5.07, prevClosePrice: 5.07, volume: 15000000, marketCap: '730B',
    aboutCompany: 'Dogecoin is a cryptocurrency created by software engineers Billy Markus and Jackson Palmer, who decided to create a payment system as a "joke," taking aim at the wild speculation in cryptocurrencies at the time.'
  },
  { 
    id: 'sol', symbol: 'SOL', name: 'Solana', price: 1665.00, change: 62.25, changePercent: 3.90, exchange: 'Crypto',
    todayLow: 1600.00, todayHigh: 1700.00, fiftyTwoWeekLow: 1000.00, fiftyTwoWeekHigh: 10000.00,
    openPrice: 1602.75, prevClosePrice: 1602.75, volume: 400000, marketCap: '700B',
    aboutCompany: 'Solana is a highly functional open source project that banks on blockchain technology’s permissionless nature to provide decentralized finance (DeFi) solutions. It aims to improve scalability by introducing a proof-of-history (PoH) consensus combined with the underlying proof-of-stake (PoS) consensus of the blockchain.'
  },
  { 
    id: 'trx', symbol: 'TRX', name: 'TRON', price: 6.32, change: 0.17, changePercent: 2.70, exchange: 'Crypto',
    todayLow: 6.10, todayHigh: 6.40, fiftyTwoWeekLow: 4.00, fiftyTwoWeekHigh: 8.00,
    openPrice: 6.15, prevClosePrice: 6.15, volume: 12000000, marketCap: '560B',
    aboutCompany: 'TRON is a decentralized, open-source blockchain-based operating system with smart contract functionality, proof-of-stake principles as its consensus algorithm and a cryptocurrency native to the system, known as Tronix (TRX).'
  },
];
