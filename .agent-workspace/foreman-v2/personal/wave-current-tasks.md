# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave audit-field-sync / MAT Frontend-Backend Audit Creation Field Sync
**Session ID**: session-099
**Date**: 2026-03-04
**Branch**: copilot/sync-frontend-backend-audit-fields
**CS2 Authorization**: Issue opened and assigned by @APGI-cmy — "Orchestrate full frontend/backend sync for Audit form fields after broken PR #897"

---

## Outstanding Tasks (update as each is completed)

| # | Task | Builder | Status | PR / Evidence |
|---|------|---------|--------|---------------|
| 1 | RED gate tests T-AFS-COL-001 to T-AFS-COL-005: assert useCreateAudit writes organisation_name/facility_location/audit_period_start/audit_period_end to correct DB columns; assert Audit interface includes all new columns; assert no description-workaround present | qa-builder | 🔴 PENDING | — |
| 2 | Fix useAudits.ts: (a) update Audit interface to include organisation_name, facility_location, audit_period_start, audit_period_end; (b) fix useCreateAudit mutationFn to write all 4 fields to correct DB columns (remove description workaround); (c) update AuditList to display organisation_name | ui-builder | 🔴 PENDING | — |

**Status key**: 🔴 PENDING | 🟡 IN PROGRESS | 🟢 DONE (IAA ASSURANCE-TOKEN received) | ❌ BLOCKED

---

## IAA Tokens Received This Wave

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [ ] All tasks above show 🟢 DONE
- [ ] IAA Pre-Brief exists at .agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md
- [ ] All PRs have ASSURANCE-TOKEN
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

---

## Wave Scope: Frontend-Backend Audit Creation Field Sync

### Root Cause
PR #897 (Wave postbuild-fails-02 — Supabase RLS remediation) caused drift between the
AuditCreationForm UI fields and the useCreateAudit hook's DB writes:
- The hook maps `organisation_name` → `description` column (WRONG — should go to `organisation_name`)
- The hook silently drops `facility_location`, `audit_period_start`, `audit_period_end` (NOT written to DB)
- The `Audit` TypeScript interface is missing all four new columns

### Architecture Authority
- data-architecture.md §1.1.3: audits table has organisation_name (VARCHAR(255) NOT NULL),
  facility_location (VARCHAR(255)), audit_period_start (DATE), audit_period_end (DATE)
- Migrations already present: 20260303000000_audits_add_period_columns.sql (organisation_name,
  facility_location, audit_period_start, audit_period_end)

### FAIL-ONLY-ONCE Rule A-027 (COLUMN-LEVEL-DRIFT-QA-TO-RED)
Per A-027: for every modified frontend hook that writes to Supabase, the QA-to-Red suite
MUST include at least one file-based test asserting the written column exists in migration SQL.
T-AFS-COL-001 to T-AFS-COL-005 satisfy this requirement.

### Tasks Detail

**TASK-AFS-001 (qa-builder)**: Create modules/mat/tests/audit-field-sync/audit-field-sync.test.ts
  Test file-based (no live Supabase required). Tests:
  - T-AFS-COL-001: migration SQL contains organisation_name column
  - T-AFS-COL-002: migration SQL contains facility_location column
  - T-AFS-COL-003: migration SQL contains audit_period_start column
  - T-AFS-COL-004: migration SQL contains audit_period_end column
  - T-AFS-COL-005: useAudits.ts does NOT use description workaround for organisation_name
    (source must contain `organisation_name: input.organisation_name` pattern)
  All 5 tests must be RED (FAIL) before implementation begins.

**TASK-AFS-002 (ui-builder)**: Fix modules/mat/frontend/src/lib/hooks/useAudits.ts
  (a) Update Audit interface: add organisation_name, facility_location, audit_period_start,
      audit_period_end fields
  (b) Fix useCreateAudit mutationFn insert payload: remove `description: input.organisation_name`,
      add `organisation_name: input.organisation_name`, `facility_location: input.facility_location`,
      `audit_period_start: input.audit_period_start || null`,
      `audit_period_end: input.audit_period_end || null`
  (c) Update AuditList.tsx to display audit.organisation_name below audit.title
  All T-AFS-COL-001 to T-AFS-COL-005 must be GREEN after this fix.

---

## IAA Pre-Brief Finding — FOREMAN RESPONSE

IAA Pre-Brief flagged `organisation_name` and `facility_location` as missing from migrations.

**FOREMAN CORRECTION (verified 2026-03-04):**
Both columns ARE present in migration `20260304000001_audits_add_criteria_approved.sql`:
- `ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS organisation_name TEXT;` — line 7
- `ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS facility_location TEXT;` — line 10

IAA inspection missed this file (checked only `20260302000000` and `20260303000000`).

**Impact on test strategy:**
- T-AFS-COL-001 to T-AFS-COL-004: Will be GREEN (migrations exist) — these act as drift guards
- T-AFS-COL-005: Will be RED (hook uses `description` workaround) — the primary QA-to-Red gate
- TASK-AFS-002 (ui-builder): No migration needed — all 4 columns already exist in DB. Fix scope is hook + interface + AuditList only.

The `allMigrationSql()` helper in column-mapping tests reads ALL .sql files — all T-AFS-COL tests will correctly scan all migration files.

**No schema-builder task required for this wave.**
