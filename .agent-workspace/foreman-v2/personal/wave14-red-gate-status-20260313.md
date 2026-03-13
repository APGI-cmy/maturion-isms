# Wave 14 RED Gate Status Report

**Produced by**: qa-builder  
**Session**: qa-builder RED gate confirmation — TASK-W14-006  
**Date**: 2026-03-13  
**Repository**: /home/runner/work/maturion-isms/maturion-isms  
**Test directory**: modules/mat/tests/wave14/  
**Test runner**: Vitest v3.2.4  
**Vitest config**: vitest.config.ts (includes `modules/mat/tests/**/*.test.ts`)  

---

## ⚠️ CRITICAL FINDING: ALL TESTS ARE GREEN — IMPLEMENTATION ALREADY DELIVERED

**RED gate count**: **0**  
**GREEN count**: **104 / 104**  
**Test files**: 17 / 17 passed  
**Vitest exit code**: 0 (no failures)  

> **Foreman action required (Option B)**: Update the Wave 14 implementation plan to reflect
> completion. Builder delegation is **NOT required** — the implementation already exists in the
> repository, delivered by prior sessions (140–143, 2026-03-04/05).

---

## Test Execution Summary

```
 RUN  v3.2.4 /home/runner/work/maturion-isms/maturion-isms

 Test Files  17 passed (17)
      Tests  104 passed (104)
   Start at  07:00:10
   Duration  1.81s (transform 166ms, setup 0ms, collect 489ms, tests 124ms,
             environment 4ms, prepare 1.48s)
```

---

## Test-by-Test Status (All GREEN)

### T-W14-UX-001 — Onboarding Guard (GAP-W01) — 🟢 ALL GREEN (5/5)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-001a | App.tsx has `data-testid="onboarding-guard"` sentinel | ✅ GREEN |
| T-W14-UX-001b | OnboardingPage has `data-testid="onboarding-step-1"` | ✅ GREEN |
| T-W14-UX-001c | OnboardingPage has `data-testid="onboarding-step-2"` | ✅ GREEN |
| T-W14-UX-001d | Wave 14 onboarding support migration file exists | ✅ GREEN |
| T-W14-UX-001e | Migration defines `onboarding_completions` table | ✅ GREEN |

**Why GREEN**: `20260305000000_wave14_onboarding_support.sql` exists. `App.tsx` has `data-testid="onboarding-guard"` sentinel. `OnboardingPage.tsx` has both `onboarding-step-1` and `onboarding-step-2` testids.

---

### T-W14-UX-002 — Invite Auditor (GAP-W02) — 🟢 ALL GREEN (7/7)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-002a | Migration file `20260305000001_wave14_invitations_assignments.sql` exists | ✅ GREEN |
| T-W14-UX-002b | `audit_invitations` table is created in migration | ✅ GREEN |
| T-W14-UX-002c | `audit_invitations` has `scope_type` and `invitation_token` columns | ✅ GREEN |
| T-W14-UX-002d | `audit_invitations` has `status` column with `pending`/`accepted` values | ✅ GREEN |
| T-W14-UX-002e | `domain_assignments` table is created in migration | ✅ GREEN |
| T-W14-UX-002f | `domain_assignments` has `user_id` and `domain_id` columns | ✅ GREEN |
| T-W14-UX-002g | RLS policy on `audit_invitations` enforces org isolation | ✅ GREEN |

**Why GREEN**: `20260305000001_wave14_invitations_assignments.sql` exists with correct schema.

---

### T-W14-UX-003 — Toggle Exclude Cascade (GAP-W03) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-003a | Migration file `20260305000002_wave14_excluded_columns.sql` exists | ✅ GREEN |
| T-W14-UX-003b | `domains` table gains `excluded BOOLEAN` column | ✅ GREEN |
| T-W14-UX-003c | `mini_performance_standards` (MPS) table gains `excluded BOOLEAN` column | ✅ GREEN |
| T-W14-UX-003d | `criteria` table gains `excluded BOOLEAN` column | ✅ GREEN |
| T-W14-UX-003e | Migration defines cascade trigger or function for exclusion propagation | ✅ GREEN |
| T-W14-UX-003f | Migration references Create Report gate query pattern | ✅ GREEN |

