
import type { EarningsCall } from '@/types';

export const mockEarningsCalls: EarningsCall[] = [
    {
        id: 'ec1',
        companyName: 'IDFC First Bank Ltd',
        bseCode: '539437',
        date: '27 Jul 2025',
        time: '3:01 PM',
        title: 'Audio Recording Of Earnings Call (Q1-FY26)',
        description: 'Link of Audio Recording of Earnings Call for Q1-FY26.',
        stockData: { price: 70.7, change: -2.1, changePercent: -3.0 }
    },
    {
        id: 'ec2',
        companyName: 'SG Finserve Ltd',
        bseCode: '539199',
        title: 'Announcement under Regulation 30 (LODR)-Earnings Call Transcript',
        description: 'Transcript of Q1FY26.',
        date: '27 Jul 2025',
        time: '2:56 PM',
        stockData: { price: 403.5, change: -6.5, changePercent: -1.6 }
    },
    {
        id: 'ec3',
        companyName: 'Sobha Ltd',
        bseCode: '532784',
        title: 'Announcement under Regulation 30 (LODR)-Analyst / Investor Meet - Intimation',
        description: 'Sobha Limited has informed the exchange about audio recording of conference call held on July 26, 2025.',
        date: '26 Jul 2025',
        time: '12:05 PM',
        stockData: { price: 1613.0, change: -48.4, changePercent: -3.0 }
    },
     {
        id: 'ec4',
        companyName: 'SBFC Finance Ltd',
        bseCode: '543959',
        title: 'Announcement under Regulation 30 (LODR)-Analyst / Investor Meet - Intimation',
        description: 'Please find enclosed link of audio recording for the earnings conference call held on 26th July 2025.',
        date: '26 Jul 2025',
        time: '9:18 PM',
        stockData: { price: 109.5, change: -6.3, changePercent: -5.4 }
    },
     {
        id: 'ec5',
        companyName: 'Kotak Mahindra Bank Ltd',
        bseCode: '500247',
        title: 'Audio Recording Of The Earnings Conference Call On The Consolidated And Standalone...',
        description: 'Audio Recording of an Earnings Conference Call on the Consolidated and Standalone Unaudited Financial...',
        date: '25 Jul 2025',
        time: '9:00 PM',
        stockData: { price: 2124.6, change: -17.0, changePercent: -0.8 }
    },
];
