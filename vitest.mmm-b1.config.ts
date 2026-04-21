/**
 * Vitest configuration for MMM Wave B1 — Schema, RLS, and Migrations.
 * Test domains D9 (T-MMM-S6-139–T-MMM-S6-152) and D10 (T-MMM-S6-153–T-MMM-S6-164).
 *
 * Wave Slug: mmm-build-wave-b1-schema
 * Issue: maturion-isms#1428
 * Builder: schema-builder
 * Date: 2026-04-20
 *
 * Usage:
 *   node_modules/.bin/vitest run --config vitest.mmm-b1.config.ts
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'modules/MMM/tests/B1-schema/**/*.test.ts',
    ],
    globals: true,
    reporters: ['verbose'],
  },
});
