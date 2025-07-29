
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCryptoAssets, mockNewsArticles } from '@/lib/mockData';
import type { Stock, NewsArticle } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TrendingUp, TrendingDown, Info, Maximize2, BarChart2, Bell, Star, Briefcase, Plus, Shuffle, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NewsSection } from '@/components/dashboard/NewsSection';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalysisTabContent } from '@/components/order-pages/shared/AnalysisComponents';
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// News relevance function - can be moved to a shared util
function getRelevantNewsForCrypto(asset: Stock | null, allNews: NewsArticle[]): NewsArticle[] {
    if (!asset || !allNews.length) return [];
    const keywords = [asset.name.toLowerCase(), asset.symbol.toLowerCase()];
    return allNews.filter(news => keywords.some(keyword => news.headline.toLowerCase().includes(keyword)));
}

const FundamentalRow: React.FC<{ label: string; value: string | number; isPositive?: boolean, isNegative?: boolean, className?: string }> = ({ label, value, isPositive, isNegative, className }) => (
    <div className={cn("flex justify-between items-center py-2.5 px-3 even:bg-muted/30", className)}>
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className={cn("text-sm font-semibold text-foreground", isPositive && "text-green-600", isNegative && "text-red-600")}>
            {value}
        </span>
    </div>
);

const AboutCoinCard = () => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">About Coin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
             <div className="border-l-2 border-primary pl-4 space-y-3">
                <div>
                    <h4 className="font-semibold">Launch</h4>
                    <p className="text-muted-foreground">January 2009 by Satoshi Nakamoto</p>
                </div>
                <div>
                    <h4 className="font-semibold">Founded</h4>
                    <p className="text-muted-foreground">2008</p>
                </div>
                 <div>
                    <h4 className="font-semibold">Purpose</h4>
                    <p className="text-muted-foreground">To create a decentralized digital currency that enables peer-to-peer transactions without the need for intermediaries</p>
                </div>
            </div>
            <Button variant="outline" className="w-full">Show More</Button>
        </CardContent>
    </Card>
);

const marketCapData = [
  { month: 'Jan', value: 1.8 }, { month: 'Feb', value: 1.9 },
  { month: 'Mar', value: 1.7 }, { month: 'Apr', value: 2.0 },
  { month: 'May', value: 2.2 }, { month: 'Jun', value: 2.35 },
];

const MarketCapitalCard = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Market Capital</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">$ 2.35T</p>
      <div className="h-20 -mx-6 -mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketCapData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--positive))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--positive))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke="hsl(var(--positive))" strokeWidth={2} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const marketShareData = [{ name: 'Bitcoin', value: 54.44, fill: 'hsl(var(--primary))' }, { name: 'Others', value: 45.56, fill: 'hsl(var(--muted))' }];

