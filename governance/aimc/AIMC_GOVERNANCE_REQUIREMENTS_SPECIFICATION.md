# AI Management Centre — Governance Requirements Specification (GRS)

**Document Type**: Foundation Artefact — Wave 1 Deliverable  
**Status**: DRAFT — Awaiting CS2 Sign-Off  
**Version**: 0.1.0  
**Effective Date**: 2026-02-23  
**Owner**: Maturion Engineering Leadership (Johan Ras, CS2)  
**Location**: `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md`  

**Authorities**:
- `governance/canon/AIMC_STRATEGY.md` v1.0.0 (Constitutional Canon)
- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0 (Constitutional Canon)
- `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` (ACD) — canonical input for this document

**Feeds into**:
- Agent & Protocol Specification (APS) — `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md`

**Blocked by**:
- CS2 review and sign-off (Wave 2 may not commence until this document is approved)

---

## 1. Purpose of This Document

This Governance Requirements Specification (GRS) is the **second artefact** of the AIMC 8-wave implementation plan. It translates the capability scope (ACD Section 4) and the 8-wave implementation plan (ACD Section 5) into formal, testable governance requirements. Each requirement is structured to support eventual Gherkin/test-case derivation and provides an explicit mapping back to its ACD source.

**Wave Gate**: Wave 2 may not commence, and no implementation code may be written, until this GRS has been reviewed and CS2-signed-off. This document is the explicit Wave-2-blocker.

---

## 2. Requirement Structure

Every requirement in this document follows the structure below:

| Field | Description |
|---|---|
| **ID** | Unique identifier, format: `GRS-NNN` |
| **Capability** | Which AIMC capability or boundary this requirement governs |
| **Requirement** | The formal, unambiguous requirement statement (SHALL language) |
| **Testable Condition** | The observable, verifiable condition that proves the requirement is met |
| **Rationale** | Why this requirement exists |
| **ACD Reference** | The ACD section and table entry that is the source of this requirement |
| **Type** | One of: `Technical`, `Governance`, `Process`, `Persona`, `Memory` |
| **Wave** | The earliest wave in which this requirement must be satisfied |
| **Status** | `DRAFT` \| `APPROVED` \| `IMPLEMENTED` \| `VERIFIED` |

---

## 3. In-Scope Capability Requirements (derived from ACD Section 4.1)

### 3.1 Single Gateway

| Field | Value |
|---|---|
| **ID** | GRS-001 |
| **Capability** | Single Gateway |
| **Requirement** | The AIMC SHALL expose a single programmatic entry point (`@maturion/ai-centre`) that is the exclusive route through which all ISMS modules access AI capabilities. No module may call any AI provider SDK directly. |
| **Testable Condition** | Given any ISMS module, when it requires AI output, then it MUST use `@maturion/ai-centre` and no direct provider import exists in any module's production code. |
| **Rationale** | Prevents vendor lock-in, enables central governance, and enforces the constitutional rule in `AIMC_STRATEGY.md` Section 1. |
| **ACD Reference** | Section 4.1 — Single Gateway |
| **Type** | Technical, Governance |
| **Wave** | 2 (scaffold) / 3 (first usage) |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-002 |
| **Capability** | Single Gateway |
| **Requirement** | The gateway entry point SHALL accept a typed request of the form `{ capability, agent, input, context }` and return a typed response. The schema for request and response SHALL be defined in the APS. |
| **Testable Condition** | Given an `ai.request()` call with a valid `AICentreRequest` object, then the gateway returns a structured `AICentreResponse` without exposing provider-specific error types or data shapes. |
| **Rationale** | Establishes a stable interface contract that modules depend on, independent of provider implementation. |
| **ACD Reference** | Section 4.1 — Single Gateway; Section 6.3 |
| **Type** | Technical |
| **Wave** | 2 (interface) / 3 (implementation) |
| **Status** | DRAFT |

---

### 3.2 Capability Routing

