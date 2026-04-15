# Maturion Orchestrator/Specialist Strategy
## Execution-Ready Source Model for MMM Convergence

---

## Status Header

| Field | Value |
|-------|-------|
| **Document** | Maturion Orchestrator/Specialist Strategy |
| **Version** | 2.0.1 |
| **Status** | STRATEGY — Execution-Ready |
| **Authority** | CS2 (Johan Ras / @APGI-cmy) |
| **Produced By** | foreman-v2-agent (POLC-Orchestration mode) — maturion-isms#1382 |
| **Date** | 2026-04-15 |
| **Supersedes** | v1.0.0 (2026-02-20) "COMPLETE GOVERNANCE STRUCTURE FOR ORCHESTRATOR + SPECIALIST ARCHITECTURE" |
| **Canonical Source** | `Maturion/strategy/Maturion_agent_usage_escalation_strategy.md` |

---

## 0. Document Purpose

This document defines the execution-ready operating model for the Maturion orchestrator/specialist architecture. It is the governing source for:

1. **Specialist runtime behaviour** — how specialists access knowledge, resolve conflicts, handle freshness, manage memory
2. **Module-consumer relationships** — how consuming modules (such as MMM) interact with AIMC specialist capability
3. **Human-in-the-loop governance** — which specialist outputs require human review or approval
4. **Canon alignment basis** — what must be canonised next after this strategy is stabilised
5. **MMM convergence planning** — how this strategy aligns with and complements the MMM pre-build artifact set

This document is NOT a canon file, NOT an implementation specification, and NOT a code-level design. It is the governing strategy layer from which canon alignment, implementation planning, and convergence bridge artifacts will be derived.

**How to use this document:**
- As the authoritative reference for specialist operating decisions during AIMC implementation
- As the upstream source for future canon files in `governance/canon/`
- As the basis for the MMM ↔ AIMC convergence bridge artifact
- As the planning foundation for CL-12 and CL-12c integration waves

---

## 1. Three-Tier Governance Framework

The orchestrator/specialist architecture is governed across three tiers:

```
STRATEGY LEVEL (Maturion/strategy/)
├─ Constitutional execution-ready source models (this document)
├─ Authority: CS2 (Johan Ras)
├─ Status: Governed — changes require CS2 approval
└─ Purpose: Define operating models, source hierarchies, boundary rules

CANON LEVEL (governance/canon/)
├─ Canonical governance implementing the strategy model
├─ Authority: CS2 (Johan Ras)
├─ Status: PUBLIC_API (hash-tracked, ripple-enabled)
└─ Purpose: Machine-enforced rules derived from strategy

EXECUTION LEVEL (governance/checklists/ + governance/templates/)
├─ Checklists and templates for implementing the canon model
├─ Authority: CS2 (Johan Ras)
├─ Status: INTERNAL_CANON (ripple-enabled)
└─ Purpose: Operational guides for agent creation and configuration
```

**Derivation rule**: Canon must derive from strategy. Execution must derive from canon. No implementation may self-define behaviour that is not grounded in strategy.

### 1.1 Constitutional Foundation

This strategy derives from and must remain aligned with:

| Document | Alignment Requirement |
|----------|-----------------------|
| `Maturion/maturion-identity.md` | ONE Maturion across all apps — orchestrator = unified mind, specialists = embodiments |
| `Maturion/maturion-true-north.md` | Mission, risk-context default lens, complete situational awareness |
| `Maturion/oversight-system.md` | Guardian, Sentinel, Arbiter validate ALL specialist outputs |
| `Maturion/maturion-self-learning-governance.md` | Learning tiers govern all knowledge updates |

---

## 2. Orchestrator-Specialist Architecture

### 2.1 Core Model

The Maturion platform implements a one-orchestrator / many-specialists model:

- **ONE orchestrator** (`maturion-agent`) operates across ALL apps (MAT, PIT, XDETECT, Maturity Roadmap, MMM)
- **MULTIPLE specialists** provide deep domain expertise within defined scope boundaries
- **Watchdog gates** (Guardian, Sentinel, Arbiter) validate ALL specialist outputs before returning to orchestrator
- **Constitutional alignment** maintained by orchestrator — specialist outputs must conform to Maturion's identity, true north, and oversight requirements

### 2.2 Orchestrator Role

The orchestrator (Maturion) is responsible for:

1. Analysing user queries and detecting intent
2. Routing queries to the appropriate specialist(s)
3. Validating specialist responses via watchdog gates
4. Synthesising responses with context and framing
5. Maintaining session continuity across specialists and apps
6. Capturing learnings from specialist interactions

**Key characteristics:**
- App-context aware — knows which module (MAT, PIT, XDETECT, MMM) it is operating in
- Multi-embodiment — ONE identity, multiple operational contexts
- Supervisory authority — orchestrates but does NOT execute domain logic
- Central memory — unified session memory across all apps and specialists

### 2.3 Specialist Role

A specialist agent is responsible for:

1. Receiving tasks from the authorised orchestrator only
2. Executing domain-specific logic with deep expertise
3. Validating outputs against domain standards
4. Returning structured responses to the orchestrator
5. Maintaining domain-specific knowledge base
6. Escalating out-of-scope queries to the orchestrator

**Key characteristics:**
- Domain-scoped expertise — focused on a specific domain
- Authorised callers only — responds exclusively to the designated orchestrator
- No cross-domain logic — stays strictly within expertise boundaries
- Domain-specific memory — specialist session memory and knowledge base are separate from other specialists

### 2.4 Agent Class Taxonomy

| Agent Class | Role | Examples | Authority Model |
|-------------|------|----------|-----------------|
| **orchestrator** | Coordinate specialists, synthesise responses | maturion-agent | RAEC (Review-Advise-Escalate-Coordinate) |
| **specialist** | Deep domain expertise | risk-platform-agent, mat-specialist, pit-specialist | EXECUTE (within domain scope only) |
| **builder** | Code implementation | ui-builder, api-builder, schema-builder | IMPLEMENT (within wave scope) |
| **foreman** | Build supervision | foreman-v2-agent | POLC (Plan-Organise-Lead-Control) |
| **liaison** | Cross-repo governance sync | governance-liaison-isms-agent | SYNC (receive/validate canonical governance) |
| **overseer** | Agent factory, governance advisor | CodexAdvisor-agent | RAEC (approval-gated creation) |

