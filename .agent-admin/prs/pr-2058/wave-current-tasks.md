# Wave Current Tasks — PR #2058

**Wave**: PR-2058-SECURITY-CORRECTION
**Session ID**: session-pr2058-data-api-grants-security-20261004
**Date**: 2026-10-04
**Branch**: codex/explicit-data-api-grants-20260923
**CS2 Authorization**: https://github.com/APGI-cmy/maturion-isms/pull/2058#issuecomment-5979407372
**iaa_prebrief_path**: `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md` (commit `908b5b4adf402e471ce96b6bd85dd826c13d9f7d`)

## Bounded scope

Correct the existing Data API grants PR only: preserve the MMM public-helper RPC hardening and resolve the exposed PIT SECURITY DEFINER helper surface without weakening RLS or approved RPC paths. Exclude `evidence_submissions` from this PR's grants and focused replay because the existing legacy consumers do not match its DDL; that defect remains unresolved and outside this scope. Keep the PostgreSQL privilege-list assertion and cite PostgreSQL documentation. No deployment, unrelated schema work, or changes to Foreman Tier 1/Tier 2/CANON.

## Historical delegation-order exception

CS2's one-time exception is recorded in PR comments 5978432262, 5979407372, and 5979822573. The existing implementation commits predate the exception; no pre-brief, builder appointment, or strict delegation-order proof is claimed for those historical commits. The gate remains technically red; CS2's disposition accepts only this historical ordering failure and does not waive the security changes, focused regression tests, code review, independent assurance, or CS2 merge review. This record does not fabricate evidence or alter the gate.

## Outstanding tasks

| Task ID | Task | Builder | Status | PR / Evidence |
|---|---|---|---|---|
| PR2058-SEC-01 | Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; remove public authenticated MMM grants; resolve PIT RPC-oracle exposure with the minimal private-schema design while preserving approved paths | schema-builder | ✅ IMPLEMENTATION COMPLETE; NARROWED-SCOPE QP PENDING | PR #2058; appointed 2026-10-04T11:29:57Z; reassessment applies to stable substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b` |
| PR2058-SEC-02 | Narrow the grant surface to exclude unsupported `evidence_submissions` and Wave 16.6; retain the multi-privilege `has_table_privilege` assertion and PostgreSQL documentation citation | schema-builder | ✅ NARROWING AND 88-MIGRATION FOCUSED CHECKS COMPLETE; QP AND FINAL IAA PENDING | PR #2058; the separate legacy consumer/DDL mismatch remains unresolved and out of scope. PostgreSQL 17 docs: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS |

The recorded appointment is current and truthful; it does not assert that the appointment predates the original September implementation commits or satisfy the historical delegation-order gate.

## Foreman QP and IAA Outcomes

| Review | Outcome | Evidence |
|---|---|---|
| Foreman QP | PENDING for the narrowed scope | One reassessment requested after the artifact-only alignment; reviewed substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b`; the earlier QP PASS applied to the former scope |
| IAA final assurance | PENDING for the narrowed scope; no current-scope token or verdict | The earlier REJECTION-PACKAGE remains historical for the former scope in `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md`; its evidence_submissions finding is superseded for current scope by exclusion, not by a repair |

## Wave completion gate

- [x] Targeted migration and regression checks pass; Data API CI records 88 in-scope migrations replayed and all four focused PASS milestones
- [ ] Builder source trace and exact grant rationale reassessed by Foreman QP for the narrowed scope
- [x] Historical delegation-order exception remains truthful; no backdated proof
- [x] Historical CI delegation-order failure `107194446459` remains technically red and is covered only by CS2 comment `5979822573`
- [ ] Required checks and security review are resolved
- [ ] Independent final IAA assurance for the narrowed scope; CS2 final merge review remains separate and pending

## Outstanding assurance findings

- The existing `evidence_submissions` consumer/DDL column mismatch remains unresolved and outside this PR; the table and Wave 16.6 are excluded from current grants, fixtures, replay, and supported-use claims.
- The earlier IAA rejection reported OVL-CI-005 for the former scope. No PREHANDOVER artifact has been created; current-scope QP and independent final IAA remain pending.
- No production deployment occurred. The historical delegation-order failure is not reported as passing.
