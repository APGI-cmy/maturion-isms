# MANUAL AUDIT TOOL (MAT) – AI ARCHITECTURE v3.0.0

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Module           | MAT – Manual Audit Tool                                                |
| Version          | v3.0.0                                                                 |
| Status           | FROZEN — Architecture freeze effective on merge per CS2 directive 2026-02-27 |
| Classification   | Internal – Architecture                                                |
| Owner            | Maturion Platform Team                                                 |
| Last Updated     | 2026-02-27                                                             |
| Constitutional Authority | `AIMC_STRATEGY.md` v1.0.0 (AI Management Centre Strategy)     |
| TRS Requirements | TR-037, TR-038, TR-039, TR-040, TR-041, TR-072, TR-073, TR-074, TR-075, TR-076, TR-077 |

> **⚠️ GOVERNANCE REALIGNMENT NOTICE — v2.0.0**
>
> This document supersedes `ai-architecture.md` v1.0.0. All prior content describing direct AI provider calls
> (OpenAI API keys, GPT-4 Turbo model strings, Whisper API, circuit breaker implementation, etc.) from within
> MAT is **constitutionally prohibited** per `AIMC_STRATEGY.md` v1.0.0.
>
> **AIMC Strategy is canonical authority.** MAT MUST NOT implement or call any AI provider directly.
> All AI capabilities MUST be consumed exclusively via the `@maturion/ai-centre` package and its Gateway.
>
> **MAT AI integration is BLOCKED until the corresponding AIMC waves are complete.**
> Builders MUST NOT proceed with any AI implementation wave until POLC/CS2 approves the realigned plans
> and the upstream AIMC wave is confirmed delivered.

---

## 1. AI Architecture Overview — AIMC Gateway Pattern

MAT consumes AI capabilities exclusively through the `@maturion/ai-centre` Gateway. This is a hard
architectural constraint imposed by `AIMC_STRATEGY.md` v1.0.0 and enforced at every wave gate.

```
┌─────────────────────────────────────────────────────────┐
│                   MAT Module                            │
│                                                         │
│  ┌──────────────┐    ┌──────────────────────────────┐   │
│  │  MAT Service │───▶│  @maturion/ai-centre Gateway │   │
│  │  (any wave)  │    │  (AIMC shared package)       │   │
│  └──────────────┘    └──────────────┬───────────────┘   │
│                                     │ AIMC internal      │
└─────────────────────────────────────│───────────────────┘
                                      ▼
                          ┌───────────────────────┐
                          │  AI Providers         │
                          │  (managed by AIMC)    │
                          └───────────────────────┘
```

**Constitutional constraints** (non-negotiable):

1. MAT MUST NOT hold any AI provider API keys — keys are owned and managed by AIMC.
2. MAT MUST NOT import or depend on any AI provider SDK (OpenAI, Anthropic, etc.).
3. All AI task invocations go through `@maturion/ai-centre` Gateway method calls.
4. Model selection, routing, fallback, circuit breaking, and rate limiting are all AIMC responsibilities.
5. App-facing AI personas (e.g., Maturity Advisor) MUST be sourced from the AIMC canonical agent
   directory — MAT does not define its own personas.

---

## 2. AIMC Integration Barrier

MAT cannot implement or use any AI feature until the corresponding AIMC wave is completed and the
`@maturion/ai-centre` package exposes the required Gateway capability.

| MAT AI Wave       | AIMC Prerequisite Wave | Status                            |
|-------------------|------------------------|-----------------------------------|
| Wave 7 – Advisory Integration (FR-072, TR-072) | AIMC Wave 3 – Advisory Gateway | **BLOCKED — Awaiting AIMC Wave 3** |
| Wave 8 – Analysis Integration (scoring, parsing) | AIMC Wave 4 – Analysis Gateway | **BLOCKED — Awaiting AIMC Wave 4** |
| Wave 9 – Embeddings/RAG Integration | AIMC Wave 5 – Embeddings/RAG Gateway | **BLOCKED — Awaiting AIMC Wave 5** |

**No MAT AI wave may begin or pass its gate before its upstream AIMC wave is confirmed complete.**

---

## 3. AI Capability Mapping — AIMC Gateway Methods

