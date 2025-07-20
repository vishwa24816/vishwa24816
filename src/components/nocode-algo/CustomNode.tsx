
"use client";

import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface CustomNodeData {
  label: string;
  icon: LucideIcon;
  isExpanded: boolean;
}

export const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data, isConnectable }) => {
  const { label, icon: Icon, isExpanded } = data;

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
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
            <Label htmlFor={`text-${label}`}>Value</Label>
            <Input id={`text-${label}`} placeholder="Enter value..." className="h-8" />
            <Button size="sm" className="w-full h-8 mt-2">Apply</Button>
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
