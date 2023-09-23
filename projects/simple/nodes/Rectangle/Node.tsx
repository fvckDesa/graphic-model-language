import type { RectangleState } from "./state";
import { NodeProps, Handle, Position } from "api";

function Rectangle({ state }: NodeProps<RectangleState>) {
  return (
    <>
      <Handle type="source" id="top" position={Position.Top} />
      <div className="simple-flex simple-items-center simple-justify-center simple-rounded simple-border simple-border-slate-500 simple-bg-white simple-px-6 simple-py-4">
        {state.content}
      </div>
      <Handle type="source" id="bottom" position={Position.Bottom} />
    </>
  );
}

export default Rectangle;
