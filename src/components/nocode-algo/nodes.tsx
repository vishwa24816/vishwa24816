"use client";

import React, { useState } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Database, GitBranch, Terminal, X, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';

// A delete button that will be positioned on the top-right of the node
const NodeDeleteButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 z-10 hover:bg-destructive/80 transition-colors">
        <X className="h-3 w-3" />
        <span className="sr-only">Delete Node</span>
    </button>
);


const NodeWrapper: React.FC<React.PropsWithChildren<{ title: string; icon: React.ElementType, type: 'input' | 'default' | 'output', onDelete: () => void }>> = ({ children, title, icon: Icon, type, onDelete }) => {
    return (
        <div className="relative">
            <NodeDeleteButton onClick={onDelete} />
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
        </div>
    );
};


export const InputNode: React.FC<NodeProps> = ({ data, id }) => {
  const { setNodes } = data;
  const [assets, setAssets] = useState(['NIFTY 50']);

  const addAsset = () => setAssets(prev => [...prev, '']);
  const removeAsset = (index: number) => setAssets(prev => prev.filter((_, i) => i !== index));
  const updateAsset = (index: number, value: string) => {
    const newAssets = [...assets];
    newAssets[index] = value;
    setAssets(newAssets);
  };
  
  const onDelete = () => {
    setNodes((nds: any[]) => nds.filter((node) => node.id !== id));
  };


  return (
    <NodeWrapper title="Start" icon={Database} type="input" onDelete={onDelete}>
        <Handle
            type="source"
            position={Position.Right}
            style={{
                width: '8px',
                height: '8px',
                background: '#555',
                border: '2px solid white',
            }}
        />
         <div className="space-y-2">
            <Label>Assets</Label>
            {assets.map((asset, index) => (
                 <div key={index} className="flex items-center gap-2">
                    <Input value={asset} onChange={(e) => updateAsset(index, e.target.value)} />
                    {assets.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeAsset(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-1" onClick={addAsset}>
                <PlusCircle className="h-4 w-4 mr-2"/> Add Asset
            </Button>
        </div>
    </NodeWrapper>
  );
};


export const ConditionNode: React.FC<NodeProps> = ({ data, id }) => {
    const { setNodes } = data;
    const onDelete = () => setNodes((nds: any[]) => nds.filter((node) => node.id !== id));

    return (
        <NodeWrapper title="Condition" icon={GitBranch} type="default" onDelete={onDelete}>
            <Handle
                type="target"
                position={Position.Left}
                style={{
                    width: '8px',
                    height: '8px',
                    background: '#555',
                    border: '2px solid white',
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{
                    top: '33%',
                    width: '8px',
                    height: '8px',
                    background: '#555',
                    border: '2px solid white',
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{
                    top: '66%',
                    width: '8px',
                    height: '8px',
                    background: '#555',
                    border: '2px solid white',
                }}
            />

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

export const OutputNode: React.FC<NodeProps> = ({ data, id }) => {
  const { setNodes } = data;
  const onDelete = () => setNodes((nds: any[]) => nds.filter((node) => node.id !== id));

  return (
    <NodeWrapper title="Execute" icon={Terminal} type="output" onDelete={onDelete}>
        <Handle
            type="target"
            position={Position.Left}
            style={{
                width: '8px',
                height: '8px',
                background: '#555',
                border: '2px solid white',
            }}
        />
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
