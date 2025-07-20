
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
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { AppHeader } from '@/components/shared/AppHeader';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Menu,
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
    { type: 'trigger', label: 'Start Trigger', icon: Zap },
    { type: 'condition', label: 'If/Else Condition', icon: GitBranch },
    { type: 'wire', label: 'Wire', icon: Share2 },
    { type: 'buy', label: 'Execute Buy', icon: CheckCircle, className: "bg-green-500 text-white" },
    { type: 'sell', label: 'Execute Sell', icon: XCircle, className: "bg-red-500 text-white" },
    { type: 'output', label: 'End Flow', icon: ArrowRight },
];


let id = 2;
const getId = () => `${id++}`;

const NodePalette = ({ onNodeClick }: { onNodeClick: (type: string) => void }) => {
    const onDragStart = (event: DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="p-4 flex flex-col space-y-4">
            {nodeTypes.map((node) => {
                const Icon = node.icon;
                return (
                <div
                    key={node.type}
                    onClick={() => onNodeClick(node.type)}
                    onDragStart={(event) => onDragStart(event, node.type)}
                    draggable
                    className={cn("p-3 border rounded-md cursor-pointer flex items-center gap-2 transition-colors hover:shadow-md hover:border-primary", node.className)}
                >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{node.label}</span>
                </div>
                )
            })}
        </div>
    )
}

const NocodeAlgoEditor = () => {
    const { user } = useAuth();
    const isRealMode = user?.id === 'REAL456';
    const [activeMode, setActiveMode] = useState<'Fiat' | 'Crypto'>(isRealMode ? 'Crypto' : 'Fiat');
    const { toast } = useToast();
    
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>([]);
    
    const reactFlowInstance = useReactFlow();

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

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: Node = {
            id: getId(),
            type: 'default',
            position,
            data: { label: `${nodeInfo.label}` },
        };

        setNodes((nds) => nds.concat(newNode));
    };

    const handleNodeClick = (type: string) => {
      const nodeInfo = nodeTypes.find(n => n.type === type);
      if (!nodeInfo) return;

      const { x, y } = reactFlowInstance.getViewport();
      const position = {
        x: -x + reactFlowInstance.width / 2 - 75, // Center horizontally
        y: -y + reactFlowInstance.height / 2 - 20, // Center vertically
      };

      const newNode: Node = {
        id: getId(),
        type: 'default',
        position,
        data: { label: nodeInfo.label },
      };

      setNodes((nds) => nds.concat(newNode));
    };


  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader activeMode={activeMode} onModeChange={setActiveMode} isRealMode={isRealMode} />
        <main className="flex-grow flex flex-row overflow-hidden">
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

                <div className="absolute top-4 left-4">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open Nodes Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle className="text-lg">Nodes</SheetTitle>
                            </SheetHeader>
                            <NodePalette onNodeClick={handleNodeClick} />
                        </SheetContent>
                    </Sheet>
                </div>
                
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
  );
}

export default function NocodeAlgoPage() {
    return (
        <ProtectedRoute>
            <ReactFlowProvider>
                <NocodeAlgoEditor />
            </ReactFlowProvider>
        </ProtectedRoute>
    );
}
