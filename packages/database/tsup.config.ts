import { defineConfig, Options } from "tsup";
import { node } from "tsup-config";

export default defineConfig((options: Options) => ({
  entry: ["./client.ts"],
  ...node,
  ...options,
}));
