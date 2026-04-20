/**
 * Vitest configuration for MMM Wave B8 — Cross-Cutting QA.
 * Domains: D5, D7, D8, D9, D10, D11 (T-MMM-S6-098–112, 121–128, 129–176).
 * Wave Slug: mmm-build-wave-b8-cross-cutting
 * Issue: maturion-isms#1428
 * Builder: qa-builder
 * Date: 2026-04-24
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b8.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modules/MMM/tests/B8-cross-cutting/**/*.test.ts'],
    globals: true,
    reporters: ['verbose'],
  },
});
