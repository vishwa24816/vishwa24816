
"use client";

import React, { useState, useCallback, DragEvent, MouseEvent } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import {
  GitBranch,
  Search,
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Save,
  Play,
  Share2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';


const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Trigger' },
    position: { x: 250, y: 5 },
  },
];

const nodeTypes = [
    { type: 'fetch', label: 'Get Stock Data', icon: Search },
    { type: 'condition', label: 'If/Else Condition', icon: GitBranch },
    { type: 'buy', label: 'Execute Buy', icon: CheckCircle, className: "bg-green-500 text-white" },
    { type: 'sell', label: 'Execute Sell', icon: XCircle, className: "bg-red-500 text-white" },
    { type: 'output', label: 'End Flow', icon: ArrowRight },
];


let id = 2;
const getId = () => `${id++}`;

export default function NocodeAlgoPage() {
    const { user } = useAuth();
    const isRealMode = user?.id === 'REAL456';
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');
    const { toast } = useToast();
    
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    
    const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
    const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
    
    const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), []);

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event: DragEvent) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');
        const nodeInfo = nodeTypes.find(n => n.type === type);
        if (!nodeInfo) return;

        // Adjust for canvas position if necessary (simplified here)
        const position = {
            x: event.clientX - 300, // Adjust for sidebar width
            y: event.clientY - 100, // Adjust for header height
        };

        const newNode: Node = {
            id: getId(),
            type: 'default',
            position,
            data: { label: `${nodeInfo.label}` },
        };

        setNodes((nds) => nds.concat(newNode));
    };

    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader activeMode={activeMode} onModeChange={setActiveMode} isRealMode={isRealMode} />
        <main className="flex-grow flex flex-row overflow-hidden">
            <aside className="w-64 h-full p-4 border-r bg-card flex flex-col space-y-4">
                <h2 className="text-lg font-semibold">Nodes</h2>
                {nodeTypes.map((node) => {
                   const Icon = node.icon;
                   return (
                    <div
                        key={node.type}
                        onDragStart={(event) => onDragStart(event, node.type)}
                        draggable
                        className={cn("p-3 border rounded-md cursor-grab flex items-center gap-2 transition-colors hover:shadow-md hover:border-primary", node.className)}
                    >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{node.label}</span>
                    </div>
                   )
                })}
            </aside>
            <div className="flex-grow h-full relative" onDrop={onDrop} onDragOver={onDragOver}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Background />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
                <div className="absolute top-4 right-4 flex space-x-2">
                    <Button onClick={() => toast({title: "Flow Saved (Mock)"})}>
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                    <Button onClick={() => toast({title: "Executing Flow (Mock)"})}>
                        <Play className="mr-2 h-4 w-4" /> Run
                    </Button>
                    <Button variant="outline">
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
