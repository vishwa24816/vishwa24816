
"use client";

import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Play, Zap } from 'lucide-react';
import { InputNode, ConditionNode, OutputNode } from '@/components/nocode-algo/nodes';


const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'inputNode',
    position: { x: 50, y: 100 }, 
    data: { label: 'Market Data' } 
  },
  { 
    id: '2', 
    type: 'conditionNode',
    position: { x: 300, y: 100 }, 
    data: { label: 'Condition' } 
  },
  { 
    id: '3', 
    type: 'outputNode',
    position: { x: 550, y: 100 }, 
    data: { label: 'Execute Trade' } 
  },
];

const initialEdges: Edge[] = [];


export function NoCodeAlgoPageContent() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    );
    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    );
    const onConnect: OnConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );
    
    const nodeTypes: NodeTypes = useMemo(() => ({ 
        inputNode: InputNode,
        conditionNode: ConditionNode,
        outputNode: OutputNode,
    }), []);

    return (
        <div className="w-full h-[calc(100vh-140px)] flex flex-col">
            <header className="p-4 border-b flex items-center justify-between">
                <h1 className="text-xl font-bold">No-Code Algo Builder</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Zap className="mr-2 h-4 w-4" /> Backtest</Button>
                    <Button><Play className="mr-2 h-4 w-4" /> Deploy Strategy</Button>
                </div>
            </header>
            <div className="flex-grow">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                >
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
        </div>
    );
}
