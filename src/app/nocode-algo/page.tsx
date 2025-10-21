
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, Zap, Menu, Database, GitBranch, Terminal, Save } from 'lucide-react';
import { InputNode, ConditionNode, OutputNode } from '@/components/nocode-algo/nodes';


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
    
    // Pass setNodes to custom nodes so they can delete themselves
    const nodeTypes: NodeTypes = useMemo(() => ({ 
        inputNode: (props: any) => <InputNode {...props} data={{ ...props.data, setNodes }} />,
        conditionNode: (props: any) => <ConditionNode {...props} data={{ ...props.data, setNodes }} />,
        outputNode: (props: any) => <OutputNode {...props} data={{ ...props.data, setNodes }} />,
    }), [setNodes]);
    
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

    return (
        <div className="w-full h-[calc(100vh-140px)] flex flex-col">
            <header className="p-2 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px]">
                            <SheetHeader>
                                <SheetTitle>Algo Builder</SheetTitle>
                            </SheetHeader>
                            <Accordion type="single" collapsible className="w-full mt-4">
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
                                        <p className="text-sm text-muted-foreground p-2">No saved strategies yet.</p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-lg font-bold hidden sm:block">No-Code Algo Builder</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Save className="mr-2 h-4 w-4" /> Save Strategy</Button>
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
