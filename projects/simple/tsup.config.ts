import { defineConfig, Options } from "tsup";
import { react } from "tsup-config";

export default defineConfig((options: Options) => ({
  entry: ["./index.ts"],
  banner: {
    js: '"use client"',
  },
  platform: "browser",
  ...react,
  ...options,
}));
