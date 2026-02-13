import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modules/mat/tests/**/*.test.ts'],
    globals: true,
    reporters: ['verbose'],
  },
});
