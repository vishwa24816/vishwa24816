
"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"; 
import type { PortfolioHolding, Stock, Transaction } from '@/types';
import { cn } from '@/lib/utils';
import { Bitcoin, XCircle, Coins, Landmark, Settings2, ChevronDown, BarChart2, LayoutGrid, List, PieChart, Repeat, Send, History, ArrowDownToLine, QrCode, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioHeatmap, type HeatmapItem } from './PortfolioHeatmap';
import { Chart } from "@/components/ui/chart";
import { PledgeDialog } from './PledgeDialog';
import { HoldingCard } from './HoldingCard';
import { mockTransactions } from '@/lib/mockData/transactions';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { mockWallets } from '@/lib/mockData/wallets';

export type WalletMode = 'exchange' | 'personal';
type ViewMode = 'list' | 'bar' | 'heatmap' | 'pie';
type ExpandedAction = 'send' | 'receive' | 'history' | null;

// #region Inline Action Components

const SendContent = ({ assets, onConfirm, onCancel }: { assets: PortfolioHolding[], onConfirm: (address: string, amount: string, assetSymbol: string) => void, onCancel: () => void }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>(assets[0]?.symbol || '');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleSend = () => {
    setError('');
    if (!address || !amount || !selectedAsset) {
      setError('Please fill in all fields.');
      return;
    }
    const asset = assets.find(a => a.symbol === selectedAsset);
    if (!asset || parseFloat(amount) > asset.quantity) {
        setError(`Insufficient balance. You have ${asset?.quantity} ${asset?.symbol}.`);
        return;
    }
    onConfirm(address, amount, selectedAsset);
  };

  const handleScan = () => {
    toast({
        title: "Scan QR (Mock)",
        description: "In a real app, this would open the camera to scan a QR code.",
    });
    setTimeout(() => setAddress("0x1234567890abcdef1234567890abcdef12345678"), 1000);
  }

  return (
    <div className="bg-muted/50 p-4 rounded-md border animate-accordion-down space-y-4">
        <div className="space-y-2">
            <Label htmlFor="asset-select">Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger id="asset-select"><SelectValue placeholder="Select asset" /></SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.id} value={asset.symbol}>
                    {asset.name} ({asset.symbol}) - Bal: {asset.quantity.toFixed(4)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        <div className="space-y-2">
            <Label htmlFor="recipient-address">Recipient's Address</Label>
            <div className="flex items-center gap-2">
                <Input id="recipient-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x..." />
                <Button variant="outline" size="icon" onClick={handleScan}><QrCode className="h-4 w-4"/></Button>
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="send-amount">Amount</Label>
            <Input id="send-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
         <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSend} disabled={!address || !amount || !selectedAsset}>
                <Send className="mr-0.5 h-4 w-4" /> Send
            </Button>
        </div>
    </div>
  );
};

