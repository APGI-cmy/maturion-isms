# LKIAC Deprecation Register

Version: v1.5.0  
Date: 2026-04-13  
**Amendment v1.2.0**: v1.2.0 — 2026-03-01: CL-3.5-D5 — DEP-008 status updated to `PARALLEL-RUN` per CL-3.5 wave completion (session-082).  
**Amendment v1.3.0**: v1.3.0 — 2026-03-20: CL-3-D1 entries — DEP-001 through DEP-007 legacy components assessed and recorded; all LKIAC-001 §6 components now registered (DCKIS-CL11, session-dckis-cl11-20260320).  
**Amendment v1.4.0**: v1.4.0 — 2026-04-03: DEP-008 status updated to `PARALLEL-RUN — SCHEMA DELIVERED`; CP-3.5 CS2 formal sign-off recorded 2026-04-03; schema delivery at `packages/ai-centre/supabase/migrations/007_ai_data_sources.sql` confirmed (session-cep-v1.8.0-programme-clearance-20260403).  
**Amendment v1.5.0**: v1.5.0 — 2026-04-13: LKIAC carry-over closure — DEP-005, DEP-006, DEP-007 status updated `ACTIVE` → `PARALLEL-RUN` per CL-13 extended scope completion (session-083, 2026-03-01; 15 CL-13 tests GREEN). AIMC equivalents delivered: QAOverviewPanel.tsx (D5), UnifiedQASignalView.tsx + qaSignalService.ts (D6), HealthTestResultsView.tsx (D7). Issue #1341.

## 1. Purpose

This register records the assessment, status, and planned disposition of all legacy components identified in LKIAC-001 §6. Each component must reach `DECOMMISSIONED` status before the LKIAC programme can close (CL-15 exit criterion). CS2 sign-off (CP-3) is required before any component progresses to `DECOMMISSIONED`.

## 2. Status Codes

| Status | Meaning |
|--------|---------|
| `ACTIVE` | Legacy component is still in use; no confirmed AIMC equivalent yet delivered |
| `PARALLEL-RUN` | AIMC equivalent has been delivered; legacy component running alongside it pending decommission gate |
| `SUPERSEDED` | AIMC equivalent is live and verified; legacy component is no longer the authoritative source |
| `DECOMMISSIONED` | Legacy component removed; decommission confirmed by CS2 (CP-3) |

## 3. Component Register

### DEP-001 — Maturion Persona / maturion-advisor (LKIAC-SC-1)

| Field | Value |
|-------|-------|
| **Component** | Maturion Persona — legacy `maturion-advisor` persona configuration |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-1 |
| **Status** | `PARALLEL-RUN` |
| **AIMC Equivalent** | `packages/ai-centre/agents/maturion-advisor.md` (CL-1 COMPLETE 2026-03-01; CP-1 pending CS2 sign-off) |
| **Notes** | Persona content migrated and verified at v1.0.0 (CL-1-D1). CP-1 closure artifact at `.agent-admin/checkpoints/cp-1-closure-20260313.md`. Decommission of legacy persona pending CS2 CP-1 sign-off. |
| **Gap Registered** | N/A — AIMC equivalent delivered |

---

### DEP-002 — Legacy Knowledge Base (LKIAC-SC-2)

| Field | Value |
|-------|-------|
| **Component** | Legacy knowledge base content stored in `apps/maturion-maturity-legacy/` |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-2 |
| **Status** | `ACTIVE` |
| **AIMC Equivalent** | `ai_knowledge` table in Supabase (AIMC knowledge store) — content migration pending (CL-6 not yet started) |
| **Notes** | Legacy knowledge inventory completed (CL-2 IN PROGRESS; draft CL-2-D1 domain tag plan produced). Content re-ingestion to `ai_knowledge` table is CL-6 work. Knowledge upload pipeline (process-document-v2 Edge Function + MAT UI) delivered via DCKIS-IMPL-002 but legacy content migration itself is CL-6. |
| **Gap Registered** | CL-6 (Knowledge Re-ingestion) not yet started — blocked on CL-2 CP-2 CS2 sign-off |

---

### DEP-003 — Legacy Supabase (LKIAC-SC-3)

| Field | Value |
|-------|-------|
| **Component** | Legacy Supabase project used by `apps/maturion-maturity-legacy/` |
| **Location** | `apps/maturion-maturity-legacy/supabase/` |
| **LKIAC Reference** | LKIAC-SC-3 |
| **Status** | `ACTIVE` |
| **AIMC Equivalent** | `packages/ai-centre/supabase/` (canonical AIMC Supabase project) — migration in progress across multiple CL waves |
| **Notes** | Legacy Supabase project contains migrations for legacy schema. Canonical AIMC Supabase project is being built wave-by-wave (CL-3.5 delivered ai_data_sources, DCKIS-SCH-001 delivered ai_knowledge chunk metadata columns). Full decommission requires CL-6 knowledge migration and CL-12 module integration to be complete before legacy Supabase can be retired. |
| **Gap Registered** | Full migration dependency on CL-6, CL-12 completion |

