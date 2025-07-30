
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const feeData = [
    { level: 'Regular', spotVolume: '<5L', futuresVolume: '<25L', spotFee: '0.5%', futuresFee: '0.1%' },
    { level: 'VIP 1', spotVolume: '5L-25L', futuresVolume: '>25L', spotFee: '0.42%', futuresFee: '0.08%' },
    { level: 'VIP 2', spotVolume: '25L-50L', futuresVolume: '50L-1Cr', spotFee: '0.37%', futuresFee: '0.06%' },
    { level: 'VIP 3', spotVolume: '50L-1Cr', futuresVolume: '1Cr-5Cr', spotFee: '0.32%', futuresFee: '0.04%' },
    { level: 'VIP 4', spotVolume: '1Cr-2.5Cr', futuresVolume: '5Cr-10Cr', spotFee: '0.28%', futuresFee: '0.03%' },
    { level: 'VIP 5', spotVolume: '2.5Cr-5Cr', futuresVolume: '10Cr-15Cr', spotFee: '0.22%', futuresFee: '0.02%' },
    { level: 'VIP 6', spotVolume: '5Cr-10Cr', futuresVolume: '>15Cr-30Cr', spotFee: '0.16%', futuresFee: '0.01%' },
    { level: 'VIP 7', spotVolume: '>10Cr', futuresVolume: '>30Cr', spotFee: '0.1%', futuresFee: '0%' },
];