The following table describes how each MAT AI capability maps to the AIMC Gateway. These method
signatures are indicative; the authoritative contract is published by the AIMC package.

| MAT Capability              | FRS Ref  | TRS Ref  | AIMC Gateway Method (indicative)              |
|-----------------------------|----------|----------|-----------------------------------------------|
| Criteria document parsing   | FR-005   | TR-037   | `aimc.analysis.parseCriteriaDocument(input)`  |
| Maturity scoring per criterion | FR-023 | TR-038   | `aimc.analysis.scoreMaturity(input)`          |
| Audio/video transcription   | FR-014, FR-017 | TR-039 | `aimc.analysis.transcribe(input)`           |
| AI task routing (all tasks) | FR-028   | TR-040   | Managed internally by AIMC Gateway            |
| AI invocation logging       | FR-029   | TR-017   | Managed internally by AIMC Gateway            |
| Confidence flagging         | FR-030   | TR-038   | Returned in Gateway response payload          |
| Rate limiting & circuit breaker | FR-031 | TR-041  | Managed internally by AIMC Gateway            |
| Embedded AI assistant panel | FR-072   | TR-072   | `aimc.advisory.chat(persona, message)`        |

**Key principle**: MAT supplies context and receives structured results. MAT does NOT configure models,
manage retries, or hold any provider credentials.

---

## 4. App-Facing Personas

AI personas (e.g., "Maturity Advisor", "Document Parser", "Scoring Assistant") MUST be sourced
from the AIMC canonical agent directory. MAT MUST NOT define, version, or host its own persona
configuration files.

MAT declares which persona it wants to use by passing a persona identifier to the Gateway:

```typescript
// Example — indicative only; authoritative contract defined by AIMC package
import { AIMCGateway } from '@maturion/ai-centre';

const response = await AIMCGateway.advisory.chat({
  persona: 'maturity-advisor',   // sourced from AIMC agent directory
  message: userMessage,
  context: { auditId, criterionId }
});
```

Persona identifiers and their capabilities are published by the AIMC package. MAT must not hardcode
model names, temperature values, or token limits.

---

## 5. AI Invocation Logging (MAT Responsibility)

Although AIMC manages provider-level logging, MAT retains responsibility for audit-domain logging:

- Record that an AI capability was invoked for a given `audit_id` and `criterion_id`.
- Record the AIMC invocation reference ID returned by the Gateway (for cross-system traceability).
- Record human confirmation / override decisions per FR-025 and FR-026.
- Log all of the above to the MAT `ai_invocation_log` table (schema defined in `data-architecture.md`).

MAT MUST NOT log raw AI prompts or responses (privacy constraint per FR-066). Only metadata and
AIMC-issued reference IDs are stored.

---

## 6. Security Constraints

- No AI provider API keys in any MAT configuration, environment file, or frontend bundle.
- No direct provider SDK imports in MAT source code.
- All AI traffic routes through the AIMC Gateway (server-side only; no client-to-AIMC direct calls
  from the React frontend — all AI calls are proxied through MAT backend Edge Functions).
- AI output validated by MAT against expected schemas before storage (prevents injection attacks
  via malformed Gateway responses).

---

## 9. AI Gateway Collaborator Architecture (Wave 10)

> **Version Note**: This section was added in v3.0.0 to document the Wave 10 gap remediation
> that replaces all null/stub collaborators in `api/ai/request.ts` with real implementations
> from `@maturion/ai-centre`. Architecture freeze per CS2 directive 2026-02-27.

### 9.1 Collaborator Wiring

The `api/ai/request.ts` serverless handler MUST wire three collaborators from `@maturion/ai-centre`
into the `AICentreConfig` passed to `buildAICentre()`:

```
api/ai/request.ts
└── buildAICentre()
    ├── personaLoader   : PersonaLoader       (packages/ai-centre/src/personas/PersonaLoader.ts)
    ├── sessionMemory   : SessionMemoryStore   (packages/ai-centre/src/memory/SessionMemoryStore.ts)
    └── persistentMemory: PersistentMemoryAdapter (packages/ai-centre/src/memory/PersistentMemoryAdapter.ts)
```

