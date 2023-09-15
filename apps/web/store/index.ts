"use client";
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
  active: string | null;
}

interface EditorActions {
  addNodes: (nodes: Node[]) => void;
  changeNodes: (changes: NodeChange[]) => void;
  changeEdges: (changes: EdgeChange[]) => void;
  connect: (connection: Connection) => void;
  setActive: (id: string | null) => void;
  updateActiveState: (state: object) => void;
}

export const useEditor = create<EditorState & EditorActions>((set, get) => ({
  nodes: [],
  edges: [],
  active: null,
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
  setActive: (id) => {
    set({ active: !id || get().active === id ? null : id });
  },
  updateActiveState: (state) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === get().active) {
          node.data = state;
        }

        return node;
      }),
    });
  },
}));
