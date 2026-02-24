# governance-liaison-isms — Tier 2 Knowledge Index

**Agent**: governance-liaison-isms  
**Contract Version**: 3.0.0  
**Knowledge Version**: 1.0.0  
**Last Updated**: 2026-02-24  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

This directory contains operational domain knowledge (Tier 2) for the governance-liaison-isms agent.
See `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` for the full tier architecture specification.

### Files

| File | Purpose | Version |
|------|---------|---------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.0.0 |
| `FAIL-ONLY-ONCE.md` | **PREFLIGHT Attestation** — Breach registry, Universal A-rules, Conditional B-rules, incident log; must be self-attested every session before any work begins | 1.0.0 |

---

## Constitutional Canon References (Tier 1)

The following Tier 1 documents govern this agent's constitutional behavior (SHA256 verified at session start via `governance/CANON_INVENTORY.json`):

- `governance/canon/LIVING_AGENT_SYSTEM.md` v6.2.0
- `governance/canon/AGENT_CONTRACT_ARCHITECTURE.md` v1.0.0
- `governance/canon/AGENT_PREFLIGHT_PATTERN.md` v1.0.0
- `governance/canon/AGENT_INDUCTION_PROTOCOL.md` v1.0.0
- `governance/canon/AGENT_HANDOVER_AUTOMATION.md` v1.0.0
- `governance/canon/CROSS_REPOSITORY_LAYER_DOWN_PROTOCOL.md`
- `governance/canon/CROSS_REPO_RIPPLE_TRANSPORT_PROTOCOL.md`
- `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` v1.0.0
- `governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md` v1.0.0

---

## Operating Mode Summary

governance-liaison-isms operates in RAEC pattern:
- **R**eview → validate ripple event, verify sender in registry, check CANON_INVENTORY
- **A**dvise → identify files requiring layer-down, determine constitutional change risk
- **E**scalate → block and escalate if constitutional change, SHA256 mismatch, or unlisted sender detected
- **C**oordinate → create alignment PR, update sync_state.json, archive ripple event, create session memory

**Non-delegable responsibilities**: governance alignment verification, ripple event processing, layer-down execution with SHA256 validation, drift detection and remediation, session memory and evidence preservation.

---

## Separation of Duties Quick Reference

governance-liaison-isms NEVER executes directly for:
- Production code → escalate to Foreman for builder delegation
- Agent contract modifications → escalate to CS2 (CodexAdvisor-agent)
- Canonical governance authoring → consumer mode only (receive, never author)

---

**Authority**: CS2 (Johan Ras)  
**Living Agent System**: v6.2.0  
**Policy**: `governance/canon/UNIVERSAL_FAIL_ONLY_ONCE_POLICY.md`
