# SPECIALIST_KNOWLEDGE_MANAGEMENT

**Status**: CANONICAL | **Version**: 1.0.0 | **Authority**: CS2  
**Date**: 2026-02-20

---

## Purpose

Defines how **specialist agents acquire, maintain, validate, and retire** their domain knowledge within the Living Agent System v6.2.0.

---

## Scope

Applies to all agents with `class: specialist`. Orchestrators use a lighter alignment model (CANON_INVENTORY hash comparison). This canon governs the deeper domain-knowledge lifecycle specific to specialists.

---

## Knowledge Taxonomy

### Tier 1: Constitutional Domain Knowledge

- **Definition**: Immutable rules and constraints of the specialist's domain
- **Source**: CS2-approved canonical documents
- **Mutability**: Immutable; requires CS2 approval and full canon update to change
- **Validation**: SHA256 hash comparison against CANON_INVENTORY.json

### Tier 2: Operational Domain Knowledge

- **Definition**: Current standards, patterns, and practices for the specialist's domain
- **Source**: Architecture decisions, accepted conventions, CS2-approved runbooks
- **Mutability**: Version-controlled; updated via PR with Foreman or CS2 approval
- **Validation**: Version check + cross-reference to CANON_INVENTORY

### Tier 3: Session Domain Knowledge

- **Definition**: Context acquired during the current session from task inputs
- **Mutability**: Session-scoped; does not persist beyond session closure
- **Validation**: Consistent with Tier 1 and Tier 2; conflicts → escalate

---

## Knowledge Acquisition Protocol

### At Contract Creation (Bootstrapping)

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

```bash
# SPEC_H: Validate Tier 1 knowledge integrity
echo "[SPEC_H] Verifying domain constitutional knowledge hashes..."
# Compare hashes against CANON_INVENTORY.json
# If mismatch: DEGRADED MODE — escalate, do NOT proceed

# SPEC_M: Load Tier 2 operational knowledge
echo "[SPEC_M] Loading current operational standards..."

# SPEC_M: Load session memory
echo "[SPEC_M] Loading last 5 specialist sessions..."
```

---

## Knowledge Staleness Detection

| Staleness Type | Detection | Response |
|---------------|-----------|----------|
| Tier 1 hash mismatch | CANON_INVENTORY comparison | DEGRADED MODE → escalate |
| Tier 2 version mismatch | Version field comparison | Warning → continue → update |
| Tier 3 conflict with Tier 1 | Runtime contradiction check | ESCALATED → return conflict detail |

---

## Knowledge Sharing Between Specialists

Specialists do NOT share domain knowledge directly. All cross-specialist knowledge sharing flows through:
1. **Via Orchestrator**: orchestrator passes outputs from Specialist A as inputs to Specialist B
2. **Via Canon**: universally applicable knowledge promoted to `governance/canon/` via layer-up protocol

---

## Prohibited Knowledge Behaviors

- ❌ Specialist NEVER treats Tier 3 inputs as Tier 1 facts
- ❌ Specialist NEVER expands domain scope based on task inputs
- ❌ Specialist NEVER shares domain knowledge laterally to other specialists
- ❌ Specialist NEVER continues execution with stale Tier 1 knowledge (DEGRADED MODE required)

---

## Related Canon

- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`
- `governance/canon/ORCHESTRATOR_SPECIALIST_ARCHITECTURE.md`
- `governance/canon/AGENT_DELEGATION_PROTOCOL.md`
- `governance/canon/LIVING_AGENT_SYSTEM.md`

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-20  
**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0
