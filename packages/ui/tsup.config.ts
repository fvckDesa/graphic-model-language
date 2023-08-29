import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ["./index.tsx"],
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react"],
  outDir: "build",
  ...options,
}));
