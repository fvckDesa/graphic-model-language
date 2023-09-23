"use client";
import { useProject } from "@/contexts/project";
import { DragEvent, PropsWithChildren, useRef, useLayoutEffect } from "react";
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
    <ul
      className={cn(
        "no-handle",
        className,
        "flex flex-wrap justify-center gap-4"
      )}
    >
      {Object.entries<NodeDef>(project).map(([name, { Node, schema }]) => {
        const state = Value.Create(schema);
        return (
          <DragNode key={name} type={name} state={state}>
            <Node state={state} />
          </DragNode>
        );
      })}
    </ul>
  );
}

interface DragNodeProps {
  type: string;
  state: GenericState;
}

function DragNode({ type, state, children }: PropsWithChildren<DragNodeProps>) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;
    applyScale(wrapperRef.current, contentRef.current);
  }, [wrapperRef, contentRef]);

  function onDragStart(e: DragEvent) {
    if (!contentRef.current) return;

    const { width, height } = getComputedStyle(contentRef.current);

    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.setData(
      "application/node",
      JSON.stringify({
        type,
        state,
        size: {
          width: parseFloat(width),
          height: parseFloat(height),
        },
      })
    );
  }

  return (
    <li
      className="h-20 w-20 cursor-grab overflow-hidden rounded border p-1"
      onDragStart={onDragStart}
      draggable
    >
      <div
        ref={wrapperRef}
        className="flex h-full w-full items-center justify-center"
      >
        <span ref={contentRef} className="origin-center">
          {children}
        </span>
      </div>
    </li>
  );
}

function applyScale(wrapper: HTMLElement, content: HTMLElement) {
  content.style.transform = "scale(1, 1)";

  const { width: wrapperWidth, height: wrapperHeight } =
    wrapper.getBoundingClientRect();
  const { width: contentWidth, height: contentHeight } =
    content.getBoundingClientRect();

  const scale = Math.min(
    wrapperWidth / contentWidth,
    wrapperHeight / contentHeight
  );

  content.style.transform = `scale(${scale}, ${scale})`;
}
