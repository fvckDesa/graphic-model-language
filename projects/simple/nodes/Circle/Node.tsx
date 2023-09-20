import type { CircleState } from "./state";
import type { NodeProps } from "api";

function Circle({ state }: NodeProps<CircleState>) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-full border border-slate-500 bg-white p-6">
      {state.content}
    </div>
  );
}

export default Circle;
