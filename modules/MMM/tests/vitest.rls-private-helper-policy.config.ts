import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modules/MMM/tests/B1-schema/rls-private-helper-policy-reconciliation.test.ts'],
    globals: true,
    reporters: ['verbose'],
  },
});
