import typescript from "rollup-plugin-typescript2";
import { defineConfig } from "rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import pkg from "./package.json" assert { type: "json" };
import terser from "@rollup/plugin-terser";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
      plugins: [terser()],
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
      esModule: true,
      plugins: [terser()],
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    nodeResolve({
      extensions: [".js", ".ts"],
      moduleDirectories: ["node_modules"],
      preferBuiltins: false,
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: "dist",
          emitDeclarationOnly: false,
        },
      },
      useTsconfigDeclarationDir: true,
    }),
  ],
});
