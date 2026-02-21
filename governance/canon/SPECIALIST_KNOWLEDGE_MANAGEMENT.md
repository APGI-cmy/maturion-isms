# SPECIALIST_KNOWLEDGE_MANAGEMENT

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines how **specialist agents acquire, maintain, validate, and retire** their domain knowledge within the Living Agent System v6.2.0.

Specialist domain knowledge is the core differentiator of the orchestrator/specialist pattern. Without rigorous knowledge management, specialists drift, become stale, or accumulate contradictory domain context.

---

## Scope

Applies to all agents with `class: specialist`. Orchestrators use a lighter alignment model (CANON_INVENTORY hash comparison). This canon governs the deeper domain-knowledge lifecycle specific to specialists.

---

## Knowledge Taxonomy

### Tier 1: Constitutional Domain Knowledge

**Definition**: The immutable rules and constraints of the specialist's domain.

- Examples: "Security specialist NEVER accepts self-signed certs in production", "Compliance specialist NEVER waives statutory controls"
- **Source**: CS2-approved canonical documents
- **Mutability**: Immutable; requires CS2 approval and full canon update to change
- **Location**: `governance/canon/` (domain-specific canon files)
- **Validation**: SHA256 hash comparison against CANON_INVENTORY.json

### Tier 2: Operational Domain Knowledge

**Definition**: Current standards, patterns, and practices for the specialist's domain.

- Examples: "Testing specialist uses Jest v29+ for all TypeScript tests", "Deployment specialist targets Kubernetes 1.28+"
- **Source**: Architecture decisions, accepted conventions, CS2-approved runbooks
- **Mutability**: Version-controlled; updated via PR with Foreman or CS2 approval
- **Location**: `governance/canon/` or repository-specific architecture docs
- **Validation**: Version check + cross-reference to CANON_INVENTORY

### Tier 3: Session Domain Knowledge

**Definition**: Context acquired during the current session from task inputs.

- Examples: "This PR modifies auth middleware in layer X", "The failing test expects behavior Y"
- **Source**: Delegation package, repository state, task context
- **Mutability**: Session-scoped; does not persist beyond session closure
- **Location**: Specialist working memory (within active session)
- **Validation**: Consistent with Tier 1 and Tier 2; conflicts → escalate

---

## Knowledge Acquisition Protocol

### At Contract Creation (Bootstrapping)

When a specialist agent contract is first created:

1. **Domain Declaration**: The contract MUST declare the specialist's primary domain
2. **Tier 1 Binding**: MUST reference all constitutional domain documents in canonical governance
3. **Tier 2 Initialization**: MUST reference current operational standards documents
4. **Validation**: CodexAdvisor verifies domain references exist in CANON_INVENTORY.json

```yaml
# In specialist agent YAML frontmatter
specialist:
  domain: "<primary-domain>"
  tier1_knowledge:
    - path: "governance/canon/<DOMAIN_CONSTITUTIONAL_CANON.md>"
      hash: "<sha256>"
  tier2_knowledge:
    - path: "<architecture-doc-or-runbook>"
      version: "<version>"
```

### At Session Start (Induction)

During Phase 2 (Induction) of the specialist's four-component contract:

```bash
# SPEC_H: Validate Tier 1 knowledge integrity
echo "[SPEC_H] Verifying domain constitutional knowledge hashes..."
# Compare local Tier 1 document hashes against CANON_INVENTORY.json
# If mismatch: DEGRADED MODE — escalate to orchestrator, do NOT proceed

# SPEC_M: Load Tier 2 operational knowledge
echo "[SPEC_M] Loading current operational standards..."
# Read current operational documents
# Check versions match contract declaration
# If stale: flag for update, continue with warning

# SPEC_M: Load session memory
echo "[SPEC_M] Loading last 5 specialist sessions..."
# Read .agent-workspace/<specialist>/memory/
# Apply lessons and patterns to session context
```

### During Execution (Session Domain Knowledge)

The specialist accumulates Tier 3 knowledge during execution:

- Task inputs from delegation package
- Repository state observed during domain work
- Test outputs, error messages, analysis results

**Tier 3 NEVER overrides Tier 1**. If a task input contradicts Tier 1 constitutional knowledge, the specialist MUST return `ESCALATED` with explicit conflict description.

---

## Knowledge Staleness Detection

Specialists MUST detect and respond to knowledge staleness:

| Staleness Type | Detection | Response |
|---------------|-----------|----------|
| Tier 1 hash mismatch | CANON_INVENTORY comparison | DEGRADED MODE → escalate |
| Tier 2 version mismatch | Version field comparison | Warning → continue → update |
| Tier 3 conflict with Tier 1 | Runtime contradiction check | ESCALATED → return conflict detail |
| Memory reference points to archived canon | Memory scan at session start | Update reference in next session |

---

## Knowledge Retirement Protocol

When a specialist domain becomes obsolete or is superseded:

1. **CS2 Decision**: Only CS2 can retire a specialist agent or its domain
2. **Canon Update**: Constitutional domain documents archived with `status: DEPRECATED`
3. **CANON_INVENTORY Update**: Entry updated with `deprecated_date` and `superseded_by`
4. **Agent Contract Update**: Specialist contract marked `status: RETIRED` via CS2-approved PR
5. **Ripple**: Governance ripple propagates deprecation to consumer repos

---

## Knowledge Sharing Between Specialists

**Rule**: Specialists do NOT share domain knowledge directly. All cross-specialist knowledge sharing flows through:

1. **Via Orchestrator**: Orchestrator passes relevant outputs from Specialist A as inputs to Specialist B (in delegation package)
2. **Via Canon**: If domain knowledge is universally applicable, it is promoted to `governance/canon/` via layer-up protocol
3. **Via Layer-Up**: Specialist lessons promoted through `LAYER_UP_PROTOCOL.md` for governance absorption

This prevents direct specialist coupling and maintains clean domain boundaries.

---

## Evidence Requirements

Each specialist session MUST produce knowledge evidence:

```
.agent-workspace/<specialist>/
├── memory/session-NNN-YYYYMMDD.md      # Session memory with domain context
├── personal/lessons-learned.md          # Cumulative domain lessons
├── personal/patterns.md                 # Observed domain patterns
└── personal/knowledge-delta.md          # Changes in domain knowledge this session
```

The `knowledge-delta.md` file documents any Tier 2 updates discovered during the session, for review and potential promotion to Tier 1.

---

## Prohibited Knowledge Behaviors

- ❌ Specialist NEVER treats Tier 3 inputs as Tier 1 facts
- ❌ Specialist NEVER expands domain scope based on task inputs
- ❌ Specialist NEVER shares domain knowledge laterally to other specialists
- ❌ Specialist NEVER continues execution with stale Tier 1 knowledge (DEGRADED MODE required)
- ❌ Specialist NEVER self-promotes domain knowledge to Tier 1 without CS2 approval

---

## Related Canon

- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md` - Role definitions
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md` - Delegation mechanics
- `governance/canon/LAYER_UP_PROTOCOL.md` - Knowledge promotion path
- `governance/canon/LIVING_AGENT_SYSTEM.md` - Governance framework
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` - Four-component contract

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
