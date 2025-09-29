
"use client";

import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface CustomNodeData {
  label: string;
  icon: LucideIcon;
  isExpanded: boolean;
}

export const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, isConnectable, id }) => {
  const { label, icon: Icon, isExpanded } = data;
  const [assetFields, setAssetFields] = useState(['']);

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleAddAsset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAssetFields(prev => [...prev, '']);
  }
  
  const handleAssetChange = (index: number, value: string) => {
    const newFields = [...assetFields];
    newFields[index] = value;
    setAssetFields(newFields);
  };

  return (
    <Card className="shadow-lg w-52 bg-card border-2 border-primary/20">
      {/* The 'nodrag' class on the CardHeader makes the entire node draggable via its header */}
      <CardHeader className="nodrag flex flex-row items-center justify-between p-3 space-y-0 cursor-move">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {label}
        </CardTitle>
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          className="!bg-primary"
        />
      </CardHeader>
      {isExpanded && (
        <CardContent className="p-3 pt-0" onClick={handleStopPropagation}>
          <div className="space-y-2 text-xs">
            {assetFields.map((field, index) => (
                 <div key={index} className="space-y-1">
                    <Label htmlFor={`asset-name-${id}-${index}`}>Asset Name</Label>
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
