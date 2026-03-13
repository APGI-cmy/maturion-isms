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
    env: {
      // Normalize VITE_LIVE_DEPLOYMENT_URL: trim() removes leading/trailing
      // whitespace (including \n, \r from copy-pasted secrets), then strip
      // trailing slash so fetch(`${liveUrl}/`) produces a valid URL (T-W13-E2E-1/2/4/5 fix).
      VITE_LIVE_DEPLOYMENT_URL: (process.env.VITE_LIVE_DEPLOYMENT_URL ?? '').trim().replace(/\/$/, ''),
    },
  },
});