---

### DEP-004 — Domain Specialists Without Knowledge Routing (LKIAC-SC-4)

| Field | Value |
|-------|-------|
| **Component** | Legacy domain specialist agents configured without knowledge source routing |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-4 |
| **Status** | `ACTIVE` |
| **AIMC Equivalent** | `packages/ai-centre/agents/` specialists with source-filtered queries (CL-8 Domain Specialist Knowledge Routing — not yet started) |
| **Notes** | AIMC domain specialists exist but knowledge routing (source-filtered `ai_knowledge` queries per domain) is CL-8 work. CL-8 is blocked on CL-6 (knowledge migration) and CL-3 (deprecation register). No timeline until CL-6 closes. |
| **Gap Registered** | CL-8 (Domain Specialist Knowledge Routing) not yet started |

---

### DEP-005 — QA Dashboard (DataQADashboard.tsx)

| Field | Value |
|-------|-------|
| **Component** | `DataQADashboard.tsx` — legacy data quality assurance dashboard |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-5 (CL-3-D2 gap) |
| **Status** | `PARALLEL-RUN` |
| **AIMC Equivalent** | `modules/amc/src/components/QAOverviewPanel.tsx` — CL-13 D5 COMPLETE (session-083, 2026-03-01; 15 CL-13 tests GREEN) |
| **Notes** | CL-13 D5 delivered: QA Overview Panel in AMC module. Live QA signal status panel showing framework status (ACTIVE/INACTIVE), active rules count, running/completed tests, compliance rate. Verified against legacy QADashboard.tsx functionality checklist. Decommission pending CS2 CP-3 sign-off. |
| **Gap Registered** | N/A — AIMC equivalent delivered (CL-13-D5) |

---

### DEP-006 — Unified QA Dashboard (UnifiedQADashboard.tsx)

| Field | Value |
|-------|-------|
| **Component** | `UnifiedQADashboard.tsx` — legacy unified quality assurance dashboard |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-6 (CL-3-D2 gap) |
| **Status** | `PARALLEL-RUN` |
| **AIMC Equivalent** | `modules/amc/src/components/UnifiedQASignalView.tsx` + `modules/amc/src/services/qaSignalService.ts` — CL-13 D6 COMPLETE (session-083, 2026-03-01) |
| **Notes** | CL-13 D6 delivered: Unified QA Signal Aggregation View + qaSignalService.ts service layer. Aggregates from watchdog_alerts and qa_metrics signal sources. Shows system health score (0-100%), total/passed/failed test counts. Decommission pending CS2 CP-3 sign-off. |
| **Gap Registered** | N/A — AIMC equivalent delivered (CL-13-D6) |

---

### DEP-007 — QA Test Dashboard (QATestDashboard.tsx)

| Field | Value |
|-------|-------|
| **Component** | `QATestDashboard.tsx` — legacy quality assurance test dashboard |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-7 (CL-3-D2 gap) |
| **Status** | `PARALLEL-RUN` |
| **AIMC Equivalent** | `modules/amc/src/components/HealthTestResultsView.tsx` — CL-13 D7 COMPLETE (session-083, 2026-03-01) |
| **Notes** | CL-13 D7 delivered: Health Module Test Results Sub-view. Shows test execution history, test results (name, status, message, timestamp), QA checklist categories (Database & Schema, API Functionality, Security & Permissions, Data Integrity). Supports filtering by test status (passed/failed/warning). Decommission pending CS2 CP-3 sign-off. |
| **Gap Registered** | N/A — AIMC equivalent delivered (CL-13-D7) |

---

### DEP-008 — Data Sources Management (DataSourcesManagement.tsx)

| Field | Value |
|-------|-------|
| **Component** | Foreman Office App — `DataSourcesManagement.tsx` legacy data source management UI |
| **Location** | `apps/maturion-maturity-legacy/` |
| **LKIAC Reference** | LKIAC-SC-8 |
| **Status** | `PARALLEL-RUN` |
| **AIMC Equivalent** | `AIMCDataSourcesPanel.tsx` + `ai_data_sources` table + 4 Edge Functions (connect-data-source, sync-data-source, query-data-source, test-data-sources-api) — CL-3.5 COMPLETE (session-082, 2026-03-01; 244/244 tests GREEN) |
| **Notes** | CL-3.5 complete (session-082, 2026-03-01). `ai_data_sources` table (migration 007) with RLS, 4 AIMC Edge Functions, and AIMCDataSourcesPanel.tsx admin UI all delivered and 100% GREEN (244/244 tests). DEP-008 status → PARALLEL-RUN per CL-3.5-D5. CP-3.5 formally approved by CS2 2026-04-03. Schema delivery confirmed: `packages/ai-centre/supabase/migrations/007_ai_data_sources.sql`. Decommission of DataSourcesManagement.tsx pending CP-3 decommission gate. |
| **Gap Registered** | N/A — AIMC equivalent delivered |

