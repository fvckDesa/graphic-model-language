import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  target: "node18",
  entry: ["./client.ts"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  outDir: "build",
  ...options,
}));
