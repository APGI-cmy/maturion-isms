# AI Gateway Memory Architecture Runbook

**Version**: 1.0.0
**Wave**: Wave 10 — AI Gateway Memory Wiring (Gap Remediation)
**Architecture Reference**: `modules/mat/02-architecture/ai-architecture.md` v3.0.0 §9–§11
**FRS**: FR-073–FR-077 | **TRS**: TR-073–TR-077

---

## 1. Overview

The AI gateway (`api/ai/request.ts`) is a Vercel serverless handler that routes AI capability
requests through the `@maturion/ai-centre` AICentre Gateway. It wires three collaborators:

| Collaborator | Wave 10 Implementation | Wave 11 Plan |
|---|---|---|
| `personaLoader` | `PersonaLoader` (file-system) | No change planned |
| `sessionMemory` | `SessionMemoryStore` (in-memory) | Supabase-backed (optional) |
| `persistentMemory` | `PersistentMemoryAdapter` (in-memory) | `SupabasePersistentMemoryAdapter` |

---

## 2. Persona Loading Flow

```
Request { agent: "mat-advisor", ... }
  │
  ▼
AICentre.request()
  │
  ├── req.agent present?
  │     YES → PersonaLoader.load("mat-advisor")
  │             ├── validateAgentId() — rejects path traversal (/, \, ..)
  │             ├── readFile(AGENTS_DIR/mat-advisor.md)
  │             │     SUCCESS → systemPrompt = file content
  │             │     NOT FOUND → throw PersonaNotFoundError
  │             │                   → AICentre returns UNKNOWN_AGENT error (no 500)
  │     NO  → systemPrompt = '' (persona-less request)
  │
  ▼
Adapter.execute({ systemPrompt, ... })
```

**PersonaLoader path**: Resolved at module initialisation to
`packages/ai-centre/src/agents/` relative to the package. In the Vercel serverless environment,
this directory is bundled with the function at build time.

**Security**: `validateAgentId()` in `PersonaLoader` rejects any `agentId` containing `/`, `\`, or
`..`. No additional sanitisation is required in the gateway.

---

## 3. Session Memory Flow

```
Request { context: { sessionId: "sess-abc", ... } }
  │
  ▼
SessionMemoryStore (new instance per serverless invocation)
  │
  ├── MemoryLifecycle.recordTurn()  [if memoryLifecycle is wired in AICentreConfig]
  │     → sessionMemory.append(sessionId, { role, content, timestamp, estimatedTokens })
  │
  ├── sessionMemory.getHistory(sessionId) → prior turns (this invocation only)
  │
  └── On session end: sessionMemory.clearSession(sessionId)
```

**Cold-Start Amnesia**: Each Vercel function invocation creates a fresh `SessionMemoryStore`.
Cross-invocation persistence is NOT available at Wave 10. The caller is responsible for:
- Passing a consistent `sessionId` across requests
- Reconstructing context from persistent memory (Wave 11) if needed

---

## 4. Persistent Memory Hierarchy

### Wave 10 (Current): In-Memory Baseline

```
PersistentMemoryAdapter (in-memory)
  ├── store: PersistedMemoryEntry[]  ← in-process array, reset on cold start
  ├── persist(entry) → store.push(entry)
  ├── retrieve({ organisationId, sessionId?, limit? }) → filtered array
  └── pruneExpired(organisationId) → removes expired entries by expiresAt
