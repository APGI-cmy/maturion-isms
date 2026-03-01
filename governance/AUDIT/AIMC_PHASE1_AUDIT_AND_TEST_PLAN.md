# AIMC Phase 1 — Comprehensive Test & Improvement Plan

**Document Type**: Governance Audit Artefact — Foreman POLC Planning Output  
**Status**: FINAL — Awaiting CS2 Review  
**Version**: 1.0.0  
**Date**: 2026-02-28  
**Produced By**: foreman-v2-agent v6.2.0 (session 073, Wave AIMC-AUDIT-P1)  
**Triggering Issue**: [AIMC Audit Phase 1] Foreman compiles full AIMC implementation test & improvement plan  
**Authority**: CS2 (Johan Ras / @APGI-cmy)  
**Location**: `governance/AUDIT/AIMC_PHASE1_AUDIT_AND_TEST_PLAN.md`  

**Source Documents**:
- `governance/canon/AIMC_STRATEGY.md` v1.0.0  
- `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md`  
- `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` v1.0.0  
- `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` v1.0.1  
- `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` v1.0.0  
- `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md`  
- `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md`  
- `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` v0.2.0  
- `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md`  
- `governance/aimc/AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md`  
- `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md`  
- `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md`  

---

## 1. Executive Summary

The Maturion AI Management Centre (AIMC) has completed its initial full implementation across Waves 1–10, plus Wave 9 sub-waves (9.1–9.11). The test suite currently stands at **425 tests, 100% GREEN, zero failures, zero skipped** (as of Wave 9.10 closure, session-071-20260228).

This plan provides:
1. A complete **implementation completeness audit** — what is done, what is not, and where the gaps remain
2. An **effectiveness test strategy** — how to verify the AIMC achieves its stated strategic aims
3. A **governance alignment review** — how to verify all canonical governance documents are met
4. A **distributed multi-agent audit assignment** — who audits what, with what expected output
5. A **parking station review** — all deferred improvements relevant to AIMC
6. **Evidence and artifact requirements** for each section

This plan is the entry point for the next audit cycle. It is not itself an audit verdict — it is the commissioning document for the distributed multi-agent audit wave.

---

## 2. Current Implementation State Summary

### 2.1 Core Package — `packages/ai-centre/`

| Component | Status | Test Coverage | Wave |
|---|---|---|---|
| Gateway (`AICentre.ts`) | ✅ COMPLETE | `gateway/AICentre.test.ts` | Wave 3 |
| CapabilityRouter | ✅ COMPLETE | `routing/CapabilityRouter.test.ts` | Wave 2–3 |
| ProviderHealthRegistry | ✅ COMPLETE | `routing/ProviderHealthRegistry.test.ts` | Wave 2 |
| GitHubModelsAdapter | ✅ COMPLETE | `adapters/ProviderAdapter.contract.test.ts` | Wave 3 |
| OpenAIAdapter (advisory, embeddings, algo) | ✅ COMPLETE | `adapters/ProviderAdapter.contract.test.ts`, `OpenAIAdapter.embeddings.test.ts` | Wave 4–8 |
| AnthropicAdapter | ✅ COMPLETE | `adapters/ProviderAdapter.contract.test.ts` | Wave 6 |
| PerplexityAdapter | ✅ COMPLETE | `adapters/ProviderAdapter.contract.test.ts` | Wave 7 |
| RunwayAdapter | ✅ COMPLETE | `adapters/ProviderAdapter.contract.test.ts`, `wave8-cst.test.ts` | Wave 8 |
| SessionMemoryStore | ✅ COMPLETE | `memory/SessionMemoryStore.test.ts` | Wave 2 |
| PersistentMemoryAdapter | ✅ COMPLETE | `memory/PersistentMemoryAdapter.test.ts` | Wave 3–5 |
| EpisodicMemoryAdapter | ✅ COMPLETE | `memory/EpisodicMemoryAdapter.test.ts`, `EpisodicMemorySchema.test.ts` | Wave 9.1/9.3 |
| MemoryLifecycle (context assembly) | ✅ COMPLETE | `memory/MemoryLifecycle.test.ts`, `.rag.test.ts` | Wave 4–5 |
| KnowledgeRetrieverImpl (ARC-filtered) | ✅ COMPLETE | `memory/KnowledgeRetrieverApproval.test.ts` | Wave 9.5 |
| FeedbackPipeline | ✅ COMPLETE | `feedback/FeedbackPipeline.test.ts` | Wave 9.4 |
| PersonaLoader | ✅ COMPLETE | `personas/PersonaLoader.test.ts`, `wave9.10-persona-lifecycle.test.ts` | Wave 7, 9.10 |
| ProviderKeyStore | ✅ COMPLETE | `keys/ProviderKeyStore.test.ts` | Wave 1 |
| TelemetryWriter | ✅ COMPLETE | `telemetry/TelemetryWriter.test.ts` | Wave 3 |
| AI Gateway Serverless Handler (`api/ai/request.ts`) | ✅ COMPLETE | `api/ai/request.test.ts` | Wave 6 gap |
| AI Gateway Health Endpoint (`api/ai/health.ts`) | ✅ COMPLETE | `api/ai/health.test.ts` | Wave 10 |

### 2.2 Database Schema — `packages/ai-centre/supabase/migrations/`

