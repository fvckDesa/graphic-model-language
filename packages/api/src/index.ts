import { GenericState } from "./schema";
export * from "./schema";

export interface NodeProps<S extends GenericState> {
  state: S;
}