```

**Limitation**: Data is lost on every cold start. Suitable for Wave 10 development/testing only.

### Wave 11 (Planned): Supabase-Backed Adapter

**Migration path**:
1. Implement `SupabasePersistentMemoryAdapter` in `packages/ai-centre/src/memory/`.
2. Constructor: `constructor(supabaseClient: SupabaseClient)`
3. All operations use `ai_memory` table (see `packages/ai-centre/supabase/migrations/001_ai_memory.sql`).
4. Tenant isolation: every query filters `WHERE organisation_id = $organisationId` (not RLS alone).
5. Update `buildPersistentMemory()` in `api/ai/request.ts` to:
   ```typescript
   export function buildPersistentMemory(): SupabasePersistentMemoryAdapter {
     const supabase = createClient(
       process.env['SUPABASE_URL']!,
       process.env['SUPABASE_SERVICE_ROLE_KEY']!
     );
     return new SupabasePersistentMemoryAdapter(supabase);
   }
   ```
6. Environment variables required: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

**Governance reference**: GRS-008 (tenant isolation); `PersistentMemoryAdapter.ts` TODO(Wave5) comment.

---

## 5. Health Check Endpoint

**Path**: `GET /api/ai/health`
**Handler**: `api/ai/health.ts`

**Response schema** (Wave 10):
```json
{
  "status": "ok",
  "personaLoader": "real",
  "sessionMemory": "in_memory",
  "persistentMemory": "in_memory",
  "supabaseWiring": "pending_wave11",
  "timestamp": 1740614400000
}
```

**Status field values**:
- `status`: `"ok"` (all adapters wired) | `"degraded"` (adapter unavailable)
- `personaLoader`: `"real"` (PersonaLoader class used) | `"degraded"` (filesystem inaccessible)
- `sessionMemory`: `"in_memory"` (Wave 10) | `"supabase"` (future)
- `persistentMemory`: `"in_memory"` (Wave 10) | `"supabase"` (Wave 11)
- `supabaseWiring`: `"pending_wave11"` (current) | `"active"` (Wave 11)

**Non-GET methods**: Return 405 Method Not Allowed.
**Authentication**: None required — health checks must be unauthenticated.

---

## 6. Edge Cases

### 6.1 Cold-Start Session Amnesia

**Symptom**: User sends follow-up message; AI has no context of prior turns.
**Root cause**: Serverless cold start — `SessionMemoryStore` is fresh per invocation.
**Wave 10 mitigation**: Document to callers; client-side session tracking is the current workaround.
**Wave 11 resolution**: Supabase-backed `PersistentMemoryAdapter` stores turns cross-invocation.

### 6.2 Multi-User Concurrency

**Wave 10**: Each request creates separate `PersonaLoader`, `SessionMemoryStore`, and
`PersistentMemoryAdapter` instances — no shared mutable state between concurrent requests.
**Wave 11 (Supabase)**: Supabase client handles concurrent writes. RLS + tenant filter (`organisation_id`)
prevents cross-tenant data leakage. No application-level locking required.

### 6.3 Concurrent Persona Requests

`PersonaLoader.load()` is stateless (reads a file). Concurrent invocations for the same persona
are safe — each reads the same file independently.

### 6.4 Persona File Not Found

If a request specifies `agent: "unknown-persona"` and the file does not exist:
- `PersonaLoader.load()` throws `PersonaNotFoundError`
- `AICentre` catches this and returns an `AICentreErrorResponse` with `errorCode: UNKNOWN_AGENT`
- The gateway handler returns HTTP 502 with `errorCode: UNKNOWN_AGENT`
- Never returns HTTP 500 for a missing persona

---

## 7. Environment Variables

| Variable | Required | Purpose | Wave |
|---|---|---|---|
| `GITHUB_TOKEN` | Yes | GitHub Models API key | Wave 6+ |
| `OPENAI_API_KEY` | Yes | OpenAI API key | Wave 6+ |
| `VITE_API_BASE_URL` | No | CORS origin for MAT frontend | Wave 6+ |
| `SUPABASE_URL` | Wave 11 | Supabase project URL for persistent memory | Wave 11 |
| `SUPABASE_SERVICE_ROLE_KEY` | Wave 11 | Service role key for persistent memory | Wave 11 |

---

*Runbook version 1.0.0 — Wave 10 baseline. Update on Wave 11 delivery.*
