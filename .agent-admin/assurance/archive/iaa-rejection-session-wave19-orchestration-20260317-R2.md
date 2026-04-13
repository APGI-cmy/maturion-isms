# IAA REJECTION-PACKAGE R2 — Wave 19: MAT Criteria Parsing Holistic Repair

**Document type**: IAA REJECTION-PACKAGE
**Token reference**: IAA-session-wave19-orchestration-20260317-REJECTION-R2
**PR**: Wave 19 — MAT Criteria Parsing Holistic Repair
**Branch**: copilot/wave-19-holistic-mat-criteria-repair
**Issue**: maturion-isms#1137
**Date**: 2026-03-17
**IAA Session**: session-wave19-orchestration-20260317-R2
**IAA Version**: independent-assurance-agent v6.2.0 (contract 2.2.0)
**Adoption Phase**: PHASE_B_BLOCKING — verdicts are HARD-BLOCKING
**Authority**: CS2 (@APGI-cmy)
**Re-invocation**: R2 (R1 was `iaa-rejection-session-wave19-orchestration-20260317.md`)

---

## Verdict: REJECTION-PACKAGE

**1 check FAILED.** Merge BLOCKED. STOP-AND-FIX required.
This PR must NOT be opened until the failure below is resolved and IAA re-invoked (R3).

---

## R1 Resolutions Confirmed

All 6 R1 failures have been correctly resolved:

| R1 Failure | R2 Status |
|------------|-----------|
| CORE-021/A-021: Commits not pushed | ✅ RESOLVED — HEAD 2ff6fc87 = origin |
| CORE-013/CORE-018: PREHANDOVER absent | ✅ RESOLVED — PREHANDOVER committed at 2ff6fc87 |
| CORE-015: Session memory untracked | ✅ RESOLVED — session memory committed at 2ff6fc87 |
| CORE-016/A-029: iaa_audit_token not pre-populated | ✅ RESOLVED — `IAA-session-wave19-orchestration-20260317-PASS` in PREHANDOVER |
| CORE-022/A-026: SCOPE_DECLARATION stale | ✅ RESOLVED — Wave 19 file list, A-031 carve-out present |
| OVL-AM-CWT-01: No CWT PASS evidence | ✅ RESOLVED — `cwt_status: PASS` in PREHANDOVER with prior-wave regression scope |

---

## R2 Failure (New Finding — A-032)

### FAILURE — A-032 / SCHEMA-COLUMN-COMPLIANCE: Non-Existent Column `criteria.name` in Migration DDL [CRITICAL]

**Rule**: A-032 — Schema Column Compliance Check. For any PR containing INSERT/SELECT on a
named Supabase table, IAA MUST read migration DDL and cross-check every column name.
Non-existent column = REJECTION-PACKAGE. Mocked tests do NOT satisfy.

**Finding**:

Migration `apps/maturion-maturity-legacy/supabase/migrations/20260317000003_parse_write_back_atomic_rpc.sql`
contains the following INSERT statement inside the `parse_write_back_atomic` PL/pgSQL function:

```sql
INSERT INTO public.criteria (
  mps_id,
  domain_id,
  audit_id,
  organisation_id,
  number,
  name,           ← ⚠️ COLUMN DOES NOT EXIST
  description,
  intent_statement,
  source_anchor
)
VALUES (
  v_mps_id,
  v_domain_id,
  v_audit_id,
  v_organisation_id,
  v_crit->>'number',
  v_crit->>'name',    ← ⚠️ MAPS TO NON-EXISTENT COLUMN
  v_crit->>'description',
  v_crit->>'intent_statement',
  v_crit->>'source_anchor'
)
ON CONFLICT DO NOTHING;
```

**Cumulative criteria columns (all migrations applied through Wave 19):**

| Column | Source |
|--------|--------|
| id | 20260302000000_mat_core_tables.sql |
| mps_id | 20260302000000_mat_core_tables.sql |
| domain_id | 20260302000000_mat_core_tables.sql |
| audit_id | 20260302000000_mat_core_tables.sql |
| organisation_id | 20260302000000_mat_core_tables.sql |
| number (TEXT after Wave 19) | 20260302000000 → 20260317000001 |
| description | 20260302000000_mat_core_tables.sql |
| guidance | 20260302000000_mat_core_tables.sql |
| excluded | 20260305000002_wave14_excluded_columns.sql |
| sort_order | 20260306000000_domains_sort_order.sql |
| **title** | **20260311000001_criteria_add_title_column.sql (Wave 17)** |
| intent_statement | 20260315000001_wave18_criteria_intent_source_anchor.sql |
| source_anchor | 20260315000001_wave18_criteria_intent_source_anchor.sql |
| created_at | 20260302000000_mat_core_tables.sql |
| updated_at | 20260302000000_mat_core_tables.sql |

