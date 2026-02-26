/**
 * Vitest configuration for Wave 9.7 RED gate tests.
 * PIT AIMC wiring invariants and smoke tests.
 *
 * Architecture Freeze: ARCH-FREEZE-WAVE9-TRACK-C-20260226
 * Wave: 9.7 — Module Integration: PIT (Penetration Intelligence Tool)
 * Foreman Session: session-063-20260226
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.wave9.7.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/pit/tests/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
