# IAA Pre-Brief — Wave 14 Batch C

**Agent**: independent-assurance-agent  
**Contract Version**: 2.1.0  
**Knowledge Version**: 2.4.0  
**Pre-Brief Version**: 1.0.0  
**Wave**: Wave 14 Batch C — Finalise MAT Remaining Gap Closure and QA Acceptance  
**Session**: session-142 (Pre-Brief invocation)  
**Issue**: #909  
**Branch**: copilot/finalise-mat-gap-closure  
**Date**: 2026-03-05  
**Foreman**: foreman-v2-agent v6.2.0  
**CS2 Authority**: @APGI-cmy  
**IAA Adoption Phase**: PHASE_B_BLOCKING — Hard gate ACTIVE  

---

## Pre-Brief Purpose

This artifact is generated at wave-start under Phase 0 of the IAA contract. It classifies every
declared task against the IAA trigger table and declares — per qualifying task — the required
assurance phases, required evidence artifacts, applicable overlays, and specific canon rules
that will be enforced at handover.

This Pre-Brief does NOT constitute assurance. The full assurance review (Phases 2–4) runs at
handover, not at wave-start.

---

## Wave Context — Batch C Scope

Wave 14 Batch C closes the final 2 database schema gaps from the Wave 14 UX Workflow Gap
Remediation. Batches A & B are complete (ASSURANCE-TOKEN: IAA-session-141-v4-wave14-batchB-20260305-PASS).

| Batch | Status | Token |
|-------|--------|-------|
| Batch A | ✅ CLOSED | IAA-session-140-wave14-batchA |
| Batch B | ✅ CLOSED | IAA-session-141-v4-wave14-batchB-20260305-PASS |
| **Batch C** | 🔴 PENDING — THIS WAVE | This Pre-Brief |

Remaining open GAPs closed by Batch C:
- GAP-W12 (Level Descriptors) → TASK-W14-BC-001
- GAP-W13 (Scoring Tables + Default Rule) → TASK-W14-BC-002

---

## Task Classification

### TASK-W14-BC-001 — Level Descriptor Tables Migration

| Field | Value |
|-------|-------|
| **task_id** | TASK-W14-BC-001 |
| **task_summary** | Create migration `20260305000005_wave14_level_descriptors.sql` with 3 tables: criteria_level_descriptors, mps_level_descriptors, domain_level_descriptors. All with UUID PK, FK NOT NULL, level INTEGER, descriptor_text TEXT, UNIQUE constraint, and org-isolation RLS SELECT policies. Closes GAP-W12. |
| **builder** | schema-builder |
| **iaa_trigger_category** | **AAWP_MAT** |
| **qualifying** | ✅ YES |
| **trigger_basis** | Schema migration delivering executable Supabase table definitions and RLS policies for the MAT module. BD-TIER-1 through BD-TIER-5 overlays apply. |
| **required_phases** | Phase 1 (Preflight), Phase 2 (Alignment), Phase 3 (Assurance — AAWP_MAT overlays), Phase 4 (Merge Gate Parity + Verdict) |
| **red_tests_targeted** | T-W14-UX-012a, T-W14-UX-012b, T-W14-UX-012c, T-W14-UX-012d, T-W14-UX-012e, T-W14-UX-012f (6 tests in `modules/mat/tests/wave14/level-descriptor-tables.test.ts`) |
| **frs_trs** | FR-100 / TR-100 |

#### Required Evidence Artifacts at Handover