| Migration | Purpose | Status |
|---|---|---|
| `001_ai_memory.sql` | `ai_memory` table — Supabase-backed persistent memory | ✅ APPLIED |
| `002_ai_telemetry.sql` | `ai_telemetry` table — immutable audit trail | ✅ APPLIED |
| `003_ai_knowledge.sql` | `ai_knowledge` table — RAG knowledge base | ✅ APPLIED |
| `004_ai_episodic_memory.sql` | `ai_episodic_events` table — immutable episodic event log | ✅ APPLIED |
| `005_ai_feedback_pipeline.sql` | `ai_feedback_events` table — ARC-gated feedback pipeline | ✅ APPLIED |
| `006_ai_knowledge_metadata.sql` | `ai_knowledge` metadata amendment (`domain`, `module`, `standard_ref`, `freshness_date`, `approval_status`) | ✅ APPLIED |

### 2.3 Governance Documents — `governance/aimc/`

| Document | Status | Latest Version |
|---|---|---|
| `AIMC_CAPABILITY_DESCRIPTION.md` (ACD) | ACTIVE | Latest |
| `AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` (GRS) | DRAFT (CS2 sign-off pending) | 0.1.0 |
| `AIMC_AGENT_PROTOCOL_SPECIFICATION.md` (APS) | ACTIVE | Latest |
| `AIMC_ARTEFACT_ARCHITECTURE_DESCRIPTION.md` (AAD) | ACTIVE | Latest |
| `AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` (AAWP) | AMENDED — Wave 9 added, CS2 sign-off pending | 0.2.0 |
| `AIMC_KNOWLEDGE_BASE_INVENTORY.md` | ACTIVE | Latest |
| `AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` | ACTIVE | v1.0.0 |
| `AIMC_PERSONA_LIFECYCLE.md` | ACTIVE | v1.0.1 |
| `AIMC_GOVERNANCE_CERTIFICATION.md` | CERTIFIED (Wave 8) | Wave 8 |

### 2.4 AI Personas — `packages/ai-centre/src/agents/`

| `agentId` | Module | YAML Front-Matter | Wiring State | Audit Status |
|---|---|---|---|---|
| `mat-advisor` | MAT | ✅ v1.0.0 | WIRED ✅ | Audited — Wave 9.10 |
| `pit-advisor` | PIT | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |
| `isms-navigator` | ISMS | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |
| `risk-advisor` | Risk Management | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |
| `xdetect-advisor` | XDetect | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |
| `course-crafter-advisor` | Course Crafter | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |
| `incident-intelligence-advisor` | Incident Intelligence | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |
| `maturity-roadmap-advisor` | Maturity Roadmap | ✅ v1.0.0 | IDLE ⚠️ | Audited — Wave 9.10 |

### 2.5 Module Integration Status

| Module | AIMC Gateway Wired | AI Persona | Integration Tests |
|---|---|---|---|
| MAT (Manual Auditing Tool) | ✅ WIRED | `mat-advisor` ✅ | ✅ `wiring-invariants/` + `ai-gateway-smoke/` |
| PIT | ❌ NOT WIRED | `pit-advisor` ✅ | ❌ No wiring tests |
| XDetect | ❌ NOT WIRED | `xdetect-advisor` ✅ | ❌ No wiring tests |
| Risk Management | ❌ NOT WIRED | `risk-advisor` ✅ | ❌ No wiring tests |
| Course Crafter | ❌ NOT WIRED | `course-crafter-advisor` ✅ | ❌ No wiring tests |
| ISMS Navigator | ❌ NOT WIRED | `isms-navigator` ✅ | ❌ No wiring tests |
| Incident Intelligence | ❌ NOT WIRED | `incident-intelligence-advisor` ✅ | ❌ No wiring tests |
| Maturity Roadmap | ❌ NOT WIRED | `maturity-roadmap-advisor` ✅ | ❌ No wiring tests |

---

## 3. Gap Analysis

### 3.1 Critical Gaps (Blocking Production Readiness for Full Ecosystem)

| Gap ID | Description | Severity | Status | Blocking Wave |
|---|---|---|---|---|
| **GAP-001** | 7 of 8 ISMS modules not wired to AIMC gateway — PIT, XDetect, Risk, Course Crafter, ISMS Navigator, Incident Intelligence, Maturity Roadmap | CRITICAL | OPEN | Waves 9.6, 9.7, 9.8, 9.9 |
| **GAP-002** | `PersonaLoader` does not perform runtime YAML front-matter validation — malformed personas can be silently injected | HIGH | OPEN | Post-Wave 9.10 (tracked residual) |
| **GAP-003** | `PersonaValidationError` type not yet implemented in `PersonaLoader.ts` | HIGH | OPEN | Post-Wave 9.10 (tracked residual) |
| **GAP-004** | Wave 9.11 Legacy Escape Remediation — status of `@deprecated` marker enforcement in legacy hooks unclear; merge status not confirmed | HIGH | REQUIRES AUDIT | Wave 9.11 |
| **GAP-005** | GRS document status is DRAFT (0.1.0) — CS2 sign-off never recorded; no Wave 2 gate closure documented | MEDIUM | OPEN | Administrative |
| **GAP-006** | AAWP v0.2.0 (Wave 9 amendment) — CS2 sign-off for Wave 9 execution not documented in AAWP itself | MEDIUM | OPEN | Administrative |
| **GAP-007** | Knowledge Upload Centre — no centralised UI/API for uploading knowledge items to `ai_knowledge` table with metadata pre-population. ARC protocol documented but upload mechanism is undocumented | HIGH | OPEN | New scope |
| **GAP-008** | `api/ai/feedback/approve` endpoint (ARC gate) — implementation status and CS2-gating enforcement requires audit verification | MEDIUM | REQUIRES AUDIT | Wave 9.4 |
| **GAP-009** | Episodic memory write path from `MemoryLifecycle.recordTurn()` — requires verification that records are actually being written to `ai_episodic_events` in production flow | MEDIUM | REQUIRES AUDIT | Wave 9.3 |
| **GAP-010** | No scheduled CI check for persona freshness (quarterly review enforcement) — parking station suggestion unresolved | LOW | OPEN | Future enhancement |

