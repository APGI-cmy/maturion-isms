import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B4-framework/migration-baseline-reconciliation.test.ts',
      'modules/MMM/tests/B4-framework/foundational-profiles-bootstrap.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