**Why GREEN**: `20260305000002_wave14_excluded_columns.sql` exists with all required columns and cascade logic.

---

### T-W14-UX-004 — Invite Evidence Submitter (GAP-W04) — 🟢 ALL GREEN (5/5)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-004a | Migration file exists | ✅ GREEN |
| T-W14-UX-004b | `criteria_assignments` table is created in migration | ✅ GREEN |
| T-W14-UX-004c | `criteria_assignments` has `user_id` and `criteria_id` columns | ✅ GREEN |
| T-W14-UX-004d | `audit_invitations` supports `scope_type = 'criteria'` | ✅ GREEN |
| T-W14-UX-004e | RLS policy on `criteria_assignments` is defined | ✅ GREEN |

**Why GREEN**: `20260305000001_wave14_invitations_assignments.sql` covers both domain and criteria assignment tables.

---

### T-W14-UX-005 — Evidence Upload Panel (GAP-W05) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-005a | Migration file `20260305000003_wave14_evidence_schema.sql` exists | ✅ GREEN |
| T-W14-UX-005b | `evidence.findings_text TEXT` column added | ✅ GREEN |
| T-W14-UX-005c | `evidence.deleted BOOLEAN` column added | ✅ GREEN |
| T-W14-UX-005d | `evidence.storage_path TEXT` column added | ✅ GREEN |
| T-W14-UX-005e | Evidence type CHECK constraint updated to include `'file'` and `'voice'` | ✅ GREEN |
| T-W14-UX-005f | `EvidenceUploadPanel` component file exists in frontend src | ✅ GREEN |

**Why GREEN**: `20260305000003_wave14_evidence_schema.sql` exists with schema changes; `EvidenceUploadPanel` component implemented.

---

### T-W14-UX-006 — AI Evaluation Trigger (GAP-W06) — 🟢 ALL GREEN (7/7)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-006a | Migration file `20260305000004_wave14_evaluations.sql` exists | ✅ GREEN |
| T-W14-UX-006b | `criteria_evaluations` table is created in migration | ✅ GREEN |
| T-W14-UX-006c | `criteria_evaluations` has `proposed_level`, `confidence_score`, `rationale`, `findings_summary` | ✅ GREEN |
| T-W14-UX-006d | `criteria_evaluations` has `next_level_guidance` and `next_plus_one_taster` columns | ✅ GREEN |
| T-W14-UX-006e | `evaluation_overrides` table is created in migration | ✅ GREEN |
| T-W14-UX-006f | `evaluation_overrides.justification` is NOT NULL | ✅ GREEN |
| T-W14-UX-006g | `criteria_evaluations.status` includes `'pending_review'` and `'confirmed'` | ✅ GREEN |

**Why GREEN**: `20260305000004_wave14_evaluations.sql` exists with complete schema.

---

### T-W14-UX-007 — Next Level Guidance Surface (GAP-W07) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-007a | Migration file `20260305000004_wave14_evaluations.sql` exists | ✅ GREEN |
| T-W14-UX-007b | `criteria_evaluations.next_level_guidance TEXT` column in migration | ✅ GREEN |
| T-W14-UX-007c | `criteria_evaluations.next_plus_one_taster TEXT` column in migration | ✅ GREEN |
| T-W14-UX-007d | `CriteriaCard` component file exists in frontend src | ✅ GREEN |
| T-W14-UX-007e | `CriteriaCard` source references `next_level_guidance` for rendering | ✅ GREEN |
| T-W14-UX-007f | `CriteriaCard` source renders "Explore further levels" link | ✅ GREEN |

**Why GREEN**: Evaluations migration and `CriteriaCard` component both implemented.

---

