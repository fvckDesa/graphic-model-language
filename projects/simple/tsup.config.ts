import { defineConfig, Options } from "tsup";
import { react } from "tsup-config";
import PostcssPlugin from "esbuild-postcss";

type Plugin = NonNullable<Options["esbuildPlugins"]> extends (infer T)[]
  ? T
  : never;

export default defineConfig((options: Options) => ({
  entry: ["./index.ts"],
  esbuildPlugins: [PostcssPlugin() as Plugin],
  platform: "browser",
  ...react,
  external: ["react", "api"],
  ...options,
}));
