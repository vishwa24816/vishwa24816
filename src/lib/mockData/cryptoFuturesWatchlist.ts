
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockCryptoFuturesForWatchlist: Stock[] = [
  { 
    id: 'btcinrperp', symbol: 'BTCINR.P', name: 'Bitcoin Perpetual (INR)', 
    price: 2401500.00, change: 1500.00, changePercent: 0.06, 
    exchange: 'Crypto Futures',
    todayLow: 2380000.00, todayHigh: 2420000.00, fiftyTwoWeekLow: 1300000.00, fiftyTwoWeekHigh: 3500000.00,
    openPrice: 2400000.00, prevClosePrice: 2400000.00, 
    volume: 52000, lotSize: 1,
    aboutCompany: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  { 
    id: 'ethinrperp', symbol: 'ETHINR.P', name: 'Ethereum Perpetual (INR)', 
    price: 150100.00, change: -100.00, changePercent: -0.07, 
    exchange: 'Crypto Futures',
    todayLow: 149000.00, todayHigh: 151000.00, fiftyTwoWeekLow: 80000.00, fiftyTwoWeekHigh: 250000.00,
    openPrice: 150200.00, prevClosePrice: 150200.00, 
    volume: 155000, lotSize: 1,
    aboutCompany: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
  },
  { 
    id: 'bnbinrperp', symbol: 'BNBINR.P', name: 'BNB Perpetual (INR)', 
    price: 20020.00, change: 20.00, changePercent: 0.10, 
    exchange: 'Crypto Futures',
    todayLow: 19800.00, todayHigh: 20200.00, fiftyTwoWeekLow: 15000.00, fiftyTwoWeekHigh: 30000.00,
    openPrice: 20000.00, prevClosePrice: 20000.00, 
    volume: 210000, lotSize: 1,
  },
  { 
    id: 'solinrperp', symbol: 'SOLINR.P', name: 'Solana Perpetual (INR)', 
    price: 1666.50, change: 1.50, changePercent: 0.09, 
    exchange: 'Crypto Futures',
    todayLow: 1650.00, todayHigh: 1680.00, fiftyTwoWeekLow: 1000.00, fiftyTwoWeekHigh: 10000.00,
    openPrice: 1665.00, prevClosePrice: 1665.00, 
    volume: 310000, lotSize: 1,
  },
  { 
    id: 'adainrperp', symbol: 'ADAINR.P', name: 'Cardano Perpetual (INR)', 
    price: 21.68, change: 0.03, changePercent: 0.14, 
    exchange: 'Crypto Futures',
    todayLow: 21.50, todayHigh: 22.00, fiftyTwoWeekLow: 15.00, fiftyTwoWeekHigh: 40.00,
    openPrice: 21.65, prevClosePrice: 21.65, 
    volume: 5100000, lotSize: 1,
  },
  { 
    id: 'dogeinrperp', symbol: 'DOGEINR.P', name: 'Dogecoin Perpetual (INR)', 
    price: 5.16, change: 0.01, changePercent: 0.19, 
    exchange: 'Crypto Futures',
    todayLow: 5.10, todayHigh: 5.25, fiftyTwoWeekLow: 4.00, fiftyTwoWeekHigh: 10.00,
    openPrice: 5.15, prevClosePrice: 5.15, 
    volume: 11000000, lotSize: 1,
  },
];
