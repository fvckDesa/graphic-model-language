"use client";
import DropNodeArea from "@/components/DropNodeArea";
import Portal from "@/components/Portal";
import StateModal from "@/components/StateModal";
import { useProjectNodes } from "@/contexts/project";
import { useWorkspace } from "@/contexts/workspace";
import { useCallback } from "react";
import {
  Background,
  NodeMouseHandler,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  ReactFlow,
} from "reactflow";

export default function WorkspacePage() {
  const nodeTypes = useProjectNodes();
  const {
    nodes,
    edges,
    changeNodes,
    changeEdges,
    connect,
    setActive,
    updateActiveState,
  } = useWorkspace();

  const activeNode = useWorkspace((state) =>
    state.nodes.find((node) => node.id === state.active)
  );

  const onNodesChange = useCallback<OnNodesChange>(changeNodes, [changeNodes]);
  const onEdgesChange = useCallback<OnEdgesChange>(changeEdges, [changeEdges]);
  const onConnect = useCallback<OnConnect>(connect, [connect]);
  const onNodeDoubleClick = useCallback<NodeMouseHandler>((_, node) => {
    setActive(node.id);
  }, []);

  function onSubmit(state: object) {
    updateActiveState(state);
    setActive("");
  }

  return (
    <DropNodeArea>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
      >
        <Background />
        {
          <Portal>
            {activeNode && activeNode.type && (
              <StateModal
                nodeType={activeNode.type}
                state={activeNode.data}
                onCancel={() => setActive("")}
                onSubmit={onSubmit}
              />
            )}
          </Portal>
        }
      </ReactFlow>
    </DropNodeArea>
  );
}
