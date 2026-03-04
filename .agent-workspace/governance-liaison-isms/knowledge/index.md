# governance-liaison-isms — Tier 2 Knowledge Index

**Agent**: governance-liaison-isms  
**Contract Version**: 3.2.0  
**Knowledge Version**: 1.5.0  
**Last Updated**: 2026-03-04  
**Architecture**: `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md`

---

## Tier 2 Knowledge Contents

This directory contains operational domain knowledge (Tier 2) for the governance-liaison-isms agent.
See `governance/canon/THREE_TIER_AGENT_KNOWLEDGE_ARCHITECTURE.md` for the full tier architecture specification.

### Files

| File | Purpose | Version |
|------|---------|---------|
| `index.md` (this file) | Knowledge entry point and version reference | 1.5.0 |
| `FAIL-ONLY-ONCE.md` | **PREFLIGHT Attestation** — Breach registry, Universal A-rules, Conditional B-rules, incident log; must be self-attested every session before any work begins | 1.4.0 |
| `layer-down-scripts.md` | **Phase 3.1 Scripts** — Checksum validation and sync state update scripts for the cross-repository layer-down protocol; full 7-step protocol | 1.1.0 |
| `ripple-processing-scripts.md` | **Phase 3.2 Scripts** — Ripple inbox creation, sync state update on receipt, and ripple archive scripts; full 5-step protocol | 1.1.0 |
| `drift-detection-scripts.md` | **Phase 3.3 Scripts** — Drift detection script; compares canonical inventory version against local sync state | 1.0.0 |
| `session-memory-template.md` | **Phase 4.2 Template** — Session memory and escalation templates for use in Phase 4 session closure | 1.1.0 |

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

---

## Version History

| Version | Date | Author | Change Description |
|---------|------|--------|--------------------|
| 1.0.0 | 2026-02-25 | governance-liaison-isms | Initial knowledge index — 6 knowledge files listed |
| 1.1.0 | 2026-02-25 | governance-liaison-isms | Updated FAIL-ONLY-ONCE.md version reference to 1.1.0 |
| 1.2.0 | 2026-03-03 | governance-liaison-isms (session-039) | Updated FAIL-ONLY-ONCE.md to v1.2.0; updated session-memory-template.md to v1.1.0; updated index self-reference to v1.2.0 |
| 1.3.0 | 2026-03-03 | governance-liaison-isms (session-039, IAA-107 fix) | Updated FAIL-ONLY-ONCE.md to v1.3.0 (A-011 added); updated index self-reference to v1.3.0 |
| 1.4.0 | 2026-03-03 | governance-liaison-isms (session-041, RCA) | Updated FAIL-ONLY-ONCE.md to v1.4.0 (A-013, A-014 added; breach log entries §4.3-SKIP and IAA-SKIP recorded); updated index self-reference to v1.4.0 |
| 1.5.0 | 2026-03-04 | CodexAdvisor-agent (session-045) | layer-down-scripts.md → v1.1.0 (7-step protocol migrated from contract §3.1); ripple-processing-scripts.md → v1.1.0 (5-step protocol migrated from §3.2) |
