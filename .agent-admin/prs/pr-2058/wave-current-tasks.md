# Wave Current Tasks — PR #2058

**Wave**: PR-2058-SECURITY-CORRECTION
**Session ID**: session-pr2058-data-api-grants-security-20261004
**Date**: 2026-10-04
**Branch**: codex/explicit-data-api-grants-20260923
**CS2 Authorization**: https://github.com/APGI-cmy/maturion-isms/pull/2058#issuecomment-5979407372
**iaa_prebrief_path**: `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md` (commit `908b5b4adf402e471ce96b6bd85dd826c13d9f7d`)

## Bounded scope

Correct the existing Data API grants PR only: preserve the MMM public-helper RPC hardening, resolve the exposed PIT SECURITY DEFINER helper surface without weakening RLS or approved RPC paths, and add/test `evidence_submissions` if its supported application use and RLS are confirmed. Keep the PostgreSQL privilege-list assertion and cite PostgreSQL documentation. No deployment, unrelated schema work, or changes to Foreman Tier 1/Tier 2/CANON.

## Historical delegation-order exception

CS2's one-time exception is recorded in PR comments 5978432262, 5979407372, and 5979822573. The existing implementation commits predate the exception; no pre-brief, builder appointment, or strict delegation-order proof is claimed for those historical commits. The gate remains technically red; CS2's disposition accepts only this historical ordering failure and does not waive the security changes, focused regression tests, code review, independent assurance, or CS2 merge review. This record does not fabricate evidence or alter the gate.

## Outstanding tasks

| Task ID | Task | Builder | Status | PR / Evidence |
|---|---|---|---|---|
| PR2058-SEC-01 | Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; remove public authenticated MMM grants; resolve PIT RPC-oracle exposure with the minimal private-schema design while preserving approved paths | schema-builder | ✅ IMPLEMENTATION COMPLETE; QP PASS | PR #2058; appointed 2026-10-04T11:29:57Z; final IAA result applies to the overall PR |
| PR2058-SEC-02 | Add exact `evidence_submissions` grants and replay/coverage fixture if confirmed supported; add focused regressions for helper non-callability/oracle denial and evidence-table grants; keep multi-privilege `has_table_privilege` assertion and cite PostgreSQL docs | schema-builder | ⚠️ GRANTS/DB REGRESSION COMPLETE; IAA FINDING OPEN | PR #2058; IAA found existing consumers query `organization_id` while the actual DDL defines `organisation_id`; no consumer fix or schema-to-consumer regression is included. PostgreSQL 17 docs: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS |

The recorded appointment is current and truthful; it does not assert that the appointment predates the original September implementation commits or satisfy the historical delegation-order gate.

## Foreman QP and IAA Outcomes

| Review | Outcome | Evidence |
|---|---|---|
| Foreman QP | PASS for the bounded security correction | Source/grant/RLS/RPC trace and CI regression evidence reviewed at stable security submission `a676496b20a7d861370e17faababcf610b15e30e`; known legacy consumer/DDL mismatch disclosed |
| IAA final assurance | REJECTION-PACKAGE; no token issued | `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md` — 2026-10-04 verdict, A-032/NBR-005 consumer/DDL mismatch and OVL-CI-005 missing PREHANDOVER CI evidence |

## Wave completion gate

- [x] Targeted migration and regression checks pass; Data API CI records 89 migrations replayed and all four focused PASS milestones
- [x] Builder source trace and exact grant rationale reviewed by Foreman QP
- [x] Historical delegation-order exception remains truthful; no backdated proof
- [x] Historical CI delegation-order failure `107194446459` remains technically red and is covered only by CS2 comment `5979822573`
- [ ] Required checks and security review are resolved
- [x] IAA final assurance invocation recorded as REJECTION-PACKAGE with no token; CS2 final merge review remains separate and pending

## Outstanding assurance findings

- IAA requires resolving the existing `evidence_submissions` consumer/DDL column mismatch (or formally removing the supported-use claim) and adding schema-to-consumer regression coverage. Product files were not changed in this bounded correction.
- IAA also reports OVL-CI-005: the active PR bundle lacks PREHANDOVER proof containing the CI evidence. No PREHANDOVER artifact was created under CS2's instruction.
- No production deployment occurred. The historical delegation-order failure is not reported as passing.