### 2.5 Delegation Patterns

**Transparent delegation** (visible to user): Used when specialist provides novel expertise the user should know about, when educational value is high, or when trust-building is served by transparency.

**Invisible delegation** (seamless to user): Used when the specialist executes mechanical/operational tasks (data fetch, formatting, calculations) where internal routing is not relevant to the user.

**Multi-specialist chaining**: Orchestrator routes through MULTIPLE specialists in sequence for complex tasks. Orchestrator coordinates the entire chain; each specialist validates its own output; orchestrator validates the final output via watchdog gates; session memory captures the full chain for learning.

### 2.6 Validation Gates

ALL specialist outputs MUST pass watchdog validation before returning to the orchestrator.

| Gate | Validates | Action on Violation |
|------|-----------|---------------------|
| **Guardian** (Policy & Content) | Cross-tenant data leakage, inappropriate content, regulatory violations, hallucinated high-risk content | BLOCK, REDACT, ESCALATE to CS2 |
| **Sentinel** (Behavioural & Drift) | Role consistency, no persona bleeding, no behavioural drift, no contradictions | FLAG drift, RECALIBRATE specialist, ESCALATE if recurring |
| **Arbiter** (Memory & Learning) | No unauthorised memory writes, no semantic contamination, no cross-specialist memory access | FREEZE memory, ROLL BACK snapshot, ESCALATE to CS2 |

---

## 3. Specialist Knowledge Operating Model

> **This section is new in v2.0.0.** It defines the governed model for how specialists access, rank, and use knowledge sources. This is the execution-ready basis for future canon file `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md`.

### 3.1 Source Classification

Specialists operate with knowledge from five source classes, ranked by authority:

| Class | Label | Examples | Authority Level |
|-------|-------|---------|----------------|
| 1 | **Canonical/Internal Governance Sources** | `governance/canon/`, `Maturion/strategy/`, agent contracts | HIGHEST — always governing |
| 2 | **Module-Specific Approved Knowledge Sources** | `.agent-workspace/{specialist}/knowledge/`, approved domain refs | AUTHORITATIVE — module-validated |
| 3 | **Harvested Legacy Sources** | Pre-convergence system outputs, archived spec documents | REFERENCE — time-bounded, must be flagged |
| 4 | **User-Uploaded / Current Knowledge Sources** | Uploaded documents via KUC, session-provided context | ADVISORY — session-scoped unless promoted |
| 5 | **Public Internet / Current-Awareness Sources** | Industry frameworks, public standards, general knowledge | SUPPLEMENTARY — never overrides controlled sources |

### 3.2 Source Definitions

**Class 1 — Canonical/Internal Governance Sources:**
- All documents in `governance/canon/` (hash-tracked in CANON_INVENTORY.json)
- All strategy documents in `Maturion/strategy/`
- Agent contracts in `.github/agents/`
- These sources define WHAT IS CORRECT in this system. They are not evidence for reasoning — they are the rules themselves.
- A specialist may never override, reinterpret, or synthesise away from a Class 1 source. Conflict → escalate to CS2.

**Class 2 — Module-Specific Approved Knowledge Sources:**
- Domain knowledge files in `.agent-workspace/{specialist}/knowledge/`
- Approved references registered by CS2 or CodexAdvisor
- These sources provide deep domain expertise within the specialist's scope boundary
- May be updated per the self-learning governance tiers (Tier 1 ephemeral → Tier 2 structural → Tier 3 knowledge layer)
- Updates require Arbiter supervision

**Class 3 — Harvested Legacy Sources:**
- Documents from systems being retired or converged into the platform (e.g., pre-MMM MAT artefacts, legacy audit data)
- Governed by the harvest map transition model (ACTIVE_SOURCE → PARALLEL_RUN → TRACEABILITY_ONLY → RETIRED)
- MUST be explicitly labelled as `[LEGACY — source: {system}, captured: {date}]` when cited
- Expire when the source system reaches TRACEABILITY_ONLY state — specialists must stop using them as live sources at that point
- May still be used as historical reference after TRACEABILITY_ONLY, but must never be treated as current governing authority

**Class 4 — User-Uploaded / Current Knowledge Sources:**
- Documents uploaded via KUC (Knowledge Upload Centre) during a session
- Context provided directly by the user in the session
- Session-scoped by default — does not persist beyond the session unless promoted by the orchestrator
- Promotion to Class 2 requires: CS2 approval or CodexAdvisor-gated addition to the approved knowledge base
- Must be labelled as `[USER-UPLOAD — session: {id}, uploaded: {datetime}]` when cited

**Class 5 — Public Internet / Current-Awareness Sources:**
- General industry knowledge, public standards (ISO, NIST, etc.), publicly available frameworks
- Useful for current-awareness and contextual supplementation
- NEVER used to override or contradict Class 1–4 sources
- Must be labelled as `[PUBLIC — source: {description}, accessed: {date}]` when cited
- Specialists must never anchor decisions on public sources when governed sources exist

### 3.3 When Each Source Class May Be Used

| Situation | Permitted Source Classes |
|-----------|------------------------|
| Governance decision (what is correct per platform rules) | Class 1 ONLY |
| Domain expertise (how to apply rules within a domain) | Class 1 + Class 2 |
| Historical context or legacy migration reference | Class 1 + Class 2 + Class 3 (with labelling) |
| Current-session context enrichment | Class 1 + Class 2 + Class 3 + Class 4 |
| Current-awareness supplementation (no governance decision) | Class 1 + Class 2 + Class 3 + Class 4 + Class 5 |

---

## 4. Source Priority and Conflict Rules

> **This section is new in v2.0.0.** It defines the governed rules for source priority and conflict resolution. This is the execution-ready basis for future canon enforcement.

### 4.1 Priority Order

**When sources contain information about the same question, the following priority order is absolute:**

```
PRIORITY 1: Class 1 (Canonical/Internal Governance) — always wins
PRIORITY 2: Class 2 (Module-Specific Approved Knowledge) — wins over legacy and external
PRIORITY 3: Class 3 (Harvested Legacy) — wins over user-provided and public when not superseded
PRIORITY 4: Class 4 (User-Uploaded / Current) — wins over public sources
PRIORITY 5: Class 5 (Public) — supplementary only, never authoritative
```

