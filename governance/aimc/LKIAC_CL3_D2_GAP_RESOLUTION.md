# LKIAC CL-3-D2 Gap Resolution Record

**Document ID**: LKIAC-001-D2-GAP-RES  
**Version**: v1.0.0  
**Date**: 2026-03-01  
**Status**: ACTIVE  
**Authority**: LKIAC-001 §4, CL-3-D2  
**Produced By**: foreman-v2-agent v6.2.0 (session-079) via governance-liaison-isms-agent  
**Bootstrap**: Phase 1 contract load confirmed (governance-liaison-isms-agent contract v3.2.0 loaded via agent_bootstrap before any repository file access)  
**Location**: `governance/aimc/LKIAC_CL3_D2_GAP_RESOLUTION.md`  
**Feeds**: `governance/aimc/LKIAC_DEPRECATION_REGISTER.md`, `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`

---

## 1. Purpose

This document is the **formal gap resolution record** for Wave CL-3-D2. It records the Foreman
planning decisions that resolve all four gap items (GAP-001 through GAP-004) identified during the
CL-3-D1 deliverable — the LKIAC Deprecation Register activation.

CL-3-D1 (`governance/aimc/LKIAC_DEPRECATION_REGISTER.md` v1.0.0) identified four legacy components
in `apps/maturion-maturity-legacy/` that had no confirmed Foreman Office App or AIMC equivalent and
no specific execution-plan wave assigned. These were classified as gap items requiring CL-3-D2
resolution before the CP-3 gate can be presented to CS2.

This document records:

1. The Foreman planning decisions for each gap item (frozen — CS2-delegated)
2. The target equivalent for each legacy component
3. The wave assignment and acceptance criteria for each gap
4. The definition of the new wave CL-3.5 (AIMC Data Sources Registry)
5. The extended scope note for wave CL-13 (Foreman Office App QA modules)

> **Governing Principle** (LKIAC-001 §8 Principle 3):
> No legacy component shall be removed without a verified equivalent.
> This document advances all four gap items toward that verified-equivalent state.

---

## 2. Gap Resolution Table

> **Decisions made by**: foreman-v2-agent v6.2.0 (session-079)  
> **Decision authority**: CS2-delegated Foreman POLC planning authority  
> **Date of decisions**: 2026-03-01  
> **Status of all decisions**: FROZEN — do not alter without CS2 authorisation

| Gap ID | DEP Ref | Component | Legacy Path | Decision | Target Equivalent | Assigned Wave | Acceptance Criteria |
|--------|---------|-----------|-------------|----------|-------------------|---------------|---------------------|
| GAP-001 | DEP-005 | QA Dashboard (legacy) | `apps/maturion-maturity-legacy/src/pages/QADashboard.tsx` | Map to Foreman Office App | Foreman Office App — QA Overview panel (sub-module of CL-13 health/watchdog module) | CL-13 (extended scope) | Foreman Office App CL-13 delivers a QA Overview panel showing live QA signal status for all active modules, verified against QADashboard.tsx functionality checklist |
| GAP-002 | DEP-006 | Unified QA Dashboard | `apps/maturion-maturity-legacy/src/pages/UnifiedQADashboard.tsx` | Map to Foreman Office App | Foreman Office App — Unified QA Signal Aggregation view (CL-13 health module extension) | CL-13 (extended scope) | Foreman Office App CL-13 delivers a unified QA aggregation view consuming QA signal data from ≥2 configured signal sources, verified against UnifiedQADashboard.tsx functional scope |
| GAP-003 | DEP-007 | QA Test Dashboard | `apps/maturion-maturity-legacy/src/pages/QATestDashboard.tsx` | Map to Foreman Office App health module | Foreman Office App — health module extended to include test results sub-view | CL-13 (extended scope) | Foreman Office App CL-13 health module explicitly includes test results display sub-view showing test execution history and status, verified against QATestDashboard.tsx scope |
| GAP-004 | DEP-008 | Data Sources Management | `apps/maturion-maturity-legacy/src/pages/DataSourcesManagement.tsx` | New wave (requires AIMC schema + Edge Function migration) | AIMC data source registry — new `ai_data_sources` Supabase table + 4 Edge Functions migrated from legacy | New wave CL-3.5 | (1) New Supabase migration for `ai_data_sources` table with RLS; (2) All 4 Edge Functions (connect-data-source, sync-data-source, query-data-source, test-data-sources-api) migrated to `packages/ai-centre/supabase/functions/`; (3) AIMC data source management UI or admin panel; (4) 100% GREEN test gate |

