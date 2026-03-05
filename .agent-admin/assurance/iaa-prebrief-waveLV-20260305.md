# IAA Pre-Brief — Wave LV (MAT Liveness Test Suite)

**Pre-Brief Reference**: IAA-PREBRIEF-waveLV-20260305
**Wave**: Wave LV — MAT Liveness Test Suite
**Issue**: #932
**Date**: 2026-03-05
**Phase**: PHASE_B_BLOCKING

## Qualifying Tasks (All AAWP_MAT)

All 9 task groups qualify for full IAA assurance. Required proof phases: 1–4 for all tasks.

## Top Risk Watch Points

1. File path must be `modules/mat/tests/liveness/` per spec §7 (not `src/liveness/`)
2. Fixture PDFs must be non-empty, valid PDF (not zero-byte)
3. WARN ≠ FAIL — runner exit 0 on WARN, exit 1 on blocking FAIL only
4. AI latency thresholds configurable via env vars
5. File structure: exactly 3 spec files per spec §7

## Canon Overlays

- BUILD_DELIVERABLE (BD-001–BD-024)
- CI_WORKFLOW (OVL-CI-001–005)
- Universal Ceremony Gate (CERT-001–004)
- Core Invariants (CORE-001–022)

*Authority: IAA v6.2.0 | PHASE_B_BLOCKING | 2026-03-05*
