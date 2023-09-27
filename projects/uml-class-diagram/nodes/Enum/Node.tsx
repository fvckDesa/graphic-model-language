import type { EnumState } from "./state";
import { NodeProps, Handle, Position } from "api";
import { stringifyEnumLiteral } from "./utils";

function Enum({ state }: NodeProps<EnumState>) {
  return (
    <>
      <Handle type="source" id="top" position={Position.Top} />
      <Handle type="source" id="left" position={Position.Left} />
      <div className="uml-h-full uml-w-full uml-min-w-[220px] uml-cursor-pointer uml-overflow-hidden uml-rounded-lg uml-bg-white uml-font-medium uml-border-2 uml-border-green-400">
        <h1 className="uml-border-b-2 uml-border-green-400 uml-bg-green-200 uml-p-2 uml-text-center uml-text-base uml-font-semibold">
          <span>
            {"<<"}enumeration{">>"}
          </span>
          <br />
          <span>{state.name}</span>
        </h1>
        <ul className="uml-p-2 uml-min-h-[50px]">
          {state.literals.map((literal, idx) => (
            <li key={`${literal.name}-${idx}`}>
              {stringifyEnumLiteral(literal)}
            </li>
          ))}
        </ul>
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} />
      <Handle type="source" id="right" position={Position.Right} />
    </>
  );
}

export default Enum;
