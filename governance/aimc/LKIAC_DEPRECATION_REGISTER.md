# LKIAC Deprecation Register

**Document ID**: LKIAC-001-DEP-REG  
**Version**: v1.1.0  
**Date**: 2026-03-01  
**Status**: ACTIVE — Awaiting CS2 Sign-off (CP-3)  
**Authority**: LKIAC-001 §6 Deprecation Register  
**Source Programme**: Legacy Knowledge Integration and Architecture Consolidation (LKIAC)  
**Assigned Agent**: governance-liaison-isms-agent  
**Deliverable**: CL-3-D1 (Wave CL-3: LKIAC Wave 5 — Deprecation Register Activation)  
**Feeds**: CL-15 (Legacy Component Decommission Wave)

---

## 1. Purpose

This register formally activates the LKIAC-001 §6 Deprecation Register for all components in
`apps/maturion-maturity-legacy/`. It records the current status of each legacy component, maps
each to its planned AMC (App Management Centre) or AIMC equivalent, and identifies gaps where no confirmed
equivalent exists yet.

**Governing Principle** (LKIAC-001 §8 Principle 3):
> No legacy component shall be removed without a verified equivalent.

This register is the authoritative gate document for CL-15. No decommission of any legacy
component may proceed without a `SUPERSEDED` status in this register AND CS2 sign-off per CP-3.

---

## 2. Status Definitions

| Status | Meaning |
|--------|---------|
| `ACTIVE` | Still in production use; no live equivalent exists yet |
| `PARALLEL-RUN` | Both legacy component and new equivalent active simultaneously; migration in progress |
| `SUPERSEDED` | Equivalent is live and validated; ready for decommission pending CS2 sign-off |
| `DECOMMISSIONED` | Legacy component removed from codebase |

---

## 3. Component Register

> **Assessment Date**: 2026-03-01  
> **Assessor**: governance-liaison-isms-agent (Wave CL-3)  
> **Basis**: Direct file existence check + AIMC/apps directory audit + CL execution plan mapping

