
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SipOrder } from '@/types';
import { mockSips } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CalendarClock, Edit3, PauseCircle, PlayCircle, XCircle } from 'lucide-react';

interface SipItemProps {
  sip: SipOrder;
}

const SipItem: React.FC<SipItemProps> = ({ sip }) => {
  const { toast } = useToast();
  const valueDisplay = sip.amount ? `₹${sip.amount.toLocaleString()}` : `${sip.quantity} units`;

  return (
    <Card className="mb-3 shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-md font-semibold flex justify-between items-center">
          <span>{sip.instrumentName} {sip.symbol && `(${sip.symbol})`}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{sip.assetType}</span>
        </CardTitle>
        <CardDescription className="text-xs">
          {valueDisplay} - {sip.frequency}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs px-4 pb-3 space-y-1">
        <div className="flex justify-between">
          <span>Next Due: {new Date(sip.nextDueDate).toLocaleDateString()}</span>
          <span>Status: <span className={cn("font-medium", sip.status === 'Active' ? 'text-green-600' : sip.status === 'Paused' ? 'text-yellow-600' : 'text-muted-foreground')}>{sip.status}</span></span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Started: {new Date(sip.startDate).toLocaleDateString()}</span>
          <span>Installments: {sip.installmentsDone}{sip.totalInstallments ? `/${sip.totalInstallments}` : ''}</span>
        </div>
      </CardContent>
       <CardFooter className="px-4 py-2 border-t flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => toast({ title: `Modify SIP: ${sip.instrumentName}`})}>
           <Edit3 className="mr-1 h-3 w-3" /> Modify
        </Button>
        {sip.status === 'Active' && (
          <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-700" onClick={() => toast({ title: `Pause SIP: ${sip.instrumentName}`})}>
            <PauseCircle className="mr-1 h-3 w-3" /> Pause
          </Button>
        )}
        {sip.status === 'Paused' && (
           <Button variant="outline" size="sm" className="text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" onClick={() => toast({ title: `Resume SIP: ${sip.instrumentName}`})}>
            <PlayCircle className="mr-1 h-3 w-3" /> Resume
          </Button>
        )}
        <Button variant="destructive" size="sm" onClick={() => toast({ title: `Cancel SIP: ${sip.instrumentName}`, variant: "destructive"})}>
           <XCircle className="mr-1 h-3 w-3" /> Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

interface SipsDisplayProps {
  isRealMode?: boolean;
}

export function SipsDisplay({ isRealMode = false }: SipsDisplayProps) {
  const sips = isRealMode
    ? mockSips.filter(sip => sip.assetType === 'Crypto')
    : mockSips.filter(sip => sip.assetType !== 'Crypto');

  if (sips.length === 0) {
    return (
      <div className="text-center py-10">
        <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {isRealMode ? "No crypto SIPs found." : "No SIPs found for stocks or mutual funds."}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {sips.map((sip) => (
        <SipItem key={sip.id} sip={sip} />
      ))}
    </ScrollArea>
  );
}
