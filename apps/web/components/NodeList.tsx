"use client";
import { useProject } from "@/contexts/project";
import { DragEvent, PropsWithChildren } from "react";
import { Value } from "@sinclair/typebox/value";
import { cn } from "cn";
import { NodeDef } from "projects";
import { GenericState } from "api";

interface NodeListProps {
  className?: string;
}

export default function NodeList({ className }: NodeListProps) {
  const { project } = useProject();

  return (
    <ul className={cn(className)}>
      {Object.entries<NodeDef>(project).map(([name, { schema }]) => (
        <DragNode key={name} type={name} state={Value.Create(schema)}>
          {name}
        </DragNode>
      ))}
    </ul>
  );
}

interface DragNodeProps {
  type: string;
  state: GenericState;
}

function DragNode({ type, state, children }: PropsWithChildren<DragNodeProps>) {
  function onDragStart(e: DragEvent) {
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.setData("application/node", JSON.stringify({ type, state }));
  }

  return (
    <li
      className="mb-2 flex cursor-grab items-center justify-center border border-gray-400 px-3 py-1"
      onDragStart={onDragStart}
      draggable
    >
      {children}
    </li>
  );
}
