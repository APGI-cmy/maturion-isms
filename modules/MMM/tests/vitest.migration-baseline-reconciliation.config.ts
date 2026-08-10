import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B4-framework/migration-baseline-reconciliation.test.ts',
      'modules/MMM/tests/B4-framework/foundational-profiles-bootstrap.test.ts',
      'modules/MMM/tests/B4-framework/criteria-provenance-bootstrap.test.ts',
      'modules/MMM/tests/B4-framework/audit-model-prerequisites-bootstrap.test.ts',
      'modules/MMM/tests/B4-framework/mmm-native-migrations-bootstrap.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