| ID | Component Name | Legacy Path | Status | Foreman/AIMC Equivalent | Planned Wave | Gate Condition | Notes |
|----|---------------|-------------|--------|------------------------|--------------|----------------|-------|
| DEP-001 | Watchdog Dashboard | `apps/maturion-maturity-legacy/src/pages/WatchdogDashboard.tsx` | `ACTIVE` | AMC (App Management Centre) — watchdog module | CL-13 | CS2 sign-off after CL-13 delivers verified watchdog module | File confirmed present. AMC (App Management Centre) does not exist yet. No equivalent live. AI confidence heatmap + watchdog control panel. |
| DEP-002 | Admin Health Checker | `apps/maturion-maturity-legacy/src/pages/AdminHealthChecker.tsx` | `ACTIVE` | AMC (App Management Centre) — health module | CL-13 | CS2 sign-off after CL-13 delivers verified health module | File confirmed present. Provides QA health checks against ARCHITECTURE.md True North and `qa/requirements.json`. AMC (App Management Centre) not yet built. |
| DEP-003 | Admin Workflow Dashboard | `apps/maturion-maturity-legacy/src/pages/AdminWorkflowDashboard.tsx` | `ACTIVE` | AMC (App Management Centre) — workflow module | CL-13 | CS2 sign-off after CL-13 delivers verified workflow module | File confirmed present. AMC (App Management Centre) not yet built. No equivalent live. |
| DEP-004 | Admin Config | `apps/maturion-maturity-legacy/src/pages/AdminConfig.tsx` | `ACTIVE` | AMC (App Management Centre) — config module | CL-13 | CS2 sign-off after CL-13 delivers verified config module | File confirmed present. AMC (App Management Centre) not yet built. No equivalent live. |
| DEP-005 | QA Dashboard (legacy) | `apps/maturion-maturity-legacy/src/pages/QADashboard.tsx` | `ACTIVE` | **TBD — no equivalent planned** | **UNPLANNED — GAP** | Blocked: target must be defined and wave assigned before gate applies | ⚠️ **GAP ITEM**. No AMC or AIMC equivalent defined. No execution plan wave covers this component. Requires GitHub issue (CL-3-D2). |
| DEP-006 | Unified QA Dashboard | `apps/maturion-maturity-legacy/src/pages/UnifiedQADashboard.tsx` | `ACTIVE` | **TBD — no equivalent planned** | **UNPLANNED — GAP** | Blocked: target must be defined and wave assigned before gate applies | ⚠️ **GAP ITEM**. No AMC or AIMC equivalent defined. No execution plan wave covers this component. Requires GitHub issue (CL-3-D2). |
| DEP-007 | QA Test Dashboard | `apps/maturion-maturity-legacy/src/pages/QATestDashboard.tsx` | `ACTIVE` | **TBD — no equivalent planned** | **UNPLANNED — GAP** | Blocked: target must be defined and wave assigned before gate applies | ⚠️ **GAP ITEM**. No AMC or AIMC equivalent defined. No execution plan wave covers this component. Requires GitHub issue (CL-3-D2). |
| DEP-008 | Data Sources Management | `apps/maturion-maturity-legacy/src/pages/DataSourcesManagement.tsx` | `ACTIVE` | AIMC data source registry | **UNPLANNED — GAP** | Blocked: AIMC data source registry schema must be designed and a CL wave assigned | ⚠️ **GAP ITEM**. Legacy app has 4 Edge Functions (`connect-data-source`, `sync-data-source`, `query-data-source`, `test-data-sources-api`). AIMC `packages/ai-centre/supabase/migrations/` has no `data_sources` table. No specific CL wave maps this migration. Requires GitHub issue (CL-3-D2). |
| DEP-009 | Knowledge Base UI | `apps/maturion-maturity-legacy/src/pages/MaturionKnowledgeBase.tsx` | `ACTIVE` | AIMC Knowledge Upload Centre / AMC admin | CL-6 / CL-8 area | CS2 sign-off after knowledge upload centre wave delivers verified equivalent | File confirmed present. Knowledge migration planned for CL-6 (content) and CL-8 area (upload UI). AIMC has `ai_knowledge` table (migration 003). Target: AIMC knowledge admin UI not yet built. |
| DEP-010 | Knowledge Upload UI | `apps/maturion-maturity-legacy/src/pages/MaturionUploads.tsx` | `ACTIVE` | AIMC Knowledge Upload Centre / AMC admin | CL-6 / CL-8 area | CS2 sign-off after knowledge upload centre wave delivers verified equivalent | File confirmed present. Upload functionality maps to planned AIMC knowledge upload endpoint (CL-8 area). AIMC has `ai_knowledge` and `ai_knowledge_metadata` tables. Target UI not yet built. |
| DEP-001 | Watchdog Dashboard | `apps/maturion-maturity-legacy/src/pages/WatchdogDashboard.tsx` | `ACTIVE` | Foreman Office App — watchdog module | CL-13 | CS2 sign-off after CL-13 delivers verified watchdog module | File confirmed present. Foreman Office App does not exist yet. No equivalent live. AI confidence heatmap + watchdog control panel. |
| DEP-002 | Admin Health Checker | `apps/maturion-maturity-legacy/src/pages/AdminHealthChecker.tsx` | `ACTIVE` | Foreman Office App — health module | CL-13 | CS2 sign-off after CL-13 delivers verified health module | File confirmed present. Provides QA health checks against ARCHITECTURE.md True North and `qa/requirements.json`. Foreman Office App not yet built. |
| DEP-003 | Admin Workflow Dashboard | `apps/maturion-maturity-legacy/src/pages/AdminWorkflowDashboard.tsx` | `ACTIVE` | Foreman Office App — workflow module | CL-13 | CS2 sign-off after CL-13 delivers verified workflow module | File confirmed present. Foreman Office App not yet built. No equivalent live. |
| DEP-004 | Admin Config | `apps/maturion-maturity-legacy/src/pages/AdminConfig.tsx` | `ACTIVE` | Foreman Office App — config module | CL-13 | CS2 sign-off after CL-13 delivers verified config module | File confirmed present. Foreman Office App not yet built. No equivalent live. |
| DEP-005 | QA Dashboard (legacy) | `apps/maturion-maturity-legacy/src/pages/QADashboard.tsx` | `ACTIVE` | Foreman Office App — QA Overview panel | CL-13 (extended scope) | CS2 sign-off after CL-13 delivers verified QA Overview panel | Gap resolved (CL-3-D2, 2026-03-01). Mapped to CL-13 extended scope — QA Overview panel in Foreman Office App. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| DEP-006 | Unified QA Dashboard | `apps/maturion-maturity-legacy/src/pages/UnifiedQADashboard.tsx` | `ACTIVE` | Foreman Office App — Unified QA Signal Aggregation view | CL-13 (extended scope) | CS2 sign-off after CL-13 delivers verified Unified QA Signal Aggregation view consuming ≥2 signal sources | Gap resolved (CL-3-D2, 2026-03-01). Mapped to CL-13 extended scope — Unified QA Signal Aggregation view in Foreman Office App. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| DEP-007 | QA Test Dashboard | `apps/maturion-maturity-legacy/src/pages/QATestDashboard.tsx` | `ACTIVE` | Foreman Office App — health module (extended: test results sub-view) | CL-13 (extended scope) | CS2 sign-off after CL-13 health module explicitly delivers test results sub-view showing test execution history and status | Gap resolved (CL-3-D2, 2026-03-01). Mapped to CL-13 extended scope — health module extended to include test results sub-view in Foreman Office App. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| DEP-008 | Data Sources Management | `apps/maturion-maturity-legacy/src/pages/DataSourcesManagement.tsx` | `ACTIVE` | AIMC data source registry (ai_data_sources table + Edge Functions) | CL-3.5 (new wave: AIMC Data Sources Registry) | CS2 sign-off after CL-3.5 delivers: ai_data_sources migration with RLS, all 4 Edge Functions migrated, admin UI/panel, 100% GREEN test gate | Gap resolved (CL-3-D2, 2026-03-01). New wave CL-3.5 defined. Requires: new Supabase migration (ai_data_sources), 4 Edge Functions migrated. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| DEP-009 | Knowledge Base UI | `apps/maturion-maturity-legacy/src/pages/MaturionKnowledgeBase.tsx` | `ACTIVE` | AIMC Knowledge Upload Centre / Foreman App admin | CL-6 / CL-8 area | CS2 sign-off after knowledge upload centre wave delivers verified equivalent | File confirmed present. Knowledge migration planned for CL-6 (content) and CL-8 area (upload UI). AIMC has `ai_knowledge` table (migration 003). Target: AIMC knowledge admin UI not yet built. |
| DEP-010 | Knowledge Upload UI | `apps/maturion-maturity-legacy/src/pages/MaturionUploads.tsx` | `ACTIVE` | AIMC Knowledge Upload Centre / Foreman App admin | CL-6 / CL-8 area | CS2 sign-off after knowledge upload centre wave delivers verified equivalent | File confirmed present. Upload functionality maps to planned AIMC knowledge upload endpoint (CL-8 area). AIMC has `ai_knowledge` and `ai_knowledge_metadata` tables. Target UI not yet built. |
| DEP-011 | Maturion Agent Persona | `apps/maturion-maturity-legacy/src/agents/maturion/prompts/system.md` | `ACTIVE` | `packages/ai-centre/src/agents/` | CL-1 | CS2 sign-off after CL-1 delivers verified persona migration with parity check | File confirmed present (`system.md`). AIMC agents directory has 8 agents (risk-advisor, mat-advisor, pit-advisor, xdetect-advisor, isms-navigator, maturity-roadmap-advisor, incident-intelligence-advisor, course-crafter-advisor) — no Maturion persona present. Migration not yet started. |
| DEP-012 | Legacy Supabase Project `dmhlxhatogrrrvuruayv` | External — `apps/maturion-maturity-legacy/src/integrations/supabase/client.ts` | `ACTIVE` | AIMC Supabase project (`packages/ai-centre/supabase/`) | CL-6 | CS2 explicit authorisation required before decommission (per execution plan CP-6) | External project. Confirmed actively referenced in `client.ts` (`SUPABASE_URL = "https://dmhlxhatogrrrvuruayv.supabase.co"`). Also referenced in `requeue-pending-document` Edge Function. AIMC Supabase project has 6 migrations (memory, telemetry, knowledge, episodic memory, feedback, knowledge metadata). Decommission requires verified row count match post-migration (CL-6). |