**There is NO `name` column in `public.criteria`.** The criterion label column is `title`
(added in Wave 17, `20260311000001_criteria_add_title_column.sql`).

**Impact**:
- The `parse_write_back_atomic` function will fail at runtime with:
  `column "name" of relation "criteria" does not exist`
  when called from any client.
- NOTE: The Edge Function's direct supabase-js upsert path correctly uses
  `title: c.title ?? null` — that path is not affected by this bug.
- The RPC function is not currently called by the Edge Function, making this
  a dormant defect. However, A-032 applies regardless of whether the code
  path is currently active.
- The builders' A-032 self-check comment in migration 000003 documented
  "Function created: public.parse_write_back_atomic" but did NOT
  cross-reference column names against the cumulative DDL.

**Fix required** — exact changes to
`apps/maturion-maturity-legacy/supabase/migrations/20260317000003_parse_write_back_atomic_rpc.sql`:

```
CHANGE (INSERT column list):
  name,
TO:
  title,

CHANGE (VALUES clause):
  v_crit->>'name',
TO:
  v_crit->>'title',

UPDATE A-032 DDL self-check comment to:
  -- A-032 DDL self-check:
  --   Function created: public.parse_write_back_atomic
  --   Column names used in criteria INSERT:
  --     mps_id (FK), domain_id (FK), audit_id (FK), organisation_id (FK),
  --     number (TEXT — Wave 19), title (Wave 17 — 20260311000001),
  --     description, intent_statement (Wave 18), source_anchor (Wave 18)
  --   All columns verified against cumulative migration DDL.
  --   Assertion test: T-W19-008
```

**After fix**: commit, push to `copilot/wave-19-holistic-mat-criteria-repair`, re-invoke IAA (R3).

---

## Build Quality Note

The substantive build quality remains STRONG:
- 14/14 T-W19-NNN TypeScript tests PASS (vitest: 14/14 PASS, 316ms, zero failures, zero stubs)
- Migration 000001 (criteria.number TEXT) — correct, idempotent, AD-W19-001 honoured
- Migration 000002 (MPS intent_statement/guidance) — correct, idempotent, RLS coverage confirmed
- Edge Function fixes (c.number, MPS intent_statement, zero-domain throw, reason field,
  zero-insert assertion, AI_GATEWAY_URL 500) — all correct
- AI Gateway MpsResult model — correct (intent_statement/guidance fields present)
- Poll timeout (MAX_POLL_ITERATIONS=600 = 30min) — correct
- CI schema validation script — correct
- LDCS fixture — present and correct
- CodeQL 0 alerts (per api-builder evidence)

This is a single DDL column name fix in one function. R3 should be a clean PASS.

---

## Checks Summary (R2)

| Check | Result |
|-------|--------|
| CORE-001: Working tree clean | PASS ✅ |
| CORE-002: Branch declared | PASS ✅ |
| CORE-003: Tests 14/14 PASS | PASS ✅ |
| CORE-004: Zero test debt | PASS ✅ |
| CORE-005: Architecture decisions honoured | PASS ✅ |
| CORE-006: POLC boundary (Foreman no-code) | PASS ✅ |
| CORE-013: PREHANDOVER proof committed | PASS ✅ |
| CORE-015: Session memory committed | PASS ✅ |
| CORE-016/A-029: iaa_audit_token pre-populated | PASS ✅ |
| CORE-018: Evidence artifact bundle | PASS ✅ |
| CORE-019: PREHANDOVER reflects actual state (A-030) | PASS ✅ |
| CORE-021/A-021: Commits pushed before IAA | PASS ✅ |
| CORE-022/A-026: SCOPE_DECLARATION current | PASS ✅ |
| **A-032: Schema column compliance** | **FAIL ❌** |
| OVL-AM-CWT-01: CWT PASS evidence | PASS ✅ |
| OVL-AM-CST-01: CST checkpoint | PASS ✅ |
| **Total** | **18 PASS / 1 FAIL** |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**IAA Version**: independent-assurance-agent v6.2.0
**Session**: session-wave19-orchestration-20260317-R2 | Date: 2026-03-17
**PHASE_B_BLOCKING**: REJECTION-PACKAGE is a hard-gate. Merge blocked until R3 PASS.
