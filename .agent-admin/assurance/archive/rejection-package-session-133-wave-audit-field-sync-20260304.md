# IAA REJECTION-PACKAGE — session-133 / wave audit-field-sync

| Field | Value |
|---|---|
| **Verdict** | REJECTION-PACKAGE |
| **Session** | session-133 |
| **Wave** | audit-field-sync |
| **Branch** | copilot/sync-frontend-backend-audit-fields |
| **Date** | 2026-03-04 |
| **IAA Version** | 6.2.0 |
| **Adoption Phase** | PHASE_B_BLOCKING — hard gate ACTIVE |
| **PR Category** | AAWP_MAT |
| **Invoking Agent** | foreman-v2-agent (session-099 wave handover request) |
| **Producing Agents** | qa-builder (TASK-AFS-001), ui-builder (TASK-AFS-002) |
| **Checks Executed** | 42 |
| **Checks Passed** | 38 |
| **Checks Failed** | 4 |
| **Merge Gate Parity** | FAIL |

---

## REJECTION-PACKAGE Block

```
═══════════════════════════════════════════════════════════════
REJECTION-PACKAGE
PR: branch copilot/sync-frontend-backend-audit-fields
    Wave: audit-field-sync / Session-133
4 check(s) FAILED. Merge BLOCKED. STOP-AND-FIX required.
═══════════════════════════════════════════════════════════════
```

---

## Failure 1 — CORE-015: Session memory / ceremony artifacts absent (TASK-AFS-002)

**Check**: CORE-015 (Session memory present) — ALL PRs  
**Evidence**: TASK-AFS-002 (ui-builder — useAudits.ts + AuditList.tsx fix) has no PREHANDOVER proof and no session memory file on the branch. The wave has two qualifying tasks per the IAA Pre-Brief. Only TASK-AFS-001 has ceremony artifacts. TASK-AFS-002 deliverables are committed (2014aaa) but the ceremony stack is entirely absent.  
**Finding**: Pre-Brief Required Evidence for TASK-AFS-002 row #5: "PREHANDOVER proof committed to branch — MANDATORY." No such file exists.  
**Fix required**: ui-builder must commit a PREHANDOVER proof for TASK-AFS-002 covering the useAudits.ts fix and AuditList.tsx update, including session memory reference, iaa_audit_token field (§4.3b format), and all Pre-Brief compliance checks. Must be committed before re-invocation.

---

## Failure 2 — CORE-016 + CORE-018: `iaa_audit_token` field absent from PREHANDOVER proof (TASK-AFS-001)

**Check**: CORE-016 (IAA verdict evidenced §4.3b) + CORE-018 (Complete evidence artifact sweep) — ALL PRs  
**Evidence**: `PREHANDOVER_PROOF_TASK_AFS_001.md` contains:
```
**Status**: PHASE_A_ADVISORY (IAA review required before PR merge per AAWP_MAT trigger)
```
The `iaa_audit_token:` field required by §4.3b architecture (A-029) is entirely absent. "PHASE_A_ADVISORY" is factually incorrect — the system has been PHASE_B_BLOCKING since 2026-03-04. This is not the INC-IAA-SKIP-001 fabrication pattern, but the absence of the mandatory `iaa_audit_token` field causes CORE-016 and CORE-018 to fail.  
**Finding**: PREHANDOVER proof does not contain `iaa_audit_token` field; PHASE_A_ADVISORY text is incorrect adoption phase.  
**Fix required**:
1. Add `iaa_audit_token: IAA-session-NNN-wave-audit-field-sync-20260304-PASS` to PREHANDOVER_PROOF_TASK_AFS_001.md where NNN = the session number of the NEXT IAA invocation.
2. Replace "PHASE_A_ADVISORY" status text with correct §4.3b field and PHASE_B_BLOCKING declaration.
3. Per A-029: once this corrected proof is committed, it is READ-ONLY. IAA will not modify it post-commit.

---

## Failure 3 — A-026 / BL-027: SCOPE_DECLARATION.md stale

**Check**: A-026 (SCOPE_DECLARATION must match PR diff exactly) + BL-027 (Merge gate parity)  
**Evidence**: SCOPE_DECLARATION.md on the branch reads:
```
# Scope Declaration — governance-liaison-isms Session-045
PR: copilot/propagate-governance-changes-e45c6ae2-8853-4ff3-bb03-1720769d28b6
Session: governance-liaison-isms session-045-20260304
```
This file belongs to the previous wave (governance ripple 61ab7b83). It has NOT been updated for wave audit-field-sync. The actual `git diff --name-only origin/main...HEAD` shows 6 files:
- `.agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md`
- `.agent-admin/prehandover/PREHANDOVER_PROOF_TASK_AFS_001.md`
- `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
- `modules/mat/frontend/src/components/audits/AuditList.tsx`
- `modules/mat/frontend/src/lib/hooks/useAudits.ts`
- `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts`

None of these are listed in the SCOPE_DECLARATION.md.  
**Fix required**: Update/create SCOPE_DECLARATION.md for wave audit-field-sync, listing these 6 files plus SCOPE_DECLARATION.md itself. Per A-028: use list format, trim all prior-wave entries. Commit before re-invocation.

---

## What Does NOT Need Redoing

The substantive build work is SOUND:

| Deliverable | Status | Notes |
|---|---|---|
| `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` | ✅ SOUND | 5/5 tests pass, no test debt, file-based only |
| `modules/mat/frontend/src/lib/hooks/useAudits.ts` | ✅ SOUND | All 4 fields correctly mapped, workaround removed, interface updated |
| `modules/mat/frontend/src/components/audits/AuditList.tsx` | ✅ SOUND | organisation_name rendered below title with guard |
| Migration 20260304000001 | ✅ SOUND | organisation_name + facility_location present; audit_period columns already in 20260303000000 |
| Test result (wave-scope) | ✅ 11/11 PASS | 0 new failures introduced |
| End-to-end wiring | ✅ VERIFIED | DB → hook → UI chain complete |
| Auth guards | ✅ PRESENT | getUser + profiles.organisation_id resolve |
| RLS | ✅ PASS | Table-level RLS addressed in postbuild-fix migrations |

The three failures are entirely in the ceremony layer (§4.3b field, missing TASK-AFS-002 proof, SCOPE_DECLARATION). No build rework required.

---

## Advisory (non-blocking, for future wave consideration)

- BD-022: `organisation_name` declared `VARCHAR NOT NULL` in data-architecture.md §1.1.3, but migration adds it as `TEXT` (nullable). Consider a follow-up migration addendum to align schema type and NOT NULL constraint.
- BD-017: Runtime input validation (length/format) for `organisation_name` and `facility_location` would be a hardening improvement for a future wave.

---

## Re-Invocation Instructions

1. qa-builder: Fix PREHANDOVER_PROOF_TASK_AFS_001.md — add `iaa_audit_token` field per §4.3b. Commit.
2. ui-builder: Create PREHANDOVER proof for TASK-AFS-002. Commit.
3. Foreman or responsible agent: Update SCOPE_DECLARATION.md. Commit.
4. Invoke IAA for re-invocation. Reference this rejection package as the prior rejection.

All three fixes must be in committed state before re-invocation. Per A-021: working-tree-only changes are not committed changes.

---

*Generated by: independent-assurance-agent v6.2.0*
*Session: session-133*
*Date: 2026-03-04*
*Authority: CS2 (@APGI-cmy)*
*This is a hard-blocking REJECTION-PACKAGE. No PR opens until all failures are resolved.*