| Field | Value |
|---|---|
| **ID** | GRS-003 |
| **Capability** | Capability Routing |
| **Requirement** | The AIMC SHALL route incoming requests to the appropriate provider based on the requested capability type, the configured cost tier, and current provider health. |
| **Testable Condition** | Given a request for capability `advisory`, when the primary provider is healthy, then the request is routed to the configured primary provider. When the primary provider is unhealthy, the request is routed to the configured fallback provider. |
| **Rationale** | Ensures requests are delivered to the correct provider without module-level knowledge of routing logic. |
| **ACD Reference** | Section 4.1 — Capability Routing |
| **Type** | Technical |
| **Wave** | 3 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-004 |
| **Capability** | Capability Routing |
| **Requirement** | The routing configuration SHALL be defined in a governed configuration artefact (not hardcoded in application logic) and SHALL be updatable without a code deployment. |
| **Testable Condition** | Given a routing configuration update (e.g., changing the primary provider for `analysis`), when the configuration is applied, then subsequent requests route to the new provider without redeployment. |
| **Rationale** | Enables operational flexibility and provider switching without code changes. |
| **ACD Reference** | Section 4.1 — Capability Routing |
| **Type** | Governance, Technical |
| **Wave** | 3 |
| **Status** | DRAFT |

---

### 3.3 Provider Adapters

| Field | Value |
|---|---|
| **ID** | GRS-005 |
| **Capability** | Provider Adapters |
| **Requirement** | The AIMC SHALL implement a provider adapter interface that all provider integrations MUST conform to, ensuring that adding or replacing a provider requires only a new adapter implementation and no changes to gateway or module code. |
| **Testable Condition** | Given two provider adapters (e.g., GitHub Models and OpenAI) that both implement the `ProviderAdapter` interface, when either is configured as the primary provider for a capability, then the gateway handles both without branching or provider-specific logic in gateway code. |
| **Rationale** | Enables provider portability and zero-disruption provider swaps. |
| **ACD Reference** | Section 4.1 — Provider Adapters |
| **Type** | Technical |
| **Wave** | 3 (GitHub Models) / 4 (OpenAI) |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-006 |
| **Capability** | Provider Adapters |
| **Requirement** | Provider adapters SHALL be implemented for the following providers, in the following wave sequence: GitHub Models (Wave 3), OpenAI (Wave 4), Anthropic (Wave 6), Perplexity (Wave 7), Runway (Wave 8). |
| **Testable Condition** | Given the wave-gate checklist for each wave, when a wave is closed, then the adapters specified for that wave have passing integration tests that exercise the real provider endpoint (or a governed mock in CI). |
| **Rationale** | Enforces the incremental delivery sequence defined in the ACD and prevents scope creep in early waves. |
| **ACD Reference** | Section 4.1 — Provider Adapters; Section 5 (Waves 3, 4, 6, 7, 8) |
| **Type** | Technical, Process |
| **Wave** | 3–8 (progressive) |
| **Status** | DRAFT |

---

### 3.4 Memory Centre

| Field | Value |
|---|---|
| **ID** | GRS-007 |
| **Capability** | Memory Centre |
| **Requirement** | The AIMC SHALL maintain in-process session memory for each active conversation, assembling the complete context window from: system prompt, session history, persistent history, and domain knowledge. |
| **Testable Condition** | Given a multi-turn conversation, when the second and subsequent messages are sent, then the assembled context window includes prior turns from the current session and any persisted prior history. |
| **Rationale** | Enables coherent multi-turn advisory experiences across all modules. |
| **ACD Reference** | Section 4.1 — Memory Centre |
| **Type** | Memory |
| **Wave** | 3 (in-process) / 4 (persistent) |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-008 |
| **Capability** | Memory Centre |
| **Requirement** | The AIMC SHALL implement Supabase-backed persistent memory with `organisation_id` tenant isolation, such that memory for one organisation is never retrievable or injectable into a request belonging to another organisation. |
| **Testable Condition** | Given two organisations (Org A and Org B) with conversation histories, when Org B's user makes a request, then no context from Org A's history appears in the assembled context window. |
| **Rationale** | Enforces multi-tenant data isolation — a constitutional requirement per `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md`. |
| **ACD Reference** | Section 4.1 — Memory Centre; Section 5 Wave 4 |
| **Type** | Memory, Governance |
| **Wave** | 4 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-009 |
| **Capability** | Memory Centre |
| **Requirement** | No ISMS module SHALL define, own, or migrate AI memory tables. All AI memory schema is owned exclusively by the AIMC and managed in `packages/ai-centre/`. |
| **Testable Condition** | Given a code review of any ISMS module (MAT, PIT, xDetect, etc.), then no Supabase migration or schema file in that module defines an AI memory table. |
| **Rationale** | Prevents fragmented memory ownership and enforces the out-of-scope boundary stated in ACD Section 4.2. |
| **ACD Reference** | Section 4.2 — Module-owned AI memory tables |
| **Type** | Governance |
| **Wave** | 2 |
| **Status** | DRAFT |

