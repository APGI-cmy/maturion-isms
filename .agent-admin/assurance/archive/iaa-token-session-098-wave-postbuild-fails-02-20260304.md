# IAA Verdict — Session 098 — Wave postbuild-fails-02 — 2026-03-04

**Agent**: independent-assurance-agent v6.2.0
**Session**: session-098 (IAA numbering)
**Date**: 2026-03-04
**PR**: copilot/add-wave-next-entry-supabase-rls
**Wave**: Wave postbuild-fails-02 / MAT Supabase RLS Full Remediation
**Issue**: #897
**Adoption Phase**: PHASE_B_BLOCKING
**Authority**: CS2 only (@APGI-cmy)

---

## Verdict

```
═══════════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/add-wave-next-entry-supabase-rls (Wave postbuild-fails-02 / Issue #897)
2 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.

FAILURES:

CORE-021 / FINDING-A: Policy Count Documentation Error
  Finding: Schema-builder PREHANDOVER, SCOPE_DECLARATION.md, Foreman PREHANDOVER,
           and wave-current-tasks.md all state "15 policies total" for migration
           20260304000004_fix_rls_remaining_tables.sql. The actual migration contains
           16 CREATE POLICY statements (verified: organisations×2, domains×2, MPS×1,
           criteria×2, evidence×3, scores×2, organisation_settings×2, audit_scores×2 = 16).
           The schema-builder's own "Policies Delivered" table contains 16 rows but the
           header reads "(15 total)" — internally inconsistent within the same document.
           NOTE: The migration implementation is CORRECT (16 policies). The error is in
           documentation only. The underlying work is technically sound.
  Fix required:
    1. Update schema-builder PREHANDOVER Phase 3: "All 15 policies use..." → "All 16 policies use..."
    2. Update schema-builder PREHANDOVER Phase 4: "Policies Delivered (15 total)" → "Policies Delivered (16 total)"
    3. Update SCOPE_DECLARATION.md migration description: "15 policies total" → "16 policies total"
    4. Update wave-current-tasks.md QP evidence note: "15 policies total" → "16 policies total"
    5. Add correction addendum at .agent-admin/prehandover/correction-addendum-wave-postbuild-fails-02-policy-count.md
       (since Foreman PREHANDOVER is immutable per A-029 and cannot be edited directly) acknowledging
       that the correct policy count is 16, not 15 as stated in the Foreman PREHANDOVER.
    6. Commit all corrections and re-invoke IAA.

CORE-021 / FINDING-B: Test Path Mismatch in Implementation Plan
  Finding: implementation-plan.md v2.4.0 Wave postbuild-fails-02 task table records
           TASK-PBF2-004 with path `modules/mat/tests/wave-postbuild-fails-02/`.
           The actual test file is at `modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts`.
           The Pre-Brief correctly specified `modules/mat/tests/security-rls/ (or equivalent path)`.
           The implementation plan path is factually incorrect.
  Fix required:
    1. Update implementation-plan.md TASK-PBF2-004 path from
       `modules/mat/tests/wave-postbuild-fails-02/` to
       `modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts`
    2. Commit the correction and re-invoke IAA.

This PR must not be opened/merged until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate. This verdict is BLOCKING.
═══════════════════════════════════════════════════════════════════
```

---

## Token Reference

`IAA-session-098-wave-postbuild-fails-02-20260304-REJECTION`

> Note: Pre-populated expected token was `IAA-session-098-wave-postbuild-fails-02-20260304-PASS`.
> Actual verdict: REJECTION-PACKAGE. The Foreman PREHANDOVER pre-populated token is superseded by
> this rejection. Per A-029, the PREHANDOVER proof is immutable. The rejection is recorded here.

---

## Checks Summary

| Category | Checks | PASS | FAIL |
|----------|--------|------|------|
| FAIL-ONLY-ONCE learning | 5 | 5 | 0 |
| Core invariants (applicable) | 10 | 9 | 1 |
| AAWP_MAT overlay | 8 | 8 | 0 |
| **Total** | **23** | **22** | **1** |

*Note: CORE-021 is the meta-check that triggers REJECTION on finding detection. The 1 FAIL is CORE-021 itself (2 underlying findings: FINDING-A policy count, FINDING-B test path).*

---

## What Passed (Notable)

- Migration implementation: CORRECT — all 16 policies present and verified against T-PBF2-001 through T-PBF2-008 assertions (Python verification PASS 18/18 including security guards)
- All 8 test assertions satisfied by migration (evidence INSERT/UPDATE/DELETE, scores, audit_scores, org_settings, criteria, domains, organisations, MPS read-only guard)
- FRS v1.8.0 FR-084–FR-088: PRESENT ✅
- TRS v1.7.0 TR-084–TR-088: PRESENT ✅
- App Description v1.4 §21: PRESENT ✅
- BUILD_PROGRESS_TRACKER: All 13 GAPs recorded ✅
- OVL-AM-008 end-to-end wiring trace: COMPLETE ✅ (all 5 sub-sections in schema-builder PREHANDOVER task5)
- Evidence bundle: 11/11 artifacts present ✅
- CANON_INVENTORY: 191 canons, 0 bad hashes ✅

---

## Governance Design Gap (Advisory — not blocking)

**CORE-016/CORE-018 condition 4 vs A-029 First-Invocation Tension:**
CORE-018 condition 4 requires `## IAA Agent Response (verbatim)` section in PREHANDOVER proof.
Per A-029, PREHANDOVER is immutable post-commit. For first invocations, the verbatim section
cannot be pre-populated (IAA hasn't run yet). This creates an impossible condition.

Recommended resolution: Update CORE-018 to add explicit carve-out:
"Condition 4 NOT APPLICABLE when: (a) `iaa_audit_token` is pre-populated in A-029-compliant format
AND (b) this is the first IAA invocation for this PR (no prior IAA session file for this wave exists).
In this case, verbatim output goes to dedicated token file per §4.2b."

This advisory has been recorded in IAA session memory and recommended for FAIL-ONLY-ONCE addition.

---

**Authority**: CS2 (Johan Ras / @APGI-cmy) | **IAA Version**: 6.2.0
**PREHANDOVER immutability**: Per A-029, this file is the authoritative IAA verdict record.
**Next step**: Foreman/builders resolve FINDING-A and FINDING-B, commit, re-invoke IAA.