| # | Artifact | Required Content | Verification Check |
|---|---------|-----------------|-------------------|
| 1 | `apps/maturion-maturity-legacy/supabase/migrations/20260305000005_wave14_level_descriptors.sql` | CREATE TABLE public.criteria_level_descriptors + mps_level_descriptors + domain_level_descriptors; all FKs; all UNIQUE constraints; RLS SELECT policies for all 3 tables with org-isolation JOIN to audits | BD-001, BD-005, BD-015 |
| 2 | `modules/mat/tests/wave14/level-descriptor-tables.test.ts` (pre-existing RED test file) | All 6 tests T-W14-UX-012a–f GREEN — zero failures | BD-011 |
| 3 | Test run output / CI evidence | Pass count ≥ 6 new tests GREEN; zero regressions | BD-011 |
| 4 | PREHANDOVER proof (committed on branch) | iaa_audit_token pre-populated; session memory reference; migration file listed in scope | CORE-013, CORE-015, CORE-018 |
| 5 | Session memory file | session-NNN-YYYYMMDD.md present on branch | CORE-015 |
| 6 | SCOPE_DECLARATION.md | Must include `20260305000005_wave14_level_descriptors.sql`; must match `git diff --name-only origin/main...HEAD` exactly | A-026, A-028 |

#### Applicable Overlays

| Overlay Set | Checks | Focus |
|-------------|--------|-------|
| BD-TIER-1 (Delivery Completeness) | BD-001 to BD-004 | All 3 tables present; no TODOs in migration |
| BD-TIER-2 (Wiring & Integration) | BD-005 to BD-010 | FK chains valid; RLS policies apply org-isolation correctly; tables consumed by application layer |
| BD-TIER-3 (Test Quality) | BD-011 to BD-014 | All 6 RED tests now GREEN; no `.skip()` or test debt |
| BD-TIER-4 (Security) | BD-015 to BD-019 | RLS SELECT policies on all 3 tables; org-isolation via criteria_id/mps_id/domain_id JOIN to audits.organisation_id |
| BD-TIER-5 (Code Quality) | BD-020 to BD-023 | Migration SQL quality; no magic values |
| OVL-AM-008 | End-to-end wiring | Each table traced from migration → RLS policy → application read path |
| CORE invariants | CORE-005 to CORE-022 (applicable subset) | Evidence bundle, no placeholders, no .github/agents modifications |

#### Specific Canon Rules

| Rule ID | Rule | Why This Task |
|---------|------|--------------|
| A-021 | Commit before IAA invocation | Migration file must be committed, not just staged |
| A-026 | SCOPE_DECLARATION matches diff exactly | Migration filename must appear in SCOPE_DECLARATION |
| A-028 | SCOPE_DECLARATION format compliance | List format; prior-wave entries trimmed |
| A-029 | PREHANDOVER immutability §4.3b | Token pre-populated; IAA writes separate token file post-verdict |
| BD-006 | Writers and readers confirmed | Confirm application code reads from these 3 tables (or test confirms read path) |
| BD-015 | RLS policies complete | SELECT policies must use org-isolation JOIN (not open access) |

---

### TASK-W14-BC-002 — Scoring Tables and Default Rule Migration

| Field | Value |
|-------|-------|
| **task_id** | TASK-W14-BC-002 |
| **task_summary** | Create migration `20260305000007_wave14_scoring_tables.sql` with 3 tables: maturity_levels (5 seed rows), scoring_rules (global default seed, org-nullable FK), aggregate_scores (org-isolated RLS). maturity_levels and scoring_rules publicly readable. aggregate_scores org-isolated via audit_id. Graceful fallback for missing scoring rule. Closes GAP-W13. |
| **builder** | schema-builder |
| **iaa_trigger_category** | **AAWP_MAT** |
| **qualifying** | ✅ YES |
| **trigger_basis** | Schema migration delivering executable Supabase table definitions, seed data, RLS policies, and fallback logic for the MAT module. BD-TIER-1 through BD-TIER-5 overlays apply. |
| **required_phases** | Phase 1 (Preflight), Phase 2 (Alignment), Phase 3 (Assurance — AAWP_MAT overlays), Phase 4 (Merge Gate Parity + Verdict) |
| **red_tests_targeted** | T-W14-UX-013a through T-W14-UX-013g (7 tests in `scoring-tables.test.ts`) + T-W14-UX-016a through T-W14-UX-016g (7 tests in `scoring-rules-report-access.test.ts`) — **14 tests total** |
| **frs_trs** | FR-101 / TR-101 |

#### Required Evidence Artifacts at Handover