---

## 4. Summary Table

| DEP ID | Component | LKIAC Ref | Status | AIMC Equivalent | Wave |
|--------|-----------|-----------|--------|-----------------|------|
| DEP-001 | Maturion Persona / maturion-advisor | LKIAC-SC-1 | `PARALLEL-RUN` | `packages/ai-centre/agents/maturion-advisor.md` | CL-1 ✅ |
| DEP-002 | Legacy Knowledge Base | LKIAC-SC-2 | `ACTIVE` | `ai_knowledge` table (migration pending) | CL-6 ⏳ |
| DEP-003 | Legacy Supabase | LKIAC-SC-3 | `ACTIVE` | `packages/ai-centre/supabase/` (partial migration) | CL-6+CL-12 ⏳ |
| DEP-004 | Domain Specialists (no routing) | LKIAC-SC-4 | `ACTIVE` | AIMC specialists + source routing | CL-8 ⏳ |
| DEP-005 | DataQADashboard.tsx | LKIAC-SC-5 | `PARALLEL-RUN` | `modules/amc/src/components/QAOverviewPanel.tsx` (CL-13-D5) | CL-13 ✅ |
| DEP-006 | UnifiedQADashboard.tsx | LKIAC-SC-6 | `PARALLEL-RUN` | `UnifiedQASignalView.tsx` + `qaSignalService.ts` (CL-13-D6) | CL-13 ✅ |
| DEP-007 | QATestDashboard.tsx | LKIAC-SC-7 | `PARALLEL-RUN` | `modules/amc/src/components/HealthTestResultsView.tsx` (CL-13-D7) | CL-13 ✅ |
| DEP-008 | DataSourcesManagement.tsx | LKIAC-SC-8 | `PARALLEL-RUN` | AIMCDataSourcesPanel.tsx + ai_data_sources | CL-3.5 ✅ |

**Register completeness**: All 8 LKIAC-001 §6 components assessed. CL-3-D1 exit criterion MET. CP-3 CS2 sign-off required for decommission gate.

## 8. Audit Trail

| Date | Change | Author | Remarks |
|-------|--------|--------|---------|
| 2026-03-01 | DEP-008 status updated ACTIVE → PARALLEL-RUN (CL-3.5-D5) — CL-3.5 wave complete: ai_data_sources migration, 4 Edge Functions, admin UI panel, 244/244 GREEN | governance-liaison-isms-agent (session-082) | CL-3.5 exit criteria met. Awaiting CS2 CP-3 sign-off for decommission gate. |
| 2026-03-20 | DEP-001 through DEP-007 added — CL-3-D1 full register completion (DCKIS-CL11, session-dckis-cl11-20260320). All 8 LKIAC-001 §6 components now assessed. Version bumped v1.2.0 → v1.3.0. | governance-liaison-isms-agent (session-dckis-cl11-20260320) | CL-3-D1 exit criterion met. CP-3 CS2 sign-off required before any decommission gate proceeds. |

| 2026-04-03 | DEP-008 status updated PARALLEL-RUN → PARALLEL-RUN — SCHEMA DELIVERED; CP-3.5 CS2 formal sign-off recorded; schema delivery confirmed at `packages/ai-centre/supabase/migrations/007_ai_data_sources.sql` | foreman-v2-agent (session-cep-v1.8.0-programme-clearance-20260403) | CP-3.5 CS2 signed off 2026-04-03. Amendment v1.8.0 CEP programme clearance. |
| 2026-04-13 | DEP-005, DEP-006, DEP-007 status updated ACTIVE → PARALLEL-RUN per CL-13 extended scope completion (session-083, 2026-03-01; 15 CL-13 tests GREEN). AIMC equivalents: QAOverviewPanel.tsx (D5), UnifiedQASignalView.tsx + qaSignalService.ts (D6), HealthTestResultsView.tsx (D7). All 42 LKIAC carry-over tests verified GREEN (27 CL-3.5 + 15 CL-13) 2026-04-13. Version bumped v1.4.0 → v1.5.0. | foreman-v2-agent (session-164-lkiac-carryover-closure-20260413) | LKIAC carry-over closure. Issue #1341. CL-13 D5/D6/D7 delivery confirmed. Decommission pending CS2 CP-3 sign-off for all PARALLEL-RUN components. |

---

Footer:  
Version: v1.5.0
