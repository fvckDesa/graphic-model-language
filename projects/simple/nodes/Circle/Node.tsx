import type { CircleState } from "./state";

interface CircleProps {
  state: CircleState;
}

function Circle({ state }: CircleProps) {
  return (
    <div className="flex aspect-square items-center justify-center rounded-full border border-slate-500 bg-white p-6">
      {state.content}
    </div>
  );
}

export default Circle;
