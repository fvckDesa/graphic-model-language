import { defineConfig, Options } from "tsup";
import { node } from "./index";

export default defineConfig((options: Options) => ({
  entry: ["./index.ts"],
  ...node,
  ...options,
}));
