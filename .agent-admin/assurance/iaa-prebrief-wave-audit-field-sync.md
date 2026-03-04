# IAA Pre-Brief — Wave: audit-field-sync

| Field | Value |
|---|---|
| **Pre-Brief Type** | WAVE PRE-BRIEF |
| **Wave** | audit-field-sync |
| **Session** | session-099 |
| **Branch** | copilot/sync-frontend-backend-audit-fields |
| **Date** | 2026-03-04 |
| **IAA Version** | 6.2.0 |
| **Foreman** | foreman-v2-agent v6.2.0 |
| **Artifact Path** | `.agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md` |
| **Status** | COMMITTED — ACTIVE |

---

## Phase 0 Execution Record

**Step 0.1 — Pre-Brief Invocation Confirmed:**
Session triggered with `ACTION: PRE-BRIEF` and `WAVE: audit-field-sync`. This is a distinct
Phase 0 invocation. Phases 1–4 assurance are NOT executed this session.
Pre-Brief mode: ACTIVE.

**Step 0.2 — wave-current-tasks.md read:**
File path: `.agent-workspace/foreman-v2/personal/wave-current-tasks.md`
Commit SHA: `befc143841b76da752482ffaa64d9c36dc4ec5cc`
Wave confirmed: `audit-field-sync / MAT Frontend-Backend Audit Creation Field Sync`
Total declared tasks: **2**

**Step 0.3 — Task Classification:**
Both tasks evaluated against INDEPENDENT_ASSURANCE_AGENT_CANON.md §Trigger Table.

| Task | Builder | Category | Qualifying? |
|------|---------|----------|-------------|
| TASK-AFS-001: RED Gate Tests | qa-builder | AAWP_MAT | ✅ QUALIFYING |
| TASK-AFS-002: Fix useAudits.ts | ui-builder | AAWP_MAT | ✅ QUALIFYING |

**IAA Trigger Category**: AAWP_MAT — Both tasks are build deliverables (AAWP/MAT PRs).
Both tasks require IAA assurance before merge. No EXEMPT tasks in this wave.

---

## Critical Pre-Brief Finding — MIGRATION GAP DETECTED

> ⚠️ **CRITICAL — READ BEFORE DELEGATING TO qa-builder AND ui-builder**

The wave summary states: *"Migrations: `20260303000000_audits_add_period_columns.sql` adds all
4 columns (already present, migrations are CORRECT)."* **This statement is INCORRECT.**

**IAA inspection of actual migration files on branch reveals:**

| Column | Migration File | Present? |
|--------|---------------|----------|
| `audit_period_start` | `20260303000000_audits_add_period_columns.sql` | ✅ YES |
| `audit_period_end` | `20260303000000_audits_add_period_columns.sql` | ✅ YES |
| `organisation_name` | ANY migration file | ❌ **NOT PRESENT** |
| `facility_location` | ANY migration file | ❌ **NOT PRESENT** |

**Evidence:**
- `20260303000000_audits_add_period_columns.sql` content (SHA: `9f1eddffd603ddc4d7f86c8a2833ddd25758f2bb`):
  ```sql
  ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS audit_period_start DATE;
  ALTER TABLE public.audits ADD COLUMN IF NOT EXISTS audit_period_end DATE;
  ```
  Only 2 columns — NOT 4.

- `20260302000000_mat_core_tables.sql` (SHA: `51e54432ff7245c86d3a871defb443d6161d641c`):
  The `audits` table definition includes `title`, `description`, `framework`, `status`,
  `target_date`, `created_by`, `created_at`, `updated_at`, `deleted_at` — **no `organisation_name`,
  no `facility_location`.**

**Impact on Wave Tasks:**

1. **TASK-AFS-001 (qa-builder)**: Tests T-AFS-COL-001 and T-AFS-COL-002 assert that migration
   SQL contains `organisation_name` and `facility_location`. These tests WILL be RED (correct
   for QA-to-Red gate), but for the reason that **the migrations genuinely do not exist yet**,
   not merely that the hook has drift. qa-builder must be aware they are writing tests for
   missing migrations, not just for hook bugs.