---

### 3.5 Agent Personas

| Field | Value |
|---|---|
| **ID** | GRS-010 |
| **Capability** | Agent Personas |
| **Requirement** | Module-specific advisor persona files SHALL be stored under `packages/ai-centre/agents/` and loaded by the AIMC Gateway as system prompts at request time. No persona file may be stored in a module's own directory structure. |
| **Testable Condition** | Given the MAT advisor persona, when a MAT module makes an advisory request, then the system prompt is loaded from `packages/ai-centre/agents/mat-advisor.md` (or equivalent path) and not from any path under `apps/mat/`. |
| **Rationale** | Centralises persona governance and enforces the constitutional namespace separation between app personas (`packages/ai-centre/agents/`) and build agents (`.github/agents/`). |
| **ACD Reference** | Section 4.1 — Agent Personas; Section 6.2 |
| **Type** | Persona, Governance |
| **Wave** | 3 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-011 |
| **Capability** | Agent Personas |
| **Requirement** | App advisor personas (`packages/ai-centre/agents/`) and build agent personas (`.github/agents/`) SHALL be constitutionally segregated namespaces. No file, reference, or import SHALL cross this boundary. |
| **Testable Condition** | Given all source files in `packages/ai-centre/agents/`, when checked for cross-namespace references, then no file references a path under `.github/agents/`, and vice versa. |
| **Rationale** | Prevents conflation of runtime AI advisory with build-time agent orchestration — a constitutional boundary stated in ACD Section 4.2 and Section 6.2. |
| **ACD Reference** | Section 4.2 — Living Agent System build agents; Section 6.2 |
| **Type** | Persona, Governance |
| **Wave** | 2 |
| **Status** | DRAFT |

---

### 3.6 Cost & Audit Telemetry

| Field | Value |
|---|---|
| **ID** | GRS-012 |
| **Capability** | Cost & Audit Telemetry |
| **Requirement** | Every AI request processed by the AIMC SHALL produce a telemetry event containing at minimum: organisation ID, capability type, provider used, token usage (prompt and completion), and latency in milliseconds. |
| **Testable Condition** | Given any successful `ai.request()` call, when the telemetry store is queried, then a corresponding event record exists with all required fields populated and non-null. |
| **Rationale** | Enables central cost attribution and audit compliance as required by ACD Section 4.1. |
| **ACD Reference** | Section 4.1 — Cost & Audit Telemetry |
| **Type** | Technical, Governance |
| **Wave** | 3 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-013 |
| **Capability** | Cost & Audit Telemetry |
| **Requirement** | Telemetry events SHALL be immutable once written. No module or process MAY delete or modify telemetry records. |
| **Testable Condition** | Given a telemetry record written by the gateway, when any non-CS2 principal attempts deletion or update via the database, then the operation is rejected by RLS policy. |
| **Rationale** | Preserves audit trail integrity. |
| **ACD Reference** | Section 4.1 — Cost & Audit Telemetry |
| **Type** | Governance |
| **Wave** | 3 |
| **Status** | DRAFT |

---

### 3.7 Graceful Degradation

| Field | Value |
|---|---|
| **ID** | GRS-014 |
| **Capability** | Graceful Degradation |
| **Requirement** | When a primary provider is unavailable or returns an error, the AIMC SHALL automatically attempt the configured fallback provider and SHALL NOT surface raw provider error messages or stack traces to the calling module. |
| **Testable Condition** | Given a simulated primary provider failure, when `ai.request()` is called, then the response is delivered from the fallback provider (or a governed degraded response), and no provider-specific error detail is included in the returned error payload. |
| **Rationale** | Shields modules from provider instability and prevents information leakage. |
| **ACD Reference** | Section 4.1 — Graceful Degradation |
| **Type** | Technical |
| **Wave** | 3 |
| **Status** | DRAFT |

---

### 3.8 Central Key Management

