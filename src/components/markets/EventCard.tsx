
"use client";

import type { CorporateEvent } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, MoreHorizontal, FileText, Gift, Award, DivideCircle, CircleDollarSign, RedoDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface EventCardProps {
  event: CorporateEvent;
}

const getTagVariant = (tag: string) => {
    switch (tag.toLowerCase()) {
        case 'results': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
        case 'dividend': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        case 'bonus': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
        case 'split': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        case 'buyback': return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800';
        case 'delisting': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        case 'bm': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800';
        default: return 'secondary';
    }
}

const getTagIcon = (tag: string) => {
    switch (tag.toLowerCase()) {
        case 'results': return <FileText className="h-3 w-3" />;
        case 'dividend': return <Gift className="h-3 w-3" />;
        case 'bonus': return <Award className="h-3 w-3" />;
        case 'split': return <DivideCircle className="h-3 w-3" />;
        case 'buyback': return <RedoDot className="h-3 w-3" />;
        default: return null;
    }
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <div className="flex items-center">
                    <h3 className="font-semibold text-foreground text-base mr-2">{event.companyName}</h3>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{event.dateType}: {event.date}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                    {event.tags.map(tag => (
                        <Badge key={tag} variant="outline" className={cn("text-xs flex items-center gap-1", getTagVariant(tag))}>
                            {getTagIcon(tag)}
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <p className="text-sm text-foreground mt-2">{event.description}</p>
      </CardContent>
    </Card>
  );
};