2. **TASK-AFS-002 (ui-builder)**: Any Supabase insert using
   `organisation_name: input.organisation_name` or `facility_location: input.facility_location`
   will result in a **Postgres column-not-found runtime error** until the schema migration is
   applied. ui-builder must include a new migration OR confirm with Foreman whether a migration
   task is in scope for this wave.

**Foreman Action Required (BEFORE delegating TASK-AFS-001 or TASK-AFS-002):**
A missing migration task must be explicitly scoped, OR the Foreman must confirm that
`organisation_name` and `facility_location` are being added as part of TASK-AFS-002's
deliverables (and the test in T-AFS-COL-001/002 checks ALL migration files, not just
`20260303000000_audits_add_period_columns.sql`). The IAA assurance check for TASK-AFS-002's
PR will verify that a migration adding these two columns is present before issuing ASSURANCE-TOKEN.

---

## Qualifying Task Pre-Brief Entries

---

### TASK-AFS-001 — RED Gate Tests

| Field | Value |
|---|---|
| **task_id** | TASK-AFS-001 |
| **builder** | qa-builder |
| **task_summary** | Create `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` with 5 file-based tests (T-AFS-COL-001 through T-AFS-COL-005) that must all be RED before TASK-AFS-002 begins |
| **iaa_trigger_category** | AAWP_MAT |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Verdict) |

#### Required Evidence Artifacts

| # | Artifact | Required? | Notes |
|---|----------|-----------|-------|
| 1 | `modules/mat/tests/audit-field-sync/audit-field-sync.test.ts` | **MANDATORY** | Test file must exist and contain all 5 test cases (T-AFS-COL-001 to T-AFS-COL-005) |
| 2 | Test run output showing all 5 tests RED (FAIL) | **MANDATORY** | Screenshot, log, or CI artifact proving RED state before TASK-AFS-002 |
| 3 | PREHANDOVER proof committed to branch | **MANDATORY** | Per FAIL-ONLY-ONCE A-016 |

#### Applicable Overlays

- **AAWP_MAT overlay** — functional correctness, wiring, test coverage
- **FAIL-ONLY-ONCE A-027** (COLUMN-LEVEL-DRIFT-QA-TO-RED): file-based column-existence tests
  required for every Supabase hook that writes to the DB

#### Specific Assurance Rules (what IAA will check at PR review time)

1. **T-AFS-COL-001**: Does the test check that a migration SQL file (any file in
   `apps/maturion-maturity-legacy/supabase/migrations/`) contains `organisation_name` for
   the `audits` table? Given the migration gap noted above, this test must be written to
   search across ALL migration files, not only `20260303000000_audits_add_period_columns.sql`.

2. **T-AFS-COL-002**: Same as above for `facility_location`. Must search ALL migration files.

3. **T-AFS-COL-003**: Test must confirm `audit_period_start` is present in
   `20260303000000_audits_add_period_columns.sql` (confirmed present — test will be GREEN
   immediately unless the test logic is wrong; qa-builder must ensure the test is structured
   to fail RED before the hook fix — this column's test may need to be scoped differently or
   the test design explained).
   > ⚠️ **NOTE**: T-AFS-COL-003 and T-AFS-COL-004 test migration SQL presence — those columns
   > already exist in the migration. The QA-to-RED requirement is that these tests pass (GREEN)
   > as evidence the migration is correct, while T-AFS-COL-005 is the test that will be RED.
   > IAA will accept this interpretation if qa-builder documents it explicitly in the test file.
   > Alternatively, if the wave intent is that ALL 5 tests are RED initially, qa-builder must
   > clarify the design in the test file comments.