**Before Wave 10** (current state, PROHIBITED after merge):
- `personaLoader` = `nullPersonaLoader` (no-op object literal — always returns `''`)
- `sessionMemory` = `nullSessionMemory` (no-op object literal — always returns `[]`)
- `persistentMemory` = `nullPersistentMemory` (no-op object literal — always returns `[]`)

**After Wave 10** (required state):
- `personaLoader` = `new PersonaLoader()` (reads persona Markdown from AIMC agent directory)
- `sessionMemory` = `new SessionMemoryStore()` (in-memory per-invocation accumulation)
- `persistentMemory` = `new PersistentMemoryAdapter()` (in-memory Wave 10 baseline)

### 9.2 Persona Loading Flow

```
Request (agent: "mat-advisor")
  │
  ▼
PersonaLoader.load("mat-advisor")
  │
  ├── validateAgentId() — path traversal guard
  ├── readFile(AGENTS_DIR/mat-advisor.md)
  │     ├── SUCCESS → systemPrompt = file content
  │     └── NOT FOUND → throw PersonaNotFoundError
  │                       → AICentre returns UNKNOWN_AGENT error
  ▼
AICentreConfig.personaLoader used in AICentre.request()
```

**Constraint**: PersonaLoader path is resolved relative to `packages/ai-centre/src/agents/` at
package build time. In the Vercel serverless environment, this directory is bundled with the
function and accessible via the Node.js filesystem.

### 9.3 Session Memory Flow

```
Request (sessionId: "sess-abc")
  │
  ▼
SessionMemoryStore (new instance per serverless invocation)
  │
  ├── MemoryLifecycle.recordTurn() → sessionMemory.append(sessionId, turn)
  ├── sessionMemory.getHistory(sessionId) → prior turns (this invocation only)
  └── On session end: sessionMemory.clearSession(sessionId)
```

**Serverless Constraint**: Each Vercel function invocation creates a fresh `SessionMemoryStore`
instance. Within a single invocation, session history accumulates correctly. Across invocations,
the in-memory store is empty (cold start). This is by design for Wave 10; Wave 11 introduces
Supabase-backed cross-invocation persistence (see §9.5).

### 9.4 Persistent Memory Hierarchy

| Wave | Adapter | Backing Store | Scope |
|------|---------|---------------|-------|
| Wave 4 (delivered) | `PersistentMemoryAdapter` (in-memory) | In-process array | Per function invocation |
| **Wave 10 (this wave)** | `PersistentMemoryAdapter` (in-memory) | In-process array | Per function invocation |
| Wave 11 (deferred) | `SupabasePersistentMemoryAdapter` (planned) | Supabase `ai_memory` table | Cross-invocation, persistent |

Wave 11 Supabase schema reference: `packages/ai-centre/supabase/migrations/001_ai_memory.sql`

Organisation-level tenant isolation in the Supabase adapter MUST be enforced via:
- Query filter: `organisation_id = params.organisationId` (in addition to RLS)
- Reference: GRS-008

### 9.5 Wave 11 Supabase Migration Path

When Wave 11 delivers the Supabase-backed `SupabasePersistentMemoryAdapter`:

1. `buildAICentre()` in `api/ai/request.ts` passes `new SupabasePersistentMemoryAdapter(supabaseClient)`.
2. `supabaseClient` is constructed from `process.env.SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY`.
3. All `persist()` calls write to the `ai_memory` table.
4. All `retrieve()` calls query `ai_memory WHERE organisation_id = $1`.
5. `pruneExpired()` deletes expired entries via `DELETE WHERE expires_at < NOW()`.
6. The `TODO(Wave5)` comment in `PersistentMemoryAdapter.ts` documents the constructor contract.

**Edge Cases for Wave 11**:
- Multi-user concurrency: Supabase handles concurrent writes; no locking needed at application layer (RLS + tenant filter is sufficient).
- Connection pool scaling: `@supabase/supabase-js` uses a single HTTP client per instance; for high concurrency, multiple AICentre instances share the same Supabase client via module-level singleton.
- Concurrent persona requests: PersonaLoader is stateless (reads files); concurrent requests are safe.

---

## 10. Health Check Endpoint

