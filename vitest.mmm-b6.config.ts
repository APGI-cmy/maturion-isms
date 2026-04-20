/**
 * Vitest configuration for MMM Wave B6 — Findings & Reporting.
 * Test domain D4 (T-MMM-S6-081–T-MMM-S6-097).
 *
 * Wave Slug: mmm-build-wave-b6-findings
 * Issue: maturion-isms#1428
 * Builder: ui-builder
 * Date: 2026-04-22
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b6.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B6-findings/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
