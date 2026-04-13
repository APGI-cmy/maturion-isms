# IAA Rejection Token — Session 142 / Wave 14 Batch C / 2026-03-05

**Token Reference**: IAA-session-142-wave14-batchC-20260305-REJECTION
**Session ID**: session-142 (IAA internal: first invocation for this PR)
**Date**: 2026-03-05
**Agent**: independent-assurance-agent v6.2.0
**PR**: copilot/finalise-mat-gap-closure
**Issue**: #909 — Wave 14 Batch C: Finalise MAT remaining gap closure and QA acceptance
**Invoking Agent**: foreman-v2-agent v6.2.0
**Producing Agents**: schema-builder (TASK-W14-BC-001, TASK-W14-BC-002), mat-specialist (TASK-W14-BC-003, TASK-W14-BC-004)
**Category**: AAWP_MAT
**Adoption Phase**: PHASE_B_BLOCKING

---

## Verdict

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: copilot/finalise-mat-gap-closure / Issue #909 — Wave 14 Batch C
2 check(s) FAILED. Merge blocked. STOP-AND-FIX required.

FAILURES:

  FINDING-BC-001 — BD-003 / BD-005 — aggregate_scores NULL scope_id UNIQUE incompatibility

  Finding: The aggregate_scores migration contains an internal contradiction.
  The migration simultaneously:
    (1) Acknowledges that PostgreSQL UNIQUE constraints treat NULL values as distinct
        (i.e., two rows with scope_id=NULL and same (audit_id, level_type) are BOTH permitted)
    (2) States "multiple overall scores are NOT expected" and "ON CONFLICT (audit_id,
        level_type, scope_id) DO UPDATE is the intended UPSERT pattern"

  These are contradictory. ON CONFLICT will NOT detect a conflict for NULL scope_id rows
  (because NULL != NULL in PostgreSQL conflict detection). The scoring compute function,
  when implemented and run twice for the same audit's overall score, will INSERT a duplicate
  "overall" row instead of updating the existing one — silently accumulating stale data and
  corrupting maturity score display.

  The IAA pre-brief security spotlight explicitly required IAA to confirm a partial index
  or COALESCE sentinel was used. Neither is present.

  Fix required: CHOOSE ONE:
    (a) Add partial unique index after the table definition:
        CREATE UNIQUE INDEX aggregate_scores_null_scope_unique
          ON public.aggregate_scores (audit_id, level_type)
          WHERE scope_id IS NULL;
        (Enforces DB-level uniqueness for overall/NULL-scope rows)
    OR
    (b) Correct the migration comment to document that the scoring compute function MUST
        use DELETE + INSERT (not UPSERT) for overall scores (scope_id IS NULL), with
        explicit instruction to NOT use ON CONFLICT for the NULL scope_id case
    OR
    (c) Use a non-NULL sentinel UUID for "no scope" in the application layer, eliminating
        the NULL uniqueness ambiguity

  FINDING-BC-002 — OVL-AM-CWT-01 — Missing Wave 14 CWT PASS verdict (wave IBWR)

  Finding: Wave 14 Batch C is the final batch, closing all 15 GAPs of Wave 14.
  The Batch C PREHANDOVER is the wave IBWR closing point. Per COMBINED_TESTING_PATTERN.md
  §5.2 and OVL-AM-CWT-01, a CWT PASS verdict with scope (waves covered, modules covered,
  scenarios covered) is MANDATORY before IBWR completion.

  No CWT evidence artifact exists for Wave 14. The post-implementation assurance report
  contains cumulative test counts (706/715) but NOT a formal CWT PASS verdict with scope
  breakdown. Wave 13 comparison: wave13-cwt-evidence-20260303.md and
  wave13-fcwt-certificate-20260303.md both exist. Wave 14 has no equivalent.

  Fix required:
    (a) Commission Wave 14 CWT via qa-builder covering: all Wave 14 batches (A, B, C),
        all modules (MAT), all integration scenarios (schema to RLS to application read paths)
    (b) Create: modules/mat/05-build-evidence/wave14-cwt-evidence-YYYYMMDD.md
        containing formal CWT PASS verdict with scope breakdown
    (c) Per A-029 (PREHANDOVER is immutable), add a new file referencing the CWT artifact
        (new correction addendum or updated IBWR supplement), commit, push, re-invoke IAA

This PR must not be opened until all failures are resolved and IAA re-invoked.
Adoption phase: PHASE_B_BLOCKING — hard gate ACTIVE.
═══════════════════════════════════════════════════════════════
```

---

## Check Summary

| Phase | Total | PASS | FAIL |
|-------|-------|------|------|
| FAIL-ONLY-ONCE learning checks | 6 | 6 | 0 |
| Core invariants (CORE-013 to CORE-022, applicable) | 10 | 10 | 0 |
| AAWP_MAT overlay BD-TIER-1 to BD-TIER-5 | 20 | 19 | 1 (FINDING-BC-001) |
| AAWP_MAT overlay OVL-AM-CST/CWT/FCWT | 3 | 2 | 1 (FINDING-BC-002) |
| **Total** | **39** | **37** | **2** |

---

## What Passed — Summary

The Wave 14 Batch C schema migrations are substantively well-implemented:

- All 20 Batch C tests GREEN (T-W14-UX-012a–f, T-W14-UX-013a–g, T-W14-UX-016a–g) — verified by live test run
- Zero regressions (706/715 total pass, 9 pre-existing live-env failures unchanged)
- Both migrations are idempotent, well-commented, and correctly use IF NOT EXISTS guards
- All 6 new tables have appropriate FK constraints with ON DELETE CASCADE
- RLS policies correctly implemented for org-isolated tables (criteria/mps/domain level descriptors, aggregate_scores)
- Public-read posture for maturity_levels and scoring_rules is intentional and pre-brief verified
- SCOPE_DECLARATION 9/9 files declared — exactly matches git diff
- PREHANDOVER proof correctly committed per A-029 (iaa_audit_token pre-populated)
- No TODOs, stubs, or placeholders in any production artifact
- A-021 compliant — working tree clean, all artifacts committed

---

## Authority

CS2: @APGI-cmy
IAA: independent-assurance-agent v6.2.0
STOP-AND-FIX: ACTIVE
Merge authority: CS2 ONLY — IAA does not merge under any instruction.
