# Foreman v2 — Domain Flag Index (Tier 2 Operational Knowledge)

**Agent**: foreman-v2  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Purpose

This index maps capability flags and activation states for Foreman v2 orchestration modes. Flags are set during the Verb Classification Gate (Section 1.4 of contract) and guide which orchestration pattern activates.

---

## Mode Flags

| Flag | Default State | Activation Condition | Contract Section |
|------|--------------|---------------------|-----------------|
| `FM_MODE_POLC_ORCHESTRATION` | ACTIVE (default) | Task verb: orchestrate, plan, organize, lead, coordinate, delegate | 1.5 Mode 1 |
| `FM_MODE_IMPLEMENTATION_GUARD` | INACTIVE | Task verb: implement, build, code, write, fix (directed at FM) | 1.5 Mode 2 |
| `FM_MODE_QUALITY_PROFESSOR` | INACTIVE | Task verb: review, evaluate, QA, assess, validate, audit | 1.5 Mode 3 |
| `FM_SEPARATION_VIOLATION_DETECTED` | INACTIVE | FM attempts direct implementation or governance edit | 1.6 |

**Flag Invariant**: Only ONE operating mode may be ACTIVE at a time. Mode transitions are recorded in session memory.

---

## Orchestration Pattern Flags

| Flag | Activation Condition | Pattern Docs |
|------|---------------------|-------------|
| `FM_PATTERN_PARALLEL` | Multiple independent tasks in one invocation | Contract Section 3.4 |
| `FM_PATTERN_SEQUENTIAL` | Task B depends on Task A's output | Contract Section 3.4 |
| `FM_PATTERN_CHAINED` | Agent A's output is Agent B's input package | Contract Section 3.4 |

---

## Degraded Mode Flags

| Flag | Activation Condition | Action |
|------|---------------------|--------|
| `FM_DEGRADED_NO_CANON_INVENTORY` | `governance/CANON_INVENTORY.json` missing or invalid | HALT, escalate to CS2 |
| `FM_DEGRADED_NO_ECOSYSTEM_VOCABULARY` | `governance/canon/ECOSYSTEM_VOCABULARY.md` absent | HALT, cannot execute Verb Classification Gate |
| `FM_DEGRADED_NO_TIER2_KNOWLEDGE` | This knowledge directory is missing required files | Log warning, proceed with base contract only |
| `FM_OPOJD_GATE_BLOCKED` | Non-zero test failures, skips, warnings, or deprecations detected at handover | STOP — fix all OPOJD violations before proceeding to Phase 4 |

---

## Domain Capability Boundaries

Foreman v2 operates within these domain boundaries. Tasks OUTSIDE these boundaries are delegated:

| In Scope (FM Orchestrates) | Out of Scope (Delegate) |
|---------------------------|------------------------|
| Wave planning and architecture design | Code implementation |
| Red QA suite creation (specification, not execution) | Test execution |
| Builder appointment and task delegation | Governance canon edits |
| Merge gate management | Agent file modifications |
| Quality Professor verdict (PASS/FAIL) | Audit report writing |
| Escalation to CS2 | Risk scoring |

---

**Authority**: CS2 (Johan Ras) | **Living Agent System**: v6.2.0  
**Referenced By**: `foreman-v2.agent.md` Sections 1.4, 1.5, 1.6