4. **T-AFS-COL-005**: The negative assertion — `useAudits.ts` source must NOT contain
   `description: input.organisation_name`. This will be RED because the current source
   (SHA: `51d4e2caef27441eb0dcbabe76efcd2aacfdb1ef`) contains exactly that pattern on line
   ~96: `description: input.organisation_name`. ✅ confirmed RED.

5. **Test file structure**: Tests must be file-based (no live Supabase connection required).
   Test runner must be configured to discover this test file (vitest config or jest config
   must include `modules/mat/tests/audit-field-sync/`).

6. **No test suite skip markers**: No `xit`, `xdescribe`, `.skip`, or `todo` on any of the
   5 tests. IAA will reject if any test is disabled.

#### Pre-Brief Disposition

> QUALIFYING — AAWP_MAT. IAA assurance required before PR merge.
> Foreman must NOT merge TASK-AFS-001 PR without IAA ASSURANCE-TOKEN.

---

### TASK-AFS-002 — Fix useAudits.ts

| Field | Value |
|---|---|
| **task_id** | TASK-AFS-002 |
| **builder** | ui-builder |
| **task_summary** | Fix `modules/mat/frontend/src/lib/hooks/useAudits.ts` and `modules/mat/frontend/src/components/audits/AuditList.tsx` to correctly write all 4 fields to DB and display `organisation_name` in the list |
| **iaa_trigger_category** | AAWP_MAT |
| **required_phases** | Phase 2 (Alignment), Phase 3 (Assurance), Phase 4 (Verdict) |
| **dependency** | TASK-AFS-001 must have ASSURANCE-TOKEN before TASK-AFS-002 begins |

#### Required Evidence Artifacts

| # | Artifact | Required? | Notes |
|---|----------|-----------|-------|
| 1 | Updated `modules/mat/frontend/src/lib/hooks/useAudits.ts` | **MANDATORY** | Must contain corrected insert payload and updated `Audit` interface |
| 2 | Updated `modules/mat/frontend/src/components/audits/AuditList.tsx` | **MANDATORY** | Must display `audit.organisation_name` below `audit.title` |
| 3 | Migration SQL for `organisation_name` and `facility_location` columns | **MANDATORY** | See migration gap finding above. New migration file OR confirmed existing migration must add these columns to `public.audits` before the hook fix is meaningful |
| 4 | Test run output showing all 5 tests GREEN (PASS) after fix | **MANDATORY** | T-AFS-COL-001 through T-AFS-COL-005 all GREEN |
| 5 | PREHANDOVER proof committed to branch | **MANDATORY** | Per FAIL-ONLY-ONCE A-016 |

#### Applicable Overlays

- **AAWP_MAT overlay** — functional correctness, wiring, column-level correctness
- **FAIL-ONLY-ONCE A-027** (COLUMN-LEVEL-DRIFT-QA-TO-RED): all 5 column tests must be GREEN

#### Specific Assurance Rules (what IAA will check at PR review time)

**Audit Interface checks:**

1. `Audit` interface in `useAudits.ts` must include all 4 new fields:
   ```typescript
   organisation_name: string;
   facility_location?: string;
   audit_period_start?: string;
   audit_period_end?: string;
   ```
   IAA will scan the interface definition for these exact field names.

2. `CreateAuditInput` interface already has the correct 4 fields in the current source
   (confirmed). No change required to this interface.

**useCreateAudit mutationFn checks:**

3. The insert payload must NOT contain `description: input.organisation_name`.
   IAA will grep the file and FAIL immediately if this pattern persists.

4. The insert payload must contain:
   - `organisation_name: input.organisation_name` — maps to the `organisation_name` DB column
   - `facility_location: input.facility_location || null` (or equivalent null-safe expression)
   - `audit_period_start: input.audit_period_start || null` (or equivalent)
   - `audit_period_end: input.audit_period_end || null` (or equivalent)

5. `description` field: The current `Audit` interface retains `description?: string`. If the
   insert payload drops `description` entirely, that is acceptable. If it retains it with a
   separate/optional value, that is also acceptable. It must NOT be used as a workaround for
   `organisation_name`.