### 3.2 Governance Gaps

| Gap ID | Description | Severity | Status |
|---|---|---|---|
| **GOV-001** | GRS-016 (no direct provider calls from modules) — enforcement via CI merge gate not yet implemented (AIMC_STRATEGY.md §11.1 requires this) | HIGH | OPEN |
| **GOV-002** | No CI lint/check verifying `import { OpenAI }` or `import Anthropic` do not appear in module production code | HIGH | OPEN |
| **GOV-003** | Persona Registry in `AIMC_PERSONA_LIFECYCLE.md §2` — no automated CI check verifying registry is in sync with actual persona files on disk | MEDIUM | OPEN |
| **GOV-004** | No scheduled workflow to flag overdue quarterly persona reviews based on `last_reviewed` YAML field | LOW | OPEN |
| **GOV-005** | `AIMC_GOVERNANCE_CERTIFICATION.md` covers only Wave 8 — no governance certification covering Waves 9.1–9.11 and Wave 10 | MEDIUM | OPEN |

---

## 4. Comprehensive Test Strategy

This section defines the full test coverage required for the AIMC to be declared fully audited and production-ready.

### 4.1 Category A — Implementation Completeness Tests

**Objective**: Verify every deliverable from every AIMC wave is implemented and covered by a real, non-stubbed test.

| Test ID | Test Description | Type | Assigned To | Evidence Required |
|---|---|---|---|---|
| T-A-001 | All 425 current tests pass GREEN, zero failures, zero skipped | Full regression | `qa-builder` | `npm test` output with count |
| T-A-002 | All 8 capability types (`advisory`, `analysis`, `embeddings`, `document-generation`, `deep-search`, `image-generation`, `video-generation`, `algorithm-execution`) have at least one non-stub test | Coverage audit | `qa-builder` | CST test files per wave |
| T-A-003 | All 5 provider adapters (GitHubModels, OpenAI, Anthropic, Perplexity, Runway) have contract compliance tests (ProviderAdapter.contract.test.ts) with real assertions | Contract test audit | `qa-builder` | ProviderAdapter.contract.test.ts diff review |
| T-A-004 | EpisodicMemoryAdapter rejects all update/delete operations (immutability test) | Immutability | `qa-builder` | EpisodicMemoryAdapter.test.ts + EpisodicMemorySchema.test.ts |
| T-A-005 | KnowledgeRetrieverImpl filters knowledge by `approval_status = 'approved'` only | ARC gate enforcement | `qa-builder` | KnowledgeRetrieverApproval.test.ts |
| T-A-006 | FeedbackPipeline `submit()`, `listPending()`, `approve()`, `reject()` methods all have real, non-stub assertions | Feedback pipeline completeness | `qa-builder` | FeedbackPipeline.test.ts body review |
| T-A-007 | All 8 personas loadable via `PersonaLoader.load('<agentId>')` | Persona loading | `qa-builder` | wave9.10-persona-lifecycle.test.ts |
| T-A-008 | All 8 persona YAML front-matter fields present and non-empty (`agentId`, `description`, `module`, `version`, `last_reviewed`, `owner`) | YAML compliance | `qa-builder` | wave9.10-persona-lifecycle.test.ts |
| T-A-009 | AI Gateway health endpoint (`GET /api/ai/health`) returns 200 with correct health schema | Health endpoint | `qa-builder` | api/ai/health.test.ts |
| T-A-010 | Wave 9.11 Legacy Escape — `@deprecated` markers present in all legacy learning hooks | Legacy escape gate | `qa-builder` | wave9.11-legacy-escape.test.ts full execution result |
| T-A-011 | No `expect(true).toBe(true)` stub patterns exist anywhere in the AIMC test suite | Stub detection | `qa-builder` | `grep -rn "expect(true).toBe(true)" packages/ai-centre/` |
| T-A-012 | Supabase CI migration pipeline (`supabase-migrate` job) runs correctly for all 6 AIMC migrations | CI/CD completeness | `integration-builder` | `.github/workflows/deploy-mat-vercel.yml` evidence |

### 4.2 Category B — Governance Alignment Tests

**Objective**: Verify all GRS requirements are satisfied by existing implementation and tests.

