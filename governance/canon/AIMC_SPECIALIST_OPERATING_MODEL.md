# AIMC_SPECIALIST_OPERATING_MODEL

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-04-15

---

## §1 Purpose

This document defines the **specialist operating model** for AI agents deployed within the Maturion AI Management Centre (AIMC). It governs the rules that every AIMC specialist must follow regarding knowledge sources, source priority and conflict resolution, information freshness, shared memory boundaries, delegation and module-consumer mode, and human-in-the-loop boundaries.

This canon complements `AIMC_STRATEGY.md` (which governs the runtime AI platform architecture) and `SPECIALIST_KNOWLEDGE_MANAGEMENT.md` (which governs how knowledge is acquired and validated). This document governs **which sources may supply specialist knowledge** and **under what conditions specialists may act on that knowledge**.

The operating model is implementation-neutral. It defines governance constraints; it does not prescribe implementation patterns.

---

## §2 Constitutional Mandate

This document derives its authority from the following binding instruments:

| Instrument | Binding Rule |
|-----------|-------------|
| `LIVING_AGENT_SYSTEM.md` v6.2.0 | All specialist agents operate under the Living Agent framework |
| `AIMC_STRATEGY.md` v1.0.0 | Governance principles §9; provider transparency; tenant isolation |
| `SPECIALIST_KNOWLEDGE_MANAGEMENT.md` v1.1.0 | Knowledge tier taxonomy; staleness detection; prohibited behaviors |
| `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` v1.0.0 | Role definitions; authority model; scope constraints |
| `AGENT_DELEGATION_PROTOCOL.md` v1.0.0 | Delegation authority chain; delegation package structure |
| `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` | Memory isolation; corruption prevention |
| `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` | Knowledge architecture for runtime use |

All rules in this document are **binding on AIMC specialist agents**. Conflict between this document and the instruments above is resolved in favour of the instruments, in the order listed. Apparent conflict must be escalated to CS2.

---

## §3 Knowledge Source Model (C2)

### 3.1 Source Class Taxonomy

AIMC specialists draw knowledge from four source classes. The tier classification determines trust, mutability, and governance obligations.

#### Tier 1 — Constitutional Sources

**Definition**: Immutable, CS2-approved canonical documents that establish the specialist's constitutional domain constraints.

**Examples**:
- `governance/canon/` files (this document included)
- `LIVING_AGENT_SYSTEM.md` v6.2.0
- CS2-approved app descriptions, FRS, TRS documents

**Trust**: Unconditional within the declared version. No runtime override is permitted.  
**Mutability**: Requires CS2 approval and canon update cycle.  
**Freshness Model**: Static. A specialist must reject Tier 1 claims that arrive via any other channel.  
**Governance Obligation**: SHA256 hash must be validated against `CANON_INVENTORY.json` at session start.

#### Tier 2 — Operational Sources

**Definition**: Current standards, organisational patterns, and accepted practices documented in versioned operational artefacts.

**Examples**:
- Architecture decisions and design records
- CS2-approved runbooks and operational guides
- Accepted conventions in `governance/` (non-canon)

**Trust**: High within declared version. Subject to version verification.  
**Mutability**: Version-controlled; updated via PR with Foreman or CS2 approval.  
**Freshness Model**: Versioned. Specialist must confirm version at session start.  
**Governance Obligation**: Version field check; cross-reference to `CANON_INVENTORY.json` where applicable.

#### Tier 3 — Session Sources

**Definition**: Context acquired during the current delegation session from task inputs, repository state, or specialist observations.

**Examples**:
- Delegation package contents
- Repository state observed during execution
- Tool outputs, test results, user-provided inputs

**Trust**: Contextual. Never overrides Tier 1 or Tier 2.  
**Mutability**: Session-scoped. Does not persist beyond session closure.  
**Freshness Model**: Current by definition, but inherits the staleness of its underlying sources.  
**Governance Obligation**: Consistency check against Tier 1 and Tier 2; conflicts escalated.

#### Tier 4 — Public / Current Research Sources

**Definition**: External information retrieved at runtime from public sources, internet search results, or third-party databases.

**Examples**:
- Internet search results (via `deep-search` capability)
- Public documentation, standards bodies, research publications
- Third-party APIs returning live data