### T-W14-UX-008 — AI Chat Context Injection (GAP-W08) — 🟢 ALL GREEN (4/4)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-008a | `EmbeddedAIAssistant.tsx` defines `contextPayload` prop in its Props interface | ✅ GREEN |
| T-W14-UX-008b | `EmbeddedAIAssistant.tsx` uses `contextPayload` to initialise the chat session | ✅ GREEN |
| T-W14-UX-008c | `EmbeddedAIAssistant.tsx` renders `data-testid="ai-context-indicator"` when `contextPayload` is set | ✅ GREEN |
| T-W14-UX-008d | `EmbeddedAIAssistant.tsx` has `criteria_name` in `contextPayload` type definition | ✅ GREEN |

**Why GREEN**: `EmbeddedAIAssistant.tsx` component has full `contextPayload` prop implementation including type, usage, and testid sentinel.

---

### T-W14-UX-009 — Audit Results Table (GAP-W09) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-009a | Migration file `20260305000004_wave14_evaluations.sql` exists | ✅ GREEN |
| T-W14-UX-009b | `criteria_evaluations` table defined in migration (enables LEFT JOIN) | ✅ GREEN |
| T-W14-UX-009c | `AuditResultsTable` component file exists in frontend src | ✅ GREEN |
| T-W14-UX-009d | `AuditResultsTable` source references required columns: Domain, MPS, Criteria, Rating | ✅ GREEN |
| T-W14-UX-009e | `AuditResultsTable` source handles excluded criteria with visual treatment | ✅ GREEN |
| T-W14-UX-009f | Results tab is registered in the audit page routing or tabs definition | ✅ GREEN |

**Why GREEN**: `AuditResultsTable` component implemented and registered.

---

### T-W14-UX-010 — Dashboard Create Report Gate (GAP-W10) — 🟢 ALL GREEN (5/5)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-010a | Migration file `20260305000004_wave14_evaluations.sql` exists | ✅ GREEN |
| T-W14-UX-010b | `criteria_evaluations` table defined in migration | ✅ GREEN |
| T-W14-UX-010c | `DashboardPage` or `useAudits` hook references gate query pattern with `criteria_evaluations` | ✅ GREEN |
| T-W14-UX-010d | Gate query pattern uses `'confirmed'` and `'overridden'` as gate-passing statuses | ✅ GREEN |
| T-W14-UX-010e | Dashboard source references Submitted, Outstanding, and Excluded count metrics | ✅ GREEN |

**Why GREEN**: Dashboard gating logic implemented.

---

### T-W14-UX-011 — Create Report Generation (GAP-W11) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-011a | Migration file `20260305000006_wave14_audit_reports.sql` exists | ✅ GREEN |
| T-W14-UX-011b | `audit_reports` table is created in migration | ✅ GREEN |
| T-W14-UX-011c | `audit_reports.storage_path` is NOT NULL | ✅ GREEN |
| T-W14-UX-011d | `audit_reports` has a `status` column (values: final, generating, failed) | ✅ GREEN |
| T-W14-UX-011e | `reports` storage bucket is configured in migration | ✅ GREEN |
| T-W14-UX-011f | RLS on `audit_reports` enforces org isolation | ✅ GREEN |

**Why GREEN**: `20260305000006_wave14_audit_reports.sql` exists with complete schema and RLS.

---

### T-W14-UX-012 — Level Descriptor Tables (GAP-W12) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-012a | Migration file `20260305000005_wave14_level_descriptors.sql` exists | ✅ GREEN |
| T-W14-UX-012b | `criteria_level_descriptors` table is created | ✅ GREEN |
| T-W14-UX-012c | `mps_level_descriptors` table is created | ✅ GREEN |
| T-W14-UX-012d | `domain_level_descriptors` table is created | ✅ GREEN |
| T-W14-UX-012e | `descriptor_text` is NOT NULL | ✅ GREEN |
| T-W14-UX-012f | UNIQUE constraint on `(criteria_id, level)` | ✅ GREEN |

**Why GREEN**: `20260305000005_wave14_level_descriptors.sql` exists with all three descriptor tables.

