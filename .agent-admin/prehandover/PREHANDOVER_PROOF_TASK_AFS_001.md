# PREHANDOVER PROOF — TASK-AFS-001

| Field | Value |
|---|---|
| **Task ID** | TASK-AFS-001 |
| **Wave** | audit-field-sync |
| **Session** | session-099 |
| **Builder** | qa-builder |
| **Date** | 2026-03-04 |
| **Branch** | copilot/sync-frontend-backend-audit-fields |
| **Commit SHA** | 7b23bcc |
| **IAA Trigger Category** | AAWP_MAT |
| **Status** | PREHANDOVER COMPLETE |

---

## Deliverables

| Artifact | Path | Status |
|---|---|---|
| Test file | `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` | ✅ CREATED |
| 5 tests present (T-AFS-COL-001 to T-AFS-COL-005) | — | ✅ CONFIRMED |
| No skip/todo/xit/xdescribe markers | — | ✅ CONFIRMED |
| File-based only (no live Supabase) | — | ✅ CONFIRMED |
| PREHANDOVER proof | This document | ✅ PRESENT |

---

## Test Run Evidence

**Command**: `pnpm run test:mat:red -- --reporter=verbose`  
**Filter**: `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts`

| Test ID | Test Name | Result |
|---------|-----------|--------|
| T-AFS-COL-001 | organisation_name column must be present in a migration | ✅ PASS |
| T-AFS-COL-002 | facility_location column must be present in a migration | ✅ PASS |
| T-AFS-COL-003 | audit_period_start column must be present in a migration | ✅ PASS |
| T-AFS-COL-004 | audit_period_end column must be present in a migration | ✅ PASS |
| T-AFS-COL-005 | useAudits.ts must NOT contain description workaround | ❌ FAIL (RED gate — CORRECT) |

**Summary**: 4 PASS, 1 FAIL — matches expected QA-to-Red gate design.

### T-AFS-COL-005 Failure Detail

```
AssertionError: useAudits.ts must not map organisation_name to description column —
fix: use organisation_name: input.organisation_name:
expected source not to contain 'description: input.organisation_name'
```

Confirmed: `modules/mat/frontend/src/lib/hooks/useAudits.ts` line ~110 contains:
```typescript
// organisation_name maps to description column as closest available DB column
description: input.organisation_name,
```

This is the RED gate that TASK-AFS-002 (ui-builder) must fix.

---

## Design Rationale

**Dual-role test design** (documented in test file header):

- **T-AFS-COL-001 to T-AFS-COL-004** (Migration Drift Guards): These tests are GREEN
  immediately because the migration columns already exist:
  - `organisation_name` + `facility_location` → `20260304000001_audits_add_criteria_approved.sql`
  - `audit_period_start` + `audit_period_end` → `20260303000000_audits_add_period_columns.sql`
  
  They exist to PROTECT against future schema drift. If a migration is dropped, these go RED.

- **T-AFS-COL-005** (Implementation Gate): RED because `useAudits.ts` still has the
  `description: input.organisation_name` workaround. TASK-AFS-002 must remove this.

This design is explicitly noted in IAA Pre-Brief §TASK-AFS-001 assurance rule #3 and accepted
by the IAA when qa-builder documents it in the test file (which is done — see file header comment).

---

## IAA Pre-Brief Compliance

| IAA Rule | Requirement | Status |
|---|---|---|
| Rule 1 | T-AFS-COL-001 searches ALL migration files for `organisation_name` | ✅ `allMigrationSql()` reads all .sql files |
| Rule 2 | T-AFS-COL-002 searches ALL migration files for `facility_location` | ✅ `allMigrationSql()` reads all .sql files |
| Rule 3 | T-AFS-COL-003/004 design explained in test file | ✅ Header comment documents dual-role design |
| Rule 4 | T-AFS-COL-005 RED confirmed — source has `description: input.organisation_name` | ✅ FAIL confirmed |
| Rule 5 | File-based only | ✅ No Supabase env required |
| Rule 6 | No skip markers | ✅ Zero xit/xdescribe/.skip/todo |

---

## FAIL-ONLY-ONCE Compliance

| Rule | Requirement | Status |
|---|---|---|
| A-027 | Column-level file-based tests present | ✅ 5 tests covering 4 columns + 1 hook guard |
| A-016 | PREHANDOVER proof present before reporting progress | ✅ This document |

---

## Vitest Config

Root `vitest.config.ts` includes:
```typescript
include: [
  'modules/mat/tests/**/*.test.ts',
  ...
]
```

The new test file at `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` is
automatically discovered by this glob. **No config changes were required.**

---

## Merge Gate Parity

| Check | Result |
|---|---|
| Test file created | ✅ PASS |
| 4 migration guard tests GREEN | ✅ PASS |
| 1 implementation gate RED (T-AFS-COL-005) | ✅ PASS (correct per design) |
| No test debt (.skip/.todo/xit) | ✅ PASS |
| File committed to branch | ✅ PASS (SHA: 7b23bcc) |
| PREHANDOVER proof present | ✅ PASS (this document) |

---

## IAA Invocation

**Status**: PHASE_A_ADVISORY (IAA review required before PR merge per AAWP_MAT trigger)

IAA must verify:
1. Test file exists with all 5 tests
2. T-AFS-COL-001 to T-AFS-COL-004 GREEN
3. T-AFS-COL-005 RED (confirmed FAIL with correct error message)
4. No skip markers
5. This PREHANDOVER proof committed to branch

**Dependency for TASK-AFS-002**: ui-builder must receive IAA ASSURANCE-TOKEN for TASK-AFS-001
before beginning TASK-AFS-002.

---

*Generated by: qa-builder*
*Session: session-099*
*Wave: audit-field-sync*
*Date: 2026-03-04*
*Authority: IAA Pre-Brief .agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md*
