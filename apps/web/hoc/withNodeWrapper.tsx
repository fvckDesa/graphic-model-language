import { ComponentType } from "react";
import { NodeProps as ReactFlowNodeProps } from "reactflow";
import { NodeProps, State, StateSchema } from "api";
import { useState, useCallback } from "react";
import StateModal from "@/components/StateModal";
import { useWorkspace } from "@/contexts/workspace";
import { useSchema } from "@/contexts/project";

export function withNodeWrapper(
  WrappedComponent: ComponentType<NodeProps<State<StateSchema>>>
) {
  return function NodeWrapper({ id, type, data }: ReactFlowNodeProps) {
    const schema = useSchema(type);
    const [isOpen, setIsOpen] = useState(false);
    const updateState = useWorkspace((state) => state.updateState);
    const onDoubleClick = useCallback(() => setIsOpen(true), [setIsOpen]);

    const onSubmit = useCallback(
      (state: State<StateSchema>) => {
        updateState(id, state);
      },
      [updateState, id]
    );

    return (
      <div className="h-fit w-fit" onDoubleClick={onDoubleClick}>
        <WrappedComponent state={data} />
        <StateModal
          schema={schema}
          state={data}
          open={isOpen}
          onOpenChange={setIsOpen}
          onSubmit={onSubmit}
        />
      </div>
    );
  };
}
