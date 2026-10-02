import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.ts"],
  unbundle: true,
  format: "esm",
  platform: "node",
  sourcemap: true,
  clean: true,
  dts: false,
  copy: [
    { from: "src/views", to: "dist/views" },
    { from: "src/public", to: "dist/public" },
  ]
});
