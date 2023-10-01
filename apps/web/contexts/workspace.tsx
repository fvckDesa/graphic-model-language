"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useCallback,
} from "react";
import { useYAwareness, useYDoc, useYMap } from "zustand-yjs";
import {
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  Connection,
  NodeResetChange,
  EdgeResetChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from "reactflow";
import { SocketIoProvider } from "@/lib/socket-io-provider";
import { GenericState } from "api";
import { Value, ValuePointer } from "@sinclair/typebox/value";
import { io } from "socket.io-client";
import { Session } from "next-auth";

type OnStateUpdate = (id: string, state: GenericState, path: string) => void;
type OnStateDelete = (id: string, path: string) => void;
type OnSubStateCreate = (id: string, state: GenericState, path: string) => void;

interface WorkspaceContextProps {
  nodes: Node<GenericState>[];
  edges: Edge[];
  onlineUsers: Session["user"][];
  changeNodes: OnNodesChange;
  changeEdges: OnEdgesChange;
  connect: OnConnect;
  updateState: OnStateUpdate;
  deleteState: OnStateDelete;
  createSubState: OnSubStateCreate;
}

const WorkspaceContext = createContext<WorkspaceContextProps | null>(null);

interface WorkspaceProviderProps {
  workspaceId: string;
  user: Session["user"];
}

export interface EditorActions {
  changeNodes: (changes: NodeChange[]) => void;
  changeEdges: (changes: EdgeChange[]) => void;
  connect: (connection: Connection) => void;
}

export default function WorkspaceProvider({
  workspaceId,
  user,
  children,
}: PropsWithChildren<WorkspaceProviderProps>) {
  const yDoc = useYDoc(
    "workspace",
    useCallback(
      (doc, startAwareness) => {
        const provider = new SocketIoProvider(
          doc,
          io(`http://localhost:8080/workspace:${workspaceId}`, {
            withCredentials: true,
          })
        );

        provider.awareness.setLocalState(user);

        const stopAwareness = startAwareness(provider);

        window.addEventListener("beforeunload", provider.destroy);

        return () => {
          window.removeEventListener("beforeunload", provider.destroy);
          stopAwareness();
          provider.destroy();
        };
      },
      [workspaceId, user]
    )
  );

  const nodes = useYMap(yDoc.getMap<Node<GenericState>>("nodes"));
  const edges = useYMap(yDoc.getMap<Edge>("edges"));
  const [onlineUsers] = useYAwareness<Session["user"]>(yDoc);

  const changeNodes = useCallback<OnNodesChange>(
    (changes) => {
      if (changes.some((c) => c.type === "reset")) {
        yDoc.transact(() => {
          yDoc.getMap<Node>("nodes").clear();
          const newNodes = changes
            .filter((c): c is NodeResetChange => c.type === "reset")
            .map((c) => c.item);
          for (const node of newNodes) {
            nodes.set(node.id, node);
          }
        });
        return;
      }

      yDoc.transact(() => {
        for (const change of changes) {
          if (!change || change.type === "reset") continue;
          if (change.type === "add") {
            nodes.set(change.item.id, change.item);
            continue;
          }

          const node = nodes.get(change.id);
          if (!node) continue;

          if (change.type === "remove") {
            nodes.delete(change.id);
            continue;
          }

          nodes.set(change.id, updateItem(node, change));
        }
      });
    },
    [yDoc, nodes]
  );

  const changeEdges = useCallback<OnEdgesChange>(
    (changes) => {
      if (changes.some((c) => c.type === "reset")) {
        yDoc.transact(() => {
          yDoc.getMap<Edge>("nodes").clear();
          const newEdges = changes
            .filter((c): c is EdgeResetChange => c.type === "reset")
            .map((c) => c.item);
          for (const edge of newEdges) {
            edges.set(edge.id, edge);
          }
        });
        return;
      }

      yDoc.transact(() => {
        for (const change of changes) {
          if (!change || change.type === "reset") continue;
          if (change.type === "add") {
            edges.set(change.item.id, change.item);
            continue;
          }

          const node = edges.get(change.id);
          if (!node) continue;

          if (change.type === "remove") {
            edges.delete(change.id);
            continue;
          }

          edges.set(change.id, updateItem(node, change));
        }
      });
    },
    [yDoc, edges]
  );

  const connect = useCallback<OnConnect>(
    (connection) => {
      if (!connection.source || !connection.target) return;
      const id = getEdgeId(connection);
      edges.set(id, { ...connection, id, type: "floating" } as Edge);
    },
    [edges]
  );

  const updateState = useCallback<OnStateUpdate>(
    (id, state, path) => {
      const node = nodes.get(id);
      if (!node) return;

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

      nodes.set(id, { ...node, data: newState });
    },
    [nodes]
  );

  const deleteState = useCallback<OnStateDelete>(
    (id, path) => {
      if (path === "") {
        nodes.delete(id);
        return;
      }

      const node = nodes.get(id);
      if (!node) return;
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
        throw new Error("Invalid SubState delete: path not point to an array");
      }

      ValuePointer.Delete(newState, path);

      nodes.set(id, { ...node, data: newState });
    },
    [nodes]
  );

  const createSubState = useCallback<OnSubStateCreate>(
    (id, state, path) => {
      const node = nodes.get(id);
      if (!node) return;
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

      nodes.set(id, { ...node, data: newState });
    },
    [nodes]
  );

  return (
    <WorkspaceContext.Provider
      value={{
        nodes: Array.from(nodes.values()),
        edges: Array.from(edges.values()),
        onlineUsers,
        changeNodes,
        changeEdges,
        connect,
        updateState,
        deleteState,
        createSubState,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);

  if (!ctx) {
    throw new Error("'useWorkspace' need to be wrap in a 'WorkspaceProvider'");
  }

  return ctx;
}

function updateItem(item: any, change: any): any {
  const updateItem = { ...item };
  switch (change.type) {
    case "select": {
      updateItem.selected = change.selected;
      break;
    }
    case "position": {
      if (typeof change.position !== "undefined") {
        updateItem.position = change.position;
      }

      if (typeof change.positionAbsolute !== "undefined") {
        updateItem.positionAbsolute = change.positionAbsolute;
      }

      if (typeof change.dragging !== "undefined") {
        updateItem.dragging = change.dragging;
      }

      if (updateItem.expandParent) {
        throw new Error("Parent is not supported");
      }
      break;
    }
    case "dimensions": {
      if (typeof change.dimensions !== "undefined") {
        updateItem.width = change.dimensions.width;
        updateItem.height = change.dimensions.height;
      }

      if (typeof change.updateStyle !== "undefined") {
        updateItem.style = {
          ...(updateItem.style || {}),
          ...change.dimensions,
        };
      }

      if (typeof change.resizing === "boolean") {
        updateItem.resizing = change.resizing;
      }

      if (updateItem.expandParent) {
        throw new Error("Parent is not supported");
      }
      break;
    }
  }
  return updateItem;
}

function getEdgeId({
  source,
  sourceHandle = "",
  target,
  targetHandle = "",
}: Connection): string {
  return `reactflow__edge-${source}:${sourceHandle}-${target}:${targetHandle}`;
}
