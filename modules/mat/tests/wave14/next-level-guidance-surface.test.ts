/**
 * Wave 14 — Next Level Guidance Surface (T-W14-UX-007)
 *
 * Test ID : T-W14-UX-007
 * Wave    : Wave 14 — UX Workflow Gap Remediation
 * Issue   : #909
 * FRS/TRS : FR-095 / TR-095
 *
 * Scenario: After AI evaluation, the criteria card displays the current rating,
 * `next_level_guidance`, and `next_plus_one_taster` sourced from the
 * `criteria_evaluations` row. An "Explore further levels" link is visible.
 *
 * RED STATE (expected before Wave 14 implementation):
 *   - `criteria_evaluations` table does not exist (shared with T-W14-UX-006).
 *   - Criteria card component does not render evaluation data.
 *   - "Explore further levels" link does not exist in the UI.
 *   - Target migration `20260305000004_wave14_evaluations.sql` does not exist.
 *
 * All tests are file-based (no live Supabase env required).
 *
 * Test summary:
 *   T-W14-UX-007a: Target migration file exists
 *   T-W14-UX-007b: criteria_evaluations has next_level_guidance TEXT column
 *   T-W14-UX-007c: criteria_evaluations has next_plus_one_taster TEXT column
 *   T-W14-UX-007d: CriteriaCard component (or equivalent) file exists
 *   T-W14-UX-007e: CriteriaCard renders next_level_guidance (source text check)
 *   T-W14-UX-007f: CriteriaCard renders "Explore further levels" link
 *
 * References:
 *   FR-095, TR-095
 *   modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md §GAP-W07
 */
import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

const MIGRATION_DIR = path.resolve(process.cwd(), 'apps/maturion-maturity-legacy/supabase/migrations');
const SRC_DIR = path.resolve(process.cwd(), 'modules/mat/frontend/src');

/**
 * Shared Wave 14 evaluations migration (also used by T-W14-UX-006).
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

describe('T-W14-UX-007 — Criteria card shows next-level guidance and taster after evaluation (GAP-W07)', () => {

  it('T-W14-UX-007a: Wave 14 evaluations migration file exists', () => {
    // RED: Migration file does not exist before Wave 14 implementation.
    readTargetMigration();
  });

  it('T-W14-UX-007b: criteria_evaluations has next_level_guidance TEXT column in migration', () => {
    // next_level_guidance provides actionable steps for the audited organisation to
    // reach the next maturity level. Surfaced in "What to improve" section of the card.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_evaluations must define next_level_guidance TEXT column (FR-095 — guidance surfacing)'
    ).toMatch(/next_level_guidance/i);
  });

  it('T-W14-UX-007c: criteria_evaluations has next_plus_one_taster TEXT column in migration', () => {
    // next_plus_one_taster gives a preview of the level beyond the immediate next level,
    // shown in "Where you're heading" section of the card.
    // RED: Table does not exist.
    const sql = readTargetMigration();
    expect(
      sql,
      'criteria_evaluations must define next_plus_one_taster TEXT column (FR-095 — taster surfacing)'
    ).toMatch(/next_plus_one_taster/i);
  });

  it('T-W14-UX-007d: CriteriaCard component file exists in frontend src', () => {
    // The CriteriaCard must be implemented as a dedicated component that renders
    // the evaluation badge, guidance, and taster sections.
    // RED: Component does not exist.
    //
    // Accepted paths: CriteriaCard.tsx directly, or CriteriaCard/index.tsx.
    const candidatePaths = [
      path.join(SRC_DIR, 'components', 'criteria', 'CriteriaCard.tsx'),
      path.join(SRC_DIR, 'components', 'criteria', 'CriteriaCard', 'index.tsx'),
    ];
    const exists = candidatePaths.some(p => fs.existsSync(p));
    expect(
      exists,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `CriteriaCard.tsx not found in any of:\n` +
      candidatePaths.map(p => `  ${p}`).join('\n') + '\n' +
      `ui-builder must create this component to turn this test GREEN. (FR-095)`
    ).toBe(true);
  });

  it('T-W14-UX-007e: CriteriaCard source references next_level_guidance for rendering', () => {
    // The CriteriaCard must read and display the next_level_guidance value from
    // the criteria_evaluations row. A source text check verifies the prop/field is wired.
    // RED: Component does not exist.
    const candidatePaths = [
      path.join(SRC_DIR, 'components', 'criteria', 'CriteriaCard.tsx'),
      path.join(SRC_DIR, 'components', 'criteria', 'CriteriaCard', 'index.tsx'),
    ];
    const existingPath = candidatePaths.find(p => fs.existsSync(p));
    expect(
      existingPath,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `CriteriaCard component not found — cannot verify next_level_guidance wiring. (FR-095)`
    ).toBeDefined();
    if (existingPath) {
      const source = fs.readFileSync(existingPath, 'utf-8');
      expect(
        source,
        'CriteriaCard must reference next_level_guidance in its render logic (FR-095 — "What to improve" section)'
      ).toMatch(/next_level_guidance/i);
    }
  });

  it('T-W14-UX-007f: CriteriaCard source renders "Explore further levels" link', () => {
    // The "Explore further levels" link opens the AI chat panel with criteria context
    // pre-injected (tested separately in T-W14-UX-008).
    // RED: Component does not exist.
    const candidatePaths = [
      path.join(SRC_DIR, 'components', 'criteria', 'CriteriaCard.tsx'),
      path.join(SRC_DIR, 'components', 'criteria', 'CriteriaCard', 'index.tsx'),
    ];
    const existingPath = candidatePaths.find(p => fs.existsSync(p));
    expect(
      existingPath,
      `[RED STATE — EXPECTED before Wave 14 implementation]\n` +
      `CriteriaCard component not found — cannot verify "Explore further levels" link. (FR-095)`
    ).toBeDefined();
    if (existingPath) {
      const source = fs.readFileSync(existingPath, 'utf-8');
      expect(
        source,
        'CriteriaCard must render an "Explore further levels" link (FR-095 — AI chat context trigger)'
      ).toMatch(/explore further levels|Explore Further Levels|explore-further-levels/i);
    }
  });

});
