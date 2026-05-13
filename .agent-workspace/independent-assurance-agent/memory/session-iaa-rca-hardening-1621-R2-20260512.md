# IAA Session Memory — session-iaa-rca-hardening-1621-R2-20260512

- session_id: session-iaa-rca-hardening-1621-R2-20260512
- pr_reviewed: #1622 — Harden IAA pre-build assurance and RCA-before-fix admin gap closure (R2 invocation)
- overlay_applied: KNOWLEDGE_GOVERNANCE
- verdict: REJECTION-PACKAGE
- checks_run: 13 substance checks: 12 PASS, 1 FAIL
- learning_note: |
    R2 FILES_CHANGED integrity failure (same error class as R1, NO-REPEAT-PREVENTABLE-001):
    R1 had FILES_CHANGED: 14 vs actual 13. R2 has FILES_CHANGED: 13 vs actual 15.
    Root cause: scope declaration FILES_CHANGED counter and PREHANDOVER proof file list were not
    updated when validate-product-delivery-gates.sh and .test.sh were added as in-scope deliverables.
    The ceremony commit (PREHANDOVER + session memory) added 2 files to the diff, but neither the
    scope declaration's FILES_CHANGED field nor the PREHANDOVER proof's file list was updated.
    Structural prevention: `validate-scope-to-diff.sh` already exists in the repository and must be
    run by Foreman before every IAA invocation at KNOWLEDGE_GOVERNANCE waves. This should be added
    to the Foreman pre-IAA protocol. FAIL-ONLY-ONCE promotion: this pattern should be codified in
    FAIL-ONLY-ONCE.md to require validate-scope-to-diff.sh execution before IAA.
    Positive note: All 7 AC evidence verified (KNOWLEDGE_GOVERNANCE substance PASS). All 3 CI merge
    gates GREEN. R3 is expected to yield ASSURANCE-TOKEN if the FILES_CHANGED correction is the only
    remaining gap.

---

**Wave**: iaa-rca-hardening-1621
**PR**: #1622
**Branch**: copilot/harden-iaa-rca-behavior
**Invocation**: R2 (following R1 REJECTION-PACKAGE on 2026-05-12)
**IAA Version**: 6.2.0 | Contract: 2.10.0
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Generated**: 2026-05-12
