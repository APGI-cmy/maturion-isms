# THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-21

---

## Purpose

Defines the **canonical 3-tier agent knowledge architecture** that governs how all agents within the Living Agent System v6.2.0 acquire, load, validate, and retire knowledge across three distinct tiers.

This canon establishes the structural and lifecycle requirements for agent knowledge, ensuring agents operate with correct, current, and constitutionally-sound information at all times. It formalises the pattern introduced in consumer repo implementations (APGI-cmy/maturion-isms#360, APGI-cmy/maturion-isms#362, APGI-cmy/maturion-foreman-governance#361).

---

## Problem Statement

As agents grow in specialisation and the platform scales across multiple repositories, knowledge management becomes a first-order governance concern:

- Agents that load stale or unverified knowledge produce incorrect outputs that appear valid
- No canonical definition of "what constitutes agent knowledge" makes validation impossible
- Tier boundaries are blurred: session context leaks into constitutional assumptions
- Contract templates did not require explicit Tier-2 declarations, leaving agents with implicit, undocumented operational knowledge
- Specialist agents with deep domain knowledge require a formalised structure distinct from orchestrators

## Solution: 3-Tier Knowledge Architecture

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│ TIER 1: CONSTITUTIONAL DOMAIN KNOWLEDGE                          │
│ ────────────────────────────────────────────────────────────────  │
│ • Immutable rules and constraints for the agent's domain         │
│ • Source: CS2-approved governance/canon/ documents               │
│ • Validated: SHA256 hash vs CANON_INVENTORY.json (GA_H gate)     │
│ • Mutable: Only via CS2 approval + full canon update             │
└──────────────────────────────────────────────────────────────────┘
                              ↓ informs
┌──────────────────────────────────────────────────────────────────┐
│ TIER 2: OPERATIONAL DOMAIN KNOWLEDGE                             │
│ ────────────────────────────────────────────────────────────────  │
│ • Current standards, patterns, and practices for the domain      │
│ • Source: Architecture decisions, runbooks, CS2-approved docs    │
│ • Location: .agent-workspace/<agent>/knowledge/                  │
│ • Validated: Version check + cross-reference to CANON_INVENTORY  │
│ • Mutable: Version-controlled; updated via PR with FM/CS2        │
└──────────────────────────────────────────────────────────────────┘
                              ↓ scopes
┌──────────────────────────────────────────────────────────────────┐
│ TIER 3: SESSION DOMAIN KNOWLEDGE                                 │
│ ────────────────────────────────────────────────────────────────  │
│ • Context acquired during the current session only               │
│ • Source: Delegation package, repository state, task context     │
│ • Location: Agent working memory (ephemeral; session-scoped)     │
│ • Validated: Must be consistent with Tier 1 and Tier 2           │
│ • Mutable: Session-scoped; does NOT persist beyond session close │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tier Definitions

### Tier 1: Constitutional Domain Knowledge

| Attribute | Value |
|-----------|-------|
| **Definition** | Immutable rules and constraints of the agent's domain |
| **Examples** | "Security specialist NEVER accepts self-signed certs in production", "Governance admin NEVER merges without CS2 approval" |
| **Source** | CS2-approved canonical documents |
| **Mutability** | Immutable; requires CS2 approval and full canon update |
| **Storage** | `governance/canon/` (domain-specific canon files) |
| **Validation** | SHA256 hash comparison against `governance/CANON_INVENTORY.json` |
| **Degraded Mode** | Hash mismatch → HALT, escalate to CS2 or orchestrator |

**Critical Invariant**: Tier 3 session inputs NEVER override Tier 1 constitutional knowledge. If a task contradicts Tier 1, the agent MUST return `ESCALATED` with explicit conflict description.

### Tier 2: Operational Domain Knowledge

| Attribute | Value |
|-----------|-------|
| **Definition** | Current standards, patterns, and practices for the domain |
| **Examples** | "Testing specialist uses Jest v29+ for TypeScript", "Deployment targets Kubernetes 1.28+", domain flag indices, specialist registry entries |
| **Source** | Architecture decisions, accepted conventions, CS2-approved runbooks |
| **Mutability** | Version-controlled; updated via PR with FM or CS2 approval |
| **Storage** | `.agent-workspace/<agent>/knowledge/` (primary) or `governance/canon/` for cross-domain standards |
| **Validation** | Version check + cross-reference to CANON_INVENTORY |
| **Staleness Response** | Flag for update, continue with warning; do NOT operate on stale Tier 1 |

**Tier 2 Required Files** (minimum at agent creation):

```
.agent-workspace/<agent>/knowledge/
├── index.md                    # Knowledge index (entry point)
├── domain-flag-index.md        # Domain capability flags and activation states
├── specialist-registry.md      # Known specialists and orchestrators for this domain
└── [domain-specific stubs]     # Domain-specific operational knowledge stubs
```

### Tier 3: Session Domain Knowledge

| Attribute | Value |
|-----------|-------|
| **Definition** | Context acquired during the current session from task inputs |
| **Examples** | "This PR modifies auth middleware in layer X", "The failing test expects Y" |
| **Source** | Delegation package, repository state, task context |
| **Mutability** | Session-scoped; does not persist beyond session closure |
| **Storage** | Agent working memory (within active session only) |
| **Validation** | Consistent with Tier 1 and Tier 2; conflicts → escalate |

---

## Knowledge Acquisition Protocol

### At Session Start (Induction — Phase 2)

```bash
# SPEC_H / ORC_H / GA_H: Validate Tier 1 knowledge integrity
echo "[TIER1] Verifying constitutional knowledge hashes..."
# Compare local Tier 1 document hashes against CANON_INVENTORY.json
# If mismatch: DEGRADED MODE — escalate, do NOT proceed

# SPEC_M / ORC_M / GA_M: Load Tier 2 operational knowledge
echo "[TIER2] Loading operational standards and domain knowledge..."
# Read .agent-workspace/<agent>/knowledge/ files
# Check versions match contract declaration
# If stale: flag for update, continue with warning

# SPEC_M / ORC_M: Load session memory (last 5 sessions)
echo "[TIER3] Loading session memory..."
# Read .agent-workspace/<agent>/memory/
# Apply lessons and patterns to session context
```

---

## Knowledge Staleness Detection

| Staleness Type | Detection | Response |
|---------------|-----------|----------|
| Tier 1 hash mismatch | CANON_INVENTORY comparison | DEGRADED MODE → HALT, escalate |
| Tier 2 version mismatch | Version field comparison | Warning → continue → flag for update |
| Tier 3 conflict with Tier 1 | Runtime contradiction check | ESCALATED → return conflict detail |

---

## Tier Interaction Rules

1. **Tier 1 is authoritative**: Constitutional rules cannot be overridden by any session input
2. **Tier 2 is operational context**: Guides execution; updatable via governed process
3. **Tier 3 is ephemeral**: Never promoted directly to Tier 1 without CS2 approval
4. **Tier 2 promotion path**: Tier 3 lessons → `knowledge-delta.md` → layer-up review → CS2 approval → Tier 2 update
5. **No lateral sharing**: Specialists do not share Tier 2 knowledge directly; all sharing via orchestrator or canon promotion

---

## Prohibited Knowledge Behaviors

- ❌ Agent NEVER treats Tier 3 inputs as Tier 1 facts
- ❌ Agent NEVER expands domain scope based on task inputs (Tier 3)
- ❌ Agent NEVER continues execution with stale Tier 1 knowledge (DEGRADED MODE required)
- ❌ Agent NEVER self-promotes Tier 3 knowledge to Tier 1 without CS2 approval
- ❌ Contract creation without Tier 2 stubs in `.agent-workspace/<agent>/knowledge/` is INCOMPLETE

---

## Related Canon

- `governance/canon/AGENT_TIER_ARCHITECTURE.md` — Alias/forward reference to this document
- `governance/canon/LIVING_AGENT_SYSTEM.md` — Governance framework v6.2.0
- `governance/CANON_INVENTORY.json` — Canonical governance inventory (Tier 1 validation source)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
