/**
 * Vitest configuration for Wave 9.6 RED gate tests.
 * xDetect + Risk Management AIMC wiring invariants and smoke tests.
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Wave: 9.6 — Module Integration: xDetect + Risk Management
 * Foreman Session: session-063-20260226
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.wave9.6.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/xdetect/tests/**/*.test.ts',
      'modules/risk-management/tests/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
