
"use client";

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface CustomNodeData {
  label: string;
  icon: LucideIcon;
  isExpanded: boolean;
}

const ConditionNodeContent = () => {
    const [indicator, setIndicator] = useState('rsi');

    return (
        <div className="space-y-4 text-xs">
            <div className="space-y-2">
                <Label htmlFor="indicator-type">Indicator</Label>
                <Select value={indicator} onValueChange={setIndicator}>
                    <SelectTrigger id="indicator-type" className="h-8">
                        <SelectValue placeholder="Select Indicator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rsi">RSI (Relative Strength Index)</SelectItem>
                        <SelectItem value="macd">MACD (Moving Average Convergence Divergence)</SelectItem>
                        <SelectItem value="sma">SMA (Simple Moving Average)</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="condition-direction">Condition</Label>
                 <Select defaultValue="above">
                    <SelectTrigger id="condition-direction" className="h-8">
                        <SelectValue placeholder="Select Condition" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="above">Is Above</SelectItem>
                        <SelectItem value="below">Is Below</SelectItem>
                        <SelectItem value="crosses_above">Crosses Above</SelectItem>
                        <SelectItem value="crosses_below">Crosses Below</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="indicator-value">Value</Label>
                <Input 
                    id="indicator-value" 
                    placeholder={indicator.toUpperCase() === 'RSI' ? 'e.g., 70' : 'Enter value...'}
                    className="h-8" 
                />
            </div>
             <div className="flex justify-end pt-2">
                <Button size="sm" className="h-8 text-xs">Apply</Button>
            </div>
        </div>
    );
}

const DefaultNodeContent = ({ id }: { id: string }) => {
    const [assetFields, setAssetFields] = useState(['']);

    const handleAddAsset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setAssetFields(prev => [...prev, '']);
    }
    
    const handleAssetChange = (index: number, value: string) => {
        const newFields = [...assetFields];
        newFields[index] = value;
        setAssetFields(newFields);
    };
    
    const handleRemoveAsset = (indexToRemove: number) => {
        setAssetFields(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
         <div className="space-y-2 text-xs">
            {assetFields.map((field, index) => (
                 <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                         <Label htmlFor={`asset-name-${id}-${index}`}>Asset Name</Label>
                         {assetFields.length > 1 && (
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => handleRemoveAsset(index)}>
                                <XCircle className="h-4 w-4"/>
                            </Button>
                         )}
                    </div>
                    <Input 
                        id={`asset-name-${id}-${index}`} 
                        placeholder="Enter asset name..." 
                        className="h-8" 
                        value={field}
                        onChange={(e) => handleAssetChange(index, e.target.value)}
                    />
                </div>
            ))}
            <div className="flex justify-between items-center gap-2 pt-2">
                 <Button size="sm" variant="ghost" className="h-8 text-xs p-2" onClick={handleAddAsset}>
                    <PlusCircle className="h-3.5 w-3.5 mr-1" />
                    Add Asset
                </Button>
                <Button size="sm" className="h-8 text-xs">Apply</Button>
            </div>
          </div>
    )
}

export const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, isConnectable, id }) => {
  const { label, icon: Icon, isExpanded } = data;
  
  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  const isActionNode = label === 'Execute Buy' || label === 'Execute Sell';
  const showContent = isExpanded && !isActionNode;

  return (
    <Card className={cn(
        "shadow-lg w-52 bg-card border-2 border-primary/20",
        label === 'Execute Buy' && 'bg-green-500/90 text-white border-green-700',
        label === 'Execute Sell' && 'bg-red-500/90 text-white border-red-700',
    )}>
      <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0 cursor-move">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {Icon && <Icon className={cn("h-4 w-4", isActionNode ? 'text-white' : 'text-primary')} />}
          {label}
        </CardTitle>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-primary"
        />
      </CardHeader>
      {showContent && (
        <CardContent className="p-3 pt-0" onClick={handleStopPropagation}>
          {label === 'If/Else Condition' ? (
              <ConditionNodeContent />
          ) : (
              <DefaultNodeContent id={id} />
          )}
        </CardContent>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!bg-primary"
      />
    </Card>
  );
};