| # | Artifact | Required Content | Verification Check |
|---|---------|-----------------|-------------------|
| 1 | `apps/maturion-maturity-legacy/supabase/migrations/20260305000007_wave14_scoring_tables.sql` | CREATE TABLE public.maturity_levels (with UNIQUE level_number); 5 INSERT seed rows (Basic=1, Reactive=2, Compliant=3, Proactive=4, Resilient=5); CREATE TABLE public.scoring_rules (organisation_id NULLABLE FK organisations); INSERT global default (organisation_id=NULL); CREATE TABLE public.aggregate_scores (audit_id FK NOT NULL, UNIQUE(audit_id, level_type, scope_id)); RLS: maturity_levels + scoring_rules = publicly readable; aggregate_scores = org-isolated via audit_id; COALESCE/LIMIT 1 fallback pattern | BD-001, BD-002, BD-005, BD-015 |
| 2 | `modules/mat/tests/wave14/scoring-tables.test.ts` (pre-existing RED test file) | All 7 tests T-W14-UX-013a–g GREEN | BD-011 |
| 3 | `modules/mat/tests/wave14/scoring-rules-report-access.test.ts` (pre-existing RED test file) | All 7 tests T-W14-UX-016a–g GREEN | BD-011 |
| 4 | Test run output / CI evidence | Pass count ≥ 14 new tests GREEN; zero regressions | BD-011 |
| 5 | PREHANDOVER proof (committed on branch) | iaa_audit_token pre-populated; session memory reference; both migration files listed in scope | CORE-013, CORE-015, CORE-018 |
| 6 | Session memory file | session-NNN-YYYYMMDD.md present on branch | CORE-015 |
| 7 | SCOPE_DECLARATION.md | Must include `20260305000007_wave14_scoring_tables.sql`; must match diff exactly | A-026, A-028 |

#### Applicable Overlays

| Overlay Set | Checks | Focus |
|-------------|--------|-------|
| BD-TIER-1 (Delivery Completeness) | BD-001 to BD-004 | All 3 tables + 2 seed operations present; no TODOs |
| BD-TIER-2 (Wiring & Integration) | BD-005 to BD-010 | FK chain: aggregate_scores → audits; scoring_rules → organisations (nullable); maturity_levels standalone; fallback COALESCE pattern present |
| BD-TIER-3 (Test Quality) | BD-011 to BD-014 | All 14 RED tests across 2 test files now GREEN; no test debt |
| BD-TIER-4 (Security) | BD-015 to BD-019 | RLS on aggregate_scores org-isolated; maturity_levels + scoring_rules publicly readable (global reference data — intentional, verify this is correct posture for this data classification) |
| BD-TIER-5 (Code Quality) | BD-020 to BD-023 | Migration SQL quality; seed data matches agreed 5 maturity levels |
| OVL-AM-008 | End-to-end wiring | Trace: scoring_rules → COALESCE → score computation → aggregate_scores write → read path |
| CORE invariants | CORE-005 to CORE-022 (applicable subset) | Evidence bundle, no placeholders |

#### Specific Canon Rules

| Rule ID | Rule | Why This Task |
|---------|------|--------------|
| A-021 | Commit before IAA invocation | Both migration files must be committed |
| A-026 | SCOPE_DECLARATION matches diff exactly | Both migration filenames must appear |
| A-028 | SCOPE_DECLARATION format compliance | List format; no stale prior-wave entries |
| A-029 | PREHANDOVER immutability §4.3b | Token pre-populated; IAA writes separate token file |
| BD-006 | Writers and readers confirmed | Verify application writes aggregate_scores and reads maturity_levels; test coverage for both operations |
| BD-015 | RLS policies complete | maturity_levels: publicly readable (GRANT SELECT or permissive policy — JUSTIFY); scoring_rules: publicly readable; aggregate_scores: org-isolated via audit_id JOIN to audits.organisation_id |

#### ⚠️ IAA SECURITY SPOTLIGHT — TASK-W14-BC-002

The following items require heightened IAA attention at review time:

1. **maturity_levels + scoring_rules as public reference tables**: Verify this is the intentional
   security posture. Global reference tables with no org-isolation are acceptable IF they contain
   no org-specific sensitive data (maturity level names are generic — acceptable). Confirm
   organisation-specific scoring rules are properly org-isolated via the organisation_id FK when
   not NULL.

