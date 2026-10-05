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
| PR2058-SEC-01 | Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; remove public authenticated MMM grants; resolve PIT RPC-oracle exposure with the minimal private-schema design while preserving approved paths | schema-builder | ✅ IMPLEMENTATION COMPLETE; NARROWED-SCOPE QP PASS ACCEPTED | PR #2058; historical builder appointment 2026-10-04T11:29:57Z; QP applies to stable substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b` |
| PR2058-SEC-02 | Narrow the grant surface to exclude unsupported `evidence_submissions` and Wave 16.6; retain the multi-privilege `has_table_privilege` assertion and PostgreSQL documentation citation | schema-builder | ✅ NARROWING, 88-MIGRATION FOCUSED CHECKS, AND QP PASS COMPLETE; ECAP REVIEWED; CI CARRIER PRESENT; FINAL IAA PENDING | PR #2058; the separate legacy consumer/DDL mismatch remains unresolved and out of scope. PostgreSQL 17 docs: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS |

The recorded appointment is current and truthful; it does not assert that the appointment predates the original September implementation commits or satisfy the historical delegation-order gate.

## Foreman QP and IAA Outcomes

| Review | Outcome | Evidence |
|---|---|---|
| Foreman QP | PASS, accepted by CS2 for the narrowed scope | Reviewed substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b`; CS2 appointment-route comment 5989073325 accepts this result |
| IAA final assurance | PENDING for the narrowed scope; no current-scope token or verdict | The earlier REJECTION-PACKAGE remains historical for the former scope in `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md`; its evidence_submissions finding is superseded for current scope by exclusion, not by a repair |

## Foreman ECAP return review

Foreman accepted the committed ECAP bundle as evidence collation only. Its 12-file count was a historical observation; GitHub reported 14 changed files at the reviewed pre-carrier head, and the frozen 15-path scope inventory includes the single authorized carrier now present. This reconciles the count without changing scope or editing the ECAP bundles. The carrier is `.agent-admin/prehandover/proof-pr-2058-data-api-grants-20261005.md`.

## Wave completion gate

- [x] Targeted migration and regression checks pass; Data API CI records 88 in-scope migrations replayed and all four focused PASS milestones
- [x] Builder source trace and exact grant rationale reassessed by Foreman QP for the narrowed scope; PASS accepted by CS2
- [x] ECAP-001 appointed on 2026-10-05T06:12:10Z for the two scoped administrative return artifacts only
- [x] ECAP bundle returned and reviewed by Foreman as evidence collation only; single PR-scoped CI evidence carrier present
- [x] Historical delegation-order exception remains truthful; no backdated proof
- [x] Historical CI delegation-order failure `37204535364` at `ef762b8dd30f6ba4121e1830a9911c876d1eaa60` remains technically red and is covered only by CS2 comment `5979822573`; current snapshot also shows the gate failed
- [ ] Required checks and security review are resolved
- [ ] Independent final IAA assurance for the narrowed scope; CS2 final merge review remains separate and pending

## Outstanding assurance findings

- The existing `evidence_submissions` consumer/DDL column mismatch remains unresolved and outside this PR; the table and Wave 16.6 are excluded from current grants, fixtures, replay, and supported-use claims.
- The earlier IAA rejection reported OVL-CI-005 for the former scope. The current-scope CI evidence carrier is present; independent final IAA remains pending.
- No production deployment occurred. The historical delegation-order failure is not reported as passing.
