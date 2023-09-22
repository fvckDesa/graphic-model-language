import type { RectangleState } from "./state";
import type { NodeProps } from "api";

function Rectangle({ state }: NodeProps<RectangleState>) {
  return (
    <div className="simple-flex simple-items-center simple-justify-center simple-rounded simple-border simple-border-slate-500 simple-bg-white simple-px-6 simple-py-4">
      {state.content}
    </div>
  );
}

export default Rectangle;
