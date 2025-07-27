
"use client";

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Filter, AlertCircle } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { mockEvents } from '@/lib/mockData/events';
import { EventCard } from './EventCard';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from '@/components/ui/scroll-area';

type EventFilter = 'All Events' | 'Results' | 'Dividends' | 'Buybacks';

export function EventsCalendar() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date(new Date().setDate(new Date().getDate() + 7)) });
  const [activeFilter, setActiveFilter] = useState<EventFilter>('All Events');

  const filteredEvents = useMemo(() => {
    return mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      const isInRange = eventDate >= dateRange.from && eventDate <= dateRange.to;
      
      if (!isInRange) return false;

      if (activeFilter === 'All Events') return true;
      // Simple text matching for filtering
      if (activeFilter === 'Results' && event.tags.includes('Results')) return true;
      if (activeFilter === 'Dividends' && event.tags.includes('Dividend')) return true;
      if (activeFilter === 'Buybacks' && event.description.toLowerCase().includes('buyback')) return true;

      return false;
    });
  }, [dateRange, activeFilter]);

  const filterButtons: EventFilter[] = ['All Events', 'Results', 'Dividends', 'Buybacks'];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Select defaultValue="7">
                <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7">Next 7 Days</SelectItem>
                    <SelectItem value="14">Next 14 Days</SelectItem>
                    <SelectItem value="30">Next 30 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("h-9 justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, "LLL dd, y") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateRange.from} onSelect={(d) => setDateRange(prev => ({...prev, from: d || new Date()}))} /></PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("h-9 justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.to ? format(dateRange.to, "LLL dd, y") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateRange.to} onSelect={(d) => setDateRange(prev => ({...prev, to: d || new Date()}))} /></PopoverContent>
            </Popover>
        </div>

        <Select defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Choose Watchlist/Portfolio" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Stock Universe</SelectItem>
                <SelectItem value="my-watchlist">My Watchlist</SelectItem>
                <SelectItem value="nifty50">Nifty 50</SelectItem>
            </SelectContent>
        </Select>

        <Alert variant="default" className="bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500/50 text-yellow-800 dark:text-yellow-300">
            <AlertCircle className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
            <AlertDescription>
                Corporate actions results has been curtailed to 312. Please try a smaller range of dates.
            </AlertDescription>
        </Alert>
        
        <div className="flex space-x-2 overflow-x-auto no-scrollbar">
            {filterButtons.map(filter => (
                <Button 
                    key={filter} 
                    variant={activeFilter === filter ? 'default' : 'outline'} 
                    size="sm"
                    className="rounded-full px-4 text-xs shrink-0"
                    onClick={() => setActiveFilter(filter)}
                >
                    {filter}
                </Button>
            ))}
        </div>
      </div>
      
      <ScrollArea className="flex-grow px-2">
        <div className="space-y-3 p-2">
            {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
