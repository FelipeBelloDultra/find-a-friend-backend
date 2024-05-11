import { defineConfig } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
    include: ["src/**/*.spec.ts", "!src/**/*.e2e.spec.ts"],
  },
});
