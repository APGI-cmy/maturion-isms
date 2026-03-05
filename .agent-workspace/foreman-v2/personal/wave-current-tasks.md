# Wave Current Tasks — foreman-v2-agent

**Wave**: Wave 14 Batch C — Finalise MAT Remaining Gap Closure and QA Acceptance
**Session**: session-142
**Date**: 2026-03-05
**Issue**: #909 (Wave 14 Batch C)
**Branch**: copilot/fix-wave14-batch-c-mat-gap-closure
**CS2 Authorization**: Issue opened by @APGI-cmy (CS2 direct); re-alignment directive issued by CS2 on this PR
**Source authority**: modules/mat/00-app-description/MAT_UX_WORKFLOW_AND_WIRING.md v1.0
**FRS/TRS**: FR-089 to FR-102 / TR-089 to TR-102
**Depends on**: Wave 14 Batch A (#917), Wave 14 Batch B (session-141)

---

## Wave 14 Batch C — Task List

### Gap Status from Batches A & B

| Gap | Status | Batch | Evidence |
|-----|--------|-------|---------|
| GAP-W01 (Onboarding Guard) | ✅ CLOSED | Batch A | 20260305000000_wave14_onboarding_support.sql + OnboardingGuardPage.tsx |
| GAP-W02 (Invite Auditor) | ✅ CLOSED | Batch A | 20260305000001_wave14_invitations_assignments.sql + InviteAuditorModal.tsx |
| GAP-W03 (Toggle Exclude) | ✅ CLOSED | Batch A | 20260305000002_wave14_excluded_columns.sql |
| GAP-W04 (Invite Evidence Submitter) | ✅ CLOSED | Batch A | 20260305000001 |
| GAP-W05 (Evidence Card) | ✅ CLOSED | Batch B | 20260305000003_wave14_evidence_schema.sql + EvidenceUploadPanel.tsx |
| GAP-W06 (AI Evaluation Trigger) | ✅ CLOSED | Batch B | 20260305000004_wave14_evaluations.sql + CriteriaCard.tsx |
| GAP-W07 (AI Next-Level Guidance) | ✅ CLOSED | Batch B | CriteriaCard.tsx |
| GAP-W08 (AI Chat Context) | ✅ CLOSED | Batch B | EmbeddedAIAssistant.tsx |
| GAP-W09 (Audit Results Table) | ✅ CLOSED | Batch B | AuditResultsTable.tsx + AuditManagementPage.tsx |
| GAP-W10 (Dashboard Drill-Down + Create Report Gate) | ✅ CLOSED | Batch B | DashboardPage.tsx |
| GAP-W11 (Report Generation) | ✅ CLOSED | Batch B | 20260305000006_wave14_audit_reports.sql + ReportGenerationPage.tsx |
| GAP-W12 (Level Descriptors) | 🔴 OPEN — migration missing | Batch C | TASK-W14-BC-001 |
| GAP-W13 (Scoring Tables + Default Rule) | 🔴 OPEN — migration missing | Batch C | TASK-W14-BC-002 |
| GAP-W14 (Responsibility Cascade) | ✅ CLOSED | Batch A | 20260305000001 |
| GAP-W15 (RLS for all new tables) | ✅ CLOSED | Batch A | 20260305000008_wave14_new_tables_rls.sql |

---

## Batch C Task List

### Subwave 14.C.1 — Level Descriptor Tables (GAP-W12)
**Test ID**: T-W14-UX-012
**RED tests failing**: T-W14-UX-012a through T-W14-UX-012f (6 tests in level-descriptor-tables.test.ts)

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 1 | TASK-W14-BC-001 | Create migration `20260305000005_wave14_level_descriptors.sql`: CREATE TABLE public.criteria_level_descriptors (id UUID PK, criteria_id UUID FK NOT NULL, level INTEGER NOT NULL, descriptor_text TEXT NOT NULL, UNIQUE(criteria_id, level)); CREATE TABLE public.mps_level_descriptors (id UUID PK, mps_id UUID FK NOT NULL, level INTEGER NOT NULL, descriptor_text TEXT NOT NULL, UNIQUE(mps_id, level)); CREATE TABLE public.domain_level_descriptors (id UUID PK, domain_id UUID FK NOT NULL, level INTEGER NOT NULL, descriptor_text TEXT NOT NULL, UNIQUE(domain_id, level)); RLS: org-isolation SELECT policies for all 3 tables | schema-builder | 🟢 DONE |

### Subwave 14.C.2 — Scoring Tables and Default Rule (GAP-W13)
**Test ID**: T-W14-UX-013 + T-W14-UX-016
**RED tests failing**: T-W14-UX-013a through T-W14-UX-013g (7 tests), T-W14-UX-016a through T-W14-UX-016g (7 tests) — all pointing to same migration file

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 2 | TASK-W14-BC-002 | Create migration `20260305000007_wave14_scoring_tables.sql`: CREATE TABLE public.maturity_levels (id UUID PK, name TEXT NOT NULL, level_number INTEGER NOT NULL UNIQUE, description TEXT); INSERT 5 seed rows (Basic=1, Reactive=2, Compliant=3, Proactive=4, Resilient=5); CREATE TABLE public.scoring_rules (id UUID PK, organisation_id UUID NULLABLE FK organisations, aggregation_method TEXT NOT NULL DEFAULT 'weighted_average'); INSERT global default seed (organisation_id=NULL, aggregation_method='weighted_average'); CREATE TABLE public.aggregate_scores (id UUID PK, audit_id UUID FK NOT NULL, level_type TEXT NOT NULL, scope_id UUID, score NUMERIC, UNIQUE(audit_id, level_type, scope_id)); RLS: maturity_levels and scoring_rules publicly readable (global reference); aggregate_scores org-isolated; fallback COALESCE for missing scoring rule | schema-builder | 🟢 DONE |

### Subwave 14.C.3 — Post-Implementation Assurance Report (Issue Scope)
**Test ID**: N/A (governance/documentation artifact)

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 3 | TASK-W14-BC-003 | Create `modules/mat/05-build-evidence/wave14-postimplementation-assurance-report.md` — full UX workflow green/red tick-list against all 15 GAPs (W01–W15), screenshot references (placeholder), drill-down capability attestation, signed-off QA acceptance | mat-specialist | 🟢 DONE |

### Subwave 14.C.4 — App Management Centre Watchdog Readiness (Issue Scope)

| # | Task ID | Description | Builder | Status |
|---|---------|-------------|---------|--------|
| 4 | TASK-W14-BC-004 | Create `modules/mat/05-build-evidence/app-management-centre-watchdog-readiness.md` — document MAT readiness for future watchdog/monitoring integration: health check endpoints, key event hooks, monitoring surfaces, integration interface contract | mat-specialist | 🟢 DONE |

---

## IAA Tokens (to be populated post-IAA)

| PR # | Token | Date |
|------|-------|------|
| — | PENDING | — |

---

## Wave Completion Gate

- [ ] IAA Pre-Brief exists at `.agent-admin/assurance/iaa-prebrief-wave14-batchC.md`
- [ ] TASK-W14-BC-001 complete: `20260305000005_wave14_level_descriptors.sql` exists, T-W14-UX-012a–012f GREEN
- [ ] TASK-W14-BC-002 complete: `20260305000007_wave14_scoring_tables.sql` exists, T-W14-UX-013a–013g GREEN, T-W14-UX-016a–016g GREEN
- [ ] TASK-W14-BC-003 complete: post-implementation assurance report committed
- [ ] TASK-W14-BC-004 complete: watchdog readiness document committed
- [ ] 0 pre-existing test regressions introduced
- [ ] All tasks show 🟢 DONE
- [ ] IAA ASSURANCE-TOKEN received
- [ ] Session memory written
- [ ] PREHANDOVER proof committed
- [ ] CS2 notified for merge approval

---

## Wave 14 Batch C — COMPLETE

**All 4 tasks 🟢 DONE**
**IAA ASSURANCE-TOKEN**: `IAA-session-142-v3-wave14-batchC-20260305-PASS` (IAA session-149)
**Token file**: `.agent-admin/assurance/iaa-token-session-142-v3-wave14-batchC-20260305.md`
**Wave 14 Status**: ✅ ALL 15 GAPs CLOSED — One-time build milestone ACHIEVED for MAT
