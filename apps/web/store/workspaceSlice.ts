import { StateCreator } from "zustand";
import { EditorSlice } from "./editorSlice";
import { Value, ValuePointer } from "@sinclair/typebox/value";
import { GenericState } from "api";

export interface WorkspaceState {}

export interface WorkspaceAction {
  updateState: (id: string, state: GenericState, path: string) => void;
  deleteState: (id: string, path: string) => void;
  createSubState: (id: string, state: GenericState, path: string) => void;
}

export type WorkspaceSlice = WorkspaceState & WorkspaceAction;

export const workspaceSlice: StateCreator<
  WorkspaceSlice & EditorSlice,
  [],
  [],
  WorkspaceSlice
> = (set, get) => ({
  updateState: (id, state, path) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          let newState = Value.Clone(node.data);

          if (!ValuePointer.Has(newState, path)) {
            console.debug("State: ", newState);
            console.debug("Path: ", path);
            throw new Error("Invalid State update: invalid path");
          }

          if (path === "") {
            newState = { ...newState, ...state };
          } else {
            ValuePointer.Set(newState, path, state);
          }

          return { ...node, data: newState };
        }

        return node;
      }),
    });
  },
  createSubState: (id, state, path) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          const newState = Value.Clone(node.data);

          if (!ValuePointer.Has(newState, path)) {
            console.debug("State: ", newState);
            console.debug("Path: ", path);
            throw new Error("Invalid SubState creation: invalid path");
          }

          const arr = ValuePointer.Get(newState, path);

          if (!Array.isArray(arr)) {
            console.debug("State: ", newState);
            console.debug("Path: ", path);
            throw new Error(
              "Invalid SubState creation: path not point to an array"
            );
          }

          ValuePointer.Set(newState, `${path}/${arr.length}`, state);
          return { ...node, data: newState };
        }

        return node;
      }),
    });
  },
  deleteState: (id, path) => {
    if (path === "") {
      get().changeNodes([{ type: "remove", id }]);
    } else {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === id) {
            const newState = Value.Clone(node.data);

            if (!ValuePointer.Has(newState, path)) {
              console.debug("State: ", newState);
              console.debug("Path: ", path);
              throw new Error("Invalid SubState delete: invalid path");
            }

            const arr = ValuePointer.Get(
              newState,
              path.slice(0, path.lastIndexOf("/"))
            );

            if (!Array.isArray(arr)) {
              console.debug("State: ", newState);
              console.debug("Path: ", path);
              throw new Error(
                "Invalid SubState delete: path not point to an array"
              );
            }

            ValuePointer.Delete(newState, path);

            return { ...node, data: newState };
          }
          return node;
        }),
      });
    }
  },
});