---

## 4. Gap Register

> **Definition**: Components with no confirmed live equivalent AND no specific execution plan wave
> that covers their migration or replacement.

> **CL-3-D2 Update (2026-03-01)**: All four gap items below have been formally resolved by
> Foreman planning decisions recorded in `LKIAC_CL3_D2_GAP_RESOLUTION.md`. Each now has a
> confirmed target equivalent, assigned wave, and acceptance criterion.

| Gap ID | Component | DEP Ref | Gap Description | Recommended Next Action |
|--------|-----------|---------|-----------------|------------------------|
| GAP-001 | QA Dashboard (legacy) | DEP-005 | No target equivalent defined. No CL wave planned. The legacy QA dashboard functionality has no home in AMC (App Management Centre) or AIMC. | Create GitHub issue: define whether QA dashboard capabilities belong in AMC (new module) or AIMC admin panel. Assign to a CL wave. |
| GAP-002 | Unified QA Dashboard | DEP-006 | No target equivalent defined. No CL wave planned. Unified view combines multiple QA signal sources — no architectural decision made on where this belongs in the new platform. | Create GitHub issue: define target architecture (AMC unified QA module vs. AIMC monitoring panel). Assign to a CL wave. |
| GAP-003 | QA Test Dashboard | DEP-007 | No target equivalent defined. No CL wave planned. Test execution and results display — overlaps with AMC health module but no explicit mapping confirmed. | Create GitHub issue: clarify overlap with DEP-002 (Admin Health Checker → CL-13 health module). If covered by CL-13, update DEP-007 mapping. If separate, define new module and wave. |
| GAP-004 | Data Sources Management | DEP-008 | AIMC data source registry named as target but no `data_sources` table exists in AIMC Supabase migrations. No specific CL wave covers this migration. 4 legacy Edge Functions active. | Create GitHub issue: design AIMC data source registry schema, plan Edge Function migration, assign to a CL wave before CL-15. |
| Gap ID | Component | DEP Ref | Gap Description | Status | Resolving Wave | Resolution |
|--------|-----------|---------|-----------------|--------|----------------|------------|
| GAP-001 | QA Dashboard (legacy) | DEP-005 | No target equivalent defined. No CL wave planned. The legacy QA dashboard functionality has no home in Foreman Office App or AIMC. | **RESOLVED** | CL-13 (extended scope) | Resolved CL-3-D2 (2026-03-01). Mapped to Foreman Office App — QA Overview panel. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| GAP-002 | Unified QA Dashboard | DEP-006 | No target equivalent defined. No CL wave planned. Unified view combines multiple QA signal sources — no architectural decision made on where this belongs in the new platform. | **RESOLVED** | CL-13 (extended scope) | Resolved CL-3-D2 (2026-03-01). Mapped to Foreman Office App — Unified QA Signal Aggregation view. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| GAP-003 | QA Test Dashboard | DEP-007 | No target equivalent defined. No CL wave planned. Test execution and results display — overlaps with Foreman Office App health module but no explicit mapping confirmed. | **RESOLVED** | CL-13 (extended scope) | Resolved CL-3-D2 (2026-03-01). Confirmed overlap with DEP-002. Mapped to CL-13 health module (extended: test results sub-view). See LKIAC_CL3_D2_GAP_RESOLUTION.md. |
| GAP-004 | Data Sources Management | DEP-008 | AIMC data source registry named as target but no `data_sources` table exists in AIMC Supabase migrations. No specific CL wave covers this migration. 4 legacy Edge Functions active. | **RESOLVED** | CL-3.5 (new wave) | Resolved CL-3-D2 (2026-03-01). New wave CL-3.5 defined: ai_data_sources migration + 4 Edge Functions + admin UI. See LKIAC_CL3_D2_GAP_RESOLUTION.md. |

