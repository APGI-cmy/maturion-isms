import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modules/MMM/tests/B4-framework/migration-baseline-reconciliation.test.ts'],
    globals: true,
    reporters: ['verbose'],
  },
});