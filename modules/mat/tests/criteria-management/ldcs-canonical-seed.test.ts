/**
 * MAT Test Suite — CAT-02 extension: LDCS Canonical Seed Validation
 *
 * Validates the structural integrity of the Lucara Diamond Control Standard
 * canonical seed data used to populate the MAT database.
 *
 * Source: modules/mat/Lucara_Diamond_Control_Standard_seed_info.md
 * Seed:   modules/mat/frontend/src/data/ldcs-seed.ts (authoritative frontend seed)
 *         modules/mat/src/data/ldcs-seed.ts           (extended seed with helpers)
 *
 * Architecture: modules/mat/02-architecture/data-architecture.md
 * FRS: FR-004 (Criteria Upload & Seed), FR-008 (Human Approval), FR-011 (Criteria Modal)
 * TRS: TR-047 (Criteria Management)
 * Wave: Wave 6 — Canonical Seed, Fix 1 (useCriterion), Fix 2 (CriteriaApproval)
 */
import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import { existsSync } from 'fs';
import {
  LDCS_SEED,
  countLdcsCriteria,
  countLdcsMps,
} from '../../src/data/ldcs-seed.js';

const FRONTEND_SEED_PATH = resolve(
  __dirname,
  '../../frontend/src/data/ldcs-seed.ts',
);
const FRONTEND_HOOKS_PATH = resolve(
  __dirname,
  '../../frontend/src/lib/hooks/useCriteria.ts',
);
const CRITERIA_APPROVAL_PATH = resolve(
  __dirname,
  '../../frontend/src/components/criteria/CriteriaApproval.tsx',
);

// ── Fix 1: useCriterion hook structural check ────────────────────────────────

describe('CAT-02 (Fix 1): useCriterion hook — no mock data', () => {
  it('MAT-T-FIX1-001: useCriteria.ts exports useCriterion function', () => {
    expect(existsSync(FRONTEND_HOOKS_PATH)).toBe(true);
    const src = require('fs').readFileSync(FRONTEND_HOOKS_PATH, 'utf8');
    expect(src).toContain('export function useCriterion(');
  });

  it('MAT-T-FIX1-002: useCriteria.ts exports useApproveCriterion function', () => {
    const src = require('fs').readFileSync(FRONTEND_HOOKS_PATH, 'utf8');
    expect(src).toContain('export function useApproveCriterion(');
  });

  it('MAT-T-FIX1-003: useCriterion fetches from supabase criteria table (no mock)', () => {
    const src = require('fs').readFileSync(FRONTEND_HOOKS_PATH, 'utf8');
    // Hook must query the 'criteria' table
    expect(src).toContain(".from('criteria')");
    // Hook must NOT use hardcoded mock data
    expect(src).not.toContain("'mock-mps-id'");
    expect(src).not.toContain("'Sample Criterion'");
  });

  it('MAT-T-FIX1-004: CriteriaManagementPage.tsx imports useCriterion (no mock data)', () => {
    const pagePath = resolve(
      __dirname,
      '../../frontend/src/pages/CriteriaManagementPage.tsx',
    );
    const src = require('fs').readFileSync(pagePath, 'utf8');
    expect(src).toContain('useCriterion');
    // Confirm mock data has been removed
    expect(src).not.toContain('mock-mps-id');
    expect(src).not.toContain('Sample Criterion');
  });
});

// ── Fix 2: CriteriaApproval component structural check ───────────────────────

describe('CAT-02 (Fix 2): CriteriaApproval — approve/reject Supabase logic', () => {
  it('MAT-T-FIX2-001: CriteriaApproval.tsx exists', () => {
    expect(existsSync(CRITERIA_APPROVAL_PATH)).toBe(true);
  });

  it('MAT-T-FIX2-002: CriteriaApproval uses useApproveCriterion hook', () => {
    const src = require('fs').readFileSync(CRITERIA_APPROVAL_PATH, 'utf8');
    expect(src).toContain('useApproveCriterion');
  });

  it('MAT-T-FIX2-003: CriteriaApproval renders Approve and Reject buttons', () => {
    const src = require('fs').readFileSync(CRITERIA_APPROVAL_PATH, 'utf8');
    expect(src).toContain('Approve');
    expect(src).toContain('Reject');
  });

  it('MAT-T-FIX2-004: CriteriaApproval has confirmation UX before submitting', () => {
    const src = require('fs').readFileSync(CRITERIA_APPROVAL_PATH, 'utf8');
    // Confirmation pattern — second click triggers actual mutation
    expect(src).toContain('confirmAction');
    expect(src).toContain('Confirm');
  });

  it('MAT-T-FIX2-005: CriteriaApproval handles error state', () => {
    const src = require('fs').readFileSync(CRITERIA_APPROVAL_PATH, 'utf8');
    expect(src).toContain('errorMessage');
  });
});

