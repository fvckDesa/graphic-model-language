"use client";
import DropNodeArea from "@/components/DropNodeArea";
import FloatingEdge from "@/components/FloatingEdge";
import { useProjectNodes } from "@/contexts/project";
import { useWorkspace } from "@/contexts/workspace";
import { prisma } from "database/client";
import { Metadata } from "next";
import { useCallback } from "react";
import {
  Background,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
  ConnectionMode,
  EdgeTypes,
} from "reactflow";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = (await prisma.workspace.findUnique({
    where: {
      id: params.id,
    },
  })) ?? { name: "Unknown" };
  return {
    title: name,
  };
}

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

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
        edgeTypes={edgeTypes}
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