| Test ID | GRS Requirement | Test Method | Assigned To | Evidence Required |
|---|---|---|---|---|
| T-B-001 | GRS-001: No direct AI provider SDK imports in module production code | `grep` CI check for `import { OpenAI }`, `import Anthropic` in `modules/`, `apps/` (excluding `maturion-maturity-legacy`) | `qa-builder` + `integration-builder` | CI check result / grep output |
| T-B-002 | GRS-007: All AI calls include `organisationId` — RLS enforces tenant isolation | Schema audit + RLS policy review | `schema-builder` | Migration RLS policy review |
| T-B-003 | GRS-008: Persistent memory writes go through AIMC package only — no module defines its own `ai_memory`-equivalent table | Schema crosscheck | `schema-builder` | `grep -rn "ai_memory" modules/` |
| T-B-004 | GRS-010: Persona system prompts loaded from `packages/ai-centre/src/agents/` — no persona content hardcoded in gateway | Code review | `qa-builder` | PersonaLoader.test.ts + code diff |
| T-B-005 | GRS-012: Telemetry written for every AI request (all 8 capability types) | CST tests for each wave | `qa-builder` | Per-wave CST test results |
| T-B-006 | GRS-014: All provider errors wrapped in governed `ProviderError` — no raw provider errors surface to modules | Contract test audit | `qa-builder` | ProviderAdapter.contract.test.ts |
| T-B-007 | GRS-015: No API key or secret hardcoded anywhere in AIMC package source | `grep` for key patterns | `qa-builder` | `grep -rn "sk-\|Bearer " packages/ai-centre/src/` |
| T-B-008 | GRS-016: Direct provider calls prohibited — verify no `maturion-maturity-legacy` patterns are carried to canonical modules | Legacy escape audit | `integration-builder` | Wave 9.11 test + source review |
| T-B-009 | GRS-030/031: Episodic memory schema present, immutable, org-scoped | Schema test | `schema-builder` | EpisodicMemorySchema.test.ts |
| T-B-010 | GRS-028: All personas have YAML front-matter with required fields | Automated test | `qa-builder` | wave9.10-persona-lifecycle.test.ts |

### 4.3 Category C — Strategic Objectives Tests

**Objective**: Verify the AIMC achieves the strategic aims stated in `governance/canon/AIMC_STRATEGY.md`.

| Test ID | Strategic Objective | Test Method | Assigned To | Evidence Required |
|---|---|---|---|---|
| T-C-001 | Strategy §3: Single entry point — all ISMS modules use `@maturion/ai-centre`; no direct provider imports | Module integration crosscheck | `integration-builder` | Module source code review + wiring invariant test pattern |
| T-C-002 | Strategy §4: Capability taxonomy — all 8 capability types operational | CST test suite execution | `qa-builder` | All CST wave tests GREEN |
| T-C-003 | Strategy §5: Provider strategy — GitHubModels as primary, OpenAI/Anthropic for specific capabilities, all keys central | Provider key management audit | `api-builder` | ProviderKeyStore.test.ts + no env key in source |
| T-C-004 | Strategy §6: Memory centre — session + persistent memory operational; episodic layer added in Wave 9.1/9.3 | Memory lifecycle test | `qa-builder` | MemoryLifecycle test suite |
| T-C-005 | Strategy §7: Agent personas — 8 personas defined, versioned, loadable | Persona registry audit | `qa-builder` | PersonaLoader + wave9.10 test |
| T-C-006 | Strategy §9 Principle 4: Tenant isolation — all AI calls scoped by `organisation_id`; RLS enforced | RLS policy review | `schema-builder` | Migration RLS policies + test evidence |
| T-C-007 | Strategy §9 Principle 5: Central key management — no module holds API keys | Source scan | `qa-builder` | `grep -rn "OPENAI_API_KEY\|ANTHROPIC_API_KEY" modules/` |
| T-C-008 | Strategy §9 Principle 8: Cost governance — telemetry captures all requests with capability and org attribution | Telemetry audit | `qa-builder` | TelemetryWriter.test.ts |
| T-C-009 | Strategy §9 Principle 9: Graceful degradation — fallback provider used when primary is unhealthy | Router failover test | `qa-builder` | CapabilityRouter.test.ts |
| T-C-010 | Strategy §11.1: CI merge gate rejects direct provider imports in module code | CI gate existence check | `integration-builder` | `.github/workflows/` audit |

### 4.4 Category D — Knowledge Upload Centre Readiness

**Objective**: Assess whether the centralised knowledge ingestion/upload capability is documented and operable.

| Test ID | Requirement | Test Method | Assigned To | Evidence Required |
|---|---|---|---|---|
| T-D-001 | `ai_knowledge` table has all required metadata columns (`domain`, `module`, `standard_ref`, `freshness_date`, `approval_status`) | Schema audit | `schema-builder` | Migration `006_ai_knowledge_metadata.sql` review |
| T-D-002 | ARC Knowledge Promotion Protocol documented (`AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`) | Document existence + completeness review | `governance-liaison-isms-agent` | Document review against stated requirements |
| T-D-003 | Knowledge Base Inventory populated (`AIMC_KNOWLEDGE_BASE_INVENTORY.md`) — at least one approved knowledge item per active module | Inventory audit | `mat-specialist` | Inventory document review |
| T-D-004 | `KnowledgeRetrieverImpl.retrieve()` filters by `approval_status = 'approved'` and by `domain`/`module` where provided | Unit test audit | `qa-builder` | KnowledgeRetrieverApproval.test.ts |
| T-D-005 | Upload mechanism — verify there is a documented, governed process for authorised team members to upload knowledge items | Process audit | `governance-liaison-isms-agent` | ARC protocol Step 1 review |
| T-D-006 | Knowledge upload centre specification — verify whether a UI or API endpoint for knowledge uploads exists beyond manual DB inserts | Architecture review | `api-builder` | Code review of `api/ai/` endpoints |

### 4.5 Category E — Persona Coverage and Domain Accuracy

**Objective**: Verify all personas are domain-accurate and reviewed by appropriate domain specialists.

