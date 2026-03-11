# PREHANDOVER Proof — wave-ai-criteria-creation-fix

**Session ID**: session-wave-ai-criteria-creation-fix-20260311
**Wave ID**: wave-ai-criteria-creation-fix
**Branch**: copilot/fix-ai-criteria-creation-failure
**Date**: 2026-03-11
**Producing Agent**: foreman-v2-agent v6.2.0
**Issue Ref**: Diagnostic Wave: Fix AI Criteria Creation Failure in MAT App
**CS2 Authorization**: Issue body: "CS2 note: Full authority granted for this diagnostic wave"

---

## Scope Declaration

| File | Type |
|------|------|
| `apps/maturion-maturity-legacy/supabase/migrations/20260311000001_criteria_add_title_column.sql` | Schema migration (PRIMARY FIX) |
| `modules/mat/tests/wave17/wave17-criteria-title-fix.test.ts` | QA RED→GREEN gate tests |
| `.agent-admin/assurance/iaa-prebrief-wave-ai-criteria-creation-fix.md` | IAA Pre-Brief artifact |
| `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | Governance: v3.9.0, INC-CRITERIA-DISPLAY-PREBRIEF-IMPL-001 REMEDIATED |
| `.agent-workspace/foreman-v2/personal/wave-current-tasks.md` | Wave task register |
| `.agent-workspace/foreman-v2/personal/SCOPE_DECLARATION.md` | Scope declaration |

---

## Root Cause Documented

**PRIMARY ROOT CAUSE**: The `criteria` table (DDL: `apps/maturion-maturity-legacy/supabase/migrations/20260302000000_mat_core_tables.sql`) was missing a `title TEXT` column. The Edge Function (`supabase/functions/invoke-ai-parse-criteria/index.ts`, line 318) attempts to upsert `title: c.title ?? null`. PostgreSQL rejected all INSERT/UPSERT operations with `column "title" of relation "criteria" does not exist`. This caused `criteriaError` to be thrown → caught by try-catch → `criteria_documents.status = 'parse_failed'` → no criteria stored in DB.

**SECONDARY ROOT CAUSE**: The `description TEXT NOT NULL` constraint in the criteria table DDL conflicted with the Edge Function sending `c.description ?? null`. When AI does not provide a description for a criterion, the upsert would fail with a NOT NULL constraint violation even after the title column was added.

**Fix**: New migration `20260311000001_criteria_add_title_column.sql` adds:
1. `ALTER TABLE public.criteria ADD COLUMN IF NOT EXISTS title TEXT;`
2. `ALTER TABLE public.criteria ALTER COLUMN description DROP NOT NULL;` (idempotent DO block)

---

## A-032 Schema Column Compliance

**DDL file**: `apps/maturion-maturity-legacy/supabase/migrations/20260302000000_mat_core_tables.sql`
**Fix migration**: `apps/maturion-maturity-legacy/supabase/migrations/20260311000001_criteria_add_title_column.sql`

**Columns in Edge Function criteria INSERT (index.ts line 309-321)**:
- `mps_id` ✅ (FK to mini_performance_standards.id)
- `domain_id` ✅ (FK to domains.id)
- `audit_id` ✅
- `organisation_id` ✅
- `number` ✅ (INTEGER)
- `title` ✅ (added by this migration)
- `description` ✅ (NOT NULL dropped by this migration; nullable now)
- `guidance` ✅

**DDL cross-check**: PASS — all 8 columns inserted by Edge Function now exist in schema.

---

## Test Evidence

**Command**: `npx vitest run modules/mat/tests/wave17/wave17-criteria-title-fix.test.ts`

```
✓ [T-W17-CP-001] criteria table DDL must include `title TEXT` column (nullable)
✓ [T-W17-CP-002] criteria table DDL must NOT have `description TEXT NOT NULL`
✓ [T-W17-CP-003] Edge Function criteria upsert payload includes `title:` field
✓ [T-W17-CP-004] Fix migration file exists for criteria title column
✓ [T-W17-CP-005] Fix migration adds `title` column with ADD COLUMN IF NOT EXISTS guard

Test Files  1 passed (1)
     Tests  5 passed (5)
```

**Full suite**: `npx vitest run modules/mat/tests/`
```
580 passed / 588 total
8 pre-existing failures (wave13 E2E tests requiring VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY — pre-existing before this wave)
```

---

## RLS Verification

Existing RLS policies on `criteria` table (from base migration + subsequent migrations):
- `criteria_org_isolation` — SELECT: USING (organisation_id = current_setting) ✅
- No INSERT/UPDATE/DELETE policies exist on criteria (criteria is managed exclusively through cascade deletes and the Edge Function via service role) — acceptable per architecture

The new `title TEXT` column inherits existing RLS policies automatically. No new RLS required.

---

## QP Evaluations

| Builder | Task | Verdict |
|---------|------|---------|
| qa-builder | T-W17-QA-001 — Red gate tests | QP PASS |
| schema-builder | T-W17-SCH-001 — Migration | QP PASS |

---

## OPOJD Gate

- [x] Zero test failures (in wave17 scope: 5/5 pass)
- [x] Zero skipped/todo/stub tests
- [x] Zero test debt
- [x] Evidence artifacts present (this PREHANDOVER proof + session memory)
- [x] Architecture followed (migration pattern: IF NOT EXISTS guards, idempotent DDL)
- [x] Zero deprecation warnings
- [x] Zero compiler/linter warnings

**OPOJD: PASS**

---

## §4.3 Merge Gate Parity

- Wave17 tests: 5/5 PASS ✅
- Full suite: 580/588 PASS (8 pre-existing failures) ✅
- POLC boundary: No production code written by Foreman ✅
- Session memory: Written ✅
- SCOPE_DECLARATION.md: Fresh overwrite ✅

**merge_gate_parity: PASS**

---

## IAA Audit Token

`iaa_audit_token: IAA-session-wave-ai-criteria-creation-fix-20260311-PASS`
(Expected reference at commit time — §4.3b; will be written to dedicated token file by IAA)

---

## Git Log (pre-IAA)

Commit history will be confirmed at IAA invocation time. All ceremony artifacts committed BEFORE IAA invocation per A-021.

---

## IAA Agent Response (verbatim)

```
═══════════════════════════════════════════════════════════════
ASSURANCE-TOKEN
PR: wave-ai-criteria-creation-fix / copilot/fix-ai-criteria-creation-failure
R2 FAST-PASS: 1 previously-failed check (A-026/CORE-021) now PASS.
All 36 checks PASS. Merge gate parity: PASS.
Merge permitted (subject to CS2 approval).
Token reference: IAA-session-wave-ai-criteria-creation-fix-20260311-R2-PASS
Adoption phase: PHASE_B_BLOCKING — Hard gate ACTIVE
Authority: CS2 ONLY (@APGI-cmy)
═══════════════════════════════════════════════════════════════
```

**IAA token file**: `.agent-admin/assurance/iaa-token-session-wave-ai-criteria-creation-fix-20260311.md`

R1 REJECTION-PACKAGE: A-026/CORE-021 — SCOPE_DECLARATION.md missing 3 ceremony files → FIXED in commit e883723.
R2: All 36 FFA checks PASS. ASSURANCE-TOKEN issued.

*Authority: foreman-v2-agent v6.2.0 | CS2: @APGI-cmy*
