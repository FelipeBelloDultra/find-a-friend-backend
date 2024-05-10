import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**", "!test/**", "!**/**/*.spec.*"],
  outDir: "dist",
  clean: true,
  minify: true,
});
