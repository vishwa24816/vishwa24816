
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { SipOrder } from '@/types';
import { mockSips } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CalendarClock, Edit3, PauseCircle, PlayCircle, XCircle } from 'lucide-react';

interface SipItemProps {
  sip: SipOrder;
  onStatusChange: (id: string, newStatus: 'Active' | 'Paused' | 'Cancelled') => void;
}

const SipItem: React.FC<SipItemProps> = ({ sip, onStatusChange }) => {
  const { toast } = useToast();
  const currencySymbol = '₹';
  const valueDisplay = sip.amount ? `${currencySymbol}${sip.amount.toLocaleString()}` : `${sip.quantity} units`;

  const handleTogglePause = () => {
    if (sip.status === 'Active') {
      onStatusChange(sip.id, 'Paused');
      toast({ title: `SIP Paused: ${sip.instrumentName}` });
    } else if (sip.status === 'Paused') {
      onStatusChange(sip.id, 'Active');
      toast({ title: `SIP Resumed: ${sip.instrumentName}` });
    }
  };
  
  const handleCancel = () => {
      onStatusChange(sip.id, 'Cancelled');
      toast({ title: `SIP Cancelled: ${sip.instrumentName}`, variant: "destructive"});
  }

  return (
    <div className="border-b">
        <div className="p-3">
            <div className="flex justify-between items-center">
                <p className="font-semibold text-sm text-foreground">{sip.instrumentName} {sip.symbol && `(${sip.symbol})`}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{sip.assetType}</span>
            </div>
            <p className="text-xs text-muted-foreground">{valueDisplay} - {sip.frequency}</p>
        </div>
        <div className="text-xs px-3 pb-2 space-y-1">
            <div className="flex justify-between">
                <span>Next Due: {new Date(sip.nextDueDate).toLocaleDateString()}</span>
                <span>Status: <span className={cn("font-medium", sip.status === 'Active' ? 'text-green-600' : sip.status === 'Paused' ? 'text-yellow-600' : 'text-muted-foreground')}>{sip.status}</span></span>
            </div>
            <div className="flex justify-between text-muted-foreground">
                <span>Started: {new Date(sip.startDate).toLocaleDateString()}</span>
                <span>Installments: {sip.installmentsDone}{sip.totalInstallments ? `/${sip.totalInstallments}` : ''}</span>
            </div>
        </div>
       <div className="px-3 pb-2 flex justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: `Modify SIP: ${sip.instrumentName}`})}>
                <Edit3 className="mr-1 h-3 w-3" /> Modify
            </Button>
            {sip.status === 'Active' && (
                <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-700" onClick={handleTogglePause}>
                    <PauseCircle className="mr-1 h-3 w-3" /> Pause
                </Button>
            )}
            {sip.status === 'Paused' && (
                <Button variant="outline" size="sm" className="text-green-600 border-green-500 hover:bg-green-500/10 hover:text-green-700" onClick={handleTogglePause}>
                    <PlayCircle className="mr-1 h-3 w-3" /> Resume
                </Button>
            )}
            {sip.status !== 'Cancelled' && sip.status !== 'Completed' && (
                <Button variant="destructive" size="sm" onClick={handleCancel}>
                    <XCircle className="mr-1 h-3 w-3" /> Cancel
                </Button>
            )}
      </div>
    </div>
  );
};

export function SipsDisplay({ isRealMode = false }: { isRealMode?: boolean }) {
  const initialSips = isRealMode 
    ? mockSips.filter(s => s.assetType === 'Crypto') // Simple filter for real mode
    : mockSips;
    
  const [sips, setSips] = useState<SipOrder[]>(initialSips);

  const handleStatusChange = (id: string, newStatus: 'Active' | 'Paused' | 'Cancelled') => {
      setSips(currentSips => 
          currentSips.map(sip => 
              sip.id === id ? { ...sip, status: newStatus } : sip
          )
      );
  };

  if (sips.length === 0) {
    return (
      <div className="text-center py-10">
        <CalendarClock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          No SIPs found.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)] p-1">
      {sips.map((sip) => (
        <SipItem key={sip.id} sip={sip} onStatusChange={handleStatusChange} />
      ))}
    </ScrollArea>
  );
}
