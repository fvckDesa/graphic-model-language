import type { AbstractState } from "./state";
import { NodeProps, Handle, Position } from "api";
import {
  stringifyAttribute,
  stringifyConstructor,
  stringifyMethod,
} from "@/core/utils";
import { cn } from "cn";

function Abstract({ state }: NodeProps<AbstractState>) {
  return (
    <>
      <Handle type="source" id="top" position={Position.Top} />
      <Handle type="source" id="left" position={Position.Left} />
      <div className="uml-h-full uml-w-full uml-min-w-[220px] uml-cursor-pointer uml-overflow-hidden uml-rounded-lg uml-bg-white uml-font-medium uml-border-2 uml-border-blue-400">
        <h1 className="uml-border-b-2 uml-border-blue-400 uml-bg-blue-200 uml-p-2 uml-text-center uml-text-base uml-font-semibold">
          <span>
            {"<<"}abstract{">>"}
          </span>
          <br />
          <span className="uml-italic">{state.name}</span>
        </h1>
        <ul className="uml-min-h-[50px] uml-border-b-2 uml-border-blue-400 uml-p-2 uml-transition-all">
          {state.attributes.map((attribute, idx) => (
            <li key={`${attribute.name}-${idx}`}>
              {stringifyAttribute(attribute)}
            </li>
          ))}
        </ul>
        <ul className="uml-min-h-[50px] uml-p-2 uml-transition-all">
          {state.constructors.map((constructor, idx) => (
            <li key={idx}>{stringifyConstructor(state.name, constructor)}</li>
          ))}
          {state.methods.map((method, idx) => (
            <li
              key={`${method.name}-${idx}`}
              className={cn({ "uml-italic": method.abstract })}
            >
              {stringifyMethod(method)}
            </li>
          ))}
        </ul>
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} />
      <Handle type="source" id="right" position={Position.Right} />
    </>
  );
}

export default Abstract;
