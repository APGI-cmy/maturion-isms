# Architecture Freeze — Wave 9 Track C: Module Integration Layer

## 1. Freeze Declaration

| Field | Value |
|---|---|
| **Freeze ID** | ARCH-FREEZE-WAVE9-TRACK-C-20260226 |
| **Date** | 2026-02-26 |
| **Applies to** | Wave 9.6 (xDetect + Risk) / Wave 9.7 (PIT) / Wave 9.8 (Course Crafter + ISMS Navigator) / Wave 9.9 (Incident Intelligence + Maturity Roadmap) |
| **Status** | ✅ FROZEN |
| **Frozen by** | foreman-v2-agent (session-063-wave9.6-9.9-20260226) |
| **Authority** | CS2 — @APGI-cmy (Johan Ras) — Issue #634 |
| **Governing audit** | `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` — Gap 4: Module Integration Layer |
| **AAWP Reference** | `governance/aimc/AIMC_AGENT_ASSIGNMENT_WAVE_PLAN.md` v0.2.0, Section 4, Waves 9.6–9.9 |

**This document is frozen. Any change requires explicit CS2 written approval and an amendment to this document. Silent drift is prohibited (A-001).**

---

## 2. Problem Definition

### 2.1 Current State

Seven of the eight Maturion ISMS modules are not wired to the AIMC gateway. Only MAT has been
fully wired (Wave 7: advisory; Wave 8: analysis). The remaining modules (xDetect, Risk Management,
PIT, Course Crafter, ISMS Navigator, Incident Intelligence, Maturity Roadmap) continue to either:
- Have no AI integration at all, or
- Use legacy direct-provider calls that bypass the AIMC governance layer

**This is Gap 4** in `governance/AUDIT/WAVE9_AIMC_FUNCTIONALITY_AUDIT.md` §4.4.

### 2.2 "Wired to AIMC" — Operational Definition

A module is considered **fully wired to AIMC** when ALL of the following are true:

1. The module has at least one AIMC integration service that calls `POST /api/ai/request`
2. The integration service uses `capability` and `agent` fields to route via AIMC (never provider-specific model names)
3. A persona file exists in `packages/ai-centre/src/agents/` for the module's AI role
4. Wiring invariant tests exist at `modules/<module>/tests/wiring-invariants/` confirming AIMC-only routing
5. No legacy direct AI provider calls remain ungated in the module
6. AI gateway smoke tests exist at `modules/<module>/tests/ai-gateway-smoke/` (or equivalent)

### 2.3 Module Status at Wave Start

| Module | Personas Available | Legacy AI Calls | AIMC Wired | Wave |
|---|---|---|---|---|
| xDetect | `xdetect-advisor.md` ✅ | Unknown / None | ❌ | 9.6 |
| Risk Management | `risk-advisor.md` ✅ | Unknown / None | ❌ | 9.6 |
| PIT | `pit-advisor.md` ❌ (to be created in 9.7) | Unknown / None | ❌ | 9.7 |
| Course Crafter | `course-crafter-advisor.md` ✅ | Unknown / None | ❌ | 9.8 |
| ISMS Navigator | `isms-navigator.md` ✅ | Unknown / None | ❌ | 9.8 |
| Incident Intelligence | `incident-intelligence-advisor.md` ❌ (to be created in 9.9) | Unknown / None | ❌ | 9.9 |
| Maturity Roadmap | `maturity-roadmap-advisor.md` ❌ (to be created in 9.9) | Unknown / None | ❌ | 9.9 |

---

## 3. Scope Per Subwave

### 3.1 Wave 9.6 — xDetect + Risk Management

#### IN SCOPE

| Deliverable | Location | Notes |
|---|---|---|
| xDetect AIMC wiring service | `modules/xdetect/src/services/aimc-wiring.ts` | Calls `POST /api/ai/request` with `capability: 'advisory'`, `agent: 'xdetect-advisor'` |
| xDetect wiring invariant tests | `modules/xdetect/tests/wiring-invariants/wiring-invariants.test.ts` | RED first; must fail before implementation |
| xDetect AI gateway smoke tests | `modules/xdetect/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first; PersonaLoader test + no-legacy-call test |
| Risk Management AIMC wiring service | `modules/risk-management/src/services/aimc-wiring.ts` | Calls `POST /api/ai/request` with `capability: 'advisory'`, `agent: 'risk-advisor'` |
| Risk Management wiring invariant tests | `modules/risk-management/tests/wiring-invariants/wiring-invariants.test.ts` | RED first |
| Risk Management AI gateway smoke tests | `modules/risk-management/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first |
| Legacy AI path audit | Both modules | Confirm no direct provider calls; if found, gate them |

