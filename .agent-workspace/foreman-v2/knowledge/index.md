# Foreman v2 — Tier 2 Knowledge Index

**Agent**: foreman-v2  
**Contract Version**: 2.5.0  
**Knowledge Version**: 1.6.0  
**Last Updated**: 2026-03-02  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

This directory contains operational domain knowledge (Tier 2) for the Foreman v2 agent.
See `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` for the full tier architecture specification.

### Files

| File | Purpose | Version |
|------|---------|---------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.2.0 |
| `FAIL-ONLY-ONCE.md` | **PREFLIGHT §1.3** — Breach registry, Universal A-rules (ISMS-local namespace A-001+), incident log, open improvements; must be self-attested every session before any work begins | 2.1.0 |
| `specialist-registry.md` | Registry of all delegable agents with capabilities and separation-of-duties boundary | 1.0.0 |
| `domain-flag-index.md` | Mode flags, orchestration pattern flags, degraded mode flags, domain boundaries | 1.0.0 |
| `prehandover-template.md` | **PHASE 4 §S-009** — PREHANDOVER proof template with mandatory IAA Agent Response (verbatim) section per FAIL-ONLY-ONCE v1.8.0 S-009 | 1.0.0 |

---

## Constitutional Canon References (Tier 1)

The following Tier 1 documents govern this agent's constitutional behavior (SHA256 verified at session start via `governance/CANON_INVENTORY.json`):

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md`
- `governance/canon/ECOSYSTEM_VOCABULARY.md` v1.1.0 — **Canonical verb/mode definitions**
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` v1.0.0
- `governance/canon/FM_MERGE_GATE_MANAGEMENT_PROTOCOL.md`
- `governance/canon/EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md`

---

## Operating Mode Summary

Per `governance/canon/ECOSYSTEM_VOCABULARY.md` Mode Reference Table:

| Mode | Trigger Verbs | Authority |
|------|--------------|-----------|
| POLC-Orchestration | orchestrate, plan, organize, lead, coordinate, delegate | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| Implementation Guard | implement, build, code, write, fix (directed at FM) | FOREMAN_AUTHORITY_AND_SUPERVISION_MODEL.md |
| Quality Professor | review, evaluate, QA, assess, validate, audit | EVIDENCE_ARTIFACT_BUNDLE_STANDARD.md |

Mode flags and activation states: see `domain-flag-index.md`

---

## Separation of Duties Quick Reference

Foreman NEVER executes directly. All operations delegated per `specialist-registry.md`:
- Implementation → builder agents
- Governance alignment → `governance-liaison-isms-agent`
- Agent file ops → `CodexAdvisor-agent` (CS2-gated)
- QA execution → `qa-builder`

---

## Vocabulary Reference

**Canonical source**: `governance/canon/ECOSYSTEM_VOCABULARY.md`  
**Alias**: `governance/canon/AGENT_TIER_ARCHITECTURE.md` → `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

All verb classification and mode-switching decisions MUST reference `ECOSYSTEM_VOCABULARY.md`.

---

**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0

---

## Differences from CodexAdvisor Layout

| Aspect | CodexAdvisor | Foreman v2 |
|---|---|---|
| Operating model | RAEC (Review/Advise/Escalate/Coordinate) | POLC (Plan/Organize/Lead/Check) |
| Phase 3 purpose | Agent contract creation & alignment | Wave orchestration & builder supervision |
| FAIL-ONLY-ONCE source | `memory/breach-registry.md` | `knowledge/FAIL-ONLY-ONCE.md` (Tier 2) |
| Quality Professor evaluates | Agent contract files (YAML, char count) | Builder code deliverables (tests, warnings) |
| OPOJD Gate checks | YAML validation, char count, checklist compliance | Test failures, warnings, evidence artifacts |
| Phase 4 output | Opens PR | Releases merge gate |
| Self-modification lock | SELF-MOD-001 (CodexAdvisor-agent.md) | SELF-MOD-FM-001 (foreman-v2-agent.md) |
| IAA oversight | Required for agent contract changes | IAA audits Foreman output independently. Foreman QAs builders; IAA QAs Foreman. Double-layer QA is intentional and required. |
| Phase 2 alignment | Per agent file job | Per wave start |

