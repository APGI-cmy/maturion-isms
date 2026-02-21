# ECOSYSTEM_VOCABULARY.md

**Version**: 1.1.0  
**Type**: Tier-2 Canon (Operational Canon)  
**Authority**: CS2 (Johan Ras / APGI-cmy) — CS2-Approved via issue "Formalize ECOSYSTEM_VOCABULARY.md & Adjust Foreman Agent Modalities"  
**Effective Date**: 2026-02-21  
**Layer-Down Status**: PUBLIC_API — Mandatory layer down to all consumer repositories  
**Maintained By**: Governance Administrator  
**Referenced By**: All agent contracts (especially Foreman and Orchestrator agents)

---

## Purpose

This document defines and standardizes all key terms, verbs, modes, and concepts used across the Maturion ecosystem. It serves as the **single authoritative source of vocabulary** for agent contracts, governance documents, and orchestration logic.

All agents — especially the Foreman and any orchestrator agents — **MUST reference this document** as the source of meaning for classified verbs and modes. Ambiguous or undefined terms must be escalated for inclusion here before use in agent contracts.

This is a **living document**: vocabulary grows as the ecosystem evolves. All additions require a CS2-approved change.

---

## How to Use This Vocabulary

1. **Agents** use this as the canonical reference during the **Verb Classification Gate** (see `foreman-v2.agent.md` Phase 1.5).
2. **Governance authors** must match new terms against this table before coining new language.
3. **Consumer repos** must reference this document (or their local copy) when specifying tasks for agents.
4. **Additions**: Open a governance issue → CS2 approves → update this file → layer-down ripple.

---

## Canonical Term Definitions

| Term | Class | Definition | Ecosystem Usage | Prohibited Confusion |
|------|-------|-----------|----------------|---------------------|
| **orchestrate** | Verb / Mode | To plan, coordinate, and delegate work across agents or systems without personally implementing any part of it. Orchestration is a POLC activity: the orchestrator owns the outcome but never touches implementation. | Foreman orchestrates builder work; an orchestrator agent coordinates sub-agents. | ❌ Do not confuse with _implement_. An agent who writes code is not orchestrating — they are implementing. |
| **implement** | Verb / Mode | To write, build, configure, or otherwise create functional artifacts (code, schemas, configs, migrations). Implementation is exclusively a **builder** responsibility. Foreman and orchestrator agents have **zero implementation authority**. | Builder agents implement. Foreman never implements. | ❌ Do not confuse with _orchestrate_ or _review_. |
| **review** | Verb / Mode | To evaluate an artifact, work product, or output against defined standards, criteria, or acceptance criteria — without modifying the artifact. Reviewing is an **observational and assessment** activity. | Quality Professor mode performs review. FM reviews builder output against Red QA. | ❌ Do not confuse with _implement_ (review does not include fixing). Do not confuse with _evaluate_ (review is applied to concrete outputs; evaluate may be more abstract). |
| **evaluate** | Verb / Mode | To assess quality, correctness, alignment, or fitness of a system, artifact, process, or decision against governance standards or criteria. Evaluation may be broader than review (it encompasses strategic, architectural, and compliance judgment). | FM evaluates whether a wave plan is architecturally sound. Quality Professor evaluates the overall quality verdict. | ❌ Do not confuse with _implement_ or _orchestrate_. Evaluation produces a verdict, not code. |
| **quality assurance (QA)** | Noun / Mode | The systematic process of verifying that deliverables meet defined standards before handover or merge. In the Maturion ecosystem, QA is a distinct gate activity: it produces a binary verdict (PASS/FAIL) and evidence artifacts. QA is never conflated with implementation (fixing bugs found in QA is a builder task). | Red QA tests created by FM before builder execution. Quality Professor mode performs final QA verdict. | ❌ QA does not mean "testing" in isolation — it means the entire quality verification process including standards check, test results, evidence, and verdict. |
| **build** | Verb / Noun | As a verb: to construct a functional deliverable (code, schema, config) that satisfies defined acceptance criteria. As a noun: the resulting artifact set that constitutes a deliverable. Building is exclusively a **builder** responsibility. | Builders build. The FM specifies what to build (not how). | ❌ Do not equate "build" with "run a build command" — in this ecosystem, "build" means the full act of implementing and making tests GREEN. |
| **100% build** | Standard | A build is complete only when ALL defined tests pass (100% GREEN), zero test debt exists (no `.skip()`, `.todo()`, stubs, or incomplete helpers), and all evidence artifacts are generated. A 99% build is an incomplete build. | The FM enforces 100% build before releasing any merge gate. | ❌ "Good enough" builds are not recognized. Any deviation from 100% GREEN is a build failure. |
| **escalate** | Verb | To formally raise a decision, blocker, ambiguity, or governance gap to a higher authority (typically CS2) via a structured escalation document. Escalation is mandatory when an agent encounters a situation outside its authority. | FM escalates governance ambiguity to CS2. Builder escalates to FM when blocked. | ❌ Do not confuse with _report_ (informal status update) or _implement a workaround_ (prohibited). Escalation halts work until resolved. |
| **canonize** | Verb | To formally promote a document, rule, or pattern into the canonical governance corpus (governance/canon/) with CS2 approval, a CANON_INVENTORY entry, SHA256 hash, and ripple to consumer repos. Only CS2 may authorize canonization. | Governance Administrator canonizes new documents after CS2 approval. | ❌ Canonization is not the same as creating a file. A file must be CS2-approved, inventoried, and layered down to be canon. |
| **fully functional** | Standard | A system, feature, or capability is fully functional when it: (1) satisfies all acceptance criteria, (2) passes all tests at 100% GREEN, (3) has no missing dependencies or stubs, (4) has complete evidence artifacts, and (5) is documented. | Handover/merge is only permitted when deliverables are fully functional. | ❌ "Works in happy path" does not equal fully functional. Edge cases, error handling, and evidence must also be complete. |
| **living agent** | Noun | An agent operating under the Living Agent System (LAS) framework — governed by a four-phase canonical contract (Preflight-Induction-Build-Handover), session memory, escalation protocols, and evidence-first operations. Living agents are self-governing, auditable, and continuously improving. | All agents in the Maturion ecosystem are living agents when bound to LIVING_AGENT_SYSTEM.md. | ❌ A static script or simple prompt is not a living agent — it lacks the self-governance, memory, and escalation infrastructure. |
| **wave** | Noun | A time-boxed, architecturally-bounded unit of work assigned to one or more builders under FM supervision. Each wave has a defined scope, Red QA suite, builder assignments, and a completion gate (100% GREEN + evidence). Waves are sequential by default; parallel only when explicitly authorized. | FM plans waves; builders execute within waves. | ❌ A wave is not a sprint or iteration in the agile sense — waves have strict entry/exit criteria and require FM sign-off before and after. |
| **governance gap** | Noun | A missing, incomplete, ambiguous, or inconsistent governance artifact, rule, or process that leaves agents without clear guidance. Governance gaps must be escalated to CS2 and tracked until resolved. Operating in a governance gap without escalation is a governance violation. | GAP analysis surfaces governance gaps. FM escalates gaps found during session work. | ❌ A governance gap is not a TODO or enhancement — it is an active deficiency that may block correct agent behavior and must be treated as a priority issue. |
| **layering down** | Verb / Process | The process of distributing governance artifacts (canons, templates, agent contracts, schemas) from the canonical governance repository to downstream consumer repositories. This is a **cross-repository** propagation mechanism that establishes governance alignment. Layering down is triggered when PUBLIC_API canon files are created or modified. | Governance Administrator layers down new canon files to all consumer repos. Layer-down creates issues in consumer repos for integration. | ❌ Do not confuse with _rippling_ (within-repo integration). Layering down is the cross-repo **distribution** of artifacts; rippling is the subsequent **integration** of those artifacts within the consumer repo. |
| **layering up** | Verb / Process | The reverse of layering down: the process of propagating learnings, proposals, governance improvements, and strategic feedback from consumer repositories back to the canonical governance repository. This enables bidirectional governance evolution grounded in real-world execution evidence. | Consumer repo governance-liaison creates layer-up issue with lessons learned. Governance Administrator validates and integrates the learning into canon. | ❌ Do not confuse with _escalation_ (blocking issue). Layer-up is a **learning and improvement** flow; escalation is an authority boundary breach requiring CS2 intervention. |
| **rippling** | Verb / Process | The process of integrating governance artifacts **within a single repository** to ensure consistency across all files, systems, agent contracts, templates, and references. Rippling executes after layering down to align the entire repository with newly received governance. Rippling may include contract alignment (rare), cross-reference updates, template synchronization, and LOCKED section synchronization. Rippling does NOT trigger cross-repo propagation. | After layering down ECOSYSTEM_VOCABULARY.md, the consumer repo ripples to update all agent contracts that reference it, synchronize templates, and update cross-references. | ❌ Do not confuse with _layering_ (cross-repo distribution). Rippling is **intra-repository** integration; layering is **inter-repository** propagation. Rippling completes the integration of layered artifacts locally. |

