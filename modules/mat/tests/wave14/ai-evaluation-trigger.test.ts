/**
 * Wave 14 — AI Evaluation Trigger (T-W14-UX-006)
 *
 * Test ID : T-W14-UX-006
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-094 / TR-094
 *
 * Scenario: User submits evidence for a criteria. The AI evaluation endpoint is
 * called, returns a structured result, and a `criteria_evaluations` row is inserted.
 * Confirm Rating updates status to 'confirmed'. Override creates an override row.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `criteria_evaluations` table does not exist in any migration.
 *   - `evaluation_overrides` table does not exist in any migration.
 *   - AI evaluation endpoint is not implemented.
 *   - Target migration `20260305000004_wave14_evaluations.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-006a: Target migration file exists
 *   T-W14-UX-006b: criteria_evaluations table is created in migration
 *   T-W14-UX-006c: criteria_evaluations has all required columns (proposed_level,
 *                  confidence_score, rationale, findings_summary, status)
 *   T-W14-UX-006d: criteria_evaluations has next_level_guidance and next_plus_one_taster
 *   T-W14-UX-006e: evaluation_overrides table is created in migration
 *   T-W14-UX-006f: evaluation_overrides.justification is NOT NULL (constraint)
 *   T-W14-UX-006g: criteria_evaluations.status includes 'pending_review' and 'confirmed' values
 *
 * References:
 *   FR-094, TR-094
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W06
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');

/**
 * Target Wave 14 evaluations migration.
 * Created by schema-builder AFTER these RED gate tests are submitted.
 */
const TARGET_MIGRATION_FILE = '20260305000004_wave14_evaluations.sql';
const TARGET_MIGRATION_PATH = path.join(MIGRATION_DIR, TARGET_MIGRATION_FILE);

function readTargetMigration(): string {
  const fileExists = fs.existsSync(TARGET_MIGRATION_PATH);
  expect(
    fileExists,
    `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
    `Migration file not found: ${TARGET_MIGRATION_PATH}\n` +
    `schema-builder must create this file to turn these tests GREEN.`
  ).toBe(true);
  return fs.readFileSync(TARGET_MIGRATION_PATH, 'utf-8');
}

describe('T-W14-UX-006 — Submit button triggers AI evaluation and creates criteria_evaluations row (GAP-W06)', () => {

  it('T-W14-UX-006a: Wave 14 evaluations migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-006b: criteria_evaluations table is created in migration', () => {
    // criteria_evaluations stores the AI-generated evaluation for each submitted criteria.
    // One row per criteria per audit (UNIQUE on criteria_id, audit_id).
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.criteria_evaluations (FR-094 — AI evaluation result storage)'
    ).toMatch(/CREATE TABLE.*public\.criteria_evaluations/i);
  });

  it('T-W14-UX-006c: criteria_evaluations has proposed_level, confidence_score, rationale, and findings_summary columns', () => {
    // All four columns are returned by the AI evaluation endpoint and must be persisted.
    // proposed_level: numeric maturity level (1–5).
    // confidence_score: float between 0 and 1.
    // rationale: AI explanation for the proposed level.
    // findings_summary: human-readable summary of evidence findings.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(sql, 'criteria_evaluations must have proposed_level column (TR-094)').toMatch(/proposed_level/i);
    expect(sql, 'criteria_evaluations must have confidence_score column (TR-094)').toMatch(/confidence_score/i);
    expect(sql, 'criteria_evaluations must have rationale column (TR-094)').toMatch(/rationale/i);
    expect(sql, 'criteria_evaluations must have findings_summary column (TR-094)').toMatch(/findings_summary/i);
  });

  it('T-W14-UX-006d: criteria_evaluations has next_level_guidance and next_plus_one_taster columns', () => {
    // next_level_guidance: actionable guidance on how to reach the next level.
    // next_plus_one_taster: preview of the level beyond next.
    // Both are surfaced in the criteria card after evaluation (also tested in T-W14-UX-007).
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_evaluations must have next_level_guidance column (TR-094 — AI guidance surfacing)'
    ).toMatch(/next_level_guidance/i);
    expect(
      sql,
      'criteria_evaluations must have next_plus_one_taster column (TR-094 — AI taster surfacing)'
    ).toMatch(/next_plus_one_taster/i);
  });

  it('T-W14-UX-006e: evaluation_overrides table is created in migration', () => {
    // evaluation_overrides records human override decisions when the Lead Auditor
    // disagrees with the AI proposed level. Each override must have a justification.
    // RED: Table does not exist in any current migration.
    const sql = readTargetMigration();
    expect(
      sql,
      'Migration must CREATE TABLE public.evaluation_overrides (FR-094 — human override of AI evaluation)'
    ).toMatch(/CREATE TABLE.*public\.evaluation_overrides/i);
  });

  it('T-W14-UX-006f: evaluation_overrides.justification is NOT NULL (mandatory justification constraint)', () => {
    // Overrides must always carry a human-written justification. A NOT NULL constraint
    // enforces this at the DB level, preventing overrides without explanation.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'evaluation_overrides.justification must be NOT NULL (TR-094 — override requires justification)'
    ).toMatch(/justification.*NOT\s+NULL|NOT\s+NULL.*justification/i);
  });

  it("T-W14-UX-006g: criteria_evaluations.status includes 'pending_review' and 'confirmed' values", () => {
    // status lifecycle: 'pending_review' on AI insertion, 'confirmed' after human confirmation,
    // 'overridden' when a human override is applied.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      "criteria_evaluations.status must include 'pending_review' value (TR-094)"
    ).toMatch(/pending_review/i);
    expect(
      sql,
      "criteria_evaluations.status must include 'confirmed' value (TR-094)"
    ).toMatch(/confirmed/i);
  });

});
