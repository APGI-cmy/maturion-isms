# MMM Concurrent Prebuild and Legacy Convergence — Implementation Plan

**Document Type**: Foreman POLC Planning Output — Concurrent Execution Implementation Plan  
**Version**: 1.0.0  
**Date**: 2026-04-08  
**Produced By**: foreman-v2-agent v6.2.0 (session mmm-cpa-20260408)  
**Branch**: copilot/complete-concurrent-programme-analysis  
**Triggering Issue**: [maturion-isms#1303](https://github.com/APGI-cmy/maturion-isms/issues/1303)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Pre-Brief**: `.agent-admin/assurance/iaa-prebrief-mmm-concurrent-programme-analysis-20260408.md`  
**Analysis Companion**: `modules/MMM/analysis/aimc-lkiac-mmm-concurrency-analysis.md`  
**IAA Trigger Category**: PRE_BUILD_STAGE_MODEL  

> **Note on Stage 8 Status**: This document is a concurrent-programme planning artifact filed in the Stage 8 directory. Stage 8 (Implementation Plan) status is PARTIAL — this document represents the concurrent programme planning sub-plan. The full implementation plan (covering all MMM build waves) requires Stages 2–7 completion and will be a separate future deliverable. Stage 8 is NOT COMPLETE.

---

## 0. Plan Summary

This plan governs the concurrent execution of:

- **Track 1 — Legacy Convergence**: Completing all outstanding AIMC/LKIAC waves (CL-6 through CL-15) in sequence, unblocking each wave as predecessors close
- **Track 2 — MMM Prebuild Preparation**: Progressing MMM through all 12 prebuild stages (Stages 2–11, then Stage 12 with AI stubs)

The two tracks **run concurrently and are largely independent** until their convergence point at **CL-12c** (the MMM/AIMC Integration wave), which requires both tracks to have advanced to their respective gates.

**CS2 Action Required Immediately** (before any waves can begin):
1. Wave-start for CL-7 (PersonaLoader Improvements) — CS2 not yet issued
2. Wave-start for CL-10 (Routing Governance CI Enforcement) — CS2 not yet issued
3. Authorization for CL-11 D3+D4 completion (GAP-008/GAP-009) — CS2 scope confirmation needed
4. Wave-start for MMM Stage 2 (UX Workflow & Wiring Spec) — new wave
5. Wave-start for MAT Wave 13 (Terminal Harvest) — new wave (can follow Stage 2 start)

CL-6 wave-start is already authorised (CP-2 closure 2026-04-03) — this can execute immediately.

---

## 1. Track 1 — Legacy Convergence Work

### 1.1 Track 1 Overview

| Wave | Title | Type | Status | Depends On | CS2 Auth Required? |
|------|-------|------|--------|-----------|-------------------|
| CL-6 | Knowledge Re-ingestion | LKIAC | ⏳ PENDING UNBLOCKED | None (authorised) | ✅ Already authorised |
| CL-7 | PersonaLoader Improvements | LKIAC | ⏳ PENDING UNBLOCKED | None (gate met) | ❌ Required |
| CL-10 | Routing Governance CI Enforcement | LKIAC | ⏳ PENDING UNBLOCKED | None (gate met) | ❌ Required |
| CL-11 (D3+D4) | ARC approval endpoint + episodic write path | AIMC | 🔄 IN PROGRESS | CL-5 ✅ | ❌ Scope confirmation needed |
| CL-8 | Domain Specialist Knowledge Routing | LKIAC | 🔒 BLOCKED | CL-6 + CL-7 | After predecessors |
| CL-9 | AIMC Audit Phase B — Persona Domain Review | AIMC Audit | 🔒 BLOCKED | CL-7 + CL-8 | After predecessors |
| CL-12a | AIMC foundation re-verification | AIMC Audit | 🔒 BLOCKED | CL-9 + CL-11 CP-11 | After predecessors |
| CL-12b | 7 Module Integration waves | AIMC Audit | 🔒 BLOCKED | CL-12a | After predecessor |
| CL-12c | MMM/AIMC Integration | AIMC Audit | 🔒 BLOCKED | CL-12b + MMM Stage 11 | After ALL predecessors |
| CL-13 | AMC API Contract | LKIAC | 🔒 BLOCKED | CL-8 | After CL-8 |
| CL-14 | AIMC Governance Cert + AAWP Update | AIMC Audit | 🔒 BLOCKED | CL-12 + CL-10 + CL-7 | After predecessors |
| CL-15 | Legacy Component Decommission + Final Audit | LKIAC + AIMC | 🔒 BLOCKED | CL-13 + CL-14 | After predecessors |

### 1.2 CL-6 Execution Plan (IMMEDIATE — Wave-Start Authorised)

**Status**: Wave-start authorised (CP-2 closure 2026-04-03). Ready to execute.

**Sequence**:
1. `qa-builder`: Produce RED gate tests (CL-6-D1) — migration validation suite, in `packages/ai-centre/src/migrations/` or equivalent
2. `api-builder`: Produce migration script (CL-6-D2) — TypeScript, reads legacy Supabase, re-embeds using AIMC vector model, inserts to `ai_knowledge` with correct `organisation_id` + `source` tags
3. `qa-builder`: Semantic search validation (CL-6-D3) — minimum 10 queries per domain, post-migration
4. `api-builder`: Migration report (CL-6-D4) — row counts, per-domain counts, semantic search results
5. Foreman QP evaluation → IAA audit → CP-6 CS2 sign-off request
6. **CP-6 BLOCKER**: CS2 must explicitly authorise legacy Supabase decommission before `dmhlxhatogrrrvuruayv` is closed

**Assigned Agents**: `qa-builder`, `api-builder`  
**CS2 Checkpoint**: CP-6 — migration report review + legacy decommission authorisation

### 1.3 CL-7 Execution Plan (Requires CS2 Wave-Start)

**Status**: Entry gates met (CL-4 ✅). Requires CS2 wave-start.

**Sequence** (after CS2 wave-start issued):
1. `qa-builder`: RED gate tests CL-7-D1 (PersonaValidationError) + CL-7-D2 (persona registry sync CI)
2. `api-builder`: PersonaValidationError type + runtime YAML validation in PersonaLoader.ts (CL-7-D3)
3. `integration-builder`: CI check for persona registry sync (CL-7-D4) + scheduled workflow for overdue reviews (CL-7-D5)
4. Foreman QP evaluation → IAA audit → CP-7 CS2 sign-off

**Assigned Agents**: `qa-builder`, `api-builder`, `integration-builder`  
**CS2 Checkpoint**: CP-7

**Note**: CL-7 can run in parallel with CL-6. The RED gate for CL-7 can be issued as soon as CS2 wave-start is received.

### 1.4 CL-10 Execution Plan (Requires CS2 Wave-Start)

**Status**: Entry gates met (CL-4 ✅). Requires CS2 wave-start.

**Sequence** (after CS2 wave-start issued, parallel with CL-6 and CL-7):
1. `integration-builder`: CL-10-D1 — CI check enforcing no direct AI provider imports in module code (GRS-016)
2. `integration-builder`: CL-10-D2 — CI check for sub-module routing compliance
3. `integration-builder`: CL-10-D3 — stub detection CI check (`expect(true).toBe(true)` pattern detector)
4. Foreman QP evaluation → IAA audit → CP-10 CS2 sign-off

**Assigned Agents**: `integration-builder`  
**CS2 Checkpoint**: CP-10

### 1.5 CL-11 D3/D4 Completion Plan (Requires CS2 Scope Confirmation)

**Status**: D1/D2/D5/D6 COMPLETE. D3 (GAP-008) and D4 (GAP-009) outstanding. CP-11 open.

**Scope of outstanding items**:
- **CL-11-D3 (GAP-008)**: ARC approval endpoint 403 gate — the `process-document-v2` endpoint must return 403 for unapproved organisation attempts; currently not enforced
- **CL-11-D4 (GAP-009)**: Episodic write path — mechanism for adding individual knowledge entries to `ai_knowledge` outside the bulk upload pipeline

**Sequence** (after CS2 scope confirmation):
1. `qa-builder`: RED gate for CL-11-D3 (403 gate test)
2. `api-builder`: Implement 403 gate in `process-document-v2`
3. `api-builder`: Implement episodic write path (CL-11-D4) with appropriate schema support
4. `qa-builder`: Full test pass confirming D3 + D4 complete
5. Foreman QP evaluation → IAA audit → CP-11 CS2 sign-off
6. **CP-11 closure unblocks CL-12**

**Assigned Agents**: `qa-builder`, `api-builder`  
**CS2 Checkpoint**: CP-11 — full CL-11 review before CL-12 authorisation

### 1.6 Post-Unblocking Sequence (CL-8 → CL-9 → CL-12)

These execute sequentially after their prerequisites close:

**CL-8 (Domain Routing)** — begins when CL-6 + CL-7 both COMPLETE:
- `qa-builder`: RED gate tests (CL-8-D1)
- `integration-builder`: Updated domain specialist routing with source-filtering (CL-8-D2)
- `qa-builder`: Integration test set (CL-8-D3) — 10 queries/domain
- CP-8 CS2 sign-off

**CL-9 (Phase B Persona Review)** — begins when CL-7 + CL-8 COMPLETE:
- 9 persona domain accuracy reviews (9 separate specialist agents)
- `mat-specialist`: T-E-001 (Maturion), T-E-006, T-E-007
- `pit-specialist`: T-E-002, T-E-005
- `risk-platform-agent`: T-E-003, T-E-004
- `maturity-scoring-agent`: T-E-008
- CP-9 CS2 sign-off after all 9 reviews PASS

**CL-12a/12b** (Module Integration) — begins when CL-9 COMPLETE + CL-11 CP-11 CLOSED:
- CL-12a: AIMC foundation re-verification (quick pass)
- CL-12b: 7 module integration sub-waves (sequential, each with RED gate)
- CP-12a/b CS2 sign-offs

**CL-12c (MMM/AIMC Integration)** — begins when CL-12b COMPLETE + MMM Stage 11 COMPLETE:
- See §3 (Convergence Point) below for full specification

### 1.7 Legacy Retirement Sequence (CL-13 → CL-14 → CL-15)

These are Category E items (ecosystem retirement), not required for MMM functionality:

**CL-13** — after CL-8:
- `governance-liaison-isms-agent`: AMC API contract definition

**CL-14** — after CL-12 + CL-10 + CL-7:
- `governance-liaison-isms-agent`: AIMC Governance Certification + AAWP Update

**CL-15** — after CL-13 + CL-14:
- `governance-liaison-isms-agent` + builder agents: Legacy component decommission + final audit

---

## 2. Track 2 — MMM Prebuild Preparation

### 2.1 Track 2 Overview

| Stage | Name | Depends On | Parallel With | CS2 Auth Required? |
|-------|------|-----------|--------------|-------------------|
| Stage 2 | UX Workflow & Wiring Spec | Stage 1 ✅ | CL-6, CL-7, CL-10, CL-11 | ❌ Required |
| Stage 3 | FRS | Stage 2 | CL-6→CL-8 (ongoing) | After Stage 2 complete |
| Stage 4 | TRS | Stage 3 | CL-8→CL-9 (ongoing) | After Stage 3 complete |
| Stage 5 | Architecture (completion) | Stage 4 ✅ (work may be in progress from Stage 1; completion gated on TRS approval) | All of above | Clean-up wave + main architecture wave after Stage 4 approval |
| Stage 6 | QA-to-Red | Stages 4 + 5 | CL-9→CL-12 (ongoing) | After Stages 4+5 |
| Stage 7 | PBFAG | Stage 6 | CL-12 (ongoing) | After Stage 6 |
| Stage 8 | Full Implementation Plan | Stage 7 | CL-12 (ongoing) | After Stage 7 |
| Stage 9 | Builder Checklist | Stage 8 | CL-12 (ongoing) | After Stage 8 |
| Stage 10 | IAA Pre-Brief (for build) | Stage 9 | CL-12 (ongoing) | After Stage 9 |
| Stage 11 | Builder Appointment | Stage 10 | CL-12b (ongoing) | After Stage 10 |
| Stage 12 (stubs) | Build — AI stubs | Stage 11 | CL-12b (ongoing) | After Stage 11 |
| Stage 12 (live) | Build — live AIMC (via CL-12c) | CL-12b + MMM Stage 11 | — | Convergence point |

### 2.2 Stage 2 — UX Workflow & Wiring Spec

**Requires**: CS2 wave-start authorization

**Scope**:
- Map all primary and secondary user journeys for MMM
- Document full screen interaction flows and data flows
- Define explicit wiring between UI elements, API endpoints, schema tables, and reporting outputs
- Include AIMC-dependent interactions (documented with stub boundary markers)
- Derive from MMM App Description v0.4.0 and MMM Strategy

**Key considerations**:
- The UX spec must absorb both Maturity Roadmap and MAT user journey patterns as source material
- AIMC interactions should be explicitly flagged as "stub" — real wiring defined in CL-12c
- The spec must be comprehensive enough to allow FRS derivation with 100% §AD traceability

**Assigned Agent**: `ui-builder` (UX wireframes + journey maps) + `governance-liaison-isms-agent` (wiring documentation)  
**Foreman Actions**: Architecture review against App Description, QP evaluation, CS2 approval request

### 2.3 Stage 3 — FRS (Functional Requirements Specification)

**Requires**: Stage 2 COMPLETE

**Scope**:
- Derive from App Description v0.4.0 (§AD traceability required for 100% of requirements)
- Derive from Stage 2 UX Workflow & Wiring Spec (100% journey coverage required)
- Enumerate ALL Maturity Roadmap capabilities that MMM must absorb (derivation statements required)
- Enumerate ALL MAT capabilities that MMM must absorb (derivation statements required)
- AI-dependent requirements flagged as "AI: [functionality via AIMC]" — no placeholders or unresolved items; requirements must be explicit
- Knowledge upload requirements included (from CL-5 spec and CL-11 architecture)

**Key considerations**:
- FRS completeness defines what MMM absorbs from MAT and Roadmap — this document is the legal basis for MAT/Roadmap retirement
- No placeholders or unresolved items permitted in FRS
- Every AI capability must be requirement-specified (even if built with stubs)

**Assigned Agent**: `mat-specialist` (MAT capability translation) + `governance-liaison-isms-agent` (Roadmap capability translation + document structure)  
**Foreman Actions**: QP review of 100% §AD traceability, CS2 approval request

### 2.4 Stage 4 — TRS (Technical Requirements Specification)

**Requires**: Stage 3 COMPLETE

**Scope**:
- Technical constraints, performance requirements, integration requirements
- AIMC API surface area from CL-5 spec (available now — no new AIMC wave needed)
- FRS-to-TRS traceability matrix
- Tool validation and quality gate definitions
- Schema design constraints (must align with AIMC `ai_knowledge` schema from CL-11)

**Assigned Agent**: `api-builder` (API + schema technical requirements) + `schema-builder` (schema constraints)  
**Foreman Actions**: QP review, CS2 approval request

### 2.5 Stage 5 — Architecture (Completion)

**Status**: IN_PROGRESS — requires clean-up wave then full architecture wave

**Phase A (Architecture Clean-Up Wave — immediate, parallel with Stage 2)**:
- Fix architecture.md path references: `01-frs/` → `02-frs/`
- Update architecture.md to reference full 12-stage lifecycle
- Reconcile FRS status (NOT_STARTED, not IN_PROGRESS)
- Address advisory items from IAA pre-existing note ADV-001 through ADV-004

**Phase B (Full Architecture Wave — after Stage 3 FRS complete)**:
- Define complete MMM system architecture
- Document AIMC integration points (with explicit stub boundary markers)
- Document schema design aligned with TRS
- Document deployment architecture and module boundaries

**Assigned Agent (Phase A)**: `governance-liaison-isms-agent` (documentation consistency)  
**Assigned Agent (Phase B)**: `api-builder` (system architecture) + `schema-builder` (data architecture)  
**Foreman Actions**: QP review, architecture freeze declaration, CS2 approval

### 2.6 Stage 6 — QA-to-Red

**Requires**: Stages 3 (FRS) + 5 (Architecture) COMPLETE

**Scope**:
- Full RED gate test suite for all MMM functionality
- Test identifiers mapped to FRS requirements (100% coverage required)
- AI stub tests (verify stub boundary is respected; stub returns expected interface)
- CL-12c integration tests (flagged as "PENDING — requires CL-12c" — acceptable as planned failing tests)

**Assigned Agent**: `qa-builder`  
**Foreman Actions**: QP review confirming all tests are genuinely RED (not accidentally passing stubs)

### 2.7 Stages 7–11 (PBFAG through Builder Appointment)

These follow the standard pre-build stage model:
- **Stage 7 (PBFAG)**: Foreman confirms frozen architecture is the stable foundation for build
- **Stage 8 (Full Implementation Plan)**: Full wave breakdown, CL-12c timing, MAT harvest coordination
- **Stage 9 (Builder Checklist)**: Complete checklist for all builders involved in Stage 12
- **Stage 10 (IAA Pre-Brief for Build)**: IAA pre-brief specifically for the MMM build
- **Stage 11 (Builder Appointment)**: Formal builder appointment with task specifications

### 2.8 Stage 12 — Build (AI Stubs)

**Per CS2 Directive #1221**: MMM builds with AI stubs. No AIMC wiring. CL-12c handles wiring.

**Scope of Stage 12 build (stubs)**:
- All MMM functionality implemented and tested (GREEN)
- AI-dependent capabilities implemented behind stub interfaces
- Stubs return correctly shaped data (matching AIMC API surface from CL-5)
- Zero failing tests (stubs must make tests GREEN — they simulate live AI)
- MAT capabilities absorbed during or after harvest (Wave 13 runs concurrently or before)

---

## 3. Convergence Point — CL-12c (MMM/AIMC Integration Wave)

### 3.1 Gate Conditions for CL-12c

CL-12c requires ALL of the following to be complete before wave-start:

| Gate | Source Track | Condition |
|------|-------------|-----------|
| CL-12a complete | Track 1 | AIMC foundation re-verified post-CL-9/CL-11 |
| CL-12b complete | Track 1 | All 7 non-MMM modules wired to AIMC |
| CP-12a/b closed | Track 1 | CS2 sign-off on module integration |
| MMM Stage 11 complete | Track 2 | Builder appointed; MMM built with stubs (GREEN) |
| CL-10 complete | Track 1 | Routing governance CI enforces correct wiring |
| MAT Wave 13 complete or in final integration | Track 2/MAT | MAT harvest delivered; MAT artifacts in MMM |

### 3.2 CL-12c Deliverables

| ID | Deliverable | Assigned Agent |
|----|-------------|----------------|
| CL-12c-D1 | RED gate tests: MMM/AIMC integration test suite (replacing stub tests) | `qa-builder` |
| CL-12c-D2 | MMM AIMC wiring: replace all AI stubs with live AIMC specialist routing | `api-builder` + `integration-builder` |
| CL-12c-D3 | MAT harvest verification: confirm all MAT capabilities present in MMM | `mat-specialist` |
| CL-12c-D4 | MAT test suite migration: all MAT tests ported to MMM and GREEN | `qa-builder` |
| CL-12c-D5 | Knowledge upload integration: MMM knowledge pipeline connected to `ai_knowledge` | `api-builder` |
| CL-12c-D6 | Integration validation: end-to-end MMM + AIMC smoke tests, all GREEN | `qa-builder` |

### 3.3 Post-CL-12c Actions

After CL-12c GREEN + CP-12 CS2 sign-off:
1. MAT formal closure (frozen/closed) — Foreman sign-off + CS2 authorisation
2. Roadmap decommission preparation begins: cross-reference audit + deprecation register entry
3. CL-13/14/15 sequence begins (legacy retirement, non-blocking for MMM operation)

---

## 4. MAT Terminal Harvest Stream

### 4.1 MAT Wave 13 — Scope Definition Required

**Status**: Terminal harvest declared (CS2 Directive #1221, 2026-04-05). Wave 13 scope not yet defined.

**Wave 13 must produce**:
1. **Harvest Map**: Complete inventory of all MAT capabilities, tests, UI components, API endpoints, and data schemas that must migrate to MMM
2. **Ownership Transition Matrix**: For each MAT artifact → destination MMM component
3. **Migration Execution**: Actual migration of identified artifacts (or confirmation of in-flight equivalent in MMM)
4. **Test Migration**: Port MAT test suite to MMM (or confirm coverage by MMM's own suite)
5. **Closure Verification Report**: Confirms zero valuable assets left behind

**Timeline**: Wave 13 can start in parallel with MMM Stage 2 (harvest mapping is design-independent). Migration execution should target completion before CL-12c begins.

**Assigned Agents**: `api-builder` (backend/API migration) + `ui-builder` (UI component migration) + `qa-builder` (test migration + closure verification)

### 4.2 Concurrency Notes for MAT Wave 13

- **Harvest map** (identifying what to migrate): runs in parallel with MMM Stage 2 — no ordering required
- **Migration execution**: should target completion before CL-12c so CL-12c-D3 can verify
- **MAT is frozen for new development** immediately per CS2 Directive #1221
- MAT's existing tests remain GREEN during the harvest period; no regressions allowed

---

## 5. Concurrency Boundaries and Gating Points

### 5.1 Concurrency Map

```
WEEK 0–N (IMMEDIATE — parallel start):
  Track 1: CL-6 EXECUTE | CL-7 (after CS2 auth) | CL-10 (after CS2 auth) | CL-11 D3/D4 (after CS2 scope)
  Track 2: MMM Stage 2 (after CS2 wave-start)
  MAT:     Wave 13 scoping + harvest map

GATE A (CL-6 + CL-7 COMPLETE):
  Track 1: → CL-8 unlocked
  Track 2: Continues independently (likely Stage 3 or 4 in progress)

GATE B (CL-8 + CL-7 COMPLETE):
  Track 1: → CL-9 unlocked (9 persona reviews)
  Track 2: Continues independently

GATE C (CL-9 + CL-11 CP-11 COMPLETE):
  Track 1: → CL-12a → CL-12b unlocked
  Track 2: Continues independently

GATE D (CL-12b COMPLETE + MMM Stage 11 COMPLETE):
  CONVERGENCE: → CL-12c (MMM/AIMC Integration)
  MAT Wave 13 should be complete or final verification stage

GATE E (CL-12c COMPLETE + CP-12 CLOSED):
  MAT: → Formal MAT closure authorized
  Track 1: → CL-13 → CL-14 → CL-15 sequence
  Roadmap: → Cross-reference audit → Deprecation Register → Formal decommission
```

### 5.2 Gating Points Summary

| Gate | Condition | Unlocks |
|------|-----------|---------|
| Gate A | CL-6 ✅ + CL-7 ✅ | CL-8 |
| Gate B | CL-8 ✅ + CL-7 ✅ | CL-9 |
| Gate C | CL-9 ✅ + CL-11 CP-11 ✅ | CL-12a |
| Gate D | CL-12b ✅ + MMM Stage 11 ✅ | CL-12c |
| Gate E | CL-12c ✅ + CP-12 ✅ | MAT closure + CL-13 start |
| Gate F | CL-13 ✅ + CL-14 ✅ | CL-15 |
| Gate G | CL-15 ✅ + MMM parity ✅ + CS2 auth | Roadmap formal decommission |

### 5.3 Blocking vs Non-Blocking Work Summary

| Work | Blocks MMM Prebuild? | Blocks MMM Build (stubs)? | Blocks MMM Build (live)? |
|------|---------------------|--------------------------|------------------------|
| CL-6 | NO | NO | YES (via CL-12c) |
| CL-7 | NO | NO | YES (via CL-12c) |
| CL-8 | NO | NO | YES (via CL-12c) |
| CL-9 | NO | NO | YES (via CL-12c) |
| CL-10 | NO | NO | YES (CI governance) |
| CL-11 completion | NO | NO | YES (via CL-12c) |
| CL-12a/b | NO | NO | YES (gateway to CL-12c) |
| MAT Wave 13 | NO | NO | YES (CL-12c-D3 verification) |
| CL-13/14/15 | NO | NO | NO (legacy retirement only) |
| Roadmap cross-ref audit | NO | NO | NO (decommission readiness only) |

---

## 6. Issue Breakdown Recommendation (D4)

### 6.1 Immediate CS2 Actions Required (Issue Suggestions)

| Recommended Issue | Type | Assignee Class | Priority | Sequencing |
|-------------------|------|----------------|----------|-----------|
| `[CS2] Authorize CL-7 wave-start — PersonaLoader Improvements` | CS2 Authorization | CS2 action | CRITICAL | Immediately parallel with CL-6 |
| `[CS2] Authorize CL-10 wave-start — Routing Governance CI Enforcement` | CS2 Authorization | CS2 action | HIGH | Immediately parallel with CL-6/7 |
| `[CS2] Authorize CL-11 D3+D4 completion — ARC approval endpoint (GAP-008) + episodic write path (GAP-009)` | CS2 Authorization | CS2 action | HIGH | Immediately parallel with CL-6/7/10 |
| `[CS2] Authorize MMM Stage 2 wave-start — UX Workflow & Wiring Spec` | CS2 Authorization | CS2 action | CRITICAL | Immediately parallel with CL-6 |
| `[CS2] Authorize MAT Wave 13 wave-start — Terminal Harvest` | CS2 Authorization | CS2 action | HIGH | After MMM Stage 2 auth |

### 6.2 Track 1 — Legacy Convergence Issues

| Recommended Issue | Assignee Class | Depends On | Notes |
|-------------------|----------------|-----------|-------|
| `[CL-6] LKIAC W3: Knowledge Re-ingestion — Foreman Delegation` | Foreman → qa-builder + api-builder | Already authorised | Execute immediately |
| `[CL-7] LKIAC-L3: PersonaLoader Improvements — Foreman Delegation` | Foreman → qa-builder + api-builder + integration-builder | CS2 wave-start | After CS2 auth |
| `[CL-10] Routing Governance CI Enforcement — Foreman Delegation` | Foreman → integration-builder | CS2 wave-start | After CS2 auth |
| `[CL-11-D3/D4] ARC Approval Endpoint + Episodic Write Path — Foreman Delegation` | Foreman → qa-builder + api-builder | CS2 scope confirmation | After CS2 auth |
| `[CL-8] Domain Specialist Knowledge Routing — Foreman Delegation` | Foreman → qa-builder + integration-builder | Gate A (CL-6 + CL-7) | After Gate A |
| `[CL-9] AIMC Audit Phase B — Persona Domain Review — Foreman Delegation` | Foreman → 4 specialist agents | Gate B (CL-8 + CL-7) | After Gate B |
| `[CL-12a] AIMC Foundation Re-Verification — Foreman Delegation` | Foreman → qa-builder + integration-builder | Gate C (CL-9 + CL-11) | After Gate C |
| `[CL-12b-1 through CL-12b-7] Module Integration Waves (7 issues)` | Foreman → api-builder + integration-builder | CL-12a | Sequential, 7 issues |
| `[CL-13] AMC API Contract — Foreman Delegation` | Foreman → governance-liaison-isms-agent | Gate A (CL-8) | After Gate A (CL-8) |
| `[CL-14] AIMC Governance Certification — Foreman Delegation` | Foreman → governance-liaison-isms-agent | Gate E + CL-10 + CL-7 | After CL-12 |
| `[CL-15] Legacy Component Decommission — Foreman Delegation` | Foreman → governance-liaison-isms-agent + builders | Gate F (CL-13 + CL-14) | Final gate |

### 6.3 Track 2 — MMM Prebuild Issues

| Recommended Issue | Assignee Class | Depends On | Notes |
|-------------------|----------------|-----------|-------|
| `[MMM Stage 5 Clean-Up] Architecture.md consistency corrections` | Foreman → governance-liaison-isms-agent | CS2 auth (advisory only) | Run parallel with Stage 2 |
| `[MMM Stage 2] UX Workflow & Wiring Spec` | Foreman → ui-builder + governance-liaison-isms-agent | CS2 wave-start | First MMM prebuild wave |
| `[MMM Stage 3] Functional Requirements Specification` | Foreman → mat-specialist + governance-liaison-isms-agent | Stage 2 COMPLETE | Enumerate MAT + Roadmap capabilities |
| `[MMM Stage 4] Technical Requirements Specification` | Foreman → api-builder + schema-builder | Stage 3 COMPLETE | Include AIMC API surface |
| `[MMM Stage 5 Full] Architecture` | Foreman → api-builder + schema-builder | Stage 3 COMPLETE | System + data architecture |
| `[MMM Stage 6] QA-to-Red` | Foreman → qa-builder | Stages 3+5 COMPLETE | Full RED test suite |
| `[MMM Stage 7] PBFAG` | Foreman | Stage 6 COMPLETE | Architecture freeze confirmation |
| `[MMM Stage 8 Full] Implementation Plan` | Foreman | Stage 7 COMPLETE | Full wave breakdown |
| `[MMM Stage 9] Builder Checklist` | Foreman | Stage 8 COMPLETE | Checklist for all builders |
| `[MMM Stage 10] IAA Pre-Brief for Build` | Foreman → IAA | Stage 9 COMPLETE | Mandatory pre-brief for build start |
| `[MMM Stage 11] Builder Appointment` | Foreman | Stage 10 COMPLETE | Appoint all build wave builders |
| `[MMM Stage 12] Build — AI Stubs` | Foreman → ui-builder + api-builder + schema-builder + qa-builder | Stage 11 COMPLETE | All functionality, stubs for AI |

### 6.4 MAT Harvest Issues

| Recommended Issue | Assignee Class | Depends On | Notes |
|-------------------|----------------|-----------|-------|
| `[MAT Wave 13-A] Harvest Map and Ownership Transition Matrix` | Foreman → mat-specialist | CS2 wave-start | Parallel with MMM Stage 2 |
| `[MAT Wave 13-B] Migration Execution — Backend/API` | Foreman → api-builder | Wave 13-A COMPLETE | Port MAT API capabilities |
| `[MAT Wave 13-C] Migration Execution — UI Components` | Foreman → ui-builder | Wave 13-A COMPLETE | Port MAT UI components |
| `[MAT Wave 13-D] Test Migration and Closure Verification` | Foreman → qa-builder + mat-specialist | 13-B + 13-C COMPLETE | Port tests + verify completeness |

### 6.5 Convergence and Retirement Issues

| Recommended Issue | Assignee Class | Depends On | Notes |
|-------------------|----------------|-----------|-------|
| `[CL-12c] MMM/AIMC Integration Wave — Foreman Delegation` | Foreman → all builders | Gate D (CL-12b + MMM Stage 11) | Convergence point |
| `[MMM Closure] MAT Formal Closure — CP-12 Gate` | Foreman | CL-12c + CP-12 | Foreman sign-off + CS2 |
| `[Roadmap Decommission] Cross-Reference Audit` | Foreman → governance-liaison-isms-agent | After MMM parity confirmed | Audit all cross-refs |
| `[Roadmap Decommission] Deprecation Register Entry` | Foreman → governance-liaison-isms-agent | Cross-ref audit COMPLETE | Formal closure record |
| `[Roadmap Decommission] CS2 Formal Decommission Authorization` | CS2 action | All conditions met | Final decommission gate |

---

## 7. Concurrency Model Summary

### The Two-Track Model

```
TRACK 1 (Legacy Convergence)          TRACK 2 (MMM Prebuild)
━━━━━━━━━━━━━━━━━━━━━━━━━━━          ━━━━━━━━━━━━━━━━━━━━━
CL-6 (execute now)                    Stage 2 (auth needed)
CL-7 (auth needed, parallel)         │
CL-10 (auth needed, parallel)        │
CL-11 D3+D4 (auth needed)           │ Stage 3 (FRS)
     ↓                               │
Gate A ────────────────────────────── (no cross-dependency)
CL-8                                 │ Stage 4 (TRS)
     ↓                               │ Stage 5 (Architecture)
Gate B ────────────────────────────── (no cross-dependency)
CL-9 (9 parallel reviews)           │ Stage 6 (QA-to-Red)
     ↓                               │ Stage 7 (PBFAG)
Gate C ────────────────────────────── (no cross-dependency)
CL-12a → CL-12b (sequential)        │ Stage 8 (Impl Plan)
                                     │ Stage 9 (Checklist)
                                     │ Stage 10 (Pre-Brief)
                                     │ Stage 11 (Appoint)
                                     │ Stage 12 (Build/stubs)
                                     │
Gate D ══════════════════════════════╪══ CONVERGENCE
                  CL-12c: MMM/AIMC Integration Wave
                             ↓
              Gate E: CL-12c COMPLETE + CP-12
                    ↙                    ↘
        MAT Formal Closure         CL-13 → CL-14 → CL-15
        Roadmap Decommission       (Legacy Retirement)
```

### Key Principles

1. **Stages 2–11 of MMM prebuild have ZERO hard dependencies on AIMC/LKIAC work** — they run fully in parallel
2. **AI stubs allow MMM Stage 12 (build) to run in parallel** with the final CL-12a/12b sequence
3. **CL-12c is the single convergence point** — both tracks must reach their gates before it starts
4. **MAT harvest runs in parallel** with MMM prebuild, targeting completion before CL-12c
5. **CL-13/14/15 (legacy retirement) are post-convergence** — they do not block MMM operation
6. **Foreman must issue separate CS2 wave-start requests** for each parallel track item

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Produced by**: foreman-v2-agent v6.2.0  
**Session**: session-mmm-cpa-20260408  
**Analysis document**: `modules/MMM/analysis/aimc-lkiac-mmm-concurrency-analysis.md`  
**Stage 8 Status**: PARTIAL — concurrent programme plan only; full implementation plan pending Stages 3–7 completion