const ReceiveContent = ({ asset, walletAddress, onCancel }: { asset: PortfolioHolding, walletAddress: string, onCancel: () => void }) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({ title: 'Address Copied!', description: 'Your wallet address has been copied to the clipboard.' });
  };
  
  return (
    <div className="bg-muted/50 p-4 rounded-md border animate-accordion-down space-y-4">
        <p className="text-sm text-center">Receive {asset.name} ({asset.symbol})</p>
        <div className="p-2 bg-white rounded-lg border mx-auto w-fit">
            <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${walletAddress}`}
                alt="Wallet QR Code"
                width={150}
                height={150}
                data-ai-hint="qr code"
            />
        </div>
        <p className="text-xs text-muted-foreground text-center break-all">{walletAddress}</p>
        <div className="flex justify-center gap-2">
            <Button variant="ghost" onClick={onCancel}>Close</Button>
            <Button onClick={handleCopy}><Copy className="mr-2 h-4 w-4" /> Copy Address</Button>
        </div>
    </div>
  );
};

const HistoryContent = ({ transactions, onCancel }: { transactions: Transaction[], onCancel: () => void }) => {
    const formatCurrency = (value: number) => {
      if (Math.abs(value) >= 10000000) {
        return `₹${(value / 10000000).toFixed(2)} Cr`;
      }
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    };

    return (
        <div className="bg-muted/50 p-4 rounded-md border animate-accordion-down space-y-2">
            <ScrollArea className="max-h-60 pr-2">
                <div className="space-y-4">
                    {transactions.map(tx => {
                        const isCredit = tx.type === 'CREDIT';
                        const ArrowUpFromLine = () => (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"/>
                                <path d="m12 5 7 7-7 7"/>
                                <path d="M19 12H5"/>
                            </svg>
                        )
                        return (
                            <div key={tx.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-full", isCredit ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50")}>
                                        {isCredit ? <ArrowDownToLine className="h-4 w-4 text-green-600" /> : <ArrowUpFromLine />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className={cn("text-sm font-semibold", isCredit ? 'text-green-600' : 'text-red-600')}>
                                    {isCredit ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
             <div className="flex justify-end pt-2">
                <Button variant="ghost" onClick={onCancel}>Close</Button>
            </div>
        </div>
    )
}

// #endregion

interface CryptoHoldingsSectionProps {
  holdings: PortfolioHolding[];
  title: string;
  isRealMode?: boolean;
  isPledged?: boolean;
  onAssetClick: (asset: Stock) => void;
}

export function CryptoHoldingsSection({
  holdings,
  title,
  isRealMode = false,
  isPledged = false,
  onAssetClick,
}: CryptoHoldingsSectionProps) {
  const { toast } = useToast();
  const { primaryWalletId } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pledgeDialogOpen, setPledgeDialogOpen] = useState(false);
  const [selectedHoldingForPledge, setSelectedHoldingForPledge] = useState<PortfolioHolding | null>(null);
  const [pledgeDialogMode, setPledgeDialogMode] = useState<'pledge' | 'payback'>('pledge');
  const [expandedAction, setExpandedAction] = useState<ExpandedAction>(null);

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const primaryWallet = useMemo(() => {
    if (!primaryWalletId) return null;
    return mockWallets.find(w => w.id === primaryWalletId);
  }, [primaryWalletId]);

  const handlePledgeClick = (holding: PortfolioHolding, mode: 'pledge' | 'payback') => {
    setSelectedHoldingForPledge(holding);
    setPledgeDialogMode(mode);
    setPledgeDialogOpen(true);
  };

  const handleConfirmPledge = (holding: PortfolioHolding, quantity: number, mode: 'pledge' | 'payback') => {
      const actionText = mode === 'pledge' ? 'Pledged' : 'Payback initiated for';
      toast({
          title: "Action Submitted (Mock)",
          description: `${actionText} ${quantity} units of ${holding.symbol}.`,
      });
      setPledgeDialogOpen(false);
  };

  const handleSendConfirm = (address: string, amount: string, assetSymbol: string) => {
    toast({
        title: "Transaction Sent (Mock)",
        description: `Sent ${amount} ${assetSymbol} to ${address}.`,
    });
    setExpandedAction(null);
  };

  const toggleAction = (action: ExpandedAction) => {
    setExpandedAction(current => current === action ? null : action);
  };

  const totalCurrentValue = holdings.reduce((acc, holding) => acc + holding.currentValue, 0);
  const totalInvestmentValue = holdings.reduce((acc, holding) => acc + (holding.quantity * holding.avgCostPrice), 0);
  const overallPandL = totalCurrentValue - totalInvestmentValue;
  const overallPandLPercent = totalInvestmentValue !== 0 ? (overallPandL / totalInvestmentValue) * 100 : 0;

  const totalDayChangeAbsolute = holdings.reduce((acc, holding) => acc + holding.dayChangeAbsolute, 0);
  const totalPreviousDayValue = totalCurrentValue - totalDayChangeAbsolute;
  const totalDayChangePercent = totalPreviousDayValue !== 0 ? (totalDayChangeAbsolute / totalPreviousDayValue) * 100 : 0;

  const walletCardTitle = primaryWallet ? primaryWallet.name : isRealMode ? 'Crypto Wallet' : 'Crypto & Web3 Wallet';
  const holdingsCardTitle = 'Crypto & Web3 Holdings';

  const chartData = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      fill: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`,
      label: pos.profitAndLoss >= 0 ? 'Profit' : 'Loss'
    }));
  }, [holdings]);

  const chartConfig = {
      value: {
        label: 'Current Value',
      },
      ...holdings.reduce((acc, pos) => {
        acc[pos.symbol || pos.name] = {
            label: pos.symbol || pos.name,
            color: `hsl(var(--chart-${(pos.id.charCodeAt(pos.id.length - 1) % 5) + 1}))`
        };
        return acc;
    }, {} as any)
  };

  const heatmapData: HeatmapItem[] = useMemo(() => {
    return holdings.map(pos => ({
      name: pos.symbol || pos.name,
      value: pos.currentValue,
      pnl: pos.profitAndLoss,
      pnlPercent: pos.profitAndLossPercent,
    }));
  }, [holdings]);

  const renderContent = () => {
    if (holdings.length === 0) {
      return (
        <div className="p-6 text-center text-muted-foreground">
          You have no crypto assets.
        </div>
      );
    }
    switch(viewMode) {
      case 'list':
        return (
          <div className="mt-4">
            {holdings.map((holding) => (
              <HoldingCard 
                  key={holding.id} 
                  holding={holding} 
                  onPledgeClick={handlePledgeClick}
                  isPledged={isPledged}
                  onAssetClick={onAssetClick}
              />
            ))}
          </div>
        );
      case 'bar':
        return (
          <div className="w-full h-[300px] mt-4">
             <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.ResponsiveContainer>
                <Chart.BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <Chart.XAxis type="number" dataKey="value" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Chart.YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} tickLine={false} axisLine={false} />
                  <Chart.Tooltip
                    cursor={false}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))'
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Chart.Legend content={<Chart.LegendContent />} />
                  <Chart.Bar dataKey="value" radius={4} />
                </Chart.BarChart>
              </Chart.ResponsiveContainer>
            </Chart.Container>
          </div>
        );
      case 'heatmap':
        return (
          <div className="w-full h-[300px] mt-4">
            <PortfolioHeatmap items={heatmapData} />
          </div>
        );
      case 'pie':
        return (
          <div className="w-full h-[300px] mt-4 flex items-center justify-center">
            <Chart.Container config={chartConfig} className="h-full w-full">
              <Chart.ResponsiveContainer>
                <Chart.PieChart>
                    <Chart.Tooltip 
                      content={<Chart.TooltipContent hideLabel nameKey="name" />}
                      formatter={(value, name) => `${name}: ${formatCurrency(value as number)}`}
                    />
                    <Chart.Pie data={chartData} dataKey="value" nameKey="name" />
                    <Chart.LegendContent />
                </Chart.PieChart>
              </Chart.ResponsiveContainer>
            </Chart.Container>
          </div>
        );
      default:
        return null;
    }
  };


  if(isPledged) {
    return (
        <Card className="shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Bitcoin className="h-6 w-6 mr-2" /> {title}
                </CardTitle>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                    <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                    <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                    <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 pt-2 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                        <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(overallPandL)}
                        </p>
                        <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                        </div>
                        <div className="text-right">
                        <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {formatCurrency(totalDayChangeAbsolute)}
                        </p>
                        <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Total Pledged Value</p>
                        <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                        <p className="text-muted-foreground">Current Value</p>
                        <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                        </div>
                    </div>
                </div>
                 {holdings.length > 0 ? (
                    renderContent()
                ) : (
                     <div className="text-center py-10 text-muted-foreground">
                        <p>No Pledged {title.includes('Web3') ? 'Web3' : 'Crypto'} Holdings.</p>
                    </div>
                )}
            </CardContent>
             {selectedHoldingForPledge && (
                <PledgeDialog
                    isOpen={pledgeDialogOpen}
                    onOpenChange={setPledgeDialogOpen}
                    holding={selectedHoldingForPledge}
                    onConfirmPledge={handleConfirmPledge}
                    currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'INR' : 'INR'}
                    mode={pledgeDialogMode}
                />
            )}
        </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="w-full shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
              <Bitcoin className="h-6 w-6 mr-2" /> {walletCardTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className={cn("text-xl font-semibold", overallPandL >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(overallPandL)}
                  </p>
                  <p className="text-xs text-muted-foreground">Overall P&L ({overallPandLPercent.toFixed(2)}%)</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-semibold", totalDayChangeAbsolute >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {formatCurrency(totalDayChangeAbsolute)}
                  </p>
                  <p className="text-xs text-muted-foreground">Day's P&L ({totalDayChangePercent.toFixed(2)}%)</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Total Investment</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalInvestmentValue)}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-muted-foreground">Current Value</p>
                  <p className="font-medium text-foreground">{formatCurrency(totalCurrentValue)}</p>
                </div>
              </div>
            </div>
             <div className="pt-4 border-t space-y-2">
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" onClick={() => toggleAction('send')}>
                        <Send className="mr-0.5 h-4 w-4" /> Send
                    </Button>
                    <Button variant="outline" onClick={() => toggleAction('receive')}>
                        <ArrowDownToLine className="mr-0.5 h-4 w-4" /> Receive
                    </Button>
                    <Button variant="outline" onClick={() => toggleAction('history')}>
                        <History className="mr-0.5 h-4 w-4" /> History
                    </Button>
                </div>
                 {expandedAction === 'send' && (
                    <SendContent assets={holdings} onConfirm={handleSendConfirm} onCancel={() => setExpandedAction(null)} />
                )}
                {expandedAction === 'receive' && holdings.length > 0 && (
                    <ReceiveContent
                        asset={holdings[0]}
                        walletAddress="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                        onCancel={() => setExpandedAction(null)}
                    />
                )}
                {expandedAction === 'history' && (
                    <HistoryContent transactions={mockTransactions} onCancel={() => setExpandedAction(null)} />
                )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold font-headline text-primary flex items-center">
                    <Coins className="h-6 w-6 mr-2" /> {holdingsCardTitle}
                </CardTitle>
                 <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                    <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('list')}><List /></Button>
                    <Button variant={viewMode === 'bar' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('bar')}><BarChart2 /></Button>
                    <Button variant={viewMode === 'heatmap' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('heatmap')}><LayoutGrid /></Button>
                    <Button variant={viewMode === 'pie' ? 'secondary' : 'ghost'} size="icon" className="h-7 w-7" onClick={() => setViewMode('pie')}><PieChart /></Button>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
      {selectedHoldingForPledge && (
        <PledgeDialog
            isOpen={pledgeDialogOpen}
            onOpenChange={setPledgeDialogOpen}
            holding={selectedHoldingForPledge}
            onConfirmPledge={handleConfirmPledge}
            currency={isRealMode || selectedHoldingForPledge.type === 'Crypto' ? 'INR' : 'INR'}
            mode={pledgeDialogMode}
        />
      )}
    </>
  );
}