This hierarchy is not contextual — it does not change based on query type, user seniority, urgency, or perceived relevance. A lower-priority source never overrides a higher-priority source.

### 4.2 Conflict Resolution Rules

**Rule CR-1: Canonical override is absolute.**
If a Class 1 source explicitly addresses a question and a lower-class source contradicts it, the specialist MUST follow the Class 1 source and MUST flag the contradiction to the orchestrator (not silently adopt the lower-class answer).

**Rule CR-2: Legacy sources must yield to approved knowledge.**
If a Class 3 (legacy) source contradicts a Class 2 (approved module knowledge) source, the Class 2 source governs. The specialist MUST note that legacy material differs, flag the legacy source as potentially stale, and recommend a knowledge base update review.

**Rule CR-3: User uploads cannot override governed sources.**
If a Class 4 (user-uploaded) document contradicts a Class 1 or Class 2 source, the governed source wins. The specialist MUST inform the user of the contradiction and explain which source governs and why.

**Rule CR-4: Public sources are supplementary only.**
If a Class 5 source contradicts any higher-class source, the higher-class source wins. Class 5 sources may only be used to provide supplementary context when no governed source addresses the question.

**Rule CR-5: Ambiguity requires escalation, not synthesis.**
If two Class 1 sources appear to contradict each other, the specialist MUST NOT synthesise a resolution. The specialist MUST escalate to the orchestrator, which escalates to CS2. Specialist synthesis of conflicting canonical sources is prohibited.

### 4.3 When No Internal Source Exists

If no Class 1, Class 2, or Class 3 source addresses the question:

1. **Class 4 available**: Use user-provided context with explicit labelling and advisory framing
2. **Class 4 not available, Class 5 available**: Use public sources with explicit supplementary labelling; frame response as "current-awareness context only — not governed by this platform"
3. **No source available**: Declare uncertainty; do not hallucinate; escalate to orchestrator

The specialist MUST NOT present speculative synthesis as governed information regardless of the user's expressed preference.

### 4.4 Escalation vs. Synthesis

| Situation | Correct Response |
|-----------|-----------------|
| Two Class 1 sources conflict | ESCALATE to orchestrator → CS2 |
| Class 1 is silent on a question | Check Class 2; if Class 2 silent, use Class 3–5 with labelling |
| User requests conclusion unsupported by governed sources | Declare limitation; offer best advisory framing with clear labelling |
| Legacy source contradicts approved knowledge | Use approved knowledge; flag legacy as STALE; recommend review |

---

## 5. Freshness and Currency Rules

> **This section is new in v2.0.0.** It defines governed freshness rules for specialist knowledge sources.

### 5.1 When Freshness Matters

Freshness matters differently by source class:

| Source Class | Freshness Model | Staleness Implication |
|-------------|-----------------|----------------------|
| Class 1 (Canonical) | TIMELESS — the source IS the current truth at time of publication | Not stale unless superseded by a newer Class 1 source |
| Class 2 (Approved Module Knowledge) | GOVERNED LIFECYCLE — updated via self-learning tiers | Stale when a newer approved version exists; Arbiter flags |
| Class 3 (Harvested Legacy) | TIME-BOUNDED — expires when source system reaches TRACEABILITY_ONLY | Stale after source system transition; must be labelled |
| Class 4 (User-Uploaded) | SESSION-SCOPED — fresh at upload; expires at session end | Stale if not promoted before session ends |
| Class 5 (Public) | CURRENT-AWARENESS — fresh at access time | Stale immediately for any governance decision |

### 5.2 Static vs. Dynamic Sources

**Static/canonical sources** (Class 1 and Class 2):
- Represent the governed state of the system
- "Stale but still governing" applies: a document dated 2026-02-20 is still the governing authority if it has not been superseded by a newer version
- Specialists MUST NOT assume a document is outdated just because it is old — age alone does not make a canonical source stale
- A canonical source is stale ONLY when a newer version exists and is explicitly published

**Dynamic/current sources** (Class 4 and Class 5):
- Represent current-awareness or session-specific context
- More recent = more relevant for current-awareness purposes
- But recency never overrides authority class hierarchy

### 5.3 "Stale but Still Governing"

This is a critically important concept for specialist operation:

> A Class 1 or Class 2 source that pre-dates other documents is still the governing authority for any question it explicitly addresses — unless it has been explicitly superseded by a newer version of the same document.

Specialists must not:
- Discount a canonical source because it is older than a user-uploaded document
- Assume that a "more current" public source replaces a canonical policy
- Synthesise a "more up-to-date" answer by mixing an old canonical source with newer public material

Specialists MUST:
- Treat the most recent version of a Class 1 source as current, regardless of its creation date
- Note when a Class 1 source appears to not address a recent development and escalate for canon update consideration

### 5.4 How Current-Awareness Is Handled

Current-awareness (e.g., new regulatory developments, new threat intelligence, new industry frameworks) is handled as follows:

1. **Class 1/2 sources are current**: No supplementation needed
2. **No governed source addresses the topic**: Use Class 5 for current-awareness; explicitly label as non-governed
3. **Governed source exists but may be outdated**: Follow the governed source; note the potential gap to orchestrator for canon update consideration
4. **User requests very recent information**: Provide what Class 1/2 says; supplement with Class 4/5 where available and labelled; flag the limit

### 5.5 When a Specialist Must Flag Uncertainty

A specialist MUST flag uncertainty (not answer confidently) when:
- No governed source addresses the question and no reliable Class 5 source exists
- Sources conflict and escalation is pending
- The question requires a governance decision that exceeds specialist authority
- A legacy source is the only available source and its validity post-transition is unclear
- The user's question requires making assumptions beyond what the governed sources support

Flagging format: `[UNCERTAINTY: {reason}. Class 1/2 sources do not directly address this. {recommended action}]`

---

## 6. Shared Memory Boundary Rules

> **This section is new in v2.0.0.** It defines the governed model for shared memory between orchestrator and specialists.

### 6.1 Memory Architecture Overview

The Maturion platform implements a two-tier memory model:

**Tier 1 — Orchestrator Memory (Centralised):**
- Location: `.agent-workspace/maturion-agent/memory/`
- Scope: ALL apps, ALL specialist interactions, cross-app learnings
- Owner: Orchestrator (maturion-agent)
- Governed by: Arbiter watchdog

**Tier 2 — Specialist Memory (Domain-Specific):**
- Location: `.agent-workspace/{specialist}/memory/`
- Scope: Domain-specific task executions for that specialist
- Owner: The individual specialist
- Governed by: Arbiter watchdog; specialist contract

### 6.2 Read Permissions

| Actor | May Read | May NOT Read |
|-------|---------|--------------|
| Orchestrator | All specialist memory (for synthesis, routing, cross-app learning) | Nothing restricted — orchestrator has full read access with Arbiter supervision |
| Specialist | Own memory; orchestrator-provided session context for current session | Other specialists' memory directly; orchestrator memory files not provided in session context |
| Consuming Module (MMM) | AIMC response only (via API call) — no direct memory read | Any .agent-workspace/ files; internal routing state; session memory of any agent |

**Critical rule**: Specialists receive context from the orchestrator as part of the task payload — they do NOT have file-level access to orchestrator memory. The orchestrator decides what context to include in each task payload.

### 6.3 Write Permissions

| Actor | May Write | May NOT Write |
|-------|----------|---------------|
| Orchestrator | Orchestrator memory (cross-app learnings, routing patterns, validated specialist learnings) | Specialist memory directly |
| Specialist | Own specialist memory (domain-specific task outcomes, knowledge updates via learning tiers) | Orchestrator memory directly; other specialist memory; any external file system |
| Arbiter | Memory freeze/rollback decisions (oversight only) | Content writes |

### 6.4 What Gets Promoted to Orchestrator-Level Memory

Specialist learnings are promoted to orchestrator-level memory only when:

1. The learning is **cross-domain applicable** (relevant to multiple specialists or apps)
2. The learning has passed **Arbiter validation** (no contamination, no boundary violation)
3. The orchestrator has **explicitly decided to promote** the learning (orchestrator judgement, not automatic)
4. The learning is **within the self-learning tier governance** (per `Maturion/maturion-self-learning-governance.md`)

Promotion examples:
- `[PROMOTE]: User at org {id} consistently struggles with hierarchical taxonomies → apply proactive diagram guidance in any app`
- `[PROMOTE]: Risk domain concept maps to maturity criteria structure — routing overlap detected`

### 6.5 Cross-Specialist Memory Contamination Protections

The following are hard prohibitions enforced by the Arbiter:

| Prohibition | Rule |
|-------------|------|
| Direct specialist-to-specialist memory access | Specialist A may NEVER read Specialist B's memory files directly |
| Shared memory namespaces | Specialists may NEVER write to a shared file also written by another specialist |
| Implicit cross-domain learning | Specialist A may NEVER apply learnings it observed about the behaviour of Specialist B |
| Unvalidated lateral promotion | Specialist A may NEVER promote a learning to orchestrator memory without orchestrator action |

**Why these prohibitions exist**: Cross-specialist contamination would cause domain drift (a specialist starts behaving like a different specialist), semantic contamination (domain knowledge bleeds across domains), and audit trail loss (no way to trace which specialist produced which output).

### 6.6 Memory and Domain-Specific Memory

Specialists maintain domain-specific knowledge bases (`.agent-workspace/{specialist}/knowledge/`) that are separate from but related to their session memory (`.agent-workspace/{specialist}/memory/`).

| Storage Type | Purpose | Update Mechanism |
|-------------|---------|-----------------|
| Session memory | Record of task executions and per-session learnings | Written after each task; governed by Tier 1/2/3 learning rules |
| Knowledge base | Persistent domain expertise, reference material, approved knowledge | Updated via CodexAdvisor-gated or Arbiter-validated knowledge update protocol |

A specialist's knowledge base is NOT session memory. Knowledge base updates are durable and governed. Session memory is ephemeral unless promoted.

---

## 7. Module-Consumer Mode

> **This section is new in v2.0.0.** It defines what it means for a consuming module (such as MMM) to consume AIMC specialist capability as a service.

### 7.1 What Module-Consumer Mode Means

A module is in "module-consumer mode" when it calls AIMC's exposed API surface to obtain AI-assisted capability, without implementing any AI logic internally.

In module-consumer mode:
- The consuming module has NO knowledge of which specialist handled the request
- The consuming module has NO access to specialist memory, knowledge bases, or routing decisions
- The consuming module receives a structured response in the canonical response envelope
- The consuming module is responsible for how it presents and uses that response in its own UX/workflow
- The consuming module is NOT responsible for AI accuracy — that is an AIMC governance concern
- The consuming module IS responsible for applying its own human-in-the-loop gates (see §8)

### 7.2 MMM as an AIMC Consumer

MMM is the reference model for module-consumer mode. MMM calls AIMC via its Edge Function proxy layer, using 8 defined endpoints:

| AIMC Endpoint | Consumption Pattern | Module Responsibility |
|--------------|--------------------|-----------------------|
| `POST /api/ai/framework-parse` | Parse uploaded framework document | Present parsed result to user for review |
| `POST /api/ai/framework-generate` | Generate new framework structure | Present draft for human approval before activation |
| `POST /api/ai/framework-alter` | Modify existing framework | Present proposed change for human review |
| `POST /api/ai/evidence-evaluate` | Evaluate evidence against criteria | Display as advisory scoring input |
| `POST /api/ai/recommend` | Generate maturity recommendations | Display as advisory; require human approval before active |
| `POST /api/ai/chat` | Contextual conversation | Display informational response only |
| `POST /api/ai/explain` | Contextual explanation | Display informational response only |
| `POST /api/ai/assessment-interpret` | Interpret assessment result | Display as advisory interpretation; human confirms |

### 7.3 Which Behaviours Remain Module-Local

The following behaviours are the consuming module's responsibility, NOT AIMC's:

- **Persisting AI responses**: MMM decides whether and how to save AIMC responses to its own database
- **Displaying responses to users**: Presentation, formatting, UX framing
- **Gate enforcement**: Whether to require human approval before an AI recommendation becomes active
- **Fallback handling**: What to show/do when the AIMC circuit breaker is open
- **Re-evaluation triggers**: When to call AIMC again (e.g., when evidence changes)

