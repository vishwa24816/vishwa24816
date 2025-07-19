
import type { Stock } from '@/types';

const USD_TO_INR = 80;

export const mockWeb3DeFi: Stock[] = [
  { 
    id: 'w3df_uni', symbol: 'UNI', name: 'Uniswap', price: 11.50 * USD_TO_INR, change: 0.80 * USD_TO_INR, changePercent: 7.48, exchange: 'Crypto',
    aboutCompany: 'Uniswap is a popular decentralized trading protocol, known for its role in facilitating automated trading of decentralized finance (DeFi) tokens.'
  },
  { 
    id: 'w3df_link', symbol: 'LINK', name: 'Chainlink', price: 18.20 * USD_TO_INR, change: 0.82 * USD_TO_INR, changePercent: 4.71, exchange: 'Crypto',
    aboutCompany: 'Chainlink is a decentralized oracle network that provides real-world data to smart contracts on the blockchain.'
  },
  { 
    id: 'w3df_aave', symbol: 'AAVE', name: 'Aave', price: 110.30 * USD_TO_INR, change: 5.40 * USD_TO_INR, changePercent: 5.15, exchange: 'Crypto',
    aboutCompany: 'Aave is a decentralized non-custodial liquidity protocol where users can participate as depositors or borrowers.'
  },
];
