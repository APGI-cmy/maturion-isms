import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      '../tests/ui-wiring/wave162r-frontend-ux-gaps.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
    environment: 'node',
  },
});