---

## Mode Reference Table

This table maps the above vocabulary to **agent operating modes** — specifically for the Foreman agent and any orchestrator agents.

| Mode Name | Trigger Verbs | Permitted Actions | Prohibited Actions | Authority Source |
|-----------|--------------|-------------------|-------------------|-----------------|
| **POLC-Orchestration** | orchestrate, plan, organize, lead, coordinate, delegate | Architecture design, Red QA creation, builder appointment, wave planning, supervision | Any implementation, code writing, direct file editing of functional code | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| **Implementation Guard** | implement, build, code, write, fix (when directed at FM) | Detect violation, reject task, delegate to builder, document reassignment | Writing any production code, schema, migration, or config | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| **Quality Professor** | review, evaluate, QA, assess, validate, audit | Evaluate builder output, produce quality verdict (PASS/FAIL), generate evidence, block merge on failure | Fixing defects found during review (that is implementation — delegate back to builder) | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md, EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md |

---

## Vocabulary Evolution Protocol

1. **Propose**: Open a GitHub issue with label `governance-vocabulary` and proposed term + definition.
2. **CS2 Review**: CS2 (Johan Ras) evaluates and approves or rejects the proposal.
3. **Update**: Governance Administrator adds the term to this table with SHA256-tracked commit.
4. **Ripple**: New entry is layered down to all consumer repositories via the standard ripple protocol.
5. **Reference**: Updated CANON_INVENTORY entry triggers alignment gate re-validation.

---

## References

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- `.github/agents/foreman-v2.agent.md` — Verb Classification Gate (Phase 1.5)
- `governance/CANON_INVENTORY.json` — This file's inventory entry
- `governance/CONSUMER_REPO_REGISTRY.json` — Ripple targets

---

**Authority**: CS2 (Johan Ras / APGI-cmy)  
**Version**: 1.1.0  
**Effective Date**: 2026-02-21  
**Layer-Down Status**: PUBLIC_API — layer down to all consumer repos mandatory  
**Last Updated**: 2026-02-21 (v1.1.0: Added layering down/up/rippling definitions)
