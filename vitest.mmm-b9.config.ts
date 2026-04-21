/**
 * Vitest configuration for MMM Wave B9 — Golden Path Verification.
 *
 * Wave Slug: mmm-build-wave-b9-golden-path-verification
 * Issue:     maturion-isms#1428
 * Builder:   qa-builder
 * Date:      2026-04-26
 *
 * Golden paths covered: GP-001 through GP-010
 * Anti-regression obligations: NBR-001, NBR-002, NBR-003, CG-001
 * ALL-176-GREEN: all prior wave tests run via separate configs before B9
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b9.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['modules/MMM/tests/B9-golden-path/**/*.test.ts'],
    globals: true,
    reporters: ['verbose'],
  },
});
