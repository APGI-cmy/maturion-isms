# ECOSYSTEM_VOCABULARY.md

**Version**: 1.0.0  
**Type**: Tier-2 Canon (Operational Canon)  
**Authority**: CS2 (Johan Ras / APGI-cmy) — CS2-Approved via issue "Formalize ECOSYSTEM_VOCABULARY.md & Adjust Foreman Agent Modalities"  
**Effective Date**: 2026-02-21  
**Layer-Down Status**: PUBLIC_API — Mandatory layer-down to all consumer repositories  
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
| **review** | Verb / Mode | To evaluate an artifact, work product, or output against defined standards, criteria, or acceptance criteria — without modifying the artifact. Reviewing is an **observational and assessment** activity. | Quality Professor mode performs review. FM reviews builder output against Red QA. | ❌ Do not confuse with _implement_ (review does not include fixing). |
| **evaluate** | Verb / Mode | To assess quality, correctness, alignment, or fitness of a system, artifact, process, or decision against governance standards or criteria. | FM evaluates whether a wave plan is architecturally sound. Quality Professor evaluates the overall quality verdict. | ❌ Evaluation produces a verdict, not code. |
| **quality assurance (QA)** | Noun / Mode | The systematic process of verifying that deliverables meet defined standards before handover or merge. QA is a distinct gate activity: it produces a binary verdict (PASS/FAIL) and evidence artifacts. QA is never conflated with implementation. | Red QA tests created by FM before builder execution. Quality Professor mode performs final QA verdict. | ❌ QA does not mean "testing" in isolation — it means the entire quality verification process. |
| **build** | Verb / Noun | As a verb: to construct a functional deliverable (code, schema, config) that satisfies defined acceptance criteria. Building is exclusively a **builder** responsibility. | Builders build. The FM specifies what to build (not how). | ❌ Do not equate "build" with "run a build command". |
| **100% build** | Standard | A build is complete only when ALL defined tests pass (100% GREEN), zero test debt exists, and all evidence artifacts are generated. A 99% build is an incomplete build. | The FM enforces 100% build before releasing any merge gate. | ❌ "Good enough" builds are not recognized. |
| **escalate** | Verb | To formally raise a decision, blocker, ambiguity, or governance gap to a higher authority (typically CS2) via a structured escalation document. Escalation is mandatory when an agent encounters a situation outside its authority. | FM escalates governance ambiguity to CS2. Builder escalates to FM when blocked. | ❌ Escalation halts work until resolved. |
| **canonize** | Verb | To formally promote a document, rule, or pattern into the canonical governance corpus with CS2 approval, a CANON_INVENTORY entry, SHA256 hash, and ripple to consumer repos. Only CS2 may authorize canonization. | Governance Administrator canonizes new documents after CS2 approval. | ❌ A file must be CS2-approved, inventoried, and layered down to be canon. |
| **fully functional** | Standard | A system, feature, or capability is fully functional when it: (1) satisfies all acceptance criteria, (2) passes all tests at 100% GREEN, (3) has no missing dependencies or stubs, (4) has complete evidence artifacts, and (5) is documented. | Handover/merge is only permitted when deliverables are fully functional. | ❌ "Works in happy path" does not equal fully functional. |
| **living agent** | Noun | An agent operating under the Living Agent System (LAS) framework — governed by a four-phase canonical contract, session memory, escalation protocols, and evidence-first operations. | All agents in the Maturion ecosystem are living agents when bound to LIVING_AGENT_SYSTEM.md. | ❌ A static script or simple prompt is not a living agent. |
| **wave** | Noun | A time-boxed, architecturally-bounded unit of work assigned to one or more builders under FM supervision. Each wave has a defined scope, Red QA suite, builder assignments, and a completion gate. | FM plans waves; builders execute within waves. | ❌ A wave is not a sprint — waves have strict entry/exit criteria and require FM sign-off. |
| **governance gap** | Noun | A missing, incomplete, ambiguous, or inconsistent governance artifact, rule, or process that leaves agents without clear guidance. Operating in a governance gap without escalation is a governance violation. | FM escalates gaps found during session work. | ❌ A governance gap is an active deficiency that must be treated as a priority issue. |

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
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` — Agent knowledge architecture

---

**Authority**: CS2 (Johan Ras / APGI-cmy)  
**Version**: 1.0.0  
**Effective Date**: 2026-02-21  
**Layer-Down Status**: PUBLIC_API — ripple to all consumer repos mandatory  
**Last Updated**: 2026-02-21
