import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

interface EditorState {
  nodes: Node[];
  edges: Edge[];
}

interface EditorActions {
  addNodes: (nodes: Node[]) => void;
  changeNodes: (changes: NodeChange[]) => void;
  changeEdges: (changes: EdgeChange[]) => void;
  connect: (connection: Connection) => void;
}

export const useEditor = create<EditorState & EditorActions>((set, get) => ({
  nodes: [],
  edges: [],
  addNodes: (nodes: Node[]) => {
    set({
      nodes: get().nodes.concat(nodes),
    });
  },
  changeNodes: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  changeEdges: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  connect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));
