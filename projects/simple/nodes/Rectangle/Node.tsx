import type { RectangleState } from "./state";

interface RectangleProps {
  state: RectangleState;
}

function Rectangle({ state }: RectangleProps) {
  return <div>{state.content}</div>;
}

export default Rectangle;
