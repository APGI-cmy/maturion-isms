/**
 * MAT Red Test Suite — CAT-02: criteria management
 *
 * QA-to-Red: All tests MUST fail with NOT_IMPLEMENTED.
 * These tests define expected behavior before implementation exists.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it } from 'vitest';

describe('CAT-02: criteria management', () => {
  it('MAT-T-0004: Criteria Document Upload', () => {
    // Architecture: §3.12 Path 2 — Criteria Upload & AI Parsing
    // FRS: FR-004
    // TRS: TR-013
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0004 — Criteria Document Upload');
  });

  it('MAT-T-0005: AI Criteria Parsing', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-005
    // TRS: TR-037
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0005 — AI Criteria Parsing');
  });

  it('MAT-T-0006: No-Hallucination Rule', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-006
    // TRS: TR-037
    // Type: unit | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0006 — No-Hallucination Rule');
  });

  it('MAT-T-0007: Coverage Rule', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-007
    // TRS: TR-037
    // Type: unit | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0007 — Coverage Rule');
  });

  it('MAT-T-0008: Human Approval of Parsed Criteria', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-008
    // TRS: TR-012
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0008 — Human Approval of Parsed Criteria');
  });

  it('MAT-T-0009: Criteria Numbering Immutability', () => {
    // Architecture: §3.12 Path 2
    // FRS: FR-009
    // TRS: TR-012
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0009 — Criteria Numbering Immutability');
  });

  it('MAT-T-0012: Not Used Exclusion', () => {
    // Architecture: §3.1
    // FRS: FR-012
    // TRS: TR-012
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0012 — Not Used Exclusion');
  });

  it('MAT-T-0054: Criterion Status Tracking', () => {
    // Architecture: §3.1
    // FRS: FR-054
    // TRS: TR-012
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0054 — Criterion Status Tracking');
  });
});
