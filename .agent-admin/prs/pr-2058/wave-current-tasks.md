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

CS2's one-time exception is recorded in PR comments 5978432262 and 5979407372. The existing implementation commits predate that exception; no pre-brief, builder appointment, or strict delegation-order proof is claimed for those historical commits. This exception does not waive the security changes, focused regression tests, code review, independent assurance, or CS2 merge review. The failed historical delegation-order check remains a gate decision for CS2; this record does not fabricate evidence or alter the gate.

## Outstanding tasks

| Task ID | Task | Builder | Status | PR / Evidence |
|---|---|---|---|---|
| PR2058-SEC-01 | Trace MMM/PIT helper definitions, execution security, RLS references, and client/RPC callers; remove public authenticated MMM grants; resolve PIT RPC-oracle exposure with the minimal private-schema design while preserving approved paths | schema-builder | 🟡 IN PROGRESS | PR #2058; appointed 2026-10-04T11:29:57Z |
| PR2058-SEC-02 | Add exact `evidence_submissions` grants and replay/coverage fixture if confirmed supported; add focused regressions for helper non-callability/oracle denial and evidence-table grants; keep multi-privilege `has_table_privilege` assertion and cite PostgreSQL docs | schema-builder | 🟡 IN PROGRESS | PR #2058; PostgreSQL 17 docs: https://www.postgresql.org/docs/17/functions-info.html#FUNCTIONS-INFO-ACCESS |

The recorded appointment is current and truthful; it does not assert that the appointment predates the original September implementation commits or satisfy the historical delegation-order gate.

## IAA Tokens Received This Wave

| PR # | Token | Date |
|---|---|---|
| 2058 | PENDING | — |

## Wave completion gate

- [ ] Targeted migration and regression checks pass with no skipped or incomplete tests
- [ ] Builder source trace and exact grant rationale reviewed
- [ ] Historical delegation-order exception remains truthful; no backdated proof
- [ ] Historical CI delegation-order failure `107194446459` remains disclosed until CS2 records the applicable gate disposition
- [ ] Required checks and security review are resolved
- [ ] IAA final assurance and CS2 review remain pending until their respective gates pass
