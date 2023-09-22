import type { CircleState } from "./state";
import type { NodeProps } from "api";

function Circle({ state }: NodeProps<CircleState>) {
  return (
    <div className="simple-flex simple-aspect-square simple-items-center simple-justify-center simple-rounded-full simple-border simple-border-slate-500 simple-bg-white simple-p-6">
      {state.content}
    </div>
  );
}

export default Circle;
