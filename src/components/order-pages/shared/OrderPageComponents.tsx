"use client";

import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const PerformanceBar: React.FC<{ low: number; high: number; current?: number; labelLow: string; labelHigh: string }> = ({ low, high, current, labelLow, labelHigh }) => {
  const range = high - low;
  const currentPositionPercent = current && range > 0 ? ((current - low) / range) * 100 : undefined;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{labelLow}: <span className="font-semibold text-foreground">{low.toFixed(2)}</span></span>
        <span>{labelHigh}: <span className="font-semibold text-foreground">{high.toFixed(2)}</span></span>
      </div>
      <div className="relative h-2 w-full rounded-full bg-muted">
        <div className="absolute h-2 rounded-full bg-primary/30" style={{ left: 0, right: 0 }}></div>
        {currentPositionPercent !== undefined && (
          <div
            className="absolute -top-1 -translate-x-1/2 h-4 w-1 bg-primary rounded-sm shadow"
            style={{ left: `${currentPositionPercent}%` }}
          >
            <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[4px] border-b-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export const FinancialBar: React.FC<{ value: number; maxValue: number; label: string }> = ({ value, maxValue, label }) => {
  const heightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="flex flex-col items-center w-1/5">
      <div className="text-xs mb-1 text-foreground">{value.toLocaleString()}</div>
      <div className="w-6 sm:w-8 bg-green-500 rounded-t-sm" style={{ height: `${Math.max(10, heightPercent * 0.8)}%` }}></div>
      <p className="text-xs mt-1 text-muted-foreground whitespace-nowrap">{label}</p>
    </div>
  );
};

export const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: React.ElementType }> = ({ title, children, defaultOpen = false, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mt-6">
      <button
        className="flex justify-between items-center w-full mb-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-md font-semibold flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-primary" />}
          {title}
        </h3>
        {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isOpen && <div className="mt-2 text-sm text-muted-foreground animate-accordion-down">{children}</div>}
    </div>
  );
};
