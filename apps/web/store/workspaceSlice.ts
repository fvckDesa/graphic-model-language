import { StateCreator } from "zustand";
import { EditorSlice } from "./editorSlice";

export interface WorkspaceState {
  active: string;
}

export interface WorkspaceState {
  setActive: (id: string) => void;
  updateActiveState: (state: object) => void;
}

export type WorkspaceSlice = WorkspaceState & WorkspaceState;

export const workspaceSlice: StateCreator<
  WorkspaceSlice & EditorSlice,
  [],
  [],
  WorkspaceSlice
> = (set, get) => ({
  active: "",
  setActive: (id) => {
    set({ active: !id || get().active === id ? "" : id });
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
});