// ── Seed: LDCS canonical structure tests ─────────────────────────────────────

describe('CAT-02 (LDCS): canonical seed file exists at correct path', () => {
  it('MAT-T-LDCS-000: seed file exists at modules/mat/frontend/src/data/ldcs-seed.ts', () => {
    expect(existsSync(FRONTEND_SEED_PATH)).toBe(true);
  });
});

describe('CAT-02 (LDCS): canonical seed structure', () => {
  it('MAT-T-LDCS-001: seed defines exactly 5 canonical domains', () => {
    expect(LDCS_SEED).toHaveLength(5);
  });

  it('MAT-T-LDCS-002: domain names match LDCS canonical values', () => {
    const names = LDCS_SEED.map((d) => d.name);
    expect(names).toContain('Leadership and Governance');
    expect(names).toContain('Process Integrity');
    expect(names).toContain('People and Culture');
    expect(names).toContain('Protection');
    expect(names).toContain('Proof');
  });

  it('MAT-T-LDCS-003: domain sort_order values are 1-5 in sequence', () => {
    const orders = LDCS_SEED.map((d) => d.sort_order).sort((a, b) => a - b);
    expect(orders).toEqual([1, 2, 3, 4, 5]);
  });

  it('MAT-T-LDCS-004: seed defines exactly 25 MPS across all domains', () => {
    expect(countLdcsMps()).toBe(25);
  });

  it('MAT-T-LDCS-005: each domain contains the correct number of MPS', () => {
    const mpsCountByDomain: Record<string, number> = {};
    for (const domain of LDCS_SEED) {
      mpsCountByDomain[domain.name] = domain.mini_performance_standards.length;
    }
    expect(mpsCountByDomain['Leadership and Governance']).toBe(5);
    expect(mpsCountByDomain['Process Integrity']).toBe(6);
    expect(mpsCountByDomain['People and Culture']).toBe(4);
    expect(mpsCountByDomain['Protection']).toBe(6);
    expect(mpsCountByDomain['Proof']).toBe(4);
  });

  it('MAT-T-LDCS-006: MPS numbers are in canonical LDCS order (MPS 1 to MPS 25)', () => {
    const mpsNumbers = LDCS_SEED.flatMap((d) =>
      d.mini_performance_standards.map((m) => m.number),
    );
    for (let i = 1; i <= 25; i++) {
      expect(mpsNumbers).toContain(`MPS ${i}`);
    }
  });

  it('MAT-T-LDCS-007: every MPS has a non-empty name, intent, and at least one criterion', () => {
    for (const domain of LDCS_SEED) {
      for (const mps of domain.mini_performance_standards) {
        expect(mps.name).toBeTruthy();
        expect(mps.intent).toBeTruthy();
        expect(mps.criteria.length).toBeGreaterThan(0);
      }
    }
  });

  it('MAT-T-LDCS-008: every criterion has a non-empty number and title', () => {
    for (const domain of LDCS_SEED) {
      for (const mps of domain.mini_performance_standards) {
        for (const criterion of mps.criteria) {
          expect(criterion.number).toBeTruthy();
          expect(criterion.title).toBeTruthy();
        }
      }
    }
  });

  it('MAT-T-LDCS-009: criterion numbers within each MPS use the correct MPS prefix', () => {
    for (const domain of LDCS_SEED) {
      for (const mps of domain.mini_performance_standards) {
        const mpsNum = mps.number.replace('MPS ', '');
        for (const criterion of mps.criteria) {
          expect(criterion.number).toMatch(new RegExp(`^${mpsNum}\\.`));
        }
      }
    }
  });

  it('MAT-T-LDCS-010: total criterion count is at least 150 (comprehensive coverage)', () => {
    const total = countLdcsCriteria();
    expect(total).toBeGreaterThanOrEqual(150);
  });

  it('MAT-T-LDCS-011: Leadership and Governance domain has MPS 1-5', () => {
    const domain = LDCS_SEED.find((d) => d.name === 'Leadership and Governance')!;
    const numbers = domain.mini_performance_standards.map((m) => m.number);
    expect(numbers).toContain('MPS 1');
    expect(numbers).toContain('MPS 2');
    expect(numbers).toContain('MPS 3');
    expect(numbers).toContain('MPS 4');
    expect(numbers).toContain('MPS 5');
  });

  it('MAT-T-LDCS-012: Process Integrity domain has MPS 6-11', () => {
    const domain = LDCS_SEED.find((d) => d.name === 'Process Integrity')!;
    const numbers = domain.mini_performance_standards.map((m) => m.number);
    expect(numbers).toContain('MPS 6');
    expect(numbers).toContain('MPS 7');
    expect(numbers).toContain('MPS 8');
    expect(numbers).toContain('MPS 9');
    expect(numbers).toContain('MPS 10');
    expect(numbers).toContain('MPS 11');
  });

  it('MAT-T-LDCS-013: People and Culture domain has MPS 12-15', () => {
    const domain = LDCS_SEED.find((d) => d.name === 'People and Culture')!;
    const numbers = domain.mini_performance_standards.map((m) => m.number);
    expect(numbers).toContain('MPS 12');
    expect(numbers).toContain('MPS 13');
    expect(numbers).toContain('MPS 14');
    expect(numbers).toContain('MPS 15');
  });

  it('MAT-T-LDCS-014: Protection domain has MPS 16-21', () => {
    const domain = LDCS_SEED.find((d) => d.name === 'Protection')!;
    const numbers = domain.mini_performance_standards.map((m) => m.number);
    expect(numbers).toContain('MPS 16');
    expect(numbers).toContain('MPS 17');
    expect(numbers).toContain('MPS 18');
    expect(numbers).toContain('MPS 19');
    expect(numbers).toContain('MPS 20');
    expect(numbers).toContain('MPS 21');
  });

  it('MAT-T-LDCS-015: Proof domain has MPS 22-25', () => {
    const domain = LDCS_SEED.find((d) => d.name === 'Proof')!;
    const numbers = domain.mini_performance_standards.map((m) => m.number);
    expect(numbers).toContain('MPS 22');
    expect(numbers).toContain('MPS 23');
    expect(numbers).toContain('MPS 24');
    expect(numbers).toContain('MPS 25');
  });

  it('MAT-T-LDCS-016: MPS 1 criteria includes key leadership criteria numbers', () => {
    const domain = LDCS_SEED.find((d) => d.name === 'Leadership and Governance')!;
    const mps1 = domain.mini_performance_standards.find((m) => m.number === 'MPS 1')!;
    const criterionNumbers = mps1.criteria.map((c) => c.number);
    expect(criterionNumbers).toContain('1.1');
    expect(criterionNumbers).toContain('1.2');
  });

  it('MAT-T-LDCS-017: no duplicate criterion numbers exist within a single MPS', () => {
    for (const domain of LDCS_SEED) {
      for (const mps of domain.mini_performance_standards) {
        const numbers = mps.criteria.map((c) => c.number);
        const unique = new Set(numbers);
        expect(unique.size).toBe(numbers.length);
      }
    }
  });

  it('MAT-T-LDCS-018: countLdcsCriteria and countLdcsMps helpers return correct values', () => {
    const totalCriteria = countLdcsCriteria();
    const totalMps = countLdcsMps();

    let expectedCriteria = 0;
    let expectedMps = 0;
    for (const domain of LDCS_SEED) {
      expectedMps += domain.mini_performance_standards.length;
      for (const mps of domain.mini_performance_standards) {
        expectedCriteria += mps.criteria.length;
      }
    }

    expect(totalCriteria).toBe(expectedCriteria);
    expect(totalMps).toBe(expectedMps);
  });
});
