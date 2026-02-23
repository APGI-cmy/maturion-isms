# MANUAL AUDIT TOOL (MAT) – AI ARCHITECTURE v2.0.0

| Field            | Value                                                                  |
|------------------|------------------------------------------------------------------------|
| Module           | MAT – Manual Audit Tool                                                |
| Version          | v2.0.0                                                                 |
| Status           | REALIGNED — Supersedes v1.0.0                                          |
| Classification   | Internal – Architecture                                                |
| Owner            | Maturion Platform Team                                                 |
| Last Updated     | 2026-02-23                                                             |
| Constitutional Authority | `AIMC_STRATEGY.md` v1.0.0 (AI Management Centre Strategy)     |
| TRS Requirements | TR-037, TR-038, TR-039, TR-040, TR-041, TR-072 (see AIMC blocker note) |

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
| FRS (AI requirements)           | `modules/mat/01-frs/functional-requirements.md` FR-005, FR-023–FR-032, FR-072 |
| TRS (AI requirements)           | `modules/mat/01.5-trs/technical-requirements-specification.md` TR-037–TR-041, TR-072 |
| Implementation Plan             | `modules/mat/03-implementation-plan/implementation-plan.md` Waves 7–9 |
| Build Progress Tracker          | `modules/mat/BUILD_PROGRESS_TRACKER.md` (AIMC deviation entry)   |
| AIMC Package                    | `@maturion/ai-centre` (shared package — external to MAT)         |

**Change Log**:
- v2.0.0 (2026-02-23): Full realignment to AIMC Gateway pattern per `AIMC_STRATEGY.md` v1.0.0.
  Supersedes v1.0.0. All direct provider references removed. AIMC integration barrier documented.
  Waves 7–9 defined as BLOCKED until upstream AIMC waves complete. Issue #377 superseded.
- v1.0.0 (2025-01-01): Initial AI architecture (now superseded — constitutionally prohibited pattern).
