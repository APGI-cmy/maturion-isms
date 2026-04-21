/**
 * Vitest configuration for MMM Wave B2 — Core API Edge Functions.
 * Test domains D6 (T-MMM-S6-113–120), D10 (T-MMM-S6-153–160), D11 (T-MMM-S6-165–176).
 *
 * Wave Slug: mmm-build-wave-b2-core-api
 * Issue: maturion-isms#1428
 * Builder: api-builder
 * Date: 2026-04-21
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b2.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B2-api/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
