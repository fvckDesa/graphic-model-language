import { ComponentType } from "react";
import { NodeProps as ReactFlowNodeProps } from "reactflow";
import { NodeProps } from "projects";

export function withNodeWrapper(WrappedComponent: ComponentType<NodeProps>) {
  return function NodeWrapper({ data }: ReactFlowNodeProps) {
    return <WrappedComponent state={data} />;
  };
}
