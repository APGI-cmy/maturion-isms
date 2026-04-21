/**
 * Vitest configuration for MMM Wave B3 — Core UI: Onboarding.
 * Test domain D1 (T-MMM-S6-001–T-MMM-S6-020).
 *
 * Wave Slug: mmm-build-wave-b3-ui
 * Issue: maturion-isms#1428
 * Builder: ui-builder
 * Date: 2026-04-22
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b3.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B3-ui/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