2. **Graceful fallback (COALESCE/LIMIT 1/RAISE)**: The fallback pattern must not silently
   produce incorrect scoring results. If a scoring rule is missing, the fallback must either
   (a) use a known safe default or (b) raise a user-visible error. A silent COALESCE to zero
   or to an incorrect formula is a functional defect — BD-003 would fail.

3. **aggregate_scores UNIQUE constraint**: `UNIQUE(audit_id, level_type, scope_id)` where
   scope_id is NULLABLE. Verify the DB handles NULL scope_id in the UNIQUE constraint
   correctly (PostgreSQL treats NULLs as not equal in UNIQUE indexes — if two rows both have
   NULL scope_id, they may both insert successfully, violating the intent). IAA must confirm
   whether a partial index or COALESCE(scope_id, '00000000-0000-0000-0000-000000000000') is
   used to enforce uniqueness when scope_id is NULL.

---

### TASK-W14-BC-003 — Post-Implementation Assurance Report

| Field | Value |
|-------|-------|
| **task_id** | TASK-W14-BC-003 |
| **task_summary** | Documentation artifact: `modules/mat/05-build-evidence/wave14-postimplementation-assurance-report.md` — full UX workflow tick-list against all 15 GAPs (W01–W15), screenshot placeholder references, drill-down attestation, signed-off QA acceptance. |
| **builder** | mat-specialist |
| **iaa_trigger_category** | **EXEMPT (documentation-only)** |
| **qualifying** | ⬛ NO — documentation-only artifact |
| **trigger_basis** | No executable code, no schema, no agent contract, no canon modification. Unambiguously doc-only per trigger table. |
| **required_phases** | None (not a qualifying IAA trigger in its own right) |
| **advisory_note** | This artifact will be verified for **existence and non-emptiness** as part of the overall Batch C PREHANDOVER proof review (CORE-018 evidence sweep). IAA will confirm the file is committed, non-empty, and covers all 15 GAPs (W01–W15) as declared. A skeleton or stub report without actual GAP coverage = REJECTION-PACKAGE finding under CORE-007 (no placeholder content). |

#### Existence Checks Applied at PREHANDOVER Review

| # | Check | Failure Mode |
|---|-------|-------------|
| EX-01 | File present at declared path | CORE-018 REJECTION-PACKAGE |
| EX-02 | File non-empty (> 0 bytes) | CORE-018 REJECTION-PACKAGE |
| EX-03 | File covers all 15 GAPs (W01–W15) with GREEN/RED status | CORE-007 if stubs/TODOs present |
| EX-04 | QA acceptance section present and signed | CORE-007 if "TBD" or empty |
| EX-05 | No "TBD", "STUB", "placeholder" markers in coverage sections | CORE-007 REJECTION-PACKAGE |

---

### TASK-W14-BC-004 — App Management Centre Watchdog Readiness

| Field | Value |
|-------|-------|
| **task_id** | TASK-W14-BC-004 |
| **task_summary** | Documentation artifact: `modules/mat/05-build-evidence/app-management-centre-watchdog-readiness.md` — MAT readiness for future watchdog/monitoring integration: health check endpoints, event hooks, monitoring surfaces, integration interface contract. |
| **builder** | mat-specialist |
| **iaa_trigger_category** | **EXEMPT (documentation-only)** |
| **qualifying** | ⬛ NO — documentation-only artifact |
| **trigger_basis** | No executable code, no schema, no agent contract, no canon modification. Unambiguously doc-only. |
| **required_phases** | None (not a qualifying IAA trigger in its own right) |
| **advisory_note** | This artifact will be verified for existence and non-emptiness as part of the overall Batch C PREHANDOVER proof review. A watchdog readiness document listing no concrete endpoints, no event hooks, or consisting entirely of aspirational statements without specific interface contracts = REJECTION-PACKAGE finding under BD-002 (no stubs in production paths, applied analogously to integration documentation). |

