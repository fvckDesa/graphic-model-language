import type { InterfaceState } from "./state";
import { NodeProps, Handle, Position } from "api";
import { stringifyInterfaceAttribute, stringifyInterfaceMethod } from "./utils";

function Interface({ state }: NodeProps<InterfaceState>) {
  return (
    <>
      <Handle type="source" id="top" position={Position.Top} />
      <Handle type="source" id="left" position={Position.Left} />
      <div className="uml-h-full uml-w-full uml-min-w-[220px] uml-cursor-pointer uml-overflow-hidden uml-rounded-lg uml-bg-white uml-font-medium uml-border-2 uml-border-gray-400">
        <h1 className="uml-border-b-2 uml-border-gray-400 uml-bg-gray-200 uml-p-2 uml-text-center uml-text-base uml-font-semibold">
          <span>
            {"<<"}interface{">>"}
          </span>
          <br />
          <span className="uml-italic">{state.name}</span>
        </h1>
        <ul className="uml-min-h-[50px] uml-border-b-2 uml-border-gray-400 uml-p-2 uml-transition-all">
          {state.attributes.map((attribute, idx) => (
            <li key={`${attribute.name}-${idx}`}>
              {stringifyInterfaceAttribute(attribute)}
            </li>
          ))}
        </ul>
        <ul className="uml-min-h-[50px] uml-p-2 uml-transition-all">
          {state.methods.map((method, idx) => (
            <li key={`${method.name}-${idx}`}>
              {stringifyInterfaceMethod(method)}
            </li>
          ))}
        </ul>
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} />
      <Handle type="source" id="right" position={Position.Right} />
    </>
  );
}

export default Interface;
