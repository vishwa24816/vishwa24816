
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
  NodeTypes,
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
import { CustomNode } from '@/components/nocode-algo/CustomNode';
import { SimbotInputBar } from '@/components/simbot/SimbotInputBar';
import type { Stock, InitialOrderDetails } from '@/types';
import { useRouter } from 'next/navigation';


const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Start Trigger', icon: Zap, isExpanded: false },
    position: { x: 250, y: 5 },
  },
];

const nodeConfig = {
    'start-trigger': { label: 'Start Trigger', icon: Zap },
    'condition': { label: 'If/Else Condition', icon: GitBranch },
    'buy': { label: 'Execute Buy', icon: CheckCircle },
    'sell': { label: 'Execute Sell', icon: XCircle },
    'end-flow': { label: 'End Flow', icon: ArrowRight },
};
type NodeTypeKey = keyof typeof nodeConfig;

// Define custom node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

let id = 2;
const getId = () => `${id++}`;

const NodePalette = ({ onNodeClick }: { onNodeClick: (type: NodeTypeKey) => void }) => {
    const onDragStart = (event: DragEvent, nodeType: NodeTypeKey) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="p-4 flex flex-col space-y-4">
            {Object.entries(nodeConfig).map(([type, config]) => {
                const Icon = config.icon;
                return (
                <div
                    key={type}
                    onClick={() => onNodeClick(type as NodeTypeKey)}
                    onDragStart={(event) => onDragStart(event, type as NodeTypeKey)}
                    draggable
                    className={cn("p-3 border rounded-md cursor-pointer flex items-center gap-2 transition-colors hover:shadow-md hover:border-primary")}
                >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{config.label}</span>
                </div>
                )
            })}
        </div>
    )
}

const NocodeAlgoEditor = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    
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

        const type = event.dataTransfer.getData('application/reactflow') as NodeTypeKey;
        const nodeInfo = nodeConfig[type];
        if (!nodeInfo) return;

        const position = reactFlowInstance.screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        const newNode: Node = {
            id: getId(),
            type: 'custom',
            position,
            data: { label: nodeInfo.label, icon: nodeInfo.icon, isExpanded: false },
        };

        setNodes((nds) => nds.concat(newNode));
    };

    const handleNodeClick = (type: NodeTypeKey) => {
      const nodeInfo = nodeConfig[type];
      if (!nodeInfo) return;

      const { x, y } = reactFlowInstance.getViewport();
      const position = {
        x: -x + reactFlowInstance.width / 2 - 100,
        y: -y + reactFlowInstance.height / 2 - 50,
      };

      const newNode: Node = {
        id: getId(),
        type: 'custom',
        position,
        data: { label: nodeInfo.label, icon: nodeInfo.icon, isExpanded: false },
      };

      setNodes((nds) => nds.concat(newNode));
    };

    const onNodeClick = (event: React.MouseEvent, node: Node) => {
        setNodes((prevNodes) =>
            prevNodes.map((n) => {
                if (n.id === node.id) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            isExpanded: !n.data.isExpanded,
                        },
                    };
                }
                return n;
            })
        );
    };
    
    const handleSimbotNavigation = (asset: Stock, details?: InitialOrderDetails) => {
      router.push(`/order/stock/${asset.symbol}`);
    };


  return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <AppHeader />
        <main className="flex-grow flex flex-col overflow-hidden">
            <div className="flex-grow h-full relative" onDrop={onDrop} onDragOver={onDragOver}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                    nodeTypes={nodeTypes}
                    onNodeClick={onNodeClick}
                >
                    <Background />
                    <Controls position="bottom-left"/>
                    <MiniMap position="bottom-left" className="!bg-background !border-border !rounded-md" />
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
             <footer className="bg-background/80 backdrop-blur-sm border-t p-2">
                <SimbotInputBar onNavigateRequest={handleSimbotNavigation} />
            </footer>
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
