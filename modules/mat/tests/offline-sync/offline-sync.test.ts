/**
 * MAT Red Test Suite — CAT-06: offline sync
 *
 * QA-to-Red: All tests MUST fail with NOT_IMPLEMENTED.
 * These tests define expected behavior before implementation exists.
 *
 * Registry: governance/TEST_REGISTRY.json
 * Strategy: Maturion/strategy/MAT_RED_TEST_SUITE_STRATEGY.md
 */
import { describe, it } from 'vitest';

describe('CAT-06: offline sync', () => {
  it('MAT-T-0047: Offline Evidence Capture', () => {
    // Architecture: §3.5, §3.12 Path 12 — Offline Evidence Capture
    // FRS: FR-047
    // TRS: TR-015, TR-045
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0047 — Offline Evidence Capture');
  });

  it('MAT-T-0048: Auto Sync on Reconnect', () => {
    // Architecture: §3.5, §3.12 Path 12
    // FRS: FR-048
    // TRS: TR-046
    // Type: integration | Priority: P0
    throw new Error('NOT_IMPLEMENTED: MAT-T-0048 — Auto Sync on Reconnect');
  });

  it('MAT-T-0064: PWA Support', () => {
    // Architecture: §3.1, §3.5
    // FRS: FR-063
    // TRS: TR-036
    // Type: e2e | Priority: P1
    throw new Error('NOT_IMPLEMENTED: MAT-T-0064 — PWA Support');
  });
});