| Field | Value |
|---|---|
| **ID** | GRS-015 |
| **Capability** | Central Key Management |
| **Requirement** | All provider API keys SHALL be stored exclusively in CS2-managed environment secrets. No ISMS module's source code, configuration file, or environment template SHALL contain or reference a provider API key directly. |
| **Testable Condition** | Given a scan of all source files across the monorepo, when checked for provider API key patterns (OpenAI, Anthropic, GitHub Models, Perplexity, Runway), then no key value or key-name reference (other than the canonical secret names defined by CS2) exists outside AIMC configuration files. |
| **Rationale** | Prevents credential exposure, enables central rotation, and enforces the constitutional boundary stated in ACD Section 4.2. |
| **ACD Reference** | Section 4.2 — Per-module API key management |
| **Type** | Governance, Technical |
| **Wave** | 2 |
| **Status** | DRAFT |

---

## 4. Out-of-Scope Boundary Requirements (derived from ACD Section 4.2)

### 4.1 Direct Provider Calls Prohibition

| Field | Value |
|---|---|
| **ID** | GRS-016 |
| **Capability** | Direct provider calls from modules |
| **Requirement** | No ISMS module SHALL import, instantiate, or call any AI provider SDK (OpenAI, Anthropic, Langchain, etc.) directly. All AI interactions MUST be routed through the `@maturion/ai-centre` gateway. |
| **Testable Condition** | Given a static analysis scan of all module `package.json` files and TypeScript imports under `apps/`, then no direct provider SDK dependency (`openai`, `@anthropic-ai/sdk`, `@langchain/*`, etc.) is present. |
| **Rationale** | Constitutional prohibition stated in ACD Section 4.2 and `AIMC_STRATEGY.md` Section 1. |
| **ACD Reference** | Section 4.2 — Direct provider calls from modules |
| **Type** | Governance, Technical |
| **Wave** | 2 |
| **Status** | DRAFT |

---

### 4.2 Build-Time Agent Orchestration Exclusion

| Field | Value |
|---|---|
| **ID** | GRS-017 |
| **Capability** | Build-time agent orchestration |
| **Requirement** | The AIMC MUST NOT be used to orchestrate build-time agents. Build-time agent execution is governed exclusively by `COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` and operates outside the AIMC runtime scope. |
| **Testable Condition** | Given the AIMC gateway source code, when inspected for references to Living Agent System concepts (foreman, builder, orchestrator sessions), then no such references exist in the gateway or adapter implementations. |
| **Rationale** | Maintains clean separation of runtime and build-time AI as stated in ACD Section 4.2 and Section 6.2. |
| **ACD Reference** | Section 4.2 — Build-time agent orchestration |
| **Type** | Governance |
| **Wave** | 2 |
| **Status** | DRAFT |

---

### 4.3 UI/UX Components Exclusion

| Field | Value |
|---|---|
| **ID** | GRS-018 |
| **Capability** | UI/UX components |
| **Requirement** | The AIMC (`packages/ai-centre/`) SHALL NOT implement any front-end UI components, hooks, or rendering logic. Front-end rendering of AI responses is each consuming module's responsibility. |
| **Testable Condition** | Given all files under `packages/ai-centre/`, when inspected for React components, JSX, or CSS, then no such artefacts exist. The package exposes only a programmatic TypeScript API. |
| **Rationale** | Keeps the AIMC a back-end platform package as stated in ACD Section 4.2. |
| **ACD Reference** | Section 4.2 — UI/UX components |
| **Type** | Technical, Governance |
| **Wave** | 2 |
| **Status** | DRAFT |

---

## 5. Wave Gate Requirements (derived from ACD Section 5)

