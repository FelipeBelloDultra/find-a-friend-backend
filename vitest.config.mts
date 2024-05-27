import { defineConfig } from "vitest/config";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [viteTsConfigPaths()],
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      include: [
        "src/domain/**/enterprise/**",
        "src/domain/**/application/{subscribers,use-cases}/**",
        "!src/domain/**/application/use-cases/factories/**",
        "!src/domain/**/enterprise/events/**",
      ],
    },
    include: ["src/**/*.spec.ts", "!src/**/*.e2e.spec.ts"],
  },
});
