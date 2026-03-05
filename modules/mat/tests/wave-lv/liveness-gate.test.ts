/**
 * MAT Liveness Gate — Red QA
 * Wave: lv
 * File-existence tests that verify all liveness suite artifacts are present.
 *
 * T-LV-GATE-001 through T-LV-GATE-009
 *
 * These tests ARE the QA-to-Red gate:
 *   - Before the liveness suite files are created → ALL 9 FAIL (RED)
 *   - After the liveness suite files are created  → ALL 9 PASS (GREEN)
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const LIVENESS_DIR = path.resolve(process.cwd(), 'modules/mat/tests/liveness');

describe('MAT Liveness Gate — file existence (wave-lv)', () => {
  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-001: mat-liveness.spec.ts must exist
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-001: mat-liveness.spec.ts exists', () => {
    const filePath = path.join(LIVENESS_DIR, 'mat-liveness.spec.ts');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists, '[RED STATE] modules/mat/tests/liveness/mat-liveness.spec.ts does not exist — create liveness suite to turn GREEN').toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-002: mat-ai-health.spec.ts must exist
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-002: mat-ai-health.spec.ts exists', () => {
    const filePath = path.join(LIVENESS_DIR, 'mat-ai-health.spec.ts');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists, '[RED STATE] modules/mat/tests/liveness/mat-ai-health.spec.ts does not exist — create liveness suite to turn GREEN').toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-003: mat-visual.spec.ts must exist
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-003: mat-visual.spec.ts exists', () => {
    const filePath = path.join(LIVENESS_DIR, 'mat-visual.spec.ts');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists, '[RED STATE] modules/mat/tests/liveness/mat-visual.spec.ts does not exist — create liveness suite to turn GREEN').toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-004: test-criteria-document.pdf fixture must exist
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-004: fixtures/test-criteria-document.pdf exists', () => {
    const filePath = path.join(LIVENESS_DIR, 'fixtures', 'test-criteria-document.pdf');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists, '[RED STATE] modules/mat/tests/liveness/fixtures/test-criteria-document.pdf does not exist — create liveness suite to turn GREEN').toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-005: test-evidence.pdf fixture must exist
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-005: fixtures/test-evidence.pdf exists', () => {
    const filePath = path.join(LIVENESS_DIR, 'fixtures', 'test-evidence.pdf');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists, '[RED STATE] modules/mat/tests/liveness/fixtures/test-evidence.pdf does not exist — create liveness suite to turn GREEN').toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-006: README-LIVENESS.md must exist
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-006: README-LIVENESS.md exists', () => {
    const filePath = path.join(LIVENESS_DIR, 'README-LIVENESS.md');
    const fileExists = fs.existsSync(filePath);
    expect(fileExists, '[RED STATE] modules/mat/tests/liveness/README-LIVENESS.md does not exist — create liveness suite to turn GREEN').toBe(true);
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-007: mat-liveness.spec.ts contains required check IDs
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-007: mat-liveness.spec.ts contains LV-00-01, LV-01-01, LV-05-01, LV-07-01, LV-08-01', () => {
    const filePath = path.join(LIVENESS_DIR, 'mat-liveness.spec.ts');
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      expect(fileExists, '[RED STATE] modules/mat/tests/liveness/mat-liveness.spec.ts does not exist — create liveness suite to turn GREEN').toBe(true);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const requiredIds = ['LV-00-01', 'LV-01-01', 'LV-05-01', 'LV-07-01', 'LV-08-01'];
    for (const id of requiredIds) {
      expect(content, `[RED STATE] mat-liveness.spec.ts is missing check ID: ${id}`).toContain(id);
    }
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-008: mat-ai-health.spec.ts contains required check IDs
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-008: mat-ai-health.spec.ts contains LV-AI-01, LV-AI-02, LV-AI-03', () => {
    const filePath = path.join(LIVENESS_DIR, 'mat-ai-health.spec.ts');
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      expect(fileExists, '[RED STATE] modules/mat/tests/liveness/mat-ai-health.spec.ts does not exist — create liveness suite to turn GREEN').toBe(true);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const requiredIds = ['LV-AI-01', 'LV-AI-02', 'LV-AI-03'];
    for (const id of requiredIds) {
      expect(content, `[RED STATE] mat-ai-health.spec.ts is missing check ID: ${id}`).toContain(id);
    }
  });

  // ─────────────────────────────────────────────────────────────────────
  // T-LV-GATE-009: mat-visual.spec.ts contains required check IDs
  // ─────────────────────────────────────────────────────────────────────
  it('T-LV-GATE-009: mat-visual.spec.ts contains LV-02-05, LV-03-06, LV-05-08', () => {
    const filePath = path.join(LIVENESS_DIR, 'mat-visual.spec.ts');
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      expect(fileExists, '[RED STATE] modules/mat/tests/liveness/mat-visual.spec.ts does not exist — create liveness suite to turn GREEN').toBe(true);
      return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const requiredIds = ['LV-02-05', 'LV-03-06', 'LV-05-08'];
    for (const id of requiredIds) {
      expect(content, `[RED STATE] mat-visual.spec.ts is missing check ID: ${id}`).toContain(id);
    }
  });
});
