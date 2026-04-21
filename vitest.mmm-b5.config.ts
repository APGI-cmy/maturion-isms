/**
 * Vitest configuration for MMM Wave B5 — Assessment Execution.
 * Test domain D3 (T-MMM-S6-051–T-MMM-S6-080).
 *
 * Wave Slug: mmm-build-wave-b5-assessment
 * Issue: maturion-isms#1428
 * Builder: ui-builder
 * Date: 2026-04-22
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b5.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B5-assessment/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
