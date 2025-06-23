
import type { Stock } from '@/types';

const generateFinancialData = (base: number) => [
  { period: 'Mar \'24', value: base * (Math.random() * 0.2 + 0.9) },
  { period: 'Jun \'24', value: base * (Math.random() * 0.2 + 0.85) },
  { period: 'Sep \'24', value: base * (Math.random() * 0.2 + 0.8) },
  { period: 'Dec \'24', value: base * (Math.random() * 0.2 + 0.95) },
  { period: 'Mar \'25', value: base * (Math.random() * 0.2 + 0.92) },
].map(d => ({...d, value: parseFloat(d.value.toFixed(0))}));


export const mockStocks: Stock[] = [
  { 
    id: 'reliance', symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 2450.50, change: 12.75, changePercent: 0.52, exchange: 'NSE', sector: 'Oil & Gas', 
    todayLow: 2430.00, todayHigh: 2460.00, fiftyTwoWeekLow: 2000.00, fiftyTwoWeekHigh: 2800.00, openPrice: 2435.00, prevClosePrice: 2437.75, volume: 5000000,
    lowerCircuit: 2200.50, upperCircuit: 2700.50,
    fundamentals: { marketCap: '16,50,000Cr', peRatioTTM: 25.5, pbRatio: 3.1, industryPe: 20.1, debtToEquity: 0.4, roe: 12.5, epsTTM: 96.0, divYield: 0.5, bookValue: 790, faceValue: 10 },
    financials: { revenue: generateFinancialData(50000), profit: generateFinancialData(8000), netWorth: generateFinancialData(200000) },
    aboutCompany: "Reliance Industries Limited is an Indian multinational conglomerate company, headquartered in Mumbai. It has diverse businesses including energy, petrochemicals, natural gas, retail, telecommunications, mass media, and textiles. Reliance is one of the most profitable companies in India, the largest publicly traded company in India by market capitalisation, and the largest company in India as measured by revenue.",
    shareholdingPattern: [
      {
        period: "Mar '24",
        data: [
          { category: "Promoters", percentage: 50.37 },
          { category: "FIIs", percentage: 22.85 },
          { category: "DIIs", percentage: 16.03 },
          { category: "Public", percentage: 10.75 },
        ],
      },
       {
        period: "Dec '23",
        data: [
          { category: "Promoters", percentage: 50.30 },
          { category: "FIIs", percentage: 23.00 },
          { category: "DIIs", percentage: 15.90 },
          { category: "Public", percentage: 10.80 },
        ],
      }
    ],
    topMutualFundsInvested: [
      { id: 'mf_rel_1', name: "SBI Nifty 50 ETF", assetValue: "₹1,50,000 Cr", schemeType: "Index Fund" },
      { id: 'mf_rel_2', name: "UTI Nifty 50 Index Fund", assetValue: "₹80,000 Cr", schemeType: "Index Fund" },
      { id: 'mf_rel_3', name: "ICICI Prudential Bluechip Fund", assetValue: "₹50,000 Cr", schemeType: "Large Cap" },
    ],
    similarStocks: [
      { id: 'ongc', symbol: 'ONGC', name: 'Oil & Natural Gas Corporation', price: 270.10, changePercent: 1.5, marketCap: "3,40,000Cr" },
      { id: 'ioc', symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', price: 170.50, changePercent: -0.5, marketCap: "2,40,000Cr" },
      { id: 'bpcl', symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', price: 600.70, changePercent: 0.8, marketCap: "1,30,000Cr" },
    ]
  },
  { 
    id: 'tcs', symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 3280.10, change: -5.20, changePercent: -0.16, exchange: 'BSE', sector: 'IT Services', 
    todayLow: 3270.00, todayHigh: 3290.00, fiftyTwoWeekLow: 2800.00, fiftyTwoWeekHigh: 3600.00, openPrice: 3285.00, prevClosePrice: 3285.30, volume: 1200000,
    lowerCircuit: 3000.00, upperCircuit: 3500.00,
    fundamentals: { marketCap: '12,00,000Cr', peRatioTTM: 30.2, pbRatio: 10.5, industryPe: 28.5, debtToEquity: 0.1, roe: 35.2, epsTTM: 108.5, divYield: 1.2, bookValue: 310, faceValue: 1 },
    financials: { revenue: generateFinancialData(20000), profit: generateFinancialData(4000), netWorth: generateFinancialData(50000) },
    aboutCompany: "Tata Consultancy Services is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is a part of the Tata Group and operates in 150 locations across 46 countries.",
    shareholdingPattern: [
        {
            period: "Mar '24",
            data: [
                { category: "Promoters", percentage: 72.30 },
                { category: "FIIs", percentage: 12.80 },
                { category: "DIIs", percentage: 8.50 },
                { category: "Public", percentage: 6.40 },
            ],
        },
    ],
    topMutualFundsInvested: [
      { id: 'mf_tcs_1', name: "ICICI Prudential Technology Fund", assetValue: "₹8,000 Cr", schemeType: "Sectoral" },
      { id: 'mf_tcs_2', name: "Aditya Birla SL Digital India Fund", assetValue: "₹3,500 Cr", schemeType: "Sectoral" },
    ],
    similarStocks: [
      { id: 'infosys_sim', symbol: 'INFY', name: 'Infosys Ltd.', price: 1350.00, changePercent: 1.69, marketCap: "5,60,000Cr" },
      { id: 'wipro_sim', symbol: 'WIPRO', name: 'Wipro Ltd.', price: 410.80, changePercent: 0.76, marketCap: "2,25,000Cr" },
      { id: 'hcltech_sim', symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', price: 1450.00, changePercent: -0.2, marketCap: "3,90,000Cr" },
    ]
  },
  { 
    id: 'hdfcbank', symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 1610.70, change: 8.15, changePercent: 0.51, exchange: 'NSE', sector: 'Banking', 
    todayLow: 1600.00, todayHigh: 1615.00, fiftyTwoWeekLow: 1300.00, fiftyTwoWeekHigh: 1750.00, openPrice: 1602.00, prevClosePrice: 1602.55, volume: 8000000,
    lowerCircuit: 1450.00, upperCircuit: 1770.00,
    fundamentals: { marketCap: '9,00,000Cr', peRatioTTM: 20.3, pbRatio: 3.5, industryPe: 18.5, debtToEquity: 0.2, roe: 15.8, epsTTM: 79.3, divYield: 0.8, bookValue: 460, faceValue: 1 },
    financials: { revenue: generateFinancialData(40000), profit: generateFinancialData(10000), netWorth: generateFinancialData(250000) }
  },
  { 
    id: 'infosys', symbol: 'INFY', name: 'Infosys Ltd.', price: 1350.00, change: 22.50, changePercent: 1.69, exchange: 'NSE', sector: 'IT Services', 
    todayLow: 1325.00, todayHigh: 1355.00, fiftyTwoWeekLow: 1100.00, fiftyTwoWeekHigh: 1600.00, openPrice: 1328.00, prevClosePrice: 1327.50, volume: 3000000,
    lowerCircuit: 1215.00, upperCircuit: 1485.00,
    fundamentals: { marketCap: '5,60,000Cr', peRatioTTM: 24.8, pbRatio: 7.2, industryPe: 28.5, debtToEquity: 0.05, roe: 28.5, epsTTM: 54.4, divYield: 1.5, bookValue: 187.5, faceValue: 5 },
    financials: { revenue: generateFinancialData(15000), profit: generateFinancialData(3000), netWorth: generateFinancialData(80000) }
  },
  { 
    id: 'icicibank', symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 925.30, change: -1.05, changePercent: -0.11, exchange: 'BSE', sector: 'Banking', 
    todayLow: 920.00, todayHigh: 930.00, fiftyTwoWeekLow: 700.00, fiftyTwoWeekHigh: 1000.00, openPrice: 926.00, prevClosePrice: 926.35, volume: 6000000,
    lowerCircuit: 832.77, upperCircuit: 1017.83,
    fundamentals: { marketCap: '6,50,000Cr', peRatioTTM: 18.5, pbRatio: 3.2, industryPe: 18.5, debtToEquity: 0.15, roe: 16.5, epsTTM: 50.0, divYield: 0.6, bookValue: 289.15, faceValue: 2 },
    financials: { revenue: generateFinancialData(30000), profit: generateFinancialData(7000), netWorth: generateFinancialData(180000) }
  },
  { 
    id: 'sbin', symbol: 'SBIN', name: 'State Bank of India', price: 570.80, change: 3.40, changePercent: 0.60, exchange: 'NSE', sector: 'Banking', 
    todayLow: 565.00, todayHigh: 575.00, fiftyTwoWeekLow: 450.00, fiftyTwoWeekHigh: 650.00, openPrice: 567.00, prevClosePrice: 567.40, volume: 10000000,
    lowerCircuit: 513.72, upperCircuit: 627.88,
    fundamentals: { marketCap: '5,09,000Cr', peRatioTTM: 10.2, pbRatio: 1.5, industryPe: 18.5, debtToEquity: 0.1, roe: 14.2, epsTTM: 56.0, divYield: 1.8, bookValue: 380.53, faceValue: 1 },
    financials: { revenue: generateFinancialData(70000), profit: generateFinancialData(15000), netWorth: generateFinancialData(400000) }
  },
  { 
    id: 'bajfinance', symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 7100.20, change: 50.90, changePercent: 0.72, exchange: 'NSE', sector: 'Finance NBFC', 
    todayLow: 7050.00, todayHigh: 7150.00, fiftyTwoWeekLow: 5500.00, fiftyTwoWeekHigh: 8000.00, openPrice: 7050.00, prevClosePrice: 7049.30, volume: 500000,
    lowerCircuit: 6390.18, upperCircuit: 7810.22,
    fundamentals: { marketCap: '4,40,000Cr', peRatioTTM: 35.6, pbRatio: 7.8, industryPe: 25.0, debtToEquity: 3.5, roe: 22.0, epsTTM: 199.44, divYield: 0.3, bookValue: 910.28, faceValue: 2 },
    financials: { revenue: generateFinancialData(10000), profit: generateFinancialData(2000), netWorth: generateFinancialData(60000) }
  },
  { 
    id: 'hul', symbol: 'HUL', name: 'Hindustan Unilever Ltd.', price: 2550.00, change: 10.25, changePercent: 0.40, exchange: 'NSE', sector: 'FMCG', 
    todayLow: 2530.00, todayHigh: 2560.00, fiftyTwoWeekLow: 2200.00, fiftyTwoWeekHigh: 2800.00, openPrice: 2540.00, prevClosePrice: 2539.75, volume: 800000,
    lowerCircuit: 2295.00, upperCircuit: 2805.00,
    fundamentals: { marketCap: '6,00,000Cr', peRatioTTM: 60.5, pbRatio: 12.3, industryPe: 55.0, debtToEquity: 0.01, roe: 20.5, epsTTM: 42.15, divYield: 1.2, bookValue: 207.31, faceValue: 1 },
    financials: { revenue: generateFinancialData(12000), profit: generateFinancialData(2500), netWorth: generateFinancialData(50000) }
  },
  { 
    id: 'lt', symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 2200.75, change: -15.50, changePercent: -0.70, exchange: 'BSE', sector: 'Infrastructure', 
    todayLow: 2190.00, todayHigh: 2220.00, fiftyTwoWeekLow: 1800.00, fiftyTwoWeekHigh: 2500.00, openPrice: 2215.00, prevClosePrice: 2216.25, volume: 700000,
    lowerCircuit: 1980.68, upperCircuit: 2420.82,
    fundamentals: { marketCap: '3,08,000Cr', peRatioTTM: 28.9, pbRatio: 3.8, industryPe: 22.0, debtToEquity: 1.8, roe: 13.1, epsTTM: 76.15, divYield: 1.0, bookValue: 579.14, faceValue: 2 },
    financials: { revenue: generateFinancialData(40000), profit: generateFinancialData(4000), netWorth: generateFinancialData(80000) }
  },
  { 
    id: 'axisbank', symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 950.60, change: 5.10, changePercent: 0.54, exchange: 'NSE', sector: 'Banking', 
    todayLow: 940.00, todayHigh: 955.00, fiftyTwoWeekLow: 750.00, fiftyTwoWeekHigh: 1050.00, openPrice: 945.00, prevClosePrice: 945.50, volume: 4000000,
    lowerCircuit: 855.54, upperCircuit: 1045.66,
    fundamentals: { marketCap: '2,93,000Cr', peRatioTTM: 15.2, pbRatio: 2.1, industryPe: 18.5, debtToEquity: 0.2, roe: 13.8, epsTTM: 62.54, divYield: 0.5, bookValue: 452.67, faceValue: 2 },
    financials: { revenue: generateFinancialData(25000), profit: generateFinancialData(5000), netWorth: generateFinancialData(150000) }
  },
  { 
    id: 'kotakbank', symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', price: 1800.00, change: 12.00, changePercent: 0.67, exchange: 'NSE', sector: 'Banking', 
    todayLow: 1780.00, todayHigh: 1810.00, fiftyTwoWeekLow: 1500.00, fiftyTwoWeekHigh: 2000.00, openPrice: 1790.00, prevClosePrice: 1788.00, volume: 2000000,
    lowerCircuit: 1620.00, upperCircuit: 1980.00,
    fundamentals: { marketCap: '3,57,000Cr', peRatioTTM: 22.1, pbRatio: 3.6, industryPe: 18.5, debtToEquity: 0.1, roe: 16.3, epsTTM: 81.45, divYield: 0.4, bookValue: 500.00, faceValue: 5 },
    financials: { revenue: generateFinancialData(20000), profit: generateFinancialData(4000), netWorth: generateFinancialData(100000) }
  },
  { 
    id: 'itc', symbol: 'ITC', name: 'ITC Ltd.', price: 450.20, change: 2.15, changePercent: 0.48, exchange: 'BSE', sector: 'FMCG Conglomerate', 
    todayLow: 445.00, todayHigh: 455.00, fiftyTwoWeekLow: 350.00, fiftyTwoWeekHigh: 500.00, openPrice: 448.00, prevClosePrice: 448.05, volume: 9000000,
    lowerCircuit: 405.18, upperCircuit: 495.22,
    fundamentals: { marketCap: '5,60,000Cr', peRatioTTM: 25.3, pbRatio: 7.0, industryPe: 55.0, debtToEquity: 0.01, roe: 27.6, epsTTM: 17.80, divYield: 2.8, bookValue: 64.31, faceValue: 1 },
    financials: { revenue: generateFinancialData(18000), profit: generateFinancialData(4500), netWorth: generateFinancialData(80000) }
  },
  { 
    id: 'bhartiairtel', symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 850.75, change: 7.20, changePercent: 0.85, exchange: 'NSE', sector: 'Telecom', 
    todayLow: 840.00, todayHigh: 855.00, fiftyTwoWeekLow: 700.00, fiftyTwoWeekHigh: 950.00, openPrice: 843.00, prevClosePrice: 843.55, volume: 3500000,
    lowerCircuit: 765.68, upperCircuit: 935.82,
    fundamentals: { marketCap: '4,80,000Cr', peRatioTTM: 60.1, pbRatio: 5.5, industryPe: 40.0, debtToEquity: 1.5, roe: 9.1, epsTTM: 14.16, divYield: 0.4, bookValue: 154.68, faceValue: 5 },
    financials: { revenue: generateFinancialData(35000), profit: generateFinancialData(3000), netWorth: generateFinancialData(90000) }
  },
  { 
    id: 'maruti', symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 9500.00, change: -45.10, changePercent: -0.47, exchange: 'NSE', sector: 'Automobile', 
    todayLow: 9450.00, todayHigh: 9550.00, fiftyTwoWeekLow: 8000.00, fiftyTwoWeekHigh: 10500.00, openPrice: 9540.00, prevClosePrice: 9545.10, volume: 300000,
    lowerCircuit: 8550.00, upperCircuit: 10450.00,
    fundamentals: { marketCap: '2,98,000Cr', peRatioTTM: 30.5, pbRatio: 4.2, industryPe: 25.0, debtToEquity: 0.02, roe: 13.8, epsTTM: 311.48, divYield: 0.9, bookValue: 2261.90, faceValue: 5 },
    financials: { revenue: generateFinancialData(25000), profit: generateFinancialData(2000), netWorth: generateFinancialData(70000) }
  },
  { 
    id: 'asianpaint', symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', price: 3100.50, change: 15.25, changePercent: 0.49, exchange: 'BSE', sector: 'Paints', 
    todayLow: 3080.00, todayHigh: 3120.00, fiftyTwoWeekLow: 2500.00, fiftyTwoWeekHigh: 3500.00, openPrice: 3085.00, prevClosePrice: 3085.25, volume: 400000,
    lowerCircuit: 2790.45, upperCircuit: 3410.55,
    fundamentals: { marketCap: '2,97,000Cr', peRatioTTM: 65.2, pbRatio: 15.1, industryPe: 50.0, debtToEquity: 0.1, roe: 23.2, epsTTM: 47.55, divYield: 0.7, bookValue: 205.33, faceValue: 1 },
    financials: { revenue: generateFinancialData(8000), profit: generateFinancialData(1000), netWorth: generateFinancialData(20000) }
  },
  { 
    id: 'wipro', symbol: 'WIPRO', name: 'Wipro Ltd.', price: 410.80, change: 3.10, changePercent: 0.76, exchange: 'NSE', sector: 'IT Services', 
    todayLow: 405.00, todayHigh: 415.00, fiftyTwoWeekLow: 350.00, fiftyTwoWeekHigh: 500.00, openPrice: 407.00, prevClosePrice: 407.70, volume: 2500000,
    lowerCircuit: 369.72, upperCircuit: 451.88,
    fundamentals: { marketCap: '2,25,000Cr', peRatioTTM: 20.1, pbRatio: 3.5, industryPe: 28.5, debtToEquity: 0.2, roe: 17.4, epsTTM: 20.44, divYield: 0.2, bookValue: 117.37, faceValue: 2 },
    financials: { revenue: generateFinancialData(10000), profit: generateFinancialData(1500), netWorth: generateFinancialData(60000) }
  },
  { 
    id: 'sunpharma', symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd.', price: 1150.20, change: -8.60, changePercent: -0.74, exchange: 'NSE', sector: 'Pharmaceuticals', 
    todayLow: 1140.00, todayHigh: 1160.00, fiftyTwoWeekLow: 900.00, fiftyTwoWeekHigh: 1250.00, openPrice: 1158.00, prevClosePrice: 1158.80, volume: 1500000,
    lowerCircuit: 1035.18, upperCircuit: 1265.22,
    fundamentals: { marketCap: '2,76,000Cr', peRatioTTM: 30.5, pbRatio: 4.8, industryPe: 25.0, debtToEquity: 0.1, roe: 15.7, epsTTM: 37.71, divYield: 0.9, bookValue: 239.63, faceValue: 1 },
    financials: { revenue: generateFinancialData(10000), profit: generateFinancialData(2000), netWorth: generateFinancialData(60000) }
  },
  { 
    id: 'tatamotors', symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 655.75, change: 5.50, changePercent: 0.85, exchange: 'NSE', sector: 'Automobile',
    todayLow: 650.00, todayHigh: 660.00, fiftyTwoWeekLow: 400.00, fiftyTwoWeekHigh: 700.00, openPrice: 650.25, prevClosePrice: 650.25, volume: 15000000,
    lowerCircuit: 585.23, upperCircuit: 715.27,
    fundamentals: { marketCap: '2,18,000Cr', peRatioTTM: 15.8, pbRatio: 2.9, industryPe: 25.0, debtToEquity: 1.2, roe: 18.2, epsTTM: 41.50, divYield: 0.0, bookValue: 226.12, faceValue: 2 },
    financials: { revenue: generateFinancialData(80000), profit: generateFinancialData(5000), netWorth: generateFinancialData(75000) }
  },
];