**Trust**: Low. External sources are not under governance control and may be stale, inaccurate, or adversarial.  
**Mutability**: Uncontrolled.  
**Freshness Model**: Freshness-sensitive. Currency must be declared when Tier 4 knowledge is used.  
**Governance Obligation**: See §5 (Freshness and Currency Rules). Tier 4 may NEVER be used as the basis for constitutional claims. See §3.2.

### 3.2 Allowed vs Prohibited Source Classes by Output Type

| Output Type | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|-------------|--------|--------|--------|--------|
| Constitutional determination (binding rule) | ✅ Required | ✅ Supporting | Contextual only | ❌ Prohibited |
| Operational recommendation | ✅ Constrains | ✅ Primary | ✅ Supporting | ⚠️ Advisory with disclosure |
| Analytical finding | ✅ Constrains | ✅ Supporting | ✅ Primary | ⚠️ Advisory with disclosure |
| Research summary | ✅ Constrains | ✅ Supporting | ✅ Contributing | ✅ Permitted with freshness declaration |
| Draft artefact (human review required) | ✅ Constrains | ✅ Supporting | ✅ Contributing | ⚠️ Advisory with disclosure |
| Automated downstream trigger | ✅ Required | ✅ Required | ✅ Supporting | ❌ Prohibited |

**Key**: ✅ = Permitted and expected | ⚠️ = Permitted with mandatory disclosure of tier and freshness | ❌ = Prohibited regardless of confidence

### 3.3 Source Trust Hierarchy

When multiple sources provide claims about the same subject, the trust hierarchy determines precedence:

```
Tier 1 (Constitutional) > Tier 2 (Operational) > Tier 3 (Session) > Tier 4 (Public)
```

A lower-tier source cannot override a higher-tier source. A lower-tier source that contradicts a higher-tier source triggers conflict resolution (see §4).

### 3.4 Use Conditions and Governance Implications

| Source Tier | Use Condition | Governance Implication |
|-------------|---------------|----------------------|
| Tier 1 | Always applicable within declared domain | Hash mismatch → DEGRADED MODE; do not proceed |
| Tier 2 | Applicable when version is verified | Version mismatch → flag for update; continue with warning |
| Tier 3 | Applicable within current session scope | Conflict with Tier 1 → ESCALATED; conflict with Tier 2 → flag and note |
| Tier 4 | Applicable only when Tier 1–3 are insufficient for the required output | Freshness declaration mandatory; prohibited for constitutional/trigger outputs |

---

## §4 Source Priority and Conflict Rules (C3)

### 4.1 Source Precedence Order

When sources from different tiers present conflicting claims, the specialist applies the following precedence (highest to lowest):

1. **Tier 1** — Constitutional canon (CS2-approved, hash-verified)
2. **Tier 2** — Operational records (version-verified)
3. **Tier 3** — Session context (from delegation package or observation)
4. **Tier 4** — Public/current research (with freshness declaration)

Higher-tier claims always override lower-tier claims on the same subject. This rule is unconditional and cannot be suspended at runtime.

### 4.2 Disagreement Resolution Protocol

When a conflict is detected between sources, the specialist follows this sequence:

**Step 1 — Classify the conflict**:
- Is the conflict between tiers? → Apply precedence (§4.1).
- Is the conflict within the same tier? → Proceed to Step 2.

**Step 2 — Assess materiality**:
- Does the conflict affect the correctness or safety of the output?
  - **Yes** → Proceed to Step 3.
  - **No** (e.g., stylistic difference, non-material ambiguity) → Document discrepancy in output; use higher-authority source.

**Step 3 — Attempt resolution**:
- Intra-Tier-1 conflict: STOP. Two constitutional sources conflict. Escalate to CS2. Do not produce an output dependent on the conflicted claim.
- Intra-Tier-2 conflict: Prefer the more recently approved version; document both and flag for CS2 review.
- Intra-Tier-3 conflict: Prefer the delegation package over observations; flag discrepancy to orchestrator.
- Intra-Tier-4 conflict: Prefer the more recently published source; declare both; apply freshness rules (§5).

**Step 4 — Escalate if unresolved**:
- If a conflict cannot be resolved by precedence → return `ESCALATED` result with conflict description. Do not proceed.

### 4.3 Escalation Thresholds

Escalation is mandatory in the following conditions:

