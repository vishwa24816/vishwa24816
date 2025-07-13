
import type { Stock } from '@/types'; // Using Stock type for watchlist compatibility

export const mockMutualFunds: Stock[] = [
  { 
    id: 'mf1', 
    symbol: 'PARAGPARIKH', 
    name: 'Parag Parikh Flexi Cap Fund Direct-Growth', 
    price: 65.78, 
    change: 0.15, 
    changePercent: 0.23, 
    exchange: 'MF', 
    sector: 'Flexi Cap', 
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 21.5,
    navDate: '20-Jun-2025',
    rating: '5',
    minSipAmount: 1000,
    fundSize: '₹66,422 Cr',
    holdingsCount: 40,
    aboutCompany: 'An open-ended dynamic equity scheme investing across large cap, mid cap, small cap stocks. The fund also invests in foreign equities to provide geographical diversification.',
    topHoldings: [
        { name: 'HDFC Bank Ltd.', percentage: 7.50 },
        { name: 'ITC Ltd.', percentage: 6.80 },
        { name: 'Alphabet Inc.', percentage: 6.50 },
        { name: 'Axis Bank Ltd.', percentage: 5.40 },
        { name: 'Microsoft Corporation', percentage: 5.10 },
    ],
    marketTrends: {
        shortTerm: 'Positive',
        longTerm: 'Positive',
        analystRating: '4.8/5'
    },
    pros: [
        'Diversified across domestic and international stocks.',
        'Consistent long-term performance track record.',
        'Experienced fund management team.'
    ],
    cons: [
        'High exposure to foreign equities can be volatile due to currency fluctuations.',
        'Expense ratio is slightly higher than peers.'
    ],
    fundManagement: {
      managerName: 'Rajeev Thakkar',
      managerBio: 'Rajeev Thakkar has over 20 years of experience in various areas of capital markets such as investment banking, corporate finance, and securities broking. He has been instrumental in steering the fund house with his sharp investment acumen.',
      managerAvatarUrl: 'https://placehold.co/100x100.png?text=RT',
      fundHouse: 'PPFAS Mutual Fund'
    }
  },
  { 
    id: 'mf2', 
    symbol: 'AXISBLUECHIP', 
    name: 'Axis Bluechip Fund Direct-Growth', 
    price: 52.30, 
    change: -0.05, 
    changePercent: -0.10, 
    exchange: 'MF', 
    sector: 'Large Cap',
    riskLevel: 'High',
    category: 'Equity',
    annualisedReturn: 15.2,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 500,
    fundSize: '₹31,521 Cr',
    aboutCompany: 'A large-cap equity fund that aims to generate long-term capital appreciation by investing in a diversified portfolio of predominantly large-cap stocks.'
  },
  { 
    id: 'mf3', 
    symbol: 'MIRAEELSS', 
    name: 'Mirae Asset ELSS Tax Saver Fund Direct-Growth', 
    price: 35.12, 
    change: 0.20, 
    changePercent: 0.57, 
    exchange: 'MF', 
    sector: 'ELSS',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 18.9,
    navDate: '20-Jun-2025',
    rating: '5',
    minSipAmount: 500,
    fundSize: '₹14,334 Cr'
  },
  { 
    id: 'mf4', 
    symbol: 'UTINIFTY50', 
    name: 'UTI Nifty 50 Index Fund Direct-Growth', 
    price: 140.50, 
    change: 0.30, 
    changePercent: 0.21, 
    exchange: 'MF', 
    sector: 'Index Fund',
    riskLevel: 'High',
    category: 'Equity',
    annualisedReturn: 14.5,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 500,
    fundSize: '₹10,567 Cr'
  },
  { 
    id: 'mf5', 
    symbol: 'SBISMCAP', 
    name: 'SBI Small Cap Fund Direct-Growth', 
    price: 130.25, 
    change: 1.10, 
    changePercent: 0.85, 
    exchange: 'MF', 
    sector: 'Small Cap',
    riskLevel: 'Very High',
    category: 'Equity',
    annualisedReturn: 25.8,
    navDate: '20-Jun-2025',
    rating: '4',
    minSipAmount: 500,
    fundSize: '₹18,344 Cr'
  },
];
