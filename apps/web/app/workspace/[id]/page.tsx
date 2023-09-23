"use client";
import DropNodeArea from "@/components/DropNodeArea";
import { useProjectNodes } from "@/contexts/project";
import { useWorkspace } from "@/contexts/workspace";
import { useCallback } from "react";
import {
  Background,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  ConnectionMode,
} from "reactflow";

export default function WorkspacePage() {
  const nodeTypes = useProjectNodes();
  const { nodes, edges, changeNodes, changeEdges, connect } = useWorkspace();

  const onNodesChange = useCallback<OnNodesChange>(changeNodes, [changeNodes]);
  const onEdgesChange = useCallback<OnEdgesChange>(changeEdges, [changeEdges]);
  const onConnect = useCallback<OnConnect>(connect, [connect]);

  return (
    <DropNodeArea>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
      >
        <Background />
      </ReactFlow>
    </DropNodeArea>
  );
}