### 7.4 Which Behaviours Are Service-Layer Behaviours

The following behaviours belong to AIMC, NOT the consuming module:

- **Provider selection**: Which LLM provider handles the request
- **Specialist routing**: Which specialist agent processes the query
- **Validation gates**: Guardian, Sentinel, Arbiter checks on the response
- **Cost tracking**: Token consumption and provider cost attribution
- **AI governance**: Audit trail, IAA oversight, canon compliance
- **Knowledge source management**: Which knowledge base the specialist draws from

### 7.5 Response Modes

AIMC specialist responses to module-consumer requests operate in three modes:

| Mode | Definition | Consuming Module Obligation |
|------|-----------|---------------------------|
| **Advisory** | Informational output — no direct action taken | May display to user without gate; must not auto-activate |
| **Draft-Assist** | Proposed content — not yet validated as active | Must present for human review; must not persist as active without review |
| **Operational** | Output intended to trigger downstream state change | BLOCKED by default — requires explicit human approval gate at consuming module |

AIMC designates the response mode in the canonical response envelope. The consuming module MUST honour the designated mode.

### 7.6 Understanding Handoff to MMM

When AIMC hands off to MMM:
- AIMC's responsibility ends at the API boundary
- AIMC provides: response body, mode designation, confidence indicators (where applicable), source attribution (class of knowledge used)
- MMM's responsibility begins: how it presents the response, what gates it applies, what it persists

Neither party may assume the other will enforce gates that belong to the other party.

---

## 8. Human-in-the-Loop Boundaries

> **This section is new in v2.0.0.** It defines the governed model for which specialist outputs require human involvement before becoming active.

### 8.1 Output Classification Framework

Every specialist output belongs to exactly one of four output classes:

| Class | Label | Human Involvement Required | Example |
|-------|-------|---------------------------|---------|
| H-1 | **Informational** | None — may be displayed directly | Risk explanation, criteria description, audit process guidance |
| H-2 | **Draft-Assist** | Human must review before use | Drafted criteria text, generated framework structure, proposed assessment language |
| H-3 | **Recommendation** | Human must approve before active | Maturity score proposal, risk rating recommendation, control suggestion |
| H-4 | **Operational** | Hard gate — must not directly activate downstream effects | Any output that would create, modify, or approve a record in the system without human confirmation |

### 8.2 H-1 Informational Outputs — May Display Directly

Informational outputs may be shown to the user without a formal review gate. They provide knowledge, explanation, or context that the user can act on at their own judgement.

**Rule H-1-01**: Even informational outputs MUST pass the Guardian gate before display (content policy, cross-tenant isolation, hallucination detection).

**Rule H-1-02**: Informational outputs MUST be distinguishable from draft-assist or recommendation outputs in the UX (e.g., labelled as "AI Explanation" not "AI Recommendation").

### 8.3 H-2 Draft-Assist Outputs — Human Must Review

Draft-assist outputs are proposed content that the user is expected to review, modify, and then accept or reject. They must not be persisted as active content without a human review step.

**Rule H-2-01**: Draft-assist outputs MUST be presented in a draft/preview state, not in an editable active state.

**Rule H-2-02**: The system MUST require an explicit user action (confirm, accept, save) before persisting a draft-assist output as active content.

**Rule H-2-03**: The system MUST allow the user to modify, reject, or discard a draft-assist output before it becomes active.

### 8.4 H-3 Recommendation Outputs — Human Must Approve Before Active

Recommendation outputs propose a decision or scoring that, if accepted, will change the governed state of a record. They require explicit human approval before the recommendation becomes the active record.

**Rule H-3-01**: Recommendations MUST include the supporting evidence or reasoning that led to the recommendation, presented alongside the recommendation.

**Rule H-3-02**: The system MUST NOT auto-approve recommendations based on confidence score, user preference settings, or time elapsed.

**Rule H-3-03**: A recommendation rejected by the human MUST be recorded in the audit trail (recommendation proposed, human rejected, human value applied).

**Rule H-3-04**: Recommendations for maturity scores, risk ratings, and control effectiveness assessments are always H-3, never H-1 or H-2.

### 8.5 H-4 Operational Outputs — Hard Gate (Must Not Activate Downstream)

Operational outputs are any AIMC responses that would, if acted on automatically, cause downstream effects in the governed system (create/update records, trigger approvals, submit reports, activate plans).

**Rule H-4-01**: No operational output may directly trigger a state change in the system. An explicit human approval action is always required.

**Rule H-4-02**: The consuming module (e.g., MMM) MUST implement a hard confirmation gate before processing any AIMC response that would create, modify, approve, or delete a governed record.

**Rule H-4-03**: For TR-012-compliant consumers (e.g., MMM), the output class is determined statically by the endpoint invoked, per §8.6. The frozen TR-012 response envelope — `{"success", "data", "error", "request_id"}` — does NOT carry a top-level `"mode"` field, and no such field should be expected or required at the envelope level. Any AIMC-internal mode designation MUST be confined to the `"data"` payload or to AIMC-internal routing logic; it MUST NOT be defined as a TR-012 top-level field. Consuming modules MUST apply the H-gate obligation corresponding to the endpoint they invoked (§8.6) and MUST NOT rely on runtime `"mode"` field detection in the TR-012 envelope.

**Rule H-4-04**: Automated batch processing of H-4 outputs (e.g., bulk AI-assessing 100 criteria with no human review) is prohibited.

### 8.6 Classification by Endpoint

| AIMC Endpoint | Default Output Class | Override Condition |
|--------------|---------------------|-------------------|
| `framework-parse` | H-2 (draft-assist) | N/A |
| `framework-generate` | H-2 (draft-assist) | N/A |
| `framework-alter` | H-2 (draft-assist) | N/A |
| `evidence-evaluate` | H-3 (recommendation) | If used for guidance only: H-1 |
| `recommend` | H-3 (recommendation) | N/A |
| `chat` | H-1 (informational) | If used for automated summary: H-2 |
| `explain` | H-1 (informational) | N/A |
| `assessment-interpret` | H-3 (recommendation) | N/A |

---

## 9. MMM Convergence Section

> **This section is new in v2.0.0.** It explicitly maps what is already governed by MMM artifacts vs. what remains AIMC-strategy-only, and what future bridge artifacts are needed.

