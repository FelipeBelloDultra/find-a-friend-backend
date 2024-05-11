import { defineConfig } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
    include: ["src/**/*.e2e.spec.ts"],
    setupFiles: ["test/database/setup.ts"],
  },
});