export default function FeeStructurePage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center p-4 border-b bg-background sticky top-0 z-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold ml-4">Fee Structure</h1>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <Tabs defaultValue="trading-fee">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trading-fee">Trading Fee</TabsTrigger>
              <TabsTrigger value="withdrawal-fee">Withdrawal Fee</TabsTrigger>
            </TabsList>
            <TabsContent value="trading-fee" className="mt-6 space-y-6">
                <p className="text-sm text-muted-foreground">
                    Transaction fees on SIM platform for its users are based on the below volume-based scheme in which the more you trade, the lesser fee you pay.
                </p>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Fee Level</TableHead>
                            <TableHead colSpan={2} className="text-center">30-Day Trading Volume</TableHead>
                            <TableHead colSpan={2} className="text-center">Spot/USDT-M Fee</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead className="text-center">Spot (INR)</TableHead>
                            <TableHead className="text-center">Futures (USDT)</TableHead>
                            <TableHead className="text-center">Maker & Taker Fee</TableHead>
                            <TableHead className="text-center">Maker</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {feeData.map((row) => (
                            <TableRow key={row.level}>
                            <TableCell className="font-medium">{row.level}</TableCell>
                            <TableCell className="text-center">{row.spotVolume}</TableCell>
                            <TableCell className="text-center">{row.futuresVolume}</TableCell>
                            <TableCell className="text-center">{row.spotFee}</TableCell>
                            <TableCell className="text-center">{row.futuresFee}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </div>
                
                 <div className="text-sm text-muted-foreground space-y-4">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>18% GST on futures is applicable.</li>
                        <li>The rate of TDS on Crypto is 1% except for Non-residents for whom it is 20%.</li>
                        <li>20% tax on net P&L is applicable and 15% on short-term option is applicable.</li>
                        <li>Users who have joined our VIP program using promo code CRYPTO24 are eligible for exclusive fee rebates and reduced fee structures depending on their tier in the Real KVP Program.</li>
                    </ul>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">30 Day Trading Volume Calculation Explanation</h3>
                        <p>To calculate your spot trading volume from 2nd to 31st Dec, 2022. As for a user at VIP-1 Level, if his trading volume on the maker are taker orders are 25Lakhs and 50Lakhs, respectively.</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Spot Fee: Maker Fee (0.10%) + Taker Fee (0.15%)</li>
                            <li>Futures-M (USDT): Maker Fee (0.01%) + Taker Fee (0.04%)</li>
                            <li>18% GST on futures is applicable</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">VIP Tier System</h3>
                        <p>A user on reaching the "VIP Planet" by successfully completing his/her Spot and Futures-M Maker/Taker Volume criteria of 25 Lakhs and 25 Lakhs, is entitled to exclusive VIP benefits.</p>
                        <p className="mt-1">User can request an upgrade in their tiers across Spot & Futures products by improving their 30-day trading volume and turnover on the platform.</p>
                        <p className="mt-1">VIP level is refreshed every Monday, so keep enjoying the discounts till the new VIP level gets updated.</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">Exclusive VIP Benefits</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Dedicated Key Account Manager</li>
                            <li>Priority Access: Users on reaching VIP level can get access to new features and exclusive trading experiences.</li>
                            <li>Priority Service: Priority to VIP users for problem-solving in just one business day.</li>
                            <li>Priority recommendations and strategies.</li>
                            <li>SIM Earn & Airdrop Rewards: Get access to the best interest rate of our SIM Earn product.</li>
                            <li>Exclusive Access to Webinars: Exclusive spot and futures webinars for our premium trade-route users.</li>
                        </ul>
                    </div>

                     <div>
                        <h3 className="font-semibold text-foreground mb-2">Note</h3>
                         <ul className="list-disc pl-5 space-y-2">
                            <li>Can I directly buy tokens on SIM? Yes, transaction fees for the same on SIM platform are the same as the "Takers" or "Futures-maker" condition applicable for your account category or VIP status.</li>
                            <li>Is GST applicable on the fee I pay? Yes, GST of 18% is applicable over and above the transaction fee.</li>
                            <li>How do I know my current trading volume on SIM? You can view your current trading volume by logging into our website, https://sim.app, under the Account - Fee Structure section.</li>
                            <li>Is the Fee Structure mentioned above applicable for trades done both on the SIM App and the SIM Website? Yes. The fee structure mentioned above is applicable for all trades done on the SIM platform irrespective of the device (Android/iOS) or platform (App/Website).</li>
                            <li>How is the 30-day trading volume calculated? Is it for the last 30 days or the last calendar month? The 30-day trading volume is calculated on a rolling basis. i.e., at any given time, your trading volume for the previous 30 days from that time is considered.</li>
                            <li>How do I know the fee I have paid? The fee you pay is available for each trade on the order details page. You can view all your orders on the History page.</li>
                            <li>Are there any crypto/USDT product exceptions in how the fee will apply? Yes, certain low-liquidity crypto/USDT product pairs may be excluded from the program. Fees for such pairs will remain unchanged at their standard levels.</li>
                            <li>Do you charge maker/taker fees on your spot or USDT-M product? Yes, the maker/taker fees will be the same as that for Spot or Futures-M.</li>
                            <li>Will you have the same taker and maker fees on all the pairs on your SPOT platform? Yes, the taker and maker fees will be same on all pairs on our SPOT platform, including INR to Spot/Futures. This will help our users in seamless trading and better liquidity across all pairs on our platform.</li>
                            <li>How is the maker and taker order book decided on your USDT-M product? An order will be treated as "maker" or "taker" based on whether it is a "maker" or "taker" order in the corresponding order on the exchange. Our "USDT-M" product functions by placing orders on third-party crypto exchanges (referred to as "exchanges" or "partner exchanges").</li>
                            <li>Are the maker and taker fees for your SPOT product determined based on our SPOT or USDT-M volume? The maker and taker fees for our SPOT product are determined based on your SPOT volume only.</li>
                            <li>Are my INR to USDT/Spot transactions included in my 30-day SPOT volume? Yes. The transaction volume for all INR to USDT/Spot orders will be included in the calculation of your 30-day SPOT trading volume.</li>
                            <li>Please see our Terms of Use, Privacy Policy and other Risk & Trading Disclosures before you begin.</li>
                        </ul>
                     </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-2">DISCLAIMER</h3>
                        <p>The information contained herein is based on technical analysis, historical and current price trends and patterns, and other financial data. The information is not a recommendation to buy or sell any financial instrument. The information is provided for informational purposes only and is not intended to be a substitute for professional financial advice. You should consult with a qualified financial advisor before making any investment decisions. Crypto trading is subject to high market risk. Please make your trades cautiously. The information provided herein is not an investment recommendation. Non-Crypto related investments including, but not limited to, Stocks, Mutual Funds, Bonds and/or any other investment instrument are subject to market risks. Please read all the investment related documents carefully before investing. SIM is not responsible for any direct or indirect losses arising from the use of this information.</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-foreground mb-2">Terms of Wallet</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Fees for the Non-INR markets (e.g., crypto/crypto, USDT/crypto) are calculated in the quote/base currency.</li>
                            <li>Fees are charged on a per-trade basis. We do not have separate fees for deposits or in-app transfers of the main balance to wallets or vice versa.</li>
                            <li>A flat withdrawal fee is charged for all withdrawals, the quantum for which may vary based on the currency and mode of withdrawal.</li>
                            <li>Trading fees and savings displayed in INR for the USDT market are only indicative and will depend on the USDT-INR exchange rates.</li>
                            <li>SIM will at all times, act as per the law. This also includes any applicable provisions of law w.r.t the collection of TDS and its due reporting on all the transactions carried on by the user on our platform.</li>
                        </ul>
                    </div>

                </div>
            </TabsContent>
            <TabsContent value="withdrawal-fee">
                <p className="text-center py-10 text-muted-foreground">Withdrawal fee information will be displayed here.</p>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