#### OUT OF SCOPE

| Item | Reason |
|---|---|
| Full module feature implementation | xDetect and Risk Management full implementations are separate waves |
| UI components for AI advisory | Separate UI builder scope |
| Historical data migration | Not required for AIMC wiring |
| persona file modification | Personas already exist and are correct |

#### Agent Assignments — Wave 9.6

| Role | Agent | Task |
|---|---|---|
| QA (pre-code) | `qa-builder` | RED gate: wiring invariant tests + smoke tests for both modules — must ALL fail before implementation |
| API/Integration Builder | `api-builder` + `integration-builder` | Implement AIMC wiring services; turn RED tests GREEN |
| Specialist Advisor | `risk-platform-agent` | Advisory review of Risk Management wiring for domain accuracy |

### 3.2 Wave 9.7 — PIT

#### IN SCOPE

| Deliverable | Location | Notes |
|---|---|---|
| `pit-advisor.md` persona | `packages/ai-centre/src/agents/pit-advisor.md` | New persona for PIT module threat analysis |
| PIT AIMC wiring service | `modules/pit/src/services/aimc-wiring.ts` | Calls `POST /api/ai/request` with `capability: 'analysis'`, `agent: 'pit-advisor'` |
| PIT wiring invariant tests | `modules/pit/tests/wiring-invariants/wiring-invariants.test.ts` | RED first |
| PIT AI gateway smoke tests | `modules/pit/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first |
| Legacy AI path audit | PIT module | Gate or remove `maturion-ai-chat` and other legacy AI calls |

#### Agent Assignments — Wave 9.7

| Role | Agent | Task |
|---|---|---|
| QA (pre-code) | `qa-builder` | RED gate: PersonaLoader test for pit-advisor.md + wiring invariant + smoke tests |
| API/Integration Builder | `api-builder` + `integration-builder` | Create pit-advisor.md; implement PIT AIMC wiring service |
| Specialist Advisor | `pit-specialist` | Advisory review of pit-advisor.md persona content for domain accuracy |

### 3.3 Wave 9.8 — Course Crafter + ISMS Navigator

#### IN SCOPE

| Deliverable | Location | Notes |
|---|---|---|
| Course Crafter AIMC wiring service | `modules/course-crafter/src/services/aimc-wiring.ts` | `document-generation` + `video-generation` capabilities, `agent: 'course-crafter-advisor'` |
| Course Crafter wiring invariant tests | `modules/course-crafter/tests/wiring-invariants/wiring-invariants.test.ts` | RED first |
| Course Crafter AI gateway smoke tests | `modules/course-crafter/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first |
| ISMS Navigator AIMC wiring service | `modules/isms/src/services/aimc-wiring.ts` | `capability: 'advisory'`, `agent: 'isms-navigator'` |
| ISMS Navigator wiring invariant tests | `modules/isms/tests/wiring-invariants/wiring-invariants.test.ts` | RED first |
| ISMS Navigator AI gateway smoke tests | `modules/isms/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first |

#### Agent Assignments — Wave 9.8

| Role | Agent | Task |
|---|---|---|
| QA (pre-code) | `qa-builder` | RED gate: wiring invariant tests + smoke tests for both modules |
| API/Integration Builder | `api-builder` + `integration-builder` | Implement AIMC wiring services for both modules |

### 3.4 Wave 9.9 — Incident Intelligence + Maturity Roadmap

#### IN SCOPE

| Deliverable | Location | Notes |
|---|---|---|
| `incident-intelligence-advisor.md` persona | `packages/ai-centre/src/agents/incident-intelligence-advisor.md` | New persona for deep-search-backed incident intelligence |
| `maturity-roadmap-advisor.md` persona | `packages/ai-centre/src/agents/maturity-roadmap-advisor.md` | New persona for maturity roadmap generation |
| Incident Intelligence AIMC wiring service | `modules/incident-intelligence/src/services/aimc-wiring.ts` | `capability: 'deep-search'`, `agent: 'incident-intelligence-advisor'` |
| Incident Intelligence wiring invariant tests | `modules/incident-intelligence/tests/wiring-invariants/wiring-invariants.test.ts` | RED first |
| Incident Intelligence AI gateway smoke tests | `modules/incident-intelligence/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first |
| Maturity Roadmap AIMC wiring service | `modules/maturity-roadmap/src/services/aimc-wiring.ts` | `capability: 'analysis'`, `agent: 'maturity-roadmap-advisor'` |
| Maturity Roadmap wiring invariant tests | `modules/maturity-roadmap/tests/wiring-invariants/wiring-invariants.test.ts` | RED first |
| Maturity Roadmap AI gateway smoke tests | `modules/maturity-roadmap/tests/ai-gateway-smoke/ai-gateway-smoke.test.ts` | RED first |

