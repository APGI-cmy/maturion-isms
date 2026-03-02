# AIMC + LKIAC Combined Waved Execution Plan

**Document Type**: Foreman POLC Planning Output — Combined Execution Roadmap  
**Status**: DRAFT — Awaiting CS2 Review and Wave-Start Authorisation  
**Version**: 1.4.0  
**Date**: 2026-03-01  
**Produced By**: foreman-v2-agent v6.2.0 (session 075, Wave COMBINED-PLAN)  
**Amendment v1.2.0**: v1.2.0 — 2026-03-01: CL-3-D2 gap resolution — added CL-3.5, extended CL-13 QA module scope (session-079).  
**Amendment v1.3.0**: v1.3.0 — 2026-03-01: CL-13 scope extended per kick-off issue — D5/D6/D7 added for QA modules (GAP-001/002/003 resolution, session-080).  
**Amendment v1.4.0**: v1.4.0 — 2026-03-01: Wave CL-0 and CL-1 status updated to COMPLETE; FAIL-ONLY-ONCE registry version corrected to v1.9.0; next workstream steps documented (session-082, progress tracker reconciliation).  
**Triggering Issue**: [maturion-isms#704](https://github.com/APGI-cmy/maturion-isms/issues/704)  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Location**: `governance/EXECUTION/AIMC_LKIAC_COMBINED_EXECUTION_PLAN.md`

---

## Key Source Documents

| Document | Location | Version | Role in This Plan |
|---|---|---|---|
| LKIAC-001 Strategy | `maturion/strategy/LEGACY_KNOWLEDGE_INTEGRATION_AND_ARCHITECTURE_CONSOLIDATION_STRATEGY.md` (governance repo) | 1.0.0 | Primary source — LKIAC Waves 1–7 |
| AIMC Phase 1 Audit & Test Plan | `governance/AUDIT/AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md` | 1.0.0 | Primary source — AIMC audit phases A–E |
| AIMC Strategy (canonical) | `governance/canon/AIMC_STRATEGY.md` | 1.0.0 | Constitutional authority for AIMC scope |
| AIMC Agent Assignment Wave Plan | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` | 0.2.0 | Wave execution rules, agent roster |
| MATURION AIMC Strategy | `maturion/strategy/MATURION_AI_MANAGEMENT_CENTRE_STRATEGY.md` (governance repo) | 1.0.0 | Upstream AIMC strategy |
| Wave 9 Functionality Audit | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` | 1.0.0 | AIMC gap inventory |
| FAIL-ONLY-ONCE Registry | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | 1.8.0 | Institutional learning constraints |
| Triggering Issue | [maturion-isms#704](https://github.com/APGI-cmy/maturion-isms/issues/704) | — | Wave-start authorisation source |

---

## 1. Executive Summary

This document is the **authoritative combined execution roadmap** for all remaining AIMC and LKIAC work. It supersedes the AIMC Audit & Test Plan (§9 execution sequence) and the LKIAC-001 standalone wave sequence for scheduling purposes. Both source documents remain the authoritative definitions for their respective test and task specifications — this plan governs the combined ordering and dependencies.

### 1.1 The Two Programmes

**AIMC (AI Management Centre)** — `governance/canon/AIMC_STRATEGY.md` v1.0.0  
The centralised AI capability platform for the Maturion ISMS ecosystem. Waves 1–11 delivered the core platform. Remaining work covers: foundation audit, 7 unwired modules, knowledge upload centre, persona improvements, governance certification, and effectiveness metrics.

**LKIAC (Legacy Knowledge Integration and Architecture Consolidation)** — LKIAC-001 v1.0.0  
The strategy for migrating valuable legacy assets from `apps/maturion-maturity-legacy/` into the governed AIMC architecture, and for establishing the correct architectural boundary between the App Management Centre (AMC) and the ISMS monorepo. Covers:

| LKIAC Wave | Title | Priority |
|---|---|---|
| Wave 1 | Maturion persona migration → `packages/ai-centre/agents/` | HIGH |
| Wave 2 | Legacy knowledge inventory + domain tagging plan | HIGH |
| Wave 3 | Knowledge re-ingestion into AIMC `ai_knowledge` table | HIGH |
| Wave 4 | Domain specialist knowledge routing (source-filtered queries) | MEDIUM |
| Wave 5 | Deprecation register activation + legacy component audit | MEDIUM |
| Wave 6 | App Management Centre (AMC) API contract definition | MEDIUM |
| Wave 7 | Legacy component decommission | LOW |

### 1.2 Why Combined Sequencing

LKIAC prerequisite work must complete before AIMC audit phases can produce accurate verdicts:

- **AIMC Audit Phase B** (persona domain review) requires the Maturion persona to be migrated into the AIMC (LKIAC Wave 1) and PersonaLoader improvements in place (LKIAC-L3)
- **AIMC Audit Phase B** also requires the knowledge base to be populated with migrated knowledge (LKIAC Waves 2–3) so specialists can assess domain coverage
- **Domain specialist routing** (LKIAC Wave 4) must be live before module integration waves (AIMC Phase C) — modules wired without knowledge routing would be integrated against an incomplete AIMC
- **AIMC Phase C** (module integration) requires the knowledge upload centre to be operational (AIMC Wave CL-10) and routing governance in place (LKIAC-L4)
- Running AIMC audit phases before LKIAC work would audit an incomplete state, producing findings that LKIAC will remediate — wasting audit cycles

### 1.3 Sequencing Principle

> **LKIAC asset migration (persona, knowledge) comes first — before any AIMC audit or module integration.**  
> **AIMC foundation audit runs in parallel with early LKIAC preparation waves.**  
> **Domain specialist routing must be live before module integration begins.**  
> **Legacy component decommission is the last gate — never before verified equivalents.**

---

## 2. Wave Roster

All waves supervised by `foreman-v2-agent`. No wave may begin without CS2 wave-start authorisation for that wave.

### Builder Agents (inherited from AAWP + LKIAC-001)

| Agent | Primary Role in This Plan |
|---|---|
| `qa-builder` | RED gate test suites, test execution, quality certification for all implementation waves |
| `api-builder` | Persona migration, PersonaLoader improvements, knowledge upload endpoint, migration script |
| `schema-builder` | Schema RLS audit, migration rollback assessment, knowledge schema review |
| `integration-builder` | CI checks (routing governance, persona registry sync), module wiring, domain routing tests |
| `governance-liaison-isms-agent` | Governance documents, knowledge inventory, ARC protocol, deprecation register, AAWP amendments, AMC (App Management Centre) contract |
| `mat-specialist` | Knowledge inventory audit, domain tagging validation, T-E-001/T-E-006/T-E-007 persona reviews |
| `pit-specialist` | T-E-002/T-E-005 persona reviews |
| `risk-platform-agent` | T-E-003/T-E-004 persona reviews |
| `maturity-scoring-agent` | T-E-008 persona review |
| `independent-assurance-agent` | FAIL-ONLY-ONCE registry audit, IAA wave handover audits |
| `foreman-v2-agent` | Wave coordination, quality professor evaluation, merge gate — no implementation |

---

## 3. Wave Execution Rules

All waves execute under the rules defined in `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md §3` and LKIAC-001 §8 governance principles. Key rules:

1. **Sequential gate compliance**: Each wave may not start until its entry criteria are met.
2. **Architecture primacy**: Frozen architecture documents govern each wave.
3. **QA-to-Red before code**: Every implementation wave requires RED gate tests before any builder receives an implementation task.
4. **100% GREEN gate**: All tests must pass 100% GREEN, zero skipped, zero stubs before a wave closes.
5. **CS2 approval checkpoints**: Execution pauses at every declared checkpoint until CS2 approval is recorded.
6. **IAA audit**: Every wave producing or modifying repo content requires IAA independent audit before merge gate release.
7. **No knowledge discarded** (LKIAC-001 §8 Principle 1): All legacy assets must be migrated before the legacy source is decommissioned.
8. **No legacy component removed without verified equivalent** (LKIAC-001 §8 Principle 3): Deprecation Register governs all decommissions.
9. **No Foreman implementation** (FAIL-ONLY-ONCE A-001): Foreman delegates all implementation.

---

## 4. Combined Wave Plan

The following 16 waves (CL-0 through CL-15) constitute the full combined AIMC + LKIAC execution roadmap.

> **How to read each wave**: Programme tag (**LKIAC** / **AIMC** / **Both**), source document reference, type, objective, entry/exit criteria, deliverables, dependencies, RED gate, CS2 checkpoint, and responsible agents.

---

### Wave CL-0: Governance Foundation

**Status: COMPLETE — 2026-03-01** (CL-0-D1: GRS CS2 sign-off recorded; CL-0-D2: AAWP v0.3.0 merged with Wave 9 sign-off and Combined Plan reference — session-075, IAA-session-023-20260301-PASS)

**Programme**: Both  
**Source**: AIMC Audit Plan §3.2 (GOV-005, GOV-006); LKIAC-001 §5  
**Type**: Administrative governance — no code changes  

**Objective**: Confirm all prerequisite governance artefacts are current and CS2-signed before any execution waves begin. Canonise LKIAC-001 reference in this combined plan.

**Entry Criteria**: CS2 authorisation for this combined plan.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-0-D1 | GRS v0.1.0 → v1.0.0: CS2 sign-off recorded (resolves GOV-005) | `governance-liaison-isms-agent` | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` §10 |
| CL-0-D2 | AAWP v0.2.0 → v0.3.0: Wave 9 sign-off + combined plan reference recorded (resolves GOV-006) | `governance-liaison-isms-agent` | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` |

**Exit Criteria**: CL-0-D1 and CL-0-D2 merged with CS2 sign-off recorded.

**Dependencies**: None.

**RED Gate**: N/A.

**CS2 Checkpoint (CP-0)**: CS2 approves GRS and AAWP amendments.

**Responsible Agent**: `governance-liaison-isms-agent`

---

### Wave CL-1: LKIAC Wave 1 — Maturion Persona Migration

**Status: COMPLETE — 2026-03-01** (CL-1-D1: 5 RED gate tests → GREEN; CL-1-D2: maturion-advisor.md created at `packages/ai-centre/src/agents/`; CL-1-D3: AIMC_PERSONA_LIFECYCLE.md §2 registry updated to v1.1.0; 226/226 tests GREEN — session-078, IAA-session-027-20260301-PASS)

**Programme**: LKIAC  
**Source**: LKIAC-001 §5 Wave 1; §2.1; §3.2  
**Type**: Implementation — RED gate → api-builder → GREEN  
**Priority**: HIGH (LKIAC-001 §5 Wave 1)

**Objective**: Extract and migrate the Maturion agent persona from `apps/maturion-maturity-legacy/src/agents/maturion/prompts/system.md` into the governed AIMC persona store at `packages/ai-centre/agents/maturion-advisor.md`. Register in the AIMC agent registry.

**Entry Criteria**: CL-0 closed.

**Architecture**: Frozen per `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` v1.0.1. Target path: `packages/ai-centre/agents/maturion-advisor.md` with standard YAML front-matter.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-1-D1 | RED gate test: `PersonaLoader.test.ts` — test that `maturion-advisor` persona loads successfully and all YAML front-matter fields are present and non-empty | `qa-builder` | `packages/ai-centre/src/personas/PersonaLoader.test.ts` |
| CL-1-D2 | `packages/ai-centre/agents/maturion-advisor.md` — Maturion AI consultant persona file with YAML front-matter (`agentId: maturion-advisor`, `module: isms-core`, `version`, `last_reviewed`, `owner`, `description`) and reviewed/updated persona content aligned to AIMC domain taxonomy | `api-builder` | `packages/ai-centre/agents/maturion-advisor.md` |
| CL-1-D3 | AIMC Persona Lifecycle registry updated: `maturion-advisor` added to `AIMC_PERSONA_LIFECYCLE.md §2` | `governance-liaison-isms-agent` | `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` |

**Exit Criteria**:
- CL-1-D1 RED before migration
- All tests GREEN after implementation: `maturion-advisor` persona loadable via `PersonaLoader.load('maturion-advisor')`
- YAML front-matter present and complete
- Persona Registry updated

**Dependencies**: CL-0 ✅

**RED Gate**: `qa-builder` produces CL-1-D1 (failing) BEFORE `api-builder` creates CL-1-D2.

**CS2 Checkpoint (CP-1)**: CS2 reviews persona content in CL-1-D2 before activation (per LKIAC-001 §5 Wave 1 gate).

**Responsible Agents**: `qa-builder` (RED gate), `api-builder` (persona file), `governance-liaison-isms-agent` (registry)

---

### Wave CL-2: LKIAC Wave 2 — Legacy Knowledge Inventory and Domain Tagging Plan

**Programme**: LKIAC  
**Source**: LKIAC-001 §5 Wave 2; §7  
**Type**: Audit/research — produces planning documents  
**Priority**: HIGH (LKIAC-001 §5 Wave 2)  
**Parallel With**: CL-1 (no interdependency)

**Objective**: Enumerate all knowledge chunks in the legacy Supabase project (`dmhlxhatogrrrvuruayv`). Map legacy labels to the AIMC domain taxonomy. Produce the domain-tagging mapping document required before knowledge re-ingestion (CL-5) can begin.

**Entry Criteria**: CL-0 closed.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-2-D1 | Legacy knowledge inventory: total row count, label distribution, schema of legacy knowledge table | `mat-specialist` | `.agent-workspace/audit/LKIAC-W2-legacy-inventory-{date}.md` |
| CL-2-D2 | Domain tagging mapping document: maps each legacy label to AIMC `source` field values (`iso27001`, `nist`, `pci-dss`, `soc2`, `risk-management`, `general`; extended per findings) | `mat-specialist` | `.agent-workspace/audit/LKIAC-W2-domain-tag-map-{date}.md` |
| CL-2-D3 | Extended source taxonomy: any additional domain tags required beyond LKIAC-001 §7.3 baseline | `governance-liaison-isms-agent` | Appended to CL-2-D2 |

**Exit Criteria**:
- CL-2-D1: Legacy row count and schema documented
- CL-2-D2: Every legacy label mapped to an AIMC `source` tag; unmappable labels flagged for CS2 decision
- CL-2-D3: Extended taxonomy proposed if needed

**Dependencies**: CL-0 ✅

**RED Gate**: N/A (inventory/research wave).

**CS2 Checkpoint (CP-2)**: CS2 reviews and signs off the domain tagging mapping (CL-2-D2) before migration (CL-5) may begin (per LKIAC-001 §5 Wave 2 gate).

**Responsible Agents**: `mat-specialist` (inventory + mapping), `governance-liaison-isms-agent` (taxonomy)

---

### Wave CL-3: LKIAC Wave 5 — Deprecation Register Activation and Legacy Component Audit

**Programme**: LKIAC  
**Source**: LKIAC-001 §5 Wave 5; §6 Deprecation Register  
**Type**: Governance audit — produces documentation  
**Priority**: MEDIUM  
**Parallel With**: CL-1, CL-2 (no interdependencies)

**Objective**: Formally complete the Deprecation Register for all `maturion-maturity-legacy` components. Map each to its App Management Centre (AMC) or AIMC equivalent. Identify gaps (components with no current equivalent) and create tracking issues.

**Entry Criteria**: CL-0 closed.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-3-D1 | Completed Deprecation Register: all components in LKIAC-001 §6 assessed with current status (`ACTIVE` / `PARALLEL-RUN` / `SUPERSEDED` / `DECOMMISSIONED`), AMC equivalent confirmed or gap flagged | `governance-liaison-isms-agent` | `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` |
| CL-3-D2 | Gap issues: GitHub issues in `maturion-isms` for any legacy component with no current AMC equivalent | `governance-liaison-isms-agent` | maturion-isms issues tracker |

**Exit Criteria**:
- All 12 components in LKIAC-001 §6 have a recorded status and gate condition
- Gap issues created for all unmatched components

**Dependencies**: CL-0 ✅

**RED Gate**: N/A.

**CS2 Checkpoint (CP-3)**: CS2 reviews and signs off the Deprecation Register (CL-3-D1) per LKIAC-001 §5 Wave 5 gate.

**Responsible Agent**: `governance-liaison-isms-agent`

---

### Wave CL-3.5: AIMC Data Sources Registry — Schema, Edge Functions, Admin UI

**Programme**: LKIAC (AIMC schema extension — GAP-004 resolution)  
**Source**: LKIAC-001 §6 DEP-008; CL-3-D2 gap resolution; `governance/aimc/LKIAC_CL3_D2_GAP_RESOLUTION.md`  
**Type**: Implementation — RED gate → schema-builder + api-builder + ui-builder → GREEN  
**Priority**: MEDIUM (must complete before CL-8 domain routing wave)

**Objective**: Deliver the AIMC data source registry that supersedes the legacy
`DataSourcesManagement.tsx` component (DEP-008). Create a new `ai_data_sources` Supabase table
with RLS, migrate all 4 legacy Edge Functions into the governed AIMC functions directory, and
deliver an AIMC data source management UI or admin panel.

**Entry Criteria**:
- CL-3 closed (Deprecation Register complete; GAP-004 resolution recorded in CL-3-D2)
- CP-3.5 issued: CS2 approves data sources schema specification before schema-builder builds

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-3.5-D1 | RED gate test suite: tests for `ai_data_sources` schema (RLS, CRUD) and all 4 Edge Functions (connect, sync, query, test-api) | `qa-builder` | `packages/ai-centre/supabase/functions/` test files |
| CL-3.5-D2 | Supabase migration `007_ai_data_sources.sql` (or next sequential number): `ai_data_sources` table schema with RLS policies | `schema-builder` | `packages/ai-centre/supabase/migrations/` |
| CL-3.5-D3 | Edge Function migration ×4: `connect-data-source`, `sync-data-source`, `query-data-source`, `test-data-sources-api` migrated to `packages/ai-centre/supabase/functions/` | `api-builder` | `packages/ai-centre/supabase/functions/` |
| CL-3.5-D4 | AIMC data source management UI or admin API panel wired to migrated Edge Functions | `ui-builder` | `packages/ai-centre/src/` or designated admin module |
| CL-3.5-D5 | Deprecation Register updated: DEP-008 status → `PARALLEL-RUN`, Foreman/AIMC Equivalent confirmed | `governance-liaison-isms-agent` | `governance/aimc/LKIAC_DEPRECATION_REGISTER.md` |

**Exit Criteria**:
- CL-3.5-D2 migration applied: `ai_data_sources` table with RLS enabled
- All 4 Edge Functions migrated (CL-3.5-D3)
- Admin UI/panel built and wired (CL-3.5-D4)
- 100% GREEN test gate: all tests passing, zero stubs, zero skipped
- DEP-008 status updated to `PARALLEL-RUN`

**Dependencies**: After CL-3 ✅; before CL-8 (domain routing wave)

**RED Gate**: `qa-builder` produces CL-3.5-D1 (all tests failing RED) BEFORE `schema-builder`
creates CL-3.5-D2 or `api-builder` begins Edge Function migration (CL-3.5-D3).

**CS2 Checkpoint (CP-3.5)**: CS2 approves the `ai_data_sources` schema specification (CL-3.5-D2
design) before schema-builder builds. Ensures architectural alignment with AIMC strategy before
any migration is applied.

**Responsible Agents**: `qa-builder` (RED gate + test suite), `schema-builder` (migration),
`api-builder` (Edge Function migration), `ui-builder` (admin UI/panel),
`governance-liaison-isms-agent` (register update CL-3.5-D5)

---

### Wave CL-4: AIMC Audit Phase A — Foundation Verification

**Programme**: AIMC Audit  
**Source**: AIMC Audit Plan §4.1–§4.3 (Categories A, B, C); §9 Phase A  
**Type**: Audit/QA — test execution and governance review  
**Parallel With**: CL-1, CL-2, CL-3 (after CL-0)

**Objective**: Verify the full AIMC foundation is correctly implemented and tested. Covers implementation completeness (Category A), governance alignment (Category B), and strategic objectives (Category C).

**Entry Criteria**:
- CL-0 closed
- Current test suite: 430 tests, 100% GREEN (Wave 11 state as of 2026-03-01)

**Deliverables**:

| ID | Test/Deliverable | Assigned To | Evidence Path |
|---|---|---|---|
| CL-4-D1 | Category A (T-A-001 to T-A-012): Full test run, stub detection, schema CI evidence | `qa-builder` (T-A-001 to T-A-011), `integration-builder` (T-A-012) | `.agent-workspace/audit/AIMC-P1-test-run-{date}.txt`, `.agent-workspace/audit/AIMC-P1-stub-detection-{date}.txt` |
| CL-4-D2 | Category B (T-B-001 to T-B-010): GRS traceability, direct import scan, key hardcoding scan, RLS audit | `qa-builder` (T-B-001, T-B-004 to T-B-008, T-B-010), `schema-builder` (T-B-002, T-B-003, T-B-009) | `.agent-workspace/audit/AIMC-P1-GRS-traceability-{date}.md`, `.agent-workspace/audit/AIMC-P1-provider-import-scan-{date}.txt` |
| CL-4-D3 | Category C (T-C-001 to T-C-010): Strategic objective attestation | `qa-builder` (T-C-001 to T-C-009), `integration-builder` (T-C-010), `schema-builder` (T-C-006) | `.agent-workspace/audit/AIMC-P1-strategic-attestation-{date}.md` |
| CL-4-D4 | FAIL-ONLY-ONCE registry audit: T-G-006 — breach registry compliance and A-014 operationalisation | `independent-assurance-agent` | `.agent-workspace/audit/AIMC-P1-process-review-{date}.md` |

**Parallel Tracks** (all run simultaneously after CL-0):
- Track A-1: `qa-builder` — Categories A + B (non-schema) + C
- Track A-2: `schema-builder` — Category B (DB: T-B-002, T-B-003, T-B-009)
- Track A-3: `independent-assurance-agent` — T-G-006

**Exit Criteria**:
- 430+ tests, 100% GREEN, zero stubs
- GRS traceability matrix complete
- Strategic objectives all PASS or PARTIAL with documented gap
- Direct provider import scan: zero results in `modules/` and `apps/`
- FAIL-ONLY-ONCE registry: all incidents REMEDIATED

**Dependencies**: CL-0 ✅

**RED Gate**: `qa-builder` to add new RED gate tests for any gaps exposed (e.g. T-A-010 Wave 9.11 if not yet covered).

**CS2 Checkpoint (CP-4)**: CS2 reviews Phase A QP verdict before proceeding to CL-6.

**Responsible Agents**: `qa-builder` (primary), `schema-builder`, `integration-builder`, `independent-assurance-agent`

---

### Wave CL-5: Knowledge Upload Centre Specification

**Programme**: AIMC  
**Source**: AIMC Audit Plan §8 (Knowledge Upload Centre gap); GAP-007; T-D-001 to T-D-006  
**Type**: Governance specification — produces documentation  
**Parallel With**: CL-1, CL-2, CL-3, CL-4 (after CL-0)

**Objective**: Produce the `AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` defining the governed ongoing upload mechanism for `ai_knowledge` entries. This specification governs the upload API endpoint (built in CL-10) and is distinct from the one-time LKIAC knowledge migration script (built in CL-6).

**Entry Criteria**: CL-0 closed.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-5-D1 | `AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md`: upload API spec (`POST /api/ai/knowledge/upload`), auth gate (service role), ARC trigger, batch upload spec, CS2 approval mechanism, relationship to LKIAC migration | `governance-liaison-isms-agent` | `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` |
| CL-5-D2 | Upload endpoint architecture review (T-D-006) — current state survey of `api/ai/` endpoints | `api-builder` | `.agent-workspace/audit/AIMC-P1-upload-arch-review-{date}.md` |

**Exit Criteria**:
- CL-5-D1 produced, QP-reviewed, and merged
- CL-5-D2 confirms architecture documented

**Dependencies**: CL-0 ✅

**RED Gate**: N/A.

**CS2 Checkpoint (CP-5)**: CS2 approves specification before CL-10 (upload endpoint implementation) begins.

**Responsible Agents**: `governance-liaison-isms-agent` (spec), `api-builder` (architecture review)

---

### Wave CL-6: LKIAC Wave 3 — Knowledge Re-ingestion

**Programme**: LKIAC  
**Source**: LKIAC-001 §5 Wave 3; §7  
**Type**: Implementation — RED gate → api-builder → GREEN  
**Priority**: HIGH (LKIAC-001 §5 Wave 3)

**Objective**: Migrate all knowledge embeddings from the legacy Supabase project (`dmhlxhatogrrrvuruayv`) into the AIMC `ai_knowledge` table. Re-embed content using the AIMC vector model (1536-dim, OpenAI-compatible). Validate migration. Decommission legacy Supabase project after verified row count match.

**Entry Criteria**:
- CL-2 closed (domain tagging mapping approved by CS2)
- CL-4 closed (AIMC schema audit confirmed `ai_knowledge` columns correct)

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-6-D1 | RED gate tests: migration validation test suite — tests for row count match (≥ legacy count), per-domain row counts, embedding dimension check (1536), `approval_status = 'pending'` on migrated rows | `qa-builder` | `packages/ai-centre/src/migrations/` or equivalent |
| CL-6-D2 | Migration script (TypeScript): reads from legacy Supabase project, re-embeds using AIMC vector model, inserts into `ai_knowledge` with correct `organisation_id` and `source` tags per CL-2-D2 mapping | `api-builder` | `packages/ai-centre/scripts/migrate-legacy-knowledge.ts` |
| CL-6-D3 | Semantic search validation: minimum 10 queries per domain return relevant results post-migration (per LKIAC-001 §7.4) | `qa-builder` | `.agent-workspace/audit/LKIAC-W3-semantic-validation-{date}.md` |
| CL-6-D4 | Migration report: row counts (legacy vs AIMC), per-domain counts, semantic search results, confirmation migration complete | `api-builder` | `.agent-workspace/audit/LKIAC-W3-migration-report-{date}.md` |

**Exit Criteria**:
- CL-6-D1 RED before migration script execution
- All tests GREEN after migration
- `ai_knowledge` row count ≥ legacy Supabase row count
- Semantic search validation: all 6 domain areas returning relevant results
- Migration report complete

**Dependencies**: CL-2 ✅, CL-4 ✅

**RED Gate**: `qa-builder` produces CL-6-D1 (failing) BEFORE `api-builder` receives migration task.

**CS2 Checkpoint (CP-6)**: CS2 reviews migration report (CL-6-D4) and signs off before legacy Supabase decommission (per LKIAC-001 §5 Wave 3 gate). **Decommission of `dmhlxhatogrrrvuruayv` requires explicit CS2 authorisation.**

**Responsible Agents**: `qa-builder` (RED gate + semantic validation), `api-builder` (migration script)

---

### Wave CL-7: LKIAC-L3 — PersonaLoader Improvements

**Programme**: LKIAC  
**Source**: AIMC Audit Plan §7.1 (PS-GL-001, PS-GL-002); GAP-002, GAP-003; LKIAC-001 §8 Principle 6  
**Type**: Implementation — RED gate → api-builder + integration-builder → GREEN

**Objective**: Implement runtime YAML front-matter validation in `PersonaLoader.ts` with a typed `PersonaValidationError`. Add CI checks for persona registry sync and quarterly freshness review. Resolves GAP-002, GAP-003, GOV-003, GOV-004.

**Entry Criteria**: CL-4 closed (current PersonaLoader state verified as baseline).

**Architecture**: Frozen per `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` v1.0.1. `PersonaLoader.ts` at `packages/ai-centre/src/personas/PersonaLoader.ts`.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-7-D1 | RED gate test: `PersonaValidationError` thrown on missing/invalid YAML fields (PS-GL-001) | `qa-builder` | `packages/ai-centre/src/personas/PersonaLoader.test.ts` |
| CL-7-D2 | RED gate test: persona registry sync CI check integration test (PS-GL-002) | `qa-builder` | CI integration test |
| CL-7-D3 | Implementation: `PersonaValidationError` type + runtime YAML front-matter validation in `PersonaLoader.ts` (GAP-002, GAP-003) | `api-builder` | `packages/ai-centre/src/personas/PersonaLoader.ts` |
| CL-7-D4 | CI check: persona registry (`AIMC_PERSONA_LIFECYCLE.md §2`) in sync with actual persona files on disk (GOV-003) | `integration-builder` | `.github/workflows/` |
| CL-7-D5 | Scheduled workflow: flag overdue quarterly persona reviews based on `last_reviewed` YAML field (GOV-004, PS-GL-003) | `integration-builder` | `.github/workflows/` |

**Exit Criteria**:
- CL-7-D1 and CL-7-D2 RED before implementation
- All tests GREEN after implementation
- `PersonaLoader.load()` throws `PersonaValidationError` for missing YAML fields
- CI persona registry sync check active
- Zero new deprecation or linter warnings

**Dependencies**: CL-4 ✅

**RED Gate**: `qa-builder` produces CL-7-D1 and CL-7-D2 (failing) BEFORE `api-builder` and `integration-builder` receive tasks.

**CS2 Checkpoint (CP-7)**: CS2 reviews QP verdict before CL-8.

**Responsible Agents**: `qa-builder`, `api-builder`, `integration-builder`

---

### Wave CL-8: LKIAC Wave 4 — Domain Specialist Knowledge Routing

**Programme**: LKIAC  
**Source**: LKIAC-001 §5 Wave 4; §3.3; §8 Principle 6  
**Type**: Implementation — RED gate → integration-builder → GREEN  
**Priority**: MEDIUM (LKIAC-001 §5 Wave 4)

**Objective**: Configure AIMC domain specialists to query the correct knowledge subset from `ai_knowledge` using `source`-filtered semantic search. Each specialist must be updated to retrieve domain-relevant knowledge before module integration (CL-11) goes live.

**Entry Criteria**:
- CL-6 closed (knowledge migrated — knowledge base populated with domain-tagged rows)
- CL-7 closed (PersonaLoader validated — specialist persona loading is reliable)

**Architecture**: Domain specialist routing queries `ai_knowledge` filtered by `source` field per CL-2-D2 domain tag mapping.

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-8-D1 | RED gate tests: integration tests verifying each domain specialist returns results filtered by its declared `source` tags (e.g. `mat-advisor` returns `iso27001` / `nist` results, not `pci-dss` / `soc2`) | `qa-builder` | Domain specialist test files |
| CL-8-D2 | Updated domain specialist routing: `source`-filtered semantic search queries for all 8 advisor personas | `integration-builder` | `packages/ai-centre/src/` routing layer |
| CL-8-D3 | Integration test: per-domain search test set — minimum 10 queries per domain area return relevant results (aligns with LKIAC-001 §7.4 semantic validation) | `qa-builder` | Integration test suite |

**Exit Criteria**:
- CL-8-D1 RED before routing implementation
- All tests GREEN after implementation
- Each domain specialist returns domain-relevant knowledge only
- Integration test set passes: 10+ queries per domain area

**Dependencies**: CL-6 ✅, CL-7 ✅

**RED Gate**: `qa-builder` produces CL-8-D1 (failing) BEFORE `integration-builder` receives routing task.

**CS2 Checkpoint (CP-8)**: IAA audit and CS2 review of routing integration tests before CL-9.

**Responsible Agents**: `qa-builder`, `integration-builder`

---

### Wave CL-9: AIMC Audit Phase B — Persona Domain Accuracy Review

**Programme**: AIMC Audit  
**Source**: AIMC Audit Plan §4.5 (Category E — T-E-001 to T-E-008); §9 Phase B  
**Type**: Domain specialist review — attestation artefacts

**Objective**: Each of the 9 AIMC advisor personas (8 original + `maturion-advisor` from CL-1) is reviewed by its assigned domain specialist for domain accuracy, now that the knowledge base is populated (CL-6) and domain routing is live (CL-8).

**Entry Criteria**:
- CL-1 closed (Maturion persona migrated and CS2-approved)
- CL-7 closed (PersonaLoader improvements in place)
- CL-8 closed (domain specialist routing live — specialists can assess domain coverage against actual knowledge)

**Deliverables**:

| Test ID | Persona | Assigned Reviewer | Evidence Path |
|---|---|---|---|
| T-E-001 | `mat-advisor` — ISO 27001, maturity scoring, audit lifecycle | `mat-specialist` | `.agent-workspace/audit/AIMC-P1-persona-review-mat-advisor-{date}.md` |
| T-E-002 | `pit-advisor` — project implementation, WRAC, task generation | `pit-specialist` | `.agent-workspace/audit/AIMC-P1-persona-review-pit-advisor-{date}.md` |
| T-E-003 | `risk-advisor` — risk assessment, threat analysis, control effectiveness | `risk-platform-agent` | `.agent-workspace/audit/AIMC-P1-persona-review-risk-advisor-{date}.md` |
| T-E-004 | `xdetect-advisor` — anomaly detection, IOC analysis, incident triage | `risk-platform-agent` | `.agent-workspace/audit/AIMC-P1-persona-review-xdetect-advisor-{date}.md` |
| T-E-005 | `incident-intelligence-advisor` — incident analysis, TTP correlation | `pit-specialist` | `.agent-workspace/audit/AIMC-P1-persona-review-incident-intelligence-advisor-{date}.md` |
| T-E-006 | `isms-navigator` — ISMS programme management, cross-module strategy | `mat-specialist` | `.agent-workspace/audit/AIMC-P1-persona-review-isms-navigator-{date}.md` |
| T-E-007 | `course-crafter-advisor` — instructional design, ISMS learning content | `mat-specialist` | `.agent-workspace/audit/AIMC-P1-persona-review-course-crafter-advisor-{date}.md` |
| T-E-008 | `maturity-roadmap-advisor` — roadmap generation, remediation planning | `maturity-scoring-agent` | `.agent-workspace/audit/AIMC-P1-persona-review-maturity-roadmap-advisor-{date}.md` |
| T-E-009 | `maturion-advisor` — cross-domain ISMS consultant (ISO 27001, NIST, PCI DSS, SOC 2) | `mat-specialist` | `.agent-workspace/audit/AIMC-P1-persona-review-maturion-advisor-{date}.md` |

**Parallel Tracks**:
- Track B-1: `mat-specialist` — T-E-001, T-E-006, T-E-007, T-E-009
- Track B-2: `pit-specialist` — T-E-002, T-E-005
- Track B-3: `risk-platform-agent` — T-E-003, T-E-004
- Track B-4: `maturity-scoring-agent` — T-E-008

**Exit Criteria**:
- All 9 persona domain accuracy attestation artefacts produced
- Any accuracy failures issued as remediation orders to `api-builder` via Foreman
- All personas pass with PASS or PASS-WITH-MINOR-NOTES verdict

**Dependencies**: CL-1 ✅, CL-7 ✅, CL-8 ✅

**RED Gate**: N/A (review wave).

**CS2 Checkpoint (CP-9)**: CS2 reviews all 9 persona attestations as a batch before proceeding to CL-10.

**Responsible Agents**: `mat-specialist`, `pit-specialist`, `risk-platform-agent`, `maturity-scoring-agent`

---

### Wave CL-10: LKIAC-L4 — Routing Governance CI Enforcement

**Programme**: LKIAC  
**Source**: AIMC Audit Plan §3.2 (GOV-001, GOV-002); T-B-001, T-C-010; FAIL-ONLY-ONCE S-002  
**Type**: CI governance — RED gate → integration-builder → GREEN

**Objective**: Machine-enforce GRS-016 (no direct AI provider imports in module code) at the CI merge gate level. Implement stub detection CI check. This resolves GOV-001, GOV-002, and FAIL-ONLY-ONCE S-002.

**Entry Criteria**: CL-4 closed (direct import scan baseline established — confirms current clean state).

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-10-D1 | RED gate test: CI check integration test — test that a PR with `import { OpenAI }` in module code fails the gate | `qa-builder` | CI check integration test |
| CL-10-D2 | CI merge gate check: detect direct provider import patterns (`import { OpenAI }`, `import Anthropic`) in `modules/` and `apps/` (excluding `maturion-maturity-legacy`) — fails PR on match (GOV-001, GOV-002, T-C-010) | `integration-builder` | `.github/workflows/` |
| CL-10-D3 | CI merge gate check: detect `expect(true).toBe(true)` stub patterns anywhere in test suite — fails PR on match (FAIL-ONLY-ONCE S-002) | `integration-builder` | `.github/workflows/` |

**Exit Criteria**:
- CL-10-D1 RED before implementation
- CL-10-D2 and CL-10-D3 active and tested GREEN (zero violations in current codebase)
- T-B-001 and T-C-010 audit requirements now covered by automated enforcement

**Dependencies**: CL-4 ✅

**RED Gate**: `qa-builder` produces CL-10-D1 (failing) BEFORE `integration-builder` implements CI checks.

**CS2 Checkpoint (CP-10)**: CS2 reviews CI check implementation QP verdict.

**Responsible Agents**: `qa-builder`, `integration-builder`

---

### Wave CL-11: Knowledge Upload Centre + ARC Operationalisation

**Programme**: AIMC Audit Phase D  
**Source**: AIMC Audit Plan §8; §4.4 (T-D-001 to T-D-006); GAP-007, GAP-008, GAP-009  
**Type**: Implementation + audit — RED gate → api-builder → GREEN

**Objective**: Implement `POST /api/ai/knowledge/upload` endpoint (per CL-5-D1 specification). Operationalise the ARC Knowledge Promotion Protocol end-to-end. Resolve GAP-007, GAP-008, GAP-009.

**Entry Criteria**:
- CL-5 closed (specification approved by CS2)
- CL-6 closed (knowledge migrated — ARC protocol now governs ongoing additions)
- CL-10 closed (routing governance in place — new endpoint must not introduce direct provider calls)

**Architecture**: Frozen per `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` (CL-5-D1).

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-11-D1 | RED gate test: `POST /api/ai/knowledge/upload` test — sets `approval_status = 'pending'`, requires service role auth, returns correct schema | `qa-builder` | Upload endpoint test path |
| CL-11-D2 | Implementation: `POST /api/ai/knowledge/upload` endpoint per specification | `api-builder` | `api/ai/knowledge/upload.ts` |
| CL-11-D3 | ARC approval endpoint audit (GAP-008): `POST /api/ai/feedback/approve` enforces CS2-only access — 403 on unauthorised (T-G-002) | `qa-builder` | `api/ai/feedback/approve` test |
| CL-11-D4 | Episodic memory write path audit (GAP-009): records confirmed written to `ai_episodic_events` in production flow | `qa-builder` | `EpisodicMemoryAdapter.test.ts` + integration check |
| CL-11-D5 | Schema audit: T-D-001 — all `ai_knowledge` metadata columns present and correct | `schema-builder` | `.agent-workspace/audit/AIMC-P1-schema-audit-D001-{date}.md` |
| CL-11-D6 | ARC protocol review: T-D-002/T-D-005 — full protocol walkthrough, all steps confirmed actionable | `governance-liaison-isms-agent` | `.agent-workspace/audit/AIMC-P1-arc-review-{date}.md` |

**Exit Criteria**:
- CL-11-D1 RED before implementation
- All tests GREEN after implementation
- Upload endpoint live, auth-gated, sets `approval_status = 'pending'`
- GAP-008 resolved: ARC approval endpoint returns 403 for unauthorised callers
- GAP-009 resolved: episodic write path confirmed
- Schema audit T-D-001 PASS

**Dependencies**: CL-5 ✅, CL-6 ✅, CL-10 ✅

**RED Gate**: `qa-builder` produces CL-11-D1 and CL-11-D3 (failing) BEFORE `api-builder` receives implementation tasks.

**CS2 Checkpoint (CP-11)**: CS2 approves upload endpoint before module integration (CL-12) begins.

**Responsible Agents**: `qa-builder`, `api-builder`, `schema-builder`, `governance-liaison-isms-agent`

---

### Wave CL-12: AIMC Audit Phase C — Module Integration (7 Modules)

**Programme**: AIMC Audit  
**Source**: AIMC Audit Plan §4.6 (Category F — T-F-001 to T-F-007); AAWP Waves 9.6–9.9  
**Type**: Implementation — RED gate → integration-builder → GREEN (per module)

**Objective**: Wire the 7 remaining ISMS modules to the AIMC gateway. Each module receives wiring invariant tests (RED) before implementation (GREEN), matching the MAT wiring pattern from Wave 9.6.

**Entry Criteria**:
- CL-9 closed (all persona domain reviews complete — module personas validated before wiring)
- CL-11 closed (knowledge upload centre operational, ARC live — wired modules can populate knowledge base and route queries correctly)

**Sub-Waves** (parallel tracks; each requires separate CS2 wave-start authorisation):

#### Sub-Wave CL-12a: PIT + XDetect Module Integration

| ID | Deliverable | Agent | Location |
|---|---|---|---|
| CL-12a-D1 | RED gate: PIT wiring invariant tests (T-F-001) | `qa-builder` | `modules/pit/tests/wiring-invariants/` |
| CL-12a-D2 | RED gate: XDetect wiring invariant tests (T-F-002) | `qa-builder` | `modules/xdetect/tests/wiring-invariants/` |
| CL-12a-D3 | PIT AIMC wiring: `capability: 'analysis'`, `agent: 'pit-advisor'` | `integration-builder` | `modules/pit/` |
| CL-12a-D4 | XDetect AIMC wiring: `capability: 'algorithm-execution'`, `agent: 'xdetect-advisor'` | `integration-builder` | `modules/xdetect/` |

#### Sub-Wave CL-12b: Risk Management + Course Crafter Module Integration

| ID | Deliverable | Agent | Location |
|---|---|---|---|
| CL-12b-D1 | RED gate: Risk Management wiring invariant tests (T-F-003) | `qa-builder` | `modules/risk-management/tests/wiring-invariants/` |
| CL-12b-D2 | RED gate: Course Crafter wiring invariant tests (T-F-004) | `qa-builder` | `modules/course-crafter/tests/wiring-invariants/` |
| CL-12b-D3 | Risk Management AIMC wiring: `capability: 'analysis'`, `agent: 'risk-advisor'` | `integration-builder` | `modules/risk-management/` |
| CL-12b-D4 | Course Crafter AIMC wiring: `capability: 'image-generation'` + `'document-generation'`, `agent: 'course-crafter-advisor'` | `integration-builder` | `modules/course-crafter/` |

#### Sub-Wave CL-12c: ISMS Navigator + Incident Intelligence + Maturity Roadmap Integration

| ID | Deliverable | Agent | Location |
|---|---|---|---|
| CL-12c-D1 | RED gate: ISMS Navigator wiring invariant tests (T-F-005) | `qa-builder` | `modules/isms/tests/wiring-invariants/` |
| CL-12c-D2 | RED gate: Incident Intelligence wiring invariant tests (T-F-006) | `qa-builder` | `modules/incident-intelligence/tests/wiring-invariants/` |
| CL-12c-D3 | RED gate: Maturity Roadmap wiring invariant tests (T-F-007) | `qa-builder` | `modules/maturity-roadmap/tests/wiring-invariants/` |
| CL-12c-D4 | ISMS Navigator AIMC wiring | `integration-builder` | `modules/isms/` |
| CL-12c-D5 | Incident Intelligence AIMC wiring | `integration-builder` | `modules/incident-intelligence/` |
| CL-12c-D6 | Maturity Roadmap AIMC wiring | `integration-builder` | `modules/maturity-roadmap/` |

**Exit Criteria** (per sub-wave, then collectively):
- All RED gate tests exist and fail before implementation starts
- All tests GREEN after implementation
- All 8 modules wired (M-001 metric = 8/8 = 100%)
- Direct import CI check (CL-10-D2) passes for all newly wired modules
- Zero new deprecation or linter warnings per sub-wave

**Dependencies**: CL-9 ✅, CL-11 ✅

**RED Gate**: `qa-builder` produces ALL RED gate tests per sub-wave BEFORE `integration-builder` receives tasks.

**CS2 Checkpoints (CP-12a, CP-12b, CP-12c)**: CS2 issues separate wave-start authorisation for each sub-wave. Sub-waves may proceed in parallel if CS2 authorises.

**Responsible Agents**: `qa-builder` (all RED gates), `integration-builder` (wiring per module)

---

### Wave CL-13: LKIAC Wave 6 — App Management Centre (AMC) API Contract Definition

**Programme**: LKIAC  
**Source**: LKIAC-001 §5 Wave 6; §3.5; §4  
**Type**: Governance document — produces canonical contract  
**Priority**: MEDIUM (LKIAC-001 §5 Wave 6)

**Objective**: Define the formal API and governance event contract between the App Management Centre (AMC) and the AIMC. Create `governance/canon/FOREMAN_ISMS_INTEGRATION_CONTRACT.md` and canonise it. This establishes the architectural boundary described in LKIAC-001 §4.

> **CL-13 Extended Scope (CL-3-D2, 2026-03-01)**: CL-13 scope is extended to include delivery of
> three QA-facing modules in the Foreman Office App, resolving DEP-005, DEP-006, and DEP-007 gap
> items. These are sub-modules of the CL-13 health/watchdog module delivery:
> - **QA Overview panel** (DEP-005 / GAP-001): Shows live QA signal status for all active modules
> - **Unified QA Signal Aggregation view** (DEP-006 / GAP-002): Aggregates QA signal data from ≥2 configured signal sources
> - **Health module test results sub-view** (DEP-007 / GAP-003): Displays test execution history and status
>
> See `governance/aimc/LKIAC_CL3_D2_GAP_RESOLUTION.md` for rationale and acceptance criteria.

> **CL-13 Extended Scope (CL-3-D2, 2026-03-01)**: CL-13 scope is extended to include delivery of
> three QA-facing modules in the Foreman Office App, resolving DEP-005, DEP-006, and DEP-007 gap
> items. These are sub-modules of the CL-13 health/watchdog module delivery:
> - **QA Overview panel** (DEP-005 / GAP-001): Shows live QA signal status for all active modules
> - **Unified QA Signal Aggregation view** (DEP-006 / GAP-002): Aggregates QA signal data from ≥2 configured signal sources
> - **Health module test results sub-view** (DEP-007 / GAP-003): Displays test execution history and status
>
> See `governance/aimc/LKIAC_CL3_D2_GAP_RESOLUTION.md` for rationale and acceptance criteria.

**Entry Criteria**:
- CL-8 closed (AIMC domain specialist routing live — the API surface AMC will consume is stable)

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-13-D1 | AIMC API surface definition for AMC — which AIMC endpoints AMC may call, with schemas | `governance-liaison-isms-agent` | `governance/canon/FOREMAN_ISMS_INTEGRATION_CONTRACT.md` §2 |
| CL-13-D2 | Governance event schema — layer-down/layer-up event format for AMC ↔ ISMS communication | `governance-liaison-isms-agent` | `governance/canon/FOREMAN_ISMS_INTEGRATION_CONTRACT.md` §3 |
| CL-13-D3 | Supabase RLS rules governing AMC data access | `schema-builder` | `governance/canon/FOREMAN_ISMS_INTEGRATION_CONTRACT.md` §4 |
| CL-13-D4 | `governance/canon/FOREMAN_ISMS_INTEGRATION_CONTRACT.md` — complete canonical document (per LKIAC-001 §9 success criterion) | `governance-liaison-isms-agent` | `governance/canon/FOREMAN_ISMS_INTEGRATION_CONTRACT.md` |
| CL-13-D5 | QA Overview Panel — Live QA signal status view in Foreman Office App; resolves DEP-005 (GAP-001) | `ui-builder` | Foreman Office App — QA Overview panel module |
| CL-13-D6 | Unified QA Signal Aggregation View — Multi-source QA signal aggregation in Foreman Office App; resolves DEP-006 (GAP-002) | `api-builder` + `ui-builder` | Foreman Office App — Unified QA Signal Aggregation view |
| CL-13-D7 | Health Module Test Results Sub-view — Test execution history and status display in health module; resolves DEP-007 (GAP-003) | `api-builder` + `ui-builder` | Foreman Office App — health module test results sub-view |

**Exit Criteria**:
- CL-13-D4 produced, QP-reviewed, and canonised
- Contract covers: AIMC API surface, governance event schema, Supabase RLS rules, architectural boundary confirmation
- CL-13-D5 accepted: Foreman Office App delivers QA Overview panel showing live QA signal status for all active modules, verified against QADashboard.tsx functionality checklist
- CL-13-D6 accepted: Foreman Office App delivers unified QA aggregation view consuming QA signal data from ≥2 configured signal sources, verified against UnifiedQADashboard.tsx functional scope
- CL-13-D7 accepted: Health module includes test results sub-view showing test execution history and current status, verified against QATestDashboard.tsx scope

**Dependencies**: CL-8 ✅

**RED Gate**: N/A (governance deliverables D1–D4); `qa-builder` must supply RED gate test suite for D5/D6/D7 QA module deliverables before `ui-builder` and `api-builder` begin implementation.

**CS2 Checkpoint (CP-13)**: CS2 reviews and canonises `FOREMAN_ISMS_INTEGRATION_CONTRACT.md` (per LKIAC-001 §5 Wave 6 gate).

**Responsible Agents**: `governance-liaison-isms-agent`, `schema-builder`, `api-builder`, `ui-builder`

---

### Wave CL-14: AIMC Governance Certification + AAWP Update

**Programme**: AIMC Audit  
**Source**: AIMC Audit Plan §3.2 (GOV-005); `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md`  
**Type**: Governance document — no code changes

**Objective**: Update the AIMC Governance Certification to cover Waves 9.1–9.11, Wave 10, Wave 11, and all CL-* waves. Update AAWP to v0.4.0 recording this combined plan as the official execution record. Resolves GOV-005.

**Entry Criteria**:
- CL-12 fully closed (all 7 modules wired)
- CL-10 closed (routing governance CI enforcement active)
- CL-7 closed (PersonaLoader improvements)

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-14-D1 | `AIMC_GOVERNANCE_CERTIFICATION.md` updated to cover Waves 9.1–9.11, Wave 10, Wave 11, and CL-1 through CL-13 | `governance-liaison-isms-agent` | `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` |
| CL-14-D2 | AAWP v0.4.0: records this combined plan as official execution record for all CL-* waves | `governance-liaison-isms-agent` | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` |

**Exit Criteria**: Both documents updated and CS2-signed.

**Dependencies**: CL-12 ✅, CL-10 ✅, CL-7 ✅

**RED Gate**: N/A.

**CS2 Checkpoint (CP-14)**: CS2 signs off Governance Certification and AAWP.

**Responsible Agent**: `governance-liaison-isms-agent`

---

### Wave CL-15: LKIAC Wave 7 — Legacy Component Decommission + Final Audit Closure

**Programme**: LKIAC + AIMC Audit Phase E  
**Source**: LKIAC-001 §5 Wave 7; §6 Deprecation Register; AIMC Audit Plan §4.7–§4.8 (Categories G, H); §9 Phase E  
**Type**: Decommission + audit/reporting — final closure wave

**Objective**: Decommission all superseded legacy components confirmed in CL-3. Establish AIMC effectiveness metrics baseline. Produce the AIMC Effectiveness Report. This wave closes both the LKIAC programme and the AIMC Phase 1 Audit cycle.

**Entry Criteria**:
- CL-3 closed (Deprecation Register: all components assessed)
- CL-13 closed (AMC (App Management Centre) integration contract defined — equivalents confirmed)
- CL-14 closed (Governance Certification updated)
- AMC parity confirmed for all `SUPERSEDED` components (per LKIAC-001 §5 Wave 7 gate)

**Deliverables**:

| ID | Deliverable | Assigned To | Location |
|---|---|---|---|
| CL-15-D1 | Legacy component decommission: all `SUPERSEDED` components removed from `apps/maturion-maturity-legacy/` routes; archived or deleted per Deprecation Register (per LKIAC-001 §8 Principle 3) | `api-builder` | `apps/maturion-maturity-legacy/` |
| CL-15-D2 | Process testing: T-G-001, T-G-003, T-G-004, T-G-005 (persona cadence, key rotation, migration rollback, AAWP sign-off) | `governance-liaison-isms-agent` (T-G-001, T-G-005), `api-builder` (T-G-003), `schema-builder` (T-G-004) | `.agent-workspace/audit/AIMC-P1-process-review-{date}.md` |
| CL-15-D3 | Metrics baseline (M-001 to M-008): all effectiveness metrics established with recorded values | `mat-specialist` (M-002, M-007), `governance-liaison-isms-agent` (M-003, M-004), `qa-builder` (M-005), `api-builder` (M-006), `integration-builder` (M-008) | `.agent-workspace/audit/AIMC-P1-metrics-baseline-{date}.md` |
| CL-15-D4 | AIMC + LKIAC Effectiveness Report: synthesises all audit category results, LKIAC success criteria (LKIAC-001 §9), metrics, and outstanding items into a formal effectiveness assessment | `governance-liaison-isms-agent` | `governance/AUDIT/AIMC_LKIAC_P1_EFFECTIVENESS_REPORT_{date}.md` |

**Exit Criteria**:
- All `SUPERSEDED` components decommissioned (no active user-facing routes removed without verified AMC equivalent — LKIAC-001 §5 Wave 7 zero-tolerance check)
- All Category G process tests completed and evidenced
- All Category H metrics baselined with actual values
- Effectiveness Report produced and CS2-approved
- All audit items from `governance/AUDIT/AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md` closed or formally deferred with CS2 sign-off
- All LKIAC-001 §9 success criteria met

**Dependencies**: CL-3 ✅, CL-13 ✅, CL-14 ✅ (Foreman parity confirmed)

**RED Gate**: `qa-builder` must run a zero-tolerance pre-decommission check — no active routes removed without AMC equivalent confirmed.

**CS2 Checkpoint (CP-15)**: CS2 authorises each individual decommission action (per LKIAC-001 §8 Principle 3). CS2 signs off Effectiveness Report — closes full AIMC + LKIAC programme.

**Responsible Agents**: `governance-liaison-isms-agent` (report), `api-builder` (decommission + T-G-003), `mat-specialist`, `qa-builder`, `schema-builder`, `integration-builder`

---

## 5. Master Dependency Graph and Sequencing

```
CL-0 (Governance Foundation)
  ├──→ CL-1  (LKIAC W1: Persona Migration)          ─┐
  ├──→ CL-2  (LKIAC W2: Knowledge Inventory)         ├─ all parallel after CL-0
  ├──→ CL-3  (LKIAC W5: Deprecation Register)        │
  ├──→ CL-4  (AIMC Audit Phase A: Foundation)        │
  └──→ CL-5  (Knowledge Upload Centre Spec)          ─┘

CL-3 complete:
  └──→ CL-3.5 (AIMC Data Sources Registry)           sequential after CL-3; before CL-8

CL-2 + CL-4 complete:
  └──→ CL-6  (LKIAC W3: Knowledge Re-ingestion)      ─┐ sequential after CL-2+CL-4

CL-4 complete:
  └──→ CL-7  (PersonaLoader Improvements)            ─┤ sequential after CL-4
  └──→ CL-10 (Routing Governance CI checks)          ─┘ sequential after CL-4

CL-6 + CL-7 complete:
  └──→ CL-8  (LKIAC W4: Domain Specialist Routing)   sequential after CL-6+CL-7

CL-1 + CL-7 + CL-8 complete:
  └──→ CL-9  (AIMC Audit Phase B: Persona Review)    sequential after CL-1+CL-7+CL-8

CL-5 + CL-6 + CL-10 complete:
  └──→ CL-11 (Knowledge Upload Centre Implementation) sequential after CL-5+CL-6+CL-10

CL-9 + CL-11 complete:
  └──→ CL-12 (AIMC Audit Phase C: Module Integration)
       ├─ CL-12a (PIT + XDetect)         ─┐
       ├─ CL-12b (Risk + CourseCrafter)  ├─ parallel sub-waves (each requires CS2 wave-start)
       └─ CL-12c (ISMS+Incidents+Roadmap)─┘

CL-8 complete:
  └──→ CL-13 (LKIAC W6: AMC Contract)       can run parallel with CL-9/CL-11

CL-12 + CL-10 + CL-7 complete:
  └──→ CL-14 (Governance Certification + AAWP Update)

CL-3 + CL-13 + CL-14 complete (+ Foreman parity):
  └──→ CL-15 (LKIAC W7: Legacy Decommission + Final Closure)
```

**Critical Path**: CL-0 → CL-2 → CL-6 → CL-8 → CL-9 → CL-11 → CL-12 → CL-14 → CL-15  
**Parallel acceleration**: CL-1 ∥ CL-2 ∥ CL-3 ∥ CL-4 ∥ CL-5 (all after CL-0); CL-12a ∥ CL-12b ∥ CL-12c; CL-13 can run parallel with CL-9

---

## 6. LKIAC-001 Wave Cross-Reference

| LKIAC-001 Wave | Combined Plan Wave | Note |
|---|---|---|
| LKIAC Wave 1 — Persona Migration | CL-1 | Persona content review also in CL-9 (T-E-009) |
| LKIAC Wave 2 — Knowledge Inventory | CL-2 | Domain tagging plan feeds CL-6 |
| LKIAC Wave 3 — Knowledge Re-ingestion | CL-6 | One-time migration; ongoing uploads via CL-11 |
| LKIAC Wave 4 — Domain Specialist Routing | CL-8 | Builds on CL-6 knowledge base |
| LKIAC Wave 5 — Deprecation Register | CL-3 | Feeds CL-15 decommission |
| LKIAC Wave 6 — AMC Contract | CL-13 | Requires CL-8 routing stable |
| LKIAC Wave 7 — Legacy Decommission | CL-15 (D1) | Combined with effectiveness report closure |

## 7. AIMC Audit Plan Phase Cross-Reference

| AIMC Audit Phase | Combined Plan Wave | Note |
|---|---|---|
| Phase A — Foundation Verification | CL-4 | Parallel with LKIAC early waves |
| Phase B — Persona Domain Review | CL-9 | After persona migration + PersonaLoader + routing |
| Phase C — Module Integration | CL-12 | After domain routing and knowledge upload centre |
| Phase D — Knowledge Upload Centre | CL-5 (spec) + CL-11 (implementation) | Spec early; implementation after LKIAC knowledge migration |
| Phase E — Metrics + Effectiveness | CL-15 | Final wave, after all modules wired |

---

## 8. Gap Cross-Reference Table

| Gap/Gov ID | Description | Resolved By | Wave |
|---|---|---|---|
| GAP-001 | 7 modules not wired | Wiring invariant tests + implementation | CL-12a/b/c |
| GAP-002 | PersonaLoader no YAML validation | `PersonaValidationError` + validation | CL-7 |
| GAP-003 | `PersonaValidationError` not typed | Typed error in PersonaLoader | CL-7 |
| GAP-004 | Wave 9.11 Legacy Escape audit | T-A-010 execution | CL-4 |
| GAP-005 | GRS never CS2-signed | GRS sign-off | CL-0 |
| GAP-006 | AAWP Wave 9 CS2 sign-off missing | AAWP amendment | CL-0 |
| GAP-007 | No Knowledge Upload Centre | Upload spec + endpoint | CL-5, CL-11 |
| GAP-008 | ARC approval endpoint audit needed | T-G-002 test | CL-11 |
| GAP-009 | Episodic memory write path audit | Write path check | CL-11 |
| GAP-010 | No scheduled CI persona freshness | Scheduled workflow | CL-7 |
| GOV-001 | GRS-016 not CI-enforced | CI direct import check | CL-10 |
| GOV-002 | No CI lint for direct imports | CI grep check | CL-10 |
| GOV-003 | No persona registry sync CI check | CI check | CL-7 |
| GOV-004 | No quarterly persona review workflow | Scheduled workflow | CL-7 |
| GOV-005 | Governance Certification Wave 8 only | Certification update | CL-14 |
| S-002 | Stub detection CI check | CI grep check | CL-10 |
| PS-GL-001 | PersonaLoader YAML validation | `PersonaValidationError` | CL-7 |
| PS-GL-002 | CI persona registry sync | CI check | CL-7 |
| PS-GL-003 | Quarterly persona review | Scheduled workflow | CL-7 |
| LKIAC-SC-1 | Maturion persona not in AIMC | Persona migration | CL-1 |
| LKIAC-SC-2 | Legacy knowledge not migrated | Knowledge re-ingestion | CL-2, CL-6 |
| LKIAC-SC-3 | Legacy Supabase not decommissioned | Decommission after validation | CL-6 (gate) |
| LKIAC-SC-4 | Domain specialists not routing knowledge | Domain specialist routing | CL-8 |
| LKIAC-SC-5 | Deprecation Register not formalised | Deprecation register activation | CL-3 |
| LKIAC-SC-6 | AMC integration contract absent | Contract definition | CL-13 |
| LKIAC-SC-6 | Foreman App integration contract absent | Contract definition | CL-13 |
| DEP-GAP-001 | DEP-005 QA Dashboard — no target equivalent (resolved CL-3-D2) | Foreman Office App QA Overview panel | CL-13 (extended scope) |
| DEP-GAP-002 | DEP-006 Unified QA Dashboard — no target equivalent (resolved CL-3-D2) | Foreman Office App Unified QA Signal Aggregation view | CL-13 (extended scope) |
| DEP-GAP-003 | DEP-007 QA Test Dashboard — no target equivalent (resolved CL-3-D2) | Foreman Office App health module test results sub-view | CL-13 (extended scope) |
| DEP-GAP-004 | DEP-008 Data Sources Management — no AIMC schema or wave (resolved CL-3-D2) | AIMC data source registry (ai_data_sources table + 4 Edge Functions + admin UI) | CL-3.5 (new wave) |

---

## 9. RED Gate Requirements Summary

| Wave | RED Gate Scope | Assigned To |
|---|---|---|
| CL-1 | Maturion persona loading test | `qa-builder` |
| CL-6 | Knowledge migration validation tests | `qa-builder` |
| CL-7 | PersonaValidationError test + persona registry CI test | `qa-builder` |
| CL-8 | Domain specialist source-filtered routing tests | `qa-builder` |
| CL-10 | Direct provider import CI check integration test | `qa-builder` |
| CL-11 | Upload endpoint test + ARC approval endpoint test | `qa-builder` |
| CL-12a | PIT + XDetect wiring invariant tests | `qa-builder` |
| CL-12b | Risk + Course Crafter wiring invariant tests | `qa-builder` |
| CL-12c | ISMS + Incident Intelligence + Maturity Roadmap wiring tests | `qa-builder` |
| CL-15 | Pre-decommission zero-tolerance check | `qa-builder` |

---

## 10. CS2 Approval Checkpoints Summary

| CP | Gate | After Wave | Action Required |
|---|---|---|---|
| CP-0 | GRS + AAWP amendment sign-off | CL-0 | CS2 approves governance artefacts |
| CP-1 | Maturion persona content review | CL-1 | CS2 approves persona before activation |
| CP-2 | Domain tagging mapping approval | CL-2 | CS2 approves legacy label → AIMC source map |
| CP-3 | Deprecation Register sign-off | CL-3 | CS2 approves all component assessments |
| CP-3.5 | AIMC Data Sources Registry spec approval | CL-3.5 | CS2 approves data sources schema spec before schema-builder builds |
| CP-4 | Phase A foundation audit verdict | CL-4 | CS2 reviews QP verdict |
| CP-5 | Knowledge Upload Centre spec approval | CL-5 | CS2 approves spec before endpoint build |
| CP-6 | Knowledge migration report + decommission gate | CL-6 | CS2 authorises legacy Supabase decommission |
| CP-7 | PersonaLoader QP verdict | CL-7 | CS2 reviews QP verdict |
| CP-8 | Domain specialist routing QP verdict + IAA | CL-8 | CS2 reviews IAA audit |
| CP-9 | Persona domain accuracy batch review | CL-9 | CS2 reviews all 9 persona attestations |
| CP-10 | Routing governance CI QP verdict | CL-10 | CS2 reviews CI checks |
| CP-11 | Upload endpoint approval | CL-11 | CS2 approves before module wiring |
| CP-12a | Module wave-start: PIT + XDetect | Before CL-12a | CS2 authorises sub-wave |
| CP-12b | Module wave-start: Risk + CourseCrafter | Before CL-12b | CS2 authorises sub-wave |
| CP-12c | Module wave-start: ISMS + Incidents + Roadmap | Before CL-12c | CS2 authorises sub-wave |
| CP-13 | AMC (App Management Centre) contract canonisation | CL-13 | CS2 canonises integration contract |
| CP-14 | Governance Certification + AAWP sign-off | CL-14 | CS2 signs updated certification |
| CP-15 | Individual decommission authorisations + Effectiveness Report | CL-15 | CS2 authorises each decommission; signs off report |

---

## 11. Plan Update Protocol

1. **Minor updates** (clarifications, reference corrections): `governance-liaison-isms-agent` with Foreman QP review; CS2 review at next checkpoint.
2. **Scope changes** (new deliverables, resequencing, new waves): CS2 written authorisation before update.
3. **Wave completion records**: After each wave closes, Foreman adds **Status: COMPLETE — [date]** to that wave's header.
4. **LKIAC-001 updates**: If LKIAC-001 strategy is amended, `governance-liaison-isms-agent` must update LKIAC cross-references in §6 and issue a governance ripple per `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`.

---

## 12. Acceptance Criteria for This Plan

- [x] All 16 waves (CL-0 through CL-15) defined with objective, entry/exit criteria, deliverables, dependencies, responsible agents — **v1.2.0: CL-3.5 added (17 waves total); v1.3.0: CL-13 extended scope (D5/D6/D7 added)**
- [x] LKIAC-001 strategy canonical reference confirmed: `LEGACY_KNOWLEDGE_INTEGRATION_AND_ARCHITECTURE_CONSOLIDATION_STRATEGY.md` v1.0.0
- [x] All 7 LKIAC waves mapped to combined plan waves (§6)
- [x] All AIMC audit phases A–E mapped to combined plan waves (§7)
- [x] RED gate requirements specified for every implementation wave (§9)
- [x] All CS2 approval checkpoints identified: 17 checkpoints (§10) — **v1.2.0: CP-3.5 added (18 checkpoints total)**
- [x] Master dependency graph and critical path documented (§5)
- [x] All AIMC gaps (GAP-001 to GAP-010) mapped to resolving waves (§8)
- [x] All governance gaps (GOV-001 to GOV-005) mapped to resolving waves (§8)
- [x] All LKIAC success criteria (LKIAC-001 §9) mapped to resolving waves (§8 LKIAC-SC-* rows)
- [x] Plan update protocol defined (§11)
- [x] CS2 review and wave-start authorisation for Wave CL-0 — COMPLETE (individual wave authorisations via CS2-issued issues; CL-0 formally closed 2026-03-01)

---

## 13. References

| Document | Path / Location | Version |
|---|---|---|
| LKIAC-001 Strategy | `APGI-cmy/maturion-foreman-governance` → `maturion/strategy/LEGACY_KNOWLEDGE_INTEGRATION_AND_ARCHITECTURE_CONSOLIDATION_STRATEGY.md` | 1.0.0 |
| AIMC Phase 1 Audit & Test Plan | `governance/AUDIT/AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md` | 1.0.0 |
| AIMC Strategy (canonical) | `governance/canon/AIMC_STRATEGY.md` | 1.0.0 |
| AIMC Agent Assignment Wave Plan | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` | 0.2.0 |
| AIMC GRS | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | 0.1.0 |
| AIMC Persona Lifecycle | `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` | 1.0.1 |
| AIMC ARC Knowledge Promotion Protocol | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` | 1.0.0 |
| AIMC Governance Certification | `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` | Wave 8 |
| Wave 9 Functionality Audit | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` | 1.0.0 |
| MATURION AIMC Strategy | `maturion/strategy/MATURION_AI_MANAGEMENT_CENTRE_STRATEGY.md` (governance repo) | 1.0.0 |
| FAIL-ONLY-ONCE Registry | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | 1.9.0 |
| Triggering Issue | [maturion-isms#704](https://github.com/APGI-cmy/maturion-isms/issues/704) | — |
| Foreman Session Memory (session 075) | `.agent-workspace/foreman-v2/memory/session-075-wave-combined-plan-20260301.md` | — |
| PREHANDOVER Proof (session 075) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-075-wave-combined-plan-20260301.md` | — |

---

## 14. Current Workstream Status (as of 2026-03-01)

| Artefact | Current State | Next Step(s) | Responsible Agent | Blockers |
|---|---|---|---|---|
| CL-0: Governance Foundation | ✅ COMPLETE (2026-03-01) | None — gate closed | governance-liaison-isms-agent | None |
| CL-1: Maturion Persona Migration | ✅ COMPLETE (2026-03-01) | CP-1 CS2 review pending | qa-builder / api-builder / governance-liaison-isms-agent | Awaiting CP-1 CS2 sign-off |
| CL-2: Legacy Knowledge Inventory | ⏳ PENDING | mat-specialist to execute legacy Supabase audit | mat-specialist | CL-0 cleared; awaiting wave-start issue from CS2 |
| CL-3: Deprecation Register Activation | ⏳ PENDING | governance-liaison-isms-agent to produce LKIAC_DEPRECATION_REGISTER.md | governance-liaison-isms-agent | CL-0 cleared; awaiting wave-start issue from CS2 |
| CL-3.5: AI Data Sources Registry | ⏳ PENDING (PROPOSED — CP-3.5 awaiting CS2 approval) | qa-builder RED gate → schema-builder migration → api-builder Edge Functions | qa-builder / schema-builder / api-builder / ui-builder | CP-3.5 CS2 schema approval required before build begins |
| CL-4: AIMC Audit Phase A | ⏳ PENDING | qa-builder to execute T-A-001–T-C-010 audit suite | qa-builder / integration-builder / schema-builder | CL-0 cleared; awaiting wave-start issue from CS2 |
| CL-5: Knowledge Upload Centre Spec | ⏳ IN PROGRESS — v1.1.0 CP-5 decisions incorporated | CP-5 COMPLETE; awaiting CL-5-D2 upload arch review | api-builder (CL-5-D2) | CL-5-D2 (upload arch review) still outstanding |
| CL-6 through CL-15 | ⏳ PENDING | Per dependency chain §5 | Per §4 wave definitions | All blocked on CL-2–CL-5 completion |
| MAT Module | ✅ COMPLETE — Wave 12 COMPLETE (554/554 GREEN) | Awaiting AIMC CL waves for Waves 7–9 integration | foreman-v2-agent (oversight) | MAT Waves 7–9 blocked on AIMC CL-12 |

---

*Produced by foreman-v2-agent v6.2.0, session 075, under CS2 authority (Johan Ras / @APGI-cmy).*  
*This document is a POLC Planning Output. It does NOT constitute a wave closure or merge gate release.*  
*Wave execution may NOT begin for any wave until CS2 has reviewed this plan and issued formal wave-start authorisation for the specific wave(s).*  
*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | LKIAC-001 v1.0.0 | 2026-03-01*