---

### T-W14-UX-013 — Scoring Tables (GAP-W13) — 🟢 ALL GREEN (7/7)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-013a | Migration file `20260305000007_wave14_scoring_tables.sql` exists | ✅ GREEN |
| T-W14-UX-013b | `maturity_levels` table is created | ✅ GREEN |
| T-W14-UX-013c | All 5 level names seeded (Basic, Reactive, Compliant, Proactive, Resilient) | ✅ GREEN |
| T-W14-UX-013d | `scoring_rules` table is created | ✅ GREEN |
| T-W14-UX-013e | Global default `scoring_rules` row seeded with `aggregation_method = 'weighted_average'` | ✅ GREEN |
| T-W14-UX-013f | `aggregate_scores` table is created | ✅ GREEN |
| T-W14-UX-013g | `aggregate_scores` has UNIQUE constraint on `(audit_id, level_type, scope_id)` | ✅ GREEN |

**Why GREEN**: `20260305000007_wave14_scoring_tables.sql` exists with complete schema and seed data.

---

### T-W14-UX-014 — Responsibility Cascade (GAP-W14) — 🟢 ALL GREEN (6/6)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-014a | Migration file `20260305000001_wave14_invitations_assignments.sql` exists | ✅ GREEN |
| T-W14-UX-014b | `domain_assignments` table is created | ✅ GREEN |
| T-W14-UX-014c | `mps_assignments` table is created | ✅ GREEN |
| T-W14-UX-014d | `criteria_assignments` table is created | ✅ GREEN |
| T-W14-UX-014e | Migration defines a responsibility cascade view or SQL function | ✅ GREEN |
| T-W14-UX-014f | Assignment tables include `audit_id` (scoped to a specific audit) | ✅ GREEN |

**Why GREEN**: All three assignment tables and the cascade function implemented in `20260305000001`.

---

### T-W14-UX-015 — New Tables RLS (cross-cutting) — 🟢 ALL GREEN (9/9)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-015a | RLS migration file `20260305000008_wave14_new_tables_rls.sql` exists | ✅ GREEN |
| T-W14-UX-015b | `audit_invitations` has org-isolation SELECT RLS policy | ✅ GREEN |
| T-W14-UX-015c | `criteria_evaluations` has org-isolation SELECT RLS policy | ✅ GREEN |
| T-W14-UX-015d | `evaluation_overrides` has org-isolation RLS policy | ✅ GREEN |
| T-W14-UX-015e | `aggregate_scores` has org-isolation RLS policy | ✅ GREEN |
| T-W14-UX-015f | `audit_reports` has org-isolation RLS policy | ✅ GREEN |
| T-W14-UX-015g | `criteria_level_descriptors` has org-isolation or public-read RLS policy | ✅ GREEN |
| T-W14-UX-015h | `domain_assignments` has org-isolation RLS policy | ✅ GREEN |
| T-W14-UX-015i | `maturity_levels` is publicly readable (no INSERT/UPDATE restriction) | ✅ GREEN |

**Why GREEN**: `20260305000008_wave14_new_tables_rls.sql` exists with comprehensive RLS policies.

---

### T-W14-UX-016 — Scoring Rules Report Access (GAP-W13 supplement) — 🟢 ALL GREEN (7/7)

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-UX-016a | Migration file `20260305000007_wave14_scoring_tables.sql` exists | ✅ GREEN |
| T-W14-UX-016b | `scoring_rules` table is created | ✅ GREEN |
| T-W14-UX-016c | Global default seeded with `organisation_id = NULL` | ✅ GREEN |
| T-W14-UX-016d | Global default has `aggregation_method = 'weighted_average'` | ✅ GREEN |
| T-W14-UX-016e | `scoring_rules` has `organisation_id` column (nullable) | ✅ GREEN |
| T-W14-UX-016f | `scoring_rules` has `aggregation_method` column | ✅ GREEN |
| T-W14-UX-016g | Migration references fallback handling when no scoring rule is found | ✅ GREEN |

