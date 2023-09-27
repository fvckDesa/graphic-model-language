import type { ClassState } from "./state";
import { NodeProps, Handle, Position } from "api";
import {
  stringifyAttribute,
  stringifyConstructor,
  stringifyMethod,
} from "@/core/utils";

function Class({ state }: NodeProps<ClassState>) {
  return (
    <>
      <Handle type="source" id="top" position={Position.Top} />
      <Handle type="source" id="left" position={Position.Left} />
      <div className="uml-h-full uml-w-full uml-min-w-[220px] uml-cursor-pointer uml-overflow-hidden uml-rounded-lg uml-bg-white uml-font-medium uml-border-2 uml-border-red-400">
        <h1 className="uml-border-b-2 uml-border-red-400 uml-bg-red-200 uml-p-2 uml-text-center uml-text-lg uml-font-semibold">
          {state.name}
        </h1>
        <ul className="uml-min-h-[50px] uml-border-b-2 uml-border-red-400 uml-p-2 uml-transition-all">
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
            <li key={`${method.name}-${idx}`}>{stringifyMethod(method)}</li>
          ))}
        </ul>
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} />
      <Handle type="source" id="right" position={Position.Right} />
    </>
  );
}

export default Class;