| Field | Value |
|---|---|
| **ID** | GRS-019 |
| **Capability** | Wave Gates — General |
| **Requirement** | No wave in the AIMC 8-wave implementation plan SHALL commence until the preceding wave's deliverables have been CS2-reviewed and approved. Wave execution MUST be strictly sequential; no wave skipping is permitted. |
| **Testable Condition** | Given the wave closure record for wave N, when wave N+1 start is requested, then a CS2-signed wave-close confirmation exists in governance memory for wave N. |
| **Rationale** | Enforces the AIMC_STRATEGY.md wave model and prevents partial or out-of-order implementation. |
| **ACD Reference** | Section 5 — preamble |
| **Type** | Process, Governance |
| **Wave** | All waves |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-020 |
| **Capability** | Wave Gate — Wave 1 → Wave 2 |
| **Requirement** | Wave 2 (Package Scaffold & Schema) MUST NOT commence until the GRS (this document) and the APS (`governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md`) have both been CS2-reviewed and signed-off. |
| **Testable Condition** | Given a request to start Wave 2, when the Foreman evaluates the Wave-2-start pre-condition, then the GRS and APS both carry an explicit CS2 sign-off notation and are not in DRAFT status. |
| **Rationale** | Ensures architecture and requirements are frozen before any code scaffold is laid. |
| **ACD Reference** | Section 5 Wave 1; Section 7.1 |
| **Type** | Process, Governance |
| **Wave** | 1 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-021 |
| **Capability** | Wave Gate — Wave 2 → Wave 3 |
| **Requirement** | Wave 3 (Gateway + Advisory Capability) MUST NOT commence until the APS is frozen (CS2-signed-off) and the Wave 2 package scaffold and schema deliverables are verified GREEN. |
| **Testable Condition** | Given a request to start Wave 3, when the Foreman evaluates the Wave-3-start pre-condition, then the APS status is `APPROVED` and all Wave 2 tests pass. |
| **Rationale** | ACD Section 7.2 states the APS is the Wave-3-blocker. |
| **ACD Reference** | Section 5 Wave 2; Section 7.2 |
| **Type** | Process, Governance |
| **Wave** | 2 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-022 |
| **Capability** | Wave Gate — Wave 7 → Wave 8 |
| **Requirement** | Wave 8 (Video Generation + Algorithm Execution + Governance Certification) MUST include a full cost-governance audit and AIMC production-readiness certification as a wave-close deliverable, in addition to the technical capability completions. |
| **Testable Condition** | Given Wave 8 close, when the Foreman evaluates the wave-close checklist, then an audit report exists that verifies all telemetry records, all wave-gate sign-offs, and certifies the AIMC production-ready per CS2. |
| **Rationale** | Implements the Wave 8 Governance Certification extension documented as a Wave 1 governance decision in ACD Section 5. |
| **ACD Reference** | Section 5 Wave 8 footnote |
| **Type** | Governance, Process |
| **Wave** | 8 |
| **Status** | DRAFT |

---

## 6. Governance Process Requirements

| Field | Value |
|---|---|
| **ID** | GRS-023 |
| **Capability** | Governance Process |
| **Requirement** | Every AIMC wave SHALL be governed by the Foreman (`foreman-v2`) under the POLC model. No builder agent may begin implementation on any wave without a Foreman-issued wave-start authorization that references a frozen architecture document and a RED QA suite. |
| **Testable Condition** | Given any Wave N implementation PR, when its governance trace is inspected, then a Foreman wave-start authorization record exists in agent workspace memory, referencing a frozen architecture document and a non-empty list of RED tests. |
| **Rationale** | Implements the POLC governance model as stated in ACD Section 6.4 and `LIVING_AGENT_SYSTEM.md` v6.2.0. |
| **ACD Reference** | Section 6.4 |
| **Type** | Governance, Process |
| **Wave** | All waves |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-024 |
| **Capability** | Governance Process |
| **Requirement** | All AIMC governance artefacts (ACD, GRS, APS, wave architecture documents) SHALL be stored in `governance/aimc/` within the `maturion-isms` repository and SHALL cross-reference each other using relative paths. |
| **Testable Condition** | Given any AIMC governance artefact, when its reference section is inspected, then all related AIMC artefact citations use paths of the form `governance/aimc/<filename>.md`. |
| **Rationale** | Enables traceability and ensures artefact discovery is deterministic. |
| **ACD Reference** | Section 1 (location); Section 7 (seeding context) |
| **Type** | Governance |
| **Wave** | 1 |
| **Status** | DRAFT |

---

## 7. Technical Architecture Requirements