The system exposes `GET /api/ai/health` (implemented in `api/ai/health.ts`) to verify gateway
operational status and report adapter configuration.

**Response Schema**:
```json
{
  "status": "ok",
  "personaLoader": "real",
  "sessionMemory": "in_memory",
  "persistentMemory": "in_memory",
  "supabaseWiring": "pending_wave11"
}
```

**Status Values**:
- `status`: `"ok"` (all adapters wired) | `"degraded"` (one or more adapters unavailable)
- `personaLoader`: `"real"` (PersonaLoader class) | `"degraded"` (filesystem unavailable)
- `sessionMemory`: `"in_memory"` (SessionMemoryStore) | `"null"` (stub — should never appear post-Wave-10)
- `persistentMemory`: `"in_memory"` (Wave 10) | `"supabase"` (Wave 11) | `"null"` (stub — should never appear)
- `supabaseWiring`: `"pending_wave11"` (in-memory baseline) | `"active"` (Supabase connected)

---

## 11. Memory Runbook Reference

Full operational runbook: `api/ai/AI_GATEWAY_MEMORY_RUNBOOK.md`

Covers:
- Persona loading flow and path resolution
- Session memory lifecycle within a serverless invocation
- Persistent memory hierarchy and Wave 11 migration path
- Health check endpoint and degraded-mode behaviour
- Edge cases: cold-start amnesia, multi-user concurrency, concurrent persona requests

---

## 7. Prior Architecture (v1.0.0) — Superseded

The prior `ai-architecture.md` v1.0.0 described:

- A standalone Central AI Gateway (FastAPI) owned and operated by MAT.
- Direct OpenAI API integration (GPT-4 Turbo, Whisper, GPT-4 Vision) with API keys in MAT config.
- MAT-owned circuit breaker, retry logic, model routing table, and rate limiter.
- MAT-defined model routing configuration.

**All of the above is constitutionally prohibited under `AIMC_STRATEGY.md` v1.0.0.**

This prior design is retained here as an information record only. It MUST NOT be used as a build
reference. Any builder encountering legacy code or configuration that implements this pattern MUST
flag it as a governance violation and halt.

---

## 8. Cross-References

| Artifact                        | Location                                                          |
|---------------------------------|-------------------------------------------------------------------|
| Constitutional Authority        | `AIMC_STRATEGY.md` v1.0.0                                        |
| FRS (AI requirements)           | `modules/mat/01-frs/functional-requirements.md` FR-005, FR-023–FR-032, FR-072–FR-077 |
| TRS (AI requirements)           | `modules/mat/01.5-trs/technical-requirements-specification.md` TR-037–TR-041, TR-072–TR-077 |
| Implementation Plan             | `modules/mat/03-implementation-plan/implementation-plan.md` Waves 7–10 |
| Build Progress Tracker          | `modules/mat/BUILD_PROGRESS_TRACKER.md`                          |
| AIMC Package                    | `@maturion/ai-centre` (shared package — external to MAT)         |
| AI Gateway Handler              | `api/ai/request.ts`                                              |
| Health Check Endpoint           | `api/ai/health.ts`                                               |
| Memory Runbook                  | `api/ai/AI_GATEWAY_MEMORY_RUNBOOK.md`                            |
| Supabase Memory Migration       | `packages/ai-centre/supabase/migrations/001_ai_memory.sql`       |

**Change Log**:
- v3.0.0 (2026-02-27): Added §9 (AI Gateway Collaborator Architecture — Wave 10), §10 (Health Check Endpoint), §11 (Memory Runbook Reference). Documents replacement of null stubs with real adapter implementations. Architecture freeze effective on merge per CS2 directive. TRS Requirements extended to TR-073–TR-077.
- v2.0.0 (2026-02-23): Full realignment to AIMC Gateway pattern per `AIMC_STRATEGY.md` v1.0.0.
  Supersedes v1.0.0. All direct provider references removed. AIMC integration barrier documented.
  Waves 7–9 defined as BLOCKED until upstream AIMC waves complete. Issue #377 superseded.
- v1.0.0 (2025-01-01): Initial AI architecture (now superseded — constitutionally prohibited pattern).
