import { ComponentType } from "react";
import { NodeProps as ReactFlowNodeProps } from "reactflow";
import { NodeProps, GenericState } from "api";

export function withNodeWrapper(
  WrappedComponent: ComponentType<NodeProps<GenericState>>
) {
  return function NodeWrapper({ data }: ReactFlowNodeProps) {
    return <WrappedComponent state={data} />;
  };
}
