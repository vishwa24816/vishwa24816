
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockCryptoFuturesForWatchlist: Stock[] = [
  { 
    id: 'btcinrperp', symbol: 'BTCINR.P', name: 'Bitcoin Perpetual (INR)', 
    price: 5201500.00, change: 1500.00, changePercent: 0.03, 
    exchange: 'Crypto Futures',
    todayLow: 5180000.00, todayHigh: 5220000.00, fiftyTwoWeekLow: 2300000.00, fiftyTwoWeekHigh: 6000000.00,
    openPrice: 5200000.00, prevClosePrice: 5200000.00, 
    volume: 5200000000, lotSize: 1, openInterest: 1200000000,
    aboutCompany: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.'
  },
  { 
    id: 'ethinrperp', symbol: 'ETHINR.P', name: 'Ethereum Perpetual (INR)', 
    price: 285100.00, change: -100.00, changePercent: -0.04, 
    exchange: 'Crypto Futures',
    todayLow: 284000.00, todayHigh: 286000.00, fiftyTwoWeekLow: 150000.00, fiftyTwoWeekHigh: 350000.00,
    openPrice: 285200.00, prevClosePrice: 285200.00, 
    volume: 1550000000, lotSize: 1, openInterest: 850000000,
    aboutCompany: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
  },
  { 
    id: 'bnbinrperp', symbol: 'BNBINR.P', name: 'BNB Perpetual (INR)', 
    price: 46420.00, change: 20.00, changePercent: 0.04, 
    exchange: 'Crypto Futures',
    todayLow: 46200.00, todayHigh: 46600.00, fiftyTwoWeekLow: 18000.00, fiftyTwoWeekHigh: 55000.00,
    openPrice: 46400.00, prevClosePrice: 46400.00, 
    volume: 210000000, lotSize: 1, openInterest: 150000000,
  },
  { 
    id: 'solinrperp', symbol: 'SOLINR.P', name: 'Solana Perpetual (INR)', 
    price: 13600.50, change: 1.50, changePercent: 0.01, 
    exchange: 'Crypto Futures',
    todayLow: 13500.00, todayHigh: 13700.00, fiftyTwoWeekLow: 1500.00, fiftyTwoWeekHigh: 21000.00,
    openPrice: 13600.00, prevClosePrice: 13599.00, 
    volume: 310000000, lotSize: 1, openInterest: 180000000,
  },
  { 
    id: 'adainrperp', symbol: 'ADAINR.P', name: 'Cardano Perpetual (INR)', 
    price: 36.68, change: 0.03, changePercent: 0.08, 
    exchange: 'Crypto Futures',
    todayLow: 36.50, todayHigh: 37.00, fiftyTwoWeekLow: 18.00, fiftyTwoWeekHigh: 60.00,
    openPrice: 36.65, prevClosePrice: 36.65, 
    volume: 510000000, lotSize: 1, openInterest: 250000000,
  },
  { 
    id: 'dogeinrperp', symbol: 'DOGEINR.P', name: 'Dogecoin Perpetual (INR)', 
    price: 12.80, change: 0.01, changePercent: 0.08, 
    exchange: 'Crypto Futures',
    todayLow: 12.50, todayHigh: 13.00, fiftyTwoWeekLow: 4.50, fiftyTwoWeekHigh: 18.00,
    openPrice: 12.79, prevClosePrice: 12.79, 
    volume: 1100000000, lotSize: 1, openInterest: 600000000,
  },
];