---

## 3. Wave Assignment Rationale

### 3.1 GAP-001, GAP-002, GAP-003 → Wave CL-13 (Extended Scope)

**Rationale**: All three gap components (QADashboard, UnifiedQADashboard, QATestDashboard) represent
QA observability and signal-aggregation functionality. This functionality belongs in the **Foreman
Office App**, which is the platform designed to provide cross-module health monitoring, watchdog
controls, and QA state visibility for the ISMS ecosystem.

Wave CL-13 is the LKIAC Wave 6 deliverable — "Foreman Office App API Contract Definition" — which
defines the formal contract between the Foreman Office App and the AIMC. As the wave that
establishes the Foreman Office App's integration surface, CL-13 is the correct vehicle to also
define and deliver the QA-facing modules of the Foreman Office App, because:

1. **Architectural coherence**: QA dashboards are health/watchdog sub-modules — the same domain as
   the Foreman Office App's existing CL-13 planned deliverables (DEP-001 watchdog module, DEP-002
   health module, DEP-003 workflow module, DEP-004 config module).

2. **Avoiding wave proliferation**: Creating three separate micro-waves for closely related QA
   modules would fragment coordination and create unnecessary CS2 checkpoint overhead. Extending
   CL-13 scope is the least-disruption approach.

3. **DEP-002 overlap resolved**: GAP-003 (QA Test Dashboard) was noted in CL-3-D1 as potentially
   overlapping with DEP-002 (Admin Health Checker → CL-13 health module). This resolution
   explicitly maps GAP-003 to the CL-13 health module — confirming the overlap and resolving it
   by extending the health module scope to include test results display.

4. **Functional grouping**: GAP-001 (live QA signal status) and GAP-002 (unified multi-source QA
   aggregation) are related — they can share data-fetching infrastructure in the Foreman Office App
   QA module. Building them in the same wave avoids duplication.

**Extended scope note**: CL-13 deliverables table must be updated (see §4 of this document and the
corresponding amendment to `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`) to
reflect the QA Overview panel, Unified QA Signal Aggregation view, and health module test results
sub-view as explicit CL-13 deliverables.

### 3.2 GAP-004 → New Wave CL-3.5

**Rationale**: The Data Sources Management component (DEP-008) is distinctly different from the
Foreman Office App QA modules in one critical respect: it requires **new AIMC schema work** before
any UI can be built.

The legacy `DataSourcesManagement.tsx` is backed by 4 active Edge Functions
(`connect-data-source`, `sync-data-source`, `query-data-source`, `test-data-sources-api`) and
references an `ai_data_sources` concept that does not exist in the AIMC Supabase schema
(`packages/ai-centre/supabase/migrations/` has no `data_sources` table as at CL-3-D1 assessment).

This makes it unsuitable for CL-13 (which is a governance-document wave, not a schema/Edge
Function implementation wave). Key reasons for a new wave:

1. **Schema prerequisite**: A new Supabase migration (`ai_data_sources` table with RLS) must be
   designed and built by `schema-builder` before any other work can proceed. This is a hard
   sequential dependency that CL-13 does not have.

2. **Edge Function migration scope**: 4 legacy Edge Functions must be migrated into
   `packages/ai-centre/supabase/functions/`. This is `api-builder` scope, not liaison scope.

