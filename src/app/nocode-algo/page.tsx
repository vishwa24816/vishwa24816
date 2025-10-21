
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Play, Zap, Menu, Database, GitBranch, Terminal, Save, Trash2, History } from 'lucide-react';
import { InputNode, ConditionNode, OutputNode } from '@/components/nocode-algo/nodes';
import type { MainView } from '../page';


const initialNodes: Node[] = [
  { 
    id: '1', 
    type: 'inputNode',
    position: { x: 250, y: 150 }, 
    data: { label: 'Start' } 
  },
];

const initialEdges: Edge[] = [];

let id = 2;
const getId = () => `${id++}`;

interface SavedStrategy {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
}

interface NoCodeAlgoPageContentProps {
  onNavigate: (view: MainView) => void;
}

export function NoCodeAlgoPageContent({ onNavigate }: NoCodeAlgoPageContentProps) {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [newStrategyName, setNewStrategyName] = useState('');
    const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);

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
    
    // Pass setNodes to custom nodes so they can delete themselves
    const nodeTypes: NodeTypes = useMemo(() => ({ 
        inputNode: (props: any) => <InputNode {...props} data={{ ...props.data, setNodes }} />,
        conditionNode: (props: any) => <ConditionNode {...props} data={{ ...props.data, setNodes }} />,
        outputNode: (props: any) => <OutputNode {...props} data={{ ...props.data, setNodes }} />,
    }), []);
    
    const addNode = (type: 'inputNode' | 'conditionNode' | 'outputNode') => {
        const newNode: Node = {
            id: getId(),
            type,
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 200 + 100,
            },
            data: { label: `${type.replace('Node', '')}`, setNodes },
        };
        setNodes((nds) => nds.concat(newNode));
    };
    
    const handleSaveStrategy = () => {
        if (!newStrategyName.trim()) {
            toast({ title: 'Error', description: 'Please enter a name for your strategy.', variant: 'destructive'});
            return;
        }
        const newStrategy: SavedStrategy = {
            id: `strategy-${Date.now()}`,
            name: newStrategyName,
            nodes,
            edges,
        };
        setSavedStrategies(prev => [...prev, newStrategy]);
        setNewStrategyName('');
        setIsSaveDialogOpen(false);
        toast({ title: 'Strategy Saved!', description: `"${newStrategy.name}" has been saved.`});
    };
    
    const deleteStrategy = (strategyId: string) => {
        setSavedStrategies(prev => prev.filter(s => s.id !== strategyId));
        toast({ title: 'Strategy Deleted', variant: 'destructive'});
    }
    
    const deployStrategy = (strategyName: string) => {
        toast({ title: 'Deploying Strategy (Mock)', description: `"${strategyName}" is being deployed.`});
    }

    const backtestStrategy = (strategyName: string) => {
        onNavigate('backtester');
    }

    return (
        <div className="w-full h-[calc(100vh-60px)] flex flex-col">
            <header className="p-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[320px]">
                            <SheetHeader>
                                <SheetTitle>Algo Builder</SheetTitle>
                            </SheetHeader>
                            <Accordion type="multiple" defaultValue={['nodes', 'saved']} className="w-full mt-4">
                                <AccordionItem value="nodes">
                                    <AccordionTrigger>Nodes</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-1">
                                            <li><Button variant="ghost" className="w-full justify-start" onClick={() => addNode('inputNode')}><Database className="mr-2 h-4 w-4"/>Start</Button></li>
                                            <li><Button variant="ghost" className="w-full justify-start" onClick={() => addNode('conditionNode')}><GitBranch className="mr-2 h-4 w-4"/>Condition</Button></li>
                                            <li><Button variant="ghost" className="w-full justify-start" onClick={() => addNode('outputNode')}><Terminal className="mr-2 h-4 w-4"/>Execute</Button></li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                 <AccordionItem value="saved">
                                    <AccordionTrigger>Saved Strategies</AccordionTrigger>
                                    <AccordionContent>
                                        {savedStrategies.length === 0 ? (
                                             <p className="text-sm text-muted-foreground p-2">No saved strategies yet.</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {savedStrategies.map(strategy => (
                                                    <div key={strategy.id} className="p-2 rounded-md border bg-background/50">
                                                        <p className="font-medium text-sm">{strategy.name}</p>
                                                        <div className="flex items-center gap-1 mt-2">
                                                            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => deployStrategy(strategy.name)}><Play className="h-3 w-3 mr-1"/> Deploy</Button>
                                                            <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => backtestStrategy(strategy.name)}><History className="h-3 w-3 mr-1"/> Backtest</Button>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-destructive" onClick={() => deleteStrategy(strategy.id)}><Trash2 className="h-4 w-4"/></Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-lg font-bold hidden sm:block">No-Code Algo Builder</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsSaveDialogOpen(true)}><Save className="mr-2 h-4 w-4" /> Save Strategy</Button>
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
             <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save Strategy</DialogTitle>
                        <DialogDescription>
                            Give your new trading algorithm a name.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="strategy-name">Strategy Name</Label>
                        <Input
                            id="strategy-name"
                            value={newStrategyName}
                            onChange={(e) => setNewStrategyName(e.target.value)}
                            placeholder="e.g., Golden Crossover on NIFTY"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsSaveDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveStrategy}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

    