### 4.1 Gap Summary

| Metric | Count |
|--------|-------|
| Total components in register | 12 |
| Components with confirmed planned equivalent (ACTIVE, wave assigned) | 12 (all DEP-001–012; GAP-001–004 resolved CL-3-D2) |
| Gap items (no confirmed equivalent or wave) | 0 (all resolved — see above) |
| Gap items resolved (CL-3-D2, 2026-03-01) | 4 (GAP-001 → CL-13; GAP-002 → CL-13; GAP-003 → CL-13; GAP-004 → CL-3.5) |
| Components ready for decommission (SUPERSEDED) | 0 |
| Components decommissioned | 0 |

---

## 5. Decommission Gate Requirements

No component may be moved from `ACTIVE` or `PARALLEL-RUN` to `SUPERSEDED` or `DECOMMISSIONED`
without ALL of the following:

1. **Equivalent live and validated**: The target AMC (App Management Centre) module or AIMC equivalent
   must be deployed and passing its GREEN gate tests.
2. **Data migration verified**: All data, configuration, and knowledge assets must be confirmed
   migrated (row count match or equivalent verification).
3. **CS2 sign-off**: Explicit CS2 authorisation per the checkpoint recorded in this register
   (see §6 CS2 Sign-off Gate).
4. **Register update**: This document must be updated to `SUPERSEDED` status before any code
   removal begins.