3. **Test gate requirement**: The migration of backend infrastructure (schema + 4 Edge Functions)
   requires a 100% GREEN test gate before any UI can be built. This demands a full RED → BUILD →
   GREEN cycle under `qa-builder` oversight.

4. **Dependency sequencing**: CL-3.5 must occur after CL-3 (which establishes the gap inventory)
   and before CL-8 (domain routing wave, which may need data source awareness for routing queries
   to the correct knowledge sources). Making it an independent wave with explicit entry/exit criteria
   gives Foreman and CS2 clean control over its sequencing.

5. **Avoiding CL-13 contamination**: If DEP-008 were folded into CL-13, a schema failure or Edge
   Function migration blocker could delay the governance document deliverables that CL-13 was
   originally scoped to produce. Separation of concerns protects CL-13 exit criteria.

---

## 4. CL-3.5 Wave Definition

### Wave CL-3.5: AIMC Data Sources Registry — Schema, Edge Functions, Admin UI

**Programme**: LKIAC (AIMC schema extension for Data Sources Management)  
**Source**: LKIAC-001 §6 DEP-008 gap resolution (this document, §2 GAP-004)  
**Type**: Implementation — RED gate → schema-builder + api-builder + ui-builder → GREEN  
**Priority**: MEDIUM (must complete before CL-8 domain routing wave)

**Objective**: Deliver the AIMC data source registry that supersedes the legacy
`DataSourcesManagement.tsx` component. This includes: a new `ai_data_sources` Supabase table with
appropriate RLS policies, migration of all 4 legacy Edge Functions into the governed AIMC functions
directory, and an AIMC data source management UI or admin API panel.

**Entry Criteria**:
- CL-3 closed (Deprecation Register: all components assessed, GAP-004 resolution recorded in this document)
- CS2 approval of CL-3.5 wave-start (CP-3.5 — see §5)

**Exit Criteria**:
- New Supabase migration created and applied: `ai_data_sources` table with RLS enabled
- All 4 Edge Functions migrated to `packages/ai-centre/supabase/functions/`:
  - `connect-data-source`
  - `sync-data-source`
  - `query-data-source`
  - `test-data-sources-api`
- AIMC data source management UI or admin panel built and wired to the migrated Edge Functions
- 100% GREEN test gate: all tests passing, zero stubs, zero skipped
- DEP-008 status updated to `PARALLEL-RUN` in Deprecation Register (pending CL-15 decommission gate)

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|----|-------------|-------------|----------|
| CL-3.5-D1 | RED gate test suite: tests for `ai_data_sources` schema (RLS, CRUD), all 4 Edge Functions (connect, sync, query, test-api) | `qa-builder` | `packages/ai-centre/supabase/functions/` test files |
| CL-3.5-D2 | Supabase migration `007_ai_data_sources.sql` (or next sequential number): `ai_data_sources` table schema with RLS policies | `schema-builder` | `packages/ai-centre/supabase/migrations/` |
| CL-3.5-D3 | Edge Function migration ×4: `connect-data-source`, `sync-data-source`, `query-data-source`, `test-data-sources-api` migrated to `packages/ai-centre/supabase/functions/` | `api-builder` | `packages/ai-centre/supabase/functions/` |
| CL-3.5-D4 | AIMC data source management UI or admin API panel wired to migrated Edge Functions | `ui-builder` | `packages/ai-centre/src/` or designated admin module |
| CL-3.5-D5 | Deprecation Register updated: DEP-008 status → `PARALLEL-RUN`, Foreman/AIMC Equivalent confirmed | `governance-liaison-isms-agent` | `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` |

**Dependencies**:
- After CL-3 (Deprecation Register activation — provides the gap inventory context)
- Before CL-8 (LKIAC Wave 4 — Domain Specialist Knowledge Routing; data source registry should be available for routing layer awareness)
- Independent of CL-13 (no shared deliverables)

