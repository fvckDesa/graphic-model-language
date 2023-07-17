"use client";

import { DragEvent, HTMLAttributes } from "react";

interface DragElementProps extends HTMLAttributes<HTMLDivElement> {
  data: unknown;
  type?: string;
}

function DragElement({
  data,
  type = "text/plain",
  children,
  ...divProps
}: DragElementProps) {
  function onDragStart(e: DragEvent) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData(type, JSON.stringify(data));
  }

  return (
    <div onDragStart={onDragStart} draggable {...divProps}>
      {children}
    </div>
  );
}

export default DragElement;
