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
| PR2058-SEC-02 | Narrow the grant surface to exclude unsupported `evidence_submissions` and Wave 16.6; retain the multi-privilege `has_table_privilege` assertion and PostgreSQL citation; add authenticated two-organisation PIT SELECT/RLS assertions and the future-only post-merge verification checklist | schema-builder | ✅ BOUNDED CORRECTION IMPLEMENTED; FOREMAN QP PASS; BUILDER REPORTED 88-MIGRATION REGRESSION PASS; CURRENT IAA REJECTION REMAINS OPEN; CS2 RISK DISPOSITION AND INDEPENDENT REASSESSMENT PENDING | PR #2058; `supabase/tests/data-api-grants-access.sql`, `supabase/DATA_API_GRANTS.md`; the separate legacy consumer/DDL mismatch remains unresolved and out of scope. PostgreSQL 17 docs: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS |

The recorded appointment is current and truthful; it does not assert that the appointment predates the original September implementation commits or satisfy the historical delegation-order gate.

## Foreman QP and IAA Outcomes

| Review | Outcome | Evidence |
|---|---|---|
| Foreman QP | PASS, accepted by CS2 for the narrowed scope | Reviewed substantive head `1eb903588c0bfc090925cdceb7414fddcccc615b`; CS2 appointment-route comment 5989073325 accepts this result |
| IAA final assurance | REJECTION-PACKAGE (39 PASS, 8 FAIL); no token | Latest class-routed verdict is appended to `.agent-admin/assurance/iaa-wave-record-PR-2058-SECURITY-CORRECTION-2026-10-04.md`. Its authenticated PIT SELECT and post-merge checklist findings have received bounded corrections and require independent reassessment; CS2 residual-risk disposition remains pending. The older evidence_submissions finding remains superseded by exclusion, not by repair. |
| Foreman QP — bounded correction | PASS | Reviewed the actual staged test and documentation diff after schema-builder handback. Builder-reported `python scripts/test-data-api-grants.py` result: 88 in-scope migrations replayed; all four focused PASS milestones. No Foreman test rerun was performed. |

## Foreman ECAP return review

Foreman accepted the committed ECAP bundle as evidence collation only, not as a readiness decision. Its 12-file count and the carrier's pre-IAA status are immutable historical observations. The actual PR diff contains 16 paths; the active scope inventory now lists all 16, including `.agent-workspace/independent-assurance-agent/memory/session-1298-20261005.md`. The previous active 15-path declaration and its 14+1 reconciliation claim were inaccurate. ECAP bundles and the carrier were not edited.

## Wave completion gate

- [x] Targeted migration and regression checks pass; Data API CI records 88 in-scope migrations replayed and all four focused PASS milestones
- [x] Builder source trace and exact grant rationale reassessed by Foreman QP for the narrowed scope; PASS accepted by CS2
- [x] Bounded authenticated PIT SELECT-isolation tests and future post-merge deployment/read/security checklist returned by schema-builder; Foreman QP PASS
- [x] Active scope path inventory reconciled once to the actual 16-path PR diff; immutable ECAP bundles and CI carrier retained unchanged
- [x] ECAP-001 appointed on 2026-10-05T06:12:10Z for the two scoped administrative return artifacts only
- [x] ECAP bundle returned and reviewed by Foreman as evidence collation only; single PR-scoped CI evidence carrier present
- [x] Historical delegation-order exception remains truthful; no backdated proof
- [x] Historical CI delegation-order failure `37204535364` at `ef762b8dd30f6ba4121e1830a9911c876d1eaa60` remains technically red and is covered only by CS2 comment `5979822573`; current snapshot also shows the gate failed
- [ ] Required checks and security review are resolved
- [ ] Independent IAA reassessment after CS2's explicit residual-security-risk disposition; CS2 merge review remains separate and pending

## Outstanding assurance findings

- The existing `evidence_submissions` consumer/DDL column mismatch remains unresolved and outside this PR; the table and Wave 16.6 are excluded from current grants, fixtures, replay, and supported-use claims.
- Latest IAA rejection's authenticated PIT `projects`/`source_links` SELECT-isolation and post-merge checklist findings have bounded corrections; independent reassessment is pending.
- CS2 has not yet explicitly disposed of residual security risk. The prior IAA rejection remains current; no new token, handover, or merge-readiness claim is made.
- The exact current PR diff count is 16; the active scope declaration now includes the IAA-owned session memory omitted from its former 15-path inventory. The historical ECAP count narrative is not rewritten.
- No production deployment occurred. The historical delegation-order failure is not reported as passing.
