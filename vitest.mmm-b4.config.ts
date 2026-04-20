/**
 * Vitest configuration for MMM Wave B4 — Framework Lifecycle.
 * Test domain D2 (T-MMM-S6-021–T-MMM-S6-050).
 *
 * Wave Slug: mmm-build-wave-b4-framework
 * Issue: maturion-isms#1428
 * Builder: ui-builder
 * Date: 2026-04-22
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b4.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B4-framework/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
