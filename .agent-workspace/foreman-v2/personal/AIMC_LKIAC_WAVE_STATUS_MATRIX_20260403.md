# AIMC + LKIAC Wave Status Matrix

**Document Type**: Foreman Planning Output — Wave Status Analysis  
**Version**: 1.0.0  
**Date**: 2026-04-04  
**Produced By**: foreman-v2-agent v6.2.0 (session aimc-wave-status-20260403)  
**Source Authority**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.8.0  
**Triggering Issue**: [maturion-isms#1209](https://github.com/APGI-cmy/maturion-isms/issues/1209)  
**Branch**: copilot/confirm-outstanding-aimc-lkiac-waves  

---

## 1. Executive Status Summary

| Metric | Value |
|--------|-------|
| Total waves | 17 (CL-0 through CL-15, including CL-3.5) |
| COMPLETE | 7 |
| IN PROGRESS | 1 |
| PENDING — UNBLOCKED | 3 |
| PENDING — BLOCKED | 6 |
| As of date | 2026-04-04 |

---

## 2. Full Wave Status Matrix

| Wave | Title | Programme | Status | CP Gate | Blockers / Outstanding Items |
|------|-------|-----------|--------|---------|------------------------------|
| CL-0 | Governance Foundation | Both | ✅ COMPLETE (2026-03-01) | CP-0: N/A | None |
| CL-1 | LKIAC W1: Maturion Persona Migration | LKIAC | ✅ COMPLETE (2026-03-01) | CP-1: CLOSED (CS2 2026-04-03) | None |
| CL-2 | LKIAC W2: Legacy Knowledge Inventory | LKIAC | ✅ COMPLETE (2026-04-03) | CP-2: CLOSED (CS2 2026-04-03) | None |
| CL-3 | LKIAC W5: Deprecation Register Activation | LKIAC | ✅ COMPLETE (2026-04-03) | CP-3: CLOSED (CS2 2026-04-03) | None |
| CL-3.5 | AIMC Data Sources Registry | AIMC | ✅ COMPLETE (2026-03-01) | CP-3.5: CLOSED (CS2 2026-04-03) | DEP-008 status updated to PARALLEL-RUN |
| CL-4 | AIMC Audit Phase A — Foundation Verification | AIMC Audit | ✅ COMPLETE (2026-04-03) | CP-4: CLOSED (CS2 2026-04-03) | None |
| CL-5 | Knowledge Upload Centre Specification | AIMC | ✅ COMPLETE (2026-03-19) | CP-5: N/A (spec merged) | None |
| CL-6 | LKIAC W3: Knowledge Re-ingestion | LKIAC | ⏳ PENDING — UNBLOCKED | CP-6: Open | Wave-start AUTHORISED (CP-2 closure 2026-04-03); entry gates CL-2 ✅ + CL-4 ✅ met |
| CL-7 | LKIAC-L3: PersonaLoader Improvements | LKIAC | ⏳ PENDING — UNBLOCKED | CP-7: Open | Entry gate CL-4 ✅ met; no CS2 wave-start issued yet |
| CL-8 | LKIAC W4: Domain Specialist Knowledge Routing | LKIAC | 🔒 PENDING — BLOCKED | CP-8: Open | Blocked on CL-6 (knowledge base not yet migrated) and CL-7 (PersonaLoader not yet improved) |
| CL-9 | AIMC Audit Phase B — Persona Domain Review | AIMC Audit | 🔒 PENDING — BLOCKED | CP-9: Open | Blocked on CL-7 and CL-8; 9 domain specialist reviews outstanding |
| CL-10 | LKIAC-L4: Routing Governance CI Enforcement | LKIAC | ⏳ PENDING — UNBLOCKED | CP-10: Open | Entry gate CL-4 ✅ met; no CS2 wave-start issued yet |
| CL-11 | Knowledge Upload Centre + ARC Operationalisation | AIMC Audit Phase D | 🔄 IN PROGRESS (2026-03-20) | CP-11: Open | D1/D2/D5/D6 COMPLETE; D3 (GAP-008: ARC approval endpoint 403 gate) and D4 (GAP-009: episodic write path) outstanding; CP-11 blocks CL-12 |
| CL-12 | AIMC Audit Phase C — Module Integration (7 Modules) | AIMC Audit | 🔒 PENDING — BLOCKED | CP-12a/b/c: Open | Blocked on CL-9 (all persona reviews) and CL-11 (CP-11 CS2 approval); sub-waves CL-12a/b/c require separate CS2 wave-starts |
| CL-13 | LKIAC W6: AMC API Contract Definition | LKIAC | 🔒 PENDING — BLOCKED | CP-13: Open | Blocked on CL-8 (routing must be live before AMC contract is defined); also D5/D6/D7 (QA modules) require RED gate from qa-builder |
| CL-14 | AIMC Governance Certification + AAWP Update | AIMC Audit | 🔒 PENDING — BLOCKED | CP-14: Open | Blocked on CL-12 (all 7 modules wired), CL-10, and CL-7 |
| CL-15 | LKIAC W7: Legacy Component Decommission + Final Audit | LKIAC + AIMC | 🔒 PENDING — BLOCKED | CP-15: Open | Blocked on CL-3 ✅, CL-13, CL-14; requires AMC parity for all SUPERSEDED components |

---

## 3. Outstanding Items per Non-COMPLETE Wave

### CL-6 — LKIAC W3: Knowledge Re-ingestion

**Status**: PENDING UNBLOCKED — wave-start AUTHORISED  
**Responsible Agents**: `qa-builder` (CL-6-D1 RED gate), `api-builder` (CL-6-D2 migration script, CL-6-D4 report), `qa-builder` (CL-6-D3 semantic validation)

| Deliverable | Status | Required Action |
|-------------|--------|----------------|
| CL-6-D1: RED gate tests (migration validation) | PENDING | qa-builder must produce RED gate before api-builder begins |
| CL-6-D2: Migration script (TypeScript) | PENDING | api-builder after RED gate |
| CL-6-D3: Semantic search validation (10 queries/domain) | PENDING | qa-builder after migration |
| CL-6-D4: Migration report | PENDING | api-builder after migration |

**CS2 action required**: Post wave-start issue using CL-6 template (produced as D-6 in CEP v1.8.0 session at `.agent-admin/templates/cl6-wave-start-issue-20260403.md`).

---

### CL-7 — LKIAC-L3: PersonaLoader Improvements

**Status**: PENDING UNBLOCKED  
**Responsible Agents**: `qa-builder` (CL-7-D1, CL-7-D2 RED gate), `api-builder` (CL-7-D3), `integration-builder` (CL-7-D4, CL-7-D5)

| Deliverable | Status | Required Action |
|-------------|--------|----------------|
| CL-7-D1: RED gate — `PersonaValidationError` test | PENDING | qa-builder must produce RED gate |
| CL-7-D2: RED gate — persona registry sync CI integration test | PENDING | qa-builder must produce RED gate |
| CL-7-D3: `PersonaValidationError` + runtime YAML validation in `PersonaLoader.ts` | PENDING | api-builder after RED gate |
| CL-7-D4: CI check — persona registry sync | PENDING | integration-builder |
| CL-7-D5: Scheduled workflow — overdue quarterly persona reviews | PENDING | integration-builder |

**CS2 action required**: Issue CS2 wave-start authorisation for CL-7.

---

### CL-8 — LKIAC W4: Domain Specialist Knowledge Routing

**Status**: PENDING BLOCKED (blocked on CL-6 and CL-7)  
**Responsible Agents**: `qa-builder` (CL-8-D1, CL-8-D3), `integration-builder` (CL-8-D2)

| Deliverable | Status | Blocked On |
|-------------|--------|-----------|
| CL-8-D1: RED gate tests — domain-filtered specialist routing | PENDING | CL-6, CL-7 |
| CL-8-D2: Updated domain specialist routing (`source`-filtered) | PENDING | CL-6, CL-7 |
| CL-8-D3: Integration test set — 10 queries/domain | PENDING | CL-6, CL-7 |

---

### CL-9 — AIMC Audit Phase B: Persona Domain Accuracy Review

**Status**: PENDING BLOCKED (blocked on CL-7 and CL-8)  
**Responsible Agents**: `mat-specialist` (T-E-001, T-E-006, T-E-007, T-E-009), `pit-specialist` (T-E-002, T-E-005), `risk-platform-agent` (T-E-003, T-E-004), `maturity-scoring-agent` (T-E-008)

All 9 persona domain accuracy reviews outstanding. Requires CL-7 (PersonaLoader validated) and CL-8 (routing live) before meaningful review can occur.

---

### CL-10 — LKIAC-L4: Routing Governance CI Enforcement

**Status**: PENDING UNBLOCKED  
**Responsible Agents**: `qa-builder` (CL-10-D1), `integration-builder` (CL-10-D2, CL-10-D3)

| Deliverable | Status | Required Action |
|-------------|--------|----------------|
| CL-10-D1: RED gate test — CI check integration test | PENDING | qa-builder |
| CL-10-D2: CI merge gate — detect direct provider imports in `modules/` and `apps/` | PENDING | integration-builder after RED gate |
| CL-10-D3: CI merge gate — detect `expect(true).toBe(true)` stub patterns | PENDING | integration-builder after RED gate |

**CS2 action required**: Issue CS2 wave-start authorisation for CL-10.

---

### CL-11 — Knowledge Upload Centre + ARC Operationalisation

**Status**: IN PROGRESS — CL-11-D3 and CL-11-D4 outstanding; CP-11 required before CL-12  
**Responsible Agents**: `qa-builder` (CL-11-D3, CL-11-D4), `api-builder` (if remediation required post-audit)

| Deliverable | Status | Required Action |
|-------------|--------|----------------|
| CL-11-D1: RED gate tests (T-KU-001–T-KU-012) | ✅ COMPLETE (DCKIS-QA-RED) | — |
| CL-11-D2: Upload endpoint + MAT UI components | ✅ COMPLETE (DCKIS-IMPL-002, PR #1182) | — |
| CL-11-D3: ARC approval endpoint audit (GAP-008) — 403 on unauthorised | ⏳ PENDING | qa-builder must execute T-G-002 audit of `POST /api/ai/feedback/approve` |
| CL-11-D4: Episodic memory write path audit (GAP-009) — `ai_episodic_events` confirmed | ⏳ PENDING | qa-builder must verify `EpisodicMemoryAdapter` write path in production flow |
| CL-11-D5: Schema audit T-D-001 | ✅ COMPLETE (DCKIS-SCH-001) | — |
| CL-11-D6: ARC protocol review T-D-002/T-D-005 | ✅ COMPLETE (DCKIS-GOV-001) | — |

**CP-11 requirement**: CS2 approval of upload endpoint before CL-12 module integration begins. CL-11-D3 and CL-11-D4 must be resolved first.

---

### CL-12 — AIMC Audit Phase C: Module Integration (7 Modules)

**Status**: PENDING BLOCKED (blocked on CL-9 and CP-11)  
Three sub-waves (CL-12a, CL-12b, CL-12c) each require separate CS2 wave-start authorisation.  
All 21 deliverables across CL-12a/b/c outstanding.

---

### CL-13 — LKIAC W6: AMC API Contract Definition

**Status**: PENDING BLOCKED (blocked on CL-8)  
All 7 deliverables outstanding. CL-13-D5/D6/D7 (QA module deliverables) also require RED gate from `qa-builder` before `ui-builder` and `api-builder` begin.

---

### CL-14 — AIMC Governance Certification + AAWP Update

**Status**: PENDING BLOCKED (blocked on CL-12, CL-10, CL-7)  
CL-14-D1 (Governance Certification update) and CL-14-D2 (AAWP v0.4.0) outstanding.

---

### CL-15 — Legacy Component Decommission + Final Audit Closure

**Status**: PENDING BLOCKED (blocked on CL-13 and CL-14)  
All decommission actions, process tests, metrics baseline, and effectiveness report outstanding.  
⚠️ Each individual decommission action requires explicit CS2 authorisation.

---

## 4. MMM / MAT / Roadmap Sequencing Risk Analysis

### 4.1 MMM (Maturion Maturity Module) Integration Risks

#### RISK-MMM-001: CL-12c Deep Dependency Chain [CRITICAL]

**Risk**: MMM AIMC wiring (CL-12c-D6) is at the end of a long, sequential dependency chain:  
CL-4 ✅ → CL-6 → CL-7 → CL-8 → CL-9 → CL-11 (CP-11) → CL-12c  

Minimum 6 additional waves must complete before MMM can be wired to AIMC. With current CL-6 unstarted and CL-11 still open, the CL-12c wave may be many months away.

**Impact**: MMM cannot make authorised use of the AIMC (`packages/ai-centre/`) AI gateway until CL-12c is complete. Any MMM-level AI features built before CL-12c are either not AIMC-integrated (architecture violation) or must be treated as pre-wiring stubs pending formal integration.

**Mitigation**: CS2 to determine whether MMM may proceed with stub/placeholder AI wiring during the CL-12c wait period, or whether MMM AI scope is deferred until CL-12c completes. This must be an explicit CS2 decision documented in the CEP.

---

#### RISK-MMM-002: CL-12c Sub-Wave Separate Authorisation Required [HIGH]

**Risk**: CL-12c (which includes MMM wiring) requires a **separate CS2 wave-start authorisation** from CL-12a and CL-12b. The CL-12c wave-start issue has not been drafted or posted.

**Impact**: Even after CL-9 and CL-11 are resolved, CL-12c cannot begin until CS2 posts the wave-start authorisation issue.

**Mitigation**: Foreman should draft the CL-12c wave-start issue template now so CS2 can post it when the entry criteria are met.

---

#### RISK-MMM-003: MMM App Description Scope vs. AIMC Wiring Gap [MEDIUM]

**Risk**: The recently merged `MMM_app_description.md` v0.2.0 (PR #1214) references AIMC integration as a core architectural requirement. However, CL-12c (the formal AIMC wiring wave for MMM) has not started. There is a growing gap between what the app description declares and what is actually implemented.

**Impact**: Any developer building MMM features without understanding this gap may implement direct AI provider calls in violation of GRS-016 (enforced by CL-10-D2 once that CI check is live).

**Mitigation**: Ensure CL-10 is prioritised to prevent GRS-016 violations from entering MMM code.

---

### 4.2 MAT Module Integration Risks

#### RISK-MAT-001: MAT Wave 13 Scope Conflict with Prior Wave 13 [HIGH]

**Risk**: The CEP v1.8.0 programme clearance IAA pre-brief identified a **HARD BLOCKER (SB-001)**: T-W13-* test IDs (T-W13-SCH-1–4, T-W13-AUTH-1–4, T-W13-WIRE-1–8, T-W13-E2E-1–5, T-W13-CI-1–3) match test IDs from a prior Wave 13 execution (sessions 084–096, 2026-03-13). An IAA PASS token exists for the prior Wave 13 (`iaa-token-session-wave13-R3-20260313-PASS.md`).

**Impact**: If the CS2-authorised MAT Wave 13 (2026-04-03) re-uses the same test IDs without clarifying the relationship to the prior Wave 13, the new wave execution is architecturally ambiguous. QA work may be duplicated or silently superseded.

**Mitigation**: Foreman must issue a scope clarification to the qa-builder/mat-specialist/ui-builder team before MAT Wave 13 QA work begins. The CEP PREHANDOVER for the programme clearance wave must document whether MAT Wave 13 is: (a) genuinely new scope, (b) continuation of prior Wave 13, or (c) superseding prior Wave 13. This is a **prerequisite before any MAT Wave 13 RED gate work begins.**

---

#### RISK-MAT-002: CL-11 D3/D4 Gap Affects MAT Knowledge Upload Flow [HIGH]

**Risk**: CL-11-D3 (GAP-008: ARC approval endpoint 403 enforcement) and CL-11-D4 (GAP-009: episodic write path confirmation) are outstanding. The MAT Knowledge Upload Centre (`KnowledgeUploadPanel.tsx`, `process-document-v2`) is fully implemented and live (DCKIS-IMPL-002), but the governance audit of the ARC approval flow and episodic memory write path has not been completed.

**Impact**: MAT's knowledge upload feature is deployed but the ARC authorisation audit (CP-11 prerequisite) is not closed. This means CP-11 cannot be issued, which blocks CL-12 module integration. Any further MAT waves that depend on knowledge-routed AI responses (CL-8, CL-9 outcomes) cannot proceed.

**Mitigation**: Prioritise CL-11-D3 and CL-11-D4 as the immediate unblocking action. These are audit tasks (not implementation) — `qa-builder` can execute them in a focused single-session wave.

---

#### RISK-MAT-003: MAT Wave 13 Architecture Freeze — No New Features [MEDIUM]

**Risk**: The CEP v1.8.0 programme clearance declared "Architecture for Wave 13 is FROZEN (no new features — wiring fixes only)." If any Wave 13 deliverable is interpreted as adding new functionality rather than fixing wiring, the wave violates the architecture freeze and would require CS2 authorisation for the scope expansion.

**Impact**: Wave 13 work may be rejected at the merge gate if scope creep is detected.

**Mitigation**: Foreman must ensure the Wave 13 task delegation explicitly frames the scope as "wiring fixes only" with no new feature scope. The issue body for each sub-agent commission must include the architecture freeze declaration.

---

### 4.3 Maturity Roadmap Integration Risks

#### RISK-ROADMAP-001: CL-12c Re-scope Removed Roadmap from AIMC Wiring Plan [MEDIUM]

**Risk**: CEP Amendment v1.8.0 re-scoped CL-12c from "ISMS Navigator + Incident Intelligence + Maturity Roadmap" to "ISMS Navigator + Incident Intelligence + MMM (Maturion Maturity Module)." The Maturity Roadmap module AIMC wiring has been removed from the CL-12 scope entirely.

**Impact**: The Maturity Roadmap module has no authorised AIMC integration wave defined. If Roadmap AI features are needed, a new CL-12d or equivalent wave must be defined and authorised by CS2.

**Mitigation**: CS2 to confirm whether Roadmap AIMC wiring is deferred indefinitely or should be added to the execution plan as a new CL-12d wave. Foreman to note this as a planning gap.

---

#### RISK-ROADMAP-002: ROADMAP_APP_DESCRIPTION_v3.0.md Not Yet Revised [LOW]

**Risk**: Wave `markdown-rewrite-remediation` (Issue #1184, branch `copilot/remediation-list-markdown-rewrite`) was declared in `wave-current-tasks.md` (historical section). The Roadmap description revision was delegated to `mat-specialist` but its current merge status is unclear. If this wave was not merged, the Roadmap app description remains in a prior version.

**Impact**: No immediate delivery risk but may cause confusion if Roadmap development proceeds against an outdated app description.

**Mitigation**: Verify merge status of `copilot/remediation-list-markdown-rewrite` branch. If not merged, determine whether it was superseded or needs to be merged before Roadmap development proceeds.

---

## 5. Actionable Recommendations for CS2

### Recommendation 1 (IMMEDIATE): Close CL-11 D3 and D4 — Then Issue CP-11 [CRITICAL]

**What**: Commission `qa-builder` to execute CL-11-D3 (T-G-002 audit: `POST /api/ai/feedback/approve` returns 403 on unauthorised caller) and CL-11-D4 (T-G-003: `ai_episodic_events` write path confirmed in production flow). Once both audit reports are committed and reviewed, CS2 can issue CP-11 approval to unblock CL-12 module integration.

**Why critical**: CP-11 is the gating checkpoint for CL-12. Without it, all 7-module AIMC integration waves (CL-12a, CL-12b, CL-12c) cannot begin. This is the single highest-impact unblocking action.

**Assigned to**: `qa-builder` (CL-11-D3, CL-11-D4) → CS2 review → CP-11 closure  
**Estimated wave type**: Single-session audit — no code changes required  
**Upstream issue required**: CS2 to post wave-start issue for CL-11 completion

---

### Recommendation 2 (IMMEDIATE): Post CL-6 Wave-Start Issue and Start Knowledge Migration [HIGH]

**What**: CL-6 wave-start was formally AUTHORISED by CS2 at the CP-2 closure (2026-04-03). A wave-start issue template was produced in the CEP clearance session at `.agent-admin/templates/cl6-wave-start-issue-20260403.md`. CS2 must post this issue to initiate CL-6 formally.

**Why high**: CL-6 is the critical path for CL-8 (domain routing) and CL-9 (persona domain reviews). Until knowledge is migrated into `ai_knowledge`, domain-specialist routing cannot be activated and Phase B audit cannot be performed accurately. Starting CL-6 now is the most impactful step towards unblocking the CL-8 → CL-9 → CL-12 chain.

**Assigned to**: `qa-builder` (RED gate) → `api-builder` (migration script + report)  
**CS2 action**: Post CL-6 wave-start issue from template

---

### Recommendation 3 (NEAR-TERM): Start CL-7 and CL-10 in Parallel with CL-6 [HIGH]

**What**: Both CL-7 (PersonaLoader Improvements) and CL-10 (Routing Governance CI Enforcement) have their entry criteria fully met (CL-4 ✅). They can run in parallel with CL-6 as independent parallel tracks. CS2 should post wave-start issues for both so they complete while CL-6 migration is running.

**Why high**: 
- CL-7 is required before CL-8 (domain routing) can begin. PersonaLoader improvements must be in place before domain specialist personas can be reliably loaded for routing.
- CL-10 is required before CL-14 and is a governance enforcement wave that protects all future module integration work (CL-12) from direct provider import violations. Starting it now ensures the CI gate is live before any module wiring begins.

**Assigned to**: 
- CL-7: `qa-builder` (RED gate) → `api-builder` + `integration-builder`
- CL-10: `qa-builder` (RED gate) → `integration-builder`
**CS2 action**: Post wave-start issues for CL-7 and CL-10

---

### Recommendation 4 (PREREQUISITE FOR MAT WAVE 13): Resolve Wave 13 Scope Conflict Before QA Work Begins [HIGH]

**What**: The CEP pre-brief identified a HARD BLOCKER (SB-001): prior Wave 13 execution artifacts exist with matching T-W13-* test IDs. Before MAT Wave 13 RED gate work begins, Foreman must publish a scope clarification document that answers whether the new Wave 13 is: (a) new scope, (b) continuation, or (c) superseding the prior execution. This must be committed to `.agent-workspace/foreman-v2/personal/` before any qa-builder RED gate delegation.

**Why critical for Wave 13**: Without this clarification, qa-builder cannot determine whether to create new test files or modify/extend existing ones. IAA will reject the PR if the PREHANDOVER proof doesn't address SB-001.

**CS2 action**: Confirm to Foreman the nature of the MAT Wave 13 re-commission (option a/b/c from CEP pre-brief §SB-001 analysis)

---

## 6. Safe Action Boundary (as of 2026-04-04)

**CS2 MAY safely authorise any of the following without additional planning:**

| Action | Entry Gates Met | Notes |
|--------|----------------|-------|
| Post CL-6 wave-start issue | ✅ Template at `.agent-admin/templates/cl6-wave-start-issue-20260403.md` | Wave-start already AUTHORISED |
| Post CL-7 wave-start issue | ✅ CL-4 COMPLETE | qa-builder RED gate first |
| Post CL-10 wave-start issue | ✅ CL-4 COMPLETE | qa-builder RED gate first |
| Commission qa-builder for CL-11-D3/D4 | ✅ In progress wave | Single-session audit |
| Post MAT Wave 13 RED gate delegation (after scope clarification) | ✅ CS2 authorised 2026-04-03 | SB-001 must be resolved first |

**CS2 MUST NOT authorise the following without first meeting listed preconditions:**

| Action | Precondition |
|--------|-------------|
| CL-8 wave-start | CL-6 COMPLETE + CL-7 COMPLETE |
| CL-9 wave-start | CL-7 COMPLETE + CL-8 COMPLETE |
| CL-11 CP-11 closure | CL-11-D3 and CL-11-D4 audit reports accepted |
| CL-12 any sub-wave start | CL-9 COMPLETE + CP-11 CLOSED |
| CL-12c MMM wiring | CL-12 entry criteria met + CP-12c issued |
| CL-13 wave-start | CL-8 COMPLETE |
| CL-14 wave-start | CL-12 COMPLETE + CL-10 COMPLETE + CL-7 COMPLETE |
| CL-15 any decommission | CL-13 COMPLETE + CL-14 COMPLETE; each action requires individual CS2 authorisation |
| MAT Wave 13 RED gate work | Wave 13 scope conflict (SB-001) resolved by Foreman + CS2 |

---

## 7. Legacy Code Conflict Assessment for MMM Migration

| Legacy Component | DEP Register Entry | Current Status | Conflict Risk for MMM |
|-----------------|-------------------|----------------|----------------------|
| `apps/maturion-maturity-legacy/` AI routes | DEP-001 through DEP-007 | PARALLEL-RUN / SUPERSEDED per CL-3 | MEDIUM — any direct AI calls in legacy paths may conflict with GRS-016 enforcement (CL-10-D2) once CI check is live |
| `apps/maturion-maturity-legacy/` upload routes | DEP-008 | PARALLEL-RUN — schema delivered (CL-3.5) | LOW — `process-document-v2` (CL-11-D2) is the canonical upload path; legacy upload routes should be deprecated |
| `maturion-advisor` in legacy prompts | DEP-001 (L1) | SUPERSEDED (CL-1 migration complete) | LOW — persona migrated to `packages/ai-centre/agents/maturion-advisor.md`; legacy source still exists but is not the governed path |
| Legacy Supabase project `dmhlxhatogrrrvuruayv` | LKIAC-W2 inventory | Active — not yet decommissioned | HIGH — legacy knowledge embeddings not yet migrated to `ai_knowledge` (CL-6 pending); any MMM knowledge queries against legacy project are outside governed architecture |

---

## 8. Document Control

| Field | Value |
|-------|-------|
| Produced By | foreman-v2-agent v6.2.0 |
| Session | session-aimc-wave-status-20260403 |
| Triggering Issue | maturion-isms#1209 |
| Authority | CS2 (Johan Ras / @APGI-cmy) |
| Based On | `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.8.0 |
| Commitment | Governance planning output only — does NOT constitute wave-start authorisation for any wave |

*This document is a POLC Planning Output. It does NOT constitute a wave closure, merge gate release, or wave-start authorisation.*  
*Wave execution may NOT begin for any wave until CS2 has issued formal wave-start authorisation for that specific wave.*  
*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | 2026-04-04*
