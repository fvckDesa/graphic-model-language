"use client";
import { DragEvent, PropsWithChildren, useCallback, useRef } from "react";
import { useReactFlow } from "reactflow";
import { useEditor } from "@/store";
import { v4 as uuidv4 } from "uuid";

function DropNodeArea({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>();
  const { project: reactFlowProject } = useReactFlow();
  const { changeNodes } = useEditor();

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      const jsonNode = e.dataTransfer.getData("application/node");
      const wrapperBounds = ref.current?.getBoundingClientRect();

      if (!jsonNode || !wrapperBounds) {
        return;
      }

      const { type, state } = JSON.parse(jsonNode) as {
        type: string;
        state: object;
      };

      const position = reactFlowProject({
        x: e.clientX - wrapperBounds.left,
        y: e.clientY - wrapperBounds.top,
      });

      changeNodes([
        {
          type: "add",
          item: {
            id: uuidv4(),
            type,
            data: state,
            position,
          },
        },
      ]);
    },
    [reactFlowProject, ref, changeNodes]
  );

  return (
    <div
      ref={ref}
      className="h-full w-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {children}
    </div>
  );
}

export default DropNodeArea;
