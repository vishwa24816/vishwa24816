
"use client";

import React from 'react';
import type { IpoInfo } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SubscriptionBar = ({ label, value }: { label: string, value: string }) => {
  const numValue = parseFloat(value.replace('x', ''));
  const width = Math.min((numValue / 100) * 100, 100); // Capped at 100x for visuals
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5">
        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${width}%` }}></div>
      </div>
    </div>
  );
};

export const IpoCard = ({ ipo, isApplied }: { ipo: IpoInfo, isApplied: boolean }) => {
  return (
    <Card className="overflow-hidden">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-b-0">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">{ipo.companyName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                 <Badge variant={ipo.type === 'Mainboard' ? 'default' : 'secondary'}>{ipo.type}</Badge>
                 <span className="text-xs text-muted-foreground">Closes: {ipo.closeDate}</span>
              </div>
            </div>
            <AccordionTrigger className="p-2 hover:bg-accent rounded-md [&[data-state=open]>svg]:rotate-180">
                <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            </AccordionTrigger>
          </CardHeader>
          <AccordionContent>
            <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Issue Price</p>
                        <p className="font-semibold">₹{ipo.issuePrice}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-muted-foreground">Lot Size</p>
                        <p className="font-semibold">{ipo.lotSize} Shares</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Subscription (Day 3)</h4>
                    <SubscriptionBar label="QIB" value={ipo.qib} />
                    <SubscriptionBar label="HNI" value={ipo.hni} />
                    <SubscriptionBar label="Retail" value={ipo.retail} />
                    <SubscriptionBar label="Total" value={ipo.totalSubscription} />
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                 <Button variant="ghost" size="sm" className="text-primary p-0 h-auto">
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
                {isApplied ? (
                    <Button variant="destructive">Withdraw</Button>
                ) : (
                    <Button>Apply</Button>
                )}
            </CardFooter>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