5. **CL-15 wave gate**: The CL-15 wave entry criteria require this register to show all
   components as `SUPERSEDED` before decommission is authorised.

---

## 6. CS2 Sign-off Gate (CP-3)

**Gate ID**: CP-3  
**Source**: LKIAC-001 §5 Wave 5 gate; CL-3 exit criteria  
**Type**: Governance checkpoint — CS2 review and sign-off

### CP-3 Checklist

Before this register is considered closed and CL-3 is complete, CS2 must confirm:

- [ ] All 12 components have been reviewed and assigned a status
- [ ] All gap items have been identified (GAP-001 through GAP-004)
- [ ] Gap items have corresponding GitHub issues created (CL-3-D2) — **PARTIAL**: Gap resolution DECISIONS recorded in `LKIAC_CL3_D2_GAP_RESOLUTION.md` v1.0.0 (2026-03-01); engineering follow-on issue creation pending CS2/human action (Copilot cannot open new issues)
- Gap resolution decisions recorded in LKIAC_CL3_D2_GAP_RESOLUTION.md v1.0.0
- [ ] The register accurately reflects the current state of the codebase as at 2026-03-01
- [ ] CL-15 dependency satisfied: this register is confirmed as the authoritative decommission gate

### CP-3 Sign-off Block

```
CS2 SIGN-OFF (CP-3)
===================
Reviewed by:  [ CS2 / Johan Ras — @APGI-cmy ]
Date:         [                              ]
Decision:     [ APPROVED / APPROVED WITH CONDITIONS / REJECTED ]
Conditions:   [                              ]
Notes:        [                              ]

Signature:    [                              ]
```

> ⚠️ **This register is NOT closed until CS2 completes the sign-off block above.**
> CL-3 exit criteria are not satisfied until CP-3 is signed.

---

## 7. Register Maintenance

**Next update trigger**: Any of the following events requires an update to this register:

- A gap item receives a confirmed target and wave assignment → update DEP status and remove from Gap Register
- A planned equivalent is delivered and validated → transition DEP status from `ACTIVE` → `PARALLEL-RUN` → `SUPERSEDED`
- A new legacy component is identified that was not in LKIAC-001 §6 → add row and escalate to CS2
- CL-15 begins: all `SUPERSEDED` items must be confirmed by CS2 before code removal

**Maintenance Agent**: governance-liaison-isms-agent  
**Update Authority**: CS2 sign-off required for any status transition to `SUPERSEDED` or `DECOMMISSIONED`

---

## 8. Audit Trail

| Date | Action | Agent | Notes |
|------|--------|-------|-------|
| 2026-03-01 | Register created — initial assessment complete | governance-liaison-isms-agent | Wave CL-3 deliverable CL-3-D1. All 12 components assessed. 4 gap items identified. |
| 2026-03-01 | Gap resolution decisions recorded (CL-3-D2) — GAP-001–003 assigned to CL-13; GAP-004 assigned to new wave CL-3.5 | foreman-v2-agent (via governance-liaison-isms-agent, session-079) | See LKIAC_CL3_D2_GAP_RESOLUTION.md v1.0.0 |
| — | CP-3 CS2 sign-off | CS2 | Pending |

---

**Authority**: LKIAC-001 §6; AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md Wave CL-3  
**Feeds**: CL-3-D2 (gap issues), CL-15 (decommission wave)  
**Version**: v1.1.0 | **Date**: 2026-03-01