| Field | Value |
|---|---|
| **ID** | GRS-025 |
| **Capability** | Package Structure |
| **Requirement** | The AIMC SHALL be implemented as a TypeScript package at `packages/ai-centre/` in the `maturion-isms` monorepo, exporting a public API under the package name `@maturion/ai-centre`. |
| **Testable Condition** | Given the monorepo package registry, when `@maturion/ai-centre` is resolved, then the package root is `packages/ai-centre/` and the public API exports are defined in `packages/ai-centre/src/index.ts`. |
| **Rationale** | Establishes the canonical package location for all consumer modules to reference. |
| **ACD Reference** | Section 2; Section 6.3 |
| **Type** | Technical |
| **Wave** | 2 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-026 |
| **Capability** | TypeScript Interfaces |
| **Requirement** | All public-facing AIMC TypeScript interfaces (request, response, capability enums, provider adapter contract, memory protocol, telemetry event) SHALL be defined in the APS and implemented as-specified with no deviation. |
| **Testable Condition** | Given the APS interface definitions and the implemented source types, when a TypeScript type-check is run with `strict: true`, then all implementations satisfy the APS-defined interfaces without type errors. |
| **Rationale** | Ensures that modules integrating with the AIMC have a stable, type-safe contract. |
| **ACD Reference** | Section 4.1 — Single Gateway; APS cross-reference |
| **Type** | Technical |
| **Wave** | 2 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-027 |
| **Capability** | Supabase Schema |
| **Requirement** | The AIMC SHALL define Supabase migrations for all AI-related tables (memory, telemetry) in `packages/ai-centre/supabase/migrations/`. Row-Level Security (RLS) policies SHALL be applied to all tables, enforcing `organisation_id` tenant isolation. |
| **Testable Condition** | Given the Supabase schema, when an RLS policy is applied and a cross-tenant query is attempted without elevated privileges, then the query returns zero rows from any other tenant. |
| **Rationale** | Implements multi-tenant isolation and centralises AI schema ownership per GRS-009. |
| **ACD Reference** | Section 5 Wave 2 |
| **Type** | Technical |
| **Wave** | 2 |
| **Status** | DRAFT |

---

## 8. Persona Requirements

| Field | Value |
|---|---|
| **ID** | GRS-028 |
| **Capability** | Persona Protocol |
| **Requirement** | The AIMC SHALL implement a persona loading protocol that discovers available persona files at startup from `packages/ai-centre/agents/`, validates each file's format, and makes them addressable by a well-known `agentId` string in the request payload. |
| **Testable Condition** | Given a persona file at `packages/ai-centre/agents/mat-advisor.md`, when `ai.request({ agent: 'mat-advisor', ... })` is called, then the persona file content is used as the system prompt. If the `agentId` does not correspond to a known file, the gateway returns a governed error. |
| **Rationale** | Enables module-specific advisory personas without modules needing filesystem knowledge. |
| **ACD Reference** | Section 4.1 — Agent Personas |
| **Type** | Persona, Technical |
| **Wave** | 3 |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-029 |
| **Capability** | Persona Protocol |
| **Requirement** | Persona files SHALL be plain Markdown (`.md`) text files. They SHALL NOT contain executable code, provider configuration, or memory injection logic. The gateway is responsible for composing the full context window; persona files provide only the system prompt content. |
| **Testable Condition** | Given all files under `packages/ai-centre/agents/`, when parsed as Markdown and inspected for code blocks, TypeScript imports, or JSON configuration, then none contain executable content. |
| **Rationale** | Maintains clear separation of concerns between static persona content and dynamic gateway assembly logic. |
| **ACD Reference** | Section 4.1 — Agent Personas |
| **Type** | Persona, Governance |
| **Wave** | 3 |
| **Status** | DRAFT |

---

## 9. Memory Requirements

| Field | Value |
|---|---|
| **ID** | GRS-030 |
| **Capability** | Memory Protocol |
| **Requirement** | The AIMC SHALL assemble the context window for every request in the following order: (1) persona system prompt, (2) persistent memory (from Supabase, filtered by organisation), (3) session memory (in-process, scoped to session ID), (4) domain knowledge (from embeddings / RAG, Wave 5+), (5) current user input. |
| **Testable Condition** | Given a request with a known session ID and organisation, when the context window is captured before provider dispatch, then its segments appear in the specified order and the persistent and session memories contain only records belonging to the correct organisation and session. |
| **Rationale** | Defines the canonical context assembly order to ensure consistent, predictable AI response quality. |
| **ACD Reference** | Section 4.1 — Memory Centre; Section 5 Waves 3–5 |
| **Type** | Memory, Technical |
| **Wave** | 3 (partial) / 4 (full) / 5 (with RAG) |
| **Status** | DRAFT |

