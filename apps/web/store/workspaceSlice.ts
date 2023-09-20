import { StateCreator } from "zustand";
import { EditorSlice } from "./editorSlice";

export interface WorkspaceState {}

export interface WorkspaceAction {
  updateState: (id: string, state: object) => void;
}

export type WorkspaceSlice = WorkspaceState & WorkspaceAction;

export const workspaceSlice: StateCreator<
  WorkspaceSlice & EditorSlice,
  [],
  [],
  WorkspaceSlice
> = (set, get) => ({
  updateState: (id, state) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          node.data = state;
        }

        return node;
      }),
    });
  },
});
