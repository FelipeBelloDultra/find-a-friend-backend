import { defineConfig } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      include: [
        "src/domain/**/enterprise/**",
        "src/domain/**/application/use-cases/**",
        "!src/domain/**/application/use-cases/factories/**",
      ],
    },
    include: ["src/**/*.spec.ts", "!src/**/*.e2e.spec.ts"],
  },
});