### 9.1 What MMM Already Defines (Not Duplicated Here)

The following aspects are already governed by MMM's approved pre-build artifact set and do NOT need to be re-defined in this strategy:

| Aspect | Governed By | Status |
|--------|------------|--------|
| AIMC as sole AI gateway | MMM App Description, FRS FR-053, TRS TR-011–015, Architecture §A6.1 | Frozen in MMM artifacts |
| 8 AIMC endpoint contracts | Architecture §A6.1 endpoint table | Frozen in MMM artifacts |
| Service-to-service JWT auth | Architecture §A6.1 Authentication model | Frozen |
| Canonical AIMC response envelope | TRS TR-012 | Frozen |
| Circuit breaker (5 failures / 60 s) | Architecture §A4.5, TRS TR-009 | Frozen |
| AIMC versioning rule (dual-routing window) | TRS TR-013 | Frozen |
| Timeout and retry policies | TRS TR-014 | Frozen |
| MMM has no knowledge of AIMC internal routing | Architecture §A6.1 | Frozen |
| CL-12c: harvest map timing constraints | Harvest map v0.3.0 | Governed at harvest map level |

**Governing instruction**: This strategy does NOT supersede or modify any of the above. These aspects are AIMC service-consumer boundary definitions from MMM's perspective. They define HOW MMM calls AIMC, not how AIMC operates internally.

### 9.2 What Remains AIMC Specialist Strategy Only (Not Yet Governed by MMM)

The following aspects are AIMC-internal operating model decisions. They are NOT yet defined in any MMM or canon artifact and must be governed by this strategy:

| Aspect | Gap | Governed By This Strategy (§) |
|--------|-----|-------------------------------|
| Specialist knowledge source model | Not defined anywhere in current MMM or AIMC canon | §3 |
| Source priority hierarchy | Not defined | §4.1 |
| Source conflict resolution rules | Not defined | §4.2–4.4 |
| Freshness and currency rules | Not defined | §5 |
| "Stale but still governing" concept | Not defined | §5.3 |
| Shared memory boundary rules | Partially implied by Arbiter oversight model; not explicit | §6 |
| Cross-specialist contamination protections | Not explicitly defined | §6.5 |
| What gets promoted to orchestrator memory | Not defined | §6.4 |
| Module-consumer mode definition | Not explicitly defined as a formal contract | §7 |
| H-1/H-2/H-3/H-4 output classification | Not defined anywhere | §8 |
| Consuming module obligations | Implied but not explicit | §7.3 |

### 9.3 Future Bridge Artifacts Needed

The following artifacts do NOT yet exist and must be created in future waves to complete the MMM ↔ AIMC governance alignment:

| Artifact | Purpose | Dependency | Priority |
|---------|---------|------------|---------|
| `MMM ↔ AIMC Convergence Bridge` | Explicit mapping of MMM consumption model to AIMC specialist runtime model; resolves the gap between MMM's API-level view and AIMC's internal operating model | This strategy (v2.0.0) + CL-12 readiness | HIGH — blocks CL-12c planning |
| `AIMC Specialist Knowledge Canon` | Canon file `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` implementing the §3 source model | This strategy (v2.0.0) | MEDIUM — required before CL-12 wave |
| `Module-Consumer Mode Specification` | Formal contract defining the H-1/H-2/H-3/H-4 gate obligations for consuming modules | This strategy §7–8 | MEDIUM — required before MMM AI feature QA |
| `AIMC Knowledge Base Inventory v2` | Seeded with at least 1 approved item per active module | CL-12 completion (currently BLOCKED on GAP-009) | LOW — blocked upstream |

### 9.4 Harvest-Map Timing Constraints

This strategy must respect the harvest-map governance model. Key constraints for specialist strategy implementation:

1. **CL-12 is currently BLOCKED** on GAP-009 remediation (EpisodicMemoryAdapter Supabase wiring). No CL-12c planning should create premature integration assumptions before GAP-009 is resolved and CP-11 is formally closed.

2. **Harvest-map source-state model governs legacy source retirement**. When a harvested source reaches TRACEABILITY_ONLY in the harvest map, specialists must cease using it as a live source. This strategy's Class 3 freshness rules (§5.1) are directly aligned with the harvest-map transition model.

3. **MMM Stage 5 architecture defines the frozen AIMC boundary**. Any specialist operating model decisions that affect the MMM ↔ AIMC API surface must be compatible with the frozen Architecture §A6.1 contract. This strategy deliberately operates only at the AIMC-internal level — not at the API surface level.

### 9.5 How This Strategy Guides Future Wave Sequencing

| Wave Type | Sequencing Constraint |
|-----------|----------------------|
| CL-12 (7-module AIMC integration) | Must resolve GAP-009 first; then proceed with CL-12 per this strategy's operating model |
| CL-12c (MMM ↔ AIMC convergence bridge) | Requires: this strategy v2.0.0 + CL-12 completion + MMM Stage 5+ frozen architecture |
| AIMC Knowledge Canon alignment | Requires: this strategy v2.0.0 as upstream authority |
| MMM AI feature QA | Requires: Module-Consumer Mode Specification (future bridge artifact) |
| Future specialist additions (new domain) | Must register with orchestrator per §2.5 lifecycle; must define approved knowledge base per §3 model |

---

## 10. Session Memory Architecture

The Maturion platform maintains a two-tier session memory system:

### 10.1 Orchestrator Memory (Centralised)

**Location**: `.agent-workspace/maturion-agent/memory/`

**Captures**:
- User sessions across ALL apps (MAT, PIT, XDETECT, MMM, etc.)
- Specialist routing decisions
- Multi-specialist chains
- Cross-app learnings
- Validation gate outcomes

**File format**: `session-NNN-YYYYMMDD-{app}-{topic}.md`

### 10.2 Specialist Memory (Domain-Specific)

**Location**: `.agent-workspace/{specialist-name}/memory/`

**Captures**:
- Specialist-specific task executions
- Domain-specific learnings (subject to self-learning tier governance)
- Knowledge base updates (subject to Arbiter validation)

**File format**: `session-NNN-YYYYMMDD-{task}.md`

---

## 11. Knowledge Base Management

### 11.1 Orchestrator Knowledge Base

