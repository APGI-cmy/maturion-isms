import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modules/MMM/tests/B4-framework/**/*.test.ts', 'modules/MMM/tests/B4-framework/**/*.test.tsx'],
    globals: true,
    reporters: ['verbose'],
  },
});
