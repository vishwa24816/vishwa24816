
"use client";

import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Database, GitBranch, Terminal } from 'lucide-react';

const NodeWrapper: React.FC<React.PropsWithChildren<{ title: string; icon: React.ElementType, type: 'input' | 'default' | 'output' }>> = ({ children, title, icon: Icon, type }) => {
    return (
        <Card className={cn(
            "w-64 shadow-lg border-2",
            type === 'input' && "border-green-500",
            type === 'default' && "border-blue-500",
            type === 'output' && "border-purple-500",
        )}>
            <CardHeader className="p-3 bg-muted/50 rounded-t-lg">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-xs space-y-2">
                {children}
            </CardContent>
        </Card>
    );
};


export const InputNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <NodeWrapper title="Start" icon={Database} type="input">
        <Handle type="source" position={Position.Right} className="w-2 h-2" />
        <div className="space-y-1">
            <Label>Asset</Label>
            <Input defaultValue="NIFTY 50" />
        </div>
        <div className="space-y-1">
            <Label>Timeframe</Label>
            <Select defaultValue="1min">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="1min">1 Minute</SelectItem>
                    <SelectItem value="5min">5 Minutes</SelectItem>
                    <SelectItem value="15min">15 Minutes</SelectItem>
                    <SelectItem value="1hour">1 Hour</SelectItem>
                    <SelectItem value="1day">1 Day</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </NodeWrapper>
  );
};


export const ConditionNode: React.FC<NodeProps> = ({ data }) => {
    return (
        <NodeWrapper title="Condition" icon={GitBranch} type="default">
            <Handle type="target" position={Position.Left} className="w-2 h-2" />
            <Handle type="source" position={Position.Right} id="a" style={{ top: '33%' }} className="w-2 h-2" />
            <Handle type="source" position={Position.Right} id="b" style={{ top: '66%' }} className="w-2 h-2" />

             <div className="space-y-1">
                <Label>IF</Label>
                <Select defaultValue="sma">
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sma">SMA(20)</SelectItem>
                        <SelectItem value="ema">EMA(50)</SelectItem>
                        <SelectItem value="rsi">RSI(14)</SelectItem>
                        <SelectItem value="price">Close Price</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <Label>Condition</Label>
                 <Select defaultValue="crosses_above">
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="crosses_above">Crosses Above</SelectItem>
                        <SelectItem value="crosses_below">Crosses Below</SelectItem>
                        <SelectItem value="is_greater">Is Greater Than</SelectItem>
                        <SelectItem value="is_less">Is Less Than</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-1">
                <Label>Value / Indicator</Label>
                <Select defaultValue="ema">
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="sma">SMA(50)</SelectItem>
                        <SelectItem value="ema">EMA(200)</SelectItem>
                        <SelectItem value="value">Value</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </NodeWrapper>
    );
};

export const OutputNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <NodeWrapper title="Execute" icon={Terminal} type="output">
        <Handle type="target" position={Position.Left} className="w-2 h-2" />
        <div className="space-y-1">
            <Label>Action</Label>
            <Select defaultValue="buy">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="buy">BUY</SelectItem>
                    <SelectItem value="sell">SELL</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="space-y-1">
            <Label>Quantity</Label>
            <Input defaultValue="1" type="number" />
        </div>
         <div className="space-y-1">
            <Label>Order Type</Label>
            <Select defaultValue="market">
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="market">Market</SelectItem>
                    <SelectItem value="limit">Limit</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </NodeWrapper>
  );
};