#### Existence Checks Applied at PREHANDOVER Review

| # | Check | Failure Mode |
|---|-------|-------------|
| EX-01 | File present at declared path | CORE-018 REJECTION-PACKAGE |
| EX-02 | File non-empty (> 0 bytes) | CORE-018 REJECTION-PACKAGE |
| EX-03 | Health check endpoints section present with at least 1 concrete endpoint | CORE-007 if stub |
| EX-04 | Integration interface contract section present | CORE-007 if missing |
| EX-05 | No "TBD", "STUB", "TODO" in interface contract sections | CORE-007 REJECTION-PACKAGE |

---

## Pre-Brief Classification Summary

| Task ID | Category | Qualifying | IAA Phases | FAIL-ONLY-ONCE Rules | Priority |
|---------|----------|------------|------------|---------------------|----------|
| TASK-W14-BC-001 | AAWP_MAT | ✅ YES | 1, 2, 3, 4 | A-021, A-026, A-028, A-029 | HIGH |
| TASK-W14-BC-002 | AAWP_MAT | ✅ YES | 1, 2, 3, 4 | A-021, A-026, A-028, A-029 | HIGH (security spotlight active) |
| TASK-W14-BC-003 | EXEMPT (doc-only) | ⬛ NO | Existence check at PREHANDOVER | CORE-007, CORE-018 | MEDIUM |
| TASK-W14-BC-004 | EXEMPT (doc-only) | ⬛ NO | Existence check at PREHANDOVER | CORE-007, CORE-018 | MEDIUM |

---

## Pre-Brief Scope: Pre-Existing Test Failures (Out of Batch C Scope)

IAA acknowledges the following as pre-existing failures that must NOT be re-introduced by Batch C work:

| Test File | Reason for Pre-Existing Failure | IAA Action at Review |
|-----------|--------------------------------|---------------------|
| `api/ai/feedback.test.ts` | No live API environment | Verify no regression vs pre-Batch-C baseline |
| `api/ai/request.test.ts` | No live API environment | Verify no regression vs pre-Batch-C baseline |
| `api/ai/wave12-api.test.ts` | No live API environment | Verify no regression vs pre-Batch-C baseline |
| `modules/mat/tests/wave13/e2e-live-deployment.test.ts` | No live Supabase env | Verify no regression |
| `modules/mat/tests/wave13/schema-existence.test.ts` (T-W13-SCH-1–4) | No live Supabase env | Verify no regression |

IAA will apply BD-004 (no leftover debt from previous jobs) — if Batch C introduces new failures
beyond this baseline list, it is a REJECTION-PACKAGE finding.

---

## ⚠️ MANDATORY IAA NOTICE — CWT Obligation (Wave 14 Final Batch)

**Batch C is the FINAL batch of Wave 14.** Once Batch C is accepted, Wave 14 is complete
(all 15 GAPs closed across Batches A, B, C).

Per `governance/canon/COMBINED_TESTING_PATTERN.md` §5.2 and IAA knowledge v2.4.0:

> **A Combined Wave Test (CWT) is MANDATORY before IBWR completion.**

At the time of Batch C handover, IAA will:

1. **Prompt the Foreman to commission a CWT** covering all 15 closed GAPs across Wave 14
   (Batches A + B + C), covering all affected modules (MAT: migrations, UI components,
   RLS policies, hooks, API integration).

2. **Verify CWT PASS evidence** is present in the Batch C PREHANDOVER proof or appended
   as a wave closure artifact before issuing ASSURANCE-TOKEN.

3. **CWT Absence = REJECTION-PACKAGE** (OVL-AM-CWT-01 — mandatory, no exceptions).

**CWT Scope for Wave 14 (when commissioned):**
- All 15 GAPs (W01–W15) across Batches A, B, C
- Modules: MAT schema migrations (migrations 20260305000000–20260305000008), UI components
  (OnboardingGuardPage, InviteAuditorModal, EvidenceUploadPanel, CriteriaCard,
  EmbeddedAIAssistant, AuditResultsTable, AuditManagementPage, DashboardPage,
  ReportGenerationPage), RLS policies on all new tables