const MarketShareCard = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-base">Market Share</CardTitle>
    </CardHeader>
    <CardContent className="flex items-center gap-4">
      <div className="h-24 w-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={marketShareData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={25} outerRadius={40} paddingAngle={2} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-xs space-y-2">
        {marketShareData.map(entry => (
          <div key={entry.name} className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.fill }} />
            <div>
              <p className="text-muted-foreground">{entry.name}</p>
              <p className="font-semibold">{entry.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const marketSupplyData = [{ name: 'Bitcoin', supply: 19.7, maxSupply: 21 }];
const MarketSupplyCard = () => (
    <Card className="h-full">
        <CardHeader className="pb-2">
            <CardTitle className="text-base">Market Supply</CardTitle>
        </CardHeader>
        <CardContent className="h-24 flex items-end gap-4">
            {marketSupplyData.map(entry => (
                <div key={entry.name} className="w-1/2">
                    <div className="h-full bg-primary/20 rounded-t-md relative">
                         <div className="h-full bg-primary rounded-t-md" style={{ height: `${(entry.supply / entry.maxSupply) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
);


const journeyData = [
  { year: '2009', price: 0 }, { year: '2010', price: 0.08 },
  { year: '2011', price: 5.27 }, { year: '2012', price: 13.45 },
  { year: '2013', price: 770 }, { year: '2014', price: 314 },
  { year: '2015', price: 430 }, { year: '2016', price: 963 },
  { year: '2017', price: 13880 }, { year: '2018', price: 3742 },
  { year: '2019', price: 7193 }, { year: '2020', price: 29374 },
  { year: '2021', price: 47686 }, { year: '2022', price: 16602 },
  { year: '2023', price: 42281 }, { year: '2024', price: 65000 },
];

const BitcoinJourneyChart = () => (
  <Card className="bg-foreground text-background">
    <CardHeader>
      <CardTitle className="text-lg text-background flex justify-between items-center">
        The Journey of Bitcoin
        <Maximize2 className="h-5 w-5 text-muted-foreground" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={journeyData}>
             <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
             <YAxis hide={true} domain={['dataMin', 'dataMax']} />
             <Line type="monotone" dataKey="price" stroke="hsl(var(--positive))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--positive))' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const CompareCoin = () => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">Compare Coin</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-1">
                <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
                <p className="text-xs font-semibold">BTC</p>
                <p className="text-xs text-muted-foreground">Bitc...</p>
            </div>
            <Shuffle className="h-5 w-5 text-muted-foreground" />
            <Button variant="outline" className="flex flex-col items-center h-auto p-2 gap-1 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Plus className="h-5 w-5"/></div>
                <p className="text-xs">Add Coin</p>
            </Button>
             <Shuffle className="h-5 w-5 text-muted-foreground" />
            <Button variant="outline" className="flex flex-col items-center h-auto p-2 gap-1 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Plus className="h-5 w-5"/></div>
                <p className="text-xs">Add Coin</p>
            </Button>
        </CardContent>
    </Card>
);

const MarketStatsCard: React.FC<{ asset: Stock }> = ({ asset }) => {
    const stats = [
        { label: 'Coin Price', value: `$${(asset.price / 83).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 6})}` },
        { label: 'Market Capital', value: `$${(parseFloat(asset.marketCap?.replace('₹', '').replace('T', ''))*1e12 / 83 / 1e12).toFixed(2)}T` },
        { label: 'Technology', value: asset.fundamentals?.technology || 'N/A' },
        { label: 'Introduction Year', value: asset.fundamentals?.introductionYear || 'N/A' },
        { label: 'Tech Score Indicator', value: asset.fundamentals?.techScoreIndicator || 'N/A' },
        { label: 'Safety Score', value: asset.fundamentals?.safetyScore || 'N/A' },
        { label: 'Market Rank', value: asset.fundamentals?.marketRank || 'N/A' },
        { label: '6 Month Return', value: `${asset.fundamentals?.sixMonthReturn || 0}%`, isPositive: (asset.fundamentals?.sixMonthReturn || 0) > 0 },
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Market Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                    {stats.map(stat => (
                        <React.Fragment key={stat.label}>
                            <div className="font-medium text-muted-foreground">{stat.label}</div>
                            <div className={cn("font-semibold text-right", stat.isPositive && "text-green-600")}>{stat.value}</div>
                        </React.Fragment>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
};


interface CryptoMarketPageProps {
  params: { symbol: string };
  onBack: () => void;
}

export default function CryptoMarketPage({ params, onBack }: CryptoMarketPageProps) {
    const { toast } = useToast();
    const symbol = typeof params.symbol === 'string' ? decodeURIComponent(params.symbol) : undefined;
    
    const [asset, setAsset] = useState<Stock | null>(null);
    const [assetSpecificNews, setAssetSpecificNews] = useState<NewsArticle[]>([]);
    const [activeTimescale, setActiveTimescale] = useState('1M');

    useEffect(() => {
        if (symbol) {
            const foundAsset = mockCryptoAssets.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
            if (foundAsset) {
                setAsset(foundAsset);
                setAssetSpecificNews(getRelevantNewsForCrypto(foundAsset, mockNewsArticles));
            } else {
                toast({ title: "Error", description: `Asset with symbol ${symbol} not found.`, variant: "destructive" });
                if (onBack) onBack();
            }
        }
    }, [symbol, toast, onBack]);

    if (!asset) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <p>Loading asset details...</p>
            </div>
        );
    }
    
    const isPositiveChange = asset.change >= 0;
    const timescaleButtons = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];
    
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="px-4 py-3 sticky top-16 z-20 bg-background border-b border-border flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={onBack} className="text-foreground hover:bg-muted">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">{asset.name}</h1>
                <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Star className="h-5 w-5" /></Button>
                    <Button variant="ghost" size="icon"><Briefcase className="h-5 w-5" /></Button>
                </div>
            </header>
            
            <Tabs defaultValue="market" className="flex-grow flex flex-col">
                 <div className="sticky top-32 z-10 bg-background border-b">
                    <TabsList className="w-full justify-start rounded-none bg-transparent p-0 px-4">
                        <TabsTrigger value="market">Market</TabsTrigger>
                        <TabsTrigger value="news">News</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="study">Study</TabsTrigger>
                    </TabsList>
                </div>

                <main className="flex-grow overflow-y-auto">
                    <TabsContent value="market" className="p-4 space-y-6 mt-0">
                         <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{asset.name} / U.S. Dollar</p>
                                <p className="text-3xl font-bold">${(asset.price / 83).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: (asset.price / 83) < 1 ? 6 : 2})}</p>
                                <div className="flex items-center text-sm">
                                    <span className={cn(isPositiveChange ? 'text-green-500' : 'text-red-500')}>
                                        {(asset.change / 83).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: (asset.price / 83) < 1 ? 6 : 2, signDisplay: 'always'})}
                                    </span>
                                    <span className={cn("ml-2", isPositiveChange ? 'text-green-500' : 'text-red-500')}>
                                        ({asset.changePercent.toFixed(2)}%)
                                    </span>
                                    <span className="ml-2 text-muted-foreground text-xs">Past month</span>
                                </div>
                            </div>
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>{asset.symbol.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </div>

                         <div className="h-64 bg-muted rounded-md flex items-center justify-center my-4 relative overflow-hidden" data-ai-hint="crypto chart graph">
                          <ResponsiveContainer width="100%" height="100%">
                              <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none">
                                <path d="M0 130 C 20 120, 40 100, 60 110 S 100 140, 120 120 S 160 80, 180 90 S 220 110, 240 70, 280 40, 300 50" 
                                      fill="none" 
                                      stroke={isPositiveChange ? "hsl(var(--positive))" : "hsl(var(--destructive))"} 
                                      strokeWidth="2"/>
                              </svg>
                          </ResponsiveContainer>
                        </div>
          
                        <div className="flex space-x-1 overflow-x-auto no-scrollbar py-2">
                          {timescaleButtons.map(ts => (
                            <Button
                              key={ts}
                              variant={activeTimescale === ts ? 'secondary' : 'ghost'}
                              size="sm"
                              onClick={() => setActiveTimescale(ts)}
                              className="rounded-md px-4 text-xs shrink-0"
                            >
                              {ts}
                            </Button>
                          ))}
                        </div>

                        <Card>
                            <CardHeader><CardTitle>Fundamental</CardTitle></CardHeader>
                            <CardContent className="divide-y p-0">
                               <FundamentalRow label="Total Volume" value={`$${((asset.volume || 0) / 83 / 1e9).toFixed(2)} B`} />
                               <FundamentalRow label="Market Cap" value={`$${(parseFloat(asset.marketCap?.replace('₹', '').replace('T', ''))*1e12 / 83 / 1e12).toFixed(2)}T`} />
                               <FundamentalRow label="Total Supply" value="120.71 M" />
                               <FundamentalRow label="Circulating Supply" value="120.71 M" />
                               <FundamentalRow label="High (24h)" value={`$${((asset.todayHigh || 0) / 83).toLocaleString('en-US', {minimumFractionDigits: 2})}`} />
                               <FundamentalRow label="Low (24h)" value={`$${((asset.todayLow || 0) / 83).toLocaleString('en-US', {minimumFractionDigits: 2})}`} />
                               <FundamentalRow label="Max Supply" value="No data" />
                               <FundamentalRow label="Change (1h)" value="1.26%" isPositive />
                               <FundamentalRow label="Change (24h)" value="-0.37%" isNegative />
                               <FundamentalRow label="Change (7d)" value="5.04%" isPositive />
                            </CardContent>
                        </Card>

                        {asset.aboutCompany && (
                            <Card>
                                <CardHeader><CardTitle>About Coin</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="text-sm text-foreground/80 leading-relaxed">
                                        {asset.aboutCompany} 
                                        <Button variant="link" className="p-0 h-auto ml-1">Show More</Button>
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                    <TabsContent value="news" className="p-4 mt-0">
                        <NewsSection articles={assetSpecificNews} title={`News related to ${asset.name}`} />
                    </TabsContent>
                     <TabsContent value="analysis" className="p-0 mt-0">
                        <AnalysisTabContent />
                    </TabsContent>
                     <TabsContent value="study" className="p-4 mt-0 space-y-6">
                        <AboutCoinCard />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <MarketCapitalCard />
                            <MarketShareCard />
                            <MarketSupplyCard />
                        </div>
                        <BitcoinJourneyChart />
                        <CompareCoin />
                        <MarketStatsCard asset={asset} />
                    </TabsContent>
                </main>
            </Tabs>
        </div>
    );
}
