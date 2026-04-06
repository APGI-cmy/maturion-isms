import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts', 'src/migrations/**/*.test.ts'],
    globals: true,
    reporters: ['verbose'],
  },
});