**Location**: `.agent-workspace/maturion-agent/knowledge/`

**Contains**:
- Specialist registry and expertise mapping
- Routing intelligence rules
- Cross-app patterns
- Constitutional document references

### 11.2 Specialist Knowledge Base

**Location**: `.agent-workspace/{specialist-name}/knowledge/`

**Contains**:
- Domain-specific expertise (Class 2 approved sources)
- Templates and patterns
- Reference materials
- Domain-specific canonical document pointers

### 11.3 Knowledge Update Protocol

Knowledge base updates are governed by three tiers per `Maturion/maturion-self-learning-governance.md`:

| Tier | Name | Scope | Authority |
|------|------|-------|-----------|
| Tier 1 | Micro-Learning (Ephemeral) | Single session, not persisted | Automatic with Arbiter supervision |
| Tier 2 | Structural Learning (Reasoning Frameworks) | Persisted to session memory | Arbiter validated |
| Tier 3 | Knowledge Layer Learning | Persisted to knowledge base | CodexAdvisor or CS2 gated |

---

## 12. Multi-Embodiment Orchestration Model

### 12.1 Constitutional Requirement

Per `Maturion/maturion-identity.md`:
> "Maturion is a single, unified artificial intelligence... one identity, one memory framework, one ethical framework, one set of guardrails, one mission, one personality, one situational awareness model."

### 12.2 Embodiment Model

| App | Embodiment | Primary Specialists | Behaviour |
|-----|-----------|---------------------|-----------|
| MAT | Risk-Maturion | mat-specialist, criteria-generator-agent, risk-platform-agent | Calm, authoritative, audit-focused |
| PIT | Risk-Maturion | pit-specialist, risk-platform-agent | Proactive, threat-aware |
| XDETECT | Risk-Maturion | xdetect-specialist, risk-platform-agent | Detection-focused, compliance-aware |
| Maturity Roadmap | Risk-Maturion | maturity-roadmap-specialist, risk-platform-agent | Gap-analysis, improvement-planning |
| MMM | Risk-Maturion | mat-specialist (via convergence), risk-platform-agent | Full maturity platform, AIMC gateway |
| Builder | Builder-Maturion | Foreman embodiment | POLC authority, does not implement |
| Command | Command-Maturion | Command embodiment | Real-time ops, concise, action-oriented |

### 12.3 Constitutional Alignment Verification

Before every response, Maturion verifies:
- ✅ ONE identity maintained across apps
- ✅ App context correctly loaded
- ✅ Embodiment behaviour aligned with app
- ✅ Watchdogs (Guardian, Sentinel, Arbiter) active
- ✅ No cross-app memory contamination

---

## Appendix A — Strategy Delta Summary (D2)

### What Changed from v1.0.0

**Version 1.0.0 (2026-02-20)** was structured as a collection of canon file outlines — it described what the canon files *should contain* rather than articulating the strategy itself as an execution-ready operating model. The document had strong architectural direction but lacked:
- Explicit source hierarchy and conflict rules
- Freshness and currency governance
- Memory boundary rules beyond high-level architecture
- Module-consumer mode definition
- Human-in-the-loop output classification
- Explicit MMM convergence mapping

**Version 2.0.0 (2026-04-15)** converts the document from an architectural outline into an execution-ready strategy source model.

### What Changed (Delta Table)

| Area | v1.0.0 State | v2.0.0 State | Change Type |
|------|-------------|-------------|------------|
| Document purpose | Implicit — collection of canon file outlines | Explicit — governing source model | Structural |
| Specialist knowledge sources | Not addressed | §3 — five-class source model with definitions | NEW |
| Source priority hierarchy | Not addressed | §4.1 — absolute priority order | NEW |
| Conflict resolution rules | Not addressed | §4.2–4.4 — five conflict resolution rules | NEW |
| Freshness rules | Not addressed | §5 — timeless/governed/time-bounded/session/current-awareness | NEW |
| "Stale but still governing" | Not addressed | §5.3 — explicit definition and specialist obligations | NEW |
| Shared memory boundaries | High-level read/write model | §6 — explicit read/write permission tables, contamination prohibitions | ENHANCED |
| Module-consumer mode | Not defined | §7 — formal definition, MMM model, service-layer vs. module-local | NEW |
| Human-in-the-loop | Not defined | §8 — H-1/H-2/H-3/H-4 output classification with per-rule obligations | NEW |
| MMM convergence mapping | Not present | §9 — already-governed, AIMC-only, future bridge artifacts, timing | NEW |
| Document header | Not present | Status header with version, authority, date | STRUCTURAL |
| Canon derivation | Implicit | §1 — explicit three-tier governance framework with derivation rule | ENHANCED |

### Why v1.0.0 Was Insufficient

v1.0.0 was a valuable architectural foundations document, but it could not serve as the governing execution basis for:
- CL-12c readiness planning — no module-consumer mode was defined
- AIMC knowledge canon alignment — no source model existed to canonise
- MMM AI feature QA planning — no human-in-the-loop framework existed
- Wave sequencing guidance — no timing constraints for CL-12 → CL-12c → MMM convergence

### How v2.0.0 Supports Canon Alignment and MMM Convergence

1. **Canon alignment**: §3, §4, §5, §6 provide the executable basis for `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` and future specialist canon files
2. **MMM convergence**: §9 maps the governance landscape explicitly — what is frozen, what is open, what bridge artifacts are needed
3. **Wave sequencing**: §9.5 provides explicit sequencing constraints tied to CL-12, GAP-009, and MMM Stage milestones
4. **Human-in-the-loop**: §8 provides the framework needed for MMM's AI feature QA planning (no AI feature can be QA'd without this classification)

---

## Appendix B — MMM Convergence Mapping Note (D3)

### Already Covered by MMM Artifacts

The following AIMC-related aspects are explicitly defined in approved MMM pre-build artifacts (App Description v0.5.0, FRS, TRS, Architecture §A6):

