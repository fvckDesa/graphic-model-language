"use client";
import { PropsWithChildren, createContext, useContext, useMemo } from "react";
import { createStore, StoreApi } from "zustand/vanilla";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import {
  EditorSlice,
  WorkspaceSlice,
  editorSlice,
  workspaceSlice,
} from "@/store";

type WorkspaceState = WorkspaceSlice & EditorSlice;

const WorkspaceContext = createContext<StoreApi<WorkspaceState> | null>(null);

interface WorkspaceProviderProps {
  workspaceId: string;
}

export default function WorkspaceProvider({
  workspaceId,
  children,
}: PropsWithChildren<WorkspaceProviderProps>) {
  const store = useMemo(
    () =>
      createStore<WorkspaceSlice & EditorSlice>((set, get, api) => ({
        ...editorSlice(set, get, api),
        ...workspaceSlice(set, get, api),
      })),
    []
  );

  return (
    <WorkspaceContext.Provider value={store}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceState;
export function useWorkspace<U>(selector: (state: WorkspaceState) => U): U;
export function useWorkspace(selector?: (state: WorkspaceState) => unknown) {
  const store = useContext(WorkspaceContext);

  if (!store) {
    throw new Error("'useWorkspace' need to be wrap in a 'WorkspaceProvider'");
  }

  return useStoreWithEqualityFn(store, selector ?? store.getState, shallow);
}
