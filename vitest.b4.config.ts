import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      // Source-contract suite (repo-root executable).
      'modules/MMM/tests/B4-framework/b4-framework.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
    environment: 'jsdom',
  },
});
