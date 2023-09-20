import { defineConfig, Options } from "tsup";
import { browser } from "tsup-config";

export default defineConfig((options: Options) => ({
  entry: ["./src/index.ts"],
  ...browser,
  ...options,
}));