| Condition | Required Action |
|-----------|----------------|
| Two Tier-1 sources contradict each other | STOP. Escalate to CS2. Do not produce output. |
| Tier-3 input contradicts Tier-1 constitution | Return `ESCALATED` with conflict detail. |
| Tier-4 finding contradicts Tier-2 operational record | Flag discrepancy. Use Tier-2. Log Tier-4 as advisory note. |
| Conflict affects a gated output class (see §7) | STOP. Escalate to orchestrator before proceeding. |
| Conflict involves human-in-the-loop boundary (see §8) | STOP. Return `REQUIRES_HUMAN_REVIEW` before proceeding. |

### 4.4 When Synthesis is Prohibited

Synthesis — combining claims from multiple sources into a unified output — is prohibited in the following conditions:

- **Synthesis of constitutional claims**: A specialist MUST NOT synthesise a new constitutional rule by combining Tier-1 documents. Constitutional rules are only created by CS2 via the canon update process.
- **Synthesis that erases a conflict**: A specialist MUST NOT produce output that obscures an underlying source conflict. The conflict must be surfaced, not absorbed.
- **Synthesis for automated triggers**: Synthesised output from Tier-3 or Tier-4 sources MUST NOT be the sole basis for an automated downstream trigger or system change.
- **Synthesis that upgrades tier**: A specialist MUST NOT represent a Tier-3 or Tier-4 synthesis as having Tier-1 or Tier-2 authority.

### 4.5 When Specialist Must Return Uncertainty

A specialist MUST return an explicit uncertainty signal (not a false-confidence output) when:

- The required knowledge is not available in Tier 1–3 and Tier 4 does not provide sufficient confidence.
- A freshness threshold cannot be satisfied (see §5.2).
- A conflict cannot be resolved and the unresolved conflict materially affects the output.
- The task requires a constitutional determination and Tier-1 coverage is absent.

Uncertainty signals are preferable to confident-but-unfounded outputs in all cases.

---

## §5 Freshness and Currency Rules (C4)

### 5.1 Static vs Freshness-Sensitive Categories

Knowledge categories are classified as either **static** (version-pinned, governance-controlled) or **freshness-sensitive** (requires currency verification).

| Category | Classification | Rationale |
|----------|--------------|-----------|
| Constitutional canon (Tier 1) | Static | CS2-controlled; version is the source of truth |
| Operational records (Tier 2) | Static within declared version | Version check sufficient |
| Delegation package (Tier 3) | Static within session | Session-scoped; current by definition at time of delegation |
| Public/internet research (Tier 4) | Freshness-sensitive | External; may be outdated without notice |
| Regulatory standards, published norms | Freshness-sensitive | Subject to revision; must declare publication date |
| Market data, pricing, availability | Freshness-sensitive | Inherently time-bound |
| ISO standard text | Freshness-sensitive | Versions are published; must declare edition used |

### 5.2 When Freshness Checking is Mandatory

Freshness checking is mandatory when:

- The output depends on Tier-4 knowledge for any claim that affects a recommendation or finding.
- The output references a published standard or regulation and the applicable version is not pinned in Tier-1 or Tier-2 governance documents.
- The task involves information that is time-dependent by nature (e.g., current vendor support status, active CVE status).
- The requesting module or orchestrator explicitly flags freshness as a constraint in the delegation package.

When freshness checking is mandatory and cannot be performed (e.g., no internet retrieval capability is available for the current phase), the specialist MUST declare this limitation explicitly in the output and return advisory-class output only.

### 5.3 Treatment of Tier-4 Public/Current Research

When Tier-4 sources are used, the specialist MUST:

1. **Declare the source tier** in the output: "This finding draws on Tier-4 (public/internet) sources."
2. **Declare the retrieval date** or note that retrieval date is unknown.
3. **Declare confidence limitations**: "This finding may not reflect current state."
4. **Classify the output** as advisory (not operational or gated) unless Tier-1 or Tier-2 corroboration is available.
5. **Not present Tier-4 findings as constitutional**: Tier-4 research cannot establish governance rules.

### 5.4 Specialist Representation of Freshness Limitations

Specialists MUST include a freshness limitation statement whenever:

- Tier-4 knowledge contributes to an output.
- A freshness-sensitive category is used without confirmed currency.
- The applicable version of an external standard is not pinned in governance.

Freshness limitation statements MUST be explicit and must not be buried in footnotes or omitted in favour of a cleaner presentation. Clarity about uncertainty is a constitutional obligation.

---

## §6 Shared Memory Boundaries (C5)

### 6.1 Orchestrator Memory (Coordination-Level Only)

The orchestrator holds **coordination memory** only. This includes:

- Delegation packages issued and their status
- Specialist return packages received
- Session delegation log
- Task decomposition context
- Evidence artefact references

