import { Options } from "tsup";

export const base: Options = {
  treeshake: true,
  splitting: true,
  format: ["esm"],
  dts: true,
  minify: true,
  clean: true,
  outDir: "build",
};

export const browser: Options = {
  ...base,
  target: ["es6"],
};

export const react: Options = {
  ...browser,
  external: ["react"],
};

export const node: Options = {
  ...base,
  target: "node18",
};
