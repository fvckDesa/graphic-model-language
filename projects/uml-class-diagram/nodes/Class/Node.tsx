import type { ClassState } from "./state";
import type { NodeProps } from "api";

function Class({ state }: NodeProps<ClassState>) {
  return <div>{state.content}</div>;
}

export default Class;
