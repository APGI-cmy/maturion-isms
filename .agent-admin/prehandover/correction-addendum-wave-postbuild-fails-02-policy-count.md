# Correction Addendum — Wave postbuild-fails-02 Policy Count

**Date**: 2026-03-04
**Session**: session-098
**Foreman**: foreman-v2-agent v6.2.0
**Wave**: Wave postbuild-fails-02 / MAT Supabase RLS Full Remediation
**PREHANDOVER ref**: `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-098-wave-postbuild-fails-02-20260304.md`
**Triggered by**: IAA REJECTION-PACKAGE — FINDING-A + FINDING-B (commit 462e707)

---

## Corrections Applied

### FINDING-A: Policy count error (documentation only — migration correct)

The migration `20260304000004_fix_rls_remaining_tables.sql` contains **16** CREATE POLICY
statements, not 15 as stated in the original PREHANDOVER QP verdict and wave-current-tasks.md.

Correct count: 16 policies across 8 tables:
- organisations: 2 (INSERT + UPDATE)
- domains: 2 (INSERT + UPDATE)
- mini_performance_standards: 1 (SELECT only — read-only guard)
- criteria: 2 (INSERT + UPDATE)
- evidence: 3 (INSERT + UPDATE + DELETE)
- scores: 2 (INSERT + UPDATE)
- organisation_settings: 2 (INSERT + UPDATE)
- audit_scores: 2 (INSERT + UPDATE)
- **Total: 16**

**Corrected in**: `implementation-plan.md` TASK-PBF2-005 row (status updated to ✅ DONE, count 16)

### FINDING-B: Test path mismatch in implementation plan

`implementation-plan.md` TASK-PBF2-004 row recorded incorrect test path:
`modules/mat/tests/wave-postbuild-fails-02/` (does not exist)

Correct path: `modules/mat/tests/security-rls/wave-postbuild-fails-02.test.ts`

**Corrected in**: `implementation-plan.md` TASK-PBF2-004 row (path and status updated)

---

## Note on PREHANDOVER Immutability

Per A-028/A-029 and `AGENT_HANDOVER_AUTOMATION.md` v1.1.3 §4.3b, the original PREHANDOVER proof
(`PREHANDOVER-session-098-wave-postbuild-fails-02-20260304.md`) is READ-ONLY after initial commit.
This addendum is the authoritative correction record. The PREHANDOVER proof is not amended.

---

## A-029-Immutable Errors — Schema-builder PREHANDOVER

The schema-builder PREHANDOVER proof (`.agent-admin/prehandover/prehandover_proof-wave-postbuild-fails-02-task5.md`)
contains two lines where "15 policies" appears. Per A-028/A-029, this file is READ-ONLY post-commit.
These are documentation errors only; the migration implementation is correct (16 policies verified).

| Line | Incorrect text | Correct value |
|------|----------------|---------------|
| 64 | "All 15 policies use `DO $$ BEGIN IF NOT EXISTS...`" | "All 16 policies use..." |
| 102 | "### Policies Delivered (15 total)" | "### Policies Delivered (16 total)" |

These errors are recorded here for audit completeness. They do not affect the correctness of the
migration or the test results. IAA independently verified the migration contains 16 CREATE POLICY
statements.

---

## CORE-019 Re-Invocation Context

This wave required multiple IAA invocations. The complete audit trail for CORE-019 cross-verification:

| Invocation | Commit | Token file | Verdict |
|-----------|--------|-----------|---------|
| 1st (post-handover) | 462e707 | `.agent-admin/assurance/iaa-token-session-098-wave-postbuild-fails-02-20260304.md` | REJECTION-PACKAGE (FINDING-A: policy count; FINDING-B: test path) |
| 2nd (re-invocation) | 964565a | `.agent-admin/assurance/iaa-token-session-098-wave-postbuild-fails-02-20260304-v2.md` | REJECTION-PACKAGE (A-021: not committed; SCOPE_DECLARATION not fixed; addendum incomplete; CORE-019 context absent) |
| 3rd (re-invocation) | (this commit) | `.agent-admin/assurance/iaa-token-session-098-wave-postbuild-fails-02-20260304-v3.md` | Pending |

The PREHANDOVER proof field `iaa_audit_token: IAA-session-098-wave-postbuild-fails-02-20260304-PASS`
records the expected token reference at initial commit time per A-029. The actual token is in the
v3 token file once IAA issues ASSURANCE-TOKEN. This addendum + all three invocation token files
constitute the complete CORE-019 audit trail for this wave re-invocation scenario.

