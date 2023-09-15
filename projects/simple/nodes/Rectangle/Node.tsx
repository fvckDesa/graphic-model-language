import type { RectangleState } from "./state";

interface RectangleProps {
  state: RectangleState;
}

function Rectangle({ state }: RectangleProps) {
  return (
    <div className="flex items-center justify-center rounded border border-slate-500 bg-white px-6 py-4">
      {state.content}
    </div>
  );
}

export default Rectangle;