| Test ID | Requirement | Assigned Reviewer | Evidence Required |
|---|---|---|---|
| T-E-001 | `mat-advisor` domain accuracy review (ISO 27001, maturity scoring, audit lifecycle) | `mat-specialist` | Domain accuracy attestation |
| T-E-002 | `pit-advisor` domain accuracy review (project implementation, WRAC, task generation) | `pit-specialist` | Domain accuracy attestation |
| T-E-003 | `risk-advisor` domain accuracy review (risk assessment, threat analysis, control effectiveness) | `risk-platform-agent` | Domain accuracy attestation |
| T-E-004 | `xdetect-advisor` domain accuracy review (anomaly detection, IOC analysis, incident triage) | `risk-platform-agent` | Domain accuracy attestation |
| T-E-005 | `incident-intelligence-advisor` domain accuracy review (incident analysis, TTP correlation) | `pit-specialist` | Domain accuracy attestation |
| T-E-006 | `isms-navigator` domain accuracy review (ISMS programme management, cross-module strategy) | `mat-specialist` | Domain accuracy attestation |
| T-E-007 | `course-crafter-advisor` domain accuracy review (instructional design, ISMS learning content) | `mat-specialist` | Domain accuracy attestation |
| T-E-008 | `maturity-roadmap-advisor` domain accuracy review (roadmap generation, remediation planning, gap prioritisation) | `maturity-scoring-agent` | Domain accuracy attestation |

### 4.6 Category F — Module Integration Completeness

**Objective**: Verify that once modules are wired (Waves 9.6–9.9), they meet the integration contract established by MAT.

| Test ID | Requirement | Test Pattern | Assigned To | Evidence Required |
|---|---|---|---|---|
| T-F-001 | PIT module AIMC wiring — `POST /api/ai/request` with `capability: 'analysis'` and `agent: 'pit-advisor'` | Wiring invariant tests (MAT pattern) | `integration-builder` + `qa-builder` | `modules/pit/tests/wiring-invariants/` |
| T-F-002 | XDetect module AIMC wiring | Wiring invariant tests | `integration-builder` + `qa-builder` | `modules/xdetect/tests/wiring-invariants/` |
| T-F-003 | Risk Management module AIMC wiring | Wiring invariant tests | `integration-builder` + `qa-builder` | `modules/risk-management/tests/wiring-invariants/` |
| T-F-004 | Course Crafter module AIMC wiring | Wiring invariant tests | `integration-builder` + `qa-builder` | `modules/course-crafter/tests/wiring-invariants/` |
| T-F-005 | ISMS Navigator module AIMC wiring | Wiring invariant tests | `integration-builder` + `qa-builder` | `modules/isms/tests/wiring-invariants/` |
| T-F-006 | Incident Intelligence module AIMC wiring | Wiring invariant tests | `integration-builder` + `qa-builder` | `modules/incident-intelligence/tests/wiring-invariants/` |
| T-F-007 | Maturity Roadmap module AIMC wiring | Wiring invariant tests | `integration-builder` + `qa-builder` | `modules/maturity-roadmap/tests/wiring-invariants/` |

### 4.7 Category G — Upgrade, Issue, and Process Testing

**Objective**: Verify that the governance process for ongoing AIMC maintenance is defined and operable.

| Test ID | Requirement | Test Method | Assigned To | Evidence Required |
|---|---|---|---|---|
| T-G-001 | Persona quarterly review cadence — verify `AIMC_PERSONA_LIFECYCLE.md §4.1` scheduling process is documented and actionable | Process walkthrough | `governance-liaison-isms-agent` | Review schedule confirmation |
| T-G-002 | ARC approval endpoint (`POST /api/ai/feedback/approve`) enforces CS2-only access (returns 403 without valid token) | Auth gate test | `qa-builder` | wave9.11-legacy-escape.test.ts T-005 or dedicated test |
| T-G-003 | Provider key rotation process — verify ProviderKeyStore can pick up rotated keys from environment without code change | Process audit | `api-builder` | ProviderKeyStore.test.ts + runbook |
| T-G-004 | Schema migration rollback — verify each migration file has a corresponding rollback procedure or is explicitly irreversible-by-design | Migration audit | `schema-builder` | Migration file review per file |
| T-G-005 | Wave planning protocol — verify AAWP is updated (CS2 sign-off) for each new wave before execution begins | AAWP audit | `governance-liaison-isms-agent` | AAWP §10 sign-off history |
| T-G-006 | Incident and improvement tracking — verify FAIL-ONLY-ONCE registry is current and INC-IAA-SKIP-001 (A-014) is operationalised | Registry audit | `independent-assurance-agent` | FAIL-ONLY-ONCE.md current state |

### 4.8 Category H — Effectiveness Metrics

**Objective**: Define observable metrics that demonstrate the AIMC achieves its stated strategic aims in practice.

| Metric ID | Metric | Measurement Method | Baseline | Target | Assigned To |
|---|---|---|---|---|---|
| M-001 | % of ISMS modules wired to AIMC gateway | Count of wired modules / total modules | 1/8 (12.5%) | 8/8 (100%) | `foreman-v2-agent` (wave coordination) |
| M-002 | AI request telemetry completeness — % of AI requests captured in `ai_telemetry` | Telemetry row count vs estimated request volume | TBD | 100% | `mat-specialist` (production monitoring) |
| M-003 | Knowledge ARC approval rate — % of `ai_knowledge` entries in `approved` status | DB query: `SELECT approval_status, COUNT(*) FROM ai_knowledge GROUP BY approval_status` | TBD | ≥80% approved | `governance-liaison-isms-agent` |
| M-004 | Persona review freshness — % of personas with `last_reviewed` within 90 days | YAML front-matter audit | 100% (all reviewed 2026-02-28) | 100% always | `governance-liaison-isms-agent` |
| M-005 | Test suite size — total tests, % passing | `npm test` output | 425 (100% GREEN) | ≥425, 100% GREEN | `qa-builder` |
| M-006 | Provider error exposure — count of unhandled raw provider errors in `ai_telemetry` | Telemetry query for error_type | TBD | 0 | `api-builder` |
| M-007 | Feedback pipeline utilisation — count of `ai_feedback_events` entries submitted vs approved vs rejected per period | DB query | TBD | Active usage with <20% rejection rate | `mat-specialist` |
| M-008 | Legacy escape compliance — count of files in `maturion-maturity-legacy` still invoking AI providers directly (without `@deprecated` markers) | `grep` + `wave9.11-legacy-escape.test.ts` | TBD post-audit | 0 files without `@deprecated` markers | `integration-builder` |

