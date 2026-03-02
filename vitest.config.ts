import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/mat/tests/**/*.test.ts',
      'modules/mat/tests/**/*.test.tsx',
      'packages/ai-centre/src/__tests__/**/*.test.ts',
      'api/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
