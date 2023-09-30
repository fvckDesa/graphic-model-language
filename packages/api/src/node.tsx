"use client";
import { GenericState } from "./schema";
import { Handle as ReactFlowHandle, HandleProps } from "reactflow";
import { createContext, useContext } from "react";

export { Position } from "reactflow";

export interface NodeProps<S extends GenericState> {
  state: S;
}

export interface HandleContextProps {
  hidden: boolean;
}

export const HandleContext = createContext<HandleContextProps>({
  hidden: false,
});

export function Handle(props: HandleProps) {
  const { hidden } = useContext(HandleContext);

  return hidden ? null : <ReactFlowHandle {...props} />;
}