---

## 5. Agent Assignment Summary

The following table assigns each audit section to the responsible agent. Each agent must produce the declared evidence artifacts and deliver them to the Foreman for QP evaluation.

| Section | Audit Category | Assigned Agent(s) | Expected Output Artifacts |
|---|---|---|---|
| §4.1 Implementation Completeness | Category A | `qa-builder` (primary), `integration-builder` (T-A-012) | Full test run output, stub-detection grep results, schema migration evidence |
| §4.2 Governance Alignment | Category B | `qa-builder` (T-B-001 through T-B-010), `schema-builder` (T-B-002, T-B-003, T-B-009) | GRS traceability matrix, CI check outputs, schema RLS review |
| §4.3 Strategic Objectives | Category C | `qa-builder` (T-C-001 through T-C-010), `integration-builder` (T-C-010), `schema-builder` (T-C-006) | Strategic objective attestation table |
| §4.4 Knowledge Upload Centre | Category D | `schema-builder` (T-D-001), `governance-liaison-isms-agent` (T-D-002, T-D-005), `mat-specialist` (T-D-003), `qa-builder` (T-D-004), `api-builder` (T-D-006) | ARC protocol review, inventory audit, upload mechanism specification |
| §4.5 Persona Domain Accuracy | Category E | `mat-specialist` (T-E-001, T-E-006, T-E-007), `pit-specialist` (T-E-002, T-E-005), `risk-platform-agent` (T-E-003, T-E-004), `maturity-scoring-agent` (T-E-008) | Domain accuracy attestation per persona |
| §4.6 Module Integration | Category F | `integration-builder` + `qa-builder` (T-F-001 through T-F-007) | Wiring invariant test suites per module (RED gate → implementation → GREEN) |
| §4.7 Process Testing | Category G | `governance-liaison-isms-agent` (T-G-001, T-G-005), `qa-builder` (T-G-002), `api-builder` (T-G-003), `schema-builder` (T-G-004), `independent-assurance-agent` (T-G-006) | Process walkthroughs, migration audit, AAWP sign-off history |
| §4.8 Effectiveness Metrics | Category H | `mat-specialist` (M-002, M-007), `governance-liaison-isms-agent` (M-003, M-004), `qa-builder` (M-005), `api-builder` (M-006), `integration-builder` (M-008) | Metric baseline establishment and target tracking |

---

## 6. Evidence and Artifact Requirements

For each audit category, the following evidence artifacts are required. These must be committed to the repository or referenced in the PREHANDOVER proof.

### 6.1 Category A Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Full test run output | `.agent-workspace/audit/AIMC-P1-test-run-{date}.txt` | `npm test` stdout verbatim |
| Stub-detection scan result | `.agent-workspace/audit/AIMC-P1-stub-detection-{date}.txt` | `grep` output verbatim (zero results = PASS) |
| Schema migration CI evidence | `.agent-workspace/audit/AIMC-P1-schema-migration-ci-{date}.md` | CI job log summary |
| Wave completeness table | In audit report | Checklist per wave (all deliverables confirmed) |

### 6.2 Category B Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| GRS traceability matrix | `.agent-workspace/audit/AIMC-P1-GRS-traceability-{date}.md` | Table: GRS-ID → test file → test result |
| Direct provider import scan | `.agent-workspace/audit/AIMC-P1-provider-import-scan-{date}.txt` | `grep` output verbatim |
| Key hardcoding scan | `.agent-workspace/audit/AIMC-P1-key-scan-{date}.txt` | `grep` output verbatim |

### 6.3 Category C Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Strategic objective attestation | `.agent-workspace/audit/AIMC-P1-strategic-attestation-{date}.md` | Table per objective: PASS/FAIL/PARTIAL |

### 6.4 Category D Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Knowledge upload centre specification | `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` | New governance document |
| ARC protocol completeness review | `.agent-workspace/audit/AIMC-P1-arc-review-{date}.md` | Protocol walkthrough |
| Knowledge inventory audit | `.agent-workspace/audit/AIMC-P1-inventory-audit-{date}.md` | Inventory review |

### 6.5 Category E Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Persona domain accuracy attestation (per persona) | `.agent-workspace/audit/AIMC-P1-persona-review-{agentId}-{date}.md` | Attestation per specialist |

### 6.6 Category F Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Wiring invariant test suites (per module) | `modules/{module}/tests/wiring-invariants/` | RED gate tests (before wiring) |
| Integration wave completeness | `.agent-workspace/audit/AIMC-P1-module-integration-{date}.md` | Wave closure checklist per module |

### 6.7 Category G Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Process walkthrough records | `.agent-workspace/audit/AIMC-P1-process-review-{date}.md` | Step-by-step process execution |
| AAWP sign-off audit | `.agent-workspace/audit/AIMC-P1-aawp-audit-{date}.md` | CS2 approval record review |

### 6.8 Category H Evidence Bundle

| Artifact | Path | Format |
|---|---|---|
| Effectiveness metrics baseline | `.agent-workspace/audit/AIMC-P1-metrics-baseline-{date}.md` | Metrics table with baseline values |

