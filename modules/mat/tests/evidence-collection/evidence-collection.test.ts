/**
 * MAT Red Test Suite — CAT-03: evidence collection
 *
 * QA-to-Red: All tests MUST fail with NOT_IMPLEMENTED.
 * These tests define expected behavior before implementation exists.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it } from 'vitest';

describe('CAT-03: evidence collection', () => {
  it('MAT-T-0013: Evidence Collection — Text and Document', () => {
    // Architecture: §3.12 Path 3 — Evidence Collection
    // FRS: FR-013, FR-016
    // TRS: TR-013, TR-026
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0013 — Evidence Collection — Text and Document');
  });

  it('MAT-T-0014: Evidence Collection — Voice Recording', () => {
    // Architecture: §3.12 Path 9 — Interview Transcription
    // FRS: FR-014
    // TRS: TR-070
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0014 — Evidence Collection — Voice Recording');
  });

  it('MAT-T-0015: Evidence Collection — Photo Capture', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-015
    // TRS: TR-013
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0015 — Evidence Collection — Photo Capture');
  });

  it('MAT-T-0016: Evidence Collection — Video', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-017
    // TRS: TR-069
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0016 — Evidence Collection — Video');
  });

  it('MAT-T-0017: Concurrent File Uploads', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-018
    // TRS: TR-010
    // Type: performance | Priority: P1
    throw new Error('NOT_IMPLEMENTED: MAT-T-0017 — Concurrent File Uploads');
  });

  it('MAT-T-0018: Evidence Integrity Verification', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-053
    // TRS: TR-026
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0018 — Evidence Integrity Verification');
  });

  it('MAT-T-0019: Evidence Review and Status', () => {
    // Architecture: §3.12 Path 3
    // FRS: FR-019
    // TRS: TR-012
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0019 — Evidence Review and Status');
  });

  it('MAT-T-0020: Criterion Interview Recording', () => {
    // Architecture: §3.12 Path 9
    // FRS: FR-020
    // TRS: TR-039
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0020 — Criterion Interview Recording');
  });

  it('MAT-T-0021: Audit-Level Interview', () => {
    // Architecture: §3.12 Path 9
    // FRS: FR-021
    // TRS: TR-039
    // Type: integration | Priority: P1
    throw new Error('NOT_IMPLEMENTED: MAT-T-0021 — Audit-Level Interview');
  });

  it('MAT-T-0022: Interview Governance', () => {
    // Architecture: §3.12 Path 9
    // FRS: FR-022
    // TRS: TR-025
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0022 — Interview Governance');
  });

  it('MAT-T-0078: Upload Failure and Retry', () => {
    // Architecture: §3.12 Path 11 — Upload Failure
    // FRS: FR-013
    // TRS: TR-013
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0078 — Upload Failure and Retry');
  });
});
