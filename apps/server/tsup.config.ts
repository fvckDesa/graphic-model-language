import { defineConfig, Options } from "tsup";
import { node } from "tsup-config";

export default defineConfig((options: Options) => ({
  entry: ["./server.ts"],
  ...node,
  ...options,
}));