---

## 7. Parking Station Review

The following deferred improvement suggestions from the parking station are directly relevant to AIMC audit and should be addressed or tracked in this audit cycle.

### 7.1 From `governance-liaison-isms` (session-025):

| ID | Item | Urgency | Recommended Action |
|---|---|---|---|
| PS-GL-001 | PersonaLoader should throw on missing YAML front-matter fields — verify enforcement implemented with dedicated RED gate test | HIGH | `qa-builder` to add RED gate test for `PersonaValidationError`; `api-builder` to implement in `PersonaLoader.ts` |
| PS-GL-002 | CI check to validate Persona Registry table (§2 AIMC_PERSONA_LIFECYCLE.md) is in sync with actual persona files on disk | MEDIUM | `integration-builder` to add CI check |
| PS-GL-003 | GitHub Actions scheduled workflow to flag overdue quarterly persona reviews based on `last_reviewed` YAML field | LOW | `integration-builder` to create scheduled workflow |

### 7.2 From `foreman-v2-agent` (sessions 069–072):

| ID | Item | Urgency | Recommended Action |
|---|---|---|---|
| PS-FM-001 | Compound wave 9.2+9.5 pattern validated: RED→Schema→API→Governance 4-step delegation order — formalise as Wave 9 template | LOW | `governance-liaison-isms-agent` to canonise in AAWP |
| PS-FM-002 | Track D Wave 9.10 pattern (qa-builder RED → api-builder content → governance-liaison doc) — formalise as canonical Track D pattern | LOW | `governance-liaison-isms-agent` to canonise in AAWP |
| PS-FM-003 | CI/CD migration pillar must be in wave template as mandatory checklist item for all DB-touching waves (OVERSIGHT-CI-001 lesson) | HIGH | `governance-liaison-isms-agent` via CodexAdvisor issue |
| PS-FM-004 | Post-deploy schema verification step in CI (SELECT 1 from expected tables after deploy) | MEDIUM | `integration-builder` |

### 7.3 From `independent-assurance-agent` (sessions 014–017):

| ID | Item | Urgency | Recommended Action |
|---|---|---|---|
| PS-IAA-001 | Arch freeze could include Test Map table linking test IDs to spec sections for faster IAA tracing | MEDIUM | Include in future arch freeze templates |
| PS-IAA-002 | PREHANDOVER bundle checklist should distinguish EXISTS vs COMMITTED status | MEDIUM | `governance-liaison-isms-agent` to update template |
| PS-IAA-003 | Add spec header validation automation — CI check to compare Version/Last Updated in headers against latest changelog entry | MEDIUM | `integration-builder` |
| PS-IAA-004 | Add OVL-CI-004 check for new workflow creation to verify stated policy requirement is correctly implemented | LOW | `integration-builder` |
| PS-IAA-005 | PREHANDOVER proof should include explicit scope_declaration field listing only Wave-specific new/modified files | MEDIUM | `foreman-v2-agent` to update template |

### 7.4 From `FAIL-ONLY-ONCE.md` (Section 3, current open improvements):

| ID | Item | Urgency | Recommended Action |
|---|---|---|---|
| S-001 | `align-governance.sh` pre-flight diff check for locally-added learning sections | MEDIUM | `integration-builder` |
| S-002 | CI merge gate: `grep` for `expect(true).toBe(true)` stub patterns | HIGH | `integration-builder` |
| S-004 | CI check: fail PR when `.agent-admin/prehandover/proof-*.md` is absent | MEDIUM | `integration-builder` |
| S-007 | CI POLC boundary gate: fail PR when foreman-v2 authors production code files | HIGH | `integration-builder` |
| S-009 | Require verbatim IAA response paste in PREHANDOVER proof | HIGH | `foreman-v2-agent` to enforce per A-014 |

---

## 8. Knowledge Upload Centre — Specification Gap

The issue specifically requires coverage of the centralised knowledge ingestion/upload mechanism. This section defines the specification gap and required deliverable.

### 8.1 Current State

- **`ai_knowledge` table**: Exists with full metadata schema (migration 006). Supports `domain`, `module`, `standard_ref`, `freshness_date`, `approval_status`.
- **ARC Knowledge Promotion Protocol**: Documented in `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md`. Step 1 (Upload) describes inserting via "the AIMC API (or service role migration)" but does not specify a concrete upload endpoint.
- **No dedicated upload endpoint**: No `POST /api/ai/knowledge/upload` endpoint exists in the `api/` directory.
- **No UI**: No knowledge upload UI component exists.

### 8.2 Required Deliverable

A **Knowledge Upload Centre Specification** must be produced before module integration waves (9.6–9.9) begin. It must cover:

| Requirement | Description |
|---|---|
| Upload API endpoint | `POST /api/ai/knowledge/upload` — accepts content, domain, module, standard_ref, source, embedding_content |
| Auth gate | CS2-gated (service role token required) |
| ARC trigger | Upload sets `approval_status = 'pending'`; ARC notification sent |
| Batch upload | Support for bulk knowledge uploads from document files |
| UI (optional phase) | Admin UI for CS2/ARC reviewer to upload, review, and approve knowledge items |
| Test coverage | RED gate test for upload endpoint before implementation |

**Assigned To**: `api-builder` (endpoint) + `governance-liaison-isms-agent` (specification document) + `qa-builder` (RED gate test)  
**Deliverable Path**: `governance/aimc/AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md`

---

## 9. Recommended Audit Execution Sequence

The following sequence is recommended for the distributed multi-agent audit cycle. Parallel tracks are identified where dependencies allow.