#### Agent Assignments — Wave 9.9

| Role | Agent | Task |
|---|---|---|
| QA (pre-code) | `qa-builder` | RED gate: PersonaLoader tests for new personas + wiring invariant + smoke tests for both modules |
| API/Integration Builder | `api-builder` + `integration-builder` | Create new persona files; implement AIMC wiring services |
| Specialist Advisor | `maturity-scoring-agent` | Advisory review of maturity-roadmap-advisor.md persona content |

---

## 4. Locked Interfaces

### 4.1 AIMC Request Interface (All Modules)

All modules MUST use this interface to call AIMC:

```typescript
// Standard AIMC wiring pattern
const response = await fetch('/api/ai/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    capability: '<capability>',   // REQUIRED: 'advisory' | 'analysis' | 'document-generation' | 'deep-search'
    agent: '<agent-id>',          // REQUIRED: persona ID (e.g., 'xdetect-advisor')
    prompt: '<user-message>',     // REQUIRED: user input
    context: { /* optional */ }   // OPTIONAL: additional context
  })
});
```

**PROHIBITED**: Any direct call to OpenAI, Anthropic, Perplexity, or any AI provider SDK outside of `packages/ai-centre/`.

### 4.2 Persona File Format (All New Personas)

All new persona files MUST include YAML front-matter:

```yaml
---
version: 1.0.0
last_reviewed: 2026-02-26
owner: CS2
module: <module-name>
capability: <primary-capability>
---
# <Persona Name>
...persona content...
```

### 4.3 Wiring Test Pattern (All Modules)

Each module's wiring tests MUST:
1. Verify the persona file exists and loads via `PersonaLoader.load('<agent-id>')`
2. Verify the wiring service calls `POST /api/ai/request` (not any provider SDK)
3. Verify the `capability` and `agent` fields are correct
4. Smoke test: simulate an AIMC-routed request and verify response

Tests live in `modules/<module>/tests/wiring-invariants/` and `modules/<module>/tests/ai-gateway-smoke/`.
Tests use `vitest` matching the MAT module pattern.

### 4.4 Regression Constraint

All prior wave tests must pass at 100% GREEN after each subwave implementation. No new test
failures are permitted. The one pre-existing failure (EpisodicMemoryAdapter.test.ts — Wave 9.3
RED gate, present since session-059) is waived per CS2 and must not be counted as a new failure.

---

## 5. Execution Sequence (SEQUENTIAL — Per AAWP Rule 1)

```
Wave 9.6 complete (ALL gates GREEN) → Wave 9.7 complete → Wave 9.8 complete → Wave 9.9 complete
```

Each subwave:
```
qa-builder RED gate → QP PASS → implementation (api-builder / integration-builder)
→ specialist advisor review (where applicable) → QP PASS → tracker update → NEXT WAVE
```

**NEVER** start Wave N+1 until Wave N QP PASS and tracker updated.

---

## 6. Cross-Wave Regression Requirements (AAWP §6)

After each subwave closes, the full regression suite must pass:
- All prior packages/ai-centre tests: GREEN (wave 1–9.11)
- All prior modules/mat tests: GREEN
- All prior modules/xdetect tests: GREEN (after 9.6)
- All prior modules/risk-management tests: GREEN (after 9.6)
- etc.

The pre-existing failure (EpisodicMemoryAdapter.test.ts) is waived (Wave 9.3 RED gate).

---

## 7. Out of Scope (All Track C Waves)

| Item | Reason |
|---|---|
| Full feature implementation of any module | Each module has its own wave plan separate from AIMC wiring |
| Schema / database changes | No new schema needed for module integration (uses existing AIMC gateway) |
| Wave 9.10 persona lifecycle governance | Separate Track D wave |
| Wave 9.3 episodic memory implementation | Separate Track B wave |
| Merging Track C changes into a single PR | Each subwave gets its own PR |

---

*Authority: CS2 (Johan Ras / @APGI-cmy) | Frozen by: foreman-v2-agent v6.2.0 | session-063 | 2026-02-26*
*Issue: #634 | AAWP: v0.2.0 Section 4 Waves 9.6–9.9 | Audit: WAVE9_AIMC_FUNCTIONALITY_AUDIT.md Gap 4*
