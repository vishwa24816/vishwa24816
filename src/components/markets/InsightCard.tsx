
"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { Insight } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface InsightCardProps {
  insight: Insight;
}

const getTagVariant = (tag: string) => {
    switch (tag) {
        case 'Estimates Beat': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
        case 'Estimates Miss': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
        case 'Order Win': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
        case 'Initiating Coverage': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
        case 'Margin Decline': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
        default: return 'secondary';
    }
}


export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
    const { toast } = useToast();

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center text-primary font-semibold">
                            <span>{insight.companyName}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{insight.date}</p>
                    </div>
                     <Badge variant="outline" className={cn("text-xs", getTagVariant(insight.tag))}>
                        {insight.tag}
                    </Badge>
                </div>

                 <div className="flex items-center mt-2">
                    <p className="text-sm text-foreground flex-1 pr-4">{insight.description}</p>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
            </CardContent>
        </Card>
    );
};
