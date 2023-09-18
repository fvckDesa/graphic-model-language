import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import { StateCreator } from "zustand";

export interface EditorState {
  nodes: Node[];
  edges: Edge[];
}

export interface EditorActions {
  addNodes: (nodes: Node[]) => void;
  changeNodes: (changes: NodeChange[]) => void;
  changeEdges: (changes: EdgeChange[]) => void;
  connect: (connection: Connection) => void;
}

export type EditorSlice = EditorState & EditorActions;

export const editorSlice: StateCreator<EditorSlice> = (set, get) => ({
  nodes: [],
  edges: [],
  addNodes: (nodes) => {
    set({
      nodes: get().nodes.concat(nodes),
    });
  },
  changeNodes: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  changeEdges: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  connect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
});
