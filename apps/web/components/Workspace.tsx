"use client";
import { useCallback, DragEvent, useRef } from "react";
import ReactFlow, {
  Background,
  useReactFlow,
  useNodesState,
  useEdgesState,
  OnConnect,
  addEdge,
  Node,
  NodeTypes,
} from "reactflow";

const nodeTypes: NodeTypes = {};

let id = 1;

function getId(): string {
  return String(id++);
}

function Workspace() {
  const { project } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const wrapperRef = useRef<HTMLDivElement>();

  const onConnect = useCallback<OnConnect>(
    (params) => setEdges((edges) => addEdge(params, edges)),
    [setEdges]
  );

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      const jsonNode = e.dataTransfer.getData("application/node");
      const wrapperBounds = wrapperRef.current?.getBoundingClientRect();

      if (!jsonNode || !wrapperBounds) {
        return;
      }

      const node = JSON.parse(jsonNode) as Node;

      const dropPosition = project({
        x: e.clientX - wrapperBounds.left,
        y: e.clientY - wrapperBounds.top,
      });

      setNodes((nodes) =>
        nodes.concat({
          ...node,
          id: getId(),
          position: {
            x: dropPosition.x - node.width / 2,
            y: dropPosition.y - node.height / 2,
          },
        })
      );
    },
    [project, wrapperRef, setNodes]
  );

  return (
    <ReactFlow
      ref={wrapperRef}
      nodeTypes={nodeTypes}
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Background />
    </ReactFlow>
  );
}

export default Workspace;
