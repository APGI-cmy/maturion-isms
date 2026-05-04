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

### At Contract Creation (Bootstrapping)

When a new agent contract is created, the **Agent Creation Bundle** (see `AGENT_CREATION_BUNDLE_REQUIREMENTS.md`) MUST include:

1. **Tier 1 Binding**: Contract MUST reference all constitutional domain documents in `governance/canon/`
2. **Tier 2 Initialisation**: Contract MUST reference Tier 2 knowledge stubs created in `.agent-workspace/<agent>/knowledge/`
3. **YAML Frontmatter**: Specialist contracts MUST include `specialist.tier1_knowledge` and `specialist.tier2_knowledge` fields
4. **Validation**: CodexAdvisor verifies domain references exist in `CANON_INVENTORY.json`

```yaml
# Required in specialist YAML frontmatter
specialist:
  domain: "<primary-domain>"
  tier1_knowledge:
    - path: "governance/canon/<DOMAIN_CONSTITUTIONAL_CANON.md>"
      hash: "<sha256>"
  tier2_knowledge:
    - path: ".agent-workspace/<agent>/knowledge/domain-flag-index.md"
      version: "<version>"
    - path: ".agent-workspace/<agent>/knowledge/specialist-registry.md"
      version: "<version>"
```

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

### During Execution (Tier 3 Accumulation)

The agent accumulates Tier 3 knowledge during execution:
- Task inputs from delegation package
- Repository state observed during domain work
- Test outputs, error messages, analysis results

**Tier 3 NEVER overrides Tier 1.** If a task input contradicts Tier 1 knowledge, the agent MUST escalate.

---

## Knowledge Staleness Detection

| Staleness Type | Detection | Response |
|---------------|-----------|----------|
| Tier 1 hash mismatch | CANON_INVENTORY comparison | DEGRADED MODE → HALT, escalate |
| Tier 2 version mismatch | Version field comparison | Warning → continue → flag for update |
| Tier 3 conflict with Tier 1 | Runtime contradiction check | ESCALATED → return conflict detail |
| Memory reference points to archived canon | Memory scan at session start | Update reference in next session |

---

## Knowledge Storage Structure

```
.agent-workspace/<agent>/
├── knowledge/                           # Tier 2: Operational domain knowledge
│   ├── domain-flag-index.md            # Domain capability flags
│   ├── specialist-registry.md          # Known agents in domain
│   └── [additional-stubs].md           # Domain-specific operational knowledge
├── memory/                              # Session closure records (historical; Tier 3 is ephemeral)
│   ├── session-NNN-YYYYMMDD.md         # Per-session memory
│   └── .archive/                       # Archived sessions (>5 rotated here)
└── personal/
    ├── lessons-learned.md               # Cumulative domain lessons
    ├── patterns.md                      # Observed domain patterns
    └── knowledge-delta.md              # Tier 2 changes discovered this session
```

---

## Tier Interaction Rules

1. **Tier 1 is authoritative**: Constitutional rules cannot be overridden by any session input
2. **Tier 2 is operational context**: Guides execution; updatable via governed process
3. **Tier 3 is ephemeral**: Never promoted directly to Tier 1 without CS2 approval via `LAYER_UP_PROTOCOL.md`
4. **Tier 2 promotion path**: Tier 3 lessons → `knowledge-delta.md` → layer-up review → CS2 approval → Tier 2 update
5. **No lateral sharing**: Specialists do not share Tier 2 knowledge directly; all sharing via orchestrator or canon promotion

---

## Agent Class Applications

| Agent Class | Tier 1 Load | Tier 2 Load | Tier 3 Scope |
|-------------|-------------|-------------|--------------|
| **specialist** | Constitutional domain docs (SHA256 verified) | `.agent-workspace/<specialist>/knowledge/` stubs | Single-domain task context |
| **orchestrator** | Coordination canon (SHA256 verified) | Specialist registry from `AGENT_REGISTRY.json` | Multi-domain coordination context |
| **foreman** | FM governance canon (SHA256 verified) | Wave state, builder registry, pre-auth checklist | Wave/subwave context |
| **governance-admin** | `CANON_INVENTORY.json` + constitutional canon | Ripple state, consumer registry | Session-specific governance context |
| **assurance** | IAA canon (SHA256 verified) + `CANON_INVENTORY.json` | `governance/quality/agent-integrity/` reference index | PR-specific assurance context |

---

## Prohibited Knowledge Behaviors

- ❌ Agent NEVER treats Tier 3 inputs as Tier 1 facts
- ❌ Agent NEVER expands domain scope based on task inputs (Tier 3)
- ❌ Agent NEVER continues execution with stale Tier 1 knowledge (DEGRADED MODE required)
- ❌ Specialist NEVER shares Tier 2 knowledge laterally to other specialists
- ❌ Agent NEVER self-promotes Tier 3 knowledge to Tier 1 without CS2 approval
- ❌ Contract creation without Tier 2 stubs in `.agent-workspace/<agent>/knowledge/` is INCOMPLETE
- ❌ `assurance` class agent NEVER assures work performed by itself (independence requirement)

---

## Consumer Implementation References

This architecture was introduced and first implemented in:

- **APGI-cmy/maturion-isms#360** — Initial 3-tier knowledge architecture pattern (consumer implementation)
- **APGI-cmy/maturion-isms#362** — Specialist registry and domain flag index implementation
- **APGI-cmy/maturion-foreman-governance#361** — Governance canon alignment (this issue's PR)

These issues serve as the canonical reference for how consumer repositories implement this architecture in practice. New consumer implementations MUST follow the patterns established there.

---

## Related Canon

- `governance/canon/SPECIALIST_KNOWLEDGE_MANAGEMENT.md` — Specialist-specific knowledge lifecycle (extends this canon)
- `governance/canon/AGENT_CREATION_BUNDLE_REQUIREMENTS.md` — Required bundle for all new agents
- `governance/canon/PROXY_AUTHORITY_MODEL.md` — Authority delegation for agent creation
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` — Role definitions and class model
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` — Delegation mechanics
- `governance/canon/LAYER_UP_PROTOCOL.md` — Tier 2/3 knowledge promotion path
- `governance/canon/LIVING_AGENT_SYSTEM.md` — Governance framework v6.2.0
- `governance/canon/AIMC_STRATEGY.md` — Runtime application AI platform (embeddings capability for RAG/knowledge retrieval)
- `governance/CANON_INVENTORY.json` — Canonical governance inventory (Tier 1 validation source)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-21  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