- Test suites: `modules/mat/tests/wave14/*.test.ts` — full sweep
- Regression baseline: pre-existing failures listed above must remain stable (no new failures)

---

## Wave Completion Gate Checklist (Batch C)

IAA will verify the following at handover — all must be GREEN before ASSURANCE-TOKEN:

| Gate Item | Verification Method | Failure Action |
|-----------|--------------------|--------------:|
| `20260305000005_wave14_level_descriptors.sql` committed | `git diff --name-only origin/main...HEAD` | REJECTION-PACKAGE (BD-001) |
| `20260305000007_wave14_scoring_tables.sql` committed | `git diff --name-only origin/main...HEAD` | REJECTION-PACKAGE (BD-001) |
| T-W14-UX-012a–012f: 6 tests GREEN | CI / test evidence | REJECTION-PACKAGE (BD-011) |
| T-W14-UX-013a–013g: 7 tests GREEN | CI / test evidence | REJECTION-PACKAGE (BD-011) |
| T-W14-UX-016a–016g: 7 tests GREEN | CI / test evidence | REJECTION-PACKAGE (BD-011) |
| 0 new test regressions beyond baseline | CI diff vs pre-existing | REJECTION-PACKAGE (BD-004) |
| `wave14-postimplementation-assurance-report.md` committed | Branch file existence | REJECTION-PACKAGE (CORE-018) |
| `app-management-centre-watchdog-readiness.md` committed | Branch file existence | REJECTION-PACKAGE (CORE-018) |
| SCOPE_DECLARATION.md matches diff exactly | A-026 check | REJECTION-PACKAGE |
| PREHANDOVER proof committed with pre-populated token | Branch file existence + CORE-018 | REJECTION-PACKAGE |
| Session memory committed | Branch file existence + CORE-015 | REJECTION-PACKAGE |
| CWT PASS evidence present | Wave closure artifact or PREHANDOVER | REJECTION-PACKAGE (OVL-AM-CWT-01) |
| aggregate_scores UNIQUE(null scope_id) handling verified | BD-002 / BD-008 | REJECTION-PACKAGE |
| RLS public posture on maturity_levels justified | BD-015 | REJECTION-PACKAGE if unjustified |

---

## Handover Invocation Instructions

When schema-builder and mat-specialist have completed all tasks and committed all artifacts to
branch `copilot/finalise-mat-gap-closure`, the Foreman must:

1. Commission and record CWT PASS for Wave 14 (all 15 GAPs, all Wave 14 modules).
2. Commit PREHANDOVER proof with `iaa_audit_token` pre-populated as `IAA-session-NNN-waveY-wave14-batchC-YYYYMMDD-PASS`.
3. Commit session memory file.
4. Update SCOPE_DECLARATION.md to match diff exactly (A-026, A-028).
5. Invoke IAA for full Phases 2–4 assurance review.

**IAA will NOT accept PREHANDOVER proof edits after commit** (A-029 §4.3b immutability rule).
The Foreman must pre-populate the token reference before committing the PREHANDOVER proof.

---

## Pre-Brief Status

| Field | Value |
|-------|-------|
| **Pre-Brief generated** | 2026-03-05 |
| **Qualifying tasks found** | 2 (TASK-W14-BC-001, TASK-W14-BC-002) |
| **Exempt tasks** | 2 (TASK-W14-BC-003, TASK-W14-BC-004 — existence-checked at PREHANDOVER) |
| **CWT obligation** | ACTIVE — Wave 14 final batch |
| **Assurance phases required** | 1, 2, 3, 4 (full cycle) |
| **Adoption phase** | PHASE_B_BLOCKING — hard gate active |
| **IAA independence confirmed** | IAA did not produce any Batch C deliverable — independence maintained |
| **Pre-Brief committed** | Pending commit (Step 0.5) |

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Contract**: v2.1.0 | **Knowledge**: v2.4.0  
**Constitutional Lock**: SELF-MOD-IAA-001 — ACTIVE  
**STOP-AND-FIX Mandate**: ACTIVE — No class exceptions  
