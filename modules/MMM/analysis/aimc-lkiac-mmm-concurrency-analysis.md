# AIMC / LKIAC / Legacy Convergence — Concurrent Programme Analysis

**Document Type**: Foreman POLC Planning Output — Programme-State Analysis  
**Version**: 1.0.0  
**Date**: 2026-04-08  
**Produced By**: foreman-v2-agent v6.2.0 (session mmm-cpa-20260408)  
**Branch**: copilot/complete-concurrent-programme-analysis  
**Triggering Issue**: [maturion-isms#1303](https://github.com/APGI-cmy/maturion-isms/issues/1303)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**IAA Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-mmm-concurrent-programme-analysis-20260408.md`  
**IAA Trigger Category**: PRE_BUILD_STAGE_MODEL  

---

## 0. Executive Summary

This document answers the nine mandatory questions posed in issue #1303 and provides the complete programme-state analysis across:
- **AIMC** (AI Management Centre)
- **LKIAC** (Legacy Knowledge Integration and Architecture Consolidation)
- **MAT** terminal harvest / migration-closeout
- **Maturity Roadmap** migration-anchor / decommission
- **MMM** (Maturity Management Module) prebuild readiness

**Key Findings**:

1. **MMM prebuild Stages 2–7 can begin immediately and run concurrently with AIMC/LKIAC legacy work** — no AIMC or LKIAC wave must complete before MMM Stage 2 (UX Workflow & Wiring Spec) starts.
2. **AIMC/LKIAC CL-6, CL-7, and CL-10 are unblocked and require only CS2 wave-start authorisation** — these should be issued in parallel with MMM prebuild Stage 2 authorisation.
3. **MMM Stage 12 (Build) will use AI stubs** per CS2 Directive #1221; real AIMC wiring is deferred to the CL-12c wave, which runs after CL-9 + CL-11 completion.
4. **MAT closure requires CL-12c completion + CP-12 CS2 sign-off** — MAT migration work (Wave 13) runs in parallel with MMM prebuild stages.
5. **Maturity Roadmap survives as migration anchor only** — no new work authorised; formal decommission requires MMM parity confirmation.
6. **The concurrent execution model is: two tracks (Legacy Convergence + MMM Prebuild) running in parallel, converging at CL-12c (MMM/AIMC integration wave).**

---

## 1. Programme-State Analysis

### 1.1 AIMC (AI Management Centre) — Current State

**Source**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.9.0, `.agent-workspace/foreman-v2/personal/AIMC_LKIAC_WAVE_STATUS_MATRIX_20260403.md`

#### 1.1.1 Completed AIMC Waves

| Wave | Title | Completion | CP Status |
|------|-------|------------|-----------|
| CL-0 | Governance Foundation | 2026-03-01 | CP-0: N/A |
| CL-3.5 | AIMC Data Sources Registry | 2026-03-01 | CP-3.5: CLOSED (CS2 2026-04-03) |
| CL-4 | AIMC Audit Phase A — Foundation Verification | 2026-04-03 | CP-4: CLOSED (CS2 2026-04-03) |
| CL-5 | Knowledge Upload Centre Specification | 2026-03-19 | CP-5: N/A |
| CL-11 (partial) | Knowledge Upload Centre + ARC Operationalisation | Partial — 2026-03-20 | CP-11: OPEN |

**AIMC Audit Phase A verdict** (CL-4): 430+ tests GREEN, zero stubs, schema CI PASS, stub detection PASS. Foundation is solid.

#### 1.1.2 In-Progress AIMC Waves

| Wave | Title | Status | Outstanding |
|------|-------|--------|-------------|
| CL-11 | Knowledge Upload Centre + ARC Operationalisation | 🔄 IN PROGRESS | D3 (GAP-008: ARC approval endpoint 403 gate) and D4 (GAP-009: episodic write path) outstanding; CP-11 CS2 approval required |

**CL-11 detail**:
- CL-11-D1 (RED gate tests T-KU-001 through T-KU-012): ✅ COMPLETE — 12/12 GREEN
- CL-11-D2 (`process-document-v2` Edge Function + upload UI components): ✅ COMPLETE — PR #1182 merged
- CL-11-D5 (schema audit: `ai_knowledge` chunk metadata columns + RLS policies): ✅ COMPLETE
- CL-11-D6 (ARC protocol review governance documentation): ✅ COMPLETE
- CL-11-D3 (GAP-008: ARC approval endpoint 403 gate): ❌ OUTSTANDING
- CL-11-D4 (GAP-009: episodic write path for knowledge additions): ❌ OUTSTANDING
- **CP-11** (CS2 approval of complete CL-11): ❌ OPEN — blocks CL-12

#### 1.1.3 Pending Unblocked AIMC / LKIAC Waves

| Wave | Title | Unblocking Condition | CS2 Wave-Start |
|------|-------|---------------------|----------------|
| CL-6 | LKIAC W3: Knowledge Re-ingestion | Wave-start AUTHORISED (CP-2 closure 2026-04-03) | ✅ AUTHORISED — awaiting execution |
| CL-7 | LKIAC-L3: PersonaLoader Improvements | Entry gate CL-4 ✅ met | ❌ Not yet issued |
| CL-10 | LKIAC-L4: Routing Governance CI Enforcement | Entry gate CL-4 ✅ met | ❌ Not yet issued |

**CL-6 (Knowledge Re-ingestion)** — wave-start is authorised but not yet executed. Deliverables:
- CL-6-D1: RED gate tests (migration validation) — `qa-builder`
- CL-6-D2: Migration script (TypeScript) — `api-builder`
- CL-6-D3: Semantic search validation (10 queries/domain) — `qa-builder`
- CL-6-D4: Migration report — `api-builder`

**CL-7 (PersonaLoader Improvements)** — entry gates met, CS2 wave-start not yet issued. Deliverables:
- CL-7-D1/D2: RED gate tests — `qa-builder`
- CL-7-D3: `PersonaValidationError` + runtime YAML validation — `api-builder`
- CL-7-D4: CI check (persona registry sync) — `integration-builder`
- CL-7-D5: Scheduled workflow (overdue quarterly reviews) — `integration-builder`

**CL-10 (Routing Governance CI)** — entry gates met, CS2 wave-start not yet issued. Deliverables:
- CL-10-D1: Import governance CI check (GRS-016 enforcement)
- CL-10-D2: Sub-module routing CI check
- CL-10-D3: Stub detection CI check (`expect(true).toBe(true)` pattern detector)

#### 1.1.4 Blocked AIMC Waves

| Wave | Title | Hard Blockers |
|------|-------|--------------|
| CL-8 | LKIAC W4: Domain Specialist Knowledge Routing | CL-6 (knowledge base empty) + CL-7 (PersonaLoader unreliable) |
| CL-9 | AIMC Audit Phase B — Persona Domain Review | CL-7 (PersonaLoader validated) + CL-8 (routing live) |
| CL-12 | AIMC Audit Phase C — Module Integration | CL-9 (all 9 persona reviews) + CL-11 CP-11 CS2 approval |
| CL-13 | LKIAC W6: AMC API Contract | CL-8 (routing must be live) |
| CL-14 | AIMC Governance Certification + AAWP Update | CL-12 + CL-10 + CL-7 |
| CL-15 | Legacy Component Decommission + Final Audit | CL-13 + CL-14 |

**CL-12 sub-wave structure**:
- CL-12a: AIMC foundation re-verification (quick pass after CL-11)
- CL-12b: 7 module integration waves (sequential, each requiring RED gate)
- **CL-12c**: MMM/AIMC integration — wiring MMM's AI capabilities to AIMC (re-scoped from Maturity Roadmap per CEP v1.8.0; MMM builds with AI stubs first per CS2 Directive #1221)

#### 1.1.5 AIMC Unresolved Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| CL-11 D3/D4 scope unclear — GAP-008 (403 gate) and GAP-009 (episodic write) require explicit CS2 scope confirmation | HIGH | CS2 must authorize CL-11 D3/D4 completion before CP-11 can close |
| CL-12c scope alignment — MMM's AIMC surface area not yet defined (depends on FRS/TRS/Architecture) | MEDIUM | D2 plan sequences MMM prebuild stages to define AIMC surface before CL-12c is authorized |
| CL-7 not yet started — PersonaLoader reliability affects all downstream phases (CL-8, CL-9, CL-12) | HIGH | Immediate CS2 wave-start for CL-7 recommended |
| 9 persona domain reviews (CL-9) require 9 specialist agents in sequence — long lead time | MEDIUM | Can begin review preparation now; execution requires CL-7+CL-8 completion |

---

### 1.2 LKIAC (Legacy Knowledge Integration) — Current State

**Source**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md` v1.9.0, LKIAC-001 §5

#### 1.2.1 Completed LKIAC Waves

| Wave | Title | Completion |
|------|-------|------------|
| CL-1 | LKIAC W1: Maturion Persona Migration | 2026-03-01 (CP-1: CLOSED CS2 2026-04-03) |
| CL-2 | LKIAC W2: Legacy Knowledge Inventory | 2026-04-03 (CP-2: CLOSED CS2 2026-04-03) |
| CL-3 | LKIAC W5: Deprecation Register Activation | 2026-04-03 (CP-3: CLOSED CS2 2026-04-03) |

**Notable CL-2 output**: Extended taxonomy decisions — `ldcs` source adopted, `diamond-industry` source adopted; `org_page_chunks` scope included in CL-6; CL-6 wave-start authorised.

**Notable CL-3 output**: Deprecation Register now active; DEP-008 (legacy AIMC data sources) status = PARALLEL-RUN.

#### 1.2.2 Pending Unblocked LKIAC Waves

CL-6, CL-7, CL-10 (described in §1.1.3 above — shared with AIMC tracking since LKIAC/AIMC CEP is combined).

#### 1.2.3 Blocked LKIAC Waves

CL-8, CL-13, CL-15 (described in §1.1.4 above).

#### 1.2.4 LKIAC Decommission Dependencies

Per LKIAC-001 §8 governance principles:
- **Principle 1 (No Knowledge Discarded)**: All legacy assets from `apps/maturion-maturity-legacy/` must be migrated before legacy source is decommissioned.
- **Principle 3 (Verified Equivalent Before Removal)**: Deprecation Register governs all decommissions; no component removed without confirmed replacement.
- **CL-15** is the final gate: legacy component decommission + final audit requires CL-13 + CL-14 completion.
- **Decommission of `dmhlxhatogrrrvuruayv` (legacy Supabase project)** requires explicit CP-6 CS2 authorisation (CL-6 exit criteria).

#### 1.2.5 LKIAC Unresolved Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| CL-6 knowledge migration schema delta — `document_chunks` (legacy) → `ai_knowledge` (AIMC) requires embedding model re-run and domain taxonomy re-mapping | MEDIUM | Covered by CL-6-D2 (migration script) specification; ADR-001/004 locked in |
| Legacy Supabase project decommission — CP-6 required from CS2 before legacy project can be closed | HIGH | Cannot decommission until CL-6 GREEN + CP-6 CS2 sign-off |
| CL-13 (AMC API Contract) has no explicit assignee yet | LOW | governance-liaison-isms-agent assigned in CEP; wave-start not yet authorized |

---

### 1.3 MAT Terminal Harvest — Current State

**Source**: `.agent-admin/governance/mat-wave13-terminal-verdict-20260405.md`, CEP v1.9.0

#### 1.3.1 MAT Status Summary

| Field | Value |
|-------|-------|
| Module | MAT (Maturion Assessment Tool) — `apps/mat/` |
| Terminal Wave | Wave 13 |
| Declaration | TERMINAL HARVEST — CS2 Directive #1221 (2026-04-05) |
| Post-Closure State | FROZEN / CLOSED post-migration |
| Migration Target | MMM (`modules/MMM/`) |
| Migration Vehicle | CL-12c sub-wave |
| CS2 Closure Gate | CP-12 |

#### 1.3.2 MAT Closure Conditions (all must be satisfied)

1. **Migration Complete**: All useful MAT artifacts and tests identified and migrated into MMM.
2. **Migration Verified**: Independent verification of functional equivalence in MMM.
3. **No Knowledge Discarded**: LKIAC-001 §8 Principle 1 compliance confirmed.
4. **CL-12c Complete**: Wave CL-12c deliverables fully GREEN (MMM AIMC wiring live, MAT capabilities absorbed).
5. **CP-12 Closure**: CS2 issues CP-12 closure gate sign-off.
6. **Foreman Sign-Off**: Foreman verifies closure conditions before MAT is frozen.

#### 1.3.3 MAT Outstanding Work

**MAT Wave 13 (terminal harvest wave)** — not yet executed. Requires:
- CS2 wave-start for Wave 13
- Full harvest map: identify all MAT capabilities, tests, and artifacts to migrate
- Destination mapping: which MMM components absorb which MAT capabilities
- Migration execution by appropriate builder agents

**Governance note**: MAT is currently in active development (module files exist in `apps/mat/`). The terminal verdict means no new features — but Wave 13 (harvest) is a legitimate remaining wave.

#### 1.3.4 MAT Unresolved Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| MAT Wave 13 scope not yet defined — harvest map unproduced | HIGH | Issue breakdown (D4 below) includes "MAT Wave 13 scope wave" as a required issue |
| CL-12c must define MMM's absorption surface before MAT harvest is complete | MEDIUM | MMM FRS/Architecture stages sequence this: FRS defines what MMM absorbs; harvest validates against FRS |
| MAT test suite (potentially large) must migrate to MMM tests before closure | MEDIUM | Part of Wave 13 deliverables |

---

### 1.4 Maturity Roadmap — Current State

**Source**: `.agent-admin/governance/roadmap-decommission-plan-20260405.md`, CEP v1.9.0

#### 1.4.1 Roadmap Status Summary

| Field | Value |
|-------|-------|
| Module | Maturity Roadmap (`apps/roadmap/` or equivalent) |
| Status | DECOMMISSION PENDING — migration anchor only |
| CL-12d | CANCELLED / NOT PLANNED |
| New AIMC Wiring | NOT AUTHORISED |
| Decommission Trigger | MMM parity confirmed + all conditions met |
| CS2 Authority | Directive #1221 (2026-04-05) |

#### 1.4.2 Roadmap Decommission Conditions (all must be satisfied)

1. **MMM Parity Confirmed**: MMM delivers functional parity with all Roadmap capabilities per MMM app description.
2. **CL-12c Complete**: Wave CL-12c deliverables fully GREEN.
3. **Cross-Reference Audit**: All cross-references to Roadmap updated to reference MMM equivalents.
4. **No Knowledge Discarded**: LKIAC-001 §8 Principle 1 confirmed.
5. **Deprecation Register Entry**: Formal entry per LKIAC-001 §8 Principle 3.
6. **CS2 Authorisation**: CS2 issues formal decommission sign-off.

#### 1.4.3 Roadmap Current Role

The Roadmap conceptually underpins MMM's governance model. Per `MMM_strategy.md`:
> "MMM will retain the Maturity Roadmap as the primary conceptual backbone"

The Roadmap's capabilities that must be absorbed into MMM include:
- Maturity governance and onboarding flow
- Live maturity scoring and dashboard
- Approval workflow
- Action-planning module

These must appear in MMM's FRS as derived requirements before the Roadmap can be retired.

#### 1.4.4 Roadmap Unresolved Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Roadmap capability inventory not yet formal — no explicit list of what MMM must absorb | HIGH | MMM FRS wave must explicitly enumerate Roadmap capabilities as FRS derivation statements |
| Cross-reference audit scope undefined | MEDIUM | Foreman must scope cross-reference audit as a separate governed task |
| Premature decommission risk — Roadmap removed before MMM parity confirmed | CRITICAL | Decommission gate (Step 6: CS2 authorisation) is hard-blocking |

---

### 1.5 MMM (Maturity Management Module) — Current Prebuild State

**Source**: `modules/MMM/BUILD_PROGRESS_TRACKER.md`, `modules/MMM/MMM_strategy.md`, `modules/MMM/00-app-description/MMM_app_description.md`

#### 1.5.1 12-Stage Prebuild Status

| Stage | Name | Status | Artifact | Blocker |
|-------|------|--------|----------|---------|
| 1 | App Description | ✅ COMPLETE | `MMM_app_description.md` v0.4.0 | Approval formalisation pending (advisory) |
| 2 | UX Workflow & Wiring Spec | ⬜ NOT_STARTED | `modules/MMM/01-ux-workflow-wiring-spec/` empty | CS2 wave-start required |
| 3 | FRS | ⬜ NOT_STARTED | `modules/MMM/02-frs/` empty | Depends on Stage 2 |
| 4 | TRS | ⬜ NOT_STARTED | `modules/MMM/03-trs/` empty | Depends on Stage 3 |
| 5 | Architecture | 🔄 IN_PROGRESS | `modules/MMM/04-architecture/architecture.md` | Pre-existing path inconsistencies; requires clean-up wave |
| 6 | QA-to-Red | ⬜ NOT_STARTED | `modules/MMM/05-qa-to-red/` empty | Depends on Stages 3–5 |
| 7 | PBFAG | ⬜ NOT_STARTED | `modules/MMM/06-pbfag/` empty | Depends on Stage 6 |
| 8 | Implementation Plan | 🔄 PARTIAL (this wave) | `modules/MMM/07-implementation-plan/` | Concurrent programme plan (this wave); full plan needs Stages 3–7 |
| 9 | Builder Checklist | ⬜ NOT_STARTED | `modules/MMM/08-builder-checklist/` empty | Depends on Stage 8 |
| 10 | IAA Pre-Brief (for build) | ⬜ NOT_STARTED | `modules/MMM/09-iaa-pre-brief/` empty | Depends on Stage 9 |
| 11 | Builder Appointment | ⬜ NOT_STARTED | `modules/MMM/10-builder-appointment/` | Depends on Stage 10 |
| 12 | Build | ⬜ NOT_STARTED (AI stubs) | `modules/MMM/11-build/` | Depends on Stage 11; AI stubs per CS2 Directive #1221 |

#### 1.5.2 Pre-Existing Architecture Inconsistencies

These advisory items are documented for clean-up:
1. `architecture.md` references `modules/MMM/01-frs/` — actual path is `modules/MMM/02-frs/`
2. `architecture.md` lists only partial stage sequence (App Description + FRS with old numbering)
3. `architecture.md` states FRS → IN_PROGRESS while BUILD_PROGRESS_TRACKER shows NOT_STARTED
4. Legacy capabilities directory reference should resolve to `modules/MMM/04-architecture/capabilities/`; that directory currently contains 79 Risk Management artifacts that belong in `modules/MMM/_legacy/` or `90-legacy-assets/`

These do not block Stage 2 initiation but must be resolved before Stage 5 (Architecture) can be marked COMPLETE.

#### 1.5.3 MMM Key Strategic Anchors

Per `MMM_strategy.md` and `MMM_app_description.md` v0.4.0:
- MMM absorbs: Maturity Roadmap (conceptual backbone) + MAT (audit execution + AI assessment) + legacy maturity (framework generation, knowledge handling)
- MMM depends centrally on AIMC for AI functionality
- MMM **builds with AI stubs** until CL-12c delivers real AIMC wiring (per CS2 Directive #1221)
- MMM becomes the sole canonical maturity product; MAT and Roadmap dissolve as standalone identities

---

## 2. MMM Dependency Classification

### 2.1 Category A: Must Close Before MMM Prebuild Stage 2 Starts

**Answer: NO AIMC/LKIAC item must close before Stage 2 can start.**

| Dependency | Status | Rationale |
|------------|--------|-----------|
| Stage 1 (App Description) complete | ✅ COMPLETE | Required upstream; met |
| CS2 wave-start for Stage 2 | CS2 action required | Standard wave authorization |
| AIMC/LKIAC work | NOT REQUIRED | Stage 2 (UX Workflow & Wiring Spec) is internal MMM design work with no AIMC dependency |

**Conclusion**: MMM Stage 2 can be authorized and executed immediately, in parallel with all AIMC/LKIAC work.

### 2.2 Category B: May Remain Open While MMM Prebuild Stages 2–7 Proceed

| Dependency | Can Remain Open? | Rationale |
|------------|-----------------|-----------|
| CL-6 (Knowledge Re-ingestion) | ✅ YES | No MMM prebuild stage 2–7 depends on knowledge being migrated |
| CL-7 (PersonaLoader Improvements) | ✅ YES | No MMM prebuild stage depends on PersonaLoader reliability |
| CL-8 (Domain Routing) | ✅ YES | MMM prebuild does not require live domain routing |
| CL-9 (Phase B Persona Review) | ✅ YES | Not needed for prebuild stages |
| CL-10 (Routing Governance CI) | ✅ YES | CI governance work is parallel |
| CL-11 completion + CP-11 | ✅ YES | Knowledge Upload Centre completion is parallel |
| MAT Wave 13 (harvest) | ✅ YES | MAT harvest work can proceed in parallel |
| Roadmap decommission activities | ✅ YES | Roadmap cross-ref audit can proceed in parallel |

**Conclusion**: All currently open AIMC/LKIAC/MAT/Roadmap work may remain open while MMM Stages 2–7 proceed.

### 2.3 Category C: Must Close Before MMM Can Begin Real AIMC-Integrated Implementation

These must be complete before the CL-12c wave can be executed (MMM's AIMC integration):

| Dependency | Requirement |
|------------|-------------|
| CL-6 COMPLETE | Knowledge base populated — AIMC specialists have domain knowledge to serve MMM |
| CL-7 COMPLETE | PersonaLoader reliable — MMM's AI interactions use validated persona routing |
| CL-8 COMPLETE | Domain routing live — MMM queries receive domain-filtered responses |
| CL-9 COMPLETE | All 9 persona domain reviews complete — AIMC quality assured for MMM integration |
| CL-11 COMPLETE (CP-11 closed) | Knowledge Upload Centre fully operational — MMM's knowledge ingestion pathway live |
| CL-12a + CL-12b COMPLETE | AIMC foundation re-verified + all 7 non-MMM modules wired — before CL-12c starts |
| CL-10 COMPLETE | Routing governance CI in place — enforces correct wiring at merge time |
| MMM Stages 1–11 COMPLETE | MMM is fully specified and built with AI stubs before CL-12c wires live AIMC |

### 2.4 Category D: Must Close Before MMM Can Claim Replacement Parity over MAT / Roadmap

| Dependency | Requirement |
|------------|-------------|
| CL-12c COMPLETE | MMM/AIMC integration live — MMM has real AI capabilities |
| MAT Wave 13 COMPLETE | All MAT artifacts harvested and migrated into MMM |
| CP-12 CLOSED (CS2) | CS2 confirms combined module integration is complete |
| MMM FRS enumerates all Roadmap capabilities | Roadmap feature inventory absorbed into MMM FRS derivation statements |
| MMM FRS enumerates all MAT capabilities | MAT feature inventory absorbed into MMM FRS derivation statements |
| MMM build passes all migrated tests (100% GREEN) | Functional equivalence verified, not just documented |
| Cross-reference audit COMPLETE | All governance cross-references updated from MAT/Roadmap → MMM |

### 2.5 Category E: Must Close Before Final Legacy Retirement / Decommission is Lawful

| Dependency | Requirement |
|------------|-------------|
| Category D conditions ALL met | Parity must be confirmed first |
| CL-13 COMPLETE | AMC API contract defined — architectural boundary clean |
| CL-14 COMPLETE | AIMC Governance Certification complete — ecosystem compliance |
| CL-15 COMPLETE | Legacy component decommission + final audit (LKIAC-001 §8 Principle 3 fully executed) |
| Deprecation Register entries for MAT and Roadmap | Formal closure records |
| CS2 formal decommission authorisation | Both MAT and Roadmap require explicit CS2 sign-off per decommission plans |

---

## 3. Dependency Matrix

### 3.1 Inter-Programme Dependency Classification

| Dependency | Source Project | Impact on MMM | Closure Requirement Stage | Owner | Current Status | Classification |
|------------|---------------|----------------|--------------------------|-------|----------------|----------------|
| CL-6: Knowledge Re-ingestion | LKIAC | MMM's AIMC integration requires populated knowledge base | Category C (pre-AIMC integration) | `foreman-v2-agent` → `qa-builder` + `api-builder` | PENDING UNBLOCKED (wave-start authorised) | SOFT (blocks CL-12c, not MMM prebuild) |
| CL-7: PersonaLoader Improvements | LKIAC | MMM's AI interactions depend on reliable persona routing | Category C (pre-AIMC integration) | `foreman-v2-agent` → `qa-builder` + `api-builder` + `integration-builder` | PENDING UNBLOCKED (no CS2 wave-start) | SOFT (blocks CL-8, CL-9, CL-12c) |
| CL-8: Domain Routing | LKIAC | MMM domain queries require filtered routing | Category C (pre-AIMC integration) | `foreman-v2-agent` → `qa-builder` + `integration-builder` | BLOCKED (CL-6 + CL-7) | HARD (blocks CL-12c) |
| CL-9: Phase B Persona Review | AIMC Audit | Quality assurance of AIMC before MMM integration | Category C (pre-AIMC integration) | `mat-specialist`, `pit-specialist`, `risk-platform-agent`, `maturity-scoring-agent` | BLOCKED (CL-7 + CL-8) | HARD (blocks CL-12) |
| CL-10: Routing Governance CI | LKIAC | CI enforcement of correct AIMC usage in MMM code | Category C (pre-AIMC integration) | `foreman-v2-agent` → `integration-builder` | PENDING UNBLOCKED (no CS2 wave-start) | SOFT (parallel, enforces correctness) |
| CL-11 completion (D3+D4) | AIMC | Knowledge upload fully operational for MMM's knowledge pipeline | Category C (pre-AIMC integration) | CS2 authorization + builder agents | IN PROGRESS (D3/D4 outstanding) | HARD (CP-11 blocks CL-12) |
| CL-12c: MMM/AIMC Integration | AIMC Audit | MMM's live AI wiring | Category C complete | `foreman-v2-agent` → all builders | BLOCKED (CL-9 + CL-11 CP-11) | HARD (defines MMM parity) |
| MAT Wave 13 | MAT | MAT capabilities migrated into MMM | Category D (parity claim) | `foreman-v2-agent` → `api-builder` + `ui-builder` + `qa-builder` | NOT STARTED (requires CS2 wave-start) | PARALLEL (during MMM stages 2–11) |
| Roadmap cross-ref audit | Roadmap | Governance integrity before Roadmap removed | Category E (decommission) | `governance-liaison-isms-agent` | NOT STARTED | PARALLEL (after MMM FRS complete) |
| CL-13: AMC API Contract | LKIAC | Clean architectural boundary required for final decommission | Category E (decommission) | `governance-liaison-isms-agent` | BLOCKED (CL-8) | SOFT (decommission completeness) |
| CL-14: AIMC Governance Cert | AIMC Audit | AIMC ecosystem compliance required before legacy retirement | Category E (decommission) | `governance-liaison-isms-agent` | BLOCKED (CL-12 + CL-10 + CL-7) | SOFT (decommission completeness) |
| CL-15: Legacy Decommission | LKIAC + AIMC | Final retirement of legacy components | Category E (decommission) | `governance-liaison-isms-agent` | BLOCKED (CL-13 + CL-14) | HARD (final closure gate) |

### 3.2 MMM Prebuild Stage Dependencies

| MMM Stage | AIMC/LKIAC Dependency | MAT Dependency | Roadmap Dependency | Classification |
|-----------|----------------------|-----------------|-------------------|----------------|
| Stage 2 (UX Workflow & Wiring Spec) | None | Advisory: review MAT UX patterns | Advisory: review Roadmap governance flow | PARALLEL — starts immediately |
| Stage 3 (FRS) | None | Must enumerate MAT capabilities for absorption | Must enumerate Roadmap capabilities for absorption | PARALLEL — after Stage 2 |
| Stage 4 (TRS) | Advisory: AIMC API surface known (CL-5 spec exists) | None | None | PARALLEL — after Stage 3 |
| Stage 5 (Architecture) | Advisory: AIMC integration pattern known | Advisory: MAT architecture reviewed | Advisory: Roadmap architecture reviewed | PARALLEL — concurrent with 2–4 |
| Stage 6 (QA-to-Red) | Advisory: AI stub test patterns from CL-4 | Advisory: MAT test patterns | None | PARALLEL — after Stages 3–5 |
| Stage 7 (PBFAG) | None | None | None | PARALLEL — after Stage 6 |
| Stage 8 (Implementation Plan) | CL-12c scope must be known (advisory — CL-5 spec exists) | MAT Wave 13 scope must be defined | None | PARALLEL — after Stage 7; CL-12c scope advisory only |
| Stage 9 (Builder Checklist) | None | None | None | PARALLEL — after Stage 8 |
| Stage 10 (IAA Pre-Brief for Build) | None | None | None | PARALLEL — after Stage 9 |
| Stage 11 (Builder Appointment) | None | None | None | PARALLEL — after Stage 10 |
| Stage 12 (Build — AI stubs) | CL-12c can be planned (stubs used) | MAT harvest complete or in-flight | None | PARALLEL — stubs allow build start |
| Stage 12 (Build — live AIMC wiring via CL-12c) | CL-6 + CL-7 + CL-8 + CL-9 + CL-11 + CL-12a/b ALL complete | MAT Wave 13 complete | None | SEQUENTIAL — hard block |

---

## 4. Mandatory Questions — Answers

### Q1. Which AIMC/LKIAC items are still truly outstanding?

**Still outstanding (not yet COMPLETE)**:
- **CL-6**: Knowledge Re-ingestion (all 4 deliverables pending, wave-start authorised)
- **CL-7**: PersonaLoader Improvements (all 5 deliverables pending, no CS2 wave-start yet)
- **CL-8**: Domain Specialist Knowledge Routing (blocked on CL-6 + CL-7)
- **CL-9**: AIMC Audit Phase B — Persona Domain Review (blocked on CL-7 + CL-8)
- **CL-10**: Routing Governance CI Enforcement (all deliverables pending, no CS2 wave-start yet)
- **CL-11**: D3 (GAP-008) and D4 (GAP-009) outstanding; CP-11 CS2 approval required
- **CL-12** (all sub-waves): Blocked on CL-9 + CL-11/CP-11
- **CL-13**: Blocked on CL-8
- **CL-14**: Blocked on CL-12 + CL-10 + CL-7
- **CL-15**: Blocked on CL-13 + CL-14

### Q2. Which outstanding items are merely legacy closure work versus active blockers for MMM?

**Active blockers for MMM (Category C — required before CL-12c)**:
CL-6, CL-7, CL-8, CL-9, CL-10, CL-11 (D3+D4+CP-11), CL-12a, CL-12b, CL-12c

**Legacy closure work only (Category E — required for ecosystem retirement, not MMM functionality)**:
CL-13, CL-14, CL-15

**Key insight**: CL-13/14/15 are legacy closure work. MMM can be fully functional and claim parity over MAT/Roadmap BEFORE CL-13/14/15 complete. Final decommission requires them; MMM parity does not.

### Q3. Can MMM Stage 2 begin while AIMC/LKIAC legacy work remains open?

**YES — unconditionally.** MMM Stage 2 (UX Workflow & Wiring Spec) has zero AIMC/LKIAC dependencies. It requires only:
1. CS2 wave-start authorization for Stage 2
2. Stage 1 App Description (COMPLETE ✅)

### Q4. Can MMM proceed with AI stubs while AIMC wiring remains incomplete?

**YES — this is the explicit CS2 Directive #1221 decision.** 
> "MMM builds with AI stubs; wiring deferred to CL-12c wave."

MMM can execute all stages 2–12 (build) using AI stubs for all AIMC-dependent functionality. The real wiring happens in CL-12c, which runs after MMM Stage 11 (Builder Appointment) is complete and after CL-12a/b are done.

### Q5. What exact work belongs in CL-12c-style MMM/AIMC convergence versus MMM prebuild itself?

**MMM prebuild itself (Stages 2–11)**:
- UX Workflow & Wiring Spec (including AI-assisted features with stub interfaces)
- FRS (enumerating capabilities including AI features as "AI: [stub]" requirements)
- TRS (including AIMC API surface area as known from CL-5 spec)
- Architecture (MMM structural design; AIMC integration points declared as stub boundaries)
- QA-to-Red (test suite including AI stub tests)
- Implementation Plan (covering build waves + CL-12c as a declared dependency)
- Build waves (implementing all MMM functionality with AI stubs)

**CL-12c (MMM/AIMC convergence wave)**:
- Replace AI stubs with real AIMC routing calls
- Wire MMM's AI-dependent features to live AIMC specialists
- Validate semantic search quality for MMM domain queries (post CL-8 completion)
- Confirm knowledge upload pipeline is serving MMM's knowledge ingestion needs
- Integrate MAT harvested test suite with MMM's test suite (if not done in Wave 13)
- MAT closure gate: verify MAT → MMM migration completeness

**Key boundary**: The stub/live boundary is the clean line between prebuild and CL-12c.

### Q6. What must be complete before MAT can be formally retired?

Per MAT terminal harvest verdict:
1. MAT Wave 13 COMPLETE (harvest delivered)
2. CL-12c COMPLETE (MMM absorbs MAT capabilities with live AIMC)
3. CP-12 CLOSED (CS2 sign-off on combined integration)
4. Migration Verified (IAA or Foreman QP confirms MAT → MMM functional equivalence)
5. No Knowledge Discarded (LKIAC-001 §8 Principle 1 confirmed)
6. Foreman Sign-Off

### Q7. What must be complete before Maturity Roadmap can be formally retired?

Per Roadmap decommission plan:
1. MMM Parity Confirmed (MMM delivers all Roadmap capabilities per app description)
2. CL-12c COMPLETE
3. Cross-Reference Audit COMPLETE
4. No Knowledge Discarded (LKIAC-001 §8 Principle 1 confirmed)
5. Deprecation Register Entry (formal entry per LKIAC-001 §8 Principle 3)
6. CS2 Formal Decommission Authorisation

### Q8. What work should run first, what can run in parallel, and what must not overlap?

**Run first (immediate, parallel with each other)**:
- CL-6 execution (wave-start already authorised — execute now)
- CL-7 (CS2 wave-start immediately, then execute in parallel with CL-6)
- CL-10 (CS2 wave-start immediately, then execute in parallel)
- CL-11 D3+D4 completion (CS2 authorisation for remaining deliverables)
- MMM Stage 2 (CS2 wave-start immediately)

**Can run in parallel (all at once)**:
- CL-6 + CL-7 + CL-10 + CL-11 D3/D4 (no ordering required between them)
- MMM Stage 2 + the above AIMC/LKIAC waves (fully independent)
- MAT Wave 13 scoping/execution (when CS2 authorised)

**Sequential constraints (cannot overlap)**:
- CL-8 must FOLLOW CL-6 AND CL-7 (hard dependency)
- CL-9 must FOLLOW CL-7 AND CL-8 (hard dependency)
- CL-12 must FOLLOW CL-9 AND CL-11 CP-11 (hard dependency)
- CL-12c must FOLLOW CL-12a AND CL-12b AND MMM Stage 11 (hard dependency)
- MAT formal closure must FOLLOW CL-12c AND CP-12

**Must not overlap**:
- CL-12c and any ongoing MAT active development (MAT must be in harvest-only mode)
- Roadmap formal decommission and any active governance changes referencing Roadmap

### Q9. What is the clean governed execution model for these concurrent tracks?

See Section D2 (Implementation Plan) in the companion document:
`modules/MMM/07-implementation-plan/concurrent-prebuild-and-legacy-plan.md`

The clean model is: **two tracks converging at CL-12c**.
- **Track 1**: AIMC/LKIAC legacy work (CL-6 → CL-7 → CL-8 → CL-9 → CL-11-complete → CL-12a → CL-12b → CL-12c)
- **Track 2**: MMM prebuild (Stage 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → Stage 12 with stubs)
- **Convergence**: CL-12c wires Track 2 (built MMM) to Track 1 (live AIMC) → MMM with live AI
- **Post-convergence**: MAT closure, Roadmap decommission, CL-13/14/15 (legacy retirement)

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Produced by**: foreman-v2-agent v6.2.0  
**Session**: session-mmm-cpa-20260408  
**Companion document**: `modules/MMM/07-implementation-plan/concurrent-prebuild-and-legacy-plan.md`