**RED Gate**: `qa-builder` produces CL-3.5-D1 (all tests failing RED) BEFORE `schema-builder`
creates CL-3.5-D2 or `api-builder` migrates CL-3.5-D3.

**CS2 Checkpoint (CP-3.5)**: CS2 approves the data sources schema specification (CL-3.5-D2 design)
before `schema-builder` builds. This ensures the `ai_data_sources` schema is architecturally
aligned with the AIMC strategy before any migration is applied.

**Responsible Agents**: `qa-builder` (RED gate, test suite), `schema-builder` (migration),
`api-builder` (Edge Function migration), `ui-builder` (admin UI/panel),
`governance-liaison-isms-agent` (DEP-008 register update)

---

## 5. CP-3 Gate Status

### Gap Resolution Status

All four gap items identified in CL-3-D1 now have formal decisions, target equivalents, assigned
waves, and acceptance criteria. The CL-3-D2 deliverable is considered **complete** with respect to
the Foreman planning decision layer.

### CP-3 Checklist Item: "Gap items have corresponding GitHub issues created (CL-3-D2)"

This item is **partially satisfied** at this stage:

- ✅ Gap resolution **decisions** are recorded (this document, §2)
- ✅ Target equivalents defined for all 4 gap items
- ✅ Wave assignments made for all 4 gap items
- ✅ Acceptance criteria documented for all 4 gap items
- ⏳ **GitHub issue creation for follow-on engineering work requires CS2/human action**

> ⚠️ **Note**: Copilot agents operating under governance liaison authority cannot open new GitHub
> issues in the `maturion-isms` repository. The creation of GitHub issues for CL-3.5 (new wave)
> and the CL-13 scope extension (GAP-001–003) requires CS2 or human action via the GitHub web
> interface or CLI. This does not block the governance record — the decisions and acceptance
> criteria are frozen here. CS2 may create the issues at the CP-3 sign-off point or delegate to
> a human contributor.

**Recommendation to CS2**: At CP-3 sign-off, create the following GitHub issues:
1. CL-3.5 wave kick-off issue: AIMC Data Sources Registry (schema, Edge Functions, admin UI)
2. CL-13 scope extension note: QA modules (QA Overview panel, Unified QA Aggregation, health module test results sub-view)

---

## 6. Updated Deprecation Register Summary

Following this resolution:

| DEP ID | Component | Previous Wave | Resolved Wave | Target Equivalent |
|--------|-----------|---------------|---------------|-------------------|
| DEP-005 | QA Dashboard (legacy) | UNPLANNED — GAP | CL-13 (extended scope) | Foreman Office App — QA Overview panel |
| DEP-006 | Unified QA Dashboard | UNPLANNED — GAP | CL-13 (extended scope) | Foreman Office App — Unified QA Signal Aggregation view |
| DEP-007 | QA Test Dashboard | UNPLANNED — GAP | CL-13 (extended scope) | Foreman Office App — health module (extended: test results sub-view) |
| DEP-008 | Data Sources Management | UNPLANNED — GAP | CL-3.5 (new wave) | AIMC data source registry (ai_data_sources table + Edge Functions) |

All four entries in `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` have been updated in the same
commit as this document (see Audit Trail §7).

---

## 7. Audit Trail

| Date | Action | Agent | Notes |
|------|--------|-------|-------|
| 2026-03-01 | Gap resolution decisions recorded (CL-3-D2) — GAP-001–003 assigned to CL-13; GAP-004 assigned to new wave CL-3.5 | foreman-v2-agent v6.2.0 (via governance-liaison-isms-agent, session-079) | All 4 gap items now have frozen target equivalents, wave assignments, and acceptance criteria. GitHub issue creation for follow-on engineering work pending CS2/human action. |

---

**Authority**: LKIAC-001 §4, CL-3-D2  
**Version**: v1.0.0 | **Date**: 2026-03-01  
**Feeds**: `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` v1.1.0, `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.2.0
