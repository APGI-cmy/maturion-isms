import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B4-framework/approval-workflow-foundation-red.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