**Why GREEN**: Scoring tables migration complete with global default seeded.

---

### Column Mapping Drift Guard (INC-W14-COL-MAPPING-001) — 🟢 ALL GREEN (6/6)

> **Note**: This is an additional test file (column-mapping.test.ts) covering column drift
> incidents. Not in the T-W14-UX-001–016 sequence but included in the 17 test files.

| Test ID | Description | Status |
|---------|-------------|--------|
| T-W14-COL-001 | `profiles.full_name` column exists in migration | ✅ GREEN |
| T-W14-COL-002 | `profiles.preferences JSONB` column exists in migration | ✅ GREEN |
| T-W14-COL-003 | `audits.criteria_approved` column exists in migration | ✅ GREEN |
| T-W14-COL-004 | `audit_scores` table migration exists | ✅ GREEN |
| T-W14-COL-005 | `useSettings.ts` does NOT write `full_name` without migration | ✅ GREEN |
| T-W14-COL-006 | `useAudits.ts` does NOT write `criteria_approved` without migration | ✅ GREEN |

---

## Implementation Evidence Summary

The following implementation was found in the repository (delivered by sessions 140–143, 2026-03-04/05):

### Migration Files (all 9 exist)
| Migration File | Covers |
|----------------|--------|
| `20260305000000_wave14_onboarding_support.sql` | onboarding_completions table, org trigger |
| `20260305000001_wave14_invitations_assignments.sql` | audit_invitations, domain/mps/criteria_assignments, cascade function |
| `20260305000002_wave14_excluded_columns.sql` | excluded BOOLEAN on domains/mps/criteria, cascade trigger |
| `20260305000003_wave14_evidence_schema.sql` | evidence.findings_text, .deleted, .storage_path, type enum |
| `20260305000004_wave14_evaluations.sql` | criteria_evaluations, evaluation_overrides |
| `20260305000005_wave14_level_descriptors.sql` | criteria/mps/domain level descriptor tables |
| `20260305000006_wave14_audit_reports.sql` | audit_reports table, reports storage bucket |
| `20260305000007_wave14_scoring_tables.sql` | maturity_levels (5 rows), scoring_rules (global default), aggregate_scores |
| `20260305000008_wave14_new_tables_rls.sql` | RLS policies for all 13 new org-scoped tables |

### Frontend Components (implemented)
| Component | Location |
|-----------|----------|
| `OnboardingPage.tsx` | `modules/mat/frontend/src/pages/OnboardingPage.tsx` |
| `App.tsx` (onboarding-guard sentinel) | `modules/mat/frontend/src/App.tsx` |
| `EmbeddedAIAssistant.tsx` (contextPayload prop) | `modules/mat/frontend/src/components/common/` |
| `CriteriaCard` (next_level_guidance, Explore link) | `modules/mat/frontend/src/` |
| `AuditResultsTable` | `modules/mat/frontend/src/` |
| `EvidenceUploadPanel` | `modules/mat/frontend/src/` |
| `DashboardPage` (gate query, metrics) | `modules/mat/frontend/src/pages/` |

---

## Foreman Decision

**Recommended action: Option B — Update implementation plan to reflect completion**

All 104 Wave 14 tests are GREEN. The full implementation for T-W14-UX-001 through T-W14-UX-016 has been delivered by prior sessions (140–143). The wave14 test suite validates:
- 9 schema migration files (all present and content-verified)
- All required frontend components (all present and content-verified)

**DO NOT** delegate Wave 14 builder work — the implementation is complete. The Foreman should:
1. Mark Wave 14 implementation tasks as COMPLETE
2. Confirm wave closure against existing evidence
3. Proceed to IAA handover / IBWR for wave closure certification

---

## Raw Test Run Output (Summary Lines)

```
Test Files  17 passed (17)
     Tests  104 passed (104)
  Start at  07:00:10
  Duration  1.81s
```

No failures. No skipped tests. Exit code: 0.

---

*Report generated by qa-builder — TASK-W14-006 — 2026-03-13*
