import type { RectangleState } from "./state";
import type { NodeProps } from "api";

function Rectangle({ state }: NodeProps<RectangleState>) {
  return (
    <div className="flex items-center justify-center rounded border border-slate-500 bg-white px-6 py-4">
      {state.content}
    </div>
  );
}

export default Rectangle;
