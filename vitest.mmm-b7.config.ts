/**
 * Vitest configuration for MMM Wave B7 — Boundary Integrations.
 * Test domains D5 (T-MMM-S6-098–112) and D7 (T-MMM-S6-121–128).
 *
 * Wave Slug: mmm-build-wave-b7-boundary-integrations
 * Issue: maturion-isms#1428
 * Builder: integration-builder
 * Date: 2026-04-25
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b7.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B7-integrations/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