---

| Field | Value |
|---|---|
| **ID** | GRS-031 |
| **Capability** | Memory Protocol |
| **Requirement** | The AIMC SHALL implement a memory lifecycle with explicit CREATE, READ, and PRUNE operations. The PRUNE operation SHALL enforce a configurable maximum context length, removing oldest entries first. |
| **Testable Condition** | Given a session with 200 turns of history, when the context window would exceed the configured maximum token budget, then the PRUNE operation removes the oldest turns until the window fits within the budget. |
| **Rationale** | Prevents context window overflow and controls per-request token cost. |
| **ACD Reference** | Section 4.1 — Memory Centre |
| **Type** | Memory, Technical |
| **Wave** | 3 |
| **Status** | DRAFT |

---

## 10. Requirement Traceability Summary

The following table maps every ACD Section 4 entry to its GRS requirement(s):

| ACD Item | GRS Requirements |
|---|---|
| Single Gateway (in scope) | GRS-001, GRS-002 |
| Capability Routing (in scope) | GRS-003, GRS-004 |
| Provider Adapters (in scope) | GRS-005, GRS-006 |
| Memory Centre (in scope) | GRS-007, GRS-008, GRS-009, GRS-030, GRS-031 |
| Agent Personas (in scope) | GRS-010, GRS-011, GRS-028, GRS-029 |
| Cost & Audit Telemetry (in scope) | GRS-012, GRS-013 |
| Graceful Degradation (in scope) | GRS-014 |
| Central Key Management (in scope) | GRS-015 |
| Direct provider calls from modules (out of scope) | GRS-016 |
| Build-time agent orchestration (out of scope) | GRS-017 |
| Living Agent System build agents (out of scope) | GRS-011 |
| Module-owned AI memory tables (out of scope) | GRS-009 |
| Per-module API key management (out of scope) | GRS-015 |
| UI/UX components (out of scope) | GRS-018 |
| Wave Gates (Section 5) | GRS-019, GRS-020, GRS-021, GRS-022 |
| POLC Governance (Section 6.4) | GRS-023 |
| Artefact Storage (Section 1, 7) | GRS-024 |
| Package Structure (Section 2, 6.3) | GRS-025 |
| TypeScript Interfaces | GRS-026 |
| Supabase Schema (Wave 2) | GRS-027 |

---

## 11. References

| Document | Location | Role |
|---|---|---|
| ACD — Capability Description | `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md` | Primary canonical input for this GRS |
| APS — Agent & Protocol Specification | `governance/aimc/AIMC_AGENT_PROTOCOL_SPECIFICATION.md` | Sibling artefact; APS maps GRS requirements to TypeScript interfaces and protocol steps |
| `AIMC_STRATEGY.md` v1.0.0 | `governance/canon/AIMC_STRATEGY.md` | Constitutional authority for AIMC architecture and governance principles |
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` | Living Agent framework; governs build agents that implement the AIMC |
| `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` | `governance/canon/MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` | Constitutional authority for Memory Centre design |
| `WAVE_MODEL.md` | `governance/canon/WAVE_MODEL.md` | Wave model governing the 8-wave sequence |

---

## 12. Acceptance Criteria

This GRS is complete and ready for CS2 sign-off when all of the following are satisfied:

- [x] File exists at `governance/aimc/AIMC_GOVERNANCE_REQUIREMENTS_SPECIFICATION.md`
- [x] All ACD Section 4.1 in-scope capabilities are mapped to at least one GRS requirement
- [x] All ACD Section 4.2 out-of-scope boundaries are mapped to at least one GRS requirement
- [x] All ACD Section 5 wave gates are represented as GRS requirements
- [x] Every requirement follows the structure defined in Section 2 of this document
- [x] Traceability summary (Section 10) is complete with no unmapped ACD items
- [x] APS is cross-referenced as the sibling artefact
- [x] Wave-2 gate is explicitly stated
- [ ] CS2 review and sign-off received

---

*End of Document*

**Authority**: `governance/canon/AIMC_STRATEGY.md` v1.0.0 | `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0  
**Input**: `governance/aimc/AIMC_CAPABILITY_DESCRIPTION.md`  
**Drafted**: 2026-02-23  
**Next Action**: CS2 review → sign-off → APS finalisation → Wave 2 start