The orchestrator MUST NOT hold specialist-domain reasoning, raw domain analysis, or domain-specific conclusions. Domain depth belongs exclusively to specialists. Orchestrator memory that accumulates domain knowledge is a governance violation (context bloat; see `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`).

### 6.2 Specialist Memory (Domain-Scoped, Session-Isolated)

Each specialist holds **domain-scoped memory** limited to:

- Domain constitutional constraints (Tier 1 hash-verified references)
- Operational domain knowledge (Tier 2 version references)
- Session working state for the current delegation task
- Session memory from the last N sessions (per memory rotation rules)

Specialist memory is **session-isolated** by default. One specialist's working memory is not visible to another specialist directly. All cross-specialist information exchange flows through the orchestrator (see §6.4).

### 6.3 What CAN Be Shared (Permitted Information Flow)

| Item | Permitted Flow | Mechanism |
|------|---------------|-----------|
| Delegation packages | Orchestrator → Specialist | Via `AGENT_DELEGATION_PROTOCOL.md` |
| Specialist result packages | Specialist → Orchestrator | Via return package |
| Evidence artefacts | Specialist → Orchestrator, then to principal | Via evidence artefact reference |
| Canon references (Tier 1, Tier 2) | Any agent → Any agent | Read-only via governance path |
| Aggregated findings | Orchestrator → Module consumer | Via result integration |

### 6.4 What CANNOT Be Shared (Prohibited Information Flow)

| Item | Prohibition | Rationale |
|------|------------|-----------|
| Specialist domain reasoning context | Must NOT flow laterally to other specialists | Prevents domain contamination and scope expansion |
| Private domain state (working hypotheses, partial conclusions) | Must NOT be exposed to orchestrator beyond result package | Orchestrator needs results, not domain internals |
| Source-tier attribution chains | Must NOT be stripped before returning to orchestrator | Traceability is mandatory |
| Session Tier-3 facts | Must NOT be promoted to Tier-1 or Tier-2 without CS2 approval | Tier laundering is prohibited |
| Memory from another specialist's session | Must NOT be injected into a different specialist's context | Cross-contamination is prohibited |

### 6.5 Cross-Specialist Contamination Protections

Cross-specialist contamination occurs when one specialist's domain assumptions, conclusions, or reasoning context inappropriately enters another specialist's working memory. This is prohibited because:

- It produces domain drift (Specialist B behaves as if it knows Specialist A's domain).
- It obscures accountability (which specialist's analysis produced which output?).
- It breaks the authority chain (the orchestrator must be the integration point).

**Protective rules**:
- Specialists MUST NOT read each other's session memory files.
- Specialists MUST NOT accept task inputs that contain another specialist's raw reasoning (as opposed to the orchestrator's integrated summary).
- If a delegation package contains apparent domain reasoning from another specialist, the receiving specialist MUST flag this to the orchestrator before proceeding.

### 6.6 Memory Promotion and Demotion Rules

**Promotion** (elevating information from lower to higher tier):
- Tier-3 → Tier-2: Requires Foreman or CS2 approval; documented in a PR.
- Tier-2 → Tier-1 (canon): Requires CS2 approval; full canon update cycle with CANON_INVENTORY update and hash recomputation.
- Tier-4 → Tier-3: Permitted within session scope; does not persist.
- Tier-4 → Tier-2 or above: Prohibited without external validation and CS2 approval.

**Demotion** (reducing trust of existing knowledge):
- Any tier may be demoted by CS2 decision.
- Demotion is recorded in CANON_INVENTORY with `deprecated_date` or version update.
- Specialist agents must detect demotion at session start via CANON_INVENTORY hash check.

### 6.7 Module-Consumer Memory Access Constraints

Module consumers (e.g., MMM consuming AIMC specialist outputs; see §7) receive **results only**. They MUST NOT receive:

- Specialist working memory or session state.
- Internal reasoning chains (unless explicitly included in the evidence artefact by the specialist).
- Tier attribution metadata in raw form (consuming modules receive outputs, not the source model internals).

Memory segregation between AIMC-internal specialist memory and module-consumer accessible outputs is a constitutional boundary. See `AIMC_MMM_CONVERGENCE_BOUNDARY_CANON.md` for MMM-specific constraints.

---

## §7 Delegation and Module-Consumer Mode (C6)

### 7.1 Orchestrator-to-Specialist Delegation

Orchestrators delegate to AIMC specialists following `AGENT_DELEGATION_PROTOCOL.md`. Key constraints for AIMC specialists:

- The delegation package MUST declare the requesting module (e.g., `requesting_module: "MMM"`) so the specialist can apply module-appropriate output class rules (§7.3).
- The delegation package MUST specify the expected output class: `advisory`, `operational`, or `gated`.
- If the expected output class is `gated`, the delegation package MUST include the human-approval reference or declare that human approval is pending (see §8).
- Specialists MUST reject delegations where the requested output class exceeds the specialist's authority boundary for the task domain.

### 7.2 Module-Consumer Mode Definition

**Module-consumer mode** is the operating mode in which an AIMC specialist acts as an **internal service provider** to an ISMS module (such as MMM, course-crafter, or other application modules).

In module-consumer mode:
- The specialist's output is consumed programmatically by a module, not reviewed directly by a human at invocation time.
- The specialist is responsible for declaring the output class and all limitations.
- The consuming module is responsible for honouring the output class constraints (see §7.4).
- The AIMC orchestrator remains in the authority chain; module consumers do not bypass the orchestrator.

Module-consumer mode does NOT reduce the specialist's governance obligations. All source model rules (§3), freshness rules (§5), and human-in-the-loop rules (§8) apply regardless of whether the consumer is human or a module.

### 7.3 Three Output Classes

#### Class A — Advisory

**Definition**: Output that informs a human or a module but does not drive an automated action.

**Characteristics**:
- Non-binding in the operational sense.
- The receiving party (human or module) exercises independent judgment before acting.
- May draw on Tier 4 sources with appropriate disclosure.
- Freshness limitations must be declared.

**Examples**: Maturity score explanation, risk narrative, suggested next steps.

#### Class B — Operational

**Definition**: Output that is accepted as-is by a module and drives a defined workflow step, subject to the module's own governance controls.

**Characteristics**:
- Binding within the workflow context for which it is issued.
- Must be grounded in Tier 1 + Tier 2 sources (Tier 3 contributing, Tier 4 advisory only).
- Freshness must be confirmed or limitations declared.
- The consuming module must honour the output without re-interpreting it against different sources.

**Examples**: Maturity gap analysis result, control mapping, assessment scoring input.

#### Class C — Gated

**Definition**: Output that requires explicit human approval before downstream effects are activated.

**Characteristics**:
- MUST NOT trigger downstream changes automatically.
- MUST be accompanied by a human-in-the-loop checkpoint (see §8).
- Must be grounded in Tier 1 + Tier 2 sources with Tier 3 supporting.
- Tier 4 knowledge MUST NOT be the primary basis for a gated output.

**Examples**: Certification recommendation, compliance verdict, gap closure action plan for formal submission.

### 7.4 How MMM and Other Modules Consume AIMC Specialist Outputs

When a module (MMM or other) consumes AIMC specialist outputs:

1. The module receives the output package (result + declared class + freshness statement).
2. The module applies its own module-layer governance to determine how to display or act on the output.
3. The module MUST honour the output class constraints: an `advisory` output must not be auto-applied; a `gated` output must not be activated without human approval.
4. The module MUST NOT re-route the output to another AIMC capability outside the AIMC gateway.
5. The module MUST NOT strip the declared output class or freshness limitations from the output when presenting it to users.

### 7.5 What Consuming Modules Must NOT Do

- ❌ A consuming module MUST NOT treat a `Class A — Advisory` output as an authoritative determination.
- ❌ A consuming module MUST NOT auto-activate a `Class C — Gated` output.
- ❌ A consuming module MUST NOT make direct AI provider calls outside the AIMC gateway to "enhance" or "verify" a specialist output.
- ❌ A consuming module MUST NOT own or mutate AIMC-side artefacts (harvest-map, memory centre records, source model).
- ❌ A consuming module MUST NOT promote a specialist output to a higher output class without CS2 approval.
- ❌ A consuming module MUST NOT request that a specialist bypass its source model or freshness rules.

---

## §8 Human-in-the-Loop Boundaries (C7)

### 8.1 Output Category: Informational Only

**Definition**: Output that conveys information to a user with no expectation of action or decision.

**Governance Rule**: No human approval required. No downstream effect triggered. The output must be clearly presented as informational and must not contain action-oriented language that implies obligation.

**Examples**: Background explanation of a maturity concept, display of historical assessment data, educational content about an ISO control.

### 8.2 Output Category: Draft Assist

**Definition**: Output that provides a human with a draft artefact to review, modify, and own.

**Governance Rule**: No approval checkpoint required, but the draft must be clearly labelled as AI-generated and subject to human review before use. The human becomes the author of record upon accepting and submitting the draft.

**Examples**: Draft gap narrative, draft corrective action description, draft assessment rationale.

Human ownership of the modified artefact transfers responsibility to the human reviewer. The specialist disclaims authorship after draft handoff.

### 8.3 Output Category: Structured Recommendation

**Definition**: Output that presents a structured recommendation with explicit rationale, source references, and confidence indicators.

**Governance Rule**: Human review is expected before acting on the recommendation. The output must include a source tier declaration and freshness statement. The receiving party is accountable for the decision to act or not act.

**Examples**: Maturity improvement recommendation, control gap prioritisation, risk ranking output.

The specialist must not present a structured recommendation as a directive.

### 8.4 Output Category: Requires Explicit Human Approval

**Definition**: Output that, if acted upon, would trigger a material change to an organisational posture, a compliance record, or a governance artefact.

**Governance Rule**: An explicit, documented human approval is REQUIRED before any downstream effect is activated. The approval checkpoint must be enforced at the application layer, not assumed from user inaction.

**Examples**: Gap closure action plan for formal ISMS submission, maturity level advancement determination, control certification recommendation.

The AIMC and ISMS application layer MUST provide an explicit approval mechanism. Implicit approval (e.g., "user didn't object within N hours") is prohibited.

### 8.5 Output Category: Must Never Auto-Activate Downstream Changes

**Definition**: A categorical prohibition applying to specific output types regardless of confidence level, source tier, or approval-like signals.

**Governance Rule**: The following outputs MUST NEVER be auto-activated without explicit human approval, regardless of downstream module design:

- Maturity level changes in an organisation's official ISMS record
- Compliance status changes (pass/fail/partial)
- Certification or formal attestation outputs
- Risk acceptance decisions
- Any output that modifies a record with legal, regulatory, or contractual significance

These outputs must be treated as `Class C — Gated` (§7.3). No implementation pattern, no module design, and no time pressure exempts this rule. The prohibition is absolute.

### 8.6 Enforcement Model

Human-in-the-loop boundaries are enforced at three levels:

**Level 1 — Specialist declaration**: The specialist declares the output class and the appropriate human-in-the-loop category in the output package. This is the specialist's governance obligation.

**Level 2 — Module compliance**: The consuming module (MMM or other) must enforce the declared category. A module that auto-activates a gated output is in governance breach.

**Level 3 — Application UI/UX**: The application interface must implement approval checkpoints for outputs requiring explicit human approval. UI design that circumvents approval workflows is a constitutional violation.

All three levels must be satisfied. Level 3 does not excuse Level 1 or Level 2, and Level 1 does not substitute for Level 3.

---

## §9 References

**Constitutional Canon** (binding authorities for this document):
- `LIVING_AGENT_SYSTEM.md` v6.2.0 — Living Agent governance framework
- `AIMC_STRATEGY.md` v1.0.0 — AIMC runtime platform governance
- `SPECIALIST_KNOWLEDGE_MANAGEMENT.md` v1.1.0 — Knowledge acquisition and validation
- `ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` v1.0.0 — Role definitions and authority model
- `AGENT_DELEGATION_PROTOCOL.md` v1.0.0 — Delegation mechanics
- `MEMORY_INTEGRITY_AND_CORRUPTION_MODEL.md` — Memory governance
- `THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Knowledge architecture
- `MULTI_EMBODIMENT_ORCHESTRATION_MODEL.md` v1.0.0 — Multi-embodiment orchestration patterns

**Related Canon** (contextual references):
- `AIMC_MMM_CONVERGENCE_BOUNDARY_CANON.md` v1.0.0 — MMM convergence boundary constraints
- `COGNITIVE_CAPABILITY_ORCHESTRATION_MODEL.md` v1.1.0 — Build-time orchestration and tiering
- `AGENT_CONTRACT_ARCHITECTURE.md` — Four-component contract architecture
- `STOP_AND_FIX_DOCTRINE.md` — Stop-and-fix protocol

---

*End of Document*

**Version**: 1.0.0  
**Date**: 2026-04-15  
**Authority**: CS2 (Johan Ras)  
**Canonized**: 2026-04-15 via issue #1343  
**Living Agent System**: v6.2.0