### Phase A — Foundation Verification (no dependencies, can run in parallel)

| Track | Agent | Scope |
|---|---|---|
| Track A-1 | `qa-builder` | Categories A + B + C: Full test suite execution, stub detection, GRS traceability, strategic objective verification |
| Track A-2 | `schema-builder` | Category B-DB: Schema RLS audit, migration review, rollback assessment |
| Track A-3 | `governance-liaison-isms-agent` | Category D+G: ARC protocol review, knowledge inventory, process walkthroughs, AAWP sign-off audit |
| Track A-4 | `independent-assurance-agent` | Category G-T-G-006: FAIL-ONLY-ONCE registry, breach registry compliance, A-014 operationalisation |

### Phase B — Persona and Knowledge Review (after Phase A)

| Track | Agent | Scope |
|---|---|---|
| Track B-1 | `mat-specialist` | T-E-001, T-E-006, T-E-007: MAT, ISMS Navigator, Course Crafter persona review + T-D-003: Knowledge inventory |
| Track B-2 | `pit-specialist` | T-E-002, T-E-005: PIT, Incident Intelligence persona review |
| Track B-3 | `risk-platform-agent` | T-E-003, T-E-004: Risk, XDetect persona review |
| Track B-4 | `maturity-scoring-agent` | T-E-008: Maturity Roadmap persona review |

### Phase C — Module Integration (requires Phase A + B completion, plus CS2 wave-start)

| Track | Agent | Scope |
|---|---|---|
| Track C-1 | `qa-builder` → `integration-builder` | T-F-001, T-F-002: PIT + XDetect wiring (Waves 9.6/9.7) |
| Track C-2 | `qa-builder` → `integration-builder` | T-F-003, T-F-004: Risk Management + Course Crafter wiring (Wave 9.6/9.8) |
| Track C-3 | `qa-builder` → `integration-builder` | T-F-005, T-F-006, T-F-007: ISMS Navigator + Incident Intelligence + Maturity Roadmap wiring (Waves 9.8/9.9) |

### Phase D — Knowledge Upload Centre (can start after Phase A)

| Track | Agent | Scope |
|---|---|---|
| Track D-1 | `governance-liaison-isms-agent` | Produce `AIMC_KNOWLEDGE_UPLOAD_CENTRE_SPECIFICATION.md` |
| Track D-2 | `qa-builder` | RED gate test for upload endpoint |
| Track D-3 | `api-builder` | Implement `POST /api/ai/knowledge/upload` endpoint |

### Phase E — Metrics Baseline and Effectiveness Report (after all phases)

| Track | Agent | Scope |
|---|---|---|
| Track E-1 | `mat-specialist` | Establish telemetry and feedback utilisation baselines |
| Track E-2 | `governance-liaison-isms-agent` | Produce AIMC Effectiveness Report from collected metrics |

---

## 10. Acceptance Criteria for This Audit Plan

This plan is complete and ready for CS2 review when all of the following are satisfied:

- [x] Current implementation state summary is accurate and complete (§2)
- [x] All gaps identified in Wave 9 audit and subsequent sessions are carried forward (§3)
- [x] All 8 test categories defined with individual test IDs, descriptions, assignments, and evidence requirements (§4)
- [x] All agents assigned to specific test categories with declared outputs (§5)
- [x] Evidence artifact requirements defined per category (§6)
- [x] Parking station reviewed — all AIMC-relevant deferred items listed with recommended actions (§7)
- [x] Knowledge Upload Centre gap explicitly addressed with specification requirements (§8)
- [x] Audit execution sequence defined with parallel track identification (§9)
- [ ] CS2 review and wave-start authorisation for audit execution

---

## 11. References

| Document | Path | Version |
|---|---|---|
| AIMC Strategy | `governance/canon/AIMC_STRATEGY.md` | v1.0.0 |
| AIMC Functionality Audit (Wave 9 Scoping) | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` | v1.0.0 |
| AIMC Persona Lifecycle | `governance/aimc/AIMC_PERSONA_LIFECYCLE.md` | v1.0.1 |
| AIMC ARC Knowledge Promotion Protocol | `governance/aimc/AIMC_ARC_KNOWLEDGE_PROMOTION_PROTOCOL.md` | v1.0.0 |
| AIMC Knowledge Base Inventory | `governance/aimc/AIMC_KNOWLEDGE_BASE_INVENTORY.md` | Latest |
| AIMC GRS | `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md` | 0.1.0 |
| AIMC AAWP | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` | 0.2.0 |
| AIMC Governance Certification | `governance/aimc/AIMC_GOVERNANCE_CERTIFICATION.md` | Wave 8 |
| FAIL-ONLY-ONCE Registry | `.agent-workspace/foreman-v2/knowledge/FAIL-ONLY-ONCE.md` | 1.8.0 |
| Foreman Session Memory (session 073) | `.agent-workspace/foreman-v2/memory/session-073-wave-aimc-audit-p1-20260228.md` | — |
| PREHANDOVER Proof (session 073) | `.agent-workspace/foreman-v2/memory/PREHANDOVER-session-073-wave-aimc-audit-p1-20260228.md` | — |

---

*Produced by foreman-v2-agent v6.2.0, session 073, under CS2 authority (Johan Ras / @APGI-cmy).*  
*This document is a POLC Planning Output. It does not constitute a wave closure or merge gate release.*  
*Wave execution may not begin until CS2 has reviewed and issued formal wave-start authorisation.*  
*Authority: LIVING_AGENT_SYSTEM.md v6.2.0 | 2026-02-28*