**AuditList.tsx checks:**

6. `AuditList.tsx` must render `audit.organisation_name` in the list item for each audit,
   positioned below `audit.title`. IAA will check for `audit.organisation_name` in the JSX.

7. No TypeScript compile errors: adding `organisation_name` to the `Audit` interface must not
   introduce TypeScript type errors in `AuditList.tsx`. IAA will expect the build to be clean.

**Migration checks (CRITICAL — from Pre-Brief Finding above):**

8. A migration file must exist that adds `organisation_name VARCHAR(255) NOT NULL` (or
   equivalent) to `public.audits`. IAA will scan all files in
   `apps/maturion-maturity-legacy/supabase/migrations/` for `organisation_name` in an
   `ALTER TABLE public.audits ADD COLUMN` statement.

9. A migration file must exist that adds `facility_location` to `public.audits`. Same scan
   as above.

10. If the migration for `organisation_name` adds a NOT NULL column to a table that may already
    have rows, a `DEFAULT` clause or `SET DEFAULT` strategy must be present to avoid breaking
    existing data. IAA will flag a missing DEFAULT on a NOT NULL ADD COLUMN as a finding.

**Test GREEN gate:**

11. All 5 tests T-AFS-COL-001 through T-AFS-COL-005 must PASS after TASK-AFS-002 is applied.
    Evidence must be provided in the PREHANDOVER proof.

#### Pre-Brief Disposition

> QUALIFYING — AAWP_MAT. IAA assurance required before PR merge.
> Foreman must NOT merge TASK-AFS-002 PR without IAA ASSURANCE-TOKEN.
> Dependency: TASK-AFS-001 ASSURANCE-TOKEN required first.

---

## Wave-Level IAA Requirements Summary

| Requirement | Detail |
|---|---|
| IAA Pre-Brief present | ✅ This document — committed before any builder work begins |
| TASK-AFS-001 assurance | Required. PR must not merge without ASSURANCE-TOKEN |
| TASK-AFS-002 assurance | Required. PR must not merge without ASSURANCE-TOKEN |
| Merge sequence | AFS-001 token → AFS-002 token → CS2 merge approval |
| FAIL-ONLY-ONCE rules active | A-027 (column-level drift QA-to-Red), A-017 (ISMS agents only), A-016 (Phase 4 before report_progress) |

---

## FAIL-ONLY-ONCE Rules Active This Wave

| Rule | Description | Applies To |
|------|-------------|-----------|
| **A-027** | COLUMN-LEVEL-DRIFT-QA-TO-RED: column-existence tests required for every hook that writes to Supabase | TASK-AFS-001, TASK-AFS-002 |
| **A-017** | ISMS-AGENTS-ONLY: only inducted ISMS agents may be delegated to. qa-builder and ui-builder are inducted. No other agents may be delegated these tasks | Both tasks |
| **A-016** | PHASE-4-BEFORE-REPORT-PROGRESS: Phase 4 artifacts (PREHANDOVER proof) must exist before report_progress for handover | Both tasks |

---

## Non-Qualifying Tasks This Wave

None. Both declared tasks are QUALIFYING.

---

## Pre-Brief Status

```
IAA Pre-Brief: COMPLETE
Wave: audit-field-sync
Qualifying tasks found: 2 (TASK-AFS-001, TASK-AFS-002)
Critical finding: MIGRATION GAP — organisation_name and facility_location not in any migration
Pre-Brief artifact: .agent-admin/assurance/iaa-prebrief-wave-audit-field-sync.md
Committed: YES (see commit SHA below)
Builders may proceed: YES — after Foreman reads and acts on Critical Finding above
```

---

*Generated by: independent-assurance-agent v6.2.0*
*Session: session-099*
*Date: 2026-03-04*
*Authority: CS2 (@APGI-cmy)*
