import { defineConfig, Options } from "tsup";
import { react } from "tsup-config";

export default defineConfig((options: Options) => ({
  entry: ["./src/index.ts"],
  ...react,
  ...options,
}));
