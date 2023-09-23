import { GenericState } from "./schema";

export { Handle, Position } from "reactflow";

export interface NodeProps<S extends GenericState> {
  state: S;
}