| Aspect | Where Defined | Status |
|--------|--------------|--------|
| AIMC as sole AI gateway | FRS FR-053, Architecture §A6.1 | FROZEN — no change needed |
| 8 AIMC endpoint definitions | Architecture §A6.1 endpoint table | FROZEN |
| JWT service-to-service authentication | Architecture §A6.1, TRS TR-011 | FROZEN |
| Canonical response envelope | TRS TR-012 | FROZEN |
| Circuit breaker policy | Architecture §A4.5, TRS TR-009 | FROZEN |
| Timeout per endpoint | TRS TR-014 | FROZEN |
| AIMC versioning + dual-routing | TRS TR-013 | FROZEN |
| AIMC URL + token environment config | TRS TR-053, Architecture §A8.3 | FROZEN |
| `mmm_` namespace enforcement for cross-module data | TRS TR-028 | FROZEN |
| Fallback response on circuit open | Architecture §A6.1 | FROZEN |

### Not Yet Governed (AIMC-Side Only)

The following aspects are NOT defined in MMM artifacts. They are AIMC-internal operating model decisions that must come from this strategy:

| Aspect | Gap Type | Governed By (this document) |
|--------|---------|----------------------------|
| Specialist knowledge source model | AIMC-internal | §3 |
| Source priority hierarchy | AIMC-internal | §4.1 |
| Conflict resolution rules | AIMC-internal | §4.2–4.4 |
| Freshness rules per source class | AIMC-internal | §5 |
| "Stale but still governing" concept | AIMC-internal | §5.3 |
| Memory read/write permission model | AIMC-internal | §6.2–6.3 |
| Cross-specialist contamination model | AIMC-internal | §6.5 |
| What gets promoted to orchestrator memory | AIMC-internal | §6.4 |
| Module-consumer mode formal definition | AIMC/MMM boundary | §7 |
| Response mode designations (H-1/H-2/H-3/H-4) | AIMC/MMM boundary | §8 |
| Consuming module H-gate obligations | MMM-side gap | §8 — referenced from MMM QA planning |
| Specialist response labelling conventions | AIMC-internal | §3.2 (per-class labelling) |

### Future Bridge Artifacts Required

| Artifact | Depends On | Produces | When |
|---------|-----------|---------|------|
| MMM ↔ AIMC Convergence Bridge | This strategy (v2.0.0) + CL-12 | Formal interface between MMM consumption model and AIMC internal model | After CL-12, before CL-12c |
| AIMC Specialist Knowledge Canon | This strategy §3 | `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` | Before CL-12 wave start |
| Module-Consumer Mode Specification | This strategy §7–8 | Formal module-consumer contract for MMM QA | Before MMM AI feature QA-to-Red |

### Harvest-Map Ownership

This strategy does NOT modify the harvest map. The harvest map governs:
- Which capabilities move from source systems to MMM
- Source-state transition (ACTIVE_SOURCE → PARALLEL_RUN → TRACEABILITY_ONLY → RETIRED)
- Capability ownership after convergence

This strategy governs:
- How AIMC specialists operate internally
- How consuming modules call AIMC
- What human gates the consuming module must enforce

These are complementary, not overlapping, governance layers.

---

## Appendix C — Forward Handoff Note (D4)

### What This Wave Resolved

This wave (maturion-isms#1382) converted the Maturion orchestrator/specialist strategy from a conceptual architecture outline into an execution-ready source model. The 8 missing dimensions (O1–O8) are now explicitly defined and governed.

### What the Next Wave Should Address

The following waves should be created in sequence:

**IMMEDIATE DEPENDENCY — must not be bypassed:**

1. **GAP-009 Remediation Wave** (already recommended in AIMC Phase 2 audit)
   - Action: EpisodicMemoryAdapter Supabase wiring
   - Assignee: integration-builder
   - Why: Unblocks CP-11 and CL-12

**NEAR-TERM — enables CL-12 planning:**

2. **AIMC Specialist Knowledge Canon Alignment Wave**
   - Action: Create `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` from §3 of this strategy
   - Assignee: CodexAdvisor-agent + governance-liaison-isms-agent (for ripple)
   - Why: Canonises the source model so it is hash-tracked and machine-enforced
   - Input: This document §3–§5

3. **Module-Consumer Mode Specification Wave**
   - Action: Create formal contract document for consuming modules (including H-1/H-2/H-3/H-4 gate obligations)
   - Assignee: mat-specialist (MMM domain context) + governance review
   - Why: MMM's AI feature QA-to-Red cannot proceed without this specification
   - Input: This document §7–§8

**MEDIUM-TERM — after CL-12 completion:**

4. **MMM ↔ AIMC Convergence Bridge Artifact Wave**
   - Action: Create the bridge artifact that formally connects MMM's service-consumer view (§A6.1) with AIMC's internal operating model (this strategy)
   - Assignee: mat-specialist (MMM) + risk-platform-agent (AIMC) — coordinated by Foreman
   - Why: Closes the governance gap between MMM and AIMC before CL-12c execution
   - Input: This document §9, MMM Architecture §A6.1, CL-12 completion state

**LONG-TERM — CL-12c execution planning:**

5. **CL-12c Readiness Planning Wave**
   - Action: Define the CL-12c execution plan based on convergence bridge artifact + CL-12 state
   - Assignee: Foreman (POLC-Orchestration) with IAA oversight
   - Input: All of the above + CL-12 completion certificate

### What Must Be Deferred to Canon Alignment (Not Done Here)

The following are explicitly deferred to the canon alignment waves above:
- Machine-enforcement of source priority rules (requires canon file)
- Ripple-enabled distribution of source model to consumer repos
- AIMC Knowledge Base Inventory seeding (blocked on CL-12/GAP-009)
- Formal module-consumer contract publication

### How This Strategy Guides Future Wave Sequencing to Avoid MMM Build Conflicts

The following constraints must be honoured to prevent AIMC work from conflicting with MMM build sequencing:

1. **Do not modify MMM Architecture §A6.1** based on AIMC strategy decisions — the MMM boundary is frozen
2. **Do not create new AIMC endpoints** before the Module-Consumer Mode Specification is in place — adding endpoints without the H-classification model creates unmanaged H-gate obligations
3. **Do not start CL-12c planning** before the Convergence Bridge Artifact exists — CL-12c will be improvised without it
4. **Respect harvest-map source-state model** — specialist legacy source retirement timelines are governed by the harvest map, not by this strategy

---

**Authority**: CS2 (Johan Ras / @APGI-cmy)
**Version**: 2.0.0
**Date**: 2026-04-15
**Issue**: maturion-isms#1382
**Governed by**: `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
